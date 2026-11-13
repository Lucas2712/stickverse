import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, progT, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { W, FIM, DURACAO, MUS } from '../audio/timeline';
import { Letters } from '../components/Motion';
import { LightBg } from '../components/Stage';
import { Compass3D } from '../components/Compass3D';
import { Touch } from '../components/AppUI';
import { Leak } from '../components/Leak';

// ATO 7 · bússola 3D em close, câmera girando → trava em «Prumo.» → vira ícone → o fio do prumo desce e vira o botão
export const FH3 = () => { const p = W(7, 'Prumo'); return { a: MUS.V4, spin: MUS.V4 + 0.1, settle: p, morph: p + 0.05 }; };
const arc = (k, x0, y0, x1, y1, h) => [lerp(x0, x1, k), lerp(y0, y1, k) - Math.sin(k * Math.PI) * h];
export const V3_A7 = ({ a }) => {
  const t = useT(a);
  const f = FH3();
  const srch = progT(t, a, f.settle - a, inOut);
  const mo = progT(t, f.settle + 0.05, 0.55, inOut);
  const up = progT(t, f.settle + 0.5, 0.6, inOut);
  const iconY = lerp(960, 700, up);
  const tag1 = W(7, 'organização'), tag2 = W(7, 'Mais', 2), tCta = FIM(7) + 0.1, tTap = tCta + 1.0;
  const o1 = prog(t, tag2 - 0.2, 0.25, expoIn);
  const o2 = prog(t, tCta - 0.15, 0.3, expoIn);
  const fio = prog(t, tCta - 0.1, 0.35, expoOut);              // fio desce do ícone
  const btnW = spr(t, tCta + 0.22, { damping: 14, stiffness: 170 });
  const press = t > tTap && t < tTap + 0.3 ? Math.sin(((t - tTap) / 0.3) * Math.PI) : 0;
  const ripple = prog(t, tTap, 0.7);
  const drift = (t - a);
  return (
    <AbsoluteFill>
      <LightBg>
        {/* luz azul orbitando o fundo */}
        <div style={{ position: 'absolute', left: 540 + Math.cos(drift * 0.6) * 260 - 700, top: 900 + Math.sin(drift * 0.6) * 340 - 700, width: 1400, height: 1400, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,113,227,0.16), rgba(0,113,227,0))', opacity: mo }} />
        {/* anel gigante de marcações da bússola girando atrás de tudo */}
        <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: 0.55 * mo }}>
          <g transform={`translate(540 ${iconY}) rotate(${drift * 9})`}>{Array.from({ length: 72 }, (_, i) => { const a2 = (i / 72) * Math.PI * 2, R = 640, l = i % 6 === 0 ? 34 : 14; return <line key={i} x1={Math.sin(a2) * R} y1={Math.cos(a2) * R} x2={Math.sin(a2) * (R - l)} y2={Math.cos(a2) * (R - l)} stroke={i === 0 ? '#0071E3' : '#1D1D1F'} strokeOpacity={i % 6 === 0 ? 0.35 : 0.15} strokeWidth={i % 6 === 0 ? 4 : 2} />; })}</g>
        </svg>
        <AbsoluteFill style={{ perspective: 1800 }}><AbsoluteFill style={{ transformOrigin: `540px ${iconY + 200}px`, transform: `scale(${1.0 + Math.max(0, t - f.morph) * 0.018}) rotateX(${Math.sin(drift * 0.9) * 5 * mo}deg) rotateY(${Math.cos(drift * 0.7) * 7 * mo}deg) translateY(${Math.sin(drift * 1.3) * 10}px)` }}>
          {/* anéis e satélites girando em volta da marca */}
          {[0, 1, 2].map((r) => { const R = 250 + r * 120; return <div key={r} style={{ position: 'absolute', left: 540 - R, top: iconY - R, width: R * 2, height: R * 2, borderRadius: '50%', border: `${3 - r}px dashed rgba(0,113,227,${0.3 - r * 0.07})`, transform: `rotate(${drift * (r % 2 ? -16 : 12)}deg) scale(${lerp(0.4, 1, mo)})`, opacity: mo }} />; })}
          {Array.from({ length: 16 }, (_, i) => { const R = 250 + (i % 3) * 120, ang = i * 0.39 + drift * (0.8 + (i % 3) * 0.25) * (i % 2 ? -1 : 1), z = 10 + (i % 4) * 5; return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(ang) * R - z / 2, top: iconY + Math.sin(ang) * R - z / 2, width: z, height: z, borderRadius: z / 2, background: i % 3 ? C.blue : '#fff', boxShadow: '0 0 16px rgba(0,113,227,0.7)', opacity: mo * 0.9 }} />; })}
          {/* bússola 3D → ícone */}
          <Compass3D t={t} f={f} cx={540} cy={iconY} size={lerp(760, 270, mo) * (1 + (t > f.settle ? 0.07 * Math.exp(-(t - f.settle) * 7) : 0))} orbit={lerp(0.95, 0, srch) + Math.sin(drift * 1.6) * 0.05 * (1 - srch) + Math.sin(Math.max(0, t - f.settle - 0.7) * 1.4) * 0.38 * mo} tilt={lerp(-0.9, 0, srch) + Math.sin(drift * 0.9) * 0.08 * mo} roll={lerp(-0.6, 0, srch)} glow={progT(t, f.settle, 0.3)} logo="dark" />
          <div style={{ position: 'absolute', top: iconY + 170, width: 1080, display: 'flex', justifyContent: 'center' }}>
            <Letters t={t} s={f.settle + 0.72} text="prumo" size={200} stagger={0.035} fade />
          </div>
          {/* «Seu negócio precisa de direção.» — palavras chegam em arco, vindas da órbita */}
          <div style={{ position: 'absolute', top: iconY + 410, width: 1080, display: 'flex', justifyContent: 'center', gap: 18, opacity: 1 - o1, filter: `blur(${o1 * 10}px)` }}>
            {['Seu', 'negócio', 'precisa', 'de', 'direção.'].map((w, i) => {
              const k = progT(t, tag1 - 0.05 + i * 0.07, 0.5, expoOut);
              const dx = (1 - k) * (i < 2 ? -700 : 700), dy = -Math.sin(k * Math.PI) * 50;
              return <span key={w} style={{ display: 'inline-block', ...display(i === 4 ? 700 : 600), fontSize: 62, color: i === 4 ? C.blue : C.ink, transform: `translate(${dx}px, ${dy}px) rotate(${(1 - k) * (i < 2 ? -16 : 16)}deg)`, opacity: Math.min(1, k * 2.5), whiteSpace: 'nowrap' }}>{w}</span>;
            })}
          </div>
          {/* «Suas contas, finalmente no lugar.» — palavras caem e «no lugar» encaixa */}
          <div style={{ position: 'absolute', top: iconY + 410, width: 1080, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px', padding: '0 60px', boxSizing: 'border-box', opacity: 1 - o2 }}>
            {['Suas', 'contas,', 'finalmente', 'no', 'lugar.'].map((w, i) => { const k = spr(t, tag2 + 0.1 + i * 0.08, { damping: i > 2 ? 8 : 14, stiffness: 220 }); return <span key={w} style={{ ...display(i > 2 ? 700 : 600), fontSize: 60, color: i > 2 ? C.blue : C.ink, display: 'inline-block', transform: `translateY(${(1 - k) * -50}px) rotate(${(1 - k) * (i % 2 ? 14 : -14)}deg)`, opacity: Math.min(1, k * 2) }}>{w}</span>; })}
          </div>
          {/* o fio do prumo desce do ícone e vira o botão */}
          <div style={{ position: 'absolute', left: 538.5, top: iconY + 135, width: 3, height: fio * (1230 - iconY - 135) * (1 - prog(t, tCta + 0.3, 0.2)), background: C.blue }} />
          <div style={{ position: 'absolute', left: 190, top: 1230, width: 700, height: 160 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 80, border: `5px solid ${C.blue}`, transform: `scale(${1 + ripple * 0.35})`, opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0 }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 80, background: 'linear-gradient(180deg,#1A85F0,#0071E3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...display(600), fontSize: 64, color: '#fff', boxShadow: '0 24px 60px rgba(0,113,227,0.38), inset 0 1px 0 rgba(255,255,255,0.3)', transform: `scaleX(${lerp(0.03, 1, btnW)}) scaleY(${lerp(0.25, 1, Math.min(1, btnW * 1.4))}) scale(${1 - press * 0.06})`, opacity: fio > 0.95 ? 1 : 0 }}>
              <span style={{ opacity: prog(t, tCta + 0.45, 0.3), transform: `scaleX(${1 / Math.max(0.2, lerp(0.03, 1, btnW))})` }}>Conheça o Prumo</span>
            </div>
          </div>
          {btnW > 0.3 && <Touch x={lerp(880, 640, prog(t, tCta + 0.45, 0.5, inOut))} y={lerp(1650, 1320, prog(t, tCta + 0.45, 0.5, inOut))} press={press} opacity={prog(t, tCta + 0.45, 0.25) * (1 - prog(t, tTap + 0.5, 0.25))} />}
          <div style={{ position: 'absolute', top: 1460, width: 1080, textAlign: 'center', ...text(500), fontSize: 26, color: C.ink2, opacity: prog(t, tCta + 0.8, 0.5) }}>Marca fictícia · telas e dados demonstrativos</div>
        </AbsoluteFill></AbsoluteFill>
        {/* impacto da trava: duas ondas que saem da bússola */}
        {[0, 0.12].map((dl, r) => { const k = progT(t, f.settle + dl, 0.9, expoOut); return k > 0 && k < 1 ? <div key={r} style={{ position: 'absolute', left: 540 - 900 * k, top: 960 - 900 * k, width: 1800 * k, height: 1800 * k, borderRadius: '50%', border: `${(1 - k) * (r ? 6 : 14)}px solid rgba(0,113,227,${0.45 * (1 - k)})` }} /> : null; })}
        <Leak p={progT(t, f.settle - 0.05, 1.0)} seed={9} strength={1} />
      </LightBg>
    </AbsoluteFill>
  );
};
