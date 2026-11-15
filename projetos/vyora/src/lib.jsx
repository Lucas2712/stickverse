// VYORA · utilidades de tempo, curvas e tema. Todos os tempos são segundos absolutos do comercial.
import React, {createContext, useContext} from "react";
import {Sequence, useCurrentFrame, useVideoConfig} from "remotion";

export const COR = {
  profundo: "#160A33",
  noite: "#0B0618",
  violeta: "#7A2BFF",
  violetaClaro: "#B58CFF",
  magenta: "#E6189B",
  branco: "#FFFFFF",
  lavanda: "#E9DEFF",
  lavandaSuave: "#F5F0FF",
  tinta: "#1C0F3F",
  tinta2: "#6B5F8A",
  linha: "#E4DAFA",
};

export const FONTE = "'Inter', 'Inter Display', system-ui, sans-serif";
export const display = {fontFamily: FONTE, fontVariationSettings: "'opsz' 32", letterSpacing: "-0.035em", fontWeight: 700};
export const texto = {fontFamily: FONTE, fontVariationSettings: "'opsz' 14", letterSpacing: "-0.011em", fontWeight: 500};

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const E = {
  linear: (x) => x,
  out: (x) => 1 - Math.pow(1 - x, 3),
  out5: (x) => 1 - Math.pow(1 - x, 5),
  expo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inn: (x) => x * x * x,
  inExpo: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  back: (x) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
};
// progresso 0..1 de uma animação que começa em t0 e dura d
export const p = (t, t0, d, ease = E.expo) => ease(clamp((t - t0) / d));
// valor de a até b
export const v = (t, t0, d, a, b, ease = E.expo) => lerp(a, b, p(t, t0, d, ease));
// pulso 0→1→0 centrado em t0
export const pulso = (t, t0, d) => {
  const x = clamp((t - t0) / d);
  return Math.sin(x * Math.PI);
};

const Inicio = createContext(0);
// tempo absoluto em segundos, mesmo dentro de uma <Cena>
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps + useContext(Inicio);
};
// Uma cena da linha do tempo: montada só entre a e b (segundos absolutos)
export const Cena = ({a, b, children, nome}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(a * fps);
  return (
    <Sequence from={from} durationInFrames={Math.round(b * fps) - from} name={nome} layout="none">
      <Inicio.Provider value={from / fps}>{children}</Inicio.Provider>
    </Sequence>
  );
};

export const Cheio = ({style, children, ...r}) => (
  <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "hidden", ...style}} {...r}>
    {children}
  </div>
);

// Texto cinético: cada palavra sobe da máscara no seu tempo. itens: [[t, "palavra", cor?]] ; "\n" quebra a linha
export const Cinetico = ({itens, tam = 96, cor = "#fff", altura = 1.04, peso = 700, alinhar = "left", dur = 0.55, saida, estilo}) => {
  const t = useT();
  const linhas = [[]];
  itens.forEach((it) => (it === "\n" ? linhas.push([]) : linhas[linhas.length - 1].push(it)));
  const ks = saida != null ? p(t, saida, 0.3, E.inn) : 0;
  return (
    <div style={{...display, fontWeight: peso, fontSize: tam, lineHeight: altura, color: cor, textAlign: alinhar, opacity: 1 - ks, transform: `translateY(${-30 * ks}px)`, ...estilo}}>
      {linhas.map((l, i) => (
        <div key={i} style={{overflow: "hidden", padding: `${tam * 0.08}px ${tam * 0.06}px ${tam * 0.14}px`, margin: `${-tam * 0.08}px ${-tam * 0.06}px ${-tam * 0.14}px`}}>
          {l.map(([t0, w, c], j) => {
            const k = p(t, t0, dur, E.expo);
            return (
              <span key={j} style={{display: "inline-block", whiteSpace: "pre", color: c || "inherit", transform: `translateY(${(1 - k) * 115}%) rotate(${(1 - k) * 5}deg)`, transformOrigin: "0 100%", opacity: clamp(k * 3), filter: k < 0.9 ? `blur(${(1 - k) * 6}px)` : "none"}}>
                {w + (j < l.length - 1 ? " " : "")}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Toque do dedo: anel que expande no ponto do toque
export const Toque = ({x, y, t0, cor = COR.violeta}) => {
  const t = useT();
  const k = p(t, t0, 0.55, E.out);
  if (t < t0 || k >= 1) return null;
  return (
    <>
      <div style={{position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, border: `5px solid ${cor}`, opacity: 1 - k, transform: `scale(${0.3 + k * 1.2})`}} />
      <div style={{position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 26, background: cor, opacity: 0.35 * (1 - k), transform: `scale(${1 - k * 0.3})`}} />
    </>
  );
};
