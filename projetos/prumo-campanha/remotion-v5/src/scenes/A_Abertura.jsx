import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoIn, expoOut } from '../animations/motion';
import { W, B } from '../audio/timeline';
import { LightBg } from '../components/Stage';
import { Words } from '../components/Words';
import { AREAS, AreaCard, Chip } from '../components/Cards2D';

// ATO 1 (2D) · "Empreender já exige muita coisa. Você cuida dos clientes, das vendas, dos pagamentos e de toda a operação.
// Mas, no meio de tantas responsabilidades, manter as finanças organizadas também pode se tornar um grande desafio."
const rnd = (i, k) => Math.sin(i * 127.1 + k * 311.7) * 0.5 + 0.5;
const POS = [[95, 560], [545, 560], [95, 960], [545, 960]];
export const A_Abertura = ({ a }) => {
  const t = useT(a);
  const tVoce = W(1, 'Você'), tMas = W(1, 'Mas'), tManter = W(1, 'manter'), tUm = W(1, 'um'), tQuando = W(2, 'Quando');
  const hUp = prog(t, tVoce - 0.15, 0.6, inOut);                  // título sobe e abre espaço para os cards
  const chaos = prog(t, tMas - 0.1, 2.2, inOut);
  const dim = prog(t, tUm - 0.15, 0.6, inOut);                    // caos recua para o «grande desafio»
  const out = prog(t, tQuando - 0.3, 0.45, expoIn);
  const ev = [W(1, 'clientes'), W(1, 'vendas'), W(1, 'pagamentos'), W(1, 'operação')].map((x) => B(x, 0.15));
  return (
    <LightBg>
      <AbsoluteFill style={{ transform: `scale(${1 + (t - a) * 0.006 + out * 0.25})`, filter: `blur(${out * 12}px)`, opacity: 1 - out }}>
        {/* título */}
        <div style={{ position: 'absolute', top: lerp(700, 250, hUp), width: 1080, textAlign: 'center', transform: `scale(${lerp(1, 0.62, hUp)})`, transformOrigin: '50% 0%', opacity: 1 - prog(t, tMas - 0.2, 0.35, expoIn) }}>
          <Words t={t} dur={0.4} style={{ ...display(700), fontSize: 176, color: C.ink, lineHeight: 1 }} words={[{ w: 'Empreender', s: W(1, 'Empreender') + 0.02 }]} />
          <Words t={t} dur={0.4} style={{ ...display(500), fontSize: 76, color: C.ink2, marginTop: 18 }} words={[{ w: 'já', s: W(1, 'já') }, { w: 'exige', s: W(1, 'exige') }, { w: 'muita', s: W(1, 'muita') }, { w: 'coisa.', s: W(1, 'coisa') }]} />
        </div>
        {/* 4 frentes da rotina */}
        {AREAS.map((ar, i) => {
          const k = spr(t, ev[i] - 0.06, { damping: 14, stiffness: 170 });
          const p = prog(t, ev[i], 1.0, expoOut);
          const [x, y] = POS[i];
          const jit = chaos * Math.sin(t * 14 + i * 2) * 4;
          const rot = chaos * (rnd(i, 1) - 0.5) * 16;
          return (
            <div key={ar.k} style={{ position: 'absolute', left: x + jit + chaos * (rnd(i, 2) - 0.5) * 80, top: y + chaos * (rnd(i, 3) - 0.5) * 120, opacity: Math.min(1, k * 2) * (1 - dim * 0.7), transform: `scale(${(0.7 + 0.3 * k) * (1 - chaos * 0.12)}) rotate(${rot}deg)`, filter: `blur(${dim * 6}px)` }}>
              <AreaCard a={ar} p={p} t={t} w={440} h={370} />
            </div>
          );
        })}
        {/* acúmulo: tarefas e notificações chegando de todos os lados, cada vez mais rápido */}
        {Array.from({ length: 16 }, (_, i) => {
          const s = tMas + 0.05 + Math.pow(i / 16, 0.8) * (tUm - tMas - 0.2);
          const k = spr(t, s, { damping: 15, stiffness: 190 });
          const fromL = i % 2 === 0, red = i >= 8 && i % 3 !== 0;
          const tx = 60 + rnd(i, 4) * 700, ty = 420 + rnd(i, 5) * 1050;
          return (
            <div key={i} style={{ position: 'absolute', left: lerp(fromL ? -420 : 1200, tx, k), top: ty, opacity: Math.min(1, k * 2) * (1 - dim * 0.65), transform: `rotate(${(rnd(i, 6) - 0.5) * 34 * k}deg) scale(${0.85 + rnd(i, 7) * 0.25})`, filter: `blur(${dim * 5}px)`, zIndex: 10 + i }}>
              <Chip ic={red ? 'doc' : ['bell', 'chat', 'in', 'cart'][i % 4]} red={red} />
            </div>
          );
        })}
        <div style={{ position: 'absolute', top: 720, width: 1080, textAlign: 'center', zIndex: 50 }}>
          <Words t={t} dur={0.4} style={{ ...display(500), fontSize: 70, color: C.ink2 }} words={[{ w: 'um', s: tUm }]} />
          <Words t={t} dur={0.4} style={{ ...display(700), fontSize: 168, color: C.ink, lineHeight: 1.02 }} words={[{ w: 'grande', s: W(1, 'grande') }, { w: 'desafio.', s: W(1, 'desafio') }]} />
        </div>
      </AbsoluteFill>
    </LightBg>
  );
};
