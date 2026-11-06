/* MOTION DESIGN STUDIO · legendas palavra por palavra
 * Agrupa as palavras da narração em linhas curtas (pontuação, pausas, limite de palavras e caracteres)
 * e anima cada palavra no tempo exato em que é falada: nasce abaixo, sobe e assenta.
 * A troca de linha espera a anterior sumir: duas linhas nunca se sobrepõem.
 */
(function () {
  "use strict";
  const M = window.MDS;
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w-]/g, "");

  M.legendas = (palavras, cfg = {}) => {
    const c = Object.assign({ ativo: true, y: 1430, tamanho: 64, peso: 600, fonte: "var(--v-sans)", cor: "var(--v-ink)", corDestaque: "var(--v-ac)",
      destaques: [], ocultar: [], maxPalavras: 4, maxChars: 24, pausa: .38, halo: "var(--v-bg)", larguraMax: 940 }, cfg);
    if (!c.ativo || !palavras || !palavras.length) return { ligar() {} };
    const oculta = w => c.ocultar.some(([a, b]) => w.s >= a - .01 && w.s < b);
    const dest = new Set(c.destaques.map(norm));
    // agrupamento
    const grupos = []; let g = [];
    palavras.forEach((w, i) => {
      if (oculta(w)) { if (g.length) grupos.push(g); g = []; return; }
      const prev = g[g.length - 1];
      const chars = g.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
      if (g.length && (g.length >= c.maxPalavras || chars > c.maxChars || w.s - prev.e > c.pausa || /[.!?]$/.test(prev.w))) { grupos.push(g); g = []; }
      g.push(w);
    });
    if (g.length) grupos.push(g);

    const cap = M.h("div", "", M.palco()); cap.id = "cap"; cap.style.top = c.y + "px";
    const linhas = grupos.map((ws, gi) => {
      const el = M.h("div", "capline", cap, null, `font:${c.peso} ${c.tamanho}px/1.1 ${c.fonte};letter-spacing:-.025em;color:${c.cor}`);
      const itens = ws.map(w => {
        const sp = M.h("span", "", el, w.w);
        if (dest.has(norm(w.w))) sp.style.color = c.corDestaque;
        if (c.halo) sp.style.textShadow = `0 0 18px ${c.halo}, 0 0 6px ${c.halo}`;
        return { ...w, el: sp, dest: dest.has(norm(w.w)) };
      });
      const prox = grupos[gi + 1] ? grupos[gi + 1][0].s : 1e9, ult = ws[ws.length - 1];
      const fim = Math.min(prox - .14, ult.e + (prox - ult.e > 1 ? .4 : 1e9));
      return { el, itens, ini: ws[0].s - .06, fim };
    });
    linhas.forEach((L, i) => { const A = linhas[i - 1]; L.porta = A && A.fim < L.itens[0].s ? A.fim + .15 : -1; });
    // linha larga demais encolhe para caber
    const ajustar = () => linhas.forEach(L => { L.el.style.display = "block"; L.el.style.fontSize = c.tamanho + "px"; const w = L.el.scrollWidth; if (w > c.larguraMax) L.el.style.fontSize = (c.tamanho * c.larguraMax / w).toFixed(1) + "px"; L.el.style.display = "none"; });
    ajustar();
    let on = true;
    M.fx(t => {
      for (const L of linhas) {
        const vis = on && t >= L.ini - .05 && t < L.fim + .16;
        if (L._v !== vis) { L.el.style.display = vis ? "block" : "none"; L._v = vis; }
        if (!vis) continue;
        const ex = M.prog(t, L.fim, L.fim + .14, "in");
        L.el.style.opacity = (1 - ex).toFixed(3);
        L.el.style.transform = `translateY(${(-ex * 18).toFixed(1)}px)`;
        for (const w of L.itens) {
          const a = Math.max(w.s - .06, L.porta), p = M.prog(t, a, a + .22, "out");
          w.el.style.opacity = p > 0 ? (.4 + p * .6).toFixed(3) : "0";
          w.el.style.transform = `translateY(${((1 - p) * 20).toFixed(1)}px)`;
          w.el.style.filter = p < .6 ? `blur(${((1 - p / .6) * 3).toFixed(1)}px)` : "none";
        }
      }
    });
    return { ligar(v) { on = v; }, linhas, ajustar };
  };
})();
