// Cena 03: «Com a tecnologia certa» → emblema 3D + letreiro KAVORA.
// «você tem tudo o que precisa em um só lugar» → as palavras caem dentro de um cartão que se fecha.
// «Reservas, recepção, financeiro, compras e operação» → pílulas em perspectiva, uma por palavra.
// «Tudo integrado para simplificar sua rotina» → órbita em volta do ícone do app, que cresce e abre o escuro.
import React from 'react';
import {C, FONT, SHADOW} from '../theme';
import {K} from '../timing';
import {Abs, Blur, GlassIcon, LightBg, Pill, Rise} from '../components/base';
import {Tile, Wordmark} from '../components/Logo';
import {drift, E, mix, pr, shutter, sp, SP, tw} from '../lib/anim';
import {Stage} from '../three/Stage';
import {Emblem3D} from '../three/objects';

const CATS = [
  {icon: 'calendar', label: 'Reservas', k: 'reservas'},
  {icon: 'conc', label: 'Recepção', k: 'recepcao'},
  {icon: 'wallet', label: 'Financeiro', k: 'financeiro'},
  {icon: 'cart', label: 'Compras', k: 'compras'},
  {icon: 'gear', label: 'Operação', k: 'operacao'},
] as const;

const GAP = 172;
const TZOOM = () => K.controle - 0.44;

export const SceneB: React.FC<{t: number}> = ({t}) => {
  const t0 = K.com - 0.3;
  const tLock = K.voce - 0.25; // lockup sai, entra «tudo em um só lugar»
  const tPills = K.reservas - 0.2;
  const tOrbit = K.integrado - 0.3;
  const tZoom = TZOOM();

  // ---- 3a: emblema 3D chega da câmera e pousa ----
  const eIn = sp(t, t0 + 0.05, SP.heavy);
  const lockOut = pr(t, tLock, 0.5, E.inOut);
  const eBlur = 10 * (1 - Math.min(1, eIn * 1.15)) + lockOut * 5;
  const shine = tw(t, K.tecnologia + 0.4, 0.9, -0.3, 1.3, E.inOutSoft);

  // ---- 3a': «tudo o que precisa em um só lugar» ----
  const boxIn = sp(t, K.lugar - 0.2, SP.snappy);
  const phraseOut = pr(t, tPills - 0.05, 0.4, E.in);

  // ---- 3b: pílulas ----
  const pillT = CATS.map((c) => K[c.k] - 0.12);
  const focus = (tt: number) => CATS.reduce((acc, _c, i) => acc + (i === 0 ? 0 : sp(tt, pillT[i] + 0.04, SP.snappy)), 0);
  const stackY = (tt: number) => -focus(tt) * GAP;
  const pillsOut = pr(t, tOrbit, 0.42, E.in);

  // ---- 3c: órbita ----
  const orbIn = (i: number) => sp(t, tOrbit + 0.12 + i * 0.06, SP.snappy);
  const tileIn = sp(t, K.integrado - 0.05, SP.bouncy);
  const zoom = pr(t, tZoom, 0.5, E.in);
  const ringP = pr(t, tOrbit + 0.05, 0.7, E.draw);
  const links = pr(t, K.integrado + 0.35, 0.6, E.draw);
  const R = 300;

  return (
    <Abs>
      <LightBg t={t} rings ringP={1} />

      {/* 3a: emblema 3D + letreiro */}
      {t < tLock + 0.6 && (
        <>
          <Stage style={{filter: eBlur > 0.3 ? `blur(${eBlur.toFixed(2)}px)` : undefined, opacity: 1 - lockOut}} cam={[0, 0, 16]}>
            <Emblem3D
              size={1.75}
              position={[0, mix(-1.5, 0.95, eIn) + lockOut * 3.5 + drift(t, 1, 0.04), mix(13, 0, eIn) - lockOut * 4]}
              rotation={[mix(-0.9, 0.08, eIn) + drift(t, 2, 0.04), mix(2.6, -0.2, eIn) + (t - t0) * 0.12, mix(0.5, 0, eIn)]}
            />
          </Stage>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1035, display: 'flex', justifyContent: 'center',
            transform: `translateY(${-lockOut * 420}px) scale(${1 - lockOut * 0.35})`, opacity: 1 - lockOut}}>
            <Wordmark height={96} shine={shine}
              letter={(i) => {
                const p = sp(t, K.tecnologia - 0.05 + i * 0.045, SP.snappy);
                return {y: (1 - p) * 0.9, o: Math.min(1, p * 1.6), s: 0.9 + 0.1 * p};
              }} />
          </div>
        </>
      )}

      {/* 3a': tudo o que precisa em um só lugar */}
      {t > tLock - 0.05 && phraseOut < 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', fontFamily: FONT,
          transform: `scale(${1 - phraseOut * 0.3}) translateY(${-phraseOut * 120}px)`, opacity: 1 - phraseOut}}>
          <div style={{fontSize: 60, fontWeight: 500, color: '#8A8B8F', letterSpacing: '-0.025em'}}>
            <Rise id="b1" t={t} t0={K.voce} text="você" style={{fontSize: 60}} />{' '}
            <Rise id="b2" t={t} t0={K.voce + 0.16} text="tem" style={{fontSize: 60}} />
          </div>
          <div style={{fontSize: 120, fontWeight: 700, color: C.graphite, letterSpacing: '-0.05em', lineHeight: 1.05, marginTop: 4}}>
            <Rise id="b3" t={t} t0={K.tudo1} text="tudo" style={{fontSize: 120}} cfg="bouncy" />{' '}
            <Rise id="b4" t={t} t0={K.tudo1 + 0.3} text="o" style={{fontSize: 120}} />{' '}
            <Rise id="b5" t={t} t0={K.tudo1 + 0.5} text="que" style={{fontSize: 120}} />
          </div>
          <div style={{fontSize: 120, fontWeight: 700, color: C.graphite, letterSpacing: '-0.05em', lineHeight: 1.05}}>
            <Rise id="b6" t={t} t0={K.precisa} text="precisa" style={{fontSize: 120}} />
          </div>
          {/* cartão que se fecha em volta: «em um só lugar» */}
          <div style={{position: 'relative', display: 'inline-block', marginTop: 46, padding: '22px 46px', borderRadius: 999,
            background: `linear-gradient(150deg, ${C.orangeL}, ${C.orange})`, boxShadow: SHADOW.orange,
            transform: `scale(${0.4 + 0.6 * boxIn}) rotate(${(1 - boxIn) * -8}deg)`, opacity: Math.min(1, boxIn * 2)}}>
            <span style={{fontSize: 64, fontWeight: 600, color: C.white, letterSpacing: '-0.03em'}}>em um só lugar</span>
          </div>
        </div>
      )}

      {/* 3b: pílulas em perspectiva */}
      {t > tPills - 0.1 && t < tOrbit + 0.6 && (
        <Abs style={{perspective: 1700, perspectiveOrigin: '50% 45%'}}>
          <div style={{
            position: 'absolute', left: 540, top: 900, width: 0, height: 0,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${30 + drift(t, 3, 2)}deg) rotateY(${-12 + drift(t, 4, 3)}deg) rotateZ(${-15 + drift(t, 5, 1.5)}deg) translateY(${stackY(t)}px) scale(${1 - pillsOut * 0.45})`,
            opacity: 1 - pillsOut,
          }}>
            {CATS.map((c, i) => {
              const xOf = (tt: number) => mix(1100, 0, sp(tt, pillT[i], SP.snappy));
              const p = sp(t, pillT[i], SP.snappy);
              if (p <= 0) return null;
              const vx = (xOf(t) - xOf(t - 1 / 120)) * 120;
              return (
                <div key={c.k} style={{position: 'absolute', left: -320 + xOf(t), top: i * GAP - 68, transform: `rotateY(${(1 - p) * -40}deg) translateZ(${(1 - p) * 120}px)`, opacity: Math.min(1, p * 2)}}>
                  <Blur id={`pill${i}`} x={Math.min(18, shutter(vx, 0.6))}>
                    <Pill icon={c.icon} label={c.label} />
                  </Blur>
                </div>
              );
            })}
            {/* seta de navegação acompanhando a última categoria */}
            {(() => {
              const yy = focus(t) * GAP;
              const a = sp(t, pillT[0] + 0.15, SP.snappy);
              return (
                <svg width={60} height={60} viewBox="0 0 24 24" style={{position: 'absolute', left: 345 + drift(t, 6, 6, 0.4), top: yy - 30, transform: `rotate(${-28 + drift(t, 7, 8, 0.3)}deg) scale(${a})`}}>
                  <path d="M12 2.5l8 19-8-4.6-8 4.6z" fill={C.orange} />
                </svg>
              );
            })()}
          </div>
        </Abs>
      )}

      {/* 3c: órbita de ícones em volta do app (tudo integrado) */}
      {t > tOrbit && (
        <Abs style={{transform: `scale(${1 + zoom * 0.4})`}}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <circle cx={540} cy={960} r={R} fill="none" stroke={C.gray} strokeWidth={3} pathLength={1} strokeDasharray={`${ringP} 1`} transform="rotate(-90 540 960)" />
            <circle cx={540} cy={960} r={R * 0.62} fill="none" stroke={C.gray} strokeWidth={2} opacity={0.6} pathLength={1} strokeDasharray={`${ringP} 1`} transform="rotate(90 540 960)" />
            {/* raios laranja: cada área se liga ao centro */}
            {CATS.map((c, i) => {
              const ang = (-90 + i * 72 + (t - tOrbit) * 14) * (Math.PI / 180);
              const r0 = 120, r1 = R * orbIn(i) - 70;
              if (r1 <= r0) return null;
              return <line key={c.k} x1={540 + Math.cos(ang) * r0} y1={960 + Math.sin(ang) * r0} x2={540 + Math.cos(ang) * mix(r0, r1, links)} y2={960 + Math.sin(ang) * mix(r0, r1, links)}
                stroke={C.orange} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 12" opacity={(1 - zoom) * 0.9} />;
            })}
          </svg>
          {CATS.map((c, i) => {
            const p = orbIn(i);
            const ang = (-90 + i * 72 + (t - tOrbit) * 14) * (Math.PI / 180);
            const rr = R * p + zoom * 900;
            const x = 540 + Math.cos(ang) * rr, y = 960 + Math.sin(ang) * rr;
            const vz = zoom > 0 ? shutter((900 / 0.5) * zoom, 0.6) : 0;
            return (
              <div key={c.k} style={{position: 'absolute', left: x - 64, top: y - 64, transform: `scale(${Math.min(1.1, p)})`, opacity: Math.min(1, p * 2) * (1 - zoom)}}>
                <Blur id={`orb${i}`} x={vz * Math.abs(Math.cos(ang))} y={vz * Math.abs(Math.sin(ang))}>
                  <GlassIcon icon={c.icon} size={128} tone="light" />
                </Blur>
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 540 - 100, top: 960 - 100, transform: `scale(${tileIn * (1 + zoom * zoom * 14)}) rotate(${(1 - tileIn) * -25}deg)`}}>
            <Tile size={200} />
          </div>
        </Abs>
      )}

      {/* «Tudo integrado» + «para simplificar sua rotina» */}
      {t > K.integrado - 0.1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1370, textAlign: 'center', fontFamily: FONT, letterSpacing: '-0.03em',
          opacity: 1 - pr(t, tZoom - 0.1, 0.25, E.in)}}>
          <div style={{fontSize: 74, fontWeight: 700, color: C.graphite}}>
            <Rise id="b7" t={t} t0={K.integrado} text="Tudo" style={{fontSize: 74}} />{' '}
            <Rise id="b8" t={t} t0={K.integrado + 0.16} text="integrado" style={{fontSize: 74, color: C.orange}} />
          </div>
          <div style={{fontSize: 44, fontWeight: 500, color: '#8A8B8F', marginTop: 6}}>
            <Rise id="b9" t={t} t0={K.simplificar - 0.2} text="para" style={{fontSize: 44}} />{' '}
            <Rise id="b10" t={t} t0={K.simplificar} text="simplificar" style={{fontSize: 44}} />{' '}
            <Rise id="b11" t={t} t0={K.rotina - 0.25} text="sua" style={{fontSize: 44}} />{' '}
            <Rise id="b12" t={t} t0={K.rotina} text="rotina" style={{fontSize: 44, color: C.graphite, fontWeight: 600}} />
          </div>
        </div>
      )}
    </Abs>
  );
};

/** Tamanho (px) do ícone do app durante o zoom: usado pela cena escura para se revelar dentro dele. */
export const zoomTileSize = (t: number) => {
  const zoom = pr(t, TZOOM(), 0.5, E.in);
  return 200 * (1 + zoom * zoom * 14);
};
