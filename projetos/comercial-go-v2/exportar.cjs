// Exporta o comercial: quadros em paralelo (workers Chromium) → segmentos H.264 → MP4 1080×1920 60 fps + trilha.
// node exportar.cjs [--rascunho] [--de s] [--ate s] [--workers n] [--nmin 8] [--nmax 20]
//   --rascunho: 540×960, 30 fps, 1 subquadro (prévia rápida)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { spawn, execFileSync } = require('child_process');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const RAS = process.argv.includes('--rascunho');
const ESC = RAS ? .5 : 1, FPS = RAS ? 30 : 60, DUR = 22;
const de = +arg('--de', 0), ate = +arg('--ate', DUR), WK = +arg('--workers', RAS ? 3 : 2);
const NMIN = +arg('--nmin', RAS ? 1 : 8), NMAX = +arg('--nmax', RAS ? 1 : 20);
const OUT = path.join(__dirname, 'saida'), SEG = path.join(OUT, RAS ? 'seg-rascunho' : 'seg'); fs.mkdirSync(SEG, { recursive: true });
const HTML = 'file://' + path.join(OUT, 'comercial-go-v2.html') + '?escala=' + ESC;
const f0 = Math.round(de * FPS), f1 = Math.round(ate * FPS);

async function abrir() {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto(HTML); await p.waitForFunction(() => window.__pronto || window.__erro, null, { timeout: 180000 });
  const e = await p.evaluate(() => window.__erro); if (e) throw new Error(e);
  return [b, p];
}

async function worker(id, frames, Ns) {
  const [b, p] = await abrir();
  const W = await p.evaluate(() => window.__W), H = await p.evaluate(() => window.__H);
  const seg = path.join(SEG, `w${id}-${frames[0]}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-vf', 'vflip', '-c:v', 'libx264', '-preset', RAS ? 'veryfast' : 'slow', '-crf', RAS ? '20' : '12', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', seg]);
  const t0 = Date.now();
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i], N = Ns[f - f0];
    const b64 = await p.evaluate(([t, N]) => { window.__frame(t, N); return window.__pixels(); }, [f / FPS, N]);
    const buf = Buffer.from(b64, 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 20 === 0) { const el = (Date.now() - t0) / 1000; console.log(`w${id} quadro ${f} (${i + 1}/${frames.length}) N=${N} · ${(el / (i + 1)).toFixed(1)} s/quadro`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  return seg;
}

(async () => {
  const T = Date.now();
  // 1) trilha (OfflineAudioContext) e mapa de subquadros pelo movimento
  const [b, p] = await abrir();
  if (!RAS || !fs.existsSync(path.join(OUT, 'musica.wav'))) {
    fs.writeFileSync(path.join(OUT, 'musica.wav'), Buffer.from(await p.evaluate(() => window.__musicWav()), 'base64'));
    console.log('trilha: saida/musica.wav');
  }
  const Ns = [];
  for (let f = f0; f < f1; f++) {
    if (NMAX <= 1) { Ns.push(1); continue; }
    const m = await p.evaluate(t => window.__motion(t), f / FPS);
    Ns.push(Math.max(NMIN, Math.min(NMAX, Math.ceil(m / 1.0))));
  }
  await b.close();
  if (NMAX > 1) { fs.writeFileSync(path.join(OUT, 'subquadros.json'), JSON.stringify(Ns)); console.log('subquadros: média', (Ns.reduce((a, c) => a + c, 0) / Ns.length).toFixed(1), '· quadros com 20:', Ns.filter(n => n >= NMAX).length); }
  // 2) quadros divididos em blocos contíguos, intercalados entre os workers para equilibrar a carga
  const BL = 30, blocos = []; for (let f = f0; f < f1; f += BL) blocos.push(Array.from({ length: Math.min(BL, f1 - f) }, (_, i) => f + i));
  const fila = blocos.slice(), segs = [];
  await Promise.all(Array.from({ length: WK }, async (_, id) => { while (fila.length) { const bl = fila.shift(); segs.push([bl[0], await worker(id, bl, Ns)]); } }));
  segs.sort((a, c) => a[0] - c[0]);
  const lista = path.join(SEG, 'lista.txt'); fs.writeFileSync(lista, segs.map(s => `file '${s[1]}'`).join('\n'));
  const nome = RAS ? 'comercial-go-v2-rascunho' : (de > 0 || ate < DUR ? `comercial-go-v2-${de}-${ate}` : 'comercial-go-v2-video');
  const vid = path.join(OUT, nome + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', vid]);
  // 3) vídeo + trilha (efeitos reais entram depois, em efeitos.cjs)
  const comM = path.join(OUT, nome + '-musica.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', vid, '-ss', String(de), '-t', String(ate - de), '-i', path.join(OUT, 'musica.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-shortest', comM]);
  console.log(`ok ${path.relative(__dirname, comM)} · ${((Date.now() - T) / 60000).toFixed(1)} min`);
})().catch(e => { console.error(e); process.exit(1); });
