import React from 'react';
import { AbsoluteFill } from 'remotion';
// Light leak próprio (o lightLeak do @remotion/effects exige WebGPU, indisponível no render deste ambiente).
// p: 0→1 ao longo do efeito (revela até 0,5 e recolhe). Manchas de luz azul/branca em modo «screen».
export const Leak = ({ p, seed = 1, strength = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  const a = Math.sin(p * Math.PI) * strength;
  const r = (k) => Math.sin(seed * 12.9898 + k * 78.233) * 0.5 + 0.5;
  const blobs = [0, 1, 2, 3].map((i) => {
    const x = r(i) * 100 + (p - 0.5) * (i % 2 ? 60 : -60), y = r(i + 9) * 100 + (p - 0.5) * 30;
    const s = 50 + r(i + 4) * 60 + p * 40;
    const c = ['rgba(120,190,255,', 'rgba(255,255,255,', 'rgba(41,151,255,', 'rgba(200,225,255,'][i];
    return `radial-gradient(${s}% ${s * 0.7}% at ${x}% ${y}%, ${c}${0.9 * a}), ${c}0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(','), mixBlendMode: 'screen', pointerEvents: 'none', filter: 'blur(20px)' }} />;
};
