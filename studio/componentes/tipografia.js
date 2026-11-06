/* MOTION DESIGN STUDIO · tipografia cinética
 * palavra()  revelação por máscara (sobe de dentro de uma janela invisível)
 * linha()    uma linha de palavras, cada uma com seu tempo
 * bloco()    várias linhas com escalas diferentes empilhadas (hierarquia de tamanhos)
 * letras()   letra por letra, com escalonamento
 * marcador() faixa de destaque que varre atrás de um trecho
 * risco()    risco que atravessa um texto
 * Tempos sempre absolutos (segundos do vídeo), vindos de palavras.json.
 */
(function () {
  "use strict";
  const M = window.MDS, T = M.tipo = {};

  T.palavra = (parent, txt, t, o = {}) => {
    const { size = 120, cls = "", d = .6, e = "expo", de = "baixo", r = 5 } = o;
    const m = M.h("span", "mask", parent), i = M.h("i", cls, m, txt);
    const y0 = (de === "cima" ? -1.4 : 1.4) * size;
    M.anim(i, [[t, { y: y0, r: de === "cima" ? -r : r }], [t + d, { y: 0, r: 0 }, e]]);
    return m;
  };
  /* itens: [[texto, tempo, classe?], ...] · opções de posição/fonte */
  T.linha = (parent, itens, o = {}) => {
    const { top = 800, left = null, width = null, size = 120, peso = 800, fonte = "var(--v-display)", ls = "-.05em", cor = "", alinhar = "center", d = .6, de = "baixo" } = o;
    const css = [`top:${top}px`, `font:${peso} ${size}px/1 ${fonte}`, `letter-spacing:${ls}`, `text-align:${alinhar}`];
    if (left != null) css.push(`left:${left}px;right:auto`); if (width != null) css.push(`width:${width}px`); if (cor) css.push(`color:${cor}`);
    const el = M.h("div", "hl", parent, null, css.join(";"));
    itens.forEach(([txt, t, cls], k) => { if (k) el.append(" "); T.palavra(el, txt, t, { size, cls, d, de }); });
    return el;
  };
  /* linhas: [{ itens, size, peso, fonte, cor, gap }] empilhadas a partir de top */
  T.bloco = (parent, linhas, o = {}) => {
    const { top = 600, left = null, width = null, alinhar = "center" } = o;
    let y = top; const els = [];
    for (const L of linhas) { els.push(T.linha(parent, L.itens, { ...L, top: y, left, width, alinhar })); y += (L.size || 120) * (L.altura || 1.05) + (L.gap || 0); }
    return els;
  };
  T.letras = (parent, txt, t, o = {}) => {
    const { size = 200, stagger = .04, d = .7, cls = "", e = "expo" } = o;
    return [...txt].map((c, i) => c === " " ? (parent.append(" "), null) : T.palavra(parent, c, t + i * stagger, { size, cls, d, e }));
  };
  /* faixa atrás de um elemento inline (envolve o conteúdo) */
  T.marcador = (el, t, o = {}) => {
    const { cor = "var(--v-ac)", d = .45, altura = .42, opac = .28 } = o;
    el.style.position = "relative"; el.style.display = "inline-block";
    const bar = M.h("span", "", el, null, `position:absolute;left:-.06em;right:-.06em;bottom:.08em;height:${altura}em;background:color-mix(in srgb, ${cor} ${Math.round(opac * 100)}%, transparent);transform-origin:0 50%;z-index:-1;border-radius:.08em`);
    M.anim(bar, [[t, { sx: 0 }], [t + d, { sx: 1 }, "out5"]]);
    el.style.isolation = "isolate";
    return bar;
  };
  T.risco = (el, t, o = {}) => {
    const { cor = "var(--v-alert)", d = .35, espessura = .08 } = o;
    el.style.position = "relative"; el.style.display = "inline-block";
    const bar = M.h("span", "", el, null, `position:absolute;left:-.04em;right:-.04em;top:52%;height:${espessura}em;background:${cor};transform-origin:0 50%;border-radius:1em`);
    M.anim(bar, [[t, { sx: 0 }], [t + d, { sx: 1 }, "out5"]]);
    return bar;
  };
})();
