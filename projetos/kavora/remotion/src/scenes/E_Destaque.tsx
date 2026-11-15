// Cena 07: impacto. Letras KAVORA 3D peroladas chegam da câmera em cascata sobre o laranja.
import React from 'react';
import {K} from '../timing';
import {Abs, Beam, OrangeBg} from '../components/base';
import {drift, E, mix, pr, sp, SP, tw} from '../lib/anim';
import {Stage, mat} from '../three/Stage';
import {useLetterGeos} from '../three/objects';
import {C} from '../theme';

const Letters: React.FC<{t: number}> = ({t}) => {
  const geos = useLetterGeos(0.3);
  const m = React.useMemo(() => mat.pearl(), []);
  const t0 = K.kavora2 - 0.16;
  const SPIN = [[0.9, -1.4, 0.4], [-1.2, 0.8, -0.6], [1.4, 1.1, 0.3], [-0.8, -1.6, 0.5], [1.1, 0.9, -0.4], [-1.3, 1.3, 0.6]];
  return (
    <group
      scale={0.6}
      rotation={[tw(t, t0, 2.4, 0.42, 0.2, E.inOutSoft) + drift(t, 1, 0.02), tw(t, t0, 2.4, -0.75, -0.3, E.inOutSoft), tw(t, t0, 2.4, 0.06, 0.02, E.inOutSoft)]}
      position={[0, 0, tw(t, t0, 2.4, -0.6, 0.4, E.outSoft)]}
    >
      {geos.map((g, i) => {
        const p = sp(t, t0 + i * 0.055, SP.heavy);
        const s = SPIN[i];
        return (
          <mesh key={i} geometry={g.geo} material={m}
            position={[g.x * mix(1.6, 1, p), mix((i % 2 ? 1 : -1) * 2.5, 0, p), mix(13, 0, p)]}
            rotation={[s[0] * (1 - p), s[1] * (1 - p), s[2] * (1 - p)]} />
        );
      })}
    </group>
  );
};

export const SceneE: React.FC<{t: number}> = ({t}) => {
  const beam = pr(t, K.kavora2 + 0.45, 0.7, E.inOutSoft);
  const blur = (1 - Math.min(1, sp(t, K.kavora2 - 0.1, SP.heavy) * 1.1)) * 6;
  return (
    <Abs>
      <OrangeBg t={t} />
      <Abs style={{background: `radial-gradient(50% 30% at 50% 50%, rgba(255,255,255,${0.18 * pr(t, K.kavora2, 0.5)}), transparent 70%)`}} />
      <Stage cam={[0, 0, 16]} env={1.1} key3={2.6} warm style={{filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
        <Letters t={t} />
      </Stage>
      <Beam p={beam} color={C.white} opacity={0.55} width={420} />
    </Abs>
  );
};
