/* A inteligência artificial está mudando tudo · v2 · @matteu.ia
 * Storyboard aprovado: projetos/ia-muda-tudo-v2/storyboard.md · estilo: referencias/estilo-canal.md
 * Narração 1,15x (19,8 s). Música 128 BPM com corte 3,30 s: batidas em 0,446 + n·0,46875;
 * grave em 12,165 s («aprender»), subida em 18,73 s («você»).
 */
(() => {
  const { cena, anim, IN, OUT, h, fx, prog, svg, path, draw, typeText, floaty, at, palco, trans, ui } = MDS;
  const LOGO = "data:image/png;base64,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";
  const B = n => 0.446 + n * 0.46875;           // batida n da música
  const CINZA = "#5E5E66";

  /* ---------- fundos ---------- */
  function cantos(S, cor = "#C4C4C9") {
    const L = h("div", "layer", S);
    [[56, 56, "border-left:2px solid;border-top:2px solid"], [988, 56, "border-right:2px solid;border-top:2px solid"],
     [56, 1828, "border-left:2px solid;border-bottom:2px solid"], [988, 1828, "border-right:2px solid;border-bottom:2px solid"]]
      .forEach(([x, y, b]) => h("div", "abs", L, null, `left:${x}px;top:${y}px;width:36px;height:36px;${b};border-color:${cor}`));
    return L;
  }
  function claro(S) {
    h("div", "layer", S, null, "inset:-80px;background:radial-gradient(ellipse 95% 70% at 50% 42%, #F8F8F8, #E3E3E6)");
    cantos(S);
  }
  function escuro(S, o = {}) {
    const { x = 540, y = 920, int = .32, tam = 1150 } = o;
    h("div", "layer", S, null, "inset:-80px;background:#0B0B0D");
    const g = h("div", "abs", S, null, `left:${x - tam / 2}px;top:${y - tam / 2}px;width:${tam}px;height:${tam}px;border-radius:50%;background:radial-gradient(circle, rgba(255,106,26,${int}) 0%, rgba(255,61,46,${int * .45}) 32%, transparent 64%)`);
    fx(t => g.style.scale = (1 + Math.sin(t * 1.7) * .05).toFixed(3));
    return g;
  }
  /* ---------- tipografia ---------- */
  // palavra que entra por desfoque (estilo das referências)
  const pw = (p, txt, t, cls = "", d = .5) => {
    const s = h("span", cls ? "pw " + cls : "pw", p, txt);
    anim(s, [[t, { o: 0, b: 16, y: 26, s: .96 }], [t + d, { o: 1, b: 0, y: 0, s: 1 }, "expo"]]);
    return s;
  };
  // linha centralizada com palavras [texto, tempo, classe, css extra do span]
  const L = (p, top, css, itens) => {
    const el = h("div", "hl", p, null, `top:${top}px;${css}`);
    itens.forEach(([txt, t, cls, sc], k) => { if (k) el.append(" "); const s = pw(el, txt, t, cls); if (sc) s.style.cssText += sc; });
    return el;
  };
  const LEVE = (px, cor = "#F4F4F5", peso = 300) => `font:${peso} ${px}px/1.05 var(--v-sans);letter-spacing:-.035em;color:${cor}`;
  const SER = px => `font-size:${px}px;line-height:1`;
  const IMPACTO = (px, wd = 100, cor = "var(--v-ink)") => `font:900 ${px}px/1 var(--v-display);font-stretch:${wd}%;letter-spacing:-.035em;color:${cor}`;
  const tremor = (t, a = 12) => [[t, { x: 0, y: 0 }], [t + .04, { x: a, y: -a * .7 }, "lin"], [t + .08, { x: -a * .7, y: a * .5 }, "lin"], [t + .13, { x: a * .3, y: -a * .2 }, "lin"], [t + .22, { x: 0, y: 0 }, "out"]];
  const ICON = {
    texto: "M5 6h14M5 12h14M5 18h9", imagem: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6", codigo: "M9 7l-5 5 5 5M15 7l5 5-5 5",
    video: "M8 5l11 7-11 7z", audio: "M4 12v0M8 8v8M12 5v14M16 8v8M20 12v0", grafico: "M4 20V11M10 20V5M16 20v-7M2 20h20",
  };
  const icone = (k, cor = "var(--v-ac)", px = 48, w = 2.2) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[k]}"/></svg>`;
  const CHECK = ui.CHECK;

  /* ================= 1 · Abertura (escuro) ================= */
  cena({
    id: "abertura", nome: "Abertura", inicio: 0, fim: 1.76, z: 10,
    descricao: "Escuro com brasa laranja: “A inteligência artificial está mudando” entra palavra por palavra, “artificial” em neon.",
    montar(S) {
      const g = escuro(S, { y: 900, int: .34 });
      anim(g, [[0, { o: 0 }], [.6, { o: 1 }, "out"]]);
      L(S, 720, LEVE(78), [["A", 0], ["inteligência", .14]]);
      L(S, 816, "font:500 140px/1 var(--v-sans);letter-spacing:-.055em", [["artificial", .62, "neon"]]);
      L(S, 1000, LEVE(60, "#8E8E96"), [["está", 1.06], ["mudando", 1.36]]);
      const ln = h("div", "abs", S, null, "left:340px;top:1100px;width:400px;height:2px;background:linear-gradient(90deg,transparent,#FF6A1A,transparent);transform-origin:50% 50%");
      anim(ln, [[.62, { sx: 0 }], [1.2, { sx: 1 }, "expo"]]);
      anim(S, [[0, { s: 1 }], [1.76, { s: 1.07 }, "lin"]]);
    },
  });

  /* ================= 2 · TUDO (claro, impacto) ================= */
  cena({
    id: "tudo", nome: "TUDO", inicio: 1.72, fim: 2.45, z: 11,
    descricao: "Corte seco para o claro: TUDO gigante em preto com ponto laranja; sai em chicote para a esquerda.",
    montar(S) {
      claro(S);
      const t = h("div", "hl", S, "TUDO<span style='color:var(--v-ac)'>.</span>", `top:830px;${IMPACTO(250, 100)}`);
      anim(t, [[1.72, { s: 1.4, b: 10 }], [2.0, { s: 1, b: 0 }, "expo"], [2.14, { x: 0, b: 0 }], [2.44, { x: -1350, b: 30 }, "inExpo"]]);
      const bar = h("div", "abs", S, null, "left:150px;top:1135px;width:780px;height:12px;background:var(--v-ac);transform-origin:0 50%");
      anim(bar, [[1.82, { sx: 0 }], [2.1, { sx: 1 }, "expo"], [2.16, { x: 0 }], [2.44, { x: -1350 }, "inExpo"]]);
      const lb = h("div", "hl", S, "está mudando", `top:715px;${LEVE(54, CINZA)}`);
      anim(lb, [[1.72, { o: 0, y: 20 }], [1.95, { o: 1, y: 0 }, "expo"], [2.16, { x: 0, b: 0 }], [2.42, { x: -1350, b: 20 }, "inExpo"]]);
      anim(S, [[1.715, { o: 0 }], [1.72, { o: 1 }, "lin"], ...tremor(1.72, 14)]);
    },
  });

  /* ================= 3 · O jeito de (claro, card 3D que vira) ================= */
  cena({
    id: "jeito", nome: "O jeito de", inicio: 2.3, fim: 4.45, z: 12,
    descricao: "Um card 3D gira e vira outro a cada verbo: tarefas (trabalhar), quadro de desenho (criar), aula (aprender).",
    montar(S) {
      claro(S);
      L(S, 300, LEVE(58, CINZA), [["O", 2.42], ["jeito", 2.54], ["de", 2.66]]);
      const V = [["TRABALHAR", 2.82, 3.28], ["CRIAR", 3.30, 3.72], ["APRENDER", 3.74, 9]];
      V.forEach(([txt, a, b]) => {
        const el = h("div", "hl", S, txt, `top:390px;${IMPACTO(150, 85)}`);
        const k = [[a - .02, { o: 0, b: 18, y: 50 }], [a + .3, { o: 1, b: 0, y: 0 }, "expo"]];
        if (b < 9) k.push([b - .1, { o: 1, b: 0, y: 0 }], [b + .06, { o: 0, b: 16, y: -50 }, "in"]);
        anim(el, k);
      });
      const C = h("div", "abs", S, null, "left:150px;top:640px;width:780px;height:600px");
      anim(C, [[2.3, { rx: 14, ry: -18, r: -2 }], [4.2, { rx: 6, ry: 10, r: 1 }, "sine"]]);
      floaty(C, 10, 1.3);
      const face = titulo => { const f = h("div", "card", C, null, "left:0;top:0;width:780px;height:600px"); h("div", "wh", f, `<span class="dots"><i></i><i></i><i></i></span>${titulo}`); return f; };
      // tarefas
      const f1 = face("Tarefas · hoje");
      const corpo1 = h("div", "", f1, null, "padding-top:14px");
      ui.checklist(corpo1, [["Responder e-mails", 2.95], ["Revisar proposta", 3.05], ["Organizar a semana", 3.15]]);
      anim(f1, [[2.5, { o: 0, ry: -70, y: 90 }], [2.56, { o: 1 }, "lin"], [3.0, { ry: 0, y: 0 }, "expo"], [3.16, { ry: 0 }], [3.30, { ry: 90 }, "in"], [3.31, { o: 1 }], [3.32, { o: 0 }, "lin"]]);
      // criar
      const f2 = face("Novo projeto");
      const sv = svg(f2, 700, 450, "display:block;width:780px;height:501px");
      MDS.sel(sv, "circle", { cx: 520, cy: 150, r: 70, fill: "none", stroke: "#DCDCE0", "stroke-width": 4 });
      MDS.sel(sv, "rect", { x: 80, y: 260, width: 150, height: 110, rx: 14, fill: "none", stroke: "#DCDCE0", "stroke-width": 4 });
      const cv = path(sv, "M70 330 C 150 90, 260 80, 320 220 S 470 380, 600 120", { fill: "none", stroke: "var(--v-ac)", "stroke-width": 10, "stroke-linecap": "round" });
      draw(cv, 3.36, 3.72, "inOut");
      const pen = MDS.sel(sv, "circle", { r: 14, fill: "var(--v-ink)" }), LL = cv.getTotalLength();
      fx(t => { const p = cv.getPointAtLength(LL * prog(t, 3.36, 3.72, "inOut")); pen.setAttribute("cx", p.x); pen.setAttribute("cy", p.y); });
      anim(f2, [[3.30, { o: 0, ry: -90 }], [3.31, { o: 1 }, "lin"], [3.46, { ry: 0 }, "out"], [3.60, { ry: 0 }], [3.74, { ry: 90 }, "in"], [3.75, { o: 1 }], [3.76, { o: 0 }, "lin"]]);
      // aprender
      const f3 = face("Aula 3 de 12");
      f3.insertAdjacentHTML("beforeend", `<div style="padding:44px 44px 0"><div style="font:500 26px var(--v-mono);color:var(--v-ac)">módulo · ia na prática</div>
        <div style="font:600 64px/1.05 var(--v-sans);letter-spacing:-.04em;margin:14px 0 40px">Do zero ao<br>primeiro projeto</div>
        <div style="height:16px;border-radius:8px;background:#E6E6EA;overflow:hidden"><div class="bar" style="height:100%;width:0;background:var(--v-ac);border-radius:8px"></div></div>
        <div style="display:flex;justify-content:space-between;margin-top:18px;font:500 26px var(--v-sans);color:var(--v-ink2)"><span>progresso</span><span class="pct" style="font-family:var(--v-mono);color:var(--v-ink)">0%</span></div></div>`);
      const bar = f3.querySelector(".bar"), pct = f3.querySelector(".pct");
      fx(t => { const v = prog(t, 3.9, 4.25, "inOut"); bar.style.width = (v * 100).toFixed(1) + "%"; pct.textContent = Math.round(v * 100) + "%"; });
      anim(f3, [[3.74, { o: 0, ry: -90 }], [3.75, { o: 1 }, "lin"], [3.9, { ry: 0 }, "out"], [4.2, { rx: 0, y: 0, s: 1, o: 1 }], [4.45, { rx: 75, y: 280, s: .8, o: 0 }, "in"]]);
      // indicador 01·02·03
      const ind = h("div", "abs", S, null, "left:440px;top:1320px;width:200px;display:flex;gap:14px;justify-content:center;align-items:center");
      [2.82, 3.30, 3.74].forEach((a, i) => { const d = h("i", "", ind, null, "display:block;height:14px;border-radius:7px;background:#C4C4C9"); fx(t => { const on = t >= a && (i === 2 || t < [3.30, 3.74][i]); d.style.width = on ? "46px" : "14px"; d.style.background = on ? "var(--v-ac)" : "#C4C4C9"; }); });
      anim(S, trans.chicoteEntra(2.3, { d: .4, dist: 1000 }));
    },
  });

  /* ================= 4 · Ganhar dinheiro (escuro, plano em perspectiva) ================= */
  cena({
    id: "dinheiro", nome: "Ganhar dinheiro", inicio: 4.3, fim: 5.76, z: 13,
    descricao: "O card cai e vira um plano deitado com uma linha laranja subindo em degraus (sem números); “dinheiro.” em itálico neon.",
    margem: .5,
    montar(S) {
      escuro(S, { y: 1180, int: .4 });
      const P = h("div", "abs", S, null, "left:90px;top:860px;width:900px;height:760px;transform-origin:50% 100%;border-radius:14px;background-image:linear-gradient(#303037 2px,transparent 2px),linear-gradient(90deg,#303037 2px,transparent 2px);background-size:90px 76px");
      anim(P, [[4.3, { rx: 72, y: 240, o: 0 }], [4.75, { rx: 56, y: 0, o: 1 }, "expo"], [5.6, { rx: 50 }, "lin"]]);
      const sv = svg(P, 900, 760, "position:absolute;left:0;top:0;overflow:visible;filter:drop-shadow(0 0 14px rgba(255,106,26,.9))");
      const ln = path(sv, "M40 720 H180 V630 H320 V560 H460 V450 H600 V300 H740 V110 H860", { fill: "none", stroke: "#FF7A2E", "stroke-width": 12, "stroke-linejoin": "round", "stroke-linecap": "round" });
      draw(ln, 4.42, 5.12, "inOut");
      L(S, 410, LEVE(68), [["até", 4.34], ["ganhar", 4.60]]);
      const d = L(S, 500, SER(210), [["dinheiro.", 4.90, "ser neon"]]);
      anim(d, [[4.90, { s: 1.15 }], [5.3, { s: 1 }, "expo"]]);
      anim(S, [[4.3, { o: 0 }], [4.36, { o: 1 }, "lin"], [4.3, { s: 1, b: 0 }], [5.48, { s: 1.06, b: 0 }, "lin"], [5.74, { s: 2.6, b: 10 }, "in"]]);
    },
  });

  /* ================= 5 · Ferramentas (claro, celular 3D) ================= */
  cena({
    id: "ferramentas", nome: "Ferramentas", inicio: 5.66, fim: 7.16, z: 14,
    descricao: "Celular genérico sobe girando em 3D com um chat de IA; “Claude” acende em laranja, só como palavra. Em “abrindo” a tela acende e a câmera entra nela.",
    margem: .5,
    montar(S) {
      claro(S);
      L(S, 285, LEVE(58, CINZA), [["ferramentas", 5.74], ["como", 6.20]]);
      L(S, 360, "font:600 160px/1 var(--v-sans);letter-spacing:-.055em", [["Claude", 6.32, "neonC"]]);
      const PH = h("div", "abs", S, null, "left:300px;top:620px;width:480px;height:940px;border-radius:84px;background:#111113;padding:14px;box-shadow:0 70px 130px -40px rgba(0,0,0,.5), inset 0 0 0 3px #2C2C30");
      const sc = h("div", "", PH, null, "position:relative;width:100%;height:100%;border-radius:70px;background:#FBFBFB;overflow:hidden");
      sc.innerHTML = `<div style="width:140px;height:38px;border-radius:20px;background:#111113;margin:18px auto 0"></div>
        <div style="display:flex;align-items:center;gap:12px;padding:30px 32px 0;font:500 24px var(--v-mono);color:var(--v-ink2)"><i style="width:14px;height:14px;border-radius:50%;background:var(--v-ac)"></i>assistente de IA</div>
        <div class="b1" style="margin:40px 32px 0;padding:22px 26px;border-radius:28px 28px 28px 8px;background:#EFEFF1;font:500 28px/1.3 var(--v-sans);letter-spacing:-.01em">Oi! Como posso ajudar hoje?</div>
        <div style="margin:22px 32px 0;display:flex;flex-direction:column;gap:14px"><i style="height:16px;width:300px;border-radius:8px;background:#ECECEF"></i><i style="height:16px;width:220px;border-radius:8px;background:#ECECEF"></i></div>
        <div style="position:absolute;left:20px;right:20px;bottom:28px;height:92px;border-radius:46px;background:#F0F0F2;display:flex;align-items:center;padding:0 12px 0 30px;font:500 28px var(--v-sans);color:var(--v-ink)">
          <span class="inp"></span><span class="car" style="display:inline-block;width:3px;height:34px;background:var(--v-ac);margin-left:3px"></span>
          <span style="margin-left:auto;width:68px;height:68px;border-radius:50%;background:var(--v-ac);display:grid;place-items:center"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg></span></div>`;
      typeText(sc.querySelector(".inp"), "me ajuda a criar…", 6.4, 22, sc.querySelector(".car"));
      const lit = h("div", "abs", sc, null, "left:0;top:0;right:0;bottom:0;background:radial-gradient(circle at 50% 60%, #FFB38A, #FF6A1A 55%, #FF3D2E)");
      anim(lit, [[6.9, { o: 0 }], [7.08, { o: 1 }, "out"]]);
      anim(PH, [[5.68, { y: 760, ry: 42, rx: 14, r: -8, o: 0 }], [5.74, { o: 1 }, "lin"], [6.32, { y: 0, ry: 12, rx: 5, r: -2 }, "expo"], [6.95, { ry: 3, rx: 1, r: 0 }, "sine"]]);
      anim(S, [[5.66, { o: 0 }], [5.76, { o: 1 }, "lin"], [6.92, { s: 1, y: 0 }], [7.16, { s: 3.3, y: -330 }, "in"]]);
    },
  });

  /* ================= 6 · Possibilidades (escuro, luz de borda → órbitas) ================= */
  cena({
    id: "possibilidades", nome: "Possibilidades", inicio: 7.05, fim: 9.86, z: 15,
    descricao: "Card escuro com luz de borda laranja se abre em órbitas de ícones; a câmera recua para “muita gente” e os ícones viram “?” em “nem conhece”.",
    montar(S) {
      const CX = 540, CY = 930;
      escuro(S, { y: CY, int: .3 });
      // laranja da tela do celular dissolvendo
      const lv = h("div", "layer", S, null, "background:radial-gradient(circle at 50% 50%, #FFB38A, #FF6A1A 55%, #FF3D2E)");
      anim(lv, [[7.06, { o: 1 }], [7.4, { o: 0 }, "out"]]);
      // card com luz de borda
      const RC = h("div", "abs", S, null, `left:${CX - 320}px;top:${CY - 210}px;width:640px;height:420px;border-radius:38px;padding:3px;box-shadow:0 0 90px -20px rgba(255,106,26,.55)`);
      const inner = h("div", "", RC, null, "width:100%;height:100%;border-radius:35px;background:#111114;padding:40px 44px");
      inner.innerHTML = `<div style="font:500 26px var(--v-mono);color:#8E8E96;display:flex;gap:12px;align-items:center"><i style="width:14px;height:14px;border-radius:50%;background:var(--v-ac)"></i>ferramentas de IA</div>
        <i style="display:block;margin-top:46px;height:20px;width:420px;border-radius:10px;background:#1F1F24"></i><i style="display:block;margin-top:18px;height:20px;width:320px;border-radius:10px;background:#1F1F24"></i><i style="display:block;margin-top:18px;height:20px;width:370px;border-radius:10px;background:#1F1F24"></i>`;
      fx(t => { const a = ((t - 7) * 300) % 360; RC.style.background = `conic-gradient(from ${a.toFixed(1)}deg, #222227 0deg, #222227 230deg, #FF6A1A 310deg, #FFD7BA 335deg, #222227 360deg)`; });
      anim(RC, [[7.08, { o: 0, s: .88, b: 12 }], [7.3, { o: 1, s: 1, b: 0 }, "expo"], [7.32, { s: 1 }], [7.62, { s: 1.7, o: 0, b: 24 }, "in"]]);
      // órbitas
      const orb = svg(S, 1080, 1920, "position:absolute;left:0;top:0");
      [170, 290, 410].forEach((r, i) => { const c = path(orb, `M${CX} ${CY - r} a${r} ${r} 0 1 1 -0.1 0`, { fill: "none", stroke: "#2B2B31", "stroke-width": 2 }); draw(c, 7.32 + i * .08, 7.85 + i * .08, "out"); });
      const core = h("div", "abs", S, null, `left:${CX - 60}px;top:${CY - 60}px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 40% 35%, #FFC29A, #FF6A1A 60%, #E8430F);box-shadow:0 0 70px rgba(255,106,26,.75);display:grid;place-items:center`);
      h("i", "", core, null, "width:12px;height:44px;border-radius:3px;background:#0B0B0D");
      anim(core, [[7.32, { s: 0, o: 0 }], [7.36, { o: 1 }, "lin"], [7.7, { s: 1 }, "back"]]);
      const K = Object.keys(ICON);
      K.forEach((k, i) => {
        const r = [170, 290, 410][i % 3], a0 = -90 + i * 60, t0 = 7.30 + i * .08;
        const ic = h("div", "abs", S, null, "left:0;top:0;width:108px;height:108px;margin:-54px 0 0 -54px;border-radius:50%;background:#16161A;box-shadow:0 0 0 2px #2E2E34;display:grid;place-items:center");
        const gl = h("div", "abs", ic, icone(k), "left:30px;top:30px;width:48px;height:48px");
        const q = h("div", "abs", ic, "?", "left:0;top:0;width:108px;height:108px;display:grid;place-items:center;font:500 46px var(--v-sans);color:#77777F");
        fx(t => { const a = (a0 + Math.max(0, t - 7.3) * 14) * Math.PI / 180; ic.style.left = (CX + Math.cos(a) * r).toFixed(1) + "px"; ic.style.top = (CY + Math.sin(a) * r).toFixed(1) + "px";
          const p = prog(t, 8.92 + i * .04, 9.2 + i * .04, "out"); gl.style.opacity = (1 - p).toFixed(2); q.style.opacity = p.toFixed(2); });
        anim(ic, [[t0, { o: 0, s: .2 }], [t0 + .45, { o: 1, s: 1 }, "back"], [8.92 + i * .04, { b: 0, o: 1 }], [9.25 + i * .04, { b: 3, o: .55 }, "out"]]);
      });
      // muita gente: campo de pontos
      for (let i = 0; i < 170; i++) {
        const a = i * 137.508 * Math.PI / 180, r = 520 + (i * 53 % 260), x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r * 1.25;
        const d = h("i", "abs", S, null, `left:${x}px;top:${y}px;width:9px;height:9px;border-radius:50%;background:#3B3B42`);
        const t0 = 8.12 + (i % 17) * .025;
        anim(d, [[t0, { o: 0, s: 0 }], [t0 + .3, { o: 1, s: 1 }, "back"]]);
      }
      anim(S, [[7.05, { o: 0 }], [7.12, { o: 1 }, "lin"], [7.05, { s: 1.05 }], [8.1, { s: 1 }, "sine"], [8.8, { s: .7 }, "expo"], [9.86, { s: .66 }, "lin"]]);
      // textos (fora da câmera, para não encolher com o recuo)
      const T = h("div", "layer", S.parentNode);
      const t1 = L(T, 285, LEVE(56, "#8E8E96"), [["abrindo", 7.0]]);
      const t2 = L(T, 360, "font:500 100px/1 var(--v-sans);letter-spacing:-.05em;color:#F4F4F5", [["possibilidades", 7.28]]);
      [t1, t2].forEach((e, i) => anim(e, OUT(7.92 + i * .03, { dy: -40, d: .3 })));
      const t3 = L(T, 285, LEVE(64), [["que", 7.94], ["muita", 8.12], ["gente", 8.40]]);
      const t4 = L(T, 370, LEVE(64), [["ainda", 8.72], ["nem", 8.92], ["conhece.", 9.22, "ser neon", "font-size:104px"]]);
      [t3, t4].forEach((e, i) => anim(e, OUT(9.62 + i * .03, { dy: -40, d: .28 })));
    },
  });

  /* ================= 7 · Aqui (laranja tela cheia) ================= */
  cena({
    id: "aqui", nome: "Aqui", inicio: 9.68, fim: 10.68, z: 17,
    descricao: "Íris laranja abre a tela cheia em gradiente: “Aqui” gigante em branco; o laranja encolhe até a barra de busca.",
    margem: .4,
    montar(S) {
      h("div", "layer", S, null, "background:linear-gradient(160deg,#FFA25A 0%,#FF6A1A 45%,#FF3D2E 100%)");
      for (let k = 0; k < 3; k++) {
        const rg = h("div", "abs", S, null, "left:340px;top:560px;width:400px;height:400px;border-radius:50%;border:3px solid rgba(255,255,255,.35)");
        fx(t => { const p = ((t - 9.7) * .9 + k / 3) % 1; rg.style.scale = (1 + p * 2.6).toFixed(3); rg.style.opacity = (t > 9.7 ? (1 - p) * .8 : 0).toFixed(2); });
      }
      const a = h("div", "hl", S, "Aqui", `top:610px;${IMPACTO(300, 100, "#FFFFFF")}`);
      anim(a, [[10.0, { o: 0, s: 1.45, b: 12 }], [10.04, { o: 1 }, "lin"], [10.3, { s: 1, b: 0 }, "expo"]]);
      L(S, 950, "font:400 72px/1 var(--v-sans);letter-spacing:-.035em;color:#FFFFFF", [["você", 10.26], ["vai", 10.54]]);
      fx(t => { const r = t < 10.4 ? prog(t, 9.7, 10.05, "inOutExpo") * 2300 : (1 - prog(t, 10.42, 10.66, "inExpo")) * 2300;
        S.style.clipPath = r >= 2299 ? "none" : `circle(${r.toFixed(1)}px at 540px ${t < 10.4 ? 930 : 702}px)`; });
      anim(S, [[10.0, { s: 1 }], [10.42, { s: 1.04 }, "lin"]]);
    },
  });

  /* ================= 8 · Descobrir (claro, busca com brilho) ================= */
  cena({
    id: "descobrir", nome: "Descobrir", inicio: 10.35, fim: 12.2, z: 16,
    descricao: "Barra de busca em pílula com brilho laranja digita “novas tecnologias”; quatro cards de resultado caem em cascata.",
    margem: .4,
    montar(S) {
      claro(S);
      L(S, 470, LEVE(62, CINZA), [["descobrir", 10.64]]);
      const gl = h("div", "abs", S, null, "left:190px;top:690px;width:700px;height:90px;border-radius:50%;background:linear-gradient(90deg,#FFB38A,#FF6A1A,#FF3D2E);filter:blur(34px);opacity:.75");
      anim(gl, [[10.45, { o: 0, sx: .4 }], [10.8, { o: .8, sx: 1 }, "expo"]]);
      const bar = h("div", "abs", S, null, "left:130px;top:640px;width:820px;height:124px;border-radius:62px;background:#FFFFFF;box-shadow:0 0 0 1px rgba(0,0,0,.05), 0 24px 50px -24px rgba(0,0,0,.3);display:flex;align-items:center;gap:24px;padding:0 44px;font:500 46px var(--v-sans);letter-spacing:-.03em;color:var(--v-ink)");
      bar.innerHTML = `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--v-ac)" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg><span class="q"></span><span class="c" style="display:inline-block;width:4px;height:48px;background:var(--v-ac);margin-left:-18px"></span>`;
      typeText(bar.querySelector(".q"), "novas tecnologias", 10.9, 18, bar.querySelector(".c"));
      anim(bar, [[10.42, { s: .5, o: 0 }], [10.46, { o: 1 }, "lin"], [10.75, { s: 1 }, "back"]]);
      [["Agentes de IA", "codigo"], ["Automação", "grafico"], ["Vídeo com IA", "video"], ["No-code", "texto"]].forEach(([n, ic], i) => {
        const c = h("div", "abs", S, `<span style="width:76px;height:76px;border-radius:20px;background:#FFF0E6;display:grid;place-items:center;flex:none">${icone(ic, "var(--v-ac)", 40, 2.4)}</span><span>${n}</span>${i === 0 ? '<span style="margin-left:auto;font:500 22px var(--v-mono);color:var(--v-ac)">novo</span>' : ""}`,
          `left:130px;top:${830 + i * 148}px;width:820px;height:124px;border-radius:30px;background:#FBFBFB;box-shadow:var(--v-shadow);display:flex;align-items:center;gap:26px;padding:0 36px 0 24px;font:500 40px var(--v-sans);letter-spacing:-.025em;color:var(--v-ink)`);
        const t0 = 11.34 + i * .09, r = i % 2 ? 1.6 : -1.6;
        anim(c, [[t0, { o: 0, y: 90, r: r * 3, b: 12 }], [t0 + .5, { o: 1, y: 0, r, b: 0 }, "expo"]]);
      });
      anim(S, [[10.35, { s: 1 }], [12.2, { s: 1.04 }, "lin"]]);
    },
  });

  /* ================= 9 · O drop (escuro, tipografia no beat) ================= */
  cena({
    id: "drop", nome: "Aprender a usar", inicio: 12.16, fim: 13.98, z: 18,
    descricao: "O grave da música entra: APRENDER gigante bate com flash; “a usar”, “INTELIGÊNCIA” e “ARTIFICIAL” entram uma por batida, com soco de zoom.",
    margem: .3,
    montar(S) {
      escuro(S, { y: 960, int: .5, tam: 1300 });
      const G = h("div", "layer", S);
      const BT = [B(25), B(26), B(27), B(28)];
      const LIN = [["APRENDER", 610, IMPACTO(188, 92, "#F4F4F5"), ""], ["a usar", 850, LEVE(86, "#A0A0A8"), ""], ["INTELIGÊNCIA", 960, IMPACTO(140, 72, "#F4F4F5"), ""], ["ARTIFICIAL", 1115, IMPACTO(140, 74, "#FF7A2E"), "text-shadow:0 0 30px rgba(255,106,26,.7)"]];
      LIN.forEach(([txt, top, css, extra], i) => {
        const el = h("div", "hl", G, txt, `top:${top}px;${css};${extra}`);
        const b = BT[i];
        anim(el, [[b - .01, { o: 0, s: i ? 1.25 : 1.45, b: 10 }], [b + .02, { o: 1 }, "lin"], [b + .3, { s: 1, b: 0 }, "expo"],
          [13.78 + i * .02, { y: 0, sy: 1, o: 1 }], [13.98 + i * .02, { y: -320, sy: 1.8, o: 0, b: 14 }, "in"]]);
      });
      fx(t => { let p = 0; for (const b of BT) if (t >= b) p = Math.exp(-(t - b) * 9); G.style.scale = (1 + p * .035).toFixed(4); });
      trans.flash(12.165, { cor: "#FF6A1A", pico: .75, d: .3 });
      anim(S, [[12.155, { o: 0 }], [12.165, { o: 1 }, "lin"], ...tremor(12.165, 14)]);
    },
  });

  /* ================= 10 · Ideias → projetos (claro, documento 3D que vira app) ================= */
  cena({
    id: "projetos", nome: "Ideias viram projetos", inicio: 13.85, fim: 16.3, z: 19,
    descricao: "Um rascunho flutua inclinado; os rabiscos se desenham em “ideias”, a folha gira 180° em “projetos” e o verso é um app pronto; selo “no ar” em “reais”.",
    montar(S) {
      claro(S);
      const l1 = L(S, 300, LEVE(62, CINZA), [["transformar", 14.26], ["ideias", 14.74, "ser", "font-size:88px;color:var(--v-ac)"]]);
      anim(l1, OUT(15.16, { dy: -40, d: .25 }));
      L(S, 300, LEVE(62, CINZA), [["em", 15.24], ["projetos", 15.36], ["reais.", 15.82, "ser", "font-size:88px;color:var(--v-ac)"]]);
      const D = h("div", "abs", S, null, "left:220px;top:470px;width:640px;height:840px");
      floaty(D, 10, 1.2);
      const F = h("div", "abs", D, null, "left:0;top:0;width:640px;height:840px;border-radius:26px;background:#FBFBFB;box-shadow:var(--v-shadow)");
      const fs = svg(F, 640, 840, "position:absolute;left:0;top:0");
      ["M60 70 H340", "M60 150 H580 V470 H60 Z", "M60 150 L580 470 M580 150 L60 470", "M60 540 H440", "M60 600 H560", "M60 650 H480", "M60 730 H580 V790 H60 Z"].forEach((d, i) => {
        const p = path(fs, d, { fill: "none", stroke: "#A8A8B0", "stroke-width": 4, "stroke-linecap": "butt" });
        draw(p, 14.3 + i * .08, 14.75 + i * .08, "inOut");
      });
      const qm = h("div", "abs", F, "?", "left:280px;top:245px;font:400 130px/1 var(--v-serif, 'Instrument Serif');font-style:italic;color:var(--v-ac)");
      anim(qm, [[14.9, { o: 0, s: .5 }], [15.2, { o: 1, s: 1 }, "back"]]);
      anim(F, [[13.9, { o: 0, y: 340, r: -12, rx: 22, ry: -26 }], [13.96, { o: 1 }, "lin"], [14.45, { y: 0, r: -5, rx: 10, ry: -14 }, "expo"], [15.36, { r: -3, rx: 8, ry: -10 }, "sine"], [15.56, { ry: 90 }, "in"], [15.57, { o: 1 }], [15.58, { o: 0 }, "lin"]]);
      const Bk = h("div", "abs", D, null, "left:0;top:0;width:640px;height:840px;border-radius:26px;background:#FBFBFB;box-shadow:var(--v-shadow);overflow:hidden");
      Bk.innerHTML = `<div style="display:flex;align-items:center;gap:14px;padding:44px 44px 0;font:600 30px var(--v-sans);letter-spacing:-.02em"><i style="width:18px;height:18px;border-radius:50%;background:var(--v-ac)"></i>Meu projeto<span style="margin-left:auto;font:500 22px var(--v-mono);color:var(--v-mute)">v1.0</span></div>
        <div style="margin:34px 44px 0;height:320px;border-radius:24px;background:linear-gradient(140deg,#FFB38A,#FF6A1A 55%,#FF3D2E);position:relative;overflow:hidden">
          <i style="position:absolute;left:60px;top:70px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.9)"></i>
          <i style="position:absolute;left:290px;top:110px;width:200px;height:22px;border-radius:11px;background:rgba(255,255,255,.65)"></i>
          <i style="position:absolute;left:290px;top:154px;width:140px;height:22px;border-radius:11px;background:rgba(255,255,255,.65)"></i></div>
        <div style="padding:44px 44px 0;font:900 64px/1 var(--v-display);font-stretch:82%;letter-spacing:-.02em">PRONTO PARA USAR</div>
        <i style="display:block;margin:28px 44px 0;height:18px;width:460px;border-radius:9px;background:#E6E6EA"></i>
        <i style="display:block;margin:16px 44px 0;height:18px;width:360px;border-radius:9px;background:#E6E6EA"></i>
        <div style="position:absolute;left:44px;right:44px;bottom:44px;height:96px;border-radius:48px;background:var(--v-ink);color:#fff;display:grid;place-items:center;font:600 34px var(--v-sans)">Abrir</div>`;
      anim(Bk, [[15.56, { o: 0, ry: -90, r: -3, rx: 8 }], [15.57, { o: 1 }, "lin"], [15.82, { ry: 0, r: 0, rx: 4 }, "out"],
        [15.82, { s: 1 }], [15.92, { s: 1.05 }, "out"], [16.06, { s: 1, y: 0 }, "out"], [16.28, { s: .02, y: 200 }, "inExpo"], [16.27, { o: 1 }], [16.3, { o: 0 }, "lin"]]);
      const selo = h("div", "abs", S, `<i style="width:14px;height:14px;border-radius:50%;background:#fff"></i>no ar`, "left:690px;top:430px;height:66px;padding:0 28px;border-radius:33px;background:var(--v-ac);color:#fff;display:flex;align-items:center;gap:12px;font:600 30px var(--v-mono);box-shadow:0 20px 40px -14px rgba(255,106,26,.6)");
      anim(selo, [[15.82, { s: 0, o: 0, r: -14 }], [15.85, { o: 1 }, "lin"], [16.1, { s: 1, r: 0 }, "back"], ...OUT(16.12, { dy: 40, s: .4, d: .18 })]);
      anim(S, [[13.85, { y: 1920 }], [14.3, { y: 0 }, "expo"], [15.82, { s: 1 }], [16.0, { s: 1.04 }, "out"]]);
    },
  });

  /* ================= 11 · O futuro (escuro, horizonte de luz) ================= */
  cena({
    id: "futuro", nome: "O futuro", inicio: 16.15, fim: 17.64, z: 20,
    descricao: "Horizonte fino; um nascer de luz laranja sobe atrás dele. “O futuro já começou.” com “começou” em itálico neon. A luz estoura no claro.",
    margem: .4,
    montar(S) {
      h("div", "layer", S, null, "background:#0B0B0D");
      const clip = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:1101px;overflow:hidden");
      const sun = h("div", "abs", clip, null, "left:-160px;top:1100px;width:1400px;height:1400px;border-radius:50%;background:radial-gradient(circle, rgba(255,190,140,1) 0%, rgba(255,106,26,.75) 20%, rgba(255,61,46,.25) 42%, transparent 66%)");
      anim(sun, [[16.2, { y: 200, o: 0 }], [16.5, { o: 1 }, "lin"], [17.1, { y: -380 }, "expo"], [17.64, { y: -560 }, "lin"]]);
      const rf = h("div", "abs", S, null, "left:0;top:1101px;width:1080px;height:420px;background:radial-gradient(ellipse 60% 100% at 50% 0%, rgba(255,106,26,.22), transparent 70%)");
      anim(rf, [[16.6, { o: 0 }], [17.2, { o: 1 }, "out"]]);
      const hz = h("div", "abs", S, null, "left:0;top:1099px;width:1080px;height:3px;background:linear-gradient(90deg,transparent,#FFC29A 50%,transparent)");
      anim(hz, [[16.46, { sx: 0 }], [16.95, { sx: 1 }, "expo"]]);
      const dot = h("div", "abs", S, null, "left:530px;top:1090px;width:20px;height:20px;border-radius:50%;background:#FF7A2E;box-shadow:0 0 30px #FF6A1A");
      anim(dot, [[16.15, { o: 0, s: .3 }], [16.28, { o: 1, s: 1 }, "out"], [16.6, { o: 1 }], [16.9, { o: 0, s: 3 }, "out"]]);
      L(S, 620, LEVE(96), [["O", 16.46], ["futuro", 16.50]]);
      L(S, 745, LEVE(96), [["já", 16.82], ["começou.", 17.10, "ser neon", "font-size:140px"]]);
      const burst = h("div", "layer", S, null, "background:#EDEDED");
      anim(burst, [[17.46, { o: 0 }], [17.62, { o: 1 }, "in"]]);
      anim(S, [[16.2, { o: 0 }], [16.26, { o: 1 }, "lin"], [16.15, { s: 1 }], [17.6, { s: 1.06 }, "lin"]]);
    },
  });

  /* ================= 12 · A pergunta (claro, VOCÊ gigante) ================= */
  cena({
    id: "pergunta", nome: "A pergunta", inicio: 17.6, fim: 19.92, z: 21,
    descricao: "Grade de pontos (as pessoas) e um único ponto laranja de fora; VOCÊ gigante na subida da música; a grade se afasta em “ficar” e “DE FORA?” entra em laranja.",
    margem: .4,
    montar(S) {
      claro(S);
      L(S, 290, LEVE(58, CINZA), [["A", 17.74], ["pergunta", 17.78], ["é:", 18.04]]);
      const v = h("div", "hl", S, "VOCÊ", `top:400px;${IMPACTO(270, 100)}`);
      anim(v, [[18.64, { o: 0, s: 1.45, b: 10 }], [18.67, { o: 1 }, "lin"], [18.95, { s: 1, b: 0 }, "expo"]]);
      L(S, 700, LEVE(64, CINZA), [["vai", 18.82], ["ficar", 19.02]]);
      const G = h("div", "abs", S, null, "left:190px;top:820px;width:560px;height:360px");
      for (let r = 0; r < 7; r++) for (let c = 0; c < 11; c++) {
        const d = h("i", "abs", G, null, `left:${c * 54}px;top:${r * 54}px;width:20px;height:20px;border-radius:50%;background:#16161A`);
        const t0 = 17.7 + (Math.abs(c - 5) + Math.abs(r - 3)) * .03;
        anim(d, [[t0, { o: 0, s: 0 }], [t0 + .3, { o: 1, s: 1 }, "back"]]);
      }
      anim(G, [[19.02, { x: 0 }], [19.4, { x: -80 }, "expo"]]);
      const me = h("div", "abs", S, null, "left:865px;top:990px;width:30px;height:30px;border-radius:50%;background:var(--v-ac);box-shadow:0 0 24px rgba(255,106,26,.6)");
      anim(me, [[17.95, { s: 0 }], [18.3, { s: 1 }, "back"], [18.64, { s: 1 }], [18.76, { s: 1.6 }, "out"], [18.98, { s: 1 }, "back"]]);
      const big = h("div", "abs", S, null, "left:-320px;top:-195px;width:2400px;height:2400px;border-radius:50%;background:var(--v-ac);transform-origin:1200px 1200px");
      anim(big, [[19.6, { s: .0125, o: 0 }], [19.62, { o: 1 }, "lin"], [19.86, { s: 1 }, "in"]]);
      const rg = h("div", "abs", S, null, "left:865px;top:990px;width:30px;height:30px;border-radius:50%;border:3px solid var(--v-ac)");
      fx(t => { const p = ((t - 18.3) * 1.1) % 1; rg.style.opacity = t > 18.3 && t < 19.6 ? ((1 - p) * .8).toFixed(2) : 0; rg.style.scale = (1 + p * 2.5).toFixed(3); });
      const df = h("div", "hl", S, null, `top:1255px;${IMPACTO(150, 88, "var(--v-ac)")}`);
      pw(df, "DE", 19.22); df.append(" "); pw(df, "FORA?", 19.32);
      anim(S, [[17.6, { o: 0 }], [17.61, { o: 1 }, "lin"], ...tremor(18.64, 10)]);
    },
  });

  /* ================= 13 · Cartela (escuro, logo) ================= */
  cena({
    id: "cartela", nome: "Cartela final", inicio: 19.72, fim: 23.2, z: 22,
    descricao: "Íris escura sai do ponto laranja; as duas metades da logo se encontram com brilho, a logo sobe, “Não fique de fora.”, botão Seguir com luz de borda, clique e @matteu.ia.",
    montar(S) {
      escuro(S, { y: 880, int: .3 });
      trans.circulo(S, 19.72, { x: 880, y: 1005, d: .45 });
      // logo em duas metades (máscara: a cor vem do fundo do elemento)
      const LW = 420, LH = 236, LX = 540 - LW / 2, LY = 900 - LH / 2;
      const wrap = h("div", "abs", S, null, `left:${LX}px;top:${LY}px;width:${LW}px;height:${LH}px;filter:drop-shadow(0 0 26px rgba(255,106,26,.85))`);
      const metade = lado => h("div", "abs", wrap, null, `left:0;top:0;width:${LW}px;height:${LH}px;-webkit-mask:url(${LOGO}) center/contain no-repeat;mask:url(${LOGO}) center/contain no-repeat;clip-path:inset(0 ${lado < 0 ? 50 : 0}% 0 ${lado < 0 ? 0 : 50}%)`);
      const ml = metade(-1), mr = metade(1);
      anim(ml, [[19.85, { x: -160, o: 0 }], [20.25, { x: 0, o: 1 }, "expo"]]);
      anim(mr, [[19.85, { x: 160, o: 0 }], [20.25, { x: 0, o: 1 }, "expo"]]);
      fx(t => { const p = prog(t, 20.15, 20.6); const c = `rgb(${Math.round(255 - 11 * p)},${Math.round(122 + 122 * p)},${Math.round(46 + 199 * p)})`; ml.style.background = mr.style.background = c;
        wrap.style.filter = `drop-shadow(0 0 ${(26 - 14 * p).toFixed(1)}px rgba(255,106,26,${(.85 - .45 * p).toFixed(2)}))`; });
      anim(wrap, [[20.3, { y: 0, s: 1 }], [20.7, { y: -380, s: .55 }, "expo"]]);
      // frase
      L(S, 700, LEVE(92, "#F4F4F5", 400), [["Não", 20.45], ["fique", 20.55], ["de", 20.65], ["fora.", 20.75, "ser neon", "font-size:126px"]]);
      // botão com luz de borda
      const RB = h("div", "abs", S, null, "left:300px;top:960px;width:480px;height:130px;border-radius:65px;padding:3px;box-shadow:0 0 60px -14px rgba(255,106,26,.6);transform-origin:center");
      fx(t => { const a = ((t - 20) * 280) % 360; RB.style.background = `conic-gradient(from ${a.toFixed(1)}deg, #2A2A30 0deg, #2A2A30 220deg, #FF6A1A 300deg, #FFD7BA 330deg, #2A2A30 360deg)`; });
      const inB = h("div", "", RB, null, "width:100%;height:100%;border-radius:62px;background:#141417;display:flex;align-items:center;justify-content:center;gap:16px;font:600 48px var(--v-sans);letter-spacing:-.02em;color:#F4F4F5");
      const lab = h("span", "", inB, "Seguir"), ic = h("span", "", inB, null, "display:grid");
      const PLUS = `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
      at(21.47, on => { lab.textContent = on ? "Seguindo" : "Seguir"; ic.innerHTML = on ? CHECK.replace('stroke="#fff"', 'stroke="currentColor"').replace('<svg ', '<svg width="40" height="40" ') : PLUS; inB.style.background = on ? "#FF6A1A" : "#141417"; });
      anim(RB, [[20.85, { s: 0, o: 0 }], [20.9, { o: 1 }, "lin"], [21.25, { s: 1 }, "back"], ...ui.clique(RB, 21.45)]);
      const rip = h("div", "abs", S, null, "left:300px;top:960px;width:480px;height:130px;border-radius:65px;border:4px solid #FF6A1A;transform-origin:center");
      anim(rip, [[21.47, { o: 0, s: 1 }], [21.49, { o: 1 }, "lin"], [22.1, { o: 0, sx: 1.2, sy: 1.7 }, "out"]]);
      const hd = h("div", "hl", S, null, "top:1150px;font:500 42px/1 var(--v-mono);color:#9A9AA2;letter-spacing:.02em");
      typeText(h("span", "", hd), MDS.PROJETO.perfil || "", 21.0, 14);
      const mo = h("div", "abs", S, '<svg viewBox="0 0 40 48" width="72" height="88"><path d="M4 3l30 22-13 2.5 7 15-6 2.8-7-15L6 39z" fill="#F4F4F5" stroke="#0B0B0D" stroke-width="3" stroke-linejoin="round"/></svg>', "left:600px;top:1010px;transform-origin:10% 6%");
      anim(mo, [[20.95, { x: 220, y: 420, o: 0 }], [21.02, { o: 1 }, "lin"], [21.4, { x: 0, y: 0 }, "expo"], [21.45, { s: 1 }], [21.52, { s: .84 }, "out"], [21.7, { s: 1 }, "out"], [21.95, { x: 0, y: 0, o: 1 }], [22.35, { x: 240, y: 380, o: 0 }, "in"]]);
      anim(S, [[19.72, { s: 1 }], [23.2, { s: 1.03 }, "lin"]]);
    },
  });

  /* ---------- efeitos sonoros (colados a eventos visuais; poucos, a música já marca o ritmo) ---------- */
  [
    ["swell", .05, .6], ["boom", 1.72], ["whoosh", 2.2, .8],
    ["pop", 2.82, .7], ["tick", 2.95, .6], ["tick", 3.05, .6], ["flip", 3.30, .7], ["flip", 3.74, .7],
    ["whoosh", 4.25, .7], ["swoosh", 4.90, .6], ["whoosh", 5.62, .7], ["swoosh", 5.72, .5],
    ["whoosh", 6.98, .8], ...[0, 1, 2, 3, 4, 5].map(i => ["blip", 7.30 + i * .08, .5]), ["swell", 8.12, .7], ["blip", 8.92, .35],
    ["whoosh", 9.72, .8], ["pop", 10.02, .8], ["swoosh", 10.45, .6], ...[0, 1, 2, 3].map(i => ["blip", 11.34 + i * .09, .45]),
    ["hit", 12.165], ["blip", B(26), .45], ["blip", B(27), .45], ["blip", B(28), .45],
    ["whoosh", 13.86, .7], ["flip", 15.40, .8], ["chime", 15.82, .8], ["swoosh", 16.08, .6],
    ["swell", 17.1, .6], ["whoosh", 17.5, .5], ["boom", 18.64], ["swoosh", 19.02, .5],
    ["whoosh", 19.72, .7], ["chime", 20.2, .6], ["pop", 20.88, .6], ["click", 21.45], ["send", 21.48, .6],
  ].forEach(([k, t, g]) => MDS.sfx(k, t, g ?? 1));
  const teclas = (t0, n, cps) => { for (let i = 0; i < n; i++) MDS.sfx("key", t0 + i / cps, .8); };
  teclas(6.4, 7, 11); teclas(10.9, 9, 11); teclas(21.0, 8, 11);
})();
