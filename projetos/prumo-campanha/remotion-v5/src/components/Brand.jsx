import React from 'react';
import { C, display } from '../styles/tokens';
import { Bob } from './Plumb';
// Marca fictícia "prumo": ícone (quadrado arredondado com o peso) + nome em minúsculas
export const AppIcon = ({ size = 200, dark = false, style }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.27, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: dark ? 'linear-gradient(160deg,#2997FF,#0071E3 55%,#0058B8)' : '#fff',
    boxShadow: dark ? '0 10px 30px rgba(0,80,180,0.35), inset 0 1px 0 rgba(255,255,255,0.35)' : '0 10px 30px rgba(0,0,0,0.18), inset 0 -2px 0 rgba(0,0,0,0.04)',
    ...style,
  }}>
    <div style={{ position: 'relative', width: size * 0.36, height: size * 0.62, marginTop: -size * 0.04 }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, width: size * 0.018, height: size * 0.16, marginLeft: -size * 0.009, background: dark ? '#fff' : C.blue, borderRadius: 2 }} />
      <div style={{ position: 'absolute', left: 0, top: size * 0.13 }}>{dark ? <Bob size={size * 0.36} light /> : <BobBlue size={size * 0.36} />}</div>
    </div>
  </div>
);
const BobBlue = ({ size }) => (
  <svg width={size} height={size * 1.45} viewBox="0 0 40 58">
    <defs><linearGradient id="bb" x1="0" x2="1"><stop offset="0" stopColor="#2997FF" /><stop offset="0.55" stopColor="#0071E3" /><stop offset="1" stopColor="#0058B8" /></linearGradient></defs>
    <rect x="15" y="0" width="10" height="7" rx="2" fill="#0071E3" />
    <path d="M6 9h28l-2 14L20 57 8 23z" fill="url(#bb)" />
  </svg>
);
export const Wordmark = ({ size = 200, color = C.ink, style }) => (
  <div style={{ ...display(700), fontSize: size, lineHeight: 1, color, letterSpacing: '-0.055em', ...style }}>prumo</div>
);
