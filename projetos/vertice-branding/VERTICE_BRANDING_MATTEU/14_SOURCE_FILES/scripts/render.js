// VÉRTICE · renderizador (Chromium/Playwright)
// uso: node render.js jobs.json
// jobs: [{ "html": "/abs/file.html", "out": "/abs/out.png|.jpg|.pdf", "w": 1080, "h": 1350, "scale": 1, "quality": 92 }]
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch();
  const ctxs = {};
  for (const j of jobs) {
    const scale = j.scale || 1;
    const key = `${j.w}x${j.h}@${scale}`;
    if (!ctxs[key]) ctxs[key] = await browser.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: scale });
    const page = await ctxs[key].newPage();
    await page.goto('file://' + j.html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(60);
    fs.mkdirSync(require('path').dirname(j.out), { recursive: true });
    if (j.out.endsWith('.pdf')) {
      if (j.a4) await page.pdf({ path: j.out, format: 'A4', landscape: true, printBackground: true, scale: 1122.5 / j.w, preferCSSPageSize: false });
      else await page.pdf({ path: j.out, width: j.w + 'px', height: j.h + 'px', printBackground: true });
    } else if (j.out.endsWith('.jpg')) {
      await page.screenshot({ path: j.out, type: 'jpeg', quality: j.quality || 92, clip: { x: 0, y: 0, width: j.w, height: j.h } });
    } else {
      await page.screenshot({ path: j.out, omitBackground: !!j.transparent, clip: { x: 0, y: 0, width: j.w, height: j.h } });
    }
    await page.close();
    process.stdout.write('.');
  }
  await browser.close();
  console.log(`\n${jobs.length} peças renderizadas`);
})();
