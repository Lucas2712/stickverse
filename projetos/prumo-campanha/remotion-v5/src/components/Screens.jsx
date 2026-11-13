import React from 'react';
import { C, text, display } from '../styles/tokens';
import { Icon } from './Icon';
import { AppIcon } from './Brand';
import { TabBar, Header, Row, ITENS, Mask } from './AppUI';

// Telas conceituais do app Prumo (dentro do celular 600×1240 → tela 552×1192)
export const SW = 552, SH = 1192;
export const Home = ({ press = -1, pressK = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#F5F5F7' }}>
    <div style={{ position: 'absolute', left: 34, top: 92, display: 'flex', alignItems: 'center', gap: 14 }}>
      <AppIcon size={56} dark style={{ borderRadius: 15 }} />
      <div><div style={{ ...text(500), fontSize: 22, color: C.ink2 }}>Seu negócio</div><div style={{ ...display(700), fontSize: 40, color: C.ink }}>Visão geral</div></div>
    </div>
    <div style={{ position: 'absolute', left: 34, right: 34, top: 200, display: 'flex', gap: 18 }}>
      {[['Entradas', C.blue, '#fff'], ['Saídas', '#fff', C.ink]].map(([l, bg, fg]) => (
        <div key={l} style={{ flex: 1, height: 170, borderRadius: 30, background: bg, padding: 24, boxSizing: 'border-box', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <div style={{ ...text(500), fontSize: 24, color: bg === '#fff' ? C.ink2 : 'rgba(255,255,255,0.8)' }}>{l}</div>
          <div style={{ marginTop: 34 }}><Mask size={38} color={fg} /></div>
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 34, right: 34, top: 400, height: 250, borderRadius: 30, background: '#fff', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ ...text(600), fontSize: 26, color: C.ink }}>Fluxo do mês</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 150, marginTop: 20 }}>
        {[0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.5].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 8, background: i === 5 ? C.blue : C.blueTint }} />)}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 34, right: 34, top: 680 }}>
      <div style={{ ...text(600), fontSize: 26, color: C.ink, marginBottom: 14 }}>Próximos compromissos</div>
      <Row ic="home2" label="Aluguel" cat="Negócio · vence em breve" tipo="out" style={{ marginBottom: 12 }} />
      <Row ic="doc" label="Imposto" cat="Negócio · reservado" tipo="out" />
    </div>
    <TabBar active={0} press={press} pressK={pressK} />
  </div>
);
export const Lista = ({ t, chegam = [], hl = -1, hlK = 0, filtro = null, filtroK = 0, seg = 0, segShow = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#F5F5F7' }}>
    <Header title="Movimentações" sub="Este mês" />
    {/* controle Receitas | Despesas */}
    <div style={{ position: 'absolute', left: 34, right: 34, top: 210, height: 70, borderRadius: 22, background: '#E9E9EE', opacity: segShow, transform: `translateY(${(1 - segShow) * -20}px)` }}>
      <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6 + seg * ((SW - 68 - 12) / 2), width: (SW - 68 - 12) / 2, borderRadius: 17, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
      {['Receitas', 'Despesas'].map((l, i) => <div key={l} style={{ position: 'absolute', top: 0, bottom: 0, left: i ? '50%' : 0, width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...text(600), fontSize: 26, color: (filtro === (i ? 'out' : 'in')) ? (i ? C.ink : C.blue) : C.ink2 }}>{l}</div>)}
    </div>
    <div style={{ position: 'absolute', left: 30, right: 30, top: 210 + segShow * 96 }}>
      {ITENS.map((it, i) => {
        const novo = i < chegam.length ? chegam[i] : 1;               // progresso de chegada das primeiras linhas
        const fora = filtro && it.tipo !== filtro ? filtroK : 0;
        return (
          <div key={i} style={{ height: (1 - fora) * 128 * Math.min(1, novo * 1.2), overflow: 'visible', opacity: (1 - fora) * Math.min(1, novo * 1.5), transform: `translateX(${fora * 300}px) translateY(${(1 - novo) * -40}px) scale(${0.96 + 0.04 * novo})` }}>
            <Row {...it} hl={i === hl ? hlK : 0} style={{ height: 112, boxSizing: 'border-box' }} />
          </div>
        );
      })}
    </div>
    <TabBar active={1} />
  </div>
);
export const Agenda = ({ t, marks = [0, 0, 0], hoje = 2 }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#F5F5F7' }}>
    <Header title="Agenda" sub="Compromissos" />
    <div style={{ position: 'absolute', left: 30, right: 30, top: 230, display: 'flex', justifyContent: 'space-between' }}>
      {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
        const m = [3, 4, 6].indexOf(i), mk = m >= 0 ? marks[m] : 0;
        return (
          <div key={i} style={{ width: 64, height: 112, borderRadius: 22, background: i === hoje ? C.ink : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ ...text(600), fontSize: 22, color: i === hoje ? '#fff' : C.ink2 }}>{d}</span>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.blue, transform: `scale(${mk})` }} />
          </div>
        );
      })}
    </div>
    <div style={{ position: 'absolute', left: 30, right: 30, top: 380 }}>
      {[['home2', 'Aluguel', 'Negócio · quinta'], ['bag', 'Fornecedor', 'Negócio · sexta'], ['doc', 'Imposto', 'Negócio · domingo']].map(([ic, l, c], i) => (
        <div key={l} style={{ opacity: marks[i], transform: `translateY(${(1 - marks[i]) * 30}px)`, marginBottom: 14 }}><Row ic={ic} label={l} cat={c} tipo="out" /></div>
      ))}
    </div>
    <TabBar active={2} />
  </div>
);
