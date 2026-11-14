// ROVIA · linha do tempo (tempos absolutos, em segundos, alinhados à narração)
import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { useT } from "./lib";
import { Fontes } from "./Fontes";
import { Cena1, Cena2, Cena3, Cena4 } from "./cenas/AtoUm";
import { Cena5, Cena6, Cena7, Cena8 } from "./cenas/AtoDois";
import { Cena9, Cena10, Cena11, Cena12 } from "./cenas/AtoTres";
import mix from "./mix.json";

// [componente, início, fim] — cada cena só existe no próprio intervalo; a próxima entra por cima no corte
export const CENAS: [React.FC, number, number][] = [
  [Cena1, 0, 1.9],
  [Cena2, 1.85, 4.3],
  [Cena3, 4.27, 7.02],
  [Cena4, 7.0, 9.36],
  [Cena5, 9.33, 12.93],
  [Cena6, 12.9, 15.23],
  [Cena7, 15.2, 16.93],
  [Cena8, 16.9, 19.48],
  [Cena9, 19.45, 21.53],
  [Cena10, 21.5, 23.13],
  [Cena11, 23.13, 25.1],
  [Cena12, 25.1, 28.5],
];

export const Video: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Fontes />
      {CENAS.map(([Cmp, a, b], i) => (t >= a && t < b ? <Cmp key={i} /> : null))}
      <Audio src={staticFile("audio/narracao.wav")} volume={mix.narracao} />
      {mix.musica > 0 && <Audio src={staticFile("audio/musica.wav")} volume={mix.musica} />}
      {mix.efeitos > 0 && <Audio src={staticFile("audio/efeitos.wav")} volume={mix.efeitos} />}
    </AbsoluteFill>
  );
};
