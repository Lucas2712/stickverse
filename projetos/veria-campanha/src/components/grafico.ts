// Gráfico de evolução (cena 12): pontos no "mundo" e a câmera que viaja por eles.
import { W } from "../tempos";
import { curva, Pts } from "./linha";
import { p, ease, lerp } from "../anim";

export const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
// valores demonstrativos (forma da curva, sem escala monetária)
const V = [0.16, 0.24, 0.2, 0.31, 0.27, 0.38, 0.35, 0.46, 0.42, 0.53, 0.6, 0.7];
export const PASSO = 300;                      // distância entre meses no mundo
export const mundoX = (i: number) => 200 + i * PASSO;
export const mundoY = (v: number) => 1420 - v * 980;
export const CTRL: [number, number][] = V.map((v, i) => [mundoX(i), mundoY(v)]);
export const MUNDO = curva(CTRL);
export const MUNDO_X0 = mundoX(0), MUNDO_X1 = mundoX(11);

// câmera: viaja da esquerda para a direita e, em «visível», recua para mostrar a curva inteira
export function camera(t: number) {
  const viagem = p(t, W.evolucao - 0.5, W.visivel - 0.1, ease.ioSine);
  const recuo = p(t, W.visivel - 0.15, W.visivel + 1.3, ease.io3);
  const camX = lerp(lerp(MUNDO_X0 + 140, MUNDO_X1 - 260, viagem), (MUNDO_X0 + MUNDO_X1) / 2, recuo);
  const sx = lerp(1, 860 / (MUNDO_X1 - MUNDO_X0), recuo);
  const sy = lerp(1, 0.72, recuo);
  const cy = lerp(0, 120, recuo);
  return { camX, sx, sy, cy };
}
export const paraTela = (x: number, y: number, c: ReturnType<typeof camera>): [number, number] => [540 + (x - c.camX) * c.sx, 960 + (y - 960) * c.sy + c.cy];
export const graficoTela = (t: number): Pts => { const c = camera(t); return MUNDO.map(([x, y]) => paraTela(x, y, c)); };
