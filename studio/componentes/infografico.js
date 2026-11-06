/* MOTION DESIGN STUDIO · infográficos
 * kpi · barras · ranking · linha · donut · progresso · comparacao
 * Escalas sempre a partir de zero e proporcionais aos dados. Os números vêm do roteiro: nunca invente dados.
 * Cada função cria o gráfico dentro de um contêiner posicionado e recebe o tempo t0 em que começa a crescer.
 */
(function () {
  "use strict";
  const M = window.MDS, G = M.info = {};
  const fmtBR = (casas = 0) => v => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

  /* número grande que conta: { x, y, w, rotulo, de, ate, t, d, prefixo, sufixo, casas, tamanho, cor, alinhar } */
  G.kpi = (parent, o) => {
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;${o.w ? `width:${o.w}px;` : ""}text-align:${o.alinhar || "left"}`);
    if (o.rotulo) M.h("div", "lbl", el, o.rotulo, "margin-bottom:12px");
    const n = M.h("div", "bigNum", el, "", `font-size:${o.tamanho || 150}px;${o.cor ? `color:${o.cor}` : ""}`);
    const f = fmtBR(o.casas || 0);
    M.counter(n, o.de || 0, o.ate, o.t, o.t + (o.d || 1), v => `${o.prefixo || ""}${f(v)}${o.sufixo || ""}`, o.e || "expo");
    return el;
  };
  /* barras verticais: { x, y, w, h, dados: [{ rotulo, valor, destaque }], t, d, stagger, max, formato, cor, corDestaque } */
  G.barras = (parent, o) => {
    const { w, h: hh, dados, t, d = .8, stagger = .08 } = o, max = o.max ?? Math.max(...dados.map(x => x.valor));
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;width:${w}px;height:${hh}px`);
    const gap = 26, bw = (w - gap * (dados.length - 1)) / dados.length, base = hh - 70, f = o.formato || fmtBR(0);
    M.h("div", "abs", el, null, `left:0;right:0;top:${base}px;height:3px;background:var(--v-line)`);
    dados.forEach((x, i) => {
      const bh = Math.max(4, base * x.valor / max), left = i * (bw + gap), t0 = t + i * stagger;
      const bar = M.h("div", "abs", el, null, `left:${left}px;top:${base - bh}px;width:${bw}px;height:${bh}px;border-radius:18px 18px 6px 6px;background:${x.destaque ? (o.corDestaque || "var(--v-ac)") : (o.cor || "var(--v-ink)")};transform-origin:50% 100%`);
      M.anim(bar, [[t0, { sy: 0 }], [t0 + d, { sy: 1 }, "expo"]]);
      const v = M.h("div", "abs", el, "", `left:${left - 20}px;width:${bw + 40}px;top:${base - bh - 64}px;text-align:center;font:700 40px var(--v-display);letter-spacing:-.03em;font-variant-numeric:tabular-nums`);
      M.counter(v, 0, x.valor, t0, t0 + d, f); M.anim(v, M.IN(t0 + d * .4, { dy: 20, s: 1, b: 6, d: .4 }));
      const r = M.h("div", "abs lbl", el, x.rotulo, `left:${left - 20}px;width:${bw + 40}px;top:${base + 18}px;text-align:center;font-size:26px`);
      M.anim(r, M.IN(t0, { dy: 16, s: 1, b: 6, d: .4 }));
    });
    return el;
  };
  /* ranking horizontal: { x, y, w, dados: [{ rotulo, valor, destaque }], t, stagger, max, formato, altura } */
  G.ranking = (parent, o) => {
    const { w, dados, t, d = .8, stagger = .12, altura = 92 } = o, max = o.max ?? Math.max(...dados.map(x => x.valor)), f = o.formato || fmtBR(0);
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;width:${w}px`);
    const rotW = o.larguraRotulo || 250, barW = w - rotW - 150;
    dados.forEach((x, i) => {
      const t0 = t + i * stagger, top = i * (altura + 22);
      const lin = M.h("div", "abs", el, null, `left:0;top:${top}px;width:${w}px;height:${altura}px`);
      M.h("div", "abs", lin, x.rotulo, `left:0;top:0;width:${rotW - 20}px;height:${altura}px;display:flex;align-items:center;font:600 32px var(--v-sans);letter-spacing:-.02em;color:${x.destaque ? "var(--v-ink)" : "var(--v-ink2)"}`);
      const bar = M.h("div", "abs", lin, null, `left:${rotW}px;top:${altura * .2}px;height:${altura * .6}px;width:${Math.max(6, barW * x.valor / max)}px;border-radius:${altura}px;background:${x.destaque ? "var(--v-ac)" : "var(--v-ink)"};transform-origin:0 50%`);
      M.anim(bar, [[t0, { sx: 0 }], [t0 + d, { sx: 1 }, "expo"]]);
      const v = M.h("div", "abs", lin, "", `left:${rotW + Math.max(6, barW * x.valor / max) + 18}px;top:0;height:${altura}px;display:flex;align-items:center;font:700 34px var(--v-display);font-variant-numeric:tabular-nums`);
      M.counter(v, 0, x.valor, t0, t0 + d, f);
      M.anim(lin, M.IN(t0 - .05, { dy: 30, s: 1, b: 8, d: .45 }));
    });
    return el;
  };
  /* linha com área: { x, y, w, h, pontos: [valores], rotulos: [], t, d, min, max, cor, final: "texto do último ponto" } */
  G.linha = (parent, o) => {
    const { w, h: hh, pontos, t, d = 1.2 } = o, min = o.min ?? 0, max = o.max ?? Math.max(...pontos);
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;width:${w}px;height:${hh}px`);
    const s = M.svg(el, w, hh, "position:absolute;left:0;top:0;overflow:visible"), pad = 10;
    const X = i => pad + (w - pad * 2) * i / (pontos.length - 1), Y = v => hh - 50 - (hh - 90) * (v - min) / (max - min);
    for (let k = 0; k <= 3; k++) M.sel(s, "line", { x1: 0, x2: w, y1: Y(min + (max - min) * k / 3), y2: Y(min + (max - min) * k / 3), stroke: "var(--v-line)", "stroke-width": 2 });
    const dd = pontos.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
    const id = "g" + Math.random().toString(36).slice(2, 8), cor = o.cor || "var(--v-ac)";
    const defs = M.sel(s, "defs", {}); defs.innerHTML = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".22"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient>`;
    s.style.color = cor;
    const area = M.path(s, `${dd} L${X(pontos.length - 1)} ${hh - 50} L${X(0)} ${hh - 50}Z`, { fill: `url(#${id})` });
    M.fx(tt => area.style.opacity = M.prog(tt, t + d * .5, t + d));
    const ln = M.path(s, dd, { fill: "none", stroke: cor, "stroke-width": 8, "stroke-linejoin": "round", "stroke-linecap": "round" });
    M.draw(ln, t, t + d, "inOut");
    const dot = M.sel(s, "circle", { r: 14, fill: cor, stroke: "var(--v-bg)", "stroke-width": 6 });
    const L = ln.getTotalLength();
    M.fx(tt => { const p = ln.getPointAtLength(L * M.prog(tt, t, t + d, "inOut")); dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y); dot.style.opacity = tt >= t ? 1 : 0; });
    (o.rotulos || []).forEach((r, i) => { if (!r) return; const lb = M.h("div", "abs lbl", el, r, `left:${X(i) - 60}px;width:120px;top:${hh - 36}px;text-align:center;font-size:24px`); M.anim(lb, M.IN(t + d * i / (pontos.length - 1), { dy: 10, s: 1, b: 4, d: .3 })); });
    if (o.final) { const f = M.h("div", "chip ink abs", el, o.final, `left:${X(pontos.length - 1)}px;top:${Y(pontos[pontos.length - 1]) - 100}px;translate:-90% 0`); M.anim(f, M.IN(t + d, { dy: 20, s: .7, e: "back", d: .45 })); }
    return el;
  };
  /* donut: { x, y, r, valor (0-100), t, d, espessura, centro: true|"texto", cor } */
  G.donut = (parent, o) => {
    const { r = 180, valor, t, d = 1.1, espessura = 40 } = o, D = r * 2 + espessura;
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;width:${D}px;height:${D}px`);
    const s = M.svg(el, D, D, "position:absolute;left:0;top:0"), C = 2 * Math.PI * r;
    M.sel(s, "circle", { cx: D / 2, cy: D / 2, r, fill: "none", stroke: "var(--v-line)", "stroke-width": espessura });
    const arc = M.sel(s, "circle", { cx: D / 2, cy: D / 2, r, fill: "none", stroke: o.cor || "var(--v-ac)", "stroke-width": espessura, "stroke-linecap": "round", transform: `rotate(-90 ${D / 2} ${D / 2})`, "stroke-dasharray": C.toFixed(1) });
    M.fx(tt => arc.style.strokeDashoffset = (C * (1 - valor / 100 * M.prog(tt, t, t + d, "inOut"))).toFixed(1));
    if (o.centro !== false) {
      const c = M.h("div", "abs bigNum", el, "", `left:0;top:0;width:${D}px;height:${D}px;display:grid;place-items:center;font-size:${r * .55}px`);
      if (typeof o.centro === "string") c.textContent = o.centro; else M.counter(c, 0, valor, t, t + d, v => Math.round(v) + "%", "inOut");
    }
    return el;
  };
  /* barra de progresso: { x, y, w, t, d, ate (0-100), rotulo } */
  G.progresso = (parent, o) => {
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;width:${o.w}px`);
    const top = M.h("div", "lbl", el, null, "display:flex;justify-content:space-between;margin-bottom:16px");
    M.h("span", "", top, o.rotulo || ""); const pct = M.h("span", "mono", top, "0%", "color:var(--v-ink)");
    const tr = M.h("div", "", el, null, "height:18px;border-radius:9px;background:var(--v-line);overflow:hidden");
    const bar = M.h("div", "", tr, null, `height:100%;width:100%;border-radius:9px;background:${o.cor || "var(--v-ac)"};transform-origin:0 50%`);
    const ate = o.ate ?? 100;
    M.fx(tt => { const p = M.prog(tt, o.t, o.t + (o.d || 1), "inOut") * ate; bar.style.transform = `scaleX(${(p / 100).toFixed(4)})`; pct.textContent = Math.round(p) + "%"; });
    return el;
  };
  /* comparação lado a lado: { x, y, w, h, esquerda: {rotulo, valor, sufixo}, direita: {...}, t } (padrão dentro da zona segura: x 90, w 860) */
  G.comparacao = (parent, o) => {
    const W = o.w || 860, cw = W / 2 - 20;
    const el = M.h("div", "abs", parent, null, `left:${o.x ?? 90}px;top:${o.y}px;width:${W}px;height:${o.h || 420}px`);
    M.h("div", "abs", el, null, `left:${W / 2 - 1}px;top:20px;width:2px;bottom:20px;background:var(--v-line)`);
    [["esquerda", 0], ["direita", W / 2 + 20]].forEach(([k, x], i) => {
      const v = o[k]; const b = M.h("div", "abs", el, null, `left:${x}px;top:0;width:${cw}px;text-align:center`);
      G.kpi(b, { x: 0, y: 0, w: cw, alinhar: "center", rotulo: v.rotulo, ate: v.valor, prefixo: v.prefixo, sufixo: v.sufixo, casas: v.casas, t: o.t + i * .25, d: 1, tamanho: v.tamanho || 130, cor: i ? "var(--v-ac)" : "" });
      M.anim(b, M.IN(o.t + i * .25, { dy: 60, s: .92 }));
    });
    return el;
  };
})();
