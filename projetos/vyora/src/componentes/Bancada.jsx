// VYORA · bancada escura de desenvolvimento (painéis genéricos criados para o comercial, desfocados ao fundo)
import React from "react";
import {COR, Cheio, useT, texto} from "../lib";

const Linha = ({w, cor = "rgba(233,222,255,.16)", h = 10}) => <div style={{width: w, height: h, borderRadius: h, background: cor}} />;

const CODIGO = [
  [0, 120, "v"], [1, 220, ""], [1, 160, "m"], [2, 260, ""], [2, 190, "v"], [2, 120, ""], [1, 90, ""], [0, 60, ""],
  [0, 0, ""], [0, 170, "m"], [1, 240, ""], [2, 150, "v"], [2, 280, ""], [3, 180, ""], [3, 120, "m"], [2, 70, ""], [1, 60, ""],
  [0, 0, ""], [0, 140, "v"], [1, 200, ""], [1, 250, ""], [2, 130, "m"], [1, 60, ""], [0, 50, ""],
];

export const Bancada = () => {
  const t = useT();
  const cab = ((t * 46) % 880) + 100;
  return (
    <Cheio style={{background: `radial-gradient(120% 70% at 50% 45%, #1A0D3D 0%, ${COR.noite} 62%, #06030F 100%)`}}>
      <div style={{position: "absolute", inset: 0, filter: "blur(5px)", opacity: 0.85, transform: `scale(1.04) translateY(${Math.sin(t * 0.5) * 6}px)`}}>
        {/* barra superior */}
        <div style={{position: "absolute", left: 0, top: 60, width: 1080, height: 74, borderBottom: "2px solid rgba(233,222,255,.08)", display: "flex", alignItems: "center", gap: 14, padding: "0 40px"}}>
          {["#E6189B", "#7A2BFF", "#B58CFF"].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: 9, background: c, opacity: 0.7}} />)}
          <div style={{marginLeft: 30}}><Linha w={170} /></div><Linha w={110} /><Linha w={130} />
        </div>
        {/* editor à esquerda */}
        <div style={{position: "absolute", left: 28, top: 170, width: 330, display: "flex", flexDirection: "column", gap: 17}}>
          {CODIGO.map(([n, w, c], i) => (
            <div key={i} style={{display: "flex", gap: 14, alignItems: "center", height: 10}}>
              <span style={{...texto, fontSize: 13, color: "rgba(233,222,255,.22)", width: 22}}>{i + 1}</span>
              <div style={{marginLeft: n * 22}}><Linha w={w} cor={c === "v" ? "rgba(122,43,255,.75)" : c === "m" ? "rgba(230,24,155,.6)" : undefined} /></div>
            </div>
          ))}
        </div>
        {/* propriedades à direita */}
        <div style={{position: "absolute", right: 28, top: 180, width: 180, display: "flex", flexDirection: "column", gap: 22}}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{display: "flex", flexDirection: "column", gap: 10}}>
              <Linha w={70 + ((i * 37) % 60)} cor="rgba(233,222,255,.2)" h={8} />
              <div style={{height: 34, borderRadius: 9, border: "2px solid rgba(233,222,255,.1)", display: "flex", alignItems: "center", padding: "0 10px"}}>
                <Linha w={50 + ((i * 53) % 80)} cor={i % 3 === 0 ? "rgba(122,43,255,.7)" : "rgba(233,222,255,.14)"} h={8} />
              </div>
            </div>
          ))}
        </div>
        {/* linha do tempo embaixo */}
        <div style={{position: "absolute", left: 0, top: 1560, width: 1080, height: 360, borderTop: "2px solid rgba(233,222,255,.1)", background: "rgba(10,5,24,.6)"}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{position: "absolute", left: 100, top: 34 + i * 56, width: 960, height: 38}}>
              {[0, 1, 2].map((j) => {
                const x = ((i * 173 + j * 311) % 700);
                const w = 120 + ((i * 97 + j * 61) % 200);
                return <div key={j} style={{position: "absolute", left: x, width: w, height: 38, borderRadius: 9, background: (i + j) % 3 === 0 ? "rgba(230,24,155,.5)" : (i + j) % 3 === 1 ? "rgba(122,43,255,.6)" : "rgba(181,140,255,.3)"}} />;
              })}
            </div>
          ))}
          <div style={{position: "absolute", left: cab, top: 0, width: 3, height: 360, background: "#fff", opacity: 0.7}} />
        </div>
      </div>
      {/* vinheta */}
      <Cheio style={{background: "radial-gradient(75% 55% at 50% 50%, rgba(6,3,15,0) 40%, rgba(6,3,15,.82) 100%)"}} />
    </Cheio>
  );
};
