import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, map, lerp, inOut, expoIn, expoOut } from '../animations/motion';
import { W, FIM, B } from '../audio/timeline';
import { LightBg } from '../components/Stage';
import { Phone } from '../components/Phone';
import { Home, Lista, Agenda, SW, SH } from '../components/Screens';
import { Touch, StepChip, DemoTag, AppIcon } from '../components/AppUI';
import { Icon } from '../components/Icon';

// ATO 4 · DEMONSTRAÇÕES: um dedo usa o app, passo a passo, sincronizado com cada palavra.
export const E_Demos = ({ a }) => {
  const t = useT(a);
  const tAco = W(4, 'acompanhar'), tMov = W(4, 'movimentações'), tOrg = W(4, 'organizar'), tRec = W(4, 'receitas'), tDes = W(4, 'despesas');
  const tVis = W(4, 'visualizar'), tCom = W(4, 'compromissos'), tTudo = W(4, 'Tudo');
  const tTabMov = B(tAco + 0.45), tTabAg = B(tVis + 0.35), tRow = B(tMov + 1.25), tAviso = B(tCom + 0.75), tRecB = B(tRec), tDesB = B(tDes);
  // celular: herda a posição da cena anterior e cresce para a demonstração
  const grow = prog(t, a, 0.8, inOut);
  const sc = lerp(0.78, 0.92, grow);
  const recede = prog(t, tTudo - 0.1, 0.9, inOut);
  const PX = 540 - 300 * sc, PY = lerp(470, 345, grow);
  const toG = (sx, sy) => [PX + (24 + sx) * sc, PY + (24 + sy) * sc];        // tela → quadro
  // dedo: caminho por quadros-chave [t, sx, sy]
  const path = [[tAco - 0.2, 470, 1250], [tTabMov - 0.05, 207, 1104], [tTabMov + 0.6, 260, 760], [tRow - 0.05, 280, 560], [tRow + 0.5, 300, 330], [tRecB - 0.05, 141, 245], [tDesB - 0.05, 411, 245], [tTabAg - 0.05, 345, 1104], [tTabAg + 0.6, 420, 900]];
  let fx = path[0][1], fy = path[0][2];
  for (let i = 0; i < path.length - 1; i++) { const [ta, xa, ya] = path[i], [tb, xb, yb] = path[i + 1]; if (t >= ta) { const p = inOut(Math.min(1, (t - ta) / Math.max(0.01, tb - ta))); fx = lerp(xa, xb, p); fy = lerp(ya, yb, p); } }
  const taps = [tTabMov, tRow, tRecB, tDesB, tTabAg];
  const press = Math.max(...taps.map((s) => (t > s && t < s + 0.3 ? Math.sin(((t - s) / 0.3) * Math.PI) : 0)));
  const fingerOp = prog(t, tAco - 0.3, 0.3) * (1 - prog(t, tTabAg + 0.7, 0.3));
  const [gx, gy] = toG(fx, fy);
  const focus = prog(t, tTabMov - 0.6, 0.6, inOut) * (1 - prog(t, tTudo - 0.5, 0.5, inOut));
  const [ox, oy] = toG(lerp(276, fx, 0.55), lerp(600, fy, 0.55));
  // telas: Home → Lista → Agenda (deslizam)
  const s1 = prog(t, tTabMov + 0.08, 0.45, inOut), s2 = prog(t, tTabAg + 0.08, 0.45, inOut);
  const chegam = [0, 1, 2].map((i) => prog(t, B(tMov) + i * 0.302, 0.5, expoOut));
  const filtro = t < tDesB ? (t > tRecB ? 'in' : null) : 'out';
  const filtroK = t < tDesB ? prog(t, tRecB + 0.05, 0.4, inOut) : prog(t, tDesB + 0.05, 0.4, inOut);
  const seg = t < tDesB ? 0 : prog(t, tDesB, 0.25, inOut);
  const marks = [0, 1, 2].map((i) => spr(t, B(tCom) + i * 0.302, { damping: 12, stiffness: 170 }));
  const aviso = spr(t, tAviso, { damping: 15, stiffness: 140 });
  const avisoOut = prog(t, tTudo - 0.3, 0.3, expoIn);
  // etapas numeradas
  const steps = [[1, 'Acompanhe as movimentações', B(W(4, 'Com') + 0.15), B(tOrg)], [2, 'Organize receitas e despesas', B(tOrg), B(tVis)], [3, 'Visualize os compromissos', B(tVis), tTudo - 0.1]];
  // palavras finais
  const words = [['simples', B(W(4, 'simples')), 'sparkle'], ['clara', B(W(4, 'clara')), 'chart'], ['organizada', B(W(4, 'organizada')), 'grid']];
  return (
    <LightBg>
      <div style={{ position: 'absolute', left: -300, top: 300, width: 1700, height: 1300, background: 'radial-gradient(closest-side, rgba(0,113,227,0.12), rgba(0,113,227,0))' }} />
      {steps.map(([n, l, s, e]) => {
        const k = spr(t, s - 0.05, { damping: 14, stiffness: 150 }), o = prog(t, e - 0.15, 0.25, expoIn);
        return <div key={n} style={{ position: 'absolute', top: 225, width: 1080, display: 'flex', justifyContent: 'center', opacity: 1 - o, zIndex: 5, transform: `translateY(${-o * 30}px)`, filter: `blur(${o * 8}px)` }}><StepChip n={n} label={l} k={k} /></div>;
      })}
      {/* celular */}
      <AbsoluteFill style={{ perspective: 2400, transform: `translateY(${recede * -60}px) scale(${(1 - recede * 0.42) * (1 + focus * 0.1)})`, transformOrigin: `${lerp(540, ox, focus)}px ${lerp(900, oy, focus)}px`, filter: `blur(${recede * 7}px)`, opacity: 1 - recede * 0.7 }}>
        <div style={{ position: 'absolute', left: PX, top: PY, transform: `scale(${sc}) rotateY(${Math.sin(t * 0.5) * 2.5}deg) rotateX(${Math.cos(t * 0.4) * 1.5}deg)`, transformOrigin: '0 0' }}>
          <Phone w={600} h={1240}>
            <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-s1 * 100}%)`, opacity: 1 - s1 * 0.4 }}><Home press={1} pressK={t > tTabMov && t < tTabMov + 0.3 ? press : 0} /></div>
            <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - s1) * 100 - s2 * 100}%)` }}>
              <Lista t={t} chegam={chegam} hl={1} hlK={prog(t, tRow, 0.3) * (1 - prog(t, tOrg, 0.3))} filtro={filtro} filtroK={filtroK} seg={seg} segShow={prog(t, tOrg + 0.1, 0.4, expoOut)} />
            </div>
            <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - s2) * 100}%)` }}><Agenda t={t} marks={marks} /></div>
          </Phone>
        </div>
        {/* lembrete do Prumo (demonstrativo) */}
        <div style={{ position: 'absolute', left: 110, top: 410, width: 860, transform: `translateY(${(1 - aviso) * -260 - avisoOut * 200}px)`, opacity: Math.min(1, aviso * 2) * (1 - avisoOut), padding: '26px 30px', borderRadius: 40, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', display: 'flex', gap: 22, alignItems: 'center' }}>
          <AppIcon size={86} dark style={{ borderRadius: 22, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', ...text(500), fontSize: 24, color: C.ink2 }}><span>PRUMO · LEMBRETE</span><span>demonstração</span></div>
            <div style={{ ...text(600), fontSize: 36, color: C.ink, marginTop: 4 }}>Aluguel vence amanhã</div>
            <div style={{ ...text(400), fontSize: 28, color: C.ink2, marginTop: 2 }}>Compromisso do negócio</div>
          </div>
        </div>
        {fingerOp > 0 && <Touch x={gx} y={gy} press={press} opacity={fingerOp} />}
      </AbsoluteFill>
      {/* simples · clara · organizada */}
      {words.map(([w, s, ic], i) => {
        const k = spr(t, s - 0.05, { damping: 13, stiffness: 160 });
        const next = words[i + 1] ? words[i + 1][1] : FIM(4) + 0.6;
        const o = i < 2 ? prog(t, next - 0.12, 0.2, expoIn) : 0;
        const draw = prog(t, s, 0.6);
        return (
          <div key={w} style={{ position: 'absolute', top: 760, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, opacity: Math.min(1, k * 2) * (1 - o), transform: `translateY(${(1 - k) * 50 - o * 40}px) scale(${0.92 + 0.08 * k})`, filter: `blur(${o * 10}px)` }}>
            <div style={{ width: 150, height: 150, borderRadius: 42, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,113,227,0.35)' }}>
              <Icon name={ic} size={84} color="#fff" stroke={2.4} style={{ strokeDasharray: 120, strokeDashoffset: 120 * (1 - draw) }} />
            </div>
            <div style={{ ...display(700), fontSize: 150, color: C.ink, letterSpacing: '-0.045em' }}>{w}{i === 2 ? '.' : ','}</div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', top: 1500, width: 1080, display: "flex", justifyContent: "center", opacity: 1 - recede }}><DemoTag /></div>
    </LightBg>
  );
};
