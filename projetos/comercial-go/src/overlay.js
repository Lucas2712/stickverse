// Camada tipográfica (Canvas 2D, 1920×1080), desenhada a cada subquadro a partir do tempo.
// Letras sobem a partir da linha de base dentro de máscaras; cada bloco tem entrada própria.
import { ease, prog, clamp, lerp } from './util.js';

export const INK = '#F2F4F7', DARK = '#07080A';
const DISP = '"Inter Display"', TXT = '"Inter"';

// Benefícios genéricos (provisórios, aprovados pelo usuário como espaço reservado)
export const BENEFICIOS = [
  ['Tudo no seu', 'controle.'],
  ['Pague em', 'segundos.'],
  ['Alertas em', 'tempo real'],
  ['Cartão', 'virtual'],
  ['Bloqueio', 'pelo app'],
  ['Compras no', 'mundo todo'],
];

function glyphs(g, text) {           // posições x de cada letra (com kerning, via prefixos)
  const out = []; let prev = 0;
  for (let i = 0; i < text.length; i++) { const w = g.measureText(text.slice(0, i + 1)).width; out.push([text[i], prev, w - prev]); prev = w; }
  return { list: out, width: prev };
}

// Linha com letras subindo da linha de base. opts: x, y (base), size, weight, family, color, align,
// tIn, tOut, stagger, dur, track (espaçamento inicial extra em em), mode
function line(g, t, o) {
  const { x, y, size, weight = 800, family = DISP, color = INK, align = 'left', tIn, tOut = 1e9, stagger = .028, dur = .62, mode = 'rise', ls = -.025 } = o;
  if (t < tIn - .01 || t > tOut + .4) return;
  g.save();
  g.font = `${weight} ${size}px ${family}`; g.letterSpacing = `${ls * size}px`; g.textBaseline = 'alphabetic';
  const { list, width } = glyphs(g, o.text);
  let x0 = align === 'left' ? x : align === 'right' ? x - width : x - width / 2;
  const asc = size * .98, desc = size * .26;
  const out = ease.inExpo(prog(t, tOut, tOut + .26));                    // saída: tudo sobe e sai pela máscara
  const n = list.length;
  if (mode === 'wipe') {                                                  // máscara lateral + deslize curto
    const k = ease.outExpo(prog(t, tIn, tIn + .55));
    g.beginPath(); g.rect(x0 - 20, y - asc, (width + 40) * k, asc + desc); g.clip();
    g.fillStyle = color; g.fillText(o.text, x0 - (1 - k) * size * .5, y - out * (asc + desc));
    g.restore(); return;
  }
  if (mode === 'center') {                                                // máscara que abre do centro + escala
    const k = ease.outExpo(prog(t, tIn, tIn + .6)), cxm = x0 + width / 2;
    g.beginPath(); g.rect(cxm - (width / 2 + 30) * k, y - asc, (width + 60) * k, asc + desc); g.clip();
    g.translate(cxm, y - size * .35); const s = lerp(1.18, 1, k); g.scale(s, s); g.translate(-cxm, -(y - size * .35));
    g.fillStyle = color; g.fillText(o.text, x0, y - out * (asc + desc));
    g.restore(); return;
  }
  g.beginPath(); g.rect(x0 - size, y - asc, width + size * 2, asc + desc); g.clip();
  g.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const [ch, px] = list[i];
    let k, dx = 0;
    if (mode === 'track') {                                               // espaçamento que fecha + subida
      k = ease.outExpo(prog(t, tIn + i * .012, tIn + i * .012 + dur));
      dx = (1 - k) * (i - (n - 1) / 2) * size * .16;
    } else k = ease.outExpo(prog(t, tIn + i * stagger, tIn + i * stagger + dur));
    const dy = (1 - k) * (asc + desc) - out * (asc + desc) * (1 + i * .015);
    g.fillText(ch, x0 + px + dx, y + dy);
  }
  g.restore();
}

function label(g, t, { x, y, text, color, align = 'left', tIn, tOut }) {
  if (t < tIn || t > tOut + .3) return;
  const k = ease.outExpo(prog(t, tIn, tIn + .5)), out = ease.inExpo(prog(t, tOut, tOut + .22));
  g.save(); g.globalAlpha = k * (1 - out);
  g.font = `600 24px ${TXT}`; g.letterSpacing = '5px'; g.fillStyle = color; g.textBaseline = 'alphabetic';
  const w = g.measureText(text).width, lw = 64 * k;
  const xs = align === 'left' ? x : x - w - lw - 18;
  if (align === 'left') { g.fillText(text, xs, y - out * 30); g.fillRect(xs + w + 18, y - 9 - out * 30, lw, 2); }
  else { g.fillRect(xs, y - 9 - out * 30, lw, 2); g.fillText(text, xs + lw + 18, y - out * 30); }
  g.restore();
}

export function makeOverlay() {
  const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080;
  const g = cv.getContext('2d');
  const ativo = t => (t > 4.0 && t < 7.0) || (t > 8.0 && t < 12.2) || t > 11.98;
  let sujo = true;
  function draw(t) {
    if (!ativo(t)) { if (sujo) { g.clearRect(0, 0, 1920, 1080); sujo = false; } return false; }
    sujo = true;
    g.clearRect(0, 0, 1920, 1080);
    // BENEFÍCIO 01 · fundo da marca · texto à esquerda
    let [a, b] = BENEFICIOS[0];
    label(g, t, { x: 150, y: 372, text: '01', color: 'rgba(7,8,10,.72)', tIn: 4.05, tOut: 5.62 });
    line(g, t, { text: a, x: 146, y: 480, size: 74, weight: 500, family: TXT, color: DARK, tIn: 4.08, tOut: 5.64, ls: -.01 });
    line(g, t, { text: b, x: 138, y: 680, size: 178, color: DARK, tIn: 4.42, tOut: 5.68 });
    // BENEFÍCIO 02 · espelhado à direita
    [a, b] = BENEFICIOS[1];
    label(g, t, { x: 1780, y: 372, text: '02', color: 'rgba(7,8,10,.72)', align: 'right', tIn: 6.02, tOut: 6.38 });
    line(g, t, { text: a, x: 1780, y: 480, size: 74, weight: 500, family: TXT, color: DARK, align: 'right', tIn: 6.04, tOut: 6.4, ls: -.01, stagger: .018, dur: .42 });
    line(g, t, { text: b, x: 1786, y: 680, size: 178, color: DARK, align: 'right', tIn: 6.1, tOut: 6.42, stagger: .02, dur: .45 });
    // UNIVERSO GO · quatro benefícios, um por vez, cada um com entrada própria
    const modes = ['rise', 'wipe', 'track', 'center'];
    for (let i = 0; i < 4; i++) {
      const t0 = 8.04 + i, t1 = t0 + .74;
      [a, b] = BENEFICIOS[i + 2];
      label(g, t, { x: 150, y: 400, text: `0${i + 3}`, color: '#7FE8C9', tIn: t0, tOut: t1 });
      line(g, t, { text: a, x: 144, y: 548, size: 126, color: INK, tIn: t0 + .02, tOut: t1, mode: modes[i], stagger: .022, dur: .5 });
      line(g, t, { text: b, x: 144, y: 690, size: 126, color: INK, tIn: t0 + .1, tOut: t1 + .03, mode: modes[i], stagger: .022, dur: .5 });
    }
    // ASSINATURA
    line(g, t, { text: 'SEU DINHEIRO.', x: 960, y: 232, size: 146, align: 'center', tIn: 12.0, tOut: 13.26, stagger: .03, dur: .55, ls: -.02 });
    line(g, t, { text: 'SEU RITMO.', x: 960, y: 960, size: 146, align: 'center', tIn: 12.5, tOut: 13.3, stagger: .03, dur: .55, ls: -.02 });
    // LOGO FINAL · espaço reservado para o SVG oficial da gobank
    if (t >= 13.5) {
      const k = ease.outExpo(prog(t, 13.5, 14.1));
      g.save(); g.globalAlpha = clamp(k * 1.4);
      g.translate(960, 852); const s = lerp(1.12, 1, k); g.scale(s, s);
      g.strokeStyle = 'rgba(242,244,247,.8)'; g.lineWidth = 2.5; g.setLineDash([14, 10]); g.lineDashOffset = -t * 12;
      g.beginPath(); g.roundRect(-290, -64, 580, 128, 18); g.stroke(); g.setLineDash([]);
      g.font = `600 44px ${TXT}`; g.letterSpacing = '9px'; g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('LOGO GOBANK', 4, 2);
      g.restore();
    }
    return true;
  }
  return { canvas: cv, draw };
}

// Textura do "GO" gigante atrás do cartão (cena 2): letras sobem da base e afundam na saída
export function drawGO(g, t, w, h) {
  g.clearRect(0, 0, w, h);
  if (t < 2.4 || t > 4.1) return false;
  const size = h * 1.02, y = h * .86;
  g.save(); g.font = `900 ${size}px ${DISP}`; g.letterSpacing = `${-size * .04}px`; g.textBaseline = 'alphabetic';
  const wG = g.measureText('G').width, wAll = g.measureText('GO').width, x0 = (w - wAll) / 2;
  g.beginPath(); g.rect(0, 0, w, y + size * .02); g.clip();
  g.fillStyle = '#C7CCD4';
  const out = ease.inExpo(prog(t, 3.72, 3.98));
  [['G', x0, 2.5], ['O', x0 + wG, 2.6]].forEach(([ch, x, t0]) => {
    const k = ease.outExpo(prog(t, t0, t0 + .55));
    g.fillText(ch, x, y + (1 - k) * size * .78 + out * size * .78);
  });
  g.restore();
  return true;
}
