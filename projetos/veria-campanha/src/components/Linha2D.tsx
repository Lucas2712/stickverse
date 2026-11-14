// Desenho plano da linha de ritmo: traço com gradiente e brilho (halo) opcional.
import React from "react";
import { caminho, Pts } from "./linha";

export const Linha2D: React.FC<{ pts: Pts; largura: number; corA: string; corB?: string; brilho?: number; opacidade?: number; id: string; ate?: number }> = ({ pts, largura, corA, corB, brilho = 0, opacidade = 1, id, ate = 1 }) => {
  const usar = ate < 1 ? pts.slice(0, Math.max(2, Math.round(pts.length * ate))) : pts;
  const d = caminho(usar);
  const xs = pts.map((p) => p[0]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs) + 0.1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: opacidade }}>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={x0} y1={0} x2={x1} y2={0}>
          <stop offset="0" stopColor={corA} />
          <stop offset="1" stopColor={corB ?? corA} />
        </linearGradient>
        <filter id={`${id}-b`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation={largura * 2.2} /></filter>
      </defs>
      {brilho > 0 && <path d={d} fill="none" stroke={`url(#${id}-g)`} strokeWidth={largura * 2.4} strokeLinecap="round" strokeLinejoin="round" opacity={brilho} filter={`url(#${id}-b)`} />}
      <path d={d} fill="none" stroke={`url(#${id}-g)`} strokeWidth={largura} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
