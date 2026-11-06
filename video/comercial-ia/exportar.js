// Exporta comercial-ia.html para MP4 1080x1920 30 fps (quadro a quadro, determinístico).
// Uso: node exportar.js [saida.mp4]   (requer playwright e ffmpeg)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
(async () => {
  const AQUI = __dirname, OUT = process.argv[2] || path.join(AQUI, 'comercial-ia.mp4');
  const FPS = 30, DUR = 30, TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'exp-'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const html = fs.readFileSync(path.join(AQUI, 'comercial-ia.html'), 'utf8');
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>', { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  // efeitos sonoros
  const b64 = await p.evaluate(() => window.__renderSfx(48000));
  fs.writeFileSync(path.join(TMP, 'sfx.raw'), Buffer.from(b64, 'base64'));
  // palco em tela cheia, escala 1
  await p.evaluate(() => { const s = document.getElementById('stage'); document.body.appendChild(s);
    s.style.cssText += ';position:fixed;left:0;top:0;z-index:999;transform:none'; document.getElementById('cap'); });
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(TMP, 'video.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < FPS * DUR; i++) {
    await p.evaluate(t => window.__seek(t), i / FPS);
    const img = await p.screenshot({ type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) process.stdout.write(`${i / FPS}s `);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  // mixagem: narração + efeitos, normalizado para -14 LUFS
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(TMP, 'video.mp4'), '-i', path.join(AQUI, 'narracao.mp3'),
    '-f', 's16le', '-ar', '48000', '-ac', '1', '-i', path.join(TMP, 'sfx.raw'),
    '-filter_complex', '[1:a]aresample=48000,apad[vo];[2:a]volume=0.5[fx];[vo][fx]amix=inputs=2:duration=longest:normalize=0,atrim=0:30,loudnorm=I=-14:TP=-1.5:LRA=9[a]',
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-t', '30', OUT]);
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('\nok', OUT);
})();
