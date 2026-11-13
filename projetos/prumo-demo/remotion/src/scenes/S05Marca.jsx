import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, pendulum, expoIn, inOut } from '../animations/motion';
import { BlueBg } from '../components/Stage';
import { Plumb } from '../components/Plumb';
import { AppIcon, Wordmark } from '../components/Brand';
import { Words } from '../components/Words';

// 5 · "Conheça o Prumo." (10,05–12,10) — cortina de prumo + nivelamento
export const S05Marca = ({ a }) => {
  const t = useT(a);
  const fall = prog(t, 10.08, 0.28, expoIn);            // peso despenca
  const open = prog(t, 10.3, 0.5, inOut);               // cortina abre do centro
  const lvl = spr(t, 11.04, { damping: 11, stiffness: 160 });
  const rot = -7 * (1 - lvl);
  const iconK = spr(t, 11.04, { damping: 13, stiffness: 150 });
  const back = prog(t, 11.7, 0.5, inOut);               // recuo: vira tela do celular
  const clip = `inset(0 ${50 - 50 * open}% 0 ${50 - 50 * open}%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>
        <AbsoluteFill style={{
          transform: `scale(${map(back, [0, 1], [1, 0.47])}) translateY(${back * 70}px)`, borderRadius: back * 130, overflow: 'hidden',
        }}>
          <BlueBg t={t}>
            <AbsoluteFill style={{ transform: `rotate(${rot}deg)` }}>
              <Plumb x={540} top={-20} len={map(open, [0, 1], [880, 560]) - iconK * 40} angle={pendulum(t, 10.4, 6, 0.8, 1.4) * (1 - lvl)} size={70} light opacity={1 - iconK} />
              <div style={{ position: 'absolute', top: 640, width: 1080, display: 'flex', justifyContent: 'center' }}>
                <AppIcon size={230} style={{ transform: `scale(${iconK})`, opacity: Math.min(1, iconK * 2) }} />
              </div>
              <div style={{ position: 'absolute', top: 470, width: 1080, textAlign: 'center' }}>
                <Words t={t} style={{ ...display(500), fontSize: 66, color: 'rgba(255,255,255,0.78)' }} words={[{ w: 'Conheça', s: 10.46 }, { w: 'o', s: 10.96 }]} />
              </div>
              <div style={{ position: 'absolute', top: 920, width: 1080, display: 'flex', justifyContent: 'center', opacity: Math.min(1, iconK * 1.6), transform: `translateY(${(1 - iconK) * 40}px)`, filter: `blur(${(1 - Math.min(1, iconK)) * 12}px)` }}>
                <Wordmark size={230} color="#fff" />
              </div>
              {/* linha de nível com bolha */}
              <div style={{ position: 'absolute', top: 1230, left: 290, width: 500, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.45)', opacity: prog(t, 10.6, 0.4) }}>
                <div style={{ position: 'absolute', top: -13, left: 250 - 35 + (1 - lvl) * 170, width: 70, height: 30, borderRadius: 15, border: '3px solid #fff', boxSizing: 'border-box', background: 'rgba(255,255,255,0.25)' }} />
              </div>
            </AbsoluteFill>
          </BlueBg>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* peso caindo sobre a cena anterior */}
      {t < 10.45 && <Plumb x={540} top={-20} len={map(fall, [0, 1], [0, 900])} size={72} opacity={1 - prog(t, 10.32, 0.12)} />}
    </AbsoluteFill>
  );
};
