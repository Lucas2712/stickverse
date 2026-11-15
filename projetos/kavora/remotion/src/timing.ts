// Tempos (s) das palavras-chave da narração. Toda a timeline deriva daqui.
// `ferramentas/sincronizar.js` reescreve timing.json a partir de ../palavras.json
// (transcrição da narração real); sem ele, valem as estimativas pelo ritmo da referência.
import data from './timing.json';

export type Keys =
  | 'controlar' | 'gastos' | 'carro' | 'nao' | 'complicado'
  | 'com' | 'kavora' | 'combustivel' | 'manutencao' | 'seguro' | 'impostos' | 'revisoes' | 'unico' | 'aplicativo'
  | 'tenha' | 'controle' | 'historico' | 'economizar' | 'mesames'
  | 'tudo' | 'palma' | 'alertas' | 'inteligentes' | 'revisao'
  | 'kavora2' | 'tecnologia' | 'acompanha' | 'caminho' | 'baixe' | 'assuma' | 'fim';

export const K = data.words as Record<Keys, number>;
export const DURATION = data.duration as number;
export const HAS_VOICE = data.voice as boolean;

// Limites das cenas (s): cada cena começa um pouco antes da palavra que a dispara.
export const S = {
  s1: [0, K.nao + 0.05],
  s2: [K.nao - 0.12, K.com - 0.05],
  s3: [K.com - 0.3, K.tenha - 0.1],
  s4: [K.tenha - 0.35, K.tudo + 0.05],
  s5: [K.tudo - 0.4, K.alertas + 0.25],
  s6: [K.alertas - 0.2, K.kavora2 + 0.15],
  s7: [K.kavora2 - 0.2, K.tecnologia + 0.3],
  s8: [K.tecnologia - 0.1, 99],
} as const;
