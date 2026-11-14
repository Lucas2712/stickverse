// ROVIA · utilitários de tempo, curvas e tokens visuais
import { useCurrentFrame, useVideoConfig } from "remotion";
import type React from "react";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURACAO = 28.5;

/** segundos absolutos do vídeo (todas as cenas usam o tempo global, vindo de palavras.json) */
export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

// ---------- curvas ----------
export type Ease = (x: number) => number;
export const lin: Ease = (x) => x;
export const outExpo: Ease = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const inExpo: Ease = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
export const out5: Ease = (x) => 1 - Math.pow(1 - x, 5);
export const out3: Ease = (x) => 1 - Math.pow(1 - x, 3);
export const in3: Ease = (x) => x * x * x;
export const inOut3: Ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const inOutSine: Ease = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
export const outBack: Ease = (x) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** progresso 0..1 entre t0 e t1 com curva */
export const p = (t: number, t0: number, t1: number, e: Ease = lin) => {
  if (t <= t0) return 0;
  if (t >= t1) return 1;
  return e((t - t0) / (t1 - t0));
};

/** interpola valor entre t0 e t1 */
export const k = (t: number, t0: number, t1: number, v0: number, v1: number, e: Ease = lin) =>
  v0 + (v1 - v0) * p(t, t0, t1, e);

export const mix = (a: number, b: number, x: number) => a + (b - a) * x;

/** pseudo-aleatório estável */
export const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---------- tokens ----------
export const C = {
  nevoa: "#F2F6F5",
  nevoa2: "#E6EEEC",
  lilas: "#EEF0F7",
  asfalto: "#0A1214",
  asfalto2: "#111C1F",
  card: "#141F22",
  linha: "rgba(255,255,255,0.08)",
  tinta: "#0E1A1C",
  tinta2: "#5B6B6E",
  turq: "#13B8A6",
  turqClaro: "#3FD9C6",
  turqEscuro: "#0B7F74",
  coral: "#FF6B5B",
  sodio: "#FFB467",
  branco: "#FFFFFF",
  postit: "#FFD84D",
};

export const FONTE = "'Inter', system-ui, sans-serif";
/** Inter Display: eixo óptico no alto, espaçamento apertado */
export const display = (peso = 600, tam = 96): React.CSSProperties => ({
  fontFamily: FONTE,
  fontWeight: peso,
  fontSize: tam,
  fontVariationSettings: "'opsz' 32",
  letterSpacing: "-0.035em",
  lineHeight: 1.02,
});
/** Inter Text: corpo */
export const texto = (peso = 500, tam = 32): React.CSSProperties => ({
  fontFamily: FONTE,
  fontWeight: peso,
  fontSize: tam,
  fontVariationSettings: "'opsz' 14",
  letterSpacing: "-0.01em",
  lineHeight: 1.25,
});

export const brl = (v: number, dec = 2) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
