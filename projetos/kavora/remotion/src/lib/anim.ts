// Motor de movimento: curvas cúbicas próprias, molas com massa, deriva determinística
// e velocidade (para o motion blur). Tudo é função do tempo absoluto em segundos.
import {Easing, interpolate, spring, SpringConfig} from 'remotion';
import {FPS} from '../theme';

// Curvas próprias (nenhuma linear): saídas longas e macias, entradas firmes.
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-out suave: chegadas
  outSoft: Easing.bezier(0.33, 1, 0.68, 1),
  inOut: Easing.bezier(0.76, 0, 0.24, 1), // câmera
  inOutSoft: Easing.bezier(0.45, 0, 0.2, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0), // saídas
  inSoft: Easing.bezier(0.5, 0, 0.75, 0),
  draw: Easing.bezier(0.65, 0, 0.25, 1), // traços
};

type Ease = (x: number) => number;

/** Interpolação temporal com clamp. */
export const tw = (t: number, t0: number, dur: number, from: number, to: number, ease: Ease = E.out) =>
  interpolate(t, [t0, t0 + Math.max(dur, 1e-4)], [from, to], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Progresso 0..1 (com clamp). */
export const pr = (t: number, t0: number, dur: number, ease: Ease = E.out) => tw(t, t0, dur, 0, 1, ease);

// Molas: o peso vem da massa; o "assentar" vem do amortecimento.
export const SP: Record<string, Partial<SpringConfig>> = {
  soft: {mass: 1, damping: 20, stiffness: 120},
  snappy: {mass: 0.7, damping: 15, stiffness: 190},
  heavy: {mass: 1.7, damping: 22, stiffness: 120},
  bouncy: {mass: 0.9, damping: 11, stiffness: 150},
  settle: {mass: 1.2, damping: 26, stiffness: 90},
};

/** Mola a partir de t0 (0 antes de t0; pode passar de 1 no overshoot). Subquadros permitidos. */
export const sp = (t: number, t0: number, cfg: Partial<SpringConfig> = SP.soft) => {
  const f = (t - t0) * FPS;
  if (f <= 0) return 0;
  return spring({frame: f, fps: FPS, config: cfg});
};

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** Deriva orgânica determinística (soma de senos com fase pela semente). */
export const drift = (t: number, seed: number, amp = 1, freq = 0.35) =>
  amp *
  (Math.sin(t * freq * 6.283 + seed * 1.7) * 0.6 +
    Math.sin(t * freq * 2.13 * 6.283 + seed * 3.1) * 0.3 +
    Math.sin(t * freq * 3.7 * 6.283 + seed * 5.3) * 0.1);

/** Velocidade (unidades/s) de uma função do tempo: base do motion blur. */
export const vel = (fn: (t: number) => number, t: number) => (fn(t) - fn(t - 1 / 120)) * 120;

/** Desfoque de movimento (px) para obturador de 180° a 30 fps. */
export const shutter = (v: number, k = 1) => Math.min(60, Math.abs(v) * (0.5 / FPS) * 0.55 * k);

/** Janela: 1 dentro de [a,b], com rampas de entrada/saída. */
export const win = (t: number, a: number, b: number, rin = 0.2, rout = 0.2) =>
  Math.min(pr(t, a, rin, E.outSoft), 1 - pr(t, b - rout, rout, E.inSoft));

/** Formata reais (pt-BR). */
export const brl = (v: number, dec = 2) =>
  'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits: dec, maximumFractionDigits: dec});
