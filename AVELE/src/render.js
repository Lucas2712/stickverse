// Renderiza um arquivo HTML ou SVG em PNG.
// uso: node render.js entrada.(html|svg) saida.png largura altura [escala] [--full] [--transparent]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const args = process.argv.slice(2);
  const flags = args.filter(a => a.startsWith('--'));
  const [inp, out, w, h, scale = '1'] = args.filter(a => !a.startsWith('--'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +scale });
  await page.goto('file://' + path.resolve(inp));
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, fullPage: flags.includes('--full'), omitBackground: flags.includes('--transparent') });
  await browser.close();
})();
