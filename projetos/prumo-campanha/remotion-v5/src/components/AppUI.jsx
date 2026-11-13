import React from 'react';
import { C, text, display } from '../styles/tokens';
import { Icon } from './Icon';
import { AppIcon } from './Brand';

// Interface CONCEITUAL do Prumo (marca fictícia). Só recursos definidos para o produto; valores sempre mascarados.
export const DemoTag = ({ style, dark }) => (
  <div style={{ ...text(500), fontSize: 24, letterSpacing: '0.02em', color: dark ? 'rgba(255,255,255,0.85)' : C.ink2, background: dark ? 'rgba(255,255,255,0.14)' : 'rgba(29,29,31,0.06)', padding: '8px 18px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
    <span style={{ width: 10, height: 10, borderRadius: 5, background: C.blue }} />Demonstração · dados ilustrativos
  </div>
);
export const Mask = ({ n = 3, size = 30, color = C.ink, w = 600 }) => <span style={{ ...display(700), fontSize: size, color, letterSpacing: '0.04em', fontWeight: w }}>R$ {'•'.repeat(n)}</span>;
export const TabBar = ({ active = 0, press = -1, pressK = 0 }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 128, background: 'rgba(255,255,255,0.94)', borderTop: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 18 }}>
    {[['home2', 'Início'], ['in', 'Movimentos'], ['bell', 'Agenda'], ['chart', 'Relatórios']].map(([ic, l], i) => (
      <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: i === active ? C.blue : C.ink3, transform: `scale(${i === press ? 1 - 0.12 * pressK : 1})` }}>
        <Icon name={ic} size={36} color={i === active ? C.blue : C.ink3} stroke={2.3} /><span style={{ ...text(600), fontSize: 18 }}>{l}</span>
      </div>
    ))}
  </div>
);
export const Header = ({ title, sub }) => (
  <div style={{ position: 'absolute', left: 34, right: 34, top: 92 }}>
    {sub && <div style={{ ...text(500), fontSize: 24, color: C.ink2 }}>{sub}</div>}
    <div style={{ ...display(700), fontSize: 52, color: C.ink, letterSpacing: '-0.03em' }}>{title}</div>
  </div>
);
// linha de movimentação
export const Row = ({ ic, label, cat, tipo = 'in', style, hl = 0 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', background: '#fff', borderRadius: 26, boxShadow: `0 2px 8px rgba(0,0,0,0.04), 0 0 0 ${hl * 4}px rgba(0,113,227,${0.35 * hl})`, ...style }}>
    <div style={{ width: 64, height: 64, borderRadius: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tipo === 'in' ? C.blueTint : '#F0F0F2' }}>
      <Icon name={ic} size={34} color={tipo === 'in' ? C.blue : C.ink} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ ...text(600), fontSize: 30, color: C.ink, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ ...text(500), fontSize: 22, color: C.ink2 }}>{cat}</div>
    </div>
    <div style={{ ...display(700), fontSize: 30, color: tipo === 'in' ? C.blue : C.ink, whiteSpace: 'nowrap' }}>{tipo === 'in' ? '+' : '−'} R$ •••</div>
  </div>
);
// lista padrão usada nas demonstrações (rótulos genéricos, ilustrativos)
export const ITENS = [
  { ic: 'in', label: 'Venda', cat: 'Negócio · Receita', tipo: 'in' },
  { ic: 'bag', label: 'Fornecedor', cat: 'Negócio · Despesa', tipo: 'out' },
  { ic: 'in', label: 'Serviço prestado', cat: 'Negócio · Receita', tipo: 'in' },
  { ic: 'home2', label: 'Aluguel', cat: 'Negócio · Despesa', tipo: 'out' },
  { ic: 'doc', label: 'Imposto', cat: 'Negócio · Despesa', tipo: 'out' },
  { ic: 'cart', label: 'Mercado', cat: 'Pessoal · Despesa', tipo: 'out' },
  { ic: 'in', label: 'Venda', cat: 'Negócio · Receita', tipo: 'in' },
];
// ponto de toque (dedo)
export const Touch = ({ x, y, press = 0, opacity = 1 }) => (
  <div style={{ position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 50, background: 'rgba(29,29,31,0.18)', border: '3px solid rgba(255,255,255,0.95)', boxShadow: '0 8px 22px rgba(0,0,0,0.18)', transform: `scale(${1 - press * 0.25})`, opacity, pointerEvents: 'none', zIndex: 50 }}>
    <div style={{ position: 'absolute', inset: -3 - press * 26, borderRadius: '50%', border: `3px solid rgba(0,113,227,${press * 0.6})` }} />
  </div>
);
export const StepChip = ({ n, label, k = 1, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '14px 30px 14px 14px', borderRadius: 99, background: '#fff', boxShadow: '0 12px 30px rgba(0,0,0,0.10)', transform: `scale(${0.8 + 0.2 * k})`, opacity: Math.min(1, k * 1.6), ...style }}>
    <span style={{ width: 52, height: 52, borderRadius: 26, background: C.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display(700), fontSize: 30 }}>{n}</span>
    <span style={{ ...display(600), fontSize: 40, color: C.ink }}>{label}</span>
  </div>
);
export { AppIcon };
