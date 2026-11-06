/* O Futuro Já Começou · projeto de referência do MOTION DESIGN STUDIO
 * Comercial de 30 s sobre IA. Mostra a API completa: cenas, tipografia cinética, UI, traço conector,
 * transições conectadas, legendas automáticas e efeitos sonoros sincronizados.
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, svg, path, draw, typeText, counter, floaty, classAt, SVGNS, palco, tipo, ui, fundo } = MDS;
  const mw = (p, txt, t, size, cls = "", d = .6) => tipo.palavra(p, txt, t, { size, cls, d });
  let me; // o ponto "agora" que vira "você" (atravessa as cenas 5 a 7)

  fundo.molduras({ z: 1, n: 6, seed: 11 });

  /* traço conector: muda de forma a cada cena */
  const anel = MDS.traco.anel;
  MDS.traco({
    z: 30, desenho: [0.05, 1.25],
    poses: {
      intro: [[-160, 1980], [60, 1760], [260, 1640], [470, 1600], [700, 1560], [880, 1420], [990, 1180], [1080, 880], [1240, 640]],
      s2: [[1220, -140], [920, 120], [560, 300], [300, 600], [420, 950], [820, 1160], [920, 1460], [620, 1760], [180, 2080]],
      s3: [[-220, 1560], [110, 1330], [120, 900], [270, 430], [640, 250], [990, 520], [1010, 1010], [720, 1360], [520, 2120]],
      s4: [[1260, 160], [960, 300], [720, 470], [860, 820], [1020, 1120], [840, 1420], [480, 1520], [140, 1720], [-240, 2020]],
      s5: [[-260, 1190], [-20, 1210], [170, 1165], [360, 1195], [540, 1180], [720, 1165], [905, 1200], [1090, 1170], [1330, 1185]],
      s6: anel(540, 1080, 280, 280),
      fim: anel(540, 1180, 400, 178),
    },
    roteiro: [[0, "intro"], [2.55, "intro"], [3.45, "s2"], [6.8, "s2"], [7.7, "s3"], [12.0, "s3"], [12.85, "s4"], [19.75, "s4"], [20.55, "s5"], [21.95, "s5"], [22.85, "s6"], [25.9, "s6"], [26.8, "fim"]],
  });

  cena({
    id: "abertura", nome: "Abertura", inicio: 0, fim: 2.9, z: 10,
    descricao: "Tipografia cinética pesada sobe de máscaras palavra por palavra; o ponto de “tudo.” cresce na cor de destaque e uma íris branca abre o filme.",
    montar(S) {
    const l1 = h("div", "hl", S, null, "top:520px;font:800 136px/1 var(--v-sans)");
    mw(l1, "A", 0.02, 136); l1.append(" "); mw(l1, "inteligência", 0.16, 136);
    const l2 = h("div", "hl", S, null, "top:676px;font:800 136px/1 var(--v-sans)");
    mw(l2, "artificial", 0.70, 136);
    const l3 = h("div", "hl", S, null, "top:850px;font:500 64px/1 var(--v-sans);letter-spacing:-.03em;color:var(--v-ink2)");
    mw(l3, "está", 1.22, 64); l3.append(" "); mw(l3, "mudando", 1.56, 64);
    const l4 = h("div", "hl", S, null, "top:950px;font:900 360px/1 var(--v-sans);letter-spacing:-.07em");
    "tudo".split("").forEach((c, i) => mw(l4, c, 1.98 + i * .045, 360, "", .7));
    const dot = h("span", "", l4, null, "display:inline-block;width:.2em;height:.2em;border-radius:50%;background:var(--v-ac);margin-left:.04em;vertical-align:baseline");
    anim(dot, [[2.12, { s: 0 }], [2.5, { s: 1 }, "back"], [2.52, { s: 1 }], [2.86, { s: 52 }, "in"]]);
    anim(l4, [[1.98, { s: 1.12 }], [2.7, { s: 1 }, "expo"]]);
    [l1, l2, l3].forEach((l, i) => anim(l, [[2.4 + i * .03, { y: 0, o: 1, b: 0 }], [2.8, { y: -70, o: 0, b: 10 }, "in"]]));
    // íris branca: revela o mundo da cena 2
    const T = h("div", "layer", palco(), null, "z-index:20");
    const iris = h("div", "abs", T, null, "left:540px;top:960px;width:100px;height:100px;margin:-50px 0 0 -50px;border-radius:50%;background:var(--v-bg)");
    anim(iris, [[2.8, { s: 0, o: 1 }], [3.3, { s: 26 }, "expo"], [3.32, { o: 1 }], [3.34, { o: 0 }, "lin"]]);
    anim(S, [[3.3, { o: 1 }], [3.31, { o: 0 }, "lin"]]);
    },
  });

  cena({
    id: "tudo-muda", nome: "Tudo muda", inicio: 2.9, fim: 7.2, z: 40,
    descricao: "Quatro interfaces flutuam em profundidade, cada uma entra na palavra falada: tarefas, desenho, aula, receita.",
    montar(S) {
    const conv = (el, cx, cy, i) => OUT(6.82 + i * .05, { dx: (540 - cx) * .8, dy: (720 - cy) * .8, s: .32, b: 12, d: .5 });
    // A · trabalhar
    const A = h("div", "card", S, null, "left:70px;top:300px;width:520px;height:384px");
    A.innerHTML = `<div class="wh"><span class="dots"><i></i><i></i><i></i></span>Tarefas · hoje</div>`;
    ["Relatório semanal", "Responder clientes", "Organizar agenda"].forEach((t, i) => {
      const r = h("div", "row", A, `<span class="ck">${ui.CHECK}</span><span class="t">${t}</span>`);
      classAt(r, "on", 3.62 + i * .17);
    });
    const ca = h("div", "chip soft abs", S, '<span class="dot"></span>Automático', "left:380px;top:258px");
    anim(ca, [...IN(4.0, { dy: 30, s: .7, e: "back", d: .5 }), ...conv(ca, 520, 280, 0)]);
    anim(A, [...IN(3.38), ...conv(A, 330, 492, 0)]);
    floaty(A, 9, 1.1, 0);
    // B · criar
    const B = h("div", "card", S, null, "left:520px;top:430px;width:500px;height:420px");
    B.innerHTML = `<div class="wh"><span class="dots"><i></i><i></i><i></i></span>Criar</div>`;
    const sv = svg(B, 500, 330, "display:block");
    const curve = path(sv, "M50 260 C 120 40, 260 40, 290 170 S 420 300, 450 70", { fill: "none", stroke: "var(--v-ink)", "stroke-width": 7, "stroke-linecap": "round" });
    draw(curve, 4.3, 5.0, "inOut");
    [[50, 260], [290, 170], [450, 70]].forEach(([x, y], i) => {
      const q = document.createElementNS(SVGNS, "rect"); q.setAttribute("x", x - 11); q.setAttribute("y", y - 11); q.setAttribute("width", 22); q.setAttribute("height", 22); q.setAttribute("rx", 4);
      q.setAttribute("fill", "var(--v-bg)"); q.setAttribute("stroke", "var(--v-ac)"); q.setAttribute("stroke-width", 4); sv.appendChild(q);
      fx(t => q.style.opacity = t > 4.3 + i * .33 ? 1 : 0);
    });
    const pen = document.createElementNS(SVGNS, "circle"); pen.setAttribute("r", 13); pen.setAttribute("fill", "var(--v-ac)"); sv.appendChild(pen);
    const LL = curve.getTotalLength();
    fx(t => { const p = curve.getPointAtLength(LL * prog(t, 4.3, 5.0, "inOut")); pen.setAttribute("cx", p.x); pen.setAttribute("cy", p.y); pen.style.opacity = t > 4.28 && t < 5.25 ? 1 : 0; });
    anim(B, [...IN(4.22, { dx: 60 }), ...conv(B, 770, 640, 1)]);
    floaty(B, 11, .95, 1.4);
    // C · aprender
    const C = h("div", "card", S, null, "left:60px;top:820px;width:540px;height:300px;padding:40px 40px 0");
    C.innerHTML = `<div class="lbl">Módulo 3</div><div style="font:700 40px/1.1 var(--v-sans);letter-spacing:-.03em;margin:8px 0 34px">IA na prática</div>
      <div style="height:16px;border-radius:9px;background:var(--v-line);overflow:hidden"><div class="bar" style="height:100%;width:0;background:var(--v-ac);border-radius:9px"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:18px" class="lbl"><span class="sub">Aula 1 de 12</span><span class="pct mono" style="color:var(--v-ink)">0%</span></div>`;
    const bar = C.querySelector(".bar"), pct = C.querySelector(".pct"), sub = C.querySelector(".sub");
    fx(t => bar.style.width = (100 * prog(t, 5.0, 5.75, "inOut")).toFixed(1) + "%");
    counter(pct, 0, 100, 5.0, 5.75, v => Math.round(v) + "%", "inOut");
    counter(sub, 1, 12, 5.0, 5.75, v => `Aula ${Math.round(v)} de 12`, "inOut");
    anim(C, [...IN(4.92, { dx: -50 }), ...conv(C, 330, 970, 2)]);
    floaty(C, 8, 1.2, 2.2);
    // D · ganhar dinheiro
    const D = h("div", "card", S, null, "left:450px;top:920px;width:520px;height:410px;padding:38px 40px 0");
    D.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><span class="lbl">Receita do mês</span><span class="chip soft up" style="height:48px;font-size:25px">+38%</span></div>
      <div class="bigNum num" style="margin-top:14px">R$ 0</div>`;
    const up = D.querySelector(".up"); anim(up, IN(6.35, { dy: 20, s: .6, e: "back", d: .45 }));
    const num = D.querySelector(".num");
    counter(num, 0, 12480, 5.95, 6.75, v => "R$ " + Math.round(v).toLocaleString("pt-BR"));
    const sv2 = svg(D, 440, 170, "display:block;margin-top:18px");
    const defs = document.createElementNS(SVGNS, "defs"); defs.innerHTML = '<linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5A1F" stop-opacity=".28"/><stop offset="1" stop-color="#FF5A1F" stop-opacity="0"/></linearGradient>'; sv2.appendChild(defs);
    const area = path(sv2, "M0 150 L70 130 L140 138 L210 100 L280 108 L350 64 L420 46 L490 14 L490 170 L0 170Z", { fill: "url(#ga)" });
    fx(t => area.style.opacity = prog(t, 6.2, 6.8));
    const ln = path(sv2, "M0 150 L70 130 L140 138 L210 100 L280 108 L350 64 L420 46 L490 14", { fill: "none", stroke: "var(--v-ac)", "stroke-width": 7, "stroke-linejoin": "round", "stroke-linecap": "round" });
    draw(ln, 6.0, 6.75, "out");
    anim(D, [...IN(5.9, { dx: 50 }), ...conv(D, 735, 1125, 3)]);
    floaty(D, 10, 1.0, 3.1);
    },
  });

  cena({
    id: "ferramentas", nome: "Ferramentas", inicio: 7.2, fim: 12.4, z: 41,
    descricao: "Os cards convergem num chat de IA; o pedido é digitado, a câmera recua e surgem as possibilidades e as que ainda são “?”.",
    montar(S) {
    const links = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
    const W = h("div", "card", S, null, "left:110px;top:360px;width:860px;height:640px");
    W.innerHTML = `<div class="wh"><span class="dots"><i></i><i></i><i></i></span>Novo chat<span style="margin-left:auto" class="mono">assistente de IA</span></div>
     <div class="body" style="position:absolute;left:0;right:0;top:88px;bottom:128px;padding:34px 38px"></div>
     <div style="position:absolute;left:30px;right:30px;bottom:28px;height:96px;border-radius:48px;background:#F6F3F0;display:flex;align-items:center;padding:0 14px 0 36px;font:500 31px var(--v-sans);letter-spacing:-.015em">
       <span class="inp"></span><span class="caret c1"></span>
       <span class="send" style="margin-left:auto;width:70px;height:70px;border-radius:50%;background:var(--v-ac);display:grid;place-items:center">
         <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg></span></div>`;
    const body = W.querySelector(".body"), inp = W.querySelector(".inp"), c1 = W.querySelector(".c1"), send = W.querySelector(".send");
    const PROMPT = "Quero tirar minha ideia do papel";
    typeText(inp, PROMPT, 7.5, 40, c1, 8.5);
    fx(t => { if (t >= 8.5) inp.textContent = ""; });
    anim(send, [[8.42, { s: 1 }], [8.52, { s: .82 }, "out"], [8.8, { s: 1 }, "back"]]);
    const ub = h("div", "abs", body, PROMPT, "right:38px;top:30px;max-width:560px;background:var(--v-ink);color:#fff;font:500 30px/1.3 var(--v-sans);padding:20px 28px;border-radius:30px 30px 8px 30px;letter-spacing:-.01em");
    anim(ub, IN(8.5, { dy: 40, s: .9, d: .5 }));
    const ar = h("div", "abs", body, `<span style="width:58px;height:58px;border-radius:50%;flex:none;background:radial-gradient(circle at 35% 30%,#FFC08A,#FF5A1F 55%,#C93A08)"></span><div class="resp" style="font:500 30px/1.35 var(--v-sans);letter-spacing:-.012em"><div class="r0" style="font-weight:700"></div></div>`,
      "left:38px;top:150px;right:38px;display:flex;gap:22px;align-items:flex-start");
    anim(ar, IN(8.85, { dy: 30, s: .95, d: .5 }));
    typeText(ar.querySelector(".r0"), "Bora! Um plano em 3 passos:", 8.95, 70);
    const resp = ar.querySelector(".resp");
    ["Validar a ideia com 10 pessoas", "Montar o protótipo", "Lançar em 30 dias"].forEach((t, i) => {
      const r = h("div", "", resp, `<span class="mono" style="color:var(--v-ac);margin-right:16px">0${i + 1}</span>${t}`, "margin-top:14px;color:var(--v-ink2)");
      anim(r, IN(9.4 + i * .14, { dy: 24, s: 1, b: 8, d: .45 }));
    });
    anim(W, [...IN(7.05, { dy: 0, s: .55, b: 22, d: .7 }), [9.15, { y: 0 }], [9.9, { y: -10 }, "expo"]]);
    // possibilidades
    const CX = 540, CY = 680;
    const POS = ["Automação", "Código", "Vídeo", "Análise de dados", "Design", "Marketing", "Pesquisa", "Escrita"];
    POS.forEach((name, i) => {
      const a = (-90 + i * 45) * Math.PI / 180, x = CX + Math.cos(a) * 560, y = CY + Math.sin(a) * 610;
      const c = h("div", "chip line abs", S, `<span class="dot"></span>${name}`, `left:${x}px;top:${y}px;transform-origin:center;height:76px;font-size:34px;padding:0 30px;translate:-50% -50%`);
      c.style.marginLeft = "0";
      const t0 = 9.26 + i * .06;
      anim(c, [[t0, { o: 0, x: CX - x, y: CY - y, s: .3, b: 10 }], [t0 + .7, { o: 1, x: 0, y: 0, s: 1, b: 0 }, "expo"]]);
      const lp = path(links, `M${CX} ${CY} Q ${(CX + x) / 2 + Math.sin(a) * 90} ${(CY + y) / 2 - Math.cos(a) * 90} ${x} ${y}`, { fill: "none", stroke: "#F2C9B4", "stroke-width": 3, "stroke-dasharray": "2 12", "stroke-linecap": "round" });
      fx(t => lp.style.opacity = prog(t, t0 + .25, t0 + .7));
    });
    // ...que muita gente ainda nem conhece
    for (let i = 0; i < 16; i++) {
      const a = (-78 + i * 22.5) * Math.PI / 180, rr = 1.0 + (i % 2) * .12;
      const x = CX + Math.cos(a) * 880 * rr, y = CY + Math.sin(a) * 1000 * rr;
      const g = h("div", "chip abs", S, `<span style="font:700 32px var(--v-sans);color:var(--v-mute)">?</span><span style="width:${110 + (i * 37) % 90}px;height:18px;border-radius:9px;background:var(--v-line)"></span>`,
        `left:${x}px;top:${y}px;translate:-50% -50%;height:76px;padding:0 30px;background:#FAF8F6;box-shadow:0 0 0 2px var(--v-line)`);
      const t0 = 10.15 + (i * 7 % 16) * .08;
      anim(g, [[t0, { o: 0, s: .7, b: 14 }], [t0 + .6, { o: .9, s: 1, b: 2.5 }, "expo"]]);
    }
    // câmera
    anim(S, [[9.15, { s: 1, y: 0 }], [9.95, { s: .76, y: 40 }, "expo"], [10.05, { s: .76 }], [11.95, { s: .55, y: 120 }, "out"], [12.02, { o: 1, b: 0, s: .55 }], [12.6, { o: 0, b: 24, s: 1.5, y: 120 }, "in"]]);
    },
  });

  cena({
    id: "aqui-voce-vai", nome: "Aqui você vai", inicio: 12.4, fim: 20.4, z: 42,
    descricao: "Trilho lateral em três etapas: busca, trilha com anel de progresso e uma ideia que vira app publicado.",
    montar(S) {
    const eb = h("div", "hl", S, "AQUI VOCÊ VAI", "top:236px;font:600 30px/1 var(--v-mono);letter-spacing:.22em;color:var(--v-ac)");
    anim(eb, [...IN(12.62, { dy: 30, s: 1, b: 10, d: .5 }), ...OUT(19.8, { dy: -40 })]);
    // indicador de etapas
    const steps = h("div", "abs", S, null, "left:165px;top:300px;width:750px;height:78px");
    const ind = h("div", "abs", steps, null, "left:0;top:0;width:240px;height:78px;border-radius:39px;background:var(--v-ink)");
    const SX = [0, 255, 510];
    anim(ind, [[13.3, { x: 0, sx: .2, o: 0 }], [13.6, { x: 0, sx: 1, o: 1 }, "expo"], [15.22, { x: 0 }], [15.62, { x: SX[1] }, "expo"], [17.6, { x: SX[1] }], [18.0, { x: SX[2] }, "expo"]]);
    ["Descobrir", "Aprender", "Criar"].forEach((n, i) => {
      const l = h("div", "abs", steps, n, `left:${SX[i]}px;top:0;width:240px;height:78px;display:grid;place-items:center;font:600 32px var(--v-sans);letter-spacing:-.02em;border-radius:39px;box-shadow:0 0 0 2px var(--v-line)`);
      const on = [13.45, 15.42, 17.8][i], off = [15.42, 17.8, 99][i];
      fx(t => l.style.color = t >= on && t < off ? "#fff" : "var(--v-ink2)");
    });
    anim(steps, [...IN(12.9, { dy: 40, s: .95, d: .55 }), ...OUT(19.8, { dy: -40 })]);

    const rail = h("div", "abs", S, null, "left:0;top:0;width:3240px;height:1920px");
    anim(rail, [[15.12, { x: 0, b: 0 }], [15.36, { b: 7 }, "out"], [15.62, { x: -1080, b: 0 }, "expo"],
                [17.52, { x: -1080, b: 0 }], [17.76, { b: 7 }, "out"], [18.02, { x: -2160, b: 0 }, "expo"]]);
    // A · descobrir
    const pA = h("div", "abs", rail, null, "left:0;top:0;width:1080px;height:1920px");
    for (let i = 0; i < 3; i++) {
      const rg = h("div", "abs", pA, null, `left:${540 - 180 - i * 140}px;top:${930 - 180 - i * 140}px;width:${360 + i * 280}px;height:${360 + i * 280}px;border-radius:50%;border:3px solid rgba(255,90,31,${.22 - i * .05})`);
      fx(t => { const p = ((t * .45 + i * .33) % 1); rg.style.scale = (0.85 + p * .25).toFixed(3); rg.style.opacity = (t > 12.8 ? (1 - p) : 0).toFixed(2); });
    }
    const sb = h("div", "card", pA, `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--v-ink2)" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg><span class="q"></span><span class="caret c2"></span>`,
      "left:110px;top:470px;width:860px;height:124px;border-radius:62px;display:flex;align-items:center;gap:24px;padding:0 44px;font:600 44px var(--v-sans);letter-spacing:-.025em");
    typeText(sb.querySelector(".q"), "novas tecnologias", 13.42, 23, sb.querySelector(".c2"), 15.2);
    anim(sb, IN(12.75, { dy: 80, s: .92 }));
    const tags = h("div", "abs", pA, null, "left:110px;top:690px;width:860px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center");
    ["Agentes de IA", "Automação", "Visão computacional", "Voz sintética", "No-code", "Modelos de linguagem"].forEach((n, i) => {
      const c = h("div", "chip line", tags, `<span class="dot"></span>${n}`, "height:84px;font-size:36px;padding:0 34px");
      anim(c, IN(14.2 + i * .09, { dy: 50, s: .6, e: "back", d: .55, b: 8 }));
    });
    // B · aprender
    const pB = h("div", "abs", rail, null, "left:1080px;top:0;width:1080px;height:1920px");
    const tr = h("div", "card", pB, null, "left:110px;top:470px;width:830px;height:800px");
    tr.innerHTML = `<div class="wh"><span class="dots"><i></i><i></i><i></i></span>Trilha · IA do zero<span class="mono" style="margin-left:auto">4 etapas</span></div>
      <div style="display:flex;align-items:center;gap:40px;padding:40px 44px 30px">
        <svg viewBox="0 0 200 200" width="210" height="210"><circle cx="100" cy="100" r="82" fill="none" stroke="var(--v-line)" stroke-width="18"/>
          <circle class="ringp" cx="100" cy="100" r="82" fill="none" stroke="var(--v-ac)" stroke-width="18" stroke-linecap="round" transform="rotate(-90 100 100)" stroke-dasharray="515.2" stroke-dashoffset="515.2"/></svg>
        <div><div class="lbl">Progresso</div><div class="bigNum rp" style="font-size:120px">0%</div></div></div>`;
    const STP = [["Fundamentos", 15.45], ["Prompts que funcionam", 15.86], ["Ferramentas de IA", 16.16], ["Fluxos reais", 16.7]];
    STP.forEach(([n, t0]) => { const r = h("div", "row", tr, `<span class="ck">${ui.CHECK}</span><span class="t">${n}</span>`); classAt(r, "on", t0); });
    const ringp = tr.querySelector(".ringp"), rp = tr.querySelector(".rp");
    const stepP = t => { let v = 0; STP.forEach(([, t0]) => v += prog(t, t0, t0 + .35, "expo") * 25); return v; };
    fx(t => { const v = stepP(t); ringp.style.strokeDashoffset = (515.2 * (1 - v / 100)).toFixed(1); rp.textContent = Math.round(v) + "%"; });
    const done = h("div", "chip ink abs", pB, `<span class="dot"></span>Concluído`, "left:640px;top:430px");
    anim(done, IN(17.0, { dy: 30, s: .6, e: "back", d: .5 }));
    // C · ideia → projeto real
    const pC = h("div", "abs", rail, null, "left:2160px;top:0;width:1080px;height:1920px");
    const note = h("div", "abs", pC, null, "left:250px;top:520px;width:580px;height:580px;border-radius:26px;background:var(--v-soft);box-shadow:0 30px 70px -30px rgba(120,50,10,.35);padding:70px 56px;transform-origin:center");
    note.innerHTML = `<div style="position:absolute;left:210px;top:-22px;width:160px;height:48px;background:rgba(255,138,61,.55);border-radius:6px;transform:rotate(-3deg)"></div>
      <div style="font:800 60px/1 var(--v-sans);letter-spacing:-.04em;position:relative;display:inline-block">Ideia
        <svg viewBox="0 0 200 30" width="200" height="30" style="position:absolute;left:-6px;bottom:-26px"><path class="und" d="M4 18 C 50 6, 120 26, 196 10" fill="none" stroke="var(--v-ac)" stroke-width="7" stroke-linecap="round"/></svg></div>
      <div style="font:600 50px/1.2 var(--v-sans);letter-spacing:-.03em;margin-top:52px;color:var(--v-ink2)">App que monta o cardápio da semana</div>`;
    draw(note.querySelector(".und"), 18.25, 18.6, "out");
    anim(note, [[17.9, { r: -4, ry: 0, o: 1 }], [18.78, { r: -4, ry: 0 }], [18.98, { r: -2, ry: 90, o: 1 }, "in"], [18.99, { o: 0 }, "lin"]]);
    const ph = h("div", "abs", pC, null, "left:300px;top:400px;width:480px;height:940px;border-radius:78px;background:var(--v-bg);border:16px solid var(--v-ink);overflow:hidden;box-shadow:0 50px 100px -40px rgba(60,30,10,.45);transform-origin:center");
    ph.innerHTML = `<div style="width:150px;height:36px;border-radius:20px;background:var(--v-ink);margin:18px auto 0"></div>`;
    const sk = h("div", "abs", ph, null, "left:30px;right:30px;top:90px");
    [[260, 40], [0, 0], [400, 150], [400, 150], [400, 150], [400, 100]].forEach(([w, hh], i) => { if (!w) return h("div", "", sk, null, "height:24px"); h("div", "", sk, null, `width:${w}px;height:${hh}px;border-radius:24px;background:#F1EDEA;margin-bottom:22px`); });
    const real = h("div", "abs", ph, null, "left:30px;right:30px;top:90px");
    const rt = h("div", "", real, `<div class="lbl" style="font-size:24px">Semana 12</div><div style="font:800 46px/1.05 var(--v-sans);letter-spacing:-.04em;margin:4px 0 24px">Cardápio</div>`);
    anim(rt, IN(19.12, { dy: 24, s: 1, b: 8, d: .4 }));
    [["Segunda", "Risoto de abóbora", "#FFB36B,#FF5A1F"], ["Terça", "Salada de grão-de-bico", "#FFD9A8,#FF9A3C"], ["Quarta", "Tacos de peixe", "#FF8A3D,#C93A08"]].forEach(([d, n, g], i) => {
      const r = h("div", "", real, `<span style="width:96px;height:96px;border-radius:24px;flex:none;background:linear-gradient(135deg,${g})"></span><div><div class="lbl" style="font-size:22px">${d}</div><div style="font:600 27px/1.2 var(--v-sans);letter-spacing:-.02em">${n}</div></div>`,
        "display:flex;gap:20px;align-items:center;height:128px;padding:0 16px;border-radius:26px;background:#FAF8F6;margin-bottom:22px");
      anim(r, IN(19.2 + i * .08, { dy: 26, s: 1, b: 8, d: .4 }));
    });
    const cta = h("div", "", real, "Gerar lista de compras", "height:96px;border-radius:48px;background:var(--v-ac);color:#fff;display:grid;place-items:center;font:700 29px var(--v-sans);letter-spacing:-.02em;margin-top:6px");
    anim(cta, IN(19.42, { dy: 26, s: .9, b: 8, d: .4 }));
    fx(t => sk.style.opacity = t < 19.12 ? 1 : 1 - prog(t, 19.12, 19.5));
    anim(ph, [[18.98, { ry: -90, o: 0 }], [18.99, { o: 1 }, "lin"], [19.22, { ry: 0 }, "out"], [19.86, { s: 1, y: 0, o: 1 }], [20.36, { s: .045, y: 310, o: .9 }, "inOut"], [20.42, { o: 0 }, "lin"]]);
    const pub = h("div", "chip ink abs", pC, `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--v-ac)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Publicado`, "left:640px;top:360px;height:72px;font-size:31px;padding:0 30px");
    anim(pub, [...IN(19.46, { dy: 30, s: .5, e: "back", d: .5 }), ...OUT(19.82, { dy: 200, s: .3, d: .4 })]);
    for (let i = 0; i < 10; i++) {
      const a = i * 36 * Math.PI / 180;
      const sp = h("div", "abs", pC, null, `left:${540 - 4}px;top:${870 - 24}px;width:8px;height:48px;border-radius:4px;background:var(--v-ac);transform-origin:center`);
      sp.style.rotate = (i * 36 + 90) + "deg";
      anim(sp, [[19.46, { o: 0, x: Math.cos(a) * 270, y: Math.sin(a) * 490, s: .3 }], [19.5, { o: 1 }, "lin"], [19.95, { o: 0, x: Math.cos(a) * 360, y: Math.sin(a) * 600, s: 1 }, "out"]]);
    }
    anim(S, [[20.3, { o: 1 }], [20.45, { o: 0 }, "lin"]]);
    },
  });

  cena({
    id: "o-futuro", nome: "O futuro", inicio: 20.4, fim: 22.3, z: 45,
    descricao: "A fita vira linha do tempo; o marcador AGORA trava em 2026 enquanto “já começou.” entra.",
    montar(S) {
    const l1 = h("div", "hl", S, null, "top:560px;font:850 172px/1 var(--v-sans)");
    mw(l1, "O", 20.5, 172); l1.append(" "); mw(l1, "futuro", 20.64, 172);
    const l2 = h("div", "hl", S, null, "top:752px;font:850 172px/1 var(--v-sans)");
    mw(l2, "já", 21.04, 172, "ac"); l2.append(" "); mw(l2, "começou.", 21.34, 172);
    [l1, l2].forEach((l, i) => anim(l, [[21.95 + i * .04, { y: 0, o: 1, b: 0 }], [22.35, { y: -80, o: 0, b: 12 }, "in"]]));
    const ticks = h("div", "abs", S, null, "left:0;top:1180px;width:2400px;height:200px");
    [2022, 2023, 2024, 2025, 2026, 2027, 2028].forEach((y, i) => {
      const x = 60 + i * 300;
      const tk = h("div", "abs", ticks, `<div style="width:3px;height:44px;background:${y > 2026 ? "var(--v-line)" : "#CFC8C1"};margin:0 auto 22px"></div>${y === 2026 ? "" : y}`,
        `left:${x - 60}px;top:-120px;width:120px;text-align:center;font:500 30px var(--v-mono);color:${y > 2026 ? "#D6D0CA" : "var(--v-mute)"}`);
    });
    anim(ticks, [[20.2, { x: 420, o: 0 }], [20.6, { o: 1 }, "out"], [21.2, { x: -720 + 0 }, "expo"], [21.95, { x: -735, o: 1 }, "lin"], [22.3, { o: 0 }, "lin"]]);
    const now = h("div", "abs", S, "AGORA", "left:440px;top:1236px;width:200px;text-align:center;font:600 30px var(--v-mono);letter-spacing:.2em;color:var(--v-ac)");
    anim(now, [...IN(21.1, { dy: 20, s: 1, b: 6, d: .4 }), ...OUT(21.95, { dy: 20, d: .3 })]);
    // ponto "agora" → "você"
    const L = h("div", "layer", palco(), null, "z-index:60");
    me = h("div", "abs", L, null, "left:540px;top:1180px;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:var(--v-ac);box-shadow:0 0 0 10px #fff, 0 10px 30px rgba(255,90,31,.5)");
    const pulse = h("div", "abs", L, null, "left:540px;top:1180px;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:4px solid var(--v-ac)");
    anim(pulse, [[21.0, { o: 0, s: 1 }], [21.05, { o: .9 }, "lin"], [21.7, { o: 0, s: 4 }, "out"], [24.2, { o: 0, s: 1, x: 330, y: 300 }], [24.25, { o: .9 }, "lin"], [24.9, { o: 0, s: 4.5 }, "out"]]);
    anim(me, [[20.3, { s: 0, o: 0 }], [20.36, { o: 1 }, "lin"], [20.75, { s: 1 }, "back"],
      [21.98, { x: 0, y: 0, s: 1 }], [22.75, { x: 330, y: 300, s: 1.3 }, "inOut"],
      [24.2, { s: 1.3 }], [24.32, { s: 1.75 }, "out"], [24.55, { s: 1.3 }, "back"],
      [25.0, { x: 330, y: 300 }], [25.75, { x: 0, y: -100, s: 1 }, "inOut"],
      [26.0, { x: 0, y: -100, s: 1, o: 1 }], [26.4, { y: 0, s: 0, o: 0 }, "in"]]);
    },
  });

  cena({
    id: "a-pergunta", nome: "A pergunta", inicio: 22.3, fim: 24.9, z: 46,
    descricao: "A fita fecha num anel com a multidão dentro; o ponto que é você fica de fora e pulsa.",
    montar(S) {
    const q = h("div", "hl", S, null, "top:300px;font:500 60px/1 var(--v-sans);letter-spacing:-.03em;color:var(--v-ink2)");
    mw(q, "A", 22.32, 60); q.append(" "); mw(q, "pergunta", 22.42, 60); q.append(" "); mw(q, "é,", 22.72, 60);
    const v = h("div", "hl", S, null, "top:390px;font:900 250px/1 var(--v-sans);letter-spacing:-.065em");
    mw(v, "você", 23.46, 250, "", .55);
    anim(v, [[23.46, { s: 1.15 }], [24.0, { s: 1 }, "expo"]]);
    const vf = h("div", "hl", S, null, "top:648px;font:750 100px/1 var(--v-sans);letter-spacing:-.045em");
    mw(vf, "vai", 23.62, 100); vf.append(" "); mw(vf, "ficar", 23.84, 100);
    const df = h("div", "abs", S, null, "left:120px;top:1418px;font:850 132px/1 var(--v-sans);letter-spacing:-.055em;white-space:nowrap");
    mw(df, "de", 24.06, 132); df.append(" "); mw(df, "fora?", 24.18, 132, "ac");
    [q, v, vf].forEach((e, i) => anim(e, OUT(24.68 + i * .05, { dy: -90, d: .38 })));
    anim(df, OUT(24.75, { dy: 60, d: .38 }));
    // multidão dentro do anel
    const CX = 540, CY = 1080, n = 30;
    for (let i = 0; i < n; i++) {
      const r = 31 * Math.sqrt(i + .6), a = i * 137.508 * Math.PI / 180;
      const tx = CX + Math.cos(a) * r, ty = CY + Math.sin(a) * r;
      const sa = (i * 71 % 360) * Math.PI / 180, sd = 700 + (i * 53 % 300);
      const d = h("div", "abs", S, null, `left:${tx - 15}px;top:${ty - 15}px;width:30px;height:30px;border-radius:50%;background:var(--v-ink)`);
      const t0 = 22.35 + (i % 10) * .07;
      anim(d, [[t0, { x: Math.cos(sa) * sd, y: Math.sin(sa) * sd, o: 0, s: .6 }], [t0 + .15, { o: 1 }, "lin"], [t0 + 1.0, { x: 0, y: 0, s: 1 }, "inOut"],
        [25.55, { x: 0, y: 0 }], [25.75, { x: Math.cos(a) * 26, y: Math.sin(a) * 26 }, "out"], [26.0, { x: 0, y: 0 }, "inOut"],
        [26.02, { x: 0, y: 0, s: 1, o: 1 }], [26.42 + (i % 6) * .02, { x: CX - tx, y: 1180 - ty, s: 0, o: 0 }, "in"]]);
    }
    },
  });

  cena({
    id: "cartela", nome: "Cartela final", inicio: 24.9, fim: 30, z: 47,
    descricao: "Tudo converge num botão Seguir; o cursor clica e ele vira Seguindo.",
    montar(S) {
    const a = h("div", "hl", S, null, "top:520px;font:850 178px/1 var(--v-sans)");
    mw(a, "Não", 25.42, 178); a.append(" "); mw(a, "fique", 25.56, 178);
    const b = h("div", "hl", S, null, "top:720px;font:850 178px/1 var(--v-sans)");
    mw(b, "de", 25.76, 178); b.append(" "); mw(b, "fora.", 25.88, 178, "ac");
    const btn = h("div", "abs", S, null, "left:270px;top:1100px;width:540px;height:160px;border-radius:80px;background:var(--v-ink);color:#fff;display:flex;align-items:center;justify-content:center;gap:20px;font:700 60px var(--v-sans);letter-spacing:-.03em;transform-origin:center");
    const lab = h("span", "", btn, "Seguir");
    const ic = h("span", "", btn, `<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`, "display:grid");
    fx(t => {
      const on = t >= 27.62;
      btn.style.background = on ? "var(--v-ac)" : "var(--v-ink)";
      lab.textContent = on ? "Seguindo" : "Seguir";
      ic.innerHTML = on ? `<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`
                        : `<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
    });
    anim(btn, [[26.25, { s: 0, o: 0 }], [26.3, { o: 1 }, "lin"], [26.85, { s: 1 }, "back"], [27.5, { s: 1 }], [27.6, { s: .93 }, "out"], [27.95, { s: 1 }, "back"], [29.0, { s: 1 }], [30, { s: 1.03 }, "sine"]]);
    const rip = h("div", "abs", S, null, "left:270px;top:1100px;width:540px;height:160px;border-radius:80px;border:5px solid var(--v-ac);transform-origin:center");
    anim(rip, [[27.62, { o: 0, s: 1 }], [27.64, { o: 1 }, "lin"], [28.4, { o: 0, sx: 1.25, sy: 1.9 }, "out"]]);
    const cur = h("div", "abs", S, `<svg viewBox="0 0 40 48" width="80" height="96"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="#100D0A" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>`, "left:610px;top:1170px;transform-origin:10% 6%");
    anim(cur, [[26.85, { x: 380, y: 600, o: 0 }], [26.9, { o: 1 }, "lin"], [27.5, { x: 0, y: 0 }, "expo"], [27.6, { s: .85 }, "out"], [27.8, { s: 1 }, "out"], [28.3, { x: 0, y: 0, o: 1 }], [28.9, { x: 260, y: 420, o: 0 }, "in"]]);
    const sub = h("div", "hl", S, "IA, tecnologia e projetos reais.", "top:1336px;font:500 44px/1 var(--v-sans);letter-spacing:-.02em;color:var(--v-ink2)");
    anim(sub, IN(26.7, { dy: 30, s: 1, b: 10, d: .6 }));
    if (MDS.PROJETO.perfil) {
      const hd = h("div", "hl", S, MDS.PROJETO.perfil, "top:1420px;font:600 36px var(--v-mono);color:var(--v-ac);letter-spacing:.04em");
      anim(hd, IN(26.9, { dy: 20, s: 1, b: 8, d: .5 }));
    }
    anim(S, [[25.0, { s: 1 }], [30, { s: 1.025 }, "lin"]]);
    },
  });

  /* efeitos sonoros: [tipo, segundo] */
  [
  ["boom", 1.98], ["whoosh", 2.62], ["pop", 3.38], ["tick", 3.62], ["tick", 3.79], ["tick", 3.96], ["pop", 4.22], ["pop", 4.92], ["pop", 5.9], ["chime", 6.35],
  ["whoosh", 6.82], ["pop", 7.05], ["send", 8.47], ["pop", 8.85], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => ["blip", 9.3 + i * .06]), ["swell", 10.1],
  ["whoosh", 12.0], ["pop", 12.75], ["pop", 14.2], ["whoosh", 15.12], ["tick", 15.45], ["tick", 15.86], ["tick", 16.16], ["tick", 16.7], ["pop", 17.0],
  ["whoosh", 17.52], ["flip", 18.8], ["chime", 19.46], ["whoosh", 19.9], ["pop", 20.4], ["boom", 21.04], ["whoosh", 22.0], ["boom", 23.46], ["pop", 24.2],
  ["whoosh", 25.0], ["pop", 26.3], ["send", 27.58], ["chime", 27.66],
  ].forEach(([k, t]) => MDS.sfx(k, t));
  for (let t = 7.5; t < 8.3; t += 1 / 13) MDS.sfx("key", t, .9);
  for (let t = 13.42; t < 14.15; t += 1 / 11) MDS.sfx("key", t, .9);
  
})();
