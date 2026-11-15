// VYORA · linha do tempo do comercial. A "tela" vertical vive dentro da bancada escura: começa pequena e em perspectiva,
// a câmera entra nela (cenas 2 a 8 em tela cheia) e recua de volta para a assinatura.
import React from "react";
import {AbsoluteFill, Audio, staticFile, useVideoConfig} from "remotion";
import {COR, Cena, Cheio, E, clamp, lerp, p, texto, useT, v} from "./lib";
import {AUDIO} from "./audio";
import {Bancada} from "./componentes/Bancada";
import {C1Abertura} from "./cenas/C1Abertura";
import {C2Logo} from "./cenas/C2Logo";
import {C3Servicos} from "./cenas/C3Servicos";
import {C4IA} from "./cenas/C4IA";
import {C5Checkin} from "./cenas/C5Checkin";
import {C6ABordo} from "./cenas/C6ABordo";
import {C7Mapa} from "./cenas/C7Mapa";
import {C8Escolha} from "./cenas/C8Escolha";
import {C9Assinatura} from "./cenas/C9Assinatura";

const FIM = 0.76; // escala da tela na assinatura

const Selo = () => {
  const t = useT();
  const k = p(t, 0.3, 0.6, E.expo);
  const s = p(t, 1.2, 0.3, E.inn);
  return (
    <div style={{position: "absolute", left: 0, top: 248, width: 1080, textAlign: "center", overflow: "hidden", height: 60, opacity: 1 - s}}>
      <div style={{...texto, fontWeight: 600, fontSize: 34, letterSpacing: "0.2em", color: "#fff", transform: `translateY(${(1 - k) * 60}px)`}}>
        100% COM <span style={{color: COR.violetaClaro}}>INTELIGÊNCIA ARTIFICIAL</span>
      </div>
    </div>
  );
};

const volumeMusica = (t, m, dur) => {
  let g = m.volume;
  g *= clamp(t / m.fadeIn) * clamp((dur - t) / m.fadeOut);
  // ducking: reduz durante a fala, com rampas de 0,25 s
  let d = 0;
  for (const [a, b] of AUDIO.fala) d = Math.max(d, clamp((t - a + 0.25) / 0.25) * clamp((b + 0.35 - t) / 0.35));
  return g * lerp(1, m.reducao, d);
};

export const Vyora = () => {
  const t = useT();
  const {fps, durationInFrames} = useVideoConfig();
  const dur = durationInFrames / fps;
  // câmera da tela
  let s, ry, rx, raio;
  if (t < 20) {
    const ent = p(t, 0, 1.0, E.expo);
    const emp = p(t, 1.15, 0.65, E.inOut);
    s = lerp(lerp(0.5, 0.62, ent), 1, emp);
    ry = lerp(-34, 0, ent);
    rx = lerp(10, 0, ent);
  } else {
    const rec = p(t, 32.95, 0.9, E.inOut);
    s = lerp(1, FIM, rec) + clamp((t - 33.8) / 5.2) * 0.025;
    ry = Math.sin(clamp((t - 32.95) / 0.9) * Math.PI) * 9;
    rx = 0;
  }
  raio = (1 - clamp((s - 0.5) / 0.5)) * 2 * 56;
  const cheia = s > 0.999;
  const dy = (1 - s) * 40;
  return (
    <AbsoluteFill style={{background: COR.noite}}>
      {!cheia && <Bancada />}
      {t < 1.6 && <Selo />}
      <div style={{position: "absolute", inset: 0, perspective: 2200}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${dy}px) scale(${s}) rotateY(${ry}deg) rotateX(${rx}deg)`, borderRadius: raio, overflow: "hidden", background: COR.profundo, boxShadow: cheia ? "none" : "0 60px 160px rgba(0,0,0,.7), 0 0 120px rgba(122,43,255,.35), 0 0 0 2px rgba(233,222,255,.14)"}}>
          <Cena a={0} b={1.95} nome="1 Abertura"><C1Abertura /></Cena>
          <Cena a={1.4} b={6.6} nome="2 Logo e busca"><C2Logo /></Cena>
          <Cena a={5.7} b={11.2} nome="3 Serviços"><C3Servicos /></Cena>
          <Cena a={10.55} b={14.85} nome="4 IA do seu jeito"><C4IA /></Cena>
          <Cena a={14.2} b={21.4} nome="5 Check-in"><C5Checkin /></Cena>
          <Cena a={20.7} b={25.45} nome="6 A bordo"><C6ABordo /></Cena>
          <Cena a={24.9} b={28.8} nome="7 Seu mundo"><C7Mapa /></Cena>
          <Cena a={28.15} b={33.5} nome="8 Escolha e pronto"><C8Escolha /></Cena>
          <Cena a={32.8} b={39} nome="9 Assinatura"><C9Assinatura /></Cena>
        </div>
      </div>
      {t > 33.6 && (
        <div style={{position: "absolute", left: 0, top: 1722, width: 1080, textAlign: "center", ...texto, fontSize: 24, letterSpacing: "0.24em", color: "rgba(233,222,255,.55)", opacity: p(t, 36.9, 0.8, E.out)}}>
          MOTION · STUDIO MATTEU
        </div>
      )}
      <Audio src={staticFile(AUDIO.narracao.arquivo)} volume={AUDIO.narracao.volume} />
      {AUDIO.musica && <Audio src={staticFile(AUDIO.musica.arquivo)} startFrom={Math.round(AUDIO.musica.corte * fps)} volume={(f) => volumeMusica(f / fps, AUDIO.musica, dur)} />}
      {AUDIO.efeitos && <Audio src={staticFile(AUDIO.efeitos.arquivo)} volume={AUDIO.efeitos.volume} />}
    </AbsoluteFill>
  );
};
