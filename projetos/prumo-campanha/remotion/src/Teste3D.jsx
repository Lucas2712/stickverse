import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Compass3D } from './components/Compass3D';
import { Leak } from './components/Leak';
import { Sequence } from 'remotion';
import { lerp, prog, inOut } from './animations/motion';
export const Teste3D = () => {
  const t = useCurrentFrame() / 30;
  const f = { a: 0.1, spin: 0.4, settle: 2.6, morph: 99 };
  const o = prog(t, 0, 3.2, inOut);
  return <AbsoluteFill style={{ background: 'radial-gradient(80% 60% at 50% 40%, #FFFFFF, #E9ECF2)' }}><Compass3D t={t} f={f} orbit={lerp(-0.9, 0, o)} tilt={lerp(-0.9, -0.05, o)} glow={prog(t, 2.6, 0.5)} /><Sequence from={60} durationInFrames={40}><Leak hueShift={200} /></Sequence></AbsoluteFill>;
};
