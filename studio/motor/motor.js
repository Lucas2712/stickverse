/* MOTION DESIGN STUDIO · motor de animação
 * Tudo é função do tempo t (segundos): render(t) desenha qualquer quadro, em qualquer ordem.
 * Isso garante que o player, o scrub, a revisão por quadros e a exportação MP4 mostram exatamente a mesma coisa.
 * Expõe o namespace global MDS. Os componentes e as cenas usam só o que está aqui.
 */
(function () {
  "use strict";
  const MDS = (window.MDS = window.MDS || {});
  MDS.W = 1080; MDS.H = 1920;

  /* ---------- curvas de suavização ---------- */
  const EASE = {
    lin: p => p,
    out: p => 1 - Math.pow(1 - p, 3),
    out5: p => 1 - Math.pow(1 - p, 5),
    expo: p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p),
    in: p => p * p * p,
    inExpo: p => p <= 0 ? 0 : Math.pow(2, 10 * p - 10),
    inOut: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    inOutExpo: p => p <= 0 ? 0 : p >= 1 ? 1 : p < .5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2,
    sine: p => -(Math.cos(Math.PI * p) - 1) / 2,
    back: p => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    backSoft: p => { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    elastic: p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI) / 3) + 1,
  };
  MDS.EASE = EASE;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const prog = (t, a, b, e = "lin") => (EASE[e] || EASE.lin)(clamp((t - a) / (b - a)));
  const lerp = (a, b, p) => a + (b - a) * p;
  Object.assign(MDS, { clamp, prog, lerp });

  /* ---------- trilhas de propriedades ----------
   * anim(el, [[t, {x,y,s,sx,sy,r,rx,ry,o,b}, easeDaChegada], ...])
   * x,y em px · s escala · r rotação (graus) · rx/ry rotação 3D · o opacidade · b blur (px)
   * A curva de cada chave vale para o trecho que CHEGA nela. Chame anim uma vez por elemento. */
  const DEF = { x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, rx: 0, ry: 0, o: 1, b: 0 };
  const TRACKS = [], FX = [];
  function anim(el, keys) {
    if (!el) return el;
    const props = {};
    for (const [t, p, e] of keys) for (const k in p) {
      if (!(k in DEF)) throw new Error(`anim: propriedade desconhecida "${k}"`);
      (props[k] ||= []).push([t, p[k], EASE[e || "expo"] || EASE.expo]);
    }
    for (const k in props) props[k].sort((a, b) => a[0] - b[0]);
    TRACKS.push({ el, props });
    return el;
  }
  function val(a, t) {
    if (t <= a[0][0]) return a[0][1];
    const L = a[a.length - 1]; if (t >= L[0]) return L[1];
    for (let i = 1; i < a.length; i++) if (t < a[i][0]) {
      const A = a[i - 1], B = a[i], d = B[0] - A[0];
      return d <= 0 ? B[1] : A[1] + (B[1] - A[1]) * B[2]((t - A[0]) / d);
    }
  }
  function render(t) {
    for (const tr of TRACKS) {
      const v = {}; for (const k in DEF) v[k] = tr.props[k] ? val(tr.props[k], t) : DEF[k];
      let tf = (v.rx || v.ry) ? "perspective(1800px) " : "";
      tf += `translate3d(${v.x.toFixed(2)}px,${v.y.toFixed(2)}px,0)`;
      if (v.rx) tf += ` rotateX(${v.rx.toFixed(2)}deg)`;
      if (v.ry) tf += ` rotateY(${v.ry.toFixed(2)}deg)`;
      if (v.r) tf += ` rotate(${v.r.toFixed(2)}deg)`;
      tf += ` scale(${(v.s * v.sx).toFixed(4)},${(v.s * v.sy).toFixed(4)})`;
      const st = tr.el.style, o = clamp(v.o);
      st.transform = tf;
      st.opacity = o.toFixed(3);
      st.visibility = o < .003 ? "hidden" : "visible";
      st.filter = v.b > .15 ? `blur(${v.b.toFixed(1)}px)` : "none";
    }
    for (const f of FX) f(t);
  }
  const fx = f => { FX.push(f); return f; };
  Object.assign(MDS, { anim, fx, render });

  /* entrada / saída padrão (devolvem chaves para somar em anim) */
  MDS.IN = (t, o = {}) => { const { dy = 110, dx = 0, s = .9, b = 18, d = .62, r = 0, e = "expo" } = o;
    return [[t, { o: 0, y: dy, x: dx, s, b, r }], [t + d, { o: 1, y: 0, x: 0, s: 1, b: 0, r: 0 }, e]]; };
  MDS.OUT = (t, o = {}) => { const { dy = -90, dx = 0, s = 1.04, b = 16, d = .45, e = "in", r = 0 } = o;
    return [[t, { o: 1, y: 0, x: 0, s: 1, b: 0, r: 0 }], [t + d, { o: 0, y: dy, x: dx, s, b, r }, e]]; };
  /* mantém visível só no intervalo [a, b] com fades curtos */
  MDS.VIS = (a, b, f = .08) => [[a - f, { o: 0 }], [a, { o: 1 }, "lin"], [b, { o: 1 }], [b + f, { o: 0 }, "lin"]];

  /* ---------- DOM ---------- */
  MDS.palco = () => document.getElementById("stage");
  function h(tag, cls, parent, html, css) {
    const e = document.createElement(tag); if (cls) e.className = cls;
    if (html != null) e.innerHTML = html; if (css) e.style.cssText = css;
    (parent || MDS.palco()).appendChild(e); return e;
  }
  const SVGNS = "http://www.w3.org/2000/svg";
  function svg(parent, w, hgt, css) { const s = document.createElementNS(SVGNS, "svg"); s.setAttribute("viewBox", `0 0 ${w} ${hgt}`); s.setAttribute("width", w); s.setAttribute("height", hgt); if (css) s.style.cssText = css; parent.appendChild(s); return s; }
  function sel(parent, tag, attrs) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }
  const path = (s, d, attrs = {}) => sel(s, "path", { d, ...attrs });
  Object.assign(MDS, { h, svg, sel, path, SVGNS });

  /* ---------- efeitos por quadro reutilizáveis ---------- */
  /* desenha um traço SVG de a até b */
  MDS.draw = (p, a, b, e = "inOut") => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return fx(t => { p.style.strokeDashoffset = (L * (1 - prog(t, a, b, e))).toFixed(1); }); };
  /* digitação com cursor opcional */
  MDS.typeText = (el, text, t0, cps = 30, caretEl, hideCaretAt) => {
    let last = -1;
    return fx(t => {
      const n = Math.round(clamp((t - t0) * cps, 0, text.length));
      if (n !== last) { el.textContent = text.slice(0, n); last = n; }
      if (caretEl) {
        const on = t >= t0 - .3 && t < (hideCaretAt ?? 1e9);
        const blink = t < t0 || t > t0 + text.length / cps ? Math.floor(t * 2.6) % 2 === 0 : true;
        caretEl.style.opacity = on && blink ? 1 : 0;
      }
    });
  };
  /* contador numérico */
  MDS.counter = (el, from, to, a, b, fmt = v => Math.round(v).toLocaleString("pt-BR"), e = "expo") => {
    let last = ""; return fx(t => { const s = fmt(from + (to - from) * prog(t, a, b, e)); if (s !== last) { el.textContent = s; last = s; } });
  };
  /* flutuação contínua (usa a propriedade CSS translate, não conflita com anim) */
  MDS.floaty = (el, amp = 10, sp = .9, ph = 0) => fx(t => { el.style.translate = `0 ${(Math.sin(t * sp + ph) * amp).toFixed(2)}px`; });
  /* liga uma classe no intervalo [a, b) */
  MDS.classAt = (el, cls, a, b = 1e9) => fx(t => el.classList.toggle(cls, t >= a && t < b));
  /* executa f(on) quando o estado muda (troca de texto, cor etc.) */
  MDS.at = (a, f, b = 1e9) => { let st = null; return fx(t => { const on = t >= a && t < b; if (on !== st) { st = on; f(on); } }); };

  /* ---------- cenas e efeitos sonoros ---------- */
  MDS.CENAS = []; MDS.SFX = [];
  /* MDS.cena({ id, nome, inicio, fim, descricao, z, sfx: [["whoosh", 2.6], ...], montar(S) { ... } }) */
  MDS.cena = cfg => { MDS.CENAS.push(cfg); return cfg; };
  MDS.sfx = (tipo, t, ganho = 1) => MDS.SFX.push([tipo, t, ganho]);
  MDS.montarCenas = () => {
    MDS.CENAS.sort((a, b) => a.inicio - b.inicio);
    for (const c of MDS.CENAS) {
      // invólucro só existe na tela perto da janela da cena (desempenho e sem sobras);
      // a raiz S fica livre para a "câmera" da cena (anim(S, ...)).
      const m = c.margem ?? .8, wrap = h("div", "scene-wrap", MDS.palco(), null, `z-index:${c.z ?? 40}`);
      wrap.dataset.cena = c.id;
      fx(t => { const on = t >= c.inicio - m && t <= c.fim + m; if (wrap._on !== on) { wrap._on = on; wrap.style.display = on ? "block" : "none"; } });
      const S = h("section", "scene", wrap);
      (c.sfx || []).forEach(([k, t, g]) => MDS.sfx(k, t, g));
      c.montar(S, c);
    }
  };
})();
