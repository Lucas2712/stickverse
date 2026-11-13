// Linha do tempo mestre. Cada fala é um arquivo inteiro da ElevenLabs (sem cortes, sem aceleração);
// N[i] = segundo em que a fala da cena i+1 começa. As cenas leem os tempos das palavras daqui.
import P from './palavras.json';
import M from './musica.json';
export const N = M.N;                 // falas deslocadas só nos respiros, para casar com a música
export const DURACAO = M.DURACAO;
export const MUS = M;                 // V2 = íris do logo · V3 = virada brilhante · V4 = bússola final
// B(t): leva um evento VISUAL para a batida mais próxima (até ±0,26 s); a fala nunca é mexida
export const B = (t, tol = 0.26) => { let best = t, d = tol; for (const b of M.beats) { const e = Math.abs(b - t); if (e < d) { d = e; best = b; } } return best; };
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]/g, '');
// W(cena, 'palavra', ocorrência=1) → segundo absoluto do início da palavra
export const W = (c, palavra, k = 1) => {
  const ws = P[c - 1].palavras; let n = 0;
  for (const w of ws) if (norm(w.w) === norm(palavra) && ++n === k) return N[c - 1] + w.s;
  throw new Error(`palavra não encontrada: cena ${c} «${palavra}» #${k}`);
};
export const WE = (c, palavra, k = 1) => {      // fim da palavra
  const ws = P[c - 1].palavras; let n = 0;
  for (const w of ws) if (norm(w.w) === norm(palavra) && ++n === k) return N[c - 1] + w.e;
  throw new Error(`palavra não encontrada: cena ${c} «${palavra}»`);
};
export const FIM = (c) => N[c - 1] + P[c - 1].palavras.at(-1).e;
