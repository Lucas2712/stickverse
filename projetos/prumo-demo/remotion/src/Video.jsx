import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile, interpolate, getRemotionEnvironment } from 'remotion';
import { FPS, C } from './styles/tokens';
import { SFX, NARRACAO, TRILHA } from './audio/cues';
import { useFonte } from './components/Fonte';
import { S01Abertura } from './scenes/S01Abertura';
import { S03Notificacoes } from './scenes/S03Notificacoes';
import { S04Pote } from './scenes/S04Pote';
import { S05Marca } from './scenes/S05Marca';
import { S06Separa } from './scenes/S06Separa';
import { S07Aviso } from './scenes/S07Aviso';
import { S08Impostos } from './scenes/S08Impostos';
import { S09Relatorio } from './scenes/S09Relatorio';
import { S10NoLugar } from './scenes/S10NoLugar';
import { S11SaibaMais } from './scenes/S11SaibaMais';
import { S12Cartela } from './scenes/S12Cartela';

export const DURACAO = 36.5;
// [componente, início, fim] em segundos absolutos; as sobreposições são as transições
const CENAS = [
  [S01Abertura, 0, 4.7], [S03Notificacoes, 4.3, 7.6], [S04Pote, 7.15, 10.6], [S05Marca, 10.05, 12.25],
  [S06Separa, 11.7, 16.7], [S07Aviso, 16.3, 19.25], [S08Impostos, 18.95, 21.98], [S09Relatorio, 21.6, 26.25],
  [S10NoLugar, 25.45, 29.95], [S11SaibaMais, 29.45, 33.0], [S12Cartela, 32.45, DURACAO],
];
// cenas com cortina própria (clip) não usam fusão
const SEM_FADE = [S05Marca, S10NoLugar, S11SaibaMais];
const Fade = ({ a, on, children }) => {
  const fr = useCurrentFrame();
  const o = on ? interpolate(fr, [0, 0.28 * FPS], [0, 1], { extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
const f = (s) => Math.round(s * FPS);
const fala = [[0, 4.08], [4.55, 9.95], [10.4, 15.95], [16.6, 25.3], [25.85, 32.42]];
const volTrilha = (fr) => {
  const t = fr / FPS;
  const naVoz = fala.some(([a, b]) => t >= a - 0.15 && t <= b + 0.25);
  const base = naVoz ? TRILHA.sobVoz : TRILHA.base;
  const fin = interpolate(t, [0, TRILHA.fadeIn, DURACAO - TRILHA.fadeOut, DURACAO], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return base * fin;
};
export const Video = ({ comTrilha = true }) => { useFonte(); return (
  <AbsoluteFill style={{ background: C.bg }}>
    {CENAS.map(([Comp, a, b], i) => (
      <Sequence key={i} from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
        <Fade a={a} on={!SEM_FADE.includes(Comp)}><Comp a={a} /></Fade>
      </Sequence>
    ))}
    <Audio src={staticFile(NARRACAO.arquivo)} volume={1} />
    {comTrilha && <Audio src={staticFile(TRILHA.arquivo)} volume={volTrilha} />}
    {SFX.map(([s, nome, g], i) => (
      <Sequence key={`s${i}`} from={f(s)} layout="none"><Audio src={staticFile(`sfx/${nome}.wav`)} volume={g} /></Sequence>
    ))}
  </AbsoluteFill>
); };
