/* IA e a segurança dos seus dados · @matteu.ia
 * Storyboard aprovado: projetos/ia-ciberseguranca/storyboard.md · estilo: referencias/estilo-canal.md
 * Narração intacta (43,5 s). Sem música (não foi enviada). Imagens em imagens/ (OpenArt, Nano Banana 2).
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, svg, path, draw, typeText, floaty, at, palco, trans, ui } = MDS;
  const CINZA = "#5E5E66";

  /* ---------- fundos ---------- */
  function cantos(S, cor = "#C4C4C9") {
    const L = h("div", "layer", S);
    [[56, 56, "border-left:2px solid;border-top:2px solid"], [988, 56, "border-right:2px solid;border-top:2px solid"],
     [56, 1828, "border-left:2px solid;border-bottom:2px solid"], [988, 1828, "border-right:2px solid;border-bottom:2px solid"]]
      .forEach(([x, y, b]) => h("div", "abs", L, null, `left:${x}px;top:${y}px;width:36px;height:36px;${b};border-color:${cor}`));
  }
  const claro = S => { h("div", "layer", S, null, "inset:-80px;background:radial-gradient(ellipse 95% 70% at 50% 42%, #F8F8F8, #E3E3E6)"); cantos(S); };
  function escuro(S, o = {}) {
    const { x = 540, y = 920, int = .32, tam = 1150, cor = "255,106,26" } = o;
    h("div", "layer", S, null, "inset:-80px;background:#0B0B0D");
    const g = h("div", "abs", S, null, `left:${x - tam / 2}px;top:${y - tam / 2}px;width:${tam}px;height:${tam}px;border-radius:50%;background:radial-gradient(circle, rgba(${cor},${int}) 0%, rgba(255,61,46,${int * .45}) 32%, transparent 64%)`);
    fx(t => g.style.scale = (1 + Math.sin(t * 1.7) * .05).toFixed(3));
    return g;
  }
  /* imagem do projeto ocupando a tela (com folga para zoom e tremor) + véu para o texto */
  const IMG = (p, nome, css = "") => h("div", "img", p, null, `background-image:url(${MDS.img(nome)});${css}`);
  function tela(S, nome, keys, veu = .75) {
    h("div", "layer", S, null, "inset:-80px;background:#0B0B0D");
    const el = IMG(S, nome, "left:-60px;top:-100px;width:1200px;height:2120px;transform-origin:50% 48%");
    anim(el, keys);
    h("div", "layer", S, null, `background:linear-gradient(rgba(11,11,13,${veu}) 0%, rgba(11,11,13,0) 30%, rgba(11,11,13,0) 62%, rgba(11,11,13,${veu}) 100%)`);
    return el;
  }
  /* ---------- tipografia ---------- */
  const pw = (p, txt, t, cls = "", d = .5) => {
    const s = h("span", cls ? "pw " + cls : "pw", p, txt);
    anim(s, [[t, { o: 0, b: 16, y: 26, s: .96 }], [t + d, { o: 1, b: 0, y: 0, s: 1 }, "expo"]]);
    return s;
  };
  const L = (p, top, css, itens) => {
    const el = h("div", "hl", p, null, `top:${top}px;${css}`);
    itens.forEach(([txt, t, cls, sc], k) => { if (k) el.append(" "); const s = pw(el, txt, t, cls); if (sc) s.style.cssText += sc; });
    return el;
  };
  const LEVE = (px, cor = "#F4F4F5", peso = 300) => `font:${peso} ${px}px/1.05 var(--v-sans);letter-spacing:-.035em;color:${cor}`;
  const IMPACTO = (px, wd = 100, cor = "var(--v-ink)") => `font:900 ${px}px/1 var(--v-display);font-stretch:${wd}%;letter-spacing:-.035em;color:${cor}`;
  // palavra de impacto que bate (escala + desfoque)
  const bate = (p, top, txt, t, css, s0 = 1.4) => { const el = h("div", "hl", p, txt, `top:${top}px;${css}`); anim(el, [[t - .01, { o: 0, s: s0, b: 12 }], [t + .02, { o: 1 }, "lin"], [t + .32, { s: 1, b: 0 }, "expo"]]); return el; };
  const tremor = (t, a = 12) => [[t, { x: 0, y: 0 }], [t + .04, { x: a, y: -a * .7 }, "lin"], [t + .08, { x: -a * .7, y: a * .5 }, "lin"], [t + .13, { x: a * .3, y: -a * .2 }, "lin"], [t + .22, { x: 0, y: 0 }, "out"]];
  // tremido de glitch (usa a propriedade translate, independente de anim)
  const jitter = (el, a, b, amp = 10) => fx(t => { if (t < a || t > b) { el.style.translate = ""; return; } const k = Math.floor(t * 30); el.style.translate = `${((k * 37 % 7) - 3) / 3 * amp}px ${((k * 53 % 5) - 2) / 2 * amp * .4}px`; });
  // cópias coloridas deslocadas de uma imagem (glitch RGB)
  function rgbGlitch(S, nome, janelas) {
    [["sepia(1) saturate(8) hue-rotate(-35deg)", -16], ["sepia(1) saturate(6) hue-rotate(150deg)", 16]].forEach(([f, dx]) => {
      const c = IMG(S, nome, `left:-60px;top:-100px;width:1200px;height:2120px;filter:${f};mix-blend-mode:screen`);
      fx(t => { const on = janelas.some(([a, b]) => t >= a && t <= b) && Math.floor(t * 24) % 3 !== 0; c.style.opacity = on ? .55 : 0; c.style.translate = `${dx}px 0`; });
    });
  }
  const ICON = {
    escudo: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", chip: "M7 7h10v10H7zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4",
    banco: "M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18", msg: "M4 5h16v11H9l-5 4z", compras: "M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0",
    alvo: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", foto: "M3 6h18v13H3zM3 16l5-5 4 4 3-3 6 6", chave: "M14 10a4 4 0 1 0-1 2.6L20 20M17 17l2-2",
  };
  const icone = (k, cor = "var(--v-ac)", px = 48, w = 2.2) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[k]}"/></svg>`;
  /* cadeado cuja alça fecha em t */
  function cadeado(p, t, css, cor = "var(--v-ac)", px = 44) {
    const el = h("div", "abs", p, `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2" fill="${cor}" fill-opacity=".15"/><path class="al" d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>`, css);
    const al = el.querySelector(".al");
    fx(tt => { const p2 = prog(tt, t, t + .18, "back"); al.setAttribute("transform", `translate(${(4 * (1 - p2)).toFixed(2)} ${(-3.5 * (1 - p2)).toFixed(2)})`); });
    return el;
  }
  const CHECK = ui.CHECK;

  /* ================= 1 · E se eu te dissesse ================= */
  cena({
    id: "abertura", nome: "E se eu te dissesse", inicio: 0, fim: 2.12, z: 10,
    descricao: "Preto com brasa laranja; a pergunta entra palavra por palavra e “inteligência artificial” acende em neon. Um cursor de terminal pisca no canto.",
    montar(S) {
      const g = escuro(S, { y: 960, int: .3 });
      anim(g, [[0, { o: 0 }], [.7, { o: 1 }, "out"]]);
      L(S, 640, LEVE(74), [["E", 0], ["se", .26], ["eu", .32], ["te", .42], ["dissesse", .48]]);
      L(S, 750, LEVE(56, "#8E8E96"), [["que", .94], ["uma", 1.04]]);
      L(S, 840, "font:500 116px/1 var(--v-sans);letter-spacing:-.05em", [["inteligência", 1.14, "neon"]]);
      L(S, 970, "font:500 116px/1 var(--v-sans);letter-spacing:-.05em", [["artificial", 1.58, "neon"]]);
      const cur = h("div", "abs", S, "&gt; <i style='display:inline-block;width:16px;height:30px;background:var(--v-ac);vertical-align:-4px'></i>", "left:110px;top:1480px;font:500 30px var(--v-mono);color:#6A6A72");
      fx(t => cur.querySelector("i").style.opacity = Math.floor(t * 2.5) % 2 ? 0 : 1);
      anim(S, [[0, { s: 1, b: 0 }], [1.92, { s: 1.06, b: 0 }, "lin"], [2.12, { s: 1.7, b: 10 }, "in"]]);
    },
  });

  /* ================= 2 · Falhas (imagem: cadeado) ================= */
  cena({
    id: "falhas", nome: "Falhas", inicio: 2.04, fim: 4.02, z: 11,
    descricao: "Imagem do cadeado digital; uma varredura laranja desce sobre ele e em “falhas” ele racha com glitch RGB.",
    margem: .4,
    montar(S) {
      tela(S, "cadeado", [[2.04, { s: 1.12 }], [4.02, { s: 1.0 }, "out"]], .6);
      rgbGlitch(S, "cadeado", [[3.04, 3.34], [3.62, 3.72]]);
      const sc = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:6px;background:linear-gradient(90deg,transparent,#FF8A3D,transparent);box-shadow:0 0 40px 10px rgba(255,106,26,.45)");
      anim(sc, [[2.5, { y: 520, o: 0 }], [2.56, { o: 1 }, "lin"], [3.04, { y: 1450 }, "inOut"], [3.1, { o: 0 }, "lin"]]);
      const rach = svg(S, 1080, 1920, "position:absolute;left:0;top:0;filter:drop-shadow(0 0 8px rgba(255,180,120,.9))");
      ["M540 1010 L505 1080 L548 1130 L500 1215", "M548 1130 L610 1160 L640 1240", "M505 1080 L450 1100", "M500 1215 L470 1290"].forEach((d, i) => {
        const p = path(rach, d, { fill: "none", stroke: "#FFE4D2", "stroke-width": 5, "stroke-linecap": "butt", "stroke-linejoin": "miter" });
        draw(p, 3.04 + i * .04, 3.2 + i * .04, "out");
      });
      L(S, 300, LEVE(60), [["está", 2.14], ["descobrindo", 2.58]]);
      const f = bate(S, 380, "FALHAS", 3.04, IMPACTO(210, 92, "#FF7A2E") + ";text-shadow:0 0 30px rgba(255,106,26,.6)");
      f.classList.add("glitch"); jitter(f, 3.04, 3.36, 12);
      L(S, 610, LEVE(56, "#C9C9CE"), [["em", 3.42], ["sistemas", 3.56]]);
      anim(S, [[2.04, { o: 0 }], [2.1, { o: 1 }, "lin"], ...tremor(3.04, 14)]);
    },
  });

  /* ================= 3 · Seus dados (claro, cards 3D com cadeado) ================= */
  cena({
    id: "dados", nome: "Seus dados", inicio: 4.02, fim: 5.58, z: 12,
    descricao: "Corte para o claro: cards de dados pessoais genéricos (senha, cartão, mensagens, fotos) inclinados em 3D; os cadeados fecham em “protegem”; “dados?” em itálico laranja.",
    margem: .3,
    montar(S) {
      claro(S);
      L(S, 300, LEVE(60, CINZA), [["que", 4.02], ["protegem", 4.04]]);
      L(S, 380, LEVE(80, "var(--v-ink)", 400), [["seus", 4.52], ["dados?", 4.70, "ser", "font-size:150px;color:var(--v-ac)"]]);
      const DS = [["Senha", "••••••••", "chave"], ["Cartão", "•••• 4821", "banco"], ["Mensagens", "conversas privadas", "msg"], ["Fotos", "galeria pessoal", "foto"]];
      DS.forEach(([n, v, ic], i) => {
        const c = h("div", "abs", S, `<span style="width:78px;height:78px;border-radius:22px;background:#FFF0E6;display:grid;place-items:center;flex:none">${icone(ic, "var(--v-ac)", 40, 2.4)}</span>
          <div style="min-width:0"><div style="font:600 34px var(--v-sans);letter-spacing:-.02em">${n}</div><div style="font:500 26px var(--v-mono);color:var(--v-mute);margin-top:4px">${v}</div></div>`,
          `left:150px;top:${640 + i * 168}px;width:780px;height:140px;border-radius:30px;background:#FBFBFB;box-shadow:var(--v-shadow);display:flex;align-items:center;gap:26px;padding:0 120px 0 28px;color:var(--v-ink)`);
        cadeado(c, 4.10 + i * .12, "right:36px;top:46px", "var(--v-ac)", 48);
        const t0 = 4.02 + i * .07;
        anim(c, [[t0, { o: 0, y: 120, rx: 30, b: 10 }], [t0 + .45, { o: 1, y: 0, rx: 12, b: 0 }, "expo"], [5.4, { rx: 6 }, "sine"]]);
      });
      anim(S, [[4.015, { o: 0 }], [4.02, { o: 1 }, "lin"], [4.02, { s: 1.04 }], [5.58, { s: 1 }, "out"]]);
    },
  });

  /* ================= 4 · Não é ficção (claro, palavra riscada) ================= */
  cena({
    id: "ficcao", nome: "Não é ficção", inicio: 5.56, fim: 7.14, z: 13,
    descricao: "“FICÇÃO CIENTÍFICA” gigante em preto; um risco laranja atravessa as duas palavras com impacto. Sai em chicote.",
    margem: .3,
    montar(S) {
      claro(S);
      L(S, 520, LEVE(64, CINZA), [["Isso", 5.56], ["não", 5.74, "", "color:var(--v-ac);font-weight:500"], ["é", 5.86]]);
      bate(S, 640, "FICÇÃO", 6.00, IMPACTO(240, 100));
      bate(S, 890, "CIENTÍFICA", 6.32, IMPACTO(158, 84));
      const r = h("div", "abs", S, null, "left:90px;top:900px;width:900px;height:22px;border-radius:11px;background:var(--v-ac);transform-origin:0 50%;rotate:-9deg;box-shadow:0 10px 30px -8px rgba(255,106,26,.6)");
      anim(r, [[6.55, { sx: 0 }], [6.75, { sx: 1 }, "out5"]]);
      anim(S, [[5.555, { o: 0 }], [5.56, { o: 1 }, "lin"], ...tremor(6.62, 12), ...trans.chicoteSai(6.82, { d: .32 }).map(([t, v, e]) => [t, { ...v, y: 0 }, e])]);
    },
  });

  /* ================= 5 · Pesquisadores (imagem em janela 3D) ================= */
  cena({
    id: "pesquisadores", nome: "Pesquisadores", inicio: 7.05, fim: 9.1, z: 14,
    descricao: "A imagem do laboratório entra numa janela inclinada em 3D; “Google DeepMind” aparece só como rótulo de texto. A câmera entra numa das telas.",
    margem: .4,
    montar(S) {
      escuro(S, { y: 1000, int: .28 });
      const W = h("div", "abs", S, null, "left:110px;top:540px;width:860px;height:1000px;border-radius:30px;overflow:hidden;box-shadow:0 0 0 2px #2A2A30, 0 60px 120px -40px rgba(0,0,0,.9), 0 0 80px -30px rgba(255,106,26,.5)");
      const im = IMG(W, "laboratorio", "left:-20px;top:-30px;width:900px;height:1110px");
      anim(im, [[7.1, { s: 1.08 }], [9.0, { s: 1 }, "out"]]);
      anim(W, [[7.05, { o: 0, y: 260, ry: 28, rx: 8, s: .9 }], [7.1, { o: 1 }, "lin"], [7.55, { y: 0, ry: -8, rx: 4, s: 1 }, "expo"], [8.85, { ry: -3, rx: 2 }, "sine"]]);
      L(S, 290, "font:500 92px/1 var(--v-sans);letter-spacing:-.05em;color:#F4F4F5", [["Pesquisadores", 7.16]]);
      const ch = h("div", "abs", S, `<i style="width:14px;height:14px;border-radius:50%;background:var(--v-ac)"></i>Google DeepMind`, "left:540px;top:410px;translate:-50% 0;height:70px;padding:0 30px;border-radius:35px;background:#16161A;box-shadow:0 0 0 2px #2E2E34;display:flex;align-items:center;gap:14px;font:500 32px var(--v-mono);color:#F4F4F5;white-space:nowrap");
      anim(ch, [[7.84, { o: 0, s: .6, b: 8 }], [8.2, { o: 1, s: 1, b: 0 }, "back"]]);
      anim(S, [[7.05, { o: 0 }], [7.12, { o: 1 }, "lin"], ...trans.chicoteEntra(7.05, { d: .38, dist: 900, dir: -1 }).map(([t, v, e]) => [t, { ...v, o: v.o ?? 1 }, e]),
        [8.86, { s: 1, y: 0 }], [9.1, { s: 2.8, y: 240 }, "in"]]);
    },
  });

  /* ================= 6 · Terminal (escuro) ================= */
  const CODE = ["import scanner", "", "for modulo in sistemas:", "    chave = ler(modulo)", "    teste = analisar(chave)", "    if teste.fraco:", "        alerta(modulo)", "", "def analisar(chave):", "    padroes = ia.buscar(chave)", "    return avaliar(padroes)", "", "verificar(rsa, bits=1024)", "comparar(fatores)", "registrar(resultado)", "", "for agente in agentes:", "    agente.executar()", "    agente.reportar()", "", "status: varrendo...", "status: 42% concluído", "status: anomalia detectada", ""];
  cena({
    id: "terminal", nome: "Terminal", inicio: 9.0, fim: 11.14, z: 15,
    descricao: "Terminal genérico com código rolando; um destaque laranja salta entre as linhas a cada palavra e trava em “encontrar” com o selo “falha encontrada”.",
    margem: .4,
    montar(S) {
      escuro(S, { y: 1000, int: .22 });
      L(S, 270, LEVE(58), [["utilizando", 9.08], ["inteligência", 9.52], ["artificial", 10.08]]);
      L(S, 350, LEVE(58, "#8E8E96"), [["para", 10.64], ["encontrar", 10.86, "", "color:#FF7A2E;font-weight:500"]]);
      const T = h("div", "abs", S, null, "left:80px;top:470px;width:920px;height:960px;border-radius:30px;background:#0F0F12;box-shadow:0 0 0 2px #26262C, 0 60px 120px -40px rgba(0,0,0,.9);overflow:hidden");
      h("div", "", T, `<span style="display:flex;gap:10px"><i style="width:16px;height:16px;border-radius:50%;background:#2E2E34"></i><i style="width:16px;height:16px;border-radius:50%;background:#2E2E34"></i><i style="width:16px;height:16px;border-radius:50%;background:#2E2E34"></i></span><span>agente-ia · terminal</span>`,
        "height:76px;display:flex;align-items:center;gap:22px;padding:0 30px;border-bottom:2px solid #1E1E23;font:500 24px var(--v-mono);color:#6A6A72");
      const vp = h("div", "abs", T, null, "left:0;right:0;top:78px;bottom:0;overflow:hidden");
      const col = h("div", "abs", vp, null, "left:0;top:0;right:0");
      const LH = 46;
      [...CODE, ...CODE].forEach((l, i) => h("div", "term", col, `<span style="color:#3E3E46;display:inline-block;width:64px;text-align:right;margin-right:26px">${i + 1}</span>${l.replace(/(ia|agente|rsa|alerta|anomalia)/g, '<b style="color:#C9C9CE;font-weight:500">$1</b>')}`, `height:${LH}px`));
      fx(t => col.style.translate = `0 ${(-Math.max(0, t - 9.0) * 120).toFixed(1)}px`);
      const hl = h("div", "abs", vp, null, `left:0;right:0;height:${LH}px;background:rgba(255,106,26,.16);box-shadow:inset 4px 0 0 #FF6A1A`);
      const ALVOS = [[9.08, 300], [9.52, 480], [10.08, 210], [10.64, 620], [10.86, 420]];
      fx(t => { let y = 300; for (const [a, yy] of ALVOS) if (t >= a) y = yy; const k = ALVOS.findIndex(([a]) => a > t); const prev = k > 0 ? ALVOS[k - 1] : ALVOS[ALVOS.length - 1]; hl.style.top = y + "px"; hl.style.background = t >= 10.86 ? "rgba(255,106,26,.32)" : "rgba(255,106,26,.16)"; hl.style.opacity = t >= 9.08 ? 1 : 0; void prev; });
      const tag = h("div", "abs", vp, `<i style="width:12px;height:12px;border-radius:50%;background:#0B0B0D"></i>falha encontrada`, "right:30px;top:420px;height:46px;padding:0 20px;border-radius:23px;background:var(--v-ac);color:#0B0B0D;display:flex;align-items:center;gap:10px;font:600 24px var(--v-mono);transform-origin:right center");
      anim(tag, [[10.86, { s: 0, o: 0 }], [10.9, { o: 1 }, "lin"], [11.1, { s: 1 }, "back"]]);
      anim(T, [[9.0, { o: 0, s: .92, b: 10 }], [9.3, { o: 1, s: 1, b: 0 }, "expo"]]);
      anim(S, [[9.0, { o: 0, s: 1, b: 0 }], [9.06, { o: 1 }, "lin"], [10.96, { s: 1, b: 0 }], [11.14, { s: 1.5, b: 6 }, "in"]]);
    },
  });

  /* ================= 7 · Vulnerabilidades (escuro, texto cifrado) ================= */
  const CHARS = "ABCDEF0123456789#$%&@*+=<>/\\";
  cena({
    id: "vulnerabilidades", nome: "Vulnerabilidades", inicio: 11.12, fim: 13.64, z: 16,
    descricao: "VULNERABILIDADES bate gigante; uma faixa de caracteres cifrados embaralha e se resolve em “criptografia”, em laranja.",
    margem: .3,
    montar(S) {
      escuro(S, { y: 900, int: .3 });
      const bg = h("div", "abs", S, null, "left:-40px;top:0;width:1160px;height:1920px;font:500 30px/1.6 var(--v-mono);color:#FFFFFF;opacity:.05;word-break:break-all;overflow:hidden");
      fx(t => { const k = Math.floor(t * 8); let s = ""; for (let i = 0; i < 1500; i++) s += CHARS[(i * 31 + k * 7 + (i * i) % 13) % CHARS.length]; bg.textContent = s; });
      const v = bate(S, 760, "VULNERABILIDADES", 11.14, IMPACTO(138, 64, "#F4F4F5"), 1.5);
      jitter(v, 11.14, 11.3, 8);
      L(S, 940, LEVE(56, "#8E8E96"), [["em", 11.94], ["sistemas", 12.14], ["de", 12.44]]);
      const cf = h("div", "hl", S, null, "top:1040px;font:500 92px/1 var(--v-mono);letter-spacing:.02em;color:#6A6A72");
      const W = "criptografia";
      fx(t => { if (t < 12.3) { cf.textContent = ""; return; } const k = Math.floor(t * 22); let s = "";
        for (let i = 0; i < W.length; i++) { const ok = t >= 12.6 + i * .04; s += ok ? W[i] : CHARS[(i * 13 + k * 5) % CHARS.length]; }
        cf.textContent = s; cf.style.color = t >= 12.6 + W.length * .04 ? "#FF7A2E" : "#6A6A72"; cf.style.textShadow = t >= 13.08 ? "0 0 26px rgba(255,106,26,.6)" : "none"; });
      anim(S, [[11.115, { o: 0 }], [11.12, { o: 1 }, "lin"], ...tremor(11.14, 12)]);
      trans.flash(13.62, { cor: "#FFFFFF", pico: .8, d: .2 });
    },
  });

  /* ================= 8 · Chama atenção (claro, notificações) ================= */
  cena({
    id: "atencao", nome: "Chama atenção", inicio: 13.6, fim: 15.18, z: 17,
    descricao: "Claro: alertas genéricos chegam do topo, um por palavra; “atenção.” em itálico laranja.",
    margem: .3,
    montar(S) {
      claro(S);
      L(S, 290, LEVE(60, CINZA), [["E", 13.64], ["a", 13.72], ["descoberta", 13.78]]);
      L(S, 370, LEVE(80, "var(--v-ink)", 400), [["chama", 14.24], ["atenção.", 14.42, "ser", "font-size:130px;color:var(--v-ac)"]]);
      [["Segurança", "Nova descoberta em criptografia", 13.78], ["Tecnologia", "Agentes de IA encontram falhas", 14.24], ["Alerta", "Especialistas acompanham o caso", 14.42]].forEach(([app, txt, t], i) => {
        const n = ui.notificacao(S, { x: 110, y: 640 + i * 200, w: 860, app, letra: "", cor: "var(--v-ac)", texto: txt, hora: "agora" });
        n.querySelector(".ico").innerHTML = icone(i === 2 ? "alvo" : "escudo", "#fff", 40, 2.4);
        anim(n, [[t, { o: 0, y: -160, s: .92, b: 10 }], [t + .45, { o: 1, y: 0, s: 1, b: 0 }, "back"]]);
      });
      anim(S, [[13.6, { o: 0, y: 0 }], [13.62, { o: 1 }, "lin"], [14.98, { y: 0 }], [15.18, { y: -700 }, "inExpo"]]);
    },
  });

  /* ================= 9 · Agentes de IA (imagem: olho da IA) ================= */
  cena({
    id: "agentes", nome: "Agentes de IA", inicio: 15.12, fim: 17.12, z: 18,
    descricao: "Imagem do núcleo de IA em forma de olho com zoom; uma mira de varredura gira e trava em dois pontos em “identificar”.",
    margem: .3,
    montar(S) {
      tela(S, "agente", [[15.12, { s: 1.3 }], [15.8, { s: 1.08 }, "expo"], [17.12, { s: 1.0 }, "lin"]], .7);
      const CX = 540, CY = 900;
      const mira = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      const g = MDS.sel(mira, "g", {});
      MDS.sel(g, "circle", { cx: CX, cy: CY, r: 300, fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 3, "stroke-dasharray": "30 22" });
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => MDS.sel(g, "line", { x1: CX + dx * 270, y1: CY + dy * 270, x2: CX + dx * 340, y2: CY + dy * 340, stroke: "#FF7A2E", "stroke-width": 5, "stroke-linecap": "round" }));
      fx(t => { const r = (t - 15.1) * 40 + (t > 16.64 ? 0 : 0); const sc = 1 - .45 * prog(t, 16.64, 16.9, "expo"); g.setAttribute("transform", `translate(${CX} ${CY}) rotate(${r.toFixed(1)}) scale(${sc.toFixed(3)}) translate(${-CX} ${-CY})`); g.style.opacity = t > 15.3 ? 1 : 0; });
      [[-210, -40], [190, 60]].forEach(([dx, dy], i) => {
        const b = h("div", "abs", S, null, `left:${CX + dx - 50}px;top:${CY + dy - 50}px;width:100px;height:100px;border:4px solid #FF7A2E;border-radius:10px;box-shadow:0 0 24px rgba(255,106,26,.7)`);
        anim(b, [[16.7 + i * .12, { o: 0, s: 2 }], [16.95 + i * .12, { o: 1, s: 1 }, "expo"]]);
        fx(t => b.style.borderColor = t > 16.7 + i * .12 && Math.floor(t * 6) % 2 ? "#FFFFFF" : "#FF7A2E");
      });
      L(S, 290, "font:500 96px/1 var(--v-sans);letter-spacing:-.05em;color:#F4F4F5", [["Agentes", 15.18], ["de", 15.48], ["IA", 15.72, "neon"]]);
      L(S, 410, LEVE(58, "#C9C9CE"), [["ajudaram", 16.0], ["a", 16.52], ["identificar", 16.64]]);
      anim(S, [[15.12, { o: 0 }], [15.16, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 10 · Duas falhas (claro, número gigante) ================= */
  cena({
    id: "duas", nome: "Duas falhas", inicio: 17.08, fim: 19.44, z: 19,
    descricao: "Claro: “2” gigante em laranja ao lado de um cadeado desenhado com dois pontos de falha piscando.",
    margem: .3,
    montar(S) {
      claro(S);
      const n = h("div", "abs", S, "2", "left:110px;top:430px;width:420px;text-align:center;font:900 640px/1 var(--v-display);letter-spacing:-.06em;color:var(--v-ac)");
      anim(n, [[17.09, { o: 0, s: 1.6, b: 14 }], [17.12, { o: 1 }, "lin"], [17.45, { s: 1, b: 0 }, "expo"]]);
      const cd = svg(S, 380, 460, "position:absolute;left:600px;top:560px;overflow:visible");
      const al = path(cd, "M90 200 V130 a100 100 0 0 1 200 0 V200", { fill: "none", stroke: "var(--v-ink)", "stroke-width": 16, "stroke-linecap": "round" });
      const corpo = path(cd, "M40 200 H340 V440 H40 Z", { fill: "none", stroke: "var(--v-ink)", "stroke-width": 16, "stroke-linejoin": "round" });
      draw(al, 17.1, 17.5, "out"); draw(corpo, 17.1, 17.6, "out");
      [[110, 260], [260, 380]].forEach(([x, y], i) => {
        const d = h("div", "abs", S, null, `left:${600 + x - 26}px;top:${560 + y - 26}px;width:52px;height:52px;border-radius:50%;background:var(--v-ac);box-shadow:0 0 0 0 rgba(255,106,26,.5)`);
        const t0 = 17.38 + i * .22;
        anim(d, [[t0, { s: 0 }], [t0 + .3, { s: 1 }, "back"]]);
        fx(t => { const p = ((t - t0) * 1.6) % 1; d.style.boxShadow = t > t0 ? `0 0 0 ${(p * 40).toFixed(1)}px rgba(255,106,26,${(.5 * (1 - p)).toFixed(2)})` : "none"; });
      });
      L(S, 1150, LEVE(72, "var(--v-ink)", 400), [["vulnerabilidades", 17.38]]);
      L(S, 1250, LEVE(50, CINZA), [["relacionadas", 18.12], ["à", 18.68], ["criptografia", 18.80]]);
      anim(S, [[17.08, { o: 0 }], [17.09, { o: 1 }, "lin"], ...tremor(17.1, 10), [19.2, { s: 1, rx: 0 }], [19.44, { s: 1.4, o: .2 }, "in"]]);
    },
  });

  /* ================= 11 · RSA 1024 (escuro, contador) ================= */
  cena({
    id: "rsa", nome: "RSA 1024", inicio: 19.4, fim: 21.86, z: 20,
    descricao: "“RSA” grande; um contador corre até 1024 em laranja e trava em “bits”; faixas de bits passam atrás.",
    margem: .3,
    montar(S) {
      escuro(S, { y: 960, int: .3 });
      for (let r = 0; r < 9; r++) {
        const row = h("div", "abs", S, null, `left:0;top:${260 + r * 150}px;width:3000px;font:500 34px var(--v-mono);letter-spacing:.3em;color:#FFFFFF;opacity:${r % 2 ? .05 : .08};white-space:nowrap`);
        let s = ""; for (let i = 0; i < 160; i++) s += ((i * 7 + r * 3) % 5 > 1) ? "1" : "0"; row.textContent = s;
        fx(t => row.style.translate = `${(-((t * (60 + r * 12)) % 600)).toFixed(1)}px 0`);
      }
      bate(S, 520, "RSA", 19.44, IMPACTO(320, 100, "#F4F4F5"));
      const c = h("div", "hl", S, "0", "top:880px;font:900 260px/1 var(--v-display);letter-spacing:-.04em;color:#FF7A2E;text-shadow:0 0 40px rgba(255,106,26,.55);font-variant-numeric:tabular-nums");
      MDS.counter(c, 0, 1024, 20.40, 20.96, v => String(Math.round(v)), "out");
      anim(c, [[20.3, { o: 0, y: 40 }], [20.45, { o: 1, y: 0 }, "expo"], [20.96, { s: 1.12 }], [21.2, { s: 1 }, "expo"]]);
      L(S, 1160, LEVE(84), [["de", 20.04], ["bits.", 20.96, "", "font-weight:500"]]);
      anim(S, [[19.4, { o: 0, ry: -60 }], [19.42, { o: 1 }, "lin"], [19.7, { ry: 0 }, "expo"], ...tremor(20.96, 10)]);
    },
  });

  /* ================= 12 · Por quê? (laranja tela cheia) ================= */
  cena({
    id: "porque", nome: "Por quê?", inicio: 21.82, fim: 23.64, z: 22,
    descricao: "Íris laranja abre a tela cheia; “importante?” bate em branco. O laranja fecha de volta revelando o data center.",
    margem: .3,
    montar(S) {
      h("div", "layer", S, null, "background:linear-gradient(160deg,#FFA25A 0%,#FF6A1A 45%,#FF3D2E 100%)");
      for (let k = 0; k < 3; k++) {
        const rg = h("div", "abs", S, null, "left:340px;top:700px;width:400px;height:400px;border-radius:50%;border:3px solid rgba(255,255,255,.35)");
        fx(t => { const p = ((t - 21.86) * .9 + k / 3) % 1; rg.style.scale = (1 + p * 2.6).toFixed(3); rg.style.opacity = (t > 21.86 ? (1 - p) * .7 : 0).toFixed(2); });
      }
      L(S, 690, "font:400 70px/1 var(--v-sans);letter-spacing:-.035em;color:#FFFFFF", [["Mas", 21.86], ["por", 22.02], ["que", 22.16], ["isso", 22.30], ["é", 22.50], ["tão", 22.60]]);
      bate(S, 800, "importante?", 22.66, "font:600 170px/1 var(--v-sans);letter-spacing:-.06em;color:#FFFFFF");
      fx(t => { const r = t < 23.3 ? prog(t, 21.86, 22.2, "inOutExpo") * 2300 : (1 - prog(t, 23.38, 23.62, "inExpo")) * 2300;
        S.style.clipPath = r >= 2299 ? "none" : `circle(${r.toFixed(1)}px at 540px 920px)`; });
    },
  });

  /* ================= 13 · Proteger informações (imagem: data center) ================= */
  cena({
    id: "protecao", nome: "Proteger informações", inicio: 23.4, fim: 26.96, z: 21,
    descricao: "Imagem do corredor de servidores com zoom lento; cards de apps genéricos (banco, mensagens, compras) entram em vidro escuro e os cadeados fecham em “proteger”.",
    margem: .3,
    montar(S) {
      tela(S, "datacenter", [[23.4, { s: 1.0 }], [26.96, { s: 1.18 }, "lin"]], .8);
      L(S, 280, LEVE(58), [["Porque", 23.60], ["essa", 23.76], ["tecnologia", 23.92]]);
      L(S, 360, LEVE(46, "#A0A0A8"), [["é", 24.42], ["utilizada", 24.66], ["para", 25.12]]);
      bate(S, 440, "proteger", 25.30, "font:600 150px/1 var(--v-sans);letter-spacing:-.06em;color:#FF7A2E;text-shadow:0 0 34px rgba(255,106,26,.6)");
      [["Banco", "banco"], ["Mensagens", "msg"], ["Compras", "compras"]].forEach(([n, ic], i) => {
        const c = h("div", "abs", S, `<span style="width:72px;height:72px;border-radius:20px;background:rgba(255,106,26,.16);display:grid;place-items:center;flex:none">${icone(ic, "#FF8A3D", 38, 2.4)}</span><span>${n}</span>`,
          `left:150px;top:${1000 + i * 150}px;width:780px;height:124px;border-radius:30px;background:rgba(20,20,24,.72);backdrop-filter:blur(14px);box-shadow:0 0 0 2px rgba(255,255,255,.08);display:flex;align-items:center;gap:24px;padding:0 120px 0 26px;font:500 38px var(--v-sans);letter-spacing:-.02em;color:#F4F4F5`);
        cadeado(c, 25.30 + i * .14, "right:36px;top:38px", "#FF8A3D", 48);
        const t0 = 24.4 + i * .12;
        anim(c, [[t0, { o: 0, x: 140, b: 10 }], [t0 + .5, { o: 1, x: 0, b: 0 }, "expo"], [26.72, { o: 1, x: 0 }], [26.96, { o: 0, x: -200 }, "in"]]);
      });
      L(S, 1470, LEVE(54), [["informações", 25.84], ["digitais.", 26.22, "ser", "font-size:84px;color:#FF8A3D"]]);
    },
  });

  /* ================= 14 · Encontrar falhas (claro, radar) ================= */
  cena({
    id: "radar", nome: "Encontrar falhas", inicio: 26.94, fim: 30.48, z: 23,
    descricao: "Claro: um radar varre um bloco de código; em “falhas” três marcadores laranja aparecem.",
    margem: .3,
    montar(S) {
      claro(S);
      L(S, 280, LEVE(56, CINZA), [["E", 26.94], ["a", 27.44], ["capacidade", 27.50], ["da", 28.06]]);
      L(S, 360, "font:500 86px/1 var(--v-sans);letter-spacing:-.05em;color:var(--v-ink)", [["inteligência", 28.22], ["artificial", 28.64]]);
      const C = h("div", "abs", S, null, "left:140px;top:560px;width:800px;height:780px;border-radius:30px;background:#FBFBFB;box-shadow:var(--v-shadow);overflow:hidden");
      for (let i = 0; i < 14; i++) h("i", "", C, null, `display:block;margin:${i ? 22 : 50}px 0 0 ${50 + (i % 3) * 40}px;height:20px;width:${180 + (i * 97) % 420}px;border-radius:10px;background:${i % 4 === 1 ? "#E9E3DE" : "#ECECEF"}`);
      const rad = h("div", "abs", C, null, "left:50px;top:40px;width:700px;height:700px;border-radius:50%;background:conic-gradient(from 0deg, rgba(255,106,26,0) 0deg, rgba(255,106,26,0) 290deg, rgba(255,106,26,.32) 360deg);box-shadow:0 0 0 2px rgba(255,106,26,.25)");
      fx(t => { rad.style.rotate = ((t - 27.5) * 300).toFixed(1) + "deg"; rad.style.opacity = t >= 27.5 ? 1 : 0; });
      [[260, 250], [520, 470], [330, 610]].forEach(([x, y], i) => {
        const m = h("div", "abs", C, "!", `left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;background:var(--v-ac);color:#fff;display:grid;place-items:center;font:800 34px var(--v-sans)`);
        const t0 = 29.58 + i * .12;
        anim(m, [[t0, { s: 0 }], [t0 + .3, { s: 1 }, "back"], [30.25, { x: 0, y: 0, s: 1, o: 1 }], [30.48, { x: 400 - x, y: 390 - y, s: .3, o: 0 }, "in"]]);
      });
      anim(C, [[26.94, { o: 0, y: 100, rx: 14 }], [27.4, { o: 1, y: 0, rx: 6 }, "expo"], [30.2, { rx: 3 }, "sine"]]);
      L(S, 1400, LEVE(64, "var(--v-ink)", 400), [["de", 29.14], ["encontrar", 29.30], ["falhas", 29.58, "ser", "font-size:110px;color:var(--v-ac)"]]);
      anim(S, [[26.935, { o: 0 }], [26.94, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 15 · Futuro da segurança (imagem: escudo) ================= */
  cena({
    id: "escudo", nome: "Futuro da segurança", inicio: 30.44, fim: 33.7, z: 24,
    descricao: "Imagem do escudo digital com recuo de câmera; “segurança cibernética” com “cibernética” em itálico neon. Gira como moeda na virada.",
    margem: .3,
    montar(S) {
      tela(S, "escudo", [[30.44, { s: 1.35 }], [31.3, { s: 1.08 }, "expo"], [33.7, { s: 1.0 }, "lin"]], .7);
      L(S, 270, LEVE(58), [["pode", 30.44], ["transformar", 30.48]]);
      L(S, 350, "font:500 76px/1 var(--v-sans);letter-spacing:-.05em;color:#F4F4F5", [["completamente", 31.70]]);
      L(S, 1250, LEVE(50, "#C9C9CE"), [["o", 31.70], ["futuro", 31.86], ["da", 32.16]]);
      L(S, 1320, "font:500 112px/1 var(--v-sans);letter-spacing:-.055em;color:#F4F4F5", [["segurança", 32.32]]);
      L(S, 1440, "font-size:120px;line-height:1", [["cibernética.", 32.66, "ser neon"]]);
      anim(S, [[30.44, { o: 0 }], [30.5, { o: 1 }, "lin"], [33.5, { ry: 0 }], [33.68, { ry: 90 }, "in"]]);
      trans.flash(30.46, { cor: "#FF6A1A", pico: .5, d: .25 });
    },
  });

  /* ================= 16 · O outro lado (virada) ================= */
  cena({
    id: "outro-lado", nome: "O outro lado", inicio: 33.66, fim: 35.8, z: 25,
    descricao: "A tela termina de girar e o verso é escuro avermelhado; “OUTRO LADO.” gigante com glitch RGB.",
    margem: .3,
    montar(S) {
      h("div", "layer", S, null, "inset:-80px;background:radial-gradient(circle at 50% 50%, #3A0E06 0%, #170806 45%, #0B0B0D 80%)");
      const lin = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:1920px;background:repeating-linear-gradient(0deg, rgba(255,255,255,.03) 0 2px, transparent 2px 6px)");
      fx(t => lin.style.translate = `0 ${((t * 60) % 6).toFixed(1)}px`);
      L(S, 620, LEVE(70), [["Mas", 33.68]]);
      L(S, 720, LEVE(60, "#C9C9CE"), [["existe", 33.88], ["um", 34.52]]);
      const o = h("div", "hl", S, "OUTRO<br>LADO.", `top:820px;${IMPACTO(230, 86, "#FF5A2A")};line-height:.95`);
      o.classList.add("glitch");
      anim(o, [[34.75, { o: 0, s: 1.4, b: 12 }], [34.78, { o: 1 }, "lin"], [35.05, { s: 1, b: 0 }, "expo"]]);
      jitter(o, 34.76, 35.1, 14); jitter(lin, 35.0, 35.25, 20);
      anim(S, [[33.66, { o: 0, ry: -90 }], [33.68, { o: 1 }, "lin"], [33.95, { ry: 0 }, "out"], ...tremor(33.7, 10)]);
    },
  });

  /* ================= 17 · A mesma tecnologia (tela dividida) ================= */
  cena({
    id: "mesma", nome: "A mesma tecnologia", inicio: 35.76, fim: 38.18, z: 26,
    descricao: "Tela dividida: o mesmo chip de IA dos dois lados; à esquerda, no claro, dentro de um escudo (“proteger”); à direita, no escuro, com uma mira e um “?”. A metade escura empurra a clara.",
    margem: .3,
    montar(S) {
      h("div", "layer", S, null, "inset:-80px;background:#0B0B0D");
      const E = h("div", "abs", S, null, "left:0;top:0;width:540px;height:1920px;overflow:hidden;background:radial-gradient(ellipse at 50% 45%, #F8F8F8, #E3E3E6)");
      anim(E, [[38.0, { sx: 1 }], [38.18, { sx: 0 }, "inExpo"]]); E.style.transformOrigin = "0 50%";
      const div = h("div", "abs", S, null, "left:537px;top:0;width:6px;height:1920px;background:#FF6A1A;box-shadow:0 0 30px rgba(255,106,26,.8);transform-origin:50% 0");
      anim(div, [[35.78, { sy: 0 }], [36.1, { sy: 1 }, "expo"], [38.0, { x: 0, o: 1 }], [38.18, { x: -540, o: 0 }, "inExpo"]]);
      const pill = h("div", "abs", S, null, "left:540px;top:280px;translate:-50% 0;height:92px;padding:0 40px;border-radius:46px;background:#16161A;box-shadow:0 0 0 2px #FF6A1A;display:flex;align-items:center;gap:16px;font:400 48px var(--v-sans);letter-spacing:-.03em;color:#F4F4F5;white-space:nowrap");
      [["A", 35.78], ["mesma", 35.88], ["tecnologia", 36.14]].forEach(([w, t]) => pw(pill, w, t));
      // esquerda: escudo + chip
      const sl = svg(E, 540, 600, "position:absolute;left:0;top:640px");
      const esc = path(sl, "M270 60 L460 130 V290 C460 420 380 500 270 540 C160 500 80 420 80 290 V130 Z", { fill: "none", stroke: "#0B0B0D", "stroke-width": 12, "stroke-linejoin": "round" });
      draw(esc, 36.1, 36.6, "out");
      const chipL = h("div", "abs", E, icone("chip", "#0B0B0D", 150, 1.8), "left:195px;top:850px");
      anim(chipL, [[36.14, { o: 0, s: .5 }], [36.5, { o: 1, s: 1 }, "back"]]);
      fx(t => esc.style.fill = t >= 37.1 ? `rgba(255,106,26,${(.18 * prog(t, 37.1, 37.4)).toFixed(3)})` : "none");
      L(E, 1250, IMPACTO(96, 86), [["PROTEGER", 37.10]]);
      L(E, 1370, LEVE(46, CINZA), [["nossos", 37.60], ["dados", 37.78]]);
      // direita: mira + chip
      const R = h("div", "abs", S, null, "left:540px;top:0;width:540px;height:1920px");
      const mira = h("div", "abs", R, icone("alvo", "#FF6A1A", 360, 1.2), "left:90px;top:760px");
      fx(t => mira.style.rotate = ((t - 36) * 30).toFixed(1) + "deg");
      anim(mira, [[36.14, { o: 0, s: 1.5 }], [36.6, { o: .9, s: 1 }, "expo"]]);
      const chipR = h("div", "abs", R, icone("chip", "#F4F4F5", 150, 1.8), "left:195px;top:865px");
      anim(chipR, [[36.14, { o: 0, s: .5 }], [36.5, { o: 1, s: 1 }, "back"]]);
      const q = h("div", "abs", R, "?", "left:0;top:1230px;width:540px;text-align:center;font:400 170px/1 'Instrument Serif',serif;font-style:italic;color:#FF6A1A;text-shadow:0 0 30px rgba(255,106,26,.6)");
      anim(q, [[37.78, { o: 0, s: .5 }], [38.0, { o: 1, s: 1 }, "back"]]);
      anim(S, [[35.755, { o: 0 }], [35.76, { o: 1 }, "lin"]]);
    },
  });

  /* ================= 18 · Atacar sistemas (imagem: invasor) ================= */
  cena({
    id: "atacar", nome: "Atacar sistemas", inicio: 38.12, fim: 40.94, z: 27,
    descricao: "Imagem do invasor encapuzado; alertas de “acesso negado” piscam e “ATACAR” bate com glitch; a tela treme em “sistemas”.",
    margem: .3,
    montar(S) {
      const im = tela(S, "invasor", [[38.12, { s: 1.04 }], [40.94, { s: 1.16 }, "lin"]], .78);
      rgbGlitch(S, "invasor", [[39.78, 40.0], [40.12, 40.3]]);
      const red = h("div", "layer", S, null, "background:rgba(255,40,20,.18);mix-blend-mode:overlay");
      fx(t => red.style.opacity = t > 39.8 ? (.6 + .4 * Math.sin(t * 18)).toFixed(2) : 0);
      L(S, 270, LEVE(56), [["também", 38.18], ["pode", 38.74], ["ser", 38.98]]);
      L(S, 350, LEVE(56, "#C9C9CE"), [["utilizada", 39.16], ["para", 39.64]]);
      [[150, 620, 39.85], [560, 760, 40.0], [230, 940, 40.15]].forEach(([x, y, t]) => {
        const a = h("div", "abs", S, `<i style="width:14px;height:14px;border-radius:2px;background:#0B0B0D"></i>ACESSO NEGADO`, `left:${x}px;top:${y}px;height:62px;padding:0 24px;border-radius:8px;background:#FF4A26;color:#0B0B0D;display:flex;align-items:center;gap:12px;font:700 28px var(--v-mono);letter-spacing:.06em;box-shadow:0 0 30px rgba(255,60,30,.6)`);
        anim(a, [[t, { o: 0, s: 1.4 }], [t + .1, { o: 1, s: 1 }, "out"]]);
        fx(tt => a.style.visibility = tt > t + .1 && Math.floor(tt * 7) % 4 === 0 ? "hidden" : "");
      });
      const at1 = bate(S, 1190, "ATACAR", 39.80, IMPACTO(200, 88, "#FF5A2A") + ";text-shadow:0 0 34px rgba(255,60,30,.6)", 1.5);
      at1.classList.add("glitch"); jitter(at1, 39.8, 40.05, 14); jitter(at1, 40.12, 40.3, 10);
      L(S, 1440, LEVE(70), [["sistemas.", 40.12, "", "font-weight:500"]]);
      anim(S, [[38.12, { o: 0 }], [38.16, { o: 1 }, "lin"], ...tremor(40.12, 16)]);
      void im;
    },
  });

  /* ================= 19 · Revolução ou perigo (imagem: dilema) ================= */
  cena({
    id: "dilema", nome: "Revolução ou perigo", inicio: 40.9, fim: 43.76, z: 28,
    descricao: "Imagem dividida (luz e sombra); “REVOLUÇÃO” acende do lado claro, “ou” no meio e “PERIGO.” bate com glitch do lado escuro.",
    margem: .3,
    montar(S) {
      tela(S, "dilema", [[40.9, { s: 1.12 }], [43.76, { s: 1.0 }, "out"]], .72);
      const luz = h("div", "abs", S, null, "left:0;top:0;width:540px;height:1920px;background:radial-gradient(ellipse at 70% 50%, rgba(255,150,80,.35), transparent 60%);mix-blend-mode:screen");
      anim(luz, [[41.72, { o: 0 }], [41.9, { o: 1 }, "out"], [42.9, { o: .4 }, "lin"]]);
      const som = h("div", "abs", S, null, "left:540px;top:0;width:540px;height:1920px;background:rgba(0,0,0,.45)");
      anim(som, [[42.9, { o: 0 }], [43.05, { o: 1 }, "out"]]);
      L(S, 270, LEVE(58), [["Estamos", 40.92], ["diante", 41.24], ["de", 41.52], ["uma", 41.64]]);
      bate(S, 1180, "REVOLUÇÃO", 41.72, IMPACTO(132, 80, "#FFFFFF") + ";text-shadow:0 0 34px rgba(255,140,60,.7)");
      L(S, 1320, "font-size:96px;line-height:1", [["ou", 42.20, "ser", "color:#FFB07A"], ["de", 42.60, "", "font:300 54px var(--v-sans);color:#C9C9CE"], ["um", 42.70, "", "font:300 54px var(--v-sans);color:#C9C9CE"], ["novo", 42.76, "", "font:300 54px var(--v-sans);color:#C9C9CE"]]);
      const pg = bate(S, 1420, "PERIGO.", 42.90, IMPACTO(150, 90, "#FF4A26") + ";text-shadow:0 0 34px rgba(255,60,30,.6)", 1.5);
      pg.classList.add("glitch"); jitter(pg, 42.9, 43.15, 12);
      anim(S, [[40.9, { o: 0 }], [40.93, { o: 1 }, "lin"], ...tremor(42.9, 12)]);
    },
  });

  /* ================= 20 · Cartela (logo) ================= */
  cena({
    id: "cartela", nome: "Cartela final", inicio: 43.6, fim: 47.2, z: 30,
    descricao: "Íris escura; as duas metades da logo se encontram em laranja e ficam brancas; “Siga para entender o futuro.”, botão Seguir com luz de borda, clique e @matteu.ia.",
    montar(S) {
      escuro(S, { y: 880, int: .3 });
      trans.circulo(S, 43.6, { x: 540, y: 960, d: .45 });
      const T0 = 43.9;   // início da logo (mesma coreografia da v2, deslocada)
      const LW = 420, LH = 236, LX = 540 - LW / 2, LY = 900 - LH / 2, LOGO = MDS.img("logo");
      const wrap = h("div", "abs", S, null, `left:${LX}px;top:${LY}px;width:${LW}px;height:${LH}px;filter:drop-shadow(0 0 26px rgba(255,106,26,.85))`);
      const metade = lado => h("div", "abs", wrap, null, `left:0;top:0;width:${LW}px;height:${LH}px;-webkit-mask:url(${LOGO}) center/contain no-repeat;mask:url(${LOGO}) center/contain no-repeat;clip-path:inset(0 ${lado < 0 ? 50 : 0}% 0 ${lado < 0 ? 0 : 50}%)`);
      const ml = metade(-1), mr = metade(1);
      anim(ml, [[T0, { x: -160, o: 0 }], [T0 + .4, { x: 0, o: 1 }, "expo"]]);
      anim(mr, [[T0, { x: 160, o: 0 }], [T0 + .4, { x: 0, o: 1 }, "expo"]]);
      fx(t => { const p = prog(t, T0 + .3, T0 + .75); const c = `rgb(${Math.round(255 - 11 * p)},${Math.round(122 + 122 * p)},${Math.round(46 + 199 * p)})`; ml.style.background = mr.style.background = c;
        wrap.style.filter = `drop-shadow(0 0 ${(26 - 14 * p).toFixed(1)}px rgba(255,106,26,${(.85 - .45 * p).toFixed(2)}))`; });
      anim(wrap, [[T0 + .45, { y: 0, s: 1 }], [T0 + .85, { y: -380, s: .55 }, "expo"]]);
      L(S, 680, LEVE(84, "#F4F4F5", 400), [["Siga", T0 + .6], ["para", T0 + .7], ["entender", T0 + .8]]);
      L(S, 790, LEVE(84, "#F4F4F5", 400), [["o", T0 + .9], ["futuro.", T0 + 1.0, "ser neon", "font-size:120px"]]);
      const RB = h("div", "abs", S, null, "left:300px;top:980px;width:480px;height:130px;border-radius:65px;padding:3px;box-shadow:0 0 60px -14px rgba(255,106,26,.6);transform-origin:center");
      fx(t => { const a = ((t - T0) * 280) % 360; RB.style.background = `conic-gradient(from ${a.toFixed(1)}deg, #2A2A30 0deg, #2A2A30 220deg, #FF6A1A 300deg, #FFD7BA 330deg, #2A2A30 360deg)`; });
      const inB = h("div", "", RB, null, "width:100%;height:100%;border-radius:62px;background:#141417;display:flex;align-items:center;justify-content:center;gap:16px;font:600 48px var(--v-sans);letter-spacing:-.02em;color:#F4F4F5");
      const lab = h("span", "", inB, "Seguir"), ic = h("span", "", inB, null, "display:grid");
      const PLUS = `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
      const TC = T0 + 1.6;   // clique
      at(TC + .02, on => { lab.textContent = on ? "Seguindo" : "Seguir"; ic.innerHTML = on ? CHECK.replace('stroke="#fff"', 'stroke="currentColor"').replace('<svg ', '<svg width="40" height="40" ') : PLUS; inB.style.background = on ? "#FF6A1A" : "#141417"; });
      anim(RB, [[T0 + 1.0, { s: 0, o: 0 }], [T0 + 1.05, { o: 1 }, "lin"], [T0 + 1.4, { s: 1 }, "back"], ...ui.clique(RB, TC)]);
      const rip = h("div", "abs", S, null, "left:300px;top:980px;width:480px;height:130px;border-radius:65px;border:4px solid #FF6A1A;transform-origin:center");
      anim(rip, [[TC + .02, { o: 0, s: 1 }], [TC + .04, { o: 1 }, "lin"], [TC + .65, { o: 0, sx: 1.2, sy: 1.7 }, "out"]]);
      const hd = h("div", "hl", S, null, "top:1170px;font:500 42px/1 var(--v-mono);color:#9A9AA2;letter-spacing:.02em");
      typeText(h("span", "", hd), MDS.PROJETO.perfil || "", T0 + 1.15, 14);
      const mo = h("div", "abs", S, '<svg viewBox="0 0 40 48" width="72" height="88"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="#F4F4F5" stroke="#0B0B0D" stroke-width="3" stroke-linejoin="round"/></svg>', "left:600px;top:1030px;transform-origin:10% 6%");
      anim(mo, [[T0 + 1.1, { x: 220, y: 420, o: 0 }], [T0 + 1.17, { o: 1 }, "lin"], [TC - .05, { x: 0, y: 0 }, "expo"], [TC, { s: 1 }], [TC + .07, { s: .84 }, "out"], [TC + .25, { s: 1 }, "out"], [TC + .5, { x: 0, y: 0, o: 1 }], [TC + .9, { x: 240, y: 380, o: 0 }, "in"]]);
      anim(S, [[43.6, { s: 1 }], [47.2, { s: 1.03 }, "lin"]]);
    },
  });

  /* ---------- efeitos sonoros: muitos, todos presos a eventos visuais ---------- */
  const SFX = [
    // 1 · abertura
    ["swell", .05, .6], ["blip", 1.14, .35], ["blip", 1.58, .35], ["riser", 1.0, .45],
    // 2 · falhas
    ["whoosh", 2.04, .8], ["swell", 2.5, .45], ["glitch", 3.04], ["hit", 3.04, .8], ["glitch", 3.2, .5], ["glitch", 3.62, .45], ["blip", 3.42, .3],
    // 3 · dados
    ...[0, 1, 2, 3].map(i => ["pop", 4.02 + i * .07, .45]), ...[0, 1, 2, 3].map(i => ["click", 4.10 + i * .12, .5]), ["swoosh", 4.70, .5],
    // 4 · ficção
    ["pop", 6.0, .6], ["pop", 6.32, .6], ["boom", 6.62], ["whoosh", 6.86, .8],
    // 5 · pesquisadores
    ["whoosh", 7.06, .6], ["pop", 7.84, .6], ["whoosh", 8.9, .7],
    // 6 · terminal
    ["blip", 9.08, .4], ["blip", 9.52, .4], ["blip", 10.08, .4], ["blip", 10.64, .4], ["ding", 10.86, .7], ["swoosh", 11.0, .5],
    // 7 · vulnerabilidades
    ["hit", 11.14], ["glitch", 11.16, .5], ...[0, 1, 2, 3, 4, 5, 6].map(i => ["tick", 12.6 + i * .07, .35]), ["chime", 13.1, .4],
    // 8 · atenção
    ["ding", 13.78, .55], ["ding", 14.24, .65], ["ding", 14.42, .8], ["whoosh", 15.0, .7],
    // 9 · agentes
    ["whoosh", 15.12, .6], ["swell", 15.2, .5], ["blip", 15.8, .35], ["blip", 16.1, .35], ["blip", 16.4, .35], ["click", 16.64, .8], ["pop", 16.7, .6], ["pop", 16.82, .6],
    // 10 · duas
    ["boom", 17.1], ["ding", 17.38, .5], ["ding", 17.6, .5], ["whoosh", 19.25, .6],
    // 11 · rsa
    ["flip", 19.42, .6], ["pop", 19.44, .8], ...Array.from({ length: 11 }, (_, i) => ["tick", 20.4 + i * .05, .25]), ["hit", 20.96, .9],
    // 12 · por quê
    ["whoosh", 21.86, .8], ["pop", 22.66, .9], ["swoosh", 23.4, .6],
    // 13 · proteção
    ["swell", 23.6, .5], ...[0, 1, 2].map(i => ["pop", 24.4 + i * .12, .45]), ["swoosh", 25.30, .4], ...[0, 1, 2].map(i => ["click", 25.30 + i * .14, .6]), ["chime", 26.22, .45], ["whoosh", 26.75, .6],
    // 14 · radar
    ["swell", 27.5, .4], ...[0, 1].map(k => ["blip", 27.5 + k * 1.2, .3]), ["glitch", 29.58, .45], ["ding", 29.58, .6], ["pop", 29.70, .5], ["pop", 29.82, .5], ["swoosh", 30.25, .5],
    // 15 · escudo
    ["whoosh", 30.44, .7], ["swell", 30.5, .5], ["chime", 32.66, .5], ["flip", 33.5, .7],
    // 16 · outro lado
    ["boom", 33.68], ["glitch", 34.76], ["glitch", 35.02, .6], ["glitch", 35.2, .4],
    // 17 · mesma tecnologia
    ["whoosh", 35.78, .6], ["tick", 36.14, .5], ["tick", 36.3, .5], ["pop", 37.10, .6], ["pop", 37.78, .5], ["whoosh", 38.02, .6],
    // 18 · atacar
    ["swell", 38.2, .5], ["glitch", 39.6, .5], ["hit", 39.80], ["ding", 39.85, .45], ["ding", 40.0, .45], ["ding", 40.15, .45], ["glitch", 40.12, .7],
    // 19 · dilema
    ["riser", 41.0, .55], ["swoosh", 41.72, .5], ["pop", 42.2, .4], ["boom", 42.9], ["glitch", 42.92, .5],
    // 20 · cartela
    ["whoosh", 43.6, .7], ["chime", 44.2, .6], ["pop", 44.95, .6], ["click", 45.5], ["send", 45.53, .6],
  ];
  SFX.forEach(([k, t, g]) => MDS.sfx(k, t, g ?? 1));
  const teclas = (t0, n, cps, g = .5) => { for (let i = 0; i < n; i++) MDS.sfx("key", t0 + i / cps, g); };
  teclas(9.1, 18, 11, .45);          // terminal rolando
  teclas(45.05, 8, 11, .6);          // @matteu.ia
})();
