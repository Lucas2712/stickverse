import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn, expoOut } from '../animations/motion';
import { W, FIM, N, B } from '../audio/timeline';
import { LightBg } from '../components/Stage';
import { Icon } from '../components/Icon';
import { DemoTag, Mask, Row } from '../components/AppUI';

// ATO 5 · "Você também ganha uma visão mais organizada..." — telas flutuantes → responsabilidades → fluxo do dinheiro
const Panel = ({ title, ic, children, w = 400, h = 520, style }) => (
  <div style={{ width: w, height: h, borderRadius: 44, background: '#fff', boxShadow: '0 30px 70px rgba(0,0,0,0.14)', padding: 30, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: C.blueTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={30} color={C.blue} /></div>
      <div style={{ ...display(700), fontSize: 32, color: C.ink, lineHeight: 1.05 }}>{title}</div>
    </div>
    {children}
  </div>
);
const CATS = [['Fornecedores', 0.34], ['Operação', 0.26], ['Impostos', 0.22], ['Pessoal', 0.18]];
const Bars = ({ k = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>{[0.4, 0.6, 0.5, 0.78, 0.66, 0.9].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100 * Math.min(1, Math.max(0, k * 1.6 - i * 0.12))}%`, borderRadius: 10, background: i === 5 ? C.blue : C.blueTint }} />)}</div>
);
const Donut = ({ k = 1 }) => {
  let acc = 0; const R = 90, L = 2 * Math.PI * R;
  return (
    <svg width="240" height="240" viewBox="-120 -120 240 240">
      {CATS.map(([l, v], i) => { const d = <circle key={l} r={R} fill="none" stroke={[C.blue, '#2997FF', '#7FB6F5', C.blueTint][i]} strokeWidth="36" strokeDasharray={`${L * v * k - 4} ${L}`} strokeDashoffset={-L * acc * k} transform="rotate(-90)" />; acc += v; return d; })}
    </svg>
  );
};
export const F_Clareza = ({ a }) => {
  const t = useT(a);
  const tVis = W(5, 'visão'), tInf = W(5, 'informações'), tAco = W(5, 'acompanha'), tRes = W(5, 'responsabilidades');
  const tEnx = W(5, 'enxergar'), tCla = W(5, 'clareza'), tDin = W(5, 'dinheiro');
  const inK = prog(t, a, 0.25);
  // fase 1: órbita de 4 telas
  const orbitOut = prog(t, tAco - 0.4, 0.7, inOut);
  const panels = [
    { title: 'Relatório do mês', ic: 'chart', body: (k) => <Bars k={k} />, pos: [-260, -330, -80] },
    { title: 'Categorias', ic: 'grid', body: (k) => <div style={{ display: 'flex', justifyContent: 'center' }}><Donut k={k} /></div>, pos: [250, -250, -260] },
    { title: 'Pessoal · Negócio', ic: 'bag', body: () => <div style={{ display: 'flex', gap: 12 }}><div style={{ flex: 1, height: 180, borderRadius: 20, background: C.blueTint }} /><div style={{ flex: 1, height: 180, borderRadius: 20, background: C.blue }} /></div>, pos: [-230, 320, -220] },
    { title: 'Reserva de impostos', ic: 'doc', body: () => <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 110, height: 220, borderRadius: 55, background: '#EEF2F8', position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '66%', background: 'linear-gradient(180deg,#2997FF,#0058B8)' }} /></div></div>, pos: [270, 380, -40] },
  ];
  const orbit = (t - a) * 7;
  // fase 2: Pessoal/Negócio + reserva
  const f2 = prog(t, tAco - 0.3, 0.7, inOut), f2out = prog(t, tEnx - 0.45, 0.6, inOut);
  const split = prog(t, tAco + 0.2, 0.9, inOut);
  const fill = prog(t, B(tRes), 1.1, inOut) * 0.7;
  const mark = spr(t, B(tRes + 1.1), { damping: 12, stiffness: 170 });
  // fase 3: fluxo do dinheiro
  const f3 = prog(t, tEnx - 0.35, 0.7, inOut);
  const barsK = prog(t, B(tEnx + 0.1), 1.2, expoOut);
  const flow = prog(t, B(tDin - 0.15), 1.3, inOut);
  const outAll = prog(t, FIM(5) + 0.3, 0.35, expoIn);
  const head = (label, s, e) => {
    const k = spr(t, s, { damping: 14, stiffness: 150 }), o = prog(t, e, 0.25, expoIn);
    return <div style={{ position: 'absolute', top: 250, width: 1080, textAlign: 'center', ...display(700), fontSize: 76, color: C.ink, opacity: Math.min(1, k * 2) * (1 - o), transform: `translateY(${(1 - k) * 30 - o * 30}px)`, filter: `blur(${o * 8}px)` }}>{label}</div>;
  };
  return (
    <AbsoluteFill style={{ opacity: inK * (1 - outAll) }}>
      <LightBg>
        {head('Visão organizada', N[4] + 0.05, tAco - 0.35)}
        {head('Responsabilidades em dia', tAco - 0.1, tEnx - 0.4)}
        {head(<>Para onde vai o <span style={{ color: C.blue }}>dinheiro</span></>, tEnx - 0.2, 999)}
        {/* fase 1 · órbita */}
        <AbsoluteFill style={{ perspective: 1800, opacity: 1 - orbitOut }}>
          <div style={{ position: 'absolute', left: 540, top: 960, transformStyle: 'preserve-3d', transform: `rotateX(${8 + Math.sin(orbit * 0.02) * 4}deg) rotateY(${-14 + orbit}deg) scale(${1 + orbitOut * 0.4})` }}>
            {panels.map((p, i) => {
              const k = spr(t, B(N[4] - 0.25) + i * 0.302, { damping: 15, stiffness: 120 });
              const [x, y, z] = p.pos;
              return (
                <div key={i} style={{ position: 'absolute', left: x - 200, top: y - 260, transformStyle: 'preserve-3d', transform: `translateZ(${z + (1 - k) * -600}px) rotateY(${-(-14 + orbit)}deg) scale(0.86)`, opacity: Math.min(1, k * 2) }}>
                  <Panel title={p.title} ic={p.ic}>{p.body(prog(t, tVis + i * 0.2, 1.0))}</Panel>
                </div>
              );
            })}
          </div>
          {/* linhas de conexão */}
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            {[[300, 640, 790, 720], [300, 640, 310, 1280], [790, 720, 810, 1340], [310, 1280, 810, 1340]].map(([x1, y1, x2, y2], i) => {
              const k = prog(t, tInf + i * 0.12, 0.6);
              return <line key={i} x1={x1} y1={y1} x2={lerp(x1, x2, k)} y2={lerp(y1, y2, k)} stroke={C.blue} strokeOpacity="0.35" strokeWidth="3" strokeDasharray="8 10" />;
            })}
          </svg>
        </AbsoluteFill>
        {/* fase 2 · pessoal/negócio + reserva */}
        <div style={{ position: 'absolute', left: 70, top: 420, display: 'flex', gap: 30, opacity: f2 * (1 - f2out), transform: `translateY(${(1 - f2) * 120 - f2out * 80}px) scale(${0.94 + 0.06 * f2})` }}>
          <Panel title="Pessoal · Negócio" ic="bag" w={560} h={1000}>
            {[['cart', 'Mercado', 'Pessoal', 'out'], ['in', 'Venda', 'Negócio', 'in'], ['bag', 'Fornecedor', 'Negócio', 'out'], ['pill', 'Farmácia', 'Pessoal', 'out'], ['in', 'Serviço', 'Negócio', 'in']].map(([ic, l, c, tp], i) => {
              const pes = c === 'Pessoal';
              const k = prog(t, tAco + 0.2 + i * 0.1, 0.6, inOut);
              return <div key={i} style={{ transform: `translateX(${pes ? -k * 0 : 0}px)`, marginBottom: 12, opacity: pes ? 1 - k * 0.55 : 1 }}><Row ic={ic} label={l} cat={`${c}`} tipo={tp} hl={!pes ? k : 0} style={{ padding: '14px 16px' }} /></div>;
            })}
            <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
              <div style={{ flex: 1, padding: 18, borderRadius: 22, background: C.blueTint, ...text(600), fontSize: 26, color: C.blue, textAlign: 'center', opacity: split }}>Pessoal</div>
              <div style={{ flex: 1, padding: 18, borderRadius: 22, background: C.blue, ...text(600), fontSize: 26, color: '#fff', textAlign: 'center', opacity: split }}>Negócio</div>
            </div>
          </Panel>
          <Panel title="Reserva de impostos" ic="doc" w={360} h={1000}>
            <div style={{ position: 'relative', margin: '30px auto 0', width: 170, height: 640, borderRadius: 85, background: '#EEF2F8', overflow: 'hidden', boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.04)' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: 'linear-gradient(180deg,#2997FF,#0058B8)', borderRadius: '0 0 85px 85px' }} />
              <div style={{ position: 'absolute', left: 18, top: 30, width: 18, bottom: 60, borderRadius: 9, background: 'rgba(255,255,255,0.6)' }} />
              <div style={{ position: 'absolute', left: -10, right: -10, top: '30%', borderTop: '4px dashed rgba(29,29,31,0.35)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, transform: `scale(${mark})`, opacity: Math.min(1, mark * 2) }}><span style={{ ...text(600), fontSize: 28, color: '#fff', background: C.blue, padding: '10px 22px', borderRadius: 99 }}>✓ Reservado</span></div>
            <div style={{ textAlign: 'center', marginTop: 18 }}><Mask n={5} size={40} /></div>
          </Panel>
        </div>
        {/* fase 3 · relatório + fluxo por categoria */}
        <div style={{ position: 'absolute', left: 80, top: 400, opacity: f3, transform: `translateY(${(1 - f3) * 140}px) scale(${0.94 + 0.06 * f3})` }}>
          <Panel title="Relatório do mês" ic="chart" w={920} h={1080}>
            <Bars k={barsK} />
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '26px 0 10px' }}>
              {['Entradas', 'Saídas', 'Reserva'].map((l, i) => <div key={l}><div style={{ ...text(500), fontSize: 24, color: C.ink2 }}>{l}</div><Mask size={34} color={i === 2 ? C.blue : C.ink} /></div>)}
            </div>
            <svg width="860" height="560" viewBox="0 0 860 560" style={{ marginLeft: -30 }}>
              <defs><linearGradient id="fl" x1="0" x2="1"><stop offset="0" stopColor="#0071E3" /><stop offset="1" stopColor="#7FB6F5" /></linearGradient></defs>
              <rect x="40" y="150" width="150" height="250" rx="24" fill={C.blue} />
              <text x="115" y="285" textAnchor="middle" fill="#fff" style={{ ...text(600), fontSize: 26 }}>Entradas</text>
              {CATS.map(([l, v], i) => {
                const y = 40 + i * 130, k = Math.min(1, Math.max(0, flow * 1.4 - i * 0.12));
                const wdt = 16 + v * 110;
                const path = `M190 ${200 + i * 50} C 400 ${200 + i * 50}, 420 ${y + 45}, 600 ${y + 45}`;
                return (
                  <g key={l}>
                    <path d={path} stroke="url(#fl)" strokeOpacity="0.55" strokeWidth={wdt} fill="none" strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - k)} />
                    <rect x="600" y={y} width="220" height="90" rx="22" fill="#F2F6FC" opacity={k} />
                    <text x="710" y={y + 56} textAnchor="middle" fill={C.ink} opacity={k} style={{ ...text(600), fontSize: 26 }}>{l}</text>
                  </g>
                );
              })}
            </svg>
          </Panel>
        </div>
        <div style={{ position: 'absolute', top: 1520, width: 1080, display: 'flex', justifyContent: 'center' }}><DemoTag /></div>
      </LightBg>
    </AbsoluteFill>
  );
};
