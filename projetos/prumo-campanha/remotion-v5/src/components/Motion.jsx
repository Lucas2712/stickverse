import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display } from '../styles/tokens';
import { spr, prog } from '../animations/motion';
import { camTransform, camBlur, kf } from '../animations/cam';

// Mundo com câmera e desfoque de movimento direcional (filtro SVG por cena)
export const World = ({ t, keys, id, children, perspective = 2400, style }) => {
  const c = kf(t, keys); const [bx, by] = camBlur(t, keys);
  const blur = bx > 2 || by > 2;
  return (
    <AbsoluteFill style={{ perspective, overflow: 'hidden', ...style }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}><filter id={id} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: camTransform(c), filter: blur ? `url(#${id})` : 'none' }}>{children}</div>
    </AbsoluteFill>
  );
};
// objeto posicionado no mundo pelo centro
export const At = ({ x, y, z = 0, w, h, rot = 0, s = 1, style, children }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateZ(${z}px) rotate(${rot}deg) scale(${s})`, transformStyle: 'preserve-3d', ...style }}>{children}</div>
);
// tipografia letra a letra subindo de dentro de uma máscara
export const Letters = ({ t, s, text, size = 160, weight = 700, color = C.ink, stagger = 0.028, style, from = 1.05, out, outDur = 0.25, fade = false }) => {
  const o = out ? prog(t, out, outDur) : 0;
  return (
    <div style={{ display: 'inline-flex', overflow: 'hidden', padding: `${size * 0.08}px 0 ${size * 0.14}px`, ...style }}>
      {[...text].map((ch, i) => {
        const k = spr(t, s + i * stagger, { damping: 17, stiffness: 210 });
        const ko = out ? prog(t, out + i * stagger * 0.5, outDur) : 0;
        return <span key={i} style={{ ...display(weight), fontSize: size, color, lineHeight: 1, display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${(1 - k) * from * 100 - ko * 105}%) rotate(${(1 - k) * 8}deg)`, opacity: fade ? Math.min(1, k * 2.2) : (k > 0.01 ? 1 : 0) }}>{ch}</span>;
      })}
    </div>
  );
};
// holofote: escurece tudo menos um retângulo arredondado (foco da demonstração)
export const Spotlight = ({ x, y, w, h, r = 40, k = 1, dim = 0.55 }) => (
  <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: k }}>
    <defs><mask id="spot"><rect width="1080" height="1920" fill="#fff" /><rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={r} fill="#000" /></mask></defs>
    <rect width="1080" height="1920" fill={`rgba(16,18,24,${dim})`} mask="url(#spot)" />
    <rect x={x - w / 2 - 4} y={y - h / 2 - 4} width={w + 8} height={h + 8} rx={r + 4} fill="none" stroke={C.blue} strokeWidth="4" />
  </svg>
);
// varredura de luz
export const Sheen = ({ p, angle = 24, width = 260, color = 'rgba(255,255,255,0.55)' }) => p <= 0 || p >= 1 ? null : (
  <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', top: -400, left: -600 + p * 2400, width, height: 2800, transform: `rotate(${angle}deg)`, background: `linear-gradient(90deg, rgba(255,255,255,0), ${color}, rgba(255,255,255,0))` }} />
  </AbsoluteFill>
);
// cortina da agulha: uma cunha que gira em torno de um pivô e revela a próxima cena
export const NeedleWipe = ({ p, cx = 540, cy = -200, children }) => {
  if (p <= 0) return null;
  const a = -100 + p * 200;  // varre de -100° a +100°
  const pts = [[cx, cy]]; for (let k = -100; k <= a; k += 4) { const r = (k * Math.PI) / 180; pts.push([cx + Math.sin(r) * 4000, cy + Math.cos(r) * 4000]); }
  const poly = p >= 1 ? 'none' : `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(',')})`;
  return <AbsoluteFill style={{ clipPath: poly }}>{children}</AbsoluteFill>;
};
