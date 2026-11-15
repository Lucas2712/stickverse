// Cenas 01 (Abertura) e 02 (O problema): mesmo ambiente claro, a frase continua e os gastos desabam.
import React from 'react';
import {C, FONT, SHADOW} from '../theme';
import {K} from '../timing';
import {Abs, Blur, Glass, Icon, LightBg, Rise, Scribble} from '../components/base';
import {drift, E, pr, sp, SP, tw, shutter, mix} from '../lib/anim';
import {Stage} from '../three/Stage';
import {Key3D, Nozzle3D} from '../three/objects';

const EXP = [
  {icon: 'fuel', label: 'Combustível', v: 'R$ 289,90', x: 250, y: 470, r: -8, s: 0.96, z: 0},
  {icon: 'wrench', label: 'Oficina', v: 'R$ 740,00', x: 815, y: 600, r: 7, s: 0.84, z: 1.2},
  {icon: 'tax', label: 'IPVA', v: 'R$ 1.320,00', x: 255, y: 1330, r: 6, s: 0.9, z: 0.6},
  {icon: 'parking', label: 'Estacionamento', v: 'R$ 32,00', x: 800, y: 1230, r: -5, s: 1.0, z: 0},
  {icon: 'warn', label: 'Multa', v: 'R$ 195,23', x: 600, y: 1480, r: 3, s: 0.74, z: 2.6},
];

const ExpenseCard: React.FC<{e: (typeof EXP)[number]}> = ({e}) => (
  <Glass w={440} h={156} r={38}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, height: '100%', padding: '0 28px'}}>
      <div style={{width: 84, height: 84, borderRadius: 24, background: 'rgba(255,113,56,0.12)', display: 'grid', placeItems: 'center', flex: 'none'}}>
        <Icon name={e.icon} size={46} />
      </div>
      <div style={{fontFamily: FONT}}>
        <div style={{fontSize: 28, fontWeight: 500, color: '#8A8B8F'}}>{e.label}</div>
        <div style={{fontSize: 44, fontWeight: 600, color: C.graphite, letterSpacing: '-0.02em'}}>{e.v}</div>
      </div>
    </div>
  </Glass>
);

const PlusRing: React.FC<{x: number; y: number; r: number; p: number; t: number; icon: 'plus' | 'x'; seed: number}> = ({x, y, r, p, t, icon, seed}) => (
  <div style={{
    position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(247,247,245,0.6))',
    boxShadow: 'inset 0 0 0 2.5px rgba(232,232,230,1), 0 30px 60px rgba(32,33,36,0.06)',
    transform: `scale(${p}) rotate(${(1 - p) * -90 + drift(t, seed, 6, 0.2)}deg)`, opacity: Math.min(1, p * 1.5),
    display: 'grid', placeItems: 'center',
  }}>
    <Icon name={icon} size={r * 1.1} color={'#D6D6D3'} stroke={1.2} />
  </div>
);

export const SceneA: React.FC<{t: number}> = ({t}) => {
  const tEnd = K.com - 0.3; // saída (feixe de farol)
  const cam = 1 + 0.06 * pr(t, 0, 3.2, E.inOutSoft);

  // linha 1 sobe e encolhe quando entra a linha 2
  const l1 = pr(t, K.nao - 0.1, 0.55, E.inOut);
  const exitP = pr(t, tEnd - 0.05, 0.5, E.in);
  const exitX = (tt: number) => -1300 * pr(tt, tEnd - 0.05, 0.5, E.in);

  // 3D: chave e bico entram com peso e "focam" ao pousar
  const kIn = sp(t, K.carro - 0.45, SP.heavy);
  const nIn = sp(t, 0.15, SP.settle);
  const out3 = pr(t, K.nao + 0.25, 0.7, E.in);
  const blur3 = 7 * (1 - Math.min(1, (kIn + nIn) / 2)) + out3 * 8;

  // cartões de despesa
  const cardIn = (i: number, tt: number) => sp(tt, K.nao + 0.02 + i * 0.075, SP.heavy);

  // ✕ e anéis
  const xP = sp(t, K.nao + 0.42, SP.bouncy);
  const scrib = pr(t, K.complicado + 0.18, 0.55, E.draw);

  return (
    <Abs>
      <LightBg t={t} ringP={pr(t, 0, 1.4, E.outSoft)} />
      <Abs style={{transform: `scale(${cam})`}}>
        {/* anéis com + nos cantos */}
        <PlusRing x={1010} y={300} r={170} p={sp(t, 0.1, SP.settle)} t={t} icon="plus" seed={1} />
        <PlusRing x={60} y={1720} r={190} p={sp(t, 0.35, SP.settle)} t={t} icon="plus" seed={2} />

        {/* objetos 3D com profundidade de campo */}
        <Stage style={{filter: blur3 > 0.3 ? `blur(${blur3.toFixed(2)}px)` : undefined}} cam={[0, 0, 16]}>
          <Key3D
            position={[mix(4.6, 2.05, kIn) + out3 * 3, mix(7.5, 3.15, kIn) + drift(t, 1, 0.08) + out3 * 2.5, mix(3, 0.5, kIn)]}
            rotation={[mix(1.2, 0.35, kIn) + drift(t, 2, 0.06), mix(-2.2, -0.55, kIn) + t * 0.12, mix(0.8, -0.5, kIn)]}
            scale={0.78}
          />
          <Nozzle3D
            position={[mix(-5.5, -1.95, nIn) - out3 * 3, mix(-7.5, -3.35, nIn) + drift(t, 3, 0.07) - out3 * 2.5, mix(2, -0.8, nIn)]}
            rotation={[mix(-0.8, 0.25, nIn), mix(1.6, 0.6, nIn) + t * 0.1, mix(-1, 0.42, nIn)]}
            scale={0.62}
          />
        </Stage>

        {/* cartões de despesa caindo em profundidade */}
        {EXP.map((e, i) => {
          const p = cardIn(i, t);
          if (p <= 0) return null;
          const yOf = (tt: number) => mix(-420 - i * 60, e.y, cardIn(i, tt)) + drift(tt, i + 10, 6, 0.3);
          const xOf = (tt: number) => e.x + exitX(tt) * (1 + i * 0.08);
          const vy = (yOf(t) - yOf(t - 1 / 120)) * 120;
          const vx = (xOf(t) - xOf(t - 1 / 120)) * 120;
          const depthBlur = e.z;
          return (
            <div key={i} style={{position: 'absolute', left: xOf(t) - 220, top: yOf(t) - 78, transform: `scale(${e.s}) rotate(${e.r * p + (1 - p) * (i % 2 ? 40 : -40) + drift(t, i, 1.5, 0.25)}deg)`, filter: depthBlur ? `blur(${depthBlur}px)` : undefined}}>
              <Blur id={`exp${i}`} x={Math.min(14, shutter(vx, 0.45))} y={Math.min(14, shutter(vy, 0.45))}>
                <ExpenseCard e={e} />
              </Blur>
            </div>
          );
        })}

        {/* ✕ acima da frase */}
        <div style={{position: 'absolute', left: 540 - 62 + exitX(t) * 0.9, top: 640 - 62, width: 124, height: 124, borderRadius: '50%',
          background: 'linear-gradient(160deg, #FFFFFF, #F7F7F5)', boxShadow: SHADOW.card + ', inset 0 0 0 2px rgba(232,232,230,1)',
          transform: `scale(${xP}) rotate(${(1 - xP) * 120}deg)`, display: 'grid', placeItems: 'center', opacity: Math.min(1, xP * 2)}}>
          <Icon name="x" size={64} color={C.orange} stroke={2.2} />
        </div>

        {/* frase */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', transform: `translateX(${exitX(t)}px)`}}>
          <div style={{transform: `translateY(${-150 * l1}px) scale(${1 - 0.28 * l1})`, opacity: 1 - 0.55 * l1, transformOrigin: '50% 50%'}}>
            <div style={{fontSize: 76, fontWeight: 500, color: C.graphite, letterSpacing: '-0.03em', lineHeight: 1.12}}>
              <Rise id="w1" t={t} t0={K.controlar} text="Controlar" style={{fontSize: 76}} />{' '}
              <Rise id="w2" t={t} t0={K.controlar + 0.24} text="os" style={{fontSize: 76}} />{' '}
              <Rise id="w3" t={t} t0={K.gastos} text="gastos" style={{fontSize: 76}} />
            </div>
            <div style={{fontSize: 76, fontWeight: 500, color: C.graphite, letterSpacing: '-0.03em', lineHeight: 1.12}}>
              <Rise id="w4" t={t} t0={K.gastos + 0.26} text="do" style={{fontSize: 76}} />{' '}
              <Rise id="w5" t={t} t0={K.gastos + 0.38} text="seu" style={{fontSize: 76}} />{' '}
              <Rise id="w6" t={t} t0={K.carro} text="carro" style={{fontSize: 76, fontWeight: 700}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 70, opacity: t > K.nao - 0.12 ? 1 : 0}}>
            <div style={{fontSize: 64, fontWeight: 500, color: C.graphite, letterSpacing: '-0.03em'}}>
              <Rise id="w7" t={t} t0={K.nao - 0.02} text="não" style={{fontSize: 64}} />{' '}
              <Rise id="w8" t={t} t0={K.nao + 0.2} text="precisa" style={{fontSize: 64}} />{' '}
              <Rise id="w9" t={t} t0={K.nao + 0.5} text="ser" style={{fontSize: 64}} />
            </div>
            <div style={{position: 'relative', display: 'inline-block', marginTop: 6}}>
              <Rise id="w10" t={t} t0={K.complicado - 0.05} text="complicado" cfg="bouncy" style={{fontSize: 132, fontWeight: 700, color: C.orange, letterSpacing: '-0.045em'}} />
              <Scribble w={640} h={70} p={scrib} width={9} style={{left: 0, top: 150}} vb="0 0 640 70"
                d="M18 34 C 140 18, 320 16, 520 22 C 560 24, 600 26, 622 30 M 120 54 C 260 44, 420 42, 560 48" />
            </div>
          </div>
        </div>
      </Abs>
      <Abs style={{background: C.off, opacity: 0 * exitP}} />
    </Abs>
  );
};
