// A FITA: a linha de ritmo / o símbolo como fita acetinada com volume real.
// Geometria em 3D (perspectiva), seção transversal levemente curva (3 faixas com normais inclinadas),
// iluminação: luz principal no alto à esquerda, brilho acetinado, sombras tingidas de roxo profundo.
import React from "react";
import { COR } from "./Marca";

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

function rotar(v: V3, rx: number, ry: number, rz: number): V3 {
  let [x, y, z] = v;
  let c = Math.cos(rz), s = Math.sin(rz); [x, y] = [x * c - y * s, x * s + y * c];
  c = Math.cos(rx); s = Math.sin(rx); [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ry); s = Math.sin(ry); [x, z] = [x * c + z * s, -x * s + z * c];
  return [x, y, z];
}

export type FitaProps = {
  pontos: [number, number, number?][];  // linha central em px de tela, relativa ao centro (cx, cy)
  cx: number; cy: number;
  largura: number;                       // largura da fita em px
  rx?: number; ry?: number; rz?: number;  // graus
  torcao?: (u: number) => number;        // radianos ao longo da fita (u = 0..1)
  ate?: number;                           // desenha até esta fração (0..1)
  corA?: string; corB?: string;          // gradiente ao longo da fita
  luz?: number;                           // deslocamento da luz (varredura de brilho), -1..1
  sombra?: number;                        // opacidade da sombra projetada
  brilho?: number;                        // intensidade do especular
  f?: number;                             // distância focal
  opacidade?: number;
  id?: string;
};

export const Fita3D: React.FC<FitaProps> = ({ pontos, cx, cy, largura, rx = 0, ry = 0, rz = 0, torcao, ate = 1, corA = COR.violeta, corB = COR.lavanda, luz = 0, sombra = 0.45, brilho = 1, f = 2000, opacidade = 1, id = "fita" }) => {
  const n0 = pontos.length;
  const n = Math.max(2, Math.round(n0 * Math.min(1, ate)));
  if (ate <= 0.002) return null;
  const P: V3[] = pontos.slice(0, n).map((p) => [p[0], p[1], p[2] ?? 0]);
  const RX = (rx * Math.PI) / 180, RY = (ry * Math.PI) / 180, RZ = (rz * Math.PI) / 180;
  const L = nrm([-0.42 + luz * 0.9, -0.62, -0.66]);
  const Vw: V3 = [0, 0, -1];
  const H = nrm(add(L, Vw));
  const cA = hex(corA), cB = hex(corB), cS = hex(COR.profundo);
  const proj = (v: V3) => { const k = f / (f + v[2]); return [cx + v[0] * k, cy + v[1] * k, k] as const; };

  const NF = 7; // faixas na largura: seção levemente curva, como cetim
  const faixas = Array.from({ length: NF + 1 }, (_, k) => -1 + (2 * k) / NF);
  const incl = Array.from({ length: NF }, (_, k) => (-1 + (2 * k + 1) / NF) * 0.78);
  type Q = { pts: string; z: number; cor: string };
  let corIni = corA, corFimS = corB;
  const quads: Q[] = [];
  const bordas: { pos: V3[]; nor: V3[] }[] = [];
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    let T = nrm(sub(b, a));
    if (!isFinite(T[0])) T = [1, 0, 0];
    const Np = nrm([-T[1], T[0], 0]);
    const tw = torcao ? torcao(i / (n0 - 1)) : 0;
    const B = nrm(add(mul(Np, Math.cos(tw)), mul([0, 0, 1], Math.sin(tw))));
    const N0 = nrm(cross(T, B));
    const pos = faixas.map((s) => rotar(add(P[i], mul(B, (largura / 2) * s)), RX, RY, RZ));
    const nor = incl.map((ang) => rotar(nrm(sub(mul(N0, Math.cos(ang)), mul(B, Math.sin(ang)))), RX, RY, RZ));
    bordas.push({ pos, nor });
  }
  for (let i = 0; i < n - 1; i++) {
    const u = i / (n0 - 1);
    const base = cA.map((v, k) => v + (cB[k] - v) * u);
    for (let k = 0; k < NF; k++) {
      const p1 = bordas[i].pos[k], p2 = bordas[i].pos[k + 1], p3 = bordas[i + 1].pos[k + 1], p4 = bordas[i + 1].pos[k];
      let nn = nrm(add(bordas[i].nor[k], bordas[i + 1].nor[k]));
      if (dot(nn, Vw) < 0) nn = mul(nn, -1) as V3;
      const dif = Math.max(0, dot(nn, L));
      const nh = Math.max(0, dot(nn, H));
      const spec = Math.pow(nh, 30) * 0.6 * brilho + Math.pow(nh, 6) * 0.14 * brilho;
      const sh = 0.32 + 0.78 * dif;
      const cor = base.map((v, j) => {
        const c = cS[j] + (v - cS[j]) * Math.min(1.15, sh);
        return Math.round(Math.min(255, c + (255 - c) * spec));
      });
      const q = [p1, p2, p3, p4].map(proj);
      if (k === (NF - 1) / 2 && i === 0) corIni = `rgb(${cor.join(",")})`;
      if (k === (NF - 1) / 2) corFimS = `rgb(${cor.join(",")})`;
      quads.push({ pts: q.map((v) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" "), z: (p1[2] + p2[2] + p3[2] + p4[2]) / 4, cor: `rgb(${cor.join(",")})` });
    }
  }
  quads.sort((a, b) => b.z - a.z);

  // pontas redondas
  const ponta = (i: number, sentido: number) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    const T = nrm(sub(b, a));
    const Np: V3 = nrm([-T[1], T[0], 0]);
    const tw = torcao ? torcao(i / (n0 - 1)) : 0;
    const B = nrm(add(mul(Np, Math.cos(tw)), mul([0, 0, 1], Math.sin(tw))));
    const pts: string[] = [];
    for (let k = 0; k <= 12; k++) {
      const ph = (k / 12) * Math.PI;
      const v = add(P[i], add(mul(B, (largura / 2) * Math.cos(ph)), mul(T, sentido * (largura / 2) * Math.sin(ph))));
      const q = proj(rotar(v, RX, RY, RZ));
      pts.push(`${q[0].toFixed(1)},${q[1].toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // sombra projetada (silhueta borrada, tingida de roxo)
  const sombraD = P.map((p, i) => { const q = proj(rotar(p, RX, RY, RZ)); return `${i ? "L" : "M"}${q[0].toFixed(1)} ${(q[1] + largura * 0.9).toFixed(1)}`; }).join(" ");
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: opacidade }}>
      <defs>
        <filter id={`${id}-s`} filterUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}><feGaussianBlur stdDeviation={largura * 0.9} /></filter>
      </defs>
      {sombra > 0 && <path d={sombraD} fill="none" stroke="#12062A" strokeOpacity={sombra} strokeWidth={largura * 1.1} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-s)`} />}
      <polygon points={ponta(0, -1)} fill={corIni} />
      {quads.map((q, i) => <polygon key={i} points={q.pts} fill={q.cor} stroke={q.cor} strokeWidth={0.9} strokeLinejoin="round" />)}
      <polygon points={ponta(n - 1, 1)} fill={corFimS} />
    </svg>
  );
};
