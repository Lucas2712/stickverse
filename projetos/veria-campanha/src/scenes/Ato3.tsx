// ATO 3 · cenas 12 a 14: a evolução (clímax), do seu jeito, assinatura.
import React from "react";
import { AbsoluteFill } from "remotion";
import { W, ASSINATURA_INICIO, DURACAO } from "../tempos";
import { p, ease, lerp, mix } from "../anim";
import { COR, FONTE_TEXTO, Nome, larguraNome, Simbolo, SIMBOLO } from "../branding/Marca";
import { Desfoca, titulo } from "../components/Texto";
import { camera, paraTela, graficoTela, MESES, mundoX, CTRL } from "../components/grafico";
import { serrilhado, caminho } from "../components/linha";
import { FINAL } from "./LinhaRitmo";

// ---------------- 12 · EVOLUÇÃO ----------------
export const FundoEvolucao: React.FC<{ t: number }> = ({ t }) => {
  const entra = p(t, 46.2, 46.9, ease.io3);
  const pico = t > W.visivel ? Math.exp(-(t - W.visivel) * 1.4) : 0;
  const fantasma = p(t, W.visivel + 0.5, W.visivel + 1.2) * (1 - p(t, 52.3, 53.2));
  const c = camera(t);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #D9CBFA 0%, ${COR.lavanda} 50%, #8E68E0 100%)`, opacity: 1 - entra }} />
      <AbsoluteFill style={{ opacity: entra, background: `radial-gradient(110% 70% at 50% ${lerp(60, 45, pico)}%, ${mix(COR.violeta, "#9C74F0", pico * 0.8)} 0%, ${COR.roxo} 40%, ${COR.profundo} 100%)` }} />
      {/* grade horizontal discreta, presa ao mundo */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: entra * 0.5 }}>
        {[0, 1, 2, 3, 4].map((i) => { const y = paraTela(0, 1420 - i * 245, c)[1]; return <line key={i} x1={0} x2={1080} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />; })}
      </svg>
      {/* o caos do começo, como fantasma atrás da curva estável */}
      {fantasma > 0 && <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.22 * fantasma }}><path d={caminho(serrilhado(90, 990, 1180, 120, 17.0))} fill="none" stroke={COR.lavanda} strokeWidth={4} strokeLinejoin="round" /></svg>}
    </AbsoluteFill>
  );
};
export const FrenteEvolucao: React.FC<{ t: number }> = ({ t }) => {
  const c = camera(t);
  const pts = graficoTela(t);
  const area = p(t, W.visivel + 0.2, W.visivel + 1.2, ease.out3) * (1 - p(t, 53.0, 53.6));
  const sai = p(t, 53.0, 53.6, ease.in3);
  const viagem = 1 - p(t, W.visivel - 0.2, W.visivel + 0.4);
  // ponto que viaja pela curva (o pulso) no centro da tela
  let iC = 0; let best = 1e9; pts.forEach(([x], i) => { const d = Math.abs(x - 540); if (d < best) { best = d; iC = i; } });
  const [px, py] = pts[iC];
  const areaD = caminho(pts) + ` L${pts[pts.length - 1][0]} 1920 L${pts[0][0]} 1920 Z`;
  return (
    <AbsoluteFill style={{ opacity: 1 - sai }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={COR.lavanda} stopOpacity="0.42" /><stop offset="0.7" stopColor={COR.lavanda} stopOpacity="0" /></linearGradient></defs>
        {area > 0 && <path d={areaD} fill="url(#area)" opacity={area} />}
        {MESES.map((m, i) => {
          const [x] = paraTela(mundoX(i), 0, c);
          const [, y] = paraTela(CTRL[i][0], CTRL[i][1], c);
          if (x < -60 || x > 1140) return null;
          const a = p(t, 46.9 + i * 0.05, 47.4 + i * 0.05);
          return <g key={m} opacity={a}>
            <line x1={x} x2={x} y1={y + 26} y2={1560} stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeDasharray="4 10" />
            <circle cx={x} cy={y} r={lerp(9, 6, 1 - viagem)} fill={COR.profundo} stroke="#fff" strokeWidth={4} />
            <text x={x} y={1610} textAnchor="middle" fontFamily={FONTE_TEXTO} fontWeight={600} fontSize={lerp(34, 26, 1 - viagem)} fill="rgba(255,255,255,0.7)" letterSpacing={2}>{m}</text>
          </g>;
        })}
        {viagem > 0 && <g opacity={viagem * p(t, 47.0, 47.4)}><circle cx={px} cy={py} r={34} fill={COR.lavanda} opacity={0.25} /><circle cx={px} cy={py} r={14} fill="#fff" /></g>}
      </svg>
      <Desfoca t={t} t0={W.evolucao - 0.1} saida={W.visivel - 0.3} style={{ left: 80, top: 300, ...titulo(104, 600, "#fff") }}>sua evolução,</Desfoca>
      <Desfoca t={t} t0={W.mesames - 0.1} saida={W.visivel - 0.3} style={{ left: 84, top: 420, ...titulo(72, 500, COR.lavanda), letterSpacing: 0 }}>mês a mês,</Desfoca>
      <Desfoca t={t} t0={W.visivel - 0.05} dur={0.8} escala={1.18} saida={52.8} style={{ left: 0, right: 0, top: 330, textAlign: "center", ...titulo(178, 600, "#fff") }}>visível.</Desfoca>
    </AbsoluteFill>
  );
};

// ---------------- 13 · DO SEU JEITO ----------------
export const FundoJeito: React.FC<{ t: number }> = ({ t }) => {
  const x = 50 + Math.sin(t * 0.35) * 18, y = 45 + Math.cos(t * 0.27) * 10;
  return <AbsoluteFill style={{ background: `radial-gradient(70% 45% at ${x}% ${y}%, rgba(117,65,216,0.42) 0%, rgba(36,16,75,0) 100%), ${COR.profundo}` }} />;
};
export const FrenteJeito: React.FC<{ t: number }> = ({ t }) => {
  const sai = 58.9;
  const deriva = (t0: number) => -Math.max(0, t - t0) * 6;
  return (
    <AbsoluteFill>
      <Desfoca t={t} t0={W.pressa - 0.1} dur={1.0} saida={sai} style={{ left: 110, top: 470 + deriva(W.pressa), ...titulo(112, 500, "#fff") }}>Sem pressa.</Desfoca>
      <Desfoca t={t} t0={W.ruido - 0.1} dur={1.0} saida={sai} style={{ right: 110, top: 800 + deriva(W.ruido), textAlign: "right", ...titulo(112, 500, "#fff") }}>Sem ruído.</Desfoca>
      <Desfoca t={t} t0={W.jeito - 0.1} dur={1.1} saida={sai + 0.1} style={{ left: 0, right: 0, top: 1150 + deriva(W.jeito), textAlign: "center", ...titulo(146, 600, "#fff") }}>Do seu <span style={{ color: COR.lavanda }}>jeito.</span></Desfoca>
    </AbsoluteFill>
  );
};

// ---------------- 14 · ASSINATURA ----------------
const PICO = ASSINATURA_INICIO + 1.04;
export const FundoAssinatura: React.FC<{ t: number }> = ({ t }) => {
  const b = t > PICO ? Math.exp(-(t - PICO) * 0.9) : p(t, 59.4, PICO, ease.in3);
  const fim = p(t, DURACAO - 1.0, DURACAO, ease.in3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(90% 55% at 50% 40%, ${mix("#3A1A7A", COR.roxo, b)} 0%, ${COR.profundo} 70%, #0E0520 100%)` }} />
      <AbsoluteFill style={{ background: "#0B0418", opacity: fim * 0.85 }} />
    </AbsoluteFill>
  );
};
export const FrenteAssinatura: React.FC<{ t: number }> = ({ t }) => {
  const alt = 96, larg = larguraNome(alt);
  const plano = p(t, 62.4, 63.0, ease.io3);
  const symAlt = (FINAL.L * SIMBOLO.alt) / SIMBOLO.larg;
  const pulso = Math.exp(-Math.pow((t - 69.2) / 0.22, 2));
  const fim = p(t, DURACAO - 1.0, DURACAO, ease.in3);
  return (
    <AbsoluteFill style={{ opacity: 1 - fim * 0.9 }}>
      {plano > 0 && <div style={{ position: "absolute", left: FINAL.cx - FINAL.L / 2, top: FINAL.cy - symAlt / 2, opacity: plano, transform: `scale(${1 + pulso * 0.04})`, filter: pulso > 0.02 ? `drop-shadow(0 0 ${30 * pulso}px rgba(214,196,255,0.9))` : undefined }}><Simbolo largura={FINAL.L} cor={COR.lavanda} /></div>}
      {pulso > 0.02 && (() => { const u = (t - 69.0) / 1.2, r = 220 + u * 420; return u > 0 && u < 1 ? <div style={{ position: "absolute", left: FINAL.cx - r, top: FINAL.cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `2px solid rgba(214,196,255,${0.5 * (1 - u)})` }} /> : null; })()}
      <div style={{ position: "absolute", left: 540 - larg / 2, top: FINAL.cy + symAlt / 2 + 110 }}>
        <Nome altura={alt} cor="#fff" corAcento={COR.lavanda}
          letra={(i) => { const k = p(t, PICO - 0.1 + i * 0.06, PICO + 0.6 + i * 0.06, ease.outExpo); return { y: (1 - k) * 50, opacity: k, blur: (1 - k) * 6 }; }}
          acento={p(t, PICO + 0.6, PICO + 1.1, ease.io3)} />
      </div>
      <Desfoca t={t} t0={W.seuDinheiro - 0.05} style={{ left: 0, right: 0, top: 1265, textAlign: "center", ...titulo(66, 500, "#fff"), letterSpacing: 0 }}>Seu dinheiro.</Desfoca>
      <Desfoca t={t} t0={W.seuRitmo - 0.05} style={{ left: 0, right: 0, top: 1350, textAlign: "center", ...titulo(66, 600, COR.lavanda), letterSpacing: 0 }}>Seu ritmo.</Desfoca>
      <Desfoca t={t} t0={65.6} dur={0.9} style={{ left: 0, right: 0, top: 1488, textAlign: "center", fontFamily: FONTE_TEXTO, fontSize: 27, lineHeight: 1.55, color: "rgba(255,255,255,0.55)" }}>
        Marca fictícia · telas e valores ilustrativos<br />Campanha conceitual Studio Matteu · voz e trilha: ElevenLabs
      </Desfoca>
    </AbsoluteFill>
  );
};
