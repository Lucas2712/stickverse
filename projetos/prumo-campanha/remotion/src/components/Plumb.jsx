import React from 'react';
import { C } from '../styles/tokens';
// Fio de prumo: linha fina + peso facetado. Ancorado em (x, top); comprimento len; ângulo em graus.
export const Bob = ({ size = 70, color = C.ink, accent = C.blue, light = false }) => (
  <svg width={size} height={size * 1.45} viewBox="0 0 40 58" style={{ overflow: 'visible', display: 'block' }}>
    <defs>
      <linearGradient id={`bg${light ? 'l' : 'd'}`} x1="0" x2="1">
        <stop offset="0" stopColor={light ? '#FFFFFF' : '#3A3A3C'} />
        <stop offset="0.5" stopColor={light ? '#E8EEF8' : color} />
        <stop offset="1" stopColor={light ? '#BFD6F5' : '#000'} />
      </linearGradient>
    </defs>
    <rect x="15" y="0" width="10" height="7" rx="2" fill={light ? '#fff' : accent} />
    <path d="M6 9h28l-2 14L20 57 8 23z" fill={`url(#bg${light ? 'l' : 'd'})`} />
    <path d="M20 9v48" stroke={light ? 'rgba(0,80,180,0.18)' : 'rgba(255,255,255,0.14)'} strokeWidth="1" />
  </svg>
);
export const Plumb = ({ x = 540, top = -10, len = 500, angle = 0, size = 70, color, light = false, lineColor, opacity = 1, scale = 1 }) => (
  <div style={{ position: 'absolute', left: x, top, width: 0, height: 0, transform: `rotate(${angle}deg) scale(${scale})`, transformOrigin: '0 0', opacity }}>
    <div style={{ position: 'absolute', left: -1.25, top: 0, width: 2.5, height: len, background: lineColor || (light ? 'rgba(255,255,255,0.85)' : 'rgba(29,29,31,0.55)') }} />
    <div style={{ position: 'absolute', left: -size / 2, top: len - 4 }}><Bob size={size} color={color} light={light} /></div>
  </div>
);
