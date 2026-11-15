// Identidade KAVORA: paleta fechada (nenhuma cor fora desta lista) e tipografia.
export const C = {
  white: '#FFFFFF',
  off: '#F7F7F5',
  graphite: '#202124',
  black: '#111111',
  orange: '#FF7138',
  orangeL: '#FFA36B',
  gray: '#E8E8E6',
} as const;

// Inter 4 variável (OFL) com eixo de tamanho óptico: textos grandes usam o desenho "Display"
// e textos pequenos o desenho "Text" automaticamente (font-optical-sizing: auto).
export const FONT = 'InterK, sans-serif';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Sombras em camadas (contato + ambiente), sempre em grafite translúcido.
export const SHADOW = {
  card: '0 2px 4px rgba(32,33,36,0.04), 0 14px 28px rgba(32,33,36,0.07), 0 40px 80px rgba(32,33,36,0.09)',
  float: '0 4px 10px rgba(32,33,36,0.06), 0 30px 60px rgba(32,33,36,0.12), 0 80px 140px rgba(32,33,36,0.10)',
  dark: '0 20px 50px rgba(0,0,0,0.45), 0 60px 120px rgba(0,0,0,0.35)',
  orange: '0 20px 50px rgba(255,113,56,0.35), 0 60px 120px rgba(17,17,17,0.35)',
};
