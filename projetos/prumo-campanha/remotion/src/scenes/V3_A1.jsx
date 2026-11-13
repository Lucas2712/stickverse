import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, display, text } from '../styles/tokens';
import { useT } from '../animations/time';
import { prog, spr, lerp, inOut, expoOut, expoIn } from '../animations/motion';
import { kf, WHIP, GLIDE, DIVE } from '../animations/cam';
import { W, B } from '../audio/timeline';
import { World, At, Letters } from '../components/Motion';
import { Icon } from '../components/Icon';
import { Chip } from '../components/Cards2D';
import { Mask } from '../components/AppUI';

// ATO 1 · plano-sequência sobre um canvas: título → chicotes entre as 4 frentes → revelação do todo → inundação → mergulho
const PW = 1000, PH = 1480;
export const POS1 = { T: [0, -2700], C: [-560, -800], V: [560, -800], P: [-560, 800], O: [560, 800] };
const rnd = (i, k) => Math.sin(i * 127.1 + k * 311.7) * 0.5 + 0.5;
const Panel = ({ children, tint = '#fff' }) => (
  <div style={{ width: PW, height: PH, borderRadius: 90, background: tint, boxShadow: '0 40px 120px rgba(20,30,60,0.14), inset 0 0 0 2px rgba(255,255,255,0.8)', position: 'relative', overflow: 'hidden', padding: 80, boxSizing: 'border-box' }}>{children}</div>
);
const Head = ({ t, s, ic, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
    <div style={{ width: 130, height: 130, borderRadius: 38, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${spr(t, s - 0.1, { damping: 11, stiffness: 200 })}) rotate(${(1 - spr(t, s - 0.1)) * -40}deg)` }}><Icon name={ic} size={74} color="#fff" stroke={2.4} /></div>
    <Letters t={t} s={s} text={label} size={128} />
  </div>
);
export const Clientes = ({ t, s }) => (
  <Panel>
    <Head t={t} s={s} ic="chat" label="clientes" />
    <div style={{ marginTop: 90, display: 'flex', flexDirection: 'column', gap: 34 }}>
      {[[0, 640, 'l'], [0.12, 520, 'r'], [0.24, 700, 'l'], [0.36, 420, 'r']].map(([d, w, side], i) => {
        const k = spr(t, s + d, { damping: 13, stiffness: 190 });
        return (
          <div key={i} style={{ alignSelf: side === 'l' ? 'flex-start' : 'flex-end', display: 'flex', alignItems: 'flex-end', gap: 18, flexDirection: side === 'l' ? 'row' : 'row-reverse', transform: `scale(${k}) translateY(${(1 - k) * 60}px)`, transformOrigin: side === 'l' ? '0% 100%' : '100% 100%', opacity: Math.min(1, k * 2) }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: side === 'l' ? '#E3E6EC' : C.blueTint, flexShrink: 0 }} />
            <div style={{ width: w, padding: '34px 40px', borderRadius: 46, background: side === 'l' ? '#F0F1F4' : C.blue, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ height: 20, width: '88%', borderRadius: 10, background: side === 'l' ? 'rgba(29,29,31,0.18)' : 'rgba(255,255,255,0.75)' }} />
              <div style={{ height: 20, width: '55%', borderRadius: 10, background: side === 'l' ? 'rgba(29,29,31,0.10)' : 'rgba(255,255,255,0.45)' }} />
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 14, padding: '30px 38px', borderRadius: 40, background: '#F0F1F4', alignSelf: 'flex-start', opacity: prog(t, s + 0.45, 0.2) }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 22, height: 22, borderRadius: 11, background: C.ink3, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - d)) }} />)}</div>
    </div>
  </Panel>
);
export const Vendas = ({ t, s }) => (
  <Panel>
    <Head t={t} s={s} ic="cart" label="vendas" />
    <div style={{ position: 'absolute', left: 80, right: 80, bottom: 120, height: 820, display: 'flex', alignItems: 'flex-end', gap: 30 }}>
      {[0.32, 0.48, 0.4, 0.66, 0.58, 0.9].map((h, i) => { const k = spr(t, s + 0.05 + i * 0.07, { damping: 12, stiffness: 160 }); return <div key={i} style={{ flex: 1, height: `${h * 100 * k}%`, borderRadius: 26, background: i === 5 ? 'linear-gradient(180deg,#2997FF,#0058B8)' : C.blueTint }} />; })}
    </div>
    <svg width={PW} height={PH} style={{ position: 'absolute', inset: 0 }}><path d="M120 1180 L260 1060 L400 1110 L540 900 L680 960 L860 640" fill="none" stroke={C.ink} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - prog(t, s + 0.3, 0.9, inOut))} /><circle cx="860" cy="640" r={22 * spr(t, s + 1.0)} fill={C.ink} /></svg>
  </Panel>
);
export const Pagamentos = ({ t, s }) => {
  const flip = spr(t, s - 0.05, { damping: 14, stiffness: 120 });
  return (
    <Panel>
      <Head t={t} s={s} ic="card" label="pagamentos" />
      <div style={{ perspective: 1600, marginTop: 90, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 760, height: 470, borderRadius: 50, background: 'linear-gradient(135deg,#1D1D1F,#3A3A3F)', transform: `rotateY(${(1 - flip) * 180}deg) rotateX(${(1 - flip) * 20}deg)`, boxShadow: '0 40px 80px rgba(0,0,0,0.25)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 60, top: 70, width: 110, height: 84, borderRadius: 16, background: 'linear-gradient(135deg,#D9C27A,#B39A50)' }} />
          {[0, 1, 2].map((r) => <div key={r} style={{ position: 'absolute', right: 70 - r * 24, top: 70 - r * 24 + 20, width: 60 + r * 48, height: 60 + r * 48, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.7)', clipPath: 'inset(0 0 0 50%)', opacity: Math.max(0, Math.sin(t * 5 - r)) }} />)}
          <div style={{ position: 'absolute', left: 60, bottom: 70, display: 'flex', gap: 22 }}>{[0, 1, 2, 3].map((g) => <div key={g} style={{ width: 110, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.35)' }} />)}</div>
        </div>
      </div>
      {[0, 1].map((i) => { const k = spr(t, s + 0.45 + i * 0.25, { damping: 14, stiffness: 180 }); return (
        <div key={i} style={{ marginTop: i ? 24 : 70, display: 'flex', alignItems: 'center', gap: 26, padding: 30, borderRadius: 40, background: '#F5F5F7', transform: `translateX(${(1 - k) * 600}px)`, opacity: Math.min(1, k * 2) }}>
          <div style={{ width: 90, height: 90, borderRadius: 26, background: i ? '#FFE5E3' : C.blueTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={i ? 'doc' : 'in'} size={52} color={i ? C.red : C.blue} /></div>
          <div style={{ flex: 1, height: 22, borderRadius: 11, background: 'rgba(29,29,31,0.14)' }} /><Mask size={46} color={i ? C.ink : C.blue} />
        </div>); })}
    </Panel>
  );
};
export const Operacao = ({ t, s }) => (
  <Panel>
    <Head t={t} s={s} ic="list" label="operação" />
    <div style={{ marginTop: 90, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = spr(t, s + 0.15 + i * 0.16, { damping: 12, stiffness: 220 });
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
            <div style={{ width: 92, height: 92, borderRadius: 28, border: `7px solid ${on > 0.5 ? C.blue : C.ink3}`, background: on > 0.5 ? C.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * on})` }}>{on > 0.5 && <Icon name="check" size={58} color="#fff" stroke={3.2} />}</div>
            <div style={{ flex: 1, height: 26, borderRadius: 13, background: 'rgba(29,29,31,0.12)', position: 'relative', overflow: 'hidden' }}><div style={{ position: 'absolute', inset: 0, width: `${on * 100}%`, background: 'rgba(0,113,227,0.25)' }} /></div>
          </div>
        );
      })}
    </div>
  </Panel>
);
export const V3_A1 = ({ a }) => {
  const t = useT(a);
  const tE = W(1, 'Empreender'), tCoisa = W(1, 'coisa'), tCli = W(1, 'clientes'), tVen = W(1, 'vendas'), tPag = W(1, 'pagamentos'), tOp = W(1, 'operação');
  const tMas = W(1, 'Mas'), tResp = W(1, 'responsabilidades'), tFin = W(1, 'finanças'), tOrg = W(1, 'organizadas'), tTam = W(1, 'também'), tGr = W(1, 'grande');
  const wp = 0.36;                                           // duração do chicote
  const { T, C: Cc, V, P, O } = POS1;
  const keys = [
    [0, { x: T[0], y: T[1], s: 1.7, rx: 0, rz: 0 }, expoOut],
    [tCoisa + 0.4, { x: T[0], y: T[1] + 40, s: 1.0, rx: 0, rz: 0 }],
    [tCli - wp, { x: T[0], y: T[1] + 60, s: 1.0, rx: 0, rz: 0 }, WHIP],
    [tCli, { x: Cc[0], y: Cc[1], s: 1.02, rx: 0, rz: -1.5 }],
    [tVen - wp, { x: Cc[0] + 20, y: Cc[1] + 30, s: 1.06, rx: 0, rz: -1.5 }, WHIP],
    [tVen, { x: V[0], y: V[1], s: 1.02, rx: 0, rz: 1.5 }],
    [tPag - wp, { x: V[0] - 10, y: V[1] + 25, s: 1.05, rx: 0, rz: 1.5 }, WHIP],
    [tPag, { x: P[0], y: P[1], s: 1.02, rx: 0, rz: -1 }],
    [tOp - wp, { x: P[0] + 20, y: P[1] + 20, s: 1.06, rx: 0, rz: -1 }, WHIP],
    [tOp, { x: O[0], y: O[1], s: 1.02, rx: 0, rz: 1 }],
    [tMas - 0.15, { x: O[0] - 10, y: O[1] + 20, s: 1.06, rx: 0, rz: 1 }, inOut],
    [tMas + 0.9, { x: 0, y: 0, s: 0.5, rx: 20, rz: -7 }],
    [tGr - 0.75, { x: 0, y: 40, s: 0.58, rx: 22, rz: -9 }, DIVE],
    [tGr + 0.35, { x: 0, y: 0, s: 7.5, rx: 0, rz: -4 }],
  ];
  const fin = spr(t, tFin - 0.05, { damping: 13, stiffness: 150 });
  const fAlign = spr(t, tOrg, { damping: 10, stiffness: 220 });
  const hit = t > tTam ? Math.sin((t - tTam) * 38) * 26 * Math.exp(-(t - tTam) * 5) : 0;
  const white = prog(t, tGr - 0.15, 0.5, expoIn);
  const titleOut = prog(t, tCli - wp - 0.05, 0.25, expoIn);
  return (
    <AbsoluteFill style={{ background: '#ECEEF2' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(80% 50% at 30% 10%, #FFFFFF, rgba(255,255,255,0) 70%)' }} />
      <World t={t} keys={keys} id="mb-a1">
        {/* título em seu próprio lugar no canvas */}
        {['chat', 'cart', 'card', 'list', 'bell', 'doc', 'in', 'grid'].map((ic, i) => {
          const k = spr(t, W(1, 'muita') - 0.1 + i * 0.07, { damping: 13, stiffness: 160 });
          const ang = (i / 8) * Math.PI * 2 + t * 0.9, R = 520 + (i % 2) * 120;
          return <At key={ic} x={T[0] + Math.cos(ang) * R * k} y={T[1] + 60 + Math.sin(ang) * R * 1.25 * k} z={(i % 3) * 60} w={150} h={150} s={k} style={{ opacity: Math.min(1, k * 2) * (1 - titleOut) }}><div style={{ width: 150, height: 150, borderRadius: 44, background: i % 3 ? '#fff' : C.blue, boxShadow: '0 20px 50px rgba(20,30,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={78} color={i % 3 ? C.ink : '#fff'} /></div></At>;
        })}
        <At x={T[0]} y={T[1] + 60} w={1100} h={360}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - titleOut }}>
            <Letters t={t} s={Math.max(0, tE - 0.22)} text="Empreender" size={190} stagger={0.03} />
            <div style={{ display: 'flex', gap: 22, marginTop: 6 }}>
              {['já', 'exige', 'muita', 'coisa.'].map((w, i) => { const s = W(1, w); const k = spr(t, s - 0.04, { damping: 14, stiffness: 200 }); return <span key={w} style={{ ...display(i > 1 ? 700 : 500), fontSize: 78, color: i > 1 ? C.blue : C.ink2, transform: `translateY(${(1 - k) * 70}px) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 2) }}>{w}</span>; })}
            </div>
          </div>
        </At>
        {/* as quatro frentes */}
        <At x={Cc[0]} y={Cc[1]} w={PW} h={PH}><Clientes t={t} s={tCli - 0.32} /></At>
        <At x={V[0]} y={V[1]} w={PW} h={PH}><Vendas t={t} s={tVen - 0.32} /></At>
        <At x={P[0]} y={P[1]} w={PW} h={PH}><Pagamentos t={t} s={tPag - 0.32} /></At>
        <At x={O[0]} y={O[1]} w={PW} h={PH}><Operacao t={t} s={tOp - 0.32} /></At>
        {/* inundação de tarefas e cobranças, em perspectiva */}
        {Array.from({ length: 12 }, (_, i) => {
          const s = tMas + 0.35 + Math.pow(i / 12, 0.75) * (tGr - tMas - 0.9);
          const k = spr(t, B(s, 0.08), { damping: 15, stiffness: 170 });
          const fromAng = rnd(i, 1) * Math.PI * 2;
          const x = lerp(Math.cos(fromAng) * 3200, (rnd(i, 2) - 0.5) * 2300, k), y = lerp(Math.sin(fromAng) * 3800, (rnd(i, 3) - 0.5) * 3200, k);
          const red = i % 3 === 1;
          return <At key={i} x={x} y={y} z={40 + rnd(i, 4) * 260} w={620} h={150} rot={(rnd(i, 5) - 0.5) * 70} s={1.6} style={{ opacity: Math.min(1, k * 2) }}><Chip ic={red ? 'doc' : ['bell', 'chat', 'in', 'cart', 'list'][i % 5]} red={red} w={620} /></At>;
        })}
        {/* «finanças» tenta se alinhar e é atropelada */}
        <At x={hit} y={0} z={320} w={1300} h={620} rot={(1 - fAlign) * -14 + hit * 0.4} s={0.6 + 0.4 * fin} style={{ opacity: Math.min(1, fin * 2) }}>
          <div style={{ width: 1300, height: 620, borderRadius: 90, background: '#fff', border: `10px solid ${C.blue}`, boxSizing: 'border-box', padding: 80, boxShadow: '0 60px 140px rgba(0,60,140,0.25)' }}>
            <div style={{ ...display(700), fontSize: 150, color: C.ink, lineHeight: 1 }}>finanças</div>
            <div style={{ display: 'flex', gap: 70, marginTop: 60 }}>{['Entradas', 'Saídas', 'A pagar'].map((l) => <div key={l}><div style={{ ...text(500), fontSize: 50, color: C.ink2 }}>{l}</div><Mask size={80} /></div>)}</div>
          </div>
        </At>
      </World>
      {/* mergulho termina em branco: «um grande desafio.» */}
      <AbsoluteFill style={{ background: '#F4F5F7', opacity: white }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${1 + Math.max(0, t - tGr) * 0.16}) rotate(${Math.max(0, t - tGr) * -2.5}deg)`, filter: `blur(${Math.max(0, t - W(2, 'Quando') + 0.3) * 30}px)` }}>
          <Letters t={t} s={W(1, 'um')} text="um" size={80} weight={500} color={C.ink2} />
          <Letters t={t} s={tGr} text="grande" size={210} stagger={0.03} />
          <Letters t={t} s={W(1, 'desafio')} text="desafio." size={210} stagger={0.03} color={C.blue} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
