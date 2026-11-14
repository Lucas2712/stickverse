// Interface original do app VÉRIA (tela lógica 390 × 844). Valores demonstrativos.
import React from "react";
import { COR, FONTE_DISPLAY, FONTE_TEXTO, Simbolo } from "../branding/Marca";
import { Icone, NomeIcone } from "./Icones";
import { caminho, curva } from "./linha";
import { clamp } from "../anim";

export const brl = (v: number, sinal = false) => {
  const s = Math.abs(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sinal ? (v < 0 ? "− " : "+ ") : ""}R$ ${s}`;
};
const num: React.CSSProperties = { fontVariantNumeric: "tabular-nums", fontFeatureSettings: "'tnum' 1" };

export const MOVIMENTOS: { nome: string; cat: string; icone: NomeIcone; valor: number; hora: string }[] = [
  { nome: "Mercado da Vila", cat: "Mercado", icone: "mercado", valor: -186.4, hora: "Hoje, 18:42" },
  { nome: "Transporte", cat: "Transporte", icone: "transporte", valor: -23.9, hora: "Hoje, 08:15" },
  { nome: "Salário", cat: "Entrada", icone: "entrada", valor: 5200, hora: "Ontem" },
  { nome: "Aluguel", cat: "Casa", icone: "casa", valor: -1450, hora: "Ontem" },
  { nome: "Cinema", cat: "Lazer", icone: "lazer", valor: -64, hora: "Sáb, 21:10" },
  { nome: "Feira", cat: "Mercado", icone: "mercado", valor: -48.5, hora: "Sáb, 09:30" },
  { nome: "Conta de luz", cat: "Casa", icone: "luz", valor: -132.7, hora: "Sex" },
  { nome: "Freela design", cat: "Entrada", icone: "entrada", valor: 1000, hora: "Qui" },
];

const SPARK = curva([[0, 30], [40, 26], [80, 32], [120, 20], [160, 24], [200, 14], [240, 18], [280, 8], [320, 10]]);

const BarraStatus: React.FC<{ escuro?: boolean }> = ({ escuro }) => {
  const c = escuro ? "#fff" : COR.profundo;
  return (
    <div style={{ height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 28px 0", color: c, fontFamily: FONTE_TEXTO, fontWeight: 600, fontSize: 15 }}>
      <span style={num}>10:30</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {[5, 8, 11, 14].map((h, i) => <div key={i} style={{ width: 3.5, height: h, borderRadius: 1, background: c }} />)}
        <div style={{ width: 25, height: 12, borderRadius: 3.5, border: `1.5px solid ${c}`, marginLeft: 6, padding: 1.5 }}><div style={{ width: "72%", height: "100%", borderRadius: 1.5, background: c }} /></div>
      </div>
    </div>
  );
};

export const Navegacao: React.FC<{ ativo: number }> = ({ ativo }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 86, background: "rgba(255,255,255,0.94)", borderTop: `1px solid ${COR.cinza}`, display: "flex", justifyContent: "space-around", paddingTop: 12 }}>
    {(["casa", "extrato", "alvo", "perfil"] as NomeIcone[]).map((n, i) => (
      <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: FONTE_TEXTO, fontSize: 11, fontWeight: 500, color: i === ativo ? COR.roxo : "#8E86A0" }}>
        <Icone nome={n} tam={26} cor={i === ativo ? COR.roxo : "#8E86A0"} corPonto={i === ativo ? COR.lavanda : "#C9C3D6"} />
        {["Início", "Extrato", "Objetivos", "Perfil"][i]}
      </div>
    ))}
  </div>
);

export const LinhaMov: React.FC<{ m: (typeof MOVIMENTOS)[number]; destaque?: number; esconderIcone?: boolean }> = ({ m, destaque = 0, esconderIcone }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 4px", borderBottom: `1px solid ${COR.cinza}`, background: destaque ? `rgba(169,135,240,${0.16 * destaque})` : undefined, borderRadius: destaque ? 14 : 0 }}>
    <div style={{ width: 44, height: 44, borderRadius: 14, background: m.valor > 0 ? "#EFE8FD" : COR.offwhite, display: "grid", placeItems: "center", border: `1px solid ${COR.cinza}` }}>
      {!esconderIcone && <Icone nome={m.icone} tam={24} cor={COR.profundo} />}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 600, fontSize: 15.5, color: COR.profundo }}>{m.nome}</div>
      <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 400, fontSize: 12.5, color: "#7C7490", marginTop: 2 }}>{m.cat} · {m.hora}</div>
    </div>
    <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 600, fontSize: 15.5, color: m.valor > 0 ? COR.roxo : COR.profundo, ...num }}>{brl(m.valor, true)}</div>
  </div>
);

// Tela inicial. saldo: valor exibido; acende: 0..1 (entrada dos blocos); faixa: progresso do sparkline
export const TelaInicio: React.FC<{ saldo: number; acende?: number; faixa?: number; cartaoY?: number }> = ({ saldo, acende = 1, faixa = 1, cartaoY = 0 }) => {
  const bloco = (i: number): React.CSSProperties => { const k = clamp(acende * 4 - i * 0.6); return { opacity: k, transform: `translateY(${(1 - k) * 24}px)` }; };
  return (
    <div style={{ width: 390, height: 844, background: COR.offwhite, position: "relative", overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(160deg, ${COR.roxo} 0%, ${COR.profundo} 70%)`, height: 378, borderRadius: "0 0 34px 34px", position: "relative", overflow: "hidden" }}>
        <BarraStatus escuro />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Simbolo largura={34} cor={COR.lavanda} traco={13} />
            <span style={{ fontFamily: FONTE_TEXTO, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.9)" }}>Olá, Ana</span>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center" }}><Icone nome="sino" tam={22} cor="#fff" /></div>
        </div>
        <div style={{ padding: "26px 24px 0", ...bloco(0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONTE_TEXTO, fontWeight: 500, fontSize: 14, color: COR.lavanda }}>Saldo disponível <Icone nome="olho" tam={18} cor={COR.lavanda} corPonto="#fff" /></div>
          <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 44, letterSpacing: -1, color: "#fff", marginTop: 6, ...num }}>{brl(saldo)}</div>
        </div>
        <svg width={390} height={80} viewBox="-20 -6 360 50" style={{ position: "absolute", left: 0, top: 214, ...bloco(1) }}>
          <defs><linearGradient id="spk" x1="0" x2="1"><stop offset="0" stopColor={COR.lavanda} stopOpacity="0.2" /><stop offset="1" stopColor={COR.lavanda} /></linearGradient></defs>
          <path d={caminho(SPARK.slice(0, Math.max(2, Math.round(SPARK.length * faixa))))} fill="none" stroke="url(#spk)" strokeWidth={3} strokeLinecap="round" />
        </svg>
        {/* cartão-herói */}
        <div style={{ position: "absolute", left: 24, right: 24, top: 300 + cartaoY, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", gap: 14, padding: "0 14px", ...bloco(1.4) }}>
          <div style={{ width: 58, height: 37, borderRadius: 7, background: `linear-gradient(135deg, ${COR.violeta}, ${COR.roxo} 60%, #3A1A7A)`, display: "grid", placeItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}><Simbolo largura={24} cor="rgba(255,255,255,0.9)" traco={14} /></div>
          <div style={{ flex: 1, fontFamily: FONTE_TEXTO }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>Cartão VÉRIA</div>
            <div style={{ fontWeight: 400, fontSize: 12, color: "rgba(255,255,255,0.65)", ...num }}>Fatura atual {brl(1236.4)}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "22px 20px 0", ...bloco(2) }}>
        <div style={{ display: "flex", gap: 12 }}>
          {[["Entradas", 6200, "entrada"], ["Saídas", 3940, "saida"]].map(([n, v, ic]) => (
            <div key={n as string} style={{ flex: 1, background: "#fff", borderRadius: 22, padding: 16, border: `1px solid ${COR.cinza}` }}>
              <Icone nome={ic as NomeIcone} tam={24} cor={COR.roxo} />
              <div style={{ fontFamily: FONTE_TEXTO, fontSize: 13, color: "#7C7490", marginTop: 8 }}>{n as string}</div>
              <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 21, color: COR.profundo, ...num }}>{brl(v as number)}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "22px 20px 0", ...bloco(2.6) }}>
        <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 18, color: COR.profundo, marginBottom: 4 }}>Movimentações</div>
        {MOVIMENTOS.slice(0, 3).map((m) => <LinhaMov key={m.nome} m={m} />)}
      </div>
      <Navegacao ativo={0} />
    </div>
  );
};

// Tela de extrato (lista que rola). rolagem em px lógicos; escondidos = índices cujos ícones já saíram
export const TelaExtrato: React.FC<{ rolagem: number; escondidos?: number[]; destaque?: number[] }> = ({ rolagem, escondidos = [], destaque = [] }) => (
  <div style={{ width: 390, height: 844, background: COR.offwhite, position: "relative", overflow: "hidden" }}>
    <BarraStatus />
    <div style={{ padding: "8px 22px 0" }}>
      <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 30, color: COR.profundo, letterSpacing: -0.5 }}>Extrato</div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {["Tudo", "Entradas", "Saídas"].map((c, i) => <div key={c} style={{ fontFamily: FONTE_TEXTO, fontSize: 13.5, fontWeight: 600, padding: "8px 14px", borderRadius: 20, background: i === 0 ? COR.profundo : "#fff", color: i === 0 ? "#fff" : COR.profundo, border: `1px solid ${COR.cinza}` }}>{c}</div>)}
      </div>
    </div>
    <div style={{ padding: "12px 18px 0", transform: `translateY(${-rolagem}px)` }}>
      {MOVIMENTOS.map((m, i) => <LinhaMov key={i} m={m} esconderIcone={escondidos.includes(i)} destaque={destaque.includes(i) ? 1 : 0} />)}
      {MOVIMENTOS.map((m, i) => <LinhaMov key={"b" + i} m={{ ...m, hora: "Semana passada" }} />)}
    </div>
    <Navegacao ativo={1} />
  </div>
);

// Tela de objetivos
export const OBJETIVOS: { nome: string; icone: NomeIcone; prog: number }[] = [
  { nome: "Viagem", icone: "viagem", prog: 0.62 },
  { nome: "Reserva", icone: "reserva", prog: 0.45 },
  { nome: "Curso", icone: "curso", prog: 0.8 },
];
export const TelaObjetivos: React.FC<{ enche: number }> = ({ enche }) => (
  <div style={{ width: 390, height: 844, background: COR.offwhite, position: "relative", overflow: "hidden" }}>
    <BarraStatus />
    <div style={{ padding: "8px 22px" }}>
      <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 30, color: COR.profundo }}>Objetivos</div>
      {OBJETIVOS.map((o, i) => {
        const pr = o.prog * clamp(enche * 3 - i * 0.5);
        return (
          <div key={o.nome} style={{ marginTop: 16, background: "#fff", borderRadius: 22, padding: 18, border: `1px solid ${COR.cinza}`, display: "flex", alignItems: "center", gap: 16 }}>
            <svg width={60} height={60} viewBox="0 0 60 60"><circle cx={30} cy={30} r={25} fill="none" stroke={COR.cinza} strokeWidth={6} /><circle cx={30} cy={30} r={25} fill="none" stroke={COR.violeta} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${pr} 2`} transform="rotate(-90 30 30)" /></svg>
            <div style={{ flex: 1, fontFamily: FONTE_TEXTO }}>
              <div style={{ fontWeight: 600, fontSize: 17, color: COR.profundo }}>{o.nome}</div>
              <div style={{ fontSize: 13, color: "#7C7490", ...num }}>{Math.round(pr * 100)}% do objetivo</div>
            </div>
            <Icone nome={o.icone} tam={26} cor={COR.roxo} />
          </div>
        );
      })}
    </div>
    <Navegacao ativo={2} />
  </div>
);
