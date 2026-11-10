/* Juninho · Episódio 2 — modo cartoon narrativo (referencias/modo-cartoon-narrativo.md, seção 4: série)
 * Mesma série do ep. 1 (personagem, casa, legenda, painel, traço); lugares novos e destaque verde-dinheiro.
 * Narração acelerada a pedido (117,9 → 93,5 s, pausas encurtadas + atempo 1,15). Sem música; ~2 efeitos/s.
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
  const SALDO = t => t < 12.22 ? 186.40 : t < 44.54 ? 186.40 : 186.40 - 89.90 * prog(t, 44.54, 45.3, "out");
  const NIVEL = [[0, .05], [55.14, .05], [56.4, .5], [61.08, .5], [61.5, .36]];
  const nivel = t => { let v = NIVEL[0][1]; for (let i = 1; i < NIVEL.length; i++) { const [a, va] = NIVEL[i - 1], [b, vb] = NIVEL[i]; if (t >= b) v = vb; else if (t > a) { v = va + (vb - va) * prog(t, a, b, "out"); break; } } return v; };
  const HUD_ON = [[0.80, 2.06], [2.06, 9.30], [13.86, 27.90], [29.86, 43.06], [45.92, 54.98], [56.84, 58.80], [63.94, 66.64], [68.62, 79.80]];
  cena({ id: "painel", nome: "Painel da série", inicio: .7, fim: 80, margem: 0, z: 900, montar(S) {
    const box = h("div", "abs", S, null, `left:40px;top:232px;display:flex;gap:12px;align-items:stretch;scale:1.3;transform-origin:0 0`);
    const pill = (html, w) => h("div", "", box, html, `background:${AM};border:5px solid #fff;border-radius:18px;padding:10px 18px 12px;box-shadow:0 6px 0 rgba(0,0,0,.35);${w ? "width:" + w + "px" : ""}`);
    pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">FALTAM</small><b style="font:900 42px/1 var(--v-display);color:#fff">28 DIAS</b>`);
    const sp = pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">SALDO</small><b style="font:900 42px/1 var(--v-display);color:#fff;white-space:nowrap"></b>`);
    const sv = sp.querySelector("b"); let last = "";
    fx(t => { const s = brl(SALDO(t)); if (s !== last) { sv.textContent = s; last = s; } sv.style.color = t >= 44.54 && t < 46 ? (Math.floor(t * 8) % 2 ? VERM : "#fff") : "#fff"; });
    const c = pill(`<small style="display:block;font:800 18px var(--v-sans);letter-spacing:.08em;color:${MUST}">CONFIANÇA</small>`, 220);
    const tr = h("div", "", c, null, `margin-top:8px;height:22px;border-radius:11px;background:rgba(255,255,255,.18);overflow:hidden`);
    const barra = h("div", "", tr, null, `height:100%;border-radius:11px`);
    fx(t => { const v = nivel(t); barra.style.width = (v * 100).toFixed(1) + "%"; barra.style.background = v < .1 ? VERM : v > .3 ? VERDE : CORAL; });
    anim(box, [[.799, { o: 0, s: .5, y: -40 }], [.80, { o: 1 }, "lin"], [1.15, { s: 1, y: 0 }, "back"]]);
    fx(t => { box.style.visibility = HUD_ON.some(([a, b]) => t >= a && t < b) ? "visible" : "hidden"; });
  } });

  /* ================= 1 · vocês escolheram ================= */
  const comentarios = (p, lista, t0, passo = .16, y0 = 1500) => lista.forEach((m, i) => {
    const e = h("div", "abs", p, m, `left:${i % 2 ? 600 : 60}px;top:${y0}px;padding:12px 22px;background:#fff;border:5px solid ${AM};border-radius:24px;font:800 30px var(--v-sans);color:${AM};white-space:nowrap`);
    const t = t0 + i * passo; anim(e, [[t - .001, { o: 0, y: 0, s: .6 }], [t, { o: 1 }, "lin"], [t + .2, { s: 1 }, "back"], [t + 1.6, { y: -1000 }, "out"]]);
  });
  plano("01-escolheram", 0, 0.80, [["boom", 0.02, .8], ["blip", .15, .5], ["blip", .31, .5], ["blip", .47, .5], ["blip", .63, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(4px)");
    h("div", "layer", S, null, "background:rgba(42,27,71,.25)");
    placa(c.fixo, "VOCÊS ESCOLHERAM", 540, 560, 0.02, { px: 80, cor: MUST, txtCor: AM, r: -3 });
    comentarios(S, ["roupa!!", "GUARDA-ROUPA", "roupa urgente 😂", "guarda-roupa"], .15);
    c.origem(540, 900).s(0, 1.05).s(.8, 1.1, .8, "out");
  });
  plano("01-guardaroupa", 0.80, 2.06, [["hit", .82, 1], ["pop", 1.15, .6], ["blip", 1.3, .5], ["blip", 1.5, .5], ["blip", 1.7, .5]], (S, c) => {
    fundo(S); const j = close(S, "j-confiante"); respira(j);
    carimbo(c.fixo, "GUARDA-ROUPA 🧥", 540, 560, .82, { r: -6, px: 96 });
    comentarios(S, ["isso!!", "roupa nova já", "VAMOS JUNINHO"], 1.3, .2, 1560);
    c.origem(540, 900).s(.8, 1.12).soco(.82, .06);
  });

  /* ================= 2 · levar a sério ================= */
  plano("02-serio", 2.06, 5.32, [["swoosh", 2.08, .6], ["pop", 4.28, .5], ["click", 4.54, 1], ["glitch", 4.6, .35], ["hit", 4.62, .4]], (S, c) => {
    raios(S, PETRO, "#127C7C", 6);
    const j = close(S, "j-determinado", { w: 1100, x: 600 }); respira(j, .008);
    // interruptor MODO SÉRIO
    const sw = h("div", "abs", c.fixo, `<div style="font:900 34px var(--v-display);color:${MUST};letter-spacing:.06em;margin-bottom:10px">MODO SÉRIO</div><div class="tr" style="position:relative;width:190px;height:96px;border-radius:48px;background:#555;border:6px solid ${AM}"><i style="position:absolute;top:6px;left:6px;width:72px;height:72px;border-radius:50%;background:#fff;border:5px solid ${AM}"></i></div><div class="on" style="font:900 40px var(--v-display);color:#fff;margin-top:8px">OFF</div>`,
      `left:540px;top:640px;translate:-50% -50%;text-align:center;padding:24px 34px;background:${AM};border:6px solid #fff;border-radius:30px`);
    pop(sw, 3.88, { s0: .3 });
    const bola = sw.querySelector("i"), trk = sw.querySelector(".tr"), on = sw.querySelector(".on");
    fx(t => { const k = prog(t, 4.52, 4.66, "back"); bola.style.left = (6 + k * 94).toFixed(1) + "px"; trk.style.background = t >= 4.56 ? VERDE : "#555"; on.textContent = t >= 4.56 ? "ON" : "OFF"; on.style.color = t >= 4.56 ? VERDE : "#fff"; });
    particulas(c.fixo, { n: 14, t0: 4.56, x: 620, y: 640, cores: [MUST, "#fff"], tam: [8, 16], vx: [-500, 500], vy: [-700, -100], g: 1800, forma: "bola", dur: .8 });
    c.origem(540, 900).s(2.06, 1.05).soco(4.26, .06).s(5.32, 1.12, .8, "out");
  });

  /* ================= 3 · pequeno problema ================= */
  plano("03-problema", 5.32, 7.02, [["pop", 5.98, .5], ["riser", 5.4, .4], ["boom", 6.36, 1]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${CREME}`);
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle,rgba(42,27,71,.08) 3px,transparent 4px) 0 0/40px 40px`);
    const pl = h("div", "carimbo", S, "PROBLEMA", `left:540px;top:900px;translate:-50% -50%;font-size:130px`);
    anim(pl, [[5.32, { o: 0, s: .05 }], [5.96, { o: 0, s: .05 }], [5.97, { o: 1 }, "lin"], [6.1, { s: .12 }, "back"], [6.34, { s: .12 }], [6.5, { s: 1.15 }, "expo"], [6.7, { s: 1 }, "out"]]);
    const lupa = h("div", "abs", S, null, `left:560px;top:840px;width:150px;height:150px;border-radius:50%;border:14px solid ${AM};background:rgba(255,255,255,.4)`);
    h("div", "abs", lupa, null, `left:110px;top:120px;width:22px;height:110px;background:${AM};border-radius:10px;transform:rotate(-45deg);transform-origin:50% 0`);
    anim(lupa, [[5.32, { o: 0, x: 300, y: -300 }], [5.36, { o: 1 }, "lin"], [5.6, { x: -200, y: 200 }, "inOut"], [5.85, { x: 150, y: 100 }, "inOut"], [6.05, { x: 0, y: 0 }, "back"], [6.34, { o: 1, s: 1 }], [6.4, { o: 0, s: 2 }, "in"]]);
    c.tremor(6.36, 20, .4);
  });

  /* ================= 4 · nadando em dinheiro ================= */
  plano("04-nadando", 7.02, 9.30, [["swell", 7.04, .5], ["pop", 7.3, .5], ["tick", 8.12, .6], ["tick", 8.24, .6], ["tick", 8.36, .6], ["tick", 8.48, .6], ["glitch", 8.74, .7], ["pop", 8.9, .7], ["pop", 9.1, .3]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(6px) brightness(.85)");
    const j = img(S, "j-tedio", "left:60px;top:1180px;width:560px"); respira(j);
    const bal = h("div", "abs", S, null, `left:250px;top:330px;width:780px;height:720px;border-radius:50%;background:#fff;border:10px solid ${AM}`);
    [[340, 1110, 50], [300, 1180, 34]].forEach(([x, y, r]) => h("div", "abs", S, null, `left:${x}px;top:${y}px;width:${r}px;height:${r}px;border-radius:50%;background:#fff;border:8px solid ${AM}`));
    pop(bal, 7.1, { s0: .2 });
    const pis = h("div", "abs", bal, null, `left:110px;top:300px;width:560px;height:300px;border-radius:30px;background:#6EC6E6;border:8px solid ${AM};overflow:hidden`);
    const agua = h("div", "abs", pis, null, `left:0;right:0;bottom:0;height:200px;background:${VERDE}`);
    // notas e moedas dentro da piscina (sonho) → somem no «dinheiro»
    const itens = [];
    for (let i = 0; i < 16; i++) { const e = h("div", "abs", bal, i % 3 ? "" : "$", `left:${130 + (i * 71) % 520}px;top:0;width:${i % 3 ? 70 : 46}px;height:${i % 3 ? 38 : 46}px;border-radius:${i % 3 ? "6px" : "50%"};background:${i % 3 ? VERDE : MUST};border:4px solid ${AM};font:900 26px/38px var(--v-display);text-align:center;color:${AM}`); itens.push(e);
      const t = 7.4 + (i % 8) * .12; anim(e, [[t, { y: 120, r: 0, o: 0 }], [t + .01, { o: 1 }, "lin"], [t + .6, { y: 330 + (i % 4) * 40, r: (i % 2 ? 1 : -1) * 120 }, "out"], [8.72, { o: 1 }], [8.74, { o: 0 }, "lin"]]); }
    const jn = img(bal, "j-pulo", "left:280px;top:150px;width:210px"); anim(jn, [[7.3, { y: 0, r: -10, o: 1 }], [8.0, { y: 30, r: 10 }, "sine"], [8.72, { y: 0, r: -10, o: 1 }, "sine"], [8.74, { o: 0 }, "lin"]]);
    fx(t => { agua.style.height = t >= 8.74 ? "0px" : "200px"; pis.style.background = t >= 8.74 ? "#cfe9f2" : "#6EC6E6"; });
    [0, 1].forEach(i => { const m = h("div", "abs", bal, "$", `left:${330 + i * 90}px;top:520px;width:46px;height:46px;border-radius:50%;background:${MUST};border:4px solid ${AM};font:900 26px/38px var(--v-display);text-align:center;color:${AM}`);
      anim(m, [[8.74, { o: 0, y: -200 }], [8.75, { o: 1 }, "lin"], [8.95 + i * .1, { y: 0 }, "in"], [9.05 + i * .1, { y: -50 }, "out"], [9.15 + i * .1, { y: 0 }, "in"]]); });
    ono(c.fixo, "SCRATCH!", 540, 300, 8.74, { r: 6, px: 110, cor: "#fff" });
    c.origem(640, 700).s(7.02, 1.0).s(8.72, 1.12, 1.6, "out").tremor(8.74, 10, .3);
  });

  /* ================= 5 · R$ 186,40 ================= */
  plano("05-saldo", 9.30, 13.86, [["click", 9.4, .8], ["swoosh", 9.32, .4], ...Array.from({ length: 6 }, (_, i) => ["tick", 10.3 + i * .06, .5]), ["ding", 10.66, 1], ["whoosh", 12.24, .8], ["pop", 12.6, .7]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 186.40 * prog(t, 10.3, 10.66, "out") });
    const voa = h("div", "abs", c.fixo, "R$ 186,40", `left:540px;top:560px;translate:-50% -50%;font:900 80px var(--v-display);color:${VERDE};-webkit-text-stroke:10px ${AM};paint-order:stroke fill;white-space:nowrap`);
    anim(voa, [[12.2, { o: 0, x: 0, y: 0, s: 1 }], [12.22, { o: 1 }, "lin"], [12.8, { x: -60, y: -300, s: .45 }, "inOut"], [12.9, { o: 0 }, "lin"]]);
    c.origem(540, 560).s(9.3, 1.08).s(10.64, 1.35).s(12.22, 1.6).tremor(10.66, 6, .2);
  });

  /* ================= 6 · não apareceu do nada ================= */
  plano("06-cartola", 13.86, 16.26, [["swoosh", 13.88, .5], ["pop", 15.2, 1], ["chime", 15.26, .5], ["glitch", 15.76, .5], ["hit", 15.8, .6], ["swoosh", 16.0, .5]], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const cart = h("div", "abs", S, null, `left:340px;top:1000px;width:400px;height:300px`);
    h("div", "abs", cart, null, `left:60px;top:0;width:280px;height:250px;background:#1d1530;border:10px solid #fff;border-radius:10px 10px 0 0`);
    h("div", "abs", cart, null, `left:60px;top:170px;width:280px;height:40px;background:${VERM}`);
    h("div", "abs", cart, null, `left:0;top:240px;width:400px;height:50px;border-radius:25px;background:#1d1530;border:10px solid #fff`);
    pop(cart, 13.9, { s0: .4 });
    for (let i = 0; i < 9; i++) { const n = h("div", "abs", S, "$", `left:500px;top:1050px;width:110px;height:60px;border-radius:8px;background:${VERDE};border:5px solid ${AM};font:900 40px/50px var(--v-display);text-align:center;color:${AM}`);
      const ang = -70 + i * 17, dx = Math.sin(ang * Math.PI / 180) * 500, dy = -Math.cos(ang * Math.PI / 180) * 600;
      anim(n, [[15.18, { o: 0, x: 0, y: 0, r: 0 }], [15.2, { o: 1 }, "lin"], [15.6, { x: dx, y: dy, r: ang * 2 }, "out"], [15.76, { x: dx, y: dy }], [16.1, { x: 0, y: 0, o: 0, r: 0 }, "in"]]); }
    ono(c.fixo, "PUF!", 540, 860, 15.2, { r: -6, px: 140, cor: "#fff", ate: 15.74 });
    const sv = svg(c.fixo, 1080, 1920, "position:absolute;left:0;top:0");
    draw(path(sv, "M220 560L860 1360", { stroke: VERM, "stroke-width": 36, "stroke-linecap": "round", fill: "none" }), 15.74, 15.86, "out");
    draw(path(sv, "M860 560L220 1360", { stroke: VERM, "stroke-width": 36, "stroke-linecap": "round", fill: "none" }), 15.84, 15.96, "out");
    c.origem(540, 1000).s(13.86, 1.0).tremor(15.8, 12, .3);
  });

  /* ================= 7 · atendente ================= */
  plano("07-lanchonete", 16.26, 17.30, [["ding", 16.28, .7], ["swell", 16.3, .4]], (S, c) => {
    full(S, "lanchonete");
    const j = img(S, "a-pensa", "left:600px;top:760px;width:430px;clip-path:inset(0 0 46% 0)"); respira(j, .006);
    const vapor = [0, 1, 2].map(i => { const e = h("div", "abs", S, null, `left:${170 + i * 60}px;top:900px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.7)`);
      fx(t => { const k = ((t * .9 + i * .33) % 1); e.style.transform = `translate(${(Math.sin(t * 3 + i) * 14).toFixed(1)}px,${(-k * 160).toFixed(1)}px) scale(${(1 + k).toFixed(2)})`; e.style.opacity = (1 - k).toFixed(2); }); });
    c.origem(700, 1000).s(16.26, 1.0).s(17.3, 1.06, 1.04, "out");
  });
  plano("07-cracha", 17.30, 19.20, [["pop", 17.32, .9], ["hit", 18.08, .5], ["swoosh", 18.1, .4]], (S, c) => {
    fundo(S, "lanchonete");
    const j = img(S, "a-anota", "left:-260px;top:-220px;width:1600px"); respira(j, .005);
    const cr = h("div", "abs", c.fixo, `<b style="display:block;font:900 64px var(--v-display);color:${AM}">JUNINHO</b><span style="font:800 30px var(--v-sans);color:${VERM};letter-spacing:.1em">ATENDENTE</span>`,
      `left:640px;top:1120px;translate:-50% -50%;padding:22px 40px;background:#fff;border:8px solid ${AM};border-radius:20px;text-align:center;box-shadow:0 10px 0 ${AM}`);
    bate(cr, 17.32, 2, -6); cr.style.rotate = "-6deg";
    placa(c.fixo, "LANCHONETE DO BAIRRO", 540, 470, 18.06, { px: 46, cor: VERM, r: 3 });
    c.origem(540, 800).s(17.3, 1.0).soco(18.06, .04);
  });

  /* ================= 8 · pedidos e bandejas ================= */
  plano("08-pedidos", 19.20, 20.84, [["swoosh", 19.22, .5], ...Array.from({ length: 8 }, (_, i) => ["key", 19.8 + i * .09, .6])], (S, c) => {
    fundo(S, "lanchonete");
    const bloco = h("div", "abs", S, null, `left:200px;top:440px;width:680px;height:880px;background:#fff;border:10px solid ${AM};border-radius:20px;box-shadow:0 14px 0 ${AM};rotate:-4deg`);
    h("div", "abs", bloco, "PEDIDO", `left:0;right:0;top:0;height:120px;background:${VERM};color:#fff;font:900 64px/120px var(--v-display);text-align:center;border-bottom:8px solid ${AM}`);
    const sv = svg(bloco, 680, 880, "position:absolute;left:0;top:0");
    ["M60 220C140 200 220 260 300 220S460 200 560 230", "M60 340C160 320 240 380 340 330S480 330 600 350", "M60 460C150 440 250 500 330 450S460 450 520 470", "M60 580C140 560 230 610 300 570"].forEach((d, i) =>
      draw(path(sv, d, { stroke: AM, "stroke-width": 12, "stroke-linecap": "round", fill: "none" }), 19.82 + i * .18, 20.0 + i * .18, "lin"));
    const caneta = h("div", "abs", S, null, `left:0;top:0;width:30px;height:260px;background:${PETRO};border:6px solid ${AM};border-radius:10px;transform-origin:50% 100%`);
    fx(t => { const k = prog(t, 19.82, 20.7); caneta.style.translate = `${(300 + k * 480 + Math.sin(t * 40) * 20).toFixed(0)}px ${(400 + Math.floor(k * 4) * 120 + Math.cos(t * 30) * 12).toFixed(0)}px`; caneta.style.rotate = "25deg"; });
    ono(c.fixo, "RISC RISC", 540, 1490, 19.84, { r: -4, px: 100 });
    c.origem(540, 900).s(19.2, 1.0).s(20.84, 1.05, 1.6, "out");
  });
  plano("08-bandeja", 20.84, 21.66, [["whoosh", 20.86, .9], ["hit", 21.2, .6], ["pop", 21.3, .4]], (S, c) => {
    fundo(S, "lanchonete");
    h("div", "abs", S, null, `left:0;right:0;top:1160px;height:760px;background:#F1E4CC;border-top:12px solid ${AM}`);
    const b = img(S, "a-bandeja", "left:60px;top:240px;width:900px");
    anim(b, [[20.84, { x: -900 }], [21.18, { x: 40 }, "out"], [21.3, { x: 0 }, "out"]]);
    h("div", "abs", S, null, `left:0;top:1180px;width:400px;height:12px;background:rgba(42,27,71,.3)`);
    ono(c.fixo, "TUM!", 820, 520, 21.2, { r: 10, px: 120 });
    c.tremor(21.2, 10, .2);
  });

  /* ================= 9 · cadê meu lanche ================= */
  plano("09-clientes", 21.66, 23.62, [["swoosh", 21.68, .15], ["pop", 22.44, .8], ["pop", 22.64, .8], ["pop", 22.84, .8], ...Array.from({ length: 6 }, (_, i) => ["tick", 23.22 + i * .07, .6])], (S, c) => {
    full(S, "clientes", "transform:scale(1.18);transform-origin:50% 0");
    const bal = (txt, x, y, t, r) => { const e = h("div", "abs", c.fixo, txt, `left:${x}px;top:${y}px;translate:-50% -50%;padding:18px 26px;background:#fff;border:7px solid ${AM};border-radius:30px;font:900 44px/1.05 var(--v-display);color:${VERM};text-align:center;white-space:nowrap;box-shadow:0 8px 0 ${AM}`); pop(e, t, { s0: .3, r0: r * 3 }); e.style.rotate = r + "deg"; };
    bal("CADÊ MEU<br>LANCHE?!", 260, 320, 22.42, -6); bal("JÁ FAZ<br>1 HORA!", 780, 360, 22.62, 6); bal("HUMPF!", 820, 980, 22.82, -4);
    const rel = h("div", "abs", c.fixo, null, `left:470px;top:520px;width:150px;height:150px;border-radius:50%;background:#fff;border:10px solid ${AM}`);
    const pont = h("div", "abs", rel, null, `left:62px;top:14px;width:10px;height:60px;background:${VERM};transform-origin:50% 100%;border-radius:5px`);
    fx(t => pont.style.rotate = (t > 23.2 ? (t - 23.2) * 2400 : 0).toFixed(0) + "deg"); pop(rel, 23.2, { s0: .3 });
    c.origem(540, 700).s(21.66, 1.0).soco(22.42, .04).tremor(22.62, 6, .2);
  });
  plano("09-suor", 23.62, 24.50, [["glitch", 23.64, .4], ["pop", 23.8, .5], ["pop", 24.0, .4]], (S, c) => {
    fundo(S, "lanchonete");
    const j = img(S, "a-pensa", "left:-420px;top:140px;width:1900px"); respira(j, .006);
    for (let i = 0; i < 4; i++) { const g = h("div", "abs", S, null, `left:${300 + i * 140}px;top:420px;width:50px;height:70px;background:#7DC9F2;border:6px solid ${AM};border-radius:50% 50% 50% 50% / 60% 60% 40% 40%`);
      anim(g, [[23.7 + i * .08, { o: 0, y: 0, x: 0 }], [23.71 + i * .08, { o: 1 }, "lin"], [24.4, { y: -160, x: (i - 1.5) * 90 }, "out"]]); }
    c.origem(540, 700).s(23.62, 1.0).tremor(23.64, 8, .25);
  });

  /* ================= 10 · um objetivo ================= */
  plano("10-alvo", 24.50, 26.56, [["swoosh", 24.52, .5], ["whoosh", 25.6, .7], ["hit", 25.9, 1], ["pop", 26.0, .5]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${PETRO}`);
    const alvo = h("div", "abs", S, null, `left:140px;top:500px;width:800px;height:800px;border-radius:50%;background:repeating-radial-gradient(circle,${VERM} 0 80px,#fff 80px 160px);border:12px solid ${AM}`);
    pop(alvo, 24.52, { s0: .5 }); fx(t => alvo.style.rotate = (t * 20).toFixed(1) + "deg");
    const dardo = h("div", "abs", c.fixo, null, `left:540px;top:900px;width:340px;height:30px;background:${MUST};border:6px solid ${AM};border-radius:6px;transform-origin:0 50%`);
    h("div", "abs", dardo, null, `left:280px;top:-36px;width:80px;height:90px;background:${CORAL};border:6px solid ${AM};clip-path:polygon(0 0,100% 50%,0 100%,25% 50%)`);
    anim(dardo, [[25.6, { x: 900, y: -600, r: -30, o: 1 }], [25.88, { x: 0, y: 0, r: -30 }, "in"], [25.95, { r: -26 }, "out"], [26.1, { r: -30 }, "elastic"]]);
    dardo.style.rotate = "0deg";
    ono(c.fixo, "TUC!", 760, 700, 25.9, { r: 8, px: 120 });
    c.tremor(25.9, 14, .3);
  });

  /* ================= 11 · mudar o visual ================= */
  plano("11-visual", 26.56, 27.90, [["swoosh", 26.58, .5], ["boom", 27.02, .9]], (S, c) => {
    fundo(S);
    const j = img(S, "j-frente", "left:330px;top:400px;width:430px"); respira(j, .006);
    placa(c.fixo, "VISUAL ATUAL", 540, 520, 26.6, { px: 54, cor: AM });
    carimbo(c.fixo, "REPROVADO", 540, 1050, 27.0, { r: -12, px: 120 });
    c.origem(540, 1000).s(26.56, 1.0).tremor(27.02, 14, .3);
  });
  plano("11-convite", 27.90, 29.86, [["chime", 27.92, .7], ["pop", 28.0, .6], ["hit", 28.84, .6]], (S, c) => {
    full(S, "festa");
    const t = h("div", "abs", S, "REENCONTRO<br><span style='font-size:64px;color:" + CORAL + "'>TURMA 2016</span>", `left:110px;top:300px;width:860px;text-align:center;font:900 98px/1 var(--v-display);color:${AM};letter-spacing:-.02em`);
    pop(t, 27.92, { s0: .5 });
    const d = h("div", "abs", c.fixo, `<b style="font:900 140px/1 var(--v-display);color:#fff">28</b><small style="display:block;font:800 36px var(--v-sans);color:${MUST};letter-spacing:.1em">DIAS</small>`, `left:540px;top:900px;translate:-50% -50%;width:300px;height:300px;border-radius:50%;background:${VERM};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center`);
    bate(d, 28.0, 2.4);
    fx(t => d.style.scale = t > 28.4 ? (1 + Math.max(0, Math.sin((t - 28.4) * 7)) * .07).toFixed(3) : "1");
    c.origem(540, 700).s(27.9, 1.0).s(29.86, 1.07, 1.9, "out").tremor(28.84, 6, .2);
  });

  /* ================= 12 · shopping ================= */
  plano("12-shopping", 29.86, 32.58, [["whoosh", 30.68, .9], ["swell", 29.9, .5], ["pop", 31.64, .7], ["pop", 31.78, .7], ["pop", 31.92, .7]], (S, c) => {
    full(S, "shopping");
    const j = img(S, "j-frente", "left:360px;top:760px;width:360px"); respira(j, .006);
    anim(j, [[29.86, { x: -700 }], [30.7, { x: -700 }], [31.1, { x: 0 }, "out"]]);
    fx(t => j.style.translate = t > 30.7 && t < 31.1 ? `0 ${(Math.abs(Math.sin(t * 24)) * -18).toFixed(1)}px` : "0 0");
    [["#FF6B4A", 180], [VERDE, 540], [MUST, 900]].forEach(([cor, x], i) => { const sac = h("div", "abs", c.fixo, null, `left:${x - 80}px;top:1520px;width:160px;height:180px;background:${cor};border:7px solid ${AM};border-radius:10px`);
      h("div", "abs", sac, null, `left:40px;top:-50px;width:70px;height:60px;border:7px solid ${AM};border-bottom:none;border-radius:40px 40px 0 0`);
      pop(sac, 31.62 + i * .14, { s0: 0, r0: 20 }); });
    for (let i = 0; i < 3; i++) { const e = h("div", "ono", c.fixo, "✦", `left:${440 + i * 110}px;top:${880 - i * 30}px;font-size:70px;color:#fff;translate:-50% -50%`); pop(e, 31.2 + i * .1, { r0: -90 }); }
    c.origem(540, 1100).s(29.86, 1.0).s(32.58, 1.12, 2.7, "inOut");
  });

  /* ================= 13 · cuidado com os gastos ================= */
  plano("13-etiquetas", 32.58, 35.24, [["swoosh", 32.6, .5], ["swoosh", 33.82, .5], ["swoosh", 34.1, .4], ["boom", 34.84, .9]], (S, c) => {
    full(S, "arara", "filter:blur(3px)");
    [[260, 520, -12, 0], [780, 600, 10, .12], [520, 980, -4, .24]].forEach(([x, y, r, d]) => {
      const e = h("div", "abs", S, `<span style="font:900 120px var(--v-display);color:${VERM}">$$$</span>`, `left:${x}px;top:${y}px;translate:-50% -50%;width:360px;height:220px;background:${CREME};border:9px solid ${AM};border-radius:20px 60px 60px 20px;display:flex;align-items:center;justify-content:center;transform-origin:50% -80px`);
      h("div", "abs", e, null, `left:20px;top:86px;width:34px;height:34px;border-radius:50%;background:${AM}`);
      anim(e, [[32.58 + d, { o: 0, r: r * 4, y: -400 }], [32.6 + d, { o: 1 }, "lin"], [33.1 + d, { y: 0, r }, "back"], [33.8, { r }], [34.2, { r: -r }, "sine"], [34.6, { r }, "sine"]]);
    });
    placa(c.fixo, "CUIDADO!", 540, 1140, 34.66, { px: 90, cor: VERM, r: -4 });
    c.origem(540, 800).s(32.58, 1.0).tremor(34.68, 14, .3);
  });

  /* ================= 14 · viver de vento ================= */
  plano("14-carteira", 35.24, 37.10, [["swoosh", 35.26, .5], ...Array.from({ length: 6 }, (_, i) => ["tick", 36.3 + i * .1, .6]), ["pop", 36.9, .5]], (S, c) => {
    raios(S, CORAL, "#FF845F", 4);
    const cart = h("div", "abs", S, null, `left:240px;top:640px;width:600px;height:420px;background:#7A4A2B;border:12px solid ${AM};border-radius:40px`);
    h("div", "abs", cart, null, `left:0;right:0;top:0;height:160px;background:#8E5A36;border-bottom:10px solid ${AM};border-radius:30px 30px 0 0`);
    pop(cart, 35.28, { s0: .4 });
    for (let i = 0; i < 6; i++) { const m = h("div", "abs", S, i % 2 ? "$" : "", `left:${420 + (i % 3) * 70}px;top:700px;width:${i % 2 ? 60 : 120}px;height:${i % 2 ? 60 : 64}px;border-radius:${i % 2 ? "50%" : "8px"};background:${i % 2 ? MUST : VERDE};border:5px solid ${AM};font:900 34px/50px var(--v-display);text-align:center;color:${AM}`);
      const t = 36.3 + i * .1; anim(m, [[t - .001, { o: 0, y: 0, r: 0 }], [t, { o: 1 }, "lin"], [t + .7, { y: 1300, r: (i % 2 ? 1 : -1) * 300, x: (i - 2.5) * 70 }, "in"]]); }
    placa(c.fixo, "GASTAR TUDO?", 540, 500, 36.3, { px: 70, cor: AM });
    c.origem(540, 900).s(35.24, 1.0).s(37.1, 1.08, 1.8, "out");
  });
  plano("14-vento", 37.10, 38.36, [["whoosh", 37.12, .9], ["whoosh", 37.5, .7], ["pop", 37.8, .5]], (S, c) => {
    fundo(S, "lanchonete");
    h("div", "abs", S, null, `left:0;right:0;top:1180px;height:740px;background:#F1E4CC;border-top:12px solid ${AM}`);
    const j = close(S, "j-tedio", { w: 820, x: 540, base: 1300 }); respira(j);
    const prato = h("div", "abs", S, null, `left:290px;top:1240px;width:500px;height:160px;border-radius:50%;background:#fff;border:10px solid ${AM}`);
    h("div", "abs", prato, null, `left:90px;top:30px;width:300px;height:80px;border-radius:50%;border:6px solid rgba(42,27,71,.25)`);
    h("div", "abs", S, null, `left:180px;top:1180px;width:16px;height:260px;background:#bbb;border:5px solid ${AM};border-radius:8px`);
    h("div", "abs", S, null, `left:880px;top:1180px;width:16px;height:260px;background:#bbb;border:5px solid ${AM};border-radius:8px`);
    const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
    [700, 820, 940].forEach((y, i) => { const p = path(sv, `M-40 ${y}C200 ${y - 60} 400 ${y + 60} 620 ${y}S900 ${y - 40} 1120 ${y}`, { stroke: "#fff", "stroke-width": 14, "stroke-linecap": "round", fill: "none", opacity: .85 });
      draw(p, 37.14 + i * .12, 37.6 + i * .12, "out"); });
    ono(c.fixo, "FUUU…", 540, 840, 37.2, { r: -5, px: 130, cor: "#fff" });
    c.origem(540, 1100).s(37.1, 1.0).s(38.36, 1.06, 1.26, "out");
  });

  /* ================= 15 · achou as peças ================= */
  plano("15-arara", 38.36, 39.74, [["swoosh", 38.4, .6], ["swoosh", 38.62, .6], ["swoosh", 38.84, .6], ["swoosh", 39.06, .6], ["swoosh", 39.28, .6], ["swoosh", 39.5, .6]], (S, c) => {
    const a = full(S, "arara");
    fx(t => { const k = (t - 38.36) * 900; a.style.objectPosition = `${50 + Math.sin(k / 260) * 30}% 50%`; a.style.filter = `blur(${(Math.abs(Math.cos(k / 260)) * 6).toFixed(1)}px)`; });
    c.origem(540, 960).s(38.36, 1.25);
  });
  plano("15-pecas", 39.74, 43.06, [["pop", 40.18, 1], ["pop", 40.94, 1], ["pop", 41.78, 1], ["chime", 42.3, 1], ["swell", 42.35, .4]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${CREME}`);
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle,rgba(43,182,115,.16) 4px,transparent 5px) 0 0/44px 44px`);
    [["p-camiseta", 60, 520, 40.16, -8, 440], ["p-calca", 560, 440, 40.92, 6, 300], ["p-jaqueta", 300, 980, 41.76, -3, 520]].forEach(([n, x, y, t, r, w]) => {
      const e = img(S, n, `left:${x}px;top:${y}px;width:${w}px`); pop(e, t, { s0: 0, r0: r * 4 }); e.style.rotate = r + "deg";
      MDS.floaty(e, 10, 2, x); });
    const ok = h("div", "abs", c.fixo, "✓", `left:540px;top:900px;translate:-50% -50%;width:300px;height:300px;border-radius:50%;background:${VERDE};border:14px solid #fff;font:900 220px/270px var(--v-display);color:#fff;text-align:center`);
    bate(ok, 42.28, 2.5);
    const brilho = h("div", "abs", S, null, `left:-300px;top:0;width:200px;height:1920px;background:rgba(255,255,255,.6);transform:rotate(18deg)`);
    anim(brilho, [[42.3, { x: 0 }], [42.9, { x: 1700 }, "inOut"]]);
    c.origem(540, 900).s(39.74, 1.0).s(43.06, 1.06, 3.3, "out");
  });

  /* ================= 16 · R$ 89,90 ================= */
  plano("16-maquininha", 43.06, 45.92, [["swoosh", 43.08, .5], ["click", 43.64, 1], ["blip", 43.8, .6], ["key", 44.0, .6], ["key", 44.1, .6], ["key", 44.2, .6], ["chime", 44.56, 1], ["glitch", 44.7, .4], ["hit", 44.62, .7]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${AM}`);
    raios(S, AM, "#3A2860", 3);
    const maq = h("div", "abs", S, null, `left:300px;top:640px;width:480px;height:760px;background:#2E2E3A;border:12px solid #fff;border-radius:50px`);
    const vis = h("div", "abs", maq, "", `left:40px;top:60px;right:40px;height:200px;background:#9FE3B8;border:8px solid ${AM};border-radius:20px;font:900 62px/184px var(--v-display);color:${AM};text-align:center`);
    MDS.at(43.62, on => vis.textContent = on ? "R$ 89,90" : "");
    for (let i = 0; i < 12; i++) h("div", "abs", maq, null, `left:${50 + (i % 3) * 130}px;top:${310 + Math.floor(i / 3) * 100}px;width:100px;height:72px;border-radius:16px;background:${i === 11 ? VERDE : "#4A4A5A"};border:5px solid ${AM}`);
    pop(maq, 43.1, { s0: .5 });
    const rec = h("div", "abs", S, `<div style="font:800 30px var(--v-sans);color:${AM};letter-spacing:.06em">COMPRA</div><div style="font:900 84px var(--v-display);color:${VERM};margin-top:10px;white-space:nowrap">−R$ 89,90</div>`,
      `left:240px;top:220px;width:600px;height:330px;padding:40px 30px;background:#fff;border:8px solid ${AM};text-align:center;clip-path:inset(100% 0 0 0)`);
    fx(t => rec.style.clipPath = `inset(${((1 - prog(t, 44.5, 44.9, "out")) * 100).toFixed(1)}% 0 0 0)`);
    c.origem(540, 700).s(43.06, 1.0).s(44.54, 1.1).tremor(44.62, 10, .3);
  });

  /* ================= 17 · direto pro espelho ================= */
  plano("17-porta", 45.92, 47.12, [["hit", 46.36, .7], ["swoosh", 46.0, .4]], (S, c) => {
    full(S, "quarto-tarde");
    const porta = h("div", "abs", S, null, `left:-20px;top:0;width:560px;height:1920px;background:#8E5A36;border:14px solid ${AM};transform-origin:0 50%`);
    h("div", "abs", porta, null, `left:470px;top:960px;width:50px;height:50px;border-radius:50%;background:${MUST};border:6px solid ${AM}`);
    anim(porta, [[45.92, { ry: 0 }], [46.36, { ry: -82 }, "out"]]);
    ono(c.fixo, "BLAM!", 760, 560, 46.36, { r: 8, px: 130 });
    c.tremor(46.38, 10, .25);
  });
  plano("17-troca", 47.12, 49.06, [["whoosh", 47.14, .8], ["swoosh", 47.4, .6], ["swoosh", 47.6, .6], ["swoosh", 47.8, .6], ["swoosh", 48.0, .6], ["pop", 48.3, .6], ["pop", 48.5, .6]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(3px)");
    const nuvem = h("div", "abs", S, null, `left:190px;top:560px;width:700px;height:800px`);
    for (let i = 0; i < 9; i++) { const b = h("div", "abs", nuvem, null, `left:${120 + Math.cos(i) * 220}px;top:${260 + Math.sin(i * 1.7) * 260}px;width:${260 + (i % 3) * 60}px;height:${260 + (i % 3) * 60}px;border-radius:50%;background:#EDE3D0;border:10px solid ${AM}`);
      fx(t => b.style.translate = `${(Math.sin(t * 18 + i) * 16).toFixed(1)}px ${(Math.cos(t * 15 + i * 2) * 16).toFixed(1)}px`); }
    pop(nuvem, 47.14, { s0: .2 });
    [["p-camiseta", 47.4, -1], ["j-tedio", 47.6, 1], ["p-calca", 47.8, -1], ["p-jaqueta", 48.0, 1]].forEach(([n, t, d]) => { if (n === "j-tedio") return;
      const e = img(c.fixo, n, `left:440px;top:800px;width:220px`); anim(e, [[t - .001, { o: 0, x: 0, y: 0, r: 0 }], [t, { o: 1 }, "lin"], [t + .6, { x: d * 600, y: -700, r: d * 400 }, "out"], [t + .7, { o: 0 }, "lin"]]); });
    ono(c.fixo, "VUPT VUPT!", 540, 1490, 47.3, { r: -6, px: 120 });
    c.tremor(47.2, 6, 1.6);
  });
  plano("17-espelho", 49.06, 49.70, [["chime", 49.08, .8], ["pop", 49.1, .5]], (S, c) => {
    fundo(S);
    const esp = h("div", "abs", S, null, `left:250px;top:260px;width:580px;height:1500px;border-radius:290px 290px 30px 30px;background:linear-gradient(160deg,#DDF3F6,#A9D8E0);border:22px solid ${MUST};box-shadow:0 0 0 10px ${AM}`);
    const br = h("div", "abs", esp, null, `left:80px;top:120px;width:60px;height:700px;background:rgba(255,255,255,.7);border-radius:30px;transform:rotate(18deg)`);
    anim(br, [[49.06, { y: -400, o: 0 }], [49.1, { o: 1 }, "lin"], [49.6, { y: 500 }, "out"]]);
    c.origem(540, 900).s(49.06, 1.05);
  });

  /* ================= 18 · ajustes e pose ================= */
  const espelho = (S, nome, css) => {
    fundo(S);
    const esp = h("div", "abs", S, null, `left:130px;top:220px;width:820px;height:1600px;border-radius:410px 410px 30px 30px;background:linear-gradient(160deg,#DDF3F6,#A9D8E0);border:24px solid ${MUST};box-shadow:0 0 0 10px ${AM};overflow:hidden`);
    const j = img(esp, nome, css); return { esp, j };
  };
  plano("18-jaqueta", 49.70, 50.66, [["swoosh", 49.72, .5], ["flip", 50.1, .8]], (S, c) => {
    const { j } = espelho(S, "n-pose", "left:-560px;top:-60px;width:1800px");
    ono(c.fixo, "FWIP!", 760, 620, 50.1, { r: 8, px: 110 });
    c.origem(540, 700).s(49.7, 1.0).soco(50.08, .05);
  });
  plano("18-camiseta", 50.66, 52.42, [["flip", 50.7, .8], ["swoosh", 51.1, .4], ["pop", 51.9, .5]], (S, c) => {
    const { j } = espelho(S, "n-ajeita", "left:-460px;top:-640px;width:1700px");
    anim(j, [[50.66, { y: 0 }], [50.9, { y: 14 }, "out"], [51.1, { y: 0 }, "out"]]);
    ono(c.fixo, "FWIP!", 300, 760, 50.7, { r: -8, px: 110 });
    c.origem(540, 900).s(50.66, 1.0).s(52.42, 1.06, 1.7, "out");
  });
  plano("18-pose", 52.42, 53.08, [["click", 52.44, 1], ["chime", 52.5, .8], ["pop", 52.6, .6]], (S, c) => {
    const { esp, j } = espelho(S, "n-pose", "left:150px;top:240px;width:520px");
    const flash = h("div", "layer", S, null, "background:#fff"); anim(flash, [[52.42, { o: 1 }], [52.62, { o: 0 }, "out"]]);
    for (let i = 0; i < 5; i++) { const e = h("div", "ono", c.fixo, "✦", `left:${220 + i * 160}px;top:${420 + (i % 2) * 220}px;font-size:${60 + (i % 3) * 30}px;color:#fff;translate:-50% -50%`); pop(e, 52.46 + i * .04, { r0: -120 }); }
    c.origem(540, 900).s(52.42, 1.08).soco(52.44, .05);
  });

  /* ================= 19 · caramba ================= */
  plano("19-caramba", 53.08, 54.98, [["boom", 53.1, 1], ["pop", 53.2, .6], ["hit", 54.4, .5]], (S, c) => {
    raios(S, MUST, "#FFE48A", 7);
    const j = close(S, "n-caramba", { w: 1000 }); respira(j);
    const j2 = close(S, "n-susto", { w: 1000 }); respira(j2);
    troca([j, j2], [53.08, 54.38]);
    ono(c.fixo, "CARAMBA!", 540, 470, 53.1, { r: -8, px: 170 });
    c.origem(540, 900).s(53.08, 1.1).soco(53.1, .07).s(54.38, 1.28).tremor(53.1, 12, .3);
  });

  /* ================= 20 · gostando do visual ================= */
  plano("20-confianca", 54.98, 56.84, [["swoosh", 55.0, .4], ["riser", 55.1, .8], ["chime", 56.4, 1]], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const p = h("div", "abs", S, `<small style="display:block;font:800 40px var(--v-sans);letter-spacing:.08em;color:${MUST};margin-bottom:20px">CONFIANÇA</small>`, `left:90px;top:640px;width:900px;padding:40px;background:${AM};border:10px solid #fff;border-radius:40px`);
    const tr = h("div", "", p, null, `height:80px;border-radius:40px;background:rgba(255,255,255,.18);overflow:hidden`);
    const b = h("div", "", tr, null, `height:100%;border-radius:40px;background:${VERDE}`);
    fx(t => b.style.width = (nivel(t) * 100).toFixed(1) + "%");
    const mais = h("div", "ono", c.fixo, "+ PELA 1ª VEZ!", `left:540px;top:1000px;translate:-50% -50%;font-size:84px;color:${VERDE}`); pop(mais, 56.3, { r0: -10 });
    for (let i = 0; i < 6; i++) { const e = h("div", "ono", c.fixo, "▲", `left:${200 + i * 140}px;top:1200px;font-size:60px;color:${VERDE};-webkit-text-stroke:6px ${AM}`);
      anim(e, [[55.2 + i * .12, { o: 0, y: 0 }], [55.21 + i * .12, { o: 1 }, "lin"], [56.8, { y: -500, o: .9 }, "out"]]); }
    c.origem(540, 800).s(54.98, 1.0).s(56.84, 1.08, 1.86, "out");
  });
  plano("20-confiante", 56.84, 58.80, [["swoosh", 56.86, .5], ["chime", 57.26, .8], ["pop", 57.4, .5], ["pop", 57.6, .5], ["pop", 57.8, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(6px)");
    const j = img(S, "n-frente", "left:300px;top:420px;width:480px"); respira(j, .006);
    for (let i = 0; i < 5; i++) { const e = h("div", "ono", S, i % 2 ? "♥" : "✦", `left:${200 + i * 170}px;top:900px;font-size:${70 + (i % 2) * 30}px;color:${i % 2 ? CORAL : "#fff"};-webkit-text-stroke:8px ${AM}`);
      anim(e, [[57.3 + i * .1, { o: 0, y: 0, s: .4 }], [57.5 + i * .1, { o: 1, s: 1 }, "back"], [58.8, { y: -460, o: .9 }, "out"]]); }
    c.origem(540, 1000).s(56.84, 1.0).s(58.8, 1.1, 1.96, "out");
  });

  /* ================= 21 · a realidade ================= */
  plano("21-app", 58.80, 61.70, [["swoosh", 58.82, .15], ["click", 59.42, 1], ["blip", 59.6, .6], ["glitch", 61.1, 1], ["hit", 61.12, .7]], (S, c) => {
    const tela = celular(S);
    h("div", "abs", tela, null, `inset:0;background:linear-gradient(160deg,${VERDE},${PETRO})`);
    const app = h("div", "abs", tela, null, `inset:0`);
    appBanco(app, { valor: () => 186.40, cinza: 61.08 });
    anim(app, [[59.4, { o: 0, s: .3 }], [59.41, { o: 1 }, "lin"], [59.7, { s: 1 }, "out"]]);
    fx(t => S.parentNode.style.filter = t >= 61.08 ? "grayscale(1)" : "none");
    ono(c.fixo, "REALIDADE", 540, 1460, 61.1, { r: -4, px: 110, cor: "#fff" });
    c.origem(540, 560).s(58.8, 1.0).s(61.08, 1.2).tremor(61.1, 18, .45);
  });

  /* ================= 22 · R$ 96,50 ================= */
  plano("22-saldo", 61.70, 63.94, [["riser", 61.72, .4], ...Array.from({ length: 6 }, (_, i) => ["tick", 62.36 + i * .05, .6]), ["boom", 62.66, .9]], (S, c) => {
    const tela = celular(S);
    appBanco(tela, { valor: t => 186.40 - 89.90 * prog(t, 62.3, 62.64, "out") });
    carimbo(c.fixo, "SÓ ISSO?!", 540, 1150, 62.66, { r: -10, px: 120 });
    c.origem(540, 470).s(61.7, 1.5).tremor(62.66, 12, .3);
  });

  /* ================= 23 · bonito, mas pobre ================= */
  plano("23-amarelo", 63.94, 66.64, [["swoosh", 63.96, .5], ["glitch", 65.02, .3], ["pop", 65.4, .4]], (S, c) => {
    fundo(S);
    const j = close(S, "n-amarelo", { w: 1000 }); respira(j, .008);
    c.origem(540, 900).s(63.94, 1.1).s(66.64, 1.2, 2.7, "out");
  });
  plano("23-bonito-pobre", 66.64, 68.62, [["whoosh", 66.66, .6], ["chime", 66.82, 1], ["pop", 66.9, .6], ["hit", 67.96, 1], ["glitch", 68.0, .4], ["pop", 68.1, .5]], (S, c) => {
    const L = h("div", "abs", S, null, `left:0;top:0;width:540px;height:1920px;background:${VERDE};border-right:10px solid ${AM}`);
    const R = h("div", "abs", S, null, `left:540px;top:0;width:540px;height:1920px;background:${VERM}`);
    anim(L, [[66.64, { x: -540 }], [66.84, { x: 0 }, "expo"]]); anim(R, [[67.9, { x: 540 }], [67.94, { x: 540 }], [68.1, { x: 0 }, "expo"]]);
    const j = img(L, "n-orgulho", "left:-20px;top:760px;width:560px"); respira(j);
    placa(c.fixo, "BONITO ✓", 270, 560, 66.82, { px: 70, cor: AM });
    const cart = h("div", "abs", R, null, `left:120px;top:880px;width:300px;height:220px;background:#7A4A2B;border:10px solid ${AM};border-radius:30px`);
    const mar = h("div", "ono", R, "🦋", `left:270px;top:840px;font-size:110px;-webkit-text-stroke:0;translate:-50% -50%`);
    anim(mar, [[68.1, { o: 0, y: 0 }], [68.11, { o: 1 }, "lin"], [68.6, { y: -260, x: 40 }, "out"]]);
    placa(c.fixo, "POBRE ✓", 810, 560, 67.96, { px: 70, cor: AM });
    c.tremor(67.96, 12, .3);
  });

  /* ================= 24 · dia seguinte ================= */
  plano("24-dia", 68.62, 70.02, [["whoosh", 68.76, 1], ["swoosh", 69.4, .4]], (S, c) => {
    raios(S, PETRO, "#127C7C", 8);
    const pl = h("div", "abs", S, "DIA SEGUINTE", `left:540px;top:900px;translate:-50% -50%;padding:30px 60px;background:${MUST};border:12px solid ${AM};border-radius:26px;font:900 110px var(--v-display);color:${AM};white-space:nowrap`);
    anim(pl, [[68.62, { x: 1300, r: 0 }], [68.9, { x: 0, r: -4 }, "expo"], [69.8, { x: 0 }], [70.02, { x: -1300 }, "in"]]);
    c.origem(540, 900).s(68.62, 1.0);
  });
  plano("24-volta", 70.02, 72.96, [["ding", 70.06, .7], ["swell", 70.4, .3], ["pop", 72.2, .6], ["blip", 72.5, .4]], (S, c) => {
    full(S, "lanchonete");
    const j = img(S, "a-anota", "left:640px;top:760px;width:380px;clip-path:inset(0 0 46% 0)"); respira(j, .006);
    const cof = h("div", "abs", c.fixo, `<div style="font:900 120px var(--v-display);color:${AM}">🐷</div>`, `left:540px;top:1000px;translate:-50% -50%;width:300px;height:300px;border-radius:50%;background:#FFB3C1;border:10px solid ${AM};display:flex;align-items:center;justify-content:center`);
    pop(cof, 72.18, { s0: .2 });
    ono(c.fixo, "vazio…", 540, 1230, 72.4, { r: -4, px: 80, cor: "#fff" });
    c.origem(800, 1000).s(70.02, 1.0).s(72.96, 1.12, 2.9, "out");
  });

  /* ================= 25 · dinheiro extra ================= */
  plano("25-pensa", 72.96, 76.74, [["swoosh", 72.98, .4], ...Array.from({ length: 8 }, (_, i) => ["click", 74.36 + i * .14, .5]), ["ding", 75.78, 1], ["pop", 75.8, .7]], (S, c) => {
    fundo(S, "lanchonete");
    const j = img(S, "a-pensa", "left:-180px;top:460px;width:1440px"); respira(j, .006);
    const eng = (x, y, r, dir) => { const g = h("div", "abs", c.fixo, null, `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:repeating-conic-gradient(${MUST} 0 15deg,transparent 15deg 30deg);border:8px solid ${AM}`);
      h("div", "abs", g, null, `left:${r * .5}px;top:${r * .5}px;width:${r - 16}px;height:${r - 16}px;border-radius:50%;background:${MUST};border:8px solid ${AM}`);
      pop(g, 74.3, { s0: 0 }); fx(t => { g.style.rotate = (t * 160 * dir).toFixed(0) + "deg"; g.style.visibility = t >= 75.76 ? "hidden" : "visible"; }); };
    eng(400, 420, 90, 1); eng(560, 340, 60, -1); eng(680, 440, 75, 1);
    const lamp = h("div", "abs", c.fixo, `<div style="font-size:170px;line-height:1">💡</div><b style="font:900 70px var(--v-display);color:${VERDE};-webkit-text-stroke:8px ${AM};paint-order:stroke fill">+ R$</b>`, `left:540px;top:620px;translate:-50% -50%;text-align:center`);
    pop(lamp, 75.76, { s0: .2 });
    c.origem(540, 600).s(72.96, 1.0).s(75.76, 1.1).s(76.74, 1.14, .98, "out");
  });
  plano("25-checklist", 76.74, 79.80, [["swoosh", 76.76, .5], ["tick", 77.0, 1], ["pop", 77.88, .5], ["pop", 78.0, .5], ["pop", 78.12, .5], ["pop", 78.24, .5], ["hit", 79.04, .6]], (S, c) => {
    raios(S, AM, "#3A2860", 3);
    const L = h("div", "abs", S, null, `left:140px;top:420px;width:800px;padding:40px 50px;background:${CREME};border:10px solid ${AM};border-radius:30px;box-shadow:0 16px 0 ${AM}`);
    h("div", "", L, "TRANSFORMAÇÃO", `font:900 64px var(--v-display);color:${AM};margin-bottom:20px;letter-spacing:-.02em`);
    [["ROUPA", true, 77.0], ["CABELO", false, 77.86], ["???", false, 77.98], ["???", false, 78.1], ["???", false, 78.22]].forEach(([n, ok, t]) => {
      const r = h("div", "", L, `<span style="display:inline-block;width:70px;height:70px;border-radius:14px;border:7px solid ${AM};background:${ok ? VERDE : "#fff"};color:#fff;font:900 56px/58px var(--v-display);text-align:center;vertical-align:middle;margin-right:24px">${ok ? "✓" : ""}</span><span style="font:900 56px var(--v-display);color:${ok ? VERDE : AM};vertical-align:middle">${n}</span>`, `margin:16px 0`);
      pop(r, t, { s0: .4 }); });
    pop(L, 76.76, { s0: .5 });
    c.origem(540, 900).s(76.74, 1.0).soco(79.02, .05).s(79.8, 1.06, .7, "out");
  });

  /* ================= 26 · votação ================= */
  plano("26-votacao", 79.80, 83.54, [["hit", 79.86, .7], ["boom", 80.86, 1], ["flip", 83.26, .8], ["pop", 83.3, .6]], (S, c) => {
    raios(S, CORAL, "#FF845F", 8);
    const pl = h("div", "abs", S, `VOTAÇÃO`, `left:540px;top:760px;translate:-50% -50%;padding:40px 70px;background:${AM};border:12px solid #fff;border-radius:36px;font:900 150px var(--v-display);color:#fff;box-shadow:0 20px 0 rgba(0,0,0,.3)`);
    bate(pl, 79.84, 2.5, -4); pl.style.rotate = "-4deg";
    const q = h("div", "ono", c.fixo, "?", `left:540px;top:1100px;font-size:300px;translate:-50% -50%`);
    anim(q, [[83.24, { o: 0, s: 0, r: -360 }], [83.25, { o: 1 }, "lin"], [83.54, { s: 1, r: 0 }, "back"]]);
    comentarios(S, ["1!!", "2 com certeza", "básico", "o 2 kkk"], 81.6, .3, 1620);
    c.origem(540, 900).s(79.8, 1.0).tremor(79.86, 14, .3).soco(80.84, .06).tremor(80.86, 18, .35).s(83.54, 1.06, 2.7, "out");
  });

  /* ================= 27–28 · estilo 1 × 2 + comenta ================= */
  plano("27-estilos", 83.54, 91.22, [["swoosh", 83.56, .3], ["hit", 83.88, .7], ["pop", 84.14, .8], ["pop", 85.1, .8], ["hit", 85.98, .7], ["pop", 86.52, .8], ["pop", 87.16, .8], ["chime", 88.42, .6], ["blip", 88.6, .6], ["blip", 88.78, .3], ["blip", 88.96, .6], ["whoosh", 89.22, .8], ["blip", 89.6, .5], ["blip", 89.8, .5], ["blip", 90.0, .5], ["blip", 90.2, .5], ["blip", 90.4, .5]], (S, c) => {
    const esq = h("div", "abs", S, null, `inset:0;background:${CORAL};clip-path:polygon(0 0,62% 0,38% 100%,0 100%)`);
    const dir = h("div", "abs", S, null, `inset:0;background:${PETRO};clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%)`);
    anim(esq, [[83.54, { x: -700 }], [83.8, { x: 0 }, "expo"]]); anim(dir, [[83.54, { x: 700 }], [83.8, { x: 0 }, "expo"]]);
    const l1 = img(S, "look1", "left:20px;top:760px;width:400px"), l2 = img(S, "look2", "left:640px;top:760px;width:420px");
    pop(l1, 83.86, { s0: .4 }); pop(l2, 85.96, { s0: .4 }); respira(l1, .006); respira(l2, .006, 2.2, 1.3);
    const num = (n, x, t, cor) => { const e = h("div", "abs", S, n, `left:${x}px;top:470px;translate:-50% -50%;width:190px;height:190px;border-radius:50%;background:${cor};border:12px solid ${AM};font:900 150px/186px var(--v-display);color:${AM};text-align:center`); bate(e, t, 2.4); };
    num("1", 230, 83.86, MUST); num("2", 850, 85.96, "#7FE0D0");
    const T = (txt, x, y, t, cor) => { const e = h("div", "ono", S, txt, `left:${x}px;top:${y}px;font-size:66px;color:${cor};translate:-50% -50%`); pop(e, t, { s0: .3 }); };
    T("BÁSICO", 240, 655, 84.12, "#fff"); T("ELEGANTE", 260, 735, 85.08, "#fff");
    T("MODERNO", 830, 655, 86.5, MUST); T("ESTILOSO", 820, 735, 87.14, MUST);
    [[700, 920], [880, 1000], [760, 1180]].forEach(([x, y], i) => { const e = h("div", "ono", S, "✦", `left:${x}px;top:${y}px;font-size:80px;color:#fff;translate:-50% -50%`); pop(e, 88.4 + i * .18, { r0: -120 }); });
    const ou = h("div", "abs", S, "OU", `left:540px;top:1000px;translate:-50% -50%;width:170px;height:170px;border-radius:50%;background:#fff;border:10px solid ${AM};font:900 74px/150px var(--v-display);color:${AM};text-align:center`);
    anim(ou, [[85.74, { o: 0, s: 0, r: -180 }], [85.75, { o: 1 }, "lin"], [86.1, { s: 1, r: 0 }, "back"]]);
    // 28 · comenta 1 ou 2
    const fx1 = h("div", "abs", c.fixo, `COMENTE: <span style="color:${MUST}">1</span> OU <span style="color:#7FE0D0">2</span>`, `left:-20px;right:-20px;top:240px;padding:26px 0;background:${AM};border-top:8px solid #fff;border-bottom:8px solid #fff;text-align:center;font:900 78px var(--v-display);color:#fff;transform:rotate(-3deg)`);
    anim(fx1, [[89.19, { o: 0, y: -400 }], [89.2, { o: 1 }, "lin"], [89.55, { y: 0 }, "back"]]);
    comentarios(c.fixo, ["1!", "2!!!", "o 1 é mais ele", "2 sem dúvida", "1"], 89.6, .2, 1560);
    c.origem(540, 960).s(83.54, 1.08).s(84.0, 1.0, .4, "out").soco(85.96, .04).s(91.22, 1.06, 2.0, "out");
  });
  plano("28-final", 91.22, 96.5, [["boom", 91.88, 1], ["riser", 92.0, .5], ["flip", 92.86, 1], ["chime", 93.3, .4], ["swell", 94, .4]], (S, c) => {
    raios(S, AM, "#3A2860", 4);
    const p = h("div", "abs", S, `<small style="display:block;font:800 40px var(--v-sans);letter-spacing:.1em;color:${MUST}">FALTAM</small><b style="font:900 160px/1 var(--v-display);color:#fff">28 DIAS</b>`, `left:540px;top:900px;translate:-50% -50%;padding:40px 60px;background:${AM};border:12px solid #fff;border-radius:40px;text-align:center;white-space:nowrap`);
    bate(p, 91.4, 2.2); anim(p, [[91.399, { o: 0, s: 2.2 }], [91.4, { o: 1 }, "lin"], [91.54, { s: 1 }, "in"], [91.78, { s: 1.12 }, "out"], [92.0, { s: 1 }, "out"], [92.84, { o: 1 }], [92.9, { o: 0 }, "lin"]]);
    const carta = h("div", "abs", S, null, `left:190px;top:420px;width:700px;height:980px;transform-style:preserve-3d`);
    const fr = h("div", "abs", carta, `<div style="font:800 40px var(--v-sans);letter-spacing:.12em;color:${MUST}">EPISÓDIO</div><div style="font:900 300px/1 var(--v-display);color:#fff">3</div><div style="font:900 64px/1.05 var(--v-display);color:#fff;margin-top:30px">VOCÊS<br>DECIDEM</div>`,
      `inset:0;border-radius:44px;background:${VERDE};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 24px 0 rgba(0,0,0,.3);-webkit-text-stroke:0`);
    anim(carta, [[92.84, { o: 0, ry: -180, s: .6 }], [92.88, { o: 1 }, "lin"], [93.5, { ry: 0, s: 1 }, "back"]]);
    particulas(S, { n: 30, t0: 93.2, x: 540, y: 300, cores: [CORAL, MUST, VERDE, "#fff"], tam: [16, 30], vx: [-700, 700], vy: [-600, 0], g: 1200, forma: "conf", dur: 2.5 });
    c.origem(540, 900).s(91.22, 1.0).tremor(91.78, 14, .3).s(96.5, 1.08, 3.6, "out");
  });
})();

/* efeitos extras (pedido do usuário: mais efeitos), cada um preso a um movimento já existente na cena */
[["swoosh", 0.40, 0.5], ["swoosh", 1.90, 0.5], ["pop", 2.90, 0.5], ["blip", 3.30, 0.5], ["pop", 3.90, 0.6], ["swoosh", 5.36, 0.5], ["swoosh", 5.60, 0.5], ["pop", 6.90, 0.5], ["pop", 7.50, 0.5], ["pop", 7.70, 0.5], ["pop", 7.90, 0.5], ["blip", 11.00, 0.5], ["blip", 11.60, 0.5], ["pop", 12.80, 0.6], ["tick", 13.00, 0.5], ["pop", 14.00, 0.6], ["swell", 14.40, 0.4], ["swoosh", 16.70, 0.5], ["blip", 17.00, 0.4], ["pop", 18.60, 0.5], ["click", 19.40, 0.6], ["swoosh", 20.30, 0.5], ["pop", 21.50, 0.5], ["swoosh", 22.00, 0.5], ["swoosh", 24.80, 0.5], ["riser", 25.20, 0.4], ["pop", 26.20, 0.5], ["swoosh", 27.50, 0.5], ["chime", 29.20, 0.4], ["blip", 30.20, 0.5], ["hit", 31.10, 0.5], ["pop", 31.30, 0.5], ["flip", 32.80, 0.5], ["flip", 33.00, 0.5], ["flip", 33.20, 0.5], ["pop", 35.60, 0.6], ["swoosh", 35.90, 0.5], ["swoosh", 37.90, 0.5], ["swoosh", 40.50, 0.4], ["swoosh", 41.30, 0.4], ["swoosh", 42.00, 0.4], ["blip", 43.30, 0.5], ["tick", 45.00, 0.6], ["tick", 45.30, 0.6], ["swoosh", 46.80, 0.5], ["pop", 47.00, 0.5], ["pop", 48.70, 0.5], ["pop", 48.90, 0.5], ["pop", 51.40, 0.5], ["blip", 52.90, 0.5], ["pop", 54.00, 0.5], ["swoosh", 54.60, 0.5], ["blip", 55.70, 0.5], ["blip", 56.00, 0.5], ["pop", 58.20, 0.5], ["pop", 58.50, 0.5], ["click", 60.00, 0.6], ["blip", 60.40, 0.5], ["swell", 61.40, 0.4], ["pop", 63.20, 0.5], ["swoosh", 63.60, 0.5], ["blip", 64.80, 0.5], ["pop", 66.20, 0.5], ["swoosh", 68.30, 0.5], ["swoosh", 69.00, 0.5], ["blip", 71.00, 0.5], ["pop", 71.60, 0.5], ["swoosh", 73.50, 0.5], ["pop", 74.00, 0.5], ["tick", 76.30, 0.5], ["pop", 78.50, 0.5], ["swoosh", 79.30, 0.5], ["blip", 81.60, 0.5], ["blip", 81.90, 0.5], ["blip", 82.20, 0.5], ["blip", 82.50, 0.5], ["riser", 82.90, 0.3], ["swoosh", 84.50, 0.5], ["blip", 85.40, 0.5], ["swoosh", 86.90, 0.5], ["blip", 87.60, 0.5], ["blip", 90.60, 0.5], ["blip", 90.80, 0.5], ["swoosh", 92.50, 0.5], ["pop", 94.20, 0.5], ["chime", 95.00, 0.5]].forEach(([k, t, g]) => MDS.sfx(k, t, g));
