import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { kf, WHIP, GLIDE } from '../animations/cam';
import { W, B, FIM } from '../audio/timeline';
import { World, At, Letters, Sheen } from '../components/Motion';
import { LightBg } from '../components/Stage';
import { Phone } from '../components/Phone';
import { Home, Agenda, SW, SH } from '../components/Screens';
import { Header, Row, TabBar, ITENS, Touch, DemoTag, AppIcon, Mask } from '../components/AppUI';
import { Icon } from '../components/Icon';
import { Chip } from '../components/Cards2D';

// ATO 4 · DEMONSTRAÇÃO com câmera macro dentro do app: toque → resultado, holofote no que importa
const PX = -300, PY = -620;                                    // canto do celular no mundo
const S = (sx, sy) => [PX + 24 + sx, PY + 24 + sy];           // ponto da tela → mundo
const rows = ITENS.slice(0, 6);
// lista de movimentações com chegada, abertura de detalhe e divisão em colunas
const ListaV3 = ({ t, tArr, tRow, tSplit, tSwap }) => {
  const split = prog(t, tSplit, 0.55, inOut), swap = prog(t, tSwap, 0.4, inOut);
  let ri = 0, di = 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F5F5F7' }}>
      <Header title="Movimentações" sub="Este mês" />
      <div style={{ position: 'absolute', left: 30, right: 30, top: 200, height: 66, borderRadius: 22, background: '#E9E9EE', opacity: prog(t, tSplit - 0.6, 0.3) }}>
        <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6 + swap * 240, width: 240, borderRadius: 17, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
        {['Receitas', 'Despesas'].map((l, i) => <div key={l} style={{ position: 'absolute', top: 0, bottom: 0, left: i ? '50%' : 0, width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...text(700), fontSize: 26, color: (i === 0 && split > 0.5 && swap < 0.5) || (i === 1 && swap > 0.5) ? (i ? C.ink : C.blue) : C.ink2 }}>{l}</div>)}
      </div>
      {rows.map((it, i) => {
        const arr = i < 3 ? spr(t, tArr + (2 - i) * 0.3, { damping: 14, stiffness: 170 }) : 1;
        const isIn = it.tipo === 'in';
        const col = isIn ? ri++ : di++;
        const ly = 300 + i * 124 + (1 - arr) * -140;
        const cx = isIn ? 22 : 280, cy = 300 + 90 + col * 150;
        const x = lerp(18, cx, split), y = lerp(ly, cy, split), w = lerp(516, 250, split);
        const exp = prog(t, tRow, 0.35, expoOut) * (1 - prog(t, tSplit - 0.7, 0.3));
        const dimmed = split > 0.5 && ((swap < 0.5 && !isIn) || (swap > 0.5 && isIn));
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y + (i > 1 ? exp * 120 : 0), width: w, opacity: Math.min(1, arr * 2) * (dimmed ? 0.35 : 1), transform: `scale(${dimmed ? 0.94 : 1})`, transition: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 26, boxShadow: i === 1 && exp > 0 ? `0 0 0 ${4 * exp}px rgba(0,113,227,0.5), 0 20px 40px rgba(0,0,0,0.12)` : '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              {split > 0.5
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 14px' }}><div style={{ width: 52, height: 52, borderRadius: 16, background: isIn ? C.blueTint : '#F0F0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={it.ic} size={28} color={isIn ? C.blue : C.ink} /></div><div style={{ ...text(600), fontSize: 24, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</div></div>
                : <Row {...it} style={{ boxShadow: 'none', padding: '18px 20px' }} />}
              {i === 1 && <div style={{ height: 120 * exp, padding: exp > 0.3 ? '0 22px' : 0, display: 'flex', alignItems: 'center', gap: 12, opacity: exp }}>
                <span style={{ ...text(600), fontSize: 22, color: C.blue, background: C.blueTint, padding: '8px 16px', borderRadius: 99 }}>Negócio</span>
                <span style={{ ...text(600), fontSize: 22, color: C.ink, background: '#F0F0F3', padding: '8px 16px', borderRadius: 99 }}>Despesa</span>
                <span style={{ ...text(500), fontSize: 20, color: C.ink2 }}>demonstração</span>
              </div>}
            </div>
          </div>
        );
      })}
      {/* totais das colunas (mascarados) */}
      {[['Receitas', C.blue, 22], ['Despesas', C.ink, 280]].map(([l, c, x], i) => <div key={l} style={{ position: 'absolute', left: x, top: 300, width: 250, opacity: split, transform: `translateY(${(1 - split) * -20}px)` }}><div style={{ ...text(600), fontSize: 22, color: C.ink2 }}>{l}</div><Mask size={34} color={c} /></div>)}
      <TabBar active={1} />
    </div>
  );
};
export const V3_A4 = ({ a }) => {
  const t = useT(a);
  const tCom = W(4, 'Com'), tAco = W(4, 'acompanhar'), tMov = B(W(4, 'movimentações')), tOrg = W(4, 'organizar'), tRec = B(W(4, 'receitas')), tDes = B(W(4, 'despesas'));
  const tVis = W(4, 'visualizar'), tComp = B(W(4, 'compromissos')), tTudo = W(4, 'Tudo'), tSim = B(W(4, 'simples')), tCla = B(W(4, 'clara')), tOrgz = B(W(4, 'organizada'));
  const tTab = B(tAco + 0.25), tRow = B(tMov + 1.1), tAg = B(tVis + 0.1), tAviso = B(tComp + 0.6);
  const Z = (sx, sy, s, rz = 0) => { const [x, y] = S(sx, sy); return { x, y, s, rz, rx: 0, ry: 0 }; };
  const keys = [
    [a, { ...Z(276, 596, 0.78), ry: 12 }, GLIDE],
    [tAco - 0.3, Z(276, 640, 0.86), WHIP],
    [tTab - 0.05, Z(210, 1060, 1.9, -2), GLIDE],
    [tTab + 0.35, Z(210, 1040, 1.9, -2), WHIP],
    [tMov + 0.05, Z(276, 420, 1.75, 1)],
    [tRow - 0.1, Z(276, 470, 1.8, 1), GLIDE],
    [tRow + 0.5, Z(276, 520, 2.0, 0)],
    [tOrg - 0.2, Z(276, 500, 1.9, 0), WHIP],
    [tOrg + 0.25, Z(150, 240, 2.05, -1.5), GLIDE],
    [tRec + 0.1, Z(150, 260, 2.0, -1.5), WHIP],
    [tRec + 0.55, Z(276, 520, 1.12, 0), GLIDE],
    [tDes + 0.1, Z(400, 480, 1.25, 1), GLIDE],
    [tVis - 0.25, Z(400, 480, 1.25, 1), WHIP],
    [tAg + 0.25, Z(276, 300, 1.7, 0), GLIDE],
    [tComp + 0.3, Z(300, 330, 1.85, 0), GLIDE],
    [tAviso - 0.1, Z(276, 160, 1.6, 0), WHIP],
    [tAviso + 0.3, Z(276, 140, 2.0, -1), GLIDE],
    [tTudo - 0.2, Z(276, 160, 1.9, -1), WHIP],
    [tTudo + 0.45, { ...Z(276, 680, 0.5, -4), ry: -24, rx: 8 }, GLIDE],
    [FIM(4) + 0.6, { ...Z(276, 680, 0.44, 4), ry: 26, rx: -6 }],
  ];
  const c = kf(t, keys);
  // telas: Home → Lista (desliza) → Agenda (chicote vertical)
  const s1 = prog(t, tTab + 0.05, 0.35, inOut), s2 = prog(t, tAg, 0.35, inOut);
  const marks = [0, 1, 2].map((i) => spr(t, tComp + i * 0.302, { damping: 11, stiffness: 190 }));
  const aviso = spr(t, tAviso, { damping: 14, stiffness: 150 });
  // dedo (coordenadas da tela)
  const fpath = [[tAco - 0.1, 330, 1300], [tTab - 0.03, 207, 1104], [tTab + 0.4, 300, 800], [tRow - 0.03, 300, 470], [tRow + 0.4, 360, 380], [tRec - 0.03, 150, 233], [tDes - 0.03, 410, 233], [tDes + 0.5, 420, 600], [tAg - 0.03, 345, 1104], [tAg + 0.5, 420, 1300]];
  let fx = fpath[0][1], fy = fpath[0][2];
  for (let i = 0; i < fpath.length - 1; i++) { const [ta, xa, ya] = fpath[i], [tb, xb, yb] = fpath[i + 1]; if (t >= ta) { const p = inOut(Math.min(1, (t - ta) / Math.max(0.01, tb - ta))); fx = lerp(xa, xb, p); fy = lerp(ya, yb, p); } }
  const taps = [tTab, tRow, tRec, tDes, tAg];
  const press = Math.max(...taps.map((s) => (t > s && t < s + 0.28 ? Math.sin(((t - s) / 0.28) * Math.PI) : 0)));
  const fOp = prog(t, tAco - 0.2, 0.2) * (1 - prog(t, tAg + 0.5, 0.2));
  // holofote dentro da tela (retângulo de foco por etapa)
  const focus = t < tOrg ? (t > tRow ? [18, 400, 516, 250] : [18, 296, 516, 380]) : t < tVis ? (t < tRec ? [30, 200, 492, 66] : [16, 290, 520, 520]) : [16, 220, 520, 230];
  const spotK = prog(t, tMov - 0.1, 0.3) * (1 - prog(t, tTudo - 0.3, 0.3));
  // etapas
  const steps = [['Acompanhe', tCom + 0.1], ['Organize', tOrg], ['Antecipe', tVis]];
  const stepP = t < tOrg ? 0 : t < tVis ? 1 : 2;
  const railIn = prog(t, tCom, 0.4) * (1 - prog(t, tTudo - 0.2, 0.3));
  // palavras finais interagindo com o celular
  const words = [['simples', tSim], ['clara', tCla], ['organizada.', tOrgz]];
  const sweep = prog(t, tCla - 0.05, 0.8);
  return (
    <AbsoluteFill>
      <LightBg>
        <div style={{ position: 'absolute', left: -300, top: 200, width: 1700, height: 1500, background: 'radial-gradient(closest-side, rgba(0,113,227,0.14), rgba(0,113,227,0))' }} />
        <World t={t} keys={keys} id="mb-a4" perspective={3000}>
          <At x={0} y={0} w={600} h={1240}>
            <Phone w={600} h={1240}>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-s1 * 100}%)` }}><Home press={1} pressK={t > tTab && t < tTab + 0.28 ? press : 0} /></div>
              <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - s1) * 100}%) translateY(${-s2 * 100}%)` }}><ListaV3 t={t} tArr={tMov} tRow={tRow} tSplit={tRec} tSwap={tDes} /></div>
              <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - s2) * 100}%)` }}><Agenda t={t} marks={marks} hoje={2} /></div>
              {/* holofote */}
              <svg width={SW} height={SH} style={{ position: 'absolute', inset: 0, opacity: spotK, pointerEvents: 'none' }}>
                <defs><mask id="spot4"><rect width={SW} height={SH} fill="#fff" /><rect x={focus[0]} y={focus[1]} width={focus[2]} height={focus[3]} rx="26" fill="#000" /></mask></defs>
                <rect width={SW} height={SH} fill="rgba(20,24,32,0.24)" mask="url(#spot4)" />
              </svg>
              {/* lembrete */}
              <div style={{ position: 'absolute', left: 16, right: 16, top: 70, transform: `translateY(${(1 - aviso) * -260}px)`, opacity: Math.min(1, aviso * 2) * (1 - prog(t, tTudo + 0.3, 0.3)), padding: '22px 24px', borderRadius: 34, background: 'rgba(255,255,255,0.96)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', display: 'flex', gap: 18, alignItems: 'center' }}>
                <AppIcon size={70} dark style={{ borderRadius: 20, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', ...text(600), fontSize: 18, color: C.ink2 }}><span>PRUMO · LEMBRETE</span><span>demonstração</span></div>
                  <div style={{ ...text(700), fontSize: 28, color: C.ink, marginTop: 2 }}>Aluguel vence amanhã</div>
                </div>
              </div>
              {t > tAco - 0.3 && fOp > 0 && <Touch x={fx} y={fy} press={press} opacity={fOp} />}
              <Sheen p={sweep} width={180} />
            </Phone>
          </At>
        </World>
        {/* trilho das etapas */}
        <div style={{ position: 'absolute', top: 210, left: 90, right: 90, height: 100, opacity: railIn, transform: `translateY(${(1 - railIn) * -40}px)` }}>
          <div style={{ position: 'absolute', left: 40, right: 40, top: 30, height: 6, borderRadius: 3, background: 'rgba(29,29,31,0.12)' }} />
          <div style={{ position: 'absolute', left: 40, top: 30, height: 6, borderRadius: 3, background: C.blue, width: `${lerp(0, 100, (stepP + prog(t, [tOrg, tVis, tTudo][stepP] - 0.6, 0.6)) / 2) * 0.82}%` }} />
          {steps.map(([l, s], i) => { const on = t >= s - 0.05; const k = spr(t, s - 0.05, { damping: 12, stiffness: 200 }); return (
            <div key={l} style={{ position: 'absolute', left: `${i * 41}%`, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140, marginLeft: i === 0 ? 0 : i === 2 ? -40 : -20 }}>
              <div style={{ width: 66, height: 66, borderRadius: 33, background: on ? C.blue : '#fff', border: `4px solid ${on ? C.blue : 'rgba(29,29,31,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display(700), fontSize: 30, color: on ? '#fff' : C.ink3, transform: `scale(${on ? 0.85 + 0.25 * k - 0.1 * Math.max(0, k - 1) : 0.85})` }}>{i + 1}</div>
              <div style={{ ...display(600), fontSize: 30, color: i === stepP ? C.ink : C.ink3, marginTop: 6 }}>{l}</div>
            </div>); })}
        </div>
        {/* tipografia final: elementos voando para fora (simples), luz (clara), encaixe (organizada) */}
        {Array.from({ length: 8 }, (_, i) => { const k = prog(t, tSim + i * 0.03, 0.7, expoIn); return k > 0 && k < 1 ? <div key={i} style={{ position: 'absolute', left: 540 - 150 + Math.cos(i) * 900 * k, top: 960 + Math.sin(i * 1.3) * 1100 * k, transform: `rotate(${i * 40 * k}deg) scale(${1 - k * 0.3})`, opacity: 1 - k }}><Chip ic={['bell', 'doc', 'chat', 'cart'][i % 4]} red={i % 3 === 0} /></div> : null; })}
        {words.map(([w, s], i) => {
          const k = spr(t, s - 0.04, { damping: 13, stiffness: 210 });
          const next = words[i + 1]?.[1] ?? 999; const o = prog(t, next - 0.1, 0.18, expoIn);
          return <div key={w} style={{ position: 'absolute', top: 1380, width: 1080, textAlign: 'center', ...display(800), fontSize: 168, color: i === 2 ? C.blue : C.ink, letterSpacing: '-0.05em', opacity: Math.min(1, k * 2) * (1 - o), transform: `translateY(${(1 - k) * 120 - o * 80}px) scale(${1.25 - 0.25 * k})`, filter: `blur(${o * 14}px)` }}>{w}</div>;
        })}
        <div style={{ position: 'absolute', top: 1300, width: 1080, textAlign: 'center', ...display(500), fontSize: 56, color: C.ink2, opacity: prog(t, tTudo, 0.3) }}>Tudo de uma forma mais</div>
        <div style={{ position: 'absolute', top: 1615, width: 1080, display: 'flex', justifyContent: 'center', opacity: railIn }}><DemoTag /></div>
      </LightBg>
    </AbsoluteFill>
  );
};
