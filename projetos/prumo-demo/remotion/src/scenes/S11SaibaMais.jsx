import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Words } from '../components/Words';

// 11 · "Toque em Saiba mais e comece hoje." (29,45–32,95)
export const S11SaibaMais = ({ a }) => {
  const t = useT(a);
  const open = prog(t, 29.45, 0.45, inOut);
  const btn = spr(t, 29.9, { damping: 12, stiffness: 150 });
  const move = prog(t, 30.05, 0.5, inOut);
  const press = t > 30.62 ? Math.sin(Math.min(1, (t - 30.62) / 0.22) * Math.PI) : 0;
  const ripple = prog(t, 30.62, 0.7);
  const bigRipple = prog(t, 32.3, 0.45, inOut);
  const tx = lerp(860, 600, move), ty = lerp(1500, 1010, move);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${50 - 50 * open}% 0 ${50 - 50 * open}%)` }}>
      <LightBg>
        <Camera t={t} a={29.45} b={32.95} from={1.0} to={1.04}>
          <div style={{ position: 'absolute', top: 600, width: 1080, textAlign: 'center' }}>
            <Words t={t} style={{ ...display(500), fontSize: 74, color: C.ink2 }} words={[{ w: 'Toque', s: 29.79 }, { w: 'em', s: 30.21 }]} />
          </div>
          <div style={{ position: 'absolute', left: 240, top: 860, width: 600, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 85, border: `4px solid ${C.blue}`, transform: `scale(${1 + ripple * 0.35})`, opacity: (1 - ripple) * (ripple > 0 ? 0.8 : 0) }} />
            <div style={{
              width: 600, height: 170, borderRadius: 85, background: 'linear-gradient(180deg,#1A85F0,#0071E3)', color: '#fff', ...display(600), fontSize: 66,
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,113,227,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
              transform: `scale(${btn * (1 - press * 0.06)})`, opacity: Math.min(1, btn * 2),
            }}>Saiba mais</div>
          </div>
          {/* ponto de toque */}
          <div style={{ position: 'absolute', left: tx - 55, top: ty - 55, width: 110, height: 110, borderRadius: 55, background: 'rgba(29,29,31,0.16)', border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', opacity: prog(t, 30.0, 0.3) * (1 - prog(t, 31.0, 0.3)), transform: `scale(${1 - press * 0.22})` }} />
          <div style={{ position: 'absolute', top: 1110, width: 1080, textAlign: 'center' }}>
            <Words t={t} style={{ ...display(600), fontSize: 80, color: C.ink }} words={[{ w: 'e', s: 31.21 }, { w: 'comece', s: 31.31 }, { w: 'hoje.', s: 31.73, style: { color: C.blue } }]} />
          </div>
        </Camera>
        <div style={{ position: 'absolute', left: 540 - 1200, top: 945 - 1200, width: 2400, height: 2400, borderRadius: 1200, background: C.bg, transform: `scale(${bigRipple})` }} />
      </LightBg>
    </AbsoluteFill>
  );
};
