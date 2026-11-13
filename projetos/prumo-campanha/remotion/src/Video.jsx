import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate } from 'remotion';
import { FPS, C } from './styles/tokens';
import { useFonte } from './components/Fonte';
import { N, W, FIM, DURACAO, MUS } from './audio/timeline';
import { SFX, TRILHA, volTrilha } from './audio/cues';
import { V3_A1 } from './scenes/V3_A1';
import { V3_A2 } from './scenes/V3_A2';
import { V3_A3 } from './scenes/V3_A3';
import { V3_A4 } from './scenes/V3_A4';
import { V3_A5 } from './scenes/V3_A5';
import { V3_A6 } from './scenes/V3_A6';
import { V3_A7 } from './scenes/V3_A7';

export { DURACAO };
// v3 · sete atos contínuos; cada ato tem a sua própria câmera e as transições acontecem dentro deles
export const CENAS = () => [
  [V3_A1, 0, W(2, 'Quando') + 0.15],
  [V3_A2, W(2, 'Quando') - 0.3, N[2] + 0.05],
  [V3_A3, N[2] - 0.25, N[3] - 0.05],
  [V3_A4, N[3] - 0.4, FIM(4) + 0.45],
  [V3_A5, FIM(4) + 0.3, N[5] + 0.1],
  [V3_A6, N[5] - 0.1, MUS.V4 + 0.1],
  [V3_A7, MUS.V4 - 0.05, DURACAO],
];
const f = (s) => Math.round(s * FPS);
export const Video = ({ comTrilha = true, comEfeitos = true }) => {
  useFonte();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {CENAS().map(([Comp, a, b], i) => (
        <Sequence key={i} from={f(a)} durationInFrames={f(b) - f(a)} layout="none"><AbsoluteFill><Comp a={a} /></AbsoluteFill></Sequence>
      ))}
      {N.map((s, i) => <Sequence key={`n${i}`} from={f(s)} layout="none"><Audio src={staticFile(`audio/cena${i + 1}.mp3`)} volume={1} /></Sequence>)}
      {comTrilha && <Audio src={staticFile(TRILHA.arquivo)} volume={(fr) => volTrilha(fr / FPS)} />}
      {comEfeitos && SFX().map(([s, nome, g], i) => <Sequence key={`s${i}`} from={Math.max(0, f(s))} layout="none"><Audio src={staticFile(`sfx/${nome}.wav`)} volume={g} /></Sequence>)}
    </AbsoluteFill>
  );
};
