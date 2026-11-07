// MOTION DESIGN STUDIO · exportar
// Renderiza o HTML montado quadro a quadro (determinístico) e mixa narração, música e efeitos.
// Uso: node studio/ferramentas/exportar.js projetos/<nome> [--escala 0.5] [--de 0 --ate 10] [--sem-efeitos] [--sem-musica] [--trilhas]
//   --sem-efeitos  vídeo só com narração (base para sfx_real.py: os efeitos reais entram numa faixa separada)
//   --sem-musica   ignora a música de projeto.json (regra do canal: sem música de fundo)
//   --trilhas      também salva saida/trilhas/narracao.wav e efeitos.wav (faixas separadas, sem normalização)
// Saída: projetos/<nome>/saida/<nome>.mp4  (H.264 + AAC 48 kHz, -14 LUFS, faststart)
// Requer: Playwright com Chromium (pré-instalado no ambiente) e ffmpeg.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
(async () => {
  const proj = path.resolve(process.argv[2] || ''), nome = path.basename(proj);
  const html = path.join(proj, 'saida', nome + '.html');
  if (!fs.existsSync(html)) { console.error('rode antes: python3 studio/ferramentas/montar.py ' + process.argv[2]); process.exit(1); }
  const cfg = JSON.parse(fs.readFileSync(path.join(proj, 'projeto.json'), 'utf8'));
  const FPS = cfg.fps || 30, DUR = cfg.duracao, ESC = +arg('--escala', 1);
  const DE = +arg('--de', 0), ATE = Math.min(DUR, +arg('--ate', DUR));
  const W = Math.round(1080 * ESC / 2) * 2, H = Math.round(1920 * ESC / 2) * 2;
  const SEM_FX = process.argv.includes('--sem-efeitos'), TRILHAS = process.argv.includes('--trilhas');
  const OUT = path.join(proj, 'saida', nome + (SEM_FX ? '-voz' : '') + (ESC !== 1 || DE > 0 || ATE < DUR ? '-rascunho' : '') + '.mp4');
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mds-'));

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const erros = []; p.on('pageerror', e => erros.push(e.message));
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__pronto || window.__erro, null, { timeout: 30000 });
  const erro = await p.evaluate(() => window.__erro); if (erro) { console.error(erro); process.exit(1); }
  const efeitos = SEM_FX ? '' : await p.evaluate(() => MDS.SFX.length ? MDS.audio.renderEfeitos(48000) : '');
  if (efeitos) fs.writeFileSync(path.join(TMP, 'efeitos.raw'), Buffer.from(efeitos, 'base64'));
  await p.evaluate(e => { const s = document.getElementById('stage'); document.body.appendChild(s);
    s.style.cssText += `;position:fixed;left:0;top:0;z-index:9999;transform:scale(${e})`; }, ESC);

  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', ESC < 1 ? 'veryfast' : 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(TMP, 'video.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n0 = Math.round(DE * FPS), n1 = Math.round(ATE * FPS);
  for (let i = n0; i < n1; i++) {
    await p.evaluate(t => window.__seek(t), i / FPS);
    const img = await p.screenshot({ type: 'jpeg', quality: 94, clip: { x: 0, y: 0, width: W, height: H } });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - n0) % (FPS * 5) === 0) process.stdout.write(`${(i / FPS).toFixed(0)}s `);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  if (erros.length) console.warn('\nerros na página:\n' + erros.join('\n'));

  // ---- mixagem: 3 canais com volumes independentes ----
  const A = cfg.audio || {}, V = Object.assign({ narracao: 1, musica: .3, efeitos: .5 }, A.volumes || {});
  const narr = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'].map(e => path.join(proj, 'narracao' + e)).find(fs.existsSync);
  const mus = !process.argv.includes('--sem-musica') && A.musica && A.musica.arquivo ? path.join(proj, A.musica.arquivo) : null;
  const ins = ['-i', path.join(TMP, 'video.mp4')], fil = [], mixar = [];
  let k = 1;
  if (narr) { ins.push('-i', narr); fil.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${V.narracao},apad,atrim=0:${DUR}[vo]`); k++; }
  if (mus) {
    const m = A.musica, ini = m.inicio || 0, fi = m.fadeIn ?? .6, fo = m.fadeOut ?? 1.5, red = (A.ducking && A.ducking.reducao) ?? .4;
    ins.push('-ss', String(m.corte || 0), '-i', mus);
    fil.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${V.musica},afade=t=in:d=${fi},adelay=${Math.round(ini * 1000)}:all=1,apad,atrim=0:${DUR},afade=t=out:st=${DUR - fo}:d=${fo}[m0]`); k++;
    if (narr && !(A.ducking && A.ducking.ativo === false)) {
      fil[0] = fil[0].replace('[vo]', ',asplit=2[vo][vok]');
      fil.push(`[m0][vok]sidechaincompress=threshold=0.02:ratio=${Math.min(20, 1 / Math.max(red, .05) * 2).toFixed(1)}:attack=40:release=450:makeup=1[mu]`);
    } else fil.push('[m0]anull[mu]');
    mixar.push('[mu]');
  }
  if (narr) mixar.unshift('[vo]');
  if (efeitos) { ins.push('-f', 's16le', '-ar', '48000', '-ac', '1', '-i', path.join(TMP, 'efeitos.raw')); fil.push(`[${k}:a]aformat=channel_layouts=stereo,volume=${V.efeitos},apad,atrim=0:${DUR}[fx]`); mixar.push('[fx]'); k++; }
  const args = ['-v', 'error', '-y', ...ins];
  if (mixar.length) {
    fil.push(`${mixar.join('')}amix=inputs=${mixar.length}:duration=longest:normalize=0,atrim=${DE}:${ATE},asetpts=N/SR/TB,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[a]`);
    args.push('-filter_complex', fil.join(';'), '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000');
  } else args.push('-map', '0:v');
  args.push('-c:v', 'copy', '-movflags', '+faststart', '-t', String(ATE - DE), OUT);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  if (TRILHAS) {   // faixas separadas para conferência ou edição externa
    const TD = path.join(proj, 'saida', 'trilhas'); fs.mkdirSync(TD, { recursive: true });
    if (narr) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', narr, '-af', `apad,atrim=0:${DUR}`, '-ar', '48000', path.join(TD, 'narracao.wav')]);
    if (efeitos) execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 's16le', '-ar', '48000', '-ac', '1', '-i', path.join(TMP, 'efeitos.raw'), '-af', `volume=${V.efeitos}`, path.join(TD, 'efeitos.wav')]);
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`\nok ${OUT}`);
})().catch(e => { console.error(e); process.exit(1); });
