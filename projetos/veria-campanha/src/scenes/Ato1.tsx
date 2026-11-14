// ATO 1 · cenas 1 a 5: o pulso, os ritmos da vida, fora do compasso, o ruído e o congelamento.
import React from "react";
import { AbsoluteFill } from "remotion";
import { W, BATIDAS, CONGELA } from "../tempos";
import { p, ease, lerp, clamp, mix, hash } from "../anim";
import { COR, FONTE_DISPLAY, FONTE_TEXTO } from "../branding/Marca";
import { Desfoca, titulo } from "../components/Texto";
import { Icone, NomeIcone } from "../components/Icones";
import { PAN, CRISTAS } from "./LinhaRitmo";

const num: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

// ---------------- 1 · O PULSO ----------------
export const FundoPulso: React.FC<{ t: number }> = ({ t }) => {
  const b = BATIDAS.reduce((acc, x) => (t >= x ? Math.exp(-(t - x) * 4) : acc), 0);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 47%, ${mix("#2B1358", "#3A1C70", b * 0.6)} 0%, ${COR.profundo} 42%, #10061F 100%)` }} />;
};
export const FrentePulso: React.FC<{ t: number }> = ({ t }) => {
  const cam = 1 + 0.07 * p(t, 0, 4.6, ease.ioSine);
  const sai = p(t, 4.0, 4.45, ease.in3);
  // «ritmo» nasce do ponto: letras saem do centro e se abrem
  const k = p(t, W.ritmo - 0.05, W.ritmo + 0.75, ease.outExpo);
  const letras = "ritmo".split("");
  return (
    <AbsoluteFill style={{ transform: `scale(${cam})` }}>
      {BATIDAS.map((b, i) => {
        const u = clamp((t - b) / 1.7);
        if (t < b || u >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 540, top: 900, width: 0, height: 0 }}>
          {[0, 0.22].map((d, j) => { const v = clamp(u * (1 + d) - d); const r = 30 + ease.out3(v) * 520; return v > 0 ? <div key={j} style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${3.5 - v * 2.5}px solid ${COR.lavanda}`, opacity: (1 - v) * (j ? 0.4 : 0.85), boxShadow: `0 0 ${30 * (1 - v)}px rgba(169,135,240,${0.5 * (1 - v)})` }} /> : null; })}
        </div>;
      })}
      <Desfoca t={t} t0={W.tudo - 0.1} saida={4.0} style={{ left: 0, right: 0, top: 690, textAlign: "center", ...titulo(52, 500, "rgba(214,196,255,0.85)") }}>Tudo tem um</Desfoca>
      {k > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 985, display: "flex", justifyContent: "center", opacity: (1 - sai) * Math.min(1, k * 2), filter: `blur(${(1 - k) * 10 + sai * 12}px)` }}>
          {letras.map((c, i) => (
            <span key={i} style={{ ...titulo(196, 600, "#fff"), display: "inline-block", transform: `translateX(${(1 - k) * (2 - i) * 70}px) translateY(${(1 - k) * -90 - sai * 60}px) scale(${lerp(0.3, 1, k)})` }}>{c}</span>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------- 2 · OS RITMOS DA VIDA ----------------
const PALAVRAS2 = [
  { pre: "O seu", txt: "dia.", tam: 230, prof: 1.25, y: 610, blur: 0 },
  { pre: "O seu", txt: "trabalho.", tam: 170, prof: 1.0, y: 1150, blur: 0 },
  { pre: "As suas", txt: "escolhas.", tam: 150, prof: 0.8, y: 690, blur: 0.8 },
];
export const FundoRitmos: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, 4.3, 8.9, ease.ioSine);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${mix(COR.profundo, "#3B1882", k)} 0%, ${mix("#1B0A3A", COR.roxo, k)} 100%)` }}>
      {/* profundidade: discos de luz desfocados em planos distantes */}
      {[[200, 420, 260, 0.25], [880, 1380, 340, 0.4], [620, 260, 180, 0.15], [300, 1560, 220, 0.3]].map(([x, y, r, pr], i) => (
        <div key={i} style={{ position: "absolute", left: ((x - PAN(t) * pr) % 1400 + 1400) % 1400 - 160 - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle, rgba(169,135,240,${0.16 + k * 0.08}) 0%, rgba(169,135,240,0) 70%)` }} />
      ))}
    </AbsoluteFill>
  );
};
export const FrenteRitmos: React.FC<{ t: number }> = ({ t }) => {
  const tropeco = t > 8.55 ? (Math.floor((t - 8.55) * 30) % 2 ? 12 : -9) : 0;
  return (
    <AbsoluteFill style={{ transform: `translateX(${tropeco}px)` }}>
      {PALAVRAS2.map((w, k) => {
        const c = CRISTAS[k];
        const x = c.x - PAN(t) * w.prof + PAN(c.tk) * (w.prof - 1);
        const a = p(t, c.tk - 0.28, c.tk + 0.35, ease.out5) * (1 - p(t, c.tk + 1.25, c.tk + 1.7, ease.in3));
        if (a <= 0) return null;
        return (
          <div key={k} style={{ position: "absolute", left: x, top: w.y, opacity: a, filter: `blur(${w.blur + (1 - a) * 10}px)`, transform: `translateX(-50%) translateY(${(1 - a) * 50}px)`, textAlign: "center" }}>
            <div style={{ ...titulo(w.tam * 0.27, 500, COR.lavanda), marginBottom: w.tam * 0.06, letterSpacing: 0 }}>{w.pre}</div>
            <div style={titulo(w.tam, 600, "#fff")}>{w.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------- 3 · FORA DO COMPASSO ----------------
export const FundoClaro: React.FC<{ cor?: string }> = ({ cor = COR.offwhite }) => <AbsoluteFill style={{ background: `radial-gradient(130% 90% at 50% 35%, #FFFFFF 0%, ${cor} 55%, ${COR.cinza} 100%)` }} />;
export const FrenteFora: React.FC<{ t: number }> = ({ t }) => {
  const sai = p(t, 12.15, 12.55, ease.in3);
  const snap = p(t, W.dinheiro, W.dinheiro + 0.35, ease.outBack);
  const letras = "acompanha.".split("");
  return (
    <AbsoluteFill style={{ opacity: 1 - sai, transform: `translateY(${-sai * 120}px)` }}>
      <Desfoca t={t} t0={W.mas - 0.05} style={{ left: 110, top: 520, ...titulo(58, 500, "#7C7490"), letterSpacing: 0 }}>Mas o</Desfoca>
      {t >= W.dinheiro - 0.05 && <div style={{ position: "absolute", left: 100, top: 600, ...titulo(206, 600, COR.profundo), transform: `scale(${lerp(0.86, 1, snap)})`, transformOrigin: "0 50%", opacity: Math.min(1, snap * 3) }}>dinheiro</div>}
      <Desfoca t={t} t0={W.quase - 0.05} style={{ left: 110, top: 860, ...titulo(70, 500, COR.roxo), letterSpacing: 0 }}>quase nunca</Desfoca>
      <div style={{ position: "absolute", left: 100, top: 970, display: "flex" }}>
        {letras.map((c, i) => {
          const atraso = hash(i * 3.7) * 0.62;
          const k = p(t, W.acompanha + atraso, W.acompanha + atraso + 0.42, ease.out5);
          const restoY = (hash(i + 5.3) - 0.5) * 30, restoR = (hash(i + 9.1) - 0.5) * 7;
          return <span key={i} style={{ ...titulo(164, 600, COR.profundo), display: "inline-block", opacity: k, transform: `translateY(${(1 - k) * 110 + restoY * k}px) rotate(${restoR * k}deg)`, filter: `blur(${(1 - k) * 8}px)` }}>{c}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- 4 · RUÍDO ----------------
const CONTAS: { tit: string; sub: string; val: string; ic: NomeIcone; chega: number; de: [number, number, number, number]; fim: [number, number, number] }[] = [
  { tit: "Fatura do cartão", sub: "Vence hoje · 23:59", val: "R$ 1.236,40", ic: "cartao", chega: 12.86, de: [0, 0, -2600, 0], fim: [90, 300, -5] },
  { tit: "Conta de luz", sub: "Venceu há 2 dias", val: "R$ 132,70", ic: "luz", chega: 13.24, de: [-1300, 120, 0, -24], fim: [380, 520, 7] },
  { tit: "Internet", sub: "Vence amanhã", val: "R$ 99,90", ic: "wifi", chega: 13.39, de: [1400, -200, 0, 30], fim: [60, 720, -3] },
  { tit: "Aluguel", sub: "Vence em 3 dias", val: "R$ 1.450,00", ic: "casa", chega: 13.97, de: [200, 1500, 300, 12], fim: [330, 920, 4] },
];
const RECIBO = [["Café", "8,50"], ["App de transporte", "23,90"], ["Assinatura de vídeo", "39,90"], ["Delivery", "54,00"], ["Farmácia", "62,40"], ["Lanche", "17,00"], ["Presente", "89,90"], ["Estacionamento", "18,00"], ["Assinatura de música", "21,90"], ["Taxa do app", "4,99"], ["Café", "9,00"], ["Delivery", "47,80"]];

export const CartaoConta: React.FC<{ c: (typeof CONTAS)[number] }> = ({ c }) => (
  <div style={{ width: 640, height: 152, borderRadius: 34, background: "linear-gradient(160deg,#FFFFFF 0%,#F2EEF8 100%)", boxShadow: "0 30px 60px rgba(36,16,75,0.18), 0 6px 14px rgba(36,16,75,0.10), inset 0 1px 0 #fff", display: "flex", alignItems: "center", gap: 26, padding: "0 34px" }}>
    <div style={{ width: 84, height: 84, borderRadius: 26, background: COR.offwhite, border: `1.5px solid ${COR.cinza}`, display: "grid", placeItems: "center" }}><Icone nome={c.ic} tam={44} cor={COR.profundo} /></div>
    <div style={{ flex: 1, fontFamily: FONTE_TEXTO }}>
      <div style={{ fontWeight: 600, fontSize: 34, color: COR.profundo }}>{c.tit}</div>
      <div style={{ fontWeight: 500, fontSize: 25, color: COR.roxo, marginTop: 4 }}>{c.sub}</div>
    </div>
    <div style={{ fontFamily: FONTE_DISPLAY, fontWeight: 600, fontSize: 34, color: COR.profundo, ...num }}>{c.val}</div>
  </div>
);

export const FrenteRuido: React.FC<{ t: number }> = ({ t: tReal }) => {
  const t = Math.min(tReal, CONGELA);
  const foco = p(t, W.depois - 0.1, W.depois + 0.35, ease.io3);   // o recibo entra em foco tarde
  const recua = p(t, W.objetivos - 0.3, W.objetivos + 0.5, ease.io3);
  const desenrola = p(t, W.gastos, W.gastos + 1.1, ease.out3);
  // impacto: cada chegada sacode as outras
  const sac = CONTAS.reduce((a, c) => (t > c.chega ? a + Math.exp(-(t - c.chega) * 9) * Math.sin((t - c.chega) * 60) : a), 0);
  const anelProg = 0.72 * p(t, W.objetivos, W.objetivos + 1.0, ease.out3) - 0.38 * p(t, W.mes, W.mes + 0.6, ease.out3);
  const empurra = p(t, W.mes - 0.05, W.mes + 0.55, ease.out3);
  const cal = p(t, W.mes - 0.35, W.mes + 0.1, ease.out5);
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      {/* contas */}
      <AbsoluteFill style={{ filter: `blur(${(foco * (1 - recua)) * 6 + recua * 7}px)`, transform: `scale(${1 - recua * 0.12}) translateY(${-recua * 160}px)`, opacity: 1 - recua * 0.35 }}>
        {CONTAS.map((c, i) => {
          const k = p(t, c.chega - 0.42, c.chega, ease.out3);
          if (k <= 0) return null;
          const [dx, dy, dz, dr] = c.de;
          const s = Math.sin(i * 2.1) * sac * 8;
          return <div key={i} style={{ position: "absolute", left: c.fim[0], top: c.fim[1], transform: `translate3d(${dx * (1 - k) + s}px, ${dy * (1 - k) + s * 0.5}px, ${dz * (1 - k)}px) rotate(${c.fim[2] + dr * (1 - k) + s * 0.3}deg)`, opacity: Math.min(1, k * 1.6) }}><CartaoConta c={c} /></div>;
        })}
      </AbsoluteFill>
      {/* recibo */}
      {desenrola > 0 && (
        <div style={{ position: "absolute", left: 470, top: -40, width: 520, transform: `rotate(-5deg) translateX(${recua * 380}px)`, filter: `blur(${(1 - foco) * 16 + recua * 4}px)`, opacity: 1 - recua * 0.3 }}>
          <div style={{ height: 1480 * desenrola, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 40px 80px rgba(36,16,75,0.25)", padding: "60px 44px 0", fontFamily: FONTE_TEXTO, color: COR.profundo }}>
            <div style={{ fontWeight: 600, fontSize: 30, letterSpacing: 4, textAlign: "center", marginBottom: 30 }}>COMPROVANTE</div>
            {RECIBO.map(([n, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 31, padding: "14px 0", borderBottom: "2px dashed #E1DCEA", ...num }}><span>{n}</span><span>{v}</span></div>)}
          </div>
          <svg width={520} height={22} viewBox="0 0 520 22" style={{ display: "block" }}><path d={"M0 0 " + Array.from({ length: 27 }, (_, i) => `L${i * 20 + 10} 20 L${i * 20 + 20} 0`).join(" ")} fill="#fff" /></svg>
        </div>
      )}
      {/* objetivo empurrado para o mês que vem */}
      {t > W.objetivos - 0.3 && (
        <div style={{ position: "absolute", left: 400 - empurra * 210, top: 1170, width: 0, height: 0, opacity: p(t, W.objetivos - 0.3, W.objetivos + 0.2), transform: `rotate(${-empurra * 18}deg)` }}>
          <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ position: "absolute", left: -180, top: -180, overflow: "visible" }}>
            <circle r={140} fill="#fff" stroke={COR.cinza} strokeWidth={26} />
            <circle r={140} fill="none" stroke={COR.violeta} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0.001, anelProg)} 2`} transform="rotate(-90)" />
          </svg>
          <div style={{ position: "absolute", left: -120, width: 240, top: -48, textAlign: "center" }}>
            <Icone nome="viagem" tam={46} cor={COR.profundo} />
            <div style={{ ...titulo(34, 600, COR.profundo), letterSpacing: 0 }}>Viagem</div>
          </div>
        </div>
      )}
      {cal > 0 && (
        <div style={{ position: "absolute", left: lerp(1150, 520, cal), top: 980, width: 440, height: 470, borderRadius: 36, background: "#fff", boxShadow: "0 40px 80px rgba(36,16,75,0.25)", transform: `rotate(${lerp(24, 6, cal)}deg)`, overflow: "hidden" }}>
          <div style={{ height: 120, background: COR.profundo, display: "grid", placeItems: "center", ...titulo(38, 600, "#fff"), letterSpacing: 4 }}>PRÓXIMO MÊS</div>
          <div style={{ display: "grid", placeItems: "center", height: 350, ...titulo(220, 600, COR.roxo) }}>1</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------- 5 · E SE (congelamento) ----------------
export const FundoESe: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, 20.0, 21.2, ease.io3);
  const flash = 1 - p(t, CONGELA, CONGELA + 0.35, ease.out3);
  return (
    <AbsoluteFill>
      <FundoClaro />
      <AbsoluteFill style={{ opacity: k, background: `radial-gradient(circle at 50% 50%, #BBA0F3 0%, ${COR.lavanda} 45%, #8F68E2 100%)` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.7 }} />
    </AbsoluteFill>
  );
};
export const FrenteESe: React.FC<{ t: number }> = ({ t }) => {
  const cinza = p(t, CONGELA, CONGELA + 0.3, ease.out3);
  const recua = p(t, 20.0, 22.2, ease.io3);
  const sai = p(t, 23.55, 24.1, ease.in3);
  return (
    <AbsoluteFill>
      {/* o caos suspenso: perde a cor, a câmera recua e os objetos saem do quadro */}
      <AbsoluteFill style={{ filter: `grayscale(${cinza}) contrast(${1 - cinza * 0.15}) brightness(${1 + cinza * 0.06})`, opacity: 1 - p(t, 20.3, 21.5, ease.io3), transform: `scale(${lerp(1, 0.5, recua)}) rotate(${recua * -3}deg)` }}>
        <FrenteRuido t={CONGELA} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - sai, filter: `blur(${sai * 10}px)` }}>
        <Desfoca t={t} t0={W.ese - 0.05} style={{ left: 0, right: 0, top: 420, textAlign: "center", ...titulo(66, 500, COR.profundo), letterSpacing: 0 }}>E se o seu dinheiro</Desfoca>
        <Desfoca t={t} t0={W.entrasse - 0.05} style={{ left: 0, right: 0, top: 510, textAlign: "center", ...titulo(66, 500, COR.profundo), letterSpacing: 0 }}>entrasse no seu</Desfoca>
        <Desfoca t={t} t0={W.compasso - 0.05} dur={0.7} escala={1.15} style={{ left: 0, right: 0, top: 610, textAlign: "center", ...titulo(176, 600, "#fff") }}>compasso?</Desfoca>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
