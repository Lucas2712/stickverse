import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { W, WE, B, MUS } from '../audio/timeline';
import { Letters } from '../components/Motion';
import { Icon } from '../components/Icon';
import { Compass3D } from '../components/Compass3D';
import { AppIcon } from '../components/Brand';
import { Leak } from '../components/Leak';
import { Wordmark } from '../components/Brand';
import { BlueBg } from '../components/Stage';

// ATO 2 · fluxos que entram/saem/cobram em volta do negócio → CONGELA → a bússola procura → SILÊNCIO → trava ↓ → tudo cai → marca
const rnd = (i, k) => Math.sin(i * 127.1 + k * 311.7) * 0.5 + 0.5;
export const FB3 = () => ({ a: W(2, 'entender') - 0.12, spin: W(2, 'entender') + 0.35, settle: MUS.silencio[0], morph: MUS.V2 + 0.05 });
export const V3_A2 = ({ a }) => {
  const tReal = useT(a);
  const tFz = MUS.freeze;
  const t = Math.min(tReal, tFz + 0.08);                       // o mundo congela; a câmera e a bússola não
  const frz = prog(tReal, tFz, 0.35);
  const tEntra = W(2, 'entra'), tSai = W(2, 'sai'), tPag = W(2, 'precisa'), tVis = W(2, 'visualizar'), tCla = W(2, 'claramente');
  const f = FB3(), drop = MUS.V2;
  const fall = prog(tReal, drop, 0.75, expoIn);                 // tudo cai na direção do prumo
  const shock = prog(tReal, drop, 0.9, expoOut);
  const iris = prog(tReal, drop + 0.42, 0.55, inOut);
  const inK = prog(tReal, a, 0.35);
  const srch = prog(tReal, f.a, f.settle - f.a + 0.45, inOut);   // câmera orbita a bússola até ficar de frente
  const mo = prog(tReal, f.morph, 0.4, inOut);                     // bússola → ícone
  // câmera: aproxima no começo, treme nos impactos, empurra devagar no congelamento
  const shake = [tPag, tPag + 0.22, tPag + 0.44].reduce((acc, s) => acc + (t > s ? Math.sin((t - s) * 60) * 14 * Math.exp(-(t - s) * 9) : 0), 0);
  const camS = lerp(1.35, 1.0, prog(tReal, a, 1.2, expoOut)) * (1 + Math.max(0, Math.min(tReal, drop) - tFz) * 0.06) * (1 + Math.sin((tReal - a) * 0.8) * 0.03);
  const camR = Math.max(0, Math.min(tReal, drop) - tFz) * -1.6 + Math.sin((tReal - a) * 0.6) * 1.5;
  const txtF = 1 - frz * 0.75;
  // lente procurando foco sobre «claramente»
  const lensX = lerp(-200, 1280, prog(tReal, tCla - 0.2, 1.8, inOut));
  // fluxos de partículas: entram (azul, esquerda), saem (grafite, direita), cobram (vermelho, por cima)
  const flows = [];
  const fl = (i, kind, s) => {
    const life = ((t - s) * 0.9 + rnd(i, 1)) % 1;
    if (t < s) return null;
    const lane = (rnd(i, 2) - 0.5) * 520;
    let x, y;
    if (kind === 'in') { x = lerp(-120, 470, life); y = 1000 + lane * (1 - life) + Math.sin(life * 6 + i) * 30; }
    else if (kind === 'out') { x = lerp(610, 1200, life); y = 1000 + lane * life + Math.sin(life * 6 + i) * 30; }
    else { x = 540 + Math.cos(i) * 560 * (1 - life); y = 1000 + Math.sin(i * 1.7) * 640 * (1 - life); }
    return { x, y, kind, a: Math.sin(life * Math.PI) };
  };
  for (let i = 0; i < 46; i++) flows.push(fl(i, 'in', tEntra - 0.1 + (i % 6) * 0.05));
  for (let i = 0; i < 40; i++) flows.push(fl(i + 100, 'out', tSai - 0.1 + (i % 6) * 0.05));
  for (let i = 0; i < 24; i++) flows.push(fl(i + 200, 'pay', tPag + (i % 4) * 0.08));
  const bills = [0, 1, 2].map((i) => spr(t, tPag + i * 0.22, { damping: 13, stiffness: 240 }));
  const nodeK = spr(t, a + 0.2, { damping: 12, stiffness: 150 });
  return (
    <AbsoluteFill style={{ background: '#EEF0F4', opacity: inK }}>
      <AbsoluteFill style={{ transform: `scale(${camS}) rotate(${camR}deg) translate(${shake}px, ${shake * 0.4}px)`, filter: `grayscale(${frz}) contrast(${1 - frz * 0.1})` }}>
        {/* fragmentos de interface ao fundo, girando devagar, que depois CAEM */}
        {Array.from({ length: 14 }, (_, i) => {
          const dz = 0.6 + rnd(i, 9) * 0.9; const x = rnd(i, 3) * 1080 + Math.sin(tReal * 0.7 * dz + i) * 90 * dz - (tReal - a) * 40 * dz, y = 250 + rnd(i, 4) * 1450 + Math.cos(tReal * 0.5 * dz + i) * 60 * dz, rot = (rnd(i, 5) - 0.5) * 60 + tReal * (i % 2 ? 18 : -18);
          const fy = fall * (900 + rnd(i, 6) * 900), frot = fall * (rnd(i, 7) - 0.5) * 140;
          return <div key={i} style={{ position: 'absolute', left: x - 160, top: y - 60 + fy, width: 320, height: 120, borderRadius: 30, background: '#fff', boxShadow: '0 14px 30px rgba(0,0,0,0.08)', transform: `rotate(${rot + frot}deg) scale(${0.6 + rnd(i, 8) * 0.6})`, filter: `blur(${2 + (i % 3) * 2}px)`, opacity: 0.8 }} />;
        })}
        {/* partículas */}
        <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, transform: `translateY(${fall * 1400}px)` }}>
          {flows.filter(Boolean).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.kind === 'pay' ? 9 : 7} fill={p.kind === 'in' ? C.blue : p.kind === 'out' ? C.ink : C.red} opacity={0.85 * p.a} />)}
        </svg>
        {/* o negócio no centro */}
        <div style={{ position: 'absolute', left: 540 - 110, top: 1000 - 110 + fall * 1500, width: 220, height: 220, borderRadius: 66, background: '#fff', boxShadow: '0 30px 70px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${nodeK * (1 + (t > tPag ? 0.06 * Math.sin((t - tPag) * 30) * Math.exp(-(t - tPag) * 4) : 0))}) rotate(${fall * 40}deg)` }}><Icon name="bag" size={110} color={C.ink} /></div>
        {/* boletos carimbados batendo no negócio */}
        {bills.map((k, i) => (
          <div key={i} style={{ position: 'absolute', left: [220, 640, 380][i], top: [760, 820, 1180][i] + fall * (1200 + i * 200), transform: `scale(${2.2 - 1.2 * k}) rotate(${[-14, 12, -6][i] + fall * 80}deg)`, opacity: Math.min(1, k * 3), width: 240, height: 150, borderRadius: 18, background: '#fff', boxShadow: '0 16px 36px rgba(0,0,0,0.14)', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: 12, width: '70%', borderRadius: 6, background: 'rgba(29,29,31,0.18)' }} />
            <div style={{ height: 12, width: '45%', borderRadius: 6, background: 'rgba(29,29,31,0.10)', marginTop: 12 }} />
            <div style={{ position: 'absolute', right: 14, bottom: 14, ...text(800), fontSize: 30, color: C.red, border: `4px solid ${C.red}`, borderRadius: 10, padding: '0 10px', transform: 'rotate(-10deg)' }}>vence</div>
          </div>
        ))}
        {/* títulos cinéticos ligados aos fluxos */}
        <div style={{ position: 'absolute', left: 60, top: 640 + fall * 1300, ...display(700), fontSize: 92, color: C.blue, opacity: prog(t, tEntra - 0.1, 0.25) * txtF, transform: `translateX(${(1 - prog(t, tEntra - 0.1, 0.4)) * -200}px)` }}>entra →</div>
        <div style={{ position: 'absolute', right: 60, top: 1120 + fall * 1300, ...display(700), fontSize: 92, color: C.ink, opacity: prog(t, tSai - 0.1, 0.25) * txtF, transform: `translateX(${(1 - prog(t, tSai - 0.1, 0.4)) * 200}px)` }}>sai →</div>
        <div style={{ position: 'absolute', width: 1080, top: 1250 + fall * 1300, textAlign: 'center', ...display(700), fontSize: 92, color: C.red, opacity: prog(t, tPag, 0.25) * (1 - frz), transform: `scale(${1.6 - 0.6 * spr(t, tPag)})` }}>a pagar</div>
        {/* «visualizar claramente»: só fica nítido dentro da lente que passa */}
        <div style={{ position: 'absolute', top: 250 + fall * 1300, width: 1080, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Letters t={t} s={W(2, 'Quando')} text="Quando você não consegue" size={60} weight={500} color={C.ink2} stagger={0.015} /></div><div style={{ display: 'flex', justifyContent: 'center', marginTop: -16 }}><Letters t={t} s={tVis} text="visualizar" size={60} weight={600} color={C.ink} stagger={0.02} /></div>
          <div style={{ position: 'relative', height: 190, marginTop: 6 }}>
            <div style={{ position: 'absolute', inset: 0, ...display(700), fontSize: 160, color: C.ink, filter: 'blur(9px)', opacity: prog(t, tCla - 0.1, 0.3) }}>claramente</div>
            <div style={{ position: 'absolute', inset: 0, ...display(700), fontSize: 160, color: C.ink, opacity: prog(t, tCla - 0.1, 0.3), clipPath: `circle(150px at ${lensX}px 95px)` }}>claramente</div>
            <div style={{ position: 'absolute', left: lensX - 150, top: 95 - 150, width: 300, height: 300, borderRadius: 150, border: '6px solid rgba(255,255,255,0.95)', boxShadow: '0 20px 50px rgba(0,0,0,0.2), inset 0 0 30px rgba(255,255,255,0.6)', opacity: prog(t, tCla - 0.1, 0.3) * (1 - prog(tReal, tFz, 0.2)) }} />
          </div>
        </div>
      </AbsoluteFill>
      {/* véu do congelamento + texto da busca */}
      <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 52%, rgba(255,255,255,${0.75 * frz}), rgba(225,228,234,${0.55 * frz}))`, opacity: 1 - fall }} />
      <div style={{ position: 'absolute', top: 1420, width: 1080, textAlign: 'center', opacity: 1 - prog(tReal, drop - 0.2, 0.3) }}>
        <Letters t={tReal} s={W(2, 'verdadeira')} text="a verdadeira situação" size={74} weight={600} stagger={0.018} />
      </div>
      {/* onda de choque + íris azul */}
      {shock > 0 && shock < 1 && <div style={{ position: 'absolute', left: 540 - 1400 * shock, top: 960 - 1400 * shock, width: 2800 * shock, height: 2800 * shock, borderRadius: '50%', border: `${40 * (1 - shock)}px solid rgba(0,113,227,${0.5 * (1 - shock)})` }} />}
      <AbsoluteFill style={{ clipPath: `circle(${iris * 125}% at 540px 960px)` }}>
        <BlueBg t={tReal}>
          <div style={{ position: 'absolute', top: 1110, width: 1080, display: 'flex', justifyContent: 'center' }}>
            <Letters t={tReal} s={drop + 0.25} text="prumo" size={230} color="#fff" stagger={0.045} />
          </div>
        </BlueBg>
      </AbsoluteFill>
      <Leak p={prog(tReal, drop + 0.25, 1.3)} seed={4} />
      {/* a bússola: procura, trava ↓ no silêncio, vira o ícone */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${lerp(0, -40, iris)}px)` }}>
        {/* poeira de luz girando em volta da bússola enquanto ela procura */}
        {Array.from({ length: 28 }, (_, i) => { const k = prog(tReal, f.a + i * 0.03, 0.6); const ang = i * 2.4 + (tReal - f.a) * (0.5 + (i % 5) * 0.12); const R = 380 + (i % 7) * 40 + Math.sin(tReal + i) * 20; return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(ang) * R - 5, top: 960 + Math.sin(ang) * R * 0.92 - 5, width: 10 + (i % 3) * 4, height: 10 + (i % 3) * 4, borderRadius: '50%', background: i % 4 ? 'rgba(0,113,227,0.55)' : '#fff', boxShadow: '0 0 14px rgba(0,113,227,0.6)', opacity: k * (1 - mo) * 0.9 }} />; })}
        <Compass3D t={tReal} f={f} cx={540} cy={960} size={lerp(600, 680, srch) * lerp(1, 0.4, mo)} orbit={lerp(-1.05, 0, srch) + Math.sin((tReal - f.a) * 1.7) * 0.06 * (1 - srch)} tilt={lerp(-0.75, -0.02, srch)} roll={lerp(0.4, 0, srch)} glow={prog(tReal, f.settle, 0.4)} opacity={1 - mo} />
        <div style={{ position: 'absolute', left: 540 - 130, top: 960 - 130, transform: `scale(${lerp(0.55, 1, mo)})`, opacity: mo }}><AppIcon size={260} dark style={{ boxShadow: '0 30px 70px rgba(0,60,140,0.35), inset 0 0 0 3px rgba(255,255,255,0.35)' }} /></div>
      </div>
    </AbsoluteFill>
  );
};
