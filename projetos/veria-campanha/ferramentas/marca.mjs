// Gera todos os arquivos da marca VÉRIA a partir da geometria central (src/branding/compasso.js + glifos.json).
// Uso: node ferramentas/marca.mjs   → marca/svg/*.svg + src/branding/marca.json
import fs from "fs";
import path from "path";
import { compasso, acentoOnda } from "../src/branding/compasso.js";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const G = JSON.parse(fs.readFileSync(path.join(RAIZ, "src/branding/glifos.json"), "utf8"));
export const COR = { profundo: "#24104B", roxo: "#5423A8", violeta: "#7541D8", lavanda: "#A987F0", offwhite: "#F7F5FA", branco: "#FFFFFF", cinza: "#EAE7EF" };

// ---------- símbolo ----------
const S = compasso();
const sw = S.w; // espessura do traço no quadro 100
const sx0 = S.caixa[0] - sw / 2, sy0 = S.caixa[1] - sw / 2, sx1 = S.caixa[2] + sw / 2, sy1 = S.caixa[3] + sw / 2;

// ---------- wordmark (unidades da fonte, linha de base em y = 0, y para baixo) ----------
const CAP = G.cap;
const ORDEM = ["V", "E", "R", "I", "A"];
// espaçamento ajustado à mão entre as manchas das letras (diagonais pedem menos)
const VAO = { VE: 196, ER: 300, RI: 288, IA: 206 };
let cursor = 0;
const letras = [];
ORDEM.forEach((ch, i) => {
  const g = G.glifos[ch];
  const x = cursor - g.bounds[0];
  letras.push({ ch, x, d: g.d, l: cursor, r: x + g.bounds[2] });
  if (i < ORDEM.length - 1) cursor = x + g.bounds[2] + VAO[ch + ORDEM[i + 1]];
});
const larguraPalavra = letras[letras.length - 1].r;

// acento-pulso sobre o E
const P = acentoOnda();
const pxs = P.pts.map((p) => p[0]), pys = P.pts.map((p) => p[1]);
const pb = [Math.min(...pxs), Math.min(...pys), Math.max(...pxs), Math.max(...pys)];
const E = letras[1];
const ACENTO_LARG = 330;                 // largura do pulso (sem a espessura)
const ACENTO_ESC = ACENTO_LARG / (pb[2] - pb[0]);
const ACENTO_TRACO = 142;                // espessura em unidades da fonte (≈ 0,6 da haste)
const acentoCx = E.l + (E.r - E.l) * 0.5;
const acentoBase = -CAP - 125;           // pé do acento
const acento = {
  tx: acentoCx - ((pb[0] + pb[2]) / 2) * ACENTO_ESC,
  ty: acentoBase - pb[3] * ACENTO_ESC,
  esc: ACENTO_ESC,
  traco: ACENTO_TRACO / ACENTO_ESC,
  d: P.d,
};
const topoAcento = acentoBase - (pb[3] - pb[1]) * ACENTO_ESC - ACENTO_TRACO / 2;

// ---------- peças SVG ----------
const simboloSVG = (cor, extra = "") =>
  `<path d="${S.d}" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const palavraSVG = (cor) =>
  letras.map((l) => `<path transform="translate(${l.x.toFixed(1)} 0)" d="${l.d}" fill="${cor}"/>`).join("") +
  `<path transform="translate(${acento.tx.toFixed(2)} ${acento.ty.toFixed(2)}) scale(${acento.esc.toFixed(4)})" d="${acento.d}" fill="none" stroke="${cor}" stroke-width="${acento.traco.toFixed(3)}" stroke-linecap="round" stroke-linejoin="round"/>`;

const svg = (vb, corpo, titulo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map((v) => +v.toFixed(2)).join(" ")}" role="img" aria-label="${titulo}"><title>${titulo}</title>${corpo}</svg>\n`;

// símbolo isolado (com respiro de 6% em volta)
function arqSimbolo(cor) {
  const m = 6;
  return svg([sx0 - m, sy0 - m, sx1 - sx0 + 2 * m, sy1 - sy0 + 2 * m], simboloSVG(cor), "VÉRIA símbolo");
}
// só o nome
function arqPalavra(cor) {
  const m = 120;
  return svg([-m, topoAcento - m, larguraPalavra + 2 * m, -topoAcento + 2 * m], palavraSVG(cor), "VÉRIA");
}
// horizontal: símbolo à esquerda, centrado na altura das maiúsculas
const H_ALT = CAP * 1.42;                          // altura visual do símbolo
const H_ESC = H_ALT / (sy1 - sy0);
const H_VAO = CAP * 0.5;
function arqHorizontal(corS, corP) {
  const largS = (sx1 - sx0) * H_ESC;
  const tx = -sx0 * H_ESC, ty = -CAP / 2 - ((sy0 + sy1) / 2) * H_ESC;
  const corpo = `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${H_ESC.toFixed(3)})">${simboloSVG(corS)}</g><g transform="translate(${(largS + H_VAO).toFixed(1)} 0)">${palavraSVG(corP)}</g>`;
  const topo = Math.min(-CAP / 2 - H_ALT / 2, topoAcento), base = Math.max(0, -CAP / 2 + H_ALT / 2);
  const m = 160;
  return svg([-m, topo - m, largS + H_VAO + larguraPalavra + 2 * m, base - topo + 2 * m], corpo, "VÉRIA");
}
// vertical: símbolo acima, nome abaixo
function arqVertical(corS, corP) {
  const V_ALT = CAP * 2.3, V_ESC = V_ALT / (sy1 - sy0), largS = (sx1 - sx0) * V_ESC;
  const vao = CAP * 0.62;
  const L = Math.max(largS, larguraPalavra);
  const sxT = (L - largS) / 2 - sx0 * V_ESC, syT = -sy0 * V_ESC;
  const pyT = V_ALT + vao - topoAcento; // linha de base do nome
  const corpo = `<g transform="translate(${sxT.toFixed(1)} ${syT.toFixed(1)}) scale(${V_ESC.toFixed(3)})">${simboloSVG(corS)}</g><g transform="translate(${((L - larguraPalavra) / 2).toFixed(1)} ${pyT.toFixed(1)})">${palavraSVG(corP)}</g>`;
  const m = 200;
  return svg([-m, -m, L + 2 * m, pyT + 2 * m], corpo, "VÉRIA");
}
// ícone de aplicativo (1024, cantos contínuos aplicados pela loja; aqui com raio de 22%)
function arqIcone() {
  const T = 1024, esc = (T * 0.6) / (sx1 - sx0);
  const tx = T / 2 - ((sx0 + sx1) / 2) * esc, ty = T / 2 - ((sy0 + sy1) / 2) * esc;
  const corpo = `<defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COR.violeta}"/><stop offset="1" stop-color="${COR.profundo}"/></linearGradient></defs><rect width="${T}" height="${T}" rx="${T * 0.225}" fill="url(#f)"/><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${esc.toFixed(3)})">${simboloSVG(COR.branco, ` stroke-width="${(sw * 1.12).toFixed(2)}"`).replace(` stroke-width="${sw}"`, "")}</g>`;
  return svg([0, 0, T, T], corpo, "VÉRIA ícone do aplicativo");
}

const VERSOES = {
  claro: [COR.roxo, COR.profundo],
  escuro: [COR.lavanda, COR.branco],
  branco: [COR.branco, COR.branco],
  roxo: [COR.roxo, COR.roxo],
  profundo: [COR.profundo, COR.profundo],
};

const DIR = path.join(RAIZ, "marca/svg");
fs.mkdirSync(DIR, { recursive: true });
for (const [nome, [cs, cp]] of Object.entries(VERSOES)) {
  fs.writeFileSync(path.join(DIR, `veria-horizontal-${nome}.svg`), arqHorizontal(cs, cp));
  fs.writeFileSync(path.join(DIR, `veria-vertical-${nome}.svg`), arqVertical(cs, cp));
  fs.writeFileSync(path.join(DIR, `veria-simbolo-${nome}.svg`), arqSimbolo(cs));
  fs.writeFileSync(path.join(DIR, `veria-nome-${nome}.svg`), arqPalavra(cp));
}
fs.writeFileSync(path.join(DIR, "veria-icone-app.svg"), arqIcone());

// dados para o React (Remotion)
fs.writeFileSync(
  path.join(RAIZ, "src/branding/marca.json"),
  JSON.stringify({
    cores: COR,
    simbolo: { d: S.d, traco: sw, caixa: [sx0, sy0, sx1, sy1], pontos: S.pts.map((p) => [+p[0].toFixed(3), +p[1].toFixed(3)]) },
    nome: { cap: CAP, largura: larguraPalavra, topo: topoAcento, letras: letras.map(({ ch, x, d, l, r }) => ({ ch, x, d, l, r })), acento },
  })
);
console.log("ok", Object.keys(VERSOES).length * 4 + 1, "arquivos SVG · largura do nome", larguraPalavra);
