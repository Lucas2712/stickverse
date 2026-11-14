// Ícones VÉRIA: grade de 24, traço de 2 px com pontas redondas, cantos de raio 6
// e um ponto lavanda em cada ícone (o pulso da marca).
import React from "react";
import { COR } from "../branding/Marca";

const D: Record<string, { d: string; ponto: [number, number] }> = {
  casa: { d: "M4 11.2 12 4.5l8 6.7V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z", ponto: [12, 10] },
  mercado: { d: "M3 4.5h2.4l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.4-1.1L20 8H6.4M9.5 20h.01M16.5 20h.01", ponto: [13.2, 11.6] },
  transporte: { d: "M6.5 4h11A2.5 2.5 0 0 1 20 6.5V16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5A2.5 2.5 0 0 1 6.5 4zM4 11h16M7.5 17v2.5M16.5 17v2.5", ponto: [12, 7.6] },
  lazer: { d: "M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5zM14 6v12", ponto: [9, 12] },
  entrada: { d: "M17 7 7.5 16.5M7 9.5v7.5h7.5", ponto: [17.5, 6.5] },
  saida: { d: "M7 17 16.5 7.5M9.5 7H17v7.5", ponto: [6.5, 17.5] },
  alvo: { d: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", ponto: [12, 12] },
  viagem: { d: "M10.5 13.5 4 11l1.5-1.5 7.5.5 3.8-3.8a1.8 1.8 0 0 1 2.5 2.5L15.5 12.5l.5 7.5-1.5 1.5-2.5-6.5L9 17.8V20l-1.2 1.2L6.5 17.5 2.8 16.2 4 15h2.2z", ponto: [18.6, 5.6] },
  reserva: { d: "M12 3.5 19 6v5.6c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z", ponto: [12, 11.5] },
  curso: { d: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15.5H5.5A1.5 1.5 0 0 1 4 18zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15.5h5.5a1.5 1.5 0 0 0 1.5-1.5z", ponto: [16.5, 8.5] },
  extrato: { d: "M6 3.5h12v17l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6L6 20.5zM9 8.5h6M9 12h6M9 15.5h3", ponto: [15, 15.5] },
  grafico: { d: "M4 19.5h16M6.5 15.5l4-4.5 3 2.5 4.5-6", ponto: [18, 7.5] },
  perfil: { d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0", ponto: [12, 8] },
  conta: { d: "M7 3.5h7.5L18 7v12a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5zM14 3.5V7.5h4M8.5 12h7M8.5 15.5h5", ponto: [8.5, 8] },
  luz: { d: "M13.5 3 5.5 13.5H12l-1.5 7.5 8-10.5H12z", ponto: [17, 6] },
  wifi: { d: "M3.5 9.5a12 12 0 0 1 17 0M6.5 12.8a7.5 7.5 0 0 1 11 0M9.5 16a3 3 0 0 1 5 0", ponto: [12, 19] },
  sino: { d: "M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5zM10 20.5h4", ponto: [17.5, 5.5] },
  olho: { d: "M2.8 12S6 6 12 6s9.2 6 9.2 6-3.2 6-9.2 6S2.8 12 2.8 12zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", ponto: [12, 12] },
  cartao: { d: "M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM3 10h18", ponto: [17, 14.5] },
};
export type NomeIcone = keyof typeof D;

export const Icone: React.FC<{ nome: NomeIcone; tam: number; cor?: string; corPonto?: string; traco?: number; style?: React.CSSProperties }> = ({ nome, tam, cor = COR.profundo, corPonto = COR.lavanda, traco = 2, style }) => {
  const ic = D[nome];
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" style={style}>
      <path d={ic.d} fill="none" stroke={cor} strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ic.ponto[0]} cy={ic.ponto[1]} r={1.7} fill={corPonto} />
    </svg>
  );
};
