// Cenas 05 e 06 (fundo laranja): «Uma gestão mais inteligente» com «inteligente» circulado;
// «começa com tudo conectado» → smartphone 3D com o app do hotel vivo, e os ícones de vidro
// se ligam ao aparelho por linhas que se desenham. O aparelho mergulha na câmera e abre a cena 07.
import React from 'react';
import {C, FONT} from '../theme';
import {K} from '../timing';
import {Abs, GlassIcon, OrangeBg, Rise, Scribble} from '../components/base';
import {drift, E, mix, pr, sp, SP, clamp} from '../lib/anim';
import {Stage} from '../three/Stage';
import {Phone3D} from '../three/Phone3D';

const FLOAT = [
  // [ícone, x, y, tamanho, camada(0 longe, 1 meio, 2 perto)]
  ['calendar', 190, 380, 150, 1], ['wallet', 890, 330, 130, 0], ['cart', 110, 930, 120, 0], ['chart', 960, 860, 170, 2],
  ['gear', 880, 1500, 150, 1], ['conc', 180, 1540, 190, 2], ['bell', 560, 230, 100, 0], ['bed', 560, 1730, 120, 0], ['users', 70, 1230, 140, 1],
] as const;

export const PHONE_DIVE = () => K.kavora - 0.62;

export const SceneD: React.FC<{t: number}> = ({t}) => {
  const tPhone = K.comeca - 0.3;
  const tDive = PHONE_DIVE();

  const txtOut = pr(t, tPhone, 0.5, E.in);
  const circ = pr(t, K.inteligente + 0.12, 0.55, E.draw);
  const phIn = sp(t, tPhone, SP.heavy);
  const dive = pr(t, tDive, 0.48, E.in);
  const screenP = clamp((t - tPhone - 0.05) / 1.1);
  const alert = pr(t, K.conectado + 0.35, 0.45, E.out);
  const linkP = pr(t, K.conectado - 0.05, 0.6, E.draw);

  return (
    <Abs>
      <OrangeBg t={t} />
      {/* ícones de vidro em 3 camadas de parallax */}
      {FLOAT.map(([ic, x, y, s, layer], i) => {
        const p = sp(t, K.gestao - 0.35 + i * 0.045, SP.snappy);
        const par = [0.4, 0.75, 1.25][layer];
        const dy = drift(t, i, 18 * par, 0.22) - (t - K.gestao) * 30 * par;
        const dx = drift(t, i + 20, 12 * par, 0.18);
        const blur = (layer === 0 ? 3.5 : layer === 2 ? 2.5 : 0) + dive * 8;
        return (
          <div key={i} style={{position: 'absolute', left: x - s / 2 + dx, top: y - s / 2 + dy, transform: `scale(${p * (1 + dive * par * 1.8)}) rotate(${drift(t, i + 5, 10, 0.2) - 10 + i * 4}deg)`,
            filter: blur > 0.2 ? `blur(${blur}px)` : undefined, opacity: Math.min(1, p * 1.4) * (1 - dive)}}>
            <GlassIcon icon={ic} size={s} />
          </div>
        );
      })}

      {/* «tudo conectado»: linhas dos ícones até o aparelho */}
      {linkP > 0 && (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - dive}}>
          {FLOAT.map(([, x, y, , layer], i) => {
            if (layer === 0) return null;
            const tx = 540 + (x < 540 ? -170 : 170), ty = 960 + (y - 960) * 0.35;
            const mx = (x + tx) / 2, my = Math.min(y, ty) - 40;
            return <path key={i} d={`M${x} ${y} Q${mx} ${my} ${tx} ${ty}`} fill="none" stroke={C.white} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={`${linkP} 1`} pathLength={1} opacity={0.75} />;
          })}
        </svg>
      )}

      {/* «Uma gestão mais inteligente» */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: FONT,
        transform: `translateY(${-txtOut * 520}px) scale(${1 - txtOut * 0.45})`, opacity: 1 - txtOut}}>
        <div style={{fontSize: 76, fontWeight: 600, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.035em'}}>
          <Rise id="d1" t={t} t0={K.gestao - 0.05} text="Uma" style={{fontSize: 76}} />{' '}
          <Rise id="d2" t={t} t0={K.gestao + 0.12} text="gestão" style={{fontSize: 76}} />{' '}
          <Rise id="d3" t={t} t0={K.gestao + 0.5} text="mais" style={{fontSize: 76}} />
        </div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 10}}>
          <Rise id="d4" t={t} t0={K.inteligente - 0.06} text="inteligente" cfg="bouncy" style={{fontSize: 150, fontWeight: 700, color: C.white, letterSpacing: '-0.05em'}} />
          <Scribble w={980} h={330} vb="0 0 980 330" p={circ} color={C.white} width={8} style={{left: -110, top: -60}}
            d="M760 52 C 600 6, 280 12, 110 70 C -20 120, 10 250, 220 288 C 450 330, 830 312, 925 220 C 990 150, 930 70, 700 40" />
        </div>
      </div>

      {/* smartphone 3D */}
      {t > tPhone - 0.05 && (
        <Stage cam={[0, 0, 16]} warm env={1}>
          <Phone3D
            p={screenP} t={t} alert={alert}
            position={[mix(0.4, 0, phIn) * (1 - dive), mix(-11, -0.35, phIn) * (1 - dive) + drift(t, 1, 0.06) * (1 - dive), dive * 14]}
            rotation={[
              mix(-1.05, -0.1, phIn) * (1 - dive) + drift(t, 2, 0.035) * (1 - dive),
              mix(0.75, -0.28, phIn) * (1 - dive) + (t - tPhone) * 0.08 * (1 - dive),
              mix(0.25, 0.05, phIn) * (1 - dive),
            ]}
            scale={1.04}
          />
        </Stage>
      )}
    </Abs>
  );
};
