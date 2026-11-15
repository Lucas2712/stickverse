// Composição principal: monta os 6 ambientes (8 cenas) com transições que ligam um ao outro
// e as três faixas de áudio (narração, música, efeitos).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, FPS} from './theme';
import {K, DURATION, HAS_VOICE, SPEECH} from './timing';
import {Beam, revealClip} from './components/base';
import {E, pr} from './lib/anim';
import {SceneA} from './scenes/A_Abertura';
import {SceneB, zoomTileSize} from './scenes/B_Solucao';
import {SceneC} from './scenes/C_Gestao';
import {SceneD, PHONE_DIVE} from './scenes/D_Mobile';
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
  const dR = pr(t, K.gestao - 0.45, 0.55, E.inOut) * 2400; // brasa laranja sobe: C → D
  const burst = pr(t, PHONE_DIVE() + 0.3, 0.2, E.inOutSoft); // fade quando o celular passa pela câmera // celular mergulha, letras abrem: D → E
  const fP = pr(t, K.slogan - 0.16, 0.5, E.inOut); // feixe: E → F

  // música: faixa contínua entre 12% e 18%, com ducking automático durante a fala,
  // fade-in de 1,5 s e fade-out nos 2 s finais
  const MUS = {livre: 0.18, fala: 0.12, ataque: 0.12, soltura: 0.35};
  const speaking = (s: number) => {
    // 1 durante a fala, com rampa de ataque antes e de soltura depois de cada trecho
    let v = 0;
    for (const [a, b] of SPEECH) {
      if (s >= a - MUS.ataque && s <= b + MUS.soltura) {
        const up = Math.min(1, (s - (a - MUS.ataque)) / MUS.ataque);
        const down = s > b ? 1 - (s - b) / MUS.soltura : 1;
        v = Math.max(v, Math.max(0, Math.min(up, down)));
      }
    }
    return v;
  };
  const musicVol = (f: number) => {
    const s = f / FPS;
    const duck = HAS_VOICE ? speaking(s) : 0;
    const level = MUS.livre + (MUS.fala - MUS.livre) * duck;
    const fade = Math.min(interpolate(s, [0, 1.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      interpolate(s, [DURATION - 2, DURATION], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    return level * fade * assets.music.gain;
  };

  return (
    <AbsoluteFill style={{background: C.off}}>
      {on(0, K.com + 0.2) && <Layer><SceneA t={t} /></Layer>}
      {on(K.com - 0.4, K.controle + 0.15) && (
        <Layer clip={bP < 1 ? revealClip(bP) : undefined}><SceneB t={t} /></Layer>
      )}
      {on(K.com - 0.4, K.com + 0.2) && <Beam p={bP} color={C.white} width={560} />}
      {on(K.controle - 0.5, K.gestao + 0.15) && tile > 60 && (
        <Layer clip={tile < 4200 ? cClip : undefined}><SceneC t={t} /></Layer>
      )}
      {on(K.gestao - 0.45, K.kavora + 0.15) && (
        <Layer clip={dR < 2400 ? `circle(${dR}px at 540px 2050px)` : undefined}><SceneD t={t} /></Layer>
      )}
      {on(PHONE_DIVE() + 0.16, K.slogan + 0.4) && burst > 0 && (
        <AbsoluteFill style={{opacity: burst}}><SceneE t={t} /></AbsoluteFill>
      )}
      {on(K.slogan - 0.2, 99) && (
        <Layer clip={fP < 1 ? revealClip(fP) : undefined}><SceneF t={t} /></Layer>
      )}
      {on(K.slogan - 0.2, K.slogan + 0.4) && <Beam p={fP} color={C.white} width={560} />}

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
