/* MOTION DESIGN STUDIO · interfaces animadas (UI genérica, sem marcas reais)
 * janela · chip · notificacao · celular · checklist · chat · busca · botao · cursor · toast
 * Cada função cria o elemento, devolve referências e NÃO anima a entrada do contêiner:
 * quem monta a cena decide a entrada com anim(el, [...IN(t), ...OUT(t2)]). Os eventos internos
 * (marcar, digitar, chegar mensagem) recebem tempos absolutos.
 */
(function () {
  "use strict";
  const M = window.MDS, U = M.ui = {};
  const pos = (x, y, w, hh) => `left:${x}px;top:${y}px;${w != null ? `width:${w}px;` : ""}${hh != null ? `height:${hh}px;` : ""}`;
  U.CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* janela estilo desktop: { x, y, w, h, titulo, direita } → { el, corpo } */
  U.janela = (parent, o) => {
    const el = M.h("div", "card", parent, null, pos(o.x, o.y, o.w, o.h));
    M.h("div", "wh", el, `<span class="dots"><i></i><i></i><i></i></span>${o.titulo || ""}${o.direita ? `<span class="mono" style="margin-left:auto">${o.direita}</span>` : ""}`);
    const corpo = M.h("div", "", el, null, `position:absolute;left:0;right:0;top:88px;bottom:0;${o.padding != null ? `padding:${o.padding}` : "padding:34px 38px"}`);
    return { el, corpo };
  };
  /* chip: { x, y, texto, variante: soft|ink|line, ponto, centro } */
  U.chip = (parent, o) => {
    const el = M.h("div", `chip ${o.variante || "line"} abs`, parent, `${o.ponto !== false ? '<span class="dot"></span>' : ""}${o.texto}`, pos(o.x, o.y));
    if (o.centro) el.style.translate = "-50% -50%";
    if (o.tamanho) el.style.fontSize = o.tamanho + "px";
    return el;
  };
  /* notificação: { x, y, w, app, cor, letra, titulo, texto, hora } */
  U.notificacao = (parent, o) => M.h("div", "notif", parent,
    `<span class="ico" style="background:${o.cor || "var(--v-ac)"}">${o.letra || ""}</span><div style="min-width:0;flex:1"><div class="tt">${o.app || ""}<em>${o.hora || "agora"}</em></div>${o.titulo ? `<div class="tt" style="margin-top:2px">${o.titulo}</div>` : ""}<div class="tx">${o.texto || ""}</div></div>`,
    pos(o.x, o.y, o.w || 860));
  /* celular: { x, y, w, h } → { el, tela } (tela começa abaixo da ilha) */
  U.celular = (parent, o) => {
    const w = o.w || 480, hh = o.h || 960;
    const el = M.h("div", "phone", parent, '<div class="island"></div>', pos(o.x, o.y, w, hh) + "transform-origin:center");
    const tela = M.h("div", "", el, null, "position:absolute;left:28px;right:28px;top:84px;bottom:28px");
    return { el, tela };
  };
  /* checklist dentro de um contêiner: itens [[texto, tempoDeMarcar, detalhe?]] */
  U.checklist = (parent, itens) => itens.map(([txt, t, det]) => {
    const r = M.h("div", "row", parent, `<span class="ck">${U.CHECK}</span><span class="t">${txt}</span>${det ? `<em>${det}</em>` : ""}`);
    M.classAt(r, "on", t); return r;
  });
  /* chat: mensagens [{ de: "eu"|"ia", texto, t, digitar: cps }] empilhadas a partir do topo do contêiner */
  U.chat = (parent, msgs, o = {}) => {
    const { gap = 26, largura = 600, avatar = "radial-gradient(circle at 35% 30%, var(--v-ac2), var(--v-ac) 60%)" } = o;
    let y = o.top || 0;
    return msgs.map(m => {
      const eu = m.de === "eu";
      const wrap = M.h("div", "abs", parent, null, `${eu ? "right:0" : "left:0"};top:${y}px;display:flex;gap:20px;align-items:flex-start;max-width:${largura + 80}px`);
      if (!eu) M.h("span", "", wrap, null, `width:56px;height:56px;border-radius:50%;flex:none;background:${avatar}`);
      const b = M.h("div", `bubble ${eu ? "me" : "them"}`, wrap, m.digitar ? "" : m.texto, "position:relative");
      if (m.digitar) M.typeText(b, m.texto, m.t + .15, m.digitar);
      M.anim(wrap, M.IN(m.t, { dy: 40, s: .92, b: 8, d: .5 }));
      y += (m.altura || 96) + gap;
      return wrap;
    });
  };
  /* busca: { x, y, w, texto, t, cps } */
  U.busca = (parent, o) => {
    const el = M.h("div", "card", parent, `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--v-ink2)" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg><span class="q"></span><span class="caret"></span>`,
      pos(o.x, o.y, o.w || 860, 124) + "border-radius:62px;display:flex;align-items:center;gap:24px;padding:0 44px;font:600 44px var(--v-sans);letter-spacing:-.025em");
    M.typeText(el.querySelector(".q"), o.texto, o.t, o.cps || 22, el.querySelector(".caret"), o.esconderCursor);
    return el;
  };
  /* botão: { x, y, w, h, texto, cor, corTexto } */
  U.botao = (parent, o) => M.h("div", "abs", parent, o.texto,
    pos(o.x, o.y, o.w || 520, o.h || 140) + `border-radius:${(o.h || 140) / 2}px;background:${o.cor || "var(--v-ink)"};color:${o.corTexto || "var(--v-bg)"};display:flex;align-items:center;justify-content:center;gap:18px;font:700 ${o.tamanho || 52}px var(--v-sans);letter-spacing:-.03em;transform-origin:center`);
  /* clique: escala do alvo encolhe e volta */
  U.clique = (el, t) => [[t - .1, { s: 1 }], [t, { s: .92 }, "out"], [t + .3, { s: 1 }, "back"]];
  /* cursor: anda até (x, y) e clica em t; caminho [[t, x, y], ...] */
  U.cursor = (parent, caminho, cliques = []) => {
    const el = M.h("div", "abs", parent, '<svg viewBox="0 0 40 48" width="80" height="96"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="var(--v-ink)" stroke="var(--v-bg)" stroke-width="3" stroke-linejoin="round"/></svg>', "left:0;top:0;transform-origin:10% 6%");
    const keys = caminho.map(([t, x, y], i) => [t, { x, y, o: i === 0 ? 0 : 1 }, i === 0 ? "lin" : "expo"]);
    keys.splice(1, 0, [caminho[0][0] + .08, { o: 1 }, "lin"]);
    cliques.forEach(t => keys.push([t, { s: 1 }], [t + .08, { s: .84 }, "out"], [t + .28, { s: 1 }, "out"]));
    M.anim(el, keys); return el;
  };
  /* toast curto: { x, y, texto, t, ate } */
  U.toast = (parent, o) => { const el = M.h("div", "chip ink abs", parent, `<span class="dot" style="background:var(--v-ok)"></span>${o.texto}`, pos(o.x, o.y));
    if (o.centro !== false) el.style.translate = "-50% 0";
    M.anim(el, [...M.IN(o.t, { dy: 40, s: .8, e: "back", d: .5 }), ...M.OUT(o.ate ?? o.t + 1.6, { dy: -30 })]); return el; };
})();
