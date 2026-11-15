// Cena 7 · Seu mundo (25,2–28,5 s) · "A VYORA conecta você a destinos em 27 países."
import React from "react";
import {COR, Cheio, Cinetico, E, clamp, display, lerp, p, texto, useT} from "../lib";
import PONTOS from "../dados/mapa.json";

const W = 1500, H = 750;
const proj = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];
const SP = [-46.6, -23.5];
const CID = {
  sp: [SP, "São Paulo", [-150, 26]],
  ssa: [[-38.5, -12.97], "Salvador", [22, -20]],
  lis: [[-9.14, 38.72], "Lisboa", [20, -44]],
  ny: [[-74, 40.7], "Nova York", [-166, -44]],
  cpt: [[18.4, -33.9], "Cidade do Cabo", [24, 12]],
  tyo: [[139.7, 35.7], "Tóquio", [-112, -48]],
  bue: [[-58.4, -34.6]], mex: [[-99.1, 19.4]], dxb: [[55.3, 25.2]], syd: [[151.2, -33.9]], par: [[2.35, 48.85]],
};
const ROTAS = [["sp", "ssa", 25.66], ["sp", "lis", 26.18], ["sp", "ny", 26.3], ["sp", "cpt", 26.42], ["lis", "tyo", 26.54], ["sp", "bue", 26.7], ["ny", "mex", 26.8], ["lis", "dxb", 26.9], ["tyo", "syd", 27.0], ["ny", "par", 27.1]];
const spx = proj(...SP);
const DOTS = PONTOS.map(([lon, lat]) => { const [x, y] = proj(lon, lat); return [x, y, Math.hypot(x - spx[0], y - spx[1])]; });

export const C7Mapa = () => {
  const t = useT();
  const k = p(t, 25.15, 2.9, E.out5);
  const s = lerp(2.7, 0.95, k);
  const c = [lerp(proj(-44, -17)[0], proj(30, 14)[0], k), lerp(proj(-44, -17)[1], proj(30, 14)[1], k)];
  const tela = ([x, y]) => [(x - c[0]) * s + 540, (y - c[1]) * s + 905];
  const onda = (t - 25.0) * 1100;
  const sai = p(t, 28.25, 0.3, E.inn);
  const n = Math.round(27 * p(t, 27.28, 0.6, E.out));
  const chegou = {sp: 25.3};
  ROTAS.forEach(([, b, t0]) => { if (!(b in chegou)) chegou[b] = t0 + 0.4; });
  return (
    <Cheio style={{opacity: p(t, 24.95, 0.3, E.linear), background: `radial-gradient(85% 50% at 50% 47%, #3F1A9E 0%, #22104F 55%, ${COR.profundo} 100%)`}}>
      <svg width="1080" height="1920" style={{position: "absolute", left: 0, top: 0}}>
        <g transform={`translate(${540 - c[0] * s} ${905 - c[1] * s}) scale(${s})`}>
          {DOTS.map(([x, y, d], i) => {
            const o = clamp((onda - d) / 140);
            return o > 0 ? <circle key={i} cx={x} cy={y} r={3.4 / Math.sqrt(s)} fill={COR.violetaClaro} opacity={o * 0.75} /> : null;
          })}
        </g>
        {ROTAS.map(([a, b, t0], i) => {
          const kr = p(t, t0, 0.6, E.inOut);
          if (kr <= 0) return null;
          const A = tela(proj(...CID[a][0])), B = tela(proj(...CID[b][0]));
          const d = Math.hypot(B[0] - A[0], B[1] - A[1]);
          const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - d * 0.32];
          const q = (u) => [(1 - u) * (1 - u) * A[0] + 2 * (1 - u) * u * M[0] + u * u * B[0], (1 - u) * (1 - u) * A[1] + 2 * (1 - u) * u * M[1] + u * u * B[1]];
          const h = q(kr);
          return (
            <g key={i}>
              <path d={`M ${A[0]} ${A[1]} Q ${M[0]} ${M[1]} ${B[0]} ${B[1]}`} fill="none" stroke={i < 5 ? "#FF5CC0" : COR.violetaClaro} strokeWidth={i < 5 ? 4.5 : 3} strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 * (1 - kr)} opacity={i < 5 ? 1 : 0.8} />
              {kr < 1 && <circle cx={h[0]} cy={h[1]} r="9" fill="#fff" />}
            </g>
          );
        })}
        {Object.entries(CID).map(([id, [ll]]) => {
          const t0 = chegou[id];
          const km = p(t, t0, 0.45, E.back);
          if (km <= 0) return null;
          const [x, y] = tela(proj(...ll));
          const pu = ((t - t0) % 1.4) / 1.4;
          return (
            <g key={id}>
              <circle cx={x} cy={y} r={Math.max(0, 12 + pu * 30)} fill="none" stroke="#FF5CC0" strokeWidth="3" opacity={(1 - pu) * 0.8} />
              <circle cx={x} cy={y} r={Math.max(0, 11 * km)} fill={id === "sp" ? "#fff" : COR.magenta} stroke="#fff" strokeWidth="3" />
            </g>
          );
        })}
      </svg>
      {Object.entries(CID).filter(([, v]) => v[1]).map(([id, [ll, nome, [dx, dy]]]) => {
        const kl = p(t, chegou[id] + 0.1, 0.45, E.expo);
        if (kl <= 0) return null;
        const [x, y] = tela(proj(...ll));
        return (
          <div key={id} style={{position: "absolute", left: x + dx, top: y + dy, ...texto, fontSize: 27, fontWeight: 600, color: "#fff", background: "rgba(22,10,51,.72)", border: "2px solid rgba(233,222,255,.25)", borderRadius: 30, padding: "7px 16px", whiteSpace: "nowrap", opacity: clamp(kl * 2) * (1 - sai), transform: `translateY(${(1 - kl) * 16}px)`}}>
            {nome}
          </div>
        );
      })}
      <div style={{position: "absolute", left: 80, top: 250, opacity: 1 - sai}}>
        <Cinetico tam={116} itens={[[26.66, "Seu"], [26.8, "mundo,"], "\n", [27.0, "sem", "#FF7CCB"], [27.14, "limites.", "#FF7CCB"]]} />
      </div>
      <div style={{position: "absolute", left: 80, top: 1296, display: "flex", alignItems: "baseline", gap: 26, opacity: p(t, 27.28, 0.3, E.out) * (1 - sai), transform: `translateY(${(1 - p(t, 27.28, 0.6, E.expo)) * 70}px)`}}>
        <span style={{...display, fontSize: 280, lineHeight: 1, color: "#fff", fontVariantNumeric: "tabular-nums"}}>{n}</span>
        <span style={{...display, fontSize: 92, color: COR.violetaClaro}}>países</span>
      </div>
    </Cheio>
  );
};
