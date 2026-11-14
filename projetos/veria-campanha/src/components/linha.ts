// A LINHA DE RITMO: formas (sempre N pontos em px de tela) e transformação entre elas.
// pulso → onda → ruído → senoide → símbolo → (cartão/interface) → anel → gráfico → respiração → símbolo
import { uniformizar } from "../branding/compasso.js";
import { SIMBOLO } from "../branding/Marca";
import { clamp, lerp, ease, ruido1, hash } from "../anim";

export const N = 240;
export type Pts = [number, number][];

export const ponto = (cx: number, cy: number): Pts => Array.from({ length: N }, () => [cx, cy]);

export const reta = (x0: number, x1: number, y: number): Pts =>
  Array.from({ length: N }, (_, i) => [lerp(x0, x1, i / (N - 1)), y]);

// onda com cristas localizadas (gaussianas) sobre uma ondulação fina; desloca com a câmera (pan)
export const onda = (x0: number, x1: number, y: number, amp: number, freq: number, fase: number, cristas: { x: number; a: number; l: number }[] = []): Pts =>
  Array.from({ length: N }, (_, i) => {
    const x = lerp(x0, x1, i / (N - 1));
    let v = Math.sin(x * freq + fase) * amp;
    for (const c of cristas) v -= c.a * Math.exp(-Math.pow((x - c.x) / c.l, 2));
    return [x, y + v];
  });

// ruído: fora de compasso (serrilhado que muda em passos irregulares)
export const serrilhado = (x0: number, x1: number, y: number, amp: number, t: number, passo = 0.09): Pts => {
  const q = Math.floor(t / passo);
  return Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1), x = lerp(x0, x1, u);
    const dente = (hash(i * 1.37 + q * 13.1) * 2 - 1) * 0.55 * (hash(Math.floor(u * 18) + q * 3.3) > 0.45 ? 1.4 : 0.35) + ruido1(u * 11 + q * 0.37) * 0.5;
    const borda = Math.sin(Math.PI * clamp(u * 1.1)) ** 0.5;
    return [x, y + dente * amp * borda];
  });
};

export const senoide = (x0: number, x1: number, y: number, amp: number, ciclos: number, fase: number): Pts =>
  Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1);
    return [lerp(x0, x1, u), y + Math.sin(u * Math.PI * 2 * ciclos + fase) * amp];
  });

// o símbolo (centro cx, cy; largura total do desenho em px)
const SIMB_U = uniformizar(SIMBOLO.pontos, N) as Pts;
const [bx0, by0, bx1, by1] = SIMBOLO.caixa;
export const simbolo = (cx: number, cy: number, largura: number): Pts => {
  const k = largura / (bx1 - bx0), mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2;
  return SIMB_U.map(([x, y]) => [cx + (x - mx) * k, cy + (y - my) * k]);
};
export const tracoSimbolo = (largura: number) => (SIMBOLO.traco * largura) / (bx1 - bx0);

export const circulo = (cx: number, cy: number, r: number, inicio = -Math.PI / 2): Pts =>
  Array.from({ length: N }, (_, i) => { const a = inicio + (i / (N - 1)) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });

// curva por pontos de controle (Catmull-Rom) reamostrada em N
export const curva = (ctrl: [number, number][]): Pts => {
  const dens: [number, number][] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const t = k / 24, t2 = t * t, t3 = t2 * t;
      dens.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)) as [number, number]);
    }
  }
  dens.push(ctrl[ctrl.length - 1]);
  return uniformizar(dens, N) as Pts;
};

// transformação: cada ponto chega com um pequeno atraso ao longo da linha (escalonado)
export const morph = (a: Pts, b: Pts, t: number, escalonado = 0, curvaE = ease.io3): Pts =>
  a.map((p, i) => {
    const u = i / (N - 1);
    const k = curvaE(clamp((t - u * escalonado) / (1 - escalonado || 1)));
    return [lerp(p[0], b[i][0], k), lerp(p[1], b[i][1], k)];
  });

export const caminho = (pts: Pts) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
