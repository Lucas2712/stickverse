import { useCurrentFrame } from 'remotion';
import { FPS } from '../styles/tokens';
import { spr } from './motion';
// tempo absoluto (s) dentro de uma Sequence que começa em `a`
export const useT = (a) => a + useCurrentFrame() / FPS;
// inclinação global do "mundo torto" (atos 1: 2,05 s até o nivelamento em 11,04 s)
export const tilt = (t) => {
  if (t < 2.05) return 0;
  const k = spr(t, 2.05, { damping: 9, stiffness: 90, mass: 1 });
  return -7 * k + Math.sin(t * 2.1) * 0.6 * Math.min(1, (t - 2.05) / 0.6);
};
