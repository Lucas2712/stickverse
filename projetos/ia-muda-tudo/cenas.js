/* A inteligência artificial está mudando tudo · @matteu.ia
 * Storyboard aprovado: projetos/ia-muda-tudo/storyboard.md
 * Noite + verde-ácido · Archivo (largura variável) · fio condutor: o cursor verde.
 * Música 128 BPM: batida = 0,46875 s, grade em 0,465 + n·0,46875. Grave entra em 15,47 s; energia sobe em 22,03 s.
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, svg, path, draw, typeText, floaty, classAt, at, palco, tipo, ui, trans, fundo } = MDS;
  const mw = (p, txt, t, size, cls = "", d = .6, e = "expo") => tipo.palavra(p, txt, t, { size, cls, d, e });
  /* linha de display (Archivo) centralizada */
  const D = (p, top, size, o = {}) => h("div", "hl disp", p, null,
    `top:${top}px;font-weight:${o.peso || 900};font-size:${size}px;line-height:1;font-stretch:${o.wd || 100}%;letter-spacing:${o.ls || "-.02em"};${o.css || ""}`);
  /* anima a largura da fonte (eixo wdth do Archivo, 62% a 125%) */
  const larg = (el, a, b, w0, w1, e = "expo") => fx(t => { el.style.fontStretch = (w0 + (w1 - w0) * prog(t, a, b, e)).toFixed(1) + "%"; });
  const BEAT = 0.46875;

  /* ---------- fundo: grade de pontos que desliza + vinheta ---------- */
  fundo.grade({ z: 1, passo: 56, cor: "#1A1D25", raio: 2, vel: 6 });
  h("div", "layer", palco(), null, "z-index:2;background:radial-gradient(ellipse 80% 60% at 50% 46%, transparent 45%, rgba(0,0,0,.6))");

  /* ================= 1 · Abertura ================= */
  cena({
    id: "abertura", nome: "Abertura", inicio: 0, fim: 2.9, z: 10,
    descricao: "O cursor verde digita “A INTELIGÊNCIA”; “ARTIFICIAL” se expande e “TUDO” bate gigante na batida. As letras explodem em pixels que desenham o mosaico da cena 2.",
    montar(S) {
      const l1 = D(S, 560, 100, { wd: 78, ls: "0em" });
      const t1 = h("span", "", l1), c1 = h("span", "cur", l1);
      typeText(t1, "A INTELIGÊNCIA", .05, 24, c1, .8);
      const l2 = D(S, 690, 160, { wd: 62 });
      mw(l2, "ARTIFICIAL", .70, 160);
      larg(l2, .70, 1.5, 62, 92);
      const l3 = h("div", "hl", S, null, "top:886px;font:500 60px/1 var(--v-sans);letter-spacing:-.025em;color:var(--v-ink2)");
      mw(l3, "está", 1.22, 60); l3.append(" "); mw(l3, "mudando", 1.56, 60);
      const l4 = D(S, 990, 260, { wd: 80, ls: "-.03em", css: "color:var(--v-ac)" });
      tipo.letras(l4, "TUDO", 1.98, { size: 260, stagger: .045, d: .6 });
      larg(l4, 1.98, 2.6, 80, 125);
      anim(l4, [[1.98, { s: 1.15 }], [2.6, { s: 1 }, "expo"], [2.55, { o: 1 }], [2.6, { o: 0 }, "lin"]]);
      [l1, l2, l3].forEach((l, i) => anim(l, [[1.98, { s: 1, b: 0, o: 1, y: 0 }], [2.3, { s: .96, b: 3, o: .7 }, "out"], [2.45 + i * .03, { s: .96, o: .7, y: 0 }], [2.8, { y: -60, o: 0, b: 12 }, "in"]]));
      anim(S, [[0, { s: 1 }], [2.6, { s: 1.03 }, "lin"]]);

      // explosão: pixels de «TUDO» viram as bordas dos 4 cards da cena 2
      const L = h("div", "layer", palco(), null, "z-index:50");
      const CARDS = [[70, 400, 560, 330], [450, 640, 560, 330], [70, 880, 540, 230], [330, 1080, 600, 300]];
      for (let i = 0; i < 40; i++) {
        const c = CARDS[i % 4], k = Math.floor(i / 4) / 10, per = 2 * (c[2] + c[3]), d = k * per;
        const [tx, ty] = d < c[2] ? [c[0] + d, c[1]] : d < c[2] + c[3] ? [c[0] + c[2], c[1] + d - c[2]] : d < 2 * c[2] + c[3] ? [c[0] + c[2] - (d - c[2] - c[3]), c[1] + c[3]] : [c[0], c[1] + c[3] - (d - 2 * c[2] - c[3])];
        const sx = 130 + (i * 97 % 820), sy = 1020 + (i * 53 % 220);
        const q = h("div", "abs", L, null, `left:${tx - 11}px;top:${ty - 11}px;width:22px;height:22px;background:var(--v-ac);border-radius:3px;box-shadow:0 0 14px rgba(200,255,60,.5)`);
        const t0 = 2.55 + (i % 8) * .012;
        anim(q, [[t0 - .01, { o: 0, x: sx - tx, y: sy - ty, s: 1.4 }], [t0, { o: 1 }, "lin"], [t0 + .65, { x: 0, y: 0, s: .55, r: 90 }, "inOutExpo"], [3.25 + (i % 4) * .05, { o: 1 }], [3.55 + (i % 4) * .05, { o: 0, s: .2 }, "in"]]);
      }
    },
  });

  /* ================= 2 · Tudo muda ================= */
  cena({
    id: "tudo-muda", nome: "Tudo muda", inicio: 2.8, fim: 7.3, z: 40,
    descricao: "Mosaico em profundidade: um card por verbo, cada um entra na palavra falada (tarefas, traço desenhado, aula, gráfico subindo).",
    montar(S) {
      const lab = h("div", "abs", S, null, "left:90px;top:300px;font:500 40px/1 var(--v-mono);color:var(--v-ink2);letter-spacing:.02em");
      const lt = h("span", "", lab), lc = h("span", "cur", lab);
      typeText(lt, "O jeito de", 2.92, 22, lc, 3.5);
      anim(lab, [[2.85, { o: 1 }], ...OUT(6.85, { dy: -40 })]);
      const TIT = "padding:0 36px;font:900 80px/1 var(--v-display);font-stretch:80%;letter-spacing:-.015em";
      const sai = (cx, cy, i) => [[6.82 + i * .03, { x: 0, y: 0, s: 1, o: 1, b: 0 }], [7.2 + i * .03, { x: (540 - cx) * .7, y: (820 - cy) * .7, s: .45, o: 0, b: 14 }, "in"]];

      // A · trabalhar
      const A = h("div", "card", S, null, "left:70px;top:400px;width:560px;height:330px;padding-top:36px");
      h("div", "", A, "TRABALHAR", TIT + ";margin-bottom:22px");
      ui.checklist(A, [["Responder e-mails", 3.55], ["Organizar a semana", 3.70]]);
      anim(A, [...IN(3.40), ...sai(350, 565, 0)]);
      floaty(A, 9, 1.1, 0);

      // B · criar
      const B = h("div", "card", S, null, "left:450px;top:640px;width:560px;height:330px;padding-top:36px");
      h("div", "", B, "CRIAR", TIT);
      const sv = svg(B, 560, 200, "display:block;margin-top:6px");
      const cv = path(sv, "M50 150 C 120 20, 210 30, 250 110 S 380 190, 420 70 S 500 40, 515 90", { fill: "none", stroke: "var(--v-ac)", "stroke-width": 9, "stroke-linecap": "round" });
      draw(cv, 4.3, 5.1, "inOut");
      const pen = MDS.sel(sv, "rect", { width: 14, height: 40, rx: 2, fill: "var(--v-ac)" });
      const LL = cv.getTotalLength();
      fx(t => { const p = cv.getPointAtLength(LL * prog(t, 4.3, 5.1, "inOut")); pen.setAttribute("x", p.x + 10); pen.setAttribute("y", p.y - 44); pen.style.opacity = t > 4.25 && t < 5.4 && Math.floor(t * 3) % 2 === 0 || (t > 4.25 && t < 5.1) ? 1 : 0; });
      anim(B, [...IN(4.24, { dx: 60 }), ...sai(730, 805, 1)]);
      floaty(B, 11, .95, 1.4);

      // C · aprender
      const C = h("div", "card", S, null, "left:70px;top:880px;width:540px;height:230px;padding-top:36px");
      h("div", "", C, "APRENDER", TIT);
      C.insertAdjacentHTML("beforeend", `<div style="display:flex;justify-content:space-between;padding:18px 36px 0;font:500 26px var(--v-sans);color:var(--v-ink2)"><span>Aula 3 · IA na prática</span><span class="pct" style="font-family:var(--v-mono);color:var(--v-ink)">0%</span></div>
        <div style="margin:16px 36px 0;height:14px;border-radius:7px;background:var(--v-line);overflow:hidden"><div class="bar" style="height:100%;width:0;background:var(--v-ac);border-radius:7px"></div></div>`);
      const bar = C.querySelector(".bar"), pct = C.querySelector(".pct");
      fx(t => { const v = prog(t, 4.96, 5.86, "inOut"); bar.style.width = (100 * v).toFixed(1) + "%"; pct.textContent = Math.round(100 * v) + "%"; });
      anim(C, [...IN(4.96, { dx: -50 }), ...sai(340, 995, 2)]);
      floaty(C, 8, 1.2, 2.2);

      // D · ganhar dinheiro (gráfico sem números: o roteiro não traz dados)
      const Dc = h("div", "card", S, null, "left:330px;top:1080px;width:600px;height:300px;padding-top:34px");
      h("div", "", Dc, "GANHAR DINHEIRO", TIT + ";font-size:66px;font-stretch:72%");
      const s2 = svg(Dc, 600, 180, "display:block;margin-top:8px");
      const ln = path(s2, "M40 150 L120 128 L190 136 L260 100 L330 108 L400 70 L470 52", { fill: "none", stroke: "var(--v-ac)", "stroke-width": 8, "stroke-linejoin": "round", "stroke-linecap": "round" });
      draw(ln, 5.98, 6.32, "out");
      const arrow = path(s2, "M470 52 m-6 -26 l40 16 l-30 30 z", { fill: "var(--v-ac)" });
      fx(t => { arrow.style.opacity = t >= 6.32 ? 1 : 0; arrow.style.transformOrigin = "480px 50px"; arrow.style.transform = `scale(${(.4 + .6 * prog(t, 6.32, 6.62, "back")).toFixed(3)})`; });
      for (let i = 0; i < 6; i++) MDS.sel(s2, "line", { x1: 40, x2: 560, y1: 30 + i * 26, y2: 30 + i * 26, stroke: "#1A1D25", "stroke-width": 2 });
      s2.insertBefore(s2.lastChild, s2.firstChild);
      anim(Dc, [...IN(5.98, { dx: 50 }), ...sai(630, 1230, 3)]);
      floaty(Dc, 10, 1.0, 3.1);

      anim(S, [[2.9, { y: 30 }], [7.0, { y: -40 }, "sine"]]);
    },
  });

  /* ================= 3 · Ferramentas ================= */
  cena({
    id: "ferramentas", nome: "Ferramentas", inicio: 7.2, fim: 12.5, z: 41,
    descricao: "O cursor cresce e vira uma janela de chat genérica; “Claude” aparece só como palavra. Em “abrindo” a janela se fecha numa fenda de luz e vira o nó de uma constelação de possibilidades; os “?” acendem em “nem conhece”.",
    margem: 1,
    montar(S) {
      const CX = 540, CY = 820;
      // portal: o cursor que fica no centro quando os cards recuam
      const P = h("div", "abs", S, null, `left:${CX - 15}px;top:${CY - 35}px;width:30px;height:70px;background:var(--v-ac);border-radius:4px`);
      anim(P, [[7.0, { o: 0, s: .4 }], [7.12, { o: 1, s: 1 }, "back"], [7.22, { sx: 1, sy: 1 }], [7.52, { sx: 28.7, sy: 8 }, "expo"], [7.3, { o: 1 }], [7.48, { o: 0 }, "lin"]]);

      const lab = h("div", "hl", S, "ferramentas como", "top:262px;font:500 36px/1 var(--v-mono);color:var(--v-ink2)");
      anim(lab, [...IN(7.48, { dy: 24, s: 1, b: 8, d: .45 }), ...OUT(9.15, { dy: -30, d: .3 })]);
      const nm = D(S, 316, 150, { wd: 88, css: "color:var(--v-ac)" });
      mw(nm, "Claude", 8.14, 150);
      anim(nm, OUT(9.18, { dy: -40, d: .32 }));

      const W = h("div", "card", S, null, "left:110px;top:540px;width:860px;height:560px");
      W.innerHTML = `<div class="wh"><span class="dots"><i></i><i></i><i></i></span>ferramentas de IA</div>
        <div style="position:absolute;left:38px;top:128px;display:flex;gap:22px;align-items:flex-start">
          <span style="width:56px;height:56px;border-radius:50%;flex:none;background:var(--v-ac);display:grid;place-items:center"><i style="width:8px;height:26px;background:#0A0B0F;border-radius:2px"></i></span>
          <div style="display:flex;flex-direction:column;gap:16px;padding-top:6px">
            <div class="msg" style="font:500 32px/1.25 var(--v-sans);color:var(--v-ink)">Oi! Como posso ajudar hoje?</div>
            <i style="width:420px;height:18px;border-radius:9px;background:var(--v-line)"></i><i style="width:300px;height:18px;border-radius:9px;background:var(--v-line)"></i></div></div>
        <div style="position:absolute;left:30px;right:30px;bottom:30px;height:100px;border-radius:50px;background:#0A0B0F;box-shadow:0 0 0 2px #2A2E38;display:flex;align-items:center;padding:0 14px 0 38px;font:500 34px var(--v-sans);color:var(--v-ink)">
          <span class="inp"></span><span class="cur"></span>
          <span style="margin-left:auto;width:72px;height:72px;border-radius:50%;background:var(--v-ac);display:grid;place-items:center"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#0A0B0F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg></span></div>`;
      typeText(W.querySelector(".inp"), "me ajuda a criar…", 8.2, 22, W.querySelector(".cur"));
      anim(W, [[7.3, { o: 0, s: .6, b: 16 }], [7.9, { o: 1, s: 1, b: 0 }, "expo"], [8.9, { sy: 1, o: 1 }], [9.12, { sy: .012 }, "inExpo"], [9.13, { o: 1 }], [9.16, { o: 0 }, "lin"]]);
      // fenda de luz → nó central
      const slit = h("div", "abs", S, null, `left:${CX - 430}px;top:${CY - 4}px;width:860px;height:8px;background:var(--v-ac);border-radius:4px;box-shadow:0 0 40px rgba(200,255,60,.8)`);
      anim(slit, [[9.08, { o: 0, sx: 1 }], [9.12, { o: 1 }, "lin"], [9.18, { sx: 1 }], [9.42, { sx: .012 }, "inExpo"], [9.44, { o: 0 }, "lin"]]);
      const links = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      const node = h("div", "abs", S, null, `left:${CX - 75}px;top:${CY - 75}px;width:150px;height:150px;border-radius:50%;background:var(--v-ac);display:grid;place-items:center;box-shadow:0 0 0 14px rgba(200,255,60,.12), 0 0 80px rgba(200,255,60,.45)`);
      const nc = h("i", "", node, null, "width:16px;height:52px;background:#0A0B0F;border-radius:3px");
      fx(t => nc.style.opacity = Math.floor(t * 2.6) % 2 ? .25 : 1);
      anim(node, [[9.38, { s: 0, o: 0 }], [9.4, { o: 1 }, "lin"], [9.8, { s: 1 }, "back"]]);
      for (let k = 0; k < 2; k++) {
        const rg = h("div", "abs", S, null, `left:${CX - 75}px;top:${CY - 75}px;width:150px;height:150px;border-radius:50%;border:3px solid var(--v-ac)`);
        fx(t => { const p = ((t - 9.5) * .55 + k * .5) % 1; rg.style.opacity = t > 9.5 ? ((1 - p) * .5).toFixed(2) : 0; rg.style.scale = (1 + p * 1.6).toFixed(3); });
      }
      ["textos", "imagens", "código", "vídeos", "estudos", "negócios"].forEach((n, i) => {
        const a = (-90 + i * 60) * Math.PI / 180, x = CX + Math.cos(a) * 290, y = CY + Math.sin(a) * 320, t0 = 9.26 + i * .08;
        const lp = path(links, `M${CX} ${CY} L${x} ${y}`, { stroke: "#2E323D", "stroke-width": 3, "stroke-linecap": "round" });
        draw(lp, t0 + .1, t0 + .5, "out");
        const c = ui.chip(S, { x, y, texto: n, variante: "line", centro: true, tamanho: 34 });
        c.style.height = "72px"; c.style.transformOrigin = "center";
        anim(c, [[t0, { o: 0, x: CX - x, y: CY - y, s: .3 }], [t0 + .62, { o: 1, x: 0, y: 0, s: 1 }, "back"]]);
      });
      // «que muita gente ainda nem conhece»: anel de fora com “?”
      for (let i = 0; i < 8; i++) {
        const a = (-67.5 + i * 45) * Math.PI / 180, x = CX + Math.cos(a) * 470, y = CY + Math.sin(a) * 560, t0 = 11.12 + (i * 3 % 8) * .055;
        const g = h("div", "chip abs", S, `<span style="font:700 34px var(--v-mono);color:var(--v-ink2)">?</span><i style="width:${90 + (i * 37) % 70}px;height:16px;border-radius:8px;background:#22252E"></i>`,
          `left:${x}px;top:${y}px;translate:-50% -50%;height:72px;padding:0 30px;border:2px dashed #3A3F4B;background:rgba(17,19,25,.7)`);
        anim(g, [[t0, { o: 0, s: .7, b: 10 }], [t0 + .5, { o: .9, s: 1, b: 0 }, "expo"]]);
      }
      anim(S, [[10.2, { s: 1, y: 0 }], [10.95, { s: .78, y: 60 }, "expo"], [12.2, { s: .76, y: 60, o: 1, b: 0 }, "lin"], [12.55, { y: -640, o: 0, b: 16 }, "inExpo"]]);
    },
  });

  /* ================= 4 · Aqui ================= */
  cena({
    id: "aqui", nome: "Aqui", inicio: 12.4, fim: 15.5, z: 42,
    descricao: "“AQUI” bate sobre um celular genérico com o feed do canal; selo NOVO em “descobrir”, o feed rola em “novas tecnologias” e a câmera mergulha na tela no grave da música.",
    montar(S) {
      const aq = D(S, 250, 200, { wd: 100, css: "color:var(--v-ac)" });
      mw(aq, "AQUI", 12.64, 200, "", .55, "back");
      const { el: ph, tela } = ui.celular(S, { x: 290, y: 500, w: 500, h: 880 });
      anim(ph, [[12.45, { y: 900, o: 0, r: -14 }], [12.5, { o: 1 }, "lin"], [13.15, { y: 0, r: -6 }, "expo"], [15.47, { r: -2 }, "inOut"]]);
      tela.style.overflow = "hidden"; tela.style.borderRadius = "0 0 52px 52px";
      const feed = h("div", "abs", tela, null, "left:0;right:0;top:16px");
      const POSTS = ["nova ferramenta", "tutorial", "teste na prática", "novidade da semana", "passo a passo", "dica rápida", "do zero ao projeto"];
      const cards = POSTS.map((n, i) => {
        const c = h("div", "", feed, `<div class="th" style="position:relative;height:150px;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#171A21,#1E222B)">
            <i style="position:absolute;left:${30 + (i * 53) % 160}px;top:${28 + (i * 31) % 50}px;width:${70 + (i * 17) % 40}px;height:${70 + (i * 17) % 40}px;border-radius:${i % 2 ? "50%" : "16px"};border:5px solid var(--v-ac);opacity:.85"></i>
            <i style="position:absolute;right:26px;bottom:26px;width:120px;height:14px;border-radius:7px;background:#2A2E38"></i></div>
          <div style="font:600 30px/1.15 var(--v-sans);letter-spacing:-.02em;margin-top:14px;color:var(--v-ink)">${n}</div>
          <div style="font:500 20px var(--v-mono);color:var(--v-mute);margin-top:6px">vídeo · ${["0:45", "1:10", "0:58", "0:30", "1:20", "0:25", "1:05"][i]}</div>`, "height:254px;padding:0 4px");
        return c;
      });
      // selo NOVO + brilho no primeiro post
      const th0 = cards[0].querySelector(".th");
      const novo = h("div", "abs", th0, "NOVO", "left:18px;top:18px;padding:8px 16px;border-radius:12px;background:var(--v-ac);color:#0A0B0F;font:700 22px var(--v-mono);letter-spacing:.08em;transform-origin:0 0");
      anim(novo, [[13.38, { s: 0, o: 0 }], [13.42, { o: 1 }, "lin"], [13.78, { s: 1 }, "back"]]);
      const sh = h("div", "abs", th0, null, "left:-200px;top:-40px;width:120px;height:240px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transform:rotate(18deg)");
      anim(sh, [[13.4, { x: 0 }], [13.95, { x: 760 }, "inOut"]]);
      anim(feed, [[13.70, { y: 0 }], [14.22, { y: -762 }, "inOutExpo"]]);
      // barra de rolagem: o cursor verde na lateral
      const sc = h("div", "abs", tela, null, "right:6px;top:30px;width:8px;height:90px;border-radius:4px;background:var(--v-ac)");
      fx(t => { sc.style.translate = `0 ${(prog(t, 13.70, 14.22, "inOutExpo") * 420).toFixed(1)}px`; });
      anim(S, [[14.55, { s: 1, b: 0, y: 0 }], [15.47, { s: 3.4, b: 8, y: 120 }, "in"], [15.49, { o: 1 }], [15.52, { o: 0 }, "lin"]]);
      trans.flash(15.47, { cor: "var(--v-ac)", pico: .85, d: .3 });
    },
  });

  /* ================= 5 · Aprender a usar (drop) ================= */
  cena({
    id: "aprender", nome: "Aprender a usar", inicio: 15.3, fim: 17.6, z: 43,
    descricao: "O grave da música entra: cada linha de texto bate numa batida (15,47 · 15,94 · 16,41 · 16,88) e o cursor vira uma barra de progresso à direita.",
    montar(S) {
      const G = h("div", "layer", S);
      const BT = [15.47, 15.94, 16.41, 16.88];
      const LIN = [["APRENDER", 480, 160, 82, ""], ["A USAR", 672, 140, 100, "color:transparent;-webkit-text-stroke:3px var(--v-ink)"], ["INTELIGÊNCIA", 850, 124, 72, "color:var(--v-ac)"], ["ARTIFICIAL", 990, 124, 72, "color:var(--v-ac)"]];
      LIN.forEach(([txt, top, size, wd, css], i) => {
        const l = D(G, top, size, { wd, css: `left:90px;right:auto;text-align:left;transform-origin:0 50%;${css}` });
        l.textContent = txt;
        const t = BT[i];
        anim(l, [[t - .01, { o: 0, s: 1.3, x: -30 }], [t + .03, { o: 1 }, "lin"], [t + .38, { s: 1, x: 0 }, "expo"],
          [17.28 + i * .03, { o: 1, b: 0, sx: 1 }], [17.58 + i * .03, { o: 0, b: 18, sx: 1.35 }, "in"]]);
      });
      // pulso em cada batida
      fx(t => { let p = 0; for (let k = 0; k < 6; k++) { const b = 15.47 + k * BEAT; if (t >= b) p = Math.exp(-(t - b) * 9); } G.style.scale = (1 + p * .018).toFixed(4); });
      // barra de progresso vertical (o cursor esticado)
      const tr = h("div", "abs", S, null, "left:920px;top:480px;width:26px;height:634px;border-radius:13px;box-shadow:inset 0 0 0 2px var(--v-line);overflow:hidden");
      const fi = h("div", "abs", tr, null, "left:0;right:0;bottom:0;height:100%;background:var(--v-ac);border-radius:13px;transform-origin:50% 100%;box-shadow:0 0 30px rgba(200,255,60,.6)");
      fx(t => { let v = 0; BT.forEach(b => v += prog(t, b, b + .3, "expo") * .25); fi.style.transform = `scaleY(${v.toFixed(4)})`; });
      anim(tr, [[15.45, { o: 0 }], [15.5, { o: 1 }, "lin"], [17.3, { o: 1, y: 0 }], [17.58, { o: 0, y: -60 }, "in"]]);
      anim(S, [[15.44, { o: 0, x: 0, y: 0 }], [15.47, { o: 1 }, "lin"], [15.52, { x: 9, y: -7 }, "lin"], [15.57, { x: -7, y: 6 }, "lin"], [15.62, { x: 4, y: -3 }, "lin"], [15.72, { x: 0, y: 0 }, "out"]]);
    },
  });

  /* ================= 6 · Ideias viram projetos ================= */
  cena({
    id: "projetos", nome: "Ideias viram projetos", inicio: 17.5, fim: 20.3, z: 44,
    descricao: "Rabiscos se juntam num rascunho tracejado (“ideia”); uma varredura verde em “projetos” transforma o rascunho numa interface pronta e o selo “no ar” estala em “reais”.",
    montar(S) {
      // rabiscos que convergem
      const RB = [[120, 520], [700, 450], [140, 1080], [720, 1150], [430, 1290]];
      RB.forEach(([x, y], i) => {
        const s = svg(S, 220, 140, `position:absolute;left:${x}px;top:${y}px;overflow:visible`);
        const p = path(s, ["M10 90 C 50 10, 90 130, 130 50 S 190 30, 210 80", "M20 30 L200 30 M20 70 L150 70 M20 110 L180 110", "M110 20 A 50 50 0 1 1 109 20", "M20 120 L110 20 L200 120 Z", "M30 70 Q 110 -10 190 70 T 30 70"][i], { fill: "none", stroke: i % 2 ? "var(--v-ink2)" : "var(--v-ac)", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" });
        draw(p, 17.56 + i * .04, 17.92 + i * .04, "out");
        anim(s, [[17.54 + i * .04, { o: 0 }], [17.57 + i * .04, { o: 1 }, "lin"], [17.95, { x: 0, y: 0, s: 1, o: 1 }], [18.28, { x: 540 - x - 110, y: 840 - y - 70, s: .3, o: 0 }, "inExpo"]]);
      });
      const lab = h("div", "hl", S, null, "top:340px;font:500 38px/1 var(--v-mono);letter-spacing:.02em");
      at(18.24, on => { lab.textContent = on ? "ideia" : ""; lab.style.color = "var(--v-ink2)"; }, 18.94);
      at(18.94, on => { if (on) { lab.textContent = "projeto real"; lab.style.color = "var(--v-ac)"; } });
      anim(lab, [[18.2, { o: 0, y: 20 }], [18.5, { o: 1, y: 0 }, "expo"], [18.94, { s: 1.15 }, "out"], [19.2, { s: 1 }, "out"], ...OUT(19.85, { dy: -30, d: .35 })]);

      const C = h("div", "card", S, null, "left:190px;top:440px;width:700px;height:800px;transform-origin:center");
      // rascunho
      const ws = svg(C, 700, 800, "position:absolute;left:0;top:0");
      const R = (x, y, w, hh, r = 16) => `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + hh - r} Q${x + w} ${y + hh} ${x + w - r} ${y + hh} H${x + r} Q${x} ${y + hh} ${x} ${y + hh - r} V${y + r} Q${x} ${y} ${x + r} ${y}`;
      [R(44, 40, 300, 40, 12), R(44, 110, 612, 300, 22), "M44 110 L656 410 M656 110 L44 410", R(44, 450, 420, 56, 10), "M44 540 H600", "M44 580 H480", R(44, 660, 612, 96, 48)].forEach((d, i) => {
        const p = path(ws, d, { fill: "none", stroke: "#4A505C", "stroke-width": 4, "stroke-linecap": "butt" });
        draw(p, 18.24 + i * .06, 18.66 + i * .06, "inOut");
      });
      const qm = h("div", "abs", C, "?", "left:330px;top:205px;font:800 110px/1 var(--v-display);color:#4A505C");
      // interface pronta (revelada por varredura de cima para baixo)
      const real = h("div", "abs", C, null, "left:0;top:0;width:700px;height:800px");
      real.innerHTML = `<div style="position:absolute;left:44px;top:40px;display:flex;align-items:center;gap:16px;font:600 32px var(--v-sans);color:var(--v-ink)"><i style="width:18px;height:18px;border-radius:50%;background:var(--v-ac)"></i>Meu projeto</div>
        <div style="position:absolute;right:44px;top:46px;font:500 24px var(--v-mono);color:var(--v-ink2)">v1.0</div>
        <div style="position:absolute;left:44px;top:110px;width:612px;height:300px;border-radius:22px;overflow:hidden;background:linear-gradient(140deg,#1B1F27,#12151B)">
          <i style="position:absolute;left:70px;top:60px;width:180px;height:180px;border-radius:50%;background:var(--v-ac)"></i>
          <i style="position:absolute;left:290px;top:90px;width:250px;height:22px;border-radius:11px;background:#2E333E"></i>
          <i style="position:absolute;left:290px;top:134px;width:190px;height:22px;border-radius:11px;background:#2E333E"></i>
          <i style="position:absolute;left:290px;top:190px;width:120px;height:56px;border-radius:14px;border:4px solid var(--v-ac)"></i></div>
        <div style="position:absolute;left:44px;top:446px;font:900 60px/1 var(--v-display);font-stretch:80%;letter-spacing:-.01em;color:var(--v-ink)">PRONTO PARA USAR</div>
        <i style="position:absolute;left:44px;top:532px;width:556px;height:18px;border-radius:9px;background:var(--v-line)"></i>
        <i style="position:absolute;left:44px;top:572px;width:436px;height:18px;border-radius:9px;background:var(--v-line)"></i>
        <div style="position:absolute;left:44px;top:660px;width:612px;height:96px;border-radius:48px;background:var(--v-ac);color:#0A0B0F;display:grid;place-items:center;font:700 34px var(--v-sans);letter-spacing:-.01em">Abrir</div>`;
      fx(t => { const p = prog(t, 18.94, 19.42, "inOut"); real.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`; ws.style.opacity = (1 - prog(t, 19.1, 19.45)).toFixed(3); qm.style.opacity = t < 18.94 ? prog(t, 18.5, 18.7).toFixed(2) : (1 - prog(t, 18.94, 19.2)).toFixed(2); });
      const sw = h("div", "abs", C, null, "left:0;top:0;width:700px;height:6px;background:var(--v-ac);box-shadow:0 0 30px 6px rgba(200,255,60,.55)");
      anim(sw, [[18.92, { o: 0, y: 0 }], [18.96, { o: 1 }, "lin"], [19.42, { y: 794 }, "inOut"], [19.45, { o: 1 }], [19.55, { o: 0 }, "lin"]]);
      anim(C, [[17.9, { o: 0, s: .85, r: -3 }], [18.4, { o: 1, s: 1, r: -3 }, "expo"], [19.4, { r: 0, s: 1 }, "inOut"], [19.46, { s: 1 }], [19.56, { s: 1.04 }, "out"], [19.8, { s: 1 }, "out"],
        [19.9, { x: 0, y: 0, s: 1, o: 1 }], [20.3, { x: -100, y: 160, s: .05, o: .6 }, "inExpo"], [20.32, { o: 0 }, "lin"]]);
      const selo = h("div", "abs", S, `<i style="width:16px;height:16px;border-radius:50%;background:#0A0B0F"></i>no ar`, "left:700px;top:405px;height:64px;padding:0 26px;border-radius:32px;background:var(--v-ac);color:#0A0B0F;display:flex;align-items:center;gap:12px;font:700 30px var(--v-mono);transform-origin:center");
      anim(selo, [[19.46, { s: 0, o: 0, r: -12 }], [19.5, { o: 1 }, "lin"], [19.85, { s: 1, r: 0 }, "back"], ...OUT(19.9, { dy: 40, s: .4, d: .3 })]);
    },
  });

  /* ================= 7 · O futuro ================= */
  cena({
    id: "futuro", nome: "O futuro", inicio: 20.2, fim: 22.2, z: 45,
    descricao: "O projeto encolhe num ponto que vira o marcador “agora” de uma linha do tempo: cinza à esquerda, verde à direita. “FUTURO” se expande; em “começou” a linha acende até a borda. Corte na batida de 22,03 s.",
    montar(S) {
      const Y = 1000;
      const o = D(S, 560, 80, { peso: 700, wd: 100, css: "color:var(--v-ink2)" });
      mw(o, "O", 20.54, 80);
      const fu = D(S, 660, 200, { wd: 68 });
      mw(fu, "FUTURO", 20.66, 200);
      larg(fu, 20.66, 21.4, 68, 92);
      const jc = D(S, 1080, 100, { peso: 800, wd: 85 });
      mw(jc, "já", 21.04, 100, "ac"); jc.append(" "); mw(jc, "começou", 21.36, 100);
      // trilho: passado cinza com marcas que correm para a esquerda
      const past = h("div", "abs", S, null, `left:-120px;top:${Y - 30}px;width:760px;height:60px;overflow:hidden`);
      h("div", "abs", past, null, "left:0;top:28px;width:760px;height:4px;background:#2E323D");
      const tk = h("div", "abs", past, null, "left:0;top:10px;width:2000px;height:40px;background-image:linear-gradient(90deg,#3A3F4B 0 3px,transparent 3px);background-size:80px 40px");
      fx(t => tk.style.translate = `${(-(t * 70) % 80).toFixed(1)}px 0`);
      anim(past, [[20.2, { o: 0 }], [20.45, { o: 1 }, "lin"]]);
      // futuro aceso
      const fut = h("div", "abs", S, null, `left:640px;top:${Y - 3}px;width:600px;height:6px;border-radius:3px;background:var(--v-ac);transform-origin:0 50%;box-shadow:0 0 24px rgba(200,255,60,.6)`);
      anim(fut, [[21.36, { sx: 0 }], [21.9, { sx: 1 }, "expo"]]);
      // marcador “agora”
      const mk = h("div", "abs", S, null, `left:440px;top:${Y}px;width:0;height:0`);
      h("div", "abs", mk, null, "left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:var(--v-ac);box-shadow:0 0 0 10px rgba(200,255,60,.15), 0 0 40px rgba(200,255,60,.6)");
      const rg = h("div", "abs", mk, null, "left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;border:3px solid var(--v-ac)");
      fx(t => { const p = ((t - 20.3) * .9) % 1; rg.style.opacity = t > 20.3 ? ((1 - p) * .7).toFixed(2) : 0; rg.style.scale = (1 + p * 2.4).toFixed(3); });
      const ag = h("div", "abs", mk, "agora", "left:-80px;top:-92px;width:160px;text-align:center;font:600 28px var(--v-mono);letter-spacing:.14em;color:var(--v-ac)");
      anim(ag, IN(20.45, { dy: 16, s: 1, b: 6, d: .4 }));
      anim(mk, [[20.2, { s: 0, o: 0 }], [20.24, { o: 1 }, "lin"], [20.55, { s: 1 }, "back"], [21.04, { x: 0 }], [21.44, { x: 200 }, "expo"]]);
      anim(S, [[20.2, { x: 50 }], [22.0, { x: -50 }, "sine"], [22.02, { o: 1 }], [22.03, { o: 0 }, "lin"]]);
      trans.flash(22.03, { cor: "var(--v-ac)", pico: .5, d: .26 });
    },
  });

  /* ================= 8 · A pergunta ================= */
  cena({
    id: "pergunta", nome: "A pergunta", inicio: 22.0, fim: 24.9, z: 46,
    descricao: "Uma grade de quadrados verdes acende na batida; um único quadrado cinza fica de fora. “VOCÊ” bate gigante, a grade se afasta e “DE FORA?” entra em verde. O quadrado vira o cursor da cartela.",
    montar(S) {
      const q = h("div", "hl", S, null, "top:280px;font:500 44px/1 var(--v-mono);color:var(--v-ink2)");
      const qt = h("span", "", q), qc = h("span", "cur", q);
      typeText(qt, "A pergunta é:", 22.44, 14, qc, 23.5);
      const vc = D(S, 350, 250, { wd: 100, ls: "-.03em" });
      mw(vc, "VOCÊ", 23.48, 250, "", .5);
      const vf = h("div", "hl", S, null, "top:618px;font:500 64px/1 var(--v-sans);letter-spacing:-.02em;color:var(--v-ink2)");
      mw(vf, "vai", 23.62, 64); vf.append(" "); mw(vf, "ficar", 23.84, 64);
      const df = D(S, 1330, 170, { wd: 86, css: "color:var(--v-ac)" });
      mw(df, "DE", 24.06, 170); df.append(" "); mw(df, "FORA?", 24.22, 170);
      anim(vc, [[23.48, { s: 1.25 }], [23.98, { s: 1 }, "expo"], ...OUT(24.55, { dy: -70, d: .35 })]);
      [q, vf].forEach((e, i) => anim(e, OUT(24.5 + i * .04, { dy: -50, d: .35 })));
      anim(df, OUT(24.58, { dy: 50, d: .32 }));
      // grade
      const G = h("div", "abs", S, null, "left:200px;top:770px;width:466px;height:520px");
      for (let r = 0; r < 10; r++) for (let c = 0; c < 9; c++) {
        const d = Math.abs(c - 4) + Math.abs(r - 4.5), t0 = 22.03 + d * .028, t1 = 24.45 + d * .025;
        const sq = h("div", "abs", G, null, `left:${c * 54}px;top:${r * 54}px;width:34px;height:34px;border-radius:5px;background:var(--v-ac);transform-origin:center`);
        anim(sq, [[t0, { o: 0, s: .3 }], [t0 + .3, { o: .9, s: 1 }, "back"], [t1, { o: .9, s: 1 }], [t1 + .25, { o: 0, s: .3 }, "in"]]);
      }
      anim(G, [[23.84, { x: 0 }], [24.3, { x: -60 }, "expo"]]);
      // você: o quadrado cinza de fora (vira o cursor da cartela)
      const me = h("div", "abs", S, null, "left:830px;top:1003px;width:34px;height:34px;border-radius:5px;background:#3A3F4B");
      fx(t => { me.style.background = t >= 24.5 ? "var(--v-ac)" : (t >= 23.48 && Math.floor(t * 3) % 2 === 0 ? "#6A707C" : "#3A3F4B"); });
      anim(me, [[22.3, { o: 0, s: .3 }], [22.6, { o: 1, s: 1 }, "back"], [23.48, { s: 1 }], [23.6, { s: 1.4 }, "out"], [23.85, { s: 1 }, "back"],
        [24.5, { x: 0, y: 0, sx: 1, sy: 1 }], [24.86, { x: -307, y: -344, sx: .4, sy: 3.6 }, "inOutExpo"], [24.86, { o: 1 }], [24.9, { o: 0 }, "lin"]]);
      anim(S, [[22.02, { o: 0 }], [22.03, { o: 1 }, "lin"], [22.03, { s: 1.04 }], [22.5, { s: 1 }, "expo"]]);
    },
  });

  /* ================= 9 · Cartela final ================= */
  cena({
    id: "cartela", nome: "Cartela final", inicio: 24.8, fim: 28.6, z: 47,
    descricao: "O cursor digita “Não fique de fora.”; o botão SEGUIR sobe, o traço verde o contorna e um clique o transforma em SEGUINDO. @matteu.ia embaixo.",
    montar(S) {
      const l1 = D(S, 600, 150, { wd: 85 });
      const t1 = h("span", "", l1), c1 = h("span", "cur", l1);
      typeText(t1, "Não fique", 24.86, 20, c1, 25.36);
      const l2 = D(S, 770, 150, { wd: 85, css: "color:var(--v-ac)" });
      const t2 = h("span", "", l2), c2 = h("span", "cur", l2);
      typeText(t2, "de fora.", 25.66, 20, c2);
      // botão
      const btn = h("div", "abs", S, null, "left:290px;top:1000px;width:500px;height:140px;border-radius:70px;background:var(--v-ac);color:#0A0B0F;display:flex;align-items:center;justify-content:center;gap:18px;font:800 54px var(--v-display);font-stretch:90%;letter-spacing:.01em;transform-origin:center");
      const lab = h("span", "", btn, "SEGUIR"), ic = h("span", "", btn, null, "display:grid");
      const PLUS = `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
      const OK = `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
      at(26.82, on => { lab.textContent = on ? "SEGUINDO" : "SEGUIR"; ic.innerHTML = on ? OK : PLUS; btn.style.background = on ? "var(--v-ink)" : "var(--v-ac)"; });
      anim(btn, [[25.9, { s: 0, o: 0 }], [25.95, { o: 1 }, "lin"], [26.4, { s: 1 }, "back"], ...ui.clique(btn, 26.8)]);
      // o fio condutor inteiro: traço verde contornando o botão
      const ol = svg(S, 560, 200, "position:absolute;left:260px;top:970px;overflow:visible");
      const op = path(ol, "M100 0 H460 A100 100 0 0 1 460 200 H100 A100 100 0 0 1 100 0", { fill: "none", stroke: "var(--v-ac)", "stroke-width": 5, "stroke-linecap": "round" });
      draw(op, 25.95, 26.95, "inOut");
      fx(t => ol.style.opacity = t >= 25.96 ? 1 : 0);
      const rip = h("div", "abs", S, null, "left:290px;top:1000px;width:500px;height:140px;border-radius:70px;border:5px solid var(--v-ac);transform-origin:center");
      anim(rip, [[26.82, { o: 0, s: 1 }], [26.84, { o: 1 }, "lin"], [27.5, { o: 0, sx: 1.2, sy: 1.7 }, "out"]]);
      // @ do canal
      const hd = h("div", "hl", S, null, "top:1232px;font:500 44px/1 var(--v-mono);color:var(--v-ink2);letter-spacing:.02em");
      typeText(h("span", "", hd), MDS.PROJETO.perfil || "", 26.1, 16);
      // cursor de mouse genérico
      const mo = h("div", "abs", S, '<svg viewBox="0 0 40 48" width="76" height="92"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="#F2F3F5" stroke="#0A0B0F" stroke-width="3" stroke-linejoin="round"/></svg>', "left:600px;top:1060px;transform-origin:10% 6%");
      anim(mo, [[26.2, { x: 260, y: 420, o: 0 }], [26.28, { o: 1 }, "lin"], [26.75, { x: 0, y: 0 }, "expo"], [26.8, { s: 1 }], [26.88, { s: .84 }, "out"], [27.05, { s: 1 }, "out"], [27.4, { x: 0, y: 0, o: 1 }], [27.85, { x: 240, y: 380, o: 0 }, "in"]]);
      anim(S, [[24.84, { s: 1, o: 0 }], [24.86, { o: 1 }, "lin"], [28.6, { s: 1.025 }, "lin"]]);
    },
  });

  /* ---------- efeitos sonoros (todos colados a eventos visuais) ---------- */
  [
    ["boom", 1.98], ["whoosh", 2.55, .8],
    ["pop", 3.40], ["tick", 3.55], ["tick", 3.70], ["pop", 4.24], ["pop", 4.96], ["pop", 5.98], ["swell", 6.9],
    ["whoosh", 7.3, .8], ["flip", 8.90], ...[0, 1, 2, 3, 4, 5].map(i => ["blip", 9.26 + i * .08, .7]), ["swell", 10.2], ...[0, 1, 2, 3].map(i => ["blip", 11.12 + i * .11, .4]), ["swoosh", 12.25],
    ["whoosh", 12.5, .8], ["pop", 13.38], ["swoosh", 13.70], ["riser", 14.27, .8],
    ["hit", 15.47], ["blip", 15.94, .5], ["blip", 16.41, .5], ["blip", 16.88, .5],
    ["swoosh", 17.75], ["whoosh", 18.94, .8], ["chime", 19.46], ["swoosh", 19.95],
    ["whoosh", 20.5, .7], ["swell", 21.36], ["swoosh", 22.03],
    ["blip", 22.03, .6], ["boom", 23.48], ["swoosh", 23.84, .7],
    ["pop", 25.95], ["click", 26.8], ["chime", 26.85],
  ].forEach(([k, t, g]) => MDS.sfx(k, t, g ?? 1));
  const teclas = (t0, n, cps) => { for (let i = 0; i < n; i++) MDS.sfx("key", t0 + i / cps, .9); };
  teclas(.05, 7, 12); teclas(2.92, 5, 11); teclas(8.2, 8, 11); teclas(22.44, 13, 14); teclas(24.86, 9, 20); teclas(25.66, 8, 20); teclas(26.1, 10, 16);
})();
