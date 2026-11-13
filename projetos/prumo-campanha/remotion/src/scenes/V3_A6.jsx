import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { kf, GLIDE, DIVE } from '../animations/cam';
import { W, B, FIM, MUS } from '../audio/timeline';
import { World, At, Letters } from '../components/Motion';
import { Icon } from '../components/Icon';
import { AppIcon } from '../components/Brand';
import { Mask } from '../components/AppUI';
import { POS1, Clientes, Vendas, Pagamentos, Operacao } from './V3_A1';

// ATO 6 · retorno ao canvas da abertura, agora em ordem: deslizes calmos, ✓ em cada frente, Finanças entra no centro → mergulho na bússola
export const V3_A6 = ({ a }) => {
  const t = useT(a);
  const tAdm = W(6, 'administrar'), tDes = W(6, 'desafio'), tAco = W(6, 'Acompanhar'), tNao = W(6, 'não'), tDel = W(6, 'deles');
  const { C: Cc, V, P, O } = POS1;
  const keys = [
    [a, { x: -60, y: -500, s: 0.46, rz: -2, rx: 8 }, GLIDE],
    [tDes, { x: 60, y: -440, s: 0.44, rz: 2, rx: 6 }, GLIDE],
    [tAco + 0.4, { x: 0, y: 640, s: 0.36, rz: 0, rx: 0 }, GLIDE],
    [MUS.V4 - 0.75, { x: 0, y: 560, s: 0.4, rz: 0, rx: 0 }, DIVE],
    [MUS.V4 + 0.05, { x: 0, y: -60, s: 6, rz: 0, rx: 0 }],
  ];
  const fin = spr(t, B(tAco + 0.15), { damping: 14, stiffness: 140 });
  const push = lerp(0, 1, fin);
  const white = prog(t, MUS.V4 - 0.15, 0.25);
  const done = a - 6;                                            // painéis já completos
  const panels = [[Cc, Clientes], [V, Vendas], [P, Pagamentos], [O, Operacao]];
  return (
    <AbsoluteFill style={{ background: '#ECEEF2' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(80% 50% at 30% 10%, #FFFFFF, rgba(255,255,255,0) 70%)' }} />
      <World t={t} keys={keys} id="mb-a6">
        {panels.map(([[x, y], Comp], i) => {
          const ok = spr(t, B(a + 0.6 + i * ((tDes - a) / 4)), { damping: 11, stiffness: 190 });
          return (
            <At key={i} x={x * (1 + push * 0.22)} y={y * (1 + push * 0.18)} w={1000} h={1480} s={1 - push * 0.15}>
              <Comp t={t} s={done} />
              <div style={{ position: 'absolute', right: 60, top: 60, width: 150, height: 150, borderRadius: 75, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ok})`, boxShadow: '0 20px 40px rgba(0,113,227,0.35)' }}><Icon name="check" size={90} color="#fff" stroke={3.2} /></div>
            </At>
          );
        })}
        <At x={0} y={0} z={200} w={1300} h={760} s={lerp(0.3, 1, fin)} rot={(1 - fin) * -12} style={{ opacity: Math.min(1, fin * 2) }}>
          <div style={{ width: 1300, height: 760, borderRadius: 100, background: '#fff', border: `12px solid ${C.blue}`, boxSizing: 'border-box', padding: 80, boxShadow: '0 60px 140px rgba(0,60,140,0.28)', display: 'flex', alignItems: 'center', gap: 70 }}>
            <AppIcon size={300} dark style={{ borderRadius: 84, flexShrink: 0 }} />
            <div><div style={{ ...display(700), fontSize: 140, color: C.ink, lineHeight: 1 }}>finanças</div><div style={{ display: 'flex', gap: 50, marginTop: 40 }}>{['Entradas', 'Saídas', 'Reserva'].map((l, j) => <div key={l}><div style={{ ...text(500), fontSize: 44, color: C.ink2 }}>{l}</div><Mask size={70} color={j === 2 ? C.blue : C.ink} /></div>)}</div></div>
          </div>
        </At>
      </World>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 620, background: 'linear-gradient(180deg, rgba(236,238,242,0.97) 62%, rgba(236,238,242,0))', opacity: 1 - prog(t, tAco - 0.2, 0.25) }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1180, height: 740, background: 'linear-gradient(0deg, rgba(236,238,242,0.97) 66%, rgba(236,238,242,0))', opacity: prog(t, tAco - 0.15, 0.3) }} />
      <div style={{ position: 'absolute', top: 230, width: 1080, textAlign: 'center', opacity: 1 - prog(t, tAco - 0.2, 0.25) }}>
        <div style={{ ...display(500), fontSize: 60, color: C.ink2, opacity: prog(t, tAdm - 0.1, 0.3) }}>administrar um negócio</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Letters t={t} s={W(6, 'já')} text="já é um grande desafio." size={92} stagger={0.018} /></div>
      </div>
      <div style={{ position: 'absolute', top: 1360, width: 1080, textAlign: 'center' }}>
        <div style={{ ...display(500), fontSize: 60, color: C.ink2, opacity: prog(t, tAco - 0.1, 0.3) }}>acompanhar suas finanças</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Letters t={t} s={tNao} text="não precisa ser" size={100} stagger={0.02} color={C.ink} /></div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -20 }}><Letters t={t} s={W(6, 'mais')} text="mais um deles." size={100} stagger={0.02} color={C.blue} /></div>
      </div>
      <AbsoluteFill style={{ background: '#F5F5F7', opacity: white }} />
    </AbsoluteFill>
  );
};
