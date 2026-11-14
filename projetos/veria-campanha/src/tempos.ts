// TEMPOS CENTRALIZADOS. Tudo vem da transcrição real da narração (tempos-narracao.json),
// já com os respiros inseridos entre blocos (ver ferramentas/README e transcricao.md).
import N from "./tempos-narracao.json";
export const FPS = 30;
export const DURACAO = N.duracao; // 71 s
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]/g, ""); // mantém maiúsculas: «E» ≠ «é», «Seu» ≠ «seu»
const pal = (txt: string, n = 0) => {
  const m = N.palavras.filter((p) => norm(p.w) === norm(txt));
  if (!m[n]) throw new Error("palavra não encontrada: " + txt + " #" + n);
  return m[n];
};
const s = (txt: string, n = 0) => pal(txt, n).s;
const e = (txt: string, n = 0) => pal(txt, n).e;

export const W = {
  tudo: s("Tudo"), ritmo: s("ritmo"),
  dia: s("dia"), trabalho: s("trabalho"), escolhas: s("escolhas"),
  mas: s("Mas"), dinheiro: s("dinheiro"), quase: s("quase"), acompanha: s("acompanha"), acompanhaFim: e("acompanha"),
  contas: s("Contas"), hora: s("hora"), gastos: s("Gastos"), percebe: s("percebe"), depois: s("depois"),
  objetivos: s("Objetivos"), mes: s("mês"), vem: s("vem"), vemFim: e("vem"),
  ese: s("E", 0), entrasse: s("entrasse"), compasso: s("compasso"),
  esta: s("Esta"), veria: s("Véria"),
  uma: s("Uma"), experiencia: s("experiência"), clareza: s("clareza"), vai: s("vai"),
  saldo: s("saldo"), olhar: s("olhar"),
  entradas: s("Entradas"), saidas: s("saídas"), ladoFim: e("lado", 1),
  cada: s("Cada"), gasto: s("gasto"), lugar: s("lugar"), certo: s("certo"),
  seus: s("Seus"), objetivos2: s("objetivos", 0), forma: s("forma"),
  evolucao: s("evolução"), mesames: s("mês", 1), fica: s("fica"), visivel: s("visível"),
  pressa: s("Sem", 0), ruido: s("Sem", 1), jeito: s("Do"), jeitoFim: e("jeito"),
  veriaFim: s("Véria", 1), seuDinheiro: s("Seu", 1), seuRitmo: s("Seu", 2), ritmoFim: e("ritmo"),
};

// batidas da trilha de abertura (onsets medidos no stem 01-pulso-escuro, que começa em 0 s)
export const BATIDAS = [0.92, 2.12, 3.28, 4.48];
export const CONGELA = 19.72;      // tudo para no ar, logo depois de «vem»
export const ASSINATURA_INICIO = 59.9; // stem 08: picos medidos em +0,24 / +1,04 / +2,42 s

// janelas das cenas [início, fim] (as cenas se sobrepõem ~0,3 s nas trocas)
export const CENAS = {
  pulso: [0, 4.7], ritmos: [4.3, 9.05], foraCompasso: [8.95, 12.6], ruido: [12.45, 20.0],
  ese: [CONGELA, 24.9], revelacao: [24.2, 29.7], cartao: [29.2, 35.3], saldo: [34.9, 38.0],
  entradas: [37.7, 40.6], gasto: [40.35, 43.1], objetivos: [42.85, 46.7], evolucao: [46.2, 54.0],
  jeito: [53.6, 60.0], assinatura: [59.4, DURACAO],
} as const;
