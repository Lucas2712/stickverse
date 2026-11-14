// Curvas e utilitários de animação (tempo em segundos absolutos do filme)
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, x: number) => clamp((x - a) / (b - a));
export const ease = {
  lin: (t: number) => t,
  out3: (t: number) => 1 - Math.pow(1 - t, 3),
  out5: (t: number) => 1 - Math.pow(1 - t, 5),
  outExpo: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  in3: (t: number) => t * t * t,
  inExpo: (t: number) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  io3: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  ioSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t: number) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
// progresso de a até b com curva
export const p = (t: number, a: number, b: number, e: (x: number) => number = ease.out5) => e(inv(a, b, t));
// janela: sobe em [a, a+ein], fica, desce em [b-eout, b]
export const janela = (t: number, a: number, b: number, ein = 0.3, eout = 0.3) =>
  Math.min(p(t, a, a + ein, ease.out3), 1 - p(t, b - eout, b, ease.in3));
export const mix = (c1: string, c2: string, t: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = h(c1), b = h(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(t)))).join(",")})`;
};
// ruído determinístico
export const hash = (n: number) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export const ruido1 = (x: number) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
