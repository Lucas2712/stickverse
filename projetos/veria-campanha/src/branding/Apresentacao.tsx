// Peças da apresentação da marca: animação do símbolo (linha → fita → marca) e still da fita 3D.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Fita3D } from "./Fita3D";
import { COR, Nome, larguraNome } from "./Marca";
import { Fontes } from "../components/Fontes";
import { senoide, simbolo, morph, tracoSimbolo } from "../components/linha";
import { p, ease, lerp, janela } from "../anim";

export const EstudoSimbolo: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L = 620, cx = 540, cy = 470;
  const alvo = simbolo(0, 0, L);
  const onda = senoide(-560, 560, 0, 34, 3, t * 4);
  const k = p(t, 0.8, 2.2, ease.io3);
  const pts = morph(onda, alvo, k, 0.35).map(([x, y]) => [x, y, 0] as [number, number, number]);
  const larg = lerp(10, tracoSimbolo(L), p(t, 1.6, 2.6, ease.out3));
  const giro = janela(t, 2.0, 4.0, 0.6, 1.0);
  const nome = p(t, 3.4, 4.4, ease.out5);
  const alturaNome = 92;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, ${COR.roxo} 0%, ${COR.profundo} 75%)` }}>
      <Fontes />
      <Fita3D id="estudo" pontos={pts} cx={cx} cy={cy} largura={larg} ry={giro * -22 * Math.sin(t * 1.4)} rx={giro * 10}
        torcao={(u) => giro * 1.1 * Math.sin(u * Math.PI * 2 - t * 3.2)} luz={Math.sin(t * 1.3) * 0.6} sombra={0.5} />
      <div style={{ position: "absolute", left: 540 - larguraNome(alturaNome) / 2, top: 860, opacity: nome, transform: `translateY(${(1 - nome) * 40}px)` }}>
        <Nome altura={alturaNome} cor={COR.branco} acento={p(t, 3.9, 4.6, ease.io3)} />
      </div>
    </AbsoluteFill>
  );
};

export const Fita3DStill: React.FC = () => {
  const L = 1100;
  const pts = simbolo(0, 0, L).map(([x, y]) => [x, y, 0] as [number, number, number]);
  return (
    <AbsoluteFill style={{ background: COR.offwhite }}>
      <Fita3D id="still" pontos={pts} cx={800} cy={760} largura={tracoSimbolo(L)} ry={-24} rx={12} rz={-2}
        torcao={(u) => 0.5 * Math.sin(u * Math.PI * 2.2 + 0.6)} luz={0.2} sombra={0.32} />
    </AbsoluteFill>
  );
};
