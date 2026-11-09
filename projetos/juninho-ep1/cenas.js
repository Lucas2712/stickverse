/* Juninho · Episódio 1 — modo cartoon narrativo (referencias/modo-cartoon-narrativo.md)
 * Direção de arte aprovada: "quadrinho de fim de tarde" (tangerina → noite ameixa; coral, verde-petróleo, mostarda;
 * vermelho só em carimbos). Corte seco a cada frase, quadro sempre cheio, legenda em blocos (projeto.json),
 * onomatopeias, carimbos, painel fixo da série. Narração intacta (91,01 s). Sem música e sem assinatura.
 */
(() => {
  const { cena, anim, h, fx, prog, at, svg, path, draw } = MDS;
  const AM = "#2A1B47", MUST = "#F4D35E", CORAL = "#FF6B4A", PETRO = "#0E6B6B", VERM = "#E63946", CREME = "#FFF4E0", TANG = "#FFB347";
  let Z = 10;

  /* ---------- plano: corte seco + "câmera" com punch, zoom e tremor ---------- */
  function plano(id, a, b, sfx, montar) {
    cena({ id, nome: id, inicio: a, fim: b, margem: 0, z: Z++, sfx, montar(S) {
      S.style.overflow = "hidden";
      const el = h("div", "layer", S, null, "transform-origin:540px 960px");
      const ops = [], tremores = [];
      const fixo = h("div", "layer", S);  // camada fora da câmera (placas, carimbos)
      const c = {
        el, fixo,
        origem(x, y) { el.style.transformOrigin = `${x}px ${y}px`; return c; },
        // s(t, escala): corte seco de reenquadramento em t · s(t, escala, d): chega à escala em t, saindo em t-d
        s(t, s, d = 0, e = "expo") { ops.push({ t0: t - d, t, s, e, d }); return c; },
        soco(t, amp = .05) { ops.push({ t0: t, t, soco: amp }); return c; },
        tremor(t, amp = 8, d = .25) { tremores.push([t, amp, d]); return c; },
      };
      montar(el, c);
      ops.sort((x, y) => x.t0 - y.t0);
      let cur = 1; const lista = [[a, { s: 1 }]];
      for (const o of ops) {
        if (o.soco !== undefined) { lista.push([o.t, { s: cur }, "lin"], [o.t + .06, { s: cur * (1 + o.soco) }, "out"], [o.t + .3, { s: cur }, "out"]); continue; }
        if (!o.d) { if (o.t > a + .002) lista.push([o.t - .001, { s: cur }]); lista.push([o.t, { s: o.s }, "lin"]); if (o.t <= a + .002) lista.shift(); }
        else lista.push([o.t0, { s: cur }], [o.t, { s: o.s }, o.e]);
        cur = o.s;
      }
      anim(el, lista);
      if (tremores.length) fx(t => {
        let dx = 0, dy = 0;
        for (const [t0, amp, d] of tremores) if (t >= t0 && t < t0 + d) { const k = 1 - (t - t0) / d; dx += Math.sin((t - t0) * 95) * amp * k; dy += Math.cos((t - t0) * 77) * amp * k * .7; }
        el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      });
    } });
  }

  /* ---------- peças ---------- */
  const img = (p, nome, css) => { const e = h("img", "abs", p, null, css); e.src = MDS.img(nome); e.draggable = false; return e; };
  const full = (p, nome, css = "") => img(p, nome, `left:0;top:-8px;width:1080px;height:1936px;object-fit:cover;${css}`);
  // fundo do quarto desfocado (atrás dos closes, como na referência)
  const fundo = (p, nome = "quarto-tarde", css = "") => full(p, nome, `filter:blur(14px) saturate(1.1);transform:scale(1.25);${css}`);
  // close do personagem (busto), base cortada embaixo
  const close = (p, nome, { w = 960, x = 540, base = 1990, css = "" } = {}) => img(p, nome, `left:${x - w / 2}px;width:${w}px;bottom:${1920 - base}px;transform-origin:50% 100%;${css}`);
  // respiração: leve escala vertical contínua (usa a propriedade CSS scale, não conflita com anim)
  const respira = (el, amp = .012, vel = 2.2, fase = 0) => fx(t => { el.style.scale = `1 ${(1 + Math.sin(t * vel + fase) * amp).toFixed(4)}`; });
  // troca de expressão: mostra cada imagem só no seu intervalo
  const troca = (els, tempos) => els.forEach((e, i) => at(tempos[i], on => e.style.visibility = on ? "visible" : "hidden", tempos[i + 1] ?? 1e9));
  // pop com overshoot
  const pop = (el, t, { s0 = 0, r0 = 0, d = .32, ate = 1e9, sai = .12 } = {}) => anim(el, [[t - .001, { o: 0, s: s0, r: r0 }], [t, { o: 1 }, "lin"], [t + d, { s: 1, r: 0 }, "back"],
    ...(ate < 1e9 ? [[ate, { o: 1, s: 1 }], [ate + sai, { o: 0, s: .6 }, "in"]] : [])]);
  // carimbo: entra grande e bate
  const bate = (el, t, s0 = 2.2, r = 0) => anim(el, [[t - .001, { o: 0, s: s0, r }], [t, { o: 1 }, "lin"], [t + .14, { s: 1, r }, "in"], [t + .24, { s: 1.06 }, "out"], [t + .36, { s: 1 }, "out"]]);
  const ono = (p, txt, x, y, t, { r = -8, px = 150, cor = MUST, ate } = {}) => { const e = h("div", "ono", p, txt, `left:${x}px;top:${y}px;font-size:${px}px;color:${cor};translate:-50% -50%`); pop(e, t, { r0: r * 2, ate }); e.style.rotate = r + "deg"; return e; };
  const carimbo = (p, txt, x, y, t, { r = -10, px = 120 } = {}) => { const e = h("div", "carimbo", p, txt, `left:${x}px;top:${y}px;font-size:${px}px;translate:-50% -50%`); bate(e, t, 2.4, r); return e; };
  const placa = (p, txt, x, y, t, { sub = "", px = 48, cor = AM, txtCor = "#fff", r = -3, ate } = {}) => { const e = h("div", "placa", p, txt + (sub ? `<small>${sub}</small>` : ""), `left:${x}px;top:${y}px;font-size:${px}px;background:${cor};color:${txtCor};translate:-50% -50%`); pop(e, t, { s0: .3, ate }); e.style.rotate = r + "deg"; return e; };
  // partículas (farelos, confete, poeira): função pura do tempo
  function particulas(p, { n = 20, t0, x, y, cores = [TANG], tam = [10, 22], vx = [-500, 500], vy = [-900, -300], g = 2200, forma = "quad", dur = 2 }) {
    const R = i => { const s = Math.sin(i * 127.1 + n * 3.7) * 43758.5453; return s - Math.floor(s); };
    const ps = Array.from({ length: n }, (_, i) => {
      const e = h("div", "abs", p, null, `left:0;top:0;width:${tam[0] + R(i) * (tam[1] - tam[0])}px;height:${(tam[0] + R(i + 9) * (tam[1] - tam[0])) * (forma === "conf" ? .5 : 1)}px;background:${cores[i % cores.length]};border-radius:${forma === "bola" ? "50%" : "3px"};border:3px solid ${AM}`);
      return { e, vx: vx[0] + R(i + 3) * (vx[1] - vx[0]), vy: vy[0] + R(i + 5) * (vy[1] - vy[0]), r: R(i + 7) * 720 - 360, d: R(i + 11) * .15 };
    });
    fx(t => ps.forEach(q => {
      const k = t - t0 - q.d; if (k < 0 || k > dur) { q.e.style.display = "none"; return; }
      q.e.style.display = "block";
      q.e.style.transform = `translate(${(x + q.vx * k).toFixed(1)}px,${(y + q.vy * k + g * k * k / 2).toFixed(1)}px) rotate(${(q.r * k).toFixed(0)}deg)`;
    }));
  }
  const raios = (p, cor1, cor2, vel = 6) => { // fundo de raios girando (sunburst)
    const e = h("div", "abs", p, null, `left:-900px;top:-500px;width:2880px;height:2880px;background:repeating-conic-gradient(${cor1} 0 9deg, ${cor2} 9deg 18deg)`);
    fx(t => e.style.rotate = (t * vel).toFixed(2) + "deg"); return e;
  };

  /* ---------- celular (mãos + tela verde recortada) e chat genérico ---------- */
  const TELA = { x: 266, y: 241, w: 547, h: 1138 };
  function celular(p, { fundoTela = "#F7F1E8" } = {}) {
    const tela = h("div", "abs", p, null, `left:${TELA.x - 6}px;top:${TELA.y - 6}px;width:${TELA.w + 12}px;height:${TELA.h + 12}px;background:${fundoTela};overflow:hidden;font-family:var(--v-sans)`);
    full(p, "quarto-tarde", "filter:blur(10px)").style.zIndex = -1;
    img(p, "celular-maos", "left:0;top:0;width:1080px");
    return tela;
  }
  // cabeçalho do chat (avatar = recorte da selfie da Lara, nome genérico, sem marca)
  function cabecalho(tela, hora = "16:42") {
    h("div", "abs", tela, `<span>${hora}</span><span>●●● ▮</span>`, `left:0;right:0;top:0;height:58px;display:flex;justify-content:space-between;align-items:center;padding:8px 34px 0;font:700 22px var(--v-sans);color:${AM}`);
    const cab = h("div", "abs", tela, null, `left:0;right:0;top:58px;height:110px;display:flex;align-items:center;gap:18px;padding:0 26px;background:#fff;border-bottom:3px solid ${AM}`);
    const av = h("div", "", cab, null, `width:74px;height:74px;border-radius:50%;border:4px solid ${AM};background:url(${MDS.img("lara")}) 50% 18%/180% auto`);
    h("div", "", cab, `<b style="font:800 32px var(--v-display);color:${AM};display:block">Lara</b><span style="font:600 20px var(--v-sans);color:${PETRO}">online</span>`);
    return cab;
  }
  const balao = (tela, txt, { lado = "ela", y, px = 30, w } = {}) => h("div", "abs", tela, txt,
    `${lado === "ela" ? "left:22px;border-radius:30px 30px 30px 8px;background:#fff;color:" + AM : "right:22px;border-radius:30px 30px 8px 30px;background:" + CORAL + ";color:#fff"};top:${y}px;${w ? "width:" + w + "px;" : "max-width:420px;"}padding:20px 26px;font:700 ${px}px/1.2 var(--v-sans);border:4px solid ${AM};box-shadow:0 6px 0 ${AM}`);
  const pontinhos = (tela, y, a, b) => { const e = h("div", "abs", tela, "<i></i><i></i><i></i>", `left:22px;top:${y}px;padding:24px 28px;border-radius:30px 30px 30px 8px;background:#fff;border:4px solid ${AM};display:flex;gap:10px`);
    [...e.children].forEach((i, k) => { i.style.cssText = `width:16px;height:16px;border-radius:50%;background:${AM};display:block`; fx(t => i.style.translate = `0 ${(-Math.max(0, Math.sin(t * 14 - k * 1.2)) * 8).toFixed(1)}px`); });
    anim(e, [[a - .001, { o: 0 }], [a, { o: 1 }, "lin"], [b, { o: 1 }], [b + .001, { o: 0 }, "lin"]]); return e; };
  function notificacao(tela, t, txt = "nova mensagem") {
    const n = h("div", "abs", tela, null, `left:20px;right:20px;top:70px;padding:20px 22px;border-radius:28px;background:#fff;border:4px solid ${AM};box-shadow:0 8px 0 ${AM};display:flex;gap:18px;align-items:center`);
    h("div", "", n, null, `width:72px;height:72px;flex:none;border-radius:50%;border:4px solid ${AM};background:url(${MDS.img("lara")}) 50% 18%/180% auto`);
    h("div", "", n, `<b style="display:block;font:800 30px var(--v-display);color:${AM}">Lara</b><span style="font:600 24px var(--v-sans);color:${PETRO}">${txt}</span>`);
    anim(n, [[t - .001, { y: -260, o: 0 }], [t, { o: 1 }, "lin"], [t + .35, { y: 0 }, "back"]]);
    return n;
  }
  const vibra = (el, t, d = .5, amp = 7) => fx(k => { const on = k >= t && k < t + d; el.style.translate = on ? `${(Math.sin(k * 120) * amp).toFixed(1)}px 0` : "0 0"; });

  /* ---------- calendário de parede ---------- */
  function calendario(p, { marcarAte = 0, tMarca = 0, circulo30 = -1 } = {}) {
    h("div", "abs", p, null, `inset:0;background:${PETRO}`);
    h("div", "abs", p, null, `inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 60px,transparent 60px 120px)`);
    const cal = h("div", "abs", p, null, `left:110px;top:420px;width:860px;height:1060px;background:${CREME};border:8px solid ${AM};border-radius:26px;box-shadow:0 18px 0 ${AM}`);
    h("div", "abs", cal, "30 DIAS", `left:0;right:0;top:0;height:170px;background:${CORAL};border-bottom:8px solid ${AM};border-radius:18px 18px 0 0;display:flex;align-items:center;justify-content:center;font:900 92px var(--v-display);color:#fff;-webkit-text-stroke:10px ${AM};paint-order:stroke fill;letter-spacing:-.02em`);
    const cel = [];
    for (let i = 0; i < 30; i++) {
      const c = i % 6, l = Math.floor(i / 6);
      const e = h("div", "abs", cal, String(i + 1), `left:${30 + c * 135}px;top:${200 + l * 168}px;width:120px;height:150px;border:5px solid ${AM};border-radius:14px;background:#fff;font:800 50px var(--v-display);color:${AM};display:flex;align-items:flex-start;justify-content:flex-start;padding:10px 14px`);
      cel.push(e);
    }
    // X vermelhos desenhados
    const xs = svg(cal, 860, 1060, "position:absolute;left:0;top:0;overflow:visible");
    for (let i = 0; i < marcarAte; i++) {
      const c = i % 6, l = Math.floor(i / 6), x0 = 30 + c * 135 + 18, y0 = 200 + l * 168 + 30, t = tMarca + i * .045;
      draw(path(xs, `M${x0} ${y0}L${x0 + 92} ${y0 + 100}`, { stroke: VERM, "stroke-width": 14, "stroke-linecap": "round", fill: "none" }), t, t + .08, "out");
      draw(path(xs, `M${x0 + 92} ${y0}L${x0} ${y0 + 100}`, { stroke: VERM, "stroke-width": 14, "stroke-linecap": "round", fill: "none" }), t + .03, t + .11, "out");
    }
    if (circulo30 >= 0) { const c = 5, l = 4, cx = 30 + c * 135 + 62, cy = 200 + l * 168 + 76;
      draw(path(xs, `M${cx + 80} ${cy - 10}C${cx + 90} ${cy - 110} ${cx - 100} ${cy - 120} ${cx - 95} ${cy}C${cx - 90} ${cy + 110} ${cx + 100} ${cy + 100} ${cx + 85} ${cy - 30}`, { stroke: VERM, "stroke-width": 14, "stroke-linecap": "round", fill: "none" }), circulo30, circulo30 + .35, "out"); }
    return { cal, cel };
  }

  /* ================= PAINEL FIXO DA SÉRIE (topo) ================= */
  // nível de confiança: só sobe e desce com a história (sem número inventado)
  const NIVEL = [[0, .14], [40.74, .14], [41.1, .46], [46.38, .46], [46.6, .04]];
  const nivel = t => { let v = NIVEL[0][1]; for (let i = 1; i < NIVEL.length; i++) { const [a, va] = NIVEL[i - 1], [b, vb] = NIVEL[i]; if (t >= b) v = vb; else if (t > a) { v = va + (vb - va) * prog(t, a, b, "out"); break; } } return v; };
  const HUD_ON = [[4.40, 12.08], [14.74, 17.88], [24.88, 26.48], [35.08, 37.48], [38.90, 43.0], [46.38, 47.84], [50.18, 57.38], [61.50, 67.12], [72.20, 74.16]];
  cena({ id: "painel", nome: "Painel da série", inicio: 4.3, fim: 74.2, margem: 0, z: 900, montar(S) {
    const box = h("div", "abs", S, null, `left:44px;top:232px;display:flex;gap:16px;align-items:stretch;scale:1.42;transform-origin:0 0`);
    const d = h("div", "", box, `<small style="display:block;font:800 19px var(--v-sans);letter-spacing:.08em;color:${MUST}">FALTAM</small><b style="font:900 46px/1 var(--v-display);color:#fff">30 DIAS</b>`,
      `background:${AM};border:5px solid #fff;border-radius:18px;padding:10px 20px 12px;box-shadow:0 6px 0 rgba(0,0,0,.35)`);
    const c = h("div", "", box, `<small style="display:block;font:800 19px var(--v-sans);letter-spacing:.08em;color:${MUST}">CONFIANÇA</small>`,
      `background:${AM};border:5px solid #fff;border-radius:18px;padding:10px 20px 14px;width:330px;box-shadow:0 6px 0 rgba(0,0,0,.35)`);
    const trilho = h("div", "", c, null, `margin-top:8px;height:24px;border-radius:12px;background:rgba(255,255,255,.18);overflow:hidden`);
    const barra = h("div", "", trilho, null, `height:100%;border-radius:12px;background:${CORAL}`);
    fx(t => { const v = nivel(t); barra.style.width = (v * 100).toFixed(1) + "%"; barra.style.background = v < .1 ? (Math.floor(t * 6) % 2 ? VERM : "#ff9aa2") : v > .3 ? "#5DD39E" : CORAL; });
    anim(box, [[4.399, { o: 0, s: .5, y: -40 }], [4.40, { o: 1 }, "lin"], [4.75, { s: 1, y: 0 }, "back"]]);
    box.style.transformOrigin = "0 0";
    fx(t => { const on = HUD_ON.some(([a, b]) => t >= a && t < b); box.style.visibility = on && t >= 4.4 ? "visible" : "hidden"; });
  } });

  /* ================= 1 · gancho ================= */
  plano("01-close", 0, 2.24, [["swell", 0, .6], ["pop", 1.24, .5]], (S, c) => {
    fundo(S, "quarto-tarde", "filter:blur(14px) brightness(.45) saturate(.8)");
    const j = close(S, "j-tedio"); respira(j);
    h("div", "layer", S, null, "background:radial-gradient(circle at 540px 900px,rgba(110,170,255,.45),transparent 55%);mix-blend-mode:screen");
    c.origem(540, 820).s(0, 1.1).s(2.2, 1.0, 2.2, "out").soco(1.24, .05);
  });
  plano("01-celular", 2.24, 3.08, [["ding", 2.28, .8]], (S, c) => {
    const tela = celular(S, { fundoTela: "#1d1530" });
    const brilho = h("div", "abs", tela, null, `inset:0;background:linear-gradient(160deg,${CORAL},${AM})`);
    anim(brilho, [[2.24, { o: 0 }], [2.4, { o: 1 }, "out"]]);
    h("div", "abs", tela, "16:42", `left:0;right:0;top:250px;text-align:center;font:800 120px var(--v-display);color:#fff`);
    notificacao(tela, 2.3);
    vibra(tela, 2.3, .5);
    c.origem(540, 600).s(2.24, 1.2).s(3.08, 1.28, .84, "out");
  });

  /* ================= 2 · 30 dias ================= */
  plano("02-calendario", 3.08, 5.96, [["whoosh", 3.1, .7], ["hit", 4.16, 1], ["pop", 4.42, .6]], (S, c) => {
    const { cal } = calendario(S);
    // folhas voando
    for (let i = 0; i < 6; i++) { const f = h("div", "abs", S, String(30 - i), `left:220px;top:520px;width:640px;height:760px;background:${CREME};border:8px solid ${AM};border-radius:20px;font:900 300px var(--v-display);color:${AM};display:flex;align-items:center;justify-content:center`);
      const t = 3.12 + i * .13; anim(f, [[3.08, { o: 1 }], [t, { x: 0, y: 0, r: 0, o: 1 }], [t + .5, { x: (i % 2 ? 1 : -1) * 900, y: -700, r: (i % 2 ? 1 : -1) * 70, o: 1 }, "in"]]); }
    const n = h("div", "ono", S, "30", `left:540px;top:930px;font-size:520px;color:${MUST};-webkit-text-stroke:26px ${AM};translate:-50% -50%`);
    bate(n, 4.02, 2.6);
    c.tremor(4.02, 16, .35).origem(540, 900).s(3.08, 1.06).s(5.96, 1, 2.8, "out");
  });

  /* ================= 3 · tarde normal ================= */
  plano("03-quarto", 5.96, 7.64, [["swell", 5.98, .5]], (S, c) => {
    full(S, "quarto-tarde");
    particulas(S, { n: 26, t0: 5.0, x: 260, y: 400, cores: ["rgba(255,236,180,.9)"], tam: [6, 12], vx: [20, 240], vy: [-40, 160], g: 0, forma: "bola", dur: 4 });
    c.origem(540, 1100).s(5.96, 1.0).s(7.64, 1.07, 1.68, "out");
  });

  /* ================= 4 · deitado, comendo, rolando ================= */
  plano("04-deitado", 7.64, 9.18, [["swoosh", 7.66, .5]], (S, c) => {
    full(S, "quarto-deitado");
    c.origem(330, 1150).s(7.64, 1.75).s(9.18, 1.85, 1.5, "out");
  });
  plano("04-salgadinho", 9.18, 10.12, [["hit", 9.2, .7], ["pop", 9.3, .6]], (S, c) => {
    full(S, "salgadinho");
    particulas(S, { n: 22, t0: 9.2, x: 640, y: 760, cores: [TANG, MUST, "#E8A33D"], tam: [12, 26], vx: [-600, 600], vy: [-1100, -400] });
    ono(S, "CRUNCH!", 400, 520, 9.22, { r: -10, px: 170 });
    c.tremor(9.2, 10, .22).origem(640, 800).s(9.18, 1.0).s(10.12, 1.08, .9, "out");
  });
  plano("04-rolando", 10.12, 12.08, [["swoosh", 10.14, .5], ["pop", 11.1, .5]], (S, c) => {
    fundo(S);
    const tint = h("div", "layer", S, null, "mix-blend-mode:multiply");
    fx(t => { const k = prog(t, 10.2, 11.2, "inOut"); const a = [255, 179, 71], b = [255, 120, 160], d = [90, 70, 160];
      const m = k < .5 ? a.map((v, i) => v + (b[i] - v) * k * 2) : b.map((v, i) => v + (d[i] - v) * (k - .5) * 2); tint.style.background = `rgb(${m.map(Math.round).join(",")})`; });
    const j = close(S, "j-tedio"); respira(j, .01, 2.6);
    h("div", "layer", S, null, "background:radial-gradient(circle at 540px 760px,rgba(120,180,255,.45),transparent 50%);mix-blend-mode:screen");
    c.origem(540, 800).s(10.12, 1.12).soco(11.1, .06);
  });

  /* ================= 5 · mensagem da Lara ================= */
  plano("05-notificacao", 12.08, 13.82, [["ding", 12.12, .55], ["glitch", 12.62, .35]], (S, c) => {
    const tela = celular(S, { fundoTela: "#1d1530" });
    h("div", "abs", tela, null, `inset:0;background:linear-gradient(160deg,${PETRO},${AM})`);
    h("div", "abs", tela, "16:42", `left:0;right:0;top:250px;text-align:center;font:800 120px var(--v-display);color:#fff`);
    notificacao(tela, 12.1);
    vibra(S.parentNode, 12.62, .55, 10);
    ono(S, "BZZ", 860, 520, 12.62, { r: 10, px: 120 });
    c.origem(540, 420).s(12.08, 1.25).s(13.82, 1.32, 1.7, "out");
  });
  plano("05-reacao", 13.82, 14.74, [["boom", 13.84, .6], ["pop", 14.0, .5]], (S, c) => {
    fundo(S);
    const j = close(S, "j-susto"); respira(j);
    const chip = h("div", "abs", S, null, `left:520px;top:1010px;width:70px;height:56px;background:${TANG};border:5px solid ${AM};border-radius:40% 60% 50% 50%`);
    anim(chip, [[13.9, { y: 0, r: 0 }], [14.7, { y: 900, r: 260 }, "in"]]);
    c.origem(540, 850).s(13.82, 1.18).s(14.74, 1.24, .9, "out");
  });

  /* ================= 6 · foto da turma ================= */
  plano("06-turma", 14.74, 17.88, [["swoosh", 14.76, .5], ["pop", 15.3, .4], ["hit", 16.76, .9]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${PETRO}`);
    full(S, "turma", "top:-230px");
    const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:-230px");
    draw(path(sv, "M700 1240C720 1050 360 1040 340 1240C320 1450 700 1470 720 1290", { stroke: VERM, "stroke-width": 16, "stroke-linecap": "round", fill: "none" }), 15.26, 15.85, "out");
    carimbo(c.fixo, "2016", 800, 560, 16.62, { r: 12, px: 120 });
    c.origem(520, 1020).s(14.74, 1.0).s(16.62, 1.45).s(17.88, 1.52, 1.26, "out").tremor(16.62, 12, .3);
  });

  /* ================= 7 · "você ainda lembra de mim?" ================= */
  plano("07-chat", 17.88, 21.42, [["swoosh", 17.9, .5], ["ding", 18.56, .8], ["pop", 19.92, .4], ["send", 20.36, .9]], (S, c) => {
    const tela = celular(S); cabecalho(tela);
    const foto = h("div", "abs", tela, null, `left:22px;top:200px;width:390px;height:520px;border-radius:26px;border:5px solid ${AM};background:url(${MDS.img("lara")}) 50% 30%/cover`);
    anim(foto, [[18.5, { o: 0, s: .7, b: 30 }], [18.62, { o: 1 }, "lin"], [18.9, { s: 1 }, "back"], [19.4, { b: 0 }, "out"]]);
    pontinhos(tela, 760, 19.9, 20.34);
    pop(balao(tela, "você ainda lembra de mim?", { y: 760, px: 34 }), 20.34, { s0: .4 });
    c.origem(540, 900).s(17.88, 1.0).s(19.9, 1.32).s(21.42, 1.38, 1.5, "out");
  });

  /* ================= 8 · "claro que lembro!" ================= */
  plano("08-digita", 21.42, 23.92, [["key", 21.5, .9], ["key", 21.62, .9], ["key", 21.74, .9], ["key", 21.86, .9], ["key", 21.98, .9], ["key", 22.1, .9], ["key", 22.22, .9], ["key", 22.34, .9], ["send", 23.42, 1], ["tick", 23.7, .7]], (S, c) => {
    const tela = celular(S); cabecalho(tela);
    balao(tela, "você ainda lembra de mim?", { y: 200, px: 30 });
    const campo = h("div", "abs", tela, "", `left:18px;right:18px;bottom:24px;height:84px;border-radius:42px;background:#fff;border:4px solid ${AM};padding:0 28px;display:flex;align-items:center;font:700 32px var(--v-sans);color:${AM}`);
    MDS.typeText(campo, "Claro que lembro!", 21.5, 20);
    at(23.4, on => campo.style.visibility = on ? "hidden" : "visible");
    const b = balao(tela, "Claro que lembro! <span style='font-size:22px;color:" + MUST + "'>✓✓</span>", { lado: "eu", y: 330, px: 34 });
    anim(b, [[23.399, { o: 0, y: 500, s: .8 }], [23.4, { o: 1 }, "lin"], [23.7, { y: 0, s: 1 }, "back"]]);
    ono(S, "TEC TEC TEC", 540, 1500, 21.5, { r: -4, px: 110, ate: 23.3 });
    vibra(S.parentNode, 21.5, 1.8, 3);
    c.origem(540, 1000).s(21.42, 1.12).s(23.4, 1.0);
  });
  plano("08-confiante", 23.92, 24.88, [["pop", 23.94, .7]], (S, c) => {
    fundo(S); const j = close(S, "j-confiante"); respira(j);
    const brilho = h("div", "ono", S, "✦", `left:780px;top:760px;font-size:110px;color:#fff`); pop(brilho, 24.1, { r0: -90 });
    c.origem(540, 900).s(23.92, 1.15).soco(23.94, .06);
  });

  /* ================= 9 · olhou duas vezes ================= */
  plano("09-suor", 24.88, 26.48, [["glitch", 25.04, .3], ["pop", 25.2, .5]], (S, c) => {
    fundo(S); const j = close(S, "j-suor"); respira(j, .008);
    c.origem(540, 900).s(24.88, 1.15).s(26.48, 1.22, 1.6, "out");
  });
  plano("09-foto", 26.48, 28.74, [["swoosh", 26.5, .5], ["hit", 27.12, .7], ["hit", 27.56, .55]], (S, c) => {
    const tela = celular(S);
    h("div", "abs", tela, null, `inset:0;background:url(${MDS.img("lara")}) 50% 30%/cover`);
    placa(c.fixo, "1ª OLHADA", 540, 330, 26.6, { px: 64, cor: MUST, txtCor: AM, ate: 27.55 });
    placa(c.fixo, "2ª OLHADA", 540, 330, 27.56, { px: 64, cor: CORAL });
    c.origem(560, 640).s(26.48, 1.0).s(27.12, 1.6).s(27.56, 2.4).tremor(27.56, 12, .3);
  });

  /* ================= 10 · a conversa engata ================= */
  plano("10-conversa", 28.74, 31.76, [["blip", 28.8, .5], ["blip", 29.1, .5], ["blip", 29.4, .5], ["blip", 29.7, .5], ["blip", 30.0, .5], ["blip", 30.3, .5], ["tick", 30.52, .8]], (S, c) => {
    const tela = celular(S); const lista = h("div", "abs", tela, null, `left:0;right:0;top:0`); cabecalho(tela, "");
    const relogio = h("div", "abs", tela, "", `left:34px;top:14px;font:700 22px var(--v-sans);color:${AM}`);
    fx(t => { const m = Math.round(16 * 60 + 42 + prog(t, 28.74, 30.5, "inOut") * 300); relogio.textContent = `${Math.floor(m / 60) % 24}:${String(m % 60).padStart(2, "0")}`; });
    const msgs = ["lembra da prof de química? 😂", "KKKKK claro", "e a excursão?", "nem me fala 🙈", "vc sumiu!", "trabalhando muito kk", "saudade da turma", "demais", "a gente devia se ver", "siiiim"];
    msgs.forEach((m, i) => balao(lista, m, { lado: i % 2 ? "eu" : "ela", y: 200 + i * 150, px: 28 }));
    anim(lista, [[28.74, { y: 0 }], [30.5, { y: -1050 }, "inOut"]]);
    c.origem(540, 800).s(28.74, 1.08).soco(30.5, .04);
  });
  plano("10-novidade", 31.76, 32.84, [["boom", 31.78, .7], ["pop", 31.8, .6]], (S, c) => {
    const tela = celular(S); cabecalho(tela, "21:47");
    pop(balao(tela, "tenho uma novidade 👀", { y: 520, px: 42, w: 470 }), 31.78, { s0: .3 });
    c.origem(400, 640).s(31.76, 1.42).tremor(31.78, 12, .3);
  });

  /* ================= 11 · reencontro ================= */
  plano("11-calendario", 32.84, 35.08, [["whoosh", 32.86, .5], ["pop", 33.24, .6], ["swoosh", 33.6, .4], ["tick", 34.1, .4], ["tick", 34.4, .4], ["tick", 34.7, .4]], (S, c) => {
    calendario(S, { marcarAte: 29, tMarca: 33.7, circulo30: 33.22 });
    c.origem(830, 1150).s(32.84, 1.6).s(33.6, 1.0, .35, "inOut");
  });
  plano("11-convite", 35.08, 36.20, [["swoosh", 35.1, .6], ["chime", 35.2, .6]], (S, c) => {
    full(S, "festa");
    const t = h("div", "abs", S, "REENCONTRO<br><span style='font-size:64px;color:" + CORAL + "'>TURMA 2016</span>", `left:110px;top:300px;width:860px;text-align:center;font:900 98px/1 var(--v-display);color:${AM};letter-spacing:-.02em`);
    pop(t, 35.12, { s0: .5 });
    particulas(S, { n: 30, t0: 35.1, x: 540, y: 200, cores: [CORAL, MUST, PETRO, "#fff"], tam: [16, 30], vx: [-600, 600], vy: [-300, 200], g: 1400, forma: "conf", dur: 1.2 });
    c.origem(540, 500).s(35.08, 1.0).s(36.2, 1.06, 1.1, "out");
  });
  plano("11-turma", 36.20, 37.48, [["pop", 36.24, .7]], (S, c) => {
    full(S, "turma");
    const bal = h("div", "abs", S, null, `left:780px;top:300px;width:170px;height:210px;border-radius:50% 50% 48% 48%;background:${CORAL};border:7px solid ${AM}`);
    h("div", "abs", bal, null, `left:76px;top:200px;width:6px;height:160px;background:${AM}`);
    pop(bal, 36.24, { r0: 30 }); MDS.floaty(bal, 14, 4);
    c.origem(540, 960).s(36.2, 1.12).s(37.48, 1.04, 1.28, "out");
  });

  /* ================= 12 · queria que ele aparecesse ================= */
  plano("12-chat", 37.48, 38.90, [["ding", 37.52, .7], ["pop", 37.96, .6]], (S, c) => {
    const tela = celular(S); cabecalho(tela, "21:52");
    balao(tela, "vai ter o reencontro da turma! 🎉", { y: 210, px: 28 });
    pop(balao(tela, "queria muito que você aparecesse", { y: 400, px: 36, w: 440 }), 37.52, { s0: .4 });
    const cor = h("div", "ono", tela, "♥", `left:380px;top:640px;font-size:150px;color:${CORAL};-webkit-text-stroke:10px ${AM}`);
    pop(cor, 37.94); fx(t => cor.style.scale = (1 + Math.max(0, Math.sin((t - 37.94) * 12)) * .15 * (t > 37.94)).toFixed(3));
    c.origem(540, 700).s(37.48, 1.25);
  });
  plano("12-corado", 38.90, 40.16, [["pop", 38.92, .6], ["chime", 39.1, .4]], (S, c) => {
    fundo(S); const j = close(S, "j-corado"); respira(j);
    for (let i = 0; i < 5; i++) { const e = h("div", "ono", S, "♥", `left:${180 + i * 170}px;top:900px;font-size:${70 + (i % 2) * 30}px;color:${CORAL};-webkit-text-stroke:8px ${AM}`);
      anim(e, [[39.0 + i * .1, { o: 0, y: 0, s: .4 }], [39.2 + i * .1, { o: 1, s: 1 }, "back"], [40.16, { y: -420, o: .9 }, "out"]]); }
    c.origem(540, 900).s(38.9, 1.15).s(40.16, 1.2, 1.26, "out");
  });

  /* ================= 13–14 · animado → congela ================= */
  const pulo = (S, t0) => {
    full(S, "quarto-tarde", "filter:blur(5px)");
    const j = img(S, "j-pulo", "left:190px;top:560px;width:720px");
    anim(j, [[40.16, { y: 160, sy: .9 }], [40.4, { y: -120, sy: 1.05 }, "out"], [41.0, { y: -40, sy: 1 }, "inOut"], [41.7, { y: -60 }, "lin"]]);
    return j;
  };
  plano("13-animado", 40.16, 41.70, [["flip", 40.18, .6], ["pop", 40.3, .7], ["chime", 40.76, .6]], (S, c) => {
    pulo(S);
    ono(S, "BOING!", 760, 480, 40.24, { r: 10, px: 140 });
    particulas(S, { n: 34, t0: 40.3, x: 540, y: 300, cores: [CORAL, MUST, PETRO, "#fff"], tam: [16, 30], vx: [-700, 700], vy: [-500, 100], g: 1300, forma: "conf", dur: 1.5 });
    c.origem(540, 1000).s(40.16, 1.05);
  });
  plano("14-congela", 41.70, 42.96, [["glitch", 41.72, .8], ["hit", 41.72, .5]], (S, c) => {
    pulo(S);
    S.style.filter = "grayscale(1) contrast(1.15)";
    h("div", "layer", S, null, `background:rgba(42,27,71,.35)`);
    ono(c.fixo, "PERAÍ…", 540, 560, 41.75, { r: -6, px: 120, cor: "#fff" });
    c.origem(540, 1000).s(41.7, 1.05).s(42.96, 1.12, 1.26, "out").tremor(41.72, 14, .3);
  });
  plano("14-outra", 42.96, 44.16, [["ding", 42.98, 1], ["glitch", 43.2, .3]], (S, c) => {
    const tela = celular(S, { fundoTela: "#1d1530" });
    h("div", "abs", tela, null, `inset:0;background:linear-gradient(160deg,${PETRO},${AM})`);
    h("div", "abs", tela, "22:03", `left:0;right:0;top:250px;text-align:center;font:800 120px var(--v-display);color:#fff`);
    notificacao(tela, 42.98, "mas você continua…");
    vibra(S.parentNode, 43.0, .5, 10);
    c.origem(540, 420).s(42.96, 1.25).s(44.16, 1.32, 1.2, "out");
  });

  /* ================= 15 · a cara de 2016 ================= */
  plano("15-balao", 44.16, 46.38, [["key", 44.2, .6], ["key", 44.6, .6], ["key", 45.1, .6], ["key", 45.4, .6], ["key", 45.8, .6]], (S, c) => {
    const tela = celular(S); cabecalho(tela, "22:03");
    const b = balao(tela, "", { y: 380, px: 40, w: 470 });
    const pal = [["mas", 44.16], ["você", 44.34], ["continua", 44.58], ["com", 45.06], ["aquela", 45.2], ["mesma", 45.4], ["cara", 45.78], ["de", 46.22], ["2016?", 46.38]];
    let last = -1; fx(t => { const n = pal.filter(p => t >= p[1] - .02).length; if (n !== last) { b.innerHTML = pal.slice(0, n).map(p => p[0]).join(" ") || "…"; last = n; } });
    c.origem(540, 640).s(44.16, 1.3).s(46.38, 1.38, 2.2, "out");
  });
  plano("15-carimbo", 46.38, 47.84, [["boom", 46.54, 1], ["glitch", 46.6, .4]], (S, c) => {
    full(S, "turma", "filter:sepia(.55) saturate(.8)");
    carimbo(c.fixo, "2016", 540, 1000, 46.40, { r: -12, px: 230 });
    c.origem(675, 860).s(46.38, 2.3).s(47.84, 2.42, 1.4, "out").tremor(46.4, 22, .45);
  });

  /* ================= 16 · câmera frontal ================= */
  plano("16-selfie", 47.84, 50.18, [["swoosh", 47.86, .5], ["click", 48.76, .7], ["swell", 49.16, .4]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:#141020`);
    const cam = h("div", "abs", S, null, `left:60px;top:300px;width:960px;height:1280px;border-radius:40px;overflow:hidden;border:6px solid #fff`);
    full(cam, "quarto-tarde", "filter:blur(10px) brightness(.8);left:-60px;top:-300px");
    const j = close(cam, "j-tedio", { w: 900, x: 480, base: 1700 });
    anim(j, [[47.84, { s: 1 }], [49.14, { s: 1 }], [50.1, { s: 1.35 }, "out"]]);
    j.style.transformOrigin = "50% 40%";
    const ui = h("div", "abs", S, null, `inset:0`);
    h("div", "abs", ui, null, `left:470px;top:1620px;width:140px;height:140px;border-radius:50%;border:10px solid #fff;background:rgba(255,255,255,.25)`);
    h("div", "abs", ui, "FOTO", `left:0;right:0;top:1588px;text-align:center;font:800 26px var(--v-sans);color:${MUST};letter-spacing:.1em;display:none`);
    h("div", "abs", ui, "⚡", `left:110px;top:230px;font-size:46px;color:#fff`);
    anim(ui, [[48.74, { o: 0 }], [48.9, { o: 1 }, "lin"]]);
    fx(t => { cam.style.translate = `${(Math.sin(t * 3.1) * 6).toFixed(1)}px ${(Math.cos(t * 2.3) * 5).toFixed(1)}px`; });
  });

  /* ================= 17–19 · cabelo, barriga, roupa ================= */
  const corpo = (p, css) => img(p, "j-corpo", css);
  plano("17-cabelo", 50.18, 51.94, [["swoosh", 50.2, .5], ["pop", 50.94, .8]], (S, c) => {
    fundo(S);
    const j = corpo(S, "left:-570px;top:260px;width:2220px");
    const sv = svg(c.fixo, 1080, 1920, "position:absolute;left:0;top:0");
    draw(path(sv, "M930 1000C900 820 820 680 700 600", { stroke: MUST, "stroke-width": 24, "stroke-linecap": "round", fill: "none" }), 50.6, 50.9, "out");
    draw(path(sv, "M700 600l80 4M700 600l12 76", { stroke: MUST, "stroke-width": 24, "stroke-linecap": "round", fill: "none" }), 50.88, 50.98);
    placa(c.fixo, "CABELO", 820, 1080, 50.92, { px: 70, cor: CORAL, r: 4 });
    ono(c.fixo, "BOING", 300, 470, 51.2, { r: -12, px: 100 });
    c.origem(540, 600).s(50.18, 1.0).s(51.94, 1.06, 1.76, "out");
  });
  plano("18-barriga", 51.94, 53.10, [["hit", 52.3, .7], ["pop", 52.32, .7]], (S, c) => {
    fundo(S);
    const j = corpo(S, "left:-520px;top:-1500px;width:2120px");
    j.style.transformOrigin = "50% 75%";
    anim(j, [[52.26, { sx: 1, sy: 1 }], [52.36, { sx: 1.07, sy: .95 }, "out"], [52.7, { sx: 1, sy: 1 }, "elastic"]]);
    ono(S, "BLOP!", 300, 520, 52.3, { r: -10, px: 150 });
    placa(c.fixo, "BARRIGA", 760, 1060, 52.32, { px: 70, cor: CORAL, r: -4 });
    c.origem(540, 900).s(51.94, 1.0).tremor(52.3, 8, .2);
  });
  plano("19-roupa", 53.10, 55.62, [["swoosh", 53.12, .5], ["swell", 53.5, .4], ["flip", 54.5, .7]], (S, c) => {
    fundo(S);
    const j = corpo(S, "left:265px;top:300px;width:550px"); respira(j, .006);
    const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
    [[230, 0], [850, .12], [930, .24]].forEach(([x, d]) => { const p = path(sv, `M${x} 1100C${x - 40} 1040 ${x + 40} 980 ${x} 920C${x - 40} 860 ${x + 40} 800 ${x} 740`, { stroke: "#9BC53D", "stroke-width": 14, "stroke-linecap": "round", fill: "none", opacity: .9 });
      draw(p, 53.46 + d, 53.9 + d, "out"); fx(t => p.style.translate = `0 ${(-((t * 60) % 40)).toFixed(1)}px`); });
    const tag = h("div", "abs", S, `USADA HÁ<br><b style="font-size:58px;color:${VERM}">2 DIAS</b>`, `left:640px;top:880px;padding:16px 26px;background:${CREME};border:6px solid ${AM};border-radius:14px;font:800 30px/1.05 var(--v-display);color:${AM};text-align:center;transform-origin:50% -60px`);
    h("div", "abs", tag, null, `left:50%;top:-64px;width:4px;height:64px;background:${AM}`);
    anim(tag, [[54.47, { o: 0, r: -40 }], [54.48, { o: 1 }, "lin"], [55.3, { r: 0 }, "elastic"]]);
    c.origem(540, 1000).s(53.1, 1.0).soco(54.48, .06).s(55.62, 1.05, 1.1, "out");
  });

  /* ================= 20 · percebeu ================= */
  plano("20-holofote", 55.62, 57.38, [["swell", 55.64, .6], ["pop", 56.4, .6]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:#0c0816`);
    h("div", "abs", S, null, `left:140px;top:120px;width:800px;height:1800px;background:radial-gradient(ellipse at 50% 70%,rgba(255,236,180,.42),rgba(255,236,180,.08) 45%,transparent 70%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%)`);
    const j = img(S, "j-frente", "left:320px;top:420px;width:440px;filter:brightness(.9)");
    h("div", "abs", S, null, `left:250px;top:1560px;width:580px;height:80px;border-radius:50%;background:rgba(255,236,180,.25)`);
    ono(S, "!", 760, 420, 56.38, { r: 8, px: 200 });
    c.origem(540, 800).s(55.62, 1.0).s(57.38, 1.1, 1.76, "inOut");
  });

  /* ================= 21 · nada mudou ================= */
  plano("21-igual", 57.38, 61.50, [["swoosh", 57.4, .6], ["pop", 58.74, .8], ["boom", 59.42, 1]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${CREME}`);
    const L = h("div", "abs", S, null, `left:30px;top:360px;width:500px;height:1120px;background:#E9D8B4;border:8px solid ${AM};border-radius:22px;overflow:hidden;transform:rotate(-3deg)`);
    img(L, "j-frente", "left:40px;top:120px;width:420px;filter:sepia(.75) saturate(.8) contrast(1.05)");
    const R = h("div", "abs", S, null, `left:550px;top:360px;width:500px;height:1120px;background:${TANG};border:8px solid ${AM};border-radius:22px;overflow:hidden;transform:rotate(3deg)`);
    img(R, "j-frente", "left:40px;top:120px;width:420px");
    anim(L, [[57.38, { x: -500 }], [57.6, { x: 0 }, "expo"]]); anim(R, [[57.38, { x: 500 }], [57.6, { x: 0 }, "expo"]]);
    placa(S, "2016", 270, 330, 57.5, { px: 60, cor: AM, r: -6 });
    placa(S, "HOJE", 810, 330, 57.6, { px: 60, cor: CORAL, r: 6 });
    const eq = h("div", "ono", S, "=", `left:540px;top:900px;font-size:280px;translate:-50% -50%`); pop(eq, 58.72);
    carimbo(S, "NADA MUDOU", 540, 1560, 59.14, { r: -8, px: 104 });
    c.origem(540, 960).s(57.38, 1.0).s(61.5, 1.06, 4.1, "out").tremor(59.14, 16, .35);
  });

  /* ================= 22 · a decisão ================= */
  plano("22-noite", 61.50, 62.58, [["swell", 61.52, .7]], (S, c) => {
    full(S, "quarto-noite");
    for (let i = 0; i < 12; i++) { const e = h("div", "abs", S, null, `left:${200 + (i * 37) % 160}px;top:${330 + (i * 53) % 240}px;width:6px;height:6px;border-radius:50%;background:#fff`); fx(t => e.style.opacity = (.4 + .6 * Math.abs(Math.sin(t * 3 + i))).toFixed(2)); }
    c.origem(540, 800).s(61.5, 1.0).s(62.58, 1.05, 1.08, "out");
  });
  plano("22-determinado", 62.58, 64.30, [["hit", 63.36, .9], ["chime", 63.4, .5]], (S, c) => {
    fundo(S, "quarto-noite");
    const j = close(S, "j-determinado", { w: 1240, x: 590 }); respira(j, .008);
    [[430, 760], [600, 760]].forEach(([x, y]) => { const e = h("div", "ono", S, "✦", `left:${x}px;top:${y}px;font-size:90px;color:#fff;-webkit-text-stroke:0;translate:-50% -50%`); pop(e, 63.36, { r0: -120 }); });
    c.origem(540, 820).s(62.58, 1.08).s(63.34, 1.3).tremor(63.36, 10, .25);
  });

  /* ================= 23 · sem desculpas ================= */
  plano("23-desculpas", 64.30, 67.12, [["pop", 64.34, .4], ["tick", 65.12, .9], ["tick", 65.72, .9], ["tick", 65.95, .9], ["whoosh", 66.32, .9]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:#B98A5E`);
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle,rgba(0,0,0,.08) 2px,transparent 3px) 0 0/34px 34px`);
    const notas = [["AMANHÃ EU COMEÇO", 120, 360, -5, MUST, 65.10], ["SEGUNDA SEM FALTA", 520, 620, 4, "#FF9F80", 65.70], ["TÔ SEM TEMPO", 170, 900, 3, "#9EE0C8", 65.92]];
    notas.forEach(([txt, x, y, r, cor, tr], i) => {
      const n = h("div", "abs", S, `<span>${txt}</span>`, `left:${x}px;top:${y}px;width:420px;height:300px;background:${cor};border:6px solid ${AM};box-shadow:0 10px 0 rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;text-align:center;font:900 52px/1.05 var(--v-display);color:${AM};padding:20px`);
      const sv = svg(n, 420, 300, "position:absolute;left:-6px;top:-6px");
      draw(path(sv, "M30 170L390 130", { stroke: VERM, "stroke-width": 20, "stroke-linecap": "round", fill: "none" }), tr, tr + .14, "out");
      anim(n, [[64.32 + i * .1, { o: 0, s: .5, r: r * 3 }], [64.34 + i * .1, { o: 1 }, "lin"], [64.6 + i * .1, { s: 1, r }, "back"], [66.3, { x: 0, y: 0, r }], [67.05, { x: (i - 1) * 900, y: -1500, r: r * 20 }, "in"]]);
    });
    c.origem(540, 900).s(64.3, 1.0).s(66.1, 1.08, 1, "out");
  });

  /* ================= 24 · 30 dias para mudar ================= */
  plano("24-dia1", 67.12, 68.56, [["whoosh", 67.14, .5], ["tick", 67.56, 1]], (S, c) => {
    calendario(S, { marcarAte: 1, tMarca: 67.54 });
    placa(S, "DIA 1", 300, 470, 67.62, { px: 64, cor: MUST, txtCor: AM, r: -8 });
    c.origem(260, 640).s(67.12, 1.7);
  });
  plano("24-painel", 68.56, 72.20, [["whoosh", 68.58, .5], ["pop", 69.06, .5], ["pop", 69.18, .5], ["pop", 69.3, .5], ["glitch", 70.48, .6]], (S, c) => {
    raios(S, AM, "#3A2860", 4);
    const p = h("div", "abs", S, null, `left:90px;top:420px;width:900px;padding:40px 40px 50px;background:${AM};border:10px solid #fff;border-radius:40px;box-shadow:0 18px 0 rgba(0,0,0,.35)`);
    h("div", "", p, `<small style="display:block;font:800 36px var(--v-sans);letter-spacing:.08em;color:${MUST}">FALTAM</small><b style="font:900 140px/1 var(--v-display);color:#fff">30 DIAS</b>`);
    const ic = h("div", "", p, null, `display:flex;gap:26px;margin:34px 0`);
    [["✂", "CABELO"], ["👕", "ROUPA"], ["🍩", "BARRIGA"]].forEach(([e, r], i) => { const b = h("div", "", ic, `<div style="font-size:70px">${e}</div><div style="font:800 24px var(--v-sans);color:${MUST};letter-spacing:.06em">${r}</div><div style="font:900 60px var(--v-display);color:#fff">?</div>`, `flex:1;text-align:center;background:rgba(255,255,255,.08);border:5px solid rgba(255,255,255,.3);border-radius:24px;padding:20px 0`); pop(b, 69.04 + i * .12, { s0: .3 }); });
    h("div", "", p, `<small style="display:block;font:800 36px var(--v-sans);letter-spacing:.08em;color:${MUST};margin-bottom:14px">CONFIANÇA</small>`);
    const tr = h("div", "", p, null, `height:56px;border-radius:28px;background:rgba(255,255,255,.18);overflow:hidden`);
    const b = h("div", "", tr, null, `height:100%;width:4%;border-radius:28px;background:${VERM}`);
    fx(t => b.style.background = t > 70.46 && Math.floor(t * 6) % 2 ? "#ff9aa2" : VERM);
    c.origem(540, 800).s(68.56, 1.0).s(69.86, 1.12).s(72.2, 1.18, 2.3, "out").tremor(70.46, 10, .3);
  });

  /* ================= 25 · não ia sozinho ================= */
  plano("25-aponta", 72.20, 74.16, [["swoosh", 72.22, .6], ["hit", 73.2, .8]], (S, c) => {
    fundo(S, "quarto-noite", "filter:blur(10px) brightness(1.1)");
    const j = img(S, "j-aponta", "left:150px;top:420px;width:900px"); respira(j, .008);
    c.origem(320, 760).s(72.2, 1.06).s(73.18, 1.3).tremor(73.2, 10, .25);
  });

  /* ================= 26 · vocês escolhem ================= */
  plano("26-cartas", 74.16, 77.48, [["pop", 74.2, .7], ["flip", 75.64, .6], ["flip", 75.76, .6], ["flip", 75.88, .6], ["flip", 76.0, .6], ["chime", 76.32, .8]], (S, c) => {
    raios(S, PETRO, "#127C7C", 5);
    placa(S, "VOCÊS ESCOLHEM", 540, 470, 74.18, { px: 84, cor: MUST, txtCor: AM, r: -3 });
    for (let i = 0; i < 4; i++) {
      const k = h("div", "abs", S, "?", `left:${400}px;top:${760}px;width:280px;height:400px;border-radius:30px;background:${i ? AM : CORAL};border:8px solid #fff;font:900 220px/400px var(--v-display);text-align:center;color:${i ? MUST : "#fff"};transform-origin:50% 160%`);
      const ang = -27 + i * 18, t = 75.62 + i * .12;
      anim(k, [[74.2 + i * .05, { o: 0, s: .5, y: 500, r: 0 }], [74.21 + i * .05, { o: 1 }, "lin"], [74.5 + i * .05, { s: .85, y: 60, r: (i - 1.5) * 3 }, "back"], [t, { s: .85, y: 60, r: (i - 1.5) * 3 }], [t + .4, { s: 1, y: 0, r: ang }, "back"]]);
      if (!i) { k.style.zIndex = 5; fx(tt => k.style.boxShadow = tt > 76.3 ? `0 0 ${(40 + Math.sin(tt * 10) * 20).toFixed(0)}px ${MUST}` : "none"); }
    }
    c.origem(540, 1000).s(74.16, 1.0).s(77.48, 1.08, 3.3, "out");
  });

  /* ================= 27 · 1ª decisão ================= */
  plano("27-decisao", 77.48, 79.68, [["boom", 77.84, 1], ["swell", 78.64, .5]], (S, c) => {
    raios(S, CORAL, "#FF845F", 8);
    const pl = h("div", "abs", S, `<span style="font-size:80px;color:${MUST}">1ª</span><br>DECISÃO`, `left:540px;top:900px;translate:-50% -50%;padding:40px 70px 50px;background:${AM};border:12px solid #fff;border-radius:36px;font:900 150px/1 var(--v-display);color:#fff;text-align:center;overflow:hidden;box-shadow:0 20px 0 rgba(0,0,0,.3)`);
    bate(pl, 77.70, 2.5, -4); pl.style.rotate = "-4deg";
    const brilho = h("div", "abs", pl, null, `left:-200px;top:-40px;width:120px;height:600px;background:rgba(255,255,255,.55);transform:rotate(20deg)`);
    anim(brilho, [[78.6, { x: 0 }], [79.1, { x: 1300 }, "inOut"]]);
    c.origem(540, 900).s(77.48, 1.0).tremor(77.7, 18, .35).s(79.68, 1.06, 2.2, "out");
  });

  /* ================= 28–29 · cabelo ou guarda-roupa + votação ================= */
  plano("28-votacao", 79.68, 86.48, [["swoosh", 79.7, .7], ["pop", 79.82, .7], ["pop", 81.48, .9], ["flip", 81.88, .7], ["pop", 83.84, .9], ["whoosh", 84.86, .8], ["chime", 85.62, .8], ["blip", 85.9, .5], ["blip", 86.1, .5], ["blip", 86.3, .5]], (S, c) => {
    const esq = h("div", "abs", S, null, `inset:0;background:${CORAL};clip-path:polygon(0 0,62% 0,38% 100%,0 100%)`);
    const dir = h("div", "abs", S, null, `inset:0;background:${PETRO};clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%)`);
    anim(esq, [[79.68, { x: -700 }], [79.95, { x: 0 }, "expo"]]); anim(dir, [[79.68, { x: 700 }], [79.95, { x: 0 }, "expo"]]);
    const jl = img(S, "j-sorriso", "left:20px;top:820px;width:500px"); const jr = img(S, "j-confiante", "left:560px;top:820px;width:500px");
    respira(jl); respira(jr, .012, 2.2, 1.4);
    const T = (txt, x, y, t, cor) => { const e = h("div", "ono", S, txt, `left:${x}px;top:${y}px;font-size:110px;color:${cor};translate:-50% -50%`); pop(e, t, { s0: .3 }); return e; };
    T("CABELO", 280, 560, 81.46, "#fff"); T("✂", 200, 700, 81.5, MUST);
    T("GUARDA-<br>ROUPA", 800, 580, 83.82, MUST).style.textAlign = "center"; T("🧥", 900, 760, 83.86, "#fff");
    const ou = h("div", "abs", S, "OU", `left:540px;top:760px;translate:-50% -50%;width:190px;height:190px;border-radius:50%;background:${MUST};border:10px solid ${AM};font:900 84px/170px var(--v-display);color:${AM};text-align:center`);
    anim(ou, [[81.85, { o: 0, s: 0, r: -180 }], [81.86, { o: 1 }, "lin"], [82.3, { s: 1, r: 0 }, "back"]]);
    const qq = h("div", "ono", S, "?", `left:540px;top:560px;font-size:300px;translate:-50% -50%`);
    anim(qq, [[79.8, { o: 0, s: 0, r: -30 }], [79.81, { o: 1 }, "lin"], [80.1, { s: 1, r: 0 }, "back"], [81.4, { o: 1, s: 1 }], [81.46, { o: 0, s: .4 }, "in"]]);
    // 29 · votação aberta
    const fx1 = h("div", "abs", S, `COMENTE: <span style="color:${MUST}">CABELO</span> OU <span style="color:#7FE0D0">ROUPA</span>`, `left:-20px;right:-20px;top:240px;padding:26px 0;background:${AM};border-top:8px solid #fff;border-bottom:8px solid #fff;text-align:center;font:900 64px var(--v-display);color:#fff;transform:rotate(-3deg)`);
    anim(fx1, [[84.85, { o: 0, y: -400 }], [84.86, { o: 1 }, "lin"], [85.2, { y: 0 }, "back"]]);
    const luz = h("div", "abs", S, `<i></i> VOTAÇÃO ABERTA`, `left:540px;top:1460px;translate:-50% 0;padding:16px 30px;background:#fff;border:6px solid ${AM};border-radius:40px;font:900 40px var(--v-display);color:${AM};white-space:nowrap;display:flex;align-items:center;gap:14px`);
    const bola = luz.querySelector("i"); bola.style.cssText = `display:block;width:30px;height:30px;border-radius:50%;background:${VERM}`;
    fx(t => bola.style.opacity = Math.floor(t * 4) % 2 ? .25 : 1);
    pop(luz, 85.6, { s0: .4 });
    ["cabelo!!", "ROUPA", "cabelo 💇", "roupa urgente", "CABELO"].forEach((m, i) => { const e = h("div", "abs", S, m, `left:${i % 2 ? 640 : 70}px;top:1520px;padding:12px 22px;background:#fff;border:5px solid ${AM};border-radius:24px;font:800 30px var(--v-sans);color:${AM}`);
      const t = 85.9 + i * .18; anim(e, [[t - .001, { o: 0, y: 0 }], [t, { o: 1 }, "lin"], [t + 1.6, { y: -900, o: .95 }, "out"]]); });
    c.origem(540, 960).s(79.68, 1.08).s(81.4, 1.0, .4, "out").soco(83.82, .04).s(86.48, 1.05, 2.6, "out");
  });

  /* ================= 30 · daqui a 30 dias ================= */
  plano("30-painel", 86.48, 87.90, [["hit", 86.64, .8]], (S, c) => {
    raios(S, AM, "#3A2860", 4);
    const p = h("div", "abs", S, `<small style="display:block;font:800 40px var(--v-sans);letter-spacing:.1em;color:${MUST}">FALTAM</small><b style="font:900 160px/1 var(--v-display);color:#fff">30 DIAS</b>`, `left:540px;top:900px;translate:-50% -50%;padding:40px 60px;background:${AM};border:12px solid #fff;border-radius:40px;text-align:center;white-space:nowrap`);
    bate(p, 86.5, 2.2);
    c.tremor(86.94, 14, .3);
  });
  plano("30-futuro", 87.90, 94.0, [["riser", 88.6, .6], ["flip", 90.06, 1], ["boom", 90.4, .8], ["swell", 91.0, .5]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle at 50% 46%,${TANG} 0,${CORAL} 30%,${AM} 70%)`);
    const sil = img(S, "j-frente", "left:300px;top:380px;width:480px;filter:brightness(0) drop-shadow(0 0 30px rgba(255,236,180,.8))");
    const q = h("div", "ono", S, "?", `left:540px;top:600px;font-size:220px;translate:-50% -50%`); pop(q, 88.0, { r0: -40 });
    anim(sil, [[87.9, { o: 1, s: 1 }], [90.0, { o: 1, s: 1.04 }, "out"], [90.1, { o: 0 }, "lin"]]); anim(q, [[90.0, { o: 1 }], [90.1, { o: 0 }, "lin"]]);
    // carta que gira
    const carta = h("div", "abs", S, null, `left:190px;top:420px;width:700px;height:980px;transform-style:preserve-3d`);
    const fr = h("div", "abs", carta, `<div style="font:800 40px var(--v-sans);letter-spacing:.12em;color:${MUST}">EPISÓDIO</div><div style="font:900 300px/1 var(--v-display);color:#fff">2</div><div style="font:900 64px/1.05 var(--v-display);color:#fff;margin-top:30px">A ESCOLHA<br>DE VOCÊS</div>`,
      `inset:0;border-radius:44px;background:${AM};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;backface-visibility:hidden;box-shadow:0 24px 0 rgba(0,0,0,.3)`);
    anim(carta, [[90.0, { o: 0, ry: -180, s: .6 }], [90.04, { o: 1 }, "lin"], [90.7, { ry: 0, s: 1 }, "back"]]);
    fx(t => fr.style.visibility = t >= 90.04 ? "visible" : "hidden");
    particulas(S, { n: 30, t0: 90.4, x: 540, y: 300, cores: [CORAL, MUST, PETRO, "#fff"], tam: [16, 30], vx: [-700, 700], vy: [-600, 0], g: 1200, forma: "conf", dur: 2.5 });
    c.origem(540, 900).s(87.9, 1.0).s(90.0, 1.08, 2.1, "out").s(94, 1.12, 4, "out");
  });
})();
