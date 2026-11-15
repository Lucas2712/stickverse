// Cena 04 (ambiente escuro): «Mais controle sobre os processos, mais agilidade nas decisões e mais tempo
// para cuidar do que realmente importa.» Um título cinético por frase; cartões claros e um laranja se movem
// no espaço; barras, linha, etapas e medidor se desenham com os números contando.
// Todos os valores são dados ilustrativos de um hotel fictício.
import React from 'react';
import {C, FONT} from '../theme';
import {K} from '../timing';
import {Abs, Blur, DarkBg, Glass, Icon, Rise} from '../components/base';
import {brl, drift, E, mix, pr, shutter, sp, SP, tw} from '../lib/anim';

const MUTED = '#8A8B8F';

const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; weight?: number; style?: React.CSSProperties}> = ({children, color = MUTED, size = 28, weight = 500, style}) => (
  <div style={{fontFamily: FONT, fontSize: size, fontWeight: weight, color, letterSpacing: size > 50 ? '-0.035em' : '-0.01em', ...style}}>{children}</div>
);

const Chip: React.FC<{p: number; tone: 'orange' | 'dark' | 'gray'; children: React.ReactNode}> = ({p, tone, children}) => (
  <div style={{padding: '8px 18px', borderRadius: 999, fontFamily: FONT, fontSize: 22, fontWeight: 600,
    background: tone === 'orange' ? C.orange : tone === 'dark' ? C.graphite : C.gray, color: tone === 'gray' ? C.graphite : C.white,
    transform: `scale(${0.6 + 0.4 * p})`, opacity: p}}>{children}</div>
);

// A: processos do dia (tabela com status)
const PROC = [
  {icon: 'conc', label: 'Check-in', n: 'Quarto 108', st: 'Concluído', tone: 'dark'},
  {icon: 'bed', label: 'Limpeza', n: '14 quartos', st: 'Em andamento', tone: 'orange'},
  {icon: 'wrench', label: 'Manutenção', n: 'Quarto 214', st: 'Agendada', tone: 'gray'},
  {icon: 'cart', label: 'Compras', n: 'Pedido #482', st: 'Aguardando', tone: 'orange'},
] as const;
const CardProcessos: React.FC<{t: number; t0: number}> = ({t, t0}) => (
  <Glass w={820} h={600} r={48}>
    <div style={{padding: '42px 46px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Label size={34} color={C.graphite} weight={700}>Processos de hoje</Label>
        <Label size={24}>{Math.round(26 * pr(t, t0 + 0.1, 1.0, E.outSoft))} de 26 concluídos</Label>
      </div>
      <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16}}>
        {PROC.map((r, i) => {
          const p = pr(t, t0 + 0.2 + i * 0.13, 0.5, E.out);
          return (
            <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', borderRadius: 24, background: i % 2 ? 'transparent' : C.off,
              transform: `translateX(${(1 - p) * 60}px)`, opacity: p}}>
              <div style={{width: 64, height: 64, borderRadius: 18, background: 'rgba(255,113,56,0.12)', display: 'grid', placeItems: 'center'}}><Icon name={r.icon} size={36} /></div>
              <div style={{flex: 1}}>
                <Label size={30} color={C.graphite} weight={600}>{r.label}</Label>
                <Label size={22}>{r.n}</Label>
              </div>
              <Chip p={pr(t, t0 + 0.45 + i * 0.13, 0.35, E.out)} tone={r.tone}>{r.st}</Chip>
            </div>
          );
        })}
      </div>
    </div>
  </Glass>
);

// B: ocupação da semana (linha + área)
const OCC = [64, 71, 68, 79, 92, 97, 88];
const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
const CardOcupacao: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const p = pr(t, t0 + 0.15, 1.0, E.draw);
  const cw = 700, ch = 230;
  const pts = OCC.map((v, i) => [(i * cw) / 6, ch - ((v - 50) / 50) * ch] as [number, number]);
  const d = pts.map((q, i) => {
    if (!i) return `M${q[0]} ${q[1]}`;
    const pq = pts[i - 1], mx = (pq[0] + q[0]) / 2;
    return `C${mx} ${pq[1]} ${mx} ${q[1]} ${q[0]} ${q[1]}`;
  }).join('');
  return (
    <Glass w={820} h={500} r={48}>
      <div style={{padding: '42px 46px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icon name="chart" size={38} />
          <Label size={30} color={C.graphite} weight={600}>Ocupação</Label>
          <Label size={26}>· próximos 7 dias</Label>
        </div>
        <svg width={cw + 40} height={ch + 70} style={{marginTop: 30, overflow: 'visible'}}>
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
            const pp = sp(t, t0 + 0.15 + (i / 6) * 0.9, SP.bouncy);
            return (
              <g key={i}>
                <circle cx={q[0]} cy={q[1]} r={(i === 5 ? 14 : 9) * pp} fill={i === 5 ? C.orange : C.white} stroke={C.orange} strokeWidth={4} />
                {i === 5 && pp > 0.5 && <text x={q[0]} y={q[1] - 30} textAnchor="middle" fontFamily={FONT} fontSize={26} fontWeight={700} fill={C.graphite} opacity={Math.min(1, (pp - 0.5) * 2)}>97%</text>}
                <text x={q[0]} y={ch + 52} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={500} fill={MUTED}>{DIAS[i]}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </Glass>
  );
};

// C (laranja): decisão em um toque
const CardDecisao: React.FC<{t: number; t0: number; tOk: number}> = ({t, t0, tOk}) => {
  const ok = sp(t, tOk, SP.bouncy);
  const press = 1 - 0.08 * Math.sin(Math.PI * pr(t, tOk - 0.12, 0.24, E.inOutSoft));
  return (
    <Glass w={620} h={450} r={44} tone="orange">
      <div style={{padding: '38px 42px', color: C.white}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icon name="cart" size={40} color={C.white} />
          <Label size={28} color="rgba(255,255,255,0.92)" weight={600}>Pedido de compras #482</Label>
        </div>
        <Label size={96} weight={700} color={C.white} style={{marginTop: 16, fontVariantNumeric: 'tabular-nums'}}>{brl(3240 * pr(t, t0 + 0.1, 0.8, E.outSoft))}</Label>
        <Label size={24} color="rgba(255,255,255,0.85)">Enxoval · 3 fornecedores cotados</Label>
        <div style={{marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 30px', borderRadius: 999,
          background: ok > 0.02 ? C.white : 'rgba(255,255,255,0.22)', color: ok > 0.02 ? C.orange : C.white, transform: `scale(${press})`,
          fontFamily: FONT, fontSize: 30, fontWeight: 700, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.5)'}}>
          {ok > 0.02 && <div style={{transform: `scale(${ok})`}}><Icon name="check" size={32} color={C.orange} stroke={2.6} /></div>}
          {ok > 0.02 ? 'Aprovado' : 'Aprovar'}
        </div>
      </div>
    </Glass>
  );
};

// D: etapas automáticas (1→4) e resumo do dia com medidor
const STEPS = ['Pedido', 'Cotação', 'Aprovação', 'Entrega'];
const Steps: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const fill = pr(t, t0 + 0.1, 0.75, E.inOut);
  return (
    <div style={{position: 'relative', width: 900, height: 180}}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 46, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)'}} />
      <div style={{position: 'absolute', left: 90, top: 46, width: 720 * fill, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.orangeL}, ${C.orange})`, boxShadow: `0 0 18px ${C.orange}`}} />
      {STEPS.map((s, i) => {
        const lit = pr(t, t0 + 0.1 + i * 0.22, 0.2, E.out);
        return (
          <div key={s} style={{position: 'absolute', left: 90 + i * 240 - 50, top: 0, width: 100, textAlign: 'center'}}>
            <div style={{width: 96, height: 96, borderRadius: 48, margin: '0 auto', display: 'grid', placeItems: 'center', fontFamily: FONT, fontSize: 38, fontWeight: 700,
              background: lit > 0.5 ? `radial-gradient(circle at 35% 30%, ${C.orangeL}, ${C.orange})` : C.graphite,
              color: lit > 0.5 ? C.white : 'rgba(255,255,255,0.5)', transform: `scale(${0.85 + 0.15 * lit})`,
              boxShadow: lit > 0.5 ? `0 0 0 ${12 * lit}px rgba(255,113,56,0.15), 0 0 40px rgba(255,113,56,0.5)` : 'inset 0 0 0 2px rgba(255,255,255,0.1)'}}>{i + 1}</div>
            <Label size={26} color={lit > 0.5 ? C.white : 'rgba(255,255,255,0.45)'} style={{marginTop: 18, width: 200, marginLeft: -50}}>{s}</Label>
          </div>
        );
      })}
    </div>
  );
};

const PanelResumo: React.FC<{t: number; t0: number}> = ({t, t0}) => {
  const g = pr(t, t0 + 0.15, 0.85, E.inOutSoft);
  const used = 0.87;
  const R = 170, sw = 24, A0 = 150, SWEEP = 240;
  const arc = (frac: number) => {
    const a0 = (A0 * Math.PI) / 180, a1 = ((A0 + SWEEP * frac) * Math.PI) / 180;
    const large = SWEEP * frac > 180 ? 1 : 0;
    return `M${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 ${large} 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)}`;
  };
  const rows = [['Check-ins', 38, (v: number) => String(Math.round(v))], ['Check-outs', 24, (v: number) => String(Math.round(v))], ['Receita do dia', 24860, (v: number) => brl(v)]] as const;
  return (
    <Glass w={840} h={820} r={52} tone="dark">
      <div style={{padding: '46px 52px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 14, height: 14, borderRadius: 7, background: C.orange, boxShadow: `0 0 18px ${C.orange}`}} />
          <Label size={30} color="rgba(255,255,255,0.75)">Resumo de hoje</Label>
        </div>
        <div style={{position: 'relative', height: 360, marginTop: 16}}>
          <svg width={736} height={360} viewBox="-368 -200 736 360" style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="gArc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={C.orangeL} />
                <stop offset="1" stopColor={C.orange} />
              </linearGradient>
            </defs>
            <path d={arc(1)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} strokeLinecap="round" />
            {Array.from({length: 25}).map((_, i) => {
              const a = ((A0 + (SWEEP * i) / 24) * Math.PI) / 180;
              const r1 = R - 38, r2 = R - (i % 6 === 0 ? 58 : 48);
              return <line key={i} x1={r1 * Math.cos(a)} y1={r1 * Math.sin(a)} x2={r2 * Math.cos(a)} y2={r2 * Math.sin(a)} stroke="rgba(255,255,255,0.25)" strokeWidth={i % 6 === 0 ? 4 : 2} strokeLinecap="round" />;
            })}
            {g > 0.001 && <path d={arc(used * g)} fill="none" stroke="url(#gArc)" strokeWidth={sw} strokeLinecap="round" style={{filter: 'drop-shadow(0 0 14px rgba(255,113,56,0.6))'}} />}
            {(() => {
              const a = ((A0 + SWEEP * used * g) * Math.PI) / 180;
              return <line x1={0} y1={0} x2={(R - 66) * Math.cos(a)} y2={(R - 66) * Math.sin(a)} stroke={C.white} strokeWidth={6} strokeLinecap="round" />;
            })()}
            <circle r={15} fill={C.white} />
            <circle r={6} fill={C.orange} />
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, top: 236, textAlign: 'center'}}>
            <Label size={80} weight={700} color={C.white} style={{fontVariantNumeric: 'tabular-nums'}}>{Math.round(used * 100 * g)}%</Label>
            <Label size={26} color="rgba(255,255,255,0.6)">de ocupação</Label>
          </div>
        </div>
        <div style={{marginTop: 40}}>
          {rows.map(([l, v, fmt], i) => {
            const rp = pr(t, t0 + 0.3 + i * 0.1, 0.6, E.out);
            return (
              <div key={l} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: i ? '1.5px solid rgba(255,255,255,0.08)' : 'none', opacity: rp, transform: `translateY(${(1 - rp) * 20}px)`}}>
                <Label size={30} color="rgba(255,255,255,0.65)">{l}</Label>
                <Label size={36} weight={600} color={i === 2 ? C.orangeL : C.white} style={{fontVariantNumeric: 'tabular-nums'}}>{fmt(v * pr(t, t0 + 0.3 + i * 0.1, 0.8, E.outSoft))}</Label>
              </div>
            );
          })}
        </div>
      </div>
    </Glass>
  );
};

/** Título cinético: uma frase por vez. */
const Title: React.FC<{t: number; a: number; b: number; small: string[]; big: [string, string]; id: string; smallAt: number[]; bigAt: [number, number]}> = ({t, a, b, small, big, id, smallAt, bigAt}) => {
  if (t < a - 0.1 || t > b + 0.5) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: FONT}}>
      <div style={{fontSize: 108, fontWeight: 700, color: C.white, letterSpacing: '-0.045em'}}>
        <Rise id={`${id}a`} t={t} t0={bigAt[0]} text={big[0]} style={{fontSize: 108}} out={b} />{' '}
        <Rise id={`${id}b`} t={t} t0={bigAt[1]} text={big[1]} style={{fontSize: 108, color: C.orange}} out={b + 0.04} />
      </div>
      <div style={{fontSize: 44, fontWeight: 500, color: 'rgba(255,255,255,0.62)', marginTop: -2}}>
        {small.map((w, i) => (
          <React.Fragment key={i}>
            <Rise id={`${id}s${i}`} t={t} t0={smallAt[i]} text={w} style={{fontSize: 44}} out={b + 0.06} />{i < small.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const SceneC: React.FC<{t: number}> = ({t}) => {
  const tA = K.processos - 0.2, tB = K.agilidade - 0.1, tC = K.decisoes - 0.45, tS = K.tempo - 0.15, tD = K.cuidar - 0.15;
  const rotY = tw(t, K.controle - 0.4, 6.8, -7, 7, E.inOutSoft);

  const aIn = sp(t, tA, SP.heavy);
  const aBack = sp(t, tB, SP.settle);
  const bIn = sp(t, tB, SP.snappy);
  const cIn = sp(t, tC, SP.heavy);
  const out = (i: number) => pr(t, tS - 0.1 + i * 0.05, 0.42, E.in);
  const sIn = sp(t, tS, SP.snappy);
  const sOut = pr(t, tD - 0.05, 0.4, E.inOut);
  const dIn = sp(t, tD + 0.05, SP.heavy);

  return (
    <Abs>
      <DarkBg t={t} glow={1 + pr(t, K.gestao - 1.2, 1.1, E.in) * 1.2} />
      <Title id="t1" t={t} a={K.controle} b={K.agilidade - 0.3} big={['Mais', 'controle']} bigAt={[K.controle - 0.04, K.controle + 0.14]}
        small={['sobre', 'os', 'processos']} smallAt={[K.processos, K.processos + 0.28, K.processos + 0.44]} />
      <Title id="t2" t={t} a={K.agilidade} b={K.tempo - 0.3} big={['Mais', 'agilidade']} bigAt={[K.agilidade - 0.04, K.agilidade + 0.22]}
        small={['nas', 'decisões']} smallAt={[K.decisoes - 0.28, K.decisoes]} />
      <Title id="t3" t={t} a={K.tempo} b={K.gestao - 0.55} big={['Mais', 'tempo']} bigAt={[K.tempo - 0.04, K.tempo + 0.18]}
        small={['para', 'cuidar', 'do', 'que', 'realmente', 'importa']} smallAt={[K.cuidar - 0.24, K.cuidar, K.cuidar + 0.38, K.cuidar + 0.54, K.cuidar + 0.68, K.importa]} />

      <Abs style={{perspective: 2200, perspectiveOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${rotY}deg) rotateX(${drift(t, 9, 2, 0.15)}deg)`}}>
          {/* A: processos */}
          {aIn > 0 && out(0) < 1 && (
            <div style={{position: 'absolute', left: 130, top: 640,
              transform: `translate3d(${mix(0, -150, aBack) - out(0) * 1300}px, ${mix(700, 0, aIn) + mix(0, -200, aBack) + drift(t, 1, 8)}px, ${mix(0, -420, aBack)}px) rotateX(${mix(-38, 0, aIn) + aBack * 4}deg) rotateY(${aBack * 22}deg) rotateZ(${(1 - aIn) * 6}deg)`,
              opacity: Math.min(1, aIn * 2) * (1 - 0.35 * aBack)}}>
              <Blur id="cA" x={out(0) > 0 && out(0) < 1 ? 12 : 0}>
                <CardProcessos t={t} t0={tA} />
              </Blur>
            </div>
          )}
          {/* B: ocupação */}
          {bIn > 0 && out(1) < 1 && (
            <div style={{position: 'absolute', left: 130, top: 760,
              transform: `translate3d(${mix(1100, 40, bIn) - out(1) * 1400}px, ${drift(t, 2, 8) - sp(t, tC, SP.settle) * 120}px, ${mix(200, 0, bIn)}px) rotateY(${mix(-45, -6, bIn)}deg) rotateZ(${mix(8, 0, bIn)}deg)`,
              opacity: Math.min(1, bIn * 2)}}>
              <Blur id="cB" x={Math.min(16, shutter((1 - bIn) * 3000 * (t - tB < 0.5 ? 1 : 0), 0.4))}>
                <CardOcupacao t={t} t0={tB} />
              </Blur>
            </div>
          )}
          {/* C: decisão */}
          {cIn > 0 && out(2) < 1 && (
            <div style={{position: 'absolute', left: 290, top: 1120,
              transform: `translate3d(${mix(900, 0, cIn) - out(2) * 1500}px, ${mix(700, 0, cIn) + drift(t, 3, 10)}px, ${mix(500, 160, cIn)}px) rotateY(${mix(-50, -14, cIn)}deg) rotateZ(${mix(28, 5, cIn)}deg) rotateX(${mix(20, 6, cIn)}deg)`,
              opacity: Math.min(1, cIn * 3)}}>
              <CardDecisao t={t} t0={tC} tOk={K.decisoes + 0.15} />
            </div>
          )}
          {/* etapas 1→4 */}
          {sIn > 0 && sOut < 1 && (
            <div style={{position: 'absolute', left: 90, top: 880,
              transform: `translate3d(${mix(700, 0, sIn)}px, ${-sOut * 380}px, ${mix(-300, 0, sIn) - sOut * 600}px) rotateY(${mix(-30, 0, sIn)}deg)`,
              opacity: Math.min(1, sIn * 2) * (1 - sOut)}}>
              <Steps t={t} t0={tS} />
            </div>
          )}
          {/* D: resumo de hoje */}
          {dIn > 0 && (
            <div style={{position: 'absolute', left: 120, top: 560,
              transform: `translate3d(0, ${drift(t, 4, 8)}px, ${mix(-900, 0, dIn)}px) rotateX(${mix(24, 0, dIn)}deg) rotateY(${mix(-18, 0, dIn)}deg)`,
              opacity: Math.min(1, dIn * 2)}}>
              <PanelResumo t={t} t0={tD} />
            </div>
          )}
        </div>
      </Abs>
    </Abs>
  );
};
