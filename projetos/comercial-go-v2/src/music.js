// v2 · trilha original em Web Audio, 120 BPM, 22 s (1 compasso = 2 s), renderizada num OfflineAudioContext.
// Arco: 0–4 intro (grave + texturas + tom metálico) · 4 GO: impacto, entra o kick · 6 drop suave (baixo, pad, clap)
// 12–15 respiro (só kick e grave; 13,5 toque) · 15–18 arpejo sobre o horizonte · 17–18 subida
// 18–20 queda (pad e sub em reverberação) · 20 assinatura sonora (acorde aberto + grave) · cauda até 22.
import { rng, BEAT } from './util.js';

const SR = 48000, DUR = 22;
const midi = n => 440 * Math.pow(2, (n - 69) / 12);

export async function renderMusic() {
  const ctx = new OfflineAudioContext(2, SR * DUR, SR);
  build(ctx);
  return ctx.startRendering();
}

function build(ctx) {
  const R = rng(2027), G0 = .34;
  const master = ctx.createGain(); master.gain.value = G0;
  const glue = ctx.createDynamicsCompressor(); glue.threshold.value = -16; glue.ratio.value = 2.5; glue.attack.value = .012; glue.release.value = .2; glue.knee.value = 6;
  const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -3; lim.ratio.value = 20; lim.attack.value = .001; lim.release.value = .08; lim.knee.value = 0;
  master.connect(glue).connect(lim).connect(ctx.destination);
  master.gain.setValueAtTime(G0, DUR - .5); master.gain.linearRampToValueAtTime(0, DUR - .01);

  // reverberação gerada (estéreo, 3,2 s)
  const ir = ctx.createBuffer(2, SR * 3.2, SR);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < d.length; i++) { const k = i / d.length; d[i] = (R() * 2 - 1) * Math.pow(1 - k, 3) * (i < 240 ? i / 240 : 1); } }
  const verb = ctx.createConvolver(); verb.buffer = ir;
  const vIn = ctx.createGain(), vHP = ctx.createBiquadFilter(), vOut = ctx.createGain();
  vHP.type = 'highpass'; vHP.frequency.value = 220; vOut.gain.value = .5;
  vIn.connect(vHP).connect(verb).connect(vOut).connect(master);
  const send = (node, amt) => { const g = ctx.createGain(); g.gain.value = amt; node.connect(g).connect(vIn); };

  // barramento com sidechain do kick
  const duck = ctx.createGain(); duck.connect(master);
  const kicks = [];
  for (let t = 4; t < 18; t += BEAT) { if (t >= 12 && t < 15 && Math.round((t - 12) / BEAT) % 2 === 1) continue; kicks.push(t); }
  kicks.push(20);
  duck.gain.setValueAtTime(1, 0);
  kicks.forEach(t => { duck.gain.setValueAtTime(1, t); duck.gain.linearRampToValueAtTime(.42, t + .012); duck.gain.setTargetAtTime(1, t + .03, .1); });

  const nb = ctx.createBuffer(1, SR * 2, SR); { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
  const noise = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = nb; s.loop = true; s.start(t, R() * 1.5); s.stop(t + dur); return s; };

  // KICK (sub controlado: filtro passa-baixa e cauda curta)
  function kick(t, big = 1) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900;
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(46, t + .09); o.frequency.exponentialRampToValueAtTime(40, t + .35 * big);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.85 * Math.min(big, 1.1), t + .003); g.gain.exponentialRampToValueAtTime(.001, t + .38 * big);
    o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + .45 * big + .1);
    const c = noise(t, .02), cf = ctx.createBiquadFilter(), cg = ctx.createGain();
    cf.type = 'bandpass'; cf.frequency.value = 3200; cg.gain.setValueAtTime(.12, t); cg.gain.exponentialRampToValueAtTime(.001, t + .016);
    c.connect(cf).connect(cg).connect(master);
  }
  kicks.forEach(t => kick(t, t === 20 ? 1.7 : t === 4 || t === 6 ? 1.2 : 1));

  // GRAVE: drone na intro, linha a partir do drop
  // Mi menor: Em | C | Am | B · Em | C | (respiro) | G | D | (queda) Em | assinatura Em(add9)
  const roots = [[0, 28], [6, 28], [8, 24], [10, 21], [11, 23], [12, 28], [15, 31], [16, 26], [17, 24], [18, 28]];
  const rootAt = t => { let r = 28; for (const [a, n] of roots) if (t >= a) r = n; return r; };
  { const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.frequency.value = midi(28); f.type = 'lowpass'; f.frequency.value = 110;
    g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(.32, 2.5); g.gain.linearRampToValueAtTime(.38, 3.9); g.gain.linearRampToValueAtTime(0, 4.1);
    o.connect(f).connect(g).connect(master); o.start(0); o.stop(4.2); }
  function bass(t, n, d, v) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(), g2 = ctx.createGain();
    o.frequency.value = midi(n); o2.type = 'sawtooth'; o2.frequency.value = midi(n); o2.detune.value = 5; g2.gain.value = .18;
    f.type = 'lowpass'; f.Q.value = 1.5; f.frequency.setValueAtTime(800, t); f.frequency.exponentialRampToValueAtTime(130, t + d * .9);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.setTargetAtTime(v * .6, t + .03, .08); g.gain.setTargetAtTime(0, t + d - .03, .015);
    o.connect(g); o2.connect(g2).connect(f).connect(g); g.connect(duck); o.start(t); o2.start(t); o.stop(t + d + .1); o2.stop(t + d + .1);
  }
  for (let t = 4; t < 18; t += BEAT / 2) {
    const off = Math.round(t / (BEAT / 2)) % 2 === 1;
    if (t < 6 && off) continue;                         // 4–6: só no tempo
    if (t >= 12 && t < 15) { if (!off && Math.round((t - 12) / BEAT) % 2 === 0) bass(t, rootAt(t), BEAT * .9, .42); continue; }
    bass(t, rootAt(t) + (off ? 12 : 0), BEAT / 2 - .02, off ? .26 : .45);
  }
  { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = midi(28);
    g.gain.setValueAtTime(0, 18); g.gain.linearRampToValueAtTime(.34, 18.05); g.gain.setTargetAtTime(0, 18.3, .7); o.connect(g).connect(master); o.start(18); o.stop(20); }
  bass(20, 28, 1.9, .5);

  // PAD (serras desafinadas, filtro que respira com as cenas)
  const chords = [[4, [52, 55, 59, 64]], [6, [52, 55, 59, 64]], [8, [48, 52, 55, 60]], [10, [45, 52, 57, 60]], [11, [47, 51, 54, 59]],
    [12, [52, 55, 59, 62]], [15, [55, 59, 62, 66]], [16, [50, 54, 57, 62]], [17, [48, 52, 55, 59]], [18, [40, 47, 52, 55, 59]]];
  const padF = ctx.createBiquadFilter(); padF.type = 'lowpass'; padF.Q.value = .7;
  padF.frequency.setValueAtTime(280, 3); padF.frequency.exponentialRampToValueAtTime(900, 5.95); padF.frequency.setValueAtTime(2400, 6);
  padF.frequency.exponentialRampToValueAtTime(1500, 11.9); padF.frequency.exponentialRampToValueAtTime(700, 12.6); padF.frequency.exponentialRampToValueAtTime(1200, 14.9);
  padF.frequency.exponentialRampToValueAtTime(2000, 16.9); padF.frequency.exponentialRampToValueAtTime(4800, 17.95); padF.frequency.exponentialRampToValueAtTime(900, 19.5);
  const padG = ctx.createGain();
  padG.gain.setValueAtTime(0, 3); padG.gain.linearRampToValueAtTime(.045, 5.9); padG.gain.linearRampToValueAtTime(.09, 6.1); padG.gain.setValueAtTime(.09, 11.8);
  padG.gain.linearRampToValueAtTime(.05, 12.4); padG.gain.linearRampToValueAtTime(.085, 15); padG.gain.setValueAtTime(.085, 17.95); padG.gain.linearRampToValueAtTime(.07, 18.1);
  padG.gain.linearRampToValueAtTime(0, 19.95);
  const pL = ctx.createStereoPanner(), pR = ctx.createStereoPanner(); pL.pan.value = -.55; pR.pan.value = .55;
  pL.connect(padF); pR.connect(padF); padF.connect(padG); padG.connect(duck); send(padG, .45);
  chords.forEach(([t0, notes], ci) => {
    const t1 = ci + 1 < chords.length ? chords[ci + 1][0] : 20;
    notes.forEach((n, i) => [-9, 9].forEach((det, j) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = midi(n); o.detune.value = det + (i - 1.5) * 2;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.24, t0 + .05); g.gain.setValueAtTime(.24, t1 - .03); g.gain.linearRampToValueAtTime(0, t1 + .04);
      o.connect(g).connect(j ? pR : pL); o.start(t0); o.stop(t1 + .06);
    }));
  });

  // HATS e CLAP
  function hat(t, v, open = false) {
    const s = noise(t, open ? .2 : .05), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    f.type = 'highpass'; f.frequency.value = open ? 7000 : 9000;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + (open ? .17 : .035));
    p.pan.value = (R() - .5) * .5; s.connect(f).connect(g).connect(p).connect(master);
  }
  for (let t = 4; t < 6; t += BEAT) hat(t + BEAT / 2, .04);
  for (let t = 6; t < 12; t += BEAT) { hat(t + BEAT / 2, .085, true); hat(t + BEAT / 4 * 3, .03); }
  for (let t = 15; t < 18; t += BEAT / 4) hat(t, Math.round((t - 15) * 8) % 4 === 2 ? .07 : .025);
  function clap(t, v) {
    [0, .008, .018].forEach((d, i) => { const s = noise(t + d, .2), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 1.3;
      g.gain.setValueAtTime(v * (i === 2 ? 1 : .55), t + d); g.gain.exponentialRampToValueAtTime(.001, t + d + (i === 2 ? .17 : .02));
      s.connect(f).connect(g); g.connect(master); send(g, .45); });
  }
  for (let t = 6; t < 12; t += 2 * BEAT) clap(t + BEAT, .24);
  for (let t = 15; t < 18; t += 2 * BEAT) clap(t + BEAT, .2);

  // ARPEJO sobre o horizonte (15–18), pan alternado
  const arp = [[15, [67, 71, 74, 78]], [16, [62, 66, 69, 74]], [17, [60, 64, 67, 71]]];
  let st = 0;
  for (let t = 15; t < 18; t += BEAT / 4, st++) {
    let ns = arp[0][1]; for (const [a, n] of arp) if (t >= a) ns = n;
    const n = ns[st % 4] + (st % 8 >= 4 ? 12 : 0);
    const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    o.type = 'square'; o.frequency.value = midi(n);
    f.type = 'lowpass'; f.Q.value = 3; f.frequency.setValueAtTime(3000 + (t - 15) * 800, t); f.frequency.exponentialRampToValueAtTime(500, t + .1);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.045, t + .004); g.gain.exponentialRampToValueAtTime(.001, t + .14);
    p.pan.value = st % 2 ? .6 : -.6; o.connect(f).connect(g).connect(p).connect(duck); send(p, .35);
    o.start(t); o.stop(t + .16);
  }

  // TEXTURAS DIGITAIS e tom metálico da intro (acompanham a câmera no chip)
  for (let i = 0; i < 30; i++) {
    const t = .4 + R() * 3.2, s = noise(t, .03), f = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createStereoPanner();
    f.type = 'bandpass'; f.frequency.value = 2500 + R() * 6000; f.Q.value = 12;
    g.gain.setValueAtTime(.03 + R() * .04, t); g.gain.exponentialRampToValueAtTime(.001, t + .025);
    p.pan.value = R() * 1.6 - .8; s.connect(f).connect(g).connect(p).connect(master); send(p, .6);
  }
  { const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain(), p = ctx.createStereoPanner();
    car.frequency.value = midi(88); mod.frequency.value = midi(88) * 1.414; mg.gain.value = 500; mod.connect(mg).connect(car.frequency);
    g.gain.setValueAtTime(0, .8); g.gain.linearRampToValueAtTime(.014, 1.6); g.gain.linearRampToValueAtTime(0, 3.2);
    p.pan.setValueAtTime(-.6, .8); p.pan.linearRampToValueAtTime(.6, 3.2);
    car.connect(g).connect(p).connect(master); send(p, .9); car.start(.8); mod.start(.8); car.stop(3.3); mod.stop(3.3); }

  // SUBIDAS musicais (ruído filtrado) antes do GO, do drop e da assinatura
  function up(t0, t1, v) {
    const s = noise(t0, t1 - t0 + .05), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'bandpass'; f.Q.value = 3; f.frequency.setValueAtTime(400, t0); f.frequency.exponentialRampToValueAtTime(8000, t1);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t1 - .03); g.gain.linearRampToValueAtTime(0, t1);
    s.connect(f).connect(g).connect(master); send(g, .5);
  }
  up(5, 6, .05); up(17, 18, .06);

  // ASSINATURA SONORA (20): acorde aberto Em(add9) com filtro que fecha + cauda longa
  [52, 59, 64, 66, 71, 76].forEach(n => [-6, 6].forEach(det => {
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = midi(n); o.detune.value = det;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(3600, 20); f.frequency.exponentialRampToValueAtTime(500, 21.9);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, 20); g.gain.linearRampToValueAtTime(.026, 20.02); g.gain.setTargetAtTime(0, 20.2, .65);
    o.connect(f).connect(g).connect(master); send(g, 1); o.start(20); o.stop(22);
  }));
  // sino suave (triângulo) na nota da tônica, acompanha o fio de luz
  [76, 83].forEach((n, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = midi(n);
    g.gain.setValueAtTime(0, 20.05 + i * .25); g.gain.linearRampToValueAtTime(.03, 20.06 + i * .25); g.gain.setTargetAtTime(0, 20.1 + i * .25, .5);
    o.connect(g).connect(master); send(g, 1.2); o.start(20 + i * .25); o.stop(22); });
}
