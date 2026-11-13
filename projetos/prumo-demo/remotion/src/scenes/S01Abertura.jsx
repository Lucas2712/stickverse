import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT, tilt } from '../animations/time';
import { prog, pendulum, map, expoIn, inOut } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Words } from '../components/Words';
import { Plumb } from '../components/Plumb';

// 1+2 · "Você trabalha por conta própria… e as contas trabalham contra você?" (0,00–4,55)
export const S01Abertura = ({ a }) => {
  const t = useT(a);
  const drop = prog(t, 0, 0.9);
  const swingHard = t > 2.0 ? pendulum(t, 2.0, 24, 0.55, 0.9) : 0;
  const ang = pendulum(t, 0.6, 5, 0.7, 1.2) + swingHard;
  const out1 = prog(t, 1.66, 0.32, expoIn);   // primeira frase sai
  const out2 = prog(t, 4.38, 0.3, expoIn);    // cena sai
  const shake = t > 3.37 && t < 3.75 ? Math.sin(t * 90) * 7 * (1 - (t - 3.37) / 0.38) : 0;
  const redP = prog(t, 3.37, 0.25);
  return (
    <LightBg>
      <Camera t={t} a={0} b={4.6} to={1.06} rot={tilt(t)}>
        {/* cards de conta caindo ao fundo (ato da dor) */}
        {[0, 1, 2, 3].map((i) => {
          const s = 2.25 + i * 0.22;
          const p = prog(t, s, 1.4, inOut);
          const xs = [170, 860, 300, 760][i], rot = [-14, 11, 7, -9][i];
          return (
            <div key={i} style={{
              position: 'absolute', left: xs - 150, top: map(p, [0, 1], [-420, [260, 380, 1420, 1500][i]]),
              width: 300, height: 190, borderRadius: 30, background: '#fff', opacity: 0.85 * Math.min(1, p * 3) * (1 - out2),
              transform: `rotate(${rot + p * 8}deg) scale(0.8)`, filter: `blur(${6 + i}px)`, boxShadow: '0 20px 50px rgba(0,0,0,0.10)',
              padding: 26, boxSizing: 'border-box',
            }}>
              <div style={{ width: 120, height: 16, borderRadius: 8, background: C.line }} />
              <div style={{ width: 170, height: 16, borderRadius: 8, background: C.line, marginTop: 14 }} />
              <div style={{ position: 'absolute', right: 22, bottom: 22, width: 110, height: 40, borderRadius: 20, background: C.red, opacity: 0.85 }} />
            </div>
          );
        })}
        <Plumb x={540} top={-20} len={map(drop, [0, 1], [0, 560])} angle={ang} size={64} opacity={1 - out2} />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 800, width: 1000, textAlign: 'center', opacity: 1 - out1, filter: `blur(${out1 * 14}px)`, transform: `translate(${-out1 * 60}px, ${out1 * 40}px)` }}>
            <Words t={t} style={{ ...display(500), fontSize: 76, color: C.ink2 }} words={[{ w: 'Você', s: 0.0 }, { w: 'trabalha', s: 0.3 }, { w: 'por', s: 0.64 }]} />
            <Words t={t} style={{ ...display(700), fontSize: 176, color: C.ink, marginTop: 6, lineHeight: 1.05 }} words={[{ w: 'conta', s: 0.81 }, { w: 'própria…', s: 1.14 }]} />
          </div>
          <div style={{ position: 'absolute', top: 760, width: 1000, textAlign: 'center', opacity: 1 - out2, filter: `blur(${out2 * 14}px)`, transform: `translate(${shake}px, ${out2 * 50}px)` }}>
            <Words t={t} style={{ ...display(500), fontSize: 76, color: C.ink2 }} words={[{ w: 'e', s: 2.02 }, { w: 'as', s: 2.18 }, { w: 'contas', s: 2.36 }, { w: 'trabalham', s: 2.74 }]} />
            <Words t={t} style={{ ...display(700), fontSize: 184, marginTop: 4, lineHeight: 1.05 }} words={[
              { w: 'contra', s: 3.37, style: { color: `rgb(${Math.round(29 + (255 - 29) * redP)},${Math.round(29 + (59 - 29) * redP)},${Math.round(31 + (48 - 31) * redP)})` }, dur: 0.4 },
              { w: 'você?', s: 3.63, style: { color: C.ink } },
            ]} />
          </div>
        </AbsoluteFill>
      </Camera>
    </LightBg>
  );
};
