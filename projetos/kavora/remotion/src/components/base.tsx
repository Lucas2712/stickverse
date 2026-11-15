// Componentes 2D reutilizáveis: ícone, desfoque de movimento, palavra cinética, traço manuscrito,
// pílula, cartão de vidro e fundos.
import React from 'react';
import {C, FONT, SHADOW} from '../theme';
import {ICON} from '../lib/icons';
import {E, pr, sp, SP, tw, drift, shutter} from '../lib/anim';

export const Abs: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
  <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>
);

export const Icon: React.FC<{name: string; size?: number; color?: string; stroke?: number; draw?: number}> = ({
  name, size = 48, color = C.orange, stroke = 1.8, draw = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display: 'block', overflow: 'visible'}}>
    <path
      d={ICON[name]}
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={draw < 1 ? `${draw} 1` : undefined}
    />
  </svg>
);

/** Desfoque de movimento direcional (SVG feGaussianBlur com desvio x/y separado). */
export const Blur: React.FC<React.PropsWithChildren<{id: string; x?: number; y?: number; style?: React.CSSProperties}>> = ({
  id, x = 0, y = 0, children, style,
}) => {
  const bx = Math.abs(x), by = Math.abs(y);
  if (bx < 0.35 && by < 0.35) return <div style={style}>{children}</div>;
  return (
    <div style={{...style, filter: `url(#mb-${id})`}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={`mb-${id}`} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} />
        </filter>
      </svg>
      {children}
    </div>
  );
};

/** Palavra que sobe de dentro de uma máscara, com mola e rastro vertical. */
export const Rise: React.FC<{
  t: number; t0: number; text: string; style?: React.CSSProperties; out?: number; id: string; from?: number; cfg?: keyof typeof SP;
}> = ({t, t0, text, style, out, id, from = 1.05, cfg = 'snappy'}) => {
  const f = (tt: number) => {
    const inn = 1 - sp(tt, t0, SP[cfg]);
    const o = out !== undefined ? pr(tt, out, 0.35, E.in) : 0;
    return inn * from - o * 1.1;
  };
  const y = f(t);
  const v = (f(t) - f(t - 1 / 120)) * 120; // em alturas/s
  const size = typeof style?.fontSize === 'number' ? (style.fontSize as number) : 60;
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', padding: '0.12em 0.04em 0.18em', margin: '-0.12em -0.04em -0.18em', verticalAlign: 'top'}}>
      <Blur id={id} y={shutter(v * size, 0.9)} style={{display: 'inline-block'}}>
        <span style={{display: 'inline-block', transform: `translateY(${y * 100}%)`, fontFamily: FONT, ...style}}>{text}</span>
      </Blur>
    </span>
  );
};

/** Traço manuscrito (sublinhado/círculo) que se desenha. */
export const Scribble: React.FC<{d: string; p: number; color?: string; width?: number; w: number; h: number; style?: React.CSSProperties; vb?: string}> = ({
  d, p, color = C.orange, width = 6, w, h, style, vb,
}) => (
  <svg width={w} height={h} viewBox={vb || `0 0 ${w} ${h}`} fill="none" style={{position: 'absolute', overflow: 'visible', ...style}}>
    <path d={d} stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1.01`} />
  </svg>
);

/** Pílula de categoria (cartão arredondado com ícone em caixa laranja clara). */
export const Pill: React.FC<{icon: string; label: string; w?: number; h?: number; style?: React.CSSProperties; dark?: boolean}> = ({
  icon, label, w = 640, h = 136, style, dark,
}) => (
  <div
    style={{
      width: w, height: h, borderRadius: h * 0.3,
      background: dark ? 'linear-gradient(180deg, #2a2b2f, #202124)' : 'linear-gradient(180deg, #FFFFFF 0%, #FBFBFA 100%)',
      boxShadow: dark ? SHADOW.dark : SHADOW.card + ', inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -2px 0 rgba(232,232,230,0.9)',
      border: `1.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(232,232,230,0.9)'}`,
      display: 'flex', alignItems: 'center', gap: h * 0.2, padding: `0 ${h * 0.24}px`, boxSizing: 'border-box', ...style,
    }}
  >
    <div style={{
      width: h * 0.6, height: h * 0.6, borderRadius: h * 0.18, flex: 'none',
      background: 'linear-gradient(160deg, rgba(255,163,107,0.22), rgba(255,113,56,0.14))',
      boxShadow: 'inset 0 0 0 1.5px rgba(255,113,56,0.22)', display: 'grid', placeItems: 'center',
    }}>
      <Icon name={icon} size={h * 0.36} stroke={1.9} />
    </div>
    <span style={{fontFamily: FONT, fontSize: h * 0.36, fontWeight: 500, color: dark ? C.white : C.graphite, letterSpacing: '-0.015em'}}>{label}</span>
  </div>
);

/** Cartão de vidro (claro ou escuro) com luz de borda superior. */
export const Glass: React.FC<React.PropsWithChildren<{w: number; h: number; r?: number; tone?: 'light' | 'dark' | 'orange'; style?: React.CSSProperties}>> = ({
  w, h, r = 40, tone = 'light', style, children,
}) => {
  const bg = {
    light: 'linear-gradient(170deg, rgba(255,255,255,0.98), rgba(247,247,245,0.96))',
    dark: 'linear-gradient(170deg, rgba(48,49,54,0.92), rgba(32,33,36,0.94))',
    orange: `linear-gradient(150deg, ${C.orangeL} 0%, ${C.orange} 55%, ${C.orange} 100%)`,
  }[tone];
  const edge = {
    light: 'inset 0 1.5px 0 rgba(255,255,255,1), inset 0 0 0 1.5px rgba(232,232,230,0.85)',
    dark: 'inset 0 1.5px 0 rgba(255,255,255,0.14), inset 0 0 0 1.5px rgba(255,255,255,0.07)',
    orange: 'inset 0 2px 0 rgba(255,255,255,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.18)',
  }[tone];
  const sh = tone === 'light' ? SHADOW.float : tone === 'orange' ? SHADOW.orange : SHADOW.dark;
  return (
    <div style={{width: w, height: h, borderRadius: r, background: bg, boxShadow: `${sh}, ${edge}`, position: 'relative', overflow: 'hidden', boxSizing: 'border-box', ...style}}>
      {children}
    </div>
  );
};

/** Ícone em ladrilho de vidro (para fundos laranja/escuros). */
export const GlassIcon: React.FC<{icon: string; size: number; tone?: 'onOrange' | 'light'}> = ({icon, size, tone = 'onOrange'}) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.28,
    background: tone === 'onOrange'
      ? 'linear-gradient(150deg, rgba(255,255,255,0.42), rgba(255,255,255,0.12))'
      : 'linear-gradient(170deg, #FFFFFF, #F7F7F5)',
    boxShadow: tone === 'onOrange'
      ? 'inset 0 2px 0 rgba(255,255,255,0.55), inset 0 0 0 2px rgba(255,255,255,0.25), 0 30px 60px rgba(17,17,17,0.14)'
      : SHADOW.card + ', inset 0 0 0 1.5px rgba(232,232,230,0.9)',
    display: 'grid', placeItems: 'center',
  }}>
    <Icon name={icon} size={size * 0.48} color={tone === 'onOrange' ? C.white : C.orange} stroke={1.7} />
  </div>
);

// ---------------- fundos ----------------
export const LightBg: React.FC<{t: number; rings?: boolean; ringP?: number}> = ({t, rings = true, ringP = 1}) => (
  <Abs style={{background: `radial-gradient(120% 70% at 50% 42%, ${C.white} 0%, ${C.off} 55%, #EFEFED 100%)`}}>
    {rings && (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {[520, 760, 1040].map((r, i) => (
          <circle key={r} cx={540 + drift(t, i, 14, 0.06)} cy={900 + drift(t, i + 4, 18, 0.05)} r={r}
            fill="none" stroke={C.gray} strokeWidth={2} pathLength={1}
            strokeDasharray={`${ringP} 1`} transform={`rotate(${-90 + t * (6 + i * 3)} 540 900)`} opacity={0.9 - i * 0.22} />
        ))}
      </svg>
    )}
    <Abs style={{background: 'radial-gradient(140% 90% at 50% 50%, transparent 60%, rgba(32,33,36,0.06) 100%)'}} />
  </Abs>
);

export const DarkBg: React.FC<{t: number; glow?: number}> = ({t, glow = 1}) => (
  <Abs style={{background: C.black}}>
    <Abs style={{background: `radial-gradient(90% 45% at ${50 + drift(t, 2, 8, 0.05)}% 108%, rgba(255,113,56,${0.55 * glow}) 0%, rgba(255,113,56,${0.12 * glow}) 45%, transparent 75%)`}} />
    <Abs style={{background: `radial-gradient(60% 35% at 15% -5%, rgba(255,163,107,${0.10 * glow}) 0%, transparent 70%)`}} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.5}}>
      {[420, 640, 900].map((r, i) => (
        <circle key={r} cx={540} cy={960} r={r + drift(t, i, 10, 0.08)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
      ))}
    </svg>
    <Abs style={{background: 'radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
  </Abs>
);

export const OrangeBg: React.FC<{t: number}> = ({t}) => (
  <Abs style={{background: C.orange}}>
    <Abs style={{background: `radial-gradient(85% 55% at ${22 + drift(t, 1, 6, 0.07)}% ${8 + drift(t, 3, 4, 0.06)}%, ${C.orangeL} 0%, rgba(255,163,107,0.0) 70%)`}} />
    <Abs style={{background: 'radial-gradient(120% 90% at 50% 45%, transparent 50%, rgba(17,17,17,0.16) 100%)'}} />
  </Abs>
);

/** Feixe de farol: faixa de luz diagonal que atravessa o quadro. p: 0→1. */
export const Beam: React.FC<{p: number; color?: string; angle?: number; width?: number; opacity?: number}> = ({
  p, color = C.white, angle = -24, width = 520, opacity = 1,
}) => {
  if (p <= 0 || p >= 1) return null;
  const x = -900 + p * 2880;
  return (
    <Abs style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute', left: x - width / 2, top: -800, width, height: 3520,
        transform: `rotate(${angle}deg)`, transformOrigin: '50% 50%',
        background: `linear-gradient(90deg, transparent 0%, ${color}00 10%, ${color} 50%, ${color}00 90%, transparent 100%)`,
        opacity, filter: 'blur(18px)', mixBlendMode: 'screen',
      }} />
    </Abs>
  );
};

/** Máscara diagonal que revela a cena (acompanha o feixe). */
export const revealClip = (p: number, angle = 24) => {
  const k = Math.tan((angle * Math.PI) / 180) * 1920;
  const x = -k + p * (1080 + k * 2) - 10;
  return `polygon(${x - 3000}px 0, ${x + k}px 0, ${x}px 1920px, ${x - 3000}px 1920px)`;
};
