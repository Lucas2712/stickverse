// Composição principal: monta os 6 ambientes (8 cenas) com transições que ligam um ao outro
// e as três faixas de áudio (narração, música, efeitos).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, FPS} from './theme';
import {K, DURATION, HAS_VOICE} from './timing';
import {Beam, revealClip} from './components/base';
import {E, pr} from './lib/anim';
import {SceneA} from './scenes/A_Abertura';
import {SceneB, zoomTileSize} from './scenes/B_Solucao';
import {SceneC} from './scenes/C_Gestao';
import {SceneD} from './scenes/D_Mobile';
import {SceneE} from './scenes/E_Destaque';
import {SceneF} from './scenes/F_Encerramento';
import {CUES} from './audio';
import assets from './assets.json';

const Layer: React.FC<React.PropsWithChildren<{clip?: string}>> = ({clip, children}) => (
  <AbsoluteFill style={{clipPath: clip, WebkitClipPath: clip}}>{children}</AbsoluteFill>
);

export const Kavora: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const on = (a: number, b: number) => t >= a && t <= b;

  // transições
  const bP = pr(t, K.com - 0.36, 0.5, E.inOut); // feixe de farol: A → B
  const tile = zoomTileSize(t); // ícone do app abre o escuro: B → C
  const cClip = (() => {
    const s = Math.min(tile, 4200);
    const ix = (1080 - s) / 2, iy = (1920 - s) / 2;
    return `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${s * 0.27}px)`;
  })();
  const dR = pr(t, K.tudo - 0.45, 0.55, E.inOut) * 2400; // brasa laranja sobe: C → D
  const burst = pr(t, K.kavora2 - 0.28, 0.42, E.in); // check estoura: D → E
  const eR = 150 * (1 + burst * burst * 13);
  const fP = pr(t, K.tecnologia - 0.16, 0.5, E.inOut); // feixe: E → F

  // música: base, crescimento no laranja, pico no impacto, cauda no fim
  const musicVol = (f: number) => {
    const s = f / FPS;
    const base = interpolate(s, [0, 0.6, K.tudo - 1.2, K.tudo, K.kavora2 - 0.2, K.kavora2 + 0.4, K.fim, DURATION - 0.4, DURATION],
      [0, 0.5, 0.55, 0.8, 0.85, 1, 0.7, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return base * assets.music.gain * (HAS_VOICE ? 0.55 : 1);
  };

  return (
    <AbsoluteFill style={{background: C.off}}>
      {on(0, K.com + 0.2) && <Layer><SceneA t={t} /></Layer>}
      {on(K.com - 0.4, K.tenha + 0.15) && (
        <Layer clip={bP < 1 ? revealClip(bP) : undefined}><SceneB t={t} /></Layer>
      )}
      {on(K.com - 0.4, K.com + 0.2) && <Beam p={bP} color={C.white} width={560} />}
      {on(K.tenha - 0.45, K.tudo + 0.15) && tile > 60 && (
        <Layer clip={tile < 4200 ? cClip : undefined}><SceneC t={t} /></Layer>
      )}
      {on(K.tudo - 0.45, K.kavora2 + 0.15) && (
        <Layer clip={dR < 2400 ? `circle(${dR}px at 540px 2050px)` : undefined}><SceneD t={t} /></Layer>
      )}
      {on(K.kavora2 - 0.32, K.tecnologia + 0.4) && burst > 0 && (
        <Layer clip={eR < 2400 ? `circle(${eR}px at 540px 1000px)` : undefined}><SceneE t={t} /></Layer>
      )}
      {on(K.tecnologia - 0.2, 99) && (
        <Layer clip={fP < 1 ? revealClip(fP) : undefined}><SceneF t={t} /></Layer>
      )}
      {on(K.tecnologia - 0.2, K.tecnologia + 0.4) && <Beam p={fP} color={C.white} width={560} />}

      {/* áudio */}
      {HAS_VOICE && <Audio src={staticFile(assets.voice.file)} volume={1} />}
      {assets.music.file && (
        <Audio src={staticFile(assets.music.file)} startFrom={Math.round(assets.music.start * FPS)} volume={musicVol} />
      )}
      {CUES.map(([f, at, g], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(4 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${f}.wav`)} volume={g * assets.sfxGain} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
