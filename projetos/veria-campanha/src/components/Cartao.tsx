// Cartão VÉRIA em 3D: metal acetinado violeta escovado, símbolo em relevo, borda lavanda,
// brilho especular que corre conforme o giro, espessura real e verso com a linha de ritmo gravada.
import React from "react";
import { COR, FONTE_TEXTO, Nome, Simbolo } from "../branding/Marca";

export const Cartao: React.FC<{ largura: number; rx?: number; ry?: number; rz?: number; brilho?: number; foco?: number }> = ({ largura, rx = 0, ry = 0, rz = 0, brilho = 1, foco = 0 }) => {
  const W = largura, H = W / 1.586, R = W * 0.055, esp = W * 0.012;
  const ang = ((ry % 360) + 360) % 360;
  const sheen = 50 + Math.sin((ry * Math.PI) / 180) * 70 + Math.sin((rx * Math.PI) / 180) * 30; // posição do brilho (%)
  const face: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: R, backfaceVisibility: "hidden", overflow: "hidden" };
  const metal = `repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0) 2px, rgba(0,0,0,0.04) 3px, rgba(255,255,255,0) 5px), linear-gradient(135deg, #8A5BEA 0%, ${COR.violeta} 22%, ${COR.roxo} 55%, #351672 100%)`;
  const reflexo = `linear-gradient(115deg, rgba(255,255,255,0) ${sheen - 26}%, rgba(255,255,255,${0.32 * brilho}) ${sheen}%, rgba(255,255,255,0) ${sheen + 22}%)`;
  return (
    <div style={{ width: W, height: H, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`, filter: foco ? `blur(${foco}px)` : undefined }}>
      {/* espessura */}
      {Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", inset: 0, borderRadius: R, background: i % 2 ? "#3B1C7C" : "#B89BF5", transform: `translateZ(${-esp + (i * esp) / 5}px)` }} />)}
      {/* frente */}
      <div style={{ ...face, background: metal, boxShadow: `inset 0 0 0 ${W * 0.003}px rgba(214,196,255,0.7), inset 0 ${W * 0.004}px ${W * 0.01}px rgba(255,255,255,0.25)` }}>
        {/* linha de ritmo gravada, muito sutil */}
        <svg width={W} height={H} viewBox="0 0 100 63" style={{ position: "absolute", inset: 0, opacity: 0.16 }} preserveAspectRatio="none">
          <path d="M-2 44 C 12 44, 18 30, 30 40 S 50 54, 62 38 S 84 24, 102 34" fill="none" stroke="#fff" strokeWidth={0.35} />
          <path d="M-2 48 C 12 48, 18 34, 30 44 S 50 58, 62 42 S 84 28, 102 38" fill="none" stroke="#fff" strokeWidth={0.2} />
        </svg>
        {/* símbolo em relevo: sombra + luz */}
        <div style={{ position: "absolute", left: W * 0.075, top: H * 0.12 }}>
          <div style={{ position: "absolute", left: 1.5, top: 2.5 }}><Simbolo largura={W * 0.2} cor="rgba(36,16,75,0.55)" /></div>
          <div style={{ position: "absolute", left: -1, top: -1 }}><Simbolo largura={W * 0.2} cor="rgba(255,255,255,0.5)" /></div>
          <Simbolo largura={W * 0.2} cor={COR.lavanda} />
        </div>
        {/* chip */}
        <div style={{ position: "absolute", left: W * 0.08, top: H * 0.47, width: W * 0.12, height: W * 0.09, borderRadius: W * 0.016, background: "linear-gradient(135deg,#EDE6FA,#B9A9DA 45%,#E8E0F7 60%,#9F8CC8)", boxShadow: "inset 0 0 0 1px rgba(60,30,110,0.35)" }}>
          <svg width="100%" height="100%" viewBox="0 0 12 9"><path d="M0 3h4M0 6h4M8 3h4M8 6h4M4 0v9M8 0v9M4 4.5h4" stroke="rgba(60,30,110,0.45)" strokeWidth={0.35} fill="none" /></svg>
        </div>
        {/* aproximação */}
        <svg width={W * 0.06} height={W * 0.06} viewBox="0 0 24 24" style={{ position: "absolute", left: W * 0.23, top: H * 0.5 }}>
          {[5, 9, 13].map((r) => <path key={r} d={`M${6 + r * 0.35} ${12 - r * 0.6} a ${r} ${r} 0 0 1 0 ${r * 1.2}`} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.6} strokeLinecap="round" />)}
        </svg>
        <div style={{ position: "absolute", left: W * 0.08, bottom: H * 0.11, fontFamily: FONTE_TEXTO, fontWeight: 500, fontSize: W * 0.04, letterSpacing: W * 0.004, color: "rgba(255,255,255,0.85)", fontVariantNumeric: "tabular-nums" }}>•••• 4821</div>
        <div style={{ position: "absolute", right: W * 0.075, bottom: H * 0.1 }}><Nome altura={W * 0.042} cor="rgba(255,255,255,0.92)" /></div>
        <div style={{ position: "absolute", inset: 0, background: reflexo }} />
      </div>
      {/* verso */}
      <div style={{ ...face, transform: "rotateY(180deg)", background: metal }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.12, height: H * 0.17, background: "#1A0D38" }} />
        <svg width={W} height={H} viewBox="0 0 100 63" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
          <path d="M8 46 C 22 46, 26 36, 36 42 S 54 52, 64 40 S 82 32, 92 38" fill="none" stroke={COR.lavanda} strokeWidth={0.6} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: reflexo }} />
      </div>
      {ang < 0 && null}
    </div>
  );
};
