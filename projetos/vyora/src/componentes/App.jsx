// VYORA · peças da interface do aplicativo (um só sistema de design em todas as telas)
import React from "react";
import {COR, display, texto} from "../lib";
import {IcBilhete, IcBusca, IcCasa, IcPessoa} from "./Icones";

export const sombra = "0 30px 70px rgba(74,28,160,.16), 0 4px 14px rgba(74,28,160,.08)";

export const Cartao = ({style, children}) => (
  <div style={{position: "absolute", background: "#fff", borderRadius: 44, boxShadow: sombra, ...style}}>{children}</div>
);

export const Rotulo = ({children, style}) => (
  <div style={{...texto, fontWeight: 600, fontSize: 24, letterSpacing: "0.14em", textTransform: "uppercase", color: COR.tinta2, ...style}}>{children}</div>
);

export const BarraAbas = ({ativa = 0, y = 1716, style}) => (
  <div style={{position: "absolute", left: 60, top: y, width: 960, height: 132, borderRadius: 50, background: "#fff", boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "space-around", ...style}}>
    {[IcCasa, IcBusca, IcBilhete, IcPessoa].map((I, i) => (
      <div key={i} style={{width: 96, height: 96, borderRadius: 34, display: "flex", alignItems: "center", justifyContent: "center", background: i === ativa ? COR.lavanda : "transparent", color: i === ativa ? COR.violeta : "#A99DC6"}}>
        <I tam={50} />
      </div>
    ))}
  </div>
);

export const Selo = ({children, cor = COR.violeta, fundo = COR.lavanda, style}) => (
  <div style={{...texto, fontWeight: 600, fontSize: 24, color: cor, background: fundo, borderRadius: 40, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", ...style}}>{children}</div>
);

// Moldura de telefone genérica (sem marca): children ocupam a tela interna
export const Telefone = ({w = 600, h = 1240, children, style, fundo = COR.lavandaSuave}) => (
  <div style={{position: "absolute", width: w, height: h, borderRadius: 86, background: "#0E0822", padding: 16, boxShadow: "0 60px 120px rgba(12,4,40,.55), inset 0 0 0 3px #3B2A6B, 0 0 0 2px #050210", ...style}}>
    <div style={{position: "relative", width: w - 32, height: h - 32, borderRadius: 72, overflow: "hidden", background: fundo}}>
      {children}
      <div style={{position: "absolute", left: (w - 32) / 2 - 78, top: 20, width: 156, height: 42, borderRadius: 22, background: "#0E0822"}} />
    </div>
  </div>
);

export const tituloApp = {...display, color: COR.tinta};
