/* Juninho · Episódio 3 — modo cartoon narrativo (referencias/modo-cartoon-narrativo.md, seção 4: série)
 * Mesma série do ep. 1 (personagem, casa, legenda, painel, traço); acessórios e destaque dourado.
 * Narração acelerada a pedido (132,6 → 108,2 s, mesmos parâmetros do ep. 2). Sem música; ~2 efeitos/s.
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

  const VERDE = "#2BB673";
  const brl = v => "R$ " + v.toFixed(2).replace(".", ",");

  /* ---------- app de banco genérico (sem marca) ---------- */
  function appBanco(tela, { valor = t => 186.40, cinza = -1 } = {}) {
    h("div", "abs", tela, null, `inset:0;background:${CREME}`);
    h("div", "abs", tela, `<span>●●● ▮</span>`, `left:0;right:0;top:0;height:58px;display:flex;justify-content:flex-end;align-items:center;padding:8px 34px 0;font:700 22px var(--v-sans);color:${AM}`);
    const top = h("div", "abs", tela, `<div style="width:70px;height:70px;border-radius:20px;background:${VERDE};border:4px solid ${AM};font:900 44px/62px var(--v-display);color:#fff;text-align:center">$</div><b style="font:800 34px var(--v-display);color:${AM}">Minha conta</b>`,
      `left:30px;right:30px;top:80px;display:flex;align-items:center;gap:20px`);
    const card = h("div", "abs", tela, null, `left:30px;right:30px;top:220px;padding:34px 30px;border-radius:30px;background:#fff;border:5px solid ${AM};box-shadow:0 8px 0 ${AM}`);
    h("div", "", card, "Saldo disponível", `font:700 28px var(--v-sans);color:${PETRO}`);
    const v = h("div", "", card, "", `font:900 92px/1.1 var(--v-display);color:${AM};letter-spacing:-.03em;margin-top:8px;white-space:nowrap`);
    let last = ""; fx(t => { const s = brl(valor(t)); if (s !== last) { v.textContent = s; last = s; } });
    for (let i = 0; i < 4; i++) h("div", "abs", tela, null, `left:30px;right:30px;top:${560 + i * 120}px;height:90px;border-radius:22px;background:#fff;border:4px solid rgba(42,27,71,.25)`);
    if (cinza > 0) fx(t => tela.style.filter = t >= cinza ? "grayscale(1) contrast(1.1)" : "none");
    return { card, v };
  }

  /* ================= PAINEL FIXO DA SÉRIE (topo) ================= */
  // saldo: valores da narração (186,40 → −89,90 → 96,50)
  const SALDO = t => 96.50 + 60 * prog(t, 45.44, 46.1, "out") - 42.90 * prog(t, 57.58, 58.2, "out");
  const NIVEL = [[0, .36], [66.18, .36], [66.8, .6], [77.84, .6], [78.4, .78], [80.0, .78], [80.4, .62]];
  const nivel = t => { let v = NIVEL[0][1]; for (let i = 1; i < NIVEL.length; i++) { const [a, va] = NIVEL[i - 1], [b, vb] = NIVEL[i]; if (t >= b) v = vb; else if (t > a) { v = va + (vb - va) * prog(t, a, b, "out"); break; } } return v; };
  const HUD_ON = [[0.80, 3.64], [3.64, 19.86], [25.20, 29.26], [30.74, 43.06], [46.14, 47.88], [47.88, 54.42], [58.16, 69.26], [77.42, 79.30], [87.24, 95.50]];
  cena({ id: "painel", nome: "Painel da série", inicio: .7, fim: 96, margem: 0, z: 900, montar(S) {
    const box = h("div", "abs", S, null, `left:40px;top:232px;display:flex;gap:12px;align-items:stretch;scale:1.3;transform-origin:0 0`);
    const pill = (html, w) => h("div", "", box, html, `background:${AM};border:5px solid #fff;border-radius:18px;padding:10px 18px 12px;box-shadow:0 6px 0 rgba(0,0,0,.35);${w ? "width:" + w + "px" : ""}`);
    pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">FALTAM</small><b style="font:900 42px/1 var(--v-display);color:#fff">27 DIAS</b>`);
    const sp = pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">SALDO</small><b style="font:900 42px/1 var(--v-display);color:#fff;white-space:nowrap"></b>`);
    const sv = sp.querySelector("b"); let last = "";
    fx(t => { const s = brl(SALDO(t)); if (s !== last) { sv.textContent = s; last = s; } sv.style.color = t >= 45.44 && t < 46.6 ? (Math.floor(t * 8) % 2 ? VERDE : "#fff") : t >= 57.58 && t < 58.8 ? (Math.floor(t * 8) % 2 ? VERM : "#fff") : "#fff"; });
    const c = pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">CONFIANÇA</small>`, 220);
    const tr = h("div", "", c, null, `margin-top:8px;height:22px;border-radius:11px;background:rgba(255,255,255,.18);overflow:hidden`);
    const barra = h("div", "", tr, null, `height:100%;border-radius:11px`);
    fx(t => { const v = nivel(t); barra.style.width = (v * 100).toFixed(1) + "%"; barra.style.background = v < .1 ? VERM : v > .3 ? VERDE : CORAL; });
    anim(box, [[.799, { o: 0, s: .5, y: -40 }], [.80, { o: 1 }, "lin"], [1.15, { s: 1, y: 0 }, "back"]]);
    fx(t => { box.style.visibility = HUD_ON.some(([a, b]) => t >= a && t < b) ? "visible" : "hidden"; });
  } });

  const OURO = "#C9A227";
  const comentarios = (p, lista, t0, passo = .16, y0 = 1500, sobe = 1000) => lista.forEach((m, i) => {
    const e = h("div", "abs", p, m, `left:${i % 2 ? 600 : 60}px;top:${y0}px;padding:12px 22px;background:#fff;border:5px solid ${AM};border-radius:24px;font:800 30px var(--v-sans);color:${AM};white-space:nowrap`);
    const t = t0 + i * passo; anim(e, [[t - .001, { o: 0, y: 0, s: .6 }], [t, { o: 1 }, "lin"], [t + .2, { s: 1 }, "back"], [t + 1.6, { y: -sobe }, "out"]]);
  });
  const brilhos = (p, pts, t0, passo = .06, cor = "#fff") => pts.forEach(([x, y, s], i) => { const e = h("div", "ono", p, "✦", `left:${x}px;top:${y}px;font-size:${s || 80}px;color:${cor};translate:-50% -50%`); pop(e, t0 + i * passo, { r0: -120 }); });
  const espelho = (S, nome, css) => {
    fundo(S);
    const esp = h("div", "abs", S, null, `left:130px;top:220px;width:820px;height:1600px;border-radius:410px 410px 30px 30px;background:linear-gradient(160deg,#DDF3F6,#A9D8E0);border:24px solid ${MUST};box-shadow:0 0 0 10px ${AM};overflow:hidden`);
    return { esp, j: img(esp, nome, css) };
  };
  const placaProblema = (S, t0, tGrande) => {
    h("div", "abs", S, null, `inset:0;background:${CREME}`);
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle,rgba(42,27,71,.08) 3px,transparent 4px) 0 0/40px 40px`);
    const pl = h("div", "carimbo", S, "PROBLEMA", `left:540px;top:900px;translate:-50% -50%;font-size:130px`);
    anim(pl, [[t0, { o: 0, s: .05 }], [t0 + .25, { o: 0, s: .05 }], [t0 + .26, { o: 1 }, "lin"], [t0 + .4, { s: .12 }, "back"], [tGrande, { s: .12 }], [tGrande + .16, { s: 1.15 }, "expo"], [tGrande + .36, { s: 1 }, "out"]]);
    const lupa = h("div", "abs", S, null, `left:560px;top:840px;width:150px;height:150px;border-radius:50%;border:14px solid ${AM};background:rgba(255,255,255,.4)`);
    h("div", "abs", lupa, null, `left:110px;top:120px;width:22px;height:110px;background:${AM};border-radius:10px;transform:rotate(-45deg);transform-origin:50% 0`);
    anim(lupa, [[t0, { o: 0, x: 300, y: -300 }], [t0 + .04, { o: 1 }, "lin"], [t0 + .3, { x: -200, y: 200 }, "inOut"], [tGrande - .3, { x: 0, y: 0 }, "back"], [tGrande, { o: 1, s: 1 }], [tGrande + .06, { o: 0, s: 2 }, "in"]]);
  };

  /* ================= 1 · vocês escolheram ================= */
  plano("01-escolheram", 0, 0.82, [["boom", 0.02, .8], ["blip", .2, .5], ["blip", .36, .5], ["blip", .52, .5], ["blip", .68, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(4px)");
    h("div", "layer", S, null, "background:rgba(42,27,71,.25)");
    placa(c.fixo, "VOCÊS ESCOLHERAM", 540, 560, .02, { px: 80, cor: MUST, txtCor: AM, r: -3 });
    comentarios(S, ["2!!", "o 2 claro", "MODERNO", "2 2 2"], .2);
    c.origem(540, 900).s(0, 1.05).s(.82, 1.1, .8, "out");
  });
  plano("01-look2", 0.82, 3.64, [["hit", .84, 1], ["pop", 1.2, .6], ["chime", 2.84, .8], ["pop", 2.9, .5], ["pop", 3.0, .5], ["pop", 3.1, .5]], (S, c) => {
    raios(S, OURO, "#D9B848", 5);
    const j = img(S, "look2", "left:230px;top:440px;width:620px"); respira(j, .006);
    carimbo(c.fixo, "Nº 2 ✓", 820, 560, .84, { r: 10, px: 110 });
    brilhos(c.fixo, [[420, 900, 90], [640, 1000, 70], [520, 1240, 80]], 2.84);
    c.origem(540, 1000).s(.82, 1.0).soco(.84, .05).s(3.64, 1.06, 2.8, "out");
  });

  /* ================= 2 · não ia economizar ================= */
  plano("02-economia", 3.64, 7.86, [["swoosh", 3.66, .5], ["boom", 5.06, .9], ["glitch", 6.14, .8], ["flip", 6.2, .6], ["pop", 7.26, .5]], (S, c) => {
    fundo(S);
    const j1 = close(S, "x-convencido"), j2 = close(S, "x-culpado"); respira(j1); respira(j2);
    troca([j1, j2], [3.64, 6.12]);
    const pl = h("div", "abs", c.fixo, "SEM ECONOMIA!", `left:540px;top:560px;translate:-50% -50%;padding:24px 44px;background:${VERM};border:10px solid #fff;border-radius:26px;font:900 84px var(--v-display);color:#fff;white-space:nowrap`);
    bate(pl, 5.04, 2.2, -5); pl.style.rotate = "-5deg";
    fx(t => { const on = t >= 6.12; pl.innerHTML = on ? "…UM POUCO DE<br>ECONOMIA" : "SEM ECONOMIA!"; pl.style.background = on ? PETRO : VERM; pl.style.fontSize = on ? "64px" : "84px"; pl.style.textAlign = "center"; });
    ono(c.fixo, "SCRATCH!", 760, 900, 6.14, { r: 8, px: 90, cor: "#fff" });
    c.origem(540, 900).s(3.64, 1.1).soco(5.04, .06).s(6.12, 1.22).tremor(6.14, 10, .3);
  });

  /* ================= 3 · faltava alguma coisa ================= */
  plano("03-espelho", 7.86, 10.14, [["swoosh", 7.88, .5], ["chime", 8.64, .6], ["pop", 9.5, .4]], (S, c) => {
    const { j } = espelho(S, "n-frente", "left:180px;top:220px;width:460px"); respira(j, .006);
    const br = h("div", "abs", S, null, `left:300px;top:300px;width:60px;height:900px;background:rgba(255,255,255,.6);border-radius:30px;transform:rotate(18deg)`);
    anim(br, [[8.6, { y: -500, o: 0 }], [8.62, { o: 1 }, "lin"], [9.3, { y: 600 }, "out"], [9.35, { o: 0 }, "lin"]]);
    c.origem(540, 900).s(7.86, 1.0).s(10.14, 1.06, 2.2, "out");
  });
  plano("03-quebracabeca", 10.14, 12.68, [["pop", 10.2, .7], ["pop", 10.36, .7], ["pop", 10.52, .7], ["blip", 12.1, .6], ["blip", 12.35, .6]], (S, c) => {
    raios(S, PETRO, "#127C7C", 4);
    const cores = [MUST, CORAL, VERDE, "#fff"];
    [[160, 560], [560, 560], [160, 960], [560, 960]].forEach(([x, y], i) => {
      const pc = h("div", "abs", S, i === 3 ? "?" : "", `left:${x}px;top:${y}px;width:360px;height:360px;border-radius:30px;background:${i === 3 ? "rgba(255,255,255,.15)" : cores[i]};border:12px ${i === 3 ? "dashed" : "solid"} ${i === 3 ? "#fff" : AM};font:900 220px/330px var(--v-display);color:#fff;text-align:center`);
      pop(pc, 10.18 + i * .16, { s0: .2, r0: (i - 1.5) * 20 });
      if (i === 3) fx(t => pc.style.opacity = t > 12.08 ? (Math.floor(t * 6) % 2 ? .35 : 1) : 1);
    });
    c.origem(540, 960).s(10.14, 1.0).s(12.68, 1.08, 2.5, "out");
  });

  /* ================= 4 · checklist → acessórios ================= */
  plano("04-pecas", 12.68, 15.28, [["swoosh", 12.7, .5], ["tick", 12.86, 1], ["pop", 12.9, .6], ["tick", 13.84, 1], ["pop", 13.88, .6], ["blip", 14.3, .5]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${CREME}`);
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle,rgba(201,162,39,.18) 4px,transparent 5px) 0 0/44px 44px`);
    [["p-jaqueta", 80, 520, 12.84, -6, 520], ["p-calca", 640, 460, 13.82, 6, 300]].forEach(([n, x, y, t, r, w]) => {
      const e = img(S, n, `left:${x}px;top:${y}px;width:${w}px`); pop(e, t, { s0: 0, r0: r * 4 }); e.style.rotate = r + "deg"; MDS.floaty(e, 10, 2, x);
      const ok = h("div", "abs", c.fixo, "✓", `left:${x + w - 60}px;top:${y - 30}px;width:120px;height:120px;border-radius:50%;background:${VERDE};border:8px solid #fff;font:900 84px/104px var(--v-display);color:#fff;text-align:center`);
      bate(ok, t + .05, 2.2);
    });
    c.origem(540, 900).s(12.68, 1.0).s(15.28, 1.06, 2.6, "out");
  });
  plano("04-pensa", 15.28, 19.06, [["swoosh", 15.3, .4], ["pop", 16.0, .4], ["blip", 16.94, .5], ["riser", 17.9, .8]], (S, c) => {
    fundo(S);
    const j = close(S, "n-pensa"); respira(j);
    const bal = h("div", "abs", c.fixo, "…", `left:800px;top:520px;translate:-50% -50%;width:220px;height:160px;border-radius:50%;background:#fff;border:8px solid ${AM};font:900 90px/120px var(--v-display);color:${AM};text-align:center`);
    pop(bal, 16.0, { s0: .2 });
    c.origem(540, 900).s(15.28, 1.08).s(19.06, 1.2, 3.7, "inOut");
  });
  plano("04-acessorios", 19.06, 19.86, [["boom", 19.08, 1], ["chime", 19.14, .9], ["pop", 19.3, .5]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:#120c22`);
    h("div", "abs", S, null, `left:90px;top:200px;width:900px;height:1700px;background:radial-gradient(ellipse at 50% 45%,rgba(255,226,140,.5),transparent 60%)`);
    const t = h("div", "ono", S, "ACESSÓRIOS", `left:540px;top:900px;font-size:150px;color:${OURO};translate:-50% -50%;-webkit-text-stroke:16px ${AM}`);
    bate(t, 19.06, 2.5);
    brilhos(c.fixo, [[200, 760, 90], [880, 760, 70], [300, 1080, 70], [800, 1060, 90]], 19.12, .04, MUST);
    c.tremor(19.08, 14, .3);
  });

  /* ================= 5 · problema + saldo ================= */
  plano("05-problema", 19.86, 21.36, [["swoosh", 19.9, .5], ["swoosh", 20.15, .5], ["pop", 20.4, .5], ["boom", 20.8, .9]], (S, c) => {
    placaProblema(S, 19.86, 20.76);
    c.tremor(20.78, 18, .35);
  });
  plano("05-saldo", 21.36, 25.20, [["click", 21.4, .8], ["tick", 22.5, .5], ["tick", 22.6, .5], ["tick", 22.7, .5], ["ding", 22.8, .55], ["coin", 23.2, .7], ["glitch", 24.6, .3]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 96.50 * prog(t, 22.4, 22.78, "out") });
    const lupa = h("div", "abs", c.fixo, null, `left:620px;top:420px;width:200px;height:200px;border-radius:50%;border:16px solid ${AM};background:rgba(255,255,255,.3)`);
    h("div", "abs", lupa, null, `left:150px;top:160px;width:26px;height:140px;background:${AM};border-radius:12px;transform:rotate(-45deg);transform-origin:50% 0`);
    pop(lupa, 23.0, { s0: .3 }); fx(t => lupa.style.translate = t > 23.2 ? `${(Math.sin(t * 40) * 6).toFixed(1)}px 0` : "0 0");
    c.origem(540, 560).s(21.36, 1.08).s(22.78, 1.4);
  });

  /* ================= 6 · não é barato ================= */
  plano("06-barato", 25.20, 29.26, [["swoosh", 25.22, .5], ["whoosh", 27.0, .8], ["hit", 27.3, .9], ["pop", 27.5, .5], ["boom", 28.9, .9]], (S, c) => {
    fundo(S);
    const j = img(S, "n-frente", "left:300px;top:640px;width:480px");
    anim(j, [[27.28, { r: 0, x: 0 }], [27.4, { r: -6, x: -30 }, "out"], [27.7, { r: 4, x: 20 }, "sine"], [28.0, { r: 0, x: 0 }, "sine"]]);
    const et = h("div", "abs", S, `<span style="font:900 150px var(--v-display);color:${VERM}">$$$$</span>`, `left:540px;top:520px;translate:-50% -50%;width:600px;height:330px;background:${CREME};border:12px solid ${AM};border-radius:30px 90px 90px 30px;display:flex;align-items:center;justify-content:center`);
    anim(et, [[27.0, { y: -1100, r: -20 }], [27.3, { y: 0, r: -8 }, "in"], [27.45, { y: -40 }, "out"], [27.6, { y: 0 }, "in"]]);
    carimbo(c.fixo, "NADA BARATO", 540, 1120, 28.88, { r: -10, px: 110 });
    c.origem(540, 900).s(25.2, 1.0).tremor(27.3, 16, .35).tremor(28.9, 12, .3);
  });

  /* ================= 7 · manhã cedo ================= */
  plano("07-despertador", 29.26, 30.74, [["glitch", 29.28, .5], ...Array.from({ length: 10 }, (_, i) => ["tick", 29.3 + i * .1, .7]), ["pop", 29.4, .5]], (S, c) => {
    raios(S, MUST, "#FFE48A", 10);
    const d = h("div", "abs", S, `<div style="font:900 120px var(--v-display);color:${AM}">6:00</div>`, `left:290px;top:640px;width:500px;height:500px;border-radius:50%;background:#fff;border:20px solid ${VERM};display:flex;align-items:center;justify-content:center`);
    [[-1], [1]].forEach(([s]) => h("div", "abs", d, null, `left:${s < 0 ? 20 : 340}px;top:-90px;width:120px;height:100px;border-radius:60px 60px 10px 10px;background:${VERM};border:10px solid ${AM}`));
    fx(t => d.style.rotate = (Math.sin(t * 70) * 6).toFixed(1) + "deg");
    ono(c.fixo, "RRRING!", 540, 480, 29.3, { r: -6, px: 150 });
    c.tremor(29.3, 8, 1.4);
  });
  plano("07-lanchonete", 30.74, 32.46, [["ding", 30.76, .5], ["whoosh", 31.1, .7], ["pop", 31.5, .4]], (S, c) => {
    full(S, "lanchonete", "filter:brightness(1.08) saturate(.9)");
    h("div", "layer", S, null, "background:linear-gradient(180deg,rgba(255,236,180,.35),transparent 50%)");
    const j = img(S, "a-bandeja", "left:520px;top:700px;width:520px;clip-path:inset(0 0 40% 0)");
    anim(j, [[30.74, { x: 700 }], [31.2, { x: 0 }, "out"]]);
    placa(c.fixo, "MAIS CEDO", 540, 520, 30.8, { px: 64, cor: MUST, txtCor: AM, r: -4 });
    c.origem(540, 1000).s(30.74, 1.0).s(32.46, 1.06, 1.7, "out");
  });

  /* ================= 8 · turno extra ================= */
  plano("08-dono", 32.46, 35.00, [["swoosh", 32.48, .5], ["pop", 34.14, .8], ["blip", 34.4, .5]], (S, c) => {
    fundo(S, "lanchonete");
    const d = img(S, "dono-pergunta", "left:-60px;top:560px;width:1200px"); respira(d, .006);
    const bal = h("div", "abs", c.fixo, "TURNO<br>EXTRA?", `left:720px;top:520px;translate:-50% -50%;padding:24px 40px;background:#fff;border:9px solid ${AM};border-radius:40px;font:900 76px/1 var(--v-display);color:${AM};text-align:center;box-shadow:0 10px 0 ${AM}`);
    pop(bal, 34.12, { s0: .2, r0: 10 });
    c.origem(400, 900).s(32.46, 1.0).s(35.0, 1.06, 2.5, "out");
  });
  plano("08-cifrao", 35.00, 36.60, [["chime", 35.78, 1], ["coin", 35.8, .8], ["pop", 35.9, .5]], (S, c) => {
    raios(S, VERDE, "#3FCB88", 6);
    const j = close(S, "x-cifrao"); respira(j);
    ono(c.fixo, "PLIM!", 820, 520, 35.78, { r: 10, px: 130 });
    c.origem(540, 800).s(35.0, 1.08).soco(35.76, .07);
  });

  /* ================= 9 · trabalhou bastante ================= */
  plano("09-montagem", 36.60, 39.04, [["whoosh", 36.62, .6], ["key", 37.0, .6], ["key", 37.1, .6], ["key", 37.2, .6], ["swoosh", 37.44, .6], ...Array.from({ length: 10 }, (_, i) => ["tick", 37.92 + i * .1, .6]), ["swoosh", 38.4, .5]], (S, c) => {
    fundo(S, "lanchonete");
    const quadros = [["a-bandeja", 36.6], ["a-anota", 37.0], ["a-bandeja", 37.44], ["a-pensa", 37.92], ["a-anota", 38.4]];
    const els = quadros.map(([n], i) => img(S, n, `left:${i % 2 ? 160 : 200}px;top:${i % 2 ? 380 : 420}px;width:${i % 2 ? 760 : 700}px;${i % 2 ? "transform:scaleX(-1)" : ""}`));
    troca(els, quadros.map(q => q[1]));
    const cont = h("div", "abs", c.fixo, null, `left:540px;top:440px;translate:-50% -50%;padding:16px 34px;background:${AM};border:7px solid #fff;border-radius:22px;font:900 54px var(--v-display);color:#fff;white-space:nowrap`);
    fx(t => cont.textContent = "CLIENTES: " + Math.max(1, Math.round(1 + 80 * prog(t, 37.9, 38.9, "in"))));
    pop(cont, 36.7, { s0: .4 });
    c.origem(540, 900).s(36.6, 1.0).soco(37.44, .04).soco(37.92, .04).soco(38.4, .04);
  });

  /* ================= 10 · cinco vezes ================= */
  plano("10-chato", 39.04, 42.46, [["swoosh", 39.06, .5], ["pop", 40.84, .7], ["pop", 41.06, .7], ["pop", 41.28, .7], ["pop", 41.5, .7], ["pop", 41.72, .8], ["tick", 40.3, .5], ["tick", 40.5, .5]], (S, c) => {
    full(S, "clientes", "transform:scale(1.9);transform-origin:18% 30%");
    [0, 1, 2, 3, 4].forEach(i => { const b = h("div", "abs", c.fixo, `TÁ PRONTO? <span style="color:${VERM}">${i + 1}x</span>`, `left:${560 + (i % 2) * 120}px;top:${380 + i * 150}px;padding:16px 26px;background:#fff;border:7px solid ${AM};border-radius:28px;font:900 44px var(--v-display);color:${AM};white-space:nowrap;box-shadow:0 7px 0 ${AM}`);
      pop(b, 40.82 + i * .22, { s0: .2, r0: (i % 2 ? 1 : -1) * 15 }); b.style.rotate = (i % 2 ? 3 : -3) + "deg"; });
    c.origem(300, 800).s(39.04, 1.0).tremor(41.72, 8, .25);
  });
  plano("10-tremendo", 42.46, 43.06, [["glitch", 42.48, .6], ["pop", 42.6, .4]], (S, c) => {
    fundo(S, "lanchonete");
    const j = close(S, "x-tremendo"); fx(t => j.style.translate = `${(Math.sin(t * 90) * 3).toFixed(1)}px 0`);
    c.origem(420, 700).s(42.46, 1.25);
  });

  /* ================= 11 · + R$ 60 ================= */
  plano("11-fim-turno", 43.06, 44.60, [["swell", 43.08, .5], ["pop", 43.2, .6]], (S, c) => {
    full(S, "lanchonete", "filter:saturate(1.3) hue-rotate(-12deg) brightness(.9)");
    h("div", "layer", S, null, "background:linear-gradient(180deg,rgba(255,120,60,.35),rgba(42,27,71,.25))");
    placa(c.fixo, "FIM DO TURNO", 540, 560, 43.1, { px: 74, cor: CORAL, r: -3 });
    c.origem(540, 900).s(43.06, 1.0).s(44.6, 1.05, 1.5, "out");
  });
  plano("11-notas", 44.60, 46.14, [["coin", 44.62, 1], ["pop", 44.7, .6], ["pop", 44.85, .6], ["pop", 45.0, .6], ["coin", 45.2, .6], ["whoosh", 45.46, .8], ["chime", 45.9, .7]], (S, c) => {
    raios(S, VERDE, "#3FCB88", 5);
    const mao = h("div", "abs", S, null, `left:300px;top:1180px;width:480px;height:260px;border-radius:130px 130px 60px 60px;background:#F6C6A8;border:10px solid ${AM}`);
    for (let i = 0; i < 3; i++) { const n = h("div", "abs", S, "R$ 20", `left:330px;top:900px;width:420px;height:200px;border-radius:16px;background:${VERDE};border:8px solid ${AM};font:900 70px/184px var(--v-display);color:${AM};text-align:center`);
      const t = 44.62 + i * .15; anim(n, [[t - .001, { o: 0, y: -900, r: -30 + i * 20 }], [t, { o: 1 }, "lin"], [t + .3, { y: 140 - i * 40, r: -8 + i * 8 }, "out"]]); }
    const mais = h("div", "ono", c.fixo, "+R$ 60", `left:540px;top:560px;font-size:150px;color:${VERDE};translate:-50% -50%`);
    anim(mais, [[45.1, { o: 0, s: .3 }], [45.12, { o: 1 }, "lin"], [45.35, { s: 1 }, "back"], [45.44, { x: 0, y: 0, s: 1 }], [45.9, { x: -200, y: -320, s: .3, o: 0 }, "in"]]);
    c.origem(540, 1100).s(44.6, 1.0).tremor(44.62, 6, .3);
  });
  plano("11-agora-sim", 46.14, 47.88, [["boom", 46.16, .8], ["pop", 46.5, .5]], (S, c) => {
    raios(S, MUST, "#FFE48A", 6);
    const j = close(S, "n-orgulho"); respira(j);
    placa(c.fixo, "AGORA SIM!", 540, 560, 46.14, { px: 90, cor: VERDE, r: -4 });
    c.origem(540, 900).s(46.14, 1.1).soco(46.16, .06);
  });

  /* ================= 12 · vitrine ================= */
  plano("12-vitrine", 47.88, 50.40, [["swoosh", 47.9, .5], ["pop", 48.44, .7], ["chime", 49.58, .8], ["pop", 49.7, .5], ["pop", 49.9, .5]], (S, c) => {
    full(S, "vitrine", "transform:scale(1.35);transform-origin:50% 30%");
    const j = img(S, "x-bolso", "left:560px;top:860px;width:480px"); respira(j, .006);
    anim(j, [[47.88, { x: 600 }], [48.3, { x: 0 }, "out"]]);
    brilhos(c.fixo, [[300, 560, 80], [460, 760, 60], [240, 900, 70], [520, 520, 60]], 49.56, .08, MUST);
    c.origem(400, 800).s(47.88, 1.0).s(50.4, 1.08, 2.5, "out");
  });

  /* ================= 13 · relógio e corrente ================= */
  plano("13-relogio", 50.40, 51.88, [["pop", 50.84, 1], ...Array.from({ length: 6 }, (_, i) => ["tick", 51.0 + i * .14, .5])], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const r = img(S, "relogio", "left:250px;top:520px;width:580px"); pop(r, 50.44, { s0: .2, r0: -30 });
    fx(t => r.style.rotate = (Math.sin(t * 2) * 6).toFixed(1) + "deg");
    placa(c.fixo, "RELÓGIO SIMPLES", 540, 1480, 50.9, { px: 54, cor: OURO, txtCor: AM });
    c.origem(540, 900).s(50.4, 1.0).s(51.88, 1.08, 1.4, "out");
  });
  plano("13-corrente", 51.88, 54.42, [["coin", 51.9, .7], ["chime", 52.2, .5], ["swoosh", 52.6, .5], ["chime", 52.88, .9], ["tick", 52.9, .8]], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const k = img(S, "corrente", "left:240px;top:520px;width:600px;transform-origin:50% 0"); pop(k, 51.88, { s0: .2 });
    fx(t => k.style.rotate = (Math.sin(t * 3.4) * 8).toFixed(1) + "deg");
    const j = img(S, "p-jaqueta", "left:640px;top:1080px;width:340px"), r = img(S, "relogio", "left:110px;top:1120px;width:250px");
    pop(j, 52.84, { s0: 0 }); pop(r, 52.9, { s0: 0 });
    const ok = h("div", "abs", c.fixo, "✓", `left:540px;top:1180px;translate:-50% -50%;width:200px;height:200px;border-radius:50%;background:${VERDE};border:12px solid #fff;font:900 140px/176px var(--v-display);color:#fff;text-align:center`);
    bate(ok, 52.9, 2.4);
    placa(c.fixo, "CORRENTE DISCRETA", 540, 330, 51.95, { px: 50, cor: OURO, txtCor: AM, ate: 52.8 });
    c.origem(540, 900).s(51.88, 1.0).s(54.42, 1.04, 2.5, "out");
  });

  /* ================= 14 · R$ 42,90 ================= */
  plano("14-pesquisa", 54.42, 55.74, [["swoosh", 54.5, .5], ["swoosh", 54.75, .5], ["swoosh", 55.0, .5], ["swoosh", 55.25, .5], ["swoosh", 55.5, .5]], (S, c) => {
    full(S, "vitrine", "filter:blur(5px)");
    for (let i = 0; i < 5; i++) { const e = h("div", "abs", S, `<span style="font:900 100px var(--v-display);color:${VERM}">$${"$".repeat(i % 3)}</span>`, `left:340px;top:760px;width:400px;height:240px;background:${CREME};border:10px solid ${AM};border-radius:20px 70px 70px 20px;display:flex;align-items:center;justify-content:center`);
      const t = 54.42 + i * .25; anim(e, [[t, { x: 1100, o: 1 }], [t + .12, { x: 0 }, "out"], [t + .2, { x: 0 }], [t + .3, { x: -1100 }, "in"]]); }
    placa(c.fixo, "PESQUISANDO…", 540, 560, 54.6, { px: 60, cor: AM });
  });
  plano("14-maquininha", 55.74, 58.16, [["click", 55.76, 1], ["blip", 55.9, .6], ["key", 56.1, .6], ["key", 56.2, .6], ["key", 56.3, .6], ["chime", 57.6, .9], ["coin", 57.62, .6], ["glitch", 57.8, .4]], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const maq = h("div", "abs", S, null, `left:300px;top:700px;width:480px;height:760px;background:#2E2E3A;border:12px solid #fff;border-radius:50px`);
    const vis = h("div", "abs", maq, "R$ 42,90", `left:40px;top:60px;right:40px;height:200px;background:#9FE3B8;border:8px solid ${AM};border-radius:20px;font:900 62px/184px var(--v-display);color:${AM};text-align:center`);
    for (let i = 0; i < 12; i++) h("div", "abs", maq, null, `left:${50 + (i % 3) * 130}px;top:${310 + Math.floor(i / 3) * 100}px;width:100px;height:72px;border-radius:16px;background:${i === 11 ? VERDE : "#4A4A5A"};border:5px solid ${AM}`);
    pop(maq, 55.76, { s0: .5 });
    const rec = h("div", "abs", S, `<div style="font:800 30px var(--v-sans);color:${AM};letter-spacing:.06em">ACESSÓRIOS</div><div style="font:900 84px var(--v-display);color:${VERM};margin-top:10px;white-space:nowrap">−R$ 42,90</div>`,
      `left:240px;top:300px;width:600px;height:330px;padding:40px 30px;background:#fff;border:8px solid ${AM};text-align:center`);
    fx(t => rec.style.clipPath = `inset(${((1 - prog(t, 57.5, 57.9, "out")) * 100).toFixed(1)}% 0 0 0)`);
    c.origem(540, 800).s(55.74, 1.0).s(57.58, 1.08).tremor(57.62, 8, .3);
  });

  /* ================= 15 · espelho ================= */
  plano("15-porta", 58.16, 59.24, [["hit", 58.6, .7], ["swoosh", 58.2, .4]], (S, c) => {
    full(S, "quarto-tarde");
    const porta = h("div", "abs", S, null, `left:-20px;top:0;width:560px;height:1920px;background:#8E5A36;border:14px solid ${AM};transform-origin:0 50%`);
    h("div", "abs", porta, null, `left:470px;top:960px;width:50px;height:50px;border-radius:50%;background:${MUST};border:6px solid ${AM}`);
    anim(porta, [[58.16, { ry: 0 }], [58.6, { ry: -82 }, "out"]]);
    ono(c.fixo, "BLAM!", 760, 560, 58.6, { r: 8, px: 130 });
    c.tremor(58.62, 10, .25);
  });
  plano("15-veste", 59.24, 62.50, [["click", 59.7, .9], ["click", 59.9, .9], ["coin", 60.0, .5], ["flip", 60.78, .9], ["swoosh", 60.9, .5], ["pop", 61.6, .4]], (S, c) => {
    raios(S, OURO, "#D9B848", 4);
    const r = img(S, "relogio", "left:140px;top:520px;width:340px"), k = img(S, "corrente", "left:560px;top:500px;width:400px");
    pop(r, 59.68, { s0: 0, r0: -40 }); pop(k, 59.88, { s0: 0, r0: 40 });
    const j = img(S, "p-jaqueta", "left:230px;top:900px;width:620px");
    anim(j, [[60.74, { o: 0, x: -900, r: -30 }], [60.76, { o: 1 }, "lin"], [61.0, { x: 0, r: 0 }, "out"]]);
    ono(c.fixo, "CLIC CLIC", 540, 430, 59.7, { r: -5, px: 90, ate: 60.7 }); ono(c.fixo, "FWIP!", 760, 1500, 60.78, { r: 6, px: 100 });
    c.origem(540, 900).s(59.24, 1.0).s(62.5, 1.06, 3.2, "out");
  });
  plano("15-espelho", 62.50, 63.22, [["chime", 62.52, .8], ["pop", 62.6, .5]], (S, c) => {
    const { esp } = espelho(S, "x-bolso", "left:160px;top:260px;width:500px;opacity:0");
    const br = h("div", "abs", esp, null, `left:80px;top:120px;width:60px;height:700px;background:rgba(255,255,255,.7);border-radius:30px;transform:rotate(18deg)`);
    anim(br, [[62.5, { y: -400, o: 0 }], [62.54, { o: 1 }, "lin"], [63.1, { y: 500 }, "out"]]);
    c.origem(540, 900).s(62.5, 1.05);
  });

  /* ================= 16 · a pose ================= */
  plano("16-cabelo", 63.22, 64.56, [["swoosh", 63.96, 1], ["flip", 64.1, .6]], (S, c) => {
    const { j } = espelho(S, "x-cabelo", "left:-380px;top:-60px;width:1500px");
    ono(c.fixo, "SWISH!", 760, 620, 63.96, { r: 8, px: 110 });
    c.origem(540, 700).s(63.22, 1.0).soco(63.94, .05);
  });
  plano("16-bolso", 64.56, 66.18, [["pop", 65.2, .8], ["swoosh", 64.6, .4], ["tick", 65.6, .5]], (S, c) => {
    const { j } = espelho(S, "x-bolso", "left:-420px;top:-720px;width:1600px");
    anim(j, [[64.56, { y: -20 }], [65.18, { y: 0 }, "out"]]);
    c.origem(540, 1100).s(64.56, 1.0).s(66.18, 1.06, 1.6, "out");
  });
  plano("16-pose", 66.18, 66.82, [["click", 66.2, 1], ["chime", 66.24, .8], ["pop", 66.3, .5]], (S, c) => {
    const { j } = espelho(S, "x-bolso", "left:150px;top:240px;width:520px");
    const flash = h("div", "layer", S, null, "background:#fff"); anim(flash, [[66.18, { o: 1 }], [66.38, { o: 0 }, "out"]]);
    brilhos(c.fixo, [[220, 420, 70], [380, 640, 90], [700, 420, 70], [860, 640, 90], [540, 300, 80]], 66.2, .04);
    c.origem(540, 900).s(66.18, 1.08).soco(66.2, .05);
  });

  /* ================= 17 · impressionado ================= */
  plano("17-uau", 66.82, 69.26, [["swoosh", 66.84, .5], ["boom", 68.3, 1], ["chime", 68.36, .7], ["pop", 68.5, .5]], (S, c) => {
    raios(S, OURO, "#D9B848", 8);
    const j = close(S, "x-uau"); respira(j);
    ono(c.fixo, "UAU!", 540, 520, 68.28, { r: -8, px: 200 });
    brilhos(c.fixo, [[200, 760, 70], [880, 760, 70], [240, 1000, 60], [840, 1000, 60]], 68.3, .05);
    c.origem(540, 900).s(66.82, 1.08).s(68.28, 1.2).tremor(68.3, 12, .3);
  });

  /* ================= 18 · foto e post ================= */
  plano("18-selfie", 69.26, 70.42, [["swoosh", 69.28, .4], ["click", 69.94, 1], ["pop", 70.0, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(5px)");
    const j = img(S, "x-selfie", "left:120px;top:400px;width:840px"); respira(j, .006);
    const flash = h("div", "layer", S, null, "background:#fff"); anim(flash, [[69.92, { o: 0 }], [69.93, { o: 1 }, "lin"], [70.15, { o: 0 }, "out"]]);
    ono(c.fixo, "CLICK!", 300, 560, 69.94, { r: -8, px: 100 });
    c.origem(540, 800).s(69.26, 1.0).soco(69.92, .05);
  });
  const post = (tela, { cur = () => 0, coments = [] } = {}) => {
    h("div", "abs", tela, null, `inset:0;background:#fff`);
    h("div", "abs", tela, `<div style="width:60px;height:60px;border-radius:50%;border:4px solid ${AM};background:url(${MDS.img("x-convencido")}) 50% 20%/220% auto"></div><b style="font:800 28px var(--v-display);color:${AM}">juninho</b>`, `left:24px;top:70px;display:flex;gap:16px;align-items:center`);
    const foto = h("div", "abs", tela, null, `left:0;right:0;top:160px;height:560px;background:${MUST} url(${MDS.img("x-selfie")}) 50% 8%/120% auto no-repeat;border-top:4px solid ${AM};border-bottom:4px solid ${AM}`);
    const lk = h("div", "abs", tela, "", `left:24px;top:740px;font:900 40px var(--v-display);color:${VERM}`);
    fx(t => lk.textContent = "♥ " + cur(t));
    return { foto };
  };
  plano("18-post", 70.42, 71.66, [["send", 70.44, 1], ["swoosh", 70.6, .5], ["ding", 71.1, .6]], (S, c) => {
    const tela = celular(S);
    const { foto } = post(tela);
    const barra = h("div", "abs", tela, null, `left:24px;right:24px;top:820px;height:24px;border-radius:12px;background:#eee;border:4px solid ${AM};overflow:hidden`);
    const b = h("div", "", barra, null, `height:100%;background:${VERDE}`); fx(t => b.style.width = (prog(t, 70.44, 71.1, "out") * 100) + "%");
    placa(c.fixo, "POSTANDO…", 540, 300, 70.46, { px: 54, cor: AM, ate: 71.1 }); placa(c.fixo, "POSTADO ✓", 540, 300, 71.12, { px: 54, cor: VERDE });
    c.origem(540, 600).s(70.42, 1.0);
  });

  /* ================= 19–20 · comentários e celebridade ================= */
  plano("19-comentarios", 71.66, 74.26, [...Array.from({ length: 10 }, (_, i) => ["blip", 71.8 + i * .2, .5]), ["ding", 73.46, .7], ["ding", 73.7, .6], ["ding", 73.94, .6]], (S, c) => {
    const tela = celular(S);
    post(tela, { cur: t => Math.round(1 + 99 * prog(t, 71.8, 73.8, "in")) });
    for (let i = 0; i < 9; i++) { const e = h("div", "ono", c.fixo, "♥", `left:${300 + (i * 97) % 480}px;top:1300px;font-size:${70 + (i % 3) * 20}px;color:${VERM};-webkit-text-stroke:7px ${AM}`);
      anim(e, [[71.8 + i * .18, { o: 0, y: 0, s: .4 }], [71.9 + i * .18, { o: 1, s: 1 }, "back"], [73.2 + i * .18, { y: -800, o: .9 }, "out"]]); }
    ["que isso!! 🔥", "tá diferente hein", "QUEM É ESSE?", "estiloso 😎"].forEach((m, i) => { const e = h("div", "abs", tela, m, `left:24px;top:${880 + i * 64}px;font:700 26px var(--v-sans);color:${AM}`); pop(e, 73.44 + i * .24, { s0: .5 }); });
    c.origem(540, 800).s(71.66, 1.0).s(73.44, 1.18);
  });
  plano("20-celebridade", 74.26, 77.42, [["key", 74.6, .5], ["key", 74.75, .5], ["key", 74.9, .5], ["key", 75.05, .5], ["key", 75.2, .5], ["key", 75.4, .5], ["key", 75.6, .5], ["key", 75.8, .5], ["click", 76.5, .9], ["click", 76.62, .9], ["click", 76.74, .9], ["click", 76.86, .9], ["chime", 76.9, .6]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${AM}`);
    const foto = h("div", "abs", S, null, `left:290px;top:250px;width:500px;height:380px;border-radius:26px;border:10px solid #fff;background:${MUST} url(${MDS.img("x-selfie")}) 50% 8%/130% auto no-repeat;rotate:-4deg`); pop(foto, 74.28, { s0: .4 });
    const card = h("div", "abs", S, null, `left:80px;top:700px;width:920px;padding:44px;background:#fff;border:10px solid ${AM};border-radius:36px;box-shadow:0 14px 0 rgba(0,0,0,.3)`);
    h("div", "", card, `<b style="font:900 40px var(--v-display);color:${PETRO}">amigo</b>`, `margin-bottom:16px`);
    const txt = h("div", "", card, "", `font:800 70px/1.15 var(--v-display);color:${AM}`);
    const pal = [["Olha", 75.22], ["só,", 75.42], ["o", 75.92], ["homem", 75.94], ["está", 76.08], ["virando", 76.2], ["celebridade!", 76.48]];
    let last = -1; fx(t => { const n = pal.filter(p => t >= p[1] - .02).length; if (n !== last) { txt.innerHTML = pal.slice(0, n).map(p => p[0]).join(" ").replace("celebridade!", `<span style="color:${OURO}">celebridade!</span>`) || "…"; last = n; } });
    pop(card, 74.3, { s0: .5 });
    for (let i = 0; i < 4; i++) { const f = h("div", "layer", S, null, `background:radial-gradient(circle at ${[20, 80, 30, 70][i]}% ${[25, 30, 80, 75][i]}%,rgba(255,255,255,.95),transparent 30%)`);
      anim(f, [[76.48 + i * .12, { o: 0 }], [76.49 + i * .12, { o: 1 }, "lin"], [76.62 + i * .12, { o: 0 }, "out"]]); }
    brilhos(c.fixo, [[160, 440, 80], [920, 420, 70], [200, 1500, 70], [880, 1480, 80]], 76.5, .06, MUST);
    c.origem(540, 800).s(74.26, 1.0).s(77.42, 1.08, 3.1, "out");
  });

  /* ================= 21 · convencido ================= */
  plano("21-coroa", 77.42, 79.30, [["swoosh", 77.44, .4], ["pop", 78.08, 1], ["chime", 78.5, .7]], (S, c) => {
    raios(S, OURO, "#D9B848", 5);
    const j1 = close(S, "x-convencido"), j2 = close(S, "x-coroa"); respira(j1); respira(j2); troca([j1, j2], [77.42, 78.06]);
    const cr = h("div", "ono", c.fixo, "👑", `left:600px;top:380px;font-size:200px;-webkit-text-stroke:0;translate:-50% -50%`);
    anim(cr, [[77.6, { o: 0, y: -600 }], [77.62, { o: 1 }, "lin"], [78.06, { y: 0 }, "in"], [78.08, { o: 0 }, "lin"]]);
    c.origem(540, 900).s(77.42, 1.1).soco(78.06, .05);
  });

  /* ================= 22 · controlar os gastos ================= */
  plano("22-app", 79.30, 83.90, [["click", 80.0, 1], ["blip", 80.2, .5], ["swoosh", 80.4, .5], ["pop", 80.6, .4], ["boom", 82.72, .9]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: () => 113.60 });
    const cr = h("div", "ono", c.fixo, "👑", `left:540px;top:180px;font-size:160px;-webkit-text-stroke:0;translate:-50% -50%`);
    anim(cr, [[79.3, { o: 1, y: 0, r: 0 }], [80.0, { o: 1, y: 0, r: 0 }], [80.7, { y: 1900, r: 200 }, "in"]]);
    placa(c.fixo, "CONTROLE!", 540, 1200, 82.7, { px: 90, cor: VERM, r: -4 });
    c.origem(540, 560).s(79.3, 1.0).tremor(82.72, 12, .3);
  });

  /* ================= 23 · R$ 113,60 ================= */
  plano("23-saldo", 83.90, 87.24, [...Array.from({ length: 5 }, (_, i) => ["tick", 84.6 + i * .06, .5]), ["ding", 84.96, .55], ["coin", 85.0, .6], ["pop", 86.3, .4]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 113.60 * prog(t, 84.6, 84.94, "out") });
    c.origem(540, 470).s(83.9, 1.2).s(84.94, 1.5);
  });
  plano("23-porquinho", 87.24, 90.12, [["pop", 87.3, .7], ["flip", 87.8, .5], ["glitch", 89.18, .8], ["hit", 89.2, .5], ["coin", 89.4, .5]], (S, c) => {
    raios(S, "#FFB3C1", "#FFC8D3", 4);
    const p = h("div", "abs", S, `<div style="font-size:300px;line-height:1">🐷</div>`, `left:540px;top:900px;translate:-50% -50%;width:560px;height:560px;border-radius:50%;background:#FFB3C1;border:14px solid ${AM};display:flex;align-items:center;justify-content:center`);
    pop(p, 87.26, { s0: .3 }); fx(t => p.style.rotate = t > 87.76 ? (Math.sin((t - 87.76) * 10) * 8 * Math.max(0, 1 - (t - 87.76) / 1.2)).toFixed(1) + "deg" : "0deg");
    const sv = svg(c.fixo, 1080, 1920, "position:absolute;left:0;top:0");
    draw(path(sv, "M640 650L600 760L660 820L610 940", { stroke: AM, "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }), 89.16, 89.3, "out");
    placa(c.fixo, "QUASE QUEBRADO", 540, 1300, 89.2, { px: 64, cor: AM, r: -4 });
    c.origem(540, 900).s(87.24, 1.0).tremor(89.2, 10, .3);
  });

  /* ================= 24 · mais uma etapa ================= */
  plano("24-checklist", 90.12, 93.04, [["swoosh", 90.14, .5], ["pop", 90.4, .4], ["tick", 91.9, 1], ["chime", 92.0, .9]], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const L = h("div", "abs", S, null, `left:140px;top:420px;width:800px;padding:40px 50px;background:${CREME};border:10px solid ${AM};border-radius:30px;box-shadow:0 16px 0 ${AM}`);
    h("div", "", L, "TRANSFORMAÇÃO", `font:900 64px var(--v-display);color:${AM};margin-bottom:20px;letter-spacing:-.02em`);
    [["ROUPA", 1, 0], ["ACESSÓRIOS", 2, 91.86], ["CABELO", 0], ["???", 0], ["???", 0]].forEach(([n, ok, t]) => {
      const box = h("div", "", L, null, `margin:16px 0;display:flex;align-items:center;gap:24px`);
      const ck = h("span", "", box, "", `display:inline-block;width:70px;height:70px;border-radius:14px;border:7px solid ${AM};background:${ok === 1 ? VERDE : "#fff"};color:#fff;font:900 56px/58px var(--v-display);text-align:center`);
      const tx = h("span", "", box, n, `font:900 56px var(--v-display);color:${ok === 1 ? VERDE : AM}`);
      if (ok === 1) ck.textContent = "✓";
      if (ok === 2) at(t, on => { ck.textContent = on ? "✓" : ""; ck.style.background = on ? VERDE : "#fff"; tx.style.color = on ? OURO : AM; });
    });
    pop(L, 90.14, { s0: .5 });
    c.origem(540, 800).s(90.12, 1.0).soco(91.86, .05).s(93.04, 1.06, 1.1, "out");
  });
  plano("24-dias", 93.04, 95.50, [["hit", 94.72, .8], ["pop", 93.1, .5]], (S, c) => {
    raios(S, AM, "#3A2860", 4);
    const p = h("div", "abs", S, `<small style="display:block;font:800 40px var(--v-sans);letter-spacing:.1em;color:${MUST}">FALTAM</small><b style="font:900 160px/1 var(--v-display);color:#fff">27 DIAS</b>`, `left:540px;top:900px;translate:-50% -50%;padding:40px 60px;background:${AM};border:12px solid #fff;border-radius:40px;text-align:center;white-space:nowrap`);
    pop(p, 93.06, { s0: .4 });
    fx(t => p.style.scale = t > 94.7 ? (1 + Math.max(0, Math.sin((t - 94.7) * 8)) * .08).toFixed(3) : "1");
    comentarios(S, ["ainda dá tempo", "vai juninho!!", "falta o cabelo kkk"], 93.4, .3, 1560, 1100);
    c.tremor(94.72, 10, .25);
  });

  /* ================= 25 · votação ================= */
  plano("25-votacao", 95.50, 99.98, [["hit", 95.56, .7], ["boom", 96.4, 1], ["blip", 97.0, .5], ["blip", 97.3, .5], ["blip", 97.6, .5], ["blip", 97.9, .5], ["flip", 99.36, .8], ["pop", 99.4, .6]], (S, c) => {
    raios(S, CORAL, "#FF845F", 8);
    const pl = h("div", "abs", S, `VOTAÇÃO`, `left:540px;top:700px;translate:-50% -50%;padding:40px 70px;background:${AM};border:12px solid #fff;border-radius:36px;font:900 150px var(--v-display);color:#fff;box-shadow:0 20px 0 rgba(0,0,0,.3)`);
    bate(pl, 95.54, 2.5, -4); pl.style.rotate = "-4deg";
    const j = img(S, "x-bolso", "left:330px;top:960px;width:420px"); pop(j, 96.0, { s0: .4 }); respira(j, .006);
    const q = h("div", "ono", c.fixo, "?", `left:760px;top:1000px;font-size:240px;translate:-50% -50%`);
    anim(q, [[99.34, { o: 0, s: 0, r: -360 }], [99.35, { o: 1 }, "lin"], [99.7, { s: 1, r: 0 }, "back"]]);
    comentarios(S, ["tênis!!", "boné kkk", "TÊNIS", "o boné"], 97.0, .3, 1470, 300);
    c.origem(540, 900).s(95.5, 1.0).tremor(95.56, 14, .3).soco(96.38, .06).s(99.98, 1.06, 3.5, "out");
  });

  /* ================= 26–27 · tênis × boné + comenta ================= */
  plano("26-tenis-bone", 99.98, 105.84, [["swoosh", 100.0, .7], ["hit", 100.12, .7], ["chime", 100.4, .6], ["flip", 101.24, .8], ["hit", 101.64, .7], ["pop", 101.8, .5], ["whoosh", 103.08, .8], ["blip", 103.66, .6], ["blip", 103.9, .5], ["blip", 104.16, .6], ["blip", 104.4, .5], ["blip", 104.7, .5], ["blip", 105.0, .5]], (S, c) => {
    const esq = h("div", "abs", S, null, `inset:0;background:${CORAL};clip-path:polygon(0 0,62% 0,38% 100%,0 100%)`);
    const dir = h("div", "abs", S, null, `inset:0;background:${PETRO};clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%)`);
    anim(esq, [[99.98, { x: -700 }], [100.24, { x: 0 }, "expo"]]); anim(dir, [[99.98, { x: 700 }], [100.24, { x: 0 }, "expo"]]);
    const l1 = img(S, "v-tenis", "left:20px;top:760px;width:440px"), l2 = img(S, "v-bone", "left:620px;top:760px;width:440px");
    pop(l1, 100.1, { s0: .4 }); pop(l2, 101.62, { s0: .4 }); respira(l1, .006); respira(l2, .006, 2.2, 1.3);
    brilhos(S, [[90, 1440, 60], [380, 1460, 50], [200, 1420, 50]], 100.4, .08);
    const T = (txt, x, y, t, cor) => { const e = h("div", "ono", S, txt, `left:${x}px;top:${y}px;font-size:80px;color:${cor};translate:-50% -50%;text-align:center;line-height:1`); pop(e, t, { s0: .3 }); };
    T("TÊNIS<br>BRANCO", 250, 600, 100.1, "#fff"); T("BONÉ", 830, 620, 101.62, MUST);
    const ou = h("div", "abs", S, "OU", `left:540px;top:1000px;translate:-50% -50%;width:170px;height:170px;border-radius:50%;background:#fff;border:10px solid ${AM};font:900 74px/150px var(--v-display);color:${AM};text-align:center`);
    anim(ou, [[101.2, { o: 0, s: 0, r: -180 }], [101.22, { o: 1 }, "lin"], [101.6, { s: 1, r: 0 }, "back"]]);
    const fx1 = h("div", "abs", c.fixo, `COMENTE: <span style="color:${MUST}">TÊNIS</span> OU <span style="color:#7FE0D0">BONÉ</span>`, `left:-20px;right:-20px;top:240px;padding:26px 0;background:${AM};border-top:8px solid #fff;border-bottom:8px solid #fff;text-align:center;font:900 70px var(--v-display);color:#fff;transform:rotate(-3deg)`);
    anim(fx1, [[103.05, { o: 0, y: -400 }], [103.06, { o: 1 }, "lin"], [103.4, { y: 0 }, "back"]]);
    comentarios(c.fixo, ["TÊNIS!", "boné boné", "o tênis branco", "BONÉ 🧢", "tênis kkk"], 103.6, .25, 1560, 1000);
    c.origem(540, 960).s(99.98, 1.08).s(100.4, 1.0, .4, "out").soco(101.62, .04).s(105.84, 1.06, 2.2, "out");
  });
  plano("27-final", 105.84, 111.5, [["boom", 106.42, 1], ["riser", 106.6, .5], ["flip", 107.54, 1], ["chime", 108.0, .8], ["swell", 109, .4], ["pop", 108.3, .4]], (S, c) => {
    raios(S, AM, "#3A2860", 4);
    const p = h("div", "abs", S, `<small style="display:block;font:800 40px var(--v-sans);letter-spacing:.1em;color:${MUST}">FALTAM</small><b style="font:900 160px/1 var(--v-display);color:#fff">27 DIAS</b>`, `left:540px;top:900px;translate:-50% -50%;padding:40px 60px;background:${AM};border:12px solid #fff;border-radius:40px;text-align:center;white-space:nowrap`);
    anim(p, [[105.839, { o: 0, s: 2.2 }], [105.84, { o: 1 }, "lin"], [105.98, { s: 1 }, "in"], [106.42, { s: 1.12 }, "out"], [106.64, { s: 1 }, "out"], [107.52, { o: 1 }], [107.58, { o: 0 }, "lin"]]);
    const carta = h("div", "abs", S, null, `left:190px;top:420px;width:700px;height:980px;transform-style:preserve-3d`);
    h("div", "abs", carta, `<div style="font:800 40px var(--v-sans);letter-spacing:.12em;color:${AM}">EPISÓDIO</div><div style="font:900 300px/1 var(--v-display);color:#fff;-webkit-text-stroke:14px ${AM};paint-order:stroke fill">4</div><div style="font:900 64px/1.05 var(--v-display);color:${AM};margin-top:30px">VOCÊS<br>DECIDEM</div>`,
      `inset:0;border-radius:44px;background:${OURO};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 24px 0 rgba(0,0,0,.3)`);
    anim(carta, [[107.52, { o: 0, ry: -180, s: .6 }], [107.56, { o: 1 }, "lin"], [108.2, { ry: 0, s: 1 }, "back"]]);
    particulas(S, { n: 30, t0: 107.9, x: 540, y: 300, cores: [CORAL, MUST, VERDE, "#fff"], tam: [16, 30], vx: [-700, 700], vy: [-600, 0], g: 1200, forma: "conf", dur: 2.5 });
    c.origem(540, 900).s(105.84, 1.0).tremor(106.42, 14, .3).s(111.5, 1.08, 3.9, "out");
  });
})();
