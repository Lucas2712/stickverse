import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, pendulum, inOut, expoIn } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Notif } from '../components/Notif';
import { AppIcon } from '../components/Brand';
import { Icon } from '../components/Icon';
import { Words } from '../components/Words';

// 7 · "Avisa antes de cada vencimento." (16,30–19,20)
export const S07Aviso = ({ a }) => {
  const t = useT(a);
  const inK = prog(t, 16.35, 0.3);
  const card = spr(t, 16.45, { damping: 15, stiffness: 130 });
  const bell = spr(t, 17.6, { damping: 13, stiffness: 140 });
  const ring = pendulum(t, 18.11, 22, 2.4, 2.6);
  const flip = prog(t, 18.9, 0.35, expoIn);
  const out = prog(t, 18.9, 0.3, expoIn);
  return (
    <LightBg>
      <Camera t={t} a={16.3} b={19.2} from={1.04} to={1.0} style={{ opacity: inK, filter: `blur(${(1 - inK) * 16}px)` }}>
        <div style={{ position: 'absolute', left: -200, top: 500, width: 1480, height: 900, background: 'radial-gradient(closest-side, rgba(0,113,227,0.16), rgba(0,113,227,0))' }} />
        <div style={{ position: 'absolute', top: 290, width: 1080, textAlign: 'center', opacity: 1 - out, filter: `blur(${out * 12}px)` }}>
          <Words t={t} style={{ ...display(700), fontSize: 132, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'Avisa', s: 16.64 }, { w: 'antes', s: 17.23 }]} />
          <Words t={t} style={{ ...display(500), fontSize: 70, color: C.ink2, marginTop: 10 }} words={[{ w: 'de', s: 17.64 }, { w: 'cada', s: 17.79 }, { w: 'vencimento.', s: 18.11, style: { color: C.blue, fontWeight: 650 } }]} />
        </div>
        <AbsoluteFill style={{ perspective: 1600 }}>
          <div style={{ position: 'absolute', left: 90, top: 760, transform: `translateY(${(1 - card) * -500}px) rotateY(${flip * 90}deg)`, opacity: Math.min(1, card * 2) }}>
            <Notif app="Prumo" icon={<AppIcon size={92} dark style={{ borderRadius: 24, flexShrink: 0 }} />} title="Conta de luz vence amanhã" body="O valor já está separado. Toque para pagar." width={900} />
          </div>
        </AbsoluteFill>
        <div style={{ position: 'absolute', left: 540 - 110, top: 1130, width: 220, height: 220, borderRadius: 110, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${bell})`, opacity: (1 - out) }}>
          <div style={{ transform: `rotate(${ring}deg)`, transformOrigin: '50% 12%' }}><Icon name="bell" size={120} color={C.blue} stroke={1.9} /></div>
          <div style={{ position: 'absolute', right: 34, top: 34, width: 34, height: 34, borderRadius: 17, background: C.blue, border: '5px solid #fff', transform: `scale(${spr(t, 18.11)})` }} />
        </div>
      </Camera>
    </LightBg>
  );
};
