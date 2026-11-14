// Gera quadros soltos (PNG) para revisão: node scripts/quadros.mjs 0.5 2.1 ... [--escala 0.5] [--saida dir]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const args = process.argv.slice(2);
let escala = 0.5, saida = "saida/quadros";
const tempos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--escala") escala = +args[++i];
  else if (args[i] === "--saida") saida = args[++i];
  else tempos.push(+args[i]);
}
fs.mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const comp = await selectComposition({ serveUrl, id: "Rovia", browserExecutable });
for (const t of tempos) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(t * 30));
  const out = path.join(saida, `q_${t.toFixed(2).padStart(5, "0")}.png`);
  await renderStill({ composition: comp, serveUrl, frame, output: out, scale: escala, browserExecutable });
  console.log(out);
}
