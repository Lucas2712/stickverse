// Cenas 5–8: digitar os números · custo por km · tudo numa tela · carrossel de gastos
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, display, texto, p, k, useT, outExpo, inExpo, out3, in3, outBack, inOut3, inOutSine, brl, mix } from "../lib";
import { FundoAsfalto, FundoNevoa, FiltroChicote, MiniBarras, Anel, CardEscuro, Celular, RoviaIcone, Rolo } from "../ui";

// ============ CENA 5 · digitar os números (9,33 – 12,9) ============
const DIGITADO = "R$ 1.260,00";
const T_DIG = 9.62; // início da digitação, logo depois de «Lance»
const CPS = 12.5; // teclas por segundo

export const nTeclas = (t: number) => Math.max(0, Math.min(DIGITADO.length, Math.floor((t - T_DIG) * CPS) + 1));
export const TECLAS = Array.from({ length: DIGITADO.length }, (_, i) => +(T_DIG + i / CPS).toFixed(3));

const LINHAS: { rot: string; sub: string; val: string; un: string; cor: string; sobe: boolean }[] = [
  { rot: "Gasolina", sub: "Preço do litro", val: "6,20", un: "R$/L", cor: C.turq, sobe: true },
  { rot: "Km por mês", sub: "Rodados no mês", val: "2.700", un: "km", cor: C.turq, sobe: true },
  { rot: "Manutenção", sub: "Revisão e peças", val: "340", un: "R$", cor: C.coral, sobe: false },
  { rot: "Fixos", sub: "Seguro e IPVA", val: "400", un: "R$", cor: C.coral, sobe: false },
];
export const T_LINHAS = [10.63, 10.75, 10.87, 10.99];

export const Cena5: React.FC = () => {
  const t = useT();
  const foco = p(t, 9.33, 9.75, outExpo);
  const n = nTeclas(t);
  const sobeCampo = p(t, 10.5, 11.0, outExpo);
  const sai = p(t, 12.55, 12.93, inExpo);
  const cursor = Math.floor(t * 2.4) % 2 === 0 || (t > T_DIG && t < T_DIG + DIGITADO.length / CPS);
  const barras = p(t, 10.73, 11.9, lin2);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoAsfalto deriva={k(t, 9.33, 12.9, 0, 1)} />
      <FiltroChicote id="c5" x={0} y={sai * 70} />
      <AbsoluteFill style={{ transform: `translateY(${-1500 * sai}px) scale(${k(t, 9.33, 12.6, 1, 1.04)})`, filter: "url(#c5)" }}>
        {/* campo de entrada */}
        <div style={{ position: "absolute", left: 110, width: 860, top: mix(900, 330, sobeCampo), transform: `scale(${mix(1.12, 0.92, sobeCampo)})`, filter: `blur(${(1 - foco) * 20}px)`, opacity: 0.3 + 0.7 * foco }}>
          <div style={{ ...texto(500, 26), color: "rgba(255,255,255,0.5)", marginBottom: 16, marginLeft: 8 }}>Quanto foi o combustível este mês?</div>
          <div style={{ height: 124, borderRadius: 62, background: "#121E21", boxShadow: `inset 0 0 0 2px ${n > 0 ? "rgba(19,184,166,0.55)" : "rgba(255,255,255,0.09)"}, 0 20px 50px rgba(0,0,0,0.4)`,
            display: "flex", alignItems: "center", padding: "0 44px", gap: 24 }}>
            <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" /><path d="M15.5 15.5L20 20" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" /></svg>
            <span style={{ ...display(600, 52), color: n > 0 ? "#fff" : "rgba(255,255,255,0.3)" }}>
              {n > 0 ? DIGITADO.slice(0, n) : "Valor do combustível"}
              <span style={{ display: "inline-block", width: 4, height: 52, marginLeft: 6, verticalAlign: "-6px", background: C.turqClaro, opacity: cursor ? 1 : 0 }} />
            </span>
            <div style={{ marginLeft: "auto", width: 64, height: 64, borderRadius: 32, background: n >= DIGITADO.length ? C.turq : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>
        {/* lista com mini-barras */}
        <div style={{ position: "absolute", left: 90, width: 900, top: 640 }}>
          {LINHAS.map((L, i) => {
            const e = p(t, T_LINHAS[i], T_LINHAS[i] + 0.55, outExpo);
            return (
              <div key={L.rot} style={{ display: "flex", alignItems: "center", height: 196, borderTop: "1.5px solid rgba(255,255,255,0.07)", opacity: e, transform: `translateY(${(1 - e) * 140}px)`, filter: `blur(${(1 - e) * 10}px)` }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: L.cor, marginRight: 26 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ ...texto(600, 40), color: "#fff" }}>{L.rot}</div>
                  <div style={{ ...texto(500, 26), color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{L.sub}</div>
                </div>
                <MiniBarras cor={L.cor} prog={Math.max(0, (barras - i * 0.08) / 0.76)} seed={i + 3} w={220} h={78} sobe={L.sobe} />
                <div style={{ width: 210, textAlign: "right" }}>
                  <div style={{ ...display(700, 54), color: "#fff" }}>{L.val}</div>
                  <div style={{ ...texto(600, 22), color: L.cor }}>{L.un}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const lin2 = (x: number) => x;

// ============ CENA 6 · custo por km (12,9 – 15,2) ============
const ROTA = "M 70 470 C 120 400, 150 380, 170 330 C 190 270, 260 280, 290 230 C 320 180, 300 130, 360 90";

const Mapa: React.FC<{ prog: number }> = ({ prog }) => (
  <svg width={410} height={520} viewBox="0 0 410 520" style={{ display: "block" }}>
    <rect width={410} height={520} rx={22} fill="#EEF3F2" />
    <g stroke="#FFFFFF" strokeWidth={14}>
      {[60, 150, 240, 330].map((x) => <path key={x} d={`M ${x} -20 L ${x + 60} 540`} />)}
      {[80, 190, 300, 410].map((y) => <path key={y} d={`M -20 ${y} L 430 ${y - 50}`} />)}
    </g>
    <rect x={200} y={330} width={110} height={80} rx={10} fill="#CDEFE9" transform="rotate(-6 255 370)" />
    <path d="M -20 250 C 120 220, 200 300, 430 210" stroke="#CFE3F5" strokeWidth={22} fill="none" />
    <path d={ROTA} stroke="rgba(11,127,116,0.25)" strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d={ROTA} stroke={C.turq} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog} />
    <circle cx={70} cy={470} r={9} fill="#fff" stroke={C.turqEscuro} strokeWidth={4} />
    <g opacity={prog > 0.97 ? 1 : 0} transform={`translate(360 90) scale(${prog > 0.97 ? 1 : 0.5})`}>
      <circle r={20} fill="rgba(19,184,166,0.25)" />
      <circle r={10} fill={C.turqEscuro} />
    </g>
  </svg>
);

export const Cena6: React.FC = () => {
  const t = useT();
  const ent = (i: number) => p(t, 12.9 + i * 0.08, 13.4 + i * 0.08, outExpo);
  const aneis = p(t, 13.1, 13.95, out3);
  const custo = k(t, 12.98, 14.0, 0, 0.74, out3);
  const rota = p(t, 13.3, 14.6, inOut3);
  const sai = p(t, 14.95, 15.23, in3);
  const card = (i: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
    position: "absolute", opacity: ent(i), filter: `blur(${(1 - ent(i)) * 22}px)`, transform: `translateY(${(1 - ent(i)) * 60}px) scale(${0.94 + 0.06 * ent(i)})`, ...extra,
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoAsfalto deriva={k(t, 12.9, 15.2, 0.3, 1)} />
      <AbsoluteFill style={{ transformOrigin: "745px 930px", transform: `scale(${k(t, 12.9, 14.95, 1.0, 1.035) * (1 + sai * 1.8)})`, opacity: 1 - p(t, 15.1, 15.23) }}>
        {/* coluna esquerda */}
        <div style={card(0, { left: 80, top: 330, width: 400 })}>
          <CardEscuro style={{ height: 330, padding: 34, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
            <Anel size={190} pct={0.63} prog={aneis} cor={C.turq} />
            <div style={{ ...texto(600, 28), color: "rgba(255,255,255,0.7)" }}>Combustível</div>
          </CardEscuro>
        </div>
        <div style={card(1, { left: 80, top: 690, width: 400 })}>
          <CardEscuro style={{ height: 330, padding: 34, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
            <Anel size={190} pct={0.37} prog={aneis} cor={C.coral} />
            <div style={{ ...texto(600, 28), color: "rgba(255,255,255,0.7)" }}>Outros custos</div>
          </CardEscuro>
        </div>
        <div style={card(2, { left: 80, top: 1050, width: 400 })}>
          <div style={{ height: 470, borderRadius: 30, padding: 36, background: "linear-gradient(160deg,#0F8F83,#0A5F58)", boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 1.5px rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <RoviaIcone size={64} />
            <div>
              <div style={{ ...display(700, 50), color: "#fff", lineHeight: 1.04 }}>Veja o seu custo real</div>
              <div style={{ ...texto(500, 24), color: "rgba(255,255,255,0.7)", marginTop: 14 }}>Combustível, manutenção e fixos</div>
            </div>
          </div>
        </div>
        {/* card grande */}
        <div style={card(1.5, { left: 510, top: 330, width: 490 })}>
          <div style={{ height: 1190, borderRadius: 34, padding: 40, background: "linear-gradient(180deg,#FFFFFF,#F1F6F5)", boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
            <div style={{ ...texto(600, 26), color: C.tinta2 }}>Seu custo por km</div>
            <div style={{ ...display(800, 132), color: C.tinta, display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10, letterSpacing: "-0.05em" }}>
              <span style={{ fontSize: 40, marginTop: 22, color: C.turqEscuro, letterSpacing: 0 }}>R$</span>
              <Rolo valor={custo} molde="0,00" />
            </div>
            <div style={{ ...texto(500, 26), color: C.tinta2, marginTop: -2 }}>por quilômetro rodado</div>
            <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
              {[["Combustível", "R$ 0,47", C.turq], ["Outros", "R$ 0,27", C.coral]].map(([a, b, c]) => (
                <div key={a} style={{ flex: 1, background: "#EAF1F0", borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ ...texto(600, 20), color: c as string }}>{a}</div>
                  <div style={{ ...display(700, 32), color: C.tinta, marginTop: 4 }}>{b}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 34 }}><Mapa prog={rota} /></div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#070D1C", opacity: p(t, 15.08, 15.23) }} />
    </AbsoluteFill>
  );
};

// ============ CENA 7 · tudo numa tela (15,2 – 16,9) ============
export const NOTIFS: { at: number; txt: string; total: number }[] = [
  { at: 15.45, txt: "+ Combustível  R$ 260", total: 1410 },
  { at: 15.97, txt: "+ Manutenção  R$ 340", total: 1750 },
  { at: 16.4, txt: "+ Seguro  R$ 250", total: 2000 },
];

const PapelParede: React.FC<{ t: number }> = ({ t }) => (
  <svg width="100%" height="100%" viewBox="0 0 400 820" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#13306A" />
        <stop offset="0.55" stopColor="#0B1838" />
        <stop offset="1" stopColor="#1A0E26" />
      </linearGradient>
      <radialGradient id="pr" cx="0.5" cy="0.62" r="0.4"><stop offset="0" stopColor="rgba(255,90,80,0.35)" /><stop offset="1" stopColor="rgba(255,90,80,0)" /></radialGradient>
    </defs>
    <rect width="400" height="820" fill="url(#pp)" />
    <rect width="400" height="820" fill="url(#pr)" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M ${-40 + i * 70 + t * 6} 0 L ${180 + i * 90 + t * 6} 820`} stroke={i % 2 ? "rgba(63,217,198,0.25)" : "rgba(120,150,255,0.22)"} strokeWidth={1.4} />
    ))}
    <path d={`M 400 120 L ${120 + t * 4} 520`} stroke="rgba(120,150,255,0.3)" strokeWidth={1.4} />
  </svg>
);

export const Cena7: React.FC = () => {
  const t = useT();
  const zoom = k(t, 15.2, 15.75, 1.1, 1.0, outExpo);
  const sai = p(t, 16.68, 16.93, inExpo);
  let total = 1150;
  let atual = -1;
  NOTIFS.forEach((n, i) => {
    total = mix(total, n.total, p(t, n.at, n.at + 0.45, out3));
    if (t >= n.at) atual = i;
  });
  const prog = total / 2600;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoAsfalto azul brilho="rgba(70,100,255,0.2)" />
      <FiltroChicote id="c7" x={sai * 70} />
      <AbsoluteFill style={{ alignItems: "center", transform: `translateX(${sai * 1500}px) scale(${zoom})`, filter: "url(#c7)" }}>
        <div style={{ position: "absolute", top: 150 }}>
          <Celular w={800}>
            <PapelParede t={t} />
            <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center", color: "rgba(255,255,255,0.92)" }}>
              <div style={{ ...texto(600, 34), opacity: 0.8 }}>sexta-feira, 14 de novembro</div>
              <div style={{ ...display(600, 200), letterSpacing: "-0.04em", marginTop: -4 }}>21:14</div>
            </div>
            {/* widget */}
            <div style={{ position: "absolute", left: 50, right: 50, top: 600, borderRadius: 52, padding: "40px 46px", background: "rgba(20,30,52,0.55)", backdropFilter: "blur(30px)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <RoviaIcone size={50} />
                  <span style={{ ...display(650, 28), letterSpacing: "0.16em", color: "#fff" }}>ROVIA</span>
                </div>
                <div style={{ position: "relative", height: 40, width: 360, overflow: "hidden" }}>
                  {NOTIFS.map((n, i) => {
                    const e = p(t, n.at, n.at + 0.3, outExpo);
                    const s = i < NOTIFS.length - 1 ? p(t, NOTIFS[i + 1].at, NOTIFS[i + 1].at + 0.3, outExpo) : 0;
                    return (
                      <div key={i} style={{ position: "absolute", right: 0, ...texto(650, 28), color: C.turqClaro, whiteSpace: "nowrap", opacity: e * (1 - s), transform: `translateY(${(1 - e) * 40 - s * 40}px)` }}>{n.txt}</div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 36 }}>
                <span style={{ ...texto(600, 36), color: "#fff", whiteSpace: "nowrap" }}>Gastos do mês</span>
                <span style={{ ...display(750, 86), color: "#fff", display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 34 }}>R$</span><Rolo valor={total} molde="0.000" dec={0} />
                </span>
              </div>
              <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)", marginTop: 28 }}>
                <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 7, background: `linear-gradient(90deg, ${C.turq}, ${C.turqClaro})`, boxShadow: `0 0 18px ${C.turq}` }} />
              </div>
            </div>
            {/* notificação que desce */}
            {NOTIFS.map((n, i) => {
              const e = p(t, n.at, n.at + 0.35, outBack);
              const s = p(t, n.at + 0.42, n.at + 0.6, in3);
              if (t < n.at || s >= 1) return null;
              return (
                <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 400, borderRadius: 36, padding: "26px 30px", background: "rgba(240,246,248,0.92)", display: "flex", alignItems: "center", gap: 20,
                  opacity: (1 - s), transform: `translateY(${(1 - e) * -120 + s * 140}px) scale(${1 - s * 0.1})` }}>
                  <RoviaIcone size={56} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...texto(700, 28), color: C.tinta }}>Gasto registrado</div>
                    <div style={{ ...texto(500, 26), color: C.tinta2 }}>{n.txt.replace("+ ", "").replace("  ", " · ")}</div>
                  </div>
                  <span style={{ ...texto(500, 22), color: C.tinta2 }}>agora</span>
                </div>
              );
            })}
            {/* botões da tela de bloqueio */}
            {[0, 1].map((i) => (
              <div key={i} style={{ position: "absolute", bottom: 120, [i ? "right" : "left"]: 80, width: 110, height: 110, borderRadius: 55, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
                {i === 0 ? (
                  <svg width="40" height="40" viewBox="0 0 24 24"><path d="M8 2h8l-1 6H9z M9 8h6v13H9z" fill="#fff" /></svg>
                ) : (
                  <svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 7h4l2-2h4l2 2h4v12H4z" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="13" r="3.5" fill="none" stroke="#fff" strokeWidth="1.8" /></svg>
                )}
              </div>
            ))}
          </Celular>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ CENA 8 · carrossel de ícones (16,9 – 19,45) ============
const ICONES = ["pneu", "ipva", "bomba", "chave", "escudo", "pneu", "ipva"];
const ROTULOS: { txt: string; x: number; y: number; z: number; ativo: [number, number] }[] = [
  { txt: "Combustível", x: 330, y: 1230, z: 1.0, ativo: [17.4, 18.1] },
  { txt: "Manutenção", x: 740, y: 1330, z: 1.0, ativo: [18.19, 19.5] },
  { txt: "IPVA", x: 820, y: 1170, z: 0.75, ativo: [0, 0] },
  { txt: "Seguro", x: 250, y: 1460, z: 0.85, ativo: [0, 0] },
  { txt: "Pneus", x: 560, y: 1560, z: 0.7, ativo: [0, 0] },
];

export const Cena8: React.FC = () => {
  const t = useT();
  // posição do carrossel (índice no centro): entra da direita, centraliza a bomba em «Combustível», a chave em «manutenção»
  let c = k(t, 16.9, 17.38, -0.6, 2.0, outExpo);
  c += k(t, 18.1, 18.45, 0, 1.0, inOut3);
  c += k(t, 18.45, 19.45, 0, 0.25, lin2);
  const ent = p(t, 16.9, 17.3, outExpo);
  const sai = p(t, 19.08, 19.48, in3);
  const ESP = 400;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FundoNevoa tom="lilas" deriva={k(t, 16.9, 19.45, 0, 1)} />
      <AbsoluteFill style={{ filter: `blur(${sai * 34}px)`, opacity: 1 - sai * 0.6 }}>
        {ICONES.map((nome, i) => {
          const d = i - c;
          const ad = Math.abs(d);
          if (ad > 2.6) return null;
          const s = 1 - Math.min(ad, 2) * 0.24;
          const x = 540 + d * ESP;
          const y = 620 + ad * ad * 28;
          return (
            <Img key={i} src={staticFile(`img/ic_${nome}.png`)} style={{ position: "absolute", left: x - 210, top: y - 210, width: 420, height: 420, objectFit: "contain",
              transform: `scale(${s}) rotate(${d * -6}deg)`, filter: `blur(${ad * 3.5}px) drop-shadow(0 30px 30px rgba(60,60,120,0.18))`, opacity: Math.max(0, 1 - ad * 0.28) * ent }} />
          );
        })}
        <div style={{ position: "absolute", top: 960, width: "100%", textAlign: "center", ...texto(500, 50), color: "#8B90A8", opacity: p(t, 17.0, 17.4), lineHeight: 1.15 }}>
          Com o que você<br />gasta no carro?
        </div>
        {ROTULOS.map((r, i) => {
          const at = r.ativo[0] > 0 ? p(t, r.ativo[0], r.ativo[0] + 0.25, outExpo) * (1 - p(t, r.ativo[1], r.ativo[1] + 0.25)) : 0;
          const e = p(t, 17.05 + i * 0.07, 17.5 + i * 0.07, outExpo);
          const dx = k(t, 16.9, 19.45, 30, -30) * r.z;
          return (
            <div key={r.txt} style={{ position: "absolute", left: r.x + dx, top: r.y, transform: `translate(-50%,-50%) scale(${r.z * (1 + 0.2 * at)})`, opacity: e * (0.45 + 0.55 * at + (r.z === 1 ? 0.2 : 0)),
              filter: `blur(${(1 - r.z) * 6 * (1 - at)}px)`, ...texto(at > 0.5 ? 700 : 600, 50), color: at > 0.1 ? C.tinta : "#5C627A", whiteSpace: "nowrap" }}>
              {r.txt}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export { inOutSine };
