// Cena 04: gestão financeira no ambiente escuro. Cartões claros e um laranja se movem no espaço;
// barras, linha e medidor se desenham com os números contando.
import React from 'react';
import {C, FONT} from '../theme';
import {K} from '../timing';
import {Abs, Blur, DarkBg, Glass, Icon, Rise} from '../components/base';
import {brl, drift, E, mix, pr, shutter, sp, SP, tw} from '../lib/anim';
import {ROWS, TOTAL, BUDGET} from '../three/appScreen';

const MUTED = '#8A8B8F';

const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; weight?: number; style?: React.CSSProperties}> = ({children, color = MUTED, size = 28, weight = 500, style}) => (
  <div style={{fontFamily: FONT, fontSize: size, fontWeight: weight, color, letterSpacing: size > 50 ? '-0.035em' : '-0.01em', ...style}}>{children}</div>
);

// Cartão A: gastos do mês por categoria
const CardGastos: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const cnt = pr(t, t0 + 0.15, 1.3, E.outSoft);
  return (
    <Glass w={820} h={600} r={48}>
      <div style={{padding: '44px 48px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Label size={30}>Gastos de novembro</Label>
          <div style={{padding: '8px 18px', borderRadius: 999, background: 'rgba(255,113,56,0.12)', fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.orange}}>Mês atual</div>
        </div>
        <Label size={88} weight={700} color={C.graphite} style={{marginTop: 8, fontVariantNumeric: 'tabular-nums'}}>{brl(TOTAL * cnt)}</Label>
        <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 22}}>
          {ROWS.map((r, i) => {
            const p = pr(t, t0 + 0.3 + i * 0.12, 0.9, E.out);
            return (
              <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 18}}>
                <Icon name={r.icon} size={36} />
                <Label size={28} color={C.graphite} style={{width: 190}}>{r.label}</Label>
                <div style={{flex: 1, height: 16, borderRadius: 8, background: C.gray, overflow: 'hidden'}}>
                  <div style={{width: `${(r.v / 650) * 100 * p}%`, height: '100%', borderRadius: 8, background: i === 0 ? `linear-gradient(90deg, ${C.orangeL}, ${C.orange})` : r.c}} />
                </div>
                <Label size={26} color={C.graphite} weight={600} style={{width: 150, textAlign: 'right', fontVariantNumeric: 'tabular-nums'}}>{brl(r.v * p)}</Label>
              </div>
            );
          })}
        </div>
      </div>
    </Glass>
  );
};

// Cartão B: histórico de 6 meses (linha + área)
// valores ilustrativos de um usuário fictício; outubro − novembro = 186,40 (cartão de economia)
const HIST = [980, 1240, 1060, 1320, 1471, 1284.6];
const MESES = ['jun', 'jul', 'ago', 'set', 'out', 'nov'];
const CardHistorico: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const p = pr(t, t0 + 0.2, 1.1, E.draw);
  const cw = 700, ch = 250, x0 = 0;
  const pts = HIST.map((v, i) => [x0 + (i * cw) / 5, ch - ((v - 800) / 800) * ch] as [number, number]);
  const d = pts.map((q, i) => {
    if (!i) return `M${q[0]} ${q[1]}`;
    const pq = pts[i - 1];
    const mx = (pq[0] + q[0]) / 2;
    return `C${mx} ${pq[1]} ${mx} ${q[1]} ${q[0]} ${q[1]}`;
  }).join('');
  return (
    <Glass w={820} h={520} r={48}>
      <div style={{padding: '44px 48px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icon name="chart" size={38} />
          <Label size={30} color={C.graphite} weight={600}>Histórico</Label>
          <Label size={26}>· últimos 6 meses</Label>
        </div>
        <svg width={cw + 40} height={ch + 70} style={{marginTop: 34, overflow: 'visible'}}>
          <defs>
            <linearGradient id="hArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.orange} stopOpacity={0.25} />
              <stop offset="1" stopColor={C.orange} stopOpacity={0} />
            </linearGradient>
            <clipPath id="hClip"><rect x={-20} y={-40} width={(cw + 40) * p} height={ch + 80} /></clipPath>
          </defs>
          {[0, 1, 2].map((i) => <line key={i} x1={0} x2={cw} y1={(ch / 2) * i} y2={(ch / 2) * i} stroke={C.gray} strokeWidth={2} strokeDasharray="6 10" />)}
          <path d={`${d}L${cw} ${ch}L0 ${ch}Z`} fill="url(#hArea)" clipPath="url(#hClip)" />
          <path d={d} fill="none" stroke={C.orange} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
          {pts.map((q, i) => {
            const pp = sp(t, t0 + 0.2 + (i / 5) * 1.0, SP.bouncy);
            return (
              <g key={i}>
                <circle cx={q[0]} cy={q[1]} r={(i === 5 ? 14 : 9) * pp} fill={i === 5 ? C.orange : C.white} stroke={C.orange} strokeWidth={4} />
                <text x={q[0]} y={ch + 52} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={500} fill={MUTED}>{MESES[i]}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </Glass>
  );
};

// Cartão C (laranja): economia no mês
const CardEconomia: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const c = pr(t, t0 + 0.15, 1.0, E.outSoft);
  return (
    <Glass w={600} h={380} r={44} tone="orange">
      <div style={{padding: '40px 44px', color: C.white}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icon name="wallet" size={40} color={C.white} />
          <Label size={30} color="rgba(255,255,255,0.92)" weight={600}>Economia no mês</Label>
        </div>
        <Label size={104} weight={700} color={C.white} style={{marginTop: 20, fontVariantNumeric: 'tabular-nums'}}>{brl(186.4 * c)}</Label>
        <Label size={26} color="rgba(255,255,255,0.85)" style={{marginTop: 8}}>em relação a outubro</Label>
      </div>
    </Glass>
  );
};

// Painel D: orçamento com medidor tipo velocímetro
const PanelOrcamento: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const g = pr(t, t0 + 0.2, 0.85, E.inOutSoft);
  const used = TOTAL / BUDGET; // 0,856
  const R = 190, sw = 26, A0 = 150, SWEEP = 240;
  const arc = (frac: number) => {
    const a0 = (A0 * Math.PI) / 180, a1 = ((A0 + SWEEP * frac) * Math.PI) / 180;
    const large = SWEEP * frac > 180 ? 1 : 0;
    return `M${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 ${large} 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)}`;
  };
  const rows = [
    ['Planejado', BUDGET, C.white],
    ['Gasto', TOTAL, C.orangeL],
    ['Disponível', BUDGET - TOTAL, C.white],
  ] as const;
  return (
    <Glass w={840} h={900} r={52} tone="dark">
      <div style={{padding: '48px 52px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 14, height: 14, borderRadius: 7, background: C.orange, boxShadow: `0 0 18px ${C.orange}`}} />
          <Label size={30} color="rgba(255,255,255,0.75)" weight={500}>Orçamento de novembro</Label>
        </div>
        <div style={{position: 'relative', height: 400, marginTop: 20}}>
          <svg width={736} height={400} viewBox="-368 -220 736 400" style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="gArc" x1="-1" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor={C.orangeL} />
                <stop offset="1" stopColor={C.orange} />
              </linearGradient>
            </defs>
            <path d={arc(1)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} strokeLinecap="round" />
            {Array.from({length: 25}).map((_, i) => {
              const a = ((A0 + (SWEEP * i) / 24) * Math.PI) / 180;
              const r1 = R - 40, r2 = R - (i % 6 === 0 ? 60 : 50);
              return <line key={i} x1={r1 * Math.cos(a)} y1={r1 * Math.sin(a)} x2={r2 * Math.cos(a)} y2={r2 * Math.sin(a)} stroke="rgba(255,255,255,0.25)" strokeWidth={i % 6 === 0 ? 4 : 2} strokeLinecap="round" />;
            })}
            {g > 0.001 && <path d={arc(used * g)} fill="none" stroke="url(#gArc)" strokeWidth={sw} strokeLinecap="round" style={{filter: `drop-shadow(0 0 14px rgba(255,113,56,0.6))`}} />}
            {(() => {
              const a = ((A0 + SWEEP * used * g) * Math.PI) / 180;
              return <line x1={0} y1={0} x2={(R - 70) * Math.cos(a)} y2={(R - 70) * Math.sin(a)} stroke={C.white} strokeWidth={6} strokeLinecap="round" />;
            })()}
            <circle r={16} fill={C.white} />
            <circle r={7} fill={C.orange} />
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, top: 268, textAlign: 'center'}}>
            <Label size={84} weight={700} color={C.white} style={{fontVariantNumeric: 'tabular-nums'}}>{(used * 100 * g).toFixed(1).replace('.', ',')}%</Label>
            <Label size={26} color="rgba(255,255,255,0.6)">do orçamento usado</Label>
          </div>
        </div>
        <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', gap: 0}}>
          {rows.map(([l, v, col], i) => {
            const rp = pr(t, t0 + 0.45 + i * 0.12, 0.7, E.out);
            return (
              <div key={l} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderTop: i ? '1.5px solid rgba(255,255,255,0.08)' : 'none', opacity: rp, transform: `translateY(${(1 - rp) * 20}px)`}}>
                <Label size={30} color="rgba(255,255,255,0.65)">{l}</Label>
                <Label size={36} weight={600} color={col} style={{fontVariantNumeric: 'tabular-nums'}}>{brl(v * pr(t, t0 + 0.3 + i * 0.1, 0.8, E.outSoft))}</Label>
              </div>
            );
          })}
        </div>
      </div>
    </Glass>
  );
};

export const SceneC: React.FC<{t: number}> = ({t}) => {
  const tA = K.controle - 0.2, tB = K.historico - 0.15, tC = K.economizar - 0.15, tD = K.mesames - 0.2;
  const rotY = tw(t, K.tenha - 0.3, 5.5, -7, 7, E.inOutSoft);

  // A: sobe girando; depois recua
  const aIn = sp(t, tA, SP.heavy);
  const aBack = sp(t, tB, SP.settle);
  // B: entra pela direita
  const bIn = sp(t, tB, SP.snappy);
  // C: atravessa à frente
  const cIn = sp(t, tC, SP.heavy);
  // saída de A, B, C e entrada de D
  const out = (i: number) => pr(t, tD - 0.1 + i * 0.05, 0.45, E.in);
  const dIn = sp(t, tD + 0.1, SP.heavy);

  const titleOut = K.historico - 0.25;

  return (
    <Abs>
      <DarkBg t={t} glow={1 + pr(t, K.tudo - 1.2, 1.1, E.in) * 1.2} />
      {/* título */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: FONT}}>
        <div style={{fontSize: 40, fontWeight: 500, color: 'rgba(255,255,255,0.6)'}}>
          <Rise id="c1" t={t} t0={K.tenha - 0.05} text="Tenha" style={{fontSize: 40}} out={titleOut} />
        </div>
        <div style={{fontSize: 104, fontWeight: 700, color: C.white, letterSpacing: '-0.045em', marginTop: -4}}>
          <Rise id="c2" t={t} t0={K.tenha + 0.15} text="mais" style={{fontSize: 104}} out={titleOut + 0.04} />{' '}
          <Rise id="c3" t={t} t0={K.controle} text="controle" style={{fontSize: 104, color: C.orange}} out={titleOut + 0.08} />
        </div>
      </div>

      <Abs style={{perspective: 2200, perspectiveOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${rotY}deg) rotateX(${drift(t, 9, 2, 0.15)}deg)`}}>
          {/* A */}
          {aIn > 0 && out(0) < 1 && (
            <div style={{position: 'absolute', left: 130, top: 640,
              transform: `translate3d(${mix(0, -150, aBack) - out(0) * 1300}px, ${mix(700, 0, aIn) + mix(0, -210, aBack) + drift(t, 1, 8)}px, ${mix(0, -420, aBack)}px) rotateX(${mix(-38, 0, aIn) + aBack * 4}deg) rotateY(${aBack * 22}deg) rotateZ(${(1 - aIn) * 6}deg)`,
              opacity: Math.min(1, aIn * 2) * (1 - 0.35 * aBack)}}>
              <Blur id="cA" x={shutter(out(0) > 0 && out(0) < 1 ? 2600 : 0, 0.5)}>
                <CardGastos t={t} t0={tA} />
              </Blur>
            </div>
          )}
          {/* B */}
          {bIn > 0 && out(1) < 1 && (
            <div style={{position: 'absolute', left: 130, top: 760,
              transform: `translate3d(${mix(1100, 40, bIn) - out(1) * 1400}px, ${drift(t, 2, 8) - sp(t, tC, SP.settle) * 120}px, ${mix(200, 0, bIn)}px) rotateY(${mix(-45, -6, bIn)}deg) rotateZ(${mix(8, 0, bIn)}deg)`,
              opacity: Math.min(1, bIn * 2)}}>
              <Blur id="cB" x={shutter((1 - bIn) * 3000 * (t - tB < 0.5 ? 1 : 0), 0.4)}>
                <CardHistorico t={t} t0={tB} />
              </Blur>
            </div>
          )}
          {/* C */}
          {cIn > 0 && out(2) < 1 && (
            <div style={{position: 'absolute', left: 380, top: 1150,
              transform: `translate3d(${mix(900, 0, cIn) - out(2) * 1500}px, ${mix(700, 0, cIn) + drift(t, 3, 10)}px, ${mix(500, 160, cIn)}px) rotateY(${mix(-50, -14, cIn)}deg) rotateZ(${mix(28, 5, cIn)}deg) rotateX(${mix(20, 6, cIn)}deg)`,
              opacity: Math.min(1, cIn * 3)}}>
              <CardEconomia t={t} t0={tC} />
            </div>
          )}
          {/* D */}
          {dIn > 0 && (
            <div style={{position: 'absolute', left: 120, top: 470,
              transform: `translate3d(0, ${drift(t, 4, 8)}px, ${mix(-900, 0, dIn)}px) rotateX(${mix(24, 0, dIn)}deg) rotateY(${mix(-18, 0, dIn)}deg)`,
              opacity: Math.min(1, dIn * 2)}}>
              <PanelOrcamento t={t} t0={tD} />
            </div>
          )}
        </div>
      </Abs>
    </Abs>
  );
};
