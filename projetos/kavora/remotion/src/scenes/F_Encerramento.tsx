// Cena 08: encerramento minimalista. Emblema + letreiro, slogan cinético, rota laranja e chamada.
import React from 'react';
import {C, FONT, SHADOW} from '../theme';
import {K} from '../timing';
import {Abs, LightBg, Rise, Scribble} from '../components/base';
import {Tile, Wordmark} from '../components/Logo';
import {drift, E, mix, pr, sp, SP, tw} from '../lib/anim';

export const SceneF: React.FC<{t: number}> = ({t}) => {
  const t0 = K.tecnologia - 0.1;
  const cam = tw(t, t0, 8, 1.0, 1.045, E.inOutSoft);
  const tile = sp(t, t0 + 0.05, SP.bouncy);
  const route = pr(t, K.caminho - 0.05, 0.9, E.draw);
  const cta = sp(t, K.baixe - 0.1, SP.snappy);
  const shine = tw(t, K.fim + 0.2, 1.1, -0.3, 1.3, E.inOutSoft);
  const pulse = (Math.sin((t - K.baixe) * 5) + 1) / 2;
  const words: [string, number, React.CSSProperties?][] = [
    ['Tecnologia', K.tecnologia],
    ['que', K.tecnologia + 0.42],
    ['acompanha', K.acompanha],
    ['seu', K.acompanha + 0.45],
    ['caminho.', K.caminho, {color: C.orange, fontWeight: 600}],
  ];
  return (
    <Abs>
      <LightBg t={t} ringP={1} />
      <Abs style={{transform: `scale(${cam}) translateY(${drift(t, 3, 4, 0.1)}px)`}}>
        {/* lockup */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40}}>
          <div style={{transform: `scale(${tile}) rotate(${(1 - tile) * -30}deg)`, opacity: Math.min(1, tile * 2)}}>
            <Tile size={150} />
          </div>
          <Wordmark height={92} shine={shine}
            letter={(i) => {
              const p = sp(t, t0 + 0.12 + i * 0.045, SP.snappy);
              return {y: (1 - p) * 0.8, o: Math.min(1, p * 1.6)};
            }} />
        </div>
        {/* slogan */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', fontFamily: FONT, fontSize: 50, fontWeight: 500, color: C.graphite, letterSpacing: '-0.025em'}}>
          {words.map(([w, tt, st], i) => (
            <React.Fragment key={i}>
              <Rise id={`f${i}`} t={t} t0={tt} text={w} style={{fontSize: 50, ...st}} />{i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </div>
        {/* rota */}
        <Scribble w={1080} h={120} vb="0 0 1080 120" p={route} width={6} style={{left: 0, top: 1080}}
          d="M250 60 C 380 20, 470 100, 560 62 S 760 30, 830 58" />
        {route > 0.02 && (() => {
          // ponto viajando pela rota (aproximação por amostragem da curva)
          const u = route;
          const bez = (p0: number, p1: number, p2: number, p3: number, s: number) => (1 - s) ** 3 * p0 + 3 * (1 - s) ** 2 * s * p1 + 3 * (1 - s) * s * s * p2 + s ** 3 * p3;
          const seg = u < 0.5 ? 0 : 1, s = seg ? (u - 0.5) * 2 : u * 2;
          const x = seg ? bez(560, 650, 760, 830, s) : bez(250, 380, 470, 560, s);
          const y = seg ? bez(62, 26, 30, 58, s) : bez(60, 20, 100, 62, s);
          return <div style={{position: 'absolute', left: x - 13, top: 1080 + y - 13, width: 26, height: 26, borderRadius: 13, background: C.orange, boxShadow: `0 0 0 8px rgba(255,113,56,0.18), 0 6px 14px rgba(255,113,56,0.4)`}} />;
        })()}
        {/* chamada */}
        <div style={{position: 'absolute', left: 540 - 270, top: 1250, width: 540, height: 108, borderRadius: 54,
          background: 'linear-gradient(180deg, #FFFFFF, #F7F7F5)', boxShadow: SHADOW.card + ', inset 0 0 0 1.5px rgba(232,232,230,1)',
          transform: `translateY(${(1 - cta) * 60}px) scale(${0.85 + 0.15 * cta})`, opacity: Math.min(1, cta * 2),
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontFamily: FONT, fontSize: 38, fontWeight: 600, color: C.graphite, letterSpacing: '-0.02em'}}>
          <div style={{width: 22, height: 22, borderRadius: 11, background: C.orange, boxShadow: `0 0 0 ${6 + pulse * 10}px rgba(255,113,56,${0.25 - pulse * 0.15})`}} />
          Baixe o app <span style={{color: C.orange}}>KAVORA</span>
        </div>
      </Abs>
    </Abs>
  );
};
