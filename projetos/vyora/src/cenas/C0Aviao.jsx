// Abertura · o avião passa rente à câmera, em tela cheia, antes da narração começar.
import React from "react";
import {Img, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {COR, Cheio, clamp, lerp} from "../lib";
import {INTRO} from "../audio";

export const C0Aviao = () => {
  const {fps} = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const k = clamp((t - 0.05) / 2.3);       // travessia ocupa a abertura inteira
  const e = k;
  const x = lerp(-2750, 1150, e), y = lerp(1500, -700, e);
  const vel = 0.45 + 0.55 * Math.sin(k * Math.PI); // mais perto da câmera no meio da passagem
  const treme = vel * 10;
  const some = clamp((t - (INTRO - 0.08)) / 0.3);
  return (
    <Cheio style={{background: COR.profundo, opacity: 1 - some}}>
      <Cheio style={{transform: `translate(${Math.sin(t * 61) * treme}px, ${Math.cos(t * 47) * treme}px)`}}>
        <Img src={staticFile("imagens/ceu.jpg")} style={{position: "absolute", left: -60, top: -110, width: 1200, transform: `scale(${lerp(1.3, 1.16, clamp(t / INTRO))})`}} />
        <Cheio style={{background: "linear-gradient(180deg, rgba(22,10,51,.75) 0%, rgba(22,10,51,.15) 45%, rgba(22,10,51,0) 70%)"}} />
        {/* sombra da passagem */}
        <Cheio style={{background: COR.profundo, opacity: Math.sin(k * Math.PI) * 0.3}} />
        <Img src={staticFile("imagens/aviao.png")} style={{position: "absolute", left: x, top: y, width: 2700, filter: `blur(${4 + vel * 26}px)`, transform: "rotate(-9deg)"}} />
        <Img src={staticFile("imagens/aviao.png")} style={{position: "absolute", left: x + 60 * vel, top: y - 36 * vel, width: 2700, opacity: 0.9, filter: `blur(${vel * 6}px) drop-shadow(0 80px 90px rgba(22,10,51,.5))`, transform: "rotate(-9deg)"}} />
      </Cheio>
    </Cheio>
  );
};
