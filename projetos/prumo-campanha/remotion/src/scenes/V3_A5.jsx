import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { kf, WHIP, GLIDE } from '../animations/cam';
import { W, B, FIM, MUS, N } from '../audio/timeline';
import { World, At, Letters } from '../components/Motion';
import { LightBg } from '../components/Stage';
import { Icon } from '../components/Icon';
import { Row, Mask, DemoTag } from '../components/AppUI';

// ATO 5 · a tela explode em 4 painéis em órbita → voo para Pessoal/Negócio → chicote para a reserva → (virada) fluxo do dinheiro
const PNL = { R: [-470, -560], K: [480, -470], PN: [-450, 560], RI: [470, 600] };
const CATS = [['Fornecedores', 0.34], ['Operação', 0.26], ['Impostos', 0.22], ['Pessoal', 0.18]];
const Card = ({ ic, title, children, w = 820, h = 1000 }) => (
  <div style={{ width: w, height: h, borderRadius: 64, background: '#fff', boxShadow: '0 40px 100px rgba(20,30,60,0.16)', padding: 56, boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 40 }}><div style={{ width: 84, height: 84, borderRadius: 26, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={48} color="#fff" /></div><div style={{ ...display(700), fontSize: 54, color: C.ink, lineHeight: 1.05 }}>{title}</div></div>
    {children}
  </div>
);
export const V3_A5 = ({ a }) => {
  const t = useT(a);
  const tVis = W(5, 'visão'), tInf = W(5, 'informações'), tAco = W(5, 'acompanha'), tRes = B(W(5, 'responsabilidades')), tEnx = MUS.V3, tDin = B(W(5, 'dinheiro'));
  const split = prog(t, a + 0.05, 0.7, expoOut);                // tela → 4 painéis
  const keys = [
    [a, { x: 0, y: 0, s: 0.9, ry: 0, rx: 0, rz: 0 }, expoOut],
    [a + 0.8, { x: -60, y: 40, s: 0.46, ry: -30, rx: 12, rz: -3 }, GLIDE],
    [tAco - 0.35, { x: 60, y: -40, s: 0.54, ry: 26, rx: 4, rz: 3 }, WHIP],
    [tAco + 0.1, { x: PNL.PN[0], y: PNL.PN[1], s: 1.12, ry: 0, rx: 0, rz: -1 }, GLIDE],
    [tRes - 0.35, { x: PNL.PN[0] + 10, y: PNL.PN[1] + 20, s: 1.16, ry: 0, rx: 0, rz: -1 }, WHIP],
    [tRes + 0.05, { x: PNL.RI[0], y: PNL.RI[1], s: 1.12, ry: 0, rx: 0, rz: 1 }, GLIDE],
    [tEnx - 0.25, { x: PNL.RI[0], y: PNL.RI[1] - 20, s: 1.18, ry: 0, rx: 0, rz: 1 }, WHIP],
    [tEnx + 0.3, { x: 0, y: 0, s: 0.3, ry: 0, rx: 0, rz: 0 }],
  ];
  const flowIn = prog(t, tEnx - 0.05, 0.5, inOut);
  const fill = prog(t, tRes, 1.0, inOut) * 0.72;
  const ok = spr(t, B(tRes + 1.0), { damping: 11, stiffness: 200 });
  const sep = prog(t, tAco + 0.15, 0.8, inOut);
  const pn = [['cart', 'Mercado', 'Pessoal', 'out'], ['in', 'Venda', 'Negócio', 'in'], ['bag', 'Fornecedor', 'Negócio', 'out'], ['pill', 'Farmácia', 'Pessoal', 'out'], ['in', 'Serviço', 'Negócio', 'in'], ['doc', 'Imposto', 'Negócio', 'out']];
  const head = (label, s, e) => { const k = spr(t, s, { damping: 14, stiffness: 180 }), o = prog(t, e - 0.1, 0.2, expoIn); return <div style={{ position: 'absolute', top: 230, width: 1080, textAlign: 'center', ...display(700), fontSize: 80, color: C.ink, opacity: Math.min(1, k * 2) * (1 - o), transform: `translateY(${(1 - k) * 40 - o * 30}px)`, filter: `blur(${o * 8}px)`, zIndex: 20 }}>{label}</div>; };
  // partículas do fluxo do dinheiro
  const parts = [];
  for (let i = 0; i < 90; i++) {
    const cat = i % 4, sp = 0.55 + (i % 7) * 0.05, life = ((t - tEnx) * sp + (i * 0.137) % 1) % 1;
    if (t < tEnx) break;
    const dens = t > tDin ? 1 : (i % 2 === 0 ? 1 : 0);
    if (!dens) continue;
    const y0 = 1060 + (cat - 1.5) * 40, y1 = 760 + cat * 250, x = lerp(250, 760, life);
    const e = life < 0.5 ? 4 * life ** 3 : 1 - (-2 * life + 2) ** 3 / 2;
    parts.push({ x, y: lerp(y0, y1, e), c: cat, a: Math.sin(life * Math.PI) });
  }
  return (
    <AbsoluteFill>
      <LightBg>
        <World t={t} keys={keys} id="mb-a5" perspective={2600} style={{ opacity: 1 - flowIn }}>
          {/* linhas de conexão com pulsos de luz */}
          <svg width="2400" height="2800" style={{ position: 'absolute', left: -1200, top: -1400, overflow: 'visible' }}>
            {[[PNL.R, PNL.K], [PNL.R, PNL.PN], [PNL.K, PNL.RI], [PNL.PN, PNL.RI]].map(([p1, p2], i) => {
              const k = prog(t, B(tInf) + i * 0.1, 0.5); const x1 = p1[0] + 1200, y1 = p1[1] + 1400, x2 = p2[0] + 1200, y2 = p2[1] + 1400;
              const pl = ((t - tInf) * 0.8 + i * 0.25) % 1;
              return <g key={i}><line x1={x1} y1={y1} x2={lerp(x1, x2, k)} y2={lerp(y1, y2, k)} stroke={C.blue} strokeOpacity="0.4" strokeWidth="8" strokeDasharray="20 18" />{k >= 1 && <circle cx={lerp(x1, x2, pl)} cy={lerp(y1, y2, pl)} r="18" fill={C.blue} />}</g>;
            })}
          </svg>
          {[['R', 'chart', 'Relatório do mês'], ['K', 'grid', 'Categorias'], ['PN', 'bag', 'Pessoal · Negócio'], ['RI', 'doc', 'Reserva de impostos']].map(([k, ic, title], i) => {
            const [px, py] = PNL[k]; const kk = spr(t, a + 0.05 + i * 0.06, { damping: 14, stiffness: 140 });
            return (
              <At key={k} x={lerp(0, px, kk)} y={lerp(0, py, kk)} z={(i % 2 ? 1 : -1) * 120 * kk} w={820} h={1000} s={lerp(0.35, 1, kk)} rot={(1 - kk) * (i % 2 ? 10 : -10)}>
                <Card ic={ic} title={title}>
                  {k === 'R' && <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, height: 560 }}>{[0.4, 0.6, 0.5, 0.78, 0.66, 0.92].map((h, j) => <div key={j} style={{ flex: 1, height: `${h * 100 * spr(t, tVis + j * 0.06)}%`, borderRadius: 18, background: j === 5 ? C.blue : C.blueTint }} />)}</div>}
                  {k === 'K' && (() => { let acc = 0; const R = 200, L = 2 * Math.PI * R, kd = prog(t, tVis + 0.2, 1.0, inOut); return <svg width="700" height="600" viewBox="-350 -300 700 600">{CATS.map(([l, v], j) => { const el = <circle key={l} r={R} fill="none" stroke={[C.blue, '#2997FF', '#7FB6F5', C.blueTint][j]} strokeWidth="90" strokeDasharray={`${L * v * kd - 8} ${L}`} strokeDashoffset={-L * acc * kd} transform="rotate(-90)" />; acc += v; return el; })}</svg>; })()}
                  {k === 'PN' && <div style={{ position: 'relative', height: 800 }}>{pn.map(([ic, l, cat, tp], j) => { const pes = cat === 'Pessoal'; const col = pn.slice(0, j).filter((q) => (q[2] === 'Pessoal') === pes).length; const x = lerp(0, pes ? 0 : 370, sep), y = lerp(j * 120, 80 + col * 130, sep), w = lerp(700, 330, sep); return <div key={j} style={{ position: 'absolute', left: x, top: y, width: w }}><div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, borderRadius: 26, background: pes ? (sep > 0.5 ? C.blueTint : '#F5F5F7') : (sep > 0.5 ? C.blue : '#F5F5F7') }}><Icon name={ic} size={40} color={!pes && sep > 0.5 ? '#fff' : C.ink} /><span style={{ ...text(600), fontSize: 32, color: !pes && sep > 0.5 ? '#fff' : C.ink }}>{l}</span></div></div>; })}{['Pessoal', 'Negócio'].map((l, j) => <div key={l} style={{ position: 'absolute', left: j * 370, top: 0, width: 330, textAlign: 'center', ...display(700), fontSize: 40, color: j ? C.blue : C.ink, opacity: sep }}>{l}</div>)}</div>}
                  {k === 'RI' && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ position: 'relative', width: 230, height: 600, borderRadius: 115, background: '#EEF2F8', overflow: 'hidden' }}><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${Math.max(fill, prog(t, tVis + 0.3, 1.0) * 0.3) * 100}%`, background: 'linear-gradient(180deg,#2997FF,#0058B8)' }} /><div style={{ position: 'absolute', left: -10, right: -10, top: '28%', borderTop: '6px dashed rgba(29,29,31,0.35)' }} /></div><div style={{ marginTop: 30, transform: `scale(${ok})`, ...text(700), fontSize: 40, color: '#fff', background: C.blue, padding: '14px 32px', borderRadius: 99 }}>✓ Reservado</div></div>}
                </Card>
              </At>
            );
          })}
        </World>
        {head('Visão organizada', tVis - 0.2, tAco - 0.3)}
        {head('Responsabilidades em dia', tAco - 0.1, tEnx - 0.2)}
        {/* VIRADA · o dinheiro em movimento */}
        <AbsoluteFill style={{ opacity: flowIn, transform: `scale(${lerp(1.4, 1, flowIn) + Math.max(0, t - tEnx) * 0.025}) translate(${Math.sin(Math.max(0, t - tEnx) * 0.8) * 30}px, ${Math.max(0, t - tEnx) * -12}px) rotate(${Math.sin(Math.max(0, t - tEnx) * 0.6) * 1.5}deg)` }}>
          <div style={{ position: 'absolute', top: 230, width: 1080, display: 'flex', justifyContent: 'center' }}>
            <Letters t={t} s={tEnx} text="o dinheiro em movimento" size={76} stagger={0.02} />
          </div>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            <rect x="90" y="900" width="170" height="320" rx="34" fill={C.blue} />
            <text x="175" y="1072" textAnchor="middle" fill="#fff" style={{ ...text(700), fontSize: 30 }}>Entradas</text>
            {CATS.map(([l, v], i) => { const y1 = 760 + i * 250; const k = prog(t, tEnx + 0.2 + i * 0.12, 0.6); return (
              <g key={l}>
                <path d={`M260 ${1000 + (i - 1.5) * 40} C 520 ${1000 + (i - 1.5) * 40}, 520 ${y1}, 760 ${y1}`} stroke={C.blue} strokeOpacity="0.18" strokeWidth={20 + v * 120} fill="none" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 * (1 - k)} />
                <rect x="760" y={y1 - 60} width="250" height="120" rx="30" fill="#fff" stroke={C.blue} strokeOpacity={0.3 + 0.7 * (t > tDin ? Math.max(0, Math.sin((t - tDin) * 6 - i)) : 0)} strokeWidth="4" opacity={k} />
                <text x="885" y={y1 + 12} textAnchor="middle" fill={C.ink} opacity={k} style={{ ...text(700), fontSize: 30 }}>{l}</text>
              </g>); })}
            {parts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={t > tDin ? 11 : 9} fill={[C.blue, '#2997FF', '#5AA9F5', '#0058B8'][p.c]} opacity={p.a} />)}
          </svg>
          <div style={{ position: 'absolute', top: 1580, width: 1080, display: 'flex', justifyContent: 'center' }}><DemoTag /></div>
        </AbsoluteFill>
      </LightBg>
    </AbsoluteFill>
  );
};
