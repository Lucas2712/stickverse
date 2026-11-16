// VYORA · linha do tempo do comercial, em tela cheia do começo ao fim.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {COR, Cena, Cheio, clamp, lerp} from "./lib";
import {AUDIO, INTRO} from "./audio";
import {C0Aviao} from "./cenas/C0Aviao";
import {C1Abertura} from "./cenas/C1Abertura";
import {C2Logo} from "./cenas/C2Logo";
import {C3Servicos} from "./cenas/C3Servicos";
import {C4IA} from "./cenas/C4IA";
import {C5Checkin} from "./cenas/C5Checkin";
import {C6ABordo} from "./cenas/C6ABordo";
import {C7Mapa} from "./cenas/C7Mapa";
import {C8Escolha} from "./cenas/C8Escolha";
import {C9Assinatura} from "./cenas/C9Assinatura";

const volumeMusica = (t, m, dur) => {
  let g = m.volume;
  g *= clamp(t / m.fadeIn) * clamp((dur - t) / m.fadeOut);
  // ducking: reduz durante a fala, com rampas de 0,25 s
  let d = 0;
  for (const [a, b] of AUDIO.fala) d = Math.max(d, clamp((t - a + 0.25) / 0.25) * clamp((b + 0.35 - t) / 0.35));
  return g * lerp(1, m.reducao, d);
};

// Tudo em tela cheia. A abertura (INTRO segundos) é só o avião passando; a narração, a trilha e a faixa de efeitos
// começam depois dela, então os tempos das cenas continuam sendo os da narração.
const Filme = () => (
  <>
    <Cena a={0} b={1.95} nome="1 Abertura"><C1Abertura /></Cena>
    <Cena a={1.4} b={6.6} nome="2 Logo e busca"><C2Logo /></Cena>
    <Cena a={5.7} b={11.2} nome="3 Serviços"><C3Servicos /></Cena>
    <Cena a={10.55} b={14.85} nome="4 IA do seu jeito"><C4IA /></Cena>
    <Cena a={14.2} b={21.4} nome="5 Check-in"><C5Checkin /></Cena>
    <Cena a={20.7} b={25.45} nome="6 A bordo"><C6ABordo /></Cena>
    <Cena a={24.9} b={28.8} nome="7 Seu mundo"><C7Mapa /></Cena>
    <Cena a={28.15} b={33.5} nome="8 Escolha e pronto"><C8Escolha /></Cena>
    <Cena a={32.8} b={39} nome="9 Assinatura"><C9Assinatura /></Cena>
    <Audio src={staticFile(AUDIO.narracao.arquivo)} volume={AUDIO.narracao.volume} />
    {AUDIO.musica && <Audio src={staticFile(AUDIO.musica.arquivo)} volume={(f) => volumeMusica(f / 30, AUDIO.musica, 39)} />}
    {AUDIO.efeitos && <Audio src={staticFile(AUDIO.efeitos.arquivo)} volume={AUDIO.efeitos.volume} />}
  </>
);

export const Vyora = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const ini = Math.round(INTRO * fps);
  return (
    <AbsoluteFill style={{background: COR.profundo}}>
      <Sequence from={ini} durationInFrames={durationInFrames - ini} name="Filme" layout="none">
        <Cheio><Filme /></Cheio>
      </Sequence>
      <Sequence from={0} durationInFrames={ini + 8} name="0 Avião" layout="none">
        <C0Aviao />
      </Sequence>
      {AUDIO.aviao && <Audio src={staticFile(AUDIO.aviao.arquivo)} volume={(f) => AUDIO.aviao.volume * Math.min(1, f / 4) * Math.max(0, Math.min(1, (AUDIO.aviao.fim * fps - f) / (AUDIO.aviao.fade * fps)))} />}
    </AbsoluteFill>
  );
};
