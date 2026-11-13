import React from 'react';
import { prog, expoOut } from '../animations/motion';
// Palavras que entram uma a uma, sincronizadas com a narração (s = segundo absoluto da palavra)
export const Words = ({ t, words, style, gap = '0.26em', lead = 0.06, dur = 0.55, dist = 46, blur = 16, align = 'center' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: align, columnGap: gap, ...style }}>
    {words.map((w, i) => {
      const p = prog(t, w.s - lead, w.dur ?? dur, expoOut);
      return (
        <span key={i} style={{
          display: 'inline-block', opacity: Math.min(1, p * 1.7),
          transform: `translateY(${(1 - p) * dist}px) scale(${0.96 + 0.04 * p})`,
          filter: `blur(${(1 - p) * blur}px)`, ...w.style,
        }}>{w.w}</span>
      );
    })}
  </div>
);
