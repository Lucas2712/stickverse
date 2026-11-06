/* MOTION DESIGN STUDIO · áudio em 3 canais
 *  narração (arquivo do ElevenLabs) · música (arquivo opcional enviado pelo usuário) · efeitos (sintetizados aqui)
 * Cada canal tem volume próprio. A música abaixa sozinha enquanto há fala (ducking).
 * Sem arquivo de música, o canal de música simplesmente não existe: nada é inventado.
 * O relógio é do player; os arquivos de áudio é que se realinham a ele.
 */
(function () {
  "use strict";
  const M = window.MDS;
  const A = M.audio = { vol: { narracao: 1, musica: .3, efeitos: .5 }, efeitosOn: true };
  let cfg = {}, vo = null, mus = null, AC = null, bus = null, noise = null, fala = [], lastRetry = 0;

  A.init = (projAudio = {}, palavras = []) => {
    cfg = projAudio; Object.assign(A.vol, projAudio.volumes || {});
    vo = document.getElementById("vo"); mus = document.getElementById("mus");
    A.temNarracao = !!(vo && vo.getAttribute("src")); A.temMusica = !!(mus && mus.getAttribute("src"));
    // intervalos de fala (para o ducking), juntando pausas curtas
    fala = [];
    for (const w of palavras) { const L = fala[fala.length - 1]; if (L && w.s - L[1] < .45) L[1] = w.e; else fala.push([w.s, w.e]); }
  };
  /* 0..1: quanto a música deve abaixar no instante t */
  A.duck = t => {
    const d = cfg.ducking || {}; if (d.ativo === false) return 0;
    let v = 0; for (const [a, b] of fala) { if (t < a - .3) break; v = Math.max(v, M.prog(t, a - .15, a + .05) * (1 - M.prog(t, b + .1, b + .45))); }
    return v;
  };
  const mOff = () => (cfg.musica && cfg.musica.inicio) || 0;   // segundo do vídeo em que a música entra
  const mCut = () => (cfg.musica && cfg.musica.corte) || 0;    // segundo do arquivo de música usado como início
  function volMusica(t) {
    const m = cfg.musica || {}, dur = M.DUR;
    const fi = m.fadeIn ?? .6, fo = m.fadeOut ?? 1.5;
    const env = M.prog(t, mOff(), mOff() + fi) * (1 - M.prog(t, dur - fo, dur));
    const red = (cfg.ducking && cfg.ducking.reducao) ?? .4;   // ganho da música durante a fala
    return A.vol.musica * env * (1 - A.duck(t) * (1 - red));
  }
  const sync = (el, tt, dur) => {
    if (!el) return;
    const d = isFinite(el.duration) ? el.duration : dur;
    if (tt < 0 || tt > d - .2) { if (!el.paused) el.pause(); return; }
    if (!el.paused && Math.abs(el.currentTime - tt) > .3) { try { el.currentTime = tt; } catch (e) {} }
    if (el.paused && performance.now() - (el._retry || 0) > 1000) { el._retry = performance.now(); try { el.currentTime = tt; } catch (e) {} el.play().catch(() => {}); }
  };
  /* chamado a cada quadro enquanto toca */
  A.tick = t => {
    if (A.temNarracao) { vo.volume = M.clamp(A.vol.narracao); sync(vo, t, 1e9); }
    if (A.temMusica) { mus.volume = M.clamp(volMusica(t)); sync(mus, t - mOff() + mCut(), 1e9); }
  };
  A.play = t => { ensureAC(); if (AC && AC.state === "suspended") AC.resume(); A.tick(t); agendar(t); };
  A.pause = () => { if (vo) vo.pause(); if (mus) mus.pause(); pararEfeitos(); };
  A.setVol = (canal, v) => { A.vol[canal] = v; if (canal === "efeitos" && bus) bus.gain.value = v; };

  /* ---------- efeitos sintetizados ---------- */
  function ensureAC() { if (AC) return; try { AC = new (window.AudioContext || window.webkitAudioContext)(); noise = mkNoise(AC); } catch (e) { AC = null; } }
  function mkNoise(ctx) { const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0); let s = 1; for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; } return b; }
  /* TIPOS: whoosh, swoosh, riser, swell, pop, blip, tick, key, click, send, flip, boom, hit, chime, ding, glitch */
  function voz(ctx, out, nb, tipo, when, ganho = 1) {
    const g = ctx.createGain(); g.connect(out);
    const env = (a, pk, dec) => { g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(pk * ganho, when + a); g.gain.exponentialRampToValueAtTime(.0001, when + a + dec); };
    const osc = (type, f0, f1, dur, at = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, when + at); o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), when + at + dur); o.connect(g); o.start(when + at); o.stop(when + at + dur + .05); };
    const ruido = (dur, f0, f1, q = 1, tipoF = "bandpass") => { const n = ctx.createBufferSource(); n.buffer = nb; const f = ctx.createBiquadFilter(); f.type = tipoF; f.Q.value = q; f.frequency.setValueAtTime(f0, when); f.frequency.exponentialRampToValueAtTime(f1, when + dur); n.connect(f); f.connect(g); n.start(when); n.stop(when + dur); };
    switch (tipo) {
      case "whoosh": env(.22, .5, .35); ruido(.6, 300, 2600, .9); break;
      case "swoosh": env(.06, .45, .2); ruido(.3, 2400, 600, 1.1); break;
      case "riser": env(1.1, .3, .15); ruido(1.3, 300, 5000, 1.4); osc("sine", 180, 720, 1.2); break;
      case "swell": env(.9, .18, .9); ruido(1.8, 200, 900, .7); break;
      case "pop": env(.005, .35, .12); osc("sine", 520, 980, .12); break;
      case "blip": env(.004, .16, .08); osc("sine", 1100, 1700, .08); break;
      case "tick": env(.002, .3, .06); osc("triangle", 1800, 2400, .05); break;
      case "key": env(.001, .12, .03); ruido(.04, 3800, 2500, 2); break;
      case "click": env(.001, .35, .04); osc("square", 1400, 700, .03); break;
      case "send": env(.002, .4, .1); osc("sine", 700, 300, .1); ruido(.05, 4000, 3000, 1.5); break;
      case "flip": env(.01, .3, .2); ruido(.25, 1500, 400, 1.2); break;
      case "boom": env(.005, .8, .7); osc("sine", 120, 38, .7); break;
      case "hit": env(.002, .7, .35); osc("sine", 160, 45, .35); ruido(.12, 1800, 300, .8, "lowpass"); break;
      case "chime": env(.004, .22, .9); osc("sine", 1318, 1318, .9); osc("sine", 1976, 1976, .8, .06); break;
      case "ding": env(.003, .25, .5); osc("sine", 1760, 1760, .5); break;
      case "glitch": env(.001, .25, .12); ruido(.12, 6000, 900, 3); osc("square", 90, 60, .1); break;
      default: console.warn("efeito desconhecido:", tipo);
    }
  }
  function agendar(from) {
    pararEfeitos(); if (!AC || !A.efeitosOn) return;
    bus = AC.createGain(); bus.gain.value = A.vol.efeitos; bus.connect(AC.destination);
    const now = AC.currentTime + .03;
    for (const [k, t, g] of M.SFX) if (t >= from) voz(AC, bus, noise, k, now + (t - from), g);
  }
  function pararEfeitos() { if (bus) { try { bus.gain.setValueAtTime(0, AC.currentTime); bus.disconnect(); } catch (e) {} bus = null; } }
  A.reagendar = t => agendar(t);

  /* renderização offline dos efeitos (exportador de MP4): PCM 16 bits mono, base64, volume 1 */
  A.renderEfeitos = async (sr = 48000) => {
    const off = new OfflineAudioContext(1, Math.ceil(sr * M.DUR), sr), nb = mkNoise(off);
    for (const [k, t, g] of M.SFX) voz(off, off.destination, nb, k, t, g);
    const buf = (await off.startRendering()).getChannelData(0);
    const i16 = new Int16Array(buf.length); for (let i = 0; i < buf.length; i++) i16[i] = M.clamp(buf[i], -1, 1) * 32767;
    let s = ""; const u8 = new Uint8Array(i16.buffer); for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
    return btoa(s);
  };
})();
