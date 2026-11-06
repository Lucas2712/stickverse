/* MOTION DESIGN STUDIO · mapa-múndi animado
 * Dados: Natural Earth 1:110m via world-atlas (studio/dados/paises-110m.json), embutidos pelo montar.py
 * só quando o projeto usa MDS.mapa. Projeção Natural Earth I.
 *
 * M.mapa(parent, {
 *   x, y, w, h,                          área do mapa no palco
 *   destaques: [{ pais: "Brasil", t, cor }],   nome em português (lista PT abaixo), em inglês ou código ISO numérico
 *   pinos:     [{ lat, lon, t, rotulo, cor }],
 *   arcos:     [{ de: [lat, lon], para: [lat, lon], t, d }],
 *   camera:    [[t, { lat, lon, zoom }], ...]  zoom 1 = mundo inteiro
 *   terra, borda: cores
 * })
 */
(function () {
  "use strict";
  const M = window.MDS;
  const PT = { "brasil": "Brazil", "estados unidos": "United States of America", "eua": "United States of America", "china": "China", "portugal": "Portugal",
    "argentina": "Argentina", "mexico": "Mexico", "canada": "Canada", "japao": "Japan", "alemanha": "Germany", "franca": "France", "reino unido": "United Kingdom",
    "italia": "Italy", "espanha": "Spain", "russia": "Russia", "india": "India", "australia": "Australia", "africa do sul": "South Africa", "chile": "Chile",
    "colombia": "Colombia", "peru": "Peru", "uruguai": "Uruguay", "paraguai": "Paraguay", "bolivia": "Bolivia", "venezuela": "Venezuela", "equador": "Ecuador",
    "coreia do sul": "South Korea", "coreia do norte": "North Korea", "israel": "Israel", "ira": "Iran", "iraque": "Iraq", "ucrania": "Ukraine", "turquia": "Turkey",
    "egito": "Egypt", "nigeria": "Nigeria", "arabia saudita": "Saudi Arabia", "indonesia": "Indonesia", "angola": "Angola", "mocambique": "Mozambique",
    "noruega": "Norway", "suecia": "Sweden", "polonia": "Poland", "holanda": "Netherlands", "paises baixos": "Netherlands", "suica": "Switzerland", "grecia": "Greece",
    "groenlandia": "Greenland", "nova zelandia": "New Zealand", "filipinas": "Philippines", "vietna": "Vietnam", "tailandia": "Thailand", "paquistao": "Pakistan",
    "emirados arabes unidos": "United Arab Emirates", "catar": "Qatar", "cuba": "Cuba", "marrocos": "Morocco", "argelia": "Algeria", "quenia": "Kenya", "etiopia": "Ethiopia" };
  const sem = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  let GEO = null;
  function carregar() {
    if (GEO) return GEO;
    const topo = (window.MDS_DADOS || {}).paises;
    if (!topo) throw new Error("mapa: dados de países ausentes (montar.py embute studio/dados/paises-110m.json)");
    const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
    const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
    const arco = i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    const anel = idx => { const out = []; idx.forEach((i, k) => { const a = arco(i); out.push(...(k ? a.slice(1) : a)); }); return out; };
    GEO = topo.objects.countries.geometries.map(g => ({ id: g.id, nome: g.properties.name,
      aneis: g.type === "Polygon" ? g.arcs.map(anel) : g.type === "MultiPolygon" ? g.arcs.flatMap(p => p.map(anel)) : [] }));
    return GEO;
  }
  const rad = Math.PI / 180;
  function proj(lon, lat) {
    const l = lat * rad, p2 = l * l, p4 = p2 * p2;
    return [lon * rad * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))),
            -l * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))];
  }
  M.mapa = (parent, o) => {
    const geo = carregar(), { w, h: hh } = o;
    const el = M.h("div", "abs", parent, null, `left:${o.x}px;top:${o.y}px;width:${w}px;height:${hh}px;overflow:hidden`);
    const s = M.svg(el, w, hh, "position:absolute;left:0;top:0");
    const K = w / 5.6;                      // escala base: mundo inteiro cabe na largura
    const P = (lon, lat) => { const [x, y] = proj(lon, lat); return [x * K, y * K]; };
    const cam = M.sel(s, "g", {}), terra = M.sel(cam, "g", {});
    const caminhos = {};
    for (const c of geo) {
      let d = "";
      for (const r of c.aneis) { let prev = null; r.forEach(([lon, lat]) => { const [x, y] = P(lon, lat); d += (prev === null || Math.abs(lon - prev) > 180 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1); prev = lon; }); }
      caminhos[c.id] = caminhos[sem(c.nome)] = M.path(terra, d, { fill: o.terra || "var(--v-line)", stroke: o.borda || "var(--v-bg)", "stroke-width": 1.2, "vector-effect": "non-scaling-stroke", "stroke-linejoin": "round" });
    }
    const achar = p => caminhos[p] || caminhos[sem(p)] || caminhos[sem(PT[sem(p)] || "")];
    (o.destaques || []).forEach(dz => {
      const pth = achar(dz.pais); if (!pth) { console.warn("mapa: país não encontrado:", dz.pais); return; }
      pth.parentNode.appendChild(pth);
      const cor = dz.cor || "var(--v-ac)";
      M.fx(t => { const p = M.prog(t, dz.t, dz.t + .5, "out"); pth.style.fill = p > 0 ? cor : ""; pth.style.fillOpacity = p > 0 ? (.25 + .75 * p).toFixed(2) : ""; });
    });
    const sobre = M.sel(cam, "g", {}), arcos = [];
    (o.arcos || []).forEach(a => {
      const [x1, y1] = P(a.de[1], a.de[0]), [x2, y2] = P(a.para[1], a.para[0]);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * .35;
      const pth = M.path(sobre, `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, { fill: "none", stroke: a.cor || "var(--v-ac)", "stroke-linecap": "round" });
      const L = pth.getTotalLength(); pth.style.strokeDasharray = L;
      arcos.push(t => { const p = M.prog(t, a.t, a.t + (a.d || 1), "inOut"); pth.style.visibility = p > 0 ? "visible" : "hidden"; pth.style.strokeDashoffset = (L * (1 - p)).toFixed(2); });
    });
    // câmera: interpola centro e zoom
    const cams = (o.camera || [[0, { lat: 10, lon: 0, zoom: 1 }]]).slice().sort((a, b) => a[0] - b[0]);
    const estado = t => {
      let A = cams[0], B = cams[0];
      for (const c of cams) { if (c[0] <= t) A = c; if (c[0] > t) { B = c; break; } B = c; }
      const p = A === B ? 1 : M.EASE.inOutExpo(M.clamp((t - A[0]) / (B[0] - A[0])));
      const z = Math.exp(M.lerp(Math.log(A[1].zoom || 1), Math.log(B[1].zoom || 1), p));
      return { lat: M.lerp(A[1].lat, B[1].lat, p), lon: M.lerp(A[1].lon, B[1].lon, p), z };
    };
    const pinos = (o.pinos || []).map(pn => {
      const [x, y] = P(pn.lon, pn.lat), g = M.sel(sobre, "g", {});
      const anel = M.sel(g, "circle", { r: 18, fill: "none", stroke: pn.cor || "var(--v-ac)", "stroke-width": 4 });
      M.sel(g, "circle", { r: 14, fill: pn.cor || "var(--v-ac)", stroke: "var(--v-bg)", "stroke-width": 5 });
      let lab = null;
      if (pn.rotulo) { lab = M.h("div", "chip ink abs", el, pn.rotulo, "left:0;top:0;translate:-50% -150%;font-size:28px;height:56px;padding:0 22px"); M.anim(lab, M.IN(pn.t + .15, { dy: 20, s: .7, e: "back", d: .45 })); }
      return { x, y, g, anel, lab, t: pn.t };
    });
    M.fx(t => {
      const c = estado(t), [cx, cy] = P(c.lon, c.lat), k = c.z;
      sobre.style.strokeWidth = (5 / k).toFixed(3); for (const f of arcos) f(t);
      cam.setAttribute("transform", `translate(${(w / 2 - cx * k).toFixed(2)} ${(hh / 2 - cy * k).toFixed(2)}) scale(${k.toFixed(4)})`);
      for (const pn of pinos) {
        const p = M.prog(t, pn.t, pn.t + .45, "back"), pul = t > pn.t ? ((t - pn.t) * .8) % 1 : 0;
        pn.g.setAttribute("transform", `translate(${pn.x} ${pn.y}) scale(${(Math.max(0, p) / k).toFixed(4)})`);
        pn.anel.setAttribute("r", (18 + pul * 40).toFixed(1)); pn.anel.style.opacity = t > pn.t ? (1 - pul).toFixed(2) : 0;
        if (pn.lab) { pn.lab.style.left = (w / 2 + (pn.x - cx) * k).toFixed(1) + "px"; pn.lab.style.top = (hh / 2 + (pn.y - cy) * k).toFixed(1) + "px"; }
      }
    });
    return { el, achar };
  };
})();
