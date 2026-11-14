// ROVIA · componentes reutilizáveis (marca, números, aparelhos, gráficos, fundos)
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONTE, display, texto, rnd, p, k, outExpo, out3 } from "./lib";

// ---------- marca ----------
/** Ícone ROVIA: um R desenhado como estrada, cuja perna vira uma linha de gráfico subindo. */
export const RoviaIcone: React.FC<{ size: number; draw?: number; radius?: number }> = ({ size, draw = 1, radius = 0.27 }) => {
  const d = "M31 79 L31 24 L52 24 C65 24 71 32 71 40.5 C71 49 65 56.5 52 56.5 L31 56.5 M47 56.5 L58 69 L78 44";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="rvg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1FCFBC" />
          <stop offset="1" stopColor="#0A8076" />
        </linearGradient>
        <linearGradient id="rvl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx={radius * 100} fill="url(#rvg)" />
      <rect x="0" y="0" width="100" height="100" rx={radius * 100} fill="url(#rvl)" />
      <path d={d} fill="none" stroke="#fff" strokeWidth={9.5} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      <path d={d} fill="none" stroke="#0B7F74" strokeWidth={1.6} strokeLinecap="round" strokeDasharray="3 3.4"
        opacity={draw >= 1 ? 0.9 : 0} />
      <circle cx="78" cy="44" r={5.4 * Math.min(1, Math.max(0, (draw - 0.92) / 0.08))} fill="#fff" />
    </svg>
  );
};

export const RoviaNome: React.FC<{ tam: number; cor?: string }> = ({ tam, cor = C.tinta }) => (
  <span style={{ ...display(650, tam), letterSpacing: "0.16em", color: cor, lineHeight: 1 }}>ROVIA</span>
);

// ---------- números que rolam ----------
/** Contador estilo odômetro: cada dígito rola na vertical. `molde` fixa a largura (ex.: "0.000,00"). */
export const Rolo: React.FC<{ valor: number; molde: string; dec?: number; style?: React.CSSProperties }> = ({ valor, molde, dec = 2, style }) => {
  const h = 1.0; // em "em"
  const v = Math.max(0, valor);
  // casas (potência de 10) de cada dígito do molde, da esquerda para a direita
  const casasInt = molde.split(",")[0].replace(/\D/g, "").length;
  const casas: number[] = [];
  let pos = casasInt - 1;
  for (const ch of molde) if (/\d/.test(ch)) casas.push(pos--);
  // odômetro: o dígito mais baixo gira contínuo; cada dígito acima só gira enquanto o de baixo passa de 9 para 0
  const dvs: Record<number, number> = {};
  const menor = Math.min(...casas);
  for (let c = menor; c <= casasInt - 1; c++) {
    const unid = Math.pow(10, c);
    if (c === menor) dvs[c] = (v / unid) % 10;
    else {
      const baixo = dvs[c - 1];
      dvs[c] = (Math.floor(v / unid + 1e-9) % 10) + (baixo >= 9 ? baixo - 9 : 0);
    }
  }
  const out: React.ReactNode[] = [];
  let di = 0;
  molde.split("").forEach((ch, i) => {
    if (/\d/.test(ch)) {
      const casa = casas[di++];
      const unid = Math.pow(10, casa);
      const visivel = casa <= 0 || v >= unid * 0.9;
      out.push(
        <span key={i} style={{ display: "inline-block", height: `${h}em`, overflow: "hidden", verticalAlign: "top", width: visivel ? "auto" : 0 }}>
          <span style={{ display: "block", transform: `translateY(${-(dvs[casa] % 10) * h}em)` }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, j) => (
              <span key={j} style={{ display: "block", height: `${h}em`, lineHeight: `${h}em` }}>{n}</span>
            ))}
          </span>
        </span>
      );
    } else {
      const proxCasa = casas[di];
      const visivel = ch === "," || v >= Math.pow(10, proxCasa + 1) * 0.9;
      out.push(<span key={i} style={{ display: "inline-block", lineHeight: `${h}em`, height: `${h}em`, verticalAlign: "top", width: visivel ? "auto" : 0, overflow: "hidden" }}>{ch}</span>);
    }
  });
  return <span style={{ display: "inline-flex", fontVariantNumeric: "tabular-nums", ...style }}>{out}</span>;
};

// ---------- aparelhos ----------
export const Celular: React.FC<{ w: number; children?: React.ReactNode; tela?: string; style?: React.CSSProperties; claro?: boolean }> = ({ w, children, tela = "#0B1416", style, claro }) => {
  const h = w * 2.06;
  const r = w * 0.155;
  const b = w * 0.032;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: r, padding: b,
      background: claro ? "linear-gradient(140deg,#E9EEF0,#B9C3C7 40%,#F4F7F8 60%,#A9B4B8)" : "linear-gradient(140deg,#3A4447,#1A2224 35%,#4A5558 55%,#151C1E)",
      boxShadow: `0 ${w * 0.08}px ${w * 0.16}px rgba(5,20,22,0.28), 0 ${w * 0.02}px ${w * 0.03}px rgba(5,20,22,0.25), inset 0 0 0 ${Math.max(1, w * 0.004)}px rgba(255,255,255,0.25)`,
      ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: r - b, overflow: "hidden", background: tela }}>
        {children}
        <div style={{ position: "absolute", top: w * 0.035, left: "50%", width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: w, background: "#000" }} />
      </div>
    </div>
  );
};

// ---------- gráficos ----------
export const MiniBarras: React.FC<{ n?: number; cor: string; prog: number; seed: number; w: number; h: number; sobe?: boolean }> = ({ n = 12, cor, prog, seed, w, h, sobe = true }) => {
  const gap = w / n;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {Array.from({ length: n }).map((_, i) => {
        const tend = sobe ? 0.35 + 0.6 * (i / (n - 1)) : 0.95 - 0.55 * (i / (n - 1));
        const hh = h * Math.min(1, tend * (0.7 + 0.5 * rnd(seed * 31 + i)));
        const pi = Math.max(0, Math.min(1, prog * 1.6 - i * (0.6 / n)));
        const e = out3(pi);
        return <rect key={i} x={i * gap + gap * 0.18} y={h - hh * e} width={gap * 0.64} height={hh * e} rx={gap * 0.2} fill={cor} opacity={0.35 + 0.65 * (i / n)} />;
      })}
    </svg>
  );
};

export const Anel: React.FC<{ size: number; pct: number; prog: number; cor: string; fundo?: string; texto?: string }> = ({ size, pct, prog, cor, fundo = "rgba(255,255,255,0.08)", texto: tx }) => {
  const r = size / 2 - size * 0.08;
  const L = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={fundo} strokeWidth={size * 0.075} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={cor} strokeWidth={size * 0.075} strokeLinecap="round"
          strokeDasharray={`${L * pct * prog} ${L}`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...texto(650, size * 0.24), color: "#fff" }}>
        {tx ?? `${Math.round(pct * 100 * prog)}%`}
      </div>
    </div>
  );
};

// ---------- fundos ----------
export const FundoNevoa: React.FC<{ tom?: "nevoa" | "lilas" | "cinza"; deriva?: number }> = ({ tom = "nevoa", deriva = 0 }) => {
  const base = tom === "lilas" ? "#EDEFF7" : tom === "cinza" ? "#E7EAEA" : C.nevoa;
  const g1 = tom === "lilas" ? "rgba(150,160,235,0.30)" : "rgba(19,184,166,0.16)";
  const g2 = tom === "lilas" ? "rgba(255,255,255,0.9)" : "rgba(150,205,235,0.30)";
  return (
    <AbsoluteFill style={{ background: base }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 900px at ${85 + deriva * 6}% ${-5 + deriva * 4}%, ${g1}, transparent 70%), radial-gradient(1000px 1000px at ${5 - deriva * 5}% ${100 - deriva * 3}%, ${g2}, transparent 70%)` }} />
      <Grao opacity={0.035} />
    </AbsoluteFill>
  );
};

export const FundoAsfalto: React.FC<{ brilho?: string; deriva?: number; azul?: boolean }> = ({ brilho = "rgba(19,184,166,0.14)", deriva = 0, azul }) => (
  <AbsoluteFill style={{ background: azul ? "#070D1C" : C.asfalto }}>
    <AbsoluteFill style={{ background: `radial-gradient(1100px 900px at ${50 + deriva * 8}% ${30 - deriva * 5}%, ${brilho}, transparent 70%), radial-gradient(800px 800px at 90% 100%, ${azul ? "rgba(60,80,200,0.25)" : "rgba(255,107,91,0.06)"}, transparent 70%)` }} />
    <Grao opacity={0.06} />
  </AbsoluteFill>
);

export const Grao: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>")` }} />
);

/** desfoque direcional (chicote) — filtro SVG com desvio só em x ou y */
export const FiltroChicote: React.FC<{ id: string; x: number; y?: number }> = ({ id, x, y = 0 }) => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={`${Math.max(0.001, x)} ${Math.max(0.001, y)}`} />
    </filter>
  </svg>
);

/** card de vidro claro */
export const VidroClaro: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,250,0.92))", borderRadius: 34,
    boxShadow: "0 40px 80px rgba(14,40,44,0.14), 0 8px 18px rgba(14,40,44,0.08), inset 0 0 0 1.5px rgba(255,255,255,0.9)", ...style }}>
    {children}
  </div>
);

/** card escuro de painel */
export const CardEscuro: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "linear-gradient(180deg,#18252A,#111B1E)", borderRadius: 30, boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.07)", ...style }}>
    {children}
  </div>
);

export const Pilula: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ ...texto(600, 24), padding: "12px 26px", borderRadius: 999, background: "#EEF3F2", color: C.tinta2, ...style }}>{children}</div>
);

export { FONTE, p, k, outExpo };
