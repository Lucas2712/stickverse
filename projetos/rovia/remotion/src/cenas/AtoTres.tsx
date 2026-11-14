// Cenas 9–12: sem bagunça · só o custo real · marca · chamada final
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, display, texto, p, k, useT, outExpo, inExpo, out3, in3, outBack, inOutSine, rnd } from "../lib";
import { FundoNevoa, FundoAsfalto, FiltroChicote, RoviaIcone } from "../ui";

// ============ CENA 9 · sem bagunça, sem planilha (19,45 – 21,5) ============
type Papel = { x: number; y: number; w: number; h: number; r: number; tipo: string };
const PAPEIS: Papel[] = [
  { x: 30, y: 430, w: 380, h: 260, r: -4, tipo: "planilha" },
  { x: 600, y: 370, w: 330, h: 180, r: 5, tipo: "alerta" },
  { x: 390, y: 610, w: 320, h: 165, r: -2, tipo: "total" },
  { x: 790, y: 610, w: 300, h: 210, r: 4, tipo: "oficina" },
  { x: -70, y: 820, w: 230, h: 300, r: -7, tipo: "recibo" },
  { x: 640, y: 1150, w: 390, h: 340, r: 3, tipo: "extrato" },
  { x: 120, y: 1170, w: 240, h: 380, r: -5, tipo: "recibo" },
  { x: 420, y: 1360, w: 200, h: 200, r: 8, tipo: "postit" },
];

const linhas = (n: number, cor: string, seed: number, h = 9) =>
  Array.from({ length: n }).map((_, i) => (
    <div key={i} style={{ height: h, width: `${45 + rnd(seed + i) * 50}%`, borderRadius: 3, background: cor, marginTop: 12 }} />
  ));

const PapelUI: React.FC<{ q: Papel }> = ({ q }) => {
  const base: React.CSSProperties = { width: q.w, height: q.h, borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 50px rgba(20,30,30,0.22), 0 4px 10px rgba(20,30,30,0.12)" };
  if (q.tipo === "planilha")
    return (
      <div style={{ ...base, background: "#fff" }}>
        <div style={{ height: 38, background: "#1F7A4D", ...texto(600, 16), color: "#fff", display: "flex", alignItems: "center", paddingLeft: 14 }}>gastos_carro_FINAL(3).xlsx</div>
        {Array.from({ length: 6 }).map((_, r) => (
          <div key={r} style={{ display: "flex", height: 37, borderBottom: "1px solid #E1E6E5" }}>
            {[0, 1, 2].map((c) => (
              <div key={c} style={{ flex: c === 0 ? 1.5 : 1, borderRight: "1px solid #E1E6E5", padding: "13px 8px" }}>
                <div style={{ height: 9, width: `${40 + rnd(r * 5 + c) * 55}%`, borderRadius: 3, background: c === 2 && r === 3 ? C.coral : "#C3CCCA" }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  if (q.tipo === "alerta")
    return (
      <div style={{ ...base, background: "#16201F", padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.coral, color: "#fff", ...texto(800, 22), display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
          <span style={{ ...texto(700, 24), color: "#fff" }}>IPVA 2026</span>
        </div>
        <div style={{ ...texto(500, 18), color: "rgba(255,255,255,0.5)", marginTop: 10 }}>3ª parcela vence amanhã</div>
        <div style={{ ...display(700, 36), color: C.coral, marginTop: 10 }}>R$ 412,77</div>
      </div>
    );
  if (q.tipo === "total")
    return (
      <div style={{ ...base, background: "#16201F", padding: 24 }}>
        <div style={{ ...texto(500, 18), color: "rgba(255,255,255,0.55)" }}>Gastos do mês</div>
        <div style={{ ...display(750, 46), color: "#fff", marginTop: 8 }}>R$ 2.000,00</div>
        <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", marginTop: 16 }}><div style={{ width: "72%", height: "100%", borderRadius: 4, background: C.turq }} /></div>
        <div style={{ ...texto(500, 16), color: "rgba(255,255,255,0.4)", marginTop: 10 }}>e quanto sobrou?</div>
      </div>
    );
  if (q.tipo === "oficina")
    return (
      <div style={{ ...base, background: "#16201F", padding: 22 }}>
        <div style={{ ...texto(700, 22), color: "#fff" }}>Orçamento · oficina</div>
        {[["Pastilhas", "– 180,00"], ["Mão de obra", "– 120,00"], ["Óleo", "– 40,00"]].map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 14, ...texto(500, 18) }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{a}</span><span style={{ color: C.coral }}>{b}</span>
          </div>
        ))}
      </div>
    );
  if (q.tipo === "extrato")
    return (
      <div style={{ ...base, background: "#16201F", padding: 26 }}>
        <div style={{ ...texto(500, 18), color: "rgba(255,255,255,0.5)" }}>Extrato · cartão</div>
        {[["Posto Avenida", "– 260,00"], ["Estacionamento", "– 18,00"], ["Lava-rápido", "– 45,00"], ["Pedágio", "– 12,40"], ["Auto Peças", "– 96,90"]].map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 17, ...texto(600, 20) }}>
            <span style={{ color: "#fff" }}>{a}</span><span style={{ color: C.coral }}>{b}</span>
          </div>
        ))}
      </div>
    );
  if (q.tipo === "recibo")
    return (
      <div style={{ ...base, borderRadius: 4, background: "linear-gradient(180deg,#F4F1EA,#E8E3D8)", padding: "22px 20px", fontFamily: "monospace" }}>
        <div style={{ ...texto(700, 16), color: "#55504A", textAlign: "center" }}>POSTO AVENIDA</div>
        {linhas(6, "#B9B2A6", q.x, 7)}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, ...texto(700, 16), color: "#55504A" }}><span>TOTAL</span><span>260,00</span></div>
        <div style={{ display: "flex", gap: 3, marginTop: 16 }}>
          {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ width: rnd(i + q.y) > 0.5 ? 4 : 2, height: 36, background: "#6A645C" }} />)}
        </div>
      </div>
    );
  return (
    <div style={{ ...base, borderRadius: 4, background: `linear-gradient(160deg, ${C.postit}, #F0C02C)`, padding: 22 }}>
      <div style={{ ...texto(700, 24), color: "#5A4500", lineHeight: 1.25 }}>trocar óleo<br />+ pneu<br />+ seguro??</div>
    </div>
  );
};

export const Cena9: React.FC = () => {
  const t = useT();
  const foco = p(t, 19.45, 19.8, outExpo);
  const recuo = k(t, 19.72, 20.45, 2.3, 1, outExpo) * k(t, 20.45, 21.2, 1, 0.97, inOutSine);
  const troca = p(t, 20.37, 20.55, outExpo);
  const sai = p(t, 21.18, 21.53, inExpo);
  const sub1 = p(t, 19.85, 20.15, out3);
  const sub2 = p(t, 20.52, 20.85, out3);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoNevoa tom="cinza" />
      <FiltroChicote id="c9" x={sai * 80} />
      <AbsoluteFill style={{ transform: `translateX(${-1500 * sai}px)`, filter: "url(#c9)" }}>
        <AbsoluteFill style={{ transformOrigin: "540px 960px", transform: `scale(${recuo})` }}>
          {PAPEIS.map((q, i) => {
            const e = p(t, 19.78 + i * 0.05, 20.35 + i * 0.05, outExpo);
            const vx = (q.x + q.w / 2 - 540) * 0.9;
            const vy = (q.y + q.h / 2 - 960) * 0.9;
            const flut = Math.sin(t * 1.3 + i) * 6;
            return (
              <div key={i} style={{ position: "absolute", left: q.x, top: q.y, transform: `translate(${(1 - e) * vx}px, ${(1 - e) * vy + flut}px) rotate(${q.r + (1 - e) * 14}deg)`, opacity: e }}>
                <PapelUI q={q} />
              </div>
            );
          })}
          {/* frase */}
          <div style={{ position: "absolute", top: 885, width: "100%", textAlign: "center", filter: `blur(${(1 - foco) * 24}px)` }}>
            <div style={{ position: "relative", height: 160 }}>
              {[["bagunça.", 1 - troca, sub1, -1], ["planilha.", troca, sub2, 1]].map(([pal, op, sb, dir]) => (
                <div key={pal as string} style={{ position: "absolute", width: "100%", ...display(750, 108), color: C.tinta, opacity: op as number, transform: `translateY(${(1 - (op as number)) * 50 * (dir as number)}px)` }}>
                  Sem <span style={{ position: "relative" }}>{pal as string}
                    <span style={{ position: "absolute", left: 0, right: 0, bottom: -10, height: 9, borderRadius: 5, background: C.coral, transformOrigin: "left center", transform: `scaleX(${sb as number}) rotate(-0.6deg)` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ CENA 10 · só o custo real (21,5 – 23,13) ============
const FRASE: [string, number][] = [["Só", 21.7], ["o", 21.99], ["custo", 22.04]];
export const Cena10: React.FC = () => {
  const t = useT();
  const real = p(t, 22.37, 22.62, outExpo);
  const marca = p(t, 22.45, 22.85, out3);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoNevoa tom="cinza" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${k(t, 21.5, 23.13, 1, 1.05, inOutSine)})` }}>
        <div style={{ display: "flex", gap: 26, alignItems: "baseline", ...display(650, 104), color: C.tinta }}>
          {FRASE.map(([w, at]) => {
            const e = p(t, at - 0.06, at + 0.3, outExpo);
            return (
              <span key={w} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 8 }}>
                <span style={{ display: "inline-block", transform: `translateY(${(1 - e) * 110}%)` }}>{w}</span>
              </span>
            );
          })}
          <span style={{ position: "relative", display: "inline-block", paddingBottom: 8 }}>
            <span style={{ position: "absolute", left: -12, right: -12, top: 14, bottom: 4, borderRadius: 14, background: "rgba(19,184,166,0.2)", transformOrigin: "left center", transform: `scaleX(${marca})` }} />
            <span style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
              <span style={{ display: "inline-block", color: C.turqEscuro, fontWeight: 800, transform: `translateY(${(1 - real) * 110}%)` }}>REAL.</span>
            </span>
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ CENA 11 · marca (23,13 – 25,1) ============
export const Cena11: React.FC = () => {
  const t = useT();
  const ponto = p(t, 23.13, 23.3, outBack);
  const caixa = p(t, 23.22, 23.5, outExpo);
  const traco = p(t, 23.3, 23.95, inOutSine);
  const nome = p(t, 23.4, 23.95, outExpo);
  const cresce = k(t, 23.9, 25.1, 1, 1.13, inOutSine);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoAsfalto brilho="rgba(19,184,166,0.12)" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${cresce})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34, transform: `translateX(${(1 - nome) * 150}px)` }}>
          <div style={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {caixa < 0.02 ? (
              <div style={{ width: 30 * ponto, height: 30 * ponto, borderRadius: 15, background: C.turq }} />
            ) : (
              <div style={{ transform: `scale(${0.2 + 0.8 * caixa})` }}><RoviaIcone size={150} draw={traco} /></div>
            )}
          </div>
          <div style={{ overflow: "hidden", width: 400 * nome }}>
            <div style={{ transformOrigin: "left center", transform: `rotate(${(1 - nome) * -9}deg)`, opacity: nome, ...display(650, 96), letterSpacing: "0.16em", color: "#fff", whiteSpace: "nowrap" }}>ROVIA</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 1080, ...texto(500, 32), color: "rgba(255,255,255,0.55)", opacity: p(t, 24.0, 24.4), letterSpacing: "0.02em" }}>
          o custo real do seu carro
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ CENA 12 · chamada (25,1 – 28,5) ============
export const Cena12: React.FC = () => {
  const t = useT();
  const estica = p(t, 25.1, 25.42, outExpo);
  const letras = "Baixe agora";
  const nl = Math.floor(k(t, 25.14, 25.62, 0, letras.length + 0.99));
  const aperta = 1 - 0.06 * Math.sin(Math.PI * p(t, 25.72, 25.92));
  const vira = p(t, 26.28, 26.5, outExpo);
  const entraIcone = p(t, 25.1, 25.45, outBack);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoNevoa deriva={k(t, 25.1, 28.5, 0, 1)} />
      <AbsoluteFill style={{ alignItems: "center", transform: `scale(${k(t, 25.1, 28.5, 1, 1.03)})` }}>
        <div style={{ position: "absolute", top: 650, transform: `scale(${entraIcone})` }}>
          <RoviaIcone size={120} />
        </div>
        <div style={{ position: "absolute", top: 860, height: 150, width: 640, display: "flex", justifyContent: "center", transform: `scale(${aperta})` }}>
          <div style={{ width: 640 * estica, height: 150, borderRadius: 75, background: vira > 0 ? `rgba(19,184,166,${1 - vira})` : C.turq,
            boxShadow: `inset 0 0 0 ${5 * vira}px ${C.turq}, 0 ${24 * (1 - vira)}px ${50 * (1 - vira)}px rgba(19,184,166,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            <span style={{ ...display(650, 58), color: "#fff", whiteSpace: "nowrap", opacity: 1 - vira, transform: `translateY(${-vira * 60}px)` }}>{letras.slice(0, nl)}</span>
            <span style={{ position: "absolute", ...display(800, 60), letterSpacing: "0.08em", color: C.turqEscuro, whiteSpace: "nowrap", opacity: vira, transform: `translateY(${(1 - vira) * 60}px)` }}>É GRÁTIS</span>
          </div>
        </div>
        <div style={{ position: "absolute", top: 1060, ...texto(600, 34), color: C.tinta, opacity: p(t, 26.45, 26.8), letterSpacing: "0.01em" }}>
          ROVIA · o custo real do seu carro
        </div>
        <div style={{ position: "absolute", top: 1450, ...texto(500, 24), color: C.tinta2, opacity: p(t, 26.6, 27.0) * 0.8 }}>Valores de exemplo.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { FundoAsfalto, in3 };
