import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoIn } from '../animations/motion';
import { W, FIM, DURACAO, MUS } from '../audio/timeline';
import { LightBg } from '../components/Stage';
import { Compass } from '../components/Compass';
import { Wordmark } from '../components/Brand';
import { Touch } from '../components/AppUI';

// ATO 7 · BÚSSOLA (assinatura) + "Seu negócio precisa de direção." + "Suas contas, finalmente no lugar." + chamada
export const FH = () => {
  const p = W(7, 'Prumo');
  return { a: MUS.V4, spin: MUS.V4 + 0.2, settle: p + 0.05, morph: p + 0.95 };
};
export const H_Final = ({ a }) => {
  const t = useT(a);
  const f = FH();
  const inK = prog(t, a, 0.5);
  const up = prog(t, f.morph + 0.3, 0.8, inOut);
  const wm = spr(t, f.morph + 0.35, { damping: 14, stiffness: 130 });
  const tag1 = spr(t, W(7, 'organização'), { damping: 15, stiffness: 140 }), tag1o = prog(t, W(7, 'Mais', 2) - 0.15, 0.3, expoIn);
  const tag2 = spr(t, W(7, 'Mais', 2) + 0.1, { damping: 15, stiffness: 140 });
  const lugar = spr(t, W(7, 'negócio') - 0.1, { damping: 10, stiffness: 190 });
  const tCta = FIM(7) + 0.25;
  const cta = spr(t, tCta, { damping: 13, stiffness: 150 });
  const tTap = tCta + 0.95;
  const press = t > tTap && t < tTap + 0.32 ? Math.sin(((t - tTap) / 0.32) * Math.PI) : 0;
  const ripple = prog(t, tTap, 0.8);
  const fx = lerp(860, 640, prog(t, tCta + 0.3, 0.6, inOut)), fy = lerp(1650, 1290, prog(t, tCta + 0.3, 0.6, inOut));
  const disc = prog(t, tCta + 1.2, 0.6);
  const end = prog(t, DURACAO - 0.6, 0.6);
  const groupY = lerp(0, -200, up);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <LightBg>
        <AbsoluteFill style={{ transform: `translateY(${groupY}px)` }}>
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${lerp(1, 0.8, up)})`, transformOrigin: '540px 860px' }}>
            <Compass t={t} f={f} cx={540} cy={860} size={520} iconTo={250} />
          </div>
          <div style={{ position: 'absolute', top: 1010, width: 1080, display: 'flex', justifyContent: 'center', opacity: Math.min(1, wm * 1.6), transform: `translateY(${(1 - wm) * 40}px)`, filter: `blur(${(1 - Math.min(1, wm)) * 12}px)` }}>
            <Wordmark size={190} />
          </div>
          <div style={{ position: 'absolute', top: 1250, width: 1080, textAlign: 'center', ...display(600), fontSize: 62, color: C.ink, opacity: Math.min(1, tag1 * 2) * (1 - tag1o), transform: `translateY(${(1 - tag1) * 30 - tag1o * 20}px)`, filter: `blur(${tag1o * 8}px)` }}>
            Seu negócio precisa de <span style={{ color: C.blue }}>direção.</span>
          </div>
          <div style={{ position: 'absolute', top: 1250, width: 1080, textAlign: 'center', ...display(600), fontSize: 58, color: C.ink, opacity: Math.min(1, tag2 * 2) * (1 - prog(t, tCta - 0.2, 0.3)), transform: `translateY(${(1 - tag2) * 30}px)` }}>
            Suas contas, finalmente <span style={{ color: C.blue, display: 'inline-block', transform: `scale(${0.85 + 0.15 * lugar})` }}>no lugar.</span>
          </div>
        </AbsoluteFill>
        {/* chamada */}
        <div style={{ position: 'absolute', left: 190, top: 1210, width: 700, height: 160 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 80, border: `4px solid ${C.blue}`, transform: `scale(${1 + ripple * 0.3})`, opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0 }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 80, background: 'linear-gradient(180deg,#1A85F0,#0071E3)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display(600), fontSize: 62, color: '#fff', boxShadow: '0 22px 50px rgba(0,113,227,0.35), inset 0 1px 0 rgba(255,255,255,0.3)', transform: `scale(${cta * (1 - press * 0.06)})`, opacity: Math.min(1, cta * 2) }}>Conheça o Prumo</div>
        </div>
        {cta > 0.1 && <Touch x={fx} y={fy} press={press} opacity={prog(t, tCta + 0.3, 0.3) * (1 - prog(t, tTap + 0.6, 0.3))} />}
        <div style={{ position: 'absolute', top: 1450, width: 1080, textAlign: 'center', opacity: disc }}>
          <div style={{ ...text(500), fontSize: 26, color: C.ink2 }}>Marca fictícia · telas e dados demonstrativos</div>
        </div>
        <AbsoluteFill style={{ background: C.bg, opacity: end * 0.0 }} />
      </LightBg>
    </AbsoluteFill>
  );
};
