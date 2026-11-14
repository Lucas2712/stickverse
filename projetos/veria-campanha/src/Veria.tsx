// VÉRIA · Seu dinheiro. Seu ritmo. Composição principal (1080 × 1920, 30 fps).
// Ordem das camadas: fundos das cenas ativas → linha de ritmo → frentes das cenas ativas.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CENAS, FPS } from "./tempos";
import { Fontes } from "./components/Fontes";
import { LinhaRitmo } from "./scenes/LinhaRitmo";
import * as A1 from "./scenes/Ato1";
import * as A2 from "./scenes/Ato2";
import * as A3 from "./scenes/Ato3";
import { Trilha } from "./audio/Trilha";
import { COR } from "./branding/Marca";

type C = React.FC<{ t: number }>;
const CLARO: C = () => <A1.FundoClaro />;
const ROTEIRO: { janela: readonly [number, number]; fundo?: C; frente?: C; linhaNaFrente?: boolean }[] = [
  { janela: CENAS.pulso, fundo: A1.FundoPulso, frente: A1.FrentePulso },
  { janela: CENAS.ritmos, fundo: A1.FundoRitmos, frente: A1.FrenteRitmos },
  { janela: CENAS.foraCompasso, fundo: CLARO, frente: A1.FrenteFora },
  { janela: CENAS.ruido, fundo: CLARO, frente: A1.FrenteRuido },
  { janela: CENAS.ese, fundo: A1.FundoESe, frente: A1.FrenteESe },
  { janela: CENAS.revelacao, fundo: A2.FundoRevela, frente: A2.FrenteRevela },
  { janela: CENAS.cartao, fundo: A2.FundoCartao, frente: A2.FrenteCartao },
  { janela: CENAS.saldo, fundo: A2.FundoSaldo, frente: A2.FrenteSaldo },
  { janela: CENAS.entradas, fundo: CLARO, frente: A2.FrenteFluxo },
  { janela: CENAS.gasto, fundo: CLARO, frente: A2.FrenteGasto },
  { janela: CENAS.objetivos, fundo: A2.FundoObjetivos, frente: A2.FrenteObjetivos },
  { janela: CENAS.evolucao, fundo: A3.FundoEvolucao, frente: A3.FrenteEvolucao },
  { janela: CENAS.jeito, fundo: A3.FundoJeito, frente: A3.FrenteJeito },
  { janela: CENAS.assinatura, fundo: A3.FundoAssinatura, frente: A3.FrenteAssinatura },
];

export const Veria: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  // quando duas cenas se sobrepõem, o fundo da mais nova entra por cima com uma passagem curta
  const ativos = ROTEIRO.filter((c) => t >= c.janela[0] && t < c.janela[1]);
  return (
    <AbsoluteFill style={{ background: COR.profundo, overflow: "hidden" }}>
      <Fontes />
      {ativos.map((c, i) => {
        const F = c.fundo;
        const entra = Math.min(1, (t - c.janela[0]) / 0.3);
        return F ? <AbsoluteFill key={"f" + c.janela[0]} style={{ opacity: i === 0 ? 1 : entra }}><F t={t} /></AbsoluteFill> : null;
      })}
      <LinhaRitmo t={t} />
      {ativos.map((c) => { const F = c.frente; return F ? <F key={"x" + c.janela[0]} t={t} /> : null; })}
      <Trilha />
    </AbsoluteFill>
  );
};
