// Desenho de som: cada efeito nasce de um evento visual (tempo derivado das mesmas palavras-chave).
// Arquivos: biblioteca do estúdio (studio/sons/earshot, MIT), normalizados em public/sfx/.
import {K} from './timing';

export type Cue = [file: string, at: number, gain: number];

const seq = (file: string, t0: number, n: number, step: number, gain: number): Cue[] =>
  Array.from({length: n}, (_, i) => [file, t0 + i * step, gain] as Cue);

export const CUES: Cue[] = [
  // 01–02 abertura e problema
  ['whoosh_swish-soft', K.gerenciar + 0.02, 0.26],
  ['whoosh_swipe-glide', K.hotel - 0.4, 0.4],
  ['chime_fit-bell-small-bell', K.hotel + 0.05, 0.32],
  ['whoosh_whoosh-fast-sleeve', K.nao - 0.05, 0.3],
  ...seq('pop_ui-pop-soft', K.nao + 0.14, 5, 0.075, 0.32),
  ['click_pro-click-glass', K.nao + 0.45, 0.45],
  ['whoosh_swipe-paper', K.complicado + 0.18, 0.34],
  // 03 solução
  ['whoosh_pro-whoosh-big-swell', K.com - 0.42, 0.48],
  ['impact_pro-impact-air', K.com + 0.12, 0.52],
  ['chime_logo-sting-soft-bloom', K.tecnologia + 0.02, 0.42],
  ['chime_pro-shimmer-m2', K.tecnologia + 0.42, 0.2],
  ['whoosh_swish-soft', K.voce - 0.28, 0.32],
  ['pop_pro-pop-in-round', K.tudo1, 0.3],
  ['pop_ui-pop-wide', K.lugar - 0.18, 0.45],
  ['whoosh_swish-flick', K.reservas - 0.17, 0.3],
  ['click_pro-hover-tick-soft', K.reservas + 0.02, 0.4],
  ['whoosh_swish-flick', K.recepcao - 0.17, 0.3],
  ['click_pro-hover-tick-soft', K.recepcao + 0.02, 0.4],
  ['whoosh_swish-flick', K.financeiro - 0.17, 0.3],
  ['click_pro-hover-tick-soft', K.financeiro + 0.02, 0.4],
  ['whoosh_swish-flick', K.compras - 0.17, 0.28],
  ['click_pro-hover-tick-soft', K.compras + 0.02, 0.38],
  ['click_pro-hover-tick-soft', K.operacao + 0.02, 0.38],
  ['riser_reverse-swell-short', K.integrado - 0.6, 0.3],
  ...seq('pop_pro-pop-in-round', K.integrado - 0.12, 5, 0.06, 0.26),
  ['pop_pro-pop-in-deep', K.integrado + 0.02, 0.5],
  ['whoosh_whoosh-big-thump-deep', K.controle - 0.48, 0.52],
  // 04 escuro
  ['whoosh_swipe-velvet', K.processos - 0.22, 0.4],
  ...seq('click_hover-tick-mid', K.processos + 0.05, 4, 0.13, 0.26),
  ['whoosh_swish-soft', K.agilidade - 0.18, 0.4],
  ['riser_pro-riser-nblips-hi', K.agilidade + 0.05, 0.14],
  ['whoosh_whoosh-fast-tight', K.decisoes - 0.55, 0.48],
  ['click_pro-click-mouse', K.decisoes + 0.05, 0.5],
  ['chime_pro-notify-ding-2045', K.decisoes + 0.15, 0.32],
  ['whoosh_whoosh-fast-crisp', K.tempo - 0.25, 0.4],
  ...seq('click_hover-tick-ping', K.tempo + 0.0, 4, 0.22, 0.28),
  ['whoosh_swish-soft', K.cuidar - 0.2, 0.36],
  ['riser_pro-riser-roll', K.cuidar, 0.2],
  // 05–06 laranja
  ['riser_riser-swell', K.gestao - 1.3, 0.28],
  ['impact_impact-swell', K.gestao - 0.08, 0.5],
  ...seq('pop_ui-pop-blip', K.gestao - 0.3, 3, 0.11, 0.18),
  ['whoosh_swipe-paper', K.inteligente + 0.12, 0.32],
  ['whoosh_pro-whoosh-big-tonal', K.comeca - 0.35, 0.42],
  ['foley_fit-land-light-finger-phone', K.comeca + 0.2, 0.34],
  ['whoosh_swipe-glide', K.conectado - 0.05, 0.3],
  ['chime_notify-m2', K.conectado + 0.35, 0.45],
  ['whoosh_whoosh-big-gust', K.kavora - 0.65, 0.42],
  ['riser_reverse-swell-cymbal', K.kavora - 0.95, 0.3],
  // 07 destaque
  ['impact_pro-impact-deep', K.kavora - 0.1, 0.65],
  ...seq('click_click-thock', K.kavora + 0.12, 6, 0.055, 0.2),
  ['whoosh_pro-whoosh-big-windy', K.kavora + 0.4, 0.3],
  // 08 encerramento
  ['whoosh_swish-soft', K.slogan - 0.25, 0.38],
  ['chime_logo-sting-whoosh-glass', K.slogan - 0.02, 0.42],
  ['whoosh_swipe-glide', K.simplificar2 - 0.05, 0.26],
  ['pop_ui-pop-wide', K.gestao2 - 0.3, 0.4],
];

export const SFX_FILES = Array.from(new Set(CUES.map((c) => c[0])));
