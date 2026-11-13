import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Words } from '../components/Words';

// 8 · "Mostra quanto guardar para os impostos." (18,95–21,95) — coluna de vidro que enche
export const S08Impostos = ({ a }) => {
  const t = useT(a);
  const turn = prog(t, 19.0, 0.5);
  const fill = prog(t, 19.9, 1.0, inOut) * 0.72;
  const mark = spr(t, 20.9, { damping: 12, stiffness: 170 });
  const go = prog(t, 21.55, 0.4, expoIn);
  const wave = (x) => Math.sin(x / 40 + t * 6) * 6 * (fill > 0 && fill < 0.72 ? 1 : 0.35);
  const H = 720, top = 680;
  const level = top + H * (1 - fill);
  return (
    <LightBg>
      <Camera t={t} a={18.95} b={21.95} from={1.0} to={1.04} style={{ opacity: 1 - prog(t, 21.8, 0.18) }}>
        <div style={{ position: 'absolute', top: 260, width: 1080, textAlign: 'center', opacity: 1 - go, filter: `blur(${go * 12}px)` }}>
          <Words t={t} style={{ ...display(500), fontSize: 66, color: C.ink2 }} words={[{ w: 'Mostra', s: 19.21 }]} />
          <Words t={t} style={{ ...display(700), fontSize: 124, color: C.ink, lineHeight: 1.06 }} words={[{ w: 'quanto', s: 19.71 }, { w: 'guardar', s: 20.1 }]} />
          <Words t={t} style={{ ...display(500), fontSize: 66, color: C.ink2, marginTop: 6 }} words={[{ w: 'para', s: 20.48 }, { w: 'os', s: 20.67 }, { w: 'impostos.', s: 20.78, style: { color: C.blue, fontWeight: 650 } }]} />
        </div>
        <AbsoluteFill style={{ perspective: 1600 }}>
          <div style={{
            position: 'absolute', left: 540 - 150, top, width: 300, height: H, borderRadius: 150, overflow: 'hidden',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.8))',
            boxShadow: '0 30px 80px rgba(0,0,0,0.12), inset 0 0 0 3px rgba(0,0,0,0.05)',
            transform: `rotateY(${(1 - turn) * -90}deg) translate(${go * -260}px, ${go * 260}px) scale(${1 - go * 0.55})`, opacity: Math.min(1, turn * 2) * (1 - go * 0.6),
          }}>
            <svg width="300" height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
              <defs><linearGradient id="liq" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2997FF" /><stop offset="1" stopColor="#0058B8" /></linearGradient></defs>
              <path d={`M0 ${level - top + wave(0)} ${Array.from({ length: 16 }, (_, i) => `L${i * 20} ${level - top + wave(i * 20)}`).join(' ')} L300 ${level - top + wave(300)} L300 ${H} L0 ${H} Z`} fill="url(#liq)" />
            </svg>
            <div style={{ position: 'absolute', left: 34, top: 30, width: 26, height: H - 120, borderRadius: 13, background: 'rgba(255,255,255,0.55)' }} />
          </div>
        </AbsoluteFill>
        {/* marca de "reservado" */}
        <div style={{ position: 'absolute', left: 380, top: top + H * 0.28 - 2, width: 320, height: 0, borderTop: '4px dashed rgba(29,29,31,0.35)', opacity: prog(t, 19.6, 0.4) * (1 - go) }} />
        <div style={{ position: 'absolute', left: 720, top: top + H * 0.28 - 34, opacity: Math.min(1, mark * 1.5) * (1 - go), transform: `scale(${0.6 + 0.4 * mark})`, transformOrigin: '0 50%' }}>
          <span style={{ ...text(600), fontSize: 32, color: '#fff', background: C.blue, padding: '12px 24px', borderRadius: 99, display: 'inline-flex', gap: 10, alignItems: 'center' }}>✓ Reservado</span>
        </div>
        <div style={{ position: 'absolute', top: 1418, width: 1080, textAlign: 'center', opacity: prog(t, 19.4, 0.5) * (1 - go) }}>
          <div style={{ ...text(500), fontSize: 34, color: C.ink2 }}>Reserva de impostos</div>
          <div style={{ ...display(700), fontSize: 64, color: C.ink, marginTop: 4 }}>R$ •••••</div>
        </div>
      </Camera>
    </LightBg>
  );
};
