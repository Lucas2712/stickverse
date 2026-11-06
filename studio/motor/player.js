/* MOTION DESIGN STUDIO · player
 * Relógio próprio (performance.now): a animação nunca para se o áudio travar.
 * Controles: iniciar/pausar, reiniciar, scrub, volumes por canal, legendas, efeitos, guia de zona segura.
 * Ganchos para as ferramentas: window.__seek(t), window.__pronto, window.MDS.
 */
(function () {
  "use strict";
  const M = window.MDS;
  const $ = id => document.getElementById(id);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const ICON_PLAY = '<path d="M6 4l14 8-14 8z"/>', ICON_PAUSE = '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>';

  M.iniciar = async () => {
    const P = window.PROJETO, PAL = window.PALAVRAS || [];
    M.DUR = P.duracao; M.PROJETO = P;
    const fontes = document.fonts ? document.fonts.ready : Promise.resolve();
    await Promise.race([fontes, new Promise(r => setTimeout(r, 3000))]);
    M.audio.init(P.audio || {}, PAL);
    M.montarCenas();
    const caps = M.legendas(PAL, P.legendas || {});

    const vp = $("vp"), stage = $("stage"), playB = $("play"), scrub = $("scrub"), timeL = $("time"), poster = $("poster");
    scrub.max = M.DUR;
    let T = 0, playing = false, t0 = 0, raf = 0;
    const cenas = M.CENAS;
    // lista de cenas
    const lista = $("scenes");
    const botoes = cenas.map((c, i) => {
      const li = M.h("li", "", lista), b = M.h("button", "", li,
        `<span class="tc">${c.inicio.toFixed(1).replace(".", ",")}–${c.fim.toFixed(1).replace(".", ",")} s</span><span><b>${i + 1}. ${c.nome}</b><span class="d">${c.descricao || ""}</span></span>`);
      b.type = "button";
      b.addEventListener("click", () => { const was = playing; pause(); poster.hidden = true; show(c.inicio + .01); if (was) play(); });
      return b;
    });
    $("meta-cenas").textContent = `${cenas.length} cenas`;
    $("meta-dur").textContent = `${M.DUR} s`;

    function show(t) {
      T = M.clamp(t, 0, M.DUR); M.render(T);
      scrub.value = T.toFixed(2); timeL.textContent = `${fmt(T)} / ${fmt(M.DUR)}`;
      let idx = cenas.findIndex(c => T >= c.inicio && T < c.fim); if (idx < 0) idx = cenas.length - 1;
      botoes.forEach((b, i) => b.setAttribute("aria-current", i === idx ? "true" : "false"));
    }
    function ui() {
      playB.querySelector("span").textContent = playing ? "Pausar" : (T > 0 && T < M.DUR ? "Continuar" : "Iniciar");
      playB.querySelector("svg").innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      playB.setAttribute("aria-label", playing ? "Pausar" : "Iniciar");
    }
    function tick() {
      if (!playing) return;
      const t = (performance.now() - t0) / 1000;
      if (t >= M.DUR) { show(M.DUR); pause(); return; }
      show(t); M.audio.tick(t); raf = requestAnimationFrame(tick);
    }
    function play(from) {
      if (from != null) T = from; if (T >= M.DUR) T = 0;
      poster.hidden = true; playing = true; t0 = performance.now() - T * 1000;
      M.audio.play(T); ui(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    }
    function pause() { playing = false; M.audio.pause(); cancelAnimationFrame(raf); ui(); }
    document.addEventListener("visibilitychange", () => { if (document.hidden && playing) pause(); });

    playB.addEventListener("click", () => playing ? pause() : play(poster.hidden ? null : 0));
    $("restart").addEventListener("click", () => { pause(); show(0); play(0); });
    poster.addEventListener("click", () => play(0));
    scrub.addEventListener("input", () => { const was = playing; if (was) pause(); poster.hidden = true; show(+scrub.value); if (was) play(); });
    $("caps").addEventListener("change", e => { caps.ligar(e.target.checked); M.render(T); });
    $("sfx").addEventListener("change", e => { M.audio.efeitosOn = e.target.checked; if (playing) M.audio.reagendar(T); });
    const guia = M.h("div", "safe-guide", stage, '<i style="left:0;right:0;top:0;height:220px"></i><i style="left:0;right:0;bottom:0;height:340px"></i><i style="right:0;top:1000px;bottom:340px;width:130px"></i>');
    $("safe").addEventListener("change", e => guia.classList.toggle("on", e.target.checked));
    document.addEventListener("keydown", e => { if (e.code === "Space" && !/INPUT|BUTTON/.test(document.activeElement.tagName)) { e.preventDefault(); playing ? pause() : play(); } });

    // mixer
    const mix = $("mix");
    [["narracao", "Narração", M.audio.temNarracao], ["musica", "Música", M.audio.temMusica], ["efeitos", "Efeitos", M.SFX.length > 0]].forEach(([k, nome, tem]) => {
      if (!tem) return;
      const id = "vol-" + k, v = Math.round(M.audio.vol[k] * 100);
      M.h("label", "", mix, nome).setAttribute("for", id);
      const inp = M.h("input", "", mix); Object.assign(inp, { type: "range", id, min: 0, max: 100, step: 1, value: v });
      const out = M.h("output", "", mix, v + "%"); out.setAttribute("for", id);
      inp.addEventListener("input", () => { M.audio.setVol(k, inp.value / 100); out.textContent = inp.value + "%"; });
    });
    if (!mix.children.length) mix.hidden = true;

    const fit = () => { stage.style.transform = `scale(${vp.clientWidth / 1080})`; };
    new ResizeObserver(fit).observe(vp); fit();
    window.__seek = t => { poster.hidden = true; show(t); };
    show(P.poster ?? Math.min(M.DUR, (cenas[1] || cenas[0] || { inicio: 0 }).inicio + 1)); ui();
    window.__pronto = true;
  };
  document.addEventListener("DOMContentLoaded", () => M.iniciar().catch(e => { console.error(e); window.__erro = String(e && e.stack || e); }));
})();
