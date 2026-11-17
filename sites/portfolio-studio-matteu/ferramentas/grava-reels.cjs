// Grava o site rodando em 9:16 (414×736 pontos, 1080×1920 px) com o screencast do Chromium: cada quadro vem com o
// instante em que foi desenhado, e o ffmpeg depois monta um MP4 a 30 fps respeitando esses instantes.
// Uso (com `npm run build` e `npx vite preview --port 5301` rodando):
//   LW=810 LH=1440 Q=88 node ferramentas/grava-reels.cjs <pasta-dos-quadros> 1 "$PWD/ferramentas/moldura-reels.html"
// A moldura tem 810×1440 com o site (414×736, layout de celular) ampliado dentro; em 1080×1920 o Chromium desenha
// ~20 quadros/s, em 810×1440 ~38. Depois: ffmpeg -f concat -safe 0 -i <pasta>/lista.txt -f lavfi -i anullsrc=r=48000:cl=stereo
//   -vf "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -crf 17 -c:a aac -shortest -movflags +faststart saida/reels.mp4
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [,, pasta, escala = '2.6087'] = process.argv;
  fs.mkdirSync(pasta, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: Number(process.env.LW || 1080), height: Number(process.env.LH || 1920) }, deviceScaleFactor: 1, hasTouch: true });
  // câmera lenta (opcional): K=0.5 grava o site na metade da velocidade, para o vídeo final sair a 60 fps
  const K = Number(process.env.K || 1);
  if (K !== 1) await ctx.addInitScript({ content: `window.__CAMERA_LENTA__ = ${K};\n` + fs.readFileSync(path.join(__dirname, 'camera-lenta.js'), 'utf8') });
  const p = await ctx.newPage();
  const espera = (ms) => p.waitForTimeout(ms / K);
  const cdp = await ctx.newCDPSession(p);
  const quadros = [];
  let gravando = false;
  cdp.on('Page.screencastFrame', async (f) => {
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
    if (!gravando) return;
    const n = quadros.length;
    const arq = path.join(pasta, `q${String(n).padStart(5, '0')}.jpg`);
    fs.writeFileSync(arq, Buffer.from(f.data, 'base64'));
    quadros.push({ arq, t: f.metadata.timestamp });
  });
  // a moldura abre vazia (fundo da página), a gravação começa e só então o site carrega dentro dela: a abertura
  // com o símbolo entra inteira no vídeo
  await p.goto('file://' + process.argv[4], { waitUntil: 'load' });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: Number(process.env.Q || 92), maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  gravando = true;
  await p.waitForTimeout(400);
  await p.evaluate(() => { document.getElementById('site').src = 'http://localhost:5301/'; });
  let site = null;
  for (let i = 0; i < 100 && !site; i++) { await p.waitForTimeout(100); site = p.frames().find((f) => f.url().startsWith('http://localhost:5301')); }
  await site.waitForSelector('.barra__tour', { state: 'attached', timeout: 15000 });
  const t0 = Date.now();
  // abertura: os cursores rodeiam o símbolo; o Tour é ligado logo no começo (ele espera a abertura terminar)
  // espera a primeira tela do hero ficar pronta (foto, PORTFÓLIO, nome) e mais um respiro, e só então liga o Tour
  for (let i = 0; i < 120; i++) {
    await espera(200);
    const pronta = await site.evaluate(() => [...document.querySelectorAll('.hero__a [data-camada]')].filter((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.top < innerHeight; }).every((e) => e.classList.contains('c-pronta')) && !document.querySelector('.enx-logo'));
    if (pronta) break;
  }
  await espera(1200);
  await site.evaluate(() => document.querySelector('.barra__tour').click());
  while (Date.now() - t0 < 120000 / K) {
    await p.waitForTimeout(300);
    if (await site.evaluate(() => document.querySelector('.barra__tour').getAttribute('aria-pressed')) !== 'true' && Date.now() - t0 > 4000 / K) break;
  }
  // fim: a fila de cursores passeia e a barra mostra "N agentes em N s"
  await espera(5500);
  gravando = false;
  await cdp.send('Page.stopScreencast');
  const dur = quadros.length ? quadros.at(-1).t - quadros[0].t : 0;
  // lista do ffmpeg (concat): cada quadro dura até o próximo
  let lista = '';
  for (let i = 0; i < quadros.length; i++) {
    // em câmera lenta, cada intervalo real vale K no vídeo final
    const d = (i < quadros.length - 1 ? quadros[i + 1].t - quadros[i].t : 1 / 60) * K;
    lista += `file '${quadros[i].arq}'\nduration ${Math.max(0.001, d).toFixed(4)}\n`;
  }
  lista += `file '${quadros.at(-1).arq}'\n`;
  fs.writeFileSync(path.join(pasta, 'lista.txt'), lista);
  console.log(`quadros ${quadros.length}, gravação ${dur.toFixed(1)} s, vídeo ${(dur * K).toFixed(1)} s, ${(quadros.length / (dur * K)).toFixed(1)} quadros por segundo de vídeo`);
  await b.close();
})();
