// Faixas de áudio do comercial (arquivos em public/audio). Volumes lineares.
// Abertura só com o avião, antes da narração (segundos)
export const INTRO = 2.4;

export const AUDIO = {
  // Sobrevoo real de um Boeing (InspectorJ, CC BY 4.0): alto na abertura, some quando a voz entra
  aviao: {arquivo: "audio/aviao.mp3", volume: 1, fim: 3.9, fade: 1.6},
  narracao: {arquivo: "audio/narracao.mp3", volume: 1},
  // Raspberrymusic, "Technology Background Music" (CC BY 3.0). O arquivo em public/ já começa em 0,25 s da faixa,
  // para a entrada da parte cheia cair no começo do check-in (14,5 s).
  musica: {arquivo: "audio/musica.mp3", corte: 0, volume: 0.34, reducao: 0.42, fadeIn: 0.6, fadeOut: 1.8},
  efeitos: {arquivo: "audio/efeitos.mp3", volume: 1}, // faixa do Real SFX (já protegida sob a voz)
  fala: [[0, 1.3], [1.7, 5.8], [6.3, 10.6], [10.9, 14.1], [14.45, 18.95], [19.35, 20.5], [21.0, 24.65], [25.1, 28.05], [28.45, 30.15], [30.4, 33.5], [33.9, 36.0]],
};
