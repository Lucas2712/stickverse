// MOTION DESIGN STUDIO · revisar
// 1. Folhas de quadros: uma por cena (8 quadros) + uma por transição (10 quadros em ~0,7 s).
// 2. Checagens automáticas a cada 0,1 s em todo texto visível:
//    - CORTADO: texto passa da borda do quadro ou é recortado por um contêiner (overflow)
//    - ZONA SEGURA: texto sob a interface do Reels/TikTok (topo 220 px, base 340 px, direita 130 px abaixo de y=1000)
//    - SOBREPOSIÇÃO: dois textos visíveis ocupando o mesmo espaço
// Uso: node studio/ferramentas/revisar.js projetos/<nome>
// Saída: projetos/<nome>/saida/revisao/ (PNGs + relatorio.md)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

(async () => {
  const proj = path.resolve(process.argv[2] || ''), nome = path.basename(proj);
  const html = path.join(proj, 'saida', nome + '.html'), OUT = path.join(proj, 'saida', 'revisao');
  if (!fs.existsSync(html)) { console.error('rode antes: python3 studio/ferramentas/montar.py ' + process.argv[2]); process.exit(1); }
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'q'), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const erros = []; p.on('pageerror', e => erros.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') erros.push(m.text()); });
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__pronto || window.__erro, null, { timeout: 30000 });
  await p.evaluate(() => { const s = document.getElementById('stage'); document.body.appendChild(s); s.style.cssText += ';position:fixed;left:0;top:0;z-index:9999;transform:scale(.25)'; });
  const info = await p.evaluate(() => ({ dur: MDS.DUR, cenas: MDS.CENAS.map(c => ({ id: c.id, nome: c.nome, inicio: c.inicio, fim: c.fim })) }));

  // ---- folhas de quadros ----
  const quadro = async (t, arq) => { await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: arq, clip: { x: 0, y: 0, width: 270, height: 480 } }); };
  const folha = (arqs, saida, cols, rotulos) => {
    const lista = path.join(OUT, 'q', 'lista.txt');
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...arqs.flatMap(a => ['-i', a]), '-filter_complex',
      arqs.map((_, i) => `[${i}:v]drawtext=text='${rotulos[i]}':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`).join(';') + ';' +
      arqs.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${arqs.length}:layout=${arqs.map((_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * 480}`).join('|')}:fill=black`, saida]);
  };
  let n = 0;
  for (const [ci, c] of info.cenas.entries()) {
    const ts = Array.from({ length: 8 }, (_, i) => c.inicio + (c.fim - c.inicio) * (i + .5) / 8), arqs = [];
    for (const t of ts) { const a = path.join(OUT, 'q', `${n++}.png`); await quadro(t, a); arqs.push(a); }
    folha(arqs, path.join(OUT, `cena-${String(ci + 1).padStart(2, '0')}-${c.id}.png`), 4, ts.map(t => t.toFixed(2) + 's'));
    if (ci < info.cenas.length - 1) {
      const x = c.fim, tr = Array.from({ length: 10 }, (_, i) => Math.max(0, x - .35 + i * .08)), aq = [];
      for (const t of tr) { const a = path.join(OUT, 'q', `${n++}.png`); await quadro(t, a); aq.push(a); }
      folha(aq, path.join(OUT, `transicao-${String(ci + 1).padStart(2, '0')}-${String(ci + 2).padStart(2, '0')}.png`), 5, tr.map(t => t.toFixed(2) + 's'));
    }
  }

  // ---- checagens automáticas ----
  const achados = await p.evaluate(dur => {
    const st = document.getElementById('stage'), K = 4, res = [];
    const SAFE = { top: 220, bottom: 1920 - 340, right: 1080 - 130, rightDesde: 1000 };   // botões do Reels/TikTok: lado direito, metade de baixo
    const visivel = el => { for (let e = el; e && e !== st; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .35) return false; } return true; };
    const emBlur = e => { for (let x = e; x && x !== st; x = x.parentElement) { const f = x.style.filter; if (f && f !== 'none') return true; } return false; };
    // retângulo do TEXTO (não da caixa), em px do palco
    const rectTexto = e => { let r = null; for (const n of e.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { const g = document.createRange(); g.selectNodeContents(n); const q = g.getBoundingClientRect();
        r = r ? { l: Math.min(r.l, q.left), t: Math.min(r.t, q.top), r: Math.max(r.r, q.right), b: Math.max(r.b, q.bottom) } : { l: q.left, t: q.top, r: q.right, b: q.bottom }; }
      if (!r) return null; const hh = (r.b - r.t) * .2;   // a caixa da fonte é mais alta que as letras: mede só a faixa visível
      return { l: r.l * K, t: (r.t + hh) * K, r: r.r * K, b: (r.b - hh) * K }; };
    const caixa = e => { const q = e.getBoundingClientRect(); return { l: q.left * K, t: q.top * K, r: q.right * K, b: q.bottom * K }; };
    const inter = (a, c) => ({ l: Math.max(a.l, c.l), t: Math.max(a.t, c.t), r: Math.min(a.r, c.r), b: Math.min(a.b, c.b) });
    const area = a => Math.max(0, a.r - a.l) * Math.max(0, a.b - a.t);
    const QUADRO = { l: 0, t: 0, r: 1080, b: 1920 };
    let antes = new Map();
    for (let t = 0; t <= dur; t += .1) {
      window.__seek(t);
      const agora = new Map(), vis = [];
      for (const e of st.querySelectorAll('*')) {
        if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || !visivel(e)) continue;
        const r = rectTexto(e); if (!r || area(r) < 9) continue;
        agora.set(e, r);
        // recorte pelos contêineres com overflow (máscaras incluídas)
        let v = r, cortadoPor = null;
        for (let x = e.parentElement; x && x !== st; x = x.parentElement) {
          if (getComputedStyle(x).overflow === 'visible') continue;
          const q = caixa(x), v2 = inter(v, q);
          if (area(v2) < area(v) - 4 && !x.classList.contains('mask')) cortadoPor = cortadoPor || x;
          v = v2;
        }
        if (area(v) < 9) continue;                       // totalmente escondido (ex.: palavra ainda na máscara)
        const vq = inter(v, QUADRO); if (area(vq) < 9) continue;   // totalmente fora do quadro
        const ant = antes.get(e), mexendo = ant && (Math.abs(ant.l - r.l) > 3 || Math.abs(ant.t - r.t) > 3);
        const txt = e.textContent.trim().slice(0, 40);
        if (!mexendo && !emBlur(e)) {
          if (area(vq) < area(v) - 4) res.push({ tipo: 'CORTADO (borda do quadro)', txt, t });
          else if (cortadoPor) res.push({ tipo: 'CORTADO (contêiner)', txt, t });
          else if (v.t < SAFE.top || v.b > SAFE.bottom || (v.r > SAFE.right && v.b > SAFE.rightDesde)) res.push({ tipo: 'ZONA SEGURA', txt, t });
        }
        vis.push({ e, v: vq, parado: !mexendo && !emBlur(e) });
      }
      for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
        const A = vis[i], B = vis[j]; if (!A.parado || !B.parado || A.e.contains(B.e) || B.e.contains(A.e)) continue;
        const x = inter(A.v, B.v); if (area(x) > 16 && area(x) > .15 * Math.min(area(A.v), area(B.v)))
          res.push({ tipo: 'SOBREPOSIÇÃO', txt: `«${A.e.textContent.trim().slice(0, 24)}» × «${B.e.textContent.trim().slice(0, 24)}»`, t });
      }
      antes = agora;
    }
    return res;
  }, info.dur);
  await b.close();

  // agrupa por problema e intervalo de tempo
  const grupos = new Map();
  for (const a of achados) { const k = a.tipo + '|' + a.txt; const g = grupos.get(k) || { ...a, de: a.t, ate: a.t, n: 0 }; g.ate = Math.max(g.ate, a.t); g.n++; grupos.set(k, g); }
  const lista = [...grupos.values()].filter(g => g.n >= 2).sort((a, b) => a.de - b.de);   // ignora quadros isolados de transição
  const cenaDe = t => (info.cenas.find(c => t >= c.inicio && t < c.fim) || info.cenas[info.cenas.length - 1]).nome;
  let md = `# Revisão: ${nome}\n\nDuração ${info.dur} s · ${info.cenas.length} cenas · checagens a cada 0,1 s\n\n`;
  md += `## Problemas encontrados: ${lista.length}\n\n` + (lista.length ? '| tipo | texto | de | até | cena |\n|---|---|---|---|---|\n' + lista.map(g => `| ${g.tipo} | ${g.txt.replace(/\|/g, '/')} | ${g.de.toFixed(1)} | ${g.ate.toFixed(1)} | ${cenaDe(g.de)} |`).join('\n') : 'Nenhum.') + '\n\n';
  md += `## Erros e avisos da página\n\n${erros.length ? [...new Set(erros)].map(e => '- ' + e).join('\n') : 'Nenhum.'}\n\n## Folhas de quadros\n\n` + fs.readdirSync(OUT).filter(f => f.endsWith('.png')).map(f => `- ${f}`).join('\n') + '\n';
  fs.writeFileSync(path.join(OUT, 'relatorio.md'), md);
  fs.rmSync(path.join(OUT, 'q'), { recursive: true, force: true });
  console.log(md.split('## Folhas')[0]);
})().catch(e => { console.error(e); process.exit(1); });
