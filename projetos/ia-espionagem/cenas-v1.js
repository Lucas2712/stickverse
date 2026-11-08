/* A IA virou uma arma de espionagem? · Studio Matteu
 * Direção de arte aprovada: "Operação Enxame". Dois mundos: sala de operações (carvão + amarelo-alerta)
 * e dossiê (papel + tinta, tarjas de censura, carimbos, marca-texto). Fio condutor: o ponto amarelo do operador.
 * Inter 4 (Display/Text pelo tamanho óptico). Assinaturas: mergulho na mira, tarja de censura, enxame que converge/explode.
 * Narração: pausas encurtadas + atempo 1,12 (67,6 s). Sem música. Tempos de palavras.json.
 */
(() => {
  const { cena, anim, IN, OUT, VIS, h, fx, prog, svg, sel, path, draw, typeText, counter, at, palco, tipo, trans, fundo } = MDS;
  const CV = "#121110", AM = "#FFD21F", PP = "#EDEAE3", TK = "#151515", AC = "#8A8F98", X = 80;
  const EASE = MDS.EASE, clamp = MDS.clamp, lerp = MDS.lerp;

  /* ---------- base ---------- */
  const bg = (S, c) => h("div", "layer", S, null, `inset:-240px;background:${c}`);
  const papel = S => { bg(S, PP); return h("div", "layer", S, null, "inset:-240px;opacity:.5;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.018) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.012) 0 1px,transparent 1px 7px)"); };
  // câmera interna da cena (empurra/deriva); a raiz S fica para entradas e saídas
  function cam(S, a, b, o = {}) {
    const { s0 = 1, s1 = 1.045, x0 = 0, x1 = 0, y0 = 0, y1 = 0, r0 = 0, r1 = 0, e = "sine", ox = 540, oy = 960 } = o;
    const C = h("div", "layer", S, null, `transform-origin:${ox}px ${oy}px`);
    anim(C, [[a, { s: s0, x: x0, y: y0, r: r0 }], [b, { s: s1, x: x1, y: y1, r: r1 }, e]]);
    return C;
  }
  const raiz = (S, ...ks) => anim(S, [].concat(...ks));
  // tremor por quadro (propriedade translate, não conflita com anim)
  const tremor = (el, t, amp = 14, d = .26) => fx(tt => {
    if (tt < t || tt > t + d) { if (el._tr) { el.style.translate = ""; el._tr = 0; } return; }
    const k = Math.floor(tt * 60), f = 1 - (tt - t) / d; el._tr = 1;
    el.style.translate = `${(((k * 37) % 9) - 4) / 4 * amp * f}px ${(((k * 53) % 7) - 3) / 3 * amp * .6 * f}px`;
  });

  /* ---------- texto ---------- */
  const F = (px, peso = 600, cor = "#fff", ls) => `font:${peso} ${px}px/1 var(--v-display);letter-spacing:${ls ?? (px >= 120 ? "-.045em" : px >= 60 ? "-.03em" : "-.005em")};color:${cor}`;
  const tam = css => +((css.match(/(\d+)px/) || [0, 80])[1]);
  function linha(p, x, y, css, itens, o = {}) {
    const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;white-space:nowrap;${css}`);
    itens.forEach(([w, t, sc], k) => { if (k) el.append(" "); const m = tipo.palavra(el, w, t, { size: tam(css), d: o.d ?? .42, de: o.de }); if (sc) m.querySelector("i").style.cssText += sc; });
    return el;
  }
  const centro = (p, y, css, itens, o) => { const el = linha(p, 0, y, css, itens, o); el.style.left = "0"; el.style.right = "0"; el.style.textAlign = "center"; return el; };
  const txt = (p, x, y, css, s) => h("div", "abs", p, s, `left:${x}px;top:${y}px;white-space:nowrap;${css}`);
  const txtC = (p, y, css, s) => h("div", "abs", p, s, `left:0;right:0;top:${y}px;text-align:center;white-space:nowrap;${css}`);
  const bate = (el, t, s0 = 1.5, b0 = 18, d = .24) => anim(el, [[t - .01, { o: 0, s: s0, b: b0 }], [t + .02, { o: 1 }, "lin"], [t + d, { s: 1, b: 0 }, "out5"]]);
  const GLY = "ABCDEFGHKMNPRSTVXZ0123456789#%&*+=/<>";
  const decode = (el, s, t, d = .4) => fx(tt => {
    if (tt < t) { if (el.textContent) el.textContent = ""; return; }
    const k = Math.floor(tt * 30); let o = "";
    for (let i = 0; i < s.length; i++) { const ti = t + d * i / s.length; o += (tt >= ti + .08 || s[i] === " ") ? s[i] : (tt >= ti ? GLY[(i * 7 + k * 3) % GLY.length] : ""); }
    if (el.textContent !== o) el.textContent = o;
  });
  const rot = (p, x, y, s, t, cor = AC) => { const el = h("div", "abs rot", p, null, `left:${x}px;top:${y}px;color:${cor};white-space:nowrap`); typeText(el, s, t, 34); return el; };
  const rotC = (p, y, s, t, cor = AC) => { const el = rot(p, 0, y, s, t, cor); el.style.left = "0"; el.style.right = "0"; el.style.textAlign = "center"; return el; };

  /* ---------- sistema gráfico ---------- */
  // tarja de censura: cobre a área e se abre (encolhe para a direita) em tAbre
  function tarja(p, x, y, w, hh, tIn, tAbre, cor = TK) {
    const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background:${cor};transform-origin:100% 50%`);
    const k = [[tIn - .01, { o: 0, sx: .2 }], [tIn + .01, { o: 1 }, "lin"], [tIn + .2, { sx: 1 }, "out5"]];
    if (tAbre != null) k.push([tAbre, { sx: 1 }], [tAbre + .32, { sx: 0 }, "inOutExpo"]);
    anim(el, k); return el;
  }
  // tarja que corta (cresce da esquerda) em t
  function corte(p, x, y, w, hh, t, cor = TK) { const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background:${cor};transform-origin:0 50%`); anim(el, [[t, { sx: 0 }], [t + .28, { sx: 1 }, "out5"]]); return el; }
  // transição "tarja de censura": barra preta varre da esquerda e revela a cena
  function tarjaWipe(S, t, d = .34) {
    const bar = h("div", "abs", S, null, `top:-240px;height:2400px;width:200px;left:0;background:${TK};z-index:50`);
    fx(tt => {
      const p = prog(tt, t, t + d, "inOutExpo");
      S.style.clipPath = p >= 1 ? "none" : `inset(-300px ${((1 - p) * 100).toFixed(2)}% -300px -300px)`;
      bar.style.left = (p * 1280 - 200).toFixed(1) + "px"; bar.style.opacity = p > 0 && p < 1 ? 1 : 0;
    });
  }
  // mira tática: círculo, cruz e cantoneiras; trava em tLock
  function mira(p, cx, cy, R, tIn, tLock, cor = AM) {
    const w = R * 2 + 80, s = svg(p, w, w, `position:absolute;left:${cx - w / 2}px;top:${cy - w / 2}px;overflow:visible`);
    const g = sel(s, "g", { fill: "none", stroke: cor, "stroke-width": 5, "stroke-linecap": "square" }), c = w / 2;
    sel(g, "circle", { cx: c, cy: c, r: R, "stroke-width": 3, opacity: .9 });
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => sel(g, "line", { x1: c + dx * (R - 26), y1: c + dy * (R - 26), x2: c + dx * (R + 34), y2: c + dy * (R + 34) }));
    const q = R * .72, L = R * .28;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => sel(g, "path", { d: `M${c + sx * q} ${c + sy * (q - L)} L${c + sx * q} ${c + sy * q} L${c + sx * (q - L)} ${c + sy * q}` }));
    sel(g, "circle", { cx: c, cy: c, r: 6, fill: cor, stroke: "none" });
    s.style.transformOrigin = "50% 50%";
    anim(s, [[tIn, { o: 0, s: 1.9, r: 50 }], [tIn + .08, { o: 1 }, "lin"], [tLock, { s: 1, r: 0 }, "expo"], [tLock + .08, { s: .94 }, "out"], [tLock + .2, { s: 1 }, "out"]]);
    return s;
  }
  // cantoneiras de HUD em volta de um retângulo
  function cantos(p, x, y, w, hh, t, cor = AM, L = 34, esp = 4) {
    const g = h("div", "abs", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px`);
    [["left:0;top:0", "border-left", "border-top"], ["right:0;top:0", "border-right", "border-top"], ["left:0;bottom:0", "border-left", "border-bottom"], ["right:0;bottom:0", "border-right", "border-bottom"]]
      .forEach(([pos, a, b]) => h("div", "abs", g, null, `${pos};width:${L}px;height:${L}px;${a}:${esp}px solid ${cor};${b}:${esp}px solid ${cor}`));
    anim(g, [[t, { o: 0, s: 1.35 }], [t + .3, { o: 1, s: 1 }, "expo"]]);
    return g;
  }
  const carimbo = (p, s, x, y, t, r = -8, cor = TK) => { const el = h("div", "carimbo", p, s, `left:${x}px;top:${y}px;color:${cor}`); anim(el, [[t - .01, { o: 0, s: 2.3, r: r - 6 }], [t + .02, { o: 1 }, "lin"], [t + .16, { s: 1, r }, "out5"]]); return el; };
  const marca = (el, t) => tipo.marcador(el, t, { cor: AM, opac: 1, altura: .95, d: .3 });
  const risco = (el, t) => tipo.risco(el, t, { cor: AM, espessura: .09, d: .3 });
  // ponto do operador (fio condutor)
  function ponto(p, x, y, t, r = 16) {
    const g = h("div", "abs", p, null, `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px`);
    h("div", "abs", g, null, `inset:0;border-radius:50%;background:${AM};box-shadow:0 0 30px 6px rgba(255,210,31,.55),0 0 90px 20px rgba(255,210,31,.18)`);
    const an = h("div", "abs", g, null, `inset:0;border-radius:50%;border:3px solid ${AM}`);
    fx(tt => { const k = tt > t ? ((tt - t) * .9) % 1 : 0; an.style.transform = `scale(${1 + k * 3.2})`; an.style.opacity = tt > t ? (1 - k).toFixed(2) : 0; });
    anim(g, [[t - .01, { o: 0, s: 3 }], [t + .02, { o: 1 }, "lin"], [t + .3, { s: 1 }, "back"]]);
    return g;
  }
  // chão tático em perspectiva
  function chao(p, o = {}) {
    const { cor = "rgba(138,143,152,.26)", topo = false, vel = 70, y = 980 } = o;
    const w = h("div", "abs", p, null, `left:-700px;width:2480px;height:1300px;top:${topo ? y - 1300 : y}px;perspective:700px;perspective-origin:50% ${topo ? "100%" : "0%"}`);
    const g = h("div", "abs", w, null, `inset:0;background-image:linear-gradient(${cor} 2px,transparent 2px),linear-gradient(90deg,${cor} 2px,transparent 2px);background-size:110px 110px;transform-origin:50% ${topo ? "100%" : "0%"};transform:rotateX(${topo ? -70 : 70}deg);-webkit-mask-image:linear-gradient(${topo ? "to top" : "to bottom"},rgba(0,0,0,.05),#000 30%,#000 60%,transparent);mask-image:linear-gradient(${topo ? "to top" : "to bottom"},rgba(0,0,0,.05),#000 30%,#000 60%,transparent)`);
    fx(t => { g.style.backgroundPosition = `0 ${((topo ? -1 : 1) * t * vel) % 110}px`; });
    return w;
  }
  // núcleo hexagonal "IA"
  function hexIA(p, cx, cy, R, t) {
    const w = R * 2 + 40, s = svg(p, w, w, `position:absolute;left:${cx - w / 2}px;top:${cy - w / 2}px;overflow:visible`), c = w / 2;
    const pts = n => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 2; return `${c + Math.cos(a) * n},${c + Math.sin(a) * n}`; }).join(" ");
    sel(s, "polygon", { points: pts(R), fill: "#1B1A18", stroke: AM, "stroke-width": 5 });
    sel(s, "polygon", { points: pts(R * .78), fill: "none", stroke: "rgba(255,210,31,.35)", "stroke-width": 2 });
    const tx = sel(s, "text", { x: c, y: c + R * .3, "text-anchor": "middle", fill: AM, style: `font:700 ${Math.round(R * .82)}px var(--v-display);letter-spacing:-.04em` }); tx.textContent = "IA";
    s.style.transformOrigin = "50% 50%";
    anim(s, [[t, { o: 0, s: .4, r: -30 }], [t + .45, { o: 1, s: 1, r: 0 }, "back"]]);
    return s;
  }
  // canvas por cena (só desenha perto da janela da cena)
  function tela(p, a, b, desenhar, css = "") {
    const c = h("canvas", "abs", p, null, `left:0;top:0;width:1080px;height:1920px;${css}`); c.width = 1080; c.height = 1920;
    const g = c.getContext("2d"); fx(t => { if (t < a - .9 || t > b + .9) return; g.clearRect(0, 0, 1080, 1920); desenhar(g, t); });
    return c;
  }
  function chev(g, x, y, ang, s, cor, o) {
    if (o <= .01) return; g.save(); g.globalAlpha = o; g.translate(x, y); g.rotate(ang); g.scale(s, s); g.fillStyle = cor;
    g.beginPath(); g.moveTo(11, 0); g.lineTo(-8, -8); g.lineTo(-3, 0); g.lineTo(-8, 8); g.closePath(); g.fill(); g.restore();
  }
  const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const P = (t, a, b, e = "expo") => prog(t, a, b, e);
  // grade de organizações (quadrados) em canvas
  function gradeOrgs(g, t, o) {
    const { cols, rows, size, gap, x0, y0, aceso = () => 1e9, flash = null, base = "rgba(138,143,152,.28)", aparece = null } = o;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, x = x0 + c * (size + gap), y = y0 + r * (size + gap);
      const ap = aparece ? P(t, aparece(i), aparece(i) + .25, "out") : 1; if (ap <= 0) continue;
      const ta = aceso(i), on = t >= ta;
      let cor = base;
      if (on) { const k = clamp((t - ta) / .18); cor = k < 1 ? `rgba(255,255,255,${1 - k * .2})` : AM; }
      if (flash != null && t >= flash) { const k = clamp((t - flash) / .3); cor = k < .35 ? "#FFFFFF" : AM; }
      g.globalAlpha = ap; g.fillStyle = cor; const s2 = size * (.6 + .4 * ap); g.fillRect(x + (size - s2) / 2, y + (size - s2) / 2, s2, s2);
    }
    g.globalAlpha = 1;
  }
  // página de relatório (dossiê)
  function pagina(p, t, o = {}) {
    const { x = 130, y = 380, w = 820, hh = 1080 } = o;
    const pg = h("div", "pagina", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px`);
    txt(pg, 60, 64, F(24, 600, AC, ".18em"), "ARQUIVO 04 · CONFIDENCIAL");
    txt(pg, 60, 118, F(52, 700, TK), "RELATÓRIO DE");
    txt(pg, 60, 178, F(52, 700, TK), "INTELIGÊNCIA");
    h("div", "abs", pg, null, `left:60px;top:262px;width:${w - 120}px;height:3px;background:${TK}`);
    const fonte = txt(pg, 60, 300, F(40, 600, TK, ".02em"), "");
    const sp = h("span", "", fonte, "FONTE: CROWDSTRIKE");
    const larg = [700, 620, 680, 520, 660, 590, 700, 440, 640, 560, 690, 380];
    larg.forEach((lw, i) => h("div", "abs", pg, null, `left:60px;top:${400 + i * 52}px;width:${lw}px;height:24px;background:${i % 4 === 2 ? "rgba(21,21,21,.18)" : TK};border-radius:2px`));
    return { pg, sp };
  }

  /* cena com janela de visibilidade explícita: a raiz externa só aparece em [vis[0], vis[1]];
     a raiz interna (S) recebe entradas, saídas e recortes. Evita que uma cena apareça antes da hora. */
  const cenaV = cfg => cena({ ...cfg, montar(S0, c) {
    const S = h("div", "layer", S0, null, "transform-origin:540px 960px");
    const [a, b] = cfg.vis; anim(S0, [[a - .001, { o: 0 }], [a, { o: 1 }, "lin"], [b, { o: 1 }], [b + .001, { o: 0 }, "lin"]]);
    cfg.montar(S, c);
  } });

  /* ---------- camadas globais ---------- */
  const grao = fundo.grao({ opac: .08 }); grao.firstChild.style.mixBlendMode = "overlay";
  h("div", "layer", palco(), null, "z-index:97;background:radial-gradient(ellipse 90% 70% at 50% 50%,transparent 55%,rgba(0,0,0,.38))");

  /* ================= ATO 1 · o gancho ================= */
  cenaV({ id: "c01", vis: [0, 1.45], nome: "A IA virou", inicio: 0, fim: 1.25, descricao: "«A IA» bate no escuro; «virou» sobe.",
    sfx: [["boom", 0.18, .5], ["whoosh", 0.66, .8], ["swoosh", 1.12, .7]],
    montar(S) {
      bg(S, CV); const C = cam(S, 0, 1.4, { s1: 1.07 });
      const a = txtC(C, 690, F(330, 700), "A <span style='color:" + AM + "'>IA</span>"); bate(a, .18, 1.55, 26, .3);
      linha(C, 0, 1050, F(150, 500), [["virou", .68]]).style.cssText += ";left:0;right:0;text-align:center";
      const fl = h("div", "layer", S, null, "background:#fff"); anim(fl, [[.17, { o: 0 }], [.19, { o: .55 }, "lin"], [.42, { o: 0 }, "out"]]);
      tremor(C, .18, 16);
      raiz(S, trans.saiParaCima(1.12, { d: .3, dist: 900 }));
    } });

  cenaV({ id: "c02", vis: [1.1, 2.72], nome: "Arma", inicio: 1.25, fim: 2.64, descricao: "«ARMA» em amarelo; a mira trava; «espionagem» sai de trás da tarja. Mergulho na mira.",
    sfx: [["tick", 1.30], ["blip", 1.34, .7], ["glitch", 1.68, .8], ["whoosh", 2.44, .9]],
    montar(S) {
      bg(S, CV); const C = cam(S, 1.1, 2.64, { s1: 1.06, oy: 840 });
      const a = txtC(C, 700, F(300, 700, AM), "ARMA"); bate(a, 1.30, 1.25, 10, .22);
      mira(C, 540, 845, 360, 1.18, 1.32);
      const e = txtC(C, 1110, F(96, 500), "de espionagem?"); anim(e, VIS(1.66, 9));
      tarja(C, 160, 1098, 760, 120, 1.26, 1.68, AM);
      tremor(C, 1.30, 8);
      S.style.transformOrigin = "540px 845px";
      raiz(S, trans.entraDeBaixo(1.12, { d: .32, dist: 900 }), [[2.42, { s: 1, b: 0, o: 1 }], [2.7, { s: 7, b: 10, o: 0 }, "inExpo"]]);
    } });

  cenaV({ id: "c03", vis: [2.48, 4.64], nome: "Um único operador", inicio: 2.64, fim: 4.6, descricao: "Grade tática em profundidade; um único ponto amarelo acende: OPERADOR · 01.",
    sfx: [["swell", 2.64, .8], ["blip", 3.30], ["key", 3.60, .7], ["key", 3.68, .7], ["key", 3.76, .7], ["key", 3.84, .7], ["key", 3.92, .7], ["key", 4.0, .7]],
    montar(S) {
      bg(S, CV); const C = cam(S, 2.5, 4.7, { s0: 1, s1: 1.14, oy: 860 });
      chao(C, { y: 900 });
      linha(C, X, 380, F(92, 600, "#fff"), [["Imagine", 2.64], ["um", 3.0], ["único", 3.30, `color:${AM}`]]);
      linha(C, X, 490, F(92, 600, AC), [["operador", 3.60]]);
      ponto(C, 540, 880, 3.30);
      cantos(C, 470, 810, 140, 140, 3.32);
      rot(C, 630, 930, "OPERADOR · 01", 3.60, AM);
      raiz(S, trans.entraZoom(2.5, { s: .3, d: .4 }), VIS(2.5, 4.62, .06));
    } });

  cenaV({ id: "c04", vis: [4.58, 6.52], nome: "Agentes de IA", inicio: 4.6, fim: 6.4, descricao: "Do ponto saem rajadas de agentes (chevrons) em três anéis: 8, 32, 64.",
    sfx: [["pop", 4.68], ["blip", 4.76, .6], ["blip", 4.84, .5], ["swell", 5.34, .5], ["blip", 5.36, .6], ["blip", 5.44, .5], ["swoosh", 5.80, .7], ["blip", 5.84, .5]],
    montar(S) {
      bg(S, CV); const C = cam(S, 4.5, 6.5, { s0: 1.14, s1: 1.2, oy: 860 });
      chao(C, { y: 900 });
      const ag = []; const r = rng(11);
      [[8, 170, 4.68], [32, 310, 5.34], [64, 420, 5.80]].forEach(([n, R, t0]) => { for (let i = 0; i < n; i++) ag.push({ a: Math.PI * 2 * i / n + r() * .2, R: R * (.9 + r() * .2), t: t0 + r() * .12 }); });
      tela(C, 4.6, 6.4, (g, t) => {
        const cx = 540, cy = 880;
        g.strokeStyle = "rgba(138,143,152,.35)"; g.lineWidth = 2;
        for (const q of ag) {
          const p = P(t, q.t, q.t + .45); if (p <= 0) continue;
          const a = q.a + (t - q.t) * .12, x = cx + Math.cos(a) * q.R * p, y = cy + Math.sin(a) * q.R * p * .78;
          g.globalAlpha = .5; g.beginPath(); g.moveTo(cx, cy); g.lineTo(x, y); g.stroke(); g.globalAlpha = 1;
          chev(g, x, y, a, 1.5, "#FFE680", Math.min(1, p * 2));
        }
      });
      ponto(C, 540, 880, 4.3);
      linha(S, X, 290, F(150, 700), [["AGENTES", 4.68]]);
      linha(S, X, 455, F(56, 400, AC), [["de", 5.14], ["inteligência", 5.34], ["artificial", 5.80, `color:${AM}`]]);
      raiz(S, [[6.22, { s: 1, o: 1, b: 0 }], [6.5, { s: .5, o: 0, b: 12 }, "in"]]);
    } });

  const ORG = { cols: 18, rows: 22, size: 40, gap: 13, x0: 64, y0: 380 };
  const hitOrg = (() => { const r = rng(5), m = {}; for (let i = 0; i < ORG.cols * ORG.rows; i++) if (r() < .34) m[i] = 6.72 + r() * 1.7; return i => m[i] ?? 1e9; })();
  cenaV({ id: "c05", vis: [6.38, 8.52], nome: "Centenas de organizações", inicio: 6.4, fim: 8.5, descricao: "Recuo: uma grade enorme de organizações; os agentes mergulham e cada alvo atingido fica amarelo.",
    sfx: [["whoosh", 6.42, .9], ["glitch", 6.72, .7], ["glitch", 6.98, .5], ["swoosh", 7.08, .8], ["glitch", 7.30, .45], ["blip", 7.6, .4]],
    montar(S) {
      bg(S, CV); const C = cam(S, 6.3, 8.5, { s0: 1.6, s1: .97, e: "expo" });
      const r = rng(21), fl = Array.from({ length: 90 }, () => ({ i: Math.floor(r() * ORG.cols * ORG.rows), x: r() * 1080, t: 6.6 + r() * 1.8 }));
      tela(C, 6.4, 8.5, (g, t) => {
        gradeOrgs(g, t, { ...ORG, aceso: hitOrg });
        for (const f of fl) {
          const p = P(t, f.t, f.t + .35, "in"); if (p <= 0 || p >= 1) continue;
          const c = f.i % ORG.cols, rr = Math.floor(f.i / ORG.cols), tx = ORG.x0 + c * 53 + 20, ty = ORG.y0 + rr * 53 + 20;
          const x = lerp(f.x, tx, p), y = lerp(-60, ty, p); chev(g, x, y, Math.atan2(ty + 60, tx - f.x), 1.6, "#FFE680", 1);
        }
      });
      const w = txt(S, 0, 830, F(270, 700) + ";text-shadow:0 10px 40px rgba(0,0,0,.6)", "CENTENAS");
      anim(w, [[6.95, { x: 1100, o: 1 }], [8.5, { x: -1450 }, "lin"]]);
    } });

  cenaV({ id: "c06", vis: [8.48, 9.84], nome: "Ao mesmo tempo", inicio: 8.5, fim: 9.66, descricao: "Todos os alvos acendem num único pulso: AO MESMO TEMPO.",
    sfx: [["hit", 8.90], ["glitch", 8.93, .4]],
    montar(S) {
      bg(S, CV); const C = cam(S, 8.5, 9.7, { s0: .97, s1: .9 });
      tela(C, 8.5, 9.66, (g, t) => gradeOrgs(g, t, { ...ORG, aceso: hitOrg, flash: 8.90 }));
      h("div", "abs", S, null, "left:-100px;right:-100px;top:640px;height:620px;background:rgba(18,17,16,.82)");
      centro(S, 680, F(170, 700), [["AO", 8.44]]);
      centro(S, 860, F(170, 700), [["MESMO", 8.64]]);
      centro(S, 1040, F(170, 700, AM), [["TEMPO", 8.90]]);
      tremor(S, 8.90, 18);
    } });

  /* ================= ATO 2 · o dossiê ================= */
  cenaV({ id: "c07", vis: [9.46, 11.16], z: 41, nome: "Não é ficção", inicio: 9.66, fim: 10.98, descricao: "A tarja de censura troca de mundo: papel de dossiê. «FICÇÃO» é riscada em amarelo.",
    sfx: [["swoosh", 9.52, .8], ["swoosh", 10.24, .5], ["tick", 10.26, .6], ["flip", 10.86, .7]],
    montar(S) {
      papel(S); const C = cam(S, 9.5, 11.1, { s1: 1.05, r0: -.6, r1: 0 });
      rot(C, X, 300, "ARQUIVO 01 · CONFIDENCIAL", 9.7, AC);
      centro(C, 700, F(84, 500, TK), [["NÃO", 9.84], ["É", 10.04]]);
      const f = linha(C, 0, 800, F(240, 700, TK), [["FICÇÃO", 10.24]]); f.style.cssText += ";left:0;right:0;text-align:center";
      risco(f.querySelector(".mask"), 10.36);
      [[X, 1180, 640], [X, 1236, 520], [X, 1292, 700]].forEach(([x, y, w]) => h("div", "abs", C, null, `left:${x}px;top:${y}px;width:${w}px;height:22px;background:${TK}`));
      tarjaWipe(S, 9.48);
      raiz(S, [[10.84, { x: 0, ry: 0, o: 1 }], [11.14, { x: -1100, ry: 38, o: 1 }, "in"]]);
    } });

  cenaV({ id: "c08", vis: [10.8, 13.14], nome: "O relatório", inicio: 10.98, fim: 13.06, descricao: "A página do relatório entra girando em 3D; marca-texto em «FONTE: CROWDSTRIKE».",
    sfx: [["flip", 10.96, .8], ["swoosh", 12.00, .5], ["tick", 12.02, .5], ["whoosh", 12.86, .7]],
    montar(S) {
      papel(S); const C = cam(S, 10.9, 13.1, { s1: 1.06 });
      const { pg, sp } = pagina(C, 10.98);
      anim(pg, [[10.86, { x: 900, ry: -48, o: 1 }], [11.36, { x: 0, ry: -10 }, "expo"], [13.06, { ry: -4 }, "sine"]]);
      marca(sp, 12.00);
      S.style.transformOrigin = "520px 700px";
      raiz(S, [[12.86, { s: 1, o: 1, b: 0 }], [13.12, { s: 2.8, o: 0, b: 10 }, "inExpo"]]);
    } });

  cenaV({ id: "c09", vis: [12.9, 16.24], nome: "A ficha do grupo", inicio: 13.06, fim: 15.86, descricao: "Ficha: GRUPO DE ESPIONAGEM, carimbo IDENTIFICADO e o nome VAPORPANDA decodificando por trás da tarja.",
    sfx: [["whoosh", 13.04, .6], ["hit", 14.00, .6], ["glitch", 15.00, .8], ["tick", 15.30, .5], ["swoosh", 15.74, .7]],
    montar(S) {
      papel(S); const C = cam(S, 13.0, 15.9, { s1: 1.08, x1: -20, ox: 700, oy: 1100 });
      rot(C, X, 330, "FICHA · ALVO DE INTERESSE", 13.1, AC);
      linha(C, X, 420, F(64, 700, TK), [["GRUPO", 13.16], ["DE", 13.38], ["ESPIONAGEM", 13.52]]);
      h("div", "abs", C, null, `left:${X}px;top:520px;width:920px;height:3px;background:${TK}`);
      [["ORIGEM", 580], ["CLASSIFICAÇÃO", 650]].forEach(([k, y], i) => { txt(C, X, y, F(28, 600, AC, ".14em"), k); tarja(C, 420, y - 4, 360 - i * 80, 36, 13.4 + i * .1, null); });
      txt(C, X, 740, F(28, 600, AC, ".14em"), "IDENTIFICADO COMO");
      const nm = txt(C, X - 6, 800, F(140, 700, TK), ""); decode(nm, "VAPORPANDA", 15.0, .45);
      tarja(C, X, 790, 920, 170, 13.3, 15.0);
      carimbo(C, "IDENTIFICADO", 300, 1090, 14.00, -9);
      tremor(C, 14.0, 10);
      raiz(S, trans.entraZoom(12.92, { s: .6, d: .35 }));
    } });

  cenaV({ id: "c10", vis: [15.74, 18.44], nome: "A campanha", inicio: 15.86, fim: 18.3, descricao: "Volta o escuro: núcleo IA com a etiqueta VAPORPANDA, agentes em órbita, faixa CAMPANHA.",
    sfx: [["whoosh", 15.78, .8], ["glitch", 15.95, .4], ["blip", 16.72], ["swell", 16.74, .5], ["swoosh", 17.90, .8]],
    montar(S) {
      bg(S, CV); const C = cam(S, 15.8, 18.4, { s0: 1.05, s1: 1.12, r0: -1, r1: 1 });
      chao(C, { y: 1150, vel: 40 });
      const r = rng(31), orb = Array.from({ length: 30 }, (_, i) => ({ a: r() * 6.28, R: i % 2 ? 300 : 410, v: (i % 2 ? .9 : -.6) * (.8 + r() * .4) }));
      tela(C, 15.86, 18.3, (g, t) => { for (const q of orb) { const a = q.a + t * q.v, x = 540 + Math.cos(a) * q.R, y = 900 + Math.sin(a) * q.R * .42; chev(g, x, y, a + Math.PI / 2 * Math.sign(q.v), 1.4, "#FFE680", .9 * P(t, 15.9, 16.4)); } });
      hexIA(C, 540, 900, 150, 15.9);
      const pulso = h("div", "abs", C, null, `left:340px;top:700px;width:400px;height:400px;border-radius:50%;border:4px solid ${AM}`);
      anim(pulso, [[16.72, { s: .7, o: 0 }], [16.74, { o: .9 }, "lin"], [17.3, { s: 1.7, o: 0 }, "out"]]);
      const tag = h("div", "chip", C, "VAPORPANDA", "left:540px;top:610px;translate:-50% 0");
      anim(tag, [[15.9, { s: 2.2, o: 0, y: 160 }], [16.0, { o: 1 }, "lin"], [16.45, { s: 1, y: 0, x: 170 }, "expo"]]);
      const fx1 = txt(S, 0, 1260, F(210, 800, "transparent") + ";-webkit-text-stroke:2px rgba(255,255,255,.35)", "CAMPANHA · CAMPANHA · CAMPANHA");
      anim(fx1, [[17.50, { x: 500, o: 0 }], [17.58, { o: 1 }, "lin"], [18.6, { x: -1100 }, "lin"]]);
      const fx2 = txt(S, 0, 1480, F(54, 600, AM, ".14em"), "CAMPANHA · CAMPANHA · CAMPANHA · CAMPANHA");
      anim(fx2, [[17.55, { x: -900, o: 0 }], [17.63, { o: 1 }, "lin"], [18.6, { x: 0 }, "lin"]]);
      trans.circulo(S, 15.76, { x: 540, y: 880, d: .45 });
      raiz(S, [[18.16, { s: 1, o: 1, b: 0 }], [18.42, { s: 1.5, o: 0, b: 14 }, "in"]]);
    } });

  cenaV({ id: "c11", vis: [18.16, 21.22], nome: "Mais de 200", inicio: 18.3, fim: 21.1, descricao: "Contador gigante 000 → 200; atrás, exatamente 200 quadrados se preenchem.",
    sfx: [["riser", 18.30], ["tick", 19.06, .6], ["tick", 19.18, .6], ["tick", 19.30, .6], ["tick", 19.42, .6], ["tick", 19.56, .6], ["tick", 19.70, .6], ["boom", 19.86, .35], ["swell", 20.9, .5]],
    montar(S) {
      bg(S, CV); const C = cam(S, 18.2, 21.2, { s1: 1.06 });
      const G = { cols: 20, rows: 10, size: 34, gap: 12, x0: 85, y0: 1150 };
      tela(C, 18.3, 21.1, (g, t) => gradeOrgs(g, t, { ...G, base: "rgba(138,143,152,.22)", aparece: i => 18.3 + (i % 20) * .015 + Math.floor(i / 20) * .04, aceso: i => 19.0 + i * .0043 }));
      linha(C, 0, 420, F(64, 600, "#fff", ".02em"), [["MAIS", 19.02], ["DE", 19.30]]).style.cssText += ";left:0;right:0;text-align:center";
      const n = txtC(C, 520, F(400, 700, AM) + ";font-variant-numeric:tabular-nums", "");
      counter(n, 0, 200, 19.02, 19.86, v => String(Math.round(v)).padStart(3, "0"));
      anim(n, [[18.26, { o: 0, y: 60 }], [18.5, { o: 1, y: 0 }, "expo"], [19.86, { s: 1.14 }, "out"], [20.1, { s: 1 }, "out5"]]);
      const org = txtC(C, 1000, F(70, 600, "#fff", ".04em"), "ORGANIZAÇÕES"); anim(org, IN(19.86, { dy: 40, d: .4 }));
      tremor(C, 19.86, 16);
      raiz(S, trans.entraFundo(18.18, { d: .4 }), [[20.94, { s: 1, o: 1, b: 0 }], [21.2, { s: 3.2, o: 0, b: 12 }, "inExpo"]]);
    } });

  const LATAM = ["Mexico", "Guatemala", "Belize", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Haiti", "Dominican Rep.", "Puerto Rico", "Jamaica", "Bahamas", "Trinidad and Tobago",
    "Colombia", "Venezuela", "Guyana", "Suriname", "Ecuador", "Peru", "Bolivia", "Brazil", "Paraguay", "Uruguay", "Argentina", "Chile"];
  cenaV({ id: "c12", vis: [20.94, 24.16], nome: "14 países", inicio: 21.1, fim: 24.0, descricao: "Mapa-múndi inclinado; uma régua de 14 marcadores acende (sem apontar países: a narração não diz quais).",
    sfx: [["whoosh", 21.06, .8], ["swoosh", 21.4, .5], ...Array.from({ length: 14 }, (_, i) => ["blip", +(22.14 + i * .055).toFixed(3), .45]), ["tick", 22.90, .7], ["swoosh", 23.86, .8]],
    montar(S) {
      bg(S, CV); const C = cam(S, 21.0, 24.1, { s1: 1.05 });
      const W = h("div", "abs", C, null, "left:-100px;top:470px;width:1280px;height:900px;overflow:hidden");
      MDS.mapa(W, { x: 0, y: 0, w: 1280, h: 900, terra: "#2B2926", borda: CV, camera: [[21.1, { lat: 18, lon: -20, zoom: 1.15 }], [24.0, { lat: 12, lon: 25, zoom: 1.3 }]] });
      anim(W, [[21.0, { rx: 40, o: 0, y: 80 }], [21.5, { rx: 24, o: 1, y: 0 }, "expo"]]);
      const varre = h("div", "abs", W, null, "top:0;bottom:0;width:180px;background:linear-gradient(90deg,transparent,rgba(255,210,31,.22),transparent)");
      anim(varre, [[21.2, { x: -200 }], [22.6, { x: 1300 }, "inOut"]]);
      rot(C, X, 300, "DISTRIBUÍDAS POR PELO MENOS", 21.12, AC);
      const n = txt(C, X - 8, 350, F(230, 700, AM) + ";font-variant-numeric:tabular-nums", ""); counter(n, 0, 14, 22.14, 22.88, v => String(Math.round(v)).padStart(2, "0"));
      anim(n, IN(22.1, { dy: 50, d: .35 }));
      linha(C, 420, 450, F(96, 600), [["PAÍSES", 22.88]]);
      tela(C, 21.1, 24.0, (g, t) => { for (let i = 0; i < 14; i++) { const ti = 22.14 + i * .055, on = t >= ti, x = 120 + i * 61, y = 1420, k = P(t, ti, ti + .2, "back"); g.fillStyle = on ? AM : "rgba(138,143,152,.3)"; const s = 44 * (on ? Math.max(.6, k) : .7); g.fillRect(x + (44 - s) / 2, y + (44 - s) / 2, s, s); } });
      raiz(S, trans.entraZoom(20.96, { s: .5, d: .38 }), trans.chicoteSai(23.84, { dir: 1, d: .3 }));
    } });

  cenaV({ id: "c13", vis: [23.9, 26.75], nome: "Agentes coordenados", inicio: 24.0, fim: 26.7, descricao: "Agentes soltos se encaixam de uma vez numa formação perfeita: COORDENADOS.",
    sfx: [["swoosh", 24.0, .8], ["blip", 24.3, .4], ["click", 25.70], ["flip", 25.72, .6], ["whoosh", 26.50, .7]],
    montar(S) {
      bg(S, CV); const C = cam(S, 23.9, 26.8, { s1: 1.06 });
      chao(C, { y: 1300, vel: 30 });
      const r = rng(41), N = 120, ag = Array.from({ length: N }, (_, i) => ({ x: 60 + r() * 960, y: 620 + r() * 760, a: r() * 6.28, ph: r() * 6.28, gx: 160 + (i % 12) * 68, gy: 700 + Math.floor(i / 12) * 66 }));
      tela(C, 24.0, 26.7, (g, t) => {
        const p = P(t, 25.70, 26.05), q = P(t, 26.45, 26.75, "in");
        for (const a of ag) {
          const wx = a.x + Math.sin(t * 1.3 + a.ph) * 40, wy = a.y + Math.cos(t * 1.1 + a.ph) * 30;
          let x = lerp(wx, a.gx, p), y = lerp(wy, a.gy, p), ang = lerp(a.a + t * .8, 0, p);
          x = lerp(x, 540, q); y = lerp(y, 1030, q);
          chev(g, x, y, ang, 1.5, p > .98 ? AM : "#FFE680", P(t, 24.0, 24.3) * (1 - q * .7));
        }
      });
      rot(C, X, 330, "A OPERAÇÃO", 24.08, AC);
      const w = txt(C, X, 400, F(112, 700), "COORDENADOS");
      fx(t => { w.style.letterSpacing = (lerp(.03, -.045, P(t, 25.4, 26.0))).toFixed(3) + "em"; });
      anim(w, IN(24.6, { dy: 60, d: .45 }));
      raiz(S, trans.chicoteEntra(23.92, { dir: 1, d: .38 }));
    } });

  cenaV({ id: "c14", vis: [26.66, 28.62], nome: "Artex", inicio: 26.7, fim: 28.5, descricao: "Os agentes convergem para o núcleo: FERRAMENTA · ARTEX (diagrama, não interface).",
    sfx: [["whoosh", 26.76, .6], ["blip", 27.58, .8], ["glitch", 27.64, .8], ["tick", 27.95, .5], ["whoosh", 28.36, .8]],
    montar(S) {
      bg(S, CV); const C = cam(S, 26.6, 28.6, { s1: 1.08, oy: 1030 });
      const N = 16;
      tela(C, 26.7, 28.5, (g, t) => {
        const p = P(t, 27.64, 28.1), cv = P(t, 26.66, 27.05, "in");
        if (cv < 1) for (let i = 0; i < 120; i++) chev(g, lerp(160 + (i % 12) * 68, 540, cv), lerp(700 + Math.floor(i / 12) * 66, 1030, cv), 0, 1.5, AM, 1 - cv * .6);
        g.strokeStyle = "rgba(255,210,31,.4)"; g.lineWidth = 2;
        for (let i = 0; i < N; i++) {
          const a = Math.PI * 2 * i / N + t * .15, R = lerp(0, 380, p), x = 540 + Math.cos(a) * R, y = 1030 + Math.sin(a) * R * .8;
          if (p > 0) { g.beginPath(); g.moveTo(540, 1030); g.lineTo(x, y); g.globalAlpha = p; g.stroke(); g.globalAlpha = 1; }
          chev(g, x, y, a, 1.6, AM, p > 0 ? 1 : 0);
        }
      });
      const core = h("div", "abs", C, null, `left:420px;top:910px;width:240px;height:240px;border:6px solid ${AM};border-radius:10px;background:#1B1A18`);
      h("div", "abs", core, null, `inset:28px;border:2px solid rgba(255,210,31,.4);border-radius:4px`);
      anim(core, [[26.74, { s: .3, o: 0, r: 45 }], [27.1, { s: 1, o: 1, r: 0 }, "back"], [27.64, { s: 1.12 }, "out"], [27.9, { s: 1 }, "out5"]]);
      const an = h("div", "abs", C, null, `left:380px;top:870px;width:320px;height:320px;border:4px solid ${AM};border-radius:16px`);
      anim(an, [[27.64, { s: 1, o: 0 }], [27.66, { o: 1 }, "lin"], [28.2, { s: 1.9, o: 0 }, "out"]]);
      rotC(C, 680, "FERRAMENTA", 26.76, AC);
      const nm = txtC(C, 1250, F(170, 700), ""); decode(nm, "ARTEX", 27.64, .3);
      raiz(S, VIS(26.66, 9, .05), [[28.34, { s: 1, b: 0 }], [28.6, { s: 3, b: 12 }, "inExpo"]]);
      S.style.transformOrigin = "540px 1030px";
    } });

  cenaV({ id: "c15", vis: [28.36, 31.98], nome: "Modelo DeepSeek", inicio: 28.5, fim: 31.9, descricao: "Pilha de cartões em 3D: só um tem texto, MODELO DEEPSEEK; os outros ficam sob tarja.",
    sfx: [["pop", 28.54, .8], ["pop", 28.62, .6], ["pop", 28.70, .6], ["pop", 28.78, .5], ["click", 29.18], ["swell", 29.20, .5], ["swoosh", 30.34, .5], ["swoosh", 30.52, .4]],
    montar(S) {
      bg(S, CV); const C = cam(S, 28.4, 32.0, { s1: 1.06, r0: -1.2, r1: 1 });
      rot(C, X, 320, "TECNOLOGIAS EMPREGADAS", 28.56, AC);
      const ST = h("div", "abs", C, null, "left:160px;top:520px;width:760px;height:1000px;perspective:1600px");
      for (let i = 0; i < 5; i++) {
        const cd = h("div", "card", ST, null, `left:0;top:${i * 190}px;width:760px;height:160px`);
        if (i === 2) {
          txt(cd, 44, 30, F(22, 600, AC, ".16em"), "MODELO");
          const t = txt(cd, 44, 66, F(64, 700), "DEEPSEEK"); MDS.at(29.18, on => { t.style.color = on ? AM : "#fff"; cd.style.borderColor = on ? AM : "#34312E"; cd.style.boxShadow = on ? "0 0 0 2px rgba(255,210,31,.25),0 30px 80px -20px rgba(255,210,31,.35)" : ""; });
          anim(cd, [[28.54 + i * .08, { o: 0, x: 260, ry: -40 }], [28.54 + i * .08 + .45, { o: 1, x: 0, ry: -14 }, "expo"], [29.18, { y: 0, s: 1 }], [29.45, { y: -30, s: 1.07, ry: -6 }, "back"]]);
        } else {
          [[44, 40, 300 - i * 20], [44, 92, 520 - i * 30]].forEach(([x, y, w], k) => { const b = h("div", "abs", cd, null, `left:${x}px;top:${y}px;width:${w}px;height:${k ? 30 : 22}px;background:#000;transform-origin:0 50%`); anim(b, [[30.34 + i * .04, { sx: 0 }], [30.62 + i * .04, { sx: 1 }, "out5"]]); });
          anim(cd, [[28.54 + i * .08, { o: 0, x: 260, ry: -40 }], [28.54 + i * .08 + .45, { o: .75, x: 0, ry: -14 }, "expo"], [29.18, { o: .75 }], [29.4, { o: .45 }, "out"]]);
        }
      }
      raiz(S, trans.entraZoom(28.38, { s: .5, d: .35 }), [[31.84, { o: 1 }], [31.96, { o: 0 }, "lin"]]);
    } });

  cenaV({ id: "c16", vis: [31.86, 33.4], nome: "O mais preocupante", inicio: 31.9, fim: 33.2, descricao: "Respiro de tensão: fitas de alerta diagonais e O MAIS PREOCUPANTE.",
    sfx: [["riser", 31.92, .9], ["swell", 31.95, .4]],
    montar(S) {
      bg(S, "#0B0A09"); const C = cam(S, 31.8, 33.3, { s1: 1.08 });
      const faixa = (y, r, dir) => { const f = h("div", "abs", C, null, `left:-600px;width:2280px;top:${y}px;height:130px;background:repeating-linear-gradient(45deg,${AM} 0 44px,${TK} 44px 88px);transform:rotate(${r}deg)`); anim(f, [[31.9, { x: dir * 300, o: 0 }], [32.1, { o: .9 }, "lin"], [33.2, { x: -dir * 200 }, "lin"]]); return f; };
      faixa(560, -14, 1); faixa(1250, -14, -1);
      const w = txtC(C, 920, F(60, 600, "#fff", ".08em"), "O MAIS PREOCUPANTE"); bate(w, 32.10, 1.2, 10, .3);
      raiz(S, VIS(31.86, 33.24, .06));
    } });

  cenaV({ id: "c17", vis: [33.03, 36.06], nome: "Os alvos", inicio: 33.2, fim: 35.9, descricao: "Miras travam; MINISTÉRIOS DAS RELAÇÕES EXTERIORES entra linha a linha.",
    sfx: [["hit", 33.42, .45], ["tick", 33.44, .7], ["tick", 33.56, .5], ["swoosh", 34.18, .8], ["swoosh", 34.96, .7], ["swoosh", 35.40, .6], ["whoosh", 35.74, .7]],
    montar(S) {
      bg(S, CV); const C = cam(S, 33.1, 36.0, { s1: 1.07 });
      rot(C, X, 320, "ALVOS", 33.42, AM);
      // prédio genérico com colunas
      const b = svg(C, 300, 260, "position:absolute;left:660px;top:380px;overflow:visible"), g = sel(b, "g", { fill: "none", stroke: AM, "stroke-width": 6, "stroke-linejoin": "round" });
      sel(g, "path", { d: "M20 80 L150 20 L280 80 Z" }); sel(g, "path", { d: "M30 230 L270 230 M20 250 L280 250" });
      [55, 105, 150, 195, 245].forEach(x => sel(g, "path", { d: `M${x} 100 L${x} 215` }));
      anim(b, [[33.5, { o: 0, y: 30 }], [33.9, { o: 1, y: 0 }, "expo"]]);
      mira(C, 810, 510, 190, 33.26, 33.44); mira(C, 230, 1420, 90, 33.30, 33.50); mira(C, 900, 1300, 70, 33.34, 33.56);
      const L1 = txt(C, X, 820, F(124, 700), "MINISTÉRIOS"), L2 = txt(C, X, 960, F(112, 700), "DAS RELAÇÕES"), L3 = txt(C, X, 1090, F(112, 700, AM), "EXTERIORES");
      anim(L1, [[34.18, { x: -400, o: 0, b: 20 }], [34.6, { x: 0, o: 1, b: 0 }, "expo"]]);
      anim(L2, [[34.96, { x: 400, o: 0, b: 20 }], [35.36, { x: 0, o: 1, b: 0 }, "expo"]]);
      anim(L3, [[35.40, { x: -400, o: 0, b: 20 }], [35.78, { x: 0, o: 1, b: 0 }, "expo"]]);
      tremor(C, 33.42, 12);
      trans.cortina(S, 33.05, { lado: "cima", d: .3 });
      raiz(S, trans.saiParaCima(35.74, { d: .3, dist: 900 }));
    } });

  cenaV({ id: "c18", vis: [35.74, 38.08], nome: "América Latina", inicio: 35.9, fim: 37.9, descricao: "O mapa gira até a América Latina; a região inteira acende com varredura.",
    sfx: [["whoosh", 35.96, .8], ["swoosh", 36.74, .6], ["blip", 36.76, .8], ["tick", 37.10, .5], ["swoosh", 37.70, .8]],
    montar(S) {
      bg(S, CV); const C = cam(S, 35.8, 38.0, { s1: 1.05 });
      const W = h("div", "abs", C, null, "left:-100px;top:560px;width:1280px;height:1000px;overflow:hidden");
      MDS.mapa(W, { x: 0, y: 0, w: 1280, h: 1000, terra: "#2B2926", borda: CV,
        destaques: LATAM.map((p, i) => ({ pais: p, t: 36.74 + i * .012, cor: AM })),
        camera: [[35.9, { lat: 22, lon: -40, zoom: 1.5 }], [36.7, { lat: -14, lon: -66, zoom: 2.7 }], [37.9, { lat: -16, lon: -64, zoom: 2.85 }]] });
      anim(W, [[35.8, { rx: 30 }], [36.7, { rx: 14 }, "expo"]]);
      const varre = h("div", "abs", W, null, "left:0;right:0;height:200px;background:linear-gradient(transparent,rgba(255,210,31,.3),transparent)");
      anim(varre, [[36.73, { y: -200, o: 0 }], [36.74, { o: 1 }, "lin"], [37.4, { y: 1100 }, "inOut"], [37.5, { o: 0 }, "lin"]]);
      linha(C, X, 300, F(140, 700), [["AMÉRICA", 36.74]]);
      linha(C, X, 440, F(140, 700, AM), [["LATINA", 37.0]]);
      raiz(S, trans.entraDeBaixo(35.76, { d: .38, dist: 900 }));
    } });

  cenaV({ id: "c19", vis: [37.7, 39.92], nome: "Confirmado", inicio: 37.9, fim: 39.8, descricao: "De volta ao relatório: o carimbo CONFIRMADO bate e a página treme.",
    sfx: [["swoosh", 37.74, .8], ["hit", 38.60, .4], ["whoosh", 39.64, .6]],
    montar(S) {
      papel(S); const C = cam(S, 37.7, 39.9, { s0: 1.04, s1: 1.1 });
      const { pg, sp } = pagina(C, 37.9); marca(sp, 37.5); anim(pg, [[37.7, { ry: -6 }], [39.8, { ry: -2 }, "sine"]]);
      carimbo(C, "CONFIRMADO", 230, 980, 38.60, -11);
      tremor(pg, 38.60, 16);
      tarjaWipe(S, 37.72);
      raiz(S, [[39.62, { s: 1, o: 1 }], [39.9, { s: .12, o: 0 }, "inExpo"]]);
    } });

  const G200 = { cols: 20, rows: 10, size: 36, gap: 12, x0: 66, y0: 1010 };
  const nove = [23, 47, 58, 91, 102, 125, 140, 163, 187];
  const acesoNove = (t0, st) => i => { const k = nove.indexOf(i); return k < 0 ? 1e9 : t0 + k * st; };
  cenaV({ id: "c20", vis: [39.64, 42.0], nome: "Nove invasões", inicio: 39.8, fim: 41.98, descricao: "Na grade dos 200, nove acendem em amarelo: 9 invasões confirmadas.",
    sfx: [["glitch", 39.86, .5], ...nove.map((_, k) => ["blip", +(39.86 + k * .08).toFixed(2), .5]), ["pop", 40.48, .9], ["swell", 40.5, .4]],
    montar(S) {
      bg(S, CV); const C = cam(S, 39.7, 42.0, { s1: 1.05 });
      tela(C, 39.8, 41.98, (g, t) => gradeOrgs(g, t, { ...G200, base: "rgba(138,143,152,.2)", aceso: acesoNove(39.86, .08) }));
      const n = txt(C, X - 10, 300, F(560, 700, AM), "9"); bate(n, 40.48, 1.4, 20, .26);
      linha(C, 440, 420, F(62, 600), [["ORGANIZAÇÕES", 40.80]]);
      linha(C, 440, 500, F(62, 600, AC), [["COM", 39.86], ["INVASÃO", 39.86]]);
      linha(C, 440, 580, F(62, 600, AC), [["CONFIRMADA", 40.1]]);
      raiz(S, trans.entraFundo(39.66, { d: .38 }));
    } });

  /* ================= ATO 3 · a virada ================= */
  cenaV({ id: "c21", vis: [41.96, 44.0], nome: "Um detalhe", inicio: 41.98, fim: 43.9, descricao: "Tudo congela e perde a cor; zoom brusco num único quadrado: MAS…",
    sfx: [["swell", 41.98, .7], ["glitch", 42.0, .3], ["whoosh", 42.56, .9], ["tick", 42.62, .6]],
    montar(S) {
      bg(S, CV);
      const k = nove[4], cx = G200.x0 + (k % 20) * 48 + 18, cy = G200.y0 + Math.floor(k / 20) * 48 + 18;
      const C = cam(S, 42.5, 43.95, { s0: 1, s1: 9, ox: cx, oy: cy, e: "inExpo" });
      const cv = tela(C, 41.98, 43.9, (g, t) => { gradeOrgs(g, t, { ...G200, base: "rgba(138,143,152,.2)", aceso: acesoNove(0, 0) }); });
      MDS.at(42.55, on => { cv.style.filter = on ? "none" : "grayscale(1) brightness(.8)"; });
      const m = txtC(S, 560, F(300, 700), "MAS…"); bate(m, 41.98, 1.3, 14, .28);
      linha(S, 0, 900, F(60, 400, AC), [["um", 42.48], ["detalhe", 42.58, "color:#fff"], ["importante", 42.88]]).style.cssText += ";left:0;right:0;text-align:center";
      trans.flash(43.86, { cor: AM, d: .3, z: 96 });
    } });

  cenaV({ id: "c22", vis: [43.88, 45.86], nome: "Não agiu sozinha", inicio: 43.9, fim: 45.7, descricao: "O núcleo IA sozinho no centro; NÃO bate em amarelo.",
    sfx: [["blip", 43.98], ["hit", 45.02], ["whoosh", 45.56, .6]],
    montar(S) {
      bg(S, CV); const C = cam(S, 43.8, 45.8, { s1: 1.06 });
      chao(C, { y: 1280, vel: 30 });
      const hx = hexIA(C, 540, 1100, 170, 43.95);
      fx(t => { hx.style.rotate = ((t - 43.9) * 6).toFixed(2) + "deg"; });
      linha(C, 0, 500, F(60, 500, AC), [["A", 43.9], ["inteligência", 43.98], ["artificial", 44.44]]).style.cssText += ";left:0;right:0;text-align:center";
      const n = txtC(C, 610, F(340, 700, AM), "NÃO"); bate(n, 45.02, 1.6, 22, .24);
      tremor(C, 45.02, 16);
      raiz(S, [[45.54, { s: 1, o: 1, b: 0 }], [45.84, { s: .72, o: 0, b: 12 }, "in"]]);
    } });

  cenaV({ id: "c23", vis: [45.58, 47.48], nome: "Completamente sozinha", inicio: 45.7, fim: 47.34, descricao: "SOZINHA é riscada; o ponto do operador entra pela direita.",
    sfx: [["swoosh", 45.72, .6], ["swoosh", 46.38, .5], ["tick", 46.40, .5], ["swell", 46.90, .6], ["whoosh", 47.18, .9]],
    montar(S) {
      bg(S, CV); const C = cam(S, 45.6, 47.4, { s1: 1.05, x1: -20 });
      linha(C, X, 660, F(98, 600, AC), [["COMPLETAMENTE", 45.74]]);
      const s = linha(C, X - 6, 780, F(196, 700), [["SOZINHA", 46.28]]); risco(s.querySelector(".mask"), 46.42);
      const vem = h("div", "abs", C, null, "left:0;top:0"); ponto(vem, 880, 1260, 46.9);
      anim(vem, [[46.9, { x: 300 }], [47.25, { x: 0 }, "expo"]]);
      raiz(S, trans.entraFundo(45.6, { d: .35 }), trans.chicoteSai(47.16, { dir: 1, d: .3 }));
    } });

  cenaV({ id: "c24", vis: [47.18, 49.54], nome: "O operador humano", inicio: 47.34, fim: 49.4, descricao: "O ponto vira um ícone de pessoa: OPERADOR HUMANO. Os agentes giram juntos para onde ele aponta.",
    sfx: [["blip", 47.82], ["swell", 47.84, .4], ["swoosh", 48.54, .8], ["swoosh", 48.62, .5], ["whoosh", 49.26, .7]],
    montar(S) {
      bg(S, CV); const C = cam(S, 47.2, 49.5, { s1: 1.08, oy: 900 });
      chao(C, { y: 1150, vel: 40 });
      const r = rng(51), ag = Array.from({ length: 44 }, (_, i) => { const a = Math.PI * 2 * i / 44 + r() * .1, R = 300 + r() * 160; return { x: 540 + Math.cos(a) * R, y: 900 + Math.sin(a) * R * .75, a0: r() * 6.28, d: r() * .12 }; });
      tela(C, 47.34, 49.4, (g, t) => {
        const alvo = -Math.PI / 5; g.strokeStyle = "rgba(255,210,31,.28)"; g.lineWidth = 2;
        for (const q of ag) {
          const p = P(t, 48.54 + q.d, 48.9 + q.d), ang = lerp(q.a0, alvo, p);
          if (p > 0) { g.globalAlpha = p * .8; g.beginPath(); g.moveTo(540, 900); g.lineTo(q.x, q.y); g.stroke(); g.globalAlpha = 1; }
          chev(g, q.x, q.y, ang, 1.6, p > .95 ? AM : "#FFE680", P(t, 47.4, 47.8));
        }
      });
      const ic = svg(C, 200, 220, "position:absolute;left:440px;top:790px;overflow:visible"), gi = sel(ic, "g", { fill: AM });
      sel(gi, "circle", { cx: 100, cy: 62, r: 46 }); sel(gi, "path", { d: "M20 210 C20 140 60 118 100 118 C140 118 180 140 180 210 Z" });
      ic.style.transformOrigin = "50% 40%"; anim(ic, [[47.80, { s: .1, o: 0 }], [47.84, { o: 1 }, "lin"], [48.2, { s: 1 }, "back"]]);
      const pt = ponto(C, 540, 900, 47.0);
      MDS.at(47.82, on => { pt.style.display = on ? "none" : "block"; });
      rotC(C, 1060, "OPERADOR HUMANO", 47.82, AM);
      linha(S, X, 320, F(60, 500, AC), [["direcionava", 48.54, "color:#fff"], ["os", 48.90], ["agentes", 49.04]]);
      raiz(S, trans.chicoteEntra(47.2, { dir: 1, d: .36 }), trans.saiParaCima(49.26, { d: .26, dist: 700 }));
    } });

  cenaV({ id: "c25", vis: [49.26, 51.98], nome: "Decisões estratégicas", inicio: 49.4, fim: 51.94, descricao: "Três caminhos; um cursor escolhe e clica; os outros apagam. DECISÕES ESTRATÉGICAS.",
    sfx: [["swoosh", 49.30, .6], ["click", 49.76], ["send", 49.82, .6], ["swoosh", 50.46, .6], ["flip", 51.80, .8]],
    montar(S) {
      bg(S, CV); const C = cam(S, 49.3, 52.0, { s1: 1.05 });
      rot(C, X, 320, "INTERVENÇÃO HUMANA", 49.42, AM);
      const s = svg(C, 1080, 760, "position:absolute;left:0;top:480px;overflow:visible");
      const ys = [150, 380, 610], paths = ys.map(y => path(s, `M200 380 C 420 380, 520 ${y}, 800 ${y}`, { fill: "none", stroke: "#fff", "stroke-width": 6, "stroke-linecap": "round" }));
      paths.forEach((p, i) => { draw(p, 49.42 + i * .06, 49.75 + i * .06); MDS.at(50.46, on => { p.style.opacity = on && i !== 1 ? .14 : 1; }); });
      MDS.at(49.76, on => { paths[1].style.stroke = on ? AM : "#fff"; paths[1].style.strokeWidth = on ? 9 : 6; });
      sel(s, "circle", { cx: 200, cy: 380, r: 22, fill: AM });
      const box = ys.map((y, i) => { const b = h("div", "abs", C, null, `left:800px;top:${480 + y - 50}px;width:150px;height:100px;border:4px solid #fff;border-radius:12px;background:#1B1A18`); anim(b, [[49.6 + i * .06, { s: .4, o: 0 }], [49.9 + i * .06, { s: 1, o: 1 }, "back"]]); MDS.at(50.46, on => { b.style.opacity = on && i !== 1 ? .14 : 1; }); return b; });
      MDS.at(49.76, on => { box[1].style.borderColor = on ? AM : "#fff"; box[1].style.boxShadow = on ? "0 0 40px rgba(255,210,31,.45)" : ""; });
      const cur = svg(C, 60, 80, "position:absolute;left:0;top:0;overflow:visible"); path(cur, "M0 0 L0 62 L16 48 L28 74 L40 68 L28 43 L48 43 Z", { fill: "#fff", stroke: TK, "stroke-width": 3 });
      anim(cur, [[49.3, { x: 640, y: 1500, o: 0 }], [49.4, { o: 1 }, "lin"], [49.72, { x: 880, y: 870 }, "expo"], [49.76, { s: .82 }, "out"], [49.86, { s: 1 }, "out"]]);
      linha(C, X, 1290, F(110, 700), [["DECISÕES", 50.46]]);
      linha(C, X, 1410, F(110, 700, AM), [["ESTRATÉGICAS", 50.88]]);
      raiz(S, trans.entraDeBaixo(49.28, { d: .34, dist: 700 }), [[51.78, { ry: 0, o: 1 }], [51.96, { ry: 90, o: 1 }, "in"]]);
    } });

  /* ================= ATO 4 · o novo cenário ================= */
  cenaV({ id: "c26", vis: [51.92, 54.42], nome: "Muda o cenário", inicio: 51.94, fim: 54.32, descricao: "O quadro vira como um cartão: novo cenário. CIBERSEGURANÇA bate.",
    sfx: [["whoosh", 52.22, .7], ["boom", 53.16, .5], ["swell", 54.2, .4]],
    montar(S) {
      bg(S, "#0E0D0C"); const C = cam(S, 51.9, 54.4, { s1: 1.07 });
      chao(C, { topo: true, y: 760, vel: 50 });
      linha(C, 0, 620, F(92, 600), [["MUDA", 52.20], ["O", 52.60], ["CENÁRIO", 52.68]]).style.cssText += ";left:0;right:0;text-align:center";
      const w = txtC(C, 800, F(98, 700, AM), "CIBERSEGURANÇA"); bate(w, 53.16, 1.5, 20, .26);
      tremor(C, 53.16, 16);
      raiz(S, [[51.94, { ry: -90 }], [52.26, { ry: 0 }, "expo"], [54.18, { o: 1, b: 0 }], [54.4, { o: 0, b: 16 }, "in"]]);
    } });

  cenaV({ id: "c27", vis: [54.24, 56.36], nome: "Um grupo pequeno", inicio: 54.32, fim: 56.3, descricao: "Espaço enorme e vazio; três pontos pequenos: UM GRUPO PEQUENO.",
    sfx: [["swoosh", 54.50, .7], ["swell", 54.52, .4], ["blip", 55.52, .8], ["blip", 55.60, .7], ["blip", 55.68, .6]],
    montar(S) {
      bg(S, "#0B0A09"); const C = cam(S, 54.2, 56.4, { s1: 1.1 });
      const ag = txtC(C, 820, F(170, 700), "AGORA"); anim(ag, [[54.52, { o: 0, s: 1.3, b: 16 }], [54.56, { o: 1 }, "lin"], [54.8, { s: 1, b: 0 }, "out5"], [55.05, { o: 1, s: 1 }], [55.3, { o: 0, s: .6, b: 10 }, "in"]]);
      ponto(C, 500, 920, 55.52, 9); ponto(C, 575, 895, 55.60, 9); ponto(C, 545, 975, 55.68, 9);
      linha(C, 0, 1120, F(44, 500, AC, ".1em"), [["UM", 55.16], ["GRUPO", 55.32], ["PEQUENO", 55.52, `color:${AM}`]]).style.cssText += ";left:0;right:0;text-align:center";
      raiz(S, VIS(54.26, 9, .1));
    } });

  const SW = (() => { const r = rng(61), a = []; for (let i = 0; i < 1400; i++) { const k = i % 3; a.push({ k, ang: r() * 6.28, sp: 240 + r() * 820, ph: r() * 6.28, lane: r() }); } return a; })();
  const SEEDS = [[500, 920], [575, 895], [545, 975]];
  cenaV({ id: "c28", vis: [56.26, 57.95], nome: "Coordenar", inicio: 56.3, fim: 57.9, descricao: "Dos três pontos explodem milhares de agentes, que se organizam em correntes: COORDENAR.",
    sfx: [["whoosh", 56.28], ["whoosh", 56.34, .6], ["swoosh", 56.42, .5], ["blip", 56.82, .6], ["riser", 57.40, .9]],
    montar(S) {
      bg(S, "#0B0A09"); const C = cam(S, 56.2, 57.95, { s0: 1.1, s1: 1.0 });
      tela(C, 56.3, 57.9, (g, t) => {
        const p = P(t, 56.30, 56.95), q = P(t, 56.9, 57.9, "inOut");
        for (const a of SW) {
          const [sx, sy] = SEEDS[a.k], R = a.sp * p;
          let x = sx + Math.cos(a.ang) * R, y = sy + Math.sin(a.ang) * R * .9;
          const lx = ((a.lane * 1200 + t * 520 + a.ph * 40) % 1300) - 110, ly = 640 + a.k * 230 + Math.sin(lx / 160 + a.ph) * 60;
          x = lerp(x, lx, q); y = lerp(y, ly, q);
          chev(g, x, y, lerp(a.ang, Math.cos(lx / 160 + a.ph) * .35, q), .9, a.k === 1 ? AM : "#FFE680", .9);
        }
      });
      const w = txt(S, X, 330, F(150, 700), ""); "COORDENAR".split("").forEach((c, i) => { const m = tipo.palavra(w, c, 56.30 + i * .03, { size: 150, d: .4 }); });
      rot(S, X, 520, "OPERAÇÕES DIGITAIS", 56.82, AM);
      raiz(S, VIS(56.28, 9, .04));
    } });

  cenaV({ id: "c29", vis: [57.88, 59.8], nome: "Escala muito maior", inicio: 57.9, fim: 59.74, descricao: "Recuo extremo: o enxame vira textura sobre o globo; MAIOR cresce até encher a tela.",
    sfx: [["hit", 58.90], ["whoosh", 59.40, .7]],
    montar(S) {
      bg(S, "#0B0A09"); const C = cam(S, 57.9, 59.8, { s0: 1.7, s1: .85, e: "out" });
      tela(C, 57.9, 59.74, (g, t) => {
        g.strokeStyle = "rgba(138,143,152,.35)"; g.lineWidth = 2;
        for (let i = -3; i <= 3; i++) { g.beginPath(); g.ellipse(540, 960, 440, Math.abs(Math.cos(i / 7 * Math.PI / 2)) * 440, 0, 0, 6.29); g.stroke(); }
        g.beginPath(); g.arc(540, 960, 440, 0, 6.29); g.stroke();
        for (let i = 0; i < 900; i++) {
          const lat = Math.asin(2 * (i + .5) / 900 - 1), lon = i * 2.39996 + t * .5, cz = Math.cos(lat) * Math.cos(lon); if (cz < -0.1) continue;
          const x = 540 + Math.cos(lat) * Math.sin(lon) * 440, y = 960 + Math.sin(lat) * 440;
          g.globalAlpha = .4 + .6 * Math.max(0, cz); g.fillStyle = i % 9 ? "#FFE680" : AM; g.fillRect(x - 3, y - 3, 6, 6);
        }
        g.globalAlpha = 1;
      });
      linha(S, X, 330, F(90, 600), [["ESCALA", 58.18]]);
      linha(S, X, 440, F(60, 500, AC), [["MUITO", 58.54]]);
      const m = txtC(S, 860, F(280, 700, AM), "MAIOR");
      anim(m, [[58.88, { o: 0, s: 1.6, b: 20 }], [58.92, { o: 1 }, "lin"], [59.1, { s: 1, b: 0 }, "out5"], [59.74, { s: 4.2 }, "inExpo"]]);
      MDS.at(59.5, on => { m.style.color = on ? "#fff" : AM; });
      tremor(S, 58.9, 14);
      trans.flash(59.74, { cor: PP, d: .3, z: 96 });
    } });

  cenaV({ id: "c30", vis: [59.72, 61.76], nome: "A pergunta", inicio: 59.74, fim: 61.6, descricao: "Papel: A PERGUNTA NÃO É MAIS digita como num relatório.",
    sfx: Array.from({ length: 20 }, (_, i) => ["key", +(59.84 + i / 14).toFixed(3), .8]),
    montar(S) {
      papel(S); const C = cam(S, 59.7, 61.7, { s1: 1.05 });
      rot(C, X, 330, "ARQUIVO 02 · CONCLUSÃO", 59.76, AC);
      const l1 = txt(C, X, 600, F(124, 700, TK), ""), l2 = txt(C, X, 740, F(124, 700, TK), "");
      [[X, 1060, 700], [X, 1116, 560], [X, 1172, 640], [X, 1228, 420]].forEach(([x, y, w], i) => { const b = h("div", "abs", C, null, `left:${x}px;top:${y}px;width:${w}px;height:22px;background:${i === 2 ? "rgba(21,21,21,.18)" : TK};transform-origin:0 50%`); anim(b, [[59.9 + i * .1, { sx: 0 }], [60.2 + i * .1, { sx: 1 }, "out5"]]); });
      typeText(l1, "A PERGUNTA", 59.84, 14); typeText(l2, "NÃO É MAIS", 60.56, 14);
      const car = h("div", "abs", C, null, `width:16px;height:118px;background:${AM}`);
      fx(t => { const on2 = t >= 60.56; car.style.left = (X + 8 + (on2 ? l2.offsetWidth : l1.offsetWidth)) + "px"; car.style.top = (on2 ? 744 : 604) + "px"; car.style.opacity = Math.floor(t * 3) % 2 || t < 61.3 ? 1 : 0; });
      raiz(S, [[61.44, { y: 0, o: 1 }], [61.74, { y: -500, o: 0 }, "inExpo"]]);
    } });

  cenaV({ id: "c31", vis: [61.42, 64.0], nome: "Se…", inicio: 61.6, fim: 63.94, descricao: "SE gigante; a pergunta antiga aparece e uma tarja preta a corta. A tarja cobre a tela.",
    sfx: [["swoosh", 61.50, .6], ["pop", 61.64, .5], ["pop", 62.64, .4], ["swoosh", 63.06, .8], ["tick", 63.08, .6], ["whoosh", 63.72, .8]],
    montar(S) {
      papel(S); const C = cam(S, 61.5, 64.0, { s1: 1.05 });
      const se = txt(C, X - 16, 360, F(420, 700, TK), "SE"); anim(se, IN(61.52, { dy: 160, d: .4 }));
      const qs = [["A IA PODE SER", 61.64], ["USADA EM", 62.64], ["ATAQUES?", 62.98]];
      qs.forEach(([s, t], i) => { const el = txt(C, X, 880 + i * 110, F(92, 600, TK), s); anim(el, IN(t, { dy: 50, d: .35 })); });
      corte(C, X - 10, 900, 760, 70, 63.06); corte(C, X - 10, 1010, 520, 70, 63.12); corte(C, X - 10, 1120, 560, 70, 63.18);
      const tudo = h("div", "abs", S, null, `left:-200px;top:-200px;width:1480px;height:2320px;background:${TK};transform-origin:0 50%`);
      anim(tudo, [[63.66, { sx: 0 }], [63.94, { sx: 1 }, "inOutExpo"]]);
      raiz(S, trans.entraDeBaixo(61.44, { d: .32, dist: 500 }));
    } });

  cenaV({ id: "c32", vis: [63.92, 67.6], nome: "Estamos preparados?", inicio: 63.94, fim: 67.6, descricao: "Escuro total: ESTAMOS PREPARADOS… NESSA VELOCIDADE? com linhas de velocidade e câmera acelerando.",
    sfx: [["swell", 63.96, .4], ["tick", 64.36, .5], ["tick", 64.62, .5], ["swoosh", 65.32, .4], ["riser", 65.40], ["swoosh", 66.34, .6], ["whoosh", 66.58], ["boom", 66.62, .55]],
    montar(S) {
      bg(S, "#0A0908"); const C = cam(S, 65.2, 67.6, { s0: 1, s1: 1.22, e: "inExpo" });
      const r = rng(71), ln = Array.from({ length: 120 }, () => ({ y: r() * 1920, l: 120 + r() * 520, v: 1400 + r() * 2600, ph: r() * 2000, w: 2 + r() * 5, a: r() }));
      tela(C, 63.94, 67.6, (g, t) => {
        const p = P(t, 66.0, 67.5, "in"); if (p <= 0) return;
        for (const q of ln) { const x = 1300 - ((q.ph + t * q.v * (0.4 + p * 1.8)) % 2400); g.globalAlpha = (q.a > .7 ? 1 : .45) * p; g.fillStyle = q.a > .7 ? AM : "#fff"; g.fillRect(x, q.y, q.l * (0.5 + p), q.w); }
        g.globalAlpha = 1;
      });
      centro(C, 560, F(150, 700), [["ESTAMOS", 64.36]]);
      centro(C, 720, F(140, 700), [["PREPARADOS", 64.62]]);
      linha(C, 0, 900, F(46, 500, AC, ".08em"), [["PARA", 65.32], ["ENFRENTAR", 65.50], ["ATAQUES", 65.92]]).style.cssText += ";left:0;right:0;text-align:center";
      centro(C, 1040, F(120, 600), [["NESSA", 66.34]]);
      const v = txtC(C, 1180, F(128, 700, AM), "VELOCIDADE?"); anim(v, [[66.58, { o: 0, x: 500, b: 30 }], [66.62, { o: 1 }, "lin"], [66.9, { x: 0, b: 0 }, "out5"], [67.45, { b: 0 }], [67.6, { b: 6 }, "in"]]);
      tremor(C, 66.62, 14);
      raiz(S, VIS(63.92, 67.6, .02));
    } });

  cenaV({ id: "c33", vis: [67.6, 71.2], nome: "Cartela", inicio: 67.6, fim: 71.0, descricao: "A pergunta fica parada; fonte e assinatura Studio Matteu discretas.",
    sfx: [["swell", 67.62, .3], ["tick", 68.40, .4]],
    montar(S) {
      bg(S, "#0A0908"); const C = cam(S, 67.6, 71.0, { s0: 1.02, s1: 1.0, e: "out" });
      txtC(C, 700, F(140, 700), "ESTAMOS");
      txtC(C, 860, F(140, 700), "PREPARADOS<span style='color:" + AM + "'>?</span>");
      const ln = h("div", "abs", C, null, `left:340px;top:1060px;width:400px;height:6px;background:${AM};transform-origin:0 50%`); anim(ln, [[67.7, { sx: 0 }], [68.2, { sx: 1 }, "expo"]]);
      const f = txtC(C, 1130, F(30, 400, AC, ".02em"), "Fonte: relatório da CrowdStrike"); anim(f, IN(67.9, { dy: 20, d: .4 }));
      const sg = txtC(C, 1430, F(30, 600, "rgba(255,255,255,.72)", ".02em"), "Studio Matteu"); anim(sg, IN(68.4, { dy: 20, d: .5 }));
    } });
})();
