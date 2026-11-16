// Trilha original em Web Audio, 120 BPM, 15 s. O mesmo grafo roda num OfflineAudioContext
// (render determinístico: player e exportação usam o mesmo buffer).
// Estrutura (1 compasso = 2 s): 0–2 intro (sub + textura) · 2 impacto + kick · 4 drop · 6–7 hats em 16 avos
// 7–7,5 respiro · 7,5 toque · 8–12 arpejo/órbita · 11–12 subida · 12 queda · 13,5 impacto final + cauda.
import { rng, BEAT } from './util.js';

const SR = 48000, DUR = 15;
const midi = n => 440 * Math.pow(2, (n - 69) / 12);

export async function renderMusic() {
  const ctx = new OfflineAudioContext(2, SR * DUR, SR);
  build(ctx);
  return ctx.startRendering();
}

function build(ctx) {
  const R = rng(2026);
  // ---- master: compressão de barramento + limitador ----
  const master = ctx.createGain(); master.gain.value = .36;
  const glue = ctx.createDynamicsCompressor(); glue.threshold.value = -16; glue.ratio.value = 3; glue.attack.value = .01; glue.release.value = .18; glue.knee.value = 6;
  const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -3; lim.ratio.value = 20; lim.attack.value = .001; lim.release.value = .08; lim.knee.value = 0;
  master.connect(glue).connect(lim).connect(ctx.destination);
  // final: fade curto só nos últimos 60 ms para terminar em silêncio limpo em 15,0 s
  master.gain.setValueAtTime(.36, DUR - .06); master.gain.linearRampToValueAtTime(0, DUR - .002);

  // ---- reverberação: resposta ao impulso gerada (ruído com decaimento, estéreo) ----
  const ir = ctx.createBuffer(2, SR * 2.6, SR);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) { const k = i / d.length; d[i] = (R() * 2 - 1) * Math.pow(1 - k, 3.2) * (i < 200 ? i / 200 : 1); } }
  const verb = ctx.createConvolver(); verb.buffer = ir;
  const verbIn = ctx.createGain(); verbIn.gain.value = 1;
  const verbHP = ctx.createBiquadFilter(); verbHP.type = 'highpass'; verbHP.frequency.value = 250;
  const verbOut = ctx.createGain(); verbOut.gain.value = .5;
  verbIn.connect(verbHP).connect(verb).connect(verbOut).connect(master);
  const send = (node, amt) => { const g = ctx.createGain(); g.gain.value = amt; node.connect(g).connect(verbIn); };

  // ---- sidechain: barramento musical que "respira" com o kick ----
  const duckBus = ctx.createGain(); duckBus.connect(master);
  const kicks = [];
  for (let t = 2; t < 12; t += BEAT) { if (t >= 7 && t < 7.5) continue; kicks.push(t); }
  kicks.push(13.5);
  duckBus.gain.setValueAtTime(1, 0);
  kicks.forEach(t => { duckBus.gain.setValueAtTime(1, t); duckBus.gain.linearRampToValueAtTime(.38, t + .012); duckBus.gain.setTargetAtTime(1, t + .03, .09); });

  const noiseBuf = ctx.createBuffer(1, SR * 2, SR); { const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
  const noise = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(t, R() * 1.5); s.stop(t + dur); return s; };

  // ---- KICK: seno com queda de afinação + clique ----
  function kick(t, big = 1) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(160 * (big > 1 ? .9 : 1), t); o.frequency.exponentialRampToValueAtTime(44, t + .09); o.frequency.exponentialRampToValueAtTime(38, t + .4 * big);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.95 * Math.min(big, 1.15), t + .003); g.gain.exponentialRampToValueAtTime(.001, t + .42 * big);
    o.connect(g).connect(master); o.start(t); o.stop(t + .5 * big + .1);
    const c = noise(t, .02), cf = ctx.createBiquadFilter(), cg = ctx.createGain();
    cf.type = 'bandpass'; cf.frequency.value = 3500; cg.gain.setValueAtTime(.18, t); cg.gain.exponentialRampToValueAtTime(.001, t + .018);
    c.connect(cf).connect(cg).connect(master);
  }
  kicks.forEach(t => kick(t, t === 13.5 ? 1.8 : t === 2 || t === 4 || t === 8 ? 1.25 : 1));

  // ---- SUB‑BASS: drone na intro, linha em semínimas a partir de 2 s ----
  // progressão (Mi menor): Em | C | Am | B7sus → órbita: Em | C | G | D · final: Em
  const roots = [[0, 28], [2, 28], [4, 24], [6, 21], [7, 23], [8, 28], [9, 24], [10, 31], [11, 26], [12, 28], [13.5, 28]];
  const rootAt = t => { let r = 28; for (const [a, n] of roots) if (t >= a) r = n; return r; };
  {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sine'; o.frequency.setValueAtTime(midi(28), 0);
    f.type = 'lowpass'; f.frequency.value = 120;
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(.42, 1.2); g.gain.linearRampToValueAtTime(.3, 1.98); g.gain.linearRampToValueAtTime(0, 2.05);
    o.connect(f).connect(g).connect(master); o.start(0); o.stop(2.2);
  }
  function bassNote(t, n, d, v = .5) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sine'; o2.type = 'sawtooth'; o.frequency.value = midi(n); o2.frequency.value = midi(n); o2.detune.value = 6;
    f.type = 'lowpass'; f.Q.value = 2; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(140, t + d * .9);
    const g2 = ctx.createGain(); g2.gain.value = .22;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .008); g.gain.setTargetAtTime(v * .6, t + .03, .08); g.gain.setTargetAtTime(0, t + d - .03, .015);
    o.connect(g); o2.connect(g2).connect(f).connect(g); g.connect(duckBus);
    o.start(t); o2.start(t); o.stop(t + d + .1); o2.stop(t + d + .1);
  }
  for (let t = 2; t < 12; t += BEAT / 2) {
    if (t >= 7 && t < 7.5) continue;
    const off = (Math.round(t / (BEAT / 2)) % 2) === 1;           // colcheia do contratempo = oitava acima
    bassNote(t + (off ? 0 : 0), rootAt(t) + (off ? 12 : 0), BEAT / 2 - .02, off ? .3 : .5);
  }
  bassNote(13.5, 28, 1.45, .62);

  // ---- PAD: acordes de serras desafinadas com filtro que abre no drop ----
  const chords = [[4, [52, 55, 59, 64]], [6, [48, 52, 55, 60]], [7, [47, 50, 54, 57]], [8, [52, 55, 59, 62]], [9, [48, 52, 55, 59]], [10, [55, 59, 62, 66]], [11, [50, 54, 57, 62]]];
  const padF = ctx.createBiquadFilter(); padF.type = 'lowpass'; padF.Q.value = .7;
  padF.frequency.setValueAtTime(300, 2); padF.frequency.exponentialRampToValueAtTime(700, 3.95); padF.frequency.setValueAtTime(2600, 4); padF.frequency.exponentialRampToValueAtTime(1400, 7);
  padF.frequency.setValueAtTime(900, 7.5); padF.frequency.exponentialRampToValueAtTime(1800, 11); padF.frequency.exponentialRampToValueAtTime(5200, 11.95);
  const padG = ctx.createGain(); padG.gain.value = .0;
  padG.gain.setValueAtTime(0, 2); padG.gain.linearRampToValueAtTime(.05, 3.95); padG.gain.setValueAtTime(.1, 4); padG.gain.setValueAtTime(.1, 6.95); padG.gain.linearRampToValueAtTime(.03, 7.05);
  padG.gain.linearRampToValueAtTime(.09, 8); padG.gain.setValueAtTime(.09, 11.97); padG.gain.linearRampToValueAtTime(0, 12.03);
  const panL = ctx.createStereoPanner(); panL.pan.value = -.55; const panR = ctx.createStereoPanner(); panR.pan.value = .55;
  padF.connect(padG); padG.connect(duckBus); send(padG, .35);
  [[2, [52, 55, 59, 64]], ...chords].forEach(([t0, notes], ci, arr) => {
    const t1 = ci + 1 < arr.length ? arr[ci + 1][0] : 12.05;
    notes.forEach((n, i) => [-9, 9].forEach((det, j) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = midi(n); o.detune.value = det + (i - 1.5) * 2;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.25, t0 + .03); g.gain.setValueAtTime(.25, t1 - .02); g.gain.linearRampToValueAtTime(0, t1 + .03);
      o.connect(g).connect(j ? panR : panL); o.start(t0); o.stop(t1 + .05);
    }));
  });
  panL.connect(padF); panR.connect(padF);

  // ---- HATS / PULSAÇÃO: ruído agudo, contratempos no drop, 16 avos em 6–7 e na órbita ----
  function hat(t, v, open = false) {
    const s = noise(t, open ? .2 : .05), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    f.type = 'highpass'; f.frequency.value = open ? 7000 : 9000;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + (open ? .18 : .04));
    p.pan.value = (R() - .5) * .5; s.connect(f).connect(g).connect(p).connect(master);
  }
  for (let t = 2; t < 4; t += BEAT) hat(t + BEAT / 2, .05);
  for (let t = 4; t < 6; t += BEAT) hat(t + BEAT / 2, .1, true);
  for (let t = 6; t < 7; t += BEAT / 4) hat(t, (Math.round(t * 8) % 2 ? .05 : .09));
  for (let t = 8; t < 12; t += BEAT / 4) hat(t, (Math.round(t * 8) % 4 === 2 ? .1 : .035));

  // ---- CLAP nos tempos 2 e 4 do compasso a partir do drop ----
  function clap(t, v = .3) {
    [0, .008, .018].forEach((d, i) => {
      const s = noise(t + d, .2), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 1.4;
      g.gain.setValueAtTime(v * (i === 2 ? 1 : .6), t + d); g.gain.exponentialRampToValueAtTime(.001, t + d + (i === 2 ? .16 : .02));
      s.connect(f).connect(g); g.connect(master); send(g, .4);
    });
  }
  for (let t = 4; t < 12; t += 2 * BEAT) { if (t >= 7 && t < 7.5) continue; clap(t + BEAT, t < 8 ? .32 : .24); }

  // ---- ARPEJO da órbita (8–12): pluck quadrado, pan alternado (espacialização) ----
  const arpNotes = [[8, [64, 67, 71, 74]], [9, [60, 64, 67, 71]], [10, [67, 71, 74, 78]], [11, [62, 66, 69, 74]]];
  let step = 0;
  for (let t = 8; t < 12; t += BEAT / 4, step++) {
    let ns = arpNotes[0][1]; for (const [a, n] of arpNotes) if (t >= a) ns = n;
    const n = ns[step % 4] + (step % 8 >= 4 ? 12 : 0);
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    o.type = 'square'; o.frequency.value = midi(n);
    f.type = 'lowpass'; f.Q.value = 4; f.frequency.setValueAtTime(3800 + (t - 8) * 700, t); f.frequency.exponentialRampToValueAtTime(500, t + .1);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.06, t + .003); g.gain.exponentialRampToValueAtTime(.001, t + .14);
    p.pan.value = step % 2 ? .6 : -.6;
    o.connect(f).connect(g).connect(p).connect(duckBus); send(p, .3);
    o.start(t); o.stop(t + .16);
  }

  // ---- TEXTURA DIGITAL (intro): grãos curtos filtrados, discretos ----
  for (let i = 0; i < 26; i++) {
    const t = .2 + R() * 1.7, s = noise(t, .03), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    f.type = 'bandpass'; f.frequency.value = 2500 + R() * 6000; f.Q.value = 12;
    g.gain.setValueAtTime(.05 + R() * .05, t); g.gain.exponentialRampToValueAtTime(.001, t + .025);
    p.pan.value = R() * 1.6 - .8; s.connect(f).connect(g).connect(p).connect(master); send(p, .5);
  }
  // tom metálico fino na intro (FM leve), acompanha o deslocamento da câmera sobre o chip
  {
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain(), p = ctx.createStereoPanner();
    car.frequency.value = midi(88); mod.frequency.value = midi(88) * 1.414; mg.gain.value = 600;
    mod.connect(mg).connect(car.frequency);
    g.gain.setValueAtTime(0, .3); g.gain.linearRampToValueAtTime(.018, .9); g.gain.linearRampToValueAtTime(0, 2.0);
    p.pan.setValueAtTime(-.7, .3); p.pan.linearRampToValueAtTime(.7, 2.0);
    car.connect(g).connect(p).connect(master); send(p, .8);
    car.start(.3); mod.start(.3); car.stop(2.1); mod.stop(2.1);
  }

  // ---- SUBIDAS MUSICAIS (filtro de ruído) antes do drop e da queda ----
  function sweepUp(t0, t1, v) {
    const s = noise(t0, t1 - t0 + .05), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(400, t0); f.frequency.exponentialRampToValueAtTime(9000, t1);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t1 - .02); g.gain.linearRampToValueAtTime(0, t1);
    s.connect(f).connect(g).connect(master); send(g, .5);
  }
  sweepUp(3, 4, .07); sweepUp(11, 12, .08);

  // ---- QUEDA (12–13,5): só sub e acorde em reverberação ----
  {
    [40, 47, 52, 55, 59].forEach((n, i) => {
      const o = ctx.createOscillator(); o.type = i ? 'triangle' : 'sine'; o.frequency.value = midi(n);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, 12); g.gain.linearRampToValueAtTime(i ? .045 : .3, 12.02); g.gain.setTargetAtTime(0, 12.1, .6);
      o.connect(g).connect(master); send(g, 1.2); o.start(12); o.stop(13.5);
    });
    // pulso de batimento leve (pré‑assinatura)
    [12.5, 13.0].forEach(t => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(40, t + .2); g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + .3); o.connect(g).connect(master); o.start(t); o.stop(t + .35); });
  }
  // ---- IMPACTO FINAL DA MARCA (13,5): acorde aberto + sub longo + cauda ----
  [52, 59, 64, 67, 71, 76].forEach((n, i) => {
    [-7, 7].forEach(det => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = midi(n); o.detune.value = det;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(4200, 13.5); f.frequency.exponentialRampToValueAtTime(600, 14.9);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, 13.5); g.gain.linearRampToValueAtTime(.032, 13.51); g.gain.setTargetAtTime(0, 13.6, .5);
      o.connect(f).connect(g).connect(master); send(g, .9); o.start(13.5); o.stop(15);
    });
  });
}
