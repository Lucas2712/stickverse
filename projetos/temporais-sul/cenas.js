/* Brasil sob temporais · Studio Matteu
 * Direção de arte: "Olho da Tempestade" (aprovada). Céu de tempestade #0E1726, ciano-chuva #36C5F0, magenta-alerta #FF2E93
 * (só núcleos de tempestade e alertas), branco-relâmpago #EAF2FF, névoa #5E6B7D. Inter 4 (Display/Text pelo tamanho óptico).
 * Sistemas globais: céu com nuvens e clarões, chuva, linhas de vento (fio condutor), relâmpagos desenhados,
 * transições-assinatura (relâmpago, rajada, varredura de radar). Mapa próprio em canvas com os dados de países do MDS.mapa
 * (só contornos de países: a Região Sul é uma área aproximada recortada do Brasil; cidades nas coordenadas reais).
 * Motor 3D (câmera, projeção, névoa) reaproveitado de projetos/ia-espionagem/cenas.js.
 * Narração 1,32× e trilha da OpenArt em arranjo de 60 s (aprovadas). Efeitos sonoros: mixagem aprovada à parte (Real SFX).
 */
(() => {
  const { cena, anim, IN, OUT, VIS, h, fx, prog, svg, sel, path, draw, typeText, counter, at, palco, tipo, trans, fundo } = MDS;
  const CEU = "#0E1726", CI = "#36C5F0", MG = "#FF2E93", BR = "#EAF2FF", NV = "#5E6B7D", X = 80;
  const ci = a => `rgba(54,197,240,${a})`, mg = a => `rgba(255,46,147,${a})`, br = a => `rgba(234,242,255,${a})`, nv = a => `rgba(94,107,125,${a})`;
  const clamp = MDS.clamp, lerp = MDS.lerp, EASE = MDS.EASE;
  const P = (t, a, b, e = "expo") => prog(t, a, b, e);
  const rng = seed => { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const TAU = Math.PI * 2;

  /* =================== motor 3D (canvas) · do projeto ia-espionagem =================== */
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
  function anel(g, K, c, r, cor, lw = 3, y = .02) { g.strokeStyle = cor; g.lineWidth = lw; g.beginPath(); let f = true; for (let i = 0; i <= 64; i++) { const a = i / 64 * 6.2832, q = K.P([c[0] + Math.cos(a) * r, y, c[2] + Math.sin(a) * r]); if (!q) { f = true; continue; } f ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); f = false; } g.stroke(); }
  function mundo(p, a, b, camFn, desenhar, css = "") {
    const c = h("canvas", "abs", p, null, `left:0;top:0;width:1080px;height:1920px;${css}`); c.width = 1080; c.height = 1920;
    const g = c.getContext("2d"), W = { K: camFn(a), c, g };
    fx(t => { if (t < a - .9 || t > b + .9) return; W.K = camFn(t); g.clearRect(0, 0, 1080, 1920); desenhar(g, W.K, t); });
    return W;
  }
  // prende um elemento HTML a um ponto 3D (projeta a cada quadro)
  function ancora(W, el, p3, dx = 0, dy = 0, a = -1, b = 1e9) { fx(t => { if (t < a || t > b) return; const q = W.K.P(typeof p3 === "function" ? p3(t) : p3); if (!q) { el.style.left = "-9999px"; return; } el.style.left = (q[0] + dx).toFixed(1) + "px"; el.style.top = (q[1] + dy).toFixed(1) + "px"; }); }

  /* =================== texto e utilidades =================== */
  const bg = (S, c) => h("div", "layer", S, null, `inset:-240px;background:${c}`);
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
  const F = (px, peso = 600, cor = BR, ls) => `font:${peso} ${px}px/1 var(--v-display);letter-spacing:${ls ?? (px >= 120 ? "-.045em" : px >= 60 ? "-.03em" : "-.005em")};color:${cor}`;
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
  const extrude = (cor = "#123A55", n = 8, dx = 0, dy = 2) => "text-shadow:" + Array.from({ length: n }, (_, i) => `${(i + 1) * dx}px ${(i + 1) * dy}px 0 ${cor}`).join(",") + `,0 ${n * dy + 14}px 40px rgba(0,0,0,.6)`;
  const brilhoTxt = (cor = "54,197,240", a = .55) => `text-shadow:0 0 24px rgba(${cor},${a}),0 0 70px rgba(${cor},${a * .5})`;
  const curva = ks => t => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 1; i < ks.length; i++) if (t < ks[i][0]) { const A = ks[i - 1], B = ks[i]; return lerp(A[1], B[1], EASE.sine((t - A[0]) / (B[0] - A[0]))); } return ks[ks.length - 1][1]; };
  const tela = (p, z = 0, css = "") => { const c = h("canvas", "abs", p, null, `left:0;top:0;width:1080px;height:1920px;z-index:${z};${css}`); c.width = 1080; c.height = 1920; return [c, c.getContext("2d")]; };

  /* cena com janela de visibilidade explícita (raiz externa S0) e raiz interna S para entradas, saídas e recortes */
  const cenaV = cfg => cena({ ...cfg, margem: Math.max(.8, cfg.vis[1] - cfg.fim + .3, cfg.inicio - cfg.vis[0] + .3), montar(S0, c) {
    const S = h("div", "layer", S0, null, "transform-origin:540px 960px");
    const [a, b] = cfg.vis; anim(S0, [[a - .001, { o: 0 }], [a, { o: 1 }, "lin"], [b, { o: 1 }], [b + .001, { o: 0 }, "lin"]]);
    cfg.montar(S, c, S0);
  } });

  /* =================== intensidades globais (chuva e vento por tempo) =================== */
  const chuva = curva([[0, .55], [1.6, .42], [9.3, .36], [9.6, .2], [28.6, .2], [29, .32], [39.4, .32], [39.8, .55], [42.9, .55], [43.1, .14], [48.6, .16], [49, .42], [51.5, .5], [55.3, 1], [57.5, .8], [60, .45]]);
  const chuvaFrente = curva([[51.3, 0], [52.2, .3], [55.3, .75], [57.5, .45], [60, .25]]);
  const vento = curva([[0, .7], [1.6, 1], [4.5, 1], [4.9, .5], [34.5, .5], [34.8, 1.25], [37.3, 1.1], [37.6, .5], [44.5, .55], [44.9, 1], [46.2, 1], [46.6, .45], [51.5, .55], [55.4, .8], [60, .45]]);
  const WI = [0]; for (let i = 1; i <= 6200; i++) WI[i] = WI[i - 1] + vento(i / 100) / 100;
  const ventoInt = t => { const x = clamp(t * 100, 0, 6199), i = Math.floor(x); return WI[i] + (WI[i + 1] - WI[i]) * (x - i); };

  /* =================== relâmpagos (lista global) =================== */
  const RAIOS = [];
  const raio = (t, o = {}) => RAIOS.push({ t, x0: 540, y0: -60, x1: 540, y1: 900, seed: Math.floor(t * 100) + 3, w: 1, frente: false, d: .3, luz: 1, sem: false, ...o });
  const luz = t => { let L = 0, x = 540; for (const r of RAIOS) { const u = t - r.t; if (u < 0 || u > r.d + .3) continue; const fl = u < r.d ? (Math.floor(u * 30) % 3 === 1 ? .35 : 1) : 1 - (u - r.d) / .3; const v = fl * r.luz; if (v > L) { L = v; x = r.x0; } } return [L, x]; };
  function bolt(g, r, a) {
    const R = rng(r.seed), n = 16, pts = [[r.x0, r.y0]];
    for (let i = 1; i <= n; i++) { const u = i / n; pts.push([lerp(r.x0, r.x1, u) + (i < n ? (R() - .5) * 150 * r.w : 0), lerp(r.y0, r.y1, u) + (R() - .5) * 26]); }
    const ramos = [];
    for (let k = 0; k < 4; k++) { const i0 = 3 + Math.floor(R() * (n - 6)), dir = R() < .5 ? -1 : 1; let [x, y] = pts[i0]; const rp = [[x, y]]; for (let j = 0; j < 6; j++) { x += dir * (20 + R() * 50) * r.w; y += (30 + R() * 50) * r.w; rp.push([x, y]); } ramos.push(rp); }
    const traco = (ps, lw, cor) => { g.strokeStyle = cor; g.lineWidth = lw; g.beginPath(); ps.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
    g.lineJoin = "round"; g.lineCap = "round";
    traco(pts, 26 * r.w, ci(.16 * a)); traco(pts, 11 * r.w, ci(.38 * a)); ramos.forEach(p => traco(p, 5 * r.w, ci(.3 * a)));
    traco(pts, 3.6 * r.w, br(a)); ramos.forEach(p => traco(p, 1.6 * r.w, br(.85 * a)));
  }

  /* =================== camadas globais =================== */
  // céu: nuvens que derivam + clarão dos relâmpagos (canvas em baixa resolução, ampliado)
  const [ceuC, cg] = (() => { const c = h("canvas", "abs", palco(), null, "left:0;top:0;width:1080px;height:1920px;z-index:0"); c.width = 270; c.height = 480; return [c, c.getContext("2d")]; })();
  const NUV = (() => { const r = rng(5); return Array.from({ length: 12 }, () => ({ x: r() * 340, y: r() * 480, r: 60 + r() * 120, v: 1.5 + r() * 4, a: .3 + r() * .4 })); })();
  fx(t => {
    const gr = cg.createLinearGradient(0, 0, 0, 480); gr.addColorStop(0, "#09101C"); gr.addColorStop(.55, CEU); gr.addColorStop(1, "#132038");
    cg.fillStyle = gr; cg.fillRect(0, 0, 270, 480);
    const [L, lx] = luz(t);
    for (const n of NUV) {
      const x = ((n.x + t * n.v) % 380) - 55, k = L * 110;
      const g2 = cg.createRadialGradient(x, n.y, 0, x, n.y, n.r); g2.addColorStop(0, `rgba(${(28 + k) | 0},${(42 + k) | 0},${(66 + k) | 0},${n.a})`); g2.addColorStop(1, "rgba(20,32,54,0)");
      cg.fillStyle = g2; cg.fillRect(x - n.r, n.y - n.r, n.r * 2, n.r * 2);
    }
    if (L > .01) { const g3 = cg.createRadialGradient(lx / 4, 40, 0, lx / 4, 40, 300); g3.addColorStop(0, br(.42 * L)); g3.addColorStop(.5, ci(.12 * L)); g3.addColorStop(1, ci(0)); cg.fillStyle = g3; cg.fillRect(0, 0, 270, 480); }
  });

  // chuva (atrás das cenas) e chuva de primeiro plano (só no final)
  const GOT = (() => { const r = rng(9); return Array.from({ length: 560 }, () => ({ x: r() * 1700 - 420, y: r() * 2300, v: 1900 + r() * 1300, l: 30 + r() * 80, w: 1 + r() * 1.8, a: .22 + r() * .5, k: r() })); })();
  function desenhaChuva(g, t, I, alfa = 1, inclin = .26, esc = 1) {
    g.clearRect(0, 0, 1080, 1920); if (I <= .01) return;
    g.lineCap = "round"; const n = Math.floor(GOT.length * Math.min(1, I));
    for (let i = 0; i < n; i++) {
      const q = GOT[i], y = ((q.y + t * q.v * esc) % 2300) - 200, x = q.x + y * inclin, l = q.l * esc * (.7 + I * .5);
      g.strokeStyle = q.k < .2 ? ci(q.a * alfa) : br(q.a * .5 * alfa); g.lineWidth = q.w * esc;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - l * inclin, y - l); g.stroke();
    }
  }
  const [, chG] = tela(palco(), 35); fx(t => desenhaChuva(chG, t, chuva(t), .8));
  const [, chF] = tela(palco(), 66); fx(t => desenhaChuva(chF, t + 3.7, t < 51.3 ? 0 : chuvaFrente(t), .55, .3, 1.5));

  // linhas de vento (fio condutor)
  const VL = (() => { const r = rng(13); return Array.from({ length: 18 }, () => ({ y: 100 + r() * 1720, A: 18 + r() * 60, f: .002 + r() * .004, v: .28 + r() * .3, ph: r() * 10, len: .22 + r() * .3, w: 2 + r() * 3.2, c: r() < .4 })); })();
  const [, vG] = tela(palco(), 36);
  fx(t => {
    vG.clearRect(0, 0, 1080, 1920); const I = vento(t), W = ventoInt(t); if (I < .02) return;
    vG.lineCap = "round";
    for (const q of VL) {
      const u = ((W * q.v + q.ph) % 2) - .35, len = q.len * (.6 + I * .6);
      for (let k = 0; k < 24; k++) {
        const s0 = u - len + len * k / 24, s1 = u - len + len * (k + 1) / 24, x0 = s0 * 1080, x1 = s1 * 1080;
        const y0 = q.y + q.A * I * Math.sin(x0 * q.f + t * 1.4 + q.ph), y1 = q.y + q.A * I * Math.sin(x1 * q.f + t * 1.4 + q.ph);
        const a = Math.sin(Math.PI * k / 24) * clamp(I * .7) * (q.c ? .75 : .32);
        vG.strokeStyle = q.c ? ci(a) : br(a * .7); vG.lineWidth = q.w; vG.beginPath(); vG.moveTo(x0, y0); vG.lineTo(x1, y1); vG.stroke();
      }
    }
  });

  // relâmpagos desenhados: atrás das cenas (z 37) e na frente (z 90)
  const [, rbG] = tela(palco(), 37), [, rfG] = tela(palco(), 90);
  const sujo = [false, false];
  fx(t => {
    [rbG, rfG].forEach((g, i) => {
      const ativos = RAIOS.filter(r => !r.sem && r.frente === (i === 1) && t >= r.t && t < r.t + r.d);
      if (!ativos.length) { if (sujo[i]) { g.clearRect(0, 0, 1080, 1920); sujo[i] = false; } return; }
      g.clearRect(0, 0, 1080, 1920); sujo[i] = true;
      for (const r of ativos) { const u = t - r.t; bolt(g, r, (Math.floor(u * 30) % 3 === 1 ? .3 : 1) * (1 - u / r.d * .55)); }
    });
  });

  // assinatura 2 · rajada: faixas de vento varrem a tela; o corte acontece ~0,19 s depois do início
  const RAJ = [], rajada = tcorte => RAJ.push(tcorte - .19);
  const [, rjG] = tela(palco(), 94); let rjSujo = false;
  const FX_RAJ = (() => { const r = rng(17); return Array.from({ length: 22 }, (_, i) => ({ y: i * 92 - 40 + r() * 30, hh: 70 + r() * 110, atraso: r() * .16, len: 2100 + r() * 700, c: r() })); })();
  fx(t => {
    const t0 = RAJ.find(a => t >= a && t < a + .5);
    if (t0 == null) { if (rjSujo) { rjG.clearRect(0, 0, 1080, 1920); rjSujo = false; } return; }
    rjG.clearRect(0, 0, 1080, 1920); rjSujo = true;
    for (const s of FX_RAJ) {
      const u = clamp((t - t0 - s.atraso) / .34); if (u <= 0 || u >= 1) continue;
      const head = lerp(-150, 1080 + s.len, EASE.inOut(u)), tail = head - s.len;
      const gr = rjG.createLinearGradient(tail, 0, head, 0);
      gr.addColorStop(0, "rgba(14,23,38,0)"); gr.addColorStop(.12, "#0F1A2D"); gr.addColorStop(.86, s.c < .3 ? "#163A55" : "#122036"); gr.addColorStop(.97, s.c < .5 ? CI : BR); gr.addColorStop(1, "rgba(234,242,255,0)");
      rjG.fillStyle = gr; rjG.beginPath(); rjG.roundRect(tail, s.y, s.len, s.hh, s.hh / 2); rjG.fill();
    }
  });

  // assinatura 3 · varredura de radar: o feixe giratório revela a cena (máscara cônica na raiz externa)
  function varredura(S0, t, d = .62, cx = 540, cy = 960) {
    const feixe = h("div", "abs", S0, null, "inset:0;z-index:50;pointer-events:none");
    fx(tt => {
      const p = P(tt, t, t + d, "inOut"), on = p > 0 && p < 1, deg = p * 360;
      const m = on ? `conic-gradient(from 0deg at ${cx}px ${cy}px, #000 ${deg}deg, transparent ${deg + .5}deg)` : p <= 0 ? "linear-gradient(transparent,transparent)" : "none";
      if (S0._m !== m) { S0.style.maskImage = S0.style.webkitMaskImage = m; S0._m = m; }
      feixe.style.display = on ? "block" : "none";
      if (on) feixe.style.background = `conic-gradient(from ${deg - 60}deg at ${cx}px ${cy}px, rgba(54,197,240,0) 0deg, rgba(54,197,240,.42) 59.4deg, rgba(234,242,255,.95) 60deg, rgba(234,242,255,0) 60.5deg)`;
    });
  }
  // assinatura 1 · relâmpago: flash branco que corta
  const relampago = (t, pico = .95, d = .34) => trans.flash(t, { cor: BR, d, z: 95, pico });

  // grão e vinheta
  const grao = fundo.grao({ opac: .06 }); grao.firstChild.style.mixBlendMode = "overlay";
  h("div", "layer", palco(), null, "z-index:97;background:radial-gradient(ellipse 92% 72% at 50% 50%,transparent 55%,rgba(2,5,12,.5))");
  const fim = h("div", "layer", palco(), null, "z-index:99;background:#05080F"); anim(fim, [[59.45, { o: 0 }], [60, { o: 1 }, "lin"]]);

  /* =================== mapa em canvas (usa os dados de países do MDS.mapa) =================== */
  const COSL = Math.cos(24 * Math.PI / 180);
  let PAISES = null;
  function paises() {
    if (PAISES) return PAISES;
    const topo = (window.MDS_DADOS || {}).paises; if (!topo) throw new Error("mapa: dados de países ausentes");
    const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
    const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
    const arco = i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    const anel = idx => { const out = []; idx.forEach((i, k) => { const a = arco(i); out.push(...(k ? a.slice(1) : a)); }); return out; };
    PAISES = topo.objects.countries.geometries.map(g => {
      const aneis = g.type === "Polygon" ? g.arcs.map(anel) : g.type === "MultiPolygon" ? g.arcs.flatMap(p => p.map(anel)) : [];
      const p = new Path2D();
      for (const r of aneis) { let prev = null; r.forEach(([lon, lat]) => { if (prev === null || Math.abs(lon - prev) > 180) p.moveTo(lon * COSL, -lat); else p.lineTo(lon * COSL, -lat); prev = lon; }); p.closePath(); }
      const perto = aneis.some(r => r.some(([lon, lat]) => lon > -95 && lon < -25 && lat < 15 && lat > -60));
      return { nome: g.properties.name, p, perto };
    }).filter(q => q.perto);
    return PAISES;
  }
  // Região Sul (PR, SC, RS): polígono aproximado da divisa norte do PR (rios Paraná, Paranapanema e Itararé), recortado pelo contorno do Brasil
  const SUL = [[-54.33, -24.06], [-53.9, -23.6], [-53.1, -22.65], [-52.2, -22.55], [-51.3, -22.6], [-50.4, -22.85], [-49.7, -23.05], [-49.45, -23.6], [-49.25, -24.1], [-48.6, -24.6], [-48.05, -25.25], [-44, -26], [-44, -36], [-60, -36], [-60, -24.06]];
  const sulP = (() => { const p = new Path2D(); SUL.forEach(([lo, la], i) => i ? p.lineTo(lo * COSL, -la) : p.moveTo(lo * COSL, -la)); p.closePath(); return p; })();
  const CID = { santo: [-53.78, -27.85], palmeira: [-53.31, -27.90], cachoeira: [-45.01, -22.67] };
  function mapa(p, a, b, camFn, extra, o = {}) {
    const [, g] = tela(p, 0), cy = o.cy ?? 960;
    const M = { cam: camFn(a) };
    M.P = (lon, lat) => [540 + (lon - M.cam.lon) * COSL * M.cam.k, cy + (M.cam.lat - lat) * M.cam.k];
    fx(t => {
      if (t < a - .9 || t > b + .9) return;
      M.cam = camFn(t); const { lon, lat, k } = M.cam, L = paises(), lw = 1 / k;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 1080, 1920);
      g.fillStyle = "rgba(8,14,26,.9)"; g.fillRect(0, 0, 1080, 1920);
      g.setTransform(k, 0, 0, k, 540 - lon * COSL * k, cy + lat * k);
      // gratícula
      const passo = k > 300 ? .5 : k > 90 ? 2 : 5;
      g.strokeStyle = nv(.22); g.lineWidth = lw * 1.4; g.beginPath();
      for (let x = Math.floor((lon - 30) / passo) * passo; x <= lon + 30; x += passo) { g.moveTo(x * COSL, -(lat + 40)); g.lineTo(x * COSL, -(lat - 40)); }
      for (let y = Math.floor((lat - 40) / passo) * passo; y <= lat + 40; y += passo) { g.moveTo((lon - 40) * COSL, -y); g.lineTo((lon + 40) * COSL, -y); }
      g.stroke();
      let BRp = null;
      for (const q of L) { if (q.nome === "Brazil") { BRp = q.p; continue; } g.fillStyle = "#111C30"; g.fill(q.p); g.strokeStyle = nv(.6); g.lineWidth = lw * 1.8; g.stroke(q.p); }
      g.fillStyle = "#16263F"; g.fill(BRp);
      const s = o.sul ? o.sul(t) : 0;
      if (s > 0) {
        g.save(); g.clip(BRp); g.fillStyle = ci(.3 * s); g.fill(sulP);
        g.shadowColor = CI; g.shadowBlur = 26 * s; g.strokeStyle = ci(.95 * s); g.lineWidth = lw * 4; g.stroke(sulP); g.restore();
      }
      g.strokeStyle = ci(.8); g.lineWidth = lw * 2.6; g.stroke(BRp);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (extra) extra(g, M, t);
    });
    return M;
  }
  const trilhaMapa = chaves => t => {
    let A = chaves[0], B = chaves[0];
    for (const c of chaves) { if (c[0] <= t) A = c; if (c[0] > t) { B = c; break; } B = c; }
    const p = A === B ? 1 : (EASE[B[2] || "inOut"])(clamp((t - A[0]) / (B[0] - A[0])));
    return { lon: lerp(A[1].lon, B[1].lon, p), lat: lerp(A[1].lat, B[1].lat, p), k: Math.exp(lerp(Math.log(A[1].k), Math.log(B[1].k), p)) };
  };
  // radar (em coordenadas de tela): anéis + feixe giratório com rastro
  function radar(g, cx, cy, R, ang, a = 1) {
    g.save(); g.globalAlpha = a;
    g.strokeStyle = ci(.22); g.lineWidth = 2; for (let i = 1; i <= 4; i++) { g.beginPath(); g.arc(cx, cy, R * i / 4, 0, TAU); g.stroke(); }
    g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.strokeStyle = ci(.12); g.stroke();
    const cg2 = g.createConicGradient(ang, cx, cy); cg2.addColorStop(0, ci(0)); cg2.addColorStop(.78, ci(0)); cg2.addColorStop(1, ci(.36));
    g.fillStyle = cg2; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
    g.strokeStyle = br(.9); g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); g.stroke();
    g.fillStyle = BR; g.beginPath(); g.arc(cx, cy, 6, 0, TAU); g.fill();
    g.restore();
  }
  // eco de radar (escala real de refletividade: verde → amarelo → vermelho → magenta)
  const NIV = [[0, "41,196,106", 1], [.3, "242,214,75", .66], [.55, "240,71,60", .42], [.8, "255,46,147", .22]];
  function eco(g, x, y, r, I, seed, t) {
    for (const [lim, cor, f] of NIV) {
      if (I <= lim) break; const R = rng(seed + lim * 100), forca = clamp((I - lim) / .2);
      for (let k = 0; k < 5; k++) {
        const ox = (R() - .5) * r * f * .9, oy = (R() - .5) * r * f * .7, rr = r * f * (.55 + R() * .45) * (1 + .05 * Math.sin(t * 3 + k + lim * 7));
        const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rr); gr.addColorStop(0, `rgba(${cor},${.7 * forca})`); gr.addColorStop(.6, `rgba(${cor},${.42 * forca})`); gr.addColorStop(1, `rgba(${cor},0)`);
        g.fillStyle = gr; g.beginPath(); g.arc(x + ox, y + oy, rr, 0, TAU); g.fill();
      }
    }
  }
  // pino de mapa (tela)
  function pino(g, x, y, t, t0, cor = MG, esc = 1) {
    const p = P(t, t0, t0 + .45, "back"); if (p <= 0) return;
    const yy = y - (1 - P(t, t0, t0 + .3, "out5")) * 160, pul = ((t - t0) * .9) % 1;
    g.save(); g.translate(x, yy); g.scale(esc * Math.max(.01, p), esc * Math.max(.01, p));
    if (t > t0 + .2) { g.strokeStyle = cor; g.globalAlpha = 1 - pul; g.lineWidth = 4; g.beginPath(); g.ellipse(0, 0, 20 + pul * 70, (20 + pul * 70) * .5, 0, 0, TAU); g.stroke(); g.globalAlpha = 1; }
    g.shadowColor = cor; g.shadowBlur = 30; g.fillStyle = cor;
    g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-14, -26, -30, -40, -30, -62); g.arc(0, -62, 30, Math.PI, 0); g.bezierCurveTo(30, -40, 14, -26, 0, 0); g.fill();
    g.shadowBlur = 0; g.fillStyle = "#0E1726"; g.beginPath(); g.arc(0, -62, 11, 0, TAU); g.fill();
    g.restore();
  }

  /* =================== ícones =================== */
  // funil de tornado (linhas horizontais que afinam)
  function funil(p, x, y, s, cor, css = "") {
    const sv = svg(p, 100, 130, `position:absolute;left:${x}px;top:${y}px;width:${100 * s}px;height:${130 * s}px;overflow:visible;${css}`);
    const g = sel(sv, "g", { fill: "none", stroke: cor, "stroke-width": 9, "stroke-linecap": "round" });
    [[4, 96, 10], [14, 88, 32], [26, 78, 54], [36, 70, 76], [44, 64, 96], [50, 60, 114], [54, 58, 128]].forEach(([a, b, yy]) => sel(g, "line", { x1: a, y1: yy, x2: b, y2: yy }));
    return sv;
  }
  function casaIcone(p, x, y, s, cor) {
    const sv = svg(p, 120, 120, `position:absolute;left:${x}px;top:${y}px;width:${120 * s}px;height:${120 * s}px;overflow:visible`);
    const g = sel(sv, "g", { fill: "none", stroke: cor, "stroke-width": 7, "stroke-linejoin": "round", "stroke-linecap": "round" });
    path(g, "M14 56 L60 16 L106 56"); path(g, "M26 46 V106 H94 V46"); path(g, "M50 106 V76 H70 V106");
    return [sv, g];
  }

  /* ============================================================ CENAS ============================================================ */

  /* ---- 1 · Sete tornados (0–1,62): funil 3D de partículas; o 7 gira com o vento entre as metades do funil ---- */
  const TOR = (() => { const r = rng(21); return Array.from({ length: 1300 }, () => ({ u: Math.pow(r(), .85), ph: r() * TAU, w: .8 + r() * .6, c: r(), l: .1 + r() * .25 })); })();
  const DEB = (() => { const r = rng(23); return Array.from({ length: 160 }, () => ({ r: .4 + r() * 2.6, y: r() * .9, ph: r() * TAU, w: 1 + r() * 1.5, s: 1 + r() * 2.5 })); })();
  const rTor = u => .22 + 2.9 * Math.pow(u, 1.7);
  function tornado(g, K, t, o = {}) {
    const { H = 9, forma = 1, giro = 1, base = [0, 0, 0], lado = 0, alfa = 1 } = o;
    g.lineCap = "round";
    for (const q of TOR) {
      const vis = clamp((forma - q.u * .6) / .4); if (vis <= 0) continue;
      const y = q.u * H, r = rTor(q.u) * (.35 + .65 * vis), sway = Math.sin(y * .35 - t * 1.6) * .5 * q.u + Math.sin(t * .9) * .3;
      const ang = q.ph + t * giro * q.w * (2.2 / (r + .5)), a2 = ang - q.l * (1.5 / (r + .3));
      const cx = base[0] + sway, cz = base[2];
      const p1 = [cx + Math.cos(ang) * r, base[1] + y, cz + Math.sin(ang) * r], p0 = [cx + Math.cos(a2) * r, base[1] + y, cz + Math.sin(a2) * r];
      if (lado) { const d1 = V.dot(V.sub(p1, K.pos), K.f), da = V.dot(V.sub([cx, base[1] + y, cz], K.pos), K.f); if ((d1 > da ? -1 : 1) !== lado) continue; }
      const q1 = K.P(p1), q0 = K.P(p0); if (!q1 || !q0) continue;
      const a = vis * nevoa(q1[3], 4, 44) * alfa * (lado === 1 ? .6 : 1);
      g.strokeStyle = q.c < .3 ? ci(.9 * a) : br(.42 * a); g.lineWidth = Math.max(1, .05 * q1[2]);
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.stroke();
    }
    if (lado !== 1) for (const d of DEB) {
      const ang = d.ph + t * d.w * 2.4, p = [base[0] + Math.cos(ang) * d.r * forma, d.y, base[2] + Math.sin(ang) * d.r * forma], q = K.P(p);
      if (!q) continue; g.fillStyle = nv(.8 * forma * alfa); g.fillRect(q[0] - d.s, q[1] - d.s, d.s * 2, d.s * 2);
    }
  }
  const cam01 = t => orbita([0, 0, 0], lerp(-24, 38, P(t, -.2, 1.9, "sine")), lerp(17, 13.5, P(t, 0, 1.8, "out")), lerp(.8, 5.2, P(t, 0, 1.8, "inOut")), 56, lerp(-4, 2, P(t, 0, 1.8, "sine")), lerp(5.2, 4.6, P(t, 0, 1.8)));
  raio(.03, { x0: 820, x1: 690, y1: 760, luz: .9, d: .26 });
  cenaV({ id: "c01", vis: [0, 1.62], nome: "Sete tornados", inicio: 0, fim: 1.62, descricao: "Do escuro, um funil de tornado em partículas 3D se forma; o «7» gira com o vento entre as metades do funil e trava em «tornados».",
    montar(S) {
      const desenho = lado => (g, K, t) => { g.save(); const piso2 = P(t, 0, .6); g.strokeStyle = nv(.25 * piso2); g.lineWidth = 2; for (let i = -20; i <= 20; i += 2) { seg(g, K, [i, 0, -20], [i, 0, 20], 12); seg(g, K, [-20, 0, i], [20, 0, i], 12); } g.restore(); tornado(g, K, t, { forma: P(t, 0, .9, "out"), lado }); };
      mundo(S, 0, 1.62, cam01, desenho(-1));
      const sete = txtC(S, 520, F(720, 800, BR, "-.06em") + ";" + extrude("#0F3550", 12, 0, 2.4) + ";transform-origin:50% 60%", "7");
      anim(sete, [[0, { o: 0, s: .35, ry: -170, b: 24 }], [.1, { o: 1 }, "lin"], [.38, { s: 1, ry: 0, b: 0 }, "out5"], [1.62, { s: 1.07 }, "sine"]]);
      mundo(S, 0, 1.62, cam01, (g, K, t) => tornado(g, K, t, { forma: P(t, 0, .9, "out"), lado: 1 }));
      const tt = txtC(S, 1300, F(124, 700, CI) + ";" + brilhoTxt(), "TORNADOS"); bate(tt, .38, 1.4);
      centro(S, 1450, F(50, 500, "rgba(234,242,255,.85)", ".01em"), [["em", .76], ["menos", .96], ["de", 1.24], ["uma", 1.40], ["semana", 1.52]], { d: .3 });
      tremor(S, .38, 10);
    } });
  relampago(1.62);

  /* ---- 2 · Casas destruídas (1,62–3,36): casa 3D; o telhado é arrancado e as telhas voam para a câmera ---- */
  const TELHAS = (() => {
    const r = rng(31), out = [], ni = 10, nj = 5, x0 = -2.9, x1 = 2.9, eave = [2.55, -2.3], ridge = [4.1, 0];
    for (let i = 0; i < ni; i++) for (let j = 0; j < nj; j++) {
      const c = (u, v) => [lerp(x0, x1, u), lerp(eave[0], ridge[0], v), lerp(eave[1], ridge[1], v)];
      const u0 = i / ni, u1 = (i + 1) / ni, v0 = j / nj, v1 = (j + 1) / nj;
      const cs = [c(u0, v0), c(u1, v0), c(u1, v1), c(u0, v1)].map(p => V.add(p, [0, .05, -.05]));
      const ctr = V.mul(cs.reduce((a, b) => V.add(a, b), [0, 0, 0]), .25);
      out.push({ cs, ctr, solta: r() > .2, td: 2.17 + u0 * .22 + (1 - v0) * .06 + r() * .07, v: [-2.6 + r() * 3, 2 + r() * 3.5, -7 - r() * 5], w1: (r() - .5) * 14, w2: (r() - .5) * 14 });
    }
    return out;
  })();
  const cam02 = trilha([[1.4, { pos: [-7.4, 2.4, -10.6], alvo: [0, 2.3, 0], fov: 50 }], [3.5, { pos: [-3.8, 3.3, -9.6], alvo: [0, 2.5, 0], fov: 50 }, "sine"]]);
  const quad = (g, K, cs, fill, stroke, lw = 1.5) => { const q = cs.map(p => K.P(p)); if (q.some(v => !v)) return; g.beginPath(); q.forEach((v, i) => i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1])); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
  cenaV({ id: "c02", vis: [1.62, 3.36], nome: "Casas destruídas", inicio: 1.62, fim: 3.36, descricao: "Casa em linhas 3D; em «casas» o telhado é arrancado e as telhas voam na direção da câmera.",
    montar(S) {
      mundo(S, 1.62, 3.36, cam02, (g, K, t) => {
        g.strokeStyle = nv(.25); g.lineWidth = 2; for (let i = -20; i <= 20; i += 2) { seg(g, K, [i, 0, -20], [i, 0, 20], 12); seg(g, K, [-20, 0, i], [20, 0, i], 12); }
        caixa(g, K, [0, 1.3, 0], [5.2, 2.6, 4], ["#16233A", "#1A2A45", "#142038"], ci(.75), 2.4);
        g.strokeStyle = ci(.7); g.lineWidth = 2.4;
        [[[-.6, 0, -2.01], [-.6, 1.6, -2.01], [.4, 1.6, -2.01], [.4, 0, -2.01]], [[-2.1, .9, -2.01], [-2.1, 1.8, -2.01], [-1.2, 1.8, -2.01], [-1.2, .9, -2.01]], [[1.2, .9, -2.01], [1.2, 1.8, -2.01], [2.1, 1.8, -2.01], [2.1, .9, -2.01]]].forEach(cs => quad(g, K, cs, "rgba(54,197,240,.08)", ci(.7), 2.4));
        quad(g, K, [[-2.6, 2.6, -2], [-2.6, 4.05, 0], [-2.6, 2.6, 2]], "#132036", ci(.75), 2.4);
        quad(g, K, [[-2.9, 2.6, -2.25], [2.9, 2.6, -2.25], [2.9, 4.15, .05], [-2.9, 4.15, .05]], "#0B1322", ci(.35), 2);
        g.strokeStyle = ci(.45); g.lineWidth = 2; for (let i = 0; i <= 10; i++) { const x = lerp(-2.9, 2.9, i / 10); seg(g, K, [x, 2.6, -2.25], [x, 4.15, .05], 4); }
        const voando = [];
        for (const q of TELHAS) {
          const u = t - q.td;
          if (!q.solta || u <= 0) { quad(g, K, q.cs, "#24385A", ci(.55), 1.5); continue; }
          const d = V.add(V.mul(q.v, u), [0, -2.2 * u * u, 0]), c = V.add(q.ctr, d);
          const cs = q.cs.map(p => V.add(c, V.rotY(V.rotX(V.sub(p, q.ctr), q.w1 * u), q.w2 * u)));
          voando.push([V.dot(V.sub(c, K.pos), K.f), cs]);
        }
        voando.sort((a, b) => b[0] - a[0]);
        for (const [, cs] of voando) { const n = V.nz(V.cr(V.sub(cs[1], cs[0]), V.sub(cs[3], cs[0]))), l = .45 + .55 * Math.abs(V.dot(n, V.nz([-.3, .8, -.5]))); quad(g, K, cs, `rgb(${(30 + 50 * l) | 0},${(48 + 70 * l) | 0},${(78 + 90 * l) | 0})`, ci(.8), 2); }
      });
      linha(S, X, 250, F(160, 800), [["CASAS", 2.2]], { d: .32 });
      linha(S, X, 410, F(110, 700, CI) + ";" + brilhoTxt(), [["DESTRUÍDAS", 2.48]], { d: .32 });
      tremor(S, 2.2, 12);
    } });
  rajada(3.36);

  /* ---- 3 · Árvores arrancadas (3,36–4,62): silhuetas se curvam com o vento; uma é arrancada e tomba para a câmera ---- */
  const COPA = [[0, -330, 110], [-75, -285, 82], [72, -290, 86], [-42, -400, 88], [48, -395, 82], [0, -465, 72], [-95, -350, 60], [98, -352, 58]];
  function arvore(g, x, yb, s, dob, cor, rot = 0, aro = 0) {
    g.save(); g.translate(x, yb); g.rotate(rot); g.scale(s, s);
    const desl = hh => dob * Math.pow(hh / 300, 2) * 130;
    g.strokeStyle = cor; g.lineCap = "round"; g.lineWidth = 26; g.beginPath(); g.moveTo(0, 0);
    for (let k = 1; k <= 8; k++) { const hh = k / 8 * 320; g.lineTo(desl(hh), -hh); } g.stroke();
    g.lineWidth = 9; [[150, -1], [210, 1]].forEach(([hh, d]) => { g.beginPath(); g.moveTo(desl(hh), -hh); g.lineTo(desl(hh) + d * 60 + dob * 30, -hh - 50); g.stroke(); });
    g.fillStyle = cor; for (const [cx, cy, r] of COPA) { g.beginPath(); g.arc(cx + desl(-cy), cy, r, 0, TAU); g.fill(); }
    if (aro > 0) { g.strokeStyle = ci(.35 * aro); g.lineWidth = 3; for (const [cx, cy, r] of COPA) { g.beginPath(); g.arc(cx + desl(-cy), cy, r, -2.6, -.6); g.stroke(); } }
    g.restore();
  }
  const FOLHAS = (() => { const r = rng(37); return Array.from({ length: 90 }, () => ({ y: r() * 1500 + 200, v: 900 + r() * 1300, ph: r() * 2000, s: 3 + r() * 7, c: r() < .3 })); })();
  cenaV({ id: "c03", vis: [3.36, 4.62], nome: "Árvores arrancadas", inicio: 3.36, fim: 4.62, descricao: "Silhuetas de árvores se curvam com as linhas de vento; em «arrancadas» uma delas é arrancada e tomba na direção da câmera.",
    montar(S) {
      const [, g] = tela(S);
      fx(t => {
        if (t < 3 || t > 5) return; g.clearRect(0, 0, 1080, 1920);
        const [L] = luz(t), I = vento(t);
        const hz = g.createLinearGradient(0, 900, 0, 1660); hz.addColorStop(0, "rgba(30,52,84,0)"); hz.addColorStop(.7, `rgba(${(40 + L * 120) | 0},${(70 + L * 110) | 0},${(110 + L * 100) | 0},.55)`); hz.addColorStop(1, "rgba(30,52,84,.2)"); g.fillStyle = hz; g.fillRect(0, 900, 1080, 760);
        const fila = (yb, s, cor, xs, sd) => xs.forEach((x, i) => arvore(g, x, yb, s, I * (.55 + .35 * Math.sin(t * 6 + i * 1.7 + sd)), cor, 0, L));
        fila(1290, .55, "#1A2840", [-40, 150, 330, 520, 700, 880, 1060], 1);
        fila(1450, .8, "#111B2E", [60, 330, 620, 900], 2);
        g.fillStyle = "#070C16"; g.fillRect(0, 1640, 1080, 280);
        const queda = P(t, 3.64, 4.4, "in"), esc = 1.2 + queda * .45;
        arvore(g, 820, 1660, 1.15, I * (.6 + .3 * Math.sin(t * 6 + 3)), "#080E19", 0, L);
        if (queda > 0) { g.fillStyle = "#2A3550"; g.beginPath(); g.ellipse(300 + queda * 30, 1655, 120 * esc * .6, 60 * esc * .6 * queda, queda * .5, Math.PI, TAU); g.fill(); }
        arvore(g, 300 + queda * 40, 1660 + queda * 30, esc, I * .5, "#080E19", queda * 1.05, Math.max(L, .5 + queda * .5));
        for (const f of FOLHAS) { const x = ((f.ph + t * f.v * I) % 1400) - 160, y = f.y + Math.sin(t * 5 + f.ph) * 40; g.fillStyle = f.c ? ci(.7) : nv(.8); g.save(); g.translate(x, y); g.rotate(t * 8 + f.ph); g.fillRect(-f.s, -f.s / 2, f.s * 2, f.s); g.restore(); }
      });
      linha(S, X, 250, F(150, 800), [["ÁRVORES", 3.36]], { d: .3 });
      linha(S, X, 400, F(110, 700, CI) + ";" + brilhoTxt(), [["ARRANCADAS", 3.64]], { d: .3 });
      tremor(S, 4.1, 10);
    } });
  raio(3.66, { x0: 300, x1: 420, y1: 620, luz: .55, w: .7, d: .22 });
  rajada(4.62);

  /* ---- 4 · Milhares afetadas (4,62–6,24): campo de pessoas acende em onda; o relâmpago muda tudo para alerta ---- */
  cenaV({ id: "c04", vis: [4.62, 6.88], nome: "Milhares afetadas", inicio: 4.62, fim: 6.24, descricao: "Campo de ícones de pessoas acende em onda em «milhares»; em «afetadas» um relâmpago ilumina tudo e a onda vira alerta.",
    montar(S) {
      const [, g] = tela(S), cols = 17, rows = 27, cw = 60, x0 = 60, y0 = 150;
      const R = rng(41), ord = Array.from({ length: cols * rows }, () => R());
      fx(t => {
        if (t < 4.3 || t > 7) return; g.clearRect(0, 0, 1080, 1920);
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const x = x0 + i * cw + cw / 2, y = y0 + j * cw + cw / 2, d = Math.hypot(x - 540, y - 960);
          const on = P(t, 4.62 + d * .0011 + ord[j * cols + i] * .12, 4.9 + d * .0011, "out"), al = P(t, 5.42 + d * .0009, 5.62 + d * .0009, "out");
          const fl = t > 5.42 + d * .0009 && t < 5.5 + d * .0009 ? 1 : 0;
          g.fillStyle = fl ? BR : al > 0 ? mg(.35 + .55 * al) : on > 0 ? ci(.25 + .6 * on) : nv(.3);
          const s = .8 + .2 * on;
          g.beginPath(); g.arc(x, y - 10 * s, 8 * s, 0, TAU); g.fill();
          g.beginPath(); g.roundRect(x - 14 * s, y + 1 * s, 28 * s, 17 * s, [12 * s, 12 * s, 3, 3]); g.fill();
        }
      });
      const faixa = h("div", "abs", S, null, "left:0;right:0;top:760px;height:420px;background:linear-gradient(transparent,rgba(9,15,28,.88) 18%,rgba(9,15,28,.88) 82%,transparent)");
      anim(faixa, [[4.62, { o: 0 }], [4.8, { o: 1 }, "lin"]]);
      const mil = txtC(S, 810, F(190, 800) + ";" + extrude("#0F3550", 8, 0, 2), "MILHARES"); bate(mil, 4.62, 1.35);
      centro(S, 1040, F(64, 600, MG) + ";" + brilhoTxt("255,46,147", .45), [["de", 5.06], ["pessoas", 5.14], ["afetadas", 5.42]], { d: .3 });
      tremor(S, 5.42, 12);
    } });
  raio(5.42, { x0: 260, x1: 380, y1: 980, luz: 1, d: .28 });
  relampago(5.42, .55, .28);

  /* ---- 5+6 · Sul do Brasil + temporais extremos (6,24–9,42): mapa revelado pela varredura; zoom no Sul; ecos de radar ---- */
  const ECOS = [[-55.2, -29.2, 1.35, .95, 11], [-53.3, -27.6, 1.05, .85, 12], [-51.2, -26.3, 1.15, .62, 13], [-50.3, -28.7, .85, .5, 14], [-53.7, -30.7, .95, .7, 15], [-49.7, -24.8, .75, .45, 16], [-52.4, -24.6, .7, .4, 17]];
  const cam05 = trilhaMapa([[6.24, { lon: -52, lat: -15.5, k: 30 }], [7.05, { lon: -52, lat: -16.5, k: 33 }, "sine"], [7.95, { lon: -51.6, lat: -27.4, k: 112 }, "inOutExpo"], [9.42, { lon: -51.3, lat: -27.5, k: 124 }, "sine"]]);
  cenaV({ id: "c05", vis: [6.24, 9.42], nome: "O Sul do Brasil", inicio: 6.24, fim: 7.6, descricao: "A varredura do radar revela o mapa; em «Sul» a Região Sul acende com contorno pulsante (área aproximada; sem divisas estaduais).",
    montar(S, c, S0) {
      varredura(S0, 6.24, .62);
      mapa(S, 6.24, 9.42, cam05, (g, M, t) => {
        const [cx, cy] = M.P(-51.6, -27.4);
        if (t > 7.6) for (const [lo, la, r, I, sd] of ECOS) { const cresce = P(t, 7.62 + sd * .02, 8.2 + sd * .02, "out"), pulso = t > 7.66 ? Math.exp(-(t - 7.66) * 5) * .25 : 0, nucleo = sd <= 12 ? P(t, 8.62, 8.9, "out") * .25 : 0; const [x, y] = M.P(lo + (t - 7.6) * .32, la); eco(g, x, y, r * M.cam.k * cresce, I * cresce + pulso + nucleo, sd, t); }
        radar(g, cx, cy, Math.min(760, 7.2 * M.cam.k), t * 3.1, P(t, 6.3, 6.9, "out") * .9);
      }, { sul: t => P(t, 6.36, 6.8, "out") * (.75 + .25 * Math.sin(t * 6)) * (1 - .45 * P(t, 7.6, 8.1)) });
      const l5 = linha(S, X, 230, F(52, 500, "rgba(234,242,255,.85)"), [["O", 6.24], ["Sul", 6.36], ["do", 6.48], ["Brasil", 6.58], ["está", 6.84], ["enfrentando", 7.10]], { d: .3 });
      anim(l5, [[7.5, { o: 1, y: 0 }], [7.7, { o: 0, y: -40 }, "in"]]);
      const sul = txt(S, X - 6, 300, F(170, 800, BR) + ";" + brilhoTxt(), "SUL");
      anim(sul, [[6.35, { o: 0, s: 1.4, b: 18 }], [6.38, { o: 1 }, "lin"], [6.6, { s: 1, b: 0 }, "out5"], [7.5, { o: 1, y: 0 }], [7.7, { o: 0, y: -40 }, "in"]]);
    } });

  cenaV({ id: "c06", vis: [7.55, 9.42], nome: "Temporais extremos", inicio: 7.6, fim: 9.42, z: 42, descricao: "Ecos de radar (verde → amarelo → vermelho → magenta) crescem e se movem sobre o Sul; manchete TEMPORAIS EXTREMOS.",
    montar(S) {
      linha(S, X, 230, F(52, 500, "rgba(234,242,255,.85)"), [["uma", 7.52], ["sequência", 7.66], ["de", 8.10]], { d: .3 });
      linha(S, X - 4, 300, F(150, 800, BR), [["TEMPORAIS", 8.24]], { d: .32 });
      const ex = txt(S, X - 6, 455, F(150, 800, MG) + ";" + brilhoTxt("255,46,147", .5), "EXTREMOS"); bate(ex, 8.62, 1.35);
      const leg = h("div", "abs", S, null, "left:80px;right:140px;top:1440px;padding:26px 30px;border-radius:20px;background:rgba(9,15,28,.8)");
      h("div", "rot", leg, "Refletividade do radar", "margin-bottom:18px");
      h("div", "", leg, null, "height:22px;border-radius:11px;background:linear-gradient(90deg,#29C46A,#F2D64B 38%,#F0473C 66%,#FF2E93)");
      h("div", "", leg, "<span>fraca</span><span>extrema</span>", "display:flex;justify-content:space-between;margin-top:14px;font:500 30px var(--v-sans);color:#9AA7BA");
      anim(leg, IN(7.7, { dy: 40, d: .45 }));
      tremor(S, 8.62, 9);
    } });
  relampago(9.42);

  /* ---- 7 · De 2 a 7 de novembro (9,42–11,30): fita de calendário em perspectiva; os dias acendem em sequência ---- */
  cenaV({ id: "c07", vis: [9.42, 11.36], nome: "De 2 a 7 de novembro", inicio: 9.42, fim: 11.3, descricao: "Fita de calendário em perspectiva: os dias 2 a 7 acendem em sequência; NOVEMBRO em cima.",
    montar(S) {
      linha(S, X, 330, F(56, 500, "rgba(234,242,255,.85)"), [["Entre", 9.42], ["os", 9.56], ["dias", 9.70]], { d: .3 });
      const nov = txt(S, X - 4, 400, F(150, 800, BR) + ";" + brilhoTxt(), "NOVEMBRO"); anim(nov, IN(10.62, { dy: 60, d: .4 }));
      const C = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:1920px;transform-origin:540px 960px");
      anim(C, [[9.42, { rx: 16, ry: -16, s: .9 }], [11.3, { rx: 6, ry: -5, s: 1 }, "sine"]]);
      for (let d = 1; d <= 8; d++) {
        const x = 90 + ((d - 1) % 4) * 230, y = 660 + Math.floor((d - 1) / 4) * 290, on = d >= 2 && d <= 7 ? 9.82 + (d - 2) * .104 : null;
        const card = h("div", "placa", C, null, `left:${x}px;top:${y}px;width:210px;height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px`);
        h("div", "", card, "NOV", "font:600 28px var(--v-sans);letter-spacing:.16em;color:#5E6B7D");
        const n = h("div", "tn", card, String(d), F(130, 800, "#5E6B7D"));
        const k = [[9.42 + d * .03, { o: 0, y: 90 }], [9.75 + d * .03, { o: 1, y: 0 }, "expo"]];
        if (on) { k.push([on, { s: 1 }], [on + .06, { s: 1.12 }, "out"], [on + .26, { s: 1 }, "out"]); at(on, v => { card.style.background = v ? "linear-gradient(160deg,#16465E,#0F2A3C)" : ""; card.style.borderColor = v ? CI : ""; card.style.boxShadow = v ? "0 0 40px rgba(54,197,240,.45),0 40px 80px -30px rgba(0,0,0,.8)" : ""; n.style.color = v ? BR : "#5E6B7D"; }); }
        anim(card, k);
      }
      const l = txtC(C, 1290, F(110, 800, CI) + ";" + brilhoTxt(), "2 → 7"); anim(l, IN(10.4, { dy: 40, d: .4 }));
      raiz(S, trans.saiZoom(11.16, { d: .22, s: 1.8 }));
    } });

  /* ---- 8 · Sete confirmados (11,30–12,72): sete funis caem em fila; carimbo CONFIRMADOS ---- */
  cenaV({ id: "c08", vis: [11.3, 12.82], nome: "Sete confirmados", inicio: 11.3, fim: 12.72, descricao: "Sete funis caem em fila e se fixam; selo CONFIRMADOS em magenta.",
    montar(S) {
      linha(S, X - 4, 380, F(150, 800, BR), [["7", 11.3, `color:${CI}`], ["TORNADOS", 11.58]], { d: .32 });
      for (let i = 0; i < 7; i++) { const f = funil(S, i < 4 ? 75 + i * 240 : 195 + (i - 4) * 240, i < 4 ? 640 : 950, 1.75, CI, "filter:drop-shadow(0 0 18px rgba(54,197,240,.55))"); const t = 11.58 + i * .07; anim(f, [[t - .01, { o: 0, y: -520, b: 8 }], [t, { o: 1 }, "lin"], [t + .36, { y: 0, b: 0 }, "back"]]); }
      const sel0 = h("div", "selo", S, "CONFIRMADOS", `left:0;top:1330px;color:${MG};left:50%;margin-left:-300px;width:600px;text-align:center;box-sizing:border-box;box-shadow:0 0 40px rgba(255,46,147,.35),inset 0 0 30px rgba(255,46,147,.2)`);
      anim(sel0, [[12.17, { o: 0, s: 2.2, r: -14 }], [12.2, { o: 1 }, "lin"], [12.36, { s: 1, r: -6 }, "out5"]]);
      tremor(S, 12.2, 12);
      raiz(S, trans.chicoteSai(12.47, { d: .35 }));
    } });

  /* ---- 9 · Três estados (12,72–14,44): placas RS · SC · PR giram em 3D; zoom na placa RS ---- */
  cenaV({ id: "c09", vis: [12.7, 14.62], nome: "Três estados", inicio: 12.72, fim: 14.44, descricao: "As siglas PR, SC e RS em três placas que giram em 3D; a câmera mergulha na placa RS.",
    montar(S) {
      S.style.transformOrigin = "540px 1395px";
      linha(S, X - 4, 300, F(150, 800, BR), [["3", 12.92, `color:${CI}`], ["ESTADOS", 13.20]], { d: .32 });
      linha(S, X, 465, F(56, 500, "rgba(234,242,255,.85)"), [["da", 13.62], ["Região", 13.78], ["Sul", 13.98]], { d: .3 });
      [["PR", "Paraná"], ["SC", "Santa Catarina"], ["RS", "Rio Grande do Sul"]].forEach(([s, n], i) => {
        const pl = h("div", "placa", S, null, `left:110px;top:${650 + i * 310}px;width:860px;height:270px;display:flex;align-items:center;gap:44px;padding:0 60px;box-sizing:border-box;transform-origin:50% 50%`);
        h("div", "", pl, s, F(170, 800, i === 2 ? CI : BR) + (i === 2 ? ";" + brilhoTxt() : ""));
        h("div", "", pl, n, F(48, 500, "#9AA7BA"));
        const t = 12.92 + i * .12; anim(pl, [[t, { o: 0, rx: -95, y: 40 }], [t + .05, { o: 1 }, "lin"], [t + .55, { rx: 0, y: 0 }, "back"]]);
      });
      raiz(S, [[14.18, { s: 1, o: 1, b: 0 }], [14.56, { s: 5, o: 0, b: 10 }, "inExpo"]]);
    } });

  /* ---- 10 · Rio Grande do Sul (14,44–16,28): RS vira o fundo; dois funis acendem em magenta ---- */
  cenaV({ id: "c10", vis: [14.4, 16.92], nome: "Rio Grande do Sul", inicio: 14.44, fim: 16.28, descricao: "A sigla RS vira o fundo; em «dois» dois funis acendem em magenta.",
    montar(S) {
      const rs = txtC(S, 640, F(620, 900, "transparent", "-.06em") + ";-webkit-text-stroke:3px rgba(54,197,240,.22)", "RS"); anim(rs, [[14.4, { s: 1.6, o: 0 }], [14.75, { s: 1, o: 1 }, "expo"], [16.9, { s: .94 }, "sine"]]);
      linha(S, X - 4, 300, F(130, 800, BR), [["RIO", 14.54], ["GRANDE", 14.62]], { d: .3 });
      linha(S, X - 4, 430, F(130, 800, BR), [["DO", 14.82], ["SUL", 14.98, `color:${CI}`]], { d: .3 });
      [250, 590].forEach((x, i) => {
        const a = funil(S, x - 10, 800, 2.6, NV), b = funil(S, x - 10, 800, 2.6, MG, "filter:drop-shadow(0 0 26px rgba(255,46,147,.7))");
        anim(a, IN(14.7 + i * .08, { dy: 80, d: .45 })); anim(b, [[15.36 + i * .1, { o: 0, s: 1.25 }], [15.42 + i * .1, { o: 1 }, "lin"], [15.7 + i * .1, { s: 1 }, "out5"]]);
      });
      linha(S, X - 4, 1270, F(150, 800, MG) + ";" + brilhoTxt("255,46,147", .45), [["DOIS", 15.36]], { d: .3 });
      linha(S, X, 1430, F(60, 600, BR), [["deles", 15.56], ["atingiram", 15.80]], { d: .3 });
      tremor(S, 15.38, 9);
    } });

  /* ---- 11 · Santo Augusto e Palmeira das Missões (16,28–18,28): mapa ampliado; dois pinos nas coordenadas reais ---- */
  const cam11 = trilhaMapa([[16.28, { lon: -53.4, lat: -28.9, k: 150 }], [18.4, { lon: -53.5, lat: -28.4, k: 230 }, "sine"]]);
  cenaV({ id: "c11", vis: [16.28, 18.45], nome: "Santo Augusto e Palmeira", inicio: 16.28, fim: 18.28, descricao: "Mapa ampliado no noroeste gaúcho; dois pinos caem nas posições reais de Santo Augusto e Palmeira das Missões.",
    montar(S, c, S0) {
      varredura(S0, 16.28, .6);
      const lab = [["SANTO AUGUSTO", CID.santo, 16.4, -1], ["PALMEIRA DAS MISSÕES", CID.palmeira, 17.3, 1]].map(([s, ll, t, lado]) => {
        const el = h("div", "abs", S, null, `white-space:nowrap;${F(44, 700, BR)};z-index:3`); el.textContent = s;
        el.style.padding = "14px 22px"; el.style.background = "rgba(14,23,38,.86)"; el.style.border = `3px solid ${MG}`; el.style.borderRadius = "12px";
        const w = h("div", "abs", S, null, "z-index:3"); w.appendChild(el); anim(w, IN(t, { dy: 30, s: .8, d: .4, e: "back" }));
        return { w, ll, lado };
      });
      const M = mapa(S, 16.28, 18.45, cam11, (g, M, t) => {
        const [x1, y1] = M.P(...CID.santo), [x2, y2] = M.P(...CID.palmeira);
        pino(g, x1, y1, t, 16.28); pino(g, x2, y2, t, 17.18);
        g.fillStyle = nv(.95); g.font = "600 30px Inter"; [-28, -30, -32].forEach(la => g.fillText(-la + "°S", 40, M.P(-53, la)[1] - 10));
        for (const L of lab) { const [x, y] = M.P(...L.ll); L.w.style.left = (L.lado < 0 ? Math.max(40, x - 420) : x - 60) + "px"; L.w.style.top = (L.lado < 0 ? y - 200 : y + 40) + "px"; }
      }, { sul: () => .5 });
      linha(S, X, 230, F(36, 600, "#9AA7BA", ".16em"), [["RIO", 16.3], ["GRANDE", 16.3], ["DO", 16.3], ["SUL", 16.3]], { d: .3 });
      raiz(S, [[18.05, { o: 1, b: 0 }], [18.42, { o: .2, b: 8 }, "in"]]);
    } });

  /* ---- 12 · Madrugada de sábado (18,28–19,52): céu noturno, relógio girando, relâmpagos distantes ---- */
  raio(18.52, { x0: 860, x1: 800, y1: 520, w: .55, luz: .5, d: .2 });
  raio(19.18, { x0: 190, x1: 240, y1: 460, w: .45, luz: .38, d: .18 });
  cenaV({ id: "c12", vis: [18.2, 19.7], nome: "Madrugada de sábado", inicio: 18.28, fim: 19.52, descricao: "Céu noturno, relógio com ponteiros girando, MADRUGADA em letras finas; relâmpagos distantes.",
    montar(S) {
      const noite = bg(S, "rgba(4,8,15,.82)"); anim(noite, [[18.2, { o: 0 }], [18.45, { o: 1 }, "lin"]]);
      const sv = svg(S, 560, 560, "position:absolute;left:260px;top:520px;overflow:visible");
      sel(sv, "circle", { cx: 280, cy: 280, r: 250, fill: "rgba(54,197,240,.05)", stroke: CI, "stroke-width": 6, style: "filter:drop-shadow(0 0 24px rgba(54,197,240,.5))" });
      for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, r1 = i % 5 ? 228 : 210; sel(sv, "line", { x1: 280 + Math.cos(a) * r1, y1: 280 + Math.sin(a) * r1, x2: 280 + Math.cos(a) * 240, y2: 280 + Math.sin(a) * 240, stroke: i % 5 ? NV : BR, "stroke-width": i % 5 ? 3 : 6, "stroke-linecap": "round" }); }
      const hr = sel(sv, "line", { x1: 280, y1: 280, x2: 280, y2: 150, stroke: BR, "stroke-width": 14, "stroke-linecap": "round" });
      const mn = sel(sv, "line", { x1: 280, y1: 280, x2: 280, y2: 80, stroke: CI, "stroke-width": 8, "stroke-linecap": "round" });
      sel(sv, "circle", { cx: 280, cy: 280, r: 14, fill: BR });
      fx(t => { const v = P(t, 18.2, 19.7, "out") * 7.5 + .2; mn.setAttribute("transform", `rotate(${v * 360} 280 280)`); hr.setAttribute("transform", `rotate(${v * 30 + 330} 280 280)`); });
      anim(sv, [[18.25, { o: 0, s: .7, b: 14 }], [18.6, { o: 1, s: 1, b: 0 }, "expo"]]);
      const m = txtC(S, 1180, F(128, 300, BR, ".01em"), "MADRUGADA"); anim(m, IN(18.38, { dy: 50, d: .45, b: 14 }));
      centro(S, 1370, F(64, 600, CI, ".12em"), [["DE", 18.68], ["SÁBADO", 18.86]], { d: .35 });
    } });

  /* ---- 13 · Defesa Civil (19,52–20,96): cartão genérico de boletim (sem logotipo) digitando a fonte ---- */
  cenaV({ id: "c13", vis: [19.42, 21.12], nome: "Defesa Civil", inicio: 19.52, fim: 20.96, descricao: "Cartão genérico de boletim, sem logotipo oficial: «FONTE: DEFESA CIVIL DO RS» digitando.",
    montar(S) {
      const card = h("div", "placa", S, null, "left:90px;top:660px;width:900px;height:600px;padding:56px 60px;box-sizing:border-box");
      const top = h("div", "", card, null, "display:flex;align-items:center;gap:22px;margin-bottom:52px");
      const ic = svg(top, 64, 58); path(ic, "M32 4 L61 54 H3 Z", { fill: "none", stroke: MG, "stroke-width": 6, "stroke-linejoin": "round" }); path(ic, "M32 22 V38 M32 45 V47", { stroke: MG, "stroke-width": 6, "stroke-linecap": "round" });
      h("div", "rot", top, "Boletim", `color:${BR};font-size:30px`);
      h("div", "", top, null, "flex:1");
      h("div", "", top, "● ● ●", "font:600 22px var(--v-sans);color:#5E6B7D;letter-spacing:.2em");
      h("div", "rot", card, "Fonte", "margin-bottom:18px");
      const ty = h("div", "", card, null, F(64, 700, BR, "-.01em") + ";line-height:1.12;min-height:150px;white-space:normal");
      const tx = h("span", "", ty), caret = h("span", "", ty, null, `display:inline-block;width:6px;height:60px;background:${CI};margin-left:6px;vertical-align:-6px`);
      typeText(tx, "DEFESA CIVIL DO RS", 19.86, 34, caret, 20.9);
      [560, 700, 420].forEach((w, i) => { const b = h("div", "", card, null, `height:18px;width:${w}px;border-radius:9px;background:#24344F;margin-top:${i ? 18 : 40}px;transform-origin:0 50%`); anim(b, [[20.1 + i * .08, { sx: 0 }], [20.5 + i * .08, { sx: 1 }, "expo"]]); });
      anim(card, [[19.45, { o: 0, y: 900, b: 10 }], [19.5, { o: 1 }, "lin"], [19.9, { y: 0, b: 0 }, "expo"], [20.84, { s: 1, o: 1, b: 0 }], [21.08, { s: 1.7, o: 0, b: 16 }, "in"]]);
      linha(S, X, 1340, F(52, 500, "rgba(234,242,255,.85)"), [["Segundo", 19.52], ["a", 19.78], ["Defesa", 19.88], ["Civil", 20.14], ["gaúcha", 20.36]], { d: .3 }).style.zIndex = 2;
    } });

  /* ---- 14 · 23 mil pessoas (20,96–23,12): contador gigante; campo de pontos se preenche atrás ---- */
  cenaV({ id: "c14", vis: [20.94, 23.3], nome: "23 mil pessoas", inicio: 20.96, fim: 23.12, descricao: "Contador gigante sobe até 23.000 com «MAIS DE»; atrás, um campo de pontos se preenche.",
    montar(S) {
      const [, g] = tela(S), R = rng(51), N = 34 * 60, ord = Array.from({ length: N }, () => R());
      fx(t => {
        if (t < 20.8 || t > 23.4) return; g.clearRect(0, 0, 1080, 1920); const p = P(t, 20.96, 21.6, "out");
        for (let i = 0; i < N; i++) { const x = 36 + (i % 34) * 30.5, y = 50 + Math.floor(i / 34) * 30.5, on = ord[i] < p; g.fillStyle = on ? ci(.18 + .2 * ((i * 7) % 5) / 5) : nv(.14); g.beginPath(); g.arc(x, y, on ? 5 : 3, 0, TAU); g.fill(); }
      });
      const v = h("div", "abs", S, null, "inset:0;background:radial-gradient(ellipse 60% 26% at 50% 47%,rgba(9,15,28,.92),rgba(9,15,28,.6) 60%,transparent)");
      const mais = txtC(S, 640, F(70, 700, CI, ".1em"), "MAIS DE"); anim(mais, IN(20.96, { dy: 40, d: .35 }));
      const n = txtC(S, 740, F(270, 800, BR, "-.05em") + ";font-variant-numeric:tabular-nums;" + extrude("#0F3550", 9, 0, 2.2), "0");
      counter(n, 0, 23000, 20.98, 21.56, v => Math.round(v).toLocaleString("pt-BR"), "out");
      anim(n, [[20.96, { s: .8 }], [21.54, { s: 1 }, "out"], [21.6, { s: 1.08 }, "out"], [21.8, { s: 1 }, "out"]]);
      centro(S, 1070, F(110, 800, BR), [["PESSOAS", 22.02]], { d: .32 });
      centro(S, 1190, F(110, 800, MG) + ";" + brilhoTxt("255,46,147", .4), [["AFETADAS", 22.66]], { d: .32 });
      tremor(S, 21.56, 12);
      raiz(S, trans.entraZoom(20.94, { d: .35, s: .7 }), trans.saiFundo(22.9, { d: .22 }));
    } });

  /* ---- 15 · 17 municípios (23,12–24,58): 17 marcadores acendem em sequência ---- */
  cenaV({ id: "c15", vis: [23.12, 24.95], nome: "17 municípios", inicio: 23.12, fim: 24.58, descricao: "17 marcadores acendem em sequência; «17 MUNICÍPIOS».",
    montar(S) {
      const n = txtC(S, 430, F(380, 800, CI, "-.06em") + ";font-variant-numeric:tabular-nums;" + brilhoTxt(), "0"); counter(n, 0, 17, 23.28, 23.88, v => String(Math.round(v)), "out");
      anim(n, trans.entraFundo(23.12, { d: .35 }));
      centro(S, 830, F(110, 800, BR), [["MUNICÍPIOS", 23.76]], { d: .32 });
      const pos = []; [6, 6, 5].forEach((k, r) => { for (let i = 0; i < k; i++) pos.push([540 + (i - (k - 1) / 2) * 150, 1120 + r * 170]); });
      pos.forEach(([x, y], i) => {
        const sv = svg(S, 80, 100, `position:absolute;left:${x - 40}px;top:${y - 90}px;overflow:visible`);
        const pth = path(sv, "M40 96 C30 70 6 56 6 34 A34 34 0 0 1 74 34 C74 56 50 70 40 96 Z", { fill: "#1E2D46", stroke: NV, "stroke-width": 4 });
        sel(sv, "circle", { cx: 40, cy: 34, r: 12, fill: "#0E1726" });
        const t = 23.28 + i * .035;
        at(t, v => { pth.setAttribute("fill", v ? CI : "#1E2D46"); pth.setAttribute("stroke", v ? BR : NV); sv.style.filter = v ? "drop-shadow(0 0 16px rgba(54,197,240,.7))" : ""; });
        anim(sv, [[23.12, { o: 0, y: 30 }], [23.3, { o: 1, y: 0 }, "out"], [t, { s: 1 }], [t + .05, { s: 1.3 }, "out"], [t + .25, { s: 1 }, "out"]]);
      });
    } });

  /* ---- 16 · Balanço preliminar (24,58–26,50): folha de balanço sobe; FERIDOS marcado ---- */
  cenaV({ id: "c16", vis: [24.45, 26.98], nome: "Balanço preliminar", inicio: 24.58, fim: 26.5, z: 41, descricao: "Folha de balanço sobe com três itens; em «feridos» o primeiro é marcado.",
    montar(S) {
      bg(S, "rgba(9,15,28,.6)");
      const f = h("div", "placa", S, null, "left:90px;top:420px;width:900px;height:900px;padding:70px 64px;box-sizing:border-box");
      h("div", "rot", f, "Balanço", "margin-bottom:18px");
      const tt = h("div", "", f, null, F(76, 800, BR, "-.02em")); typeText(tt, "PRELIMINAR", 24.94, 30);
      h("div", "", f, null, `height:4px;background:${CI};margin:44px 0 30px;border-radius:2px;opacity:.7`);
      [["Feridos", 26.12], ["Casas destelhadas", 27.02], ["Áreas alagadas", 28.06]].forEach(([s, tm], i) => {
        const row = h("div", "", f, null, "display:flex;align-items:center;gap:34px;padding:34px 0;border-bottom:2px solid #24344F;position:relative");
        const hl = h("div", "", row, null, `position:absolute;left:-24px;right:-24px;top:10px;bottom:10px;border-radius:14px;background:rgba(54,197,240,.13);transform-origin:0 50%`);
        const box = svg(row, 76, 76, "flex:none;position:relative"); sel(box, "rect", { x: 4, y: 4, width: 68, height: 68, rx: 14, fill: "none", stroke: i ? NV : CI, "stroke-width": 5 });
        const ck = path(box, "M18 40 L32 54 L58 24", { fill: "none", stroke: CI, "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round" }); draw(ck, tm, tm + .2, "out"); at(tm, v => { ck.style.visibility = v ? "visible" : "hidden"; });
        h("div", "", row, s, F(66, 600, i ? "#9AA7BA" : BR) + ";position:relative");
        anim(hl, [[tm, { sx: 0 }], [tm + .3, { sx: 1 }, "out5"]]);
        anim(row, IN(25.38 + i * .12, { dy: 40, d: .4 }));
      });
      anim(f, [[24.5, { y: 1500, o: 1 }], [25.05, { y: 0 }, "expo"]]);
      linha(S, X, 1380, F(52, 500, "rgba(234,242,255,.85)"), [["também", 25.38], ["registrou", 25.70], ["feridos", 26.12]], { d: .3 });
    } });

  /* ---- 17 · Destelhadas e alagadas (26,50–28,76): tela dividida (em cima, telhado perde telhas; embaixo, a água sobe) ---- */
  const TL17 = (() => { const r = rng(61), out = []; for (let lado = -1; lado <= 1; lado += 2) for (let j = 0; j < 3; j++) for (let i = 0; i < 7; i++) out.push({ lado, i, j, td: 27.02 + (lado > 0 ? 0 : .12) + (6 - i) * .03 + j * .02 + r() * .05, vx: 700 + r() * 600, vy: -250 - r() * 350, w: (r() - .5) * 16, solta: r() > .15 }); return out; })();
  cenaV({ id: "c17", vis: [26.5, 28.96], nome: "Destelhadas e alagadas", inicio: 26.5, fim: 28.76, z: 42, descricao: "Tela dividida: em cima, o telhado perde as telhas; embaixo, a água sobe num corte da rua.",
    montar(S, c, S0) {
      trans.cortina(S0, 26.5, { lado: "baixo", d: .42 });
      const [, g] = tela(S);
      fx(t => {
        if (t < 26.3 || t > 29.2) return; g.clearRect(0, 0, 1080, 1920);
        g.fillStyle = "#0F1A2D"; g.fillRect(0, 0, 1080, 958); g.fillStyle = "#0B1424"; g.fillRect(0, 962, 1080, 958);
        // casa (corte lateral)
        g.save(); g.translate(0, 110);
        g.fillStyle = "#16233A"; g.strokeStyle = ci(.8); g.lineWidth = 4; g.fillRect(330, 560, 420, 290); g.strokeRect(330, 560, 420, 290);
        g.strokeRect(500, 700, 80, 150); g.strokeRect(380, 620, 80, 70); g.strokeRect(620, 620, 80, 70);
        g.beginPath(); g.moveTo(290, 575); g.lineTo(540, 380); g.lineTo(790, 575); g.closePath(); g.fillStyle = "#0B1322"; g.fill(); g.strokeStyle = ci(.4); g.stroke();
        g.strokeStyle = ci(.35); g.lineWidth = 3; for (let i = 1; i < 7; i++) { const u = i / 7; g.beginPath(); g.moveTo(lerp(290, 540, u), lerp(575, 380, u)); g.lineTo(lerp(290, 540, u) + 18, lerp(575, 380, u) + 22); g.stroke(); g.beginPath(); g.moveTo(lerp(790, 540, u), lerp(575, 380, u)); g.lineTo(lerp(790, 540, u) - 18, lerp(575, 380, u) + 22); g.stroke(); }
        for (const q of TL17) {
          const u = (q.i + .5) / 7, v = q.j / 3, bx = q.lado < 0 ? lerp(290, 540, u) : lerp(790, 540, u), by = lerp(575, 380, u) - v * 20 - 12, ang = q.lado < 0 ? -.66 : .66;
          const d = t - q.td; let x = bx, y = by, a = ang;
          if (q.solta && d > 0) { x += q.vx * d; y += q.vy * d + 900 * d * d; a += q.w * d; }
          if (y > 850 && d > 0) continue;
          g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = "#28406A"; g.strokeStyle = ci(.8); g.lineWidth = 2; g.fillRect(-20, -8, 40, 16); g.strokeRect(-20, -8, 40, 16); g.restore();
        }
        g.restore();
        // rua alagada (corte transversal)
        const nivel = 1700 - P(t, 27.84, 28.7, "out") * 270;
        g.fillStyle = "#16233A"; g.strokeStyle = ci(.55); g.lineWidth = 3;
        [[120, 1500, 200, 200], [440, 1440, 220, 260], [780, 1520, 190, 180]].forEach(([x, y, w, hh]) => { g.fillRect(x, y, w, hh); g.strokeRect(x, y, w, hh); g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x + w / 2, y - 80); g.lineTo(x + w + 16, y); g.stroke(); });
        g.fillStyle = "#070C16"; g.fillRect(0, 1700, 1080, 220); g.strokeStyle = nv(.6); g.beginPath(); g.moveTo(0, 1700); g.lineTo(1080, 1700); g.stroke();
        if (nivel < 1699) {
          g.beginPath(); g.moveTo(0, 1920); for (let x = 0; x <= 1080; x += 20) g.lineTo(x, nivel + Math.sin(x * .02 + t * 5) * 8 + Math.sin(x * .007 - t * 3) * 6); g.lineTo(1080, 1920); g.closePath();
          const gr = g.createLinearGradient(0, nivel, 0, 1920); gr.addColorStop(0, ci(.45)); gr.addColorStop(1, ci(.12)); g.fillStyle = gr; g.fill();
          g.strokeStyle = br(.85); g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= 1080; x += 20) { const y = nivel + Math.sin(x * .02 + t * 5) * 8 + Math.sin(x * .007 - t * 3) * 6; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        }
        g.fillStyle = CI; g.globalAlpha = .9; g.fillRect(lerp(540, 0, P(t, 26.5, 26.9, "out")), 957, lerp(0, 1080, P(t, 26.5, 26.9, "out")), 6); g.globalAlpha = 1;
      });
      linha(S, X, 240, F(40, 600, "#9AA7BA", ".16em"), [["CASAS", 26.5]], { d: .3 });
      linha(S, X - 4, 295, F(120, 800, BR), [["DESTELHADAS", 27.02]], { d: .3 });
      linha(S, X, 1030, F(40, 600, "#9AA7BA", ".16em"), [["ÁREAS", 27.84]], { d: .3 });
      linha(S, X - 4, 1085, F(120, 800, CI) + ";" + brilhoTxt(), [["ALAGADAS", 28.06]], { d: .3 });
    } });

  /* ---- 18+19 · Não só no Sul + Cachoeira Paulista (28,76–32,96): recuo no mapa, seta de vento para o norte, pino em SP ---- */
  const cam18 = trilhaMapa([[28.76, { lon: -51.8, lat: -28.4, k: 165 }], [30.55, { lon: -48.6, lat: -25.0, k: 66 }, "inOut"], [31.75, { lon: -45.6, lat: -23.4, k: 190 }, "inOutExpo"], [32.96, { lon: -45.5, lat: -23.3, k: 225 }, "sine"]]);
  const SETA = [[-52.6, -28.8], [-51.4, -26.8], [-49.6, -24.9], [-47.4, -23.6], [-45.5, -22.85]];
  cenaV({ id: "c18", vis: [28.74, 33.25], nome: "Não só no Sul", inicio: 28.76, fim: 30.92, descricao: "A câmera recua do Sul e sobe pelo mapa; uma seta de vento corre para o norte.",
    montar(S) {
      mapa(S, 28.74, 33.25, cam18, (g, M, t) => {
        const p = P(t, 29.3, 30.55, "inOut"), fade = 1 - P(t, 31.2, 31.6, "lin");
        if (p > 0 && fade > 0) {
          const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60 * (SETA.length - 1), k = Math.min(SETA.length - 2, Math.floor(u)), f = u - k; const a = SETA[Math.max(0, k - 1)], b = SETA[k], c2 = SETA[k + 1], d = SETA[Math.min(SETA.length - 1, k + 2)]; const cr = j => .5 * (2 * b[j] + (-a[j] + c2[j]) * f + (2 * a[j] - 5 * b[j] + 4 * c2[j] - d[j]) * f * f + (-a[j] + 3 * b[j] - 3 * c2[j] + d[j]) * f * f * f); pts.push(M.P(cr(0), cr(1))); }
          const n = Math.max(2, Math.floor(pts.length * p));
          g.save(); g.globalAlpha = fade; g.lineCap = "round"; g.lineJoin = "round"; g.shadowColor = CI; g.shadowBlur = 24;
          g.strokeStyle = CI; g.lineWidth = 14; g.beginPath(); pts.slice(0, n).forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
          const [ax, ay] = pts[n - 1], [bx, by] = pts[n - 2], an = Math.atan2(ay - by, ax - bx);
          g.fillStyle = CI; g.beginPath(); g.moveTo(ax + Math.cos(an) * 34, ay + Math.sin(an) * 34); g.lineTo(ax + Math.cos(an + 2.4) * 34, ay + Math.sin(an + 2.4) * 34); g.lineTo(ax + Math.cos(an - 2.4) * 34, ay + Math.sin(an - 2.4) * 34); g.closePath(); g.fill(); g.restore();
        }
        const [px, py] = M.P(...CID.cachoeira); pino(g, px, py, t, 30.98, MG, 1.1);
        if (t > 30.9) { g.fillStyle = nv(.95); g.font = "600 30px Inter"; [-22, -24].forEach(la => g.fillText(-la + "°S", 40, M.P(-45, la)[1] - 10)); }
      }, { sul: t => .7 - .35 * P(t, 29, 30.6) });
      const tit = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:700px");
      linha(tit, X, 230, F(54, 500, "rgba(234,242,255,.85)"), [["E", 28.76], ["os", 28.84], ["estragos", 28.92]], { d: .3 });
      linha(tit, X - 4, 300, F(140, 800, BR), [["NÃO", 29.36], ["FICARAM", 29.56]], { d: .32 });
      linha(tit, X - 4, 450, F(84, 700, CI) + ";" + brilhoTxt(), [["SÓ", 29.94], ["NO", 30.3], ["SUL", 30.5]], { d: .32 });
      anim(tit, [[30.78, { o: 1, y: 0 }], [30.98, { o: 0, y: -50 }, "in"]]);
      raiz(S, trans.entraFundo(28.74, { d: .45, s: 1.3 }), [[32.66, { y: 0, b: 0, o: 1 }], [33.1, { y: 1500, b: 18, o: .6 }, "inExpo"]]);
    } });
  cenaV({ id: "c19", vis: [30.92, 33.1], nome: "Cachoeira Paulista", inicio: 30.92, fim: 32.96, z: 42, descricao: "Pino em Cachoeira Paulista (SP), na posição real, com anel de alerta pulsando.",
    montar(S) {
      const box = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:700px");
      linha(box, X, 230, F(54, 500, "rgba(234,242,255,.85)"), [["Em", 30.92]], { d: .3 });
      linha(box, X - 4, 300, F(130, 800, BR), [["CACHOEIRA", 30.98]], { d: .32 });
      linha(box, X - 4, 430, F(130, 800, MG) + ";" + brilhoTxt("255,46,147", .4), [["PAULISTA", 31.34]], { d: .32 });
      linha(box, X, 590, F(54, 500, "rgba(234,242,255,.85)"), [["no", 31.94], ["interior", 32.0], ["de", 32.28], ["São", 32.44], ["Paulo", 32.56]], { d: .3 });
      raiz(S, [[32.66, { y: 0, b: 0, o: 1 }], [33.1, { y: 1500, b: 18, o: .6 }, "inExpo"]]);
    } });

  /* ---- 20 · Microexplosão (32,96–34,74): coluna de ar desce em 3D e se espalha em anéis no chão ---- */
  const MB = (() => { const r = rng(71); return Array.from({ length: 900 }, () => ({ r0: 1.1 * Math.sqrt(r()), a: r() * TAU, ph: r(), v: 15 + r() * 6, c: r() })); })();
  const NB = (() => { const r = rng(73); return Array.from({ length: 70 }, () => ({ x: (r() - .5) * 22, z: (r() - .5) * 14, y: 11 + r() * 1.6, s: 1.6 + r() * 2.2 })); })();
  const cam20 = t => orbita([0, 0, 0], lerp(-14, 12, P(t, 32.7, 34.9, "lin")), 18, 3.4, 58, 0, 4.6);
  cenaV({ id: "c20", vis: [32.7, 35.0], nome: "Microexplosão", inicio: 32.96, fim: 34.74, descricao: "Uma coluna de ar desce da nuvem em 3D, bate no chão e se espalha em anéis (corrente descendente); MICROEXPLOSÃO.",
    montar(S) {
      mundo(S, 32.7, 35.0, cam20, (g, K, t) => {
        g.strokeStyle = nv(.28); g.lineWidth = 2; for (let i = -24; i <= 24; i += 2) { seg(g, K, [i, 0, -24], [i, 0, 24], 14); seg(g, K, [-24, 0, i], [24, 0, i], 14); }
        for (const n of NB) { const q = K.P([n.x, n.y, n.z]); if (!q) continue; const R = n.s * q[2], gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], R); gr.addColorStop(0, "rgba(52,66,92,.75)"); gr.addColorStop(1, "rgba(30,42,64,0)"); g.fillStyle = gr; g.fillRect(q[0] - R, q[1] - R, R * 2, R * 2); }
        for (let k = 0; k < 3; k++) { const u = t - 33.42 - k * .22; if (u <= 0) continue; g.save(); g.shadowColor = CI; g.shadowBlur = 16; anel(g, K, [0, 0, 0], u * 8, ci(.85 * Math.max(0, 1 - u / 1.4)), 5); g.restore(); }
        g.lineCap = "round";
        const pos = (q, s) => { if (s < 11) return [Math.cos(q.a) * q.r0 * (1 + s * .02), 11 - s, Math.sin(q.a) * q.r0 * (1 + s * .02)]; const o = s - 11, r = q.r0 + o * 1.05; return [Math.cos(q.a) * r, .12 + 1.1 * Math.sin(Math.min(o * .45, 3)) * Math.exp(-o * .07), Math.sin(q.a) * r]; };
        for (const q of MB) {
          const s = (t - 32.92 - q.ph * .55) * q.v; if (s <= 0 || s > 26) continue;
          const a = K.P(pos(q, Math.max(0, s - .7))), b = K.P(pos(q, s)); if (!a || !b) continue;
          const al = clamp(s / 2) * clamp((26 - s) / 6);
          g.strokeStyle = q.c < .35 ? ci(.9 * al) : br(.5 * al); g.lineWidth = Math.max(1, .045 * b[2]); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        }
      });
      linha(S, X - 6, 250, F(124, 800, BR) + ";" + extrude("#0F3550", 6, 0, 2), [["MICROEXPLOSÃO", 33.08]], { d: .32 });
      linha(S, X, 400, F(64, 600, CI), [["atmosférica", 33.76]], { d: .32 });
      tremor(S, 33.44, 14);
      raiz(S, [[32.7, { y: -1500, b: 18 }], [33.12, { y: 0, b: 0 }, "expo"]], trans.saiZoom(34.66, { d: .3, s: 1.5 }));
    } });

  /* ---- 21 · 126 km/h (34,74–37,40): anemômetro; o ponteiro dispara até 126; vento forte ---- */
  const vel21 = t => t < 35.74 ? 126 * P(t, 34.9, 35.74, "out") : 126 + 7 * Math.sin((t - 35.74) * 20) * Math.exp(-(t - 35.74) * 6);
  cenaV({ id: "c21", vis: [34.66, 37.4], nome: "126 km/h", inicio: 34.74, fim: 37.4, descricao: "Anemômetro: o ponteiro dispara e trava em 126; linhas de vento atravessando; «126 KM/H» gigante.",
    montar(S) {
      linha(S, X - 4, 230, F(140, 800, BR), [["RAJADAS", 34.74]], { d: .3 });
      linha(S, X, 385, F(64, 600, CI), [["de", 35.18], ["vento", 35.34]], { d: .3 });
      const W = 900, cx = 450, cy = 470, R = 380, sv = svg(S, W, 900, "position:absolute;left:90px;top:500px;overflow:visible");
      const ang = v => (150 + v / 160 * 240) * Math.PI / 180, pt = (v, r) => [cx + Math.cos(ang(v)) * r, cy + Math.sin(ang(v)) * r];
      const arco = (v0, v1, r) => { const [x0, y0] = pt(v0, r), [x1, y1] = pt(v1, r); return `M${x0} ${y0} A${r} ${r} 0 ${(v1 - v0) / 160 * 240 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
      path(sv, arco(0, 160, R), { fill: "none", stroke: "#1E2D46", "stroke-width": 34, "stroke-linecap": "round" });
      const a1 = path(sv, arco(0, 100, R), { fill: "none", stroke: CI, "stroke-width": 34, "stroke-linecap": "round", style: "filter:drop-shadow(0 0 16px rgba(54,197,240,.6))" });
      const a2 = path(sv, arco(100, 160, R), { fill: "none", stroke: MG, "stroke-width": 34, "stroke-linecap": "round", style: "filter:drop-shadow(0 0 18px rgba(255,46,147,.7))" });
      const L1 = a1.getTotalLength(), L2 = a2.getTotalLength(); a1.style.strokeDasharray = L1; a2.style.strokeDasharray = L2;
      for (let v = 0; v <= 160; v += 10) { const [x0, y0] = pt(v, R - 44), [x1, y1] = pt(v, R - (v % 20 ? 64 : 84)); sel(sv, "line", { x1: x0, y1: y0, x2: x1, y2: y1, stroke: v % 20 ? NV : BR, "stroke-width": v % 20 ? 3 : 6, "stroke-linecap": "round" }); if (v % 40 === 0) { const [tx, ty] = pt(v, R - 130); const e = sel(sv, "text", { x: tx, y: ty + 12, "text-anchor": "middle", fill: "#9AA7BA", style: "font:600 34px Inter" }); e.textContent = v; } }
      const ag = sel(sv, "g", {}); sel(ag, "line", { x1: cx, y1: cy, x2: cx + R - 70, y2: cy, stroke: BR, "stroke-width": 10, "stroke-linecap": "round" }); sel(ag, "circle", { cx, cy, r: 26, fill: BR }); sel(ag, "circle", { cx, cy, r: 10, fill: CEU });
      const num = txtC(S, 1200, F(230, 800, BR, "-.05em") + ";font-variant-numeric:tabular-nums;" + extrude("#0F3550", 8, 0, 2), "0");
      const kmh = txtC(S, 1450, F(70, 700, CI, ".12em"), "KM/H"); anim(kmh, IN(35.8, { dy: 30, d: .35 }));
      let last = "";
      fx(t => {
        const v = vel21(t), p1 = clamp(v / 100), p2 = clamp((v - 100) / 60);
        a1.style.strokeDashoffset = (L1 * (1 - p1)).toFixed(1); a2.style.strokeDashoffset = (L2 * (1 - p2)).toFixed(1); a2.style.visibility = p2 > 0 ? "visible" : "hidden";
        ag.setAttribute("transform", `rotate(${(150 + v / 160 * 240).toFixed(2)} ${cx} ${cy})`);
        const s = String(t < 35.74 ? Math.round(v) : 126); if (s !== last) { num.textContent = s; last = s; num.style.color = v > 100 ? MG : BR; }
      });
      anim(sv, trans.entraZoom(34.66, { d: .4, s: .6 }));
      anim(num, [[35.72, { s: 1 }], [35.76, { s: 1.12 }, "out"], [35.95, { s: 1 }, "out"]]);
      tremor(S, 35.76, 14);
    } });
  rajada(37.4);

  /* ---- 22 · 20 casas (37,40–39,58): grade de 20 casas racha em onda; tudo congela ---- */
  cenaV({ id: "c22", vis: [37.4, 39.58], nome: "20 casas", inicio: 37.4, fim: 39.58, descricao: "Grade de 20 casas que racham e inclinam em onda em «20»; no fim, tudo congela e cai o silêncio.",
    montar(S) {
      const G = h("div", "layer", S);
      at(39.42, v => { G.style.filter = v ? "grayscale(1) brightness(.7)" : ""; });
      for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) {
        const x = 130 + i * 210, y = 300 + j * 200, k = j * 4 + i, d = Math.hypot(i - 1.5, j - 2) , tc = 38.56 + d * .05;
        const [sv, g] = casaIcone(G, x, y, 1.45, CI);
        const cr = path(g, `M60 ${18 + (k % 3) * 4} L${52 + (k % 2) * 14} 48 L${66 - (k % 2) * 10} 66 L${56 + (k % 3) * 5} 90`, { fill: "none", stroke: MG, "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }); draw(cr, tc, tc + .14, "out");
        at(tc, v => g.setAttribute("stroke", v ? "#7D8BA0" : CI));
        const rr = (k % 2 ? 1 : -1) * (4 + (k % 3) * 2.5);
        anim(sv, [[37.4 + k * .015, { o: 0, s: .5 }], [37.62 + k * .015, { o: 1, s: 1 }, "back"], [tc, { r: 0, y: 0 }], [tc + .2, { r: rr, y: 8 }, "back"]]);
      }
      linha(S, X, 1310, F(56, 500, "rgba(234,242,255,.85)"), [["danificou", 37.74], ["cerca", 38.14], ["de", 38.34]], { d: .3 });
      linha(S, X - 6, 1385, F(150, 800, BR) + ";" + extrude("#0F3550", 6, 0, 2), [["20", 38.56, `color:${MG}`], ["CASAS", 38.80]], { d: .3 });
      tremor(G, 38.6, 12, .4);
    } });

  /* ---- 23 · Mas por quê? (39,58–42,98): quebra; nuvem escura gira e forma um ponto de interrogação ---- */
  const INTER = (() => {
    const r = rng(81), pts = [], add = (x, y) => { const j = (r() - .5) * 46, k = (r() - .5) * 46; pts.push([x + j, y + k]); };
    for (let i = 0; i < 420; i++) { const a = Math.PI + (i / 420) * (Math.PI * 1.25), R = 205; add(540 + Math.cos(a) * R, 1010 + Math.sin(a) * R); }
    const e = [540 + Math.cos(Math.PI * 2.25) * 205, 1010 + Math.sin(Math.PI * 2.25) * 205];
    for (let i = 0; i < 160; i++) { const u = i / 160; add(lerp(e[0], 540, u), lerp(e[1], 1270, Math.sqrt(u))); }
    for (let i = 0; i < 90; i++) add(540, lerp(1270, 1370, i / 90));
    for (let i = 0; i < 130; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 38; pts.push([540 + Math.cos(a) * d, 1490 + Math.sin(a) * d]); }
    return pts.map(p => ({ alvo: p, r: 120 + r() * 520, th: r() * TAU, w: .4 + r() * .6, d: r(), s: 2.5 + r() * 5, c: r() }));
  })();
  raio(40.3, { x0: 880, x1: 820, y1: 560, w: .55, luz: .45, d: .2 });
  raio(41.62, { x0: 170, x1: 230, y1: 520, w: .5, luz: .42, d: .2 });
  cenaV({ id: "c23", vis: [39.58, 42.98], nome: "Mas por quê?", inicio: 39.58, fim: 42.98, descricao: "Quebra: a música cai; uma nuvem escura gira devagar e forma um ponto de interrogação; relâmpagos distantes.",
    montar(S) {
      bg(S, "rgba(4,8,15,.62)");
      const [, g] = tela(S);
      fx(t => {
        if (t < 39.4 || t > 43.2) return; g.clearRect(0, 0, 1080, 1920);
        for (let k = 0; k < 7; k++) { const a = t * .25 + k * .9, x = 540 + Math.cos(a) * 260, y = 1120 + Math.sin(a) * 200, gr = g.createRadialGradient(x, y, 0, x, y, 420); gr.addColorStop(0, "rgba(40,54,80,.32)"); gr.addColorStop(1, "rgba(30,42,64,0)"); g.fillStyle = gr; g.fillRect(x - 420, y - 420, 840, 840); }
        for (const q of INTER) {
          const m = EASE.inOut(clamp((t - 40.45 - q.d * .55) / 1.1)), th = q.th + (t - 39.58) * q.w * (360 / (q.r + 100));
          const sx = 540 + Math.cos(th) * q.r, sy = 1110 + Math.sin(th) * q.r * .7;
          const x = lerp(sx, q.alvo[0], m) + Math.sin(t * 2 + q.th) * 3, y = lerp(sy, q.alvo[1], m) + Math.cos(t * 2.3 + q.th) * 3;
          g.fillStyle = q.c < .25 ? ci(.85) : q.c < .7 ? br(.7) : nv(.9); g.beginPath(); g.arc(x, y, q.s * (.6 + .4 * m), 0, TAU); g.fill();
        }
      });
      const mas = txt(S, X - 6, 200, F(170, 800, BR) + ";" + extrude("#0F3550", 6, 0, 2), "MAS"); anim(mas, [[39.56, { o: 0, s: 1.3, b: 20 }], [39.6, { o: 1 }, "lin"], [39.95, { s: 1, b: 0 }, "out5"]]);
      linha(S, X, 400, F(60, 600, BR), [["o", 39.72], ["que", 39.80], ["está", 39.86], ["por", 40.02], ["trás", 40.20]], { d: .3 });
      linha(S, X, 478, F(60, 600, BR), [["de", 40.40], ["tantos", 40.62], ["fenômenos", 40.96], ["extremos", 41.38, `color:${MG}`]], { d: .3 });
      linha(S, X, 556, F(60, 600, CI), [["em", 41.86], ["tão", 42.0], ["pouco", 42.18], ["tempo?", 42.40]], { d: .3 });
      raiz(S, [[42.6, { s: 1, b: 0 }], [42.98, { s: 1.12, b: 6 }, "in"]]);
    } });
  relampago(42.98);

  /* ---- 24+25 · Ingredientes (42,98–46,28): termômetro e gota se juntam; setas de vento giram e formam um redemoinho ---- */
  cenaV({ id: "c24", vis: [42.98, 46.5], nome: "Calor e umidade", inicio: 42.98, fim: 44.64, descricao: "Termômetro e gota entram dos lados e se juntam no centro; depois giram juntos dentro do redemoinho.",
    montar(S) {
      const lin = linha(S, X, 300, F(60, 600, "rgba(234,242,255,.85)"), [["A", 42.98], ["combinação", 43.06], ["de", 43.34]], { d: .3 });
      anim(lin, [[44.5, { o: 1 }], [44.7, { o: 0 }, "lin"]]);
      const mk = () => h("div", "abs", S, null, "left:0;top:0;width:0;height:0");
      const T = mk(), D = mk();
      const ts = svg(T, 180, 460, "position:absolute;left:-90px;top:-230px;overflow:visible;filter:drop-shadow(0 0 24px rgba(255,46,147,.45))");
      path(ts, "M64 340 V60 A26 26 0 0 1 116 60 V340 A62 62 0 1 1 64 340 Z", { fill: "#16233A", stroke: BR, "stroke-width": 8, "stroke-linejoin": "round" });
      const merc = sel(ts, "rect", { x: 76, y: 330, width: 28, height: 60, rx: 14, fill: MG }); sel(ts, "circle", { cx: 90, cy: 388, r: 44, fill: MG });
      for (let i = 0; i < 5; i++) sel(ts, "line", { x1: 124, y1: 100 + i * 50, x2: 148, y2: 100 + i * 50, stroke: NV, "stroke-width": 5, "stroke-linecap": "round" });
      fx(t => { const p = P(t, 43.56, 44.3, "out"), hh = 60 + p * 230; merc.setAttribute("y", 390 - hh); merc.setAttribute("height", hh); });
      const ds = svg(D, 260, 320, "position:absolute;left:-130px;top:-170px;overflow:visible;filter:drop-shadow(0 0 26px rgba(54,197,240,.55))");
      const dg = sel(sel(ds, "defs", {}), "linearGradient", { id: "gota", x1: 0, y1: 0, x2: 0, y2: 1 }); sel(dg, "stop", { offset: 0, "stop-color": "#7FDBF7" }); sel(dg, "stop", { offset: 1, "stop-color": "#1A8DB8" });
      path(ds, "M130 10 C170 80 230 150 230 210 A100 100 0 0 1 30 210 C30 150 90 80 130 10 Z", { fill: "url(#gota)", stroke: BR, "stroke-width": 6 });
      path(ds, "M80 200 A54 54 0 0 0 112 262", { fill: "none", stroke: "rgba(255,255,255,.7)", "stroke-width": 10, "stroke-linecap": "round" });
      const lt = h("div", "abs", T, "CALOR", F(54, 800, MG, ".08em") + ";left:-200px;width:400px;text-align:center;top:260px");
      const ld = h("div", "abs", D, "UMIDADE", F(46, 800, CI, ".08em") + ";left:-200px;width:400px;text-align:center;top:180px");
      [lt, ld].forEach((el, i) => anim(el, [[[43.56, 44.10][i] + .1, { o: 0, y: 20 }], [[43.56, 44.10][i] + .4, { o: 1, y: 0 }, "out"], [44.55, { o: 1 }], [44.75, { o: 0 }, "lin"]]));
      fx(t => {
        const eT = P(t, 43.5, 44.0, "expo"), eD = P(t, 44.04, 44.5, "expo"), gi = Math.max(0, t - 44.64), rad = lerp(230, 140, P(t, 44.64, 46.1, "inOut"));
        const ang = Math.PI + gi * gi * 1.6 + gi * 2.2, sobe = P(t, 45.95, 46.45, "in"), esc = 1.3 * (1 - .7 * sobe) * (1 - .2 * P(t, 44.64, 46, "inOut"));
        const cx = 540, cy = 1000 - sobe * 800;
        const pT = t < 44.64 ? [lerp(-300, 290, eT), 1000] : [cx + Math.cos(ang) * rad * esc, cy + Math.sin(ang) * rad * esc];
        const pD = t < 44.64 ? [lerp(1380, 770, eD), 1000] : [cx + Math.cos(ang + Math.PI) * rad * esc, cy + Math.sin(ang + Math.PI) * rad * esc];
        T.style.transform = `translate(${pT[0].toFixed(1)}px,${pT[1].toFixed(1)}px) scale(${esc.toFixed(3)})`; D.style.transform = `translate(${pD[0].toFixed(1)}px,${pD[1].toFixed(1)}px) scale(${esc.toFixed(3)})`;
        T.style.opacity = D.style.opacity = (1 - sobe).toFixed(3);
      });
    } });
  cenaV({ id: "c25", vis: [44.6, 46.5], nome: "Condições atmosféricas", inicio: 44.64, fim: 46.28, z: 42, descricao: "Setas de vento giram em volta dos dois ícones e formam um redemoinho que sobe.",
    montar(S) {
      linha(S, X, 250, F(60, 600, "rgba(234,242,255,.85)"), [["e", 44.38], ["mudanças", 44.64], ["nas", 45.08]], { d: .3 });
      linha(S, X - 4, 330, F(100, 800, BR), [["CONDIÇÕES", 45.22]], { d: .32 });
      linha(S, X - 4, 440, F(100, 800, CI) + ";" + brilhoTxt(), [["ATMOSFÉRICAS", 45.54]], { d: .32 });
      const W = h("div", "abs", S, null, "left:0;top:0;width:1080px;height:1920px;transform-origin:540px 1000px");
      const sv = svg(W, 1080, 1920, "position:absolute;left:0;top:0;overflow:visible");
      const anel2 = (R, n, cor, lw, sent) => { const g = sel(sv, "g", {}); for (let i = 0; i < n; i++) { const a0 = i / n * TAU + .2, a1 = a0 + TAU / n * .62, x0 = 540 + Math.cos(a0) * R, y0 = 1000 + Math.sin(a0) * R, x1 = 540 + Math.cos(a1) * R, y1 = 1000 + Math.sin(a1) * R; path(g, `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`, { fill: "none", stroke: cor, "stroke-width": lw, "stroke-linecap": "round" }); const ta = a1 + Math.PI / 2; path(g, `M${x1 + Math.cos(ta - 2.5) * 30} ${y1 + Math.sin(ta - 2.5) * 30} L${x1} ${y1} L${x1 + Math.cos(ta + 2.5 - Math.PI) * 30 * -1} ${y1 + Math.sin(ta + 2.5 - Math.PI) * 30 * -1}`, { fill: "none", stroke: cor, "stroke-width": lw, "stroke-linecap": "round", "stroke-linejoin": "round" }); } return [g, sent]; };
      const aneis = [anel2(400, 3, CI, 12, 1), anel2(310, 4, "rgba(234,242,255,.6)", 7, 1.4), anel2(470, 6, "rgba(94,107,125,.8)", 5, .8)];
      fx(t => { const gi = Math.max(0, t - 44.6); aneis.forEach(([g, s], i) => g.setAttribute("transform", `rotate(${(gi * gi * 90 + gi * 120) * s + i * 40} 540 1000)`)); });
      anim(W, [[44.6, { o: 0, s: 1.5, b: 10 }], [45.0, { o: 1, s: 1, b: 0 }, "expo"], [45.95, { s: 1, y: 0, o: 1 }], [46.45, { s: .3, y: -800, o: 0 }, "in"]]);
    } });

  /* ---- 26 · Tempestades severas (46,28–48,72): cumulonimbus 3D cresce em torre até a bigorna; relâmpagos dentro ---- */
  const PUF = (() => { const r = rng(91), out = []; for (let i = 0; i < 150; i++) { const y = .8 + r() * 8.6, rr = (y < 2 ? 2.6 : 1.7) * Math.sqrt(r()), a = r() * TAU; out.push({ p: [Math.cos(a) * rr, y, Math.sin(a) * rr], s: 1.2 + r() * 1.1, bg: false }); } for (let i = 0; i < 80; i++) { const a = r() * TAU, rr = 1.5 + r() * 6.5; out.push({ p: [Math.cos(a) * rr * 1.25 + 1.2, 9.3 + r() * 1.2 - rr * .05, Math.sin(a) * rr * .8], s: 1.0 + r() * .7, bg: true }); } return out; })();
  const cam26 = t => orbita([0, 0, 0], lerp(-18, 6, P(t, 46.2, 49.4, "lin")), 25, 1.2, 56, 0, 3.6);
  raio(48.02, { sem: true, luz: .9, x0: 560, d: .26 }); raio(47.56, { sem: true, luz: .4, x0: 460, d: .14 });
  relampago(48.02, .45, .24);
  cenaV({ id: "c26", vis: [46.2, 49.36], nome: "Tempestades severas", inicio: 46.28, fim: 48.72, descricao: "Cumulonimbus 3D cresce em torre até a bigorna; em «severas» um relâmpago dentro da nuvem desce até o chão.",
    montar(S) {
      mundo(S, 46.2, 49.36, cam26, (g, K, t) => {
        g.strokeStyle = nv(.22); g.lineWidth = 2; for (let i = -30; i <= 30; i += 3) { seg(g, K, [i, 0, -30], [i, 0, 30], 14); seg(g, K, [-30, 0, i], [30, 0, i], 14); }
        const G = P(t, 46.2, 48.2, "out") * 11, esp = P(t, 47.2, 48.6, "out"), [L] = luz(t);
        const lista = [];
        for (const q of PUF) {
          let p = q.p; if (q.bg) p = [lerp(0, p[0], esp), p[1], lerp(0, p[2], esp)];
          const vis = q.bg ? clamp((G - 9) / 1.2) * esp : clamp((G - p[1]) / 1.4); if (vis <= 0) continue;
          lista.push([V.dot(V.sub(p, K.pos), K.f), p, q.s * (.4 + .6 * vis), vis]);
        }
        lista.sort((a, b) => b[0] - a[0]);
        for (const [, p, s, vis] of lista) {
          const q = K.P(p); if (!q) continue; const R = s * q[2], topo = clamp(p[1] / 10), k = L * (1 - Math.abs(p[1] - 5) / 7) * 150;
          const gr = g.createRadialGradient(q[0] - R * .2, q[1] - R * .35, R * .1, q[0], q[1], R);
          gr.addColorStop(0, `rgba(${(70 + topo * 60 + k) | 0},${(86 + topo * 66 + k) | 0},${(114 + topo * 70 + k) | 0},${.95 * vis})`); gr.addColorStop(.7, `rgba(${(36 + k * .6) | 0},${(50 + k * .6) | 0},${(76 + k * .6) | 0},${.85 * vis})`); gr.addColorStop(1, "rgba(24,36,58,0)");
          g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], R, 0, TAU); g.fill();
        }
        if (t >= 48.02 && t < 48.3) { const a = K.P([.6, 2.2, 0]), b = K.P([1.6, 0, -.4]); if (a && b) bolt(g, { x0: a[0], y0: a[1], x1: b[0], y1: b[1], seed: 4802, w: .9 }, Math.floor((t - 48.02) * 30) % 3 === 1 ? .35 : 1); }
      });
      linha(S, X, 1240, F(56, 500, "rgba(234,242,255,.85)"), [["favorece", 46.28], ["a", 46.92], ["formação", 47.02], ["de", 47.36]], { d: .3 });
      linha(S, X - 4, 1310, F(124, 800, BR), [["TEMPESTADES", 47.52]], { d: .32 });
      const sv2 = txt(S, X - 6, 1440, F(124, 800, MG) + ";" + brilhoTxt("255,46,147", .45), "SEVERAS"); bate(sv2, 48.02, 1.35);
      tremor(S, 48.04, 10);
    } });

  /* ---- 27 · Previsão (48,72–51,60): Brasil com varredura contínua e selo ATENÇÃO (sem marcar regiões) ---- */
  const cam27 = trilhaMapa([[48.72, { lon: -53, lat: -15.5, k: 27 }], [51.9, { lon: -53, lat: -15.2, k: 24.5 }, "sine"]]);
  cenaV({ id: "c27", vis: [48.72, 51.85], nome: "Previsão", inicio: 48.72, fim: 51.6, descricao: "Contorno do Brasil com varredura de radar contínua e selo ATENÇÃO pulsando (sem marcar regiões específicas).",
    montar(S, c, S0) {
      varredura(S0, 48.72, .6);
      mapa(S, 48.72, 51.85, cam27, (g, M, t) => { const [cx, cy] = M.P(-53, -15.5); radar(g, cx, cy, 640, t * 2.6, .85); }, { cy: 900 });
      linha(S, X, 250, F(56, 500, "rgba(234,242,255,.85)"), [["E", 48.72], ["a", 48.80], ["previsão", 48.84], ["ainda", 49.22]], { d: .3 });
      linha(S, X - 4, 325, F(120, 800, BR), [["EXIGE", 49.46]], { d: .32 });
      const selo = h("div", "selo", S, null, `left:50%;top:1330px;width:640px;margin-left:-320px;box-sizing:border-box;color:${MG};display:flex;align-items:center;justify-content:center;gap:24px;background:rgba(14,23,38,.85);box-shadow:0 0 50px rgba(255,46,147,.45),inset 0 0 30px rgba(255,46,147,.2)`);
      const ic = svg(selo, 70, 62); path(ic, "M35 4 L66 58 H4 Z", { fill: "none", stroke: MG, "stroke-width": 6, "stroke-linejoin": "round" }); path(ic, "M35 24 V40 M35 48 V50", { stroke: MG, "stroke-width": 6, "stroke-linecap": "round" });
      h("span", "", selo, "ATENÇÃO");
      anim(selo, [[49.73, { o: 0, s: 2, b: 12 }], [49.76, { o: 1 }, "lin"], [49.95, { s: 1, b: 0 }, "out5"]]);
      fx(t => { selo.style.borderColor = t > 49.95 && Math.floor((t - 49.95) * 3) % 2 ? "rgba(255,46,147,.35)" : ""; });
      centro(S, 1490, F(52, 500, "rgba(234,242,255,.85)"), [["em", 50.06], ["várias", 50.26], ["regiões", 50.58], ["do", 50.96], ["país", 51.08]], { d: .3 });
      raiz(S, [[51.4, { o: 1, b: 0, s: 1 }], [51.85, { o: 0, b: 16, s: 1.06 }, "in"]]);
    } });

  /* ---- 28 · Estamos preparados? (51,60–55,40): palavras no meio da chuva; em «intensos», relâmpago e flash ---- */
  raio(54.84, { x0: 640, y0: -60, x1: 470, y1: 1960, w: 1.25, frente: true, luz: 1, d: .34 });
  relampago(54.84, 1, .4);
  cenaV({ id: "c28", vis: [51.55, 55.4], nome: "Estamos preparados?", inicio: 51.6, fim: 55.4, descricao: "Palavras surgem no meio da chuva, que engrossa; em «intensos», relâmpago e flash.",
    montar(S) {
      linha(S, X, 575, F(64, 600, "#9AA7BA", ".06em"), [["A", 51.6], ["PERGUNTA", 51.64], ["É", 51.88]], { d: .3 });
      const vem = (el, t) => anim(el, [[t - .02, { o: 0, s: 1.25, b: 16 }], [t, { o: 1 }, "lin"], [t + .4, { s: 1, b: 0 }, "expo"]]);
      const e1 = txt(S, X - 6, 670, F(180, 800) + ";" + extrude("#0F3550", 8, 0, 2), "ESTAMOS"); vem(e1, 52.34);
      const e2 = txt(S, X - 6, 850, F(150, 800, CI) + ";" + brilhoTxt(), "PREPARADOS"); vem(e2, 52.54);
      linha(S, X, 1050, F(60, 600, BR), [["para", 53.14], ["enfrentar", 53.30], ["temporais", 53.70]], { d: .3 });
      linha(S, X, 1140, F(60, 600, BR), [["cada", 54.14], ["vez", 54.32], ["mais", 54.64]], { d: .3 });
      const it = txt(S, X - 6, 1240, F(150, 800, BR) + ";" + extrude("#0F3550", 8, 0, 2), "INTENSOS?"); bate(it, 54.84, 1.5, 24);
      tremor(S, 54.86, 18, .34);
      raiz(S, trans.entraFundo(51.55, { d: .5, s: 1.15 }));
    } });

  /* ---- 29 · Cartela (55,40–60): a pergunta parada; fonte e assinatura Studio Matteu discretas ---- */
  cenaV({ id: "c29", vis: [55.4, 60.2], nome: "Cartela", inicio: 55.4, fim: 60.0, descricao: "ESTAMOS PREPARADOS? parado com leve deriva; «Fonte: Defesa Civil do RS»; assinatura Studio Matteu discreta; chuva ao fundo.",
    montar(S) {
      bg(S, "rgba(6,10,19,.55)");
      const C = cam(S, 55.4, 60, { s0: 1.03, s1: 1, e: "out" });
      txtC(C, 700, F(150, 800) + ";" + extrude("#0F3550", 8, 0, 2), "ESTAMOS");
      txtC(C, 870, F(132, 800) + ";" + extrude("#0F3550", 8, 0, 2), `PREPARADOS<span style="color:${CI}">?</span>`);
      const ln = h("div", "abs", C, null, `left:390px;top:1060px;width:300px;height:6px;border-radius:3px;background:${CI};transform-origin:50% 50%;box-shadow:0 0 18px rgba(54,197,240,.6)`); anim(ln, [[55.5, { sx: 0 }], [56.0, { sx: 1 }, "expo"]]);
      const f = txtC(C, 1120, F(32, 500, "#9AA7BA", ".02em"), "Fonte: Defesa Civil do RS"); anim(f, IN(55.7, { dy: 20, d: .45 }));
      const sg = txtC(C, 1430, F(30, 600, "rgba(234,242,255,.72)", ".04em"), "Studio Matteu"); anim(sg, IN(56.2, { dy: 20, d: .5 }));
    } });
})();
