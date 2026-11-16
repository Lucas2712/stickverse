// Comercial GO · gobank — renderizador, pipeline cinematográfico, player e ganchos de exportação.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { makeWorld } from './scene.js';
import { makeOverlay } from './overlay.js';
import { renderMusic } from './music.js';
import { DUR, FPS, prog } from './util.js';

const ESC = +(new URLSearchParams(location.search).get('escala') || 1);
const W = Math.round(1920 * ESC), H = Math.round(1080 * ESC);
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };

async function boot() {
  await Promise.all(['800 100px "Inter Display"', '900 100px "Inter Display"', '500 40px "Inter"', '600 40px "Inter"'].map(f => document.fonts.load(f)));
  const canvas = document.getElementById('filme');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap; renderer.shadowMap.autoUpdate = false;

  const world = makeWorld(renderer);
  const { scene, camera, bgScene, bgCam } = world;
  const overlay = makeOverlay();
  const ovTex = new THREE.CanvasTexture(overlay.canvas); ovTex.colorSpace = THREE.NoColorSpace;

  const rtOpts = { type: THREE.HalfFloatType, colorSpace: THREE.LinearSRGBColorSpace, depthBuffer: true };
  const subMS = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, samples: 4 });   // tempo real: MSAA
  const sub1 = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, samples: 0 });    // exportação: AA vem do jitter
  const acc = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, depthBuffer: false });
  const ovAcc = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, depthBuffer: false });

  // acumulador: soma ponderada de subquadros (motion blur temporal + antisserrilhado)
  const accMat = new THREE.ShaderMaterial({
    uniforms: { tex: { value: null }, w: { value: 1 }, premult: { value: 0 } }, depthTest: false, depthWrite: false, transparent: true,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `uniform sampler2D tex; uniform float w; uniform float premult; varying vec2 vUv;
      void main(){ vec4 c = texture2D(tex, vUv); if (premult > .5) c.rgb *= c.a; gl_FragColor = c * w; }`,
  });
  const accScene = new THREE.Scene(); const accQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), accMat); accQuad.frustumCulled = false; accScene.add(accQuad);

  // pós‑processamento (uma vez por quadro, sobre o quadro acumulado)
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType }));
  composer.setPixelRatio(1); composer.setSize(W, H);
  const input = new TexturePass(acc.texture); composer.addPass(input);
  const gtao = new GTAOPass(scene, camera, W, H); gtao.output = GTAOPass.OUTPUT.Default; gtao.blendIntensity = .9; composer.addPass(gtao);
  const bokeh = new BokehPass(scene, camera, { focus: 6, aperture: .0008, maxblur: .012 }); composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), .3, .5, .98); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const comp = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, tOv: { value: ovAcc.texture }, grain: { value: 0 }, seed: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform sampler2D tOv; uniform float seed; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + seed) * 43758.5453); }
      void main(){ vec4 b = texture2D(tDiffuse, vUv); vec4 o = texture2D(tOv, vUv);
        vec3 c = b.rgb * (1. - o.a) + o.rgb;
        c += (h(vUv * 1000.) - .5) / 255.;                       // dither contra faixas no degradê
        gl_FragColor = vec4(c, 1.); }`,
  });
  composer.addPass(comp);
  comp.uniforms.tOv.value = ovAcc.texture;   // ShaderPass clona os uniforms: religa a textura do acumulador

  function setPost(S, light) {
    gtao.enabled = !light; bokeh.enabled = !light;
    const macro = S.cam.focus < 1;
    gtao.updateGtaoMaterial({ radius: macro ? .03 : .32, distanceExponent: 1.4, thickness: macro ? .02 : .6, scale: 1, samples: 16 });
    bokeh.uniforms.focus.value = S.cam.focus; bokeh.uniforms.aperture.value = S.aperture; bokeh.uniforms.maxblur.value = macro ? .02 : .01;
  }

  // renderiza um quadro no tempo t com N subquadros (obturador de 180°)
  function frame(t, N = 1, light = false) {
    const shutter = .5 / FPS;
    renderer.setRenderTarget(acc); renderer.setClearColor(0x000000, 0); renderer.clear();
    renderer.setRenderTarget(ovAcc); renderer.clear();
    const rt = N > 1 ? sub1 : subMS;
    for (let k = 0; k < N; k++) {
      const ts = N > 1 ? t + ((k + .5) / N - .5) * shutter : t;
      const S = world.state(ts);
      const jit = N > 1 ? [halton(k + 1, 2) - .5, halton(k + 1, 3) - .5] : [0, 0];
      world.apply(ts, S, jit);
      renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 1); renderer.clear();
      renderer.autoClear = false;
      renderer.render(bgScene, bgCam);
      if (k === 0) renderer.shadowMap.needsUpdate = true;   // sombra: uma vez por quadro (custo)
      renderer.render(scene, camera);
      renderer.autoClear = true;
      accMat.uniforms.tex.value = rt.texture; accMat.uniforms.w.value = 1 / N; accMat.uniforms.premult.value = 0;
      renderer.setRenderTarget(acc); renderer.autoClear = false; renderer.render(accScene, bgCam); renderer.autoClear = true;
      if (overlay.draw(ts)) {
        ovTex.needsUpdate = true; accMat.uniforms.tex.value = ovTex; accMat.uniforms.premult.value = 1;
        renderer.setRenderTarget(ovAcc); renderer.autoClear = false; renderer.render(accScene, bgCam); renderer.autoClear = true;
      }
    }
    // pós sobre o estado central (sem jitter), sem os objetos translúcidos nas passadas de profundidade
    const S = world.state(t); world.apply(t, S, [0, 0]);
    setPost(S, light);
    world.FX.forEach(o => { o.userData._v = o.visible; o.visible = false; });
    comp.uniforms.seed.value = (t * 60) % 97;
    renderer.setRenderTarget(null);
    composer.render();
    world.FX.forEach(o => { o.visible = o.userData._v; });
  }

  // ---------- ganchos de exportação ----------
  window.__frame = (t, N) => { frame(t, N, false); };
  window.__pixels = () => {   // RGBA do canvas, em base64 (de baixo para cima; o exportador inverte)
    const gl = renderer.getContext(), px = new Uint8Array(W * H * 4);
    gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let s = ''; const CH = 0x8000; for (let i = 0; i < px.length; i += CH) s += String.fromCharCode.apply(null, px.subarray(i, i + CH));
    return btoa(s);
  };
  let musicBuf = null;
  const getMusic = async () => musicBuf || (musicBuf = await renderMusic());
  window.__musicWav = async () => {
    const b = await getMusic(), n = b.length, L = b.getChannelData(0), Rr = b.getChannelData(1);
    const dv = new DataView(new ArrayBuffer(44 + n * 8)), ws = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
    ws(0, 'RIFF'); dv.setUint32(4, 36 + n * 8, true); ws(8, 'WAVE'); ws(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 3, true); dv.setUint16(22, 2, true);
    dv.setUint32(24, b.sampleRate, true); dv.setUint32(28, b.sampleRate * 8, true); dv.setUint16(32, 8, true); dv.setUint16(34, 32, true); ws(36, 'data'); dv.setUint32(40, n * 8, true);
    for (let i = 0; i < n; i++) { dv.setFloat32(44 + i * 8, L[i], true); dv.setFloat32(48 + i * 8, Rr[i], true); }
    const u = new Uint8Array(dv.buffer); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  };
  window.__world = world; window.__cam = camera;
  window.__dur = DUR; window.__fps = FPS; window.__W = W; window.__H = H;
  // deslocamento máximo na tela (px) durante o obturador → número de subquadros necessário
  const probe = new THREE.Vector3();
  window.__motion = t => {
    const pts = ts => { const S = world.state(ts); world.apply(ts, S, [0, 0]); const out = [];
      for (const o of world.probes()) { probe.copy(o); out.push(probe.project(camera).clone()); } return out; };
    const sh = .5 / FPS, a = pts(t - sh / 2), b = pts(t + sh / 2);
    let m = 0; a.forEach((p, i) => { if (b[i] && Math.abs(p.z) <= 1 && Math.abs(b[i].z) <= 1) m = Math.max(m, Math.hypot((p.x - b[i].x) * 960, (p.y - b[i].y) * 540)); });
    return m;
  };

  // ---------- player ----------
  const ui = setupPlayer({ frame, getMusic });
  frame(0.9, 1, false);
  window.__pronto = true;
  document.body.classList.add('pronto');
}

function setupPlayer({ frame, getMusic }) {
  const $ = id => document.getElementById(id);
  const btn = $('play'), bar = $('barra'), fill = $('cheio'), tempo = $('tempo'), qual = $('qual');
  let ctx = null, src = [], playing = false, t0 = 0, offset = 0, light = false, raf = 0, sfxBuf = null;
  // relógio da imagem: performance.now() ancorado no início do áudio (não trava se o relógio de áudio parar)
  const now = () => playing ? Math.min(DUR, (performance.now() - t0) / 1000) : offset;
  async function ensureAudio() {
    if (ctx) return;
    ctx = new AudioContext({ sampleRate: 48000 });
    const mb = await getMusic();
    window.__musicBuffer = ctx.createBuffer(2, mb.length, mb.sampleRate);
    for (let c = 0; c < 2; c++) window.__musicBuffer.copyToChannel(mb.getChannelData(c), c);
    if (window.__SFX_B64) {
      const bin = Uint8Array.from(atob(window.__SFX_B64), c => c.charCodeAt(0));
      sfxBuf = await ctx.decodeAudioData(bin.buffer);
    }
  }
  function startSources(at) {
    stopSources();
    const vol = { m: +$('vm').value, s: +$('vs').value };
    [[window.__musicBuffer, vol.m], [sfxBuf, vol.s]].forEach(([b, v]) => {
      if (!b) return; const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; g.gain.value = v;
      s.connect(g).connect(ctx.destination); s.start(ctx.currentTime + .05, at); src.push(s);
    });
    t0 = performance.now() + 50 + (ctx.outputLatency || ctx.baseLatency || 0) * 1000 - at * 1000;
  }
  function stopSources() { src.forEach(s => { try { s.stop(); } catch (e) { } }); src = []; }
  async function play() {
    await ensureAudio(); await ctx.resume();
    if (offset >= DUR - .02) offset = 0;
    startSources(offset); playing = true; btn.textContent = 'Pausar'; loop();
  }
  function pause() { offset = now(); playing = false; stopSources(); btn.textContent = 'Reproduzir'; cancelAnimationFrame(raf); }
  function show(t) { fill.style.width = (t / DUR * 100) + '%'; tempo.textContent = t.toFixed(2).replace('.', ',') + ' s'; }
  function loop() {
    const t = now(); frame(t, 1, light); show(t);
    if (t >= DUR) { pause(); offset = DUR; return; }
    raf = requestAnimationFrame(loop);
  }
  btn.onclick = () => playing ? pause() : play();
  qual.onclick = () => { light = !light; qual.textContent = light ? 'Qualidade: leve' : 'Qualidade: alta'; if (!playing) frame(offset, 1, light); };
  const seek = e => {
    const r = bar.getBoundingClientRect(), k = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    offset = k * DUR; if (playing) startSources(offset); else { frame(offset, 1, light); show(offset); }
  };
  bar.addEventListener('pointerdown', e => { seek(e); bar.setPointerCapture(e.pointerId); bar.onpointermove = seek; });
  bar.addEventListener('pointerup', () => { bar.onpointermove = null; });
  ['vm', 'vs'].forEach(id => $(id).oninput = () => { if (playing) startSources(now()); });
  if (!window.__SFX_B64) $('lvs').style.display = 'none';
  show(0);
}

boot().catch(e => { window.__erro = String(e && e.stack || e); console.error(e); const el = document.getElementById('erro'); if (el) el.textContent = window.__erro; });
