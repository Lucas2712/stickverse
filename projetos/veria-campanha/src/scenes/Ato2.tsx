// ATO 2 · cenas 6 a 11: revelação, cartão, saldo, entradas e saídas, cada gasto, objetivos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { W } from "../tempos";
import { p, ease, lerp, clamp, mix, janela } from "../anim";
import { COR, FONTE_DISPLAY, FONTE_TEXTO, Nome, larguraNome } from "../branding/Marca";
import { Desfoca, titulo } from "../components/Texto";
import { Cartao } from "../components/Cartao";
import { Celular } from "../components/Celular";
import { TelaInicio, TelaExtrato, TelaObjetivos, MOVIMENTOS, OBJETIVOS, brl } from "../components/AppUI";
import { Icone, NomeIcone } from "../components/Icones";
import { REVELA, CARTAO, ANEL } from "./LinhaRitmo";
import { FundoClaro } from "./Ato1";

const num: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

// ---------------- 6 · REVELAÇÃO ----------------
export const FundoRevela: React.FC<{ t: number }> = ({ t }) => {
  const imp = t > W.veria ? Math.exp(-(t - W.veria) * 2.2) : 0;
  const entra = p(t, 24.2, 25.0, ease.io3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #BBA0F3 0%, ${COR.lavanda} 45%, #8F68E2 100%)`, opacity: 1 - entra }} />
      <AbsoluteFill style={{ opacity: entra, background: `radial-gradient(circle at 50% 42%, ${mix(COR.violeta, "#9C74F0", imp)} 0%, ${COR.roxo} ${38 + imp * 10}%, ${COR.profundo} 100%)` }} />
      {/* onda de choque do impacto */}
      {t > W.veria && t < W.veria + 1.4 && (() => {
        const u = (t - W.veria) / 1.4, r = 60 + ease.outExpo(u) * 1000;
        return <div style={{ position: "absolute", left: REVELA.cx - r, top: REVELA.cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${3 * (1 - u) + 1}px solid rgba(214,196,255,${0.7 * (1 - u)})` }} />;
      })()}
    </AbsoluteFill>
  );
};
export const FrenteRevela: React.FC<{ t: number }> = ({ t }) => {
  const alt = 120, larg = larguraNome(alt);
  const sai = p(t, 28.55, 29.0, ease.in3);
  return (
    <AbsoluteFill style={{ opacity: 1 - sai }}>
      <div style={{ position: "absolute", left: 540 - larg / 2, top: 1180 }}>
        <Nome altura={alt} cor="#fff" corAcento={COR.lavanda}
          letra={(i) => { const k = p(t, W.veria + 0.35 + i * 0.07, W.veria + 1.0 + i * 0.07, ease.outExpo); return { y: (1 - k) * 70, x: (1 - k) * (i - 2) * 46, opacity: k, blur: (1 - k) * 8 }; }}
          acento={p(t, W.veria + 1.05, W.veria + 1.6, ease.io3)} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 7 · O CARTÃO ----------------
export const FundoCartao: React.FC<{ t: number }> = ({ t }) => {
  const bloom = p(t, W.clareza - 0.2, W.clareza + 0.6, ease.out3) * (1 - 0.4 * p(t, 33.6, 34.6));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, ${mix(COR.roxo, "#3A1A7A", 0.5)} 0%, ${COR.profundo} 55%, #0E0520 100%)` }}>
      <div style={{ position: "absolute", left: 540 - 700, top: 900 - 700, width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(circle, rgba(214,196,255,0.55) 0%, rgba(169,135,240,0.25) 30%, rgba(169,135,240,0) 65%)", opacity: bloom }} />
    </AbsoluteFill>
  );
};
export const FrenteCartao: React.FC<{ t: number }> = ({ t }) => {
  const aparece = p(t, 29.0, 29.4, ease.lin);
  const gira = p(t, 29.75, W.clareza, ease.io3);
  const mergulha = p(t, W.vai - 0.1, W.vai + 0.8, ease.in3);
  const ry = lerp(0, 360 - 16, gira) + 10 * Math.sin((t - 29.6) * 0.8) * gira;
  const rx = 4 + 8 * Math.sin((t - 29.6) * 0.6) * gira + mergulha * 62;
  const ty = mergulha * 1150, sc = 1 + 0.05 * gira - mergulha * 0.15;
  const foco = (1 - p(t, W.clareza - 0.3, W.clareza + 0.2)) * gira * 2.5;
  return (
    <AbsoluteFill style={{ perspective: 2200 }}>
      <div style={{ position: "absolute", left: CARTAO.cx - 360, top: CARTAO.cy + 330 + ty * 0.3, width: 720, height: 90, borderRadius: "50%", background: "rgba(8,2,20,0.6)", filter: "blur(40px)", opacity: aparece * (1 - mergulha) }} />
      <div style={{ position: "absolute", left: CARTAO.cx - CARTAO.W / 2, top: CARTAO.cy - CARTAO.W / 1.586 / 2, opacity: aparece, transform: `translateY(${ty}px) scale(${sc})`, transformStyle: "preserve-3d" }}>
        <Cartao largura={CARTAO.W} ry={ry} rx={rx} rz={-2 * gira} foco={foco} />
      </div>
      <Desfoca t={t} t0={W.clareza - 0.05} dur={0.7} saida={W.vai - 0.4} style={{ left: 0, right: 0, top: 1360, textAlign: "center", ...titulo(124, 600, "#fff") }}>clareza.</Desfoca>
    </AbsoluteFill>
  );
};

// ---------------- 8 · SALDO ----------------
export const FundoSaldo: React.FC<{ t: number }> = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 60% at 50% 100%, ${COR.lavanda} 0%, #4B2596 40%, ${COR.profundo} 80%)` }} />
);
export const FrenteSaldo: React.FC<{ t: number }> = ({ t }) => {
  const sobe = p(t, 34.75, 35.6, ease.outExpo);
  const encara = p(t, W.olhar - 0.5, W.olhar + 0.4, ease.io3);
  const empurra = p(t, 37.55, 38.05, ease.inExpo);
  const saldo = 4280.5 * p(t, W.saldo, W.saldo + 1.0, ease.out3);
  return (
    <AbsoluteFill style={{ perspective: 2400 }}>
      <div style={{ position: "absolute", left: 540 - 350, top: 225, transformStyle: "preserve-3d", transform: `translateY(${(1 - sobe) * 1500}px) scale(${1 + empurra * 1.5})`, transformOrigin: "50% 62%" }}>
        <Celular largura={700} rx={lerp(lerp(28, 9, sobe), 0, encara)} ry={lerp(-20, 0, encara) + Math.sin(t * 0.7) * 2} reflexo={encara - 0.5}>
          <TelaInicio saldo={saldo} acende={p(t, 35.2, 36.3, ease.lin)} faixa={p(t, 35.9, 37.0, ease.io3)} cartaoY={lerp(-260, 0, p(t, 35.0, 35.7, ease.out5))} />
        </Celular>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 9 · ENTRADAS E SAÍDAS (vista explodida) ----------------
const BARRAS_E = [0.62, 0.7, 0.66, 0.78, 0.74, 0.86];
const BARRAS_S = [0.58, 0.52, 0.6, 0.5, 0.55, 0.48];
const BlocoFluxo: React.FC<{ t: number; tit: string; ic: NomeIcone; valor: number; barras: number[]; t0: number; cor: string }> = ({ t, tit, ic, valor, barras, t0, cor }) => (
  <div style={{ width: 440, height: 720, borderRadius: 46, background: "linear-gradient(170deg,#FFFFFF 0%,#F4F0FB 100%)", boxShadow: "0 50px 90px rgba(36,16,75,0.22), inset 0 1px 0 #fff", padding: 40, display: "flex", flexDirection: "column" }}>
    <div style={{ width: 80, height: 80, borderRadius: 26, background: COR.offwhite, border: `1.5px solid ${COR.cinza}`, display: "grid", placeItems: "center" }}><Icone nome={ic} tam={44} cor={COR.roxo} /></div>
    <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 500, fontSize: 32, color: "#7C7490", marginTop: 26 }}>{tit}</div>
    <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 56, letterSpacing: -1, color: COR.profundo, marginTop: 6, opacity: p(t, t0 - 0.15, t0 + 0.2), ...num }}>{brl(valor * p(t, t0, t0 + 0.9, ease.out3))}</div>
    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 16, paddingTop: 30 }}>
      {barras.map((b, i) => <div key={i} style={{ flex: 1, height: `${b * 100 * p(t, t0 + i * 0.06, t0 + 0.6 + i * 0.06, ease.out5)}%`, borderRadius: 14, background: i === barras.length - 1 ? cor : mix(cor, "#FFFFFF", 0.55) }} />)}
    </div>
    <div style={{ display: "flex", gap: 16, marginTop: 14 }}>{["JUL", "AGO", "SET", "OUT", "NOV", "DEZ"].map((m) => <div key={m} style={{ flex: 1, textAlign: "center", fontFamily: FONTE_TEXTO, fontSize: 19, fontWeight: 500, color: "#9A93AA" }}>{m}</div>)}</div>
  </div>
);
export const FrenteFluxo: React.FC<{ t: number }> = ({ t }) => {
  const abre = p(t, 37.75, 38.5, ease.out5);
  const junta = p(t, W.saidas + 0.3, W.ladoFim, ease.io3);
  const fecha = p(t, 40.15, 40.6, ease.in3);
  const z = abre * 260 * (1 - fecha);
  return (
    <AbsoluteFill style={{ perspective: 2000 }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateX(${lerp(14, 5, junta)}deg) rotateY(${lerp(-7, 0, junta)}deg)`, opacity: (1 - fecha) * p(t, 37.8, 38.1, ease.lin) }}>
        {/* camada de fundo: a própria tela do app, ampliada */}
        <div style={{ position: "absolute", left: 540 - 390 * 1.4, top: 960 - 844 * 1.4, transform: `scale(2.8) translateZ(${-z}px)`, transformOrigin: "0 0", opacity: 0.32, filter: "blur(2px)" }}><TelaInicio saldo={4280.5} /></div>
        <div style={{ position: "absolute", left: lerp(320, 90, abre) + junta * 10, top: 560, transform: `translateZ(${z * 0.6}px) rotateY(${(1 - junta) * 8}deg)` }}><BlocoFluxo t={t} tit="Entradas" ic="entrada" valor={6200} barras={BARRAS_E} t0={W.entradas} cor={COR.lavanda} /></div>
        <div style={{ position: "absolute", left: lerp(320, 550, abre) - junta * 10, top: 560, transform: `translateZ(${z * 0.8}px) rotateY(${-(1 - junta) * 8}deg)` }}><BlocoFluxo t={t} tit="Saídas" ic="saida" valor={3940} barras={BARRAS_S} t0={W.saidas} cor={COR.roxo} /></div>
      </AbsoluteFill>
      <Desfoca t={t} t0={W.entradas - 0.1} saida={40.1} style={{ left: 80, top: 330, ...titulo(64, 600, COR.profundo) }}>Este mês</Desfoca>
    </AbsoluteFill>
  );
};

// ---------------- 10 · CADA GASTO ----------------
const CATS: { nome: string; ic: NomeIcone; total: number; de: number }[] = [
  { nome: "Mercado", ic: "mercado", total: 234.9, de: 0 },
  { nome: "Transporte", ic: "transporte", total: 23.9, de: 1 },
  { nome: "Casa", ic: "casa", total: 1582.7, de: 3 },
  { nome: "Lazer", ic: "lazer", total: 64, de: 4 },
];
const FONE = { x: 70, y: 330, w: 560 };
export const FrenteGasto: React.FC<{ t: number }> = ({ t }) => {
  const entra = p(t, 40.3, 40.9, ease.out5);
  const rolagem = 0 * p(t, 40.5, 41.4, ease.io3);
  const escala = (FONE.w - 2 * FONE.w * 0.028) / 390;
  const sai = p(t, 42.75, 43.1, ease.in3);
  const voo = (i: number) => p(t, W.lugar - 0.25 + i * 0.14, W.lugar + 0.35 + i * 0.14, ease.io3);
  return (
    <AbsoluteFill style={{ perspective: 2200, opacity: 1 - sai }}>
      <div style={{ position: "absolute", left: FONE.x, top: FONE.y, transform: `translateX(${(1 - entra) * -700}px)`, transformStyle: "preserve-3d" }}>
        <Celular largura={FONE.w} ry={16} rx={3}>
          <TelaExtrato rolagem={rolagem} escondidos={CATS.filter((_, i) => voo(i) > 0.02).map((c) => c.de)} destaque={CATS.filter((_, i) => janela(t, W.lugar - 0.35 + i * 0.14, W.lugar + 0.3 + i * 0.14, 0.1, 0.2) > 0.3).map((c) => c.de)} />
        </Celular>
      </div>
      {CATS.map((c, i) => {
        const k = p(t, 40.55 + i * 0.08, 41.05 + i * 0.08, ease.out5);
        const chegou = p(t, W.lugar + 0.3 + i * 0.14, W.lugar + 0.55 + i * 0.14, ease.outBack);
        return (
          <div key={c.nome} style={{ position: "absolute", left: 690, top: 420 + i * 270, width: 330, height: 230, borderRadius: 40, background: "rgba(255,255,255,0.78)", border: `2px solid ${mix(COR.cinza, COR.lavanda, chegou)}`, boxShadow: "0 30px 60px rgba(36,16,75,0.14)", opacity: k, transform: `translateX(${(1 - k) * 260}px) scale(${1 + 0.05 * Math.sin(chegou * Math.PI)})`, padding: 28 }}>
            <div style={{ width: 76, height: 76, borderRadius: 24, background: COR.offwhite, border: `1.5px dashed ${chegou > 0.5 ? "transparent" : "#C9C1DA"}` }} />
            <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 600, fontSize: 32, color: COR.profundo, marginTop: 18 }}>{c.nome}</div>
            <div style={{ fontFamily: FONTE_TEXTO, fontWeight: 500, fontSize: 26, color: COR.roxo, ...num, opacity: chegou }}>{brl(c.total)}</div>
          </div>
        );
      })}
      {CATS.map((c, i) => {
        const v = voo(i);
        if (v <= 0) return null;
        // origem: ícone da linha na tela do celular (aproximação com a inclinação)
        const ox = FONE.x + FONE.w * 0.028 + 44 * escala * 0.97 + 8, oy = FONE.y + FONE.w * 0.028 + (233 + c.de * 69 - rolagem) * escala;
        const dx = 690 + 28 + 38, dy = 420 + i * 270 + 28 + 38;
        const x = lerp(ox, dx, v), y = lerp(oy, dy, v) - Math.sin(v * Math.PI) * 160;
        const tam = lerp(24 * escala, 44, v);
        return <div key={"v" + i} style={{ position: "absolute", left: x - tam / 2, top: y - tam / 2, transform: `scale(${1 + Math.sin(v * Math.PI) * 0.5})`, filter: `drop-shadow(0 ${12 * Math.sin(v * Math.PI)}px 14px rgba(36,16,75,0.25))` }}><Icone nome={c.ic} tam={tam} cor={COR.profundo} /></div>;
      })}
      <Desfoca t={t} t0={W.lugar - 0.1} saida={42.7} style={{ left: 690, top: 260, ...titulo(54, 600, COR.profundo), letterSpacing: 0 }}>no lugar certo.</Desfoca>
    </AbsoluteFill>
  );
};

// ---------------- 11 · OBJETIVOS ----------------
export const FundoObjetivos: React.FC<{ t: number }> = () => (
  <AbsoluteFill style={{ background: `radial-gradient(130% 80% at 50% 30%, #D9CBFA 0%, ${COR.lavanda} 50%, #8E68E0 100%)` }} />
);
const ANEIS = [
  { ...OBJETIVOS[0], cx: ANEL.cx, cy: ANEL.cy, r: ANEL.r, prof: 1, atraso: 0 },
  { ...OBJETIVOS[1], cx: 270, cy: 1430, r: 128, prof: 0.75, atraso: 0.16 },
  { ...OBJETIVOS[2], cx: 830, cy: 470, r: 148, prof: 0.85, atraso: 0.3 },
];
export const FrenteObjetivos: React.FC<{ t: number }> = ({ t }) => {
  const entra = (a: number) => p(t, 42.95 + a, 43.7 + a, ease.out5);
  const saiOutros = p(t, 45.7, 46.25, ease.in3);
  const saiPrincipal = p(t, 46.0, 46.25, ease.lin);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 700, top: 1180, transform: "rotate(-8deg)", opacity: 0.55 * (1 - saiOutros), filter: "blur(3px)" }}>
        <Celular largura={330} sombra={0.5}><TelaObjetivos enche={p(t, W.forma - 0.2, W.forma + 1.2)} /></Celular>
      </div>
      {ANEIS.map((a, i) => {
        const k = entra(a.atraso);
        const enche = a.prog * p(t, W.forma - 0.25 + a.atraso, W.forma + 0.9 + a.atraso, ease.out3);
        const flut = Math.sin(t * 1.2 + i * 2) * 10;
        const op = k * (i === 0 ? 1 - saiPrincipal : 1 - saiOutros);
        const R = a.r;
        return (
          <div key={a.nome} style={{ position: "absolute", left: a.cx, top: a.cy + flut * (i === 0 ? 0 : 1), width: 0, height: 0, opacity: op, transform: `scale(${lerp(0.6, 1, k)})`, filter: `blur(${(1 - k) * 10}px)` }}>
            <div style={{ position: "absolute", left: -R + 20, top: -R + 20, width: 2 * R - 40, height: 2 * R - 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0.1) 100%)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.7), 0 30px 60px rgba(36,16,75,0.2)" }} />
            <svg width={2 * R + 40} height={2 * R + 40} viewBox={`${-R - 20} ${-R - 20} ${2 * R + 40} ${2 * R + 40}`} style={{ position: "absolute", left: -R - 20, top: -R - 20, overflow: "visible" }}>
              <defs><linearGradient id={`ag${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor={COR.violeta} /></linearGradient></defs>
              <circle r={R} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={R * 0.13} />
              <circle r={R} fill="none" stroke={`url(#ag${i})`} strokeWidth={R * 0.13} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0.0005, enche)} 2`} transform="rotate(-90)" />
            </svg>
            <div style={{ position: "absolute", left: -R, width: 2 * R, top: -R * 0.42, textAlign: "center" }}>
              <Icone nome={a.icone} tam={R * 0.32} cor={COR.profundo} corPonto="#fff" />
              <div style={{ ...titulo(R * 0.23, 600, COR.profundo), letterSpacing: 0, marginTop: R * 0.04 }}>{a.nome}</div>
              <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 500, fontSize: R * 0.17, color: COR.roxo, ...num }}>{Math.round(enche * 100)}%</div>
            </div>
          </div>
        );
      })}
      <Desfoca t={t} t0={W.seus - 0.1} saida={45.6} style={{ left: 80, top: 290, ...titulo(76, 600, COR.profundo) }}>Seus objetivos</Desfoca>
      <Desfoca t={t} t0={W.forma - 0.1} saida={45.6} style={{ left: 80, top: 380, ...titulo(76, 600, "#fff") }}>ganham forma.</Desfoca>
    </AbsoluteFill>
  );
};
export { clamp };
