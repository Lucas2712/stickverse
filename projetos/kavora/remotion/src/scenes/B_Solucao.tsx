// Cena 03: a KAVORA entra (emblema 3D + letreiro), as categorias empilham em perspectiva
// e se recolhem numa órbita em volta do ícone do app, que cresce e abre o ambiente escuro.
import React from 'react';
import {C, FONT} from '../theme';
import {K} from '../timing';
import {Abs, Blur, GlassIcon, LightBg, Pill} from '../components/base';
import {Tile, Wordmark} from '../components/Logo';
import {drift, E, mix, pr, shutter, sp, SP, tw} from '../lib/anim';
import {Stage} from '../three/Stage';
import {Emblem3D} from '../three/objects';

const CATS = [
  {icon: 'fuel', label: 'Combustível', k: 'combustivel'},
  {icon: 'wrench', label: 'Manutenção', k: 'manutencao'},
  {icon: 'shield', label: 'Seguro', k: 'seguro'},
  {icon: 'tax', label: 'Impostos', k: 'impostos'},
  {icon: 'calendar', label: 'Revisões', k: 'revisoes'},
] as const;

const GAP = 172;

export const SceneB: React.FC<{t: number}> = ({t}) => {
  const t0 = K.com - 0.3;
  const tPills = K.combustivel - 0.12;
  const tOrbit = K.unico - 0.15;
  const tZoom = K.tenha - 0.42;

  // ---- 3a: emblema 3D chega da câmera e pousa ----
  const eIn = sp(t, t0 + 0.05, SP.heavy);
  const lockOut = pr(t, tPills - 0.15, 0.55, E.inOut);
  const eBlur = 10 * (1 - Math.min(1, eIn * 1.15)) + lockOut * 4;
  const shine = tw(t, K.kavora + 0.35, 0.9, -0.3, 1.3, E.inOutSoft);

  // ---- 3b: pílulas ----
  const pillT = CATS.map((c) => K[c.k] - 0.1);
  const focus = (tt: number) => CATS.reduce((acc, _c, i) => acc + sp(tt, pillT[i] + 0.05, SP.soft) * (i === 0 ? 0 : 1), 0);
  const stackY = (tt: number) => -focus(tt) * GAP;
  const pillsOut = pr(t, tOrbit, 0.42, E.in);

  // ---- 3c: órbita ----
  const orbIn = (i: number) => sp(t, tOrbit + 0.12 + i * 0.06, SP.snappy);
  const tileIn = sp(t, K.aplicativo - 0.25, SP.bouncy);
  const zoom = pr(t, tZoom, 0.5, E.in);
  const ringP = pr(t, tOrbit + 0.05, 0.7, E.draw);
  const R = 300;

  return (
    <Abs>
      <LightBg t={t} rings ringP={1} />

      {/* 3a: emblema 3D + letreiro */}
      {t < tPills + 0.6 && (
        <>
          <Stage style={{filter: eBlur > 0.3 ? `blur(${eBlur.toFixed(2)}px)` : undefined, opacity: 1 - lockOut}} cam={[0, 0, 16]}>
            <Emblem3D
              size={1.75}
              position={[0, mix(-1.5, 0.95, eIn) + lockOut * 3.5 + drift(t, 1, 0.04), mix(13, 0, eIn) - lockOut * 4]}
              rotation={[mix(-0.9, 0.08, eIn) + drift(t, 2, 0.04), mix(2.6, -0.18, eIn) + (t - t0) * 0.1, mix(0.5, 0, eIn)]}
            />
          </Stage>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1035, display: 'flex', justifyContent: 'center',
            transform: `translateY(${-lockOut * 420}px) scale(${1 - lockOut * 0.35})`, opacity: 1 - lockOut}}>
            <Wordmark height={96} shine={shine}
              letter={(i) => {
                const p = sp(t, K.kavora - 0.05 + i * 0.045, SP.snappy);
                return {y: (1 - p) * 0.9, o: Math.min(1, p * 1.6), s: 0.9 + 0.1 * p};
              }} />
          </div>
        </>
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
                  <Blur id={`pill${i}`} x={shutter(vx, 0.8)}>
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

      {/* 3c: órbita de ícones em volta do app */}
      {t > tOrbit && (
        <Abs style={{transform: `scale(${1 + zoom * 0.4})`, opacity: 1}}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
            <circle cx={540} cy={960} r={R} fill="none" stroke={C.gray} strokeWidth={3} pathLength={1} strokeDasharray={`${ringP} 1`} transform="rotate(-90 540 960)" />
            <circle cx={540} cy={960} r={R * 0.62} fill="none" stroke={C.gray} strokeWidth={2} opacity={0.6} pathLength={1} strokeDasharray={`${ringP} 1`} transform="rotate(90 540 960)" />
          </svg>
          {CATS.map((c, i) => {
            const p = orbIn(i);
            const ang = (-90 + i * 72 + (t - tOrbit) * 14) * (Math.PI / 180);
            const rr = R * p + zoom * 900;
            const x = 540 + Math.cos(ang) * rr, y = 960 + Math.sin(ang) * rr;
            const vz = zoom > 0 ? shutter(900 / 0.5 * zoom, 0.6) : 0;
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

      {/* legenda discreta "em um único app" */}
      {t > K.unico - 0.1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center', fontFamily: FONT, fontSize: 44, fontWeight: 500, color: C.graphite, letterSpacing: '-0.02em',
          opacity: pr(t, K.unico + 0.05, 0.4) * (1 - pr(t, tZoom - 0.1, 0.25, E.in)), transform: `translateY(${(1 - pr(t, K.unico + 0.05, 0.6)) * 30}px)`}}>
          em um <span style={{fontWeight: 700, color: C.orange}}>único</span> aplicativo
        </div>
      )}
    </Abs>
  );
};

/** Tamanho (px) do ícone do app durante o zoom: usado pela cena escura para se revelar dentro dele. */
export const zoomTileSize = (t: number) => {
  const zoom = pr(t, K.tenha - 0.42, 0.5, E.in);
  return 200 * (1 + zoom * zoom * 14);
};
