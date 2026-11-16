// v2 · camada tipográfica vertical (Canvas 2D 1080×1920). Entradas suaves e longas: a leitura vem antes do efeito.
// Cada linha sobe 46 px com fade e desfoque que se dissolve (0,8 s, ease in‑out), fica parada e sai em 0,55 s.
import { ease, prog, clamp, lerp } from './util.js';

export const INK = '#F4F1EA', TURQ_TXT = '#5FE3BE', GOLD_TXT = '#E9C98A';
const DISP = '"Inter Display"', TXT = '"Inter"';
const VW = 1080, VH = 1920, MARGEM = 90;

// Conceitos de campanha fictícia de portfólio (não são benefícios oficiais da gobank)
export const MENSAGENS = [
  { apoio: 'Controle', titulo: 'pelo app.', a: 6.3, b: 8.55, y: 1290, n: '01' },
  { apoio: 'Pagamento por', titulo: 'aproximação.', a: 9.55, b: 11.55, y: 470, n: '02' },
  { apoio: 'Alertas de', titulo: 'movimentação.', a: 14.85, b: 16.2, y: 470, n: '03' },
  { apoio: 'Compras', titulo: 'internacionais.', a: 16.55, b: 18.0, y: 470, n: '04' },
];

// fator de entrada/saída (0→1→0) com curvas suaves
function vida(t, a, b, inD = .8, outD = .55) {
  const i = ease.inOut(prog(t, a, a + inD)), o = ease.inOut(prog(t, b, b + outD));
  return { i, o, v: i * (1 - o) };
}

// linha de texto centralizada que cabe na largura útil (reduz o corpo se precisar)
function linha(g, t, { text, y, size, weight = 800, family = DISP, color = INK, a, b, ls = -.02, delay = 0, rise = 46, inD = .8, outD = .55 }) {
  const { i, o, v } = vida(t, a + delay, b + delay * .4, inD, outD);
  if (v <= .001) return;
  g.save();
  let s = size; g.font = `${weight} ${s}px ${family}`; g.letterSpacing = `${ls * s}px`;
  const maxW = VW - 2 * MARGEM;
  let w = g.measureText(text).width;
  if (w > maxW) { s = Math.floor(s * maxW / w); g.font = `${weight} ${s}px ${family}`; g.letterSpacing = `${ls * s}px`; w = g.measureText(text).width; }
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const dy = (1 - i) * rise - o * rise * .5;
  g.globalAlpha = v;
  const blur = (1 - i) * 10 + o * 6; if (blur > .3) g.filter = `blur(${blur.toFixed(1)}px)`;
  g.fillStyle = color; g.fillText(text, VW / 2, y + dy);
  g.restore();
  return s;
}

function marcador(g, t, { n, y, a, b }) {
  const { i, v } = vida(t, a - .1, b, .9, .5);
  if (v <= .001) return;
  g.save(); g.globalAlpha = v * .9;
  g.font = `600 30px ${TXT}`; g.letterSpacing = '8px'; g.textAlign = 'center'; g.fillStyle = TURQ_TXT;
  g.fillText(n, VW / 2 + 4, y);
  const lw = 70 * ease.inOut(i);
  g.fillRect(VW / 2 - lw / 2, y + 22, lw, 2);
  g.restore();
}

export function makeOverlay() {
  const cv = document.createElement('canvas'); cv.width = VW; cv.height = VH;
  const g = cv.getContext('2d');
  const ativo = t => (t > 3.9 && t < 6.2) || (t > 6.2 && t < 12.3) || (t > 14.7 && t < 18.8) || t > 18.1;
  let sujo = true;
  function draw(t) {
    if (!ativo(t)) { if (sujo) { g.clearRect(0, 0, VW, VH); sujo = false; } return false; }
    sujo = true; g.clearRect(0, 0, VW, VH);
    // CENA 2 · GO em destaque abaixo do cartão
    linha(g, t, { text: 'GO', y: 1470, size: 330, weight: 900, a: 4.0, b: 5.55, ls: -.045, rise: 70, inD: .9, outD: .6 });
    // BENEFÍCIOS · uma mensagem por vez
    for (const m of MENSAGENS) {
      marcador(g, t, { n: m.n, y: m.y - 170, a: m.a, b: m.b });
      linha(g, t, { text: m.apoio, y: m.y - 82, size: 56, weight: 500, family: TXT, color: 'rgba(244,241,234,.82)', a: m.a, b: m.b, ls: -.005 });
      linha(g, t, { text: m.titulo, y: m.y + 44, size: 124, a: m.a, b: m.b, delay: .12 });
    }
    // ASSINATURA + ENCERRAMENTO · frase completa, fica até o fim
    linha(g, t, { text: 'SEU DINHEIRO.', y: 1265, size: 100, a: 18.3, b: 99, ls: -.015, inD: .9 });
    linha(g, t, { text: 'SEU RITMO.', y: 1390, size: 100, color: INK, a: 18.75, b: 99, ls: -.015, inD: .9 });
    // fio de luz dourado/turquesa sob a assinatura (encerramento)
    const k = ease.inOut(prog(t, 20.0, 21.0));
    if (k > 0) {
      const lw = 360 * k, y = 1460;
      const gr = g.createLinearGradient(VW / 2 - lw, 0, VW / 2 + lw, 0);
      gr.addColorStop(0, 'rgba(25,199,155,0)'); gr.addColorStop(.3, 'rgba(25,199,155,.9)'); gr.addColorStop(.5, 'rgba(233,201,138,1)'); gr.addColorStop(.7, 'rgba(25,199,155,.9)'); gr.addColorStop(1, 'rgba(25,199,155,0)');
      g.save(); g.fillStyle = gr; g.fillRect(VW / 2 - lw, y, lw * 2, 2); g.restore();
    }
    return true;
  }
  return { canvas: cv, draw };
}
