/* MOTION DESIGN STUDIO · transições
 * Dois tipos:
 *  1. Chaves de câmera para a raiz da cena (somar em UM anim(S, [...])):
 *     entraZoom, saiZoom, entraFundo, saiFundo, chicoteEntra, chicoteSai, entraDeBaixo, saiParaCima
 *  2. Revelações por recorte (clip-path), independentes de anim:
 *     circulo, cortina, diagonal
 *  e camadas: flash
 * Regra do estúdio: toda cena entra antes da anterior sair (sobreposição de 0,15 a 0,3 s). Nunca tela vazia.
 */
(function () {
  "use strict";
  const M = window.MDS, R = M.trans = {};

  /* ---- chaves de câmera ---- */
  R.entraZoom = (t, o = {}) => { const { d = .6, s = .55, b = 22 } = o; return [[t, { s, o: 0, b }], [t + d, { s: 1, o: 1, b: 0 }, "expo"]]; };
  R.saiZoom = (t, o = {}) => { const { d = .5, s = 1.6, b = 24 } = o; return [[t, { s: 1, o: 1, b: 0 }], [t + d, { s, o: 0, b }, "in"]]; };
  R.entraFundo = (t, o = {}) => { const { d = .7, s = 1.25, b = 16 } = o; return [[t, { s, o: 0, b }], [t + d, { s: 1, o: 1, b: 0 }, "expo"]]; };
  R.saiFundo = (t, o = {}) => { const { d = .5, s = .7, b = 14 } = o; return [[t, { s: 1, o: 1, b: 0 }], [t + d, { s, o: 0, b }, "in"]]; };
  /* chicote (whip pan): deslocamento rápido com desfoque de movimento; dir = 1 (da direita) ou -1 */
  R.chicoteEntra = (t, o = {}) => { const { d = .45, dir = 1, dist = 900 } = o; return [[t, { x: dist * dir, b: 30, o: 0 }], [t + .05, { o: 1 }, "lin"], [t + d, { x: 0, b: 0 }, "expo"]]; };
  R.chicoteSai = (t, o = {}) => { const { d = .35, dir = 1, dist = 900 } = o; return [[t, { x: 0, b: 0, o: 1 }], [t + d - .05, { o: 1 }], [t + d, { x: -dist * dir, b: 30, o: 0 }, "inExpo"]]; };
  R.entraDeBaixo = (t, o = {}) => { const { d = .65, dist = 700 } = o; return [[t, { y: dist, o: 0, b: 14 }], [t + d, { y: 0, o: 1, b: 0 }, "expo"]]; };
  R.saiParaCima = (t, o = {}) => { const { d = .5, dist = 700 } = o; return [[t, { y: 0, o: 1, b: 0 }], [t + d, { y: -dist, o: 0, b: 14 }, "inExpo"]]; };

  /* ---- revelações por recorte ---- */
  /* círculo que cresce a partir de (x, y) revelando a cena */
  R.circulo = (S, t, o = {}) => { const { x = 540, y = 960, d = .7, e = "inOutExpo" } = o;
    return M.fx(tt => { const p = M.prog(tt, t, t + d, e); S.style.clipPath = p >= 1 ? "none" : `circle(${(p * 2300).toFixed(1)}px at ${x}px ${y}px)`; }); };
  /* cortina reta a partir de um lado: "baixo" | "cima" | "esquerda" | "direita" */
  R.cortina = (S, t, o = {}) => { const { lado = "baixo", d = .6, e = "inOutExpo" } = o;
    return M.fx(tt => { const p = M.prog(tt, t, t + d, e), q = ((1 - p) * 100).toFixed(2) + "%";
      const ins = { baixo: `${q} 0 0 0`, cima: `0 0 ${q} 0`, esquerda: `0 ${q} 0 0`, direita: `0 0 0 ${q}` }[lado];
      S.style.clipPath = p >= 1 ? "none" : `inset(${ins})`; }); };
  /* faixa diagonal que varre a tela */
  R.diagonal = (S, t, o = {}) => { const { d = .6, e = "inOutExpo" } = o;
    return M.fx(tt => { const p = M.prog(tt, t, t + d, e), a = 2400 - p * 3300;   // linha sobe de baixo da tela até acima dela
      S.style.clipPath = p >= 1 ? "none" : `polygon(0 ${a + 900}px, 1080px ${a}px, 1080px 3400px, 0 3400px)`; }); };

  /* ---- camadas ---- */
  R.flash = (t, o = {}) => { const { cor = "var(--v-bg)", d = .35, z = 95, pico = 1 } = o;
    const L = M.h("div", "layer", M.palco(), null, `z-index:${z};background:${cor}`);
    M.anim(L, [[t - .06, { o: 0 }], [t, { o: pico }, "out"], [t + d, { o: 0 }, "out"]]); return L; };
})();
