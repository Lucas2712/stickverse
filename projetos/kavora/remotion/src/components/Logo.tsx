// Logotipo KAVORA em 2D: emblema (ladrilho laranja com K) + letreiro geométrico.
import React from 'react';
import {C} from '../theme';
import {GLYPHS, layout, partD, TILE_R, WORD} from '../lib/glyphs';

/** Letreiro. `letter(i)` devolve transformações por letra (para animar a montagem). */
export const Wordmark: React.FC<{
  height: number; color?: string; accent?: string;
  letter?: (i: number) => {y?: number; o?: number; s?: number; blur?: number};
  shine?: number; // -1..2: posição do brilho que percorre o letreiro
}> = ({height, color = C.graphite, accent, letter, shine}) => {
  const {xs, width} = layout();
  const pad = 0.1;
  const id = `wm${Math.round(height)}`;
  return (
    <svg width={(width + pad * 2) * height} height={height * (1 + pad * 2)} viewBox={`${-pad} ${-pad} ${width + pad * 2} ${1 + pad * 2}`} style={{overflow: 'visible', display: 'block'}}>
      {shine !== undefined && (
        <defs>
          <linearGradient id={`${id}-sh`} x1={shine * width - 0.8} x2={shine * width + 0.8} y1="0" y2="0.3" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={color} />
            <stop offset="0.5" stopColor={C.orangeL} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
      )}
      {WORD.split('').map((ch, i) => {
        const L = letter ? letter(i) : {};
        const g = GLYPHS[ch];
        const cx = xs[i] + g.w / 2;
        const fill = accent && ch === 'A' && i === 1 ? accent : shine !== undefined ? `url(#${id}-sh)` : color;
        return (
          <g key={i} opacity={L.o ?? 1} transform={`translate(0 ${L.y ?? 0}) translate(${cx} 0.5) scale(${L.s ?? 1}) translate(${-cx} -0.5)`}>
            {g.parts.map((p, j) => (
              <path key={j} d={partD(p, xs[i])} fill={fill} fillRule="evenodd" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/** Emblema: ladrilho laranja com K branco e luz de borda. */
export const Tile: React.FC<{size: number; color?: string; glyph?: string; style?: React.CSSProperties; lit?: number}> = ({
  size, color, glyph = C.white, style, lit = 1,
}) => {
  const g = GLYPHS.K;
  const k = 0.48; // altura do K relativa ao ladrilho
  return (
    <div style={{
      width: size, height: size, borderRadius: size * TILE_R,
      background: color || `linear-gradient(150deg, ${C.orangeL} 0%, ${C.orange} 52%, ${C.orange} 100%)`,
      boxShadow: `inset 0 ${size * 0.02}px 0 rgba(255,255,255,${0.5 * lit}), inset 0 -${size * 0.03}px ${size * 0.06}px rgba(17,17,17,0.12), 0 ${size * 0.12}px ${size * 0.3}px rgba(255,113,56,${0.35 * lit}), 0 ${size * 0.04}px ${size * 0.08}px rgba(17,17,17,0.10)`,
      display: 'grid', placeItems: 'center', ...style,
    }}>
      <svg width={size * k * g.w} height={size * k} viewBox={`0 0 ${g.w} 1`} style={{overflow: 'visible', transform: `translateX(${size * 0.015}px)`}}>
        {g.parts.map((p, j) => <path key={j} d={partD(p)} fill={glyph} />)}
      </svg>
    </div>
  );
};
