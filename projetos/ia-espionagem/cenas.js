/* A IA virou uma arma de espionagem? · Studio Matteu · REVISÃO v2
 * Direção de arte: "Operação Enxame" (carvão + amarelo-alerta × dossiê). v2 aprovada: mundo 3D contínuo
 * (motor 3D próprio em canvas), objetos com volume, transições por objeto, manchete viva nas cenas escuras.
 * Inter 4 (Display/Text pelo tamanho óptico). Narração aprovada (pausas encurtadas + 12%). Sem música.
 * A v1 está em cenas-v1.js.
 */
(() => {
  const { cena, anim, IN, OUT, VIS, h, fx, prog, svg, sel, path, draw, typeText, counter, at, palco, tipo, trans, fundo } = MDS;
  const CV = "#121110", AM = "#FFD21F", PP = "#EDEAE3", TK = "#151515", AC = "#8A8F98", X = 80;
  const clamp = MDS.clamp, lerp = MDS.lerp, EASE = MDS.EASE;
  const P = (t, a, b, e = "expo") => prog(t, a, b, e);
  const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  /* =================== motor 3D (canvas) ===================
   * Mundo com y para cima, piso em y = 0. Câmera: pos, alvo, fov, rolagem. P(p) → [x, y, escala, z] na tela 1080×1920. */
  const V = {
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cr: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    nz: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
    mix: (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)],
    rotY: (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; },
    rotX: (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; },
  };
  function camera(pos, alvo, fov = 50, rol = 0, cx = 540, cy = 960) {
    const f = V.nz(V.sub(alvo, pos)); let r = V.cr([0, 1, 0], f); if (Math.hypot(...r) < .01) r = [1, 0, 0]; r = V.nz(r);
    let u = V.cr(f, r);
    if (rol) { const c = Math.cos(rol * Math.PI / 180), s = Math.sin(rol * Math.PI / 180); const r2 = V.add(V.mul(r, c), V.mul(u, s)); u = V.sub(V.mul(u, c), V.mul(r, s)); r = r2; }
    const F = 960 / Math.tan(fov * Math.PI / 360);
    return { pos, f, r, u, F, P(p) { const d = V.sub(p, pos), z = V.dot(d, f); if (z < .3) return null; return [cx + V.dot(d, r) * F / z, cy - V.dot(d, u) * F / z, F / z, z]; } };
  }
  // interpola chaves de câmera: [[t, {pos, alvo, fov, rol}, curva], ...]
  function trilha(chaves) {
    return t => {
      let A = chaves[0], B = chaves[0];
      for (const c of chaves) { if (c[0] <= t) A = c; if (c[0] > t) { B = c; break; } B = c; }
      const p = A === B ? 1 : (EASE[B[2] || "inOut"])(clamp((t - A[0]) / (B[0] - A[0])));
      const a = A[1], b = B[1];
      return camera(V.mix(a.pos, b.pos, p), V.mix(a.alvo, b.alvo, p), lerp(a.fov ?? 50, b.fov ?? 50, p), lerp(a.rol ?? 0, b.rol ?? 0, p));
    };
  }
  // órbita em volta de um centro: ângulo (graus), raio, altura
  const orbita = (c, ang, R, alt, fov = 50, rol = 0, alvoY = 0) => camera([c[0] + Math.sin(ang * Math.PI / 180) * R, c[1] + alt, c[2] - Math.cos(ang * Math.PI / 180) * R], [c[0], c[1] + alvoY, c[2]], fov, rol);

  // segmento 3D com corte no plano próximo (subdivide)
  function seg(g, K, a, b, n = 1) {
    let prev = null; g.beginPath();
    for (let i = 0; i <= n; i++) { const q = K.P(V.mix(a, b, i / n)); if (q && prev) g.lineTo(q[0], q[1]); else if (q) g.moveTo(q[0], q[1]); prev = q; }
    g.stroke();
  }
  function piso(g, K, o = {}) {
    const { tam = 40, passo = 2, y = 0, cor = "rgba(138,143,152,.30)", lw = 2, cx = 0, cz = 0 } = o;
    g.strokeStyle = cor; g.lineWidth = lw;
    const x0 = Math.round(cx / passo) * passo, z0 = Math.round(cz / passo) * passo;
    for (let i = -tam; i <= tam; i += passo) { seg(g, K, [x0 + i, y, z0 - tam], [x0 + i, y, z0 + tam], 16); seg(g, K, [x0 - tam, y, z0 + i], [x0 + tam, y, z0 + i], 16); }
  }
  // névoa: esmaece com a distância
  const nevoa = (z, perto = 6, longe = 60) => clamp(1 - (z - perto) / (longe - perto), 0, 1);
  function ponto3(g, K, p, r, cor, a = 1) { const q = K.P(p); if (!q) return null; g.globalAlpha = a; g.fillStyle = cor; g.beginPath(); g.arc(q[0], q[1], Math.max(.5, r * q[2]), 0, 6.2832); g.fill(); g.globalAlpha = 1; return q; }
  function brilho(g, K, p, r, a = 1, cor = "255,210,31") {
    const q = K.P(p); if (!q) return null; const R = r * q[2];
    const gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], R); gr.addColorStop(0, `rgba(${cor},${.9 * a})`); gr.addColorStop(.25, `rgba(${cor},${.35 * a})`); gr.addColorStop(1, `rgba(${cor},0)`);
    g.fillStyle = gr; g.fillRect(q[0] - R, q[1] - R, R * 2, R * 2); return q;
  }
  function chev2(g, x, y, ang, s, cor, o) {
    if (o <= .01) return; g.save(); g.globalAlpha = o; g.translate(x, y); g.rotate(ang); g.scale(s, s); g.fillStyle = cor;
    g.beginPath(); g.moveTo(11, 0); g.lineTo(-8, -8); g.lineTo(-3, 0); g.lineTo(-8, 8); g.closePath(); g.fill(); g.restore();
  }
  // agente 3D: chevron orientado pela direção projetada
  function agente(g, K, p, dir, tam, cor, o = 1) {
    const q = K.P(p), q2 = K.P(V.add(p, V.mul(dir, .3))); if (!q || !q2) return null;
    chev2(g, q[0], q[1], Math.atan2(q2[1] - q[1], q2[0] - q[0]), Math.max(.25, tam * q[2] / 95), cor, o * nevoa(q[3], 4, 70)); return q;
  }
  // caixa: centro c, tamanho [sx, sy, sz]; cores [topo, frente/trás, lados]; arestas opcionais
  function caixa(g, K, c, s, cores, aresta = null, lw = 2) {
    const [hx, hy, hz] = [s[0] / 2, s[1] / 2, s[2] / 2];
    const v = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map(([a, b, d]) => [c[0] + a * hx, c[1] + b * hy, c[2] + d * hz]);
    const pv = v.map(p => K.P(p)); if (pv.some(q => !q)) return;
    const faces = [[[0, 1, 2, 3], [0, 0, -1], cores[1]], [[5, 4, 7, 6], [0, 0, 1], cores[1]], [[4, 0, 3, 7], [-1, 0, 0], cores[2]], [[1, 5, 6, 2], [1, 0, 0], cores[2]], [[3, 2, 6, 7], [0, 1, 0], cores[0]], [[4, 5, 1, 0], [0, -1, 0], cores[1]]];
    for (const [ix, n, cor] of faces) {
      const fc = V.add(c, [n[0] * hx, n[1] * hy, n[2] * hz]); if (V.dot(n, V.sub(K.pos, fc)) <= 0) continue;
      g.fillStyle = cor; g.beginPath(); ix.forEach((k, i) => i ? g.lineTo(pv[k][0], pv[k][1]) : g.moveTo(pv[k][0], pv[k][1])); g.closePath(); g.fill();
      if (aresta) { g.strokeStyle = aresta; g.lineWidth = lw; g.stroke(); }
    }
  }
  // prisma: polígono no plano XZ (lista [x, z]) extrudado de y0 a y1
  function prisma(g, K, poly, y0, y1, corTopo, corLado, aresta = null, lw = 2) {
    const pb = poly.map(([x, z]) => K.P([x, y0, z])), pt = poly.map(([x, z]) => K.P([x, y1, z]));
    if (pb.some(q => !q) || pt.some(q => !q)) return;
    const n = poly.length, lados = [];
    for (let i = 0; i < n; i++) { const j = (i + 1) % n, m = [(poly[i][0] + poly[j][0]) / 2, (y0 + y1) / 2, (poly[i][1] + poly[j][1]) / 2]; lados.push([i, j, V.dot(V.sub(m, K.pos), K.f)]); }
    lados.sort((a, b) => b[2] - a[2]);
    g.fillStyle = corLado; if (aresta) { g.strokeStyle = aresta; g.lineWidth = lw; }
    for (const [i, j] of lados) { g.beginPath(); g.moveTo(pb[i][0], pb[i][1]); g.lineTo(pb[j][0], pb[j][1]); g.lineTo(pt[j][0], pt[j][1]); g.lineTo(pt[i][0], pt[i][1]); g.closePath(); g.fill(); if (aresta) g.stroke(); }
    g.fillStyle = corTopo; g.beginPath(); pt.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fill(); if (aresta) g.stroke();
  }
  const hexPoly = (r, rot = 0) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i + rot; return [Math.cos(a) * r, Math.sin(a) * r]; });
  // anel no piso
  function anel(g, K, c, r, cor, lw = 3, y = .02) { g.strokeStyle = cor; g.lineWidth = lw; g.beginPath(); let f = true; for (let i = 0; i <= 64; i++) { const a = i / 64 * 6.2832, q = K.P([c[0] + Math.cos(a) * r, y, c[2] + Math.sin(a) * r]); if (!q) { f = true; continue; } f ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); f = false; } g.stroke(); }
  // esfera de pontos
  function globo(g, K, c, R, n, giro, t, o = {}) {
    const { cor = "#FFE680", forte = AM, inclin = .35, cobertura = 1 } = o;
    for (let i = 0; i < n; i++) {
      const lat = Math.asin(2 * (i + .5) / n - 1), lon = i * 2.39996;
      let p = [Math.cos(lat) * Math.sin(lon) * R, Math.sin(lat) * R, Math.cos(lat) * Math.cos(lon) * R];
      p = V.rotX(V.rotY(p, giro), inclin);
      const w = V.add(c, p), q = K.P(w); if (!q) continue;
      const frente = V.dot(V.nz(p), V.nz(V.sub(K.pos, w)));
      const on = ((i * 7919) % 1000) / 1000 < cobertura;
      g.globalAlpha = (frente > 0 ? .35 + .65 * frente : .08) * (on ? 1 : .35); g.fillStyle = on ? (i % 11 ? cor : forte) : AC;
      const s = Math.max(1.2, .022 * q[2]); g.fillRect(q[0] - s, q[1] - s, s * 2, s * 2);
    }
    g.globalAlpha = 1;
  }

  /* =================== base, texto e sistema gráfico =================== */
  const bg = (S, c) => h("div", "layer", S, null, `inset:-240px;background:${c}`);
  const mesa = S => { bg(S, PP); h("div", "layer", S, null, "inset:-240px;opacity:.55;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.018) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.012) 0 1px,transparent 1px 7px)"); h("div", "layer", S, null, "inset:-240px;background:radial-gradient(ellipse 70% 55% at 50% 50%,transparent 40%,rgba(60,50,30,.22))"); };
  function cam(S, a, b, o = {}) {
    const { s0 = 1, s1 = 1.045, x0 = 0, x1 = 0, y0 = 0, y1 = 0, r0 = 0, r1 = 0, e = "sine", ox = 540, oy = 960 } = o;
    const C = h("div", "layer", S, null, `transform-origin:${ox}px ${oy}px`);
    anim(C, [[a, { s: s0, x: x0, y: y0, r: r0 }], [b, { s: s1, x: x1, y: y1, r: r1 }, e]]); return C;
  }
  const raiz = (S, ...ks) => anim(S, [].concat(...ks));
  const tremor = (el, t, amp = 14, d = .26) => fx(tt => {
    if (tt < t || tt > t + d) { if (el._tr) { el.style.translate = ""; el._tr = 0; } return; }
    const k = Math.floor(tt * 60), f = 1 - (tt - t) / d; el._tr = 1;
    el.style.translate = `${(((k * 37) % 9) - 4) / 4 * amp * f}px ${(((k * 53) % 7) - 3) / 3 * amp * .6 * f}px`;
  });
  const F = (px, peso = 600, cor = "#fff", ls) => `font:${peso} ${px}px/1 var(--v-display);letter-spacing:${ls ?? (px >= 120 ? "-.045em" : px >= 60 ? "-.03em" : "-.005em")};color:${cor}`;
  const tam = css => +((css.match(/(\d+)px/) || [0, 80])[1]);
  function linha(p, x, y, css, itens, o = {}) {
    const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;white-space:nowrap;${css}`);
    itens.forEach(([w, t, sc], k) => { if (k) el.append(" "); const m = tipo.palavra(el, w, t, { size: tam(css), d: o.d ?? .4, de: o.de }); if (sc) m.querySelector("i").style.cssText += sc; });
    return el;
  }
  const centro = (p, y, css, itens, o) => { const el = linha(p, 0, y, css, itens, o); el.style.left = "0"; el.style.right = "0"; el.style.textAlign = "center"; return el; };
  const txt = (p, x, y, css, s) => h("div", "abs", p, s, `left:${x}px;top:${y}px;white-space:nowrap;${css}`);
  const txtC = (p, y, css, s) => h("div", "abs", p, s, `left:0;right:0;top:${y}px;text-align:center;white-space:nowrap;${css}`);
  const bate = (el, t, s0 = 1.5, b0 = 18, d = .24) => anim(el, [[t - .01, { o: 0, s: s0, b: b0 }], [t + .02, { o: 1 }, "lin"], [t + d, { s: 1, b: 0 }, "out5"]]);
  // texto extrudado (volume) por sombras em camadas
  const extrude = (cor = "#9C7F00", n = 10, dx = 1, dy = 1.6) => "text-shadow:" + Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${cor}`).join(",") + `,${n * dx + 6}px ${n * dy + 14}px 30px rgba(0,0,0,.55)`;
  const GLY = "ABCDEFGHKMNPRSTVXZ0123456789#%&*+=/<>";
  const decode = (el, s, t, d = .4) => fx(tt => {
    if (tt < t) { if (el.textContent) el.textContent = ""; return; }
    const k = Math.floor(tt * 30); let o = "";
    for (let i = 0; i < s.length; i++) { const ti = t + d * i / s.length; o += (tt >= ti + .08 || s[i] === " ") ? s[i] : (tt >= ti ? GLY[(i * 7 + k * 3) % GLY.length] : ""); }
    if (el.textContent !== o) el.textContent = o;
  });
  function tarja(p, x, y, w, hh, tIn, tAbre, cor = TK) {
    const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background:${cor};transform-origin:100% 50%`);
    const k = [[tIn - .01, { o: 0, sx: .2 }], [tIn + .01, { o: 1 }, "lin"], [tIn + .2, { sx: 1 }, "out5"]];
    if (tAbre != null) k.push([tAbre, { sx: 1 }], [tAbre + .3, { sx: 0 }, "inOutExpo"]);
    anim(el, k); return el;
  }
  function corte(p, x, y, w, hh, t, cor = TK) { const el = h("div", "abs", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;background:${cor};transform-origin:0 50%`); anim(el, [[t, { sx: 0 }], [t + .28, { sx: 1 }, "out5"]]); return el; }
  // interferência: barras horizontais de tarja (preto/amarelo) piscando sobre o palco
  function interferencia(t, d = .26, z = 92) {
    const L = h("div", "layer", palco(), null, `z-index:${z}`), bars = Array.from({ length: 9 }, () => h("div", "abs", L, null, "left:-20px;right:-20px"));
    fx(tt => {
      const on = tt >= t && tt < t + d; L.style.display = on ? "block" : "none"; if (!on) return;
      const k = Math.floor(tt * 30), r = rng(k * 131 + 7);
      bars.forEach((b, i) => { const y = r() * 1920, hh = 20 + r() * 240; b.style.top = y + "px"; b.style.height = hh + "px"; b.style.background = (i + k) % 3 ? TK : AM; b.style.transform = `translateX(${(r() - .5) * 160}px)`; });
    });
  }
  function mira(p, cx, cy, R, tIn, tLock, cor = AM, eixo = "r") {
    const w = R * 2 + 80, s = svg(p, w, w, `position:absolute;left:${cx - w / 2}px;top:${cy - w / 2}px;overflow:visible`);
    const g = sel(s, "g", { fill: "none", stroke: cor, "stroke-width": 5, "stroke-linecap": "square" }), c = w / 2;
    sel(g, "circle", { cx: c, cy: c, r: R, "stroke-width": 3, opacity: .9 });
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => sel(g, "line", { x1: c + dx * (R - 26), y1: c + dy * (R - 26), x2: c + dx * (R + 34), y2: c + dy * (R + 34) }));
    const q = R * .72, L = R * .28;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => sel(g, "path", { d: `M${c + sx * q} ${c + sy * (q - L)} L${c + sx * q} ${c + sy * q} L${c + sx * (q - L)} ${c + sy * q}` }));
    s.style.transformOrigin = "50% 50%";
    const k0 = { o: 0, s: 1.6 }, k1 = { s: 1 }; k0[eixo] = eixo === "r" ? 60 : 75; k1[eixo] = 0;
    anim(s, [[tIn, k0], [tIn + .08, { o: 1 }, "lin"], [tLock, k1, "expo"], [tLock + .08, { s: .94 }, "out"], [tLock + .2, { s: 1 }, "out"]]);
    return s;
  }
  const carimbo = (p, s, x, y, t, r = -8, cor = TK) => { const el = h("div", "carimbo", p, s, `left:${x}px;top:${y}px;color:${cor}`); anim(el, [[t - .01, { o: 0, s: 2.3, r: r - 6 }], [t + .02, { o: 1 }, "lin"], [t + .16, { s: 1, r }, "out5"]]); return el; };
  // respingo de tinta do carimbo
  function respingo(p, cx, cy, t, cor = TK) {
    const r = rng(Math.floor(cx * 7 + cy)), gs = Array.from({ length: 22 }, () => ({ a: r() * 6.28, d: 60 + r() * 260, s: 4 + r() * 12 }));
    gs.forEach(q => { const e = h("div", "abs", p, null, `left:${cx}px;top:${cy}px;width:${q.s}px;height:${q.s}px;border-radius:50%;background:${cor}`); anim(e, [[t, { o: 0, x: 0, y: 0, s: .3 }], [t + .02, { o: .9 }, "lin"], [t + .25, { x: Math.cos(q.a) * q.d, y: Math.sin(q.a) * q.d * .7, s: 1 }, "out5"], [t + .9, { o: .55 }]]); });
  }
  const marca = (el, t) => tipo.marcador(el, t, { cor: AM, opac: 1, altura: .95, d: .3 });
  const risco = (el, t) => tipo.risco(el, t, { cor: AM, espessura: .09, d: .3 });
  // mundo 3D por cena: canvas + câmera por tempo + âncoras de DOM
  function mundo(p, a, b, camFn, desenhar, css = "") {
    const c = h("canvas", "abs", p, null, `left:0;top:0;width:1080px;height:1920px;${css}`); c.width = 1080; c.height = 1920;
    const g = c.getContext("2d"), W = { K: camFn(a), c, g };
    fx(t => { if (t < a - .9 || t > b + .9) return; W.K = camFn(t); g.clearRect(0, 0, 1080, 1920); desenhar(g, W.K, t); });
    return W;
  }
  // prende um elemento HTML a um ponto 3D (projeta a cada quadro)
  function ancora(W, el, p3, dx = 0, dy = 0, a = -1, b = 1e9) { fx(t => { if (t < a || t > b) return; const q = W.K.P(typeof p3 === "function" ? p3(t) : p3); if (!q) { el.style.left = "-9999px"; return; } el.style.left = (q[0] + dx).toFixed(1) + "px"; el.style.top = (q[1] + dy).toFixed(1) + "px"; }); }
  // placar de palhetas (split-flap)
  function placar(p, x, y, n, valor, o = {}) {
    const { w = 230, hh = 320, gap = 18, cor = AM, fundoT = "#1E1C1A" } = o, cel = [];
    for (let i = 0; i < n; i++) {
      const b = h("div", "abs", p, null, `left:${x + i * (w + gap)}px;top:${y}px;width:${w}px;height:${hh}px;border-radius:16px;background:${fundoT};box-shadow:0 30px 60px -20px rgba(0,0,0,.7),inset 0 0 0 2px #2E2B28;overflow:hidden;perspective:900px`);
      const d = h("div", "abs", b, "0", `inset:0;display:flex;align-items:center;justify-content:center;${F(Math.round(hh * .82), 700, cor)};font-variant-numeric:tabular-nums`);
      const ab = h("div", "abs", b, null, `left:0;right:0;top:0;height:50%;background:linear-gradient(${fundoT},#16140F);transform-origin:50% 100%;border-bottom:2px solid #000`);
      h("div", "abs", b, null, `left:0;right:0;top:50%;height:3px;margin-top:-1px;background:#000`);
      cel.push({ d, ab });
    }
    fx(t => {
      const v = valor(t), v2 = valor(t - .09), s = String(v).padStart(n, "0"), s2 = String(v2).padStart(n, "0");
      cel.forEach((c, i) => { if (c.d.textContent !== s[i]) c.d.textContent = s[i]; const mud = s[i] !== s2[i]; c.ab.style.opacity = mud ? 1 : 0; c.ab.style.transform = mud ? `rotateX(${-((t * 37) % 1) * 90}deg)` : ""; });
    });
  }

  /* =================== manchete viva (cenas escuras) ===================
   * Blocos: { a, b, p: [[palavra, t]], g: [[PALAVRA, t]], g2, p2, tg (tamanho), cg (cor) } */
  function manchete(blocos) {
    const L = h("div", "layer", palco(), null, "z-index:70");
    for (const B of blocos) {
      const box = h("div", "abs", L, null, "left:0;top:0;width:1080px;height:700px");
      const tg = B.tg || 124;
      if (B.p) linha(box, X, 250, F(48, 500, "rgba(255,255,255,.82)", ".005em"), B.p, { d: .32 });
      let y = 312;
      if (B.g) { linha(box, X - 4, y, F(tg, 700, B.cg || AM), B.g, { d: .38 }); y += tg; }
      if (B.g2) { linha(box, X - 4, y, F(B.tg2 || tg, 700, B.cg2 || "#fff"), B.g2, { d: .38 }); y += (B.tg2 || tg); }
      if (B.p2) linha(box, X, y + 18, F(44, 500, AC, ".005em"), B.p2, { d: .32 });
      anim(box, [[B.a - .02, { o: 0 }], [B.a, { o: 1 }, "lin"], [B.b, { o: 1, y: 0, b: 0 }], [B.b + .22, { o: 0, y: -50, b: 10 }, "in"]]);
    }
    return L;
  }

  /* cena com janela de visibilidade explícita (raiz externa) e raiz interna S para entradas, saídas e recortes */
  const cenaV = cfg => cena({ ...cfg, montar(S0, c) {
    const S = h("div", "layer", S0, null, "transform-origin:540px 960px");
    const [a, b] = cfg.vis; anim(S0, [[a - .001, { o: 0 }], [a, { o: 1 }, "lin"], [b, { o: 1 }], [b + .001, { o: 0 }, "lin"]]);
    cfg.montar(S, c);
  } });

  /* =================== camadas globais =================== */
  const grao = fundo.grao({ opac: .07 }); grao.firstChild.style.mixBlendMode = "overlay";
  h("div", "layer", palco(), null, "z-index:97;background:radial-gradient(ellipse 90% 70% at 50% 50%,transparent 55%,rgba(0,0,0,.38))");
  manchete([
    { a: 2.64, b: 4.02, p: [["Imagine", 2.64], ["um", 3.0], ["único", 3.30]], g: [["OPERADOR", 3.60]] },
    { a: 4.08, b: 6.34, p: [["controlando", 4.08]], g: [["AGENTES", 4.68]], g2: [["DE", 5.34], ["IA", 5.80, `color:${AM}`]], cg: "#fff" },
    { a: 6.42, b: 8.40, p: [["para", 6.42], ["invadir", 6.72], ["centenas", 7.08], ["de", 7.68]], g: [["ORGANIZAÇÕES", 7.86]], tg: 112 },
    { a: 16.0, b: 17.82, p: [["utilizou", 16.0]], g: [["INTELIGÊNCIA", 16.72]], g2: [["ARTIFICIAL", 17.24]], tg: 112 },
    { a: 21.10, b: 23.82, p: [["distribuídas", 21.10], ["por", 21.74], ["pelo", 21.96], ["menos", 22.14]], g: [["14", 22.42], ["PAÍSES", 22.88, "color:#fff"]] },
    { a: 24.08, b: 26.56, p: [["A", 24.08], ["operação", 24.26], ["utilizou", 24.72], ["agentes", 25.36]], g: [["COORDENADOS", 25.70]], tg: 112 },
    { a: 26.62, b: 28.36, p: [["por", 26.62], ["uma", 26.62], ["ferramenta", 26.76], ["chamada", 27.24]], g: [["ARTEX", 27.64]], tg: 150 },
    { a: 28.54, b: 31.74, p: [["com", 28.54], ["um", 28.78], ["modelo", 28.88]], g: [["DEEPSEEK", 29.18]], p2: [["entre", 29.84], ["as", 30.16], ["tecnologias", 30.34], ["empregadas", 30.90]] },
    { a: 33.18, b: 35.80, p: [["os", 33.18], ["alvos", 33.42], ["incluíam", 33.68]], g: [["MINISTÉRIOS", 34.18]], p2: [["das", 34.82], ["Relações", 34.96], ["Exteriores", 35.40]], tg: 118 },
    { a: 35.96, b: 37.50, p: [["de", 35.98], ["países", 36.18], ["da", 36.46]], g: [["AMÉRICA", 36.74]], g2: [["LATINA", 37.0]], cg2: AM, cg: "#fff" },
    { a: 39.86, b: 41.72, p: [["atividade", 39.86], ["de", 39.86]], g: [["INVASÃO", 39.86]], p2: [["em", 40.28], ["nove", 40.48], ["organizações", 40.80]] },
    { a: 47.40, b: 49.34, p: [["Um", 47.40], ["operador", 47.46]], g: [["HUMANO", 47.82]], p2: [["direcionava", 48.54], ["os", 48.90], ["agentes", 49.04]] },
    { a: 49.44, b: 51.84, p: [["e", 49.44], ["intervinha", 49.76], ["nas", 50.30]], g: [["DECISÕES", 50.46]], g2: [["ESTRATÉGICAS", 50.88]], tg: 110 },
    { a: 56.06, b: 57.86, p: [["pode", 56.06], ["coordenar", 56.30]], g: [["OPERAÇÕES", 56.82]], g2: [["DIGITAIS", 57.24]], tg: 118 },
  ]);

  /* =================== MUNDO A: o operador e o enxame (c03–c06) =================== */
  const R0 = rng(11);
  const ANEIS = [[8, 2.6, 4.68], [24, 4.4, 5.34], [48, 6.4, 5.80]].flatMap(([n, r, t0]) => Array.from({ length: n }, (_, i) => ({ a: Math.PI * 2 * i / n + R0() * .15, r: r * (.92 + R0() * .16), t: t0 + R0() * .14 })));
  const angA = t => lerp(14, 58, P(t, 4.6, 6.5, "inOut"));
  const camA = t => {
    if (t < 4.6) return trilha([[2.5, { pos: [0, 46, -.6], alvo: [0, 0, 0] }], [3.7, { pos: [0, 9, -12], alvo: [0, .8, 0] }, "inOutExpo"], [4.6, { pos: [2.9, 7.6, -11.6], alvo: [0, .8, 0] }, "sine"]])(t);
    return orbita([0, 0, 0], angA(t), 11.95, 7.6 + P(t, 4.6, 6.4, "inOut") * .8, 50, 0, .8);
  };
  const CUBOS = (() => { const r = rng(3), a = []; for (let x = -22; x <= 22; x += 1.7) for (let z = -8; z <= 46; z += 1.7) { if (Math.hypot(x, z) < 8.5) continue; const hit = r() < .36 ? 6.72 + Math.min(1.7, Math.hypot(x, z) / 30 * 1.7) * (.6 + r() * .4) : 1e9; a.push({ x, z, h: .5 + r() * .9, hit }); } return a; })();
  const camB = trilha([[6.4, { pos: [3.8, 8.4, -11.2], alvo: [0, .8, 0] }], [8.5, { pos: [-6, 27, -23], alvo: [0, 0, 12] }, "inOutExpo"], [9.66, { pos: [-6.6, 26, -21], alvo: [0, 0, 12] }, "sine"]]);
  function desenhaCampo(g, K, t, flash = null) {
    const lista = CUBOS.map(c => ({ c, z: V.dot(V.sub([c.x, 0, c.z], K.pos), K.f) })).filter(o => o.z > .5).sort((a, b) => b.z - a.z);
    for (const { c, z } of lista) {
      const fl = flash != null && t >= flash, lit = t >= c.hit || fl, k = clamp((t - (fl ? flash : c.hit)) / .2);
      const f = nevoa(z, 10, 75); if (f <= .02) continue; g.globalAlpha = f;
      const cores = lit ? (k < 1 ? ["#FFFFFF", "#FFF2B8", "#FFE680"] : [AM, "#B89600", "#8F7500"]) : ["#2E2C29", "#1C1B19", "#232120"];
      caixa(g, K, [c.x, c.h / 2, c.z], [1.15, c.h, 1.15], cores);
    }
    g.globalAlpha = 1;
  }

  /* =================== cenas =================== */
  cenaV({ id: "c01", vis: [0, 1.45], nome: "A IA virou", inicio: 0, fim: 1.25, descricao: "As letras vêm do fundo do espaço e travam; «virou» gira em 3D.",
    sfx: [["swoosh", 0.02, .5], ["boom", 0.18, .5], ["whoosh", 0.66, .7], ["flip", 1.10, .6]],
    montar(S) {
      bg(S, CV); const C = cam(S, 0, 1.4, { s1: 1.08 });
      const r = rng(9), st = Array.from({ length: 220 }, () => [(r() - .5) * 40, (r() - .5) * 70, r() * 60]);
      mundo(C, 0, 1.25, t => camera([0, 0, t * 9], [0, 0, t * 9 + 10], 60), (g, K) => { for (const s of st) { const q = K.P(s); if (!q) continue; g.fillStyle = "rgba(255,230,128," + (.25 + .5 * nevoa(q[3], 3, 50)) + ")"; const z = Math.max(1, q[2] * .08); g.fillRect(q[0], q[1], z, z * 3); } });
      const a = txtC(C, 690, F(330, 700) + ";" + extrude("#3A3836", 8, 0, 2), "A <span style='color:" + AM + ";text-shadow:" + Array.from({ length: 8 }, (_, i) => `0 ${(i + 1) * 2}px 0 #8F7500`).join(",") + "'>IA</span>");
      anim(a, [[0.0, { o: 0, s: 3.4, b: 30 }], [0.04, { o: 1 }, "lin"], [0.20, { s: 1, b: 0 }, "expo"]]);
      const v = txtC(C, 1060, F(150, 500), "virou"); v.style.transformOrigin = "50% 50%";
      anim(v, [[0.66, { o: 0, ry: -90 }], [0.70, { o: 1 }, "lin"], [1.0, { ry: 0 }, "expo"], [1.10, { ry: 0, s: 1 }], [1.3, { ry: 90, s: 1.4 }, "in"]]);
      tremor(C, .2, 16);
      raiz(S, trans.saiParaCima(1.14, { d: .3, dist: 900 }));
    } });

  cenaV({ id: "c02", vis: [1.10, 2.72], nome: "Arma", inicio: 1.25, fim: 2.64, descricao: "ARMA extrudada gira; três anéis de mira em planos 3D se alinham; mergulho na mira.",
    sfx: [["tick", 1.30], ["click", 1.40, .7], ["glitch", 1.68, .7], ["whoosh", 2.44, .9], ["swoosh", 2.56, .5]],
    montar(S) {
      bg(S, CV); const C = cam(S, 1.1, 2.64, { s1: 1.07, oy: 845 });
      const a = txtC(C, 700, F(300, 700, AM) + ";" + extrude("#8F7500", 12, 0, 2.4), "ARMA"); a.style.transformOrigin = "50% 50%";
      anim(a, [[1.18, { o: 0, ry: -70, s: 1.3 }], [1.22, { o: 1 }, "lin"], [1.48, { ry: 0, s: 1 }, "expo"]]);
      mira(C, 540, 845, 380, 1.16, 1.32, AM, "rx"); mira(C, 540, 845, 330, 1.18, 1.36, "rgba(255,255,255,.75)", "ry"); mira(C, 540, 845, 280, 1.20, 1.40, AM, "r");
      const e = txtC(C, 1110, F(96, 500), ""); decode(e, "de espionagem?", 1.68, .4);
      const bars = h("div", "abs", C, null, "left:150px;top:1090px;width:780px;height:130px");
      fx(t => { const on = t > 1.5 && t < 1.95; bars.style.display = on ? "block" : "none"; if (!on) return; const k = Math.floor(t * 30), r = rng(k); bars.style.background = `linear-gradient(${AM} 0 ${r() * 30}%,transparent 0 ${40 + r() * 20}%,${TK} 0 ${70 + r() * 10}%,${AM} 0)`; bars.style.transform = `translateX(${(r() - .5) * 60}px)`; });
      tremor(C, 1.32, 8);
      S.style.transformOrigin = "540px 845px";
      raiz(S, trans.entraDeBaixo(1.12, { d: .32, dist: 900 }), [[2.42, { s: 1, b: 0, o: 1 }], [2.7, { s: 7, b: 10, o: 0 }, "inExpo"]]);
    } });

  cenaV({ id: "c03", vis: [2.50, 4.6], nome: "Um único operador", inicio: 2.64, fim: 4.6, descricao: "Mundo 3D: a câmera desce sobre o piso tático; um feixe de luz cai e acende o operador.",
    sfx: [["swell", 2.60, .8], ["whoosh", 2.62, .5], ["glitch", 3.28, .5], ["blip", 3.32], ["key", 3.64, .6], ["key", 3.72, .6], ["key", 3.80, .6], ["key", 3.88, .6], ["key", 3.96, .6], ["swoosh", 4.40, .4]],
    montar(S) {
      bg(S, CV);
      const W = mundo(S, 2.5, 4.6, camA, (g, K, t) => {
        piso(g, K, { tam: 44, passo: 2 });
        if (t < 3.3) { anel(g, K, [0, 0, 0], 3 + (t - 2.6) * 2, `rgba(255,210,31,${.5 * P(t, 2.64, 2.9)})`, 3); anel(g, K, [0, 0, 0], 1.2, `rgba(255,210,31,${.35 * P(t, 2.7, 3.0)})`, 2); }
        const fb = P(t, 3.28, 3.42, "out"), fo = 1 - P(t, 3.5, 4.1, "out");
        if (t >= 3.28 && fo > 0) { g.strokeStyle = `rgba(255,230,128,${.85 * fo})`; g.lineWidth = 6; seg(g, K, [0, 40 * (1 - fb), 0], [0, 40, 0], 6); }
        if (t >= 3.30) { const k = ((t - 3.30) * .9) % 1; anel(g, K, [0, 0, 0], .6 + k * 3, `rgba(255,210,31,${1 - k})`, 3); anel(g, K, [0, 0, 0], 1.2, "rgba(255,210,31,.5)", 2); brilho(g, K, [0, .25, 0], 2.4, 1); ponto3(g, K, [0, .25, 0], .32, AM); }
      });
      const lb = h("div", "abs rot", S, null, `color:${AM};white-space:nowrap`); typeText(lb, "OPERADOR · 01", 3.60, 34); ancora(W, lb, [.9, 0, 0], 10, -12);
      raiz(S, trans.entraZoom(2.5, { s: .3, d: .4 }));
    } });

  cenaV({ id: "c04", vis: [4.6, 6.44], nome: "Agentes de IA", inicio: 4.6, fim: 6.4, descricao: "A câmera orbita o operador; agentes 3D nascem do chão em três anéis, ligados por fios com pulsos.",
    sfx: [["pop", 4.68, .9], ["blip", 4.74, .5], ["blip", 4.82, .45], ["pop", 5.34, .7], ["blip", 5.38, .5], ["swell", 5.36, .4], ["pop", 5.80, .6], ["swoosh", 5.82, .6], ["blip", 5.90, .4], ["whoosh", 6.30, .7]],
    montar(S) {
      bg(S, CV);
      mundo(S, 4.6, 6.4, camA, (g, K, t) => {
        piso(g, K, { tam: 44, passo: 2 });
        anel(g, K, [0, 0, 0], 1.2, "rgba(255,210,31,.5)", 2);
        const ag = ANEIS.filter(q => t >= q.t).map(q => { const p = P(t, q.t, q.t + .5), a = q.a + (t - q.t) * .25, pos = [Math.cos(a) * q.r * p, .2 + .5 * p, Math.sin(a) * q.r * p]; return { q, p, a, pos, z: V.dot(V.sub(pos, K.pos), K.f) }; }).sort((x, y) => y.z - x.z);
        g.lineWidth = 1.6;
        for (const o of ag) {
          g.strokeStyle = `rgba(255,210,31,${.22 * o.p})`; seg(g, K, [0, .25, 0], o.pos, 3);
          const k = ((t * 1.3 + o.q.a) % 1); ponto3(g, K, V.mix([0, .25, 0], o.pos, k), .07, "#FFF2B8", .9 * o.p);
          agente(g, K, o.pos, [-Math.sin(o.a), 0, Math.cos(o.a)], 1.5, "#FFE680", Math.min(1, o.p * 2));
        }
        brilho(g, K, [0, .25, 0], 2.4, 1); ponto3(g, K, [0, .25, 0], .32, AM);
      });
    } });

  cenaV({ id: "c05", vis: [6.4, 8.52], nome: "Centenas de organizações", inicio: 6.4, fim: 8.5, descricao: "Grua: o piso vira um campo de centenas de cubos até o horizonte; agentes riscam arcos e acendem os cubos.",
    sfx: [["whoosh", 6.42], ["swell", 6.44, .5], ["glitch", 6.72, .6], ["blip", 6.80, .4], ["glitch", 6.96, .45], ["swoosh", 7.08, .7], ["blip", 7.20, .35], ["glitch", 7.34, .4], ["blip", 7.6, .35], ["blip", 7.9, .3]],
    montar(S) {
      bg(S, CV);
      const arcos = CUBOS.filter(c => c.hit < 1e8).map(c => ({ c, t0: c.hit - .45 }));
      mundo(S, 6.4, 8.5, camB, (g, K, t) => {
        piso(g, K, { tam: 60, passo: 1.7, cor: "rgba(138,143,152,.16)", cz: 18 });
        desenhaCampo(g, K, t);
        g.lineWidth = 2.4;
        for (const { c, t0 } of arcos) {
          const p = P(t, t0, c.hit, "in"); if (p <= 0 || p >= 1) continue;
          const pt = u => [lerp(0, c.x, u), .4 + Math.sin(u * Math.PI) * 6 + u * c.h, lerp(0, c.z, u)];
          g.strokeStyle = "rgba(255,230,128,.55)"; g.beginPath(); let f = true;
          for (let k = Math.max(0, p - .3); k <= p; k += .03) { const q = K.P(pt(k)); if (!q) continue; f ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); f = false; } g.stroke();
          agente(g, K, pt(p), V.sub(pt(Math.min(1, p + .02)), pt(p)), 1.4, "#FFF2B8", 1);
        }
        brilho(g, K, [0, .25, 0], 2.4, 1);
      });
      const w = txt(S, 0, 1180, F(250, 700) + ";" + extrude("#2A2826", 6, 0, 2), "CENTENAS");
      anim(w, [[6.95, { x: 1150, o: 1 }], [8.5, { x: -1450 }, "lin"]]);
    } });

  cenaV({ id: "c06", vis: [8.48, 9.70], nome: "Ao mesmo tempo", inicio: 8.5, fim: 9.66, descricao: "Todos os cubos acendem juntos; uma onda de choque corre pelo campo. Interferência para o dossiê.",
    sfx: [["swoosh", 8.44, .4], ["hit", 8.90], ["glitch", 8.93, .4], ["glitch", 9.50, .7], ["swoosh", 9.56, .6]],
    montar(S) {
      bg(S, CV);
      mundo(S, 8.48, 9.66, camB, (g, K, t) => {
        piso(g, K, { tam: 60, passo: 1.7, cor: "rgba(138,143,152,.16)", cz: 18 });
        desenhaCampo(g, K, t, 8.90);
        if (t >= 8.90) { const k = P(t, 8.90, 9.6, "out"); anel(g, K, [0, 0, 0], k * 48, `rgba(255,255,255,${.8 * (1 - k)})`, 8); anel(g, K, [0, 0, 0], k * 40, `rgba(255,210,31,${.6 * (1 - k)})`, 4); }
      });
      h("div", "abs", S, null, "left:-100px;right:-100px;top:640px;height:620px;background:linear-gradient(transparent,rgba(18,17,16,.85) 20%,rgba(18,17,16,.85) 80%,transparent)");
      centro(S, 680, F(170, 700), [["AO", 8.44]]);
      centro(S, 860, F(170, 700), [["MESMO", 8.64]]);
      centro(S, 1040, F(170, 700, AM), [["TEMPO", 8.90]]);
      tremor(S, 8.90, 18);
      interferencia(9.48, .24);
    } });

  /* ---------- o dossiê (mesa vista de cima) ---------- */
  function pasta(p, o = {}) {
    const { x = 170, y = 470, w = 740, hh = 980 } = o;
    const base = h("div", "abs", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px`);
    h("div", "abs", base, null, "inset:24px -10px -16px 20px;background:rgba(40,30,10,.28);filter:blur(22px);border-radius:12px");
    h("div", "abs", base, null, `inset:0;background:#2A2826;border-radius:10px`);
    const tab = h("div", "abs", base, null, `left:40px;top:-46px;width:260px;height:56px;background:${AM};border-radius:10px 10px 0 0;${F(24, 700, TK, ".16em")};display:flex;align-items:center;padding-left:22px`); tab.textContent = "ARQUIVO 01";
    return { base };
  }
  function relatorio(p, x, y, w, hh) {
    const pg = h("div", "pagina", p, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px`);
    txt(pg, 56, 60, F(22, 600, AC, ".18em"), "CONFIDENCIAL");
    txt(pg, 56, 108, F(50, 700, TK), "RELATÓRIO DE"); txt(pg, 56, 166, F(50, 700, TK), "INTELIGÊNCIA");
    h("div", "abs", pg, null, `left:56px;top:246px;width:${w - 112}px;height:3px;background:${TK}`);
    const fonte = txt(pg, 56, 282, F(38, 600, TK, ".02em"), ""), sp = h("span", "", fonte, "FONTE: CROWDSTRIKE");
    [640, 560, 620, 480, 600, 540, 640, 400, 580, 500, 620].forEach((lw, i) => h("div", "abs", pg, null, `left:56px;top:${380 + i * 50}px;width:${Math.min(lw, w - 112)}px;height:22px;background:${i % 4 === 2 ? "rgba(21,21,21,.18)" : TK};border-radius:2px`));
    return { pg, sp };
  }
  function capa(base, tRisco) {
    const cv = h("div", "abs", base, null, "inset:0;background:#24221F;border-radius:10px;box-shadow:inset 0 0 0 2px #34312E;transform-origin:0 50%;backface-visibility:hidden");
    h("div", "carimbo", cv, "CONFIDENCIAL", `left:60px;top:90px;color:${AM};font-size:44px;border-width:5px;transform:rotate(-6deg)`);
    txt(cv, 60, 470, F(70, 500, "rgba(255,255,255,.7)"), "NÃO É");
    const f = txt(cv, 54, 560, F(200, 700, "#fff"), ""); const sp = h("span", "", f, "FICÇÃO");
    if (tRisco != null) risco(sp, tRisco); else h("div", "abs", cv, null, `left:50px;top:660px;width:${sp.offsetWidth || 640}px;height:18px;background:${AM}`);
    return cv;
  }

  cenaV({ id: "c07", vis: [9.46, 11.0], nome: "Não é ficção", inicio: 9.66, fim: 10.98, descricao: "Uma pasta de dossiê cai na mesa; «FICÇÃO» na capa é riscada.",
    sfx: [["whoosh", 9.62, .5], ["hit", 9.86, .35], ["flip", 9.88, .4], ["swoosh", 10.30, .5], ["tick", 10.34, .5]],
    montar(S) {
      mesa(S); const C = cam(S, 9.6, 11.0, { s1: 1.05, r0: -1.2, r1: 0 });
      const { base } = pasta(C); capa(base, 10.30);
      anim(base, [[9.62, { y: -1500, r: -12, s: 1.12 }], [9.86, { y: 0, r: -2, s: 1 }, "in"], [9.95, { y: -26, r: -1.6 }, "out"], [10.05, { y: 0, r: -2 }, "in"]]);
      tremor(C, 9.86, 10, .2);
    } });

  cenaV({ id: "c08", vis: [10.98, 13.12], nome: "O relatório", inicio: 10.98, fim: 13.06, descricao: "A capa abre como dobradiça 3D e revela o relatório; marca-texto em FONTE: CROWDSTRIKE.",
    sfx: [["flip", 10.98, .9], ["swoosh", 11.02, .5], ["swoosh", 12.00, .5], ["tick", 12.02, .5], ["whoosh", 12.86, .8]],
    montar(S) {
      mesa(S); const C = cam(S, 10.98, 13.1, { s0: 1.05, s1: 1.18, r0: 0, r1: 2, ox: 540, oy: 820 });
      const { base } = pasta(C); base.style.transform = "rotate(-2deg)";
      const { sp } = relatorio(base, 26, 22, 690, 940); marca(sp, 12.00);
      const cv = capa(base, null);
      anim(cv, [[10.98, { ry: 0, o: 1 }], [11.34, { ry: -88, o: 1 }, "in"], [11.36, { o: 0 }, "lin"]]);
      raiz(S, [[12.86, { x: 0, b: 0 }], [13.10, { x: -1150, b: 20 }, "inExpo"]]);
    } });

  cenaV({ id: "c09", vis: [12.86, 15.88], nome: "A ficha do grupo", inicio: 13.06, fim: 15.86, descricao: "Ficha com clipe: tarjas, carimbo com respingo, VAPORPANDA decodifica. A ficha vira e mostra o mundo escuro.",
    sfx: [["swoosh", 12.92, .6], ["swoosh", 13.52, .4], ["swoosh", 13.62, .35], ["hit", 14.00, .55], ["glitch", 15.00, .7], ["tick", 15.30, .5], ["flip", 15.70, .9], ["whoosh", 15.74, .6]],
    montar(S) {
      mesa(S); const C = cam(S, 12.9, 15.9, { s1: 1.08, x1: -16, ox: 600, oy: 1100 });
      const card = h("div", "pagina", C, null, "left:110px;top:400px;width:860px;height:1060px;transform:rotate(-2.5deg)");
      const clip = svg(C, 80, 200, "position:absolute;left:220px;top:330px;overflow:visible"); path(clip, "M20 180 L20 30 Q20 6 40 6 Q60 6 60 30 L60 150 Q60 166 46 166 Q32 166 32 150 L32 50", { fill: "none", stroke: "#9AA0A8", "stroke-width": 8, "stroke-linecap": "round" });
      txt(card, 56, 60, F(22, 600, AC, ".18em"), "FICHA · ALVO DE INTERESSE");
      linha(card, 56, 110, F(58, 700, TK), [["GRUPO", 13.16], ["DE", 13.38], ["ESPIONAGEM", 13.52]]);
      const foto = h("div", "abs", card, null, "left:610px;top:200px;width:190px;height:230px;background:#D9D5CC;border:3px solid #151515;overflow:hidden");
      const fs = svg(foto, 190, 230, "position:absolute;left:0;top:0"); sel(fs, "circle", { cx: 95, cy: 92, r: 44, fill: "#8A8F98" }); path(fs, "M10 230 C10 160 50 140 95 140 C140 140 180 160 180 230 Z", { fill: "#8A8F98" });
      tarja(foto, 0, 0, 190, 230, 13.2, null);
      h("div", "abs", card, null, `left:56px;top:190px;width:500px;height:3px;background:${TK}`);
      [["ORIGEM", 230], ["CLASSIFICAÇÃO", 310], ["MEMBROS", 390]].forEach(([k, y], i) => { txt(card, 56, y, F(24, 600, AC, ".14em"), k); tarja(card, 300, y - 6, 240 - i * 40, 34, 13.52 + i * .1, null); });
      txt(card, 56, 520, F(24, 600, AC, ".14em"), "IDENTIFICADO COMO");
      const nm = txt(card, 50, 570, F(124, 700, TK), ""); decode(nm, "VAPORPANDA", 15.0, .45);
      tarja(card, 56, 560, 760, 150, 13.3, 15.0);
      carimbo(card, "IDENTIFICADO", 150, 800, 14.00, -9); respingo(card, 380, 850, 14.00);
      tremor(C, 14.0, 10);
      raiz(S, [[12.86, { x: 1150, b: 20 }], [13.10, { x: 0, b: 0 }, "expo"], [15.70, { ry: 0 }], [15.88, { ry: 90 }, "in"]]);
    } });

  /* ---------- MUNDO B: o núcleo ---------- */
  function nucleo(g, K, t, c = [0, 0, 0], r = 1.7, giro = 0) {
    const pol = hexPoly(r, giro).map(([x, z]) => [x + c[0], z + c[2]]);
    prisma(g, K, pol, c[1], c[1] + 1.3, "#2A2826", "#1B1A18", AM, 3);
    const pi = hexPoly(r * .74, giro).map(([x, z]) => [x + c[0], z + c[2]]); g.strokeStyle = "rgba(255,210,31,.45)"; g.lineWidth = 2; g.beginPath(); pi.forEach(([x, z], i) => { const q = K.P([x, c[1] + 1.31, z]); if (q) i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath(); g.stroke();
    const q = K.P([c[0], c[1] + 1.32, c[2]]); if (q) { g.save(); g.fillStyle = AM; g.font = `700 ${Math.round(q[2] * 1.15)}px Inter`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("IA", q[0], q[1]); g.restore(); }
  }
  const ORB = (() => { const r = rng(31); return Array.from({ length: 34 }, (_, i) => ({ a: r() * 6.28, R: i % 2 ? 3.4 : 4.8, v: (i % 2 ? .9 : -.6) * (.8 + r() * .4), inc: i % 2 ? .35 : -.28, y: 1.2 + r() * .4 })); })();
  cenaV({ id: "c10", vis: [15.86, 18.44], nome: "A campanha", inicio: 15.86, fim: 18.3, descricao: "Prisma hexagonal 3D (núcleo IA) com agentes em órbitas que passam na frente e atrás; faixa CAMPANHA.",
    sfx: [["flip", 15.86, .6], ["swell", 15.9, .4], ["blip", 16.72], ["pop", 16.74, .5], ["swoosh", 17.56, .7], ["swoosh", 17.90, .5], ["whoosh", 18.18, .6]],
    montar(S) {
      bg(S, CV);
      const camN = t => orbita([0, 0, 0], -20 + (t - 15.86) * 9, 10.5 - P(t, 15.86, 18.3, "inOut") * 1.2, 4.6, 46, 0, 1.2);
      const W = mundo(S, 15.86, 18.3, camN, (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2 });
        const pulso = t >= 16.72 ? P(t, 16.72, 17.4, "out") : 0; if (pulso > 0 && pulso < 1) anel(g, K, [0, 0, 0], 2 + pulso * 7, `rgba(255,210,31,${1 - pulso})`, 4);
        const ag = ORB.map(o => { const a = o.a + t * o.v, p = V.rotX([Math.cos(a) * o.R, 0, Math.sin(a) * o.R], o.inc); const pos = [p[0], p[1] + o.y, p[2]]; return { pos, dir: V.rotX([-Math.sin(a) * Math.sign(o.v), 0, Math.cos(a) * Math.sign(o.v)], o.inc), z: V.dot(V.sub(pos, K.pos), K.f) }; });
        const zc = V.dot(V.sub([0, .6, 0], K.pos), K.f);
        ag.filter(o => o.z > zc).forEach(o => agente(g, K, o.pos, o.dir, 1.5, "#FFE680", .9));
        nucleo(g, K, t, [0, 0, 0], 1.7, t * .4);
        ag.filter(o => o.z <= zc).forEach(o => agente(g, K, o.pos, o.dir, 1.5, "#FFE680", 1));
      });
      const tag = h("div", "chip", S, "VAPORPANDA", "translate:-50% -100%"); ancora(W, tag, [0, 2.1, 0], 0, -10);
      anim(tag, [[16.0, { o: 0, s: 1.8 }], [16.4, { o: 1, s: 1 }, "expo"]]);
      const f1 = txt(S, 0, 1300, F(210, 800, "transparent") + ";-webkit-text-stroke:2px rgba(255,255,255,.35)", "CAMPANHA · CAMPANHA · CAMPANHA");
      anim(f1, [[17.50, { x: 500, o: 0 }], [17.58, { o: 1 }, "lin"], [18.6, { x: -1100 }, "lin"]]);
      const f2 = txt(S, 0, 1520, F(54, 600, AM, ".14em"), "CAMPANHA · CAMPANHA · CAMPANHA · CAMPANHA");
      anim(f2, [[17.55, { x: -900, o: 0 }], [17.63, { o: 1 }, "lin"], [18.6, { x: 0 }, "lin"]]);
      raiz(S, [[15.86, { ry: -90 }], [16.12, { ry: 0 }, "expo"], [18.16, { s: 1, o: 1, b: 0 }], [18.42, { s: 1.5, o: 0, b: 14 }, "in"]]);
    } });

  /* ---------- grade isométrica de 200 organizações ---------- */
  const G200 = Array.from({ length: 200 }, (_, i) => ({ i, x: (i % 20 - 9.5) * 1.25, z: (Math.floor(i / 20) - 4.5) * 1.25 }));
  const NOVE = [23, 47, 58, 91, 102, 125, 140, 163, 187];
  const camIso = (t, a0 = -30, vel = 3, cy = 1320, alvo = [0, 0, 0], fov = 50) => { const a = (a0 + t * vel) * Math.PI / 180; return camera([Math.sin(a) * 34, 30, -Math.cos(a) * 34], alvo, fov, 0, 540, cy); };
  function desenhaG200(g, K, t, aceso, alto = () => 0, cinza = false) {
    const lista = G200.map(c => ({ c, z: V.dot(V.sub([c.x, 0, c.z], K.pos), K.f) })).sort((a, b) => b.z - a.z);
    for (const { c } of lista) {
      const ta = aceso(c.i), on = t >= ta, k = clamp((t - ta) / .2), hh = .5 + alto(c.i, t);
      const cores = on && !cinza ? (k < 1 ? ["#FFFFFF", "#FFF2B8", "#FFE680"] : [AM, "#B89600", "#8F7500"]) : on && cinza ? ["#BDBDBD", "#8E8E8E", "#A5A5A5"] : ["#2E2C29", "#1C1B19", "#232120"];
      caixa(g, K, [c.x, hh / 2, c.z], [.95, hh, .95], cores);
    }
  }

  cenaV({ id: "c11", vis: [18.18, 21.16], nome: "Mais de 200", inicio: 18.3, fim: 21.1, descricao: "Placar de palhetas vira até 200; abaixo, 200 cubos isométricos acendem em ondas.",
    sfx: [["riser", 18.30], ["tick", 19.04, .6], ["tick", 19.14, .5], ["tick", 19.24, .55], ["tick", 19.34, .5], ["tick", 19.46, .55], ["tick", 19.58, .5], ["tick", 19.72, .55], ["boom", 19.86, .35], ["swell", 20.9, .5], ["whoosh", 20.92, .7]],
    montar(S) {
      bg(S, CV); const C = cam(S, 18.2, 21.2, { s1: 1.05 });
      mundo(C, 18.3, 21.1, t => camIso(t), (g, K, t) => desenhaG200(g, K, t, i => 19.0 + i * .0043));
      const md = txtC(C, 330, F(60, 600, "#fff", ".04em"), "MAIS DE"); anim(md, IN(19.02, { dy: 40, d: .35 }));
      placar(C, 165, 430, 3, t => Math.round(200 * P(t, 19.02, 19.86, "expo")));
      const org = txtC(C, 800, F(64, 600, "#fff", ".04em"), "ORGANIZAÇÕES"); anim(org, IN(19.86, { dy: 40, d: .4 }));
      tremor(C, 19.86, 16);
      S.style.transformOrigin = "781px 590px";
      raiz(S, trans.entraFundo(18.18, { d: .4 }), [[20.92, { s: 1, o: 1, b: 0 }], [21.16, { s: 6, o: 0, b: 8 }, "inExpo"]]);
    } });

  cenaV({ id: "c12", vis: [20.96, 24.16], nome: "14 países", inicio: 21.1, fim: 24.0, descricao: "Globo 3D de pontos girando; um mostrador de 14 segmentos acende em volta (sem marcar países).",
    sfx: [["whoosh", 21.0, .8], ["swell", 21.1, .4], ...Array.from({ length: 14 }, (_, i) => ["tick", +(22.14 + i * .055).toFixed(3), .35 + i * .02]), ["blip", 22.90, .8], ["swoosh", 23.86, .8]],
    montar(S) {
      bg(S, CV);
      mundo(S, 20.96, 24.0, t => camera([0, 1.2, -13.5 + P(t, 21.0, 24, "sine") * 1.2], [0, 0, 0], 70, 0, 540, 1100), (g, K, t) => {
        brilho(g, K, [0, 0, 0], 9, .22);
        globo(g, K, [0, 0, 0], 4.2, 1400, t * .45, t);
      });
      const s = svg(S, 1080, 1080, "position:absolute;left:0;top:560px;overflow:visible"), cx = 540, cy = 540, R1 = 470;
      for (let i = 0; i < 14; i++) {
        const a0 = -90 + i * (360 / 14) + 2, a1 = a0 + 360 / 14 - 4, r = a => [cx + Math.cos(a * Math.PI / 180) * R1, cy + Math.sin(a * Math.PI / 180) * R1];
        const [x0, y0] = r(a0), [x1, y1] = r(a1);
        const sg = path(s, `M${x0} ${y0} A${R1} ${R1} 0 0 1 ${x1} ${y1}`, { fill: "none", stroke: "rgba(138,143,152,.35)", "stroke-width": 16 });
        MDS.at(22.14 + i * .055, on => { sg.setAttribute("stroke", on ? AM : "rgba(138,143,152,.35)"); });
      }
      s.style.transformOrigin = "540px 540px"; anim(s, [[21.0, { o: 0, s: .8, r: -40 }], [21.5, { o: 1, s: 1, r: 0 }, "expo"]]);
      raiz(S, trans.entraZoom(20.96, { s: .35, d: .4 }), trans.chicoteSai(23.84, { dir: 1, d: .3 }));
    } });

  const LAT = (() => { const r = rng(41), a = []; for (let i = 0; i < 125; i++) a.push({ p: [(r() - .5) * 13, .8 + r() * 6, (r() - .5) * 13], ph: r() * 6.28, gx: (i % 5 - 2) * 1.5, gy: 2.6 + (Math.floor(i / 5) % 5 - 2) * 1.5, gz: (Math.floor(i / 25) - 2) * 1.5 }); return a; })();
  const VIZ = LAT.map(q => [[1.5, 0, 0], [0, 1.5, 0], [0, 0, 1.5]].map(d => LAT.find(o => Math.abs(o.gx - q.gx - d[0]) < .1 && Math.abs(o.gy - q.gy - d[1]) < .1 && Math.abs(o.gz - q.gz - d[2]) < .1)).filter(Boolean));
  const posLat = (q, t) => {
    const w = [q.p[0] + Math.sin(t * 1.2 + q.ph) * .8, q.p[1] + Math.cos(t * .9 + q.ph) * .5, q.p[2] + Math.sin(t + q.ph * 2) * .8];
    const p = P(t, 25.70, 26.05), giro = Math.max(0, (t - 25.7) * .5);
    const gp = V.rotY([q.gx, q.gy - 2.6, q.gz], giro); const lat = V.mix(w, [gp[0], gp[1] + 2.6, gp[2]], p);
    return V.mix(lat, [0, 2.6, 0], P(t, 26.45, 27.0, "in"));
  };
  cenaV({ id: "c13", vis: [23.9, 26.72], nome: "Agentes coordenados", inicio: 24.0, fim: 26.7, descricao: "Enxame solto em 3D se encaixa numa malha cúbica que gira; a câmera orbita.",
    sfx: [["swoosh", 23.92, .8], ["blip", 24.3, .35], ["swell", 25.0, .3], ["click", 25.70], ["flip", 25.72, .6], ["tick", 25.78, .5], ["whoosh", 26.46, .7]],
    montar(S) {
      bg(S, CV);
      mundo(S, 23.9, 26.7, t => orbita([0, 0, 0], 10 + (t - 24) * 14, 15, 6.5, 50, 0, 2.6), (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2 });
        const p = P(t, 25.70, 26.05);
        if (p > .9) { g.strokeStyle = `rgba(255,210,31,${.16 * (1 - P(t, 26.45, 26.7))})`; g.lineWidth = 1.2; LAT.forEach((q, i) => { const a = posLat(q, t); VIZ[i].forEach(b => seg(g, K, a, posLat(b, t))); }); }
        LAT.map(q => ({ q, pos: posLat(q, t) })).map(o => ({ ...o, z: V.dot(V.sub(o.pos, K.pos), K.f) })).sort((a, b) => b.z - a.z)
          .forEach(o => agente(g, K, o.pos, p > .5 ? V.rotY([1, 0, 0], Math.max(0, (t - 25.7) * .5)) : [Math.cos(t + o.q.ph), 0, Math.sin(t + o.q.ph)], 1.5, p > .98 ? AM : "#FFE680", P(t, 23.95, 24.3)));
      });
      raiz(S, trans.chicoteEntra(23.92, { dir: 1, d: .38 }));
    } });

  const CIRC16 = Array.from({ length: 16 }, (_, i) => i / 16 * 6.2832);
  cenaV({ id: "c14", vis: [26.7, 28.62], nome: "Artex", inicio: 26.7, fim: 28.5, descricao: "A malha implode num cubo 3D de arestas acesas; o cubo liga e manda fios com pulsos aos agentes. A câmera entra no cubo.",
    sfx: [["whoosh", 26.76, .6], ["swell", 27.30, .4], ["blip", 27.58, .8], ["glitch", 27.64, .7], ["pop", 27.70, .5], ["tick", 27.95, .5], ["whoosh", 28.30, .8]],
    montar(S) {
      bg(S, CV);
      const camC = trilha([[26.7, { pos: [8.8, 6.9, -12.2], alvo: [0, 2.6, 0] }], [28.1, { pos: [4.5, 4.4, -8.2], alvo: [0, 2.6, 0] }, "inOut"], [28.55, { pos: [0, 2.6, -.2], alvo: [0, 2.6, 4] }, "inExpo"]]);
      const W = mundo(S, 26.7, 28.6, camC, (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2 });
        if (t < 27.05) LAT.forEach(q => agente(g, K, posLat(q, t), [1, 0, 0], 1.4, AM, 1 - P(t, 26.8, 27.05)));
        const e = P(t, 26.86, 27.2, "back"), on = t >= 27.64, s = 2.4 * Math.max(.01, e) * (on ? 1 + .1 * (1 - P(t, 27.64, 27.9, "out")) : 1);
        if (e > 0) caixa(g, K, [0, 2.6, 0], [s, s, s], on ? ["#3A3420", "#2A2618", "#332D1C"] : ["#2A2826", "#1C1B19", "#232120"], AM, on ? 4 : 2);
        if (on) {
          const p = P(t, 27.64, 28.1);
          CIRC16.forEach((a0, i) => {
            const a = a0 + t * .2, pos = [Math.cos(a) * 6.2 * p, 2.6 + Math.sin(i * 1.7) * 1.2 * p, Math.sin(a) * 6.2 * p];
            g.strokeStyle = `rgba(255,210,31,${.45 * p})`; g.lineWidth = 2; seg(g, K, [0, 2.6, 0], pos, 3);
            ponto3(g, K, V.mix([0, 2.6, 0], pos, (t * 1.5 + i * .13) % 1), .08, "#FFF2B8", .9);
            agente(g, K, pos, [Math.cos(a), 0, Math.sin(a)], 1.6, AM, 1);
          });
          brilho(g, K, [0, 2.6, 0], 4, .5 * (1 - P(t, 27.64, 28.2, "out")) + .15);
        }
      });
      const lb = h("div", "abs rot", S, null, `color:${AC};white-space:nowrap;translate:-50% 0`); typeText(lb, "FERRAMENTA", 26.76, 34); ancora(W, lb, [0, 4.4, 0], 0, -30, 26.7, 28.3);
      MDS.at(28.25, on => { lb.style.visibility = on ? "hidden" : "visible"; });
    } });

  cenaV({ id: "c15", vis: [28.5, 31.96], nome: "Modelo DeepSeek", inicio: 28.5, fim: 31.9, descricao: "Dentro do cubo: carrossel 3D de cartões; para em MODELO DEEPSEEK; os outros ficam sob tarja.",
    sfx: [["whoosh", 28.52, .8], ["swoosh", 28.70, .5], ["click", 29.18], ["swell", 29.20, .5], ["swoosh", 30.34, .45], ["swoosh", 30.52, .4], ["swell", 31.6, .3]],
    montar(S) {
      bg(S, "#0F0E0D");
      mundo(S, 28.5, 31.9, t => camera([0, 0, -5.8 + P(t, 28.5, 31.9, "sine") * .8], [0, 0, 1], 70, (t - 28.5) * 1.2), (g, K) => {
        g.strokeStyle = "rgba(255,210,31,.22)"; g.lineWidth = 2;
        const s = 6, v = [[-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s], [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]];
        [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, b]) => seg(g, K, v[a], v[b], 10));
        g.strokeStyle = "rgba(138,143,152,.10)"; for (let i = -s; i <= s; i += 1.5) { seg(g, K, [i, -s, -s], [i, -s, s], 8); seg(g, K, [-s, -s, i], [s, -s, i], 8); }
      });
      const scn = h("div", "abs", S, null, "left:540px;top:1000px;width:0;height:0;perspective:1500px");
      const anelC = h("div", "abs", scn, null, "left:0;top:0;transform-style:preserve-3d");
      const N = 6, Rz = 720;
      for (let i = 0; i < N; i++) {
        const cd = h("div", "card", anelC, null, `left:-320px;top:-110px;width:640px;height:220px;transform:rotateY(${i * 360 / N}deg) translateZ(${Rz}px);backface-visibility:hidden;background:#1E1C1A`);
        if (i === 0) {
          txt(cd, 40, 34, F(22, 600, AC, ".16em"), "MODELO");
          const tt = txt(cd, 44, 86, F(80, 700), "DEEPSEEK");
          MDS.at(29.18, on => { tt.style.color = on ? AM : "#fff"; cd.style.borderColor = on ? AM : "#34312E"; cd.style.boxShadow = on ? "0 0 0 2px rgba(255,210,31,.3),0 30px 90px -10px rgba(255,210,31,.35)" : ""; });
        } else {
          [[40, 44, 260], [40, 100, 400]].forEach(([x, y, w], k) => { const b = h("div", "abs", cd, null, `left:${x}px;top:${y}px;width:${w - i * 12}px;height:${k ? 36 : 24}px;background:#000;transform-origin:0 50%`); anim(b, [[30.34 + i * .03, { sx: 0 }], [30.6 + i * .03, { sx: 1 }, "out5"]]); });
        }
      }
      fx(t => { if (t < 28.3 || t > 32.2) return; const a = t < 29.18 ? lerp(-540, 0, EASE.out5(clamp((t - 28.5) / .68))) : Math.sin((t - 29.18) * .9) * 6; anelC.style.transform = `translateZ(-${Rz}px) rotateX(-8deg) rotateY(${a.toFixed(2)}deg)`; });
      raiz(S, [[28.5, { s: .6, o: 0, b: 10 }], [28.7, { s: 1, o: 1, b: 0 }, "expo"]]);
      trans.flash(31.88, { cor: AM, d: .25, z: 96, pico: .9 });
    } });

  cenaV({ id: "c16", vis: [31.9, 33.32], nome: "O mais preocupante", inicio: 31.9, fim: 33.2, descricao: "Fitas de alerta em planos diferentes cruzam na frente e atrás da câmera; respiro de tensão.",
    sfx: [["riser", 31.92, .9], ["swell", 31.95, .4], ["swoosh", 32.7, .5], ["whoosh", 33.08, .8]],
    montar(S) {
      bg(S, "#0B0A09"); const C = cam(S, 31.9, 33.3, { s1: 1.12 });
      const faixa = (y, r, sc, dir, b) => { const f = h("div", "abs", C, null, `left:-700px;width:2480px;top:${y}px;height:${Math.round(120 * sc)}px;background:repeating-linear-gradient(45deg,${AM} 0 ${44 * sc}px,${TK} ${44 * sc}px ${88 * sc}px);transform:rotate(${r}deg);filter:blur(${b}px)`); anim(f, [[31.9, { x: dir * 400, o: 0 }], [32.05, { o: .95 }, "lin"], [33.3, { x: -dir * 400 }, "lin"]]); return f; };
      faixa(380, -16, .7, 1, 2); faixa(1350, -10, .6, -1, 3);
      const w = txtC(C, 900, F(62, 600, "#fff", ".08em"), "O MAIS PREOCUPANTE"); bate(w, 32.10, 1.2, 10, .3);
      const perto = h("div", "abs", C, null, `left:-700px;width:2480px;top:700px;height:290px;background:repeating-linear-gradient(45deg,${AM} 0 106px,${TK} 106px 212px);transform:rotate(14deg);filter:blur(10px)`);
      anim(perto, [[32.66, { x: 1700, o: .95 }], [33.3, { x: -1900 }, "in"]]);
    } });

  cenaV({ id: "c17", vis: [33.08, 36.04], nome: "Os alvos", inicio: 33.2, fim: 35.9, descricao: "Prédio genérico extrudado em 3D; três lasers de mira travam nele.",
    sfx: [["hit", 33.42, .4], ["tick", 33.44, .7], ["click", 33.56, .5], ["glitch", 34.18, .35], ["swoosh", 34.18, .5], ["glitch", 34.96, .3], ["swoosh", 35.40, .5], ["whoosh", 35.70, .7]],
    montar(S) {
      bg(S, CV);
      const camP = trilha([[33.0, { pos: [-9, 6, -13], alvo: [0, 2.2, 0], fov: 46 }], [35.6, { pos: [-3, 4.6, -11], alvo: [0, 2.4, 0], fov: 46 }, "sine"], [36.0, { pos: [-2, 16, -9], alvo: [0, 0, 3], fov: 46 }, "inExpo"]]);
      const fontes = [[-14, 9, 6], [12, 7, -6], [2, 14, 12]], lt = [33.42, 34.96, 35.40];
      mundo(S, 33.08, 36.0, camP, (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2 });
        const sobe = Math.max(.01, P(t, 33.2, 33.7, "back"));
        const itens = [[7, .5, 4, 0, .25, 0], [6.2, .3, 3.4, 0, .65, 0]];
        [-2.4, -1.2, 0, 1.2, 2.4].forEach(x => itens.push([.5, 3, .5, x, 2.3, -1.1]));
        itens.push([6.6, .4, 3.8, 0, 4, 0]);
        itens.map(i => ({ i, z: V.dot(V.sub([i[3], i[4] * sobe, i[5]], K.pos), K.f) })).sort((a, b) => b.z - a.z).forEach(({ i }) => caixa(g, K, [i[3], i[4] * sobe, i[5]], [i[0], i[1] * sobe, i[2]], ["#2A2826", "#1C1B19", "#232120"], AM, 2));
        const topo = [[-3.4, 4.2 * sobe, -1.9], [3.4, 4.2 * sobe, -1.9], [0, 5.6 * sobe, -1.9]]; g.fillStyle = "#2A2826"; g.strokeStyle = AM; g.lineWidth = 2; g.beginPath(); topo.forEach((p, i) => { const q = K.P(p); if (q) i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath(); g.fill(); g.stroke();
        fontes.forEach((f, i) => { const p = P(t, lt[i], lt[i] + .25, "out"); if (p <= 0) return; g.strokeStyle = "rgba(255,210,31,.85)"; g.lineWidth = 3; seg(g, K, f, V.mix(f, [0, 2.4, 0], p), 6); ponto3(g, K, V.mix(f, [0, 2.4, 0], (t * 1.8 + i * .3) % 1), .12, "#FFF2B8"); if (p >= 1) brilho(g, K, [0, 2.4, 0], 3, .35); });
      });
      raiz(S, [[33.08, { o: 0, b: 12, s: 1.2 }], [33.34, { o: 1, b: 0, s: 1 }, "expo"]]);
    } });

  /* mapa em relevo 3D (América Latina se ergue) · dados de países embutidos pelo montar.py (detecta "MDS.mapa") */
  const LATAM = ["Mexico", "Guatemala", "Belize", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Haiti", "Dominican Rep.", "Puerto Rico", "Jamaica", "Bahamas", "Trinidad and Tobago",
    "Colombia", "Venezuela", "Guyana", "Suriname", "Ecuador", "Peru", "Bolivia", "Brazil", "Paraguay", "Uruguay", "Argentina", "Chile"];
  let GEO = null;
  function geo() {
    if (GEO) return GEO; const topo = (window.MDS_DADOS || {}).paises; if (!topo) return (GEO = []);
    const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
    const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
    const arco = i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    const anelG = idx => { const out = []; idx.forEach((i, k) => { const a = arco(i); out.push(...(k ? a.slice(1) : a)); }); return out; };
    GEO = topo.objects.countries.geometries.map(g => ({ nome: g.properties.name, aneis: g.type === "Polygon" ? [anelG(g.arcs[0])] : g.type === "MultiPolygon" ? g.arcs.map(p => anelG(p[0])) : [] }))
      .map(c => ({ ...c, aneis: c.aneis.filter(r => r.some(([lon, lat]) => lon > -125 && lon < -25 && lat > -58 && lat < 50) && r.every(([lon]) => lon < -10)).map(r => r.filter((p, i) => i % 2 === 0).map(p => [(p[0] + 65) / 7, (p[1] + 10) / 7])) }))
      .filter(c => c.aneis.length);
    return GEO;
  }
  cenaV({ id: "c18", vis: [35.86, 38.08], nome: "América Latina", inicio: 35.9, fim: 37.9, descricao: "Mapa inclinado; a América Latina se ergue em relevo amarelo numa onda, com varredura.",
    sfx: [["whoosh", 35.92, .8], ["swell", 36.6, .6], ["glitch", 36.74, .3], ["swoosh", 36.80, .5], ["blip", 37.10, .5], ["swoosh", 37.70, .8]],
    montar(S) {
      bg(S, CV);
      const camM = trilha([[35.86, { pos: [0, 22, -8], alvo: [0, 0, 1] }], [36.7, { pos: [-1, 12.5, -11], alvo: [0, 0, 0] }, "inOutExpo"], [37.9, { pos: [-2, 11.5, -10.5], alvo: [0, 0, 0] }, "sine"]]);
      mundo(S, 35.86, 37.9, t => { const k = camM(t); return camera(k.pos, V.add(k.pos, V.mul(k.f, 10)), 50, 0, 540, 1150); }, (g, K, t) => {
        const lista = [];
        for (const c of geo()) { const la = LATAM.includes(c.nome); for (const r of c.aneis) { const cz = r.reduce((s, p) => s + p[1], 0) / r.length, cx = r.reduce((s, p) => s + p[0], 0) / r.length; lista.push({ la, r, cz, z: V.dot(V.sub([cx, 0, cz], K.pos), K.f) }); } }
        lista.sort((a, b) => b.z - a.z);
        for (const o of lista) {
          const d = 36.74 + (7 - o.cz) * .05, hh = o.la ? .55 * P(t, d, d + .45, "back") : 0;
          if (hh > .01) prisma(g, K, o.r, 0, hh, AM, "#8F7500");
          else { const pts = o.r.map(([x, z]) => K.P([x, 0, z])); if (pts.some(q => !q)) continue; g.fillStyle = o.la ? "#3A3630" : "#262422"; g.strokeStyle = CV; g.lineWidth = 1.5; g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fill(); g.stroke(); }
        }
        if (t >= 36.74 && t < 37.5) { const zz = lerp(9, -9, P(t, 36.74, 37.4, "inOut")); g.strokeStyle = "rgba(255,240,180,.9)"; g.lineWidth = 4; seg(g, K, [-14, .7, zz], [14, .7, zz], 12); }
      });
    } });

  cenaV({ id: "c19", vis: [37.70, 39.92], nome: "Confirmado", inicio: 37.9, fim: 39.8, descricao: "Página do relatório desliza sobre a mesa; CONFIRMADO bate com respingo de tinta.",
    sfx: [["swoosh", 37.74, .8], ["flip", 37.80, .5], ["hit", 38.60, .4], ["whoosh", 39.64, .6]],
    montar(S) {
      mesa(S); const C = cam(S, 37.7, 39.9, { s0: 1.02, s1: 1.1, r0: 1, r1: -1 });
      const { pg, sp } = relatorio(C, 150, 400, 780, 1060); marca(sp, 37.4);
      anim(pg, [[37.70, { y: -1500, r: 6 }], [38.10, { y: 0, r: -2 }, "expo"]]);
      carimbo(pg, "CONFIRMADO", 120, 620, 38.60, -11); respingo(pg, 390, 660, 38.60);
      tremor(pg, 38.60, 16);
      raiz(S, [[39.62, { s: 1, o: 1 }], [39.9, { s: .12, o: 0 }, "inExpo"]]);
    } });

  const altoNove = (i, t) => { const k = NOVE.indexOf(i); return k < 0 ? 0 : 1.4 * P(t, 39.86 + k * .08, 40.2 + k * .08, "back"); };
  const acNove = i => { const k = NOVE.indexOf(i); return k < 0 ? 1e9 : 39.86 + k * .08; };
  cenaV({ id: "c20", vis: [39.66, 42.0], nome: "Nove invasões", inicio: 39.8, fim: 41.98, descricao: "Na grade dos 200, nove cubos se erguem e acendem; o placar vira para 9.",
    sfx: [["swell", 39.70, .4], ...NOVE.map((_, k) => ["tick", +(39.86 + k * .08).toFixed(2), .4 + k * .04]), ["pop", 40.48, .9], ["swell", 40.5, .4]],
    montar(S) {
      bg(S, CV);
      mundo(S, 39.66, 41.98, t => camIso(t, -10, 4, 1250), (g, K, t) => desenhaG200(g, K, t, acNove, altoNove));
      placar(S, 400, 640, 1, t => t >= 40.48 ? 9 : t >= 39.86 ? Math.min(8, Math.floor((t - 39.86) / .08) + 1) : 0, { w: 280, hh: 380 });
      raiz(S, trans.entraFundo(39.66, { d: .38 }));
    } });

  /* ---------- a virada ---------- */
  cenaV({ id: "c21", vis: [41.96, 44.0], nome: "Um detalhe", inicio: 41.98, fim: 43.9, descricao: "Tudo congela sem cor; uma lupa varre a grade e amplia um cubo; mergulho na lente. MAS…",
    sfx: [["swell", 41.98, .7], ["glitch", 42.0, .3], ["whoosh", 42.20, .5], ["tick", 42.58, .7], ["whoosh", 43.40, .9]],
    montar(S) {
      bg(S, CV);
      const K0 = camIso(41.98, -10, 4, 1250), alvo = NOVE.slice().sort((x, y) => { const d = i => { const q = K0.P([G200[i].x, 1.4, G200[i].z]); return q ? Math.hypot(q[0] - 540, q[1] - 1250) : 1e9; }; return d(x) - d(y); })[0], cA = G200[alvo];
      const W = mundo(S, 41.96, 43.9, () => K0, (g, K, t) => desenhaG200(g, K, t, acNove, i => NOVE.includes(i) ? 1.4 : 0, true));
      W.c.style.filter = "grayscale(1) brightness(.75)";
      const qA = K0.P([cA.x, 1.4, cA.z]) || [540, 1250];
      const lx = t => { const p = P(t, 42.0, 42.58, "inOutExpo"); return [lerp(-200, qA[0], p), lerp(1600, qA[1], p)]; };
      const lente = h("div", "abs", S, null, `width:360px;height:360px;border-radius:50%;overflow:hidden;border:10px solid ${AM};box-shadow:0 0 0 4px #000,0 30px 80px rgba(0,0,0,.6);background:${CV}`);
      const lc = h("canvas", "abs", lente, null, "left:0;top:0;width:360px;height:360px"); lc.width = 360; lc.height = 360; const lg = lc.getContext("2d");
      fx(t => {
        if (t < 41.9 || t > 44) return; const [x, y] = lx(t); lente.style.left = (x - 180) + "px"; lente.style.top = (y - 180) + "px";
        const K2 = camera(K0.pos, [cA.x, .9, cA.z], 12, 0, 180, 180);
        lg.clearRect(0, 0, 360, 360); desenhaG200(lg, K2, t, acNove, i => NOVE.includes(i) ? 1.4 : 0, false);
      });
      const m = txtC(S, 520, F(300, 700) + ";" + extrude("#3A3836", 8, 0, 2), "MAS…"); bate(m, 41.98, 1.3, 14, .28);
      linha(S, 0, 860, F(60, 400, AC), [["um", 42.48], ["detalhe", 42.58, "color:#fff"], ["importante", 42.88]]).style.cssText += ";left:0;right:0;text-align:center";
      S.style.transformOrigin = `${qA[0]}px ${qA[1]}px`;
      raiz(S, [[43.4, { s: 1 }], [43.92, { s: 9 }, "inExpo"]]);
    } });

  cenaV({ id: "c22", vis: [43.88, 45.86], nome: "Não agiu sozinha", inicio: 43.9, fim: 45.7, descricao: "Dentro da lente: o núcleo IA sozinho, girando; NÃO extrudado bate na frente.",
    sfx: [["swell", 43.9, .4], ["blip", 43.98], ["hit", 45.02, .6], ["whoosh", 45.56, .6]],
    montar(S) {
      bg(S, CV);
      mundo(S, 43.88, 45.7, t => orbita([0, 0, 0], (t - 43.9) * 18, 7.5 + P(t, 43.88, 44.4, "expo") * 1.5, 3.4, 46, 0, 1), (g, K, t) => { piso(g, K, { tam: 24, passo: 2 }); brilho(g, K, [0, .8, 0], 5, .25); nucleo(g, K, t, [0, 0, 0], 1.7, t * .6); });
      linha(S, 0, 250, F(56, 500, AC), [["A", 43.9], ["inteligência", 43.98], ["artificial", 44.44]]).style.cssText += ";left:0;right:0;text-align:center";
      const n = txtC(S, 320, F(330, 700, AM) + ";" + extrude("#8F7500", 12, 0, 2.6), "NÃO"); n.style.transformOrigin = "50% 50%";
      anim(n, [[45.0, { o: 0, s: 2.2, rx: 60 }], [45.03, { o: 1 }, "lin"], [45.2, { s: .94, rx: 0 }, "out5"], [45.32, { s: 1 }, "out"]]);
      tremor(S, 45.02, 16);
      trans.flash(43.86, { cor: AM, d: .3, z: 96 });
    } });

  cenaV({ id: "c23", vis: [45.7, 47.40], nome: "Completamente sozinha", inicio: 45.7, fim: 47.34, descricao: "A câmera recua e revela o operador no mesmo espaço; SOZINHA riscada.",
    sfx: [["whoosh", 45.72, .6], ["swoosh", 46.38, .5], ["tick", 46.40, .5], ["swell", 46.90, .6], ["whoosh", 47.16, .9]],
    montar(S) {
      bg(S, CV);
      const camR = trilha([[45.7, { pos: [-6, 3.6, -7], alvo: [0, 1, 0] }], [46.9, { pos: [-8, 7, -16], alvo: [2.5, 1, 2] }, "inOutExpo"], [47.34, { pos: [-7, 7, -15.5], alvo: [6, .5, 3] }, "inExpo"]]);
      mundo(S, 45.7, 47.34, camR, (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2 }); nucleo(g, K, t, [0, 0, 0], 1.7, t * .6);
        if (t >= 46.9) { const k = ((t - 46.9) * .9) % 1; anel(g, K, [8, 0, 4], .6 + k * 3, `rgba(255,210,31,${1 - k})`, 3); brilho(g, K, [8, .25, 4], 2.6, P(t, 46.9, 47.1)); ponto3(g, K, [8, .25, 4], .32, AM, P(t, 46.9, 47.0)); }
      });
      linha(S, X, 330, F(98, 600, AC), [["COMPLETAMENTE", 45.74]]);
      const s = linha(S, X - 6, 440, F(196, 700), [["SOZINHA", 46.28]]); risco(s.querySelector(".mask"), 46.42);
    } });

  const OPR = (() => { const r = rng(51); return Array.from({ length: 46 }, (_, i) => { const a = Math.PI * 2 * i / 46 + r() * .1, R2 = 3.2 + r() * 2.2; return { x: 8 + Math.cos(a) * R2, z: 4 + Math.sin(a) * R2, a0: r() * 6.28, d: r() * .14 }; }); })();
  cenaV({ id: "c24", vis: [47.18, 49.5], nome: "O operador humano", inicio: 47.34, fim: 49.4, descricao: "O ponto vira uma silhueta humana; ele aponta e os agentes giram juntos naquela direção.",
    sfx: [["blip", 47.82], ["swell", 47.84, .4], ["glitch", 47.86, .25], ["swoosh", 48.54, .8], ["swoosh", 48.64, .5], ["swoosh", 48.74, .35], ["whoosh", 49.30, .7]],
    montar(S) {
      bg(S, CV);
      const camO = t => orbita([8, 0, 4], -25 + (t - 47.34) * 10, 11 - P(t, 47.34, 49.4, "inOut") * 1.5, 5.6, 48, 0, 1.4);
      const W = mundo(S, 47.18, 49.4, camO, (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2, cx: 8, cz: 4 });
        const alvo = -.6;
        OPR.map(q => ({ q, z: V.dot(V.sub([q.x, .4, q.z], K.pos), K.f) })).sort((a, b) => b.z - a.z).forEach(({ q }) => {
          const p = P(t, 48.54 + q.d, 48.9 + q.d), ang = lerp(q.a0, alvo, p);
          if (p > 0) { g.strokeStyle = `rgba(255,210,31,${.25 * p})`; g.lineWidth = 1.5; seg(g, K, [8, 1.6, 4], [q.x, .4, q.z], 2); }
          agente(g, K, [q.x, .4, q.z], [Math.cos(ang), 0, Math.sin(ang)], 1.6, p > .95 ? AM : "#FFE680", P(t, 47.4, 47.8));
        });
        const f = P(t, 47.80, 48.2, "back"); brilho(g, K, [8, 1.2, 4], 3.4, .6);
        if (f <= .02) { ponto3(g, K, [8, .25, 4], .32, AM); return; }
        const cab = K.P([8, 2.55 * f + .2, 4]), om = K.P([8, 1.6 * f + .1, 4]), pe = K.P([8, 0, 4]); if (!cab || !om || !pe) return;
        const s = cab[2];
        g.fillStyle = AM; g.beginPath(); g.arc(cab[0], cab[1], .42 * s, 0, 6.28); g.fill();
        g.beginPath(); g.moveTo(om[0] - .75 * s, pe[1]); g.bezierCurveTo(om[0] - .75 * s, om[1], om[0] - .3 * s, om[1] - .2 * s, om[0], om[1] - .2 * s); g.bezierCurveTo(om[0] + .3 * s, om[1] - .2 * s, om[0] + .75 * s, om[1], om[0] + .75 * s, pe[1]); g.closePath(); g.fill();
        if (t >= 48.4) { const k = P(t, 48.4, 48.6); g.strokeStyle = AM; g.lineWidth = .16 * s; g.lineCap = "round"; g.beginPath(); g.moveTo(om[0] + .5 * s, om[1] + .2 * s); g.lineTo(om[0] + .5 * s + 1.1 * s * k, om[1] + .2 * s - .5 * s * k); g.stroke(); }
      });
      const lb = h("div", "abs rot", S, null, `color:${AM};white-space:nowrap;translate:-50% 0`); typeText(lb, "OPERADOR HUMANO", 47.82, 34); ancora(W, lb, [8, 0, 4], 0, 24);
      raiz(S, trans.chicoteEntra(47.2, { dir: 1, d: .36 }), trans.saiParaCima(49.28, { d: .26, dist: 700 }));
    } });

  cenaV({ id: "c25", vis: [49.28, 51.96], nome: "Decisões estratégicas", inicio: 49.4, fim: 51.94, descricao: "Galhos de decisão crescem em direção à câmera; um cursor clica num; os outros se desfazem.",
    sfx: [["swoosh", 49.30, .6], ["pop", 49.50, .4], ["click", 49.76], ["send", 49.82, .6], ["glitch", 50.46, .4], ["swoosh", 50.50, .5], ["flip", 51.80, .6]],
    montar(S) {
      bg(S, CV);
      const camD = t => camera([0, 6.5, -13 + P(t, 49.3, 51.9, "sine") * 1.5], [0, 2.2, 1.5], 50, P(t, 51.6, 51.94, "in") * 90);
      const ramos = [[-2.9, 3.6, -1.5], [0, 2.4, -2.5], [2.9, 3.2, -1.2]], base = [0, 1.5, 5];
      const r = rng(77), parts = Array.from({ length: 60 }, () => ({ k: r(), dx: (r() - .5) * 1.2, dy: -r() * 2, dz: (r() - .5) * 1.2 }));
      const W = mundo(S, 49.28, 51.94, camD, (g, K, t) => {
        piso(g, K, { tam: 30, passo: 2 });
        ponto3(g, K, base, .3, AM); brilho(g, K, base, 2.2, .7);
        ramos.forEach((e, i) => {
          const p = P(t, 49.40 + i * .06, 49.78 + i * .06, "out"), ctrl = [e[0] * .4, 3.6, 2.4];
          const pt = u => V.mix(V.mix(base, ctrl, u), V.mix(ctrl, e, u), u);
          const morto = i !== 1 && t >= 50.46, d = P(t, 50.46, 51.1, "out"), sel1 = i === 1 && t >= 49.76;
          if (!morto) { g.strokeStyle = sel1 ? AM : "#fff"; g.lineWidth = sel1 ? 7 : 4; g.beginPath(); let f = true; for (let u = 0; u <= p + 1e-6; u += .04) { const q = K.P(pt(u)); if (!q) continue; f ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); f = false; } g.stroke(); if (p >= 1) caixa(g, K, e, [1.3, .9, .9], sel1 ? [AM, "#B89600", "#8F7500"] : ["#3A3836", "#262422", "#2E2C29"], sel1 ? AM : "#fff", 2); }
          else for (const q of parts) { const pp = pt(q.k), w = [pp[0] + q.dx * d, pp[1] + q.dy * d * d, pp[2] + q.dz * d]; ponto3(g, K, w, .07, "#fff", 1 - d); }
        });
      });
      const cur = svg(S, 60, 80, "position:absolute;left:0;top:0;overflow:visible"); path(cur, "M0 0 L0 62 L16 48 L28 74 L40 68 L28 43 L48 43 Z", { fill: "#fff", stroke: TK, "stroke-width": 3 });
      fx(t => { if (t < 49.2 || t > 52) return; const q = W.K.P(ramos[1]) || [540, 900]; const p = P(t, 49.30, 49.72, "expo"); cur.style.left = lerp(820, q[0], p) + "px"; cur.style.top = lerp(1560, q[1], p) + "px"; cur.style.transform = `scale(${t >= 49.76 && t < 49.86 ? .82 : 1})`; cur.style.opacity = t > 51.5 ? 0 : 1; });
      raiz(S, trans.entraDeBaixo(49.28, { d: .34, dist: 700 }));
    } });

  /* ---------- o novo cenário ---------- */
  cenaV({ id: "c26", vis: [51.94, 54.42], nome: "Muda o cenário", inicio: 51.94, fim: 54.32, descricao: "A câmera completa a rolagem de 180°: o piso vira teto. CIBERSEGURANÇA bate em 3D.",
    sfx: [["whoosh", 51.96, .9], ["swoosh", 52.22, .6], ["boom", 53.16, .45], ["swell", 54.2, .4]],
    montar(S) {
      bg(S, "#0E0D0C");
      mundo(S, 51.94, 54.32, t => camera([0, 6.5, -11.5 + (t - 51.94) * 1.2], [0, 2.2, 1.5], 54, lerp(90, 180, P(t, 51.94, 52.7, "expo"))), (g, K) => { piso(g, K, { tam: 40, passo: 2, cor: "rgba(138,143,152,.26)" }); piso(g, K, { tam: 40, passo: 8, cor: "rgba(255,210,31,.10)", lw: 3 }); });
      linha(S, 0, 760, F(92, 600), [["MUDA", 52.20], ["O", 52.60], ["CENÁRIO", 52.68]]).style.cssText += ";left:0;right:0;text-align:center";
      const w = txtC(S, 900, F(98, 700, AM) + ";" + extrude("#8F7500", 8, 0, 2), "CIBERSEGURANÇA"); w.style.transformOrigin = "50% 50%";
      anim(w, [[53.14, { o: 0, s: 1.6, rx: -70 }], [53.17, { o: 1 }, "lin"], [53.40, { s: 1, rx: 0 }, "out5"]]);
      tremor(S, 53.16, 16);
      raiz(S, [[54.18, { o: 1, b: 0 }], [54.4, { o: 0, b: 16 }, "in"]]);
    } });

  cenaV({ id: "c27", vis: [54.24, 56.36], nome: "Um grupo pequeno", inicio: 54.32, fim: 56.3, descricao: "AGORA entra e sai; três pontos pequenos num espaço enorme.",
    sfx: [["swoosh", 54.50, .7], ["swell", 54.52, .4], ["blip", 55.52, .8], ["blip", 55.60, .7], ["blip", 55.68, .6]],
    montar(S) {
      bg(S, "#0B0A09"); const C = cam(S, 54.2, 56.4, { s1: 1.1 });
      const ag = txtC(C, 820, F(170, 700) + ";" + extrude("#2E2C29", 6, 0, 2), "AGORA"); anim(ag, [[54.52, { o: 0, s: 1.3, b: 16 }], [54.56, { o: 1 }, "lin"], [54.8, { s: 1, b: 0 }, "out5"], [55.05, { o: 1, s: 1 }], [55.3, { o: 0, s: .6, b: 10 }, "in"]]);
      [[500, 920, 55.52], [575, 895, 55.60], [545, 975, 55.68]].forEach(([x, y, t]) => { const d = h("div", "abs", C, null, `left:${x - 9}px;top:${y - 9}px;width:18px;height:18px;border-radius:50%;background:${AM};box-shadow:0 0 30px 6px rgba(255,210,31,.55)`); anim(d, [[t - .01, { o: 0, s: 3 }], [t + .02, { o: 1 }, "lin"], [t + .3, { s: 1 }, "back"]]); });
      linha(C, 0, 1120, F(44, 500, AC, ".1em"), [["UM", 55.16], ["GRUPO", 55.32], ["PEQUENO", 55.52, `color:${AM}`]]).style.cssText += ";left:0;right:0;text-align:center";
    } });

  const TUN = (() => { const r = rng(61); return Array.from({ length: 900 }, (_, i) => ({ k: i % 3, ang: r() * 6.28, sp: 2 + r() * 9, ph: r() * 40, rr: .8 + r() * 2.8 })); })();
  const SEM = [[-.35, 0, 0], [.35, .2, 0], [0, -.4, 0]];
  cenaV({ id: "c28", vis: [56.26, 57.95], nome: "Coordenar", inicio: 56.3, fim: 57.9, descricao: "Dos três pontos explode o enxame, que vira três correntes passando pela câmera num túnel 3D.",
    sfx: [["whoosh", 56.28], ["whoosh", 56.34, .6], ["swoosh", 56.42, .5], ["blip", 56.82, .6], ["swoosh", 57.20, .4], ["riser", 57.40, .9]],
    montar(S) {
      bg(S, "#0B0A09");
      mundo(S, 56.26, 57.9, t => camera([0, 0, -6], [0, 0, 10], 60, (t - 56.3) * 20), (g, K, t) => {
        const p = P(t, 56.30, 56.9), q = P(t, 56.8, 57.6, "inOut");
        for (const a of TUN) {
          const s = SEM[a.k], ex = [s[0] + Math.cos(a.ang) * a.sp * p * .5, s[1] + Math.sin(a.ang) * a.sp * p * .5, s[2] + (a.sp - 5) * p * .3];
          const z = 30 - ((a.ph + t * 14) % 36), ca = a.k * 2.09 + z * .12 + t, tu = [Math.cos(ca) * a.rr, Math.sin(ca) * a.rr, z];
          agente(g, K, V.mix(ex, tu, q), V.mix([Math.cos(a.ang), Math.sin(a.ang), 0], [0, 0, -1], q), 1.1, a.k === 1 ? AM : "#FFE680", .95);
        }
      });
      const w = txt(S, X, 1300, F(130, 700) + ";" + extrude("#2E2C29", 6, 0, 2), ""); "COORDENAR".split("").forEach((c, i) => tipo.palavra(w, c, 56.30 + i * .03, { size: 130, d: .4 }));
    } });

  cenaV({ id: "c29", vis: [57.88, 59.8], nome: "Escala muito maior", inicio: 57.9, fim: 59.74, descricao: "Recuo extremo: o enxame cobre o globo 3D; MAIOR cresce e atravessa a câmera.",
    sfx: [["hit", 58.90, .9], ["whoosh", 59.40, .7], ["swoosh", 59.60, .5]],
    montar(S) {
      bg(S, "#0B0A09");
      mundo(S, 57.88, 59.74, t => camera([0, 1.5, lerp(-6.2, -15, P(t, 57.88, 59.74, "out"))], [0, 0, 0], 50, -8), (g, K, t) => { brilho(g, K, [0, 0, 0], 9, .2); globo(g, K, [0, 0, 0], 4.2, 2200, t * .5, t, { cobertura: P(t, 57.9, 59.0, "out") }); });
      linha(S, X, 330, F(90, 600), [["ESCALA", 58.18]]);
      linha(S, X, 440, F(60, 500, AC), [["MUITO", 58.54]]);
      const m = txtC(S, 860, F(280, 700, AM) + ";" + extrude("#8F7500", 10, 0, 2.4), "MAIOR");
      anim(m, [[58.88, { o: 0, s: 1.6, b: 20 }], [58.92, { o: 1 }, "lin"], [59.1, { s: 1, b: 0 }, "out5"], [59.74, { s: 4.4 }, "inExpo"]]);
      MDS.at(59.5, on => { m.style.color = on ? "#fff" : AM; });
      tremor(S, 58.9, 14);
      trans.flash(59.74, { cor: PP, d: .3, z: 96 });
    } });

  cenaV({ id: "c30", vis: [59.72, 61.76], nome: "A pergunta", inicio: 59.74, fim: 61.6, descricao: "Folha da conclusão inclinada na mesa; A PERGUNTA NÃO É MAIS datilografa.",
    sfx: Array.from({ length: 20 }, (_, i) => ["key", +(59.84 + i / 14).toFixed(3), .8]),
    montar(S) {
      mesa(S); const C = cam(S, 59.7, 61.7, { s0: 1.06, s1: 1.12, x0: 30, x1: -30 });
      const pg = h("div", "pagina", C, null, "left:70px;top:330px;width:940px;height:1240px;transform-origin:50% 100%"); anim(pg, [[59.72, { rx: 24, y: 120 }], [61.6, { rx: 10, y: 0 }, "sine"]]);
      txt(pg, 56, 56, F(22, 600, AC, ".18em"), "ARQUIVO 02 · CONCLUSÃO");
      const l1 = txt(pg, 56, 220, F(118, 700, TK), ""), l2 = txt(pg, 56, 350, F(118, 700, TK), "");
      typeText(l1, "A PERGUNTA", 59.84, 14); typeText(l2, "NÃO É MAIS", 60.56, 14);
      const car = h("div", "abs", pg, null, `width:14px;height:112px;background:${AM}`);
      fx(t => { if (t < 59.6 || t > 62) return; const on2 = t >= 60.56; car.style.left = (64 + (on2 ? l2.offsetWidth : l1.offsetWidth)) + "px"; car.style.top = (on2 ? 354 : 224) + "px"; car.style.opacity = Math.floor(t * 3) % 2 || t < 61.3 ? 1 : 0; });
      [[56, 640, 700], [56, 696, 560], [56, 752, 640], [56, 808, 420]].forEach(([x, y, w], i) => { const b = h("div", "abs", pg, null, `left:${x}px;top:${y}px;width:${w}px;height:22px;background:${i === 2 ? "rgba(21,21,21,.18)" : TK};transform-origin:0 50%`); anim(b, [[59.9 + i * .1, { sx: 0 }], [60.2 + i * .1, { sx: 1 }, "out5"]]); });
      raiz(S, [[61.44, { y: 0, o: 1 }], [61.74, { y: -500, o: 0 }, "inExpo"]]);
    } });

  cenaV({ id: "c31", vis: [61.42, 64.0], nome: "Se…", inicio: 61.6, fim: 63.94, descricao: "SE gigante; a pergunta antiga é cortada por tarjas; uma tarja cresce e apaga a tela.",
    sfx: [["swoosh", 61.50, .6], ["pop", 61.64, .5], ["pop", 62.64, .4], ["pop", 62.98, .35], ["swoosh", 63.06, .8], ["tick", 63.08, .6], ["whoosh", 63.72, .8]],
    montar(S) {
      mesa(S); const C = cam(S, 61.5, 64.0, { s1: 1.06, r0: -1, r1: 0 });
      const se = txt(C, X - 16, 360, F(420, 700, TK) + ";" + extrude("#C9C5BC", 8, 0, 2.4), "SE"); anim(se, [[61.52, { o: 0, y: 160, rx: 50 }], [61.9, { o: 1, y: 0, rx: 0 }, "expo"]]);
      [["A IA PODE SER", 61.64], ["USADA EM", 62.64], ["ATAQUES?", 62.98]].forEach(([s, t], i) => { const el = txt(C, X, 880 + i * 110, F(92, 600, TK), s); anim(el, IN(t, { dy: 50, d: .35 })); });
      corte(C, X - 10, 900, 760, 70, 63.06); corte(C, X - 10, 1010, 520, 70, 63.12); corte(C, X - 10, 1120, 560, 70, 63.18);
      const tudo = h("div", "abs", S, null, `left:-200px;top:-200px;width:1480px;height:2320px;background:${TK};transform-origin:0 50%`);
      anim(tudo, [[63.66, { sx: 0 }], [63.94, { sx: 1 }, "inOutExpo"]]);
      raiz(S, trans.entraDeBaixo(61.44, { d: .32, dist: 500 }));
    } });

  const VEL = (() => { const r = rng(71); return Array.from({ length: 260 }, () => ({ a: r() * 6.28, rr: 2 + r() * 7, ph: r() * 60, l: 1 + r() * 4, y: r() > .8 })); })();
  const zVel = t => (t - 63.92) * 2 + 34 * Math.pow(Math.max(0, t - 65.6) / 1.9, 3);
  cenaV({ id: "c32", vis: [63.92, 67.6], nome: "Estamos preparados?", inicio: 63.94, fim: 67.6, descricao: "Túnel de velocidade 3D: as palavras emergem do fundo; em «velocidade» a câmera acelera até o limite.",
    sfx: [["swell", 63.96, .4], ["swoosh", 64.36, .4], ["tick", 64.36, .4], ["swoosh", 64.62, .4], ["tick", 64.62, .4], ["swoosh", 65.32, .35], ["riser", 65.40], ["swoosh", 66.34, .6], ["whoosh", 66.58], ["boom", 66.62, .5]],
    montar(S) {
      bg(S, "#0A0908");
      mundo(S, 63.92, 67.6, t => camera([0, 0, zVel(t)], [0, 0, zVel(t) + 10], 64, (t - 64) * 6), (g, K, t) => {
        const zc = zVel(t), sp = 2 + 60 * P(t, 65.6, 67.5, "in");
        for (const q of VEL) {
          const z = zc + 60 - ((q.ph + zc) % 60), a = [Math.cos(q.a) * q.rr, Math.sin(q.a) * q.rr, z], b = [a[0], a[1], z - q.l * (1 + sp * .08)];
          g.strokeStyle = q.y ? `rgba(255,210,31,${.9 * nevoa(z - zc, 2, 60)})` : `rgba(255,255,255,${.5 * nevoa(z - zc, 2, 60)})`; g.lineWidth = q.y ? 3 : 1.6; seg(g, K, a, b, 1);
        }
      });
      const vem = (el, t) => anim(el, [[t - .02, { o: 0, s: .2, b: 14 }], [t, { o: 1 }, "lin"], [t + .4, { s: 1, b: 0 }, "expo"]]);
      const e1 = txtC(S, 560, F(150, 700) + ";" + extrude("#2E2C29", 6, 0, 2), "ESTAMOS"); vem(e1, 64.36);
      const e2 = txtC(S, 720, F(140, 700) + ";" + extrude("#2E2C29", 6, 0, 2), "PREPARADOS"); vem(e2, 64.62);
      linha(S, 0, 900, F(46, 500, AC, ".08em"), [["PARA", 65.32], ["ENFRENTAR", 65.50], ["ATAQUES", 65.92]]).style.cssText += ";left:0;right:0;text-align:center";
      const e3 = txtC(S, 1040, F(120, 600), "NESSA"); vem(e3, 66.34);
      const v = txtC(S, 1180, F(128, 700, AM) + ";" + extrude("#8F7500", 8, 0, 2), "VELOCIDADE?"); anim(v, [[66.58, { o: 0, x: 500, b: 30 }], [66.62, { o: 1 }, "lin"], [66.9, { x: 0, b: 0 }, "out5"], [67.45, { b: 0 }], [67.6, { b: 6 }, "in"]]);
      tremor(S, 66.62, 14);
    } });

  cenaV({ id: "c33", vis: [67.6, 71.2], nome: "Cartela", inicio: 67.6, fim: 71.0, descricao: "A pergunta parada com leve deriva; fonte e assinatura Studio Matteu discretas.",
    sfx: [["swell", 67.62, .3], ["tick", 68.40, .4]],
    montar(S) {
      bg(S, "#0A0908"); const C = cam(S, 67.6, 71.0, { s0: 1.02, s1: 1.0, e: "out" });
      txtC(C, 700, F(140, 700) + ";" + extrude("#2E2C29", 6, 0, 2), "ESTAMOS");
      txtC(C, 860, F(140, 700) + ";" + extrude("#2E2C29", 6, 0, 2), "PREPARADOS<span style='color:" + AM + "'>?</span>");
      const ln = h("div", "abs", C, null, `left:340px;top:1060px;width:400px;height:6px;background:${AM};transform-origin:0 50%`); anim(ln, [[67.7, { sx: 0 }], [68.2, { sx: 1 }, "expo"]]);
      const f = txtC(C, 1130, F(30, 400, AC, ".02em"), "Fonte: relatório da CrowdStrike"); anim(f, IN(67.9, { dy: 20, d: .4 }));
      const sg = txtC(C, 1430, F(30, 600, "rgba(255,255,255,.72)", ".02em"), "Studio Matteu"); anim(sg, IN(68.4, { dy: 20, d: .5 }));
    } });
})();
