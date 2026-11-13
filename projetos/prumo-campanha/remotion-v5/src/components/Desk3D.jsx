import React from 'react';
import { C, text, display } from '../styles/tokens';
import { prog, spr, lerp } from '../animations/motion';
import { Icon } from './Icon';
import { AppIcon } from './Brand';

// Mesa do empreendedor em 3D, desenhada em CSS (sem fotos). Plano local: 1400×1000, z para cima.
// cam = { x, y (centro observado no plano), s (escala), rx (inclinação), rz (giro) }
// st = estado: { t, caos (0..1 acúmulo), org (0..1 organizada), eventos: { clientes, vendas, pagamentos, operacao } }
const PW = 1400, PH = 1000;
const P3 = ({ x, y, z = 0, w, h, rot = 0, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transformStyle: 'preserve-3d', transform: `translateZ(${z}px) rotate(${rot}deg)`, ...style }}>{children}</div>
);
// rótulo/objeto sempre de frente para a câmera
const Billboard = ({ x, y, z = 60, cam, children, scale = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translateZ(${z}px) rotateZ(${-cam.rz}deg) rotateX(${-cam.rx}deg) scale(${scale / cam.s})` }}>
    <div style={{ position: 'absolute', transform: 'translate(-50%,-100%)' }}>{children}</div>
  </div>
);
const sh = (d = 1) => `${14 * d}px ${18 * d}px ${26 * d}px rgba(60,40,10,${0.16 + 0.04 * d})`;
const Lines = ({ n = 4, w = '80%', color = 'rgba(29,29,31,0.12)', h = 10, gap = 12 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{Array.from({ length: n }, (_, i) => <div key={i} style={{ height: h, borderRadius: h / 2, width: i === n - 1 ? '55%' : w, background: color }} />)}</div>
);
export const Paper = ({ w = 210, h = 290, lines = 6, tag }) => (
  <div style={{ width: w, height: h, background: '#FFFFFF', borderRadius: 6, padding: 22, boxSizing: 'border-box', boxShadow: sh(0.6) }}>
    <div style={{ width: '45%', height: 12, borderRadius: 6, background: 'rgba(29,29,31,0.22)', marginBottom: 18 }} />
    <Lines n={lines} h={8} gap={11} />
    {tag && <div style={{ position: 'absolute', right: 16, bottom: 16, ...text(700), fontSize: 20, color: C.red, border: `3px solid ${C.red}`, borderRadius: 8, padding: '2px 10px', transform: 'rotate(-8deg)' }}>{tag}</div>}
  </div>
);
// tela do notebook: modo caos (janelas e planilhas) ou modo Prumo (painel)
const LaptopScreen = ({ org }) => (
  <div style={{ position: 'absolute', inset: 14, borderRadius: 8, overflow: 'hidden', background: '#F5F5F7' }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - org }}>
      <div style={{ position: 'absolute', left: 16, top: 16, width: 230, height: 150, background: '#fff', borderRadius: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', padding: 12, boxSizing: 'border-box' }}>
        {Array.from({ length: 5 }, (_, r) => <div key={r} style={{ display: 'flex', gap: 4, marginBottom: 5 }}>{Array.from({ length: 5 }, (_, c) => <div key={c} style={{ flex: 1, height: 18, background: r === 0 ? '#DADADF' : '#EDEDF0' }} />)}</div>)}
      </div>
      <div style={{ position: 'absolute', left: 190, top: 100, width: 230, height: 150, background: '#fff', borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.14)', padding: 14, boxSizing: 'border-box' }}><Lines n={5} h={9} gap={10} /></div>
      <div style={{ position: 'absolute', left: 60, top: 190, width: 180, height: 70, background: '#fff', borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.14)', padding: 12, boxSizing: 'border-box' }}><Lines n={2} h={9} /></div>
    </div>
    <div style={{ position: 'absolute', inset: 0, opacity: org, background: '#F5F5F7' }}>
      <div style={{ position: 'absolute', left: 18, top: 16, display: 'flex', alignItems: 'center', gap: 8 }}><AppIcon size={30} dark style={{ borderRadius: 8 }} /><span style={{ ...display(700), fontSize: 20, color: C.ink }}>prumo</span></div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 18 + i * 140, top: 62, width: 128, height: 64, borderRadius: 12, background: i === 0 ? C.blue : '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }} />)}
      <div style={{ position: 'absolute', left: 18, top: 140, width: 260, height: 120, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'flex-end', gap: 10, padding: 14, boxSizing: 'border-box' }}>
        {[0.4, 0.65, 0.5, 0.85, 0.7].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 4, background: i === 3 ? C.blue : C.blueTint }} />)}
      </div>
      <div style={{ position: 'absolute', left: 290, top: 140, width: 140, height: 120, borderRadius: 12, background: '#fff', padding: 14, boxSizing: 'border-box' }}><Lines n={4} h={8} gap={12} /></div>
    </div>
  </div>
);
export const Desk3D = ({ cam, st }) => {
  const { t, caos = 0, org = 0, ev = {} } = st;
  const steam = (k) => Math.sin(t * 1.3 + k) * 8;
  // papéis espalhados (caos) → empilhados (organizado)
  const papers = Array.from({ length: 9 }, (_, i) => {
    const rnd = (k) => Math.sin(i * 91.7 + k * 13.1) * 0.5 + 0.5;
    const appear = i < 3 || ev.pilha === undefined ? 1 : prog(t, ev.pilha + (i - 3) * 0.28, 0.5);
    const free = { x: 140 + rnd(1) * 820, y: 520 + rnd(2) * 380, rot: (rnd(3) - 0.5) * 70 };
    const stack = { x: 120, y: 560, rot: (rnd(3) - 0.5) * 3 };
    return { i, appear: i < 3 ? 1 - 0 : appear, x: lerp(free.x, stack.x, org), y: lerp(free.y, stack.y, org) - (1 - appear) * 260, rot: lerp(free.rot, stack.rot, org), z: 1 + (org > 0.5 ? i * 2 : i * 0.6) };
  });
  const vib = ev.pagamentos && t > ev.pagamentos && t < ev.pagamentos + 0.7 ? Math.sin(t * 160) * 3 : 0;
  const receipt = ev.vendas ? prog(t, ev.vendas, 0.9) : 0;
  const calFlip = ev.operacao ? prog(t, ev.operacao, 0.45) : 0;
  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '50% 40%' }}>
      <div style={{
        position: 'absolute', left: 540, top: 960, width: 0, height: 0, transformStyle: 'preserve-3d',
        transform: `scale(${cam.s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg) translate(${-cam.x}px, ${-cam.y}px)`,
      }}>
        {/* tampo de madeira clara */}
        <div style={{
          position: 'absolute', left: -100, top: -80, width: PW + 200, height: PH + 160, borderRadius: 40,
          background: 'linear-gradient(115deg,#EFE4D2 0%,#E6D8C1 45%,#DCCBAF 100%)',
          boxShadow: '0 60px 120px rgba(60,40,10,0.25), inset 0 0 0 2px rgba(255,255,255,0.4)',
        }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 40, opacity: 0.35, background: 'repeating-linear-gradient(100deg, rgba(150,110,60,0.10) 0 2px, transparent 2px 38px), repeating-linear-gradient(97deg, rgba(150,110,60,0.06) 0 1px, transparent 1px 17px)' }} />
          {/* luz da janela */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 40, background: `radial-gradient(70% 60% at 15% 10%, rgba(255,250,235,${0.65 + 0.15 * org}), rgba(255,250,235,0) 70%)` }} />
        </div>
        {/* planta */}
        <P3 x={1180} y={60} w={150} h={150}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 75, background: '#CFC6BA', boxShadow: sh(1) }} />
          {[0, 72, 144, 216, 288].map((a, i) => <div key={i} style={{ position: 'absolute', left: 45, top: 10, width: 60, height: 70, borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', background: i % 2 ? '#7FA88A' : '#93BB9C', transformOrigin: '50% 100%', transform: `translateZ(${20 + i * 3}px) rotate(${a + Math.sin(t * 0.8 + i) * 3}deg)` }} />)}
        </P3>
        {/* caneca + vapor */}
        <P3 x={150} y={120} w={140} h={140}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 70, background: '#FFFFFF', boxShadow: sh(1.2) }} />
          <div style={{ position: 'absolute', inset: 16, borderRadius: 60, background: 'radial-gradient(circle at 40% 35%, #8A5A3C, #4A2C1A)' }} />
          <div style={{ position: 'absolute', right: -34, top: 46, width: 46, height: 46, borderRadius: 23, border: '12px solid #fff', boxSizing: 'border-box', boxShadow: sh(0.6) }} />
        </P3>
        {[0, 1, 2].map((k) => (
          <Billboard key={k} x={220 + steam(k)} y={190} z={60 + ((t * 40 + k * 40) % 120)} cam={cam}>
            <div style={{ width: 26, height: 70, borderRadius: 13, background: 'rgba(255,255,255,0.55)', filter: 'blur(9px)', opacity: 1 - ((t * 40 + k * 40) % 120) / 120 }} />
          </Billboard>
        ))}
        {/* notebook */}
        <P3 x={430} y={200} w={500} h={330}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(160deg,#E6E7EB,#C9CBD1)', boxShadow: sh(1.4) }}>
            <div style={{ position: 'absolute', left: 40, top: 30, right: 40, height: 170, borderRadius: 10, background: 'repeating-linear-gradient(90deg, #B9BBC2 0 34px, #C9CBD1 34px 38px)', opacity: 0.8 }} />
            <div style={{ position: 'absolute', left: 170, bottom: 26, width: 160, height: 90, borderRadius: 10, background: '#C2C4CA' }} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: -330, width: 500, height: 330, transformOrigin: '50% 100%', transform: 'rotateX(-102deg)', transformStyle: 'preserve-3d' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: '#1D1D1F', boxShadow: '0 0 0 3px #C9CBD1' }}><LaptopScreen org={org} /></div>
          </div>
        </P3>
        {/* celular deitado */}
        <P3 x={1000} y={330} w={170} h={340} rot={14}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 34, background: '#1D1D1F', boxShadow: sh(1), transform: `translateX(${vib}px)` }}>
            <div style={{ position: 'absolute', inset: 8, borderRadius: 27, background: org > 0.5 ? '#F5F5F7' : '#0B0B0F', overflow: 'hidden' }}>
              {org > 0.5
                ? <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', opacity: (org - 0.5) * 2 }}><AppIcon size={64} dark style={{ borderRadius: 16 }} /></div>
                : <div style={{ position: 'absolute', left: 10, right: 10, top: 40, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.18)', opacity: ev.pagamentos && t > ev.pagamentos ? 1 : 0.0 }} />}
            </div>
          </div>
        </P3>
        {/* maquininha + cupom */}
        <P3 x={960} y={720} w={120} h={190} rot={-10}>
          <div style={{ position: 'absolute', left: 14, top: -160 * receipt + 10, width: 92, height: 160 * receipt + 10, background: '#FFFFFF', boxShadow: sh(0.4), padding: receipt > 0.3 ? 10 : 0, boxSizing: 'border-box', overflow: 'hidden', opacity: org > 0.4 ? 1 - org : 1 }}><Lines n={6} h={5} gap={8} color="rgba(29,29,31,0.18)" /></div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 22, background: 'linear-gradient(160deg,#3A3A3C,#1D1D1F)', boxShadow: sh(1) }}>
            <div style={{ position: 'absolute', left: 16, top: 18, right: 16, height: 54, borderRadius: 8, background: '#5E8FD0' }} />
            <div style={{ position: 'absolute', left: 16, top: 86, right: 16, bottom: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ borderRadius: 4, background: '#4A4A4D' }} />)}</div>
          </div>
        </P3>
        {/* calculadora */}
        <P3 x={lerp(1150, 1210, org)} y={lerp(560, 640, org)} w={170} h={240} rot={lerp(8, 0, org)}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: '#F4F2EE', boxShadow: sh(1) }}>
            <div style={{ position: 'absolute', left: 16, top: 16, right: 16, height: 48, borderRadius: 6, background: '#C9D3C3' }} />
            <div style={{ position: 'absolute', left: 16, top: 78, right: 16, bottom: 16, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
              {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ borderRadius: 5, background: i % 4 === 3 ? '#E2A24A' : '#E3E0DA', transform: ev.calc && t > ev.calc && t < ev.calc + 0.9 && (Math.floor((t - ev.calc) * 12) % 16) === i ? 'scale(0.82)' : 'none' }} />)}
            </div>
          </div>
        </P3>
        {/* calendário de mesa */}
        <P3 x={300} y={700} w={190} h={170} rot={-6}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: '#fff', boxShadow: sh(1), overflow: 'hidden' }}>
            <div style={{ height: 42, background: C.blue }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, padding: 12 }}>{Array.from({ length: 10 }, (_, i) => <div key={i} style={{ height: 22, borderRadius: 4, background: i === 6 ? C.blueTint : '#F0F0F2' }} />)}</div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 190, height: 42, background: C.blue, borderRadius: '14px 14px 0 0', transformOrigin: '50% 0%', transform: `rotateX(${calFlip * 180}deg)`, opacity: calFlip > 0 && calFlip < 1 ? 1 : 0 }} />
        </P3>
        {/* papéis */}
        {papers.map((p) => (
          <P3 key={p.i} x={p.x} y={p.y} z={p.z} w={210} h={290} rot={p.rot} style={{ opacity: Math.min(1, p.appear * 1.5) }}>
            <Paper tag={!org && p.i >= 6 && caos > 0.5 ? 'vence' : null} />
          </P3>
        ))}
        {/* etiquetas presas aos objetos */}
        {[['clientes', ev.clientes, 520, 560], ['vendas', ev.vendas, 1010, 900], ['pagamentos', ev.pagamentos, 1170, 640], ['operação', ev.operacao, 390, 880]].map(([l, s, x, y]) => {
          if (!s) return null;
          const k = spr(t, s - 0.05, { damping: 13, stiffness: 160 });
          const out = st.labelsOut ? prog(t, st.labelsOut, 0.3) : 0;
          return (
            <Billboard key={l} x={x} y={y} z={30} cam={cam} scale={1.25}>
              <div style={{ ...text(600), fontSize: 50, color: C.ink, background: 'rgba(255,255,255,0.94)', padding: '14px 32px', borderRadius: 99, boxShadow: '0 12px 30px rgba(0,0,0,0.16)', whiteSpace: 'nowrap', transform: `scale(${k * (1 - out)})`, opacity: Math.min(1, k * 2) * (1 - out) }}>{l}</div>
            </Billboard>
          );
        })}
        {/* bolha de mensagem saindo do notebook (cliente) */}
        {ev.clientes && (() => {
          const k = spr(t, ev.clientes, { damping: 12, stiffness: 150 });
          const out = st.labelsOut ? prog(t, st.labelsOut, 0.3) : 0;
          return (
            <Billboard x={820} y={180} z={360} cam={cam}>
              <div style={{ width: 150, height: 86, borderRadius: 30, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `scale(${k * (1 - out)})`, boxShadow: '0 12px 30px rgba(0,113,227,0.35)' }}>
                {[0, 1, 2].map((d) => <div key={d} style={{ width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: 0.5 + 0.5 * Math.max(0, Math.sin(t * 8 - d)) }} />)}
              </div>
            </Billboard>
          );
        })()}
        {/* notificação genérica sobre o celular (pagamentos) */}
        {ev.pagamentos && (() => {
          const k = spr(t, ev.pagamentos + 0.1, { damping: 13, stiffness: 150 });
          const out = st.labelsOut ? prog(t, st.labelsOut, 0.3) : 0;
          return (
            <Billboard x={1090} y={420} z={260} cam={cam}>
              <div style={{ width: 300, padding: 18, borderRadius: 26, background: 'rgba(255,255,255,0.95)', boxShadow: '0 14px 34px rgba(0,0,0,0.18)', display: 'flex', gap: 14, alignItems: 'center', transform: `scale(${k * (1 - out)}) translateY(${(1 - k) * 30}px)`, opacity: Math.min(1, k * 2) * (1 - out) }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="in" size={30} color="#fff" /></div>
                <div style={{ flex: 1 }}><Lines n={2} h={10} gap={10} /></div>
              </div>
            </Billboard>
          );
        })()}
      </div>
    </div>
  );
};
