// VYORA · logo original. Símbolo: um V em um só traço cuja segunda haste sobe em arco (a rota) e termina no ponto de destino.
import React from "react";
import {COR, display, useT, p, E, clamp} from "../lib";

const TRACO = "M 20 30 L 50 94 C 58 62 76 38 98 27";
const COMPR = 152; // comprimento aproximado do traço

// k: 0..1 desenho do traço · ponto: 0..1 pouso do ponto
export const Simbolo = ({tam = 120, cor = COR.violeta, corPonto = COR.magenta, k = 1, ponto = 1, espessura = 15}) => (
  <svg width={tam} height={tam} viewBox="0 0 120 120" style={{overflow: "visible", display: "block"}}>
    <path d={TRACO} fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={COMPR} strokeDashoffset={COMPR * (1 - clamp(k))} opacity={k > 0.01 ? 1 : 0} />
    <circle cx="103" cy="24" r={Math.max(0, 10.5 * ponto)} fill={corPonto} />
  </svg>
);

// Ícone do aplicativo (símbolo branco sobre violeta)
export const IconeApp = ({tam = 96}) => (
  <div style={{width: tam, height: tam, borderRadius: tam * 0.26, background: `linear-gradient(145deg, ${COR.violeta}, #5514D6)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px rgba(122,43,255,.35)", flexShrink: 0}}>
    <Simbolo tam={tam * 0.62} cor="#fff" corPonto="#FF6AC6" />
  </div>
);

// Logo horizontal estática (símbolo + palavra)
export const LogoLinha = ({altura = 56, cor = COR.violeta, corTexto, corPonto = COR.magenta}) => (
  <div style={{display: "flex", alignItems: "center", gap: altura * 0.2}}>
    <Simbolo tam={altura} cor={cor} corPonto={corPonto} />
    <span style={{...display, fontSize: altura * 0.74, letterSpacing: "0.14em", color: corTexto || cor, fontWeight: 700}}>VYORA</span>
  </div>
);

// Logo animada: o traço desenha o V (t0), o ponto pousa (tPonto) e a palavra abre letra por letra.
export const LogoAnimada = ({t0, tPonto, tam = 300, cor = COR.violeta, corTexto, corPonto = COR.magenta}) => {
  const t = useT();
  const k = p(t, t0, 0.5, E.inOut);
  const kp = p(t, tPonto, 0.45, E.back);
  const onda = p(t, tPonto, 0.7, E.out);
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: tam * 0.16}}>
      <div style={{position: "relative"}}>
        <Simbolo tam={tam} cor={cor} corPonto={corPonto} k={k} ponto={kp} />
        {t >= tPonto && onda < 1 && (
          <div style={{position: "absolute", left: (103 / 120) * tam - tam * 0.5, top: (24 / 120) * tam - tam * 0.5, width: tam, height: tam, borderRadius: tam, border: `${tam * 0.02}px solid ${corPonto}`, transform: `scale(${0.1 + onda * 1.1})`, opacity: 1 - onda}} />
        )}
      </div>
      <div style={{...display, fontSize: tam * 0.36, letterSpacing: "0.2em", marginRight: "-0.2em", color: corTexto || cor, display: "flex"}}>
        {"VYORA".split("").map((l, i) => {
          const kl = p(t, tPonto + 0.04 + i * 0.055, 0.5, E.expo);
          return (
            <span key={i} style={{display: "inline-block", opacity: clamp(kl * 2), transform: `translateY(${(1 - kl) * 40}px) scale(${0.8 + kl * 0.2})`, filter: kl < 0.9 ? `blur(${(1 - kl) * 8}px)` : "none"}}>
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
};
