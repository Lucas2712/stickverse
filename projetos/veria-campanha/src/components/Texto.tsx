// Tipografia animada: palavra que nasce do desfoque, linha que sobe da máscara.
import React from "react";
import { p, ease, clamp } from "../anim";
import { FONTE_DISPLAY } from "../branding/Marca";

export const Desfoca: React.FC<{ t: number; t0: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; saida?: number; dy?: number; escala?: number }> = ({ t, t0, dur = 0.55, children, style, saida, dy = 24, escala = 1.06 }) => {
  const k = p(t, t0, t0 + dur, ease.out5);
  const s = saida ? p(t, saida, saida + 0.4, ease.in3) : 0;
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", opacity: k * (1 - s), filter: `blur(${(1 - k) * 14 + s * 10}px)`, transform: `translateY(${(1 - k) * dy - s * 20}px) scale(${1 + (escala - 1) * (1 - k)})`, ...style }}>{children}</div>
  );
};

export const Sobe: React.FC<{ t: number; t0: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; saida?: number; altura: number }> = ({ t, t0, dur = 0.6, children, style, saida, altura }) => {
  const k = p(t, t0, t0 + dur, ease.outExpo);
  const s = saida ? p(t, saida, saida + 0.35, ease.in3) : 0;
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", overflow: "hidden", height: altura * 1.25, paddingTop: altura * 0.05, ...style }}>
      <div style={{ transform: `translateY(${(1 - k) * altura * 1.2 - s * altura * 1.2}px)` }}>{children}</div>
    </div>
  );
};

export const titulo = (tam: number, peso = 600, cor = "#fff"): React.CSSProperties => ({ fontFamily: FONTE_DISPLAY, fontWeight: peso, fontSize: tam, lineHeight: 1, letterSpacing: -tam * 0.025, color: cor, whiteSpace: "nowrap" });
export const lerFaixa = clamp;
