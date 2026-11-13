import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT, tilt } from '../animations/time';
import { prog, spr, map, lerp, inOut } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Words } from '../components/Words';
import { Icon } from '../components/Icon';

// 4 · "dinheiro da casa misturado com o do trabalho." (7,15–10,60) — pote de vidro onde tudo se mistura
const CX = 540, CY = 1180;
const chips = [
  ...[0, 1, 2, 3, 4].map((i) => ({ k: 'casa', s: 8.09 + i * 0.09, from: [-160, 640 + i * 70], seed: i })),
  ...[0, 1, 2, 3, 4].map((i) => ({ k: 'trab', s: 9.3 + i * 0.08, from: [1240, 600 + i * 80], seed: i + 5 })),
];
const Chip = ({ k }) => (
  <div style={{
    width: 132, height: 132, borderRadius: 66, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: k === 'casa' ? 'linear-gradient(160deg,#FFFFFF,#E5E5EA)' : 'linear-gradient(160deg,#2997FF,#0071E3)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.16), inset 0 2px 0 rgba(255,255,255,0.6)',
  }}><Icon name={k === 'casa' ? 'house' : 'bag'} size={66} color={k === 'casa' ? C.ink : '#fff'} stroke={2.2} /></div>
);
export const S04Pote = ({ a }) => {
  const t = useT(a);
  const jarIn = spr(t, 7.2, { damping: 14, stiffness: 110 });
  const mix = prog(t, 8.46, 1.6, inOut);
  const wob = t > 8.46 ? Math.sin((t - 8.46) * 9) * 3 * Math.exp(-(t - 8.46) * 1.4) : 0;
  const pillCasa = prog(t, 8.09, 0.5), pillTrab = prog(t, 9.43, 0.5);
  const swap = prog(t, 9.7, 0.6, inOut);   // os rótulos trocam de lugar: misturou
  return (
    <LightBg>
      <Camera t={t} a={7.15} b={10.6} from={1.0} to={1.06} rot={tilt(t)}>
        <div style={{ position: 'absolute', top: 250, width: 1080, textAlign: 'center' }}>
          <Words t={t} style={{ ...display(500), fontSize: 72, color: C.ink2 }} words={[{ w: 'dinheiro', s: 7.38 }, { w: 'da', s: 7.95 }]} />
          <Words t={t} style={{ ...display(700), fontSize: 132, color: C.ink, lineHeight: 1.1 }} words={[{ w: 'misturado', s: 8.46 }]} />
          <Words t={t} style={{ ...display(500), fontSize: 72, color: C.ink2 }} words={[{ w: 'com', s: 9.07 }, { w: 'o', s: 9.24 }, { w: 'do', s: 9.31 }]} />
        </div>
        {/* rótulos casa / trabalho que se cruzam */}
        {[['casa', pillCasa, 300, 780, '#fff', C.ink], ['trabalho', pillTrab, 780, 300, C.blue, '#fff']].map(([w, p, x0, x1, bg, fg]) => (
          <div key={w} style={{
            position: 'absolute', left: lerp(x0, x1, swap) - 150, top: 760 + (w === 'casa' ? -1 : 1) * Math.sin(swap * Math.PI) * 50, width: 300,
            display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.5), transform: `scale(${0.7 + 0.3 * p})`, filter: `blur(${(1 - p) * 10}px)`,
          }}>
            <span style={{ ...text(600), fontSize: 60, padding: '16px 40px', borderRadius: 99, background: bg, color: fg, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>{w}</span>
          </div>
        ))}
        {/* pote */}
        <div style={{ position: 'absolute', left: CX - 250, top: CY - 260, width: 500, height: 600, transform: `translateY(${(1 - jarIn) * 700}px) rotate(${wob}deg)`, transformOrigin: '50% 100%' }}>
          <svg width="500" height="600" viewBox="0 0 500 600" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stopColor="rgba(255,255,255,0.9)" /><stop offset="0.25" stopColor="rgba(255,255,255,0.25)" /><stop offset="0.8" stopColor="rgba(255,255,255,0.1)" /><stop offset="1" stopColor="rgba(255,255,255,0.7)" /></linearGradient>
            </defs>
            <rect x="120" y="20" width="260" height="60" rx="18" fill="#D1D1D6" />
            <path d="M140 80h220v30c70 20 110 70 110 140v260c0 50-30 80-80 80H110c-50 0-80-30-80-80V250c0-70 40-120 110-140z" fill="url(#glass)" stroke="rgba(0,0,0,0.10)" strokeWidth="3" />
            <path d="M70 260c0-40 20-80 60-100" stroke="rgba(255,255,255,0.95)" strokeWidth="14" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        {chips.map((c, i) => {
          const k = prog(t, c.s, 0.7, inOut);
          if (k <= 0) return null;
          const ang = c.seed * 1.37 + (t - c.s) * (0.6 + mix * 2.2) * (c.k === 'casa' ? 1 : -1);
          const r = 70 + (c.seed % 3) * 45;
          const home = [CX + Math.cos(ang) * r * (0.6 + 0.4 * mix), CY + 120 + Math.sin(ang) * r * 0.55 + (c.seed % 2) * 40];
          const arcY = -260 * Math.sin(k * Math.PI);
          const x = lerp(c.from[0], home[0], k), y = lerp(c.from[1], home[1], k) + arcY;
          return <div key={i} style={{ position: 'absolute', left: x - 66, top: y - 66 + (1 - jarIn) * 700, transform: `rotate(${ang * 30}deg) scale(${0.8 + 0.2 * k})`, filter: k < 1 ? `blur(${(1 - k) * 6}px)` : 'none' }}><Chip k={c.k} /></div>;
        })}
      </Camera>
    </LightBg>
  );
};
