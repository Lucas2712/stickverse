// Cena 4 · IA do seu jeito (10,9–14,5 s) · "Tudo pensado para facilitar cada etapa da sua jornada."
import React from "react";
import {COR, Cheio, Cinetico, E, clamp, display, lerp, p, texto, useT} from "../lib";
import {IconeApp} from "../componentes/Logo";
import {Selo, Telefone, sombra} from "../componentes/App";
import {IcBrilho, IcCheck, IcJanela, IcSol} from "../componentes/Icones";

const DIAS = [["Dia 1", "Pelourinho", 12.5], ["Dia 2", "Praia do Forte", 12.72], ["Dia 3", "Farol da Barra", 12.94]];

const Flutuante = ({t0, x, y, z, w, h, rot = 0, children}) => {
  const t = useT();
  const k = p(t, t0, 0.7, E.back);
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 40, background: "#fff", boxShadow: "0 40px 90px rgba(10,2,40,.45)", opacity: clamp(p(t, t0, 0.25, E.out)), transform: `translate3d(0, ${Math.sin(t * 1.6 + x) * 8}px, ${lerp(-200, z, k)}px) scale(${lerp(0.5, 1, k)}) rotate(${rot}deg)`, boxSizing: "border-box", padding: 30}}>
      {children}
    </div>
  );
};

export const C4IA = () => {
  const t = useT();
  const abre = p(t, 10.6, 0.5, E.inOut);
  const entra = p(t, 10.75, 1.0, E.expo);
  const zin = p(t, 12.38, 0.55, E.inOut), zout = p(t, 13.1, 0.6, E.inOut);
  const esc = 1 + zin * 0.2 - zout * 0.36;
  const ty = lerp(120, -150, zout);
  const ry = lerp(40, -13, p(t, 10.75, 1.5, E.out5)) + Math.sin(t * 0.9) * 2 + zin * 6 - zout * 6;
  const pensa = t < 11.5;
  return (
    <Cheio style={{clipPath: `circle(${abre * 2300}px at 540px 960px)`, background: `radial-gradient(85% 55% at 50% 38%, #6A27EC 0%, #3A1791 42%, ${COR.profundo} 100%)`}}>
      {[[160, 420, 520, "#E6189B", 0.28], [900, 1300, 620, "#7A2BFF", 0.5], [820, 300, 380, "#B58CFF", 0.25]].map(([x, y, r, c, o], i) => (
        <div key={i} style={{position: "absolute", left: x - r / 2 + Math.sin(t * 0.7 + i) * 30, top: y - r / 2 + Math.cos(t * 0.6 + i) * 30, width: r, height: r, borderRadius: r, background: c, opacity: o, filter: "blur(120px)"}} />
      ))}
      <Cheio style={{perspective: 2000, overflow: "visible"}}>
        <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "700px 860px", transform: `translateY(${(1 - entra) * 1300 + ty}px) scale(${esc}) rotateY(${ry}deg) rotateX(6deg)`}}>
          <Telefone w={560} h={1150} style={{left: 250, top: 250}}>
            <div style={{position: "absolute", left: 34, top: 96, right: 34}}>
              <div style={{display: "flex", alignItems: "center", gap: 14, color: COR.violeta}}>
                <IcBrilho tam={40} />
                <span style={{...display, fontSize: 36, color: COR.tinta, fontWeight: 600}}>Sugestões da VYORA</span>
              </div>
              <div style={{marginTop: 30, display: "flex", gap: 16, alignItems: "flex-start"}}>
                <IconeApp tam={64} />
                <div style={{background: "#fff", borderRadius: "10px 34px 34px 34px", padding: "22px 26px", boxShadow: sombra, minHeight: 50, minWidth: 100}}>
                  {pensa ? (
                    <div style={{display: "flex", gap: 10, padding: "12px 6px"}}>
                      {[0, 1, 2].map((i) => <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: COR.violeta, opacity: 0.35 + 0.65 * Math.abs(Math.sin(t * 7 - i * 0.8))}} />)}
                    </div>
                  ) : (
                    <div style={{...texto, fontSize: 31, lineHeight: 1.25, color: COR.tinta, opacity: p(t, 11.5, 0.3, E.out)}}>Montei <b>3 dias em Salvador</b> para você</div>
                  )}
                </div>
              </div>
              <div style={{marginTop: 34, height: 330, borderRadius: 40, background: `linear-gradient(160deg, ${COR.violeta}, ${COR.magenta})`, position: "relative", overflow: "hidden", opacity: p(t, 11.0, 0.5, E.out)}}>
                <div style={{position: "absolute", right: 50, top: 46, width: 110, height: 110, borderRadius: 55, background: "rgba(255,255,255,.85)"}} />
                <div style={{position: "absolute", left: -40, bottom: -150, width: 420, height: 260, borderRadius: "50%", background: "rgba(255,255,255,.22)"}} />
                <div style={{position: "absolute", left: 160, bottom: -170, width: 460, height: 260, borderRadius: "50%", background: "rgba(22,10,51,.28)"}} />
                <div style={{position: "absolute", left: 30, bottom: 28, color: "#fff"}}>
                  <div style={{...display, fontSize: 50}}>Salvador</div>
                  <div style={{...texto, fontSize: 26, opacity: 0.9}}>Bahia · 3 dias</div>
                </div>
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{marginTop: 22, height: 96, borderRadius: 30, background: "#fff", boxShadow: "0 8px 20px rgba(74,28,160,.08)", display: "flex", alignItems: "center", gap: 18, padding: "0 24px", opacity: p(t, 11.12 + i * 0.08, 0.5, E.out)}}>
                  <div style={{width: 52, height: 52, borderRadius: 18, background: COR.lavanda}} />
                  <div style={{flex: 1}}>
                    <div style={{width: 220 - i * 30, height: 14, borderRadius: 7, background: "#D9CDF5"}} />
                    <div style={{width: 130 + i * 20, height: 12, borderRadius: 6, background: "#ECE4FB", marginTop: 12}} />
                  </div>
                </div>
              ))}
            </div>
          </Telefone>

          <Flutuante t0={12.0} x={56} y={500} z={150} w={410} h={150} rot={-4}>
            <div style={{display: "flex", alignItems: "center", gap: 20, color: COR.magenta}}>
              <div style={{width: 90, height: 90, borderRadius: 30, background: "#FFE4F4", display: "flex", alignItems: "center", justifyContent: "center"}}><IcSol tam={54} /></div>
              <div>
                <div style={{...texto, fontSize: 25, color: COR.tinta2}}>Melhor horário</div>
                <div style={{...display, fontSize: 36, color: COR.tinta, fontWeight: 600}}>Voar de manhã</div>
              </div>
            </div>
          </Flutuante>
          <Flutuante t0={11.88} x={510} y={640} z={230} w={440} h={452} rot={3}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span style={{...display, fontSize: 40, color: COR.tinta, fontWeight: 600}}>Seu roteiro</span>
              <Selo cor="#fff" fundo={COR.violeta}><IcBrilho tam={24} /> IA</Selo>
            </div>
            {DIAS.map(([d, l, tc], i) => {
              const kc = p(t, tc, 0.35, E.back);
              return (
                <div key={i} style={{marginTop: 22, display: "flex", alignItems: "center", gap: 18}}>
                  <div style={{width: 64, height: 64, borderRadius: 32, border: `4px solid ${kc > 0.02 ? COR.violeta : "#D9CDF5"}`, background: kc > 0.02 ? COR.violeta : "#fff", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transform: `scale(${1 + Math.sin(clamp(kc) * Math.PI) * 0.18})`}}>
                    {kc > 0.02 && <div style={{transform: `scale(${kc})`}}><IcCheck tam={36} /></div>}
                  </div>
                  <div>
                    <div style={{...texto, fontSize: 23, color: COR.tinta2, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600}}>{d}</div>
                    <div style={{...display, fontSize: 36, color: COR.tinta, fontWeight: 600}}>{l}</div>
                  </div>
                </div>
              );
            })}
          </Flutuante>
          <Flutuante t0={12.12} x={70} y={1020} z={270} w={410} h={150} rot={5}>
            <div style={{display: "flex", alignItems: "center", gap: 20, color: COR.violeta}}>
              <div style={{width: 90, height: 90, borderRadius: 30, background: COR.lavanda, display: "flex", alignItems: "center", justifyContent: "center"}}><IcJanela tam={54} /></div>
              <div>
                <div style={{...texto, fontSize: 25, color: COR.tinta2}}>Assento 14A</div>
                <div style={{...display, fontSize: 36, color: COR.tinta, fontWeight: 600}}>Janela reservada</div>
              </div>
            </div>
          </Flutuante>
        </div>
      </Cheio>
      <div style={{position: "absolute", left: 80, top: 1318}}>
        <Cinetico tam={122} itens={[[13.28, "Sua"], [13.44, "viagem."], "\n", [13.66, "Do", "#FF5CC0"], [13.8, "seu", "#FF5CC0"], [13.94, "jeito.", "#FF5CC0"]]} />
      </div>
    </Cheio>
  );
};
