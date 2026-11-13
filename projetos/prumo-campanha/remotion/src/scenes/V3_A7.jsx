import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { W, FIM, DURACAO, MUS } from '../audio/timeline';
import { Letters, Sheen } from '../components/Motion';
import { LightBg } from '../components/Stage';
import { Compass } from '../components/Compass';
import { Touch } from '../components/AppUI';

// ATO 7 · BÚSSOLA em plano de destaque com câmera girando em 3D → trava em «Prumo.» → ícone → nome → assinaturas → chamada
export const FH3 = () => { const p = W(7, 'Prumo'); return { a: MUS.V4, spin: MUS.V4 + 0.15, settle: p, morph: p + 0.85 }; };
export const V3_A7 = ({ a }) => {
  const t = useT(a);
  const f = FH3(), tP = W(7, 'Prumo');
  const orbit = prog(t, a, (f.settle - a) + 0.6, inOut);
  const up = prog(t, f.morph + 0.2, 0.7, inOut);
  const flare = prog(t, f.settle + 0.02, 0.6);
  const tag1 = W(7, 'organização'), tag2 = W(7, 'Mais', 2), tCta = FIM(7) + 0.15, tTap = tCta + 0.9;
  const cta = spr(t, tCta, { damping: 12, stiffness: 170 });
  const press = t > tTap && t < tTap + 0.3 ? Math.sin(((t - tTap) / 0.3) * Math.PI) : 0;
  const ripple = prog(t, tTap, 0.7);
  const o1 = prog(t, tag2 - 0.2, 0.25, expoIn);
  return (
    <AbsoluteFill>
      <LightBg>
        <div style={{ position: 'absolute', left: 540 - 800, top: 760 - 800, width: 1600, height: 1600, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(0,113,227,${0.18 * flare * (1 - up * 0.5)}), rgba(0,113,227,0))` }} />
        <AbsoluteFill style={{ transform: `translateY(${lerp(0, -230, up) * 0.8}px)`, opacity: up }}>
          {[0, 1, 2].map((r) => <div key={r} style={{ position: 'absolute', left: 540 - (300 + r * 110), top: 960 - (300 + r * 110), width: (300 + r * 110) * 2, height: (300 + r * 110) * 2, borderRadius: '50%', border: `${3 - r}px dashed rgba(0,113,227,${0.28 - r * 0.07})`, transform: `rotate(${(t - a) * (r % 2 ? -14 : 10)}deg) scale(${0.9 + 0.1 * up})` }} />)}
        </AbsoluteFill>
        <AbsoluteFill style={{ perspective: 1600, transform: `translateY(${lerp(0, -230, up)}px) scale(${1 + Math.max(0, t - f.morph) * 0.012})` }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${lerp(38, 0, orbit)}deg) rotateY(${lerp(-30, 0, orbit)}deg) rotateZ(${lerp(-18, 0, orbit)}deg) scale(${lerp(1.5, 1, orbit) * lerp(1, 0.8, up)})`, transformOrigin: '540px 960px' }}>
            <Compass t={t} f={f} cx={540} cy={960} size={640} iconTo={270} />
          </div>
        </AbsoluteFill>
        <Sheen p={flare} width={220} color="rgba(255,255,255,0.8)" />
        <div style={{ position: 'absolute', top: 960, width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${1 + Math.max(0, t - f.morph) * 0.01})` }}>
          <Letters t={t} s={f.morph + 0.62} text="prumo" size={210} stagger={0.05} fade />
        </div>
        <div style={{ position: 'absolute', top: 1220, width: 1080, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px', padding: '0 60px', boxSizing: 'border-box', opacity: 1 - o1, filter: `blur(${o1 * 10}px)` }}>
          {['Seu', 'negócio', 'precisa', 'de', 'direção.'].map((w, i) => { const k = spr(t, tag1 + i * 0.08, { damping: 14, stiffness: 200 }); return <span key={w} style={{ ...display(i === 4 ? 700 : 600), fontSize: 66, color: i === 4 ? C.blue : C.ink, transform: `translateY(${(1 - k) * 60}px)`, opacity: Math.min(1, k * 2) }}>{w}</span>; })}
        </div>
        <div style={{ position: 'absolute', top: 1220, width: 1080, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', padding: '0 60px', boxSizing: 'border-box', opacity: 1 - prog(t, tCta - 0.1, 0.25) }}>
          {['Suas', 'contas,', 'finalmente', 'no', 'lugar.'].map((w, i) => { const k = spr(t, tag2 + 0.1 + i * 0.08, { damping: i > 2 ? 9 : 14, stiffness: 210 }); return <span key={w} style={{ ...display(i > 2 ? 700 : 600), fontSize: 62, color: i > 2 ? C.blue : C.ink, transform: `translateY(${(1 - k) * 60}px) rotate(${i > 2 ? (1 - k) * -12 : 0}deg)`, opacity: Math.min(1, k * 2) }}>{w}</span>; })}
        </div>
        <div style={{ position: 'absolute', left: 170, top: 1210, width: 740, height: 170 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 85, border: `5px solid ${C.blue}`, transform: `scale(${1 + ripple * 0.35})`, opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0 }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 85, background: 'linear-gradient(180deg,#1A85F0,#0071E3)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display(600), fontSize: 66, color: '#fff', boxShadow: '0 24px 60px rgba(0,113,227,0.38), inset 0 1px 0 rgba(255,255,255,0.3)', transform: `scale(${cta * (1 - press * 0.06)})`, opacity: Math.min(1, cta * 2) }}>Conheça o Prumo</div>
        </div>
        {cta > 0.1 && <Touch x={lerp(880, 640, prog(t, tCta + 0.25, 0.55, inOut))} y={lerp(1650, 1300, prog(t, tCta + 0.25, 0.55, inOut))} press={press} opacity={prog(t, tCta + 0.25, 0.25) * (1 - prog(t, tTap + 0.5, 0.25))} />}
        <div style={{ position: 'absolute', top: 1450, width: 1080, textAlign: 'center', ...text(500), fontSize: 26, color: C.ink2, opacity: prog(t, tCta + 0.6, 0.5) }}>Marca fictícia · telas e dados demonstrativos</div>
      </LightBg>
    </AbsoluteFill>
  );
};
