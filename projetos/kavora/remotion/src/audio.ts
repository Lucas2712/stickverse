// Desenho de som: cada efeito nasce de um evento visual (tempo derivado das mesmas palavras-chave).
// Arquivos: biblioteca do estúdio (studio/sons/earshot, MIT), normalizados em public/sfx/.
import {K} from './timing';

export type Cue = [file: string, at: number, gain: number];

const seq = (file: string, t0: number, n: number, step: number, gain: number): Cue[] =>
  Array.from({length: n}, (_, i) => [file, t0 + i * step, gain] as Cue);

export const CUES: Cue[] = [
  // 01 abertura
  ['whoosh_swish-soft', K.controlar - 0.05, 0.28],
  ['whoosh_swipe-glide', K.carro - 0.45, 0.42],
  ['foley_fit-land-light-finger-wood', K.carro - 0.05, 0.3],
  // 02 problema: cartões desabam
  ...seq('pop_ui-pop-soft', K.nao + 0.12, 5, 0.075, 0.34),
  ['whoosh_whoosh-fast-sleeve', K.nao - 0.05, 0.32],
  ['click_pro-click-glass', K.nao + 0.45, 0.5],
  ['whoosh_swipe-paper', K.complicado + 0.18, 0.36],
  // 03 solução
  ['whoosh_pro-whoosh-big-swell', K.com - 0.42, 0.5],
  ['impact_pro-impact-air', K.com + 0.12, 0.55],
  ['chime_logo-sting-soft-bloom', K.kavora + 0.02, 0.45],
  ['chime_pro-shimmer-m2', K.kavora + 0.4, 0.22],
  ['whoosh_swish-flick', K.combustivel - 0.15, 0.32],
  ['click_pro-hover-tick-soft', K.combustivel + 0.05, 0.42],
  ['whoosh_swish-flick', K.manutencao - 0.15, 0.3],
  ['click_pro-hover-tick-soft', K.manutencao + 0.05, 0.42],
  ['whoosh_swish-flick', K.seguro - 0.15, 0.3],
  ['click_pro-hover-tick-soft', K.seguro + 0.05, 0.42],
  ['whoosh_swish-flick', K.impostos - 0.15, 0.3],
  ['click_pro-hover-tick-soft', K.impostos + 0.05, 0.42],
  ['whoosh_swish-flick', K.revisoes - 0.15, 0.3],
  ['click_pro-hover-tick-soft', K.revisoes + 0.05, 0.42],
  ['riser_reverse-swell-short', K.unico - 0.45, 0.32],
  ...seq('pop_pro-pop-in-round', K.unico + 0.02, 5, 0.06, 0.3),
  ['pop_pro-pop-in-deep', K.aplicativo - 0.15, 0.55],
  ['whoosh_whoosh-big-thump-deep', K.tenha - 0.45, 0.55],
  // 04 gestão (escuro)
  ['whoosh_swipe-velvet', K.controle - 0.22, 0.42],
  ...seq('click_hover-tick-mid', K.controle + 0.15, 4, 0.12, 0.28),
  ['whoosh_swish-soft', K.historico - 0.2, 0.42],
  ['riser_pro-riser-nblips-hi', K.historico + 0.05, 0.16],
  ['whoosh_whoosh-fast-tight', K.economizar - 0.2, 0.5],
  ['impact_cut-hit-air', K.economizar + 0.12, 0.32],
  ['whoosh_whoosh-fast-crisp', K.mesames - 0.3, 0.42],
  ['riser_pro-riser-roll', K.mesames + 0.05, 0.22],
  ['chime_pro-notify-ding-2045', K.mesames + 0.85, 0.3],
  // 05 mobile (laranja)
  ['riser_riser-swell', K.tudo - 1.3, 0.3],
  ['impact_impact-swell', K.tudo - 0.05, 0.55],
  ...seq('pop_ui-pop-blip', K.tudo - 0.3, 3, 0.11, 0.2),
  ['whoosh_swipe-paper', K.tudo + 0.18, 0.34],
  ['whoosh_pro-whoosh-big-tonal', K.palma - 0.25, 0.45],
  ['foley_fit-land-light-finger-phone', K.palma + 0.25, 0.38],
  // 06 inteligência
  ['whoosh_whoosh-big-gust', K.alertas - 0.5, 0.45],
  ['chime_notify-m2', K.alertas - 0.22, 0.5],
  ...seq('click_hover-tick-ping', K.inteligentes - 0.08, 4, 0.22, 0.3),
  ['pop_pro-pop-in-double', K.revisao - 0.1, 0.5],
  ['click_fit-tick-domino', K.revisao + 0.1, 0.3],
  ['chime_pro-notify-ding-2296', K.revisao + 0.32, 0.5],
  ['riser_reverse-swell-cymbal', K.kavora2 - 0.95, 0.35],
  // 07 destaque
  ['impact_pro-impact-deep', K.kavora2 - 0.12, 0.7],
  ...seq('click_click-thock', K.kavora2 + 0.12, 6, 0.055, 0.22),
  ['whoosh_pro-whoosh-big-windy', K.kavora2 + 0.4, 0.32],
  // 08 encerramento
  ['whoosh_swish-soft', K.tecnologia - 0.25, 0.4],
  ['chime_logo-sting-whoosh-glass', K.tecnologia - 0.02, 0.45],
  ['whoosh_swipe-glide', K.caminho - 0.05, 0.28],
  ['pop_ui-pop-wide', K.baixe - 0.08, 0.45],
  ['chime_pro-shimmer-m1', K.fim + 0.2, 0.25],
];

export const SFX_FILES = Array.from(new Set(CUES.map((c) => c[0])));
