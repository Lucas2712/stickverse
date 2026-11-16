// Cena 9 · Assinatura (33,2–39,0 s) · "VYORA. Viajar começa com uma ideia."
import React from "react";
import {COR, Cheio, Cinetico, E, clamp, display, p, useT, v} from "../lib";
import {LogoAnimada} from "../componentes/Logo";
import {IcSeta} from "../componentes/Icones";

export const C9Assinatura = () => {
  const t = useT();
  const abre = p(t, 32.82, 0.42, E.inOut);
  const cta = p(t, 36.6, 0.7, E.back);
  const pulsa = Math.sin(clamp((t - 37.35) / 0.5) * Math.PI);
  return (
    <Cheio style={{clipPath: `circle(${abre * 2300}px at 540px 850px)`, background: `radial-gradient(90% 55% at 50% 40%, #5A21D6 0%, #2B1166 48%, ${COR.profundo} 100%)`}}>
      <div style={{position: "absolute", left: 140, top: 250, width: 800, height: 800, borderRadius: 400, background: COR.magenta, opacity: 0.16 + Math.sin(t * 1.3) * 0.04, filter: "blur(150px)"}} />
      {/* rotas ao fundo */}
      <svg width="1080" height="1920" style={{position: "absolute", left: 0, top: 0, opacity: 0.5}}>
        {[[620, 0], [820, 50], [1040, 100]].map(([r, f], i) => (
          <circle key={i} cx="540" cy="820" r={r} fill="none" stroke={COR.violetaClaro} strokeWidth="2.5" strokeDasharray="3 22" strokeLinecap="round" opacity={0.5 - i * 0.12} transform={`rotate(${(t - 33) * (6 - i * 1.5) + f} 540 820)`} />
        ))}
      </svg>
      <div style={{position: "absolute", left: 0, top: 420, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${v(t, 33, 6, 0.96, 1.03, E.out)})`}}>
        <LogoAnimada t0={32.98} tPonto={33.26} tam={400} cor="#fff" corPonto={COR.magenta} />
      </div>
      <div style={{position: "absolute", left: 0, top: 1130, width: 1080}}>
        <Cinetico tam={98} alinhar="center" peso={600} itens={[[33.92, "Viajar"], [34.48, "começa"], "\n", [34.9, "com"], [35.32, "uma"], [35.46, "ideia.", "#FF7CCB"]]} />
      </div>
      <div style={{position: "absolute", left: 130, top: 1410, width: 820, height: 140, borderRadius: 70, background: "#fff", boxShadow: `0 30px 70px rgba(230,24,155,${0.25 + pulsa * 0.3}), 0 0 0 ${pulsa * 16}px rgba(255,255,255,.14)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 0 52px", boxSizing: "border-box", overflow: "hidden", opacity: clamp(cta * 2), transform: `translateY(${(1 - cta) * 90}px) scale(${0.85 + cta * 0.15 + pulsa * 0.035})`}}>
        <span style={{...display, fontSize: 45, fontWeight: 600, letterSpacing: "-0.02em", color: COR.tinta}}>Descubra sua próxima viagem</span>
        <div style={{width: 100, height: 100, borderRadius: 50, background: `linear-gradient(135deg, ${COR.violeta}, ${COR.magenta})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${pulsa * 6}px)`}}><IcSeta tam={52} /></div>
        <div style={{position: "absolute", top: 0, left: 0, width: 200, height: 140, background: "linear-gradient(100deg, rgba(122,43,255,0), rgba(122,43,255,.16), rgba(122,43,255,0))", transform: `translateX(${v(t, 37.2, 0.9, -260, 900, E.inOut)}px) skewX(-18deg)`}} />
      </div>
    </Cheio>
  );
};
