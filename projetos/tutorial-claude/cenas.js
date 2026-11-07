/* Tutorial: o estúdio de IA com Claude Code · @matteu.ia
 * Direção de arte aprovada: apresentação de produto (keynote). Preto + cinza-claro #F5F5F7,
 * palavras-chave em gradiente violeta → rosa → âmbar, Inter 4 (Display nos títulos) e JetBrains Mono no terminal.
 * Transições: zoom para dentro da janela, passagem de foco, deslizes suaves. Narração intacta (70,45 s). Sem música.
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, svg, path, draw, typeText, at, palco } = MDS;
  const CL = "#F5F5F7", INK = "#1D1D1F", G2 = "#86868B";

  /* ---------- fundos e transições ---------- */
  const fundo = (S, cor) => h("div", "layer", S, null, `inset:-80px;background:${cor}`);
  const preto = S => { fundo(S, "#000"); const g = h("div", "abs", S, null, "left:90px;top:560px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(124,92,255,.16),rgba(255,77,141,.06) 40%,transparent 65%)"); fx(t => g.style.scale = (1 + Math.sin(t * .9) * .05).toFixed(3)); };
  const claro = S => fundo(S, CL);
  // foco: entra desfocado e nítido / sai desfocando
  const focoEntra = (t, d = .4) => [[t, { o: 0, b: 24, s: 1.04 }], [t + d, { o: 1, b: 0, s: 1 }, "out"]];
  const focoSai = (t, d = .3) => [[t, { o: 1, b: 0 }], [t + d, { o: 0, b: 24 }, "in"]];
  const corte = t => [[t - .005, { o: 0 }], [t, { o: 1 }, "lin"]];
  // zoom para dentro de um ponto (assinatura): a cena cresce em direção a (x, y) e some
  const zoomPara = (S, x, y, t, d = .3) => { S.style.transformOrigin = `${x}px ${y}px`; return [[t, { s: 1, b: 0 }], [t + d, { s: 4, b: 10 }, "in"]]; };

  /* ---------- texto ---------- */
  const pw = (p, txt, t, cls = "", d = .5) => {
    const s = h("span", cls ? "pw " + cls : "pw", p, txt);
    anim(s, [[t, { o: 0, b: 14, y: 22, s: .97 }], [t + d, { o: 1, b: 0, y: 0, s: 1 }, "expo"]]);
    return s;
  };
  const L = (p, top, css, itens) => {
    const el = h("div", "hl", p, null, `top:${top}px;${css}`);
    itens.forEach(([txt, t, cls], k) => { if (k) el.append(" "); pw(el, txt, t, cls); });
    return el;
  };
  const TXT = (px, cor = "#fff", peso = 500) => `font:${peso} ${px}px/1.1 var(--v-sans);letter-spacing:${px > 80 ? "-.04em" : "-.02em"};color:${cor}`;
  const TIT = (px, cor = "#fff") => `font:600 ${px}px/1.04 var(--v-display);letter-spacing:-.045em;color:${cor}`;
  const bate = (el, t, s0 = 1.25) => anim(el, [[t - .01, { o: 0, s: s0, b: 10 }], [t + .02, { o: 1 }, "lin"], [t + .4, { s: 1, b: 0 }, "expo"]]);

  /* ---------- componentes genéricos (sem marcas reais) ---------- */
  function janela(p, x, y, w, hh, titulo, escura = false) {
    const el = h("div", "jan" + (escura ? " esc" : ""), p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background:${escura ? "#1C1C1E" : "#FFFFFF"}`);
    const dot = escura ? "#3A3A3C" : "#D1D1D6";
    h("div", "barra", el, `<i style="background:${dot}"></i><i style="background:${dot}"></i><i style="background:${dot}"></i><span style="flex:1;text-align:center;margin-right:66px;color:${escura ? "#8E8E93" : G2}">${titulo}</span>`,
      `border-bottom:1px solid ${escura ? "#2C2C2E" : "#E5E5EA"}`);
    const corpo = h("div", "", el, null, "position:absolute;left:0;right:0;top:65px;bottom:0");
    return { el, corpo };
  }
  const ICON = {
    pasta: "M3 7h6l2 2h10v10H3z", ferramenta: "M14 6a4 4 0 0 0 5 5l-9 9-3-3 9-9a4 4 0 0 1-2-2z", imagem: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6",
    lista: "M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1", motion: "M3 18c4-12 8-12 9 0s5 12 9 0", tesoura: "M6 6a3 3 0 1 0 .1 0M6 18a3 3 0 1 0 .1 0M8.5 7.5L20 18M8.5 16.5L20 6",
    som: "M3 12v0M7 8v8M11 4v16M15 8v8M19 11v2", cadeado: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3", nuvem: "M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4.5 4.5 0 0 0 1 9z",
  };
  const icone = (k, cor = "#1D1D1F", px = 64, w = 1.8) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[k]}"/></svg>`;
  // pasta grande em gradiente
  function pasta(p, x, y, w, rot = "") {
    const hh = w * .74, el = h("div", "abs", p, null, `left:${x - w / 2}px;top:${y - hh / 2}px;width:${w}px;height:${hh}px;transform-origin:50% 50%`);
    h("div", "abs", el, null, `left:0;top:0;width:${w * .42}px;height:${hh * .25}px;border-radius:${w * .05}px ${w * .05}px 0 0;background:linear-gradient(135deg,#8E78FF,#B06BFF)`);
    h("div", "abs", el, null, `left:0;top:${hh * .14}px;width:${w}px;height:${hh * .86}px;border-radius:${w * .06}px;background:linear-gradient(135deg,#7C5CFF 0%,#FF4D8D 60%,#FFB020 100%);box-shadow:0 30px 70px -25px rgba(124,92,255,.6)`);
    if (rot) h("div", "abs", el, rot, `left:0;top:${hh * .52}px;width:${w}px;text-align:center;font:600 ${w * .1}px var(--v-sans);letter-spacing:-.02em;color:#fff`);
    return el;
  }
  const miniPasta = (cor = "linear-gradient(135deg,#7C5CFF,#FF4D8D)") => `<span style="display:inline-block;width:56px;height:42px;border-radius:9px;background:${cor};position:relative;flex:none"><i style="position:absolute;left:0;top:-7px;width:24px;height:12px;border-radius:5px 5px 0 0;background:#8E78FF"></i></span>`;
  function selo(p, top, txt, t, escuro = true) {
    const el = h("div", "hl", p, null, `top:${top}px`);
    const s = h("span", "selo", el, txt, escuro ? "background:rgba(255,255,255,.1);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)" : "background:#fff;color:#1D1D1F;box-shadow:0 8px 24px -10px rgba(0,0,0,.25)");
    anim(s, [[t, { o: 0, s: .7, b: 8 }], [t + .45, { o: 1, s: 1, b: 0 }, "back"]]);
    return el;
  }
  function toggle(p, x, y, t) {
    const el = h("div", "tog", p, "<b></b>", `left:${x}px;top:${y}px`), kn = el.querySelector("b");
    fx(tt => { const q = prog(tt, t, t + .22, "out"); kn.style.translate = `${(44 * q).toFixed(1)}px 0`; el.style.background = q > .5 ? "linear-gradient(90deg,#7C5CFF,#FF4D8D)" : "#E5E5EA"; });
    return el;
  }
  const CURSOR = '<svg viewBox="0 0 40 48" width="58" height="70"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="#1D1D1F" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>';
  // cursor que percorre pontos [[t, x, y], ...] e clica nos tempos da lista
  function cursor(p, pontos, cliques = []) {
    const el = h("div", "abs", p, CURSOR, "left:0;top:0;transform-origin:10% 6%");
    const k = pontos.map(([t, x, y], i) => [t, { x, y, o: 1 }, i ? "inOutExpo" : "lin"]);
    k.unshift([pontos[0][0] - .2, { x: pontos[0][1] + 120, y: pontos[0][2] + 160, o: 0 }]);
    cliques.forEach(t => k.push([t, { s: 1 }], [t + .07, { s: .84 }, "out"], [t + .24, { s: 1 }, "out"]));
    anim(el, k); return el;
  }

  /* ================= 1 · Já imaginou (preto) ================= */
  cena({
    id: "abertura", nome: "Já imaginou", inicio: 0, fim: 3.3, z: 10,
    descricao: "Preto. A pergunta surge palavra por palavra com foco; “inteligência artificial” enorme em gradiente.",
    montar(S) {
      preto(S);
      L(S, 720, TXT(64), [["Já", 0], ["imaginou", .28], ["ter", .68], ["um", .82]]);
      L(S, 810, TXT(64), [["estúdio", .92], ["de", 1.24]]);
      L(S, 900, TIT(150), [["inteligência", 1.36, "grad"]]);
      L(S, 1060, TIT(150), [["artificial", 1.74, "grad"]]);
      L(S, 1240, TXT(54, G2, 400), [["trabalhando", 2.32], ["com", 2.70], ["você?", 2.86]]);
      anim(S, [[0, { s: 1.06 }], [3.1, { s: 1, b: 0, o: 1 }, "out"], ...focoSai(3.12, .2)]);
    },
  });

  /* ================= 2 · Tudo espalhado → um só lugar (claro) ================= */
  cena({
    id: "espalhado", nome: "Um só lugar", inicio: 3.2, fim: 10.02, z: 11,
    descricao: "Cards espalhados entram um por palavra (projetos, ferramentas, referências, métodos) e voam para dentro de uma única pasta “Estúdio” em “um só lugar”.",
    montar(S) {
      claro(S);
      const t1 = L(S, 300, TXT(50, G2, 400), [["Um", 3.46], ["lugar", 3.58], ["onde", 3.78], ["seus", 4.00]]);
      anim(t1, OUT(7.1, { dy: -30, d: .3 }));
      L(S, 300, TXT(50, G2, 400), [["ficam", 7.66], ["organizados", 8.10]]);
      L(S, 380, TIT(96, INK), [["em", 8.68], ["um", 9.02], ["só", 9.18], ["lugar.", 9.40, "grad"]]);
      const CX = 540, CY = 1020;
      const fo = pasta(S, CX, CY, 420, "Estúdio");
      anim(fo, [[7.55, { o: 0, s: .6 }], [7.95, { o: 1, s: 1 }, "back"], [9.40, { s: 1 }], [9.52, { s: 1.08 }, "out"], [9.75, { s: 1 }, "out"]]);
      [["Projetos", "pasta", 4.56, 110, 520, -8], ["Ferramentas", "ferramenta", 5.08, 610, 700, 6], ["Referências", "imagem", 5.90, 150, 1060, 5], ["Métodos", "lista", 6.72, 600, 1250, -6]].forEach(([n, ic, t, x, y, r], i) => {
        const c = h("div", "abs", S, `<div style="display:grid;place-items:center;height:130px">${icone(ic, INK, 78, 1.7)}</div><div style="text-align:center;font:600 34px var(--v-sans);letter-spacing:-.02em;color:${INK}">${n}</div>`,
          `left:${x}px;top:${y}px;width:320px;height:230px;border-radius:30px;background:#fff;box-shadow:0 30px 60px -28px rgba(0,0,0,.3);padding-top:16px`);
        const dx = CX - (x + 160), dy = CY - (y + 115), tv = 8.10 + i * .1;
        anim(c, [[t, { o: 0, s: .6, r: r * 2, y: 40 }], [t + .45, { o: 1, s: 1, r, y: 0 }, "back"], [tv, { x: 0, y: 0, s: 1, r, o: 1 }], [tv + .6, { x: dx, y: dy, s: .2, r: 0, o: 0 }, "inOutExpo"]]);
        MDS.floaty(c, 8, 1.1 + i * .2, i);
      });
      anim(S, [...focoEntra(3.2, .35), ...zoomPara(S, CX, CY, 9.78, .26)]);
    },
  });

  /* ================= 3 · Claude Code (preto, terminal) ================= */
  cena({
    id: "claude-code", nome: "Claude Code", inicio: 10.0, fim: 12.46, z: 12, margem: .4,
    descricao: "Terminal escuro sobe e digita o comando de abertura; “Claude Code” em gradiente, só como texto.",
    montar(S) {
      preto(S);
      L(S, 280, TXT(50, G2, 400), [["Hoje,", 10.08], ["vamos", 10.64], ["construir", 10.64], ["isso", 10.98]]);
      L(S, 360, TXT(50, "#fff", 400), [["usando", 11.30], ["o", 11.64]]);
      L(S, 440, TIT(140), [["Claude", 11.78, "grad"], ["Code", 12.00, "grad"]]);
      const { el, corpo } = janela(S, 110, 700, 860, 560, "terminal", true);
      const T = h("div", "term", corpo, null, "position:absolute;left:36px;top:30px;color:#F5F5F7");
      const l1 = h("div", "", T), c1 = h("span", "", l1, "~ › ", "color:#8E8E93"), cmd = h("span", "", l1), cr = h("span", "", l1, "▍", "color:#FF4D8D");
      typeText(cmd, "claude", 10.75, 14);
      fx(t => cr.style.opacity = t > 11.4 ? 0 : (Math.floor(t * 3) % 2 ? .2 : 1));
      [["✻ Claude Code", 11.6, "background:var(--grad);-webkit-background-clip:text;color:transparent;font-weight:700"], ["  pronto no seu projeto", 11.8, "color:#8E8E93"], ["  ~/estudio", 11.95, "color:#8E8E93"], ["", 0, ""], ["› ", 12.15, "color:#FF4D8D"]].forEach(([s, t, css]) => {
        const d = h("div", "", T, s || "&nbsp;", css); if (t) anim(d, [[t, { o: 0, y: 12 }], [t + .25, { o: 1, y: 0 }, "out"]]);
      });
      void c1;
      anim(el, [[10.0, { y: 700, o: 0 }], [10.05, { o: 1 }, "lin"], [10.6, { y: 0 }, "expo"]]);
      anim(S, corte(10.0));
    },
  });

  /* ================= 4 · 01 Estrutura (claro) ================= */
  cena({
    id: "estrutura", nome: "01 · Estrutura", inicio: 12.45, fim: 15.12, z: 13, margem: .4,
    descricao: "Selo da etapa 01; o terminal digita mkdir estudio e a pasta nasce com um pop.",
    montar(S) {
      claro(S);
      selo(S, 280, "01 · Estrutura", 12.48, false);
      L(S, 400, TXT(50, G2, 400), [["Primeiro,", 12.48], ["precisamos", 12.94]]);
      L(S, 480, TIT(100, INK), [["criar", 13.26], ["a", 13.54], ["estrutura", 13.70, "grad"]]);
      L(S, 610, TXT(50, G2, 400), [["do", 14.10], ["nosso", 14.24], ["estúdio.", 14.44]]);
      const { el, corpo } = janela(S, 90, 800, 560, 320, "terminal");
      const T = h("div", "term", corpo, null, `position:absolute;left:30px;top:26px;color:${INK};font-size:28px`);
      const a = h("div", "", T); h("span", "", a, "~ › ", `color:${G2}`); typeText(h("span", "", a), "mkdir estudio", 13.26, 16);
      const b = h("div", "", T); h("span", "", b, "~ › ", `color:${G2}`); typeText(h("span", "", b), "cd estudio", 14.1, 18);
      anim(b, [[14.0, { o: 0 }], [14.05, { o: 1 }, "lin"]]);
      anim(el, IN(12.5, { dy: 80, s: .96, b: 10, d: .5 }));
      const fo = pasta(S, 820, 960, 240);
      const rt = h("div", "abs", S, "estudio/", `left:700px;top:1070px;width:240px;text-align:center;font:500 30px var(--v-mono);color:${INK}`);
      anim(rt, [[14.5, { o: 0, y: 14 }], [14.8, { o: 1, y: 0 }, "out"]]);
      anim(fo, [[14.44, { o: 0, s: .3 }], [14.5, { o: 1 }, "lin"], [14.8, { s: 1 }, "back"]]);
      anim(S, [...corte(12.45), [14.92, { s: 1, o: 1, b: 0 }], [15.12, { s: 1.2, o: 0, b: 12 }, "in"]]);
    },
  });

  /* ================= 5 · O cérebro (preto) ================= */
  cena({
    id: "cerebro", nome: "O cérebro", inicio: 15.05, fim: 18.72, z: 14, margem: .4,
    descricao: "Preto: a pasta principal no centro e uma rede de nós luminosos saindo dela, como um cérebro.",
    montar(S) {
      preto(S);
      L(S, 290, TXT(60), [["Uma", 15.24], ["pasta", 15.44], ["principal", 15.70]]);
      L(S, 380, TXT(44, G2, 400), [["que", 16.14], ["vai", 16.32], ["funcionar", 16.44], ["como", 16.88], ["o", 17.04]]);
      const CX = 540, CY = 900;
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      const NOS = Array.from({ length: 14 }, (_, i) => { const a = i * 137.5 * Math.PI / 180, r = 250 + (i * 53 % 160); return [CX + Math.cos(a) * r * 1.05, CY + Math.sin(a) * r * .8]; });
      NOS.forEach(([x, y], i) => { const p = path(sv, `M${CX} ${CY} L${x} ${y}`, { stroke: "rgba(168,152,255,.55)", "stroke-width": 2.5 }); draw(p, 15.9 + i * .07, 16.5 + i * .07, "out"); });
      NOS.forEach(([x, y], i) => { const j = NOS[(i + 3) % NOS.length]; const p = path(sv, `M${x} ${y} L${j[0]} ${j[1]}`, { stroke: "rgba(255,77,141,.3)", "stroke-width": 1.5 }); draw(p, 16.6 + i * .05, 17.2 + i * .05, "out"); });
      NOS.forEach(([x, y], i) => {
        const d = h("div", "abs", S, null, `left:${x - 12}px;top:${y - 12}px;width:24px;height:24px;border-radius:50%;background:${["#7C5CFF", "#FF4D8D", "#FFB020"][i % 3]};box-shadow:0 0 20px ${["#7C5CFF", "#FF4D8D", "#FFB020"][i % 3]}`);
        anim(d, [[15.95 + i * .07, { s: 0 }], [16.3 + i * .07, { s: 1 }, "back"]]);
        fx(t => d.style.scale = t > 17.2 ? (1 + .35 * Math.exp(-(t - 17.2 - (i % 5) * .08) * 4) * (t - 17.2 > (i % 5) * .08 ? 1 : 0)).toFixed(3) : 1);
      });
      const fo = pasta(S, CX, CY, 320);
      anim(fo, [[15.05, { s: 1.5, o: 0 }], [15.4, { s: 1, o: 1 }, "expo"]]);
      L(S, 1290, TIT(160), [["cérebro", 17.20, "grad"]]);
      L(S, 1470, TXT(48, G2, 400), [["de", 17.48], ["toda", 17.66], ["a", 17.84], ["operação.", 18.02]]);
      anim(S, [...corte(15.05), [15.05, { s: 1 }], [18.45, { s: 1.04 }, "lin"], ...zoomPara(S, CX, CY, 18.46, .26)]);
    },
  });

  /* ================= 6 · As seis pastas (claro, janela de arquivos) ================= */
  const PASTAS = [["entradas", 20.32, "narrações, roteiros, referências recebidas"], ["ferramentas", 21.04, "scripts do estúdio"], ["referencias", 21.70, "guias de estilo e exemplos"], ["projetos", 22.46, "um vídeo por pasta"], ["biblioteca", 23.10, "sons, fontes, imagens"], ["metodos", 23.86, "o passo a passo de produção"]];
  cena({
    id: "pastas", nome: "As seis pastas", inicio: 18.7, fim: 24.96, z: 15, margem: .4,
    descricao: "Janela de arquivos “estudio”: uma pasta aparece por palavra (entradas, ferramentas, referências, projetos, biblioteca, métodos) e o cursor acompanha.",
    montar(S) {
      claro(S);
      L(S, 270, TXT(48, G2, 400), [["Dentro", 18.76], ["dela,", 19.04], ["vamos", 19.60]]);
      L(S, 345, TIT(84, INK), [["organizar", 19.62, "grad"]]);
      const { el, corpo } = janela(S, 90, 480, 900, 920, "estudio");
      PASTAS.forEach(([n, t, d], i) => {
        const r = h("div", "abs", corpo, `${miniPasta()}<div style="flex:1;min-width:0"><div style="font:600 38px var(--v-sans);letter-spacing:-.02em;color:${INK}">${n}/</div><div style="font:400 26px var(--v-sans);color:${G2};margin-top:2px">${d}</div></div><span class="ok" style="font:600 30px var(--v-sans);color:#7C5CFF">✓</span>`,
          `left:30px;right:30px;top:${24 + i * 138}px;height:122px;display:flex;align-items:center;gap:28px;padding:0 26px;border-radius:20px`);
        anim(r, [[t - .02, { o: 0, x: -40, b: 8 }], [t + .35, { o: 1, x: 0, b: 0 }, "expo"]]);
        fx(tt => { r.style.background = tt >= t && tt < (PASTAS[i + 1] ? PASTAS[i + 1][1] : 24.6) ? "rgba(124,92,255,.08)" : "transparent"; });
        anim(r.querySelector(".ok"), [[t + .2, { o: 0, s: .4 }], [t + .45, { o: 1, s: 1 }, "back"]]);
      });
      cursor(S, PASTAS.map(([, t], i) => [t + .05, 820, 480 + 65 + 24 + i * 138 + 70]), PASTAS.map(([, t]) => t + .3));
      L(S, 1450, TXT(46, G2, 400), [["e", 23.56], ["métodos", 23.86], ["de", 24.30], ["trabalho.", 24.40]]);
      anim(el, [[18.7, { o: 0, s: .3, b: 14 }], [19.1, { o: 1, s: 1, b: 0 }, "expo"]]);
      anim(S, [[18.7, { o: 0 }], [18.75, { o: 1 }, "lin"], [24.7, { s: 1, o: 1, b: 0 }], [24.96, { s: .7, o: 0, b: 10 }, "in"]]);
    },
  });

  /* ================= 7 · Não faz tudo (preto) ================= */
  cena({
    id: "nao-faz", nome: "Não faz tudo", inicio: 24.95, fim: 27.12, z: 16, margem: .3,
    descricao: "Preto: a árvore de pastas pequena e apagada ao fundo; “não faz tudo.” grande.",
    montar(S) {
      preto(S);
      const mini = h("div", "abs", S, null, "left:390px;top:1060px;width:300px");
      PASTAS.forEach(([n]) => h("div", "", mini, `${miniPasta("#3A3A3C")}<span style="font:500 26px var(--v-sans);color:#636366">${n}/</span>`, "display:flex;align-items:center;gap:18px;height:62px"));
      anim(mini, [[24.95, { o: 0, s: 1.4 }], [25.4, { o: .8, s: 1 }, "expo"]]);
      L(S, 600, TXT(56, G2, 400), [["Mas", 24.98], ["a", 25.18], ["estrutura", 25.26], ["sozinha", 25.60]]);
      const nf = L(S, 700, TIT(140), [["não", 26.08], ["faz", 26.40], ["tudo.", 26.58]]);
      void nf;
      anim(S, corte(24.95));
    },
  });

  /* ================= 8 · 02 Skills (preto) ================= */
  cena({
    id: "skills", nome: "02 · Skills", inicio: 27.1, fim: 28.95, z: 17, margem: .3,
    descricao: "Selo da etapa 02 e “skills.” enorme em gradiente.",
    montar(S) {
      preto(S);
      selo(S, 560, "02 · Skills", 27.16);
      L(S, 700, TXT(56, G2, 400), [["É", 27.16], ["aqui", 27.30], ["que", 27.50], ["entram", 27.70], ["as", 27.94]]);
      const sk = h("div", "hl", S, "skills.", `top:800px;${TIT(260, "transparent")}`); sk.classList.add("grad");
      bate(sk, 28.22, 1.3);
      S.style.transformOrigin = "540px 930px";
      anim(S, [...corte(27.1), [28.7, { s: 1, o: 1, b: 0 }], [28.95, { s: .35, o: 0, b: 8 }, "in"]]);
    },
  });

  /* ================= 9 · Ensinar ao Claude (claro, documento de skill) ================= */
  const PASSOS = ["Analisar a narração", "Escrever o storyboard", "Animar as cenas", "Revisar quadro a quadro", "Exportar o MP4"];
  cena({
    id: "ensinar", nome: "Ensinar ao Claude", inicio: 28.9, fim: 34.45, z: 18, margem: .3,
    descricao: "Documento de skill genérico “Produzir vídeo”: os passos se marcam um a um; “processos” e “padrões” em gradiente.",
    montar(S) {
      claro(S);
      L(S, 260, TXT(48, G2, 400), [["Elas", 28.96], ["permitem", 29.12], ["ensinar", 29.48], ["ao", 29.84], ["Claude", 30.00]]);
      L(S, 330, TXT(48, G2, 400), [["como", 30.28], ["executar", 30.52], ["tarefas", 30.94], ["específicas,", 31.32]]);
      const { el, corpo } = janela(S, 110, 440, 860, 940, "SKILL.md");
      h("div", "abs", corpo, `<div style="font:500 24px var(--v-mono);color:#7C5CFF;letter-spacing:.04em">SKILL</div><div style="${TIT(68, INK)};margin-top:10px">Produzir vídeo</div><div style="font:400 30px var(--v-sans);color:${G2};margin-top:12px">Use quando chegar uma narração nova.</div>`, "left:50px;top:44px;right:50px");
      PASSOS.forEach((n, i) => {
        const t = 30.52 + i * .5;
        const r = h("div", "abs", corpo, `<span class="nu" style="width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font:600 26px var(--v-sans);box-shadow:inset 0 0 0 2px #D2D2D7;color:${G2};flex:none">${i + 1}</span><span style="font:500 36px var(--v-sans);letter-spacing:-.02em;color:${INK}">${n}</span>`,
          `left:50px;right:50px;top:${300 + i * 110}px;height:90px;display:flex;align-items:center;gap:26px`);
        const nu = r.querySelector(".nu");
        at(t + .2, on => { nu.style.background = on ? "linear-gradient(135deg,#7C5CFF,#FF4D8D)" : "transparent"; nu.style.color = on ? "#fff" : G2; nu.style.boxShadow = on ? "none" : "inset 0 0 0 2px #D2D2D7"; nu.textContent = on ? "✓" : String(i + 1); });
        anim(r, [[29.6 + i * .06, { o: 0, y: 24 }], [30.0 + i * .06, { o: 1, y: 0 }, "expo"]]);
      });
      anim(el, [[28.9, { o: 0, s: .5, b: 12 }], [29.35, { o: 1, s: 1, b: 0 }, "expo"]]);
      L(S, 1430, TXT(52, INK), [["seguindo", 32.30], ["processos", 32.64, "grad"], ["e", 33.18], ["padrões", 33.30, "grad"]]);
      L(S, 1505, TXT(42, G2, 400), [["de", 33.62], ["produção.", 33.76]]);
      anim(S, [[28.9, { o: 0 }], [28.95, { o: 1 }, "lin"], [34.2, { x: 0 }], [34.45, { x: -1100 }, "inExpo"]]);
    },
  });

  /* ================= 10 · Três ferramentas (claro, cards com interruptores) ================= */
  cena({
    id: "ferramentas", nome: "Três ferramentas", inicio: 34.3, fim: 38.96, z: 19, margem: .3,
    descricao: "Três cards de skill (Motion design, Edição, Efeitos sonoros); o cursor liga cada interruptor na palavra.",
    montar(S) {
      claro(S);
      L(S, 290, TIT(76, INK), [["Podemos", 34.46], ["adicionar", 34.68]]);
      L(S, 390, TXT(48, G2, 400), [["ferramentas", 35.16], ["voltadas", 35.64], ["para", 36.04]]);
      const C = [["Motion design", "motion", "animação e tipografia cinética", 36.32], ["Edição", "tesoura", "cortes, ritmo e transições", 37.26], ["Efeitos sonoros", "som", "sons reais sincronizados", 37.90]];
      C.forEach(([n, ic, d, t], i) => {
        const y = 560 + i * 280;
        const c = h("div", "abs", S, `<span style="width:132px;height:132px;border-radius:32px;background:linear-gradient(135deg,#7C5CFF,#FF4D8D 70%,#FFB020);display:grid;place-items:center;flex:none">${icone(ic, "#fff", 70, 1.8)}</span>
          <div style="flex:1;min-width:0"><div style="${TIT(50, INK)}">${n}</div><div style="font:400 30px var(--v-sans);color:${G2};margin-top:8px">${d}</div></div>`,
          `left:90px;top:${y}px;width:900px;height:240px;border-radius:36px;background:#fff;box-shadow:0 30px 60px -30px rgba(0,0,0,.25);display:flex;align-items:center;gap:34px;padding:0 180px 0 40px`);
        toggle(c, 760, 87, t);
        anim(c, [[34.5 + i * .15, { o: 0, x: 600, b: 10 }], [35.0 + i * .15, { o: 1, x: 0, b: 0 }, "expo"]]);
      });
      cursor(S, C.map(([, , , t], i) => [t - .1, 905, 560 + i * 280 + 140]), C.map(([, , , t]) => t - .02));
      anim(S, [[34.3, { x: 1100 }], [34.6, { x: 0 }, "expo"]]);
    },
  });

  /* ================= 11 · 03 GitHub (preto) ================= */
  cena({
    id: "github", nome: "03 · GitHub", inicio: 38.95, fim: 41.62, z: 20, margem: .3,
    descricao: "Selo da etapa 03; a pasta do estúdio se conecta a um servidor na nuvem chamado GitHub (só a palavra); pulsos de dados viajam.",
    montar(S) {
      preto(S);
      selo(S, 280, "03 · GitHub", 39.02);
      L(S, 400, TIT(76), [["Agora,", 39.02], ["vamos", 39.58], ["conectar", 39.60]]);
      L(S, 500, TXT(50, G2, 400), [["nosso", 40.00], ["projeto", 40.16], ["ao", 40.56], ["GitHub.", 40.92, "grad"]]);
      const fo = pasta(S, 270, 950, 300, "estudio");
      anim(fo, [[39.1, { o: 0, x: -200 }], [39.5, { o: 1, x: 0 }, "expo"]]);
      const srv = h("div", "abs", S, `<div style="display:grid;place-items:center;height:150px">${icone("nuvem", "#fff", 110, 1.5)}</div>${[0, 1, 2].map(() => '<i style="display:block;height:14px;margin:12px 34px 0;border-radius:7px;background:#3A3A3C"></i>').join("")}`,
        "left:640px;top:810px;width:300px;height:280px;border-radius:30px;background:#1C1C1E;box-shadow:0 0 0 1px rgba(255,255,255,.1)");
      anim(srv, [[39.2, { o: 0, x: 200 }], [39.6, { o: 1, x: 0 }, "expo"]]);
      const nm = h("div", "abs", S, "GitHub", `left:640px;top:1110px;width:300px;text-align:center;${TXT(40, "#fff", 600)}`);
      anim(nm, IN(40.92, { dy: 20, s: 1, b: 8, d: .4 }));
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      const ln = path(sv, "M430 950 C 520 880, 560 880, 640 950", { stroke: "#A898FF", "stroke-width": 4, fill: "none", "stroke-dasharray": "10 10" });
      draw(ln, 39.60, 40.3, "inOut");
      for (let k = 0; k < 3; k++) {
        const d = h("div", "abs", S, null, "left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#FF4D8D;box-shadow:0 0 16px #FF4D8D");
        fx(t => { if (t < 40.92) { d.style.opacity = 0; return; } const p = ((t - 40.92) * .9 + k / 3) % 1, u = 1 - p;
          const x = u * u * u * 430 + 3 * u * u * p * 520 + 3 * u * p * p * 560 + p * p * p * 640, y = u * u * u * 950 + 3 * u * u * p * 880 + 3 * u * p * p * 880 + p * p * p * 950;
          d.style.opacity = 1; d.style.left = x + "px"; d.style.top = y + "px"; });
      }
      anim(S, [...corte(38.95), ...focoSai(41.4, .22)]);
    },
  });

  /* ================= 12 · Histórico salvo (claro, linha de commits) ================= */
  const COMMITS = [["Estrutura do estúdio", "a1f3c9e"], ["Skills de produção", "7d2b014"], ["Ferramentas de som", "c94e7aa"], ["Storyboard aprovado", "3b8f0d2"], ["Vídeo exportado", "e05c6b1"]];
  cena({
    id: "historico", nome: "Histórico salvo", inicio: 41.5, fim: 46.62, z: 21, margem: .3,
    descricao: "Linha do tempo de versões salvas; cadeado em “preservar”; em “continuar de onde paramos” o cursor clica na última versão e a barra retoma.",
    montar(S) {
      claro(S);
      L(S, 270, TXT(48, G2, 400), [["Assim,", 41.68], ["conseguimos", 42.28], ["manter", 42.54]]);
      L(S, 345, TIT(72, INK), [["os", 42.82], ["arquivos", 42.96], ["organizados,", 43.26]]);
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      draw(path(sv, "M170 520 V1220", { stroke: "#D2D2D7", "stroke-width": 4 }), 42.2, 43.3, "out");
      COMMITS.forEach(([n, hs], i) => {
        const y = 520 + i * 170, t = 42.28 + i * .25;
        const dot = h("div", "abs", S, null, `left:152px;top:${y - 18}px;width:36px;height:36px;border-radius:50%;background:${i === 4 ? "linear-gradient(135deg,#7C5CFF,#FF4D8D)" : "#fff"};box-shadow:inset 0 0 0 4px ${i === 4 ? "transparent" : "#7C5CFF"}`);
        anim(dot, [[t, { s: 0 }], [t + .3, { s: 1 }, "back"]]);
        const c = h("div", "abs", S, `<div style="${TXT(36, INK, 600)}">${n}</div><div style="font:500 24px var(--v-mono);color:${G2};margin-top:6px">${hs} · salvo</div>`,
          `left:230px;top:${y - 56}px;width:700px;height:112px;border-radius:24px;background:#fff;box-shadow:0 20px 40px -24px rgba(0,0,0,.25);padding:20px 30px`);
        anim(c, [[t, { o: 0, x: 60 }], [t + .4, { o: 1, x: 0 }, "expo"]]);
      });
      const lk = h("div", "abs", S, `${icone("cadeado", "#fff", 50, 2)}<span style="${TXT(34, "#fff", 600)}">preservar o trabalho</span>`, "left:540px;top:1290px;translate:-50% 0;height:84px;padding:0 34px;border-radius:42px;background:#1D1D1F;display:flex;align-items:center;gap:16px;white-space:nowrap");
      anim(lk, [[44.06, { o: 0, s: .6 }], [44.4, { o: 1, s: 1 }, "back"], [45.0, { o: 1, y: 0 }], [45.15, { o: 0, y: -30 }, "in"]]);
      const pb = h("div", "abs", S, `<div style="display:flex;justify-content:space-between;font:500 28px var(--v-sans);color:${G2}"><span>Retomando de onde parou</span><span class="pc" style="font-family:var(--v-mono);color:${INK}">60%</span></div><div style="margin-top:14px;height:14px;border-radius:7px;background:#E5E5EA;overflow:hidden"><i class="br" style="display:block;height:100%;width:60%;background:var(--grad)"></i></div>`, "left:150px;top:1300px;width:780px");
      anim(pb, [[45.2, { o: 0, y: 20 }], [45.5, { o: 1, y: 0 }, "expo"]]);
      fx(t => { const v = 60 + 40 * prog(t, 45.6, 46.4, "inOut"); pb.querySelector(".br").style.width = v + "%"; pb.querySelector(".pc").textContent = Math.round(v) + "%"; });
      cursor(S, [[44.8, 700, 1330], [45.1, 600, 1215]], [45.16]);
      L(S, 1430, TIT(64, INK), [["continuar", 45.16, "grad"], ["de", 45.54], ["onde", 45.78], ["paramos.", 45.92]]);
      anim(S, [...focoEntra(41.5, .35)]);
    },
  });

  /* ================= 13 · 04 Ambiente (claro, ajustes + instruções) ================= */
  cena({
    id: "ambiente", nome: "04 · Ambiente", inicio: 46.6, fim: 51.98, z: 22, margem: .3,
    descricao: "Selo da etapa 04; painel de ajustes liga três opções e um documento de instruções é digitado; sino em “funcionar”.",
    montar(S) {
      claro(S);
      selo(S, 260, "04 · Ambiente", 46.70, false);
      L(S, 360, TXT(44, G2, 400), [["Com", 46.70], ["a", 46.82], ["estrutura", 46.88], ["preparada,", 47.20]]);
      L(S, 425, TIT(76, INK), [["configurar", 48.46], ["o", 48.92], ["ambiente", 49.02, "grad"]]);
      const A = janela(S, 110, 560, 860, 420, "Ajustes do ambiente");
      [["Rede liberada", 48.46], ["Preparação automática", 48.70], ["Ferramentas instaladas", 48.94]].forEach(([n, t], i) => {
        const r = h("div", "abs", A.corpo, `<span style="${TXT(36, INK, 500)}">${n}</span>`, `left:44px;right:44px;top:${28 + i * 108}px;height:96px;display:flex;align-items:center;border-bottom:${i < 2 ? "1px solid #E5E5EA" : "none"}`);
        toggle(r, 662, 15, t);
      });
      anim(A.el, [[46.8, { o: 0, y: 80, b: 10 }], [47.3, { o: 1, y: 0, b: 0 }, "expo"]]);
      const B = janela(S, 110, 1020, 860, 430, "Instruções do estúdio");
      const tx = h("div", "abs", B.corpo, null, `left:44px;right:44px;top:30px;font:400 32px/1.5 var(--v-sans);color:${INK};white-space:pre-line`);
      typeText(tx, "Como o nosso estúdio funciona:\n1. Leia o guia de estilo\n2. Storyboard antes de produzir\n3. Revise e exporte", 49.58, 34);
      anim(B.el, [[49.3, { o: 0, y: 80, b: 10 }], [49.75, { o: 1, y: 0, b: 0 }, "expo"]]);
      L(S, 1490, TXT(40, G2, 400), [["e", 49.22], ["orientar", 49.58], ["o", 49.90], ["Claude", 50.00], ["sobre", 50.30], ["como", 50.56]]);
      anim(S, [...corte(46.6), ...zoomPara(S, 540, 1235, 51.72, .26)]);
    },
  });

  /* ================= 14 · A parte interessante (preto) ================= */
  cena({
    id: "interessante", nome: "A parte interessante", inicio: 51.95, fim: 53.88, z: 23, margem: .3,
    descricao: "Preto: “a parte interessante.” em gradiente.",
    montar(S) {
      preto(S);
      L(S, 740, TXT(62), [["E", 52.00], ["aqui", 52.32], ["está", 52.50], ["a", 52.76], ["parte", 52.84]]);
      const it = h("div", "hl", S, "interessante.", `top:850px;${TIT(150, "transparent")}`); it.classList.add("grad"); bate(it, 53.00, 1.15);
      anim(S, [...corte(51.95), [51.95, { s: 1 }], [53.6, { s: 1.04 }, "lin"], ...focoSai(53.66, .22)]);
    },
  });

  /* ================= 15 · Antes × agora (claro) ================= */
  const BAL = ["Nosso estilo é…", "Lembra que o storyboard vem antes…", "As pastas ficam em…", "De novo: o estilo é…", "Lembra que…"];
  cena({
    id: "antes-agora", nome: "Antes × agora", inicio: 53.85, fim: 59.78, z: 24, margem: .3,
    descricao: "Antes: balões repetindo a mesma explicação e ficando cinza. Agora: a árvore do estúdio, com o cursor do Claude consultando as pastas.",
    montar(S) {
      claro(S);
      L(S, 260, TXT(50, INK, 500), [["Em", 53.88], ["vez", 54.02], ["de", 54.16], ["explicar", 54.32], ["tudo", 54.62], ["novamente", 54.88]]);
      L(S, 330, TXT(42, G2, 400), [["a", 55.24], ["cada", 55.52], ["projeto,", 55.68]]);
      const E = h("div", "abs", S, null, "left:60px;top:450px;width:460px;height:940px");
      h("div", "", E, "ANTES", `font:600 26px var(--v-sans);letter-spacing:.12em;color:${G2};margin-bottom:24px`);
      BAL.forEach((b, i) => {
        const t = [54.32, 54.62, 54.88, 55.24, 55.52][i];
        const el = h("div", "abs", E, b, `left:0;top:${70 + i * 150}px;max-width:440px;padding:22px 28px;border-radius:30px 30px 30px 8px;background:#E5E5EA;font:500 30px/1.3 var(--v-sans);color:${INK}`);
        anim(el, [[t, { o: 0, y: 30, s: .9 }], [t + .3, { o: 1, y: 0, s: 1 }, "back"]]);
      });
      anim(E, [[56.3, { o: 1 }], [56.6, { o: .3 }, "out"]]);
      const R = h("div", "abs", S, null, "left:560px;top:450px;width:460px;height:940px");
      h("div", "", R, "AGORA", "font:600 26px var(--v-sans);letter-spacing:.12em;color:#7C5CFF;margin-bottom:24px");
      const rows = PASTAS.map(([n], i) => h("div", "abs", R, `${miniPasta()}<span style="font:600 32px var(--v-sans);color:${INK}">${n}/</span>`, `left:0;right:0;top:${70 + i * 118}px;height:96px;display:flex;align-items:center;gap:20px;padding:0 20px;border-radius:18px`));
      anim(R, [[56.3, { o: .25 }], [56.6, { o: 1 }, "out"]]); R.style.opacity = .25;
      const ORD = [[56.78, 0], [57.22, 3], [57.78, 2], [58.18, 4], [58.92, 1], [59.06, 5]];
      fx(t => rows.forEach((r, i) => { const on = ORD.some(([tt, k]) => k === i && t >= tt); r.style.background = on ? "rgba(124,92,255,.10)" : "transparent"; r.style.boxShadow = on ? "inset 5px 0 0 #7C5CFF" : "none"; }));
      cursor(S, ORD.map(([t, k]) => [t - .12, 960, 450 + 70 + k * 118 + 40]), ORD.map(([t]) => t));
      L(S, 1430, TIT(64, INK), [["estrutura", 57.36, "grad"], ["organizada", 58.18]]);
      L(S, 1515, TXT(42, G2, 400), [["para", 58.92], ["consultar.", 59.06]]);
      anim(S, focoEntra(53.85, .35));
    },
  });

  /* ================= 16 · Fluxo de produção (preto) ================= */
  const NOS = ["Roteiro", "Storyboard", "Animação", "Revisão", "Vídeo"];
  cena({
    id: "fluxo", nome: "Fluxo de produção", inicio: 59.75, fim: 63.52, z: 25, margem: .3,
    descricao: "Um balão de conversa vira uma linha de produção com 5 nós (Roteiro → Storyboard → Animação → Revisão → Vídeo) e um pulso de luz percorre a linha.",
    montar(S) {
      preto(S);
      L(S, 290, TXT(56), [["Isso", 59.82], ["transforma", 60.00], ["uma", 60.50]]);
      L(S, 375, TXT(46, G2, 400), [["simples", 60.58], ["conversa", 60.88]]);
      const bl = h("div", "abs", S, "uma simples conversa", "left:540px;top:900px;translate:-50% -50%;padding:30px 44px;border-radius:40px 40px 40px 10px;background:#2C2C2E;font:500 38px var(--v-sans);color:#fff;white-space:nowrap");
      anim(bl, [[59.85, { o: 0, s: .7 }], [60.1, { o: 1, s: 1 }, "back"], [60.45, { s: 1, o: 1 }], [60.75, { s: .2, o: 0 }, "in"]]);
      const Y = 940, X0 = 140, DX = 180;
      const sv = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      draw(path(sv, `M${X0} ${Y} H${X0 + 4 * DX}`, { stroke: "#3A3A3C", "stroke-width": 4 }), 60.7, 61.5, "inOut");
      NOS.forEach((n, i) => {
        const x = X0 + i * DX, t = 60.75 + i * .12;
        const c = h("div", "abs", S, `${i + 1}`, `left:${x - 50}px;top:${Y - 50}px;width:100px;height:100px;border-radius:50%;background:#1C1C1E;box-shadow:inset 0 0 0 3px #A898FF;display:grid;place-items:center;font:600 36px var(--v-sans);color:#fff`);
        anim(c, [[t, { s: 0 }], [t + .35, { s: 1 }, "back"]]);
        const lb = h("div", "abs", S, n, `left:${x - 90}px;top:${Y + 70}px;width:180px;text-align:center;font:500 26px var(--v-sans);color:#C7C7CC`);
        anim(lb, IN(t + .1, { dy: 16, s: 1, b: 6, d: .35 }));
        fx(tt => { const p = (tt - 62.30) * .55 % 1; const ativo = tt >= 62.30 && Math.abs(p * 4 - i) < .5; c.style.background = ativo ? "linear-gradient(135deg,#7C5CFF,#FF4D8D)" : "#1C1C1E"; });
      });
      const pulso = h("div", "abs", S, null, `left:0;top:${Y - 12}px;width:24px;height:24px;margin-left:-12px;border-radius:50%;background:#FFB020;box-shadow:0 0 24px #FFB020`);
      fx(t => { const p = Math.max(0, t - 62.30) * .55 % 1; pulso.style.left = (X0 + p * 4 * DX) + "px"; pulso.style.opacity = t >= 62.30 ? 1 : 0; });
      L(S, 1250, TXT(46, G2, 400), [["em", 61.48], ["um", 61.78], ["verdadeiro", 61.88]]);
      L(S, 1330, TIT(88), [["fluxo", 62.30, "grad"], ["de", 62.72, "grad"], ["produção.", 62.76, "grad"]]);
      anim(S, corte(59.75));
    },
  });

  /* ================= 17 · Apenas o começo (preto) ================= */
  cena({
    id: "comeco", nome: "Apenas o começo", inicio: 63.5, fim: 65.12, z: 26, margem: .3,
    descricao: "“apenas o começo.” com “começo” em gradiente.",
    montar(S) {
      preto(S);
      L(S, 780, TXT(64), [["E", 63.56], ["esse", 63.72], ["é", 63.90], ["apenas", 64.04], ["o", 64.30]]);
      const cm = h("div", "hl", S, "começo.", `top:880px;${TIT(210, "transparent")}`); cm.classList.add("grad"); bate(cm, 64.52, 1.3);
      anim(S, corte(63.5));
    },
  });

  /* ================= 18 · Próxima parte (claro, prévias) ================= */
  cena({
    id: "proxima", nome: "Próxima parte", inicio: 65.1, fim: 70.55, z: 27, margem: .3,
    descricao: "Selo “Parte 2”; três telas verticais com quadros dos nossos próprios vídeos deslizam; “próprios vídeos” em gradiente.",
    montar(S) {
      claro(S);
      selo(S, 260, "Parte 2", 65.26, false);
      L(S, 360, TXT(46, G2, 400), [["Na", 65.16], ["próxima", 65.26], ["parte,", 65.48]]);
      L(S, 430, TIT(64, INK), [["vamos", 65.96], ["utilizar", 66.56], ["esse", 66.80], ["estúdio", 67.12]]);
      [["previa2", 70, 640, .9, -6], ["previa1", 380, 590, 1, 0], ["previa3", 690, 640, .9, 6]].forEach(([n, x, y, s, r], i) => {
        const f = h("div", "abs", S, null, `left:${x}px;top:${y}px;width:320px;height:569px;border-radius:44px;background:#000;padding:10px;box-shadow:0 40px 80px -30px rgba(0,0,0,.45);transform-origin:50% 50%`);
        const im = h("img", "", f, null, "width:100%;height:100%;object-fit:cover;border-radius:36px;display:block"); im.src = MDS.img(n);
        const t = 66.56 + [1, 0, 2][i] * .12;
        anim(f, [[t, { o: 0, x: 700, r: r + 10, s }], [t + .5, { o: 1, x: 0, r, s }, "expo"]]);
        MDS.floaty(f, 8, 1 + i * .2, i);
      });
      L(S, 1270, TXT(44, G2, 400), [["para", 67.46], ["produzir", 67.64], ["nossos", 68.04]]);
      L(S, 1340, TIT(100), [["próprios", 68.18, "grad"], ["vídeos", 68.72, "grad"]]);
      L(S, 1480, TXT(42, G2, 400), [["com", 68.94], ["inteligência", 69.14], ["artificial.", 69.66]]);
      anim(S, [...corte(65.1), ...zoomPara(S, 540, 875, 70.28, .26)]);
    },
  });

  /* ================= 19 · Cartela (preto, logo) ================= */
  cena({
    id: "cartela", nome: "Cartela", inicio: 70.5, fim: 74.0, z: 30,
    descricao: "A logo em branco aparece com um brilho em gradiente; “Siga @matteu.ia” e “Parte 2 em breve”.",
    montar(S) {
      preto(S);
      const LW = 420, LH = 236, LOGO = MDS.img("logo");
      const gl = h("div", "abs", S, null, "left:240px;top:520px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(124,92,255,.45),rgba(255,77,141,.18) 45%,transparent 70%);filter:blur(10px)");
      anim(gl, [[70.55, { o: 0, s: .6 }], [71.2, { o: 1, s: 1 }, "out"]]);
      const lg = h("div", "abs", S, null, `left:${540 - LW / 2}px;top:${820 - LH / 2}px;width:${LW}px;height:${LH}px;background:#fff;-webkit-mask:url(${LOGO}) center/contain no-repeat;mask:url(${LOGO}) center/contain no-repeat`);
      anim(lg, [[70.6, { o: 0, s: 1.15, b: 16 }], [71.1, { o: 1, s: 1, b: 0 }, "expo"]]);
      L(S, 1060, TIT(70), [["Siga", 71.3], [MDS.PROJETO.perfil || "@matteu.ia", 71.4, "grad"]]);
      L(S, 1170, TXT(42, G2, 400), [["Parte", 71.7], ["2", 71.78], ["em", 71.86], ["breve", 71.94]]);
      anim(S, [...corte(70.5), [70.5, { s: 1 }], [74, { s: 1.03 }, "lin"]]);
    },
  });

  /* ---------- efeitos sonoros: interface, todos presos a eventos visuais (viram sons reais no sfx_real.py) ---------- */
  const SFX = [
    ["swell", .05, .45], ["blip", 1.36, .35], ["blip", 1.74, .35], ["swoosh", 3.15, .5],
    ["pop", 4.56, .6], ["pop", 5.08, .6], ["pop", 5.90, .6], ["pop", 6.72, .6], ["pop", 7.6, .6],
    ...[0, 1, 2, 3].map(i => ["swoosh", 8.10 + i * .1, .35]), ["chime", 9.42, .5], ["whoosh", 9.8, .7],
    ["whoosh", 10.05, .5], ["send", 11.45, .5], ["blip", 11.6, .4],
    ["pop", 12.5, .5], ["click", 14.0, .4], ["pop", 14.46, .7], ["swoosh", 15.0, .22],
    ["whoosh", 15.1, .5], ...Array.from({ length: 8 }, (_, i) => ["tick", 15.95 + i * .14, .25]), ["chime", 17.22, .45], ["whoosh", 18.48, .6],
    ...PASTAS.map(([, t]) => ["pop", t, .5]), ...PASTAS.map(([, t]) => ["click", t + .3, .4]), ["swoosh", 24.75, .5],
    ["hit", 26.08, .45], ["pop", 27.16, .5], ["boom", 28.22, .7], ["whoosh", 28.75, .5],
    ...PASSOS.map((_, i) => ["tick", 30.72 + i * .5, .5]), ["chime", 33.0, .4], ["swoosh", 34.25, .7],
    ["pop", 34.55, .4], ["pop", 34.7, .4], ["pop", 34.85, .4], ["click", 36.30], ["click", 37.24], ["click", 37.88], ["chime", 38.05, .4],
    ["pop", 39.02, .5], ["swoosh", 39.6, .4], ["ding", 40.92, .5], ["swoosh", 41.42, .4],
    ...COMMITS.map((_, i) => ["blip", 42.28 + i * .25, .4]), ["click", 44.06, .5], ["click", 45.16], ["chime", 46.4, .45],
    ["pop", 46.7, .5], ["click", 48.46, .6], ["click", 48.70, .6], ["click", 48.94, .6], ["chime", 51.46, .5], ["whoosh", 51.72, .6],
    ["hit", 53.0, .5], ["swoosh", 53.66, .4],
    ...[54.32, 54.62, 54.88, 55.24, 55.52].map(t => ["pop", t, .45]), ["swell", 56.42, .4], ...[56.78, 57.22, 57.78, 58.18, 58.92, 59.06].map(t => ["click", t, .4]),
    ["pop", 59.85, .5], ["whoosh", 60.45, .5], ...NOS.map((_, i) => ["pop", 60.75 + i * .12, .45]), ["riser", 61.6, .4], ["chime", 62.30, .45],
    ["boom", 64.52, .7], ["pop", 65.26, .5], ...[0, 1, 2].map(i => ["swoosh", 66.56 + i * .12, .45]), ["whoosh", 70.3, .6],
    ["swell", 70.55, .45], ["chime", 71.1, .5], ["pop", 71.3, .4],
  ];
  SFX.forEach(([k, t, g]) => MDS.sfx(k, t, g ?? 1));
  const teclas = (t0, n, cps, g = .5) => { for (let i = 0; i < n; i++) MDS.sfx("key", t0 + i / cps, g); };
  teclas(10.75, 6, 12, .5); teclas(13.26, 13, 12, .5); teclas(14.1, 10, 12, .45); teclas(49.58, 30, 12, .4);
})();
