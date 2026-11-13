import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { FPS, C } from './styles/tokens';
import { useFonte } from './components/Fonte';
import { N, W, FIM, DURACAO } from './audio/timeline';
import { SFX, TRILHA, volTrilha } from './audio/cues';
import { A_Mesa } from './scenes/A_Mesa';
import { B_Problema } from './scenes/B_Problema';
import { C_Marca, FB, IRIS } from './scenes/C_Marca';
import { E_Demos } from './scenes/E_Demos';
import { F_Clareza } from './scenes/F_Clareza';
import { G_Transforma } from './scenes/G_Transforma';
import { H_Final } from './scenes/H_Final';

export { DURACAO };
// [componente, início, fim] (s). As sobreposições são as transições.
export const CENAS = () => [
  [A_Mesa, 0, W(2, 'Quando') + 0.3],
  [B_Problema, W(2, 'Quando') - 0.35, IRIS() + 0.8],
  [C_Marca, FB().a - 0.2, N[3] + 0.6],
  [E_Demos, N[3] - 0.4, N[4] - 0.05],
  [F_Clareza, N[4] - 0.3, FIM(5) + 0.7],
  [G_Transforma, FIM(5) + 0.45, FIM(6) + 1.2],
  [H_Final, FIM(6) + 1.0, DURACAO],
];
const f = (s) => Math.round(s * FPS);
export const Video = ({ comTrilha = true, comEfeitos = true }) => {
  useFonte();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {CENAS().map(([Comp, a, b], i) => (
        <Sequence key={i} from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
          <AbsoluteFill><Comp a={a} /></AbsoluteFill>
        </Sequence>
      ))}
      {N.map((s, i) => (
        <Sequence key={`n${i}`} from={f(s)} layout="none"><Audio src={staticFile(`audio/cena${i + 1}.mp3`)} volume={1} /></Sequence>
      ))}
      {comTrilha && TRILHA.arquivo && <Audio src={staticFile(TRILHA.arquivo)} volume={(fr) => volTrilha(fr / FPS)} />}
      {comEfeitos && SFX().map(([s, nome, g, , dur], i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(s))} durationInFrames={dur ? f(dur) : undefined} layout="none"><Audio src={staticFile(`sfx/${nome}.wav`)} volume={g} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
