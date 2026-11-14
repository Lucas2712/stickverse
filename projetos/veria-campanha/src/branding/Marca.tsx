// Componentes centrais da identidade VÉRIA. Toda aparição da marca no filme passa por aqui.
import React from "react";
import M from "./marca.json";

export const COR = M.cores as Record<"profundo" | "roxo" | "violeta" | "lavanda" | "offwhite" | "branco" | "cinza", string>;
export const FONTE_DISPLAY = "'VDisplay', 'Inter Display', 'Inter', sans-serif";
export const FONTE_TEXTO = "'VText', 'Inter', sans-serif";

const [sx0, sy0, sx1, sy1] = M.simbolo.caixa;
export const SIMBOLO = { d: M.simbolo.d, traco: M.simbolo.traco, pontos: M.simbolo.pontos as [number, number][], caixa: M.simbolo.caixa, larg: sx1 - sx0, alt: sy1 - sy0 };

// Símbolo plano. `desenho` (0..1) desenha o traço do início ao fim.
export const Simbolo: React.FC<{ largura: number; cor?: string; desenho?: number; style?: React.CSSProperties; traco?: number }> = ({ largura, cor = COR.roxo, desenho = 1, style, traco }) => {
  const alt = (largura * SIMBOLO.alt) / SIMBOLO.larg;
  return (
    <svg width={largura} height={alt} viewBox={`${sx0} ${sy0} ${SIMBOLO.larg} ${SIMBOLO.alt}`} style={{ overflow: "visible", ...style }}>
      <path d={SIMBOLO.d} fill="none" stroke={cor} strokeWidth={traco ?? SIMBOLO.traco} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray={desenho < 1 ? `${Math.max(0.0001, desenho)} 2` : undefined} />
    </svg>
  );
};

// Nome VÉRIA (contornos do Inter Display Semibold com espaçamento próprio + acento-onda).
// letra(i) devolve a animação de cada letra; acento (0..1) desenha o acento.
type AnimLetra = { y?: number; x?: number; opacity?: number; blur?: number; escala?: number };
export const Nome: React.FC<{ altura: number; cor?: string; corAcento?: string; letra?: (i: number) => AnimLetra; acento?: number; style?: React.CSSProperties }> = ({ altura, cor = COR.profundo, corAcento, letra, acento = 1, style }) => {
  const N = M.nome;
  const topo = N.topo, alturaU = -topo; // da linha de base até o topo do acento
  const escala = altura / N.cap;        // altura = altura das maiúsculas em px
  const largura = N.largura * escala;
  const A = N.acento;
  return (
    <svg width={largura} height={alturaU * escala} viewBox={`0 ${topo} ${N.largura} ${alturaU}`} style={{ overflow: "visible", ...style }}>
      {N.letras.map((l, i) => {
        const a = letra ? letra(i) : {};
        const cx = (l.l + l.r) / 2;
        return (
          <g key={i} opacity={a.opacity ?? 1} style={a.blur ? { filter: `blur(${a.blur}px)` } : undefined}
            transform={`translate(${(a.x ?? 0) / escala} ${(a.y ?? 0) / escala}) translate(${cx} ${-N.cap / 2}) scale(${a.escala ?? 1}) translate(${-cx} ${N.cap / 2})`}>
            <path transform={`translate(${l.x} 0)`} d={l.d} fill={cor} />
          </g>
        );
      })}
      <path transform={`translate(${A.tx} ${A.ty}) scale(${A.esc})`} d={A.d} fill="none" stroke={corAcento ?? cor} strokeWidth={A.traco}
        strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={acento < 1 ? `${Math.max(0.0001, acento)} 2` : undefined} opacity={acento > 0 ? 1 : 0} />
    </svg>
  );
};

export const larguraNome = (altura: number) => (M.nome.largura * altura) / M.nome.cap;
export const alturaNomeTotal = (altura: number) => (-M.nome.topo * altura) / M.nome.cap;
