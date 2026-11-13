import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, map, inOut, expoIn, lerp } from '../animations/motion';
import { W } from '../audio/timeline';
import { Desk3D } from '../components/Desk3D';
import { Words } from '../components/Words';

// ATO 1 · "Empreender já exige muita coisa..." — travelling na mesa 3D e acúmulo
const key = (t, ks) => {          // interpola câmera entre quadros-chave [t, {x,y,s,rx,rz}]
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [a, A] = ks[i], [b, B] = ks[i + 1];
    if (t <= b) { const p = inOut((t - a) / (b - a)); const o = {}; for (const k in A) o[k] = lerp(A[k], B[k], p); return o; }
  }
  return ks.at(-1)[1];
};
export const A_Mesa = ({ a }) => {
  const t = useT(a);
  const tMas = W(1, 'Mas'), tGrande = W(1, 'grande');
  const cam = key(t, [
    [0, { x: 230, y: 240, s: 1.75, rx: 60, rz: -24 }],
    [3.2, { x: 640, y: 330, s: 1.35, rx: 60, rz: -18 }],
    [6.4, { x: 980, y: 520, s: 1.3, rx: 58, rz: -12 }],
    [W(1, 'operação') - 0.15, { x: 620, y: 640, s: 1.18, rx: 57, rz: -12 }],
    [tMas, { x: 640, y: 600, s: 1.12, rx: 56, rz: -10 }],
    [tMas + 2.6, { x: 720, y: 520, s: 0.98, rx: 16, rz: -4 }],
    [tGrande + 1.4, { x: 700, y: 560, s: 1.06, rx: 10, rz: -2 }],
  ]);
  const ev = { clientes: W(1, 'clientes'), vendas: W(1, 'vendas'), pagamentos: W(1, 'pagamentos'), operacao: W(1, 'operação'), pilha: tMas + 0.4, calc: W(1, 'manter') };
  const caos = prog(t, tMas, 6, inOut);
  const zoomOut = prog(t, W(2, 'Quando') - 0.35, 0.6, expoIn);       // mergulho nos papéis → próxima cena
  const t1out = prog(t, W(1, 'Você') - 0.25, 0.3, expoIn);
  return (
    <AbsoluteFill style={{ background: '#EDE9E2' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(90% 60% at 20% 0%, #FFFDF8, rgba(255,253,248,0) 70%)' }} />
      <AbsoluteFill style={{ transform: `scale(${1 + zoomOut * 1.6})`, filter: `blur(${zoomOut * 10}px)`, opacity: 1 - zoomOut }}>
        <Desk3D cam={cam} st={{ t, caos, org: 0, ev, labelsOut: tMas - 0.1 }} />
      </AbsoluteFill>
      {/* vinheta suave (profundidade) */}
      <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,25,5,0.18) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 250, width: 1080, textAlign: 'center', opacity: 1 - t1out, filter: `blur(${t1out * 12}px)` }}>
        <Words t={t} style={{ ...display(700), fontSize: 150, color: C.ink, lineHeight: 1 }} words={[{ w: 'Empreender', s: W(1, 'Empreender') + 0.05 }]} />
        <Words t={t} style={{ ...display(500), fontSize: 66, color: C.ink, marginTop: 14 }} words={[{ w: 'já', s: W(1, 'já') }, { w: 'exige', s: W(1, 'exige') }, { w: 'muita', s: W(1, 'muita') }, { w: 'coisa.', s: W(1, 'coisa') }]} />
      </div>
      <div style={{ position: 'absolute', top: 290, width: 1080, textAlign: 'center', opacity: 1 - zoomOut }}>
        <Words t={t} style={{ ...display(500), fontSize: 66, color: C.ink2 }} words={[{ w: 'um', s: W(1, 'um') }]} />
        <Words t={t} style={{ ...display(700), fontSize: 156, color: C.ink, lineHeight: 1.02 }} words={[{ w: 'grande', s: tGrande }, { w: 'desafio.', s: W(1, 'desafio') }]} />
      </div>
    </AbsoluteFill>
  );
};
