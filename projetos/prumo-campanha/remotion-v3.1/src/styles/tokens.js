// Direção de arte "Prumo" · paleta padrão Apple (pedido do usuário)
export const C = {
  bg: '#F5F5F7',        // cinza Apple, fundo principal
  white: '#FFFFFF',
  ink: '#1D1D1F',       // grafite, títulos
  ink2: '#6E6E73',      // texto secundário
  ink3: '#AEAEB2',
  blue: '#0071E3',      // azul Apple, marca e destaques
  blueDeep: '#0058B8',
  blueLight: '#2997FF',
  blueTint: '#DCEBFF',  // coluna "Pessoal"
  red: '#FF3B30',       // só na dor
  line: 'rgba(29,29,31,0.08)',
};
export const FONT = "'InterVar', -apple-system, 'Helvetica Neue', Arial, sans-serif";
// Inter variável com eixo de tamanho óptico: opsz 32 = Display (títulos), opsz 14 = Text (rótulos)
export const display = (weight = 600) => ({ fontFamily: FONT, fontWeight: weight, fontVariationSettings: `'opsz' 32`, letterSpacing: '-0.035em' });
export const text = (weight = 400) => ({ fontFamily: FONT, fontWeight: weight, fontVariationSettings: `'opsz' 14`, letterSpacing: '-0.01em' });
export const W = 1080, H = 1920, FPS = 60;
export const shadow = '0 2px 6px rgba(0,0,0,0.04), 0 24px 60px rgba(0,0,0,0.10)';
export const shadowDeep = '0 4px 10px rgba(0,0,0,0.05), 0 40px 90px rgba(0,0,0,0.16)';
