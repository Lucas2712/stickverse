// v2 vertical · mundo 3D + coreografia contínua (tudo é função de t; trilhas com interpolação cúbica C1).
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { makeCard, CHIP, W as CW, H as CH } from './card.js';
import { makeTerminal } from './terminal.js';
import { makeGlobe } from './globe.js';
import { ease, tw, prog, lerp, clamp, noise1 } from './util.js';

export const TURQ = '#19C79B', GOLD = '#E2B866', BG_HEX = '#050607';
const VW = 1080, VH = 1920;

// ---------- trilha: chaves [t, valor(es), parar?] → Hermite com tangentes Catmull‑Rom (velocidade contínua) ----------
function track(keys) {
  const K = keys.map(k => ({ t: k[0], v: Array.isArray(k[1]) ? k[1] : [k[1]], stop: !!k[2] }));
  const n = K[0].v.length;
  const tan = K.map((k, i) => {
    if (k.stop || i === 0 || i === K.length - 1) return new Array(n).fill(0);
    const a = K[i - 1], b = K[i + 1];
    return k.v.map((_, j) => (b.v[j] - a.v[j]) / (b.t - a.t));
  });
  return t => {
    if (t <= K[0].t) return K[0].v.slice();
    if (t >= K[K.length - 1].t) return K[K.length - 1].v.slice();
    let i = 0; while (t > K[i + 1].t) i++;
    const a = K[i], b = K[i + 1], h = b.t - a.t, s = (t - a.t) / h, s2 = s * s, s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
    return a.v.map((v, j) => h00 * v + h10 * h * tan[i][j] + h01 * b.v[j] + h11 * h * tan[i + 1][j]);
  };
}

function studioEnv(renderer) {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: '#040506', side: THREE.BackSide })));
  const box = (w, h, x, y, z, col) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  box(8, 1.2, 0, 5.5, 2, new THREE.Color(3.6, 3.4, 3.1));              // faixa superior quente
  box(1, 6, -8, 1, 3, new THREE.Color(4.2, 3.4, 2.2));             // tira dourada à esquerda
  box(1, 6, 8, .5, -2, new THREE.Color(.5, 2.6, 2.0));             // tira turquesa à direita
  box(6, 3, 0, 1, 9, new THREE.Color(1.1, 1.1, 1.15));             // frontal suave
  box(4, 2, 2, -5, 4, new THREE.Color(.35, .35, .38));             // rebatedor
  const pm = new THREE.PMREMGenerator(renderer); const env = pm.fromScene(s, .02).texture; pm.dispose(); return env;
}

export function makeWorld(renderer) {
  RectAreaLightUniformsLib.init();
  const T = new THREE.Color(TURQ), G = new THREE.Color(GOLD);
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
  const camera = new THREE.PerspectiveCamera(30, VW / VH, .01, 300);

  // fundo: preto profundo + brilho radial turquesa/dourado atrás do cartão + onda do pagamento + vinheta
  const bgScene = new THREE.Scene(), bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bgMat = new THREE.ShaderMaterial({
    uniforms: { A: { value: new THREE.Color(BG_HEX) }, glowC: { value: T.clone() }, glow: { value: 0 }, spot: { value: new THREE.Vector3(.5, .55, .35) },
      wave: { value: new THREE.Vector4(.5, .3, 0, 0) }, gold: { value: 0 }, aspect: { value: VW / VH }, expo: { value: 1 } },
    depthWrite: false, depthTest: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `uniform vec3 A; uniform vec3 glowC; uniform float glow; uniform vec3 spot; uniform vec4 wave; uniform float gold; uniform float aspect; uniform float expo; varying vec2 vUv;
      void main(){
        vec2 q = (vUv - spot.xy) * vec2(aspect, 1.);
        float r = length(q);
        vec3 c = A;
        c += glowC * glow * exp(-r * r / (spot.z * spot.z)) * .13;                 // brilho atrás do cartão
        c += vec3(1., .78, .45) * gold * exp(-pow(length((vUv - vec2(.25, .9)) * vec2(aspect, 1.)), 2.) / .05) * .025;   // luz dourada no alto
        vec2 w = (vUv - wave.xy) * vec2(aspect, 1.); float d = length(w) - wave.z;  // onda: anel que percorre o ambiente
        c += glowC * wave.w * (exp(-d * d / .0009) * 1.6 + exp(-d * d / .02) * .25) * step(-.3, -d + .3);
        c *= 1. - .5 * smoothstep(.3, 1.0, length((vUv - .5) * vec2(aspect, 1.) * vec2(1., .62)));
        gl_FragColor = vec4(c * expo, 1.);
      }`,
  });
  const bgQ = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat); bgQ.frustumCulled = false; bgScene.add(bgQ);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: '#000', opacity: .5 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // luzes: chave dourada, recorte turquesa, contra branco, rasante do macro e a linha de luz (RectAreaLight)
  const key = new THREE.SpotLight('#f4f1ec', 50, 40, .5, 1, 1.4);
  key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.blurSamples = 10; key.shadow.bias = -.0004; key.shadow.normalBias = .01;
  key.shadow.camera.near = 1; key.shadow.camera.far = 40; scene.add(key, key.target);
  const rimT = new THREE.SpotLight(TURQ, 0, 40, .55, 1, 1.4); scene.add(rimT, rimT.target);
  const rimW = new THREE.SpotLight('#ffc477', 0, 40, .5, 1, 1.4);   // recorte dourado scene.add(rimW, rimW.target);
  const graze = new THREE.SpotLight('#ffd49a', 0, 12, .35, .8, 1.5); scene.add(graze, graze.target);
  const sweep = new THREE.RectAreaLight('#ffffff', 0, .16, 7); scene.add(sweep);
  scene.add(new THREE.HemisphereLight('#a8b8c8', '#050505', .1));

  const card = makeCard(renderer); scene.add(card);

  // maquininha
  const term = makeTerminal(T); scene.add(term);
  const TERM = { P: new THREE.Vector3(.35, -10.4, -.6), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.3, .3, 0)), s: 2.4 };
  TERM.n = new THREE.Vector3(0, 0, 1).applyQuaternion(TERM.q);
  TERM.screen = new THREE.Vector3(0, .48, .135).multiplyScalar(TERM.s).applyQuaternion(TERM.q).add(TERM.P);
  TERM.qCard = TERM.q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, .1)));
  const TAP = TERM.screen.clone().addScaledVector(TERM.n, .34);
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1, .011, 8, 128), new THREE.MeshBasicMaterial({ color: T.clone().multiplyScalar(2.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    rings.push(r); term.add(r);
  }

  // horizonte: o planeta visto de perto (pontos de terra), surge da onda na cena 6
  const HR = 11, HP = new THREE.Vector3(0, -15.2, -7);
  const globe = makeGlobe(T, HR, .0021); globe.position.copy(HP); scene.add(globe);
  globe.userData.spin.rotation.set(.35, 0, 0);

  const FX = [...rings];

  // ---------- coreografia ----------
  const P0 = new THREE.Vector3(0, 0, 0), E0 = new THREE.Euler(-.5, .42, .05, 'YXZ');
  const M0 = new THREE.Matrix4().compose(P0, new THREE.Quaternion().setFromEuler(E0), new THREE.Vector3(1, 1, 1));
  const chipL = (x, y, z = .035) => new THREE.Vector3(CHIP.x + x, CHIP.y + y, z).applyMatrix4(M0).toArray();
  const TGT = -.55;                                         // alvo vertical padrão da câmera (cartão acima do centro)
  const tapCam = TERM.screen.clone().add(new THREE.Vector3(-2.6, 5.4, 12.6)).toArray();
  const tapTgt = TERM.screen.clone().add(new THREE.Vector3(.35, -.55, -.2)).toArray();

  const camPos = track([
    [0, chipL(-.55, -.72, 1.05)], [2.75, chipL(-.16, -.36, .64)],
    [3.5, [-.4, .2, 4.0]], [4.7, [.05, -.25, 13.2], 1], [6, [.12, -.3, 13.0]],
    [8.6, [-.1, -.35, 12.9]], [9.8, [.05, -.45, 13.1]], [11.7, [-.08, -.5, 13.0]],
    [12.9, [-1.3, -4.4, 13.8]], [13.5, tapCam], [14.2, TERM.screen.clone().add(new THREE.Vector3(-2.3, 5.1, 12.0)).toArray()],
    [15.6, [.1, -.45, 13.4]], [17.8, [-.1, -.4, 13.0]], [19.0, [0, -.35, 13.4], 1], [22, [0, -.3, 12.8]],
  ]);
  const camTgt = track([
    [0, chipL(-.04, -.01, .035)], [2.75, chipL(.1, .02, .035)],
    [3.5, [0, -.2, 0]], [4.7, [0, TGT, 0], 1], [11.7, [0, TGT, 0]],
    [12.9, [.2, -6.8, -.3]], [13.5, tapTgt], [14.2, tapTgt],
    [15.6, [0, TGT, 0], 1], [22, [0, TGT, 0]],
  ]);
  // cartão: posição e rotação (Euler YXZ)
  const cardPos = track([
    [0, [0, 0, 0]], [3.0, [0, 0, 0]], [4.7, [0, .12, 0], 1],
    [6.0, [0, .16, 0]], [7.2, [.05, 1.55, -1.4]], [8.6, [.1, 1.68, -1.6]],
    [9.9, [0, -1.82, -.5], 1], [11.6, [-.05, -1.72, -.5]],
    [12.6, [-.15, -5.5, 0]], [13.5, TAP.toArray(), 1], [14.15, TAP.toArray()],
    [15.6, [0, -.72, 0], 1], [17.8, [0, -.7, 0]], [19.0, [0, .29, 0], 1], [22, [0, .31, 0]],
  ]);
  const TAU = Math.PI * 2;
  const cardRot = track([
    [0, [-.5, .42, .05]], [3.0, [-.5, .42, .05]], [3.3, [-.44, .58, .05]],          // antecipação
    [4.5, [-.04, -TAU - .06, 0]], [5.2, [0, -TAU + .03, 0]], [6.0, [-.02, -TAU - .04, .01]],
    [7.2, [.22, -TAU - .36, .04]], [8.6, [.18, -TAU - .26, .03]],
    [9.9, [-.16, -.36, -.02]], [10.4, [-.12, -.28, 0]], [11.6, [-.1, -.18, 0]],
    [12.6, [-.5, .1, .05]], [15.0, [-.4, .1, .05]],
    [15.6, [-.08, -.24, 0]], [17.8, [-.06, .16, 0]], [19.0, [-.04, -.1, 0], 1], [22, [-.03, .05, 0]],
  ]);
  const tapW = track([[12.0, 0], [13.5, 1, 1], [14.15, 1], [15.3, 0, 1]]);

  function state(t) {
    const S = {};
    const p = cardPos(t), r = cardRot(t);
    const Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0], r[1], r[2], 'YXZ'));
    const kA = tapW(t); if (kA > 0) Q.slerp(TERM.qCard, ease.inOut(clamp(kA)));
    // micro‑recuo físico no toque
    const dt = t - 13.5, bump = dt > 0 && dt < 1 ? Math.exp(-dt * 9) * Math.sin(dt * 26) * .03 : 0;
    S.card = { P: new THREE.Vector3(...p).addScaledVector(TERM.n, bump), Q };
    const cp = new THREE.Vector3(...camPos(t)), ct = new THREE.Vector3(...camTgt(t));
    // respiração de câmera (muito sutil) fora do macro
    const amp = t < 3 ? 0 : .025;
    cp.x += noise1(t * .35, 1) * amp; cp.y += noise1(t * .3, 2) * amp;
    S.cam = { pos: cp, tgt: ct, fov: 30, focus: cp.distanceTo(S.card.P) };
    const macro = t < 3.1;
    if (macro) S.cam.focus = cp.distanceTo(new THREE.Vector3(...chipL(lerp(-.05, .12, prog(t, 0, 2.8)), 0, .035)));
    // cena 3: foco um pouco à frente do cartão (cartão levemente suave atrás do texto)
    const soft = tw(t, 6.2, 7.2, 0, 1) * (1 - tw(t, 8.6, 9.4, 0, 1)) + tw(t, 15.4, 16, 0, .6) * (1 - tw(t, 17.6, 18.4, 0, 1));
    S.cam.focus -= soft * 2.2;
    S.aperture = macro ? lerp(.004, .0012, prog(t, 2.6, 3.4)) : lerp(.00022, .00045, soft);
    S.maxblur = .008;
    // exposição e luzes
    S.exposure = tw(t, 0, .9, 0, 1, ease.inOut);
    S.envI = t < 2.8 ? .4 : tw(t, 2.8, 4.2, .4, 1.1) - tw(t, 11.4, 12.2, 0, .6) + tw(t, 14.6, 15.6, 0, .6) - tw(t, 17.6, 18.6, 0, .25) + tw(t, 20, 20.6, 0, .15);
    S.key = t < 3 ? 10 : tw(t, 3, 4.2, 10, 46) - tw(t, 11.6, 12.4, 0, 24) + tw(t, 14.4, 15.4, 0, 24) - tw(t, 17.8, 18.6, 0, 8);
    S.graze = t < 3.4 ? tw(t, 0, 1, 0, 11) * (1 - prog(t, 2.9, 3.4)) : 0;
    S.rimT = tw(t, 3.4, 4.6, 0, 26) + tw(t, 19.8, 20.6, 0, 20);
    S.rimW = tw(t, 3.6, 4.8, 0, 22) + tw(t, 19.8, 20.6, 0, 14);
    S.glow = tw(t, 3.8, 5.0, 0, .35) + tw(t, 5.3, 6.2, 0, .55, ease.inOut) - tw(t, 8.6, 9.6, 0, .25) - tw(t, 11.8, 12.8, 0, .55) + tw(t, 15.0, 15.8, 0, .45) - tw(t, 17.8, 18.8, 0, .4) + tw(t, 20, 20.9, 0, .45);
    S.gold = tw(t, 3.5, 5, 0, 1) * (1 - tw(t, 11.8, 12.6, 0, 1)) + tw(t, 15.2, 16, 0, .6) + tw(t, 19.8, 20.6, 0, .4);
    // linha de luz: macro (dourada) · reflexo turquesa que vira a luz da cena 3 · rotação · assinatura
    S.sweep = null;
    const sw = (a, b, x0, x1, I, col) => { if (t >= a && t <= b) S.sweep = { k: ease.inOut(prog(t, a, b)), x0, x1, I: I * Math.sin(Math.PI * prog(t, a, b)), col }; };
    sw(1.0, 2.7, -1.75, -.25, 1.1, GOLD); sw(5.2, 6.2, -2.6, 2.6, 7, TURQ); sw(9.2, 10.2, 2.6, -2.6, 4, '#ffffff'); sw(19.9, 21.0, -2.6, 2.6, 5, GOLD);
    // maquininha e onda
    S.term = { op: tw(t, 11.9, 12.6, 0, 1) * (1 - tw(t, 14.9, 15.5, 0, 1)), wait: .5 + .5 * Math.sin(t * 12), ok: prog(t, 13.52, 13.95) };
    S.rings = [0, 1, 2, 3].map(i => prog(t, 13.48 + i * .09, 13.48 + i * .09 + .7));
    S.wave = { k: prog(t, 13.5, 15.1), a: tw(t, 13.5, 13.62, 0, 1) * (1 - tw(t, 14.6, 15.2, 0, 1)) };
    // horizonte
    S.globe = { k: tw(t, 14.6, 15.8, 0, 1, ease.inOut) * (1 - tw(t, 17.8, 18.8, 0, 1, ease.inOut)), sink: tw(t, 17.8, 19.2, 0, 1, ease.inOut), spin: t * .035 };
    return S;
  }

  const tmp = new THREE.Vector3();
  function apply(t, S, jitter = [0, 0]) {
    card.position.copy(S.card.P); card.quaternion.copy(S.card.Q); card.scale.setScalar(1);
    camera.position.copy(S.cam.pos); camera.lookAt(S.cam.tgt); camera.fov = S.cam.fov; camera.updateProjectionMatrix();
    const W = renderer.domElement.width, H = renderer.domElement.height;
    if (jitter[0] || jitter[1]) camera.setViewOffset(W, H, jitter[0], jitter[1], W, H); else camera.clearViewOffset();
    camera.updateMatrixWorld(); card.updateMatrixWorld();
    renderer.toneMappingExposure = 1;
    scene.environmentIntensity = S.envI * S.exposure;
    // fundo
    tmp.copy(card.position).project(camera);
    bgMat.uniforms.spot.value.set(tmp.x * .5 + .5, tmp.y * .5 + .5, .3);
    bgMat.uniforms.glow.value = clamp(S.glow, 0, 2); bgMat.uniforms.gold.value = S.gold; bgMat.uniforms.expo.value = S.exposure;
    if (S.wave.a > 0) { const wp = TERM.screen.clone().project(camera); bgMat.uniforms.wave.value.set(wp.x * .5 + .5, wp.y * .5 + .5, ease.out3(S.wave.k) * 1.6, S.wave.a); }
    else bgMat.uniforms.wave.value.w = 0;
    floor.position.y = card.position.y - 2.6; floor.visible = t > 3.6 && (t < 11.8 || t > 15.2);
    // luzes acompanham o cartão
    key.intensity = S.key * S.exposure; key.position.copy(card.position).add(tmp.set(-3.4, 5.6, 5.2)); key.target.position.copy(card.position);
    rimT.intensity = S.rimT; rimT.position.copy(card.position).add(tmp.set(5.5, 1.5, -4)); rimT.target.position.copy(card.position);
    rimW.intensity = S.rimW; rimW.position.copy(card.position).add(tmp.set(-5, -1.5, -3.5)); rimW.target.position.copy(card.position);
    const chipW = new THREE.Vector3(CHIP.x, CHIP.y, .035).applyMatrix4(card.matrixWorld);
    graze.intensity = S.graze * S.exposure; graze.target.position.copy(chipW);
    graze.position.copy(new THREE.Vector3(CHIP.x + .3, CHIP.y + 2.8, .3).applyMatrix4(card.matrixWorld));
    if (S.sweep) {
      sweep.visible = true; sweep.intensity = S.sweep.I; sweep.color.set(S.sweep.col);
      const lx = lerp(S.sweep.x0, S.sweep.x1, S.sweep.k);
      sweep.position.copy(new THREE.Vector3(lx, 0, 1.1).applyMatrix4(card.matrixWorld));
      sweep.lookAt(new THREE.Vector3(lx * .6, 0, 0).applyMatrix4(card.matrixWorld)); sweep.rotateZ(.35);
    } else { sweep.visible = false; sweep.intensity = 0; }
    // maquininha
    term.visible = S.term.op > .001;
    if (term.visible) {
      term.position.copy(TERM.P); term.quaternion.copy(TERM.q); term.scale.setScalar(TERM.s);
      term.userData.setOpacity(S.term.op); term.userData.draw(S.term.wait, S.term.ok);
      rings.forEach((r, i) => { const k = S.rings[i]; r.visible = k > 0 && k < 1; r.position.set(0, .48, .14 + Math.min(k * 2, 1) * .05); r.scale.setScalar(.06 + ease.out3(k) * .7); r.material.opacity = (1 - k) * S.term.op; });
    } else rings.forEach(r => r.visible = false);
    // horizonte
    globe.visible = S.globe.k > .002;
    if (globe.visible) {
      const u = globe.userData, k = S.globe.k;
      u.spin.rotation.y = S.globe.spin; u.dm.color.setScalar(k * .9); u.atm.material.uniforms.k.value = k * 1.4; u.gridM.opacity = .35 * k;
      globe.position.set(HP.x, HP.y - (1 - ease.out3(Math.min(1, k + S.globe.sink))) * 2.5 - S.globe.sink * 5, HP.z);
    }
    scene.updateMatrixWorld();
  }

  // pontos de prova para medir movimento na tela (subquadros adaptativos)
  const corners = [[-CW / 2, -CH / 2], [CW / 2, -CH / 2], [CW / 2, CH / 2], [-CW / 2, CH / 2], [CHIP.x, CHIP.y]].map(([x, y]) => new THREE.Vector3(x, y, .03));
  function probes() {
    const out = corners.map(v => v.clone().applyMatrix4(card.matrixWorld));
    out.push(TERM.screen.clone(), HP.clone().add(new THREE.Vector3(0, HR, 0)));
    return out;
  }
  return { scene, camera, bgScene, bgCam, card, state, apply, FX, probes };
}
