/* Tulipas · Ofertas do Açougue — comercial de 15 s, 60 fps, trilha a 120 BPM (batida = 0,5 s).
 * Direção "Vitrine em brasa": escuro + luz vermelha volumétrica + fogo e brasas em canvas determinístico.
 * Assinatura de transição: corte da faca (a cena é fatiada em diagonal por uma lâmina de luz).
 * Preços, nomes e textos: copiados dos encartes enviados (roteiro.md). Não alterar.
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, clamp, lerp } = MDS;
  const W = 1080, H = 1920;

  // retângulos (em px da imagem recortada) de onde estavam etiqueta e rótulo do encarte: a etiqueta nova cobre exatamente isso
  const R = {
    acem: { w: 460, h: 305, tag: [122, 101, 460, 272], rot: [196, 83, 314, 143] },
    paleta: { w: 530, h: 255, tag: [251, 61, 530, 226], rot: [279, 41, 407, 99] },
    mocoto: { w: 490, h: 305, tag: [202, 129, 490, 294], rot: [241, 115, 385, 176] },
    rabo: { w: 510, h: 290, tag: [225, 115, 510, 279], rot: [261, 100, 481, 158] },
    peito: { w: 505, h: 310, tag: [183, 122, 505, 284], rot: [250, 96, 485, 154] },
    coxa: { w: 530, h: 270, tag: [251, 80, 530, 243], rot: [293, 13, 485, 118] },
    pernil: { w: 495, h: 265, tag: [206, 92, 495, 251], rot: [245, 68, 492, 128] },
    linguica: { w: 490, h: 290, tag: [204, 112, 490, 290], rot: [228, 43, 395, 153] },
  };
  const FRANGO = [
    { id: "peito", nome: "Peito s/ Osso", int: "21", T: 3.0 },
    { id: "coxa", nome: "Coxa c/<br>Sobrecoxa", int: "10", T: 4.0 },
    { id: "pernil", nome: "Pernil c/ Osso", int: "13", T: 5.0 },
    { id: "linguica", nome: "Linguiça<br>Perdigão", int: "21", T: 6.0 },
  ];
  const BOI = [
    { id: "acem", nome: "Acém", int: "37", T: 7.5 },
    { id: "paleta", nome: "Paleta", int: "37", T: 8.5 },
    { id: "mocoto", nome: "Mocotó", int: "19", T: 9.5 },
    { id: "rabo", nome: "Rabo Bovino", int: "39", T: 10.5 },
  ];

  /* ---------- aleatório determinístico ---------- */
  const rnd = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
  const bell = (t, a, pk, b) => t <= a || t >= b ? 0 : t < pk ? prog(t, a, pk, "out") : 1 - prog(t, pk, b, "in");

  /* ---------- fundo fixo ---------- */
  h("div", "abs fundo-base", null, null, "z-index:1");
  const cvAtras = h("canvas", "abs cv", null, null, "z-index:5");
  const cvFrente = h("canvas", "abs cv", null, null, "z-index:85");
  h("div", "abs vinheta", null, null, "z-index:84");
  for (const c of [cvAtras, cvFrente]) { c.width = 540; c.height = 960; }
  const cA = cvAtras.getContext("2d"), cF = cvFrente.getContext("2d");

  // fogo: partículas somadas (lighter), base no pé do quadro
  function fogo(ctx, t, I, alt, cx = 540, larg = 1250, base = 1990, n = 150) {
    if (I < .01) return;
    for (let i = 0; i < n; i++) {
      const L = .55 + rnd(i, 1) * .6, age = (t + rnd(i, 2) * L) % L, a = age / L;
      const x0 = cx + (rnd(i, 3) - .5) * larg * (1 - .35 * Math.abs(rnd(i, 3) - .5));
      const vy = (480 + rnd(i, 4) * 620) * alt;
      const y = base - vy * age;
      const x = x0 + Math.sin(t * 3.1 + i) * 34 * a + (rnd(i, 5) - .5) * 90 * a;
      const r = (70 + rnd(i, 6) * 95) * (1 - a * .55) * (.55 + alt * .45);
      const al = I * .2 * Math.pow(1 - a, 1.25) * Math.min(1, age / .05) * (.75 + .25 * Math.sin(t * 23 + i * 1.7));
      const col = a < .22 ? "255,226,150" : a < .55 ? "255,140,42" : "205,42,22";
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${col},${clamp(al)})`); g.addColorStop(.5, `rgba(${col},${clamp(al * .45)})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + i) * .15); ctx.scale(.62, 1.55 + a);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fill(); ctx.restore();
    }
  }
  // brasas que sobem (3 profundidades)
  function brasas(ctx, t, I, n, k0, tam, vel) {
    if (I < .01) return;
    for (let i = 0; i < n; i++) {
      const j = i + k0, L = 2.6 + rnd(j, 1) * 3.4, age = (t + rnd(j, 2) * L) % L, a = age / L;
      const x = rnd(j, 3) * 1180 - 50 + Math.sin(age * 1.6 + j) * 46 + age * 26;
      const y = 1960 - (110 + rnd(j, 4) * 260) * vel * age;
      const r = (1.6 + rnd(j, 5) * 3.6) * tam;
      const al = I * Math.sin(Math.PI * a) * (.6 + .4 * Math.sin(t * 17 + j));
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
      g.addColorStop(0, `rgba(255,236,170,${clamp(al)})`); g.addColorStop(.35, `rgba(255,140,40,${clamp(al * .8)})`); g.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 6.2832); ctx.fill();
    }
  }
  // luz volumétrica vinda de cima
  function raios(ctx, t, I) {
    if (I < .01) return;
    for (let k = 0; k < 6; k++) {
      const ang = (90 + (k - 2.5) * 13 + Math.sin(t * .45 + k * 1.3) * 4) * Math.PI / 180;
      const ox = 540 + (k - 2.5) * 70, oy = -160, len = 2500, sp = (5 + rnd(k, 9) * 4) * Math.PI / 180;
      const g = ctx.createLinearGradient(ox, oy, ox + Math.cos(ang) * 1800, oy + Math.sin(ang) * 1800);
      const al = I * (.1 + .06 * Math.sin(t * .9 + k * 2));
      g.addColorStop(0, `rgba(255,70,55,${al})`); g.addColorStop(.55, `rgba(220,30,30,${al * .4})`); g.addColorStop(1, "rgba(200,20,20,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(ang - sp) * len, oy + Math.sin(ang - sp) * len);
      ctx.lineTo(ox + Math.cos(ang + sp) * len, oy + Math.sin(ang + sp) * len); ctx.fill();
    }
  }
  // neblina quente
  function neblina(ctx, t, I) {
    for (let k = 0; k < 5; k++) {
      const x = 540 + Math.sin(t * .23 + k * 2.1) * 380, y = 700 + k * 260 + Math.cos(t * .19 + k) * 60, r = 520 + k * 40;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(160,24,26,${.16 * I})`); g.addColorStop(1, "rgba(160,24,26,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
  }
  // faíscas (rastro curto = motion blur) disparadas por eventos
  const FAISCAS = [];
  function faiscas(ctx, t) {
    ctx.lineCap = "round";
    for (const [t0, x0, y0, n, forca] of FAISCAS) {
      const age = t - t0; if (age < 0 || age > .75) continue;
      for (let j = 0; j < n; j++) {
        const an = rnd(j + t0 * 100, 1) * 6.2832, v = (500 + rnd(j + t0 * 100, 2) * 1100) * forca;
        const pos = a => [x0 + Math.cos(an) * v * a, y0 + Math.sin(an) * v * a + 1500 * a * a];
        const [x1, y1] = pos(age), [x2, y2] = pos(Math.max(0, age - .035));
        const al = 1 - age / .75;
        ctx.strokeStyle = `rgba(255,${190 + 50 * al | 0},90,${al})`; ctx.lineWidth = 2.5 + 3 * rnd(j, 3) * al;
        ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x1, y1); ctx.stroke();
      }
    }
  }
  // lâmina de luz (corte da faca)
  const LAMINAS = [];
  const LINHA = (cy, ang) => { const tg = Math.tan(ang * Math.PI / 180); return { y0: cy - 540 * tg, y1: cy + 540 * tg }; };
  function laminas(ctx, t) {
    for (const [t0, cy, ang] of LAMINAS) {
      const age = t - t0; if (age < 0 || age > .45) continue;
      const { y0, y1 } = LINHA(cy, ang), p = prog(t, t0, t0 + .11, "out"), al = 1 - prog(t, t0 + .1, t0 + .45, "out");
      const xa = -80, xb = lerp(-80, 1160, p), ya = y0 + (y1 - y0) * (-80 / 1080), yb = y0 + (y1 - y0) * (xb / 1080);
      for (const [lw, c] of [[70, `rgba(255,120,50,${.18 * al})`], [26, `rgba(255,200,120,${.5 * al})`], [7, `rgba(255,255,245,${al})`]]) {
        ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
      }
    }
  }
  // labareda de transição que cobre a tela (6,7–7,1 s)
  function explosao(ctx, t) {
    const a = bell(t, 6.62, 6.9, 7.16); if (a <= 0) return;
    fogo(ctx, t, 2.6 * a, 1.2 + 2.6 * a, 540, 1700, 2050, 170);
    const g = ctx.createLinearGradient(0, 1920, 0, 0);
    g.addColorStop(0, `rgba(255,200,90,${.95 * a})`); g.addColorStop(.45, `rgba(255,110,30,${.9 * a})`); g.addColorStop(1, `rgba(150,15,15,${.85 * a})`);
    ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
  }
  // intensidades ao longo do filme
  const fogoAtras = t => t < .3 ? .2 + .4 * prog(t, 0, .3) : t < 2.5 ? lerp(2.6, 1.8, prog(t, .45, 1.4, "out")) * prog(t, .3, .5, "expo") : .85;
  const altAtras = t => t < 2.5 ? lerp(.8, 1.45, bell(t, .3, .6, 2.4)) : .7;

  fx(t => {
    for (const [ctx, frente] of [[cA, false], [cF, true]]) {
      ctx.setTransform(.5, 0, 0, .5, 0, 0); ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
      if (!frente) {
        if (t < 11.6) {
          neblina(ctx, t, 1); raios(ctx, t, t < .3 ? prog(t, 0, .3) * .5 : t < .55 ? lerp(.5, 1.6, prog(t, .3, .55)) : lerp(1.6, 1, prog(t, .55, 1.6)));
          fogo(ctx, t, fogoAtras(t), altAtras(t));
          brasas(ctx, t, 1, 60, 0, .8, .8);
        }
      } else {
        brasas(ctx, t, t < 11.4 ? .9 : .7, 16, 500, 2.2, 1.4);
        faiscas(ctx, t); laminas(ctx, t); explosao(ctx, t);
        const fl = bell(t, .44, .5, .7) * .55; // clarão da batida da logo
        if (fl > 0) { ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = `rgba(255,190,120,${fl})`; ctx.fillRect(0, 0, W, H); }
      }
    }
  });

  /* ---------- peças ---------- */
  function letras(pai, texto, t0, st, cls) {
    return [...texto].map((c, i) => {
      const l = h("span", "l " + (cls || ""), pai, c === " " ? "&nbsp;" : c);
      const a = t0 + i * st;
      anim(l, [[a - .2, { o: 0, s: 2.4, y: -40, b: 14 }], [a, { o: 1, s: .92, y: 0, b: 0 }, "expo"], [a + .12, { s: 1 }, "out"]]);
      return l;
    });
  }
  function faixa(pai, texto, t0, t1) {
    const f = h("div", "abs faixa", pai, `<span>${texto}</span>`);
    anim(f, [[t0, { o: 0, x: -760, b: 18, sx: 1.25 }], [t0 + .32, { o: 1, x: 0, b: 0, sx: 1 }, "expo"], [t1, { o: 1, x: 0 }], [t1 + .26, { o: 0, x: 760, b: 18 }, "in"]]);
    return f;
  }
  const brilhoPor = (el, a, d = .55) => fx(t => { const p = prog(t, a, a + d, "inOut"); el.style.backgroundPosition = `${lerp(110, -10, p)}% 0`; });

  // produto + etiqueta nova no lugar exato da etiqueta do encarte
  function produto(pai, p, o) {
    const M = R[p.id], k = o.w / M.w, px = o.x, py = o.y;
    const g = h("div", "abs grp", pai);
    const corpo = h("div", "abs grp", g, null, o.rot ? `transform:rotate(${o.rot}deg);transform-origin:${px + o.w / 2}px ${py + M.h * k / 2}px` : "");
    const chao = h("div", "abs brilho-chao", corpo, null, `left:${px + o.w * .02}px;top:${py + M.h * k * .62}px;width:${o.w * .96}px;height:${M.h * k * .55}px`);
    const img = h("img", "abs prod", corpo, null, `left:${px}px;top:${py}px;width:${o.w}px`); img.src = MDS.img(p.id);
    const [x0, y0, x1, y1] = M.tag, pd = 12;
    const tw = (x1 - x0 + 2 * pd) * k, th = (y1 - y0 + 2 * pd) * k;
    const etq = h("div", "abs etq", corpo, `<div class="fd"></div>`, `left:${px + (x0 - pd) * k}px;top:${py + (y0 - pd) * k}px;width:${tw}px;height:${th}px`);
    const [a0, b0, a1, b1] = M.rot, pr2 = 6;
    const sob = Math.max(0, (b1 + pr2) - (y0 - pd)) * k;              // quanto o rótulo cobre o topo da etiqueta
    etq.style.paddingTop = `${Math.max(0, sob - th * .08)}px`;
    const fs = Math.min((th - Math.max(0, sob - th * .08)) * .78, th * .6, tw * .36);
    const pr = h("div", "preco", etq, `<span class="rs" style="font-size:${fs * .34}px">R$</span><span class="int" style="font-size:${fs}px">${p.int}</span><span class="col"><span class="ct" style="font-size:${fs * .36}px">,99</span><span class="kg" style="font-size:${fs * .3}px">kg</span></span>`);
    const dois = p.nome.includes("<br>");
    const rot = h("div", "abs rot", corpo, p.nome, `left:${px + (a0 - pr2) * k}px;top:${py + (b0 - pr2) * k}px;width:${(a1 - a0 + 2 * pr2) * k}px;height:${(b1 - b0 + 2 * pr2) * k}px;font-size:${dois ? 40 : 46}px`);
    const T = p.T;
    anim(etq, [[T - .07, { s: 1.22 }], [T + .2, { s: 1 }, "back"]]);
    anim(pr, [[T - .07, { o: 0, s: 2.1, b: 12 }], [T + .13, { o: 1, s: 1, b: 0 }, "back"]]);
    anim(rot, [[T - .14, { o: 0, x: -50, b: 10 }], [T + .1, { o: 1, x: 0, b: 0 }, "expo"]]);
    anim(chao, [[T - .3, { o: .2, s: .7 }], [T + .1, { o: 1, s: 1 }, "out"], [T + .7, { o: .8, s: 1.06 }, "sine"]]);
    MDS.floaty(img, 6, 2.2, T);
    if (!o.semFaisca) FAISCAS.push([T, px + (x0 + x1) / 2 * k, py + y0 * k + th * .4, 26, 1]);
    return { g, centro: [px + o.w / 2, py + M.h * k / 2] };
  }

  /* ---------- logo pequena (cenas 2 e 3) ---------- */
  {
    const w = 215, mini = h("img", "abs logo", null, null, `z-index:45;left:${540 - w / 2}px;top:1385px;width:${w}px`); mini.src = MDS.img("logo-tulipas");
    anim(mini, [[2.6, { o: 0, y: 40, b: 10 }], [3.0, { o: .92, y: 0, b: 0 }, "expo"], [6.6, { o: .92 }], [6.8, { o: 0 }, "lin"], [7.15, { o: 0 }], [7.4, { o: .92 }, "lin"], [11.05, { o: .92 }], [11.25, { o: 0, s: .8 }, "in"]]);
  }

  /* ================= CENA 1 · IMPACTO ================= */
  const C1_CORTE = 2.25, C1_LINHA = [1000, -22];
  cena({
    id: "impacto", nome: "Impacto", inicio: 0, fim: 2.55, z: 40,
    descricao: "Labareda acende a luz vermelha; logo cai em 3D e bate; OFERTAS DO / AÇOUGUE! letra a letra; corte da faca.",
    sfx: [["riser", 0, .8], ["boom", .5, 1], ["whoosh", .95, .7], ["hit", 1.5, .9], ["swoosh", C1_CORTE, 1]],
    montar(S) {
      const { y0, y1 } = LINHA(...C1_LINHA);
      const metades = [
        [`polygon(0 0,1080px 0,1080px ${y1}px,0 ${y0}px)`, 1],
        [`polygon(0 ${y0}px,1080px ${y1}px,1080px 1920px,0 1920px)`, -1],
      ];
      const dir = [Math.cos(22 * Math.PI / 180), -Math.sin(22 * Math.PI / 180)];
      for (const [clip, sg] of metades) {
        const M = h("div", "abs grp", S, null, `clip-path:${clip}`);
        const cam = h("div", "abs grp", M);
        anim(cam, [[.45, { s: 1 }], [2.25, { s: 1.045 }, "sine"]]);
        // logo
        const lw = 500, lg = h("img", "abs logo", cam, null, `left:${540 - lw / 2}px;top:250px;width:${lw}px`); lg.src = MDS.img("logo-tulipas");
        anim(lg, [[.12, { o: 0, s: 2.3, rx: 72, b: 24, y: -80 }], [.5, { o: 1, s: 1, rx: 0, b: 0, y: 0 }, "expo"], [.5, { sy: 1 }], [.56, { sy: .94 }, "out"], [.7, { sy: 1 }, "back"]]);
        const br = h("div", "abs brilho-logo", cam, null, `left:${540 - lw / 2}px;top:250px;width:${lw}px;height:${lw * 850 / 1026}px;-webkit-mask-image:url(${MDS.img("logo-tulipas")});mask-image:url(${MDS.img("logo-tulipas")})`);
        brilhoPor(br, 1.75, .5);
        // onda de choque
        const an = h("div", "abs anel", cam, null, "left:290px;top:205px;width:500px;height:500px");
        anim(an, [[.5, { o: 0, s: .4 }], [.52, { o: .9, s: .5 }, "lin"], [.95, { o: 0, s: 1.9 }, "out"]]);
        // títulos
        const t1 = h("div", "abs t3d t-branco", cam, null, "left:0;top:722px;width:1080px;font-size:112px");
        letras(t1, "OFERTAS DO", 1.0, .035);
        const t2 = h("div", "abs t3d t-amarelo", cam, null, "left:0;top:842px;width:1080px;font-size:166px");
        letras(h("div", "sombra3d", t2), "AÇOUGUE!", 1.5, .045);
        anim(t2, [[1.3, { rx: 50 }], [1.75, { rx: 0 }, "expo"]]);
        // saída: as duas metades deslizam ao longo do corte
        const d = 300 * sg;
        anim(M, [[C1_CORTE + .04, { x: 0, y: 0, o: 1, b: 0 }], [C1_CORTE + .36, { x: d * dir[0] - 30 * sg * .4, y: d * dir[1] - 60 * sg, o: 0, b: 10 }, "in"]]);
      }
      LAMINAS.push([C1_CORTE, ...C1_LINHA]);
      FAISCAS.push([.5, 540, 460, 40, 1.3], [1.5, 540, 930, 30, 1.1]);
    },
  });

  /* ================= CENA 2 · FRANGO E SUÍNO ================= */
  cena({
    id: "frango-suino", nome: "Frango e suíno", inicio: 2.3, fim: 7.0, z: 40,
    descricao: "Faixa FRANGO & SUÍNO; 4 produtos com chicote, zoom, subida e entrada lateral; preço bate na batida.",
    sfx: [["swoosh", 2.45, .8], ["whoosh", 2.72, .9], ["pop", 3.0, .9], ["whoosh", 3.72, .8], ["pop", 4.0, .9],
          ["whoosh", 4.72, .8], ["pop", 5.0, .9], ["whoosh", 5.72, .8], ["pop", 6.0, .9], ["riser", 6.3, .6], ["whoosh", 6.7, 1]],
    montar(S) {
      faixa(S, "Frango &amp; Suíno", 2.45, 6.62);
      const o = { x: 40, w: 890 };
      FRANGO.forEach((p, i) => {
        const M = R[p.id], y = 870 - M.h * (o.w / M.w) / 2;
        const { g } = produto(S, p, { ...o, y });
        const T = p.T, e0 = T - .3, s0 = T + .72, s1 = T + 1.0;
        let k;
        if (i === 0) k = [[e0, { x: 1150, b: 26, sx: 1.12, o: 1 }], [T, { x: 0, b: 0, sx: 1 }, "expo"], [s0, { x: 0, b: 0, sx: 1 }], [s1, { x: -1150, b: 26, sx: 1.12 }, "in"]];
        if (i === 1) k = [[e0, { s: .35, b: 22, o: 0 }], [T - .05, { s: 1, b: 0, o: 1 }, "expo"], [s0, { s: 1.02, b: 0, o: 1 }, "sine"], [s1, { s: 2.3, b: 30, o: 0 }, "in"]];
        if (i === 2) k = [[e0 - .01, { o: 0 }], [e0, { y: 1300, r: 9, b: 22, o: 1 }, "lin"], [T, { y: 0, r: 0, b: 0 }, "expo"], [s0, { y: 0, b: 0 }], [s1, { y: -1400, b: 26 }, "in"]];
        if (i === 3) k = [[e0, { x: -1150, b: 26, sx: 1.12, o: 1 }], [T, { x: 0, b: 0, sx: 1 }, "expo"], [6.72, { s: 1, o: 1 }], [6.95, { s: 1.25, o: 0 }, "in"]];
        anim(g, k);
      });
    },
  });

  /* ================= CENA 3 · BOVINOS ================= */
  const ANG = -22;
  cena({
    id: "bovinos", nome: "Bovinos", inicio: 6.85, fim: 11.5, z: 40,
    descricao: "Painel diagonal e nome fantasma; cada corte entra pela diagonal e sai fatiado pela lâmina.",
    sfx: [["swoosh", 7.02, .8], ["whoosh", 7.2, .9], ["pop", 7.5, .9], ["swoosh", 8.25, 1], ["pop", 8.5, .9],
          ["swoosh", 9.25, 1], ["pop", 9.5, .9], ["swoosh", 10.25, 1], ["pop", 10.5, .9], ["whoosh", 11.15, .9]],
    montar(S) {
      // painel diagonal
      const pn = h("div", "abs painel", S, null, `left:-260px;top:${860 - 260}px;width:1600px;height:520px;transform-origin:800px 260px`);
      const pnr = h("div", "abs grp", S); pnr.appendChild(pn); pnr.style.transform = `rotate(${ANG}deg)`; pnr.style.transformOrigin = "540px 860px";
      anim(pn, [[6.95, { o: 0, sx: .2 }], [7.3, { o: 1, sx: 1 }, "expo"], [11.0, { x: -60 }, "lin"], [11.3, { o: 0 }, "in"]]);
      faixa(S, "Bovinos", 7.0, 11.0);
      const o = { x: 40, w: 890, rot: -4 };
      const dir = [Math.cos(-ANG * Math.PI / 180), -Math.sin(-ANG * Math.PI / 180)];
      BOI.forEach((p, i) => {
        const M = R[p.id], y = 860 - M.h * (o.w / M.w) / 2, T = p.T, ent = i === 0 ? 7.12 : T - .26, corte = T + .75;
        // nome fantasma (vazado) no pé da composição
        const nm = p.nome.toUpperCase(), fsz = Math.min(190, 800 / (nm.length * .68));
        const fa = h("div", "abs fantasma", S, nm, `left:90px;top:${1270 - fsz / 2}px;width:860px;font-size:${fsz}px`);
        anim(fa, [[ent, { o: 0, x: 40 }], [T, { o: 1, x: 10 }, "expo"], [corte, { x: -10 }, "lin"], [corte + .25, { o: 0, x: -40 }, "in"]]);
        const ultimo = i === 3;
        const { y0, y1 } = LINHA(860, ANG);
        const metades = ultimo ? [[null, 0]] : [[`polygon(0 0,1080px 0,1080px ${y1}px,0 ${y0}px)`, 1], [`polygon(0 ${y0}px,1080px ${y1}px,1080px 1920px,0 1920px)`, -1]];
        for (const [clip, sg] of metades) {
          const Mt = h("div", "abs grp", S, null, clip ? `clip-path:${clip}` : "");
          const { g } = produto(Mt, p, { ...o, y, semFaisca: sg === -1 });
          anim(g, [[ent - .01, { o: 0 }], [ent, { x: 880, y: -356, b: 26, o: 1 }, "lin"], [i === 0 ? 7.45 : T, { x: 0, y: 0, b: 0 }, "expo"], [corte, { s: 1 }], [ultimo ? 11.45 : corte + .3, ultimo ? { s: .82, o: 0, b: 12 } : { s: 1 }, "in"]]);
          if (!ultimo) {
            const d = 280 * sg;
            anim(Mt, [[corte + .03, { x: 0, y: 0, o: 1, b: 0 }], [corte + .33, { x: d * dir[0], y: d * dir[1] - 50 * sg, o: 0, b: 10 }, "in"]]);
          }
        }
        if (!ultimo) LAMINAS.push([corte, 860, ANG]);
      });
    },
  });

  /* ================= CENA 4 · ENCERRAMENTO ================= */
  cena({
    id: "encerramento", nome: "Encerramento", inicio: 11.1, fim: 15, z: 50,
    descricao: "Íris vermelha; logo bate; endereço, WhatsApp, botão do grupo e validade; impacto final em 14 s.",
    sfx: [["hit", 11.5, 1], ["pop", 12.0, .8], ["pop", 12.25, .8], ["send", 12.5, .9], ["blip", 12.9, .6], ["boom", 14.0, 1], ["chime", 14.05, .5]],
    montar(S) {
      const fundo = h("div", "abs vermelho", S);
      const raio = h("div", "abs raios", fundo);
      fx(t => { raio.style.rotate = `${(t * 6).toFixed(2)}deg`; });
      fx(t => { const r = lerp(0, 1350, prog(t, 11.15, 11.5, "inOutExpo")); fundo.style.clipPath = `circle(${r.toFixed(1)}px at 540px 760px)`; });
      const anel = h("div", "abs anel", S, null, "border-width:14px");
      fx(t => { const r = lerp(0, 1350, prog(t, 11.15, 11.5, "inOutExpo")), a = t < 11.15 || t > 11.55 ? 0 : 1 - prog(t, 11.38, 11.55);
        Object.assign(anel.style, { left: `${540 - r}px`, top: `${760 - r}px`, width: `${2 * r}px`, height: `${2 * r}px`, opacity: a.toFixed(3) }); });
      const cam = h("div", "abs grp", S);
      anim(cam, [[11.5, { s: 1 }], [15, { s: 1.025 }, "sine"]]);
      // logo
      const lw = 560, lh = lw * 850 / 1026, ly = 250;
      const lg = h("img", "abs logo", cam, null, `left:${540 - lw / 2}px;top:${ly}px;width:${lw}px`); lg.src = MDS.img("logo-tulipas");
      anim(lg, [[11.32, { o: 0, s: .35, rx: -60, b: 20 }], [11.5, { o: 1, s: 1.07, rx: 0, b: 0 }, "expo"], [11.7, { s: 1 }, "out"], [14.0, { s: 1 }], [14.07, { s: 1.07 }, "out"], [14.4, { s: 1 }, "backSoft"]]);
      const br = h("div", "abs brilho-logo", cam, null, `left:${540 - lw / 2}px;top:${ly}px;width:${lw}px;height:${lh}px;-webkit-mask-image:url(${MDS.img("logo-tulipas")});mask-image:url(${MDS.img("logo-tulipas")})`);
      brilhoPor(br, 11.75, .5); const br2 = h("div", "abs brilho-logo", cam, null, br.style.cssText); brilhoPor(br2, 14.0, .5);
      // cartões
      const PIN = `<svg viewBox="0 0 24 24"><path fill="#7A0D13" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2z"/></svg>`;
      const TEL = `<svg viewBox="0 0 24 24"><path fill="#7A0D13" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>`;
      const c1 = h("div", "abs card", cam, `<div class="ic">${PIN}</div><div class="tx">Rua Nicolau Von Zuben, 606<br>Capela | <b>Vinhedo/SP</b></div>`, "top:770px;height:170px");
      const c2 = h("div", "abs card", cam, `<div class="ic">${TEL}</div><div class="tx"><span class="peq">WhatsApp</span><span class="tel">(19) 3786-1087</span></div>`, "top:965px;height:170px");
      anim(c1, IN(12.0, { dx: -220, dy: 0, d: .45 }));
      anim(c2, IN(12.25, { dx: 220, dy: 0, d: .45 }));
      const bt = h("div", "abs botao", cam, "PARTICIPE DO NOSSO<br>GRUPO DO WHATSAPP!", "top:1170px");
      const kb = [[12.38, { o: 0, s: .5, b: 10 }], [12.62, { o: 1, s: 1, b: 0 }, "back"]];
      for (let tb = 13.0; tb <= 14.5; tb += .5) kb.push([tb, { s: 1.045 }, "out"], [tb + .25, { s: 1 }, "sine"]);
      anim(bt, kb);
      const bb = h("div", "abs brilho-logo", cam, null, "left:110px;top:1170px;width:820px;height:164px;border-radius:82px;opacity:.6");
      brilhoPor(bb, 13.1, .6);
      const va = h("div", "abs validade", cam, "Ofertas válidas de <b>18/11 a 19/11</b><br>ou enquanto durarem os estoques.", "top:1380px");
      anim(va, IN(12.9, { dy: 40, d: .45 }));
      FAISCAS.push([11.5, 540, 480, 34, 1.2], [14.0, 540, 480, 46, 1.4], [12.62, 540, 1250, 22, .9]);
    },
  });
})();
