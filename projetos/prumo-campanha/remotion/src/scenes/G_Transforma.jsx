import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, lerp, inOut, expoIn } from '../animations/motion';
import { W, FIM } from '../audio/timeline';
import { Desk3D } from '../components/Desk3D';
import { Words } from '../components/Words';

// ATO 6 · "Porque administrar um negócio já é um grande desafio. Acompanhar suas finanças não precisa ser mais um deles."
const key = (t, ks) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) { const [a, A] = ks[i], [b, B] = ks[i + 1]; if (t <= b) { const p = inOut((t - a) / (b - a)); const o = {}; for (const k in A) o[k] = lerp(A[k], B[k], p); return o; } }
  return ks.at(-1)[1];
};
export const G_Transforma = ({ a }) => {
  const t = useT(a);
  const tAco = W(6, 'Acompanhar'), tNao = W(6, 'não'), tFim = FIM(6);
  const cam = key(t, [
    [a, { x: 900, y: 330, s: 1.15, rx: 58, rz: -8 }],
    [tAco - 0.4, { x: 640, y: 250, s: 1.2, rx: 60, rz: -20 }],
    [tAco + 2.4, { x: 680, y: 330, s: 0.78, rx: 26, rz: -6 }],
    [tFim + 1.2, { x: 680, y: 330, s: 0.74, rx: 22, rz: -4 }],
  ]);
  const inK = prog(t, a, 0.35);
  const warm = prog(t, a, 2.0);
  const fio = prog(t, tAco + 0.6, 0.9, inOut);
  const white = prog(t, tFim + 0.4, 0.7, inOut);
  const l1 = prog(t, W(6, 'Porque'), 0.4), l1o = prog(t, tAco - 0.3, 0.3, expoIn);
  return (
    <AbsoluteFill style={{ background: '#EFEAE2', opacity: inK }}>
      <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 18% 0%, rgba(255,246,228,${0.6 + 0.3 * warm}), rgba(255,246,228,0) 70%)` }} />
      <Desk3D cam={cam} st={{ t, caos: 0, org: 1, ev: {} }} />
      {/* fio de prumo descendo sobre a mesa até o notebook */}
      <div style={{ position: 'absolute', left: 538.5, top: 0, width: 3, height: fio * 820, background: 'rgba(29,29,31,0.5)' }} />
      <div style={{ position: 'absolute', left: 540 - 22, top: fio * 820 - 6, width: 44, height: 64, opacity: fio > 0 ? 1 : 0 }}>
        <svg width="44" height="64" viewBox="0 0 40 58"><rect x="15" y="0" width="10" height="7" rx="2" fill={C.blue} /><path d="M6 9h28l-2 14L20 57 8 23z" fill={C.ink} /></svg>
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,25,5,0.15) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 640, background: 'linear-gradient(180deg, rgba(245,243,239,0.92) 55%, rgba(245,243,239,0))', opacity: l1 * (1 - l1o) }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, height: 860, background: 'linear-gradient(0deg, rgba(245,243,239,0.97) 62%, rgba(245,243,239,0))', opacity: prog(t, tAco - 0.2, 0.5) }} />
      <div style={{ position: 'absolute', top: 260, width: 1080, textAlign: 'center', opacity: l1 * (1 - l1o), filter: `blur(${l1o * 10}px)` }}>
        <Words t={t} style={{ ...display(500), fontSize: 64, color: C.ink2 }} words={[{ w: 'administrar', s: W(6, 'administrar') }, { w: 'um', s: W(6, 'um', 1) }, { w: 'negócio', s: W(6, 'negócio') }]} />
        <Words t={t} style={{ ...display(700), fontSize: 108, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'já', s: W(6, 'já') }, { w: 'é', s: W(6, 'é') }, { w: 'um', s: W(6, 'um', 2) }, { w: 'grande', s: W(6, 'grande') }, { w: 'desafio.', s: W(6, 'desafio') }]} />
      </div>
      <div style={{ position: 'absolute', top: 1260, width: 1080, textAlign: 'center' }}>
        <Words t={t} style={{ ...display(500), fontSize: 64, color: C.ink2 }} words={[{ w: 'Acompanhar', s: tAco }, { w: 'suas', s: W(6, 'suas') }, { w: 'finanças', s: W(6, 'finanças') }]} />
        <Words t={t} style={{ ...display(700), fontSize: 104, color: C.ink, lineHeight: 1.06 }} words={[{ w: 'não', s: tNao, style: { color: C.blue } }, { w: 'precisa', s: W(6, 'precisa') }, { w: 'ser', s: W(6, 'ser') }]} />
        <Words t={t} style={{ ...display(700), fontSize: 104, color: C.ink, lineHeight: 1.06 }} words={[{ w: 'mais', s: W(6, 'mais') }, { w: 'um', s: W(6, 'um', 3) }, { w: 'deles.', s: W(6, 'deles') }]} />
      </div>
      <AbsoluteFill style={{ background: C.bg, opacity: white }} />
    </AbsoluteFill>
  );
};
