// Cena 8 · Escolha e pronto (28,5–33,2 s) · "Escolha seu destino, encontre seu voo e deixe o resto com a gente."
import React from "react";
import {COR, Cheio, Cinetico, E, Toque, clamp, display, p, texto, useT} from "../lib";
import {Selo, Telefone} from "../componentes/App";
import {IcBrilho, IcBusca, IcCheck} from "../componentes/Icones";

const L = 608; // largura da tela interna do telefone
const DEST = [["Salvador", "Bahia, Brasil", COR.violeta, COR.magenta], ["Lisboa", "Portugal", "#5A17DB", "#B58CFF"], ["Nova York", "Estados Unidos", "#3A1791", "#7A2BFF"]];
const VOOS = [["08:40", "11:05"], ["13:15", "15:40"], ["19:50", "22:15"]];
const LISTA = [["Hospedagem", "reservada", 31.9], ["Carro", "reservado", 32.2], ["Seguro viagem", "ativo", 32.5], ["Check-in automático", "agendado", 32.8]];

const Titulo = ({children, sub}) => (
  <div style={{position: "absolute", left: 30, top: 92}}>
    <div style={{...display, fontSize: 50, color: COR.tinta}}>{children}</div>
    {sub && <div style={{...texto, fontSize: 26, color: COR.tinta2, marginTop: 4}}>{sub}</div>}
  </div>
);

export const C8Escolha = () => {
  const t = useT();
  const abre = p(t, 28.2, 0.45, E.inOut);
  const entra = p(t, 28.3, 0.9, E.expo);
  const pos = p(t, 30.28, 0.55, E.inOut) + p(t, 31.58, 0.55, E.inOut);
  const sel = p(t, 29.6, 0.4, E.back);
  const rec = p(t, 31.0, 0.45, E.back);
  const aperta = Math.sin(clamp((t - 31.78) / 0.3) * Math.PI);
  return (
    <Cheio style={{clipPath: `circle(${abre * 2300}px at 371px 1021px)`, background: `linear-gradient(180deg, #fff 0%, ${COR.lavandaSuave} 50%, ${COR.lavanda} 100%)`}}>
      <div style={{position: "absolute", left: 600 + Math.sin(t * 0.8) * 40, top: 900, width: 700, height: 700, borderRadius: 350, background: COR.violetaClaro, opacity: 0.35, filter: "blur(130px)"}} />
      <div style={{position: "absolute", left: 80, top: 244}}><Cinetico tam={100} cor={COR.tinta} saida={30.2} itens={[[28.48, "Escolha"], "\n", [29.46, "seu", COR.violeta], [29.58, "destino.", COR.violeta]]} /></div>
      <div style={{position: "absolute", left: 80, top: 244}}><Cinetico tam={100} cor={COR.tinta} saida={31.55} itens={[[30.44, "Encontre"], "\n", [30.92, "seu", COR.violeta], [31.08, "voo.", COR.violeta]]} /></div>
      <div style={{position: "absolute", left: 80, top: 244}}><Cinetico tam={100} cor={COR.tinta} itens={[[31.78, "O"], [31.86, "resto"], "\n", [32.44, "é", COR.violeta], [32.56, "com", COR.violeta], [32.68, "a", COR.violeta], [32.8, "gente.", COR.violeta]]} /></div>

      <Cheio style={{perspective: 2400, overflow: "visible"}}>
        <div style={{position: "absolute", inset: 0, transformOrigin: "540px 1100px", transform: `translateY(${(1 - entra) * 1400}px) rotateY(${-7 + (t - 28.3) * 2.4}deg) rotateX(4deg)`}}>
          <Telefone w={640} h={1290} style={{left: 220, top: 520}} fundo="#FBF9FF">
            <div style={{position: "absolute", left: 0, top: 0, width: L * 3, height: 1258, transform: `translateX(${-pos * L}px)`, filter: Math.abs(pos % 1 - 0.5) < 0.4 && pos % 1 > 0.02 ? "blur(3px)" : "none"}}>
              {/* A · destinos */}
              <div style={{position: "absolute", left: 0, width: L, height: 1258}}>
                <Titulo>Para onde?</Titulo>
                <div style={{position: "absolute", left: 30, top: 178, width: 548, height: 84, borderRadius: 30, background: "#fff", boxShadow: "0 8px 22px rgba(74,28,160,.1)", display: "flex", alignItems: "center", gap: 14, padding: "0 24px", boxSizing: "border-box", color: COR.violeta}}>
                  <IcBusca tam={36} /><span style={{...texto, fontSize: 28, color: "#A99DC6"}}>Cidade, país ou ideia de viagem</span>
                </div>
                {DEST.map(([n, pais, c1, c2], i) => {
                  const k = p(t, 28.5 + i * 0.1, 0.7, E.expo);
                  const on = i === 0;
                  return (
                    <div key={i} style={{position: "absolute", left: 30, top: 292 + i * 262, width: 548, height: 236, borderRadius: 40, background: `linear-gradient(140deg, ${c1}, ${c2})`, overflow: "hidden", opacity: clamp(k * 2) * (on ? 1 : 1 - sel * 0.45), transform: `translateX(${(1 - k) * 500}px) scale(${on ? 1 + sel * 0.035 : 1})`, boxShadow: on && sel > 0.02 ? `0 0 0 ${7 * sel}px #fff, 0 0 0 ${13 * sel}px ${COR.violeta}, 0 24px 50px rgba(122,43,255,.4)` : "0 14px 34px rgba(74,28,160,.2)"}}>
                      <div style={{position: "absolute", right: 46 + i * 30, top: 34, width: 86, height: 86, borderRadius: 43, background: "rgba(255,255,255,.82)"}} />
                      <div style={{position: "absolute", left: -60 + i * 40, bottom: -150, width: 420, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.2)"}} />
                      <div style={{position: "absolute", left: 200 - i * 50, bottom: -170, width: 480, height: 250, borderRadius: "50%", background: "rgba(22,10,51,.28)"}} />
                      <div style={{position: "absolute", left: 30, bottom: 26, color: "#fff"}}>
                        <div style={{...display, fontSize: 52}}>{n}</div>
                        <div style={{...texto, fontSize: 26, opacity: 0.9}}>{pais}</div>
                      </div>
                      {on && <Selo cor={COR.violeta} fundo="#fff" style={{position: "absolute", left: 26, top: 26, fontSize: 22}}><IcBrilho tam={24} /> Sugestão da IA</Selo>}
                      {on && sel > 0.02 && <div style={{position: "absolute", right: 26, bottom: 26, width: 64, height: 64, borderRadius: 32, background: "#fff", color: COR.violeta, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sel})`}}><IcCheck tam={38} /></div>}
                    </div>
                  );
                })}
              </div>
              {/* B · voos */}
              <div style={{position: "absolute", left: L, width: L, height: 1258}}>
                <Titulo sub="12 mar · 1 passageiro">GRU → SSA</Titulo>
                {VOOS.map(([a, b], i) => {
                  const k = p(t, 30.5 + i * 0.1, 0.6, E.expo);
                  const on = i === 0;
                  return (
                    <div key={i} style={{position: "absolute", left: 30, top: 232 + i * (on ? 0 : 1) * 0 + [0, 264, 472][i], width: 548, height: on ? 240 : 184, borderRadius: 38, background: "#fff", boxSizing: "border-box", border: on ? `${5 * rec}px solid ${COR.violeta}` : "none", boxShadow: on ? `0 24px 54px rgba(122,43,255,${0.12 + rec * 0.2})` : "0 8px 22px rgba(74,28,160,.1)", padding: "28px 30px", opacity: clamp(k * 2), transform: `translateY(${(1 - k) * 220}px) scale(${on ? 1 + Math.sin(clamp(rec) * Math.PI) * 0.03 : 1})`}}>
                      {on && <Selo cor="#fff" fundo={COR.violeta} style={{fontSize: 22, marginBottom: 14, opacity: clamp(rec * 2), transform: `scale(${0.7 + rec * 0.3})`, transformOrigin: "0 50%"}}><IcBrilho tam={24} /> Recomendado pela IA</Selo>}
                      <div style={{display: "flex", alignItems: "center", gap: 18}}>
                        <span style={{...display, fontSize: 54, color: COR.tinta}}>{a}</span>
                        <div style={{flex: 1, height: 4, backgroundImage: `linear-gradient(90deg, ${COR.violetaClaro} 50%, transparent 50%)`, backgroundSize: "18px 4px"}} />
                        <span style={{...display, fontSize: 54, color: COR.tinta}}>{b}</span>
                      </div>
                      <div style={{...texto, fontSize: 26, color: COR.tinta2, marginTop: 8, display: "flex", justifyContent: "space-between"}}><span>GRU · direto · 2h25</span><span>SSA</span></div>
                    </div>
                  );
                })}
              </div>
              {/* C · deixe com a VYORA */}
              <div style={{position: "absolute", left: L * 2, width: L, height: 1258}}>
                <Titulo sub="12 mar · 08:40 · VY 2718">Salvador</Titulo>
                <div style={{position: "absolute", left: 30, top: 236, width: 548, height: 126, borderRadius: 44, background: `linear-gradient(100deg, ${COR.violeta}, #9B3DFF 70%, ${COR.magenta} 140%)`, boxShadow: "0 22px 46px rgba(122,43,255,.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, color: "#fff", transform: `scale(${1 - aperta * 0.06})`}}>
                  <IcBrilho tam={44} /><span style={{...display, fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em"}}>Deixar com a VYORA</span>
                </div>
                {LISTA.map(([n, st, tc], i) => {
                  const kc = p(t, tc, 0.4, E.back);
                  return (
                    <div key={i} style={{position: "absolute", left: 30, top: 398 + i * 146, width: 548, height: 124, borderRadius: 34, background: "#fff", boxShadow: "0 8px 22px rgba(74,28,160,.1)", display: "flex", alignItems: "center", gap: 20, padding: "0 26px", boxSizing: "border-box"}}>
                      <div style={{width: 68, height: 68, borderRadius: 34, boxSizing: "border-box", border: `4px solid ${kc > 0.02 ? COR.violeta : "#D9CDF5"}`, background: kc > 0.02 ? COR.violeta : "#fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(clamp(kc) * Math.PI) * 0.2})`}}>
                        {kc > 0.02 && <div style={{transform: `scale(${kc})`}}><IcCheck tam={38} /></div>}
                      </div>
                      <div style={{flex: 1, ...display, fontSize: 36, fontWeight: 600, color: COR.tinta, whiteSpace: "nowrap"}}>{n}</div>
                      <div style={{...texto, fontSize: 24, color: COR.violeta, fontWeight: 600, opacity: clamp(kc > 0.02 ? kc : 0)}}>{st}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Telefone>
        </div>
      </Cheio>
      <Toque x={520} y={940} t0={29.5} />
      <Toque x={540} y={836} t0={31.78} cor="#fff" />
    </Cheio>
  );
};
