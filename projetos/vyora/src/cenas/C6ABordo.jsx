// Cena 6 · A bordo (21,0–25,2 s) · "tenha seu cartão de embarque sempre à mão e viaje sem complicação."
import React from "react";
import {Img, staticFile} from "remotion";
import {COR, Cheio, Cinetico, E, clamp, display, lerp, p, texto, useT} from "../lib";
import {IconeApp, Simbolo} from "../componentes/Logo";
import {QR} from "./C5Checkin";

export const C6ABordo = () => {
  const t = useT();
  const k = p(t, 20.78, 0.5, E.inOut);
  const emp = clamp((t - 20.8) / 4.4);
  const fuga = p(t, 24.7, 0.6, E.inExpo);
  const nota = p(t, 22.52, 0.7, E.back);
  const mini = p(t, 21.34, 0.7, E.back);
  return (
    <Cheio style={{clipPath: `inset(${lerp(1250, 0, k)}px ${lerp(100, 0, k)}px ${lerp(350, 0, k)}px ${lerp(100, 0, k)}px round ${lerp(50, 0, k)}px)`, background: COR.profundo}}>
      <Cheio style={{transformOrigin: "872px 440px", transform: `scale(${1 + fuga * 9})`, filter: fuga > 0.02 ? `blur(${fuga * 14}px)` : "none"}}>
        <Img src={staticFile("imagens/passageira.jpg")} style={{position: "absolute", left: -90, top: -150, width: 1220, transformOrigin: "660px 900px", transform: `scale(${lerp(1.16, 1.05, k) + emp * 0.09})`}} />
        <Cheio style={{background: "linear-gradient(0deg, rgba(22,10,51,.96) 0%, rgba(22,10,51,.8) 17%, rgba(22,10,51,0) 46%)"}} />
        <Cheio style={{background: "linear-gradient(180deg, rgba(22,10,51,.55) 0%, rgba(22,10,51,0) 22%)"}} />
        {/* mini cartão de embarque, sempre à mão */}
        <div style={{position: "absolute", left: 64, top: 1010, width: 350, borderRadius: 34, background: "#fff", overflow: "hidden", boxShadow: "0 30px 70px rgba(10,2,40,.5)", opacity: clamp(mini * 2) * (1 - fuga * 3), transform: `translateY(${(1 - mini) * 80 + Math.sin(t * 1.5) * 7}px) rotate(${-7 + (1 - mini) * 10}deg) scale(${0.6 + mini * 0.4})`}}>
          <div style={{height: 62, background: `linear-gradient(100deg, ${COR.violeta}, #5A17DB)`, display: "flex", alignItems: "center", padding: "0 20px", gap: 10}}>
            <Simbolo tam={36} cor="#fff" corPonto="#FF6AC6" />
            <span style={{...texto, fontSize: 21, fontWeight: 600, color: "#fff", letterSpacing: "0.04em"}}>Cartão de embarque</span>
          </div>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 20px"}}>
            <div>
              <div style={{...display, fontSize: 42, color: COR.tinta, whiteSpace: "nowrap"}}>GRU → SSA</div>
              <div style={{...texto, fontSize: 24, color: COR.tinta2, marginTop: 4}}>14A · Portão B12</div>
            </div>
            <QR tam={84} />
          </div>
        </div>
        {/* notificação */}
        <div style={{position: "absolute", left: 60, top: 240, width: 960, borderRadius: 48, background: "rgba(255,255,255,.86)", backdropFilter: "blur(30px)", boxShadow: "0 30px 70px rgba(10,2,40,.35)", padding: "30px 34px", boxSizing: "border-box", display: "flex", gap: 26, alignItems: "center", opacity: clamp(nota * 2) * (1 - fuga * 3), transform: `translateY(${(1 - nota) * -300}px) scale(${0.92 + nota * 0.08})`}}>
          <IconeApp tam={108} />
          <div style={{flex: 1}}>
            <div style={{display: "flex", justifyContent: "space-between", ...texto, fontSize: 26, color: COR.tinta2, fontWeight: 600}}><span style={{letterSpacing: "0.12em"}}>VYORA</span><span style={{fontWeight: 500}}>agora</span></div>
            <div style={{...display, fontSize: 46, color: COR.tinta, margin: "4px 0 4px"}}>Já estamos embarcando!</div>
            <div style={{...texto, fontSize: 30, color: COR.tinta2}}>Portão B12 · embarque até 08:40</div>
          </div>
        </div>
        <div style={{position: "absolute", left: 80, top: 1336, opacity: 1 - fuga * 3}}>
          <Cinetico tam={112} itens={[[23.32, "Mais"], [23.5, "liberdade"], "\n", [23.74, "em"], [23.88, "cada"], [24.04, "etapa.", "#FF7CCB"]]} />
        </div>
      </Cheio>
      <Cheio style={{background: "#1D0C47", opacity: p(t, 24.95, 0.3, E.linear)}} />
    </Cheio>
  );
};
