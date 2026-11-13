import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT, tilt } from '../animations/time';
import { prog, spr, map, expoIn } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Notif } from '../components/Notif';
import { Words } from '../components/Words';

// 3 · "Pix entrando, boleto vencendo," (4,40–7,45) — pilha 3D de notificações
const N = [
  { s: 4.61, icon: 'in', bg: C.blue, title: 'Transferência recebida', body: 'Pix de cliente · entrou na conta' },
  { s: 5.0, icon: 'in', bg: C.blue, title: 'Transferência recebida', body: 'Pix · pagamento de projeto' },
  { s: 5.93, icon: 'doc', bg: C.red, title: 'Boleto', tag: 'vence hoje', body: 'Aluguel do escritório' },
  { s: 6.44, icon: 'card', bg: C.red, title: 'Fatura do cartão', tag: 'vence amanhã', body: 'Compras pessoais e do trabalho' },
];
export const S03Notificacoes = ({ a }) => {
  const t = useT(a);
  const fall = prog(t, 7.1, 0.45, expoIn);
  const inS = prog(t, 4.3, 0.3);
  return (
    <LightBg>
      <Camera t={t} a={4.4} b={7.5} from={1.0} to={1.07} rot={tilt(t)} style={{ opacity: inS }}>
        <div style={{ position: 'absolute', top: 300, width: 1080, textAlign: 'center', opacity: 1 - fall }}>
          <Words t={t} style={{ ...display(700), fontSize: 110, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'Pix', s: 4.61 }, { w: 'entrando,', s: 5.02 }]} />
          <Words t={t} style={{ ...display(700), fontSize: 110, color: C.red, lineHeight: 1.05 }} words={[{ w: 'boleto', s: 5.93 }, { w: 'vencendo,', s: 6.44 }]} />
        </div>
        <AbsoluteFill style={{ perspective: 1800 }}>
          <div style={{ position: 'absolute', left: 0, top: 660, width: 1080, height: 1000, transformStyle: 'preserve-3d', transform: `rotateX(${12 - 6 * prog(t, 4.6, 2.6)}deg) rotateZ(-2deg)` }}>
            {N.map((n, i) => {
              const k = spr(t, n.s - 0.06, { damping: 16, stiffness: 170 });
              const slots = N.slice(i + 1).reduce((acc, m) => acc + spr(t, m.s - 0.06, { damping: 17, stiffness: 150 }), 0);
              const y = map(k, [0, 1], [-140, 0]) + slots * 196;
              const ex = fall * (i % 2 ? 1 : -1);
              return (
                <div key={i} style={{
                  position: 'absolute', left: 80, top: 0, opacity: Math.min(1, k * 1.6) * (1 - fall) * (1 - Math.max(0, slots - 2.2)),
                  transform: `translate3d(${ex * 120}px, ${y + fall * 700}px, 0) scale(${(1 - slots * 0.035) * (0.92 + 0.08 * k) - fall * 0.4}) rotate(${ex * 20}deg)`,
                  filter: `blur(${(1 - k) * 10 + slots * 1.1 + fall * 8}px)`, zIndex: 10 + i,
                }}>
                  <Notif icon={n.icon} iconBg={n.bg} title={n.title} body={n.body} tag={n.tag} width={920} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Camera>
    </LightBg>
  );
};
