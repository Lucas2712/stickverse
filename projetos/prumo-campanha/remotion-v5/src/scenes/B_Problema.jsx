import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn } from '../animations/motion';
import { W } from '../audio/timeline';
import { LightBg } from '../components/Stage';
import { Words } from '../components/Words';
import { Icon } from '../components/Icon';
import { Paper } from '../components/Desk3D';

// ATO 2 · "Quando você não consegue visualizar claramente o que entra, o que sai e o que ainda precisa pagar..."
// Tudo aponta para lados diferentes. Em «fica» a composição CONGELA (o tempo interno para), perde cor e é varrida.
const rnd = (i, k) => Math.sin(i * 127.1 + k * 311.7) * 0.5 + 0.5;
const Card = ({ ic, red, w = 300 }) => (
  <div style={{ width: w, padding: 22, borderRadius: 30, background: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.12)', display: 'flex', gap: 16, alignItems: 'center' }}>
    <div style={{ width: 58, height: 58, borderRadius: 16, background: red ? '#FFE5E3' : C.blueTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={32} color={red ? C.red : C.blue} /></div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ height: 11, width: '80%', borderRadius: 6, background: 'rgba(29,29,31,0.16)' }} /><div style={{ height: 11, width: '50%', borderRadius: 6, background: 'rgba(29,29,31,0.09)' }} /></div>
  </div>
);
const Sheet = () => (
  <div style={{ width: 520, padding: 18, borderRadius: 18, background: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
    {Array.from({ length: 7 }, (_, r) => <div key={r} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>{Array.from({ length: 6 }, (_, c) => <div key={c} style={{ flex: 1, height: 28, borderRadius: 3, background: r === 0 ? '#D9DCE3' : (r + c) % 5 === 0 ? '#FFE5E3' : '#F0F1F4' }} />)}</div>)}
  </div>
);
export const B_Problema = ({ a }) => {
  const tReal = useT(a);
  const tFreeze = W(2, 'fica');
  const t = Math.min(tReal, tFreeze + 0.12);               // o tempo da composição para no congelamento
  const frz = prog(tReal, tFreeze, 0.5);
  const wipe = prog(tReal, W(2, 'negócio') - 0.7, 0.9, inOut);   // lâmina branca limpa a tela
  const tIn = prog(tReal, W(2, 'Quando') - 0.3, 0.5);
  const tEntra = W(2, 'entra'), tSai = W(2, 'sai'), tPagar = W(2, 'precisa');
  const drift = (i) => ({ x: Math.sin(t * 0.7 + i) * 14, y: Math.cos(t * 0.6 + i * 2) * 12 });
  // cards que entram (azuis) e saem (escuros), cada um num ângulo
  const cardsIn = [0, 1, 2].map((i) => ({ i, k: prog(t, tEntra - 0.1 + i * 0.12, 0.7), x: 90 + i * 40, y: 640 + i * 190, rot: -18 + rnd(i, 1) * 30, ic: 'in' }));
  const cardsOut = [0, 1, 2].map((i) => ({ i, k: prog(t, tSai - 0.05 + i * 0.12, 0.7), x: 660 - i * 30, y: 720 + i * 180, rot: 10 + rnd(i, 2) * 30, ic: 'card' }));
  return (
    <AbsoluteFill style={{ opacity: tIn }}>
      <LightBg>
        <AbsoluteFill style={{ filter: `grayscale(${frz}) blur(${frz * 2.5}px)`, transform: `scale(${1.0 + (t - a) * 0.012})` }}>
          {/* papéis que vieram da mesa, girando devagar em profundidade */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'absolute', left: rnd(i, 3) * 820 - 60, top: 380 + rnd(i, 4) * 1100, transform: `rotate(${(rnd(i, 5) - 0.5) * 80 + t * (i % 2 ? 6 : -6)}deg) scale(${0.8 + rnd(i, 6) * 0.4})`, filter: `blur(${1.5 + i * 0.6}px)`, opacity: 0.85 }}><Paper /></div>
          ))}
          {/* setas: entra (azul, vindo da esquerda) e sai (grafite, indo para a direita), em direções diferentes */}
          {Array.from({ length: 6 }, (_, i) => {
            const isIn = i < 3, s = isIn ? tEntra + i * 0.1 : tSai + (i - 3) * 0.1;
            const k = prog(t, s, 0.8);
            const ang = isIn ? -25 + i * 22 : 155 + (i - 3) * 25;
            const x0 = isIn ? -200 : 540, x1 = isIn ? 380 : 1180;
            return (
              <div key={i} style={{ position: 'absolute', left: lerp(x0, x1, k), top: 560 + i * 150 + Math.sin(i) * 60, opacity: k > 0 ? Math.min(1, k * 3) * (1 - Math.max(0, k - 0.85) * 4) : 0, transform: `rotate(${isIn ? ang * 0.3 : -ang * 0.1}deg)` }}>
                <svg width="230" height="60" viewBox="0 0 230 60"><path d="M10 30H200M180 10l24 20-24 20" stroke={isIn ? C.blue : C.ink} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={isIn ? 0.9 : 0.75} /></svg>
              </div>
            );
          })}
          {[...cardsIn, ...cardsOut].map((c, j) => {
            const d = drift(j);
            const pre = prog(t, W(2, 'Quando') + j * 0.18, 0.7) * 0.5;
            const v = Math.max(pre, c.k);
            return <div key={j} style={{ position: 'absolute', left: c.x + d.x + (1 - c.k) * (j < 3 ? -60 : 60), top: c.y + d.y + (1 - c.k) * 60, opacity: Math.min(1, v * 2), transform: `rotate(${c.rot * c.k + (1 - c.k) * (j % 2 ? 30 : -30)}deg) scale(${0.85 + 0.15 * c.k})`, filter: `blur(${(1 - v) * 9}px)` }}><Card ic={c.ic} red={c.ic === 'card'} /></div>;
          })}
          {/* boletos carimbados + planilhas sobrepostas, em batidas */}
          {[0, 1, 2].map((i) => {
            const k = spr(t, tPagar + i * 0.22, { damping: 14, stiffness: 200 });
            return <div key={i} style={{ position: 'absolute', left: 120 + i * 260, top: 1050 - i * 90, transform: `rotate(${(rnd(i, 7) - 0.5) * 40}deg) scale(${1.3 - 0.3 * k})`, opacity: Math.min(1, k * 2) }}><Paper tag="vence" /></div>;
          })}
          {[0, 1].map((i) => {
            const k = spr(t, tPagar + 0.6 + i * 0.3, { damping: 16, stiffness: 180 });
            return <div key={i} style={{ position: 'absolute', left: i ? 380 : 40, top: i ? 640 : 1260, transform: `rotate(${i ? 9 : -12}deg) translateX(${(1 - k) * (i ? 700 : -700)}px)`, opacity: 0.95 }}><Sheet /></div>;
          })}
          {/* «visualizar claramente» — a palavra «claramente» não consegue ficar nítida */}
          <div style={{ position: 'absolute', top: 270, width: 1080, textAlign: 'center' }}>
            <Words t={t} style={{ ...display(500), fontSize: 64, color: C.ink2, padding: '0 60px' }} words={[{ w: 'Quando', s: W(2, 'Quando') }, { w: 'você', s: W(2, 'você') }, { w: 'não', s: W(2, 'não') }, { w: 'consegue', s: W(2, 'consegue') }, { w: 'visualizar', s: W(2, 'visualizar') }]} />
            <div style={{ ...display(700), fontSize: 140, color: C.ink, lineHeight: 1.05, opacity: prog(t, W(2, 'claramente') - 0.05, 0.4), filter: `blur(${4 + Math.sin(t * 9) * 2.5}px)`, transform: `translateX(${Math.sin(t * 13) * 5}px)` }}>claramente</div>
          </div>
        </AbsoluteFill>
        {/* véu de congelamento */}
        <AbsoluteFill style={{ background: `rgba(245,245,247,${frz * 0.45})` }} />
        <div style={{ position: 'absolute', top: 1420, width: 1080, textAlign: 'center', opacity: 1 - wipe }}>
          <Words t={tReal} style={{ ...display(500), fontSize: 60, color: C.ink2 }} words={[{ w: 'a', s: W(2, 'a', 1) }, { w: 'verdadeira', s: W(2, 'verdadeira') }]} />
          <Words t={tReal} style={{ ...display(700), fontSize: 96, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'situação', s: W(2, 'situação') }, { w: 'financeira', s: W(2, 'financeira') }]} />
        </div>
        {/* lâmina branca subindo */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${wipe * 100}%`, background: C.bg, boxShadow: wipe > 0 && wipe < 1 ? '0 -30px 60px rgba(255,255,255,0.9)' : 'none' }} />
      </LightBg>
    </AbsoluteFill>
  );
};
