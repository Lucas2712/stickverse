import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../styles/tokens';
// Fundo claro com luz suave do alto e vinheta discreta
export const LightBg = ({ children, glow = 1 }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 30% 0%, rgba(255,255,255,${0.95 * glow}) 0%, rgba(255,255,255,0) 60%)` }} />
    <AbsoluteFill style={{ background: 'radial-gradient(140% 90% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.05) 100%)' }} />
    {children}
  </AbsoluteFill>
);
export const BlueBg = ({ children, t = 0 }) => (
  <AbsoluteFill style={{ background: 'linear-gradient(165deg,#2997FF 0%,#0071E3 45%,#0058B8 100%)' }}>
    <AbsoluteFill style={{ background: `radial-gradient(80% 50% at ${40 + Math.sin(t * 0.6) * 12}% ${30 + Math.cos(t * 0.5) * 8}%, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)` }} />
    <AbsoluteFill style={{ background: 'radial-gradient(140% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,20,60,0.25) 100%)' }} />
    {children}
  </AbsoluteFill>
);
// Câmera: push-in contínuo + deriva
export const Camera = ({ t, a, b, from = 1, to = 1.045, rot = 0, children, style }) => {
  const p = Math.max(0, Math.min(1, (t - a) / (b - a)));
  const s = from + (to - from) * p;
  return <AbsoluteFill style={{ transform: `scale(${s}) rotate(${rot}deg)`, ...style }}>{children}</AbsoluteFill>;
};
