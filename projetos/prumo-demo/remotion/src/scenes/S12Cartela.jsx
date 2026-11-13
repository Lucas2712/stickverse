import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, pendulum } from '../animations/motion';
import { LightBg } from '../components/Stage';
import { AppIcon, Wordmark } from '../components/Brand';

// 12 · cartela final (32,55–36,50) · sem narração
export const S12Cartela = ({ a }) => {
  const t = useT(a);
  const icon = spr(t, 32.6, { damping: 12, stiffness: 140 });
  const word = spr(t, 33.0, { damping: 15, stiffness: 130 });
  const sig = prog(t, 33.6, 0.7);
  const ang = pendulum(t, 32.75, 4, 0.6, 1.1);
  const line = prog(t, 32.45, 0.45);
  return (
    <LightBg>
      <AbsoluteFill style={{ transform: `scale(${1 + (t - 32.55) * 0.008})` }}>
        <div style={{ position: 'absolute', left: 540, top: 0, transform: `rotate(${ang}deg)`, transformOrigin: '0 0' }}>
          <div style={{ position: 'absolute', left: -1.25, top: 0, width: 2.5, height: 640 * line, background: 'rgba(29,29,31,0.4)' }} />
          <div style={{ position: 'absolute', left: -105, top: 640 }}><AppIcon size={210} dark style={{ transform: `scale(${icon})` }} /></div>
        </div>
        <div style={{ position: 'absolute', top: 905, width: 1080, display: 'flex', justifyContent: 'center', opacity: Math.min(1, word * 1.6), transform: `translateY(${(1 - word) * 30}px)`, filter: `blur(${(1 - Math.min(1, word)) * 10}px)` }}>
          <Wordmark size={190} />
        </div>
        <div style={{ position: 'absolute', top: 1130, width: 1080, textAlign: 'center', ...display(500), fontSize: 50, color: C.ink2, opacity: prog(t, 33.2, 0.6) }}>
          Suas contas, no lugar.
        </div>
        <div style={{ position: 'absolute', top: 1420, width: 1080, textAlign: 'center', opacity: sig, transform: `translateY(${(1 - sig) * 16}px)` }}>
          <div style={{ ...text(500), fontSize: 30, color: C.ink2, letterSpacing: '0.01em' }}>Marca fictícia · peça de demonstração</div>
          <div style={{ ...display(600), fontSize: 40, color: C.ink, marginTop: 10, letterSpacing: '-0.02em' }}>Studio Matteu</div>
        </div>
      </AbsoluteFill>
    </LightBg>
  );
};
