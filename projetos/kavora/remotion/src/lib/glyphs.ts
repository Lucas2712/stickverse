// Letreiro KAVORA desenhado do zero: alfabeto geométrico de traço fixo.
// Os dois "A" são chevrons sem barra (Λ): setas de estrada que apontam para frente.
// A mesma geometria gera o SVG (logo 2D) e as formas extrudadas (letras e emblema 3D).
// Coordenadas com y para cima, altura de caixa-alta = 1.

export type Seg = ['M', number, number] | ['L', number, number] | ['A', number, number, number, number, number, boolean];
export type Contour = Seg[];
export type Part = {outer: Contour; holes?: Contour[]};
export type Glyph = {w: number; parts: Part[]};

export const STROKE = 0.175;
const s = STROKE;

const poly = (pts: [number, number][]): Contour => pts.map((p, i) => [i ? 'L' : 'M', p[0], p[1]] as Seg);

/** Haste inclinada com cortes horizontais (pé e topo retos, como no desenho de tipos). */
const slant = (xb: number, yb: number, xt: number, yt: number, w = s): Contour => {
  const th = Math.atan2(Math.abs(yt - yb), Math.abs(xt - xb));
  const hw = w / (2 * Math.sin(th));
  return poly([
    [xb - hw, yb],
    [xb + hw, yb],
    [xt + hw, yt],
    [xt - hw, yt],
  ]);
};

const rect = (x0: number, y0: number, x1: number, y1: number) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);

const chevron = (w: number, flip: boolean): Contour => {
  const a = 0.05; // topo levemente aparado
  const th = Math.atan2(1, w / 2 - a);
  const hw2 = s / Math.sin(th); // espessura horizontal
  const ti = (w / 2 - hw2) / (w / 2 - a);
  const pts: [number, number][] = [
    [0, 0], [w / 2 - a, 1], [w / 2 + a, 1], [w, 0], [w - hw2, 0], [w / 2, ti], [hw2, 0],
  ];
  return poly(flip ? pts.map(([x, y]) => [x, 1 - y]) : pts);
};

export const GLYPHS: Record<string, Glyph> = {
  K: {
    w: 0.74,
    parts: [
      {outer: rect(0, 0, s, 1)},
      {outer: slant(0.24, 0.4, 0.68, 1)},
      {outer: slant(0.72, 0, 0.385, 0.6)},
    ],
  },
  A: {w: 0.8, parts: [{outer: chevron(0.8, false)}]},
  V: {w: 0.8, parts: [{outer: chevron(0.8, true)}]},
  O: {
    w: 1.0,
    parts: [
      {
        outer: [['M', 1, 0.5], ['A', 0.5, 0.5, 0.5, 0, Math.PI * 2, false]],
        holes: [[['M', 1 - s * 1.05, 0.5], ['A', 0.5, 0.5, 0.5 - s * 1.05, 0, Math.PI * 2, false]]],
      },
    ],
  },
  R: {
    w: 0.7,
    parts: [
      {outer: rect(0, 0, s, 1)},
      {
        outer: [['M', 0, 1], ['L', 0.41, 1], ['A', 0.41, 0.73, 0.27, Math.PI / 2, -Math.PI / 2, true], ['L', 0, 0.46]],
        holes: [[['M', s, 1 - s], ['L', 0.41, 1 - s], ['A', 0.41, 0.73, 0.27 - s, Math.PI / 2, -Math.PI / 2, true], ['L', s, 0.46 + s]]],
      },
      {outer: slant(0.68, 0, 0.36, 0.48)},
    ],
  },
};

export const WORD = 'KAVORA';
export const TRACK = 0.24;

/** Posições x de cada letra e largura total do letreiro (unidades de altura). */
export const layout = (word = WORD, track = TRACK) => {
  let x = 0;
  const xs = word.split('').map((ch) => {
    const p = x;
    x += GLYPHS[ch].w + track;
    return p;
  });
  return {xs, width: x - track};
};

// ---------- conversão para SVG (y para baixo) ----------
const pt = (x: number, y: number, ox: number) => `${(x + ox).toFixed(4)} ${(1 - y).toFixed(4)}`;

export const contourD = (c: Contour, ox = 0) => {
  let d = '';
  for (const seg of c) {
    if (seg[0] === 'M') d += `M${pt(seg[1], seg[2], ox)}`;
    else if (seg[0] === 'L') d += `L${pt(seg[1], seg[2], ox)}`;
    else {
      const [, cx, cy, r, a0, a1, cw] = seg;
      const full = Math.abs(a1 - a0) >= Math.PI * 2 - 1e-6;
      const sx = cx + r * Math.cos(a0), sy = cy + r * Math.sin(a0);
      d += `L${pt(sx, sy, ox)}`;
      // y para cima → tela: anti-horário visual = sweep 0
      const sweep = cw ? 1 : 0;
      if (full) {
        const mx = cx + r * Math.cos(a0 + Math.PI), my = cy + r * Math.sin(a0 + Math.PI);
        d += `A${r} ${r} 0 1 ${sweep} ${pt(mx, my, ox)}A${r} ${r} 0 1 ${sweep} ${pt(sx, sy, ox)}`;
      } else {
        const ex = cx + r * Math.cos(a1), ey = cy + r * Math.sin(a1);
        const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
        d += `A${r} ${r} 0 ${large} ${sweep} ${pt(ex, ey, ox)}`;
      }
    }
  }
  return d + 'Z';
};

export const partD = (p: Part, ox = 0) => [p.outer, ...(p.holes || [])].map((c) => contourD(c, ox)).join('');

// ---------- emblema: ladrilho arredondado com o K ----------
export const TILE_R = 0.27;
