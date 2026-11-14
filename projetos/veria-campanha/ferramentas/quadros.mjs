// Revisão por quadros: renderiza stills em segundos escolhidos e monta folhas de contato.
// Uso: node ferramentas/quadros.mjs saida/revisao 0.5 2 3.5 ...   (ou "todos" para 1 quadro a cada 0,5 s)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [dir, ...args] = process.argv.slice(2);
const OUT = path.resolve(RAIZ, dir || "saida/revisao");
fs.mkdirSync(OUT, { recursive: true });
const HS = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const tempos = args[0] === "todos" ? Array.from({ length: 142 }, (_, i) => i * 0.5) : args.map(Number);

const serveUrl = await bundle({ entryPoint: path.join(RAIZ, "src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "Veria", browserExecutable: HS });
const arqs = [];
for (const t of tempos) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(t * comp.fps));
  const out = path.join(OUT, `q-${String(t.toFixed(2)).padStart(6, "0")}.jpg`);
  await renderStill({ serveUrl, composition: comp, frame, output: out, imageFormat: "jpeg", jpegQuality: 85, browserExecutable: HS, scale: 0.5 });
  arqs.push(out);
}
// folhas de 12 (4 × 3) com o tempo escrito
for (let i = 0; i < arqs.length; i += 12) {
  const grupo = arqs.slice(i, i + 12);
  const ins = grupo.flatMap((a) => ["-i", a]);
  const lab = grupo.map((a, k) => `[${k}]scale=270:480,drawtext=text='${path.basename(a).slice(2, 8)}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v${k}]`).join(";");
  const lay = grupo.map((_, k) => `${(k % 4) * 270}_${Math.floor(k / 4) * 480}`).join("|");
  const pads = grupo.map((_, k) => `[v${k}]`).join("");
  execFileSync("ffmpeg", ["-v", "error", "-y", ...ins, "-filter_complex", `${lab};${pads}xstack=inputs=${grupo.length}:layout=${lay}:fill=black`, path.join(OUT, `folha-${String(i / 12 + 1).padStart(2, "0")}.jpg`)]);
}
console.log("ok", arqs.length, "quadros em", OUT);
