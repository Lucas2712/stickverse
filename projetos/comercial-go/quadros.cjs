// Renderiza quadros avulsos para revisão: node quadros.cjs [N subquadros] t1 t2 ...  → saida/quadros/t.png (+ folha.png)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
(async () => {
  let args = process.argv.slice(2), N = 1; if (args[0] && args[0].startsWith('N=')) { N = +args[0].slice(2); args = args.slice(1); }
  const ts = args.map(Number); const out = path.join(__dirname, 'saida/quadros'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text().slice(0, 300)); }); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.goto('file://' + path.join(__dirname, 'saida/comercial-go.html'));
  await p.waitForFunction(() => window.__pronto || window.__erro, null, { timeout: 120000 });
  const err = await p.evaluate(() => window.__erro); if (err) { console.log('ERRO', err); console.log(errs.join('\n')); process.exit(1); }
  const files = [];
  for (const t of ts) {
    const t0 = Date.now();
    const url = await p.evaluate(([t, N]) => { window.__frame(t, N); return document.getElementById('filme').toDataURL('image/png'); }, [t, N]);
    const f = path.join(out, `t${t.toFixed(2)}.png`); fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); files.push(f);
    console.log(t, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
  if (errs.length) console.log('console:\n' + [...new Set(errs)].slice(0, 15).join('\n'));
  await b.close();
  if (files.length > 1) {
    const cols = Math.min(4, files.length);
    execSync(`ffmpeg -y -loglevel error ${files.map(f => `-i ${f}`).join(' ')} -filter_complex "${files.map((_, i) => `[${i}]scale=480:270,drawtext=text='${ts[i].toFixed(2)}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`).join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 480}_${Math.floor(i / cols) * 270}`).join('|')}:fill=gray" ${out}/folha.png`);
  }
})();
