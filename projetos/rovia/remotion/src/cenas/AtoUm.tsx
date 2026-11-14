// Cenas 1–4: abertura no escuro · card de gastos · mesa noturna · celular com a estrada
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, display, texto, p, k, useT, outExpo, inExpo, out3, in3, outBack, inOut3, inOutSine, brl, rnd } from "../lib";
import { quadMatrix } from "../quad";
import { FundoNevoa, Rolo, Pilula, VidroClaro, FiltroChicote, Celular, RoviaIcone, RoviaNome, Grao } from "../ui";

// imagens 1536×2752 exibidas com 1080 de largura
const ESC = 1080 / 1536;
const IMG_H = 2752 * ESC; // 1935
const OFF_Y = (1920 - IMG_H) / 2;
const sc = (x: number, y: number): [number, number] => [x * ESC, y * ESC + OFF_Y];

// ============ CENA 1 · notebook no escuro (0 – 1,85) ============
const TELA1: [[number, number], [number, number], [number, number], [number, number]] = [sc(225, 1084), sc(943, 1004), sc(998, 1662), sc(306, 1654)];
const C1_CENTRO = sc(618, 1350);

export const Cena1: React.FC = () => {
  const t = useT();
  const palavras: [string, number][] = [["Dois", 0.4], ["mil", 0.78], ["no", 0.95], ["mês…", 1.06]];
  const acende = p(t, 0, 0.3, out3);
  // deriva leve e depois mergulho na tela
  const deriva = k(t, 0, 1.4, 1.0, 1.035, inOutSine);
  const mergulho = k(t, 1.38, 1.92, 1, 6.2, in3);
  const s = deriva * mergulho;
  const branco = p(t, 1.62, 1.9, in3);
  const [cx, cy] = C1_CENTRO;
  return (
    <AbsoluteFill style={{ background: "#020405", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s}) translateX(${k(t, 0, 1.4, 6, -6)}px)` }}>
        <Img src={staticFile("img/quarto.png")} style={{ position: "absolute", left: 0, top: OFF_Y, width: 1080, height: IMG_H, filter: `brightness(${0.55 + 0.45 * acende})` }} />
        {/* tela: texto da narração escrito na tela, como na referência */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 420, transformOrigin: "0 0", transform: quadMatrix(600, 420, TELA1),
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...texto(500, 30), color: "#2A2622", display: "flex", gap: 8 }}>
            {palavras.map(([w, at]) => (
              <span key={w} style={{ opacity: p(t, at, at + 0.12) }}>{w}</span>
            ))}
          </div>
          {/* barrinha de player discreta */}
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.08)" }}>
            <div style={{ width: `${k(t, 0, 1.9, 4, 30)}%`, height: "100%", borderRadius: 2, background: C.turq, opacity: 0.6 }} />
          </div>
        </div>
      </AbsoluteFill>
      {/* vinheta + grão de filmagem */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 55% at 50% 60%, transparent 40%, rgba(0,0,0,0.55))" }} />
      <Grao opacity={0.09} />
      <AbsoluteFill style={{ background: C.nevoa, opacity: branco }} />
    </AbsoluteFill>
  );
};

// ============ CENA 2 · card de gastos → «quanto CUSTOU?» (1,85 – 4,27) ============
export const Cena2: React.FC = () => {
  const t = useT();
  const foco = p(t, 1.85, 2.45, outExpo);
  const valor = k(t, 2.15, 3.05, 0, 2000, out3);
  const saiCard = p(t, 3.12, 3.38, inExpo);
  const entraFrase = p(t, 3.2, 3.55, outExpo);
  const saiFrase = p(t, 3.98, 4.27, inExpo);
  const bump = 1 + 0.14 * (1 - p(t, 3.5, 3.8, outBack)) * (t >= 3.5 ? 1 : 0);
  const deriva = k(t, 1.85, 4.27, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoNevoa deriva={deriva} />
      <FiltroChicote id="c2card" x={saiCard * 60} />
      <FiltroChicote id="c2frase" x={(1 - entraFrase) * 40 + saiFrase * 70} />
      {/* card */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - p(t, 3.3, 3.4) }}>
        <div style={{ transform: `translateX(${-1400 * saiCard}px) scale(${(0.9 + 0.1 * foco) * k(t, 2.4, 4, 1, 1.03)})`, filter: `blur(${(1 - foco) * 26}px) url(#c2card)`, opacity: 0.2 + 0.8 * foco }}>
          <VidroClaro style={{ width: 780, padding: "44px 50px 46px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...texto(600, 30), color: C.tinta2 }}>Gastos do mês</span>
              <span style={{ ...texto(600, 22), color: C.turqEscuro, background: "rgba(19,184,166,0.12)", padding: "8px 16px", borderRadius: 999 }}>novembro</span>
            </div>
            <div style={{ ...display(700, 112), color: C.tinta, marginTop: 18, display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ fontSize: 56, fontWeight: 600, color: C.tinta2 }}>R$</span>
              <Rolo valor={valor} molde="0.000,00" />
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#E3EBEA", marginTop: 26, overflow: "hidden" }}>
              <div style={{ width: `${(valor / 2000) * 78}%`, height: "100%", background: `linear-gradient(90deg, ${C.turq}, ${C.turqClaro})`, borderRadius: 5 }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              <Pilula>Abastecer</Pilula>
              <Pilula>Gastos</Pilula>
            </div>
          </VidroClaro>
        </div>
      </AbsoluteFill>
      {/* frase */}
      {t >= 3.2 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", transform: `translateX(${(1 - entraFrase) * 700 - saiFrase * 1500}px)`, filter: "url(#c2frase)" }}>
            <div style={{ ...display(500, 92), color: C.tinta }}>quanto</div>
            <div style={{ ...display(800, 168), color: C.tinta, letterSpacing: "-0.045em", opacity: p(t, 3.48, 3.56), transform: `scale(${bump})` }}>CUSTOU?</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ CENA 3 · mesa noturna (4,27 – 7,0) ============
const TELA3 = { x: 506 * ESC + 4, y: 1540 * ESC + OFF_Y + 3, w: (1090 - 506) * ESC - 8, h: (1914 - 1540) * ESC - 6 };

const PainelMesa: React.FC<{ t: number }> = ({ t }) => {
  // interface ROVIA (desktop) desenhada a 2× e reduzida
  const pop = (at: number) => ({ o: p(t, at, at + 0.12), s: 0.85 + 0.15 * p(t, at, at + 0.35, outBack) });
  const posto = pop(4.97), oficina = pop(5.48), planilha = pop(6.15);
  const W2 = TELA3.w * 2, H2 = TELA3.h * 2;
  return (
    <div style={{ width: W2, height: H2, transform: "scale(0.5)", transformOrigin: "0 0", background: "linear-gradient(180deg,#0E181B,#0A1214)", position: "relative", overflow: "hidden" }}>
      {/* barra lateral */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 92, background: "#0C1517", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26, gap: 26 }}>
        <RoviaIcone size={46} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 34, height: 8, borderRadius: 4, background: i === 0 ? C.turq : "rgba(255,255,255,0.12)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 124, top: 30, ...texto(600, 26), color: "#fff" }}>Gastos · novembro</div>
      <div style={{ position: "absolute", left: 124, top: 70, ...display(700, 54), color: "#fff" }}>R$ 2.000,00</div>
      <div style={{ position: "absolute", right: 30, top: 34, ...texto(600, 18), color: C.turqClaro, background: "rgba(19,184,166,0.14)", padding: "8px 14px", borderRadius: 999 }}>R$ 0,74 / km</div>
      {/* card posto */}
      <div style={{ position: "absolute", left: 124, top: 160, width: 300, opacity: posto.o, transform: `scale(${posto.s})`, transformOrigin: "left top" }}>
        <CardMini titulo="Posto" sub="Abastecimento · 42 L" valor="R$ 260,00" cor={C.turqClaro} />
      </div>
      <div style={{ position: "absolute", left: 124, top: 330, width: 300, opacity: oficina.o, transform: `scale(${oficina.s})`, transformOrigin: "left top" }}>
        <CardMini titulo="Oficina" sub="Revisão + pastilhas" valor="R$ 340,00" cor={C.coral} />
      </div>
      {/* planilha */}
      <div style={{ position: "absolute", left: 452, top: 160, width: W2 - 452 - 30, height: 330, opacity: planilha.o, transform: `scale(${planilha.s})`, transformOrigin: "left top", background: "#F4F6F5", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ height: 34, background: "#DCE5E3", ...texto(600, 16), color: C.tinta2, display: "flex", alignItems: "center", paddingLeft: 14 }}>gastos_carro_FINAL(3).xlsx</div>
        {Array.from({ length: 8 }).map((_, r) => (
          <div key={r} style={{ display: "flex", height: 36, borderBottom: "1px solid #DDE3E2" }}>
            {[0, 1, 2].map((c) => (
              <div key={c} style={{ flex: c === 0 ? 1.4 : 1, borderRight: "1px solid #DDE3E2", padding: "8px 10px" }}>
                <div style={{ height: 10, width: `${40 + rnd(r * 7 + c) * 50}%`, borderRadius: 3, background: c === 2 && r % 3 === 1 ? C.coral : "#BCC7C5" }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* reflexo de tela */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.06), transparent 40%)" }} />
    </div>
  );
};

const CardMini: React.FC<{ titulo: string; sub: string; valor: string; cor: string }> = ({ titulo, sub, valor, cor }) => (
  <div style={{ background: "#16242A", borderRadius: 16, padding: "18px 20px", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: cor }} />
      <span style={{ ...texto(600, 20), color: "#fff" }}>{titulo}</span>
    </div>
    <div style={{ ...texto(500, 16), color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{sub}</div>
    <div style={{ ...display(700, 34), color: cor, marginTop: 14 }}>{valor}</div>
  </div>
);

export const Cena3: React.FC = () => {
  const t = useT();
  const foco = p(t, 4.27, 4.95, outExpo);
  const s = k(t, 4.27, 7.0, 1.08, 1.17, inOutSine);
  const cx = TELA3.x + TELA3.w / 2, cy = TELA3.y + TELA3.h / 2;
  const clareia = p(t, 6.62, 7.0, in3);
  const postit = p(t, 6.3, 6.6, outBack);
  return (
    <AbsoluteFill style={{ background: "#120C08", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy - 120}px`, transform: `scale(${s})`, filter: `blur(${(1 - foco) * 18 + clareia * 14}px)` }}>
        <Img src={staticFile("img/mesa.png")} style={{ position: "absolute", left: 0, top: OFF_Y, width: 1080, height: IMG_H }} />
        <div style={{ position: "absolute", left: TELA3.x, top: TELA3.y, width: TELA3.w, height: TELA3.h, overflow: "hidden", borderRadius: 3, opacity: p(t, 4.35, 4.7) }}>
          <PainelMesa t={t} />
        </div>
        {/* brilho da tela na mesa */}
        <div style={{ position: "absolute", left: TELA3.x - 120, top: TELA3.y - 60, width: TELA3.w + 240, height: TELA3.h + 260, background: "radial-gradient(closest-side, rgba(63,217,198,0.16), transparent)", mixBlendMode: "screen", opacity: p(t, 4.5, 5.2) }} />
        {/* post-it colado na borda da tela */}
        <div style={{ position: "absolute", left: TELA3.x + TELA3.w - 70, top: TELA3.y - 14, width: 92, height: 88, background: `linear-gradient(160deg, ${C.postit}, #F2C230)`, boxShadow: "0 6px 10px rgba(0,0,0,0.35)",
          transform: `rotate(${6 - 4 * postit}deg) scale(${postit})`, transformOrigin: "top left", padding: 10, ...texto(600, 13), color: "#5A4500", lineHeight: 1.25 }}>
          IPVA<br />vence dia 20!
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(90% 70% at 50% 55%, transparent 50%, rgba(0,0,0,0.4))" }} />
      <Grao opacity={0.06} />
      <AbsoluteFill style={{ background: C.nevoa, opacity: clareia }} />
    </AbsoluteFill>
  );
};

// ============ CENA 4 · celular com a estrada (7,0 – 9,33) ============
const ESTRADA_TRAS = "M -160 560 C 240 360, 900 380, 900 690 C 900 900, 520 930, 300 960";
const ESTRADA_FRENTE = "M 300 960 C 40 1000, 20 1290, 400 1370 C 760 1440, 980 1480, 1260 1760";

const Estrada: React.FC<{ d: string; prog: number; id: string }> = ({ d, prog, id }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <defs>
      <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7EEBDD" />
        <stop offset="0.5" stopColor="#13B8A6" />
        <stop offset="1" stopColor="#0B7F74" />
      </linearGradient>
      <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="-400" y="-400" width="1900" height="2800">
        <path d={d} fill="none" stroke="#fff" strokeWidth={150} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog} />
      </mask>
    </defs>
    <g mask={`url(#m${id})`}>
      <path d={d} fill="none" stroke="rgba(10,60,56,0.25)" strokeWidth={112} strokeLinecap="round" transform="translate(0 26)" style={{ filter: "blur(14px)" }} />
      <path d={d} fill="none" stroke="#0A6E65" strokeWidth={104} strokeLinecap="round" />
      <path d={d} fill="none" stroke={`url(#g${id})`} strokeWidth={92} strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={20} strokeLinecap="round" transform="translate(-10 -22)" />
      <path d={d} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="26 22" strokeLinecap="round" opacity={0.95} />
    </g>
  </svg>
);

const TelaApp: React.FC<{ t: number }> = ({ t }) => {
  const acende = p(t, 8.05, 8.4, outExpo);
  const custo = k(t, 8.1, 8.9, 0, 0.74, out3);
  const campos: [string, string][] = [["Combustível", "R$ 1.260"], ["Manutenção", "R$ 340"], ["Seguro e IPVA", "R$ 400"], ["Km no mês", "2.700 km"]];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F6F9F8", padding: "70px 26px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <RoviaIcone size={34} />
        <span style={{ ...display(650, 20), letterSpacing: "0.16em", color: C.tinta }}>ROVIA</span>
      </div>
      <div style={{ ...display(700, 33), color: C.tinta, marginTop: 22, lineHeight: 1.08 }}>Quanto custa cada km do seu carro?</div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {campos.map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 2px 6px rgba(0,40,40,0.06)" }}>
            <span style={{ ...texto(500, 17), color: C.tinta2 }}>{a}</span>
            <span style={{ ...texto(650, 17), color: C.tinta }}>{b}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, borderRadius: 18, padding: "18px 18px", background: "#0E1A1C", boxShadow: `0 0 ${40 * acende}px rgba(19,184,166,${0.5 * acende})` }}>
        <div style={{ ...texto(500, 15), color: "rgba(255,255,255,0.6)" }}>Seu custo real</div>
        <div style={{ ...display(750, 46), color: "#fff", display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 20, color: C.turqClaro }}>R$</span>{brl(custo)}<span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>/km</span>
        </div>
        <div style={{ marginTop: 12, height: 40, borderRadius: 12, background: C.turq, ...texto(650, 16), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Ver detalhes</div>
      </div>
    </div>
  );
};

export const Cena4: React.FC = () => {
  const t = useT();
  const sobe = p(t, 7.0, 7.8, outExpo);
  const rz = k(t, 7.0, 7.8, 28, 9, outExpo) + k(t, 7.8, 9.33, 0, -4, inOutSine);
  const ry = k(t, 7.0, 7.8, -38, -16, outExpo) + k(t, 7.8, 9.33, 0, 6, inOutSine);
  const estrada = p(t, 7.72, 8.95, inOut3);
  const cobre = p(t, 9.0, 9.33, in3);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoNevoa deriva={k(t, 7, 9.33, 0, 1)} />
      <Estrada d={ESTRADA_TRAS} prog={Math.min(1, estrada * 2.2)} id="tras" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1800 }}>
        <div style={{ transform: `translateY(${(1 - sobe) * 1200 - 20}px) rotateX(8deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${k(t, 7.8, 9.33, 1, 1.05)})`, transformStyle: "preserve-3d" }}>
          <Celular w={430} claro tela="#F6F9F8">
            <TelaApp t={t} />
          </Celular>
        </div>
      </AbsoluteFill>
      <Estrada d={ESTRADA_FRENTE} prog={Math.max(0, (estrada - 0.42) / 0.58)} id="frente" />
      {/* a estrada cobre a tela e leva ao painel escuro */}
      <AbsoluteFill style={{ transform: `translateX(${(1 - cobre) * -2600}px) rotate(-18deg) scale(1.6)` }}>
        <div style={{ position: "absolute", left: -400, top: -400, width: 1900, height: 2800, background: `linear-gradient(90deg, ${C.asfalto} 0 72%, #0B7F74 80%, ${C.turq} 88%, #7EEBDD 96%, transparent 100%)` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { RoviaNome };
