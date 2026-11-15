// Cena 1 · Abertura (0–1,7 s) · "Para onde você quer viajar?"
import React from "react";
import {Img, staticFile} from "remotion";
import {COR, Cheio, Cinetico, E, clamp, p, texto, useT, v} from "../lib";
import {IconeApp} from "../componentes/Logo";

export const C1Abertura = () => {
  const t = useT();
  const k = p(t, 0.35, 1.25, E.out5);
  const deriva = clamp((t - 0.35) / 1.6);
  const ax = -1500 + 1500 * k + deriva * 160;
  const ay = 1560 - 640 * k - deriva * 110;
  const vel = (1 - clamp((t - 0.35) / 0.9)) * 14;
  const rota = p(t, 0.75, 0.9, E.out);
  return (
    <Cheio style={{background: COR.profundo}}>
      <Img src={staticFile("imagens/ceu.jpg")} style={{position: "absolute", left: -60, top: -110, width: 1200, transform: `scale(${v(t, 0, 2, 1.16, 1.04, E.out)}) translateY(${v(t, 0, 2, -40, 0, E.out)}px)`}} />
      <Cheio style={{background: "linear-gradient(180deg, rgba(22,10,51,.75) 0%, rgba(22,10,51,.15) 45%, rgba(22,10,51,0) 70%)"}} />
      {/* rastro da rota */}
      <svg width="1080" height="1920" style={{position: "absolute", left: 0, top: 0}}>
        <path d="M -40 1700 C 260 1560 520 1380 760 1010" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeDasharray="2 26" opacity={0.85 * rota} pathLength="100" style={{strokeDasharray: "0.2 2.4", strokeDashoffset: 0, clipPath: `inset(0 ${(1 - rota) * 100}% 0 0)`}} />
      </svg>
      <Img src={staticFile("imagens/aviao.png")} style={{position: "absolute", left: ax, top: ay, width: 1220, filter: `blur(${vel}px) drop-shadow(0 50px 60px rgba(22,10,51,.45))`, transform: `rotate(${-4 + k * 2}deg)`}} />
      <div style={{position: "absolute", left: 88, top: 236, display: "flex", alignItems: "center", gap: 20, opacity: p(t, 0.1, 0.5, E.out), transform: `translateY(${(1 - p(t, 0.1, 0.6)) * 30}px)`}}>
        <IconeApp tam={78} />
        <span style={{...texto, fontWeight: 600, fontSize: 34, letterSpacing: "0.2em", color: "#fff"}}>VYORA</span>
      </div>
      <div style={{position: "absolute", left: 84, top: 372}}>
        <Cinetico tam={156} altura={1.0} dur={0.5} itens={[[0.0, "Para"], [0.18, "onde"], "\n", [0.36, "você"], [0.62, "quer"], "\n", [0.8, "viajar?", COR.lavanda]]} />
      </div>
    </Cheio>
  );
};
