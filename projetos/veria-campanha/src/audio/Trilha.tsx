// TRILHA, NARRAÇÃO E EFEITOS. Tudo preso aos tempos centralizados.
// Narração: ElevenLabs (voz Sarah, multilingual v2), áudio intacto com respiros inseridos entre blocos.
// Trilha: 8 stems gerados no ElevenLabs Sound Effects v2 e arranjados aqui.
// Efeitos: 15 sons gerados no ElevenLabs, cada um preso a um evento visual.
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig, getInputProps } from "remotion";
import N from "../tempos-narracao.json";
import { W, CONGELA, ASSINATURA_INICIO, DURACAO, FPS } from "../tempos";
import { clamp } from "../anim";

// voz falando? (para abaixar a música por baixo da fala)
const FALAS = N.palavras.map((w) => [w.s - 0.12, w.e + 0.3]);
const falando = (t: number) => FALAS.some(([a, b]) => t >= a && t <= b);
const duck = (t: number) => {
  // suaviza: média em ±0,15 s
  let s = 0; for (let k = -3; k <= 3; k++) s += falando(t + k * 0.05) ? 1 : 0;
  return 1 - 0.62 * (s / 7); // ≈ −8 dB na música durante a fala
};

type Faixa = { arq: string; de: number; ate: number; vol: number; fadeIn?: number; fadeOut?: number; loop?: boolean; semDuck?: boolean; curva?: (t: number) => number };
export const MUSICA: Faixa[] = [
  { arq: "01-pulso-escuro", de: 0, ate: 13.0, vol: 0.32, fadeIn: 0.8, fadeOut: 0.6, loop: true },
  { arq: "02-ruido-tensao", de: 12.35, ate: CONGELA + 0.06, vol: 0.3, fadeIn: 0.4, fadeOut: 0.06, loop: true },
  { arq: "03-riser", de: W.veria - 6.0, ate: W.veria + 0.1, vol: 0.4, fadeIn: 1.5, fadeOut: 0.08 },
  { arq: "04-impacto", de: W.veria - 0.04, ate: W.veria + 4.0, vol: 0.4, semDuck: true },
  { arq: "05-groove", de: W.veria + 0.3, ate: 46.6, vol: 0.25, fadeIn: 1.2, fadeOut: 0.6, loop: true },
  { arq: "06-climax", de: 46.2, ate: 54.2, vol: 0.28, fadeIn: 0.7, fadeOut: 1.2, loop: true, curva: (t) => 1 + 0.6 * clamp((t - W.visivel - 0.7) / 0.5) * (1 - clamp((t - 52.6) / 0.8)) },
  { arq: "07-emocional", de: 53.4, ate: DURACAO, vol: 0.85, fadeIn: 1.4, fadeOut: 2.0, loop: true },
  { arq: "08-assinatura", de: ASSINATURA_INICIO, ate: ASSINATURA_INICIO + 4.48, vol: 0.6, curva: (t) => 1 / Math.max(0.5, duck(t)) * (0.55 + 0.45 * duck(t)) },
];

export const SFX: [string, number, number][] = [
  ["pulso", W.ritmo, 0.55],
  ["whoosh-suave", 4.02, 0.45],
  ["glitch", 8.58, 0.35],
  ["whoosh-rapido", 8.92, 0.28],
  ["glitch", W.acompanha + 0.1, 0.4],
  ["whoosh-rapido", 12.2, 0.35],
  ["batida-conta", 12.86, 0.85], ["batida-conta", 13.24, 0.8], ["batida-conta", 13.39, 0.8], ["batida-conta", 13.97, 0.85],
  ["papel", W.gastos - 0.05, 0.9],
  ["whoosh-rapido", W.mes - 0.3, 0.45],
  ["congela", CONGELA - 0.3, 0.5],
  ["ar", 21.6, 0.3],
  ["metal", 29.75, 0.5], ["whoosh-suave", 30.5, 0.35], ["metal", W.clareza - 0.3, 0.45],
  ["whoosh-grave", W.vai - 0.15, 0.35],
  ["ui-toque", 35.25, 0.6], ["contador", W.saldo, 1.0],
  ["whoosh-rapido", 37.6, 0.35], ["varredura", W.entradas, 0.4], ["varredura", W.saidas, 0.32],
  ["whoosh-suave", 40.25, 0.3],
  ["encaixe", W.lugar + 0.33, 0.7], ["encaixe", W.lugar + 0.47, 0.65], ["encaixe", W.lugar + 0.61, 0.65], ["encaixe", W.lugar + 0.75, 0.7],
  ["ui-confirma", W.forma + 0.1, 0.8],
  ["whoosh-suave", 46.1, 0.35], ["varredura", 46.9, 0.28],
  ["ar", W.visivel - 0.1, 0.45],
  ["pulso", 69.2, 0.5],
];

export const Trilha: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  return (
    <>
      {!getInputProps().semVoz && <Audio src={staticFile("audio/narracao/narracao-timeline.wav")} volume={1} />}
      {MUSICA.map((m, i) => (
        <Sequence key={"m" + i} from={f(m.de)} durationInFrames={Math.max(1, f(m.ate - m.de))} layout="none">
          <Audio src={staticFile(`audio/music/${m.arq}.mp3`)} loop={m.loop}
            volume={(fr) => {
              const tl = fr / fps, t = m.de + tl, dur = m.ate - m.de;
              const fi = m.fadeIn ? clamp(tl / m.fadeIn) : 1;
              const fo = m.fadeOut ? clamp((dur - tl) / m.fadeOut) : 1;
              return m.vol * fi * fo * (m.semDuck ? 1 : duck(t)) * (m.curva ? m.curva(t) : 1);
            }} />
        </Sequence>
      ))}
      {SFX.map(([n, t, v], i) => (
        <Sequence key={"s" + i} from={f(t)} durationInFrames={f(3)} layout="none">
          <Audio src={staticFile(`audio/sfx/${n}.mp3`)} volume={(fr) => v * (0.5 + 0.5 * duck(t + fr / fps))} />
        </Sequence>
      ))}
    </>
  );
};
export { FPS };
