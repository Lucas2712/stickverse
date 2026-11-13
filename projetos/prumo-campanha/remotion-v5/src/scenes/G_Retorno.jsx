import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoIn, expoOut } from '../animations/motion';
import { W, FIM, B } from '../audio/timeline';
import { LightBg } from '../components/Stage';
import { Words } from '../components/Words';
import { AREAS, AreaCard } from '../components/Cards2D';
import { AppIcon } from '../components/Brand';
import { Mask } from '../components/AppUI';

// ATO 6 (2D) · "Porque administrar um negócio já é um grande desafio. Acompanhar suas finanças não precisa ser mais um deles."
// As mesmas 4 frentes da abertura voltam, agora alinhadas; as finanças entram como mais uma, já resolvida pelo Prumo.
export const G_Retorno = ({ a }) => {
  const t = useT(a);
  const tAco = W(6, 'Acompanhar'), tNao = W(6, 'não'), tFim = FIM(6);
  const inK = prog(t, a, 0.3);
  const l1o = prog(t, tAco - 0.2, 0.3, expoIn);
  const fin = spr(t, B(tAco + 0.1), { damping: 14, stiffness: 150 });
  const fio = prog(t, B(tAco + 0.1) - 0.25, 0.5, expoOut);
  const white = prog(t, tFim + 0.25, 0.5, inOut);
  return (
    <AbsoluteFill style={{ opacity: inK }}>
      <LightBg>
        <AbsoluteFill style={{ transform: `scale(${1 + (t - a) * 0.008})` }}>
          <div style={{ position: 'absolute', top: 240, width: 1080, textAlign: 'center', opacity: 1 - l1o, filter: `blur(${l1o * 10}px)` }}>
            <Words t={t} dur={0.4} style={{ ...display(500), fontSize: 60, color: C.ink2 }} words={[{ w: 'Porque', s: W(6, 'Porque') }, { w: 'administrar', s: W(6, 'administrar') }, { w: 'um', s: W(6, 'um', 1) }, { w: 'negócio', s: W(6, 'negócio') }]} />
            <Words t={t} dur={0.4} style={{ ...display(700), fontSize: 100, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'já', s: W(6, 'já') }, { w: 'é', s: W(6, 'é') }, { w: 'um', s: W(6, 'um', 2) }, { w: 'grande', s: W(6, 'grande') }, { w: 'desafio.', s: W(6, 'desafio') }]} />
          </div>
          <div style={{ position: 'absolute', top: 215, width: 1080, textAlign: 'center' }}>
            <Words t={t} dur={0.4} style={{ ...display(500), fontSize: 60, color: C.ink2 }} words={[{ w: 'Acompanhar', s: tAco }, { w: 'suas', s: W(6, 'suas') }, { w: 'finanças', s: W(6, 'finanças') }]} />
            <Words t={t} dur={0.4} style={{ ...display(700), fontSize: 96, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'não', s: tNao, style: { color: C.blue } }, { w: 'precisa', s: W(6, 'precisa') }, { w: 'ser', s: W(6, 'ser') }]} />
            <Words t={t} dur={0.4} style={{ ...display(700), fontSize: 96, color: C.ink, lineHeight: 1.05 }} words={[{ w: 'mais', s: W(6, 'mais') }, { w: 'um', s: W(6, 'um', 3) }, { w: 'deles.', s: W(6, 'deles') }]} />
          </div>
          {/* as 4 frentes, alinhadas e resolvidas */}
          {AREAS.map((ar, i) => {
            const k = spr(t, a + 0.05 + i * 0.08, { damping: 15, stiffness: 160 });
            const ok = spr(t, B(W(6, 'negócio')) + i * 0.1, { damping: 11, stiffness: 200 });
            const shrink = lerp(1, 0.86, fin);
            const x = 95 + (i % 2) * 450, y = 560 + Math.floor(i / 2) * 400;
            return (
              <div key={ar.k} style={{ position: 'absolute', left: x, top: lerp(y, 520 + Math.floor(i / 2) * 340, fin), transform: `scale(${(0.8 + 0.2 * k) * shrink})`, transformOrigin: `${i % 2 ? '0%' : '100%'} 0%`, opacity: Math.min(1, k * 2) }}>
                <AreaCard a={ar} p={1} t={t} ok={ok} w={440} h={370} />
              </div>
            );
          })}
          {/* finanças: o Prumo entra como mais uma frente, já em ordem */}
          <div style={{ position: 'absolute', left: 538.5, top: 0, width: 3, height: fio * 1210, background: 'rgba(29,29,31,0.35)', opacity: 1 - prog(t, B(tAco + 0.1) + 0.6, 0.3) }} />
          <div style={{ position: 'absolute', left: 95, top: 1210, width: 890, height: 300, borderRadius: 44, background: '#fff', boxShadow: '0 24px 60px rgba(0,113,227,0.18)', border: `3px solid ${C.blue}`, boxSizing: 'border-box', padding: 34, transform: `translateY(${(1 - fin) * 400}px) scale(${0.85 + 0.15 * fin})`, opacity: Math.min(1, fin * 2), display: 'flex', alignItems: 'center', gap: 30 }}>
            <AppIcon size={130} dark style={{ borderRadius: 36, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...display(700), fontSize: 48, color: C.ink }}>Finanças</div>
              <div style={{ display: 'flex', gap: 30, marginTop: 14 }}>{['Entradas', 'Saídas', 'Reserva'].map((l, i) => <div key={l}><div style={{ ...text(500), fontSize: 24, color: C.ink2 }}>{l}</div><Mask size={34} color={i === 2 ? C.blue : C.ink} /></div>)}</div>
            </div>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: C.bg, opacity: white }} />
      </LightBg>
    </AbsoluteFill>
  );
};
