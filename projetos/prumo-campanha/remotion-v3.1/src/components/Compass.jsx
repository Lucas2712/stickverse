import React from 'react';
import { C } from '../styles/tokens';
import { prog, spr, lerp, inOut, expoOut } from '../animations/motion';
import { Bob } from './Plumb';

// BÚSSOLA DO PRUMO · assinatura visual exclusiva da marca.
// Fases (segundos absolutos): a = aparece · spin = gira procurando · settle = trava apontando para baixo · morph = vira o ícone
// O ângulo 0 aponta para baixo (o prumo). Tudo em 3D leve: anel com profundidade, agulha com sombra.
export const needleAngle = (t, f) => {
  if (t < f.spin) return -150 + Math.sin(t * 2) * 6;                                 // parada, torta
  if (t < f.settle) {                                                                  // giro de busca: 1,5 volta desacelerando
    const p = inOut((t - f.spin) / (f.settle - f.spin));
    return lerp(-150, 540 + 34, p);
  }
  const d = t - f.settle;                                                              // oscilação amortecida até 0°
  return 34 * Math.exp(-d * 3.2) * Math.cos(d * 13);
};
export const Compass = ({ t, f, size = 460, cx = 540, cy = 960, dark = false, iconTo = 230 }) => {
  const ring = prog(t, f.a, 0.9, expoOut);
  const ang = needleAngle(t, f) % 360;
  const lock = spr(t, f.settle + 0.55, { damping: 12, stiffness: 180 });
  const morph = prog(t, f.morph, 0.65, inOut);
  const glint = prog(t, f.settle + 0.45, 0.8);
  const S = lerp(size, iconTo, morph);
  const ink = dark ? '#fff' : C.ink;
  const ticks = 60;
  return (
    <div style={{ position: 'absolute', left: cx - S / 2, top: cy - S / 2, width: S, height: S, perspective: 1200 }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${(1 - ring) * 55 + (1 - morph) * Math.sin(t * 0.9) * 4}deg) rotateY(${(1 - morph) * Math.cos(t * 0.7) * 5}deg)` }}>
        {/* corpo: disco → quadrado arredondado azul (ícone) */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: `${lerp(50, 27, morph)}%`,
          background: morph > 0 ? `linear-gradient(160deg, rgba(41,151,255,${morph}), rgba(0,113,227,${morph}) 55%, rgba(0,88,184,${morph}))` : 'transparent',
          boxShadow: `0 ${30 * ring}px ${70 * ring}px rgba(0,40,100,${0.18 * ring}), inset 0 0 0 ${lerp(3, 0, morph)}px ${dark ? 'rgba(255,255,255,0.6)' : 'rgba(29,29,31,0.18)'}`,
          opacity: ring,
        }} />
        {/* vidro do mostrador */}
        <div style={{ position: 'absolute', inset: S * 0.04, borderRadius: '50%', background: dark ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 60%)' : 'radial-gradient(circle at 35% 30%, #FFFFFF, #F1F2F5 70%)', opacity: ring * (1 - morph), boxShadow: dark ? 'none' : 'inset 0 4px 14px rgba(0,0,0,0.06)' }} />
        {/* marcações em cascata */}
        <svg width={S} height={S} viewBox="-100 -100 200 200" style={{ position: 'absolute', inset: 0, opacity: 1 - morph }}>
          {Array.from({ length: ticks }, (_, i) => {
            const k = prog(t, f.a + 0.15 + i * 0.008, 0.35);
            const a = (i / ticks) * Math.PI * 2 + (1 - k) * 0.6;
            const major = i % 15 === 0, r1 = major ? 78 : 83, r2 = 89;
            const down = i === 0;               // marcação de baixo (direção) em azul
            return <line key={i} x1={Math.sin(a) * r1} y1={Math.cos(a) * r1} x2={Math.sin(a) * r2} y2={Math.cos(a) * r2} stroke={down ? C.blue : ink} strokeOpacity={down ? k : (major ? 0.7 : 0.25) * k} strokeWidth={down ? 3.4 : major ? 2.2 : 1.1} strokeLinecap="round" />;
          })}
          <circle r="93" fill="none" stroke={ink} strokeOpacity={0.25} strokeWidth="1.2" strokeDasharray={`${584 * ring} 600`} transform="rotate(90)" />
          <circle cx="0" cy="96" r={3.6 * lock} fill={C.blue} />
        </svg>
        {/* reflexo de luz passando */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: `${lerp(50, 27, morph)}%`, overflow: 'hidden', opacity: glint > 0 && glint < 1 ? 1 : 0 }}>
          <div style={{ position: 'absolute', top: -S * 0.2, left: lerp(-S * 0.6, S * 1.2, glint), width: S * 0.22, height: S * 1.4, transform: 'rotate(24deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))' }} />
        </div>
        {/* agulha: contrapeso fino em cima + peso do prumo embaixo */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transform: `translateZ(${20 * (1 - morph)}px) rotate(${ang}deg) scale(${lerp(1, 0.86, morph)})`, opacity: Math.min(1, ring * 1.5) }}>
          <div style={{ position: 'absolute', left: -1.5, top: -S * 0.33, width: 3, height: S * 0.33, borderRadius: 2, background: morph > 0.5 ? '#fff' : (dark ? 'rgba(255,255,255,0.75)' : 'rgba(29,29,31,0.45)') }} />
          <div style={{ position: 'absolute', left: -S * 0.075, top: -S * 0.02, filter: `drop-shadow(${6 * (1 - morph)}px ${10 * (1 - morph)}px ${8 * (1 - morph)}px rgba(0,0,0,0.25))` }}>
            <Bob size={S * 0.15} light={dark || morph > 0.5} color={C.ink} />
          </div>
          <div style={{ position: 'absolute', left: -S * 0.022, top: -S * 0.022, width: S * 0.044, height: S * 0.044, borderRadius: '50%', background: morph > 0.5 || dark ? '#fff' : C.blue, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
    </div>
  );
};
