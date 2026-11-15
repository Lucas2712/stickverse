// Cena 3 · Serviços (6,3–10,9 s) · "Encontre voos, serviços e ofertas personalizadas em um só lugar."
import React from "react";
import {COR, Cheio, Cinetico, E, clamp, display, lerp, p, texto, useT} from "../lib";
import {LogoLinha} from "../componentes/Logo";
import {sombra} from "../componentes/App";
import {IcBrilho, IcCama, IcCarro, IcEscudo, IcSeta, IcVoo} from "../componentes/Icones";

const ITENS = [
  ["Voos", "Compare e reserve em segundos", IcVoo, 6.66],
  ["Hospedagem", "Hotéis e estadias selecionadas", IcCama, 7.4],
  ["Aluguel de carros", "Retire direto no aeroporto", IcCarro, 7.62],
  ["Seguro viagem", "Cobertura do início ao fim", IcEscudo, 7.84],
  ["Ofertas para você", "Escolhidas pela IA, do seu jeito", IcBrilho, 8.12],
];
const CAM = [[6.4, -0.15], [7.3, 0.2], [7.58, 1.1], [7.82, 2.05], [8.08, 3.0], [8.5, 3.85], [9.4, 4.0]];
const GRADE = [[200, 560], [540, 560], [880, 560], [370, 980], [710, 980]];

const camera = (t) => {
  if (t <= CAM[0][0]) return CAM[0][1];
  for (let i = 1; i < CAM.length; i++) {
    if (t <= CAM[i][0]) {
      const k = (t - CAM[i - 1][0]) / (CAM[i][0] - CAM[i - 1][0]);
      return lerp(CAM[i - 1][1], CAM[i][1], k * k * (3 - 2 * k));
    }
  }
  return CAM[CAM.length - 1][1];
};

export const C3Servicos = () => {
  const t = useT();
  const abre = p(t, 6.12, 0.5, E.inOut);
  const cam = camera(t);
  const m = p(t, 9.4, 0.8, E.inOut); // fila → grade
  const sai = p(t, 10.5, 0.55, E.inn);
  let ativo = -1;
  ITENS.forEach((it, i) => { if (t >= it[3]) ativo = i; });
  return (
    <Cheio style={{clipPath: `circle(${abre * 2300}px at 540px 1100px)`, background: `linear-gradient(180deg, #fff 0%, ${COR.lavandaSuave} 45%, ${COR.lavanda} 100%)`}}>
      <div style={{position: "absolute", left: 80, top: 236, opacity: p(t, 6.3, 0.5, E.out) * (1 - sai)}}><LogoLinha altura={54} /></div>
      <div style={{position: "absolute", left: 80, top: 330, opacity: 1 - sai}}>
        <Cinetico tam={112} cor={COR.tinta} itens={[[6.32, "Serviços"]]} />
      </div>
      <Cheio style={{perspective: 1700, perspectiveOrigin: "50% 45%", overflow: "visible"}}>
        <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${lerp(-24, 0, m)}deg) rotateX(${lerp(5, 0, m)}deg)`}}>
          {ITENS.map(([nome, , Ic, t0], i) => {
            const k = p(t, t0 - 0.12, 0.65, E.expo);
            const xr = 540 + (i - cam) * 470, yr = 850;
            const [xg, yg] = GRADE[i];
            const x = lerp(xr, xg, m), y = lerp(yr, yg + 184, m);
            const esc = lerp(1.5, 0.92, m);
            const on = m < 0.5 ? i === ativo : i === 4;
            const leque = sai * (i - 2);
            return (
              <div key={i} style={{position: "absolute", left: x - 160, top: y - 200, width: 320, height: 400, borderRadius: 48, background: on ? `linear-gradient(150deg, ${COR.violeta}, #5A17DB)` : "#fff", boxShadow: on ? "0 40px 80px rgba(122,43,255,.42)" : sombra, color: on ? "#fff" : COR.violeta, opacity: clamp(k * 2.5) * (1 - sai), transform: `translate3d(${leque * 240}px, ${(1 - k) * 160 - sai * 500}px, ${(1 - k) * -900 + (on ? 60 : 0)}px) scale(${esc}) rotate(${leque * 16}deg)`, padding: 34, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                  <div style={{width: 124, height: 124, borderRadius: 40, background: on ? "rgba(255,255,255,.18)" : COR.lavandaSuave, display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Ic tam={72} />
                  </div>
                  {i === 4 && <div style={{...texto, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", padding: "8px 16px", borderRadius: 30, background: COR.magenta, color: "#fff"}}>IA</div>}
                </div>
                <div>
                  <div style={{...display, fontSize: 42, fontWeight: 600, lineHeight: 1.08, color: on ? "#fff" : COR.tinta}}>{nome}</div>
                  <div style={{marginTop: 14, opacity: 0.7}}><IcSeta tam={34} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </Cheio>
      {/* legenda do serviço em foco */}
      {ITENS.map(([nome, sub, , t0], i) => {
        const fim = i < 4 ? ITENS[i + 1][3] : 9.35;
        const k = p(t, t0 + 0.05, 0.35, E.expo), s = p(t, fim - 0.03, 0.08, E.linear);
        if (t < t0 || s >= 1) return null;
        return (
          <div key={i} style={{position: "absolute", left: 80, top: 1228, opacity: clamp(k * 2) * (1 - s), transform: `translateY(${(1 - k) * 40 - s * 30}px)`}}>
            <div style={{...display, fontSize: 92, color: COR.tinta}}>{nome}</div>
            <div style={{...texto, fontSize: 38, color: COR.tinta2, marginTop: 10}}>{sub}</div>
          </div>
        );
      })}
      {/* paginação */}
      <div style={{position: "absolute", left: 80, top: 1470, display: "flex", gap: 12, opacity: p(t, 6.7, 0.4, E.out) * (1 - p(t, 9.3, 0.25, E.inn))}}>
        {ITENS.map((_, i) => <div key={i} style={{width: i === ativo ? 64 : 18, height: 18, borderRadius: 9, background: i === ativo ? COR.violeta : "#CDBFF0"}} />)}
      </div>
      <div style={{position: "absolute", left: 0, top: 1396, width: 1080, opacity: 1 - sai}}>
        <Cinetico tam={98} cor={COR.tinta} alinhar="center" itens={[[9.5, "Tudo"], [9.72, "em"], "\n", [9.84, "um", COR.violeta], [10.02, "só", COR.violeta], [10.24, "lugar.", COR.violeta]]} />
      </div>
    </Cheio>
  );
};
