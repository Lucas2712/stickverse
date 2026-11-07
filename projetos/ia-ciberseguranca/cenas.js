/* IA e a segurança dos seus dados · @matteu.ia
 * Direção de arte aprovada: "a planta da segurança e a falha escondida nela" (blueprint).
 * Azul cobalto + branco técnico; vermelho só nas falhas; ato 3 invertido em preto e vermelho.
 * Martian Mono (impacto, rótulos) + Instrument Sans (texto), grade suíça alinhada à esquerda (x = 80).
 * Assinaturas de transição: folha de prancha que desliza, zoom de lupa, inversão da planta.
 * Narração intacta (43,5 s). Sem música. Imagens: imagens/*.jpg em duotone.
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, svg, path, draw, typeText, at, palco, tipo } = MDS;
  const AZ = "#1E3BFF", BR = "#F4F5F7", VM = "#FF3B30", INK = "#0B0B0D", G2 = "#5A5F6E", X = 80;
  const BRANCO = "rgba(255,255,255,", AZUL = "rgba(30,59,255,";

  /* ---------- fundos ---------- */
  const fundo = (S, cor) => h("div", "layer", S, null, `inset:-80px;background:${cor}`);
  function grade(S, cor = BRANCO, t0 = null) {
    const g = h("div", "layer", S, null, `background-image:linear-gradient(${cor}.15) 1px,transparent 1px),linear-gradient(90deg,${cor}.15) 1px,transparent 1px),linear-gradient(${cor}.06) 1px,transparent 1px),linear-gradient(90deg,${cor}.06) 1px,transparent 1px);background-size:120px 120px,120px 120px,24px 24px,24px 24px;background-position:0 0`);
    if (t0 != null) fx(t => { const p = prog(t, t0, t0 + .9, "inOut"); g.style.clipPath = p >= 1 ? "none" : `inset(0 0 ${((1 - p) * 100).toFixed(1)}% 0)`; });
    return g;
  }
  const azul = (S, t0) => { fundo(S, AZ); return grade(S, BRANCO, t0); };
  const branco = (S, t0) => { fundo(S, BR); return grade(S, AZUL, t0); };
  /* folha que entra deslizando (assinatura) */
  const folha = (t, d = .42, de = "baixo") => { const k = { baixo: { y: 1920 }, direita: { x: 1080 }, esquerda: { x: -1080 } }[de];
    return [[t, { ...k }], [t + d, { x: 0, y: 0 }, "expo"]]; };
  const sombraTopo = S => h("div", "abs", S, null, "left:-80px;top:-60px;width:1240px;height:60px;background:linear-gradient(transparent,rgba(0,0,0,.35))");

  /* ---------- texto ---------- */
  const tam = css => +((css.match(/(\d+)px/) || [0, 80])[1]);
  // linha alinhada à esquerda; cada palavra sobe de uma máscara no seu tempo
  const linha = (p, x, y, css, itens) => {
    const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;white-space:nowrap;${css}`);
    itens.forEach(([w, t, sc], k) => { if (k) el.append(" "); const m = tipo.palavra(el, w, t, { size: tam(css), d: .45 }); if (sc) m.querySelector("i").style.cssText += sc; });
    return el;
  };
  const centro = (p, y, css, itens) => { const el = linha(p, 0, y, css, itens); el.style.cssText += ";left:0;right:0;text-align:center"; return el; };
  const SANS = (px, cor = "#FFFFFF", peso = 400) => `font:${peso} ${px}px/1.08 var(--v-sans);letter-spacing:-.025em;color:${cor}`;
  const MONO = (px, cor = "#FFFFFF", peso = 800) => `font:${peso} ${px}px/1 var(--v-mono);letter-spacing:-.04em;color:${cor}`;
  // texto que decodifica de caracteres aleatórios (Martian Mono)
  const GLY = "ABCDEF0123456789#%&*+=<>/";
  const decode = (el, txt, t, d = .32) => fx(tt => {
    if (tt < t) { el.textContent = ""; return; }
    const k = Math.floor(tt * 30); let s = "";
    for (let i = 0; i < txt.length; i++) { const ti = t + d * i / txt.length; s += (tt >= ti + .07 || txt[i] === " ") ? txt[i] : (tt >= ti ? GLY[(i * 7 + k) % GLY.length] : ""); }
    el.textContent = s;
  });
  const bloco = (p, x, y, txt, t, css, d) => { const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;white-space:nowrap;${css}`); decode(el, txt, t, d); return el; };
  const rotulo = (p, x, y, txt, t, cor = "#FFFFFF") => { const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;font:500 24px var(--v-mono);letter-spacing:.08em;color:${cor};white-space:nowrap`); typeText(el, txt, t, 40); return el; };
  const bate = (el, t, s0 = 1.6) => anim(el, [[t - .01, { o: 0, s: s0 }], [t + .02, { o: 1 }, "lin"], [t + .22, { s: 1 }, "out5"]]);
  const tremor = (t, a = 12) => [[t, { x: 0, y: 0 }], [t + .04, { x: a, y: -a * .7 }, "lin"], [t + .08, { x: -a * .7, y: a * .5 }, "lin"], [t + .13, { x: a * .3, y: -a * .2 }, "lin"], [t + .22, { x: 0, y: 0 }, "out"]];
  const jitter = (el, a, b, amp = 10) => fx(t => { if (t < a || t > b) { el.style.translate = ""; return; } const k = Math.floor(t * 30); el.style.translate = `${((k * 37 % 7) - 3) / 3 * amp}px ${((k * 53 % 5) - 2) / 2 * amp * .4}px`; });

  /* ---------- imagens em duotone ---------- */
  function duo(p, nome, x, y, w, hh, modo = "b", brilho = 1.1, css = "") {
    const c = h("div", `duo ${modo}`, p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;--brilho:${brilho};${css}`);
    // a camada .m recebe o zoom (anim); a <img> dentro dela guarda o filtro do duotone (anim sobrescreveria o filter)
    const m = h("div", "m", c, null, "position:absolute;inset:0;transform-origin:50% 50%");
    const img = h("img", "", m); img.src = MDS.img(nome);
    return { c, im: m, img };
  }

  /* ---------- desenho técnico ---------- */
  // cadeado em linha (caixa local 480 × 580), traçado como num plotter
  function cadeado(sv, x, y, esc, cor, t0, d = .7, sw = 6) {
    const g = MDS.sel(sv, "g", { transform: `translate(${x} ${y}) scale(${esc})`, fill: "none", stroke: cor, "stroke-width": sw / Math.abs(esc), "stroke-linecap": "butt" });
    const P = ["M80 160 V110 a160 160 0 0 1 320 0 V160", "M0 160 H480 V580 H0 Z", "M240 300 a44 44 0 1 1 -0.1 0", "M240 388 v90"];
    P.forEach((dd, i) => draw(path(g, dd), t0 + i * d * .15, t0 + d * .55 + i * d * .15, "inOut"));
    return g;
  }
  // cota (linha de medida) com texto
  function cota(sv, x1, y1, x2, y2, txt, cor, t0) {
    const L = path(sv, `M${x1} ${y1} L${x2} ${y2}`, { stroke: cor, "stroke-width": 2, fill: "none" });
    draw(L, t0, t0 + .35, "out");
    const vert = x1 === x2, tk = 14;
    [[x1, y1], [x2, y2]].forEach(([a, b]) => draw(path(sv, vert ? `M${a - tk} ${b} H${a + tk}` : `M${a} ${b - tk} V${b + tk}`, { stroke: cor, "stroke-width": 2 }), t0, t0 + .15));
    if (!txt) return;
    const tx = MDS.sel(sv, "text", { x: vert ? x1 + 26 : (x1 + x2) / 2, y: vert ? (y1 + y2) / 2 + 8 : y1 + 44, fill: cor, "font-family": "Martian Mono", "font-size": 24, "text-anchor": vert ? "start" : "middle" });
    tx.textContent = txt; fx(t => tx.style.opacity = prog(t, t0 + .2, t0 + .4));
  }
  function mira(p, x, y, r, t, cor = VM) {
    const el = h("div", "abs", p, `<svg viewBox="-60 -60 120 120" width="${2 * r}" height="${2 * r}" fill="none" stroke="${cor}" stroke-width="5"><circle r="34"/><path d="M0 -56 V-20 M0 20 V56 M-56 0 H-20 M20 0 H56"/></svg>`, `left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px`);
    anim(el, [[t, { o: 0, s: 2.2, r: 45 }], [t + .03, { o: 1 }, "lin"], [t + .3, { s: 1, r: 0 }, "expo"]]);
    return el;
  }
  function marcaFalha(sv, x, y, t, rotuloTxt, lx, ly) {
    draw(path(sv, `M${x} ${y - 44} a44 44 0 1 1 -0.1 0`, { stroke: VM, "stroke-width": 6, fill: "none" }), t, t + .22, "out");
    draw(path(sv, `M${x - 20} ${y - 20} l40 40 M${x + 20} ${y - 20} l-40 40`, { stroke: VM, "stroke-width": 6 }), t + .1, t + .25);
    if (!rotuloTxt) return;
    draw(path(sv, `M${x + 44} ${y} L${lx} ${ly} H${lx + 170}`, { stroke: VM, "stroke-width": 3, fill: "none" }), t + .15, t + .45, "out");
    const tx = MDS.sel(sv, "text", { x: lx + 4, y: ly - 14, fill: VM, "font-family": "Martian Mono", "font-size": 26, "font-weight": 700 }); tx.textContent = rotuloTxt;
    fx(tt => tx.style.opacity = prog(tt, t + .35, t + .5));
  }

  /* ================= 1 · Hipótese (azul) ================= */
  cena({
    id: "hipotese", nome: "Hipótese", inicio: 0, fim: 2.14, z: 10,
    descricao: "A grade milimetrada se desenha como num plotter; “INTELIGÊNCIA ARTIFICIAL” decodifica letra a letra em Martian Mono, alinhado à esquerda.",
    montar(S) {
      azul(S, 0);
      const T = [
        rotulo(S, X, 250, "FIG. 00 · HIPÓTESE", .05),
        linha(S, X, 330, SANS(66), [["E", 0], ["se", .26], ["eu", .32], ["te", .42], ["dissesse", .48]]),
        linha(S, X, 420, SANS(50, "rgba(255,255,255,.72)"), [["que", .94], ["uma", 1.04]]),
        bloco(S, X, 520, "INTELIGÊNCIA", 1.14, MONO(104)),
        bloco(S, X, 650, "ARTIFICIAL", 1.58, MONO(104)),
      ];
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      draw(path(sv, "M760 1080 a170 170 0 1 1 -0.1 0", { stroke: "#fff", "stroke-width": 3, fill: "none" }), .3, 1.2, "inOut");
      draw(path(sv, "M760 1040 V1460 M550 1250 H970", { stroke: "#fff", "stroke-width": 2, fill: "none" }), .5, 1.3, "out");
      cota(sv, 590, 1500, 930, 1500, "Ø 340", "#fff", 1.0);
      T.forEach((e, i) => anim(e, [[1.96 + i * .02, { y: 0, o: 1 }], [2.12 + i * .02, { y: -60, o: 0 }, "in"]]));
      anim(S, [[0, { s: 1 }], [2.14, { s: 1.03 }, "lin"]]);
    },
  });

  /* ================= 2 · Planta do cadeado (azul) ================= */
  cena({
    id: "planta", nome: "Planta do cadeado", inicio: 2.08, fim: 4.04, z: 11, margem: .3,
    descricao: "A planta do cadeado se traça com cotas; uma lupa percorre o desenho mostrando a foto em duotone; em “falhas” surgem as marcas vermelhas A e B.",
    montar(S) {
      azul(S);
      rotulo(S, X, 250, "FIG. 02 · SISTEMA DE PROTEÇÃO", 2.12);
      linha(S, X, 300, SANS(58), [["está", 2.14], ["descobrindo", 2.58]]);
      const f = h("div", "abs", S, null, `left:${X}px;top:390px;padding:4px 22px;background:${BR};${MONO(150, VM)}`);
      decode(f, "FALHAS", 3.04, .2); anim(f, [[3.0, { o: 0 }], [3.04, { o: 1 }, "lin"]]);
      jitter(f, 3.04, 3.3, 10);
      linha(S, X, 590, SANS(44, "rgba(255,255,255,.72)"), [["em", 3.42], ["sistemas", 3.56]]);
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      cadeado(sv, 300, 780, 1, "#fff", 2.15, .75);
      cota(sv, 300, 1420, 780, 1420, "480 mm", "#fff", 2.6);
      cota(sv, 840, 940, 840, 1360, "420", "#fff", 2.7);
      marcaFalha(sv, 410, 1040, 3.04, "FALHA A", 600, 990);
      marcaFalha(sv, 640, 1290, 3.30, "FALHA B", 780, 1230);
      // lupa com a foto do cadeado em duotone
      const L = h("div", "abs", S, null, "left:0;top:0;width:300px;height:300px");
      const { c, im, img } = duo(L, "cadeado", 0, 0, 300, 300, "b", 1.25, "border-radius:50%;box-shadow:0 0 0 8px #F4F5F7, 0 0 0 10px #1E3BFF, 0 0 0 12px #F4F5F7");
      im.style.transform = "scale(2.4)";
      h("div", "abs", L, null, "left:262px;top:262px;width:26px;height:140px;background:#F4F5F7;rotate:-45deg;transform-origin:50% 0");
      fx(t => { const p = prog(t, 2.5, 3.9, "inOut"), a = p * Math.PI * 1.3;
        L.style.left = (250 + 330 * p + Math.sin(a) * 40) + "px"; L.style.top = (920 + 260 * p - Math.cos(a) * 30) + "px";
        img.style.objectPosition = `${(30 + 40 * p).toFixed(0)}% ${(40 + 25 * p).toFixed(0)}%`; });
      anim(L, [[2.45, { o: 0, s: .6 }], [2.7, { o: 1, s: 1 }, "back"]]);
      anim(S, [[2.08, { o: 0 }], [2.12, { o: 1 }, "lin"], ...tremor(3.04, 10)]);
      void c;
    },
  });

  /* ================= 3 · Tabela de dados (branco) ================= */
  cena({
    id: "tabela", nome: "Tabela de dados", inicio: 3.84, fim: 5.58, z: 12, margem: .3,
    descricao: "Uma folha branca desliza por cima: tabela técnica TIPO / VALOR / STATUS; cada linha recebe PROTEGIDO em azul; “DADOS?” decodifica grande.",
    montar(S) {
      branco(S); sombraTopo(S);
      rotulo(S, X, 250, "TAB. 03 · DADOS PESSOAIS", 4.0, AZ);
      linha(S, X, 300, SANS(52, G2), [["que", 4.02], ["protegem", 4.04]]);
      const T = h("div", "abs", S, null, `left:${X}px;top:430px;width:920px;font:500 34px var(--v-sans);color:${INK}`);
      const cab = h("div", "", T, `<span style="flex:1.1">TIPO</span><span style="flex:1.3">VALOR</span><span style="flex:1;text-align:right">STATUS</span>`, `display:flex;font:500 22px var(--v-mono);letter-spacing:.08em;color:${G2};padding-bottom:18px;border-bottom:3px solid ${INK}`);
      anim(cab, IN(3.98, { dy: 20, s: 1, b: 0, d: .3 }));
      [["Senha", "••••••••"], ["Cartão", "•••• 4821"], ["Mensagens", "privadas"], ["Fotos", "galeria"]].forEach(([a, b], i) => {
        const r = h("div", "", T, `<span style="flex:1.1">${a}</span><span style="flex:1.3;font-family:var(--v-mono);font-size:28px">${b}</span><span style="flex:1;text-align:right"><b class="st" style="display:inline-block;font:700 22px var(--v-mono);letter-spacing:.06em;color:#fff;background:${AZ};padding:8px 14px;transform-origin:100% 50%">PROTEGIDO</b></span>`,
          "display:flex;align-items:center;height:104px;border-bottom:1px solid #C9CCD6");
        anim(r, IN(4.02 + i * .06, { dy: 30, s: 1, b: 0, d: .35 }));
        anim(r.querySelector(".st"), [[4.04 + i * .12, { o: 0, sx: 0 }], [4.2 + i * .12, { o: 1, sx: 1 }, "out5"]]);
      });
      linha(S, X, 1000, SANS(64, INK), [["seus", 4.52]]);
      bloco(S, X, 1080, "DADOS?", 4.70, MONO(170, AZ), .22);
      anim(S, folha(3.84, .3));
    },
  });

  /* ================= 4 · Carimbo (branco) ================= */
  cena({
    id: "carimbo", nome: "Carimbo", inicio: 5.56, fim: 7.16, z: 14, margem: .3,
    descricao: "“ficção científica” em Instrument Sans fino; um carimbo vermelho “NÃO É FICÇÃO” bate por cima. A folha sobe e revela a prancha seguinte.",
    montar(S) {
      branco(S);
      rotulo(S, X, 250, "NOTA 04", 5.56, AZ);
      linha(S, X, 520, SANS(60, G2), [["Isso", 5.56], ["não", 5.74], ["é", 5.86]]);
      linha(S, X, 620, `font:400 160px/1 var(--v-sans);letter-spacing:-.05em;color:${INK}`, [["ficção", 6.00]]);
      linha(S, X, 790, `font:400 160px/1 var(--v-sans);letter-spacing:-.05em;color:${INK}`, [["científica", 6.32]]);
      const c = h("div", "abs", S, "NÃO É<br>FICÇÃO", `left:420px;top:880px;padding:22px 34px;border:10px solid ${VM};${MONO(96, VM)};line-height:1.05;rotate:-9deg;transform-origin:center;background-image:radial-gradient(rgba(244,245,247,.6) 1.5px,transparent 2px);background-size:9px 11px`);
      bate(c, 6.42, 2.4);
      h("div", "abs", S, null, "left:-80px;top:1920px;width:1240px;height:60px;background:linear-gradient(rgba(0,0,0,.35),transparent)");
      anim(S, [[5.555, { o: 0 }], [5.56, { o: 1 }, "lin"], ...tremor(6.44, 12), [6.95, { y: 0 }], [7.16, { y: -1980 }, "inExpo"]]);
    },
  });

  /* ================= 5 · Prancha FIG. 01 (azul) ================= */
  cena({
    id: "prancha", nome: "Prancha FIG. 01", inicio: 6.9, fim: 9.1, z: 13, margem: .3,
    descricao: "A foto do laboratório em duotone azul, impressa como prancha com retícula e legenda técnica “FIG. 01 · PESQUISADORES · GOOGLE DEEPMIND” (só texto). Zoom de lupa num monitor.",
    montar(S) {
      azul(S);
      linha(S, X, 250, SANS(88, "#fff", 600), [["Pesquisadores", 7.16]]);
      const F = h("div", "abs", S, null, `left:${X}px;top:400px;width:920px;height:1100px;background:${BR}`);
      const { im } = duo(F, "laboratorio", 20, 20, 880, 960, "b", 1.35);
      anim(im, [[6.9, { s: 1.12 }], [9.1, { s: 1 }, "out"]]);
      const leg = h("div", "abs", F, null, `left:20px;top:996px;width:880px;display:flex;flex-direction:column;gap:8px;font:500 24px var(--v-mono);letter-spacing:.04em;color:${INK}`);
      typeText(h("span", "", leg), "FIG. 01 · PESQUISADORES", 7.2, 40);
      typeText(h("span", "", leg, null, `color:${AZ};font-weight:700`), "GOOGLE DEEPMIND", 7.84, 30);
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      cota(sv, 1035, 400, 1035, 1500, "", "#fff", 7.3);
      anim(F, [[6.9, { s: .96 }], [7.6, { s: 1 }, "out"]]);
      S.style.transformOrigin = "520px 760px";
      anim(S, [[8.86, { s: 1 }], [9.1, { s: 3.2 }, "in"]]);
    },
  });

  /* ================= 6 · Código sob a mira (branco) ================= */
  const CODE = ["for modulo in sistemas:", "    chave = ler(modulo)", "    teste = analisar(chave)", "    if teste.fraco:", "        alerta(modulo)", "", "def analisar(chave):", "    padroes = ia.buscar(chave)", "    return avaliar(padroes)", "", "verificar(rsa, bits=1024)", "comparar(fatores)", "registrar(resultado)", "", "for agente in agentes:", "    agente.executar()", "    agente.reportar()"];
  cena({
    id: "codigo", nome: "Código sob a mira", inicio: 9.04, fim: 11.14, z: 15, margem: .3,
    descricao: "Folha branca com código em azul; a mira vermelha (a IA) pula de trecho em trecho sublinhando em vermelho e trava em “encontrar” escrevendo FALHA.",
    montar(S) {
      branco(S);
      rotulo(S, X, 250, "FIG. 04 · ANÁLISE", 9.06, AZ);
      linha(S, X, 300, SANS(48, G2), [["estão", 9.04], ["utilizando", 9.08]]);
      linha(S, X, 370, SANS(66, INK, 600), [["inteligência", 9.52], ["artificial", 10.08]]);
      const C = h("div", "abs", S, null, `left:${X}px;top:520px;width:920px;height:860px;overflow:hidden;border-top:3px solid ${INK};border-bottom:1px solid #C9CCD6`);
      const col = h("div", "abs", C, null, "left:0;top:20px;width:920px");
      CODE.forEach((l, i) => h("div", "", col, `<span style="color:#9AA0B4;display:inline-block;width:56px">${String(i + 1).padStart(2, "0")}</span>${l.replace(/ /g, "&nbsp;")}`, `height:50px;font:500 26px var(--v-mono);color:${AZ};white-space:nowrap`));
      const off = t => -Math.max(0, t - 9.1) * 22 + 20;
      fx(t => col.style.top = off(t) + "px");
      const ALVO = [[9.08, 1, 360], [9.52, 7, 470], [10.08, 10, 420], [10.64, 4, 330], [10.86, 2, 520]];
      const sub = h("div", "abs", C, null, `height:5px;background:${VM};left:56px`);
      const m = h("div", "abs", C, `<svg viewBox="-60 -60 120 120" width="88" height="88" fill="none" stroke="${VM}" stroke-width="6"><circle r="32"/><path d="M0 -56 V-18 M0 18 V56 M-56 0 H-18 M18 0 H56"/></svg>`, "width:88px;height:88px");
      fx(t => { let a = ALVO[0]; for (const k of ALVO) if (t >= k[0]) a = k;
        const y = a[1] * 50 + off(t); sub.style.top = (y + 42) + "px"; sub.style.width = (a[2] * Math.min(1, Math.max(0, (t - a[0]) / .2))) + "px";
        m.style.left = (56 + a[2] - 44) + "px"; m.style.top = (y - 20) + "px"; m.style.opacity = t >= 9.08 ? 1 : 0; });
      const tag = h("div", "abs", C, "FALHA", `right:0;top:0;padding:8px 16px;background:${VM};color:#fff;font:800 28px var(--v-mono);letter-spacing:.04em`);
      fx(t => tag.style.top = (2 * 50 + off(t) - 4) + "px");
      anim(tag, [[10.86, { o: 0, s: 1.8 }], [10.9, { o: 1 }, "lin"], [11.05, { s: 1 }, "out5"]]);
      linha(S, X, 1420, SANS(56, INK), [["para", 10.64], ["encontrar", 10.86, `color:${VM};font-weight:600`]]);
      S.style.transformOrigin = "520px 760px";
      anim(S, [[9.035, { o: 0, s: .42 }], [9.05, { o: 1 }, "lin"], [9.35, { s: 1 }, "expo"]]);
    },
  });

  /* ================= 7 · Grade de letras (azul) ================= */
  cena({
    id: "letras", nome: "Grade de letras", inicio: 11.12, fim: 13.64, z: 16, margem: .3,
    descricao: "VULNERABILIDADES em 16 células (4×4) que viram como um painel de aeroporto; “criptografia” decodifica numa tarja vermelha.",
    montar(S) {
      azul(S);
      rotulo(S, X, 250, "FIG. 05 · 16 CARACTERES", 11.14);
      const W = "VULNERABILIDADES", CS = 200, GP = 12, L0 = 122, T0 = 330;
      [...W].forEach((ch, i) => {
        const r = Math.floor(i / 4), c = i % 4;
        const cel = h("div", "abs", S, null, `left:${L0 + c * (CS + GP)}px;top:${T0 + r * (CS + GP)}px;width:${CS}px;height:${CS}px;border:2px solid rgba(255,255,255,.7);display:grid;place-items:center;${MONO(130)};transform-origin:50% 50%`);
        const t = 11.14 + (r + c) * .05;
        fx(tt => { cel.textContent = tt < t + .12 ? GLY[(i * 5 + Math.floor(tt * 24)) % GLY.length] : ch; cel.style.background = tt >= t + .12 && tt < t + .2 ? "rgba(255,255,255,.25)" : "transparent"; });
        anim(cel, [[t - .2, { o: 0, rx: -90 }], [t - .15, { o: 1 }, "lin"], [t + .12, { rx: 0 }, "out"]]);
      });
      linha(S, X, 1210, SANS(48, "rgba(255,255,255,.8)"), [["em", 11.94], ["sistemas", 12.14], ["de", 12.44]]);
      const cr = h("div", "abs", S, null, `left:${X}px;top:1290px;padding:10px 22px;background:${VM};${MONO(84, "#fff", 700)}`);
      decode(cr, "criptografia", 12.6, .45); anim(cr, [[12.55, { o: 0 }], [12.6, { o: 1 }, "lin"]]);
      anim(S, [[11.115, { o: 0 }], [11.12, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 8 · Faixas de alerta (branco) ================= */
  cena({
    id: "faixas", nome: "Faixas de alerta", inicio: 13.6, fim: 15.2, z: 17, margem: .3,
    descricao: "Três faixas diagonais (vermelha, azul, preta) atravessam a tela com DESCOBERTA e ATENÇÃO correndo, uma por palavra.",
    montar(S) {
      branco(S);
      linha(S, X, 270, SANS(56, G2), [["E", 13.64], ["a", 13.72], ["descoberta", 13.78]]);
      linha(S, X, 350, SANS(66, INK), [["chama", 14.24]]);
      bloco(S, X + 230, 352, "ATENÇÃO.", 14.42, MONO(66, VM), .2);
      [[640, VM, "DESCOBERTA · ", 13.78, 1], [900, AZ, "ATENÇÃO · ", 14.24, -1], [1160, INK, "DESCOBERTA · ATENÇÃO · ", 14.42, 1]].forEach(([y, cor, txt, t, dir]) => {
        const b = h("div", "abs", S, null, `left:-400px;top:${y}px;width:1900px;height:150px;background:${cor};rotate:-12deg;overflow:hidden;display:flex;align-items:center`);
        const r = h("div", "", b, txt.repeat(8), `${MONO(70)};white-space:nowrap`);
        fx(tt => r.style.translate = `${((-tt * 260 * dir) % 900 - 450).toFixed(1)}px 0`);
        anim(b, [[t, { x: 2100 * dir }], [t + .35, { x: 0 }, "expo"], [14.98, { sy: 1 }], [15.2, { sy: 6 }, "in"]]);
      });
      anim(S, [[13.595, { o: 0 }], [13.6, { o: 1 }, "lin"], ...tremor(14.42, 8)]);
    },
  });

  /* ================= 9 · Diafragma (azul) ================= */
  cena({
    id: "diafragma", nome: "Diafragma", inicio: 15.1, fim: 17.12, z: 18, margem: .3,
    descricao: "O olho da IA em duotone azul aparece por um diafragma que se abre; anéis finos e coordenadas que correm; em “identificar” duas miras vermelhas travam.",
    montar(S) {
      azul(S);
      const CX = 540, CY = 960;
      const { c, im } = duo(S, "agente", 140, 560, 800, 800, "b", 1.2);
      anim(im, [[15.1, { s: 1.5 }], [17.12, { s: 1.15 }, "out"]]);
      fx(t => { const r = prog(t, 15.12, 15.55, "expo") * 400; c.style.clipPath = `circle(${r.toFixed(1)}px at 400px 400px)`; });
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      [420, 460].forEach((r, i) => draw(path(sv, `M${CX} ${CY - r} a${r} ${r} 0 1 1 -0.1 0`, { stroke: "#fff", "stroke-width": i ? 1.5 : 3, fill: "none" }), 15.2 + i * .1, 15.8 + i * .1, "out"));
      for (let k = 0; k < 24; k++) { const a = k * 15 * Math.PI / 180; path(sv, `M${CX + Math.cos(a) * 470} ${CY + Math.sin(a) * 470} L${CX + Math.cos(a) * 492} ${CY + Math.sin(a) * 492}`, { stroke: "#fff", "stroke-width": 2 }); }
      [["X", 100, 1480], ["Y", 640, 1480]].forEach(([e, x, y], i) => {
        const el = h("div", "abs", S, null, `left:${x}px;top:${y}px;font:500 26px var(--v-mono);color:#fff;letter-spacing:.06em`);
        fx(t => { const fixo = t >= 16.64, v = fixo ? [540, 960][i] : (Math.floor(t * 40 * (i + 3)) % 9999); el.textContent = `${e} ${String(v).padStart(4, "0")}.${fixo ? "00" : String(Math.floor(t * 97) % 99).padStart(2, "0")}`; });
      });
      linha(S, X, 250, SANS(84, "#fff", 600), [["Agentes", 15.18], ["de", 15.48], ["IA", 15.72]]);
      linha(S, X, 350, SANS(48, "rgba(255,255,255,.75)"), [["ajudaram", 16.0], ["a", 16.52], ["identificar", 16.64]]);
      mira(S, 420, 880, 60, 16.64); mira(S, 690, 1030, 60, 16.78);
      anim(S, [[15.095, { o: 0 }], [15.1, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 10 · 02 (branco) ================= */
  cena({
    id: "dois", nome: "02", inicio: 17.08, fim: 19.46, z: 20, margem: .3,
    descricao: "“02” gigante em Martian Mono e, ao lado, o cadeado em linha azul com os pontos A e B em vermelho. A folha sai para a esquerda.",
    montar(S) {
      branco(S);
      rotulo(S, X, 250, "FIG. 06 · ACHADOS", 17.1, AZ);
      const n = bloco(S, X - 10, 360, "02", 17.10, MONO(380, INK), .12); bate(n, 17.10, 1.4); n.style.transformOrigin = "0 50%";
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      cadeado(sv, 640, 420, .62, AZ, 17.1, .6, 7);
      [[700, 640, "A", 17.38], [880, 740, "B", 17.6]].forEach(([x, y, l, t]) => {
        const d = h("div", "abs", S, l, `left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;background:${VM};color:#fff;display:grid;place-items:center;font:800 28px var(--v-mono)`);
        anim(d, [[t, { s: 0 }], [t + .25, { s: 1 }, "back"]]);
        fx(tt => { const p = ((tt - t) * 1.5) % 1; d.style.boxShadow = tt > t ? `0 0 0 ${(p * 36).toFixed(0)}px rgba(255,59,48,${(.4 * (1 - p)).toFixed(2)})` : "none"; });
      });
      linha(S, X, 1000, SANS(72, INK, 600), [["vulnerabilidades", 17.38]]);
      linha(S, X, 1100, SANS(46, G2), [["relacionadas", 18.12], ["à", 18.68], ["criptografia", 18.80]]);
      anim(S, [[17.075, { o: 0 }], [17.08, { o: 1 }, "lin"], ...tremor(17.1, 8), [19.24, { x: 0 }], [19.46, { x: -1160 }, "inExpo"]]);
    },
  });

  /* ================= 11 · 1024 bits (azul) ================= */
  cena({
    id: "bits", nome: "A chave de 1024 bits", inicio: 19.2, fim: 21.88, z: 19, margem: .3,
    descricao: "“RSA” e um contador até 1024 enquanto uma grade de 32×32 células (1024) se preenche; em “bits” a grade completa pisca em vermelho.",
    montar(S) {
      azul(S);
      bloco(S, X, 270, "RSA", 19.44, MONO(200), .15);
      const c = h("div", "abs", S, "0000", `left:${X}px;top:500px;${MONO(120)};font-variant-numeric:tabular-nums;transform-origin:0 50%`);
      MDS.counter(c, 0, 1024, 20.40, 20.96, v => String(Math.round(v)).padStart(4, "0"), "inOut");
      anim(c, [[20.3, { o: 0, s: 1 }], [20.4, { o: 1 }, "lin"], [20.96, { s: 1.12 }], [21.2, { s: 1 }, "out5"]]);
      linha(S, X + 600, 540, SANS(60), [["de", 20.04], ["bits.", 20.96, "font-weight:600"]]);
      const cv = h("canvas", "", S, null, "position:absolute;left:124px;top:700px;width:832px;height:832px"); cv.width = 832; cv.height = 832;
      const g = cv.getContext("2d");
      fx(t => { const n = Math.round(1024 * prog(t, 20.40, 20.96, "inOut")), fl = t >= 20.96 && t < 21.3 && Math.floor(t * 12) % 2 === 0;
        g.clearRect(0, 0, 832, 832);
        for (let i = 0; i < 1024; i++) { const x = (i % 32) * 26, y = Math.floor(i / 32) * 26;
          if (i < n) { g.fillStyle = fl ? VM : "#FFFFFF"; g.fillRect(x, y, 22, 22); } else { g.strokeStyle = "rgba(255,255,255,.3)"; g.lineWidth = 1; g.strokeRect(x + .5, y + .5, 21, 21); } }
        cv.style.opacity = prog(t, 19.4, 19.8); });
      anim(S, tremor(20.96, 8));
    },
  });

  /* ================= 12 · Por quê? (vermelho, tela cheia) ================= */
  cena({
    id: "porque", nome: "Por quê?", inicio: 21.86, fim: 23.66, z: 21, margem: .3,
    descricao: "O único momento de tela cheia vermelha: as palavras encaixam na grade e “IMPORTANTE?” ocupa a largura.",
    montar(S) {
      fundo(S, VM); grade(S, BRANCO);
      rotulo(S, X, 250, "PERGUNTA", 21.86);
      linha(S, X, 400, MONO(92), [["MAS", 21.86], ["POR", 22.02], ["QUE", 22.16]]);
      linha(S, X, 520, MONO(92), [["ISSO", 22.30], ["É", 22.50], ["TÃO", 22.60]]);
      const im = bloco(S, X, 700, "IMPORTANTE?", 22.66, MONO(116), .2); im.style.transformOrigin = "0 50%"; bate(im, 22.66, 1.3);
      anim(S, [[21.855, { o: 0 }], [21.86, { o: 1 }, "lin"], ...tremor(22.66, 10)]);
    },
  });

  /* ================= 13 · O que a criptografia protege (branco) ================= */
  cena({
    id: "protege", nome: "O que a criptografia protege", inicio: 23.44, fim: 26.98, z: 22, margem: .3,
    descricao: "Coluna com o data center em duotone azul; à direita, lista técnica que recebe ✓ em “proteger” e “informações digitais.”",
    montar(S) {
      branco(S); sombraTopo(S);
      rotulo(S, X, 250, "FIG. 07 · O QUE ESTÁ EM JOGO", 23.6, AZ);
      const { im } = duo(S, "datacenter", X, 300, 360, 1260, "b", 1.7);
      anim(im, [[23.44, { s: 1.0 }], [26.98, { s: 1.15 }, "lin"]]);
      const RX = 500;
      linha(S, RX, 300, SANS(46, G2), [["Porque", 23.60], ["essa", 23.76]]);
      linha(S, RX, 355, SANS(46, G2), [["tecnologia", 23.92], ["é", 24.42]]);
      linha(S, RX, 410, SANS(46, G2), [["utilizada", 24.66], ["para", 25.12]]);
      bloco(S, RX, 500, "PROTEGER", 25.30, MONO(84, AZ), .2);
      const T = h("div", "abs", S, null, `left:${RX}px;top:640px;width:500px;font:500 36px var(--v-sans);color:${INK}`);
      ["Bancos", "Mensagens", "Compras", "Documentos"].forEach((n, i) => {
        const r = h("div", "", T, `<span>${n}</span><b style="display:inline-block;font:700 30px var(--v-mono);color:${AZ}">✓ 0${i + 1}</b>`, `display:flex;justify-content:space-between;padding:24px 0;border-top:${i ? 1 : 3}px solid ${i ? "#C9CCD6" : INK}`);
        anim(r, IN(24.1 + i * .08, { dy: 24, s: 1, b: 0, d: .35 }));
        anim(r.querySelector("b"), [[25.30 + i * .12, { o: 0, s: 1.8 }], [25.34 + i * .12, { o: 1 }, "lin"], [25.5 + i * .12, { s: 1 }, "out5"]]);
      });
      linha(S, RX, 1150, SANS(62, INK, 600), [["informações", 25.84]]);
      linha(S, RX, 1225, SANS(62, INK, 600), [["digitais.", 26.22, `color:${AZ}`]]);
      S.style.transformOrigin = "750px 850px";
      anim(S, [...folha(23.44, .3), [26.76, { s: 1 }], [26.98, { s: 2.4 }, "in"]]);
    },
  });

  /* ================= 14 · A lupa encontra (azul) ================= */
  cena({
    id: "lupa", nome: "A lupa encontra", inicio: 26.92, fim: 30.48, z: 23, margem: .3,
    descricao: "Grade de código em branco; a lupa varre e, em “falhas”, três chamadas vermelhas com linhas de cota: FALHA 01, 02 e 03.",
    montar(S) {
      azul(S);
      linha(S, X, 270, SANS(48, "rgba(255,255,255,.72)"), [["E", 26.94], ["a", 27.44], ["capacidade", 27.50], ["da", 28.06]]);
      linha(S, X, 340, SANS(66, "#fff", 600), [["inteligência", 28.22], ["artificial", 28.64]]);
      const C = h("div", "abs", S, null, `left:${X}px;top:500px;width:920px;height:820px`);
      for (let i = 0; i < 18; i++) h("i", "abs", C, null, `left:${(i % 3) * 40}px;top:${i * 44}px;height:20px;width:${180 + (i * 97) % 520}px;background:rgba(255,255,255,${i % 5 === 2 ? .55 : .3})`);
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      [[300, 640, "FALHA 01", 620, 600, 29.58], [520, 920, "FALHA 02", 700, 880, 29.70], [240, 1180, "FALHA 03", 560, 1140, 29.82]].forEach(([x, y, l, lx, ly, t]) => marcaFalha(sv, x, y, t, l, lx, ly));
      const L = h("div", "abs", S, null, "left:0;top:0;width:240px;height:240px;border-radius:50%;border:6px solid #fff;background:rgba(255,255,255,.12);box-shadow:inset 0 0 40px rgba(255,255,255,.25)");
      h("div", "abs", L, null, "left:205px;top:205px;width:24px;height:130px;background:#fff;rotate:-45deg;transform-origin:50% 0");
      fx(t => { const p = Math.max(0, t - 27.5); L.style.left = (300 + Math.sin(p * 1.4) * 240) + "px"; L.style.top = (760 + Math.sin(p * 2.1 + 1) * 230) + "px"; L.style.opacity = t >= 27.5 && t < 30.3 ? 1 : 0; });
      linha(S, X, 1400, SANS(56), [["de", 29.14], ["encontrar", 29.30], ["falhas", 29.58, `background:${VM};padding:0 12px;font-weight:600`]]);
      anim(S, [[26.915, { o: 0 }], [26.92, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 15 · Construção do escudo (branco) ================= */
  cena({
    id: "escudo", nome: "Construção do escudo", inicio: 30.44, fim: 33.7, z: 24, margem: .3,
    descricao: "O escudo em duotone azul com linhas de construção geométrica se traçando por cima; “SEGURANÇA CIBERNÉTICA” em Martian Mono. A planta inverte na virada.",
    montar(S) {
      branco(S);
      linha(S, X, 250, SANS(46, G2), [["pode", 30.44], ["transformar", 30.48]]);
      linha(S, X, 310, SANS(66, INK, 600), [["completamente", 31.70]]);
      const { im } = duo(S, "escudo", 90, 410, 900, 900, "b", 1.25);
      anim(im, [[30.44, { s: 1.3 }], [31.4, { s: 1.12 }, "expo"], [33.7, { s: 1.06 }, "lin"]]);
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      const CX = 540, CY = 860;
      draw(path(sv, `M${CX} ${CY - 400} a400 400 0 1 1 -0.1 0`, { stroke: AZ, "stroke-width": 2.5, fill: "none" }), 30.5, 31.3, "inOut");
      draw(path(sv, `M${CX} ${CY - 440} V${CY + 440} M${CX - 450} ${CY} H${CX + 450}`, { stroke: AZ, "stroke-width": 1.5, fill: "none", "stroke-dasharray": "10 8" }), 30.6, 31.2, "out");
      draw(path(sv, `M${CX} ${CY} L${CX + 283} ${CY - 283}`, { stroke: VM, "stroke-width": 3 }), 31.0, 31.3, "out");
      const tx = MDS.sel(sv, "text", { x: CX + 160, y: CY - 210, fill: VM, "font-family": "Martian Mono", "font-size": 26, "font-weight": 700 }); tx.textContent = "R 400";
      fx(t => tx.style.opacity = prog(t, 31.2, 31.4));
      cota(sv, 140, 1290, 940, 1290, "800", AZ, 31.4);
      linha(S, X, 1330, SANS(44, G2), [["o", 31.70], ["futuro", 31.86], ["da", 32.16]]);
      bloco(S, X, 1390, "SEGURANÇA", 32.32, MONO(88, AZ), .25);
      bloco(S, X, 1480, "CIBERNÉTICA", 32.66, MONO(88, AZ), .25);
      fx(t => S.style.filter = (t >= 33.5 && t < 33.54) || (t >= 33.58 && t < 33.7) ? "invert(1) hue-rotate(180deg)" : "none");
      anim(S, [[30.435, { o: 0 }], [30.44, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 16 · Inversão (preto) ================= */
  cena({
    id: "inversao", nome: "Inversão", inicio: 33.66, fim: 35.8, z: 25, margem: .3,
    descricao: "A planta virou negativo: fundo preto, linhas vermelhas. “OUTRO LADO.” aparece espelhado e gira para a leitura certa, com glitch.",
    montar(S) {
      fundo(S, "#000"); grade(S, "rgba(255,59,48,");
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0;opacity:.35");
      cadeado(sv, 560, 1180, .8, VM, 33.7, .5, 5);
      rotulo(S, X, 250, "FIG. 09 · NEGATIVO", 33.7, VM);
      linha(S, X, 520, SANS(64), [["Mas", 33.68]]);
      linha(S, X, 610, SANS(52, "rgba(255,255,255,.7)"), [["existe", 33.88], ["um", 34.52]]);
      const o = h("div", "abs", S, "OUTRO<br>LADO.", `left:${X}px;top:740px;${MONO(170, VM)};line-height:1.05;transform-origin:0 50%`);
      o.classList.add("glitch");
      anim(o, [[34.74, { o: 0, sx: -1 }], [34.77, { o: 1 }, "lin"], [35.05, { sx: 1 }, "expo"]]);
      jitter(o, 34.76, 35.12, 14);
      anim(S, [[33.655, { o: 0 }], [33.66, { o: 1 }, "lin"], ...tremor(33.68, 14)]);
    },
  });

  /* ================= 17 · Espelho (azul | preto) ================= */
  cena({
    id: "espelho", nome: "Espelho", inicio: 35.76, fim: 38.2, z: 26, margem: .3,
    descricao: "O mesmo cadeado espelhado: à esquerda azul e branco com PROTEGER; à direita preto e vermelho com “?”. O lado preto engole o azul.",
    montar(S) {
      fundo(S, "#000");
      const E = h("div", "abs", S, null, `left:0;top:0;width:540px;height:1920px;overflow:hidden;background:${AZ};transform-origin:0 50%`);
      grade(E, BRANCO);
      anim(E, [[38.0, { sx: 1 }], [38.2, { sx: 0 }, "inExpo"]]);
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      cadeado(sv, 110, 620, .66, "#FFFFFF", 35.9, .6, 6);
      cadeado(sv, 970, 620, -.66, VM, 35.9, .6, 6).setAttribute("transform", "translate(970 620) scale(-0.66 0.66)");
      draw(path(sv, "M540 230 V1700", { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "14 10" }), 35.78, 36.2, "out");
      centro(S, 290, SANS(54), [["A", 35.78], ["mesma", 35.88], ["tecnologia", 36.14]]);
      centro(S, 360, SANS(44, "rgba(255,255,255,.7)"), [["que", 36.72], ["pode", 36.92]]);
      bloco(S, X, 1100, "PROTEGER", 37.10, MONO(70), .2);
      linha(S, X, 1190, SANS(40, "rgba(255,255,255,.8)"), [["nossos", 37.60], ["dados", 37.78]]);
      const q = h("div", "abs", S, "?", `left:700px;top:1060px;${MONO(220, VM)}`); bate(q, 37.78, 1.8);
      anim(S, [[35.755, { o: 0 }], [35.76, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 18 · Ataque (preto, imagem vermelha) ================= */
  const LOG = ["[!] tentativa de acesso · 03:14:07", "[!] varredura em andamento", "[!] chave sob análise · rsa-1024", "[!] acesso negado"];
  cena({
    id: "ataque", nome: "Ataque", inicio: 38.14, fim: 40.94, z: 27, margem: .3,
    descricao: "O invasor em duotone vermelho e preto com linhas de interferência; um log rola em mono; “ATACAR” bate em vermelho com glitch e a tela treme em “sistemas”.",
    montar(S) {
      fundo(S, "#000");
      const { c, im } = duo(S, "invasor", -40, -60, 1160, 2080, "r", 1.1);
      anim(im, [[38.14, { s: 1.05 }], [40.94, { s: 1.16 }, "lin"]]);
      const lin = h("div", "layer", S, null, "background:repeating-linear-gradient(0deg,rgba(0,0,0,.4) 0 2px,transparent 2px 5px)");
      fx(t => lin.style.translate = `0 ${((t * 40) % 5).toFixed(1)}px`);
      h("div", "layer", S, null, "background:linear-gradient(rgba(0,0,0,.75) 0%,transparent 28%,transparent 52%,rgba(0,0,0,.88) 100%)");
      jitter(c, 39.8, 40.0, 18);
      LOG.forEach((l, i) => { const e = h("div", "abs", S, null, `left:${X}px;top:${250 + i * 46}px;font:500 28px var(--v-mono);color:#FF8A82;white-space:nowrap`); typeText(e, l, 38.2 + i * .5, 45); });
      linha(S, X, 1040, SANS(50), [["também", 38.18], ["pode", 38.74], ["ser", 38.98]]);
      linha(S, X, 1105, SANS(50), [["utilizada", 39.16], ["para", 39.64]]);
      const a = bloco(S, X, 1190, "ATACAR", 39.80, MONO(170, VM), .15); a.classList.add("glitch"); a.style.transformOrigin = "0 50%"; bate(a, 39.80, 1.5);
      jitter(a, 39.8, 40.05, 14);
      linha(S, X, 1390, SANS(64, "#fff", 500), [["sistemas.", 40.12]]);
      anim(S, [[38.135, { o: 0 }], [38.14, { o: 1 }, "lin"], ...tremor(40.12, 16)]);
    },
  });

  /* ================= 19 · Revolução ou perigo (azul / vermelho) ================= */
  cena({
    id: "dilema", nome: "Revolução ou perigo", inicio: 40.9, fim: 43.76, z: 28, margem: .3,
    descricao: "A escultura dividida: em cima em azul (REVOLUÇÃO), embaixo em vermelho e preto (PERIGO), com “OU” na linha do meio.",
    montar(S) {
      fundo(S, "#000");
      const top = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:960px;overflow:hidden");
      const bot = h("div", "abs", S, null, "left:0;top:960px;width:1080px;height:960px;overflow:hidden");
      const a = duo(top, "dilema", -60, -100, 1200, 2150, "b", 1.15), b = duo(bot, "dilema", -60, -1060, 1200, 2150, "r", 1.15);
      [a.im, b.im].forEach(im => anim(im, [[40.9, { s: 1.1 }], [43.76, { s: 1.0 }, "out"]]));
      anim(top, [[41.7, { o: .45 }], [41.75, { o: 1 }, "lin"]]);
      anim(bot, [[42.88, { o: .35 }], [42.9, { o: 1 }, "lin"]]); jitter(bot, 42.9, 43.15, 14);
      h("div", "abs", S, null, "left:0;top:0;width:1080px;height:440px;background:linear-gradient(rgba(0,0,0,.7),transparent)");
      h("div", "abs", S, null, "left:0;top:958px;width:1080px;height:4px;background:#fff");
      linha(S, X, 250, SANS(48), [["Estamos", 40.92], ["diante", 41.24], ["de", 41.52], ["uma", 41.64]]);
      const r = bloco(S, X, 760, "REVOLUÇÃO", 41.72, MONO(110) + `;background:${AZ};padding:6px 20px`, .22); r.style.transformOrigin = "0 50%"; bate(r, 41.72, 1.3);
      const ou = h("div", "abs", S, "OU", `left:${X}px;top:925px;padding:6px 20px;background:#000;border:3px solid #fff;${MONO(56)}`);
      anim(ou, [[42.2, { o: 0, s: 1.6 }], [42.24, { o: 1 }, "lin"], [42.4, { s: 1 }, "out5"]]);
      linha(S, X, 1060, SANS(46), [["de", 42.60], ["um", 42.70], ["novo", 42.76]]);
      const p = bloco(S, X, 1130, "PERIGO.", 42.90, MONO(130, VM) + ";background:#000;padding:6px 20px", .15); p.classList.add("glitch"); jitter(p, 42.9, 43.15, 12);
      anim(S, [[40.895, { o: 0 }], [40.9, { o: 1 }, "lin"], ...tremor(42.9, 12)]);
    },
  });

  /* ================= 20 · Cartela (azul, ficha técnica da logo) ================= */
  cena({
    id: "cartela", nome: "Cartela", inicio: 43.5, fim: 47.2, z: 30,
    descricao: "Papel milimetrado azul; a logo é escaneada em branco e medida com cotas, como uma ficha técnica; SIGA @matteu.ia e o botão SEGUIR com clique.",
    montar(S) {
      azul(S); sombraTopo(S);
      rotulo(S, X, 250, "FIG. 10 · FICHA TÉCNICA", 43.8);
      const LW = 460, LH = 259, LX = 540 - LW / 2, LY = 560, LOGO = MDS.img("logo");
      const lg = h("div", "abs", S, null, `left:${LX}px;top:${LY}px;width:${LW}px;height:${LH}px;background:#fff;-webkit-mask:url(${LOGO}) center/contain no-repeat;mask:url(${LOGO}) center/contain no-repeat`);
      fx(t => { const p = prog(t, 43.8, 44.3, "inOut"); lg.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(1)}% 0 0)`; });
      const scan = h("div", "abs", S, null, `left:${LX}px;top:${LY - 30}px;width:4px;height:${LH + 60}px;background:#fff;box-shadow:0 0 24px #fff`);
      fx(t => { const p = prog(t, 43.8, 44.3, "inOut"); scan.style.translate = `${(p * LW).toFixed(1)}px 0`; scan.style.opacity = t > 43.78 && t < 44.36 ? 1 : 0; });
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      cota(sv, LX, LY + LH + 40, LX + LW, LY + LH + 40, "460", "#fff", 44.25);
      cota(sv, LX + LW + 40, LY, LX + LW + 40, LY + LH, "259", "#fff", 44.35);
      [[LX - 30, LY - 30, "M0 30 V0 H30"], [LX + LW + 30, LY - 30, "M-30 0 H0 V30"], [LX - 30, LY + LH + 30, "M0 -30 V0 H30"], [LX + LW + 30, LY + LH + 30, "M-30 0 H0 V-30"]]
        .forEach(([x, y, d]) => draw(path(sv, d, { stroke: "#fff", "stroke-width": 3, fill: "none", transform: `translate(${x} ${y})` }), 43.7, 43.95));
      bloco(S, X, 1010, "SIGA", 44.7, MONO(110), .15);
      const hd = h("div", "abs", S, null, `left:${X}px;top:1150px;${MONO(64, "#fff", 500)}`);
      typeText(hd, MDS.PROJETO.perfil || "", 44.8, 16);
      const bt = h("div", "abs", S, null, `left:${X}px;top:1290px;width:440px;height:110px;border:4px solid #fff;display:flex;align-items:center;justify-content:center;gap:16px;${MONO(42, "#fff", 700)};transform-origin:0 50%`);
      const lab = h("span", "", bt, "SEGUIR +");
      at(45.47, on => { lab.textContent = on ? "SEGUINDO ✓" : "SEGUIR +"; bt.style.background = on ? "#fff" : "transparent"; bt.style.color = on ? AZ : "#fff"; });
      anim(bt, [[45.0, { o: 0, sx: 0, s: 1 }], [45.04, { o: 1 }, "lin"], [45.3, { sx: 1 }, "expo"], [45.38, { s: 1 }], [45.45, { s: .94 }, "out"], [45.65, { s: 1 }, "back"]]);
      const mo = h("div", "abs", S, '<svg viewBox="0 0 40 48" width="64" height="78"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="#fff" stroke="#1E3BFF" stroke-width="3" stroke-linejoin="round"/></svg>', "left:380px;top:1330px;transform-origin:10% 6%");
      anim(mo, [[45.05, { x: 300, y: 300, o: 0, s: 1 }], [45.1, { o: 1 }, "lin"], [45.42, { x: 0, y: 0 }, "expo"], [45.45, { s: .85 }, "out"], [45.6, { s: 1 }, "out"], [45.9, { x: 0, y: 0, o: 1 }], [46.3, { x: 260, y: 280, o: 0 }, "in"]]);
      anim(S, [...folha(43.5, .35), [44, { s: 1 }], [47.2, { s: 1.02 }, "lin"]]);
    },
  });

  /* ---------- efeitos sonoros: muitos, todos presos a eventos visuais (viram sons reais no sfx_real.py) ---------- */
  const SFX = [
    ["swell", .05, .5], ...[0, 1, 2, 3, 4].map(i => ["tick", .1 + i * .16, .35]), ["glitch", 1.14, .35], ["glitch", 1.58, .35],
    ["whoosh", 2.08, .6], ...[0, 1, 2].map(i => ["tick", 2.2 + i * .2, .4]), ["swoosh", 2.5, .5], ["glitch", 3.04], ["hit", 3.04, .8], ["pop", 3.30, .6],
    ["swoosh", 3.86, .8], ...[0, 1, 2, 3].map(i => ["tick", 4.04 + i * .12, .5]), ["glitch", 4.70, .4],
    ["boom", 6.43], ["swoosh", 6.98, .8],
    ["pop", 7.2, .5], ["click", 7.84, .5], ["whoosh", 8.9, .7],
    ["blip", 9.08, .45], ["blip", 9.52, .45], ["blip", 10.08, .45], ["blip", 10.64, .45], ["ding", 10.86, .7],
    ...Array.from({ length: 16 }, (_, i) => ["click", 11.26 + (Math.floor(i / 4) + i % 4) * .05, .3]), ["hit", 11.2, .7], ["glitch", 12.6, .45],
    ["whoosh", 13.78, .7], ["whoosh", 14.24, .7], ["whoosh", 14.42, .8], ["swoosh", 15.0, .6],
    ["swell", 15.12, .5], ["blip", 15.8, .3], ["blip", 16.2, .3], ["click", 16.64, .8], ["click", 16.78, .8],
    ["boom", 17.10], ["ding", 17.38, .5], ["ding", 17.6, .5], ["swoosh", 19.26, .8],
    ["pop", 19.44, .8], ...Array.from({ length: 12 }, (_, i) => ["tick", 20.4 + i * .05, .25]), ["hit", 20.96, .9],
    ["whoosh", 21.86, .8], ["pop", 22.16, .5], ["pop", 22.60, .5], ["hit", 22.66, .7],
    ["swoosh", 23.46, .8], ...[0, 1, 2, 3].map(i => ["tick", 25.30 + i * .12, .5]), ["chime", 26.22, .45], ["whoosh", 26.8, .7],
    ["swell", 27.5, .4], ["glitch", 29.58, .45], ["pop", 29.70, .5], ["pop", 29.82, .5], ["swoosh", 30.3, .6],
    ["whoosh", 30.46, .6], ...[0, 1, 2].map(i => ["tick", 30.6 + i * .3, .35]), ["chime", 32.66, .45], ["glitch", 33.5, .8],
    ["boom", 33.68], ["glitch", 34.76], ["flip", 34.8, .6], ["glitch", 35.05, .5],
    ["whoosh", 35.78, .5], ["tick", 36.2, .4], ["pop", 37.10, .6], ["hit", 37.78, .5], ["whoosh", 38.02, .7],
    ["swell", 38.2, .5], ["glitch", 39.6, .5], ["hit", 39.80], ["ding", 39.85, .45], ["glitch", 40.12, .7],
    ["riser", 41.0, .5], ["swoosh", 41.72, .5], ["pop", 42.2, .5], ["boom", 42.9], ["glitch", 42.92, .5],
    ["swoosh", 43.52, .8], ["swell", 43.8, .4], ["tick", 44.3, .4], ["tick", 44.4, .4], ["pop", 44.7, .6], ["pop", 45.04, .5], ["click", 45.45], ["chime", 45.5, .5],
  ];
  SFX.forEach(([k, t, g]) => MDS.sfx(k, t, g ?? 1));
  const teclas = (t0, n, cps, g = .5) => { for (let i = 0; i < n; i++) MDS.sfx("key", t0 + i / cps, g); };
  teclas(.05, 6, 12, .35); teclas(7.84, 6, 12, .45); teclas(38.2, 10, 12, .45); teclas(44.8, 8, 12, .55);
})();
