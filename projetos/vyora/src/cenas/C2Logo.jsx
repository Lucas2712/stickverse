// Cena 2 · Logo e busca (1,7–6,3 s) · "Com a VYORA, sua próxima viagem começa de um jeito muito mais simples."
import React from "react";
import {COR, Cheio, Cinetico, E, Toque, clamp, display, lerp, p, texto, useT, v} from "../lib";
import {LogoAnimada, LogoLinha} from "../componentes/Logo";
import {BarraAbas, Cartao, Rotulo} from "../componentes/App";
import {IcBrilho, IcCalendario, IcPessoa, IcVoo} from "../componentes/Icones";

const Campo = ({y, rotulo, cod, cidade, vazio, t0}) => {
  const t = useT();
  const k = p(t, t0, 0.5, E.expo);
  return (
    <div style={{position: "absolute", left: 56, top: y}}>
      <Rotulo>{rotulo}</Rotulo>
      <div style={{position: "relative", height: 170}}>
        <div style={{...display, fontSize: 52, color: "#C9BEE6", fontWeight: 600, position: "absolute", top: 34, whiteSpace: "nowrap", opacity: 1 - clamp(k * 3)}}>{vazio}</div>
        <div style={{position: "absolute", top: 2, opacity: clamp(k * 2), transform: `translateY(${(1 - k) * 34}px)`, filter: k < 0.9 ? `blur(${(1 - k) * 8}px)` : "none"}}>
          <div style={{...display, fontSize: 112, color: COR.tinta, lineHeight: 1.05}}>{cod}</div>
          <div style={{...texto, fontSize: 32, color: COR.tinta2, marginTop: 2, whiteSpace: "nowrap"}}>{cidade}</div>
        </div>
      </div>
    </div>
  );
};

export const C2Logo = () => {
  const t = useT();
  const abre = p(t, 1.42, 0.5, E.inOut); // círculo branco nascendo do avião
  const sobe = p(t, 2.5, 0.45, E.inOut); // logo vira cabeçalho
  const ui = (t0, d = 0.7) => p(t, t0, d, E.expo);
  const arco = p(t, 4.25, 0.7, E.inOut);
  const aperta = pulsoBotao(t);
  const zoom = p(t, 5.72, 0.5, E.inn);
  return (
    <Cheio style={{clipPath: `circle(${abre * 2300}px at 760px 1010px)`, background: `radial-gradient(90% 60% at 50% 40%, #fff 0%, #fff 55%, ${COR.lavandaSuave} 100%)`}}>
      <Cheio style={{transform: `scale(${1 + zoom * 0.5})`, transformOrigin: "540px 1425px"}}>
        {/* logo central → cabeçalho */}
        <div style={{position: "absolute", left: 0, top: 690, width: 1080, display: "flex", justifyContent: "center", transform: `translateY(${-90 * sobe}px) scale(${lerp(1, 0.62, sobe)})`, opacity: 1 - clamp(sobe / 0.8), filter: sobe > 0.02 ? `blur(${sobe * 10}px)` : "none"}}>
          <LogoAnimada t0={1.56} tPonto={2.04} tam={320} />
        </div>
        <div style={{position: "absolute", left: 0, top: 226, width: 1080, display: "flex", justifyContent: "center", opacity: clamp((sobe - 0.5) / 0.5), transform: `translateY(${(1 - sobe) * 40}px)`}}>
          <LogoLinha altura={62} />
        </div>

        <div style={{position: "absolute", left: 80, top: 356}}>
          <Cinetico tam={108} cor={COR.tinta} itens={[[2.66, "Sua"], [2.8, "próxima"], "\n", [3.2, "viagem", COR.violeta]]} />
        </div>

        <Cartao style={{left: 60, top: 640, width: 960, height: 560, opacity: clamp(ui(2.95) * 2), transform: `translateY(${(1 - ui(2.95)) * 260}px)`}}>
          <Campo y={50} rotulo="Origem" vazio="De onde?" cod="GRU" cidade="São Paulo · Guarulhos" t0={3.72} />
          <div style={{position: "absolute", left: 56, top: 278, width: 620, height: 2, background: COR.linha}} />
          <Campo y={314} rotulo="Destino" vazio="Para onde?" cod="SSA" cidade="Salvador · Bahia" t0={4.04} />
          {/* arco da rota ligando origem e destino */}
          <svg width="260" height="560" style={{position: "absolute", left: 680, top: 0, overflow: "visible"}}>
            <path d="M 60 150 C 230 190 230 370 60 414" fill="none" stroke={COR.violeta} strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - arco)} />
            <circle cx="60" cy="150" r={Math.max(0, 13 * p(t, 3.72, 0.4, E.back))} fill="#fff" stroke={COR.violeta} strokeWidth="6" />
            <circle cx="60" cy="414" r={Math.max(0, 15 * p(t, 4.75, 0.4, E.back))} fill={COR.magenta} />
          </svg>
          <div style={{position: "absolute", left: 824, top: 244, width: 76, height: 76, borderRadius: 38, background: COR.violeta, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transform: `scale(${p(t, 4.45, 0.5, E.back)}) rotate(${lerp(40, 135, arco)}deg)`, boxShadow: "0 10px 24px rgba(122,43,255,.4)"}}>
            <IcVoo tam={44} />
          </div>
        </Cartao>

        {[["12 mar · qui", IcCalendario, 60, 3.3], ["1 passageiro", IcPessoa, 550, 3.42]].map(([tx, I, x, t0]) => (
          <div key={tx} style={{position: "absolute", left: x, top: 1232, width: 470, height: 104, borderRadius: 34, background: "#fff", boxShadow: "0 10px 30px rgba(74,28,160,.1)", display: "flex", alignItems: "center", gap: 18, padding: "0 30px", boxSizing: "border-box", color: COR.violeta, opacity: clamp(ui(t0) * 2), transform: `translateY(${(1 - ui(t0)) * 200}px)`}}>
            <I tam={42} />
            <span style={{...texto, fontSize: 34, color: COR.tinta, fontWeight: 600}}>{tx}</span>
          </div>
        ))}

        {/* botão Buscar com IA */}
        <div style={{position: "absolute", left: 60, top: 1368, width: 960, height: 132, borderRadius: 46, background: `linear-gradient(100deg, ${COR.violeta} 0%, #9B3DFF 60%, ${COR.magenta} 130%)`, boxShadow: "0 24px 50px rgba(122,43,255,.38)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, color: "#fff", overflow: "hidden", opacity: clamp(ui(3.55) * 2), transform: `translateY(${(1 - ui(3.55)) * 200}px) scale(${1 - aperta * 0.05})`}}>
          <div style={{position: "absolute", top: 0, left: 0, width: 220, height: 132, background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))", transform: `translateX(${v(t, 4.7, 0.9, -260, 1000, E.inOut)}px) skewX(-18deg)`}} />
          <IcBrilho tam={52} />
          <span style={{...display, fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em"}}>Buscar com IA</span>
        </div>
        <Toque x={540} y={1434} t0={5.36} cor="#fff" />

        <div style={{position: "absolute", left: 0, top: 1556, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, color: COR.violeta, opacity: p(t, 4.3, 0.6, E.out)}}>
          <IcBrilho tam={36} />
          <span style={{...texto, fontSize: 30, color: COR.tinta2}}>A IA compara rotas e horários por você</span>
        </div>
        <BarraAbas ativa={1} style={{opacity: clamp(ui(3.65) * 2), transform: `translateY(${(1 - ui(3.65)) * 200}px)`}} />
      </Cheio>
      {/* o violeta do botão toma a tela */}
      <Cheio style={{background: `linear-gradient(160deg, ${COR.violeta}, #5514D6)`, clipPath: `circle(${p(t, 5.72, 0.5, E.inn) * 2100}px at 540px 1434px)`}} />
    </Cheio>
  );
};

const pulsoBotao = (t) => {
  const x = clamp((t - 5.36) / 0.3);
  return Math.sin(x * Math.PI);
};
