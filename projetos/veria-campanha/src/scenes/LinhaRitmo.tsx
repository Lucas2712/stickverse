// A LINHA DE RITMO global: um único traço que atravessa o filme e vira cada objeto.
import React from "react";
import { W, BATIDAS, CONGELA, ASSINATURA_INICIO } from "../tempos";
import { p, ease, lerp, clamp, mix } from "../anim";
import { ponto, onda, serrilhado, senoide, simbolo, morph, tracoSimbolo, circulo, Pts } from "../components/linha";
import { graficoTela } from "../components/grafico";
import { Linha2D } from "../components/Linha2D";
import { Fita3D } from "../branding/Fita3D";
import { COR, SIMBOLO } from "../branding/Marca";

// ---------- parâmetros compartilhados com as cenas ----------
export const PAN = (t: number) => Math.max(0, t - 4.3) * 360;                 // câmera lateral da cena 2
export const CRISTAS = [W.dia, W.trabalho, W.escolhas].map((tk, k) => ({ tk, x: [560, 620, 540][k] + PAN(tk) }));
export const REVELA = { cx: 540, cy: 800, L: 560 };                             // símbolo da revelação
export const CARTAO = { cx: 540, cy: 900, W: 860 };                             // cartão na cena 7
export const SIMB_NO_CARTAO = { cx: CARTAO.cx - CARTAO.W / 2 + CARTAO.W * 0.075 + (CARTAO.W * 0.2) / 2, cy: CARTAO.cy - CARTAO.W / 1.586 / 2 + (CARTAO.W / 1.586) * 0.12 + (CARTAO.W * 0.2 * (SIMBOLO.alt / SIMBOLO.larg)) / 2, L: CARTAO.W * 0.2 };
export const FINAL = { cx: 540, cy: 760, L: 430 };
export const ANEL = { cx: 540, cy: 900, r: 210 };                               // anel principal da cena 11

const ondaS2 = (t: number) => {
  const cr = CRISTAS.map((c) => ({ x: c.x - PAN(t), a: 150 * p(t, c.tk - 0.3, c.tk + 0.12, ease.out3) * (1 - 0.7 * p(t, c.tk + 0.5, c.tk + 1.6, ease.io3)), l: 70 }));
  return onda(-80, 1160, 1060, 10, 0.018, -PAN(t) * 0.018, cr);
};
const serr = (t: number, y = 960, amp = 120) => serrilhado(-40, 1120, y, amp, t);

type Estado = { pts: Pts; larg: number; corA: string; corB: string; brilho: number; alpha: number; tres?: { rx: number; ry: number; tor?: (u: number) => number; luz: number; sombra: number; cx: number; cy: number } };

export function linhaEm(t: number): Estado | null {
  // 1 · o pulso
  if (t < 4.0) {
    let r = 12;
    for (const b of BATIDAS) if (t >= b - 0.05) r = 12 + 22 * Math.exp(-(t - b) * 4.5);
    const nasce = p(t, 0.05, 0.5, ease.out3);
    return { pts: ponto(540, 900), larg: 2 * r * nasce, corA: "#FFFFFF", corB: COR.lavanda, brilho: 1, alpha: 1 };
  }
  // 1→2 · o ponto vira linha
  if (t < 4.75) {
    const k = p(t, 4.0, 4.75, ease.outExpo);
    return { pts: morph(ponto(540, 900), ondaS2(t), k, 0, ease.lin), larg: lerp(14, 6, k), corA: COR.lavanda, corB: "#FFFFFF", brilho: 0.8, alpha: 1 };
  }
  // 2 · os ritmos da vida (onda com cristas, câmera lateral)
  if (t < 8.98) {
    let pts = ondaS2(t);
    if (t > 8.55) { // tropeço: o ritmo engasga
      const g = Math.floor((t - 8.55) * 30);
      pts = pts.map(([x, y], i) => [x + (g % 2 ? 14 : -10) * (i > 120 ? 1 : 0), y + ((g * 37 + i) % 7 === 0 ? -40 : 0)]);
    }
    return { pts, larg: 6, corA: COR.lavanda, corB: "#FFFFFF", brilho: 0.7, alpha: 1 };
  }
  // 3 · fora do compasso (gagueja e quebra)
  if (t < 12.45) {
    const fase = Math.floor(t / 0.13) * 1.7;
    const amp = lerp(22, 60, p(t, 9.0, W.acompanha, ease.io3));
    const s = senoide(80, 1000, 1330, amp, 3.5, fase);
    const k = p(t, W.acompanha, W.acompanha + 0.7, ease.out3);
    return { pts: morph(s, serr(t, 1330, 80), k), larg: 7, corA: COR.roxo, corB: COR.violeta, brilho: 0, alpha: 1 };
  }
  // 4 · ruído (atrás dos objetos)
  if (t < CONGELA) {
    const k = p(t, 12.45, 13.0, ease.out3);
    return { pts: morph(serr(t, 1330, 80), serr(t, 960, 150), k), larg: 5, corA: COR.violeta, corB: COR.roxo, brilho: 0, alpha: lerp(1, 0.32, k) };
  }
  // 5 · congela → alisa → senoide → se enrola
  if (t < 24.2) {
    const congelado = serr(CONGELA, 960, 150);
    const ampS = lerp(70, 110, p(t, 23.2, 24.2, ease.in3));
    const ciclos = lerp(2.5, 4, p(t, 23.2, 24.2, ease.in3));
    const s = senoide(lerp(90, 160, p(t, 23.2, 24.2)), lerp(990, 920, p(t, 23.2, 24.2)), 960, ampS, ciclos, -(t - 21) * 2.2);
    const k = p(t, 20.9, 22.1, ease.io3);
    const cor = p(t, 20.4, 21.6, ease.io3);
    return { pts: morph(congelado, s, k, 0.25), larg: lerp(5, 8, k), corA: mix(COR.violeta, "#FFFFFF", cor), corB: mix(COR.roxo, "#FFFFFF", cor), brilho: 0.5 * cor, alpha: lerp(0.32, 1, p(t, 20.2, 21.0)) };
  }
  // 5→6 · a senoide se dobra no símbolo (fita 3D a partir daqui)
  if (t < 29.75) {
    const s = senoide(160, 920, 960, 110, 4, -(24.2 - 21) * 2.2 - (t - 24.2) * 3);
    const alvo = simbolo(REVELA.cx, REVELA.cy, REVELA.L);
    const k = p(t, 24.2, W.veria, ease.io3);
    let pts = morph(s, alvo, k, 0.4);
    let larg = lerp(8, tracoSimbolo(REVELA.L), p(t, W.veria - 0.35, W.veria + 0.2, ease.outExpo));
    // entrega ao cartão
    const e = p(t, 28.5, 29.25, ease.io3);
    if (e > 0) {
      pts = morph(alvo, simbolo(SIMB_NO_CARTAO.cx, SIMB_NO_CARTAO.cy, SIMB_NO_CARTAO.L), e);
      larg = lerp(tracoSimbolo(REVELA.L), tracoSimbolo(SIMB_NO_CARTAO.L), e);
    }
    const imp = clamp((t - W.veria) / 1.8);
    const giro = t > W.veria ? Math.exp(-(t - W.veria) * 1.5) : 0;
    const torce = t > W.veria ? Math.exp(-(t - W.veria) * 2.4) : 0;
    const cx = e > 0 ? lerp(REVELA.cx, SIMB_NO_CARTAO.cx, e) : REVELA.cx, cy = e > 0 ? lerp(REVELA.cy, SIMB_NO_CARTAO.cy, e) : REVELA.cy;
    return {
      pts: pts.map(([x, y]) => [x - cx, y - cy]) as Pts, larg, corA: COR.lavanda, corB: "#F1EAFF", brilho: 1, alpha: 1 - p(t, 29.45, 29.75, ease.lin),
      tres: { cx, cy, rx: 10 * giro * (1 - e), ry: (-34 * giro + 6 * Math.sin(t * 0.9) * (1 - giro)) * (1 - e), tor: (u) => 0.85 * torce * Math.sin(u * Math.PI * 2.0 - (t - W.veria) * 5) * (1 - e), luz: lerp(-1, 1, p(t, W.veria, W.veria + 1.6, ease.io3)) * (1 - imp * 0.3), sombra: 0.55 * (1 - e) },
    };
  }
  // 11→12 · o anel se desenrola e vira o gráfico
  if (t >= 45.95 && t < 53.4) {
    const anel = circulo(ANEL.cx, ANEL.cy, ANEL.r);
    const k = p(t, 46.15, 47.2, ease.io3);
    const pts = morph(anel, graficoTela(t), k, 0.3);
    return { pts, larg: lerp(16, 11, k), corA: lerp(0, 1, k) > 0.5 ? COR.lavanda : COR.violeta, corB: "#FFFFFF", brilho: lerp(0, 0.85, k), alpha: p(t, 45.95, 46.2, ease.lin) };
  }
  // 12→13 · a curva amolece e vira respiração; 13→14 · sobe e se fecha no V
  if (t >= 53.4 && t < 63.2) {
    const resp = senoide(60, 1020, 1600, 16 + 8 * Math.sin(t * 1.1), 2.2, t * 0.9);
    let pts = morph(graficoTela(53.4), resp, p(t, 53.4, 54.6, ease.io3), 0.2);
    let larg = lerp(11, 5, p(t, 53.4, 54.6));
    const sobe = p(t, 58.6, ASSINATURA_INICIO + 1.04, ease.io3);
    const fim = simbolo(FINAL.cx, FINAL.cy, FINAL.L);
    if (sobe > 0) { pts = morph(resp, fim, sobe, 0.22); larg = lerp(5, tracoSimbolo(FINAL.L), p(t, ASSINATURA_INICIO + 0.6, ASSINATURA_INICIO + 1.2, ease.outExpo)); }
    const pico = ASSINATURA_INICIO + 1.04;
    const giro = t > pico ? Math.exp(-(t - pico) * 1.5) : sobe;
    return {
      pts: pts.map(([x, y]) => [x - FINAL.cx, y - FINAL.cy]) as Pts, larg, corA: COR.lavanda, corB: "#F1EAFF", brilho: 0.8, alpha: 1 - p(t, 62.6, 63.2, ease.lin),
      tres: { cx: FINAL.cx, cy: FINAL.cy, rx: 8 * giro, ry: -26 * giro, tor: (u) => 0.7 * giro * Math.sin(u * Math.PI * 2 - t * 4), luz: lerp(-0.8, 0.9, p(t, pico - 0.4, pico + 1.4, ease.io3)), sombra: 0.4 * sobe },
    };
  }
  return null;
}

export const LinhaRitmo: React.FC<{ t: number }> = ({ t }) => {
  const e = linhaEm(t);
  if (!e || e.alpha <= 0.001) return null;
  if (e.tres) {
    const T3 = e.tres;
    return <Fita3D id="linha3d" pontos={e.pts.map(([x, y]) => [x, y, 0])} cx={T3.cx} cy={T3.cy} largura={e.larg} rx={T3.rx} ry={T3.ry} torcao={T3.tor} luz={T3.luz} sombra={T3.sombra} opacidade={e.alpha} corA={e.corA} corB={e.corB} />;
  }
  return <Linha2D id="linha2d" pts={e.pts} largura={e.larg} corA={e.corA} corB={e.corB} brilho={e.brilho} opacidade={e.alpha} />;
};
