import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text, shadowDeep } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, inOut, expoIn } from '../animations/motion';
import { LightBg, Camera } from '../components/Stage';
import { Words } from '../components/Words';
import { Icon } from '../components/Icon';

// 9 · "E fecha o seu mês num relatório claro, sem planilha." (21,60–25,90)
const BARS = [0.42, 0.6, 0.5, 0.78, 0.66, 0.92];
export const S09Relatorio = ({ a }) => {
  const t = useT(a);
  const card = spr(t, 21.62, { damping: 16, stiffness: 130 });
  const sum = prog(t, 23.22, 0.5);
  const ok = spr(t, 23.68, { damping: 12, stiffness: 170 });
  const sheet = spr(t, 24.3, { damping: 15, stiffness: 160 });
  const crumble = prog(t, 24.75, 0.8, expoIn);
  const strike = prog(t, 24.65, 0.35);
  const out = 0;
  return (
    <LightBg>
      <Camera t={t} a={21.6} b={25.9} from={1.0} to={1.05} style={{ opacity: 1 - out }}>
        <div style={{ position: 'absolute', top: 250, width: 1080, textAlign: 'center' }}>
          <Words t={t} style={{ ...display(500), fontSize: 64, color: C.ink2 }} words={[{ w: 'E', s: 21.85 }, { w: 'fecha', s: 22.08 }, { w: 'o', s: 22.43 }, { w: 'seu', s: 22.52 }]} />
          <Words t={t} style={{ ...display(700), fontSize: 140, color: C.ink, lineHeight: 1.04 }} words={[{ w: 'mês.', s: 22.77 }]} />
        </div>
        <div style={{
          position: 'absolute', left: 100, top: 560, width: 880, height: 760, borderRadius: 56, background: '#fff', boxShadow: shadowDeep,
          transform: `translateY(${(1 - card) * 300}px) scale(${0.9 + 0.1 * card})`, opacity: Math.min(1, card * 2), boxSizing: 'border-box', padding: 54,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ ...text(500), fontSize: 30, color: C.ink2 }}>Relatório · novembro</div>
              <div style={{ ...display(700), fontSize: 60, color: C.ink, marginTop: 6 }}>Seu mês</div>
            </div>
            <div style={{ ...text(600), fontSize: 30, color: '#fff', background: C.blue, padding: '14px 26px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${ok})`, opacity: Math.min(1, ok * 2) }}>
              <Icon name="check" size={32} color="#fff" stroke={3} /> Mês fechado
            </div>
          </div>
          <div style={{ position: 'absolute', left: 54, right: 54, top: 190, height: 320, display: 'flex', alignItems: 'flex-end', gap: 34, borderBottom: `2px solid ${C.line}` }}>
            {BARS.map((h, i) => {
              const k = spr(t, 22.77 + i * 0.09, { damping: 14, stiffness: 150 });
              return <div key={i} style={{ flex: 1, height: 300 * h * k, borderRadius: 18, background: i === BARS.length - 1 ? 'linear-gradient(180deg,#2997FF,#0071E3)' : C.blueTint }} />;
            })}
          </div>
          <div style={{ position: 'absolute', left: 54, right: 54, top: 560, display: 'flex', justifyContent: 'space-between', opacity: sum, transform: `translateY(${(1 - sum) * 20}px)` }}>
            {['Entradas', 'Saídas', 'Reserva'].map((l, i) => (
              <div key={l}><div style={{ ...text(500), fontSize: 28, color: C.ink2 }}>{l}</div><div style={{ ...display(700), fontSize: 46, color: i === 2 ? C.blue : C.ink, marginTop: 4 }}>R$ •••</div></div>
            ))}
          </div>
        </div>
        {/* sem planilha */}
        <div style={{ position: 'absolute', top: 1385, width: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, opacity: Math.min(1, sheet * 2), transform: `translateY(${(1 - sheet) * 60}px)` }}>
          <div style={{ position: 'relative', width: 150, height: 110 }}>
            {Array.from({ length: 12 }, (_, i) => {
              const r = Math.floor(i / 4), c = i % 4, rnd = Math.sin(i * 12.9898) * 0.5 + 0.5;
              const d = Math.max(0, crumble * 1.4 - rnd * 0.4);
              return <div key={i} style={{ position: 'absolute', left: c * 38, top: r * 37, width: 34, height: 33, borderRadius: 5, background: '#E5E5EA', transform: `translate(${(rnd - 0.5) * 160 * d}px, ${d * d * 260}px) rotate(${(rnd - 0.5) * 140 * d}deg)`, opacity: 1 - d }} />;
            })}
          </div>
          <div style={{ position: 'relative', ...display(600), fontSize: 64, color: C.ink }}>
            <span style={{ color: C.ink2 }}>sem </span>planilha
            <div style={{ position: 'absolute', left: 145, top: '54%', height: 6, borderRadius: 3, width: `${strike * 64}%`, background: C.blue }} />
          </div>
        </div>
      </Camera>
    </LightBg>
  );
};
