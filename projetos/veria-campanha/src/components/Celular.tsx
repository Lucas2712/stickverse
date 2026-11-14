// Smartphone premium genérico (sem copiar aparelhos reais): corpo em alumínio grafite-violeta,
// tela de vidro com reflexo, câmera frontal em furo, espessura real em 3D, luz de borda lavanda.
import React from "react";

export const LOGICA = { w: 390, h: 844 }; // tela lógica da interface

export const Celular: React.FC<{ largura: number; rx?: number; ry?: number; rz?: number; reflexo?: number; children: React.ReactNode; sombra?: number }> = ({ largura, rx = 0, ry = 0, rz = 0, reflexo = 0, children, sombra = 1 }) => {
  const W = largura, H = W * 2.06, R = W * 0.155, borda = W * 0.028, esp = W * 0.05;
  const telaW = W - 2 * borda, escala = telaW / LOGICA.w, telaH = LOGICA.h * escala;
  const camada = (z: number, cor: string, extra: React.CSSProperties = {}) => (
    <div style={{ position: "absolute", inset: 0, borderRadius: R, background: cor, transform: `translateZ(${z}px)`, ...extra }} />
  );
  return (
    <div style={{ width: W, height: H, position: "relative", transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {/* sombra tingida de roxo */}
      <div style={{ position: "absolute", left: W * 0.06, right: W * 0.06, top: H * 0.06, bottom: -H * 0.02, borderRadius: R, background: "rgba(18,6,42,0.55)", filter: `blur(${W * 0.09}px)`, transform: `translateZ(${-esp - 40}px) translateY(${W * 0.08}px)`, opacity: sombra }} />
      {/* espessura: lâminas do corpo */}
      {Array.from({ length: 6 }, (_, i) => camada(-esp + (i * esp) / 6, i < 3 ? "#1A1424" : "#2B2340"))}
      {/* corpo frontal */}
      {camada(0, "linear-gradient(135deg,#5B4E78 0%,#2E2640 22%,#1E1830 60%,#3A3052 100%)", { boxShadow: "inset 0 0 0 1.5px rgba(214,196,255,0.55), inset 0 0 0 4px rgba(20,14,32,0.9)" })}
      {/* botões laterais */}
      <div style={{ position: "absolute", right: -W * 0.012, top: H * 0.25, width: W * 0.014, height: H * 0.1, borderRadius: 4, background: "linear-gradient(90deg,#3A3050,#6C5E8C)" }} />
      <div style={{ position: "absolute", left: -W * 0.012, top: H * 0.2, width: W * 0.014, height: H * 0.06, borderRadius: 4, background: "linear-gradient(270deg,#3A3050,#6C5E8C)" }} />
      <div style={{ position: "absolute", left: -W * 0.012, top: H * 0.28, width: W * 0.014, height: H * 0.06, borderRadius: 4, background: "linear-gradient(270deg,#3A3050,#6C5E8C)" }} />
      {/* tela */}
      <div style={{ position: "absolute", left: borda, top: borda, width: telaW, height: H - 2 * borda, borderRadius: R - borda, overflow: "hidden", background: "#000", transform: "translateZ(1px)" }}>
        <div style={{ width: LOGICA.w, height: LOGICA.h, transform: `scale(${escala})`, transformOrigin: "0 0", position: "absolute", top: (H - 2 * borda - telaH) / 2 }}>{children}</div>
        {/* câmera frontal */}
        <div style={{ position: "absolute", left: "50%", top: W * 0.035, width: W * 0.034, height: W * 0.034, marginLeft: -W * 0.017, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#3B3550 0%,#07060B 60%)", boxShadow: "0 0 0 2px #0B0910" }} />
        {/* reflexo do vidro */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${118 + reflexo * 20}deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) ${22 + reflexo * 10}%, rgba(255,255,255,0) ${34 + reflexo * 10}%)`, pointerEvents: "none" }} />
      </div>
    </div>
  );
};
