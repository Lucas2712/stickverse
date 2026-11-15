// Tempos (s) das palavras-chave da narração. Toda a timeline deriva daqui.
// `ferramentas/sincronizar.js` reescreve timing.json a partir de ../palavras.json
// (transcrição da narração real); sem ele, valem as estimativas pelo ritmo da referência.
import data from './timing.json';

export type Keys =
  | 'gerenciar' | 'hotel' | 'nao' | 'complicado'
  | 'com' | 'tecnologia' | 'voce' | 'tudo1' | 'precisa' | 'lugar'
  | 'reservas' | 'recepcao' | 'financeiro' | 'compras' | 'operacao'
  | 'integrado' | 'simplificar' | 'rotina'
  | 'controle' | 'processos' | 'agilidade' | 'decisoes' | 'tempo' | 'cuidar' | 'importa'
  | 'gestao' | 'inteligente' | 'comeca' | 'conectado'
  | 'kavora' | 'slogan' | 'simplificar2' | 'gestao2' | 'fim';

export const K = data.words as Record<Keys, number>;
export const DURATION = data.duration as number;
export const HAS_VOICE = data.voice as boolean;

