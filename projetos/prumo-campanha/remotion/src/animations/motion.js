import { interpolate, spring, Easing } from 'remotion';
import { FPS } from '../styles/tokens';

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const quintOut = Easing.bezier(0.22, 1, 0.36, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const expoIn = Easing.bezier(0.7, 0, 0.84, 0);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
export const SPEED = 2.9;    // v5: animações 2× mais rápidas que a v4 (pedido do usuário)
// progresso 0→1 entre start e start+dur (segundos absolutos)
export const prog = (t, start, dur, easing = expoOut) => interpolate(t, [start, start + dur / SPEED], [0, 1], { ...clamp, easing });
export const lerp = (a, b, p) => a + (b - a) * p;
export const map = (t, inp, out, easing) => interpolate(t, inp, out, { ...clamp, ...(easing ? { easing } : {}) });
// progresso em tempo real (sem SPEED) — para o que precisa durar exatamente até uma palavra
export const progT = (t, start, dur, easing = expoOut) => interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing });
// mola com tempo em segundos
export const spr = (t, start, config = { damping: 15, stiffness: 140, mass: 1 }) =>
  t < start ? 0 : spring({ frame: (t - start) * FPS * SPEED, fps: FPS, config });
// pêndulo amortecido (graus)
export const pendulum = (t, start, amp, freq = 0.9, decay = 1.6) =>
  t < start ? 0 : amp * Math.sin((t - start) * Math.PI * 2 * freq) * Math.exp(-(t - start) * decay);
// entrada padrão: sobe, perde o desfoque, ganha opacidade
export const enter = (t, start, dur = 0.55, dist = 40, blur = 14) => {
  const p = prog(t, start, dur);
  return { opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * dist}px)`, filter: `blur(${(1 - p) * blur}px)` };
};
// saída padrão
export const exit = (t, start, dur = 0.35, dist = -30, blur = 12) => {
  const p = prog(t, start, dur, expoIn);
  return { opacity: 1 - p, transform: `translateY(${p * dist}px)`, filter: `blur(${p * blur}px)` };
};
