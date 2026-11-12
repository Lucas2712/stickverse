/* Juninho · Episódio 4 — modo cartoon narrativo (referencias/modo-cartoon-narrativo.md, seção 4: série)
 * Mesma série do ep. 1 (personagem, casa, legenda, painel, traço); tênis branco e destaque azul-céu.
 * Narração acelerada a pedido (83,0 → 65,8 s, mesmos parâmetros do ep. 2). Sem música; ~2 efeitos/s.
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
  const SALDO = t => 113.60 + 50 * prog(t, 21.06, 21.7, "out") - 119.90 * prog(t, 34.56, 35.1, "out");
  const NIVEL = [[0, .62], [40.84, .62], [41.3, .8], [43.38, .8], [43.7, .7], [48.68, .7], [49.0, .58]];
  const nivel = t => { let v = NIVEL[0][1]; for (let i = 1; i < NIVEL.length; i++) { const [a, va] = NIVEL[i - 1], [b, vb] = NIVEL[i]; if (t >= b) v = vb; else if (t > a) { v = va + (vb - va) * prog(t, a, b, "out"); break; } } return v; };
  const HUD_ON = [[0.78, 6.94], [10.36, 21.50], [24.42, 33.80], [35.16, 46.12], [52.24, 53.90]];
  cena({ id: "painel", nome: "Painel da série", inicio: .7, fim: 56, margem: 0, z: 900, montar(S) {
    const box = h("div", "abs", S, null, `left:40px;top:232px;display:flex;gap:12px;align-items:stretch;scale:1.3;transform-origin:0 0`);
    const pill = (html, w) => h("div", "", box, html, `background:${AM};border:5px solid #fff;border-radius:18px;padding:10px 18px 12px;box-shadow:0 6px 0 rgba(0,0,0,.35);${w ? "width:" + w + "px" : ""}`);
    pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">FALTAM</small><b style="font:900 42px/1 var(--v-display);color:#fff">26 DIAS</b>`);
    const sp = pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">SALDO</small><b style="font:900 42px/1 var(--v-display);color:#fff;white-space:nowrap"></b>`);
    const sv = sp.querySelector("b"); let last = "";
    fx(t => { const s = brl(SALDO(t)); if (s !== last) { sv.textContent = s; last = s; } sv.style.color = t >= 21.06 && t < 22.2 ? (Math.floor(t * 8) % 2 ? VERDE : "#fff") : t >= 34.56 && t < 35.8 ? (Math.floor(t * 8) % 2 ? VERM : "#fff") : "#fff"; });
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

  const CEU = "#6EC6E6";
  const maquininha = (S, valor, t) => {
    const maq = h("div", "abs", S, null, `left:300px;top:700px;width:480px;height:760px;background:#2E2E3A;border:12px solid #fff;border-radius:50px`);
    h("div", "abs", maq, valor, `left:40px;top:60px;right:40px;height:200px;background:#9FE3B8;border:8px solid ${AM};border-radius:20px;font:900 62px/184px var(--v-display);color:${AM};text-align:center`);
    for (let i = 0; i < 12; i++) h("div", "abs", maq, null, `left:${50 + (i % 3) * 130}px;top:${310 + Math.floor(i / 3) * 100}px;width:100px;height:72px;border-radius:16px;background:${i === 11 ? VERDE : "#4A4A5A"};border:5px solid ${AM}`);
    pop(maq, t, { s0: .5 }); return maq;
  };

  /* ================= 1 · vocês escolheram tênis ================= */
  plano("01-escolheram", 0, 0.78, [["boom", 0.02, .8], ["blip", .2, .5], ["blip", .34, .5], ["blip", .48, .5], ["blip", .62, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(4px)");
    h("div", "layer", S, null, "background:rgba(42,27,71,.25)");
    placa(c.fixo, "VOCÊS ESCOLHERAM", 540, 560, .02, { px: 80, cor: MUST, txtCor: AM, r: -3 });
    comentarios(S, ["TÊNIS!", "tênis branco", "tênis sim", "TÊNIS 👟"], .2, .14);
    c.origem(540, 900).s(0, 1.05).s(.78, 1.1, .78, "out");
  });
  plano("01-tenis", 0.78, 1.54, [["hit", .8, 1], ["chime", .9, .7], ["pop", 1.0, .5]], (S, c) => {
    raios(S, CEU, "#8FD5EE", 6);
    const t = img(S, "tenis", "left:40px;top:640px;width:1000px"); bate(t, .78, 1.8, -6);
    brilhos(c.fixo, [[200, 600, 80], [880, 620, 70], [540, 1240, 90]], .9);
    carimbo(c.fixo, "TÊNIS ✓", 540, 1180, .8, { r: -8, px: 110 });
    c.tremor(.8, 12, .3);
  });

  /* ================= 2 · completar o visual ================= */
  plano("02-decidiu", 1.54, 3.02, [["swoosh", 1.56, .5], ["pop", 2.4, .5]], (S, c) => {
    fundo(S); const j = close(S, "x-convencido"); respira(j);
    c.origem(540, 900).s(1.54, 1.08).s(3.02, 1.16, 1.48, "out");
  });
  plano("02-pes", 3.02, 5.18, [["whoosh", 3.04, .6], ["pop", 3.3, .7], ["glitch", 4.3, .5], ["pop", 4.56, .6]], (S, c) => {
    fundo(S);
    const j = img(S, "x-bolso", "left:-200px;top:-880px;width:1500px"); respira(j, .005);
    const sv = svg(c.fixo, 1080, 1920, "position:absolute;left:0;top:0");
    draw(path(sv, "M880 760C840 980 760 1160 640 1300", { stroke: MUST, "stroke-width": 24, "stroke-linecap": "round", fill: "none" }), 3.3, 3.6, "out");
    draw(path(sv, "M640 1300l90 -20M640 1300l10 -90", { stroke: MUST, "stroke-width": 24, "stroke-linecap": "round", fill: "none" }), 3.58, 3.68);
    placa(c.fixo, "TÊNIS VELHO", 820, 640, 3.3, { px: 60, cor: VERM, r: 4 });
    const q = h("div", "abs", c.fixo, "?", `left:540px;top:1020px;translate:-50% -50%;width:200px;height:200px;border-radius:50%;background:#fff;border:10px dashed ${AM};font:900 140px/180px var(--v-display);color:${AM};text-align:center`);
    pop(q, 4.34, { s0: .2 });
    c.origem(540, 1200).s(3.02, 1.0).s(5.18, 1.08, 2.1, "out");
  });

  /* ================= 3 · problema + saldo ================= */
  plano("03-problema", 5.18, 6.94, [["swoosh", 5.2, .5], ["swoosh", 5.45, .5], ["pop", 5.8, .5], ["boom", 6.38, .9]], (S, c) => {
    placaProblema(S, 5.18, 6.34);
    c.tremor(6.36, 18, .35);
  });
  plano("03-saldo", 6.94, 10.36, [["click", 6.96, .8], ...Array.from({ length: 5 }, (_, i) => ["tick", 7.42 + i * .07, .5]), ["ding", 7.84, .55], ["coin", 8.2, .7], ["glitch", 9.74, .4]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 113.60 * prog(t, 7.42, 7.82, "out") });
    placa(c.fixo, "SÓ ISSO", 540, 1180, 9.72, { px: 70, cor: VERM, r: -5 });
    c.origem(540, 560).s(6.94, 1.08).s(7.82, 1.4);
  });

  /* ================= 4 · turno extra ================= */
  plano("04-turno", 10.36, 11.94, [["swoosh", 10.38, .5], ["pop", 11.3, .8], ["pop", 11.55, .5]], (S, c) => {
    fundo(S, "lanchonete");
    const d = img(S, "dono-relogio", "left:-40px;top:560px;width:1140px"); respira(d, .006);
    const bal = h("div", "abs", c.fixo, "TURNO EXTRA<br>DE NOVO?", `left:700px;top:520px;translate:-50% -50%;padding:24px 40px;background:#fff;border:9px solid ${AM};border-radius:40px;font:900 64px/1 var(--v-display);color:${AM};text-align:center;box-shadow:0 10px 0 ${AM}`);
    pop(bal, 11.28, { s0: .2, r0: 10 });
    c.origem(400, 900).s(10.36, 1.0).s(11.94, 1.05, 1.58, "out");
  });
  plano("04-lanchonete", 11.94, 13.26, [["ding", 11.96, .5], ["whoosh", 12.1, .6], ["pop", 12.5, .4]], (S, c) => {
    full(S, "lanchonete");
    const j = img(S, "a-bandeja", "left:520px;top:700px;width:520px;clip-path:inset(0 0 40% 0)");
    anim(j, [[11.94, { x: 700 }], [12.4, { x: 0 }, "out"]]);
    c.origem(540, 1000).s(11.94, 1.0).s(13.26, 1.06, 1.3, "out");
  });

  /* ================= 5 · movimento enorme ================= */
  plano("05-movimento", 13.26, 14.96, [["swoosh", 13.28, .5], ...Array.from({ length: 6 }, (_, i) => ["pop", 13.5 + i * .12, .5]), ["boom", 14.06, .8]], (S, c) => {
    full(S, "clientes", "transform:scale(1.15);transform-origin:50% 0");
    ["!", "!!", "?!", "!", "!!", "?"].forEach((m, i) => { const e = h("div", "ono", c.fixo, m, `left:${150 + i * 160}px;top:${560 + (i % 2) * 120}px;font-size:120px;color:${VERM};translate:-50% -50%`); pop(e, 13.5 + i * .12, { r0: (i % 2 ? 1 : -1) * 30 }); });
    placa(c.fixo, "FILA ENORME!", 540, 1080, 14.04, { px: 80, cor: AM, r: -4 });
    c.origem(540, 800).s(13.26, 1.0).tremor(14.06, 14, .3);
  });

  /* ================= 6 · montagem do trabalho ================= */
  plano("06-montagem", 14.96, 19.02, [["whoosh", 15.24, .6], ["key", 15.5, .5], ["key", 15.6, .5], ["key", 15.7, .5], ["whoosh", 16.22, .7], ["hit", 16.5, .4], ["glitch", 17.14, .4], ...Array.from({ length: 8 }, (_, i) => ["pop", 17.5 + i * .1, .35]), ["boom", 18.3, .7]], (S, c) => {
    fundo(S, "lanchonete");
    const q = [["a-anota", 15.22], ["a-bandeja", 16.2], ["a-pensa", 17.12]];
    const els = q.map(([n], i) => img(S, n, `left:${i === 1 ? 120 : 180}px;top:${i === 2 ? 260 : 380}px;width:${i === 1 ? 840 : i === 2 ? 900 : 720}px`));
    els.unshift(img(S, "x-bolso", "left:300px;top:500px;width:480px")); troca(els, [14.96, ...q.map(x => x[1])]);
    for (let i = 0; i < 8; i++) { const g = h("div", "abs", c.fixo, null, `left:${260 + i * 80}px;top:520px;width:46px;height:64px;background:#7DC9F2;border:6px solid ${AM};border-radius:50% 50% 50% 50% / 60% 60% 40% 40%`);
      anim(g, [[17.5 + i * .1, { o: 0, y: 0 }], [17.51 + i * .1, { o: 1 }, "lin"], [18.9, { y: -240, x: (i - 3.5) * 40 }, "out"]]); }
    ono(c.fixo, "UFA…", 540, 1520, 18.26, { r: -5, px: 110, cor: "#fff" });
    c.origem(540, 900).s(14.96, 1.0).soco(15.22, .04).soco(16.2, .04).soco(17.12, .04).s(19.02, 1.08, 1.6, "out");
  });

  /* ================= 7 · + R$ 50 ================= */
  plano("07-valeu", 19.02, 20.72, [["chime", 19.5, .8], ["coin", 19.52, .7], ["pop", 19.7, .5]], (S, c) => {
    raios(S, VERDE, "#3FCB88", 6);
    const j = close(S, "x-cifrao"); respira(j);
    ono(c.fixo, "VALEU!", 820, 520, 19.48, { r: 10, px: 120 });
    c.origem(540, 800).s(19.02, 1.08).soco(19.48, .07);
  });
  plano("07-notas", 20.72, 22.54, [["coin", 20.74, 1], ["pop", 20.8, .6], ["pop", 20.95, .6], ["coin", 21.1, .6], ["whoosh", 21.08, .8], ["chime", 21.5, .6]], (S, c) => {
    raios(S, VERDE, "#3FCB88", 5);
    h("div", "abs", S, null, `left:300px;top:1180px;width:480px;height:260px;border-radius:130px 130px 60px 60px;background:#F6C6A8;border:10px solid ${AM}`);
    for (let i = 0; i < 1; i++) { const n = h("div", "abs", S, "R$ 50", `left:330px;top:900px;width:420px;height:200px;border-radius:16px;background:${VERDE};border:8px solid ${AM};font:900 70px/184px var(--v-display);color:${AM};text-align:center`);
      const t = 20.72 + i * .15; anim(n, [[t - .001, { o: 0, y: -900, r: -20 + i * 20 }], [t, { o: 1 }, "lin"], [t + .3, { y: 140 - i * 40, r: -6 + i * 8 }, "out"]]); }
    const mais = h("div", "ono", c.fixo, "+R$ 50", `left:540px;top:560px;font-size:150px;color:${VERDE};translate:-50% -50%`);
    anim(mais, [[20.74, { o: 0, s: .3 }], [20.76, { o: 1 }, "lin"], [20.98, { s: 1 }, "back"], [21.06, { x: 0, y: 0, s: 1 }], [21.5, { x: -160, y: -320, s: .3, o: 0 }, "in"]]);
    c.origem(540, 1100).s(20.72, 1.0).tremor(20.74, 6, .3);
  });
  plano("07-saldo", 22.54, 24.42, [["click", 22.56, .7], ...Array.from({ length: 5 }, (_, i) => ["tick", 22.6 + i * .06, .5]), ["ding", 22.96, .55], ["pop", 23.4, .5]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 113.60 + 50 * prog(t, 22.6, 22.94, "out") });
    placa(c.fixo, "+50 ✓", 540, 1180, 23.0, { px: 80, cor: VERDE, r: -4 });
    c.origem(540, 470).s(22.54, 1.5);
  });

  /* ================= 8 · tão sonhado ================= */
  plano("08-loja", 24.42, 26.50, [["swell", 24.44, .5], ["swoosh", 25.4, .6], ["pop", 25.7, .5]], (S, c) => {
    full(S, "loja-tenis");
    const j = img(S, "x-bolso", "left:600px;top:860px;width:440px"); respira(j, .006);
    anim(j, [[24.42, { x: 600 }], [25.36, { x: 600 }], [25.8, { x: 0 }, "out"]]);
    c.origem(540, 900).s(24.42, 1.0).s(26.5, 1.08, 2.08, "out");
  });
  plano("08-sonho", 26.50, 27.88, [["chime", 26.52, .9], ["pop", 26.6, .5], ["pop", 26.8, .5], ["pop", 27.0, .5], ["swell", 27.2, .4]], (S, c) => {
    raios(S, "#FFD6E0", "#FFE6EC", 4);
    const bal = h("div", "abs", S, null, `left:120px;top:440px;width:840px;height:700px;border-radius:50%;background:#fff;border:10px solid ${AM}`);
    pop(bal, 26.52, { s0: .3 });
    const t = img(S, "tenis", "left:180px;top:560px;width:720px"); pop(t, 26.6, { s0: .2 });
    for (let i = 0; i < 4; i++) { const e = h("div", "ono", c.fixo, "♥", `left:${220 + i * 210}px;top:${460 + (i % 2) * 560}px;font-size:90px;color:${CORAL};-webkit-text-stroke:8px ${AM};translate:-50% -50%`); pop(e, 26.6 + i * .12, { r0: -40 }); MDS.floaty(e, 12, 3, i); }
    c.origem(540, 900).s(26.5, 1.0).s(27.88, 1.08, 1.38, "out");
  });

  /* ================= 9 · R$ 119,90 ================= */
  plano("09-pedestal", 27.88, 31.20, [["riser", 27.9, .4], ["chime", 28.4, .8], ["pop", 28.6, .5], ["boom", 29.66, 1], ["glitch", 29.8, .4]], (S, c) => {
    full(S, "loja-tenis", "transform:scale(1.9);transform-origin:50% 66%;filter:brightness(.8)");
    const luz = h("div", "abs", S, null, `left:240px;top:0;width:600px;height:1700px;background:linear-gradient(180deg,rgba(255,240,190,.75),rgba(255,240,190,0));clip-path:polygon(35% 0,65% 0,100% 100%,0 100%)`);
    const t = img(S, "tenis", "left:140px;top:720px;width:800px"); pop(t, 27.9, { s0: .4 }); MDS.floaty(t, 14, 2);
    const et = h("div", "abs", c.fixo, "R$ 119,90", `left:540px;top:1180px;translate:-50% -50%;padding:24px 50px;background:${CREME};border:12px solid ${AM};border-radius:30px 90px 90px 30px;font:900 120px var(--v-display);color:${VERM};white-space:nowrap`);
    bate(et, 29.64, 2.4, -6); et.style.rotate = "-6deg";
    brilhos(c.fixo, [[240, 700, 70], [840, 720, 70], [540, 560, 90]], 28.4, .08);
    c.origem(540, 1000).s(27.88, 1.0).s(29.64, 1.12).tremor(29.66, 14, .35);
  });

  /* ================= 10 · olhou pro tênis, olhou pro preço ================= */
  plano("10-olhou", 31.20, 33.80, [["swoosh", 31.22, .6], ["pop", 31.66, .6], ["swoosh", 32.36, .6], ["glitch", 32.62, .5], ["swell", 33.14, .4]], (S, c) => {
    fundo(S, "loja-tenis");
    const j = close(S, "x-nervoso"); respira(j);
    const tL = img(c.fixo, "tenis", "left:20px;top:520px;width:460px");
    const et = h("div", "abs", c.fixo, "R$ 119,90", `left:800px;top:640px;translate:-50% -50%;padding:14px 30px;background:${CREME};border:8px solid ${AM};border-radius:20px 60px 60px 20px;font:900 60px var(--v-display);color:${VERM};white-space:nowrap`);
    pop(tL, 31.64, { s0: .2 }); pop(et, 32.6, { s0: .2 });
    fx(t => { j.style.translate = t < 32.34 ? "-30px 0" : t < 33.14 ? "30px 0" : "0 0"; j.style.scale = t >= 32.34 && t < 33.14 ? "-1 1" : "1 1"; });
    c.origem(540, 900).s(31.2, 1.1).s(33.14, 1.25);
  });

  /* ================= 11 · agora ou nunca ================= */
  plano("11-agora", 33.80, 35.16, [["boom", 33.82, 1], ["click", 34.58, 1], ["blip", 34.7, .6], ["chime", 34.9, .6], ["coin", 35.0, .5]], (S, c) => {
    raios(S, VERM, "#F2545F", 10);
    const j = close(S, "x-uau"); respira(j);
    const pl = h("div", "abs", c.fixo, "AGORA<br>OU NUNCA!", `left:540px;top:520px;translate:-50% -50%;padding:24px 44px;background:${AM};border:10px solid #fff;border-radius:26px;font:900 90px/1 var(--v-display);color:${MUST};text-align:center`);
    bate(pl, 33.82, 2.4, -5); pl.style.rotate = "-5deg";
    carimbo(c.fixo, "−R$ 119,90", 540, 1140, 34.56, { r: 6, px: 100 });
    c.origem(540, 900).s(33.8, 1.1).tremor(33.82, 16, .35).soco(34.56, .06);
  });

  /* ================= 12 · em casa: tênis, jaqueta, espelho ================= */
  plano("12-porta", 35.16, 36.28, [["hit", 35.6, .7], ["swoosh", 35.2, .4]], (S, c) => {
    full(S, "quarto-tarde");
    const porta = h("div", "abs", S, null, `left:-20px;top:0;width:560px;height:1920px;background:#8E5A36;border:14px solid ${AM};transform-origin:0 50%`);
    h("div", "abs", porta, null, `left:470px;top:960px;width:50px;height:50px;border-radius:50%;background:${MUST};border:6px solid ${AM}`);
    anim(porta, [[35.16, { ry: 0 }], [35.6, { ry: -82 }, "out"]]);
    ono(c.fixo, "BLAM!", 760, 560, 35.6, { r: 8, px: 130 });
    c.tremor(35.62, 10, .25);
  });
  plano("12-veste", 36.28, 39.14, [["click", 36.3, .9], ["click", 36.45, .9], ["pop", 36.6, .5], ["flip", 37.24, .9], ["swoosh", 37.4, .5], ["pop", 38.1, .4]], (S, c) => {
    raios(S, CEU, "#8FD5EE", 4);
    const t = img(S, "tenis", "left:90px;top:560px;width:900px"); pop(t, 36.28, { s0: 0, r0: -20 });
    const j = img(S, "p-jaqueta", "left:290px;top:980px;width:500px");
    anim(j, [[37.2, { o: 0, x: -900, r: -30 }], [37.22, { o: 1 }, "lin"], [37.46, { x: 0, r: 0 }, "out"]]);
    ono(c.fixo, "CLIC CLIC", 540, 430, 36.3, { r: -5, px: 90, ate: 37.1 }); ono(c.fixo, "FWIP!", 780, 1500, 37.24, { r: 6, px: 100 });
    c.origem(540, 900).s(36.28, 1.0).s(39.14, 1.06, 2.86, "out");
  });
  plano("12-espelho", 39.14, 39.82, [["chime", 39.16, .8], ["pop", 39.24, .5]], (S, c) => {
    const { esp } = espelho(S, "x-bolso", "left:160px;top:260px;width:500px;opacity:0");
    const br = h("div", "abs", esp, null, `left:80px;top:120px;width:60px;height:700px;background:rgba(255,255,255,.7);border-radius:30px;transform:rotate(18deg)`);
    anim(br, [[39.14, { y: -400, o: 0 }], [39.18, { o: 1 }, "lin"], [39.7, { y: 500 }, "out"]]);
    c.origem(540, 900).s(39.14, 1.05);
  });

  /* ================= 13 · volta, pose, modelo ================= */
  plano("13-volta", 39.82, 40.84, [["whoosh", 40.06, 1], ["swoosh", 40.3, .6]], (S, c) => {
    const { j } = espelho(S, "t-gira", "left:110px;top:260px;width:600px");
    j.style.transformOrigin = "50% 60%";
    anim(j, [[39.82, { ry: 0 }], [40.04, { ry: 0 }], [40.7, { ry: 360 }, "inOut"]]);
    const sv = svg(c.fixo, 1080, 1920, "position:absolute;left:0;top:0");
    draw(path(sv, "M300 1180C320 1320 760 1320 780 1180", { stroke: "#fff", "stroke-width": 16, "stroke-linecap": "round", fill: "none" }), 40.06, 40.4, "out");
    c.origem(540, 900).s(39.82, 1.0);
  });
  plano("13-pose", 40.84, 41.74, [["click", 40.86, 1], ["chime", 40.9, .8], ["pop", 41.0, .5]], (S, c) => {
    const { j } = espelho(S, "x-bolso", "left:150px;top:240px;width:520px");
    const flash = h("div", "layer", S, null, "background:#fff"); anim(flash, [[40.84, { o: 1 }], [41.04, { o: 0 }, "out"]]);
    brilhos(c.fixo, [[220, 420, 70], [380, 640, 90], [700, 420, 70], [860, 640, 90]], 40.86, .04);
    c.origem(540, 900).s(40.84, 1.08).soco(40.86, .05);
  });
  plano("13-modelo", 41.74, 42.84, [["whoosh", 41.76, .8], ["tick", 41.9, .5], ["tick", 42.15, .5], ["tick", 42.4, .5], ["tick", 42.65, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(3px)");
    h("div", "abs", S, null, `left:0;right:0;top:1500px;height:420px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)`);
    const j = img(S, "t-modelo", "left:380px;top:360px;width:400px");
    anim(j, [[41.74, { x: -620 }], [42.84, { x: 320 }, "lin"]]);
    fx(t => j.style.translate = `0 ${(Math.abs(Math.sin(t * 9)) * -14).toFixed(1)}px`);
    placa(c.fixo, "MODO DESFILE", 540, 520, 41.76, { px: 64, cor: AM, r: -3 });
  });

  /* ================= 14 · quase tropeçou ================= */
  plano("14-tropeca", 42.84, 44.72, [["swoosh", 42.86, .4], ["glitch", 43.4, .7], ["hit", 43.5, .9], ["pop", 43.7, .5], ["swoosh", 44.0, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(3px)");
    const tap = h("div", "abs", S, null, `left:120px;top:1320px;width:840px;height:220px;border-radius:50%;background:repeating-radial-gradient(ellipse,${CORAL} 0 30px,${MUST} 30px 60px);border:10px solid ${AM}`);
    const dobra = h("div", "abs", S, null, `left:620px;top:1300px;width:160px;height:90px;border-radius:50% 50% 0 0;background:${CORAL};border:10px solid ${AM};border-bottom:none`);
    const j = img(S, "t-tropeca", "left:220px;top:420px;width:640px");
    anim(j, [[42.84, { x: -300, r: 0 }], [43.36, { x: 0, r: 0 }, "out"], [43.6, { x: 40, r: 14 }, "out"], [44.2, { x: 20, r: 6 }, "elastic"]]);
    ono(c.fixo, "OPA!", 760, 500, 43.4, { r: 10, px: 160 });
    c.origem(540, 1100).s(42.84, 1.0).tremor(43.5, 18, .4);
  });

  /* ================= 15 · feliz ================= */
  plano("15-feliz", 44.72, 46.12, [["swoosh", 44.74, .4], ["chime", 45.54, .8], ["pop", 45.6, .5], ["pop", 45.8, .5]], (S, c) => {
    raios(S, MUST, "#FFE48A", 5);
    const j = close(S, "n-feliz"); respira(j);
    for (let i = 0; i < 5; i++) { const e = h("div", "ono", S, i % 2 ? "♥" : "✦", `left:${200 + i * 170}px;top:900px;font-size:${70 + (i % 2) * 30}px;color:${i % 2 ? CORAL : "#fff"};-webkit-text-stroke:8px ${AM}`);
      anim(e, [[45.5 + i * .08, { o: 0, y: 0, s: .4 }], [45.6 + i * .08, { o: 1, s: 1 }, "back"], [46.1, { y: -300, o: .9 }, "out"]]); }
    c.origem(540, 900).s(44.72, 1.08).s(46.12, 1.14, 1.4, "out");
  });

  /* ================= 16 · o susto ================= */
  plano("16-app", 46.12, 49.40, [["swoosh", 46.14, .5], ["click", 46.9, 1], ["blip", 47.1, .6], ["glitch", 48.7, 1], ["hit", 48.72, .7]], (S, c) => {
    const tela = celular(S);
    h("div", "abs", tela, null, `inset:0;background:linear-gradient(160deg,${VERDE},${PETRO})`);
    const app = h("div", "abs", tela, null, `inset:0`);
    appBanco(app, { valor: () => 163.60, cinza: 48.68 });
    anim(app, [[46.88, { o: 0, s: .3 }], [46.89, { o: 1 }, "lin"], [47.2, { s: 1 }, "out"]]);
    fx(t => S.parentNode.style.filter = t >= 48.68 ? "grayscale(1)" : "none");
    ono(c.fixo, "SUSTO!", 540, 1460, 48.7, { r: -4, px: 120, cor: "#fff" });
    c.origem(540, 560).s(46.12, 1.0).s(48.68, 1.2).tremor(48.7, 18, .45);
  });
  plano("16-saldo", 49.40, 52.24, [["riser", 49.42, .4], ...Array.from({ length: 6 }, (_, i) => ["tick", 50.04 + i * .05, .6]), ["boom", 50.4, .9], ["coin", 50.6, .4]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 163.60 - 119.90 * prog(t, 50.0, 50.36, "out") });
    carimbo(c.fixo, "SÓ ISSO?!", 540, 1150, 50.38, { r: -10, px: 120 });
    c.origem(540, 470).s(49.4, 1.5).tremor(50.4, 12, .3);
  });

  /* ================= 17 · bonito, mas falta ficar rico ================= */
  plano("17-respira", 52.24, 53.90, [["swell", 52.6, .8], ["swoosh", 53.0, .4]], (S, c) => {
    fundo(S);
    const j = close(S, "n-amarelo");
    anim(j, [[52.24, { sy: 1 }], [52.6, { sy: 1 }], [53.2, { sy: 1.06 }, "inOut"], [53.8, { sy: 1 }, "inOut"]]);
    ono(c.fixo, "HUUUFF…", 540, 520, 52.6, { r: -4, px: 110, cor: "#fff" });
    c.origem(540, 900).s(52.24, 1.1);
  });
  plano("17-bonito-rico", 53.90, 56.78, [["whoosh", 53.92, .6], ["chime", 54.62, 1], ["pop", 54.7, .6], ["pop", 54.32, .6], ["hit", 56.16, .9], ["glitch", 56.2, .4], ["pop", 56.3, .5]], (S, c) => {
    const L = h("div", "abs", S, null, `left:0;top:0;width:540px;height:1920px;background:${VERDE};border-right:10px solid ${AM}`);
    const R = h("div", "abs", S, null, `left:540px;top:0;width:540px;height:1920px;background:${VERM}`);
    anim(L, [[53.9, { x: -540 }], [54.1, { x: 0 }, "expo"]]); anim(R, [[56.0, { x: 540 }], [56.14, { x: 0 }, "expo"]]);
    const j = img(L, "t-modelo", "left:60px;top:560px;width:420px"); respira(j);
    placa(c.fixo, "BONITO ✓", 270, 560, 54.6, { px: 70, cor: AM });
    const cart = h("div", "abs", R, null, `left:120px;top:880px;width:300px;height:220px;background:#7A4A2B;border:10px solid ${AM};border-radius:30px`);
    const qq = h("div", "ono", S, "?", `left:810px;top:960px;font-size:260px;color:#fff;translate:-50% -50%`); anim(qq, [[54.3, { o: 0, s: 0 }], [54.31, { o: 1 }, "lin"], [54.6, { s: 1 }, "back"], [55.98, { o: 1 }], [56.0, { o: 0 }, "lin"]]);
    placa(c.fixo, "RICO ✗", 810, 560, 56.14, { px: 70, cor: AM });
    const mosca = h("div", "ono", R, "🦋", `left:270px;top:840px;font-size:110px;-webkit-text-stroke:0;translate:-50% -50%`);
    anim(mosca, [[56.2, { o: 0, y: 0 }], [56.21, { o: 1 }, "lin"], [56.78, { y: -300, x: 60 }, "out"]]);
    c.tremor(56.16, 12, .3);
  });

  /* ================= 18 · 26 dias ================= */
  plano("18-dias", 56.78, 59.32, [["swoosh", 56.8, .5], ["hit", 57.48, 1], ["pop", 57.6, .5], ["chime", 58.56, .7]], (S, c) => {
    full(S, "festa");
    const t = h("div", "abs", S, "REENCONTRO<br><span style='font-size:64px;color:" + CORAL + "'>TURMA 2016</span>", `left:110px;top:300px;width:860px;text-align:center;font:900 98px/1 var(--v-display);color:${AM};letter-spacing:-.02em`);
    pop(t, 56.8, { s0: .5 });
    const d = h("div", "abs", c.fixo, `<b style="font:900 140px/1 var(--v-display);color:#fff">26</b><small style="display:block;font:800 36px var(--v-sans);color:${MUST};letter-spacing:.1em">DIAS</small>`, `left:540px;top:900px;translate:-50% -50%;width:300px;height:300px;border-radius:50%;background:${VERM};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center`);
    bate(d, 57.46, 2.4);
    fx(t => d.style.scale = t > 57.9 ? (1 + Math.max(0, Math.sin((t - 57.9) * 7)) * .07).toFixed(3) : "1");
    c.origem(540, 700).s(56.78, 1.0).s(59.32, 1.07, 2.5, "out").tremor(57.48, 10, .25);
  });

  /* ================= 19 · votação ================= */
  plano("19-votacao", 59.32, 62.80, [["hit", 59.36, .7], ["boom", 59.9, 1], ["blip", 60.4, .5], ["blip", 60.7, .5], ["flip", 61.12, .8], ["pop", 61.2, .6], ["blip", 61.9, .5], ["blip", 62.2, .5]], (S, c) => {
    raios(S, CORAL, "#FF845F", 8);
    const pl = h("div", "abs", S, `VOTAÇÃO`, `left:540px;top:700px;translate:-50% -50%;padding:40px 70px;background:${AM};border:12px solid #fff;border-radius:36px;font:900 150px var(--v-display);color:#fff;box-shadow:0 20px 0 rgba(0,0,0,.3)`);
    bate(pl, 59.34, 2.5, -4); pl.style.rotate = "-4deg";
    const j = img(S, "n-frente", "left:330px;top:960px;width:420px"); pop(j, 59.6, { s0: .4 }); respira(j, .006);
    const tes = h("div", "ono", c.fixo, "✂", `left:760px;top:1020px;font-size:200px;translate:-50% -50%`);
    anim(tes, [[61.1, { o: 0, s: 0, r: -200 }], [61.11, { o: 1 }, "lin"], [61.5, { s: 1, r: 0 }, "back"]]);
    fx(t => tes.style.rotate = t > 61.5 ? (Math.sin(t * 16) * 10).toFixed(1) + "deg" : "0deg");
    comentarios(S, ["degradê!!", "bagunçado", "DEGRADÊ", "o 2 kkk"], 60.4, .3, 1470, 300);
    c.origem(540, 900).s(59.32, 1.0).tremor(59.36, 14, .3).soco(59.88, .06).s(62.8, 1.06, 3.4, "out");
  });

  /* ================= 20–21 · degradê × bagunçado + comenta ================= */
  plano("20-cortes", 62.80, 65.08, [["swoosh", 62.82, .7], ["hit", 62.9, .7], ["chime", 63.42, .6], ["flip", 63.66, .8], ["hit", 64.02, .7], ["pop", 64.3, .6]], (S, c) => {
    const esq = h("div", "abs", S, null, `inset:0;background:${CORAL};clip-path:polygon(0 0,62% 0,38% 100%,0 100%)`);
    const dir = h("div", "abs", S, null, `inset:0;background:${PETRO};clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%)`);
    anim(esq, [[62.8, { x: -700 }], [63.06, { x: 0 }, "expo"]]); anim(dir, [[62.8, { x: 700 }], [63.06, { x: 0 }, "expo"]]);
    const l1 = img(S, "c-degrade", "left:-60px;top:720px;width:680px"), l2 = img(S, "c-baguncado", "left:480px;top:720px;width:680px");
    pop(l1, 62.84, { s0: .4 }); pop(l2, 64.0, { s0: .4 }); respira(l1, .006); respira(l2, .006, 2.2, 1.3);
    const T = (txt, x, y, t, cor) => { const e = h("div", "ono", S, txt, `left:${x}px;top:${y}px;font-size:76px;color:${cor};translate:-50% -50%;text-align:center;line-height:1`); pop(e, t, { s0: .3 }); };
    T("DEGRADÊ<br>NA RÉGUA", 260, 600, 62.84, "#fff"); T("BAGUNÇADO", 820, 620, 64.0, MUST);
    const ou = h("div", "abs", S, "OU", `left:540px;top:1000px;translate:-50% -50%;width:170px;height:170px;border-radius:50%;background:#fff;border:10px solid ${AM};font:900 74px/150px var(--v-display);color:${AM};text-align:center`);
    anim(ou, [[63.62, { o: 0, s: 0, r: -180 }], [63.63, { o: 1 }, "lin"], [64.0, { s: 1, r: 0 }, "back"]]);
    c.origem(540, 960).s(62.8, 1.08).s(63.2, 1.0, .4, "out").soco(64.0, .04);
  });
  plano("21-final", 65.08, 69.0, [["whoosh", 65.1, .9], ["blip", 65.4, .6], ["blip", 65.6, .6], ["blip", 65.8, .6], ["flip", 65.24, 1], ["chime", 65.8, .8], ["pop", 66.4, .5], ["swell", 67.4, .4], ["pop", 67.0, .5]], (S, c) => {
    raios(S, AM, "#3A2860", 4);
    const fx1 = h("div", "abs", c.fixo, `COMENTA: <span style="color:${MUST}">DEGRADÊ</span> OU <span style="color:#7FE0D0">BAGUNÇADO</span>`, `left:-20px;right:-20px;top:240px;padding:24px 0;background:${AM};border-top:8px solid #fff;border-bottom:8px solid #fff;text-align:center;font:900 54px var(--v-display);color:#fff;transform:rotate(-3deg)`);
    anim(fx1, [[65.07, { o: 0, y: -400 }], [65.08, { o: 1 }, "lin"], [65.4, { y: 0 }, "back"]]);
    comentarios(c.fixo, ["DEGRADÊ!", "bagunçado sim", "degradê na régua", "BAGUNÇADO"], 65.4, .2, 1500, 1700);
    const carta = h("div", "abs", S, null, `left:190px;top:420px;width:700px;height:980px;transform-style:preserve-3d`);
    h("div", "abs", carta, `<div style="font:800 40px var(--v-sans);letter-spacing:.12em;color:${AM}">EPISÓDIO</div><div style="font:900 300px/1 var(--v-display);color:#fff;-webkit-text-stroke:14px ${AM};paint-order:stroke fill">5</div><div style="font:900 64px/1.05 var(--v-display);color:${AM};margin-top:30px">VOCÊS<br>DECIDEM</div>`,
      `inset:0;border-radius:44px;background:${CEU};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 24px 0 rgba(0,0,0,.3)`);
    anim(carta, [[65.2, { o: 0, ry: -180, s: .6 }], [65.24, { o: 1 }, "lin"], [65.84, { ry: 0, s: 1 }, "back"]]);
    particulas(S, { n: 30, t0: 66.7, x: 540, y: 300, cores: [CORAL, MUST, CEU, "#fff"], tam: [16, 30], vx: [-700, 700], vy: [-600, 0], g: 1200, forma: "conf", dur: 2.2 });
    c.origem(540, 900).s(65.08, 1.0).s(69.0, 1.08, 3.9, "out");
  });
})();

/* efeitos extras (pedido: mais efeitos que o ep. 3): preenchem os vãos de ~0,4 s, presos à câmera e aos elementos que já se movem */
[["swoosh", 1.82, 0.45], ["pop", 3.72, 0.45], ["blip", 4.86, 0.45], ["swoosh", 7.52, 0.45], ["tick", 8.66, 0.45], ["pop", 9.04, 0.45], ["swoosh", 9.42, 0.45], ["pop", 10.94, 0.45], ["blip", 12.84, 0.45], ["swoosh", 13.6, 0.45], ["tick", 14.36, 0.45], ["pop", 14.74, 0.45], ["swoosh", 17.4, 0.45], ["pop", 17.78, 0.45], ["blip", 18.92, 0.45], ["swoosh", 20.06, 0.45], ["tick", 20.44, 0.45], ["pop", 21.96, 0.45], ["swoosh", 23.86, 0.45], ["pop", 25.0, 0.45], ["blip", 26.14, 0.45], ["swoosh", 29.18, 0.45], ["tick", 30.32, 0.45], ["pop", 30.7, 0.45], ["swoosh", 34.12, 0.45], ["pop", 36.02, 0.45], ["blip", 38.68, 0.45], ["swoosh", 40.58, 0.45], ["tick", 41.34, 0.45], ["pop", 44.38, 0.45], ["swoosh", 45.14, 0.45], ["pop", 47.42, 0.45], ["blip", 47.8, 0.45], ["swoosh", 48.18, 0.45], ["tick", 49.7, 0.45], ["pop", 50.08, 0.45], ["swoosh", 51.22, 0.45], ["pop", 51.6, 0.45], ["blip", 51.98, 0.45], ["swoosh", 53.5, 0.45], ["tick", 55.02, 0.45], ["pop", 55.4, 0.45], ["swoosh", 55.78, 0.45], ["pop", 58.06, 0.45], ["blip", 58.82, 0.45], ["swoosh", 61.48, 0.45], ["tick", 67.94, 0.45], ["pop", 68.32, 0.45]].forEach(([k, t, g]) => MDS.sfx(k, t, g));
