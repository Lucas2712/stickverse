import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { W, B, MUS, N } from '../audio/timeline';
import { Letters, NeedleWipe, Sheen } from '../components/Motion';
import { BlueBg, LightBg } from '../components/Stage';
import { AppIcon, Wordmark } from '../components/Brand';
import { Phone } from '../components/Phone';
import { Home } from '../components/Screens';
import { Icon } from '../components/Icon';
import { DemoTag } from '../components/AppUI';

// ATO 3 · marca vira selo → fragmentos sobem e se orientam no prumo (organização · clareza · direção) → coluna vira o celular → funções conectadas
const rnd = (i, k) => Math.sin(i * 127.1 + k * 311.7) * 0.5 + 0.5;
export const V3_A3 = ({ a }) => {
  const t = useT(a);
  const tFoi = W(3, 'Foi'), tOrg = W(3, 'organização'), tCla = W(3, 'clareza'), tDir = W(3, 'direção'), tEx = W(3, 'existe'), tPr = W(3, 'Prumo'), tGe = W(3, 'gestor'), tPe = W(3, 'pequenos');
  const bug = prog(t, tFoi - 0.15, 0.7, inOut);                 // marca encolhe para o canto
  const orbit = Math.sin(Math.max(0, t - tFoi) * 1.1) * 30 * (1 - prog(t, tEx - 0.3, 0.6));
  const dir = spr(t, tDir, { damping: 12, stiffness: 160 });
  const comp = prog(t, tEx - 0.25, 0.8, inOut);                 // coluna → celular
  const phone = spr(t, tEx + 0.25, { damping: 15, stiffness: 120 });
  const orb = prog(t, tGe - 0.3, 5.2, (x) => x);   // órbita lenta + aproximação do celular na parte clara
  const light = prog(t, tGe - 0.35, 0.9, inOut);                // cortina da agulha: azul → claro
  const callouts = [['in', 'Movimentações', -1, 640], ['grid', 'Receitas e despesas', 1, 790], ['bell', 'Compromissos', -1, 1060], ['chart', 'Relatórios', 1, 1300]];
  const giant = (w, s, e, y) => { const k = prog(t, s - 0.1, 1.6, expoOut); const o = prog(t, e - 0.1, 0.3); return <div key={w} style={{ position: 'absolute', top: y, left: lerp(1200, -260, k) - o * 600, ...display(800), fontSize: 300, color: 'rgba(255,255,255,0.10)', whiteSpace: 'nowrap', letterSpacing: '-0.05em' }}>{w}</div>; };
  const word = (w, s, e) => { const k = spr(t, s - 0.05, { damping: 14, stiffness: 190 }); const o = prog(t, e - 0.12, 0.2, expoIn); return <div key={w} style={{ position: 'absolute', top: 1440, width: 1080, textAlign: 'center', ...display(700), fontSize: 130, color: '#fff', opacity: Math.min(1, k * 2) * (1 - o), transform: `translateY(${(1 - k) * 80 - o * 60}px) scale(${0.85 + 0.15 * k})`, filter: `blur(${o * 12}px)` }}>{w}</div>; };
  return (
    <AbsoluteFill>
      <BlueBg t={t}>
        {giant('organização', tOrg, tCla, 380)}{giant('clareza', tCla, tDir, 820)}{giant('direção', tDir, tEx, 1180)}
        {/* coluna orientada pelo prumo, em 3D com órbita de câmera */}
        <AbsoluteFill style={{ perspective: 1800 }}>
          <div style={{ position: 'absolute', left: 540, top: 960, transformStyle: 'preserve-3d', transform: `rotateY(${orbit}deg) rotateX(${8 * (1 - comp)}deg) scale(${lerp(1, 0.55, comp)}) translateY(${comp * 60}px)` }}>
            <div style={{ position: 'absolute', left: -2, top: -900, width: 4, height: 1800 * prog(t, tDir - 0.1, 0.6, expoOut), background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 30px rgba(255,255,255,0.8)', opacity: 1 - comp }} />
            {Array.from({ length: 7 }, (_, i) => {
              const k = spr(t, tFoi + 0.1 + i * 0.1, { damping: 14, stiffness: 110 });
              const sx = (rnd(i, 1) - 0.5) * 1600, sy = 1400 + rnd(i, 2) * 500;
              const x = lerp(sx, (rnd(i, 3) - 0.5) * 140 * (1 - dir), k), y = lerp(sy, -520 + i * 150, k);
              const rot = lerp((rnd(i, 4) - 0.5) * 200, (rnd(i, 5) - 0.5) * 16, k) * (1 - dir);
              const blur = lerp(9, 0, prog(t, tCla - 0.05, 0.4));
              return (
                <div key={i} style={{ position: 'absolute', left: x - 330, top: y - 60, width: 660, height: 120, borderRadius: 34, background: 'rgba(255,255,255,0.16)', border: '2px solid rgba(255,255,255,0.45)', boxSizing: 'border-box', transform: `translateZ(${(i % 3) * 40 * (1 - dir)}px) rotate(${rot}deg)`, filter: `blur(${blur}px)`, opacity: Math.min(1, k * 2) * (1 - comp), display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px' }}>
                  <div style={{ width: 66, height: 66, borderRadius: 20, background: 'rgba(255,255,255,0.35)' }} /><div style={{ flex: 1, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.5)' }} /><div style={{ width: 120, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.35)' }} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
        <Sheen p={prog(t, tCla, 0.9)} />
        {word('organização', tOrg, tCla)}{word('clareza', tCla, tDir)}{word('direção', tDir, tEx)}
      </BlueBg>
      {/* cortina da agulha → claro, com as funções conectadas ao celular */}
      <NeedleWipe p={light} cx={540} cy={-300}>
        <LightBg><AbsoluteFill style={{ transform: `scale(${1 + Math.max(0, t - tGe) * 0.012})`, transformOrigin: '540px 330px' }}>
          <div style={{ position: 'absolute', top: 300, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Letters t={t} s={tGe} text="gestor financeiro" size={96} color={C.ink} stagger={0.02} />
            <div style={{ ...display(500), fontSize: 50, color: C.ink2, opacity: prog(t, tPe - 0.1, 0.3), transform: `translateY(${(1 - prog(t, tPe - 0.1, 0.5)) * 30}px)` }}>pensado para pequenos negócios</div>
          </div>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            {callouts.map(([, , side, y], i) => { const k = prog(t, B(tGe + 0.45 + i * 0.3, 0.12), 0.45, expoOut); const x1 = side < 0 ? 300 : 780, x2 = side < 0 ? 400 : 680; return <path key={i} d={`M${x1} ${y} L${x2} ${y}`} stroke={C.blue} strokeWidth="4" strokeDasharray="200" strokeDashoffset={200 * (1 - k)} />; })}
          </svg>
          {callouts.map(([ic, l, side, y], i) => {
            const k = spr(t, B(tGe + 0.45 + i * 0.3, 0.12), { damping: 13, stiffness: 190 });
            return (
              <div key={l} style={{ position: 'absolute', top: y - 46, [side < 0 ? 'left' : 'right']: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px 12px 12px', borderRadius: 24, background: '#fff', boxShadow: '0 14px 34px rgba(0,0,0,0.12)', transform: `scale(${k}) translateX(${(1 - k) * side * -60}px) translateY(${Math.sin(t * 2 + i) * 8}px)`, transformOrigin: side < 0 ? '100% 50%' : '0% 50%', opacity: Math.min(1, k * 2), maxWidth: 270 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={ic} size={27} color="#fff" /></div>
                <span style={{ ...text(600), fontSize: 24, color: C.ink, lineHeight: 1.1 }}>{l}</span>
              </div>
            );
          })}
          </AbsoluteFill><div style={{ position: 'absolute', top: 1620, width: 1080, display: 'flex', justifyContent: 'center', opacity: prog(t, tGe + 0.5, 0.4) }}><DemoTag /></div>
        </LightBg>
      </NeedleWipe>
      {/* o celular nasce da coluna */}
      {phone > 0.01 && (
        <AbsoluteFill style={{ perspective: 2400 }}>
          <div style={{ position: 'absolute', left: 540 - 300 * lerp(0.68, 0.78, orb), top: lerp(1500, 600, phone) - orb * 40, transform: `scale(${lerp(0.68, 0.78, orb)}) rotateY(${lerp(-35, 0, phone) + lerp(-16, 12, orb) * light + Math.sin(t * 1.3) * 3}deg) rotateX(${lerp(25, 0, phone) + 5 * light + Math.cos(t * 1.1) * 2}deg) translateY(${Math.sin(t * 1.6) * 14}px)`, transformOrigin: '0 0' }}>
            <Phone w={600} h={1240}><Home /></Phone>
          </div>
        </AbsoluteFill>
      )}
      {/* selo da marca */}
      <div style={{ position: 'absolute', left: lerp(540, 110, bug) - lerp(130, 44, bug), top: lerp(920, 120, bug) - lerp(130, 44, bug), transform: `scale(${1 + (t > tPr ? 0.25 * Math.exp(-(t - tPr) * 5) : 0)})`, opacity: 1 - prog(t, tGe - 0.3, 0.3) * 0 }}>
        <AppIcon size={lerp(260, 88, bug)} style={{ borderRadius: lerp(70, 24, bug) }} dark={light > 0.5} />
      </div>
      <div style={{ position: 'absolute', left: lerp(0, 210, bug), top: lerp(1110, 128, bug), width: lerp(1080, 400, bug), display: 'flex', justifyContent: bug > 0.5 ? 'flex-start' : 'center', opacity: 1 - prog(t, tOrg - 0.3, 0.3) + prog(t, tPr - 0.1, 0.3) }}>
        <Wordmark size={lerp(230, 64, bug)} color={light > 0.5 ? C.ink : '#fff'} />
      </div>
    </AbsoluteFill>
  );
};
