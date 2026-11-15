// Renderiza quadros soltos para revisão (um bundle só). Uso:
// node ferramentas/quadros.mjs <pastaSaida> <escala> <seg1> <seg2> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
const [out, scale, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium', chromiumOptions: {gl: 'swangle'}});
const composition = await selectComposition({serveUrl, id: 'Kavora', puppeteerInstance: browser});
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * 30));
  const output = path.join(out, `t${String(s).padStart(5, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame, scale: parseFloat(scale), puppeteerInstance: browser, chromiumOptions: {gl: 'swangle'}});
  console.log('ok', output);
}
await browser.close({silent: true});
