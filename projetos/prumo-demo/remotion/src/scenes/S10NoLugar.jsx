import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, inOut, expoIn } from '../animations/motion';
import { BlueBg } from '../components/Stage';
import { AppIcon, Wordmark } from '../components/Brand';
import { Words } from '../components/Words';
import { Icon } from '../components/Icon';
import { Plumb } from '../components/Plumb';

// 10 · "Prumo. Suas contas, finalmente no lugar." (25,45–29,80) — NIVELAR: tudo trava alinhado
const MINI = [['in', 'Entradas'], ['doc', 'Boletos'], ['bell', 'Avisos'], ['house', 'Pessoal'], ['bag', 'Negócio'], ['chart', 'Relatório']];
export const S10NoLugar = ({ a }) => {
  const t = useT(a);
  const fall = prog(t, 25.5, 0.25, expoIn);
  const open = prog(t, 25.7, 0.45, inOut);
  const brand = spr(t, 25.88, { damping: 13, stiffness: 150 });
  const lock = spr(t, 28.84, { damping: 10, stiffness: 190 });
  const clip = `inset(0 ${50 - 50 * open}% 0 ${50 - 50 * open}%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>
        <BlueBg t={t}>
          <AbsoluteFill style={{ transform: `scale(${map(t, [25.7, 29.8], [1.0, 1.05])})` }}>
            <div style={{ position: 'absolute', top: 420, width: 1080, display: 'flex', justifyContent: 'center' }}>
              <AppIcon size={190} style={{ transform: `scale(${brand})` }} />
            </div>
            <div style={{ position: 'absolute', top: 650, width: 1080, display: 'flex', justifyContent: 'center', opacity: Math.min(1, brand * 1.6), transform: `translateY(${(1 - brand) * 40}px)` }}>
              <Wordmark size={200} color="#fff" />
            </div>
            <div style={{ position: 'absolute', top: 930, width: 1080, textAlign: 'center' }}>
              <Words t={t} style={{ ...display(500), fontSize: 68, color: 'rgba(255,255,255,0.8)' }} words={[{ w: 'Suas', s: 26.96 }, { w: 'contas,', s: 27.39 }, { w: 'finalmente', s: 28.05 }]} />
              <Words t={t} style={{ ...display(700), fontSize: 132, color: '#fff', lineHeight: 1.08 }} words={[{ w: 'no', s: 28.75 }, { w: 'lugar.', s: 28.84 }]} />
            </div>
            {/* grade de cards: tortos → alinhados */}
            {MINI.map(([ic, l], i) => {
              const r = Math.floor(i / 3), c = i % 3;
              const k = spr(t, 26.2 + i * 0.12, { damping: 14, stiffness: 130 });
              const rnd = Math.sin(i * 78.233) * 0.5 + 0.5;
              const rot = (rnd - 0.5) * 26 * (1 - lock);
              const dx = (rnd - 0.5) * 50 * (1 - lock), dy = (Math.cos(i * 3.1) * 30) * (1 - lock);
              return (
                <div key={i} style={{
                  position: 'absolute', left: 105 + c * 300 + dx, top: 1250 + r * 130 + dy, width: 270, height: 108, borderRadius: 30,
                  background: 'rgba(255,255,255,0.14)', border: '2px solid rgba(255,255,255,0.32)', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', color: '#fff',
                  transform: `rotate(${rot}deg) scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.5),
                }}>
                  <Icon name={ic} size={40} color="#fff" /><span style={{ ...text(600), fontSize: 30 }}>{l}</span>
                </div>
              );
            })}
          </AbsoluteFill>
        </BlueBg>
      </AbsoluteFill>
      {t < 25.95 && <Plumb x={540} top={-20} len={map(fall, [0, 1], [0, 900])} size={72} opacity={1 - prog(t, 25.82, 0.12)} />}
    </AbsoluteFill>
  );
};
