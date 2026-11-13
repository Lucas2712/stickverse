import React from 'react';
import { C, display, text } from '../styles/tokens';
import { Icon } from './Icon';

// Cards 2D da rotina do empreendedor (aberturas dos atos 1 e 6). Micro-UI genérica, sem dados.
export const AREAS = [
  { k: 'clientes', ic: 'chat', label: 'Clientes' },
  { k: 'vendas', ic: 'cart', label: 'Vendas' },
  { k: 'pagamentos', ic: 'card', label: 'Pagamentos' },
  { k: 'operacao', ic: 'list', label: 'Operação' },
];
const Mini = ({ k, p = 1, t = 0 }) => {
  if (k === 'clientes') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ alignSelf: 'flex-start', width: 200 * Math.min(1, p * 1.4), height: 40, borderRadius: 20, background: '#F0F0F3' }} />
      <div style={{ alignSelf: 'flex-end', width: 150 * Math.min(1, Math.max(0, p * 1.4 - 0.3)), height: 40, borderRadius: 20, background: C.blue }} />
      <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8, padding: '12px 18px', borderRadius: 20, background: '#F0F0F3', opacity: p > 0.7 ? 1 : 0 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 11, height: 11, borderRadius: 6, background: C.ink3, opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 9 - d)) }} />)}</div>
    </div>
  );
  if (k === 'vendas') return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 130 }}>{[0.35, 0.55, 0.45, 0.8, 0.65, 0.95].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100 * Math.min(1, Math.max(0, p * 1.6 - i * 0.1))}%`, borderRadius: 8, background: i === 5 ? C.blue : C.blueTint }} />)}</div>
  );
  if (k === 'pagamentos') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[0, 1].map((i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, background: '#F5F5F7', opacity: Math.min(1, Math.max(0, p * 2 - i * 0.6)), transform: `translateY(${(1 - Math.min(1, Math.max(0, p * 2 - i * 0.6))) * 20}px)` }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: i ? '#FFE5E3' : C.blueTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={i ? 'doc' : 'in'} size={24} color={i ? C.red : C.blue} /></div>
          <div style={{ flex: 1, height: 10, borderRadius: 5, background: 'rgba(29,29,31,0.12)' }} />
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[0, 1, 2].map((i) => {
        const on = p * 3 - i > 0.6;
        return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 30, height: 30, borderRadius: 9, border: `3px solid ${on ? C.blue : C.ink3}`, background: on ? C.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <Icon name="check" size={20} color="#fff" stroke={3} />}</div><div style={{ flex: 1, height: 10, borderRadius: 5, background: 'rgba(29,29,31,0.12)' }} /></div>;
      })}
    </div>
  );
};
export const AreaCard = ({ a, p = 1, t = 0, ok = 0, w = 440, h = 360, style }) => (
  <div style={{ width: w, height: h, borderRadius: 44, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.10)', padding: 32, boxSizing: 'border-box', position: 'relative', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: C.blueTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={a.ic} size={36} color={C.blue} /></div>
      <div style={{ ...display(700), fontSize: 40, color: C.ink }}>{a.label}</div>
    </div>
    <Mini k={a.k} p={p} t={t} />
    <div style={{ position: 'absolute', right: 24, top: 24, width: 46, height: 46, borderRadius: 23, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ok})` }}><Icon name="check" size={28} color="#fff" stroke={3} /></div>
  </div>
);
// chip de tarefa/notificação genérico (o caos)
export const Chip = ({ ic = 'bell', red = false, w = 300 }) => (
  <div style={{ width: w, padding: '18px 20px', borderRadius: 26, background: '#fff', boxShadow: '0 14px 34px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: red ? '#FFE5E3' : '#F0F0F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={28} color={red ? C.red : C.ink} /></div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}><div style={{ height: 10, width: '85%', borderRadius: 5, background: 'rgba(29,29,31,0.16)' }} /><div style={{ height: 10, width: '55%', borderRadius: 5, background: 'rgba(29,29,31,0.08)' }} /></div>
    {red && <div style={{ ...text(700), fontSize: 20, color: C.red, border: `3px solid ${C.red}`, borderRadius: 8, padding: '1px 8px' }}>vence</div>}
  </div>
);
