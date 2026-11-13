import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Phone } from '../components/Phone';
import { Icon } from '../components/Icon';
import { Words } from '../components/Words';
import { Plumb } from '../components/Plumb';

// 6 · "O app que separa o que é seu e o que é do negócio. Automaticamente." (11,70–16,70)
const ROWS = [
  { l: 'Mercado', i: 'cart', p: true }, { l: 'Cliente · projeto', i: 'in', p: false }, { l: 'Farmácia', i: 'pill', p: true },
  { l: 'Nota fiscal', i: 'doc', p: false }, { l: 'Academia', i: 'dumbbell', p: true }, { l: 'Software', i: 'laptop', p: false },
  { l: 'Aluguel', i: 'home2', p: true },
];
export const S06Separa = ({ a }) => {
  const t = useT(a);
  const ph = spr(t, 11.72, { damping: 16, stiffness: 120 });
  const pPers = prog(t, 13.41, 0.75, inOut), pNeg = prog(t, 14.26, 0.75, inOut);
  const zoom = prog(t, 16.3, 0.4, expoIn);
  const head1 = 1 - prog(t, 15.0, 0.3, expoIn);
  const autoK = spr(t, 15.21, { damping: 14, stiffness: 150 });
  const chk = prog(t, 15.35, 0.5);
  let ip = 0, in_ = 0;
  return (
    <LightBg>
      <Camera t={t} a={11.7} b={16.7} from={1.0} to={1.05} style={{ transform: `scale(${1 + zoom * 1.8})`, transformOrigin: '50% 40%', filter: `blur(${zoom * 14}px)`, opacity: 1 - prog(t, 16.55, 0.15) }}>
        <div style={{ position: 'absolute', top: 210, width: 1080, textAlign: 'center', opacity: head1, filter: `blur(${(1 - head1) * 12}px)` }}>
          <Words t={t} style={{ ...display(500), fontSize: 62, color: C.ink2 }} words={[{ w: 'O', s: 11.89 }, { w: 'app', s: 12.18 }, { w: 'que', s: 12.42 }]} />
          <Words t={t} style={{ ...display(700), fontSize: 120, color: C.ink, lineHeight: 1.08 }} words={[{ w: 'separa', s: 12.57 }]} />
        </div>
        <div style={{ position: 'absolute', top: 240, width: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, opacity: Math.min(1, autoK * 1.5), transform: `translateY(${(1 - autoK) * 40}px)`, filter: `blur(${(1 - Math.min(1, autoK)) * 12}px)` }}>
          <svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill={C.blue} /><path d="M28 50l13 13 27-29" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 * (1 - chk)} /></svg>
          <span style={{ ...display(700), fontSize: 92, color: C.ink }}>Automaticamente.</span>
        </div>
        <AbsoluteFill style={{ perspective: 2200 }}>
          <div style={{ position: 'absolute', left: 260, top: 470, transform: `translateY(${(1 - ph) * 80}px) rotateY(${map(t, [11.7, 16.7], [-16, -6])}deg) rotateX(${map(t, [11.7, 16.7], [7, 3])}deg)`, opacity: Math.min(1, ph * 2) }}>
            <Phone w={560} h={1160}>
              <div style={{ position: 'absolute', left: 30, top: 86, ...text(500), fontSize: 24, color: C.ink2 }}>Novembro</div>
              <div style={{ position: 'absolute', left: 30, top: 118, ...display(700), fontSize: 44, color: C.ink }}>Movimentações</div>
              {/* cabeçalhos das colunas */}
              <div style={{ position: 'absolute', left: 22, top: 200, width: 226, textAlign: 'center', ...text(600), fontSize: 26, padding: '10px 0', borderRadius: 99, background: C.blueTint, color: C.blue, opacity: prog(t, 13.3, 0.4), transform: `scale(${0.8 + 0.2 * prog(t, 13.3, 0.4)})` }}>Pessoal</div>
              <div style={{ position: 'absolute', left: 262, top: 200, width: 226, textAlign: 'center', ...text(600), fontSize: 26, padding: '10px 0', borderRadius: 99, background: C.blue, color: '#fff', opacity: prog(t, 14.15, 0.4), transform: `scale(${0.8 + 0.2 * prog(t, 14.15, 0.4)})` }}>Negócio</div>
              {ROWS.map((r, i) => {
                const k = r.p ? pPers : pNeg;
                const idx = r.p ? ip++ : in_++;
                const enterK = prog(t, 11.95 + i * 0.07, 0.5);
                const x = lerp(16, r.p ? 22 : 262, k), y = lerp(200 + i * 112, 280 + idx * 118, k), w = lerp(480, 226, k);
                const blue = !r.p && k > 0.5;
                return (
                  <div key={i} style={{
                    position: 'absolute', left: x, top: y + (1 - enterK) * 40, width: w, height: 100, boxSizing: 'border-box', opacity: enterK,
                    background: r.p && k > 0.5 ? '#fff' : '#fff', borderRadius: 26, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 14,
                    boxShadow: k > 0 && k < 1 ? '0 18px 30px rgba(0,0,0,0.14)' : '0 2px 8px rgba(0,0,0,0.05)',
                    border: `2px solid ${r.p ? `rgba(0,113,227,${0.0 + 0.25 * pPers})` : `rgba(0,113,227,${0.6 * pNeg})`}`,
                  }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: blue ? C.blue : (r.p && k > 0.5 ? C.blueTint : '#F2F2F7') }}>
                      <Icon name={r.i} size={32} color={blue ? '#fff' : (r.p && k > 0.5 ? C.blue : C.ink)} />
                    </div>
                    <div style={{ ...text(500), fontSize: lerp(30, 22, k), color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{r.l}</div>
                    {k < 0.4 && <div style={{ ...text(500), fontSize: 28, color: C.ink3, opacity: 1 - k * 2.5 }}>R$ •••</div>}
                  </div>
                );
              })}
            </Phone>
          </div>
        </AbsoluteFill>
        {/* fio de prumo cortando a lista */}
        <Plumb x={540 + 0} top={-20} len={map(prog(t, 12.5, 0.6), [0, 1], [0, 1520])} size={60} angle={0} opacity={1 - prog(t, 14.9, 0.4)} />
      </Camera>
    </LightBg>
  );
};
