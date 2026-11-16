// Utilitários determinísticos: easing, interpolação, RNG com semente.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const prog = (t, a, b) => clamp((t - a) / (b - a));          // 0→1 entre a e b
export const smooth = k => k * k * (3 - 2 * k);
export const ease = {
  lin: k => k,
  inOut: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
  inOut5: k => k < .5 ? 16 * k ** 5 : 1 - Math.pow(-2 * k + 2, 5) / 2,
  out3: k => 1 - Math.pow(1 - k, 3),
  out5: k => 1 - Math.pow(1 - k, 5),
  outExpo: k => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k),
  inExpo: k => k <= 0 ? 0 : Math.pow(2, 10 * k - 10),
  in3: k => k * k * k,
  inOutExpo: k => k <= 0 ? 0 : k >= 1 ? 1 : k < .5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2,
  outBack: (k, s = 1.4) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2),
};
// valor animado entre a e b com easing no intervalo [t0,t1]
export const tw = (t, t0, t1, a, b, e = ease.inOut) => lerp(a, b, e(prog(t, t0, t1)));
// mola amortecida (inércia) de 0→1: resposta a degrau com ultrapassagem leve
export const spring = (k, zeta = .55, w = 9) => {
  if (k <= 0) return 0;
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * k) * (Math.cos(wd * k) + zeta * w / wd * Math.sin(wd * k));
};
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// ruído suave 1D determinístico (para micro‑derivas de câmera)
export function noise1(x, seed = 0) {
  const h = n => { const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); };
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(h(i), h(i + 1), u) * 2 - 1;
}
export const BPM = 120, BEAT = 60 / BPM, DUR = 22, FPS = 60;
