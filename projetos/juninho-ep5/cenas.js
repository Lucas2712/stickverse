/* Juninho · Episódio 5 — modo cartoon narrativo (referencias/modo-cartoon-narrativo.md, seção 4: série)
 * Mesma série do ep. 1 (personagem, casa, legenda, painel, traço); suspense noturno, destaque vermelho-alerta; painel escondido (a narração não cita dias nem saldo).
 * Narração acelerada a pedido (119,9 → 96,6 s, mesmos parâmetros do ep. 2). Sem música; ~2 efeitos/s.
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
  const HUD_ON = [];
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

  const NOITE = "#120c22";
  // celular à noite: mesmo enquadramento, quarto escuro atrás
  function celularNoite(p, fundoTela = "#F7F1E8") {
    const tela = h("div", "abs", p, null, `left:${TELA.x - 6}px;top:${TELA.y - 6}px;width:${TELA.w + 12}px;height:${TELA.h + 12}px;background:${fundoTela};overflow:hidden;font-family:var(--v-sans)`);
    full(p, "quarto-noite", "filter:blur(10px) brightness(.7)").style.zIndex = -1;
    img(p, "celular-maos", "left:0;top:0;width:1080px;filter:brightness(.82) saturate(.8)");
    h("div", "layer", p, null, "background:radial-gradient(circle at 540px 760px,transparent 30%,rgba(10,6,24,.55) 75%);pointer-events:none");
    return tela;
  }
  const cabecalhoDesconhecido = tela => {
    h("div", "abs", tela, `<span>23:47</span><span>●●● ▮</span>`, `left:0;right:0;top:0;height:58px;display:flex;justify-content:space-between;align-items:center;padding:8px 34px 0;font:700 22px var(--v-sans);color:${AM}`);
    const cab = h("div", "abs", tela, null, `left:0;right:0;top:58px;height:110px;display:flex;align-items:center;gap:18px;padding:0 26px;background:#fff;border-bottom:3px solid ${AM}`);
    h("div", "", cab, "?", `width:74px;height:74px;border-radius:50%;border:4px solid ${AM};background:#333;color:#fff;font:900 46px/66px var(--v-display);text-align:center`);
    h("div", "", cab, `<b style="font:800 30px var(--v-display);color:${AM};display:block">Número desconhecido</b><span style="font:600 20px var(--v-sans);color:${VERM}">sem foto · sem nome</span>`);
  };
  // pisca de lâmpada (suspense)
  const pisca = (S, a, b) => { const e = h("div", "layer", S, null, `background:${NOITE}`); fx(t => e.style.opacity = t >= a && t < b ? (Math.sin(t * 47) > .3 ? .55 : 0).toFixed(2) : 0); };
  const vinheta = (S, k = .7) => h("div", "layer", S, null, `background:radial-gradient(circle at 50% 50%,transparent 35%,rgba(10,6,24,${k}) 85%)`);
  const balaoFala = (p, txt, x, y, t, { w = 860, px = 54, cor = AM, fundo = "#fff" } = {}) => { const e = h("div", "abs", p, txt, `left:${x}px;top:${y}px;translate:-50% -50%;width:${w}px;padding:30px 40px;background:${fundo};border:9px solid ${AM};border-radius:40px;font:900 ${px}px/1.12 var(--v-display);color:${cor};text-align:center;box-shadow:0 10px 0 ${AM}`); pop(e, t, { s0: .3 }); return e; };
  // texto digitado por palavra (tempos da narração)
  const porPalavra = (el, pal, destaque) => { let last = -1; fx(t => { const n = pal.filter(p => t >= p[1] - .02).length; if (n !== last) { el.innerHTML = pal.slice(0, n).map(p => p[0] === destaque ? `<span style="color:${VERM}">${p[0]}</span>` : p[0]).join(" ") || "…"; last = n; } }); };
  // círculo vermelho desenhado em volta de (cx, cy)
  const circulo = (sv, cx, cy, r, a, b, w = 14) => draw(path(sv, `M${cx + r} ${cy - 10}C${cx + r + 10} ${cy - r - 20} ${cx - r - 20} ${cy - r - 20} ${cx - r} ${cy}C${cx - r + 10} ${cy + r + 20} ${cx + r + 20} ${cy + r + 10} ${cx + r - 5} ${cy - 30}`, { stroke: VERM, "stroke-width": w, "stroke-linecap": "round", fill: "none" }), a, b, "out");

  /* ================= 1 · vocês escolheram ================= */
  plano("01-escolheram", 0, 1.06, [["boom", 0.02, .8], ["blip", .2, .5], ["blip", .36, .5], ["blip", .52, .5], ["blip", .68, .5], ["blip", .84, .5]], (S, c) => {
    full(S, "quarto-tarde", "filter:blur(4px)");
    h("div", "layer", S, null, "background:rgba(42,27,71,.25)");
    placa(c.fixo, "VOCÊS ESCOLHERAM", 540, 560, .02, { px: 80, cor: MUST, txtCor: AM, r: -3 });
    comentarios(S, ["bagunçado!!", "BAGUNÇADO", "o 2 kkk", "bagunçado sim"], .2, .16);
    c.origem(540, 900).s(0, 1.05).s(1.06, 1.1, 1.06, "out");
  });
  plano("01-baguncado", 1.06, 2.42, [["hit", 1.08, 1], ["chime", 1.2, .7], ["pop", 1.4, .5]], (S, c) => {
    raios(S, PETRO, "#127C7C", 6);
    const j = close(S, "c-baguncado", { w: 1000 }); respira(j);
    carimbo(c.fixo, "BAGUNÇADO ✓", 540, 560, 1.08, { r: -8, px: 100 });
    c.origem(540, 900).s(1.06, 1.08).soco(1.08, .06);
  });

  /* ================= 2 · trato no visual ================= */
  plano("02-trato", 2.42, 4.66, [["swoosh", 2.44, .5], ["swoosh", 3.74, .7], ["chime", 4.18, .7], ["pop", 4.3, .5]], (S, c) => {
    raios(S, MUST, "#FFE48A", 5);
    const j = close(S, "m-orgulho", { w: 1000 }); respira(j);
    brilhos(c.fixo, [[260, 700, 80], [820, 680, 70], [540, 520, 90]], 4.16, .06);
    c.origem(540, 900).s(2.42, 1.08).s(4.66, 1.16, 2.2, "out");
  });

  /* ================= 3 · um jeito muito estranho ================= */
  plano("03-estranho", 4.66, 9.00, [["swell", 4.7, .6], ["riser", 6.4, .8], ["glitch", 8.14, 1], ["hit", 8.16, .7]], (S, c) => {
    const dia = full(S, "quarto-tarde"), noite = full(S, "quarto-noite");
    anim(noite, [[4.66, { o: 0 }], [7.6, { o: 1 }, "inOut"]]);
    vinheta(S, .8);
    const q = h("div", "ono", c.fixo, "?", `left:540px;top:900px;font-size:420px;color:#fff;translate:-50% -50%`);
    anim(q, [[8.12, { o: 0, s: 3, r: 30 }], [8.13, { o: 1 }, "lin"], [8.4, { s: 1, r: 0 }, "back"]]);
    pisca(S, 8.12, 8.9);
    c.origem(540, 1000).s(4.66, 1.0).s(8.1, 1.2, 3.4, "in").tremor(8.16, 16, .4);
  });

  /* ================= 4 · barbearia → lanchonete ================= */
  plano("04-barbearia", 9.00, 10.22, [["swoosh", 9.02, .5], ...Array.from({ length: 8 }, (_, i) => ["key", 9.36 + i * .09, .7]), ["pop", 9.74, .5]], (S, c) => {
    full(S, "barbearia");
    const tes = h("div", "ono", c.fixo, "✂", `left:620px;top:760px;font-size:300px;translate:-50% -50%`);
    fx(t => tes.style.rotate = (Math.sin(t * 40) * 14).toFixed(1) + "deg"); pop(tes, 9.3, { s0: .2 });
    particulas(S, { n: 26, t0: 9.36, x: 620, y: 760, cores: ["#9C6B3E", "#B98A5E"], tam: [8, 20], vx: [-400, 400], vy: [-300, 100], g: 1400, forma: "conf", dur: 1 });
    ono(c.fixo, "TEC TEC TEC", 540, 1440, 9.36, { r: -4, px: 110 });
    c.origem(540, 900).s(9.0, 1.0).s(10.22, 1.08, 1.2, "out");
  });
  plano("04-trabalho", 10.22, 12.16, [["whoosh", 10.24, .7], ["ding", 11.44, .5], ["pop", 11.6, .4]], (S, c) => {
    full(S, "lanchonete");
    const j = img(S, "m-avental", "left:600px;top:700px;width:400px;clip-path:inset(0 0 38% 0)"); respira(j, .006);
    anim(j, [[10.22, { x: 700 }], [10.7, { x: 0 }, "out"]]);
    c.origem(540, 1000).s(10.22, 1.0).s(12.16, 1.06, 1.94, "out");
  });

  /* ================= 5 · tudo normal… até que ================= */
  plano("05-normal", 12.16, 13.48, [["pop", 12.56, .7], ["chime", 12.6, .4], ["glitch", 13.08, .6], ["hit", 13.1, .5]], (S, c) => {
    fundo(S, "lanchonete");
    const j = img(S, "m-avental", "left:280px;top:520px;width:520px"); respira(j, .006);
    const pl = placa(c.fixo, "TUDO NORMAL ✓", 540, 1180, 12.54, { px: 70, cor: VERDE, r: -3 });
    fx(t => { if (t >= 13.06) { pl.style.background = VERM; pl.innerHTML = "ATÉ QUE…"; } else { pl.style.background = VERDE; pl.innerHTML = "TUDO NORMAL ✓"; } });
    c.origem(540, 900).s(12.16, 1.0).soco(13.06, .06).tremor(13.08, 10, .3);
  });

  /* ================= 6 · o homem entra ================= */
  plano("06-entra", 13.48, 15.20, [["ding", 13.5, .9], ["swell", 13.6, .6], ["whoosh", 13.88, .6], ["hit", 14.34, .6]], (S, c) => {
    full(S, "lanchonete", "filter:brightness(.55) saturate(.6)");
    const h1 = img(S, "h-sai", "left:300px;top:420px;width:480px;transform:scaleX(-1)");
    anim(h1, [[13.48, { x: -700, o: 1 }], [14.3, { x: 0 }, "out"]]);
    h1.style.filter = "brightness(0)";
    fx(t => h1.style.filter = t < 14.32 ? "brightness(0)" : "none");
    pisca(S, 13.86, 14.4);
    vinheta(S, .7);
    c.origem(540, 900).s(13.48, 1.0).s(15.2, 1.12, 1.7, "in").tremor(14.34, 8, .25);
  });

  /* ================= 7 · alguns segundos ================= */
  plano("07-encara", 15.20, 17.82, [["swoosh", 15.22, .5], ["tick", 16.18, .9], ["tick", 16.68, .9], ["tick", 17.18, .9], ["swell", 15.6, .4]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${NOITE}`);
    const h1 = img(S, "h-balcao", "left:-560px;top:-120px;width:2200px"); // close nos olhos
    vinheta(S, .85);
    const cnt = h("div", "abs", c.fixo, "", `left:540px;top:1240px;translate:-50% -50%;font:900 120px var(--v-display);color:#fff;-webkit-text-stroke:12px ${AM};paint-order:stroke fill`);
    fx(t => cnt.textContent = t < 16.18 ? "" : t < 16.68 ? "1…" : t < 17.18 ? "1… 2…" : "1… 2… 3…");
    c.origem(540, 500).s(15.2, 1.0).s(17.82, 1.15, 2.6, "inOut");
  });

  /* ================= 8 · a pergunta ================= */
  plano("08-pergunta", 17.82, 20.14, [["pop", 17.86, .8], ["key", 18.06, .5], ["key", 18.6, .5], ["key", 19.06, .5], ["hit", 19.34, .7]], (S, c) => {
    full(S, "lanchonete", "filter:brightness(.6) saturate(.6) blur(5px)");
    const h1 = img(S, "h-balcao", "left:60px;top:560px;width:900px");
    const b = balaoFala(c.fixo, "", 540, 470, 17.84, { px: 52 });
    porPalavra(b, [["Você", 17.82], ["é", 18.04], ["o", 18.2], ["Juninho", 18.24], ["que", 18.58], ["estudou", 18.72], ["no", 18.94], ["Colégio", 19.04], ["Central?", 19.32]], "Central?");
    vinheta(S, .6);
    c.origem(540, 900).s(17.82, 1.0).s(20.14, 1.06, 2.3, "out");
  });

  /* ================= 9 · Juninho estranha ================= */
  plano("09-estranhou", 20.14, 22.52, [["glitch", 20.54, .4], ["pop", 20.6, .5], ["pop", 21.96, .8]], (S, c) => {
    fundo(S, "lanchonete");
    const j = close(S, "m-confuso", { w: 1000 }); respira(j);
    ono(c.fixo, "?", 820, 560, 20.5, { r: 12, px: 200, cor: "#fff" });
    balaoFala(c.fixo, "…SIM?", 300, 600, 21.94, { w: 360, px: 70 });
    c.origem(540, 900).s(20.14, 1.1).s(22.52, 1.18, 2.4, "out");
  });

  /* ================= 10 · sorriso estranho ================= */
  plano("10-sorriso", 22.52, 26.16, [["swell", 22.6, .6], ["glitch", 22.98, .5], ["pop", 24.4, .8], ["hit", 25.72, .9], ["riser", 24.6, .6]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle at 50% 40%,#5a1f2a,${NOITE} 70%)`);
    const h1 = img(S, "h-sorriso", "left:160px;top:620px;width:760px"); respira(h1, .006);
    const b = balaoFala(c.fixo, "", 540, 440, 24.34, { px: 56, cor: VERM });
    porPalavra(b, [["Então", 24.36], ["você", 24.64], ["vai", 25.02], ["mesmo", 25.24], ["ao", 25.56], ["reencontro?", 25.7]], "reencontro?");
    c.origem(540, 1000).s(22.52, 1.0).s(25.7, 1.12).tremor(25.72, 10, .3);
  });

  /* ================= 11 · pagou e foi embora ================= */
  plano("11-embora", 26.16, 30.86, [["swoosh", 26.18, .4], ["pop", 27.36, .7], ["coin", 29.16, .9], ["click", 29.3, .6], ["whoosh", 30.18, .8], ["ding", 30.5, .7]], (S, c) => {
    full(S, "lanchonete", "filter:brightness(.6) saturate(.6)");
    const j = img(S, "m-avental", "left:-60px;top:640px;width:480px");
    const h1 = img(S, "h-sai", "left:520px;top:420px;width:480px");
    anim(h1, [[29.9, { x: 0, o: 1 }], [30.8, { x: 700, o: 1 }, "in"]]);
    balaoFala(c.fixo, "COMO ELE SABE?!", 300, 460, 27.34, { w: 520, px: 54 });
    const moeda = h("div", "abs", S, "$", `left:520px;top:1300px;width:80px;height:80px;border-radius:50%;background:${MUST};border:6px solid ${AM};font:900 46px/68px var(--v-display);text-align:center;color:${AM}`);
    anim(moeda, [[29.1, { o: 0, y: -300 }], [29.12, { o: 1 }, "lin"], [29.36, { y: 0 }, "in"], [29.5, { y: -40 }, "out"], [29.62, { y: 0 }, "in"]]);
    vinheta(S, .6);
    c.origem(540, 1000).s(26.16, 1.0).s(30.86, 1.08, 4.6, "out");
  });

  /* ================= 12 · sujeito esquisito ================= */
  plano("12-esquisito", 30.86, 33.52, [["swoosh", 30.88, .4], ["pop", 31.84, .6], ["glitch", 32.56, .5]], (S, c) => {
    fundo(S, "lanchonete");
    const j = close(S, "m-desconfia", { w: 1000 }); respira(j);
    const pen = h("div", "abs", c.fixo, "QUE SUJEITO<br>ESQUISITO…", `left:540px;top:500px;translate:-50% -50%;width:640px;padding:34px;border-radius:50%;background:#fff;border:9px solid ${AM};font:900 60px/1.05 var(--v-display);color:${AM};text-align:center`);
    pop(pen, 31.82, { s0: .3 });
    c.origem(540, 900).s(30.86, 1.1).s(33.52, 1.2, 2.6, "out");
  });

  /* ================= 13 · em casa: número desconhecido ================= */
  plano("13-casa", 33.52, 35.34, [["swell", 33.54, .5], ["swoosh", 34.2, .4], ["click", 35.0, .7]], (S, c) => {
    full(S, "quarto-noite");
    const j = img(S, "m-celular", "left:380px;top:640px;width:340px"); respira(j, .006);
    vinheta(S, .6);
    c.origem(540, 1100).s(33.52, 1.0).s(35.34, 1.12, 1.8, "out");
  });
  plano("13-notificacao", 35.34, 38.14, [["ding", 35.88, 1], ["glitch", 36.98, .6], ["swell", 37.2, .4]], (S, c) => {
    const tela = celularNoite(S, "#1d1530");
    h("div", "abs", tela, "23:47", `left:0;right:0;top:250px;text-align:center;font:800 120px var(--v-display);color:#fff`);
    const n = h("div", "abs", tela, null, `left:20px;right:20px;top:70px;padding:20px 22px;border-radius:28px;background:#fff;border:4px solid ${AM};box-shadow:0 8px 0 ${AM};display:flex;gap:18px;align-items:center`);
    h("div", "", n, "?", `width:72px;height:72px;flex:none;border-radius:50%;border:4px solid ${AM};background:#333;color:#fff;font:900 44px/64px var(--v-display);text-align:center`);
    h("div", "", n, `<b style="display:block;font:800 28px var(--v-display);color:${AM}">Número desconhecido</b><span style="font:600 24px var(--v-sans);color:${VERM}">nova mensagem</span>`);
    anim(n, [[35.86, { y: -260, o: 0 }], [35.87, { o: 1 }, "lin"], [36.2, { y: 0 }, "back"]]);
    vibra(tela, 35.9, .6, 8);
    c.origem(540, 420).s(35.34, 1.1).s(36.96, 1.35);
  });

  /* ================= 14 · a mensagem ================= */
  plano("14-mensagem", 38.14, 41.90, [["blip", 38.2, .5], ...[39.16, 39.36, 39.58, 40.02, 40.14, 40.32, 40.8, 40.9, 41.04, 41.18].map(t => ["key", t, .6]), ["hit", 41.36, .8]], (S, c) => {
    const tela = celularNoite(S); cabecalhoDesconhecido(tela);
    const b = h("div", "abs", tela, "", `left:22px;top:300px;width:470px;padding:22px 26px;border-radius:30px 30px 30px 8px;background:#fff;color:${AM};font:800 38px/1.2 var(--v-sans);border:4px solid ${AM};box-shadow:0 6px 0 ${AM}`);
    porPalavra(b, [["Você", 39.16], ["ainda", 39.36], ["acredita", 39.58], ["que", 40.02], ["aquele", 40.14], ["reencontro", 40.32], ["vai", 40.8], ["ser", 40.9], ["uma", 41.04], ["boa", 41.18], ["ideia?", 41.34]], "reencontro");
    c.origem(540, 560).s(38.14, 1.1).s(41.9, 1.32, 3.7, "inOut").tremor(41.36, 6, .3);
  });

  /* ================= 15 · não foi entregue ================= */
  plano("15-entregue", 41.90, 45.18, [["key", 42.3, .6], ["key", 42.4, .6], ["key", 42.5, .6], ["key", 42.6, .6], ["send", 42.9, .8], ["glitch", 43.98, 1], ["hit", 44.4, .7]], (S, c) => {
    const tela = celularNoite(S); cabecalhoDesconhecido(tela);
    h("div", "abs", tela, "Você ainda acredita que aquele reencontro vai ser uma boa ideia?", `left:22px;top:200px;width:470px;padding:22px 26px;border-radius:30px 30px 30px 8px;background:#fff;color:${AM};font:800 32px/1.2 var(--v-sans);border:4px solid ${AM}`);
    const r = h("div", "abs", tela, "quem é você?", `right:22px;top:520px;padding:20px 26px;border-radius:30px 30px 8px 30px;background:${CORAL};color:#fff;font:800 34px var(--v-sans);border:4px solid ${AM}`);
    pop(r, 42.88, { s0: .4 });
    const err = h("div", "abs", tela, "⚠ Mensagem não entregue", `right:22px;top:640px;font:800 26px var(--v-sans);color:${VERM}`);
    pop(err, 43.96, { s0: .3 });
    carimbo(c.fixo, "NÃO ENTREGUE", 540, 1180, 44.36, { r: -8, px: 96 });
    c.origem(540, 700).s(41.9, 1.15).tremor(44.4, 12, .3);
  });

  /* ================= 16 · desconfiado ================= */
  plano("16-desconfiado", 45.18, 49.84, [["swoosh", 45.2, .4], ["swell", 45.9, .5], ["boom", 47.04, .8], ["boom", 48.36, .7], ["riser", 48.8, .4]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${NOITE}`);
    full(S, "quarto-noite", "filter:blur(12px) brightness(.6)");
    const j = close(S, "m-desconfia", { w: 1000 }); respira(j);
    h("div", "layer", S, null, "background:radial-gradient(circle at 540px 1300px,rgba(120,180,255,.35),transparent 45%);mix-blend-mode:screen");
    ono(c.fixo, "QUEM?", 300, 560, 47.02, { r: -8, px: 140, cor: "#fff" });
    ono(c.fixo, "COMO SABIA?", 640, 760, 48.34, { r: 6, px: 100, cor: VERM });
    c.origem(540, 900).s(45.18, 1.08).s(49.84, 1.24, 4.6, "inOut").tremor(47.04, 8, .25);
  });

  /* ================= 17 · outra notificação ================= */
  plano("17-outra", 49.84, 52.14, [["ding", 50.46, 1], ["glitch", 50.6, .5], ["hit", 51.22, .6]], (S, c) => {
    const tela = celularNoite(S, "#1d1530");
    h("div", "abs", tela, "23:52", `left:0;right:0;top:250px;text-align:center;font:800 120px var(--v-display);color:#fff`);
    const n = h("div", "abs", tela, null, `left:20px;right:20px;top:70px;padding:20px 22px;border-radius:28px;background:#fff;border:4px solid ${AM};box-shadow:0 8px 0 ${AM};display:flex;gap:18px;align-items:center`);
    h("div", "", n, "?", `width:72px;height:72px;flex:none;border-radius:50%;border:4px solid ${AM};background:#333;color:#fff;font:900 44px/64px var(--v-display);text-align:center`);
    h("div", "", n, `<b style="display:block;font:800 28px var(--v-display);color:${AM}">Número desconhecido</b><span style="font:600 24px var(--v-sans);color:${VERM}">📷 enviou uma foto</span>`);
    anim(n, [[50.42, { y: -260, o: 0 }], [50.43, { o: 1 }, "lin"], [50.76, { y: 0 }, "back"]]);
    vibra(tela, 50.46, .6, 10);
    c.origem(540, 420).s(49.84, 1.2).s(51.2, 1.4);
  });

  /* ================= 18 · foto carregando / silêncio ================= */
  plano("18-silencio", 52.14, 57.24, [["swoosh", 52.16, .4], ["blip", 53.02, .5], ["swell", 55.14, .8], ["riser", 56.0, .5]], (S, c) => {
    const tela = celularNoite(S); cabecalhoDesconhecido(tela);
    const foto = h("div", "abs", tela, null, `left:22px;top:200px;width:500px;height:760px;border-radius:24px;border:5px solid ${AM};background:url(${MDS.img("turma")}) 50% 45%/170% auto`);
    anim(foto, [[53.0, { o: 0, s: .7, b: 30 }], [53.04, { o: 1 }, "lin"], [53.4, { s: 1 }, "back"], [54.2, { b: 0 }, "out"]]);
    const fade = h("div", "layer", S, null, `background:${NOITE}`);
    anim(fade, [[56.4, { o: 0 }], [56.6, { o: .55 }, "out"]]);
    placa(c.fixo, "…", 540, 1500, 56.54, { px: 90, cor: AM });
    c.origem(540, 640).s(52.14, 1.05).s(55.12, 1.25).s(57.24, 1.32, 2.1, "inOut");
  });

  /* ================= 19 · a foto da turma ================= */
  plano("19-turma", 57.24, 63.30, [["swoosh", 57.26, .5], ["pop", 59.04, .8], ["pop", 60.0, .8], ["pop", 60.6, .5], ["pop", 60.8, .5], ["pop", 61.0, .5], ["glitch", 62.08, .8], ["hit", 62.32, .6]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${PETRO}`);
    const f = full(S, "turma");
    fx(t => f.style.filter = t >= 62.06 ? `sepia(.4) contrast(1.15) ${Math.sin(t * 40) > .6 ? "invert(.1)" : ""}` : "sepia(.4)");
    const tag = (txt, x, y, t, cor) => { const e = h("div", "abs", c.fixo, txt, `left:${x}px;top:${y}px;translate:-50% -50%;padding:10px 24px;background:${cor};border:6px solid ${AM};border-radius:16px;font:900 44px var(--v-display);color:${AM};white-space:nowrap`); pop(e, t, { s0: .3 }); };
    tag("JUNINHO", 660, 680, 59.02, MUST); tag("LARA", 520, 1100, 59.98, CORAL);
    vinheta(S, .5);
    c.origem(600, 1000).s(57.24, 1.0).s(62.06, 1.08).tremor(62.1, 8, .3);
  });

  /* ================= 20 · o círculo vermelho ================= */
  plano("20-circulo", 63.30, 66.44, [["swoosh", 63.32, .4], ["riser", 63.6, .6], ["key", 64.54, .6], ["key", 64.7, .6], ["key", 64.86, .6], ["boom", 65.6, 1]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${PETRO}`);
    full(S, "turma", "filter:sepia(.5) brightness(.75)");
    const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:-8px");
    circulo(sv, 715, 600, 130, 64.52, 65.4, 16);
    const mira = h("div", "abs", S, null, `left:585px;top:462px;width:260px;height:260px;border-radius:50%;box-shadow:0 0 0 2000px rgba(10,6,24,.55)`);
    anim(mira, [[65.3, { o: 0 }], [65.6, { o: 1 }, "out"]]);
    c.origem(715, 600).s(63.3, 1.0).s(65.58, 1.25).tremor(65.6, 12, .3);
  });

  /* ================= 21 · zoom: quem é? ================= */
  plano("21-zoom", 66.44, 70.04, [["whoosh", 66.84, 1], ["hit", 66.9, .6], ["riser", 67.6, .8], ["boom", 68.72, 1], ["glitch", 68.74, .8]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${NOITE}`);
    const f = full(S, "turma", "filter:sepia(.5)");
    const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:-8px");
    circulo(sv, 715, 600, 130, 66.44, 66.45, 16);
    // o rosto fica escondido: o vídeo não revela quem é (gancho do próximo episódio)
    const sombra = h("div", "abs", S, null, `left:620px;top:470px;width:190px;height:240px;border-radius:50% 50% 44% 44%;background:#0b0816`);
    anim(sombra, [[68.7, { o: 0 }], [68.72, { o: 1 }, "lin"]]);
    const q = h("div", "ono", S, "?", `left:715px;top:590px;font-size:150px;color:${VERM};translate:-50% -50%;-webkit-text-stroke:8px #fff`);
    anim(q, [[68.72, { o: 0, s: 2 }], [68.73, { o: 1 }, "lin"], [69.0, { s: 1 }, "back"]]);
    pisca(S, 68.72, 69.6);
    c.origem(715, 600).s(66.44, 1.25).s(66.84, 2.6, .35, "inExpo").s(68.7, 3.2, 1.8, "inOut").tremor(68.74, 18, .5);
  });

  /* ================= 22 · completamente assustado ================= */
  plano("22-assustado", 70.04, 72.10, [["boom", 70.06, .9], ["hit", 70.96, .8], ["glitch", 71.0, .6], ["pop", 71.3, .5]], (S, c) => {
    full(S, "quarto-noite", "filter:brightness(.6)");
    const j = img(S, "m-derruba", "left:260px;top:420px;width:560px");
    const cel = h("div", "abs", S, null, `left:200px;top:820px;width:90px;height:170px;border-radius:18px;background:#2E2E3A;border:7px solid ${AM}`);
    anim(cel, [[70.04, { y: 0, r: -20 }], [70.9, { y: 900, r: 200 }, "in"]]);
    ono(c.fixo, "!!!", 820, 560, 70.94, { r: 10, px: 200, cor: VERM });
    c.origem(540, 900).s(70.04, 1.0).soco(70.94, .08).tremor(70.96, 20, .5);
  });

  /* ================= 23 · alguém que não via há anos ================= */
  plano("23-anos", 72.10, 77.34, [["swell", 72.12, .6], ["tick", 73.0, .6], ["tick", 73.2, .6], ["tick", 73.4, .6], ["boom", 74.14, .8], ["riser", 75.2, .6], ["hit", 76.7, .8]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:radial-gradient(circle at 50% 45%,#2e1b46,${NOITE} 70%)`);
    const sil = h("div", "abs", S, null, `left:340px;top:520px;width:400px;height:900px`);
    h("div", "abs", sil, null, `left:110px;top:0;width:180px;height:220px;border-radius:50% 50% 44% 44%;background:#05030c`);
    h("div", "abs", sil, null, `left:20px;top:200px;width:360px;height:700px;border-radius:140px 140px 30px 30px;background:#05030c`);
    const q = h("div", "ono", sil, "?", `left:200px;top:110px;font-size:170px;color:${VERM};translate:-50% -50%;-webkit-text-stroke:8px #fff`);
    pop(sil, 72.12, { s0: .8 }); MDS.floaty(sil, 10, 1.6);
    const anos = h("div", "abs", c.fixo, "", `left:540px;top:1480px;translate:-50% -50%;font:900 90px var(--v-display);color:#fff;-webkit-text-stroke:10px ${AM};paint-order:stroke fill;white-space:nowrap`);
    fx(t => anos.textContent = t < 72.9 ? "" : "2016 → HOJE");
    ono(c.fixo, "POR QUÊ?", 540, 440, 74.14, { r: -6, px: 130, cor: MUST });
    c.origem(540, 900).s(72.1, 1.0).s(77.34, 1.14, 5.2, "inOut").tremor(76.7, 10, .3);
  });

  /* ================= 24 · como conseguiu a foto? ================= */
  plano("24-foto", 77.34, 80.40, [["swoosh", 77.36, .5], ["flip", 78.5, .9], ["swoosh", 78.9, .6], ["pop", 79.4, .5], ["hit", 79.76, .8]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${NOITE}`);
    raios(S, "#1d1530", "#24193c", 4);
    const f = h("div", "abs", S, null, `left:240px;top:480px;width:600px;height:860px;background:#fff url(${MDS.img("turma")}) 50% 50%/cover;border:16px solid #fff;box-shadow:0 20px 0 rgba(0,0,0,.4)`);
    anim(f, [[77.34, { r: -8, s: .9 }], [78.48, { r: -8 }], [79.2, { r: 352, s: 1 }, "inOut"]]);
    for (let i = 0; i < 6; i++) { const e = h("div", "ono", c.fixo, "?", `left:${160 + (i * 157) % 760}px;top:${460 + (i % 3) * 420}px;font-size:${100 + (i % 2) * 40}px;color:${i % 2 ? VERM : "#fff"};translate:-50% -50%`); pop(e, 78.5 + i * .08, { r0: -60 }); }
    carimbo(c.fixo, "QUEM ENVIOU?", 540, 1500, 79.74, { r: -6, px: 96 });
    c.origem(540, 900).s(77.34, 1.0).tremor(79.76, 12, .3);
  });

  /* ================= 25 · o reencontro esconde mais ================= */
  plano("25-reencontro", 80.40, 85.00, [["swell", 80.42, .7], ["riser", 81.4, .8], ["glitch", 82.3, .8], ["boom", 82.92, 1], ["hit", 84.0, .6]], (S, c) => {
    const f = full(S, "festa");
    fx(t => f.style.filter = `brightness(${(1 - .55 * prog(t, 80.6, 82.3, "inOut")).toFixed(2)}) saturate(${(1 - .6 * prog(t, 80.6, 82.3)).toFixed(2)})`);
    h("div", "layer", S, null, "background:linear-gradient(180deg,transparent,rgba(120,10,20,.35))");
    const t = h("div", "abs", S, "REENCONTRO<br><span style='font-size:64px;color:" + CORAL + "'>TURMA 2016</span>", `left:110px;top:300px;width:860px;text-align:center;font:900 98px/1 var(--v-display);color:${AM};letter-spacing:-.02em`);
    const sv = svg(c.fixo, 1080, 1920, "position:absolute;left:0;top:0");
    draw(path(sv, "M200 240L330 420L280 520L420 700L380 820L520 1000", { stroke: "#0b0816", "stroke-width": 14, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }), 82.28, 82.5, "out");
    carimbo(c.fixo, "SEGREDO?", 540, 1180, 82.9, { r: -10, px: 120 });
    vinheta(S, .7);
    c.origem(540, 900).s(80.4, 1.0).s(85.0, 1.12, 4.6, "in").tremor(82.92, 14, .4);
  });

  /* ================= 26 · votação ================= */
  plano("26-votacao", 85.00, 87.94, [["hit", 85.04, .7], ["boom", 85.54, 1], ["blip", 86.0, .5], ["blip", 86.3, .5], ["flip", 87.0, .8], ["pop", 87.36, .6]], (S, c) => {
    raios(S, VERM, "#F2545F", 8);
    const pl = h("div", "abs", S, `VOTAÇÃO`, `left:540px;top:700px;translate:-50% -50%;padding:40px 70px;background:${AM};border:12px solid #fff;border-radius:36px;font:900 150px var(--v-display);color:#fff;box-shadow:0 20px 0 rgba(0,0,0,.3)`);
    bate(pl, 85.02, 2.5, -4); pl.style.rotate = "-4deg";
    const j = close(S, "m-pensa", { w: 760, base: 1720 }); respira(j);
    comentarios(S, ["eita 😳", "QUEM É??", "tô com medo"], 86.0, .3, 1500, 300);
    c.origem(540, 900).s(85.0, 1.0).tremor(85.04, 14, .3).soco(85.52, .06).s(87.94, 1.06, 2.9, "out");
  });

  /* ================= 27 · Lara × investigar ================= */
  plano("27-escolha", 87.94, 92.74, [["swoosh", 87.96, .7], ["hit", 88.42, .7], ["chime", 89.24, .6], ["flip", 90.06, .8], ["hit", 90.32, .7], ["pop", 90.84, .6], ["pop", 91.6, .5]], (S, c) => {
    const esq = h("div", "abs", S, null, `inset:0;background:${CORAL};clip-path:polygon(0 0,62% 0,38% 100%,0 100%)`);
    const dir = h("div", "abs", S, null, `inset:0;background:${NOITE};clip-path:polygon(62% 0,100% 0,100% 100%,38% 100%)`);
    anim(esq, [[87.94, { x: -700 }], [88.2, { x: 0 }, "expo"]]); anim(dir, [[87.94, { x: 700 }], [88.2, { x: 0 }, "expo"]]);
    const lara = h("div", "abs", S, null, `left:60px;top:820px;width:420px;height:420px;border-radius:50%;border:12px solid #fff;background:url(${MDS.img("lara")}) 50% 25%/150% auto`);
    pop(lara, 88.4, { s0: .3 });
    const j = img(S, "m-pensa", "left:580px;top:860px;width:480px"); pop(j, 90.3, { s0: .3 });
    const qd = h("div", "ono", S, "?", `left:820px;top:1100px;font-size:300px;color:#fff;translate:-50% -50%`); anim(qd, [[88.5, { o: 0, s: 0 }], [88.51, { o: 1 }, "lin"], [88.8, { s: 1 }, "back"], [90.26, { o: 1 }], [90.3, { o: 0 }, "lin"]]);
    const lupa = h("div", "ono", S, "🔍", `left:830px;top:1300px;font-size:150px;-webkit-text-stroke:0;translate:-50% -50%`); pop(lupa, 90.84, { r0: -60 });
    const T = (txt, x, y, t, cor) => { const e = h("div", "ono", S, txt, `left:${x}px;top:${y}px;font-size:72px;color:${cor};translate:-50% -50%;text-align:center;line-height:1`); pop(e, t, { s0: .3 }); };
    T("PERGUNTAR<br>PRA LARA", 270, 600, 88.4, "#fff"); T("INVESTIGAR<br>SOZINHO", 820, 620, 90.3, MUST);
    const ou = h("div", "abs", S, "OU", `left:540px;top:1060px;translate:-50% -50%;width:170px;height:170px;border-radius:50%;background:#fff;border:10px solid ${AM};font:900 74px/150px var(--v-display);color:${AM};text-align:center`);
    anim(ou, [[90.02, { o: 0, s: 0, r: -180 }], [90.03, { o: 1 }, "lin"], [90.4, { s: 1, r: 0 }, "back"]]);
    c.origem(540, 960).s(87.94, 1.08).s(88.4, 1.0, .4, "out").soco(90.3, .04).s(92.74, 1.05, 2.3, "out");
  });

  /* ================= 28 · o passado vai voltar ================= */
  plano("28-final", 92.74, 100.0, [["whoosh", 92.76, .9], ["blip", 93.1, .6], ["blip", 93.3, .6], ["blip", 93.5, .6], ["riser", 94.4, .7], ["boom", 96.0, 1], ["flip", 96.3, 1], ["glitch", 96.4, .6], ["swell", 97.4, .5]], (S, c) => {
    h("div", "abs", S, null, `inset:0;background:${NOITE}`);
    raios(S, "#1d1530", "#2a1c40", 3);
    const fx1 = h("div", "abs", c.fixo, `COMENTA: <span style="color:${CORAL}">LARA</span> OU <span style="color:${MUST}">INVESTIGAR</span>`, `left:-20px;right:-20px;top:240px;padding:24px 0;background:${AM};border-top:8px solid #fff;border-bottom:8px solid #fff;text-align:center;font:900 58px var(--v-display);color:#fff;transform:rotate(-3deg)`);
    anim(fx1, [[92.73, { o: 0, y: -400 }], [92.74, { o: 1 }, "lin"], [93.1, { y: 0 }, "back"]]);
    comentarios(c.fixo, ["LARA!", "investiga sozinho", "pergunta pra Lara", "INVESTIGAR"], 93.1, .2, 1500, 1700);
    const p = h("div", "ono", S, "O PASSADO<br>VAI VOLTAR…", `left:540px;top:900px;font-size:110px;color:${VERM};translate:-50% -50%;text-align:center;line-height:1;-webkit-text-stroke:12px #fff`);
    anim(p, [[93.46, { o: 0, s: 1.4, b: 20 }], [93.5, { o: 1 }, "lin"], [94.2, { s: 1, b: 0 }, "out"], [96.1, { o: 1 }], [96.2, { o: 0 }, "lin"]]);
    const carta = h("div", "abs", S, null, `left:190px;top:420px;width:700px;height:980px;transform-style:preserve-3d`);
    h("div", "abs", carta, `<div style="font:800 40px var(--v-sans);letter-spacing:.12em;color:${MUST}">EPISÓDIO</div><div style="font:900 300px/1 var(--v-display);color:#fff;-webkit-text-stroke:14px ${AM};paint-order:stroke fill">6</div><div style="font:900 64px/1.05 var(--v-display);color:#fff;margin-top:30px">VOCÊS<br>DECIDEM</div>`,
      `inset:0;border-radius:44px;background:${VERM};border:12px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 24px 0 rgba(0,0,0,.3)`);
    anim(carta, [[96.24, { o: 0, ry: -180, s: .6 }], [96.28, { o: 1 }, "lin"], [96.9, { ry: 0, s: 1 }, "back"]]);
    pisca(S, 96.0, 96.3);
    c.origem(540, 900).s(92.74, 1.0).tremor(96.0, 16, .35).s(100.0, 1.08, 3.7, "out");
  });
})();

/* efeitos extras (padrão da série: muitos efeitos): preenchem os vãos de ~0,4 s, presos à câmera e aos elementos que já se movem */
[["swoosh", 1.82, 0.45], ["pop", 2.96, 0.45], ["blip", 3.34, 0.45], ["swoosh", 5.24, 0.45], ["tick", 5.62, 0.45], ["pop", 6.0, 0.45], ["swoosh", 6.76, 0.45], ["pop", 7.14, 0.45], ["blip", 7.52, 0.45], ["swoosh", 8.66, 0.45], ["tick", 9.42, 0.45], ["pop", 10.56, 0.45], ["swoosh", 10.94, 0.45], ["pop", 12.08, 0.45], ["blip", 14.74, 0.45], ["swoosh", 15.88, 0.45], ["tick", 19.68, 0.45], ["pop", 20.06, 0.45], ["swoosh", 21.2, 0.45], ["pop", 21.58, 0.45], ["blip", 22.34, 0.45], ["swoosh", 23.48, 0.45], ["tick", 23.86, 0.45], ["pop", 25.0, 0.45], ["swoosh", 25.38, 0.45], ["pop", 26.52, 0.45], ["blip", 26.9, 0.45], ["swoosh", 27.66, 0.45], ["tick", 28.04, 0.45], ["pop", 28.42, 0.45], ["swoosh", 28.8, 0.45], ["pop", 29.56, 0.45], ["blip", 31.46, 0.45], ["swoosh", 32.22, 0.45], ["tick", 32.98, 0.45], ["pop", 34.5, 0.45], ["swoosh", 35.26, 0.45], ["pop", 36.4, 0.45], ["blip", 37.54, 0.45], ["swoosh", 37.92, 0.45], ["tick", 38.68, 0.45], ["pop", 39.06, 0.45], ["swoosh", 39.44, 0.45], ["pop", 39.82, 0.45], ["blip", 40.2, 0.45], ["swoosh", 40.58, 0.45], ["tick", 40.96, 0.45], ["pop", 41.72, 0.45], ["swoosh", 43.24, 0.45], ["pop", 43.62, 0.45], ["blip", 44.76, 0.45], ["swoosh", 45.52, 0.45], ["tick", 46.28, 0.45], ["pop", 46.66, 0.45], ["swoosh", 47.42, 0.45], ["pop", 47.8, 0.45], ["blip", 49.32, 0.45], ["swoosh", 49.7, 0.45], ["tick", 50.08, 0.45], ["pop", 51.6, 0.45], ["swoosh", 52.74, 0.45], ["pop", 53.5, 0.45], ["blip", 53.88, 0.45], ["swoosh", 54.26, 0.45], ["tick", 54.64, 0.45], ["pop", 55.4, 0.45], ["swoosh", 56.54, 0.45], ["pop", 56.92, 0.45], ["blip", 57.68, 0.45], ["swoosh", 58.06, 0.45], ["tick", 58.44, 0.45], ["pop", 59.58, 0.45], ["swoosh", 60.34, 0.45], ["pop", 61.48, 0.45], ["blip", 62.62, 0.45], ["swoosh", 63.0, 0.45], ["tick", 64.14, 0.45], ["pop", 65.28, 0.45], ["swoosh", 66.04, 0.45], ["pop", 66.42, 0.45], ["blip", 67.18, 0.45], ["swoosh", 67.94, 0.45], ["tick", 68.32, 0.45], ["pop", 69.08, 0.45], ["swoosh", 69.46, 0.45], ["pop", 70.6, 0.45], ["blip", 71.74, 0.45], ["swoosh", 72.5, 0.45], ["tick", 74.4, 0.45], ["pop", 74.78, 0.45], ["swoosh", 75.54, 0.45], ["pop", 75.92, 0.45], ["blip", 76.3, 0.45], ["swoosh", 77.06, 0.45], ["tick", 77.82, 0.45], ["pop", 78.2, 0.45], ["swoosh", 80.1, 0.45], ["pop", 80.86, 0.45], ["blip", 82.0, 0.45], ["swoosh", 83.52, 0.45], ["tick", 84.28, 0.45], ["pop", 84.66, 0.45], ["swoosh", 86.56, 0.45], ["pop", 87.7, 0.45], ["blip", 88.84, 0.45], ["swoosh", 89.6, 0.45], ["tick", 91.12, 0.45], ["pop", 91.88, 0.45], ["swoosh", 92.26, 0.45], ["pop", 93.78, 0.45], ["blip", 94.92, 0.45], ["swoosh", 95.3, 0.45], ["tick", 95.68, 0.45], ["pop", 96.82, 0.45], ["swoosh", 97.96, 0.45], ["pop", 98.34, 0.45], ["blip", 98.72, 0.45], ["swoosh", 99.1, 0.45], ["tick", 99.48, 0.45]].forEach(([k, t, g]) => MDS.sfx(k, t, g));
