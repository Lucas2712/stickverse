/* MOTION DESIGN STUDIO · fundos e o traço conector
 * fundo.molduras  retângulos finos de wireframe com parallax (profundidade sutil)
 * fundo.grade     grade de pontos que desliza devagar
 * fundo.manchas   manchas de cor desfocadas que derivam (abertura escura, clima)
 * fundo.grao      grão de filme por cima de tudo (acabamento)
 * traco           traço grosso com gradiente que costura as cenas mudando de forma (poses)
 */
(function () {
  "use strict";
  const M = window.MDS, F = M.fundo = {};
  const camada = (z, parent) => M.h("div", "layer", parent || M.palco(), null, `z-index:${z}`);
  function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  F.molduras = (o = {}) => {
    const { z = 1, n = 7, seed = 3, cor = "var(--v-line)", vel = 1, parent } = o, L = camada(z, parent), r = rng(seed);
    for (let i = 0; i < n; i++) {
      const w = 150 + r() * 260, hh = 180 + r() * 300, x = -60 + r() * 1000, y = r() * 1800, sp = (5 + r() * 10) * vel;
      const e = M.h("div", "abs", L, null, `left:${x}px;top:${y}px;width:${w}px;height:${hh}px;border:2px solid ${cor};border-radius:28px`);
      M.fx(t => { e.style.translate = `0 ${(-t * sp + Math.sin(t * .5 + i) * 8).toFixed(1)}px`; });
    }
    return L;
  };
  F.grade = (o = {}) => {
    const { z = 1, passo = 60, cor = "var(--v-line)", vel = 8, parent, raio = 2.5 } = o, L = camada(z, parent);
    const g = M.h("div", "abs", L, null, `left:0;top:0;width:1080px;height:${1920 + passo * 4}px;background-image:radial-gradient(${cor} ${raio}px, transparent ${raio + .5}px);background-size:${passo}px ${passo}px`);
    M.fx(t => { g.style.translate = `0 ${(-(t * vel) % passo).toFixed(1)}px`; });
    return L;
  };
  F.manchas = (o = {}) => {
    const { z = 1, cores = ["#2C1B3F", "#3C2024", "#140F2E"], parent, blur = 160, opac = .9 } = o, L = camada(z, parent);
    cores.forEach((c, i) => {
      const e = M.h("div", "abs", L, null, `left:${[80, 520, 260][i % 3]}px;top:${[300, 900, 1400][i % 3]}px;width:620px;height:620px;border-radius:50%;background:${c};filter:blur(${blur}px);opacity:${opac}`);
      M.fx(t => { e.style.translate = `${(Math.sin(t * .35 + i * 2) * 90).toFixed(1)}px ${(Math.cos(t * .28 + i) * 110).toFixed(1)}px`; });
    });
    return L;
  };
  F.grao = (o = {}) => {
    const { z = 98, opac = .06 } = o, L = camada(z);
    const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d"), im = x.createImageData(256, 256), r = rng(7);
    for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    x.putImageData(im, 0, 0);
    const e = M.h("div", "abs", L, null, `inset:-64px;background-image:url(${c.toDataURL()});opacity:${opac};mix-blend-mode:multiply`);
    M.fx(t => { const f = Math.floor(t * 12); e.style.translate = `${(f * 37) % 64 - 32}px ${(f * 53) % 64 - 32}px`; });
    return L;
  };

  /* ---------- traço conector ----------
   * M.traco({ z, largura, cores: [[0,"#fff"],[.3,"#FF8A3D"],...] (cores em hex), poses: { nome: [[x,y] x 9] },
   *           roteiro: [[t, "pose"], ...], desenho: [inicio, fim], brilho: true, ondula: 9 })
   * M.traco.anel(cx, cy, rx, ry) gera uma pose em anel. Poses precisam ter o mesmo número de pontos. */
  M.traco = (o) => {
    const { z = 30, largura = 46, poses, roteiro, desenho = [0, 1.2], brilho = true, ondula = 9 } = o;
    const cores = (o.cores || [[0, "#FFFFFF"], [.12, "#FFC48C"], [.32, "#FF8A3D"], [.6, "#FF5A1F"], [.85, "#E8340C"], [1, "#FFFFFF"]])
      .map(([u, hx]) => [u, [1, 3, 5].map(i => parseInt(hx.slice(i, i + 2), 16))]);
    const gC = M.h("canvas", "", M.palco(), null, `position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z - 1};filter:blur(22px);opacity:.32`);
    const rC = M.h("canvas", "", M.palco(), null, `position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}`);
    gC.width = 270; gC.height = 480; rC.width = 1080; rC.height = 1920;
    const g = gC.getContext("2d"), r = rC.getContext("2d");
    const col = u => { for (let i = 1; i < cores.length; i++) if (u <= cores[i][0]) { const [a, ca] = cores[i - 1], [b, cb] = cores[i], p = (u - a) / (b - a || 1); return `rgb(${ca.map((c, k) => Math.round(c + (cb[k] - c) * p)).join(",")})`; } return "rgb(255,255,255)"; };
    const pts = t => {
      let A = roteiro[0], B = roteiro[0];
      for (const k of roteiro) { if (k[0] <= t) A = k; if (k[0] > t) { B = k; break; } B = k; }
      const p = A === B ? 1 : M.EASE.inOut(M.clamp((t - A[0]) / (B[0] - A[0]))), P = poses[A[1]], Q = poses[B[1]];
      return P.map((a, i) => [a[0] + (Q[i][0] - a[0]) * p + Math.sin(t * 1.1 + i * .8) * ondula, a[1] + (Q[i][1] - a[1]) * p + Math.cos(t * .9 + i * .6) * ondula]);
    };
    const spline = (P, per = 26) => { const out = [], n = P.length;
      for (let i = 0; i < n - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n - 1, i + 2)];
        for (let j = 0; j < per; j++) { const u = j / per, u2 = u * u, u3 = u2 * u;
          out.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3))); } }
      out.push(P[n - 1]); return out; };
    M.fx(t => {
      r.clearRect(0, 0, 1080, 1920); g.clearRect(0, 0, 270, 480);
      const head = M.prog(t, desenho[0], desenho[1], "out"); if (head <= 0) return;
      const vis = o.visivel ? o.visivel(t) : 1; rC.style.opacity = vis; gC.style.opacity = (.32 * vis).toFixed(3); if (vis <= 0) return;
      const S = spline(pts(t)), N = Math.max(2, Math.floor(S.length * head));
      r.lineCap = g.lineCap = "round";
      for (let i = 1; i < N; i++) { const c = col(i / (S.length - 1)), a = S[i - 1], b = S[i];
        r.strokeStyle = c; r.lineWidth = largura; r.beginPath(); r.moveTo(a[0], a[1]); r.lineTo(b[0], b[1]); r.stroke();
        g.strokeStyle = c; g.lineWidth = largura * .7; g.beginPath(); g.moveTo(a[0] / 4, a[1] / 4); g.lineTo(b[0] / 4, b[1] / 4); g.stroke(); }
      if (brilho) { r.strokeStyle = "rgba(255,255,255,.28)"; r.lineWidth = largura * .22; r.beginPath(); for (let i = 0; i < N; i++) { const p = S[i]; i ? r.lineTo(p[0] - 7, p[1] - 9) : r.moveTo(p[0] - 7, p[1] - 9); } r.stroke(); }
    });
    return { rC, gC };
  };
  M.traco.anel = (cx, cy, rx, ry, a0 = -100, giro = 384) => Array.from({ length: 9 }, (_, i) => { const a = (a0 + giro * i / 8) * Math.PI / 180; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
})();
