// Mundo 3D + coreografia: tudo é função do tempo t (determinístico).
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { makeCard, CHIP, W as CW, H as CH } from './card.js';
import { makeTerminal } from './terminal.js';
import { makeGlobe, makeArc, GR } from './globe.js';
import { drawGO } from './overlay.js';
import { ease, tw, prog, lerp, clamp, spring, noise1 } from './util.js';

export const BRAND_HEX = '#19C79B';            // cor provisória (espaço reservado até o HEX oficial)
export const BG_HEX = '#07080A';

// Ambiente de estúdio para reflexos (softboxes emissivas → PMREM)
function studioEnv(renderer) {
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: '#050607', side: THREE.BackSide }));
  s.add(room);
  const box = (w, h, x, y, z, k, ry = 0, rx = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 1.04), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.lookAt(0, 0, 0); s.add(m);
  };
  box(8, 1.2, 0, 5.5, 2, 7);             // faixa superior (cria a linha de reflexo no cartão)
  box(1, 6, -8, 1, 3, 4);                // tira lateral esquerda
  box(1, 6, 8, .5, -2, 2.5);             // tira lateral direita
  box(6, 3, 0, 1, 9, 1.4);               // frontal suave
  box(4, 2, 2, -5, 4, .5);               // rebatedor de chão
  const pm = new THREE.PMREMGenerator(renderer);
  const env = pm.fromScene(s, .02).texture; pm.dispose();
  return env;
}

export function makeWorld(renderer) {
  RectAreaLightUniformsLib.init();
  const BRAND = new THREE.Color(BRAND_HEX);
  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
  const camera = new THREE.PerspectiveCamera(30, 16 / 9, .01, 200);

  // fundo de tela inteira: preto ↔ cor da marca com varredura de luz (renderizado antes da cena)
  const bgScene = new THREE.Scene(), bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const bgMat = new THREE.ShaderMaterial({
    uniforms: { A: { value: new THREE.Color(BG_HEX) }, B: { value: BRAND.clone() }, wipe: { value: -1 }, dir: { value: 1 }, glow: { value: 0 }, spot: { value: new THREE.Vector3(.5, .5, .25) }, lift: { value: 0 }, aspect: { value: 16 / 9 } },
    depthWrite: false, depthTest: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `uniform vec3 A; uniform vec3 B; uniform float wipe; uniform float dir; uniform float glow; uniform vec3 spot; uniform float lift; uniform float aspect; varying vec2 vUv;
      void main(){
        float x = vUv.x + (vUv.y - .5) * .18;              // varredura levemente diagonal
        float d = dir > 0. ? x - wipe : wipe - x;
        float m = 1. - smoothstep(-.002, .002, d);       // lado já varrido = cor B
        vec3 c = mix(A, B, m);
        vec2 p = (vUv - spot.xy) * vec2(aspect, 1.);
        float r = length(p);
        c *= mix(1.0, 1.0 + lift, exp(-r * r / (spot.z * spot.z)));   // luz de fundo atrás do cartão
        c *= 1. - .22 * smoothstep(.45, 1.25, length((vUv - .5) * vec2(aspect, 1.)));   // vinheta
        float edge = exp(-abs(d) * 160.) * glow;           // linha de luz na borda da varredura
        c += vec3(edge) * 3.5 + vec3(exp(-abs(d) * 30.) * glow * .25);
        gl_FragColor = vec4(c, 1.);
      }`,
  });
  const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat); bgQuad.frustumCulled = false; bgScene.add(bgQuad);

  // chão invisível que só recebe sombra
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ color: '#000', opacity: .45 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.75; floor.receiveShadow = true; scene.add(floor);

  // luzes
  const key = new THREE.SpotLight('#ffffff', 60, 30, .55, 1, 1.6);
  key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.blurSamples = 10; key.shadow.bias = -.0004; key.shadow.normalBias = .01;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  scene.add(key, key.target);
  const rimL = new THREE.SpotLight('#dfe8ff', 0, 30, .5, 1, 1.5); scene.add(rimL, rimL.target);
  const rimR = new THREE.SpotLight('#ffffff', 0, 30, .5, 1, 1.5); scene.add(rimR, rimR.target);
  const graze = new THREE.SpotLight('#fff4e6', 0, 12, .35, .8, 1.5); scene.add(graze, graze.target);   // luz rasante do macro
  const sweep = new THREE.RectAreaLight('#ffffff', 0, .14, 6); scene.add(sweep);   // linha de luz que percorre o cartão
  const amb = new THREE.HemisphereLight('#9fb0c8', '#050505', .08); scene.add(amb);

  // cartão
  const card = makeCard(renderer); scene.add(card);
  // GO gigante atrás do cartão (cena 2)
  const goCv = document.createElement('canvas'); goCv.width = 2048; goCv.height = 1100;
  const goTex = new THREE.CanvasTexture(goCv); goTex.colorSpace = THREE.SRGBColorSpace;
  const goPlane = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 9.2 * 1100 / 2048), new THREE.MeshBasicMaterial({ map: goTex, transparent: true, depthWrite: false, toneMapped: false }));
  goPlane.position.set(0, .1, -2.6); goPlane.renderOrder = -1; scene.add(goPlane);

  // maquininha
  const term = makeTerminal(BRAND); scene.add(term);
  // anéis da aproximação
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1, .012, 8, 128), new THREE.MeshBasicMaterial({ color: BRAND.clone().multiplyScalar(2.4), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    rings.push(r); term.add(r);
  }
  // onda final que vira o horizonte do globo
  const wave = new THREE.Mesh(new THREE.RingGeometry(.96, 1, 160), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.4, 2.4), transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  scene.add(wave);

  // globo e arcos
  const GP = new THREE.Vector3(1.15, -.05, 0);
  const globe = makeGlobe(BRAND); globe.position.copy(GP); scene.add(globe);
  const orbitLine = (() => {
    const p = []; for (let i = 0; i <= 256; i++) { const a = i / 256 * Math.PI * 2; p.push(new THREE.Vector3(Math.cos(a) * ORB, 0, Math.sin(a) * ORB)); }
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(p), new THREE.LineDashedMaterial({ color: '#3b4652', dashSize: .06, gapSize: .05, transparent: true, opacity: .8 }));
  })();
  orbitLine.computeLineDistances(); const orbit = new THREE.Group(); orbit.add(orbitLine); globe.add(orbit);
  orbit.rotation.set(.2, 0, -.1);

  // pose da maquininha (no balcão, inclinada para a câmera) e da tela, em coordenadas do mundo
  const TERM = { P: new THREE.Vector3(.9, -1.55, -.6), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.3, .28, 0)), s: 2.4 };
  TERM.n = new THREE.Vector3(0, 0, 1).applyQuaternion(TERM.q); TERM.x = new THREE.Vector3(1, 0, 0).applyQuaternion(TERM.q); TERM.y = new THREE.Vector3(0, 1, 0).applyQuaternion(TERM.q);
  TERM.screen = new THREE.Vector3(0, .48, .135).multiplyScalar(TERM.s).applyQuaternion(TERM.q).add(TERM.P);
  TERM.qCard = TERM.q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, .12)));
  const FX = [goPlane, wave, ...rings];            // objetos translúcidos: fora das passadas de profundidade

  // ---------- coreografia ----------
  const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler();
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3();

  // órbita do cartão em volta do globo (cena 6), em coordenadas do mundo
  function orbitPose(t, out) {
    const a = 2.45 - (t - 8) * .5;
    tmpV.set(Math.cos(a) * ORB, 0, Math.sin(a) * ORB).applyEuler(orbit.rotation).add(GP);
    out.pos.copy(tmpV);
    out.rot.set(-.12, -.42 + (t - 8) * .2, .08);
    return out;
  }
  const arcs = [];
  const _o = { pos: new THREE.Vector3(), rot: new THREE.Euler() };
  const LAND = [[-15, -48], [40, -3], [35, 139], [-33, 151]];   // lat, lon de pouso
  function landPoint(lat, lon, t) {
    const la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
    const v = new THREE.Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)).multiplyScalar(GR * 1.005);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), globeSpin(t));
    return v.add(GP);
  }
  const globeSpin = t => .9 + (t - 8) * .11;

  function state(t) {
    const S = {};
    // ----- cartão -----
    const P = new THREE.Vector3(), E = new THREE.Euler(0, 0, 0, 'YXZ'); let scale = 1;
    // macro (0–2): cartão quase parado, só deriva
    const ry0 = .42, rx0 = -.62;
    // giro de revelação 1,75–3,7 com inércia; segue até o fim da cena 2
    const spinK = spring(prog(t, 2.0, 4.0), .62, 7.0);
    let ry = lerp(ry0, -.32 - Math.PI * 2, spinK), rx = lerp(rx0, -.1, ease.out3(prog(t, 1.8, 3.2))), rz = lerp(.06, 0, prog(t, 1.8, 3));
    let px = 0, py = 0, pz = 0;
    // cena 2 → 3: cartão vai para a direita e inclina
    const k3 = ease.inOut5(prog(t, 3.72, 4.45));
    px = lerp(px, 1.3, k3); py = lerp(py, -.05, k3);
    ry = lerp(ry, -Math.PI * 2 - .62, k3); rx = lerp(rx, .12, k3); rz = lerp(rz, .07, k3);
    ry += tw(t, 4.2, 6, 0, .16, ease.lin);                     // rotação lenta contínua
    // chicote 5,72–6,3: atravessa para a esquerda girando uma volta (a espessura cruza a tela)
    const kW = ease.inOutExpo(prog(t, 5.72, 6.32));
    px = lerp(px, -1.3, kW); ry = lerp(ry, -Math.PI * 2 - .46 + Math.PI * 2 + 1.12, kW); rx = lerp(rx, .1, kW); rz = lerp(rz, -.06, kW);
    ry += tw(t, 6.2, 7, 0, -.12, ease.lin);
    // cena 5 (6,78–7,5): desce até a maquininha, paralelo à tela, e para a ~3 mm
    const TP = TERM.P, kA = ease.out5(prog(t, 6.78, 7.5));
    const tapPos = TERM.screen.clone().addScaledVector(TERM.n, .36);
    px = lerp(px, tapPos.x, kA); py = lerp(py, tapPos.y, kA); pz = lerp(pz, tapPos.z, kA);
    // micro‑recuo físico no toque (mola curta ao longo da normal da tela)
    const dtp = Math.max(0, t - 7.5), bump = t > 7.5 ? Math.exp(-dtp * 10) * Math.sin(dtp * 28) * .035 : 0;
    px += TERM.n.x * bump; py += TERM.n.y * bump; pz += TERM.n.z * bump;
    // cena 6 (8–12): órbita do globo
    const inGlobe = t >= 8 && t < 12.2;
    if (t >= 8) {
      orbitPose(t, _o);
      const k = 1 - ease.inOut5(prog(t, 11.7, 12.25));     // sai da órbita para o hero
      px = lerp(0, _o.pos.x, k); py = lerp(0, _o.pos.y, k); pz = lerp(0, _o.pos.z, k);
      const hr = { x: -.08, y: tw(t, 12, 13.5, -.2, .1, ease.lin), z: 0 };
      rx = lerp(hr.x, _o.rot.x, k); ry = lerp(hr.y, _o.rot.y, k); rz = lerp(hr.z, _o.rot.z, k);
      scale = lerp(1, .5, k);
    }
    // cena 8 (13,5–15): sobe e assenta acima da logo
    const k8 = ease.outExpo(prog(t, 13.36, 14.2));
    py += lerp(0, .52, k8); scale *= lerp(1, .9, k8);
    rx = lerp(rx, -.06, k8); ry = lerp(ry, .04 + noise1(t * .4, 3) * .03, k8);
    P.set(px, py, pz); E.set(rx, ry, rz);
    const Q = new THREE.Quaternion().setFromEuler(E);
    if (kA > 0 && t < 8) Q.slerp(TERM.qCard, kA);
    S.card = { P, Q, scale };

    // ----- câmera -----
    // macro: relativo ao chip, no referencial do cartão
    const macro = (() => {
      const m = new THREE.Matrix4().compose(new THREE.Vector3(0, 0, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx0, ry0, .06, 'YXZ')), new THREE.Vector3(1, 1, 1));
      const k = ease.inOut(prog(t, 0, 2));
      const off = new THREE.Vector3(lerp(-.5, .18, k), lerp(-.34, -.22, k), lerp(.3, .3, k));
      const look = new THREE.Vector3(CHIP.x + lerp(-.02, .22, k), CHIP.y + lerp(-.02, .02, k), .03);
      const pos = new THREE.Vector3(CHIP.x, CHIP.y, .03).add(off).applyMatrix4(m), tgt = look.applyMatrix4(m);
      return { pos, tgt, fov: 32, focus: pos.distanceTo(new THREE.Vector3(CHIP.x + lerp(-.05, .2, k), CHIP.y, .03).applyMatrix4(m)) };
    })();
    // revelação e cenas 2–4: câmera frontal com leve deriva
    const front = {
      pos: new THREE.Vector3(tw(t, 2, 4, -.35, .15) + tw(t, 4, 6, 0, -.25) + noise1(t * .5, 1) * .04, tw(t, 2, 4, .5, .2) + noise1(t * .45, 2) * .03, tw(t, 2, 4, 6.9, 6.3) - tw(t, 4, 6, 0, .35)),
      tgt: new THREE.Vector3(tw(t, 2, 4, 0, .05), 0, 0), fov: 30,
    };
    front.focus = front.pos.distanceTo(P);
    let C;
    const kPull = ease.inOutExpo(prog(t, 1.55, 2.55));       // recuo do macro para o plano médio
    C = { pos: macro.pos.clone().lerp(front.pos, kPull), tgt: macro.tgt.clone().lerp(front.tgt, kPull), fov: lerp(macro.fov, front.fov, kPull), focus: lerp(macro.focus, front.focus, kPull) };
    // cena 5: câmera em 3/4 elevada sobre a maquininha
    const kd = tw(t, 6.9, 8, 0, 1, ease.lin);
    const payCam = { pos: TERM.screen.clone().add(new THREE.Vector3(-3.3 + kd * .5, 1.05 - kd * .1, 6.6 - kd * .8)), tgt: TERM.screen.clone().add(new THREE.Vector3(-.3, -.05, -.4)), fov: 30 };
    payCam.focus = payCam.pos.distanceTo(TERM.screen);
    const kP = ease.inOutExpo(prog(t, 6.7, 7.15));
    C.pos.lerp(payCam.pos, kP); C.tgt.lerp(payCam.tgt, kP); C.fov = lerp(C.fov, payCam.fov, kP); C.focus = lerp(C.focus, payCam.focus, kP);
    // aproximação final para a onda (7,75–8)
    const kZ = ease.inExpo(prog(t, 7.7, 8));
    C.pos.lerp(TERM.screen.clone().addScaledVector(TERM.n, 2.2), kZ); C.tgt.lerp(TERM.screen, kZ);
    if (t >= 8) {
      // cena 6: arco de câmera ao redor do globo
      const a = tw(t, 8, 12, -.22, .2, ease.inOut);
      const gp = GP, R = 9.6;
      const gpos = new THREE.Vector3(gp.x - 1.55 + Math.sin(a) * R, .7 + tw(t, 8, 12, .4, -.2), Math.cos(a) * R);
      const gtgt = new THREE.Vector3(gp.x - 1.45, gp.y, 0);
      const arrive = ease.outExpo(prog(t, 8, 8.9));            // chega de mais perto (continuidade com a onda)
      gpos.lerp(new THREE.Vector3(gp.x, 3.5, 3.0), 1 - arrive); gtgt.lerp(gp, 1 - arrive);
      // cena 7–8: hero
      const hero = { pos: new THREE.Vector3(noise1(t * .3, 5) * .05, .05 + tw(t, 13.4, 15, 0, .3, ease.out3), 8.1 + tw(t, 12, 13.5, .35, 0, ease.out3) + tw(t, 13.4, 14.4, 0, .35, ease.outExpo)), tgt: new THREE.Vector3(0, tw(t, 13.4, 14.4, 0, .25, ease.outExpo), 0) };
      const kH = ease.inOut5(prog(t, 11.65, 12.3));
      C = { pos: gpos.lerp(hero.pos, kH), tgt: gtgt.lerp(hero.tgt, kH), fov: 30 };
      C.focus = lerp(C.pos.distanceTo(P) * .98, C.pos.distanceTo(P), kH);
    }
    S.cam = C;
    // abertura (profundidade de campo): rasa no macro, moderada no resto
    S.aperture = t < 2.4 ? lerp(.0045, .0009, ease.inOut(prog(t, 1.6, 2.4))) : t < 8 ? .0003 : t < 12 ? .00035 : .0003;

    // ----- fundo -----
    let wipe = -1, dir = 1, glow = 0, Bcol = 0;
    if (t >= 3.72 && t < 6.7) { wipe = lerp(-.25, 1.25, ease.inOut(prog(t, 3.72, 4.0))); dir = 1; glow = t < 4.05 ? 1 : 0; }
    if (t >= 6.7 && t < 7.05) { wipe = lerp(1.25, -.25, ease.inOut(prog(t, 6.7, 7.0))); dir = -1; glow = 1; Bcol = 1; }
    S.bg = { wipe, dir, glow, swap: Bcol };
    S.bgLift = t < 2 ? .0 : t < 4 ? tw(t, 2, 2.6, 0, 1.4, ease.out3) : t < 7 ? .25 : t < 12 ? .5 : 1.6 + tw(t, 13.5, 14, 1.2, 0, ease.out3);

    // ----- luzes -----
    S.exposure = tw(t, 0, .45, 0, 1, ease.out3) * (1 + 1.6 * Math.exp(-Math.pow((t - 8) / .045, 2)));
    S.envI = t < 1.7 ? .42 : t < 4 ? tw(t, 1.7, 2.4, .25, 1.3) : t < 7 ? 1.2 : t < 12 ? .55 : tw(t, 11.8, 12.2, .55, .3) + tw(t, 13.5, 13.9, 0, .25);
    S.key = t < 2 ? 18 : t < 6.7 ? 55 : t < 8 ? 48 : t < 12 ? 38 : 42 + tw(t, 13.5, 13.7, 0, 30) - tw(t, 13.7, 14.6, 0, 30);
    S.graze = t < 2.2 ? tw(t, 0, .6, 0, 12) * (1 - prog(t, 1.8, 2.3)) : 0;
    S.rim = t < 1.8 ? 0 : t < 12 ? tw(t, 1.8, 2.3, 0, 25) : 70;
    // linha de luz: macro 0,7–2,0 · revelação 3,6–4,0 (junto com a varredura) · 5,9–6,3 · hero 12,0 e 13,5
    S.sweep = null;
    const sw = (a, b, x0, x1, I) => { if (t >= a && t <= b) S.sweep = { k: ease.inOut(prog(t, a, b)), x0, x1, I: I * Math.sin(Math.PI * prog(t, a, b)) }; };
    sw(.6, 2.1, -1.8, .4, .9); sw(3.62, 4.05, -2.6, 2.6, 15); sw(6.05, 6.6, -2.6, 2.6, 7); sw(12.0, 12.7, -2.4, 2.4, 4.5); sw(13.45, 14.1, -2.4, 2.4, 5);

    // ----- maquininha / anéis -----
    S.term = { vis: t > 6.7 && t < 8.05, in: ease.outExpo(prog(t, 6.72, 7.3)), wait: .5 + .5 * Math.sin(t * 14), ok: prog(t, 7.52, 7.9) };
    S.rings = [0, 1, 2, 3].map(i => prog(t, 7.46 + i * .08, 7.46 + i * .08 + .55));
    S.wave = prog(t, 7.62, 8.0);
    // ----- globo -----
    S.globe = { vis: t >= 8 && t < 12.0, k: ease.outExpo(prog(t, 7.95, 8.6)) * (1 - ease.inOut(prog(t, 11.45, 11.9))), away: ease.inExpo(prog(t, 11.5, 12.0)), spin: globeSpin(t), inGlobe };
    S.arcs = [0, 1, 2, 3].map(i => { const t0 = 8.06 + i; return { a: ease.inOut(prog(t, t0, t0 + .52)), tail: ease.inOut(prog(t, t0 + .5, t0 + .95)), land: prog(t, t0 + .5, t0 + .95), vis: t > t0 && t < t0 + 1 ? 1 : 0 }; });
    return S;
  }

  // aplica o estado ao grafo de cena
  function apply(t, S, jitter = [0, 0]) {
    card.position.copy(S.card.P); card.quaternion.copy(S.card.Q); card.scale.setScalar(S.card.scale);
    camera.position.copy(S.cam.pos); camera.lookAt(S.cam.tgt); camera.fov = S.cam.fov; camera.updateProjectionMatrix();
    if (jitter[0] || jitter[1]) camera.setViewOffset(1920, 1080, jitter[0], jitter[1], 1920, 1080); else camera.clearViewOffset();
    camera.updateMatrixWorld();
    renderer.toneMappingExposure = S.exposure;
    scene.environmentIntensity = S.envI;
    // fundo
    bgMat.uniforms.wipe.value = S.bg.wipe; bgMat.uniforms.dir.value = S.bg.dir; bgMat.uniforms.glow.value = S.bg.glow * S.exposure;
    const brandBg = (t >= 4.0 && t < 6.7) || S.bg.swap;
    bgMat.uniforms.A.value.set(S.bg.swap ? BRAND_HEX : BG_HEX); bgMat.uniforms.B.value.set(S.bg.swap ? BG_HEX : BRAND_HEX);
    if (t >= 4.0 && t < 6.7) { bgMat.uniforms.wipe.value = 2; bgMat.uniforms.dir.value = 1; }
    // luz de fundo atrás do cartão (posição na tela)
    tmpV.copy(card.position).project(camera);
    bgMat.uniforms.spot.value.set(tmpV.x * .5 + .5, tmpV.y * .5 + .5, brandBg ? .55 : .38);
    bgMat.uniforms.lift.value = (brandBg ? .12 : S.bgLift * .9) ;
    bgMat.uniforms.A.value.multiplyScalar(S.exposure); bgMat.uniforms.B.value.multiplyScalar(S.exposure);
    // sombra mais leve no fundo da marca
    floor.material.opacity = brandBg ? .18 : .45; floor.visible = t > 2.2;
    // luzes principais, sempre orientadas ao cartão
    key.intensity = S.key; key.position.copy(card.position).add(tmpV.set(-3.2, 5.2, 4.6)); key.target.position.copy(card.position);
    rimL.intensity = S.rim; rimL.position.copy(card.position).add(tmpV.set(-5, 2.5, -4)); rimL.target.position.copy(card.position);
    rimR.intensity = S.rim * .8; rimR.position.copy(card.position).add(tmpV.set(5, -1, -3.5)); rimR.target.position.copy(card.position);
    // luz rasante do macro: quase paralela à superfície do cartão
    const chipW = new THREE.Vector3(CHIP.x, CHIP.y, .03).applyMatrix4(card.matrixWorld.compose(card.position, card.quaternion, card.scale));
    graze.intensity = S.graze; graze.target.position.copy(chipW);
    graze.position.copy(new THREE.Vector3(CHIP.x + .3, CHIP.y + 2.8, .3).applyMatrix4(card.matrixWorld));
    // linha de luz (RectAreaLight estreita que atravessa o cartão)
    if (S.sweep) {
      sweep.visible = true; sweep.intensity = S.sweep.I;
      const lx = lerp(S.sweep.x0, S.sweep.x1, S.sweep.k);
      sweep.position.copy(new THREE.Vector3(lx, 0, 1.1).applyMatrix4(card.matrixWorld));
      sweep.lookAt(new THREE.Vector3(lx * .6, 0, 0).applyMatrix4(card.matrixWorld));
      sweep.rotateZ(.35);
    } else { sweep.visible = false; sweep.intensity = 0; }
    // GO gigante
    const goOn = drawGO(goCv.getContext('2d'), t, goCv.width, goCv.height);
    goPlane.visible = goOn; if (goOn) goTex.needsUpdate = true;
    goPlane.position.x = tw(t, 2, 4, .25, -.15);
    // maquininha
    term.visible = S.term.vis;
    if (term.visible) {
      term.position.copy(TERM.P); term.position.x += (1 - S.term.in) * 5; term.quaternion.copy(TERM.q); term.scale.setScalar(TERM.s);
      term.userData.draw(S.term.wait, S.term.ok);
      rings.forEach((r, i) => { const k = S.rings[i]; r.visible = k > 0 && k < 1; r.position.set(0, .48, .14 + Math.min(k * 2, 1) * .05); r.scale.setScalar(.06 + ease.out3(k) * .62); r.material.opacity = (1 - k) * 1.0; });
    } else rings.forEach(r => r.visible = false);
    // onda → horizonte do globo
    wave.visible = S.wave > 0 && S.wave < 1;
    if (wave.visible) {
      const k = ease.inExpo(S.wave);
      wave.position.copy(TERM.screen).addScaledVector(TERM.n, .07); wave.lookAt(camera.position);
      wave.scale.setScalar(.3 + k * 9); wave.material.opacity = 1 - Math.pow(S.wave, 6) * .6;
    }
    // globo
    globe.visible = S.globe.vis;
    if (globe.visible) {
      const gk = S.globe.k, u = globe.userData;
      u.spin.rotation.y = S.globe.spin;
      u.dm.color.setScalar(gk); u.atm.material.uniforms.k.value = gk; u.gridM.opacity = .55 * gk;
      orbitLine.material.opacity = .8 * gk;
      globe.scale.setScalar(lerp(.86, 1, Math.min(1, S.globe.k + S.globe.away)) * (1 - .6 * S.globe.away)); globe.position.set(GP.x, GP.y, GP.z - 14 * S.globe.away);
      if (!arcs.length) for (let i = 0; i < 4; i++) {        // arcos criados uma vez, a partir da pose do cartão no instante do evento
        orbitPose(8.06 + i, _o);
        const A = _o.pos.clone(), B = landPoint(LAND[i][0], LAND[i][1], 8.6 + i);
        const arc = makeArc(new THREE.Color(BRAND_HEX), A, B, GP.clone());
        arcs.push(arc); scene.add(arc.grp); FX.push(arc.grp);
      }
    }
    arcs.forEach((arc, i) => { const s = S.arcs[i]; arc.grp.visible = globe.visible && s.vis > 0; if (arc.grp.visible) arc.set(s.a, s.tail, s.land, s.vis * S.globe.k); });
    scene.updateMatrixWorld();
  }

  // pontos de prova (mundo) para medir o movimento na tela: cantos do cartão, chip, maquininha, globo
  const corners = [[-CW / 2, -CH / 2], [CW / 2, -CH / 2], [CW / 2, CH / 2], [-CW / 2, CH / 2], [CHIP.x, CHIP.y]].map(([x, y]) => new THREE.Vector3(x, y, .03));
  function probes() {
    const out = corners.map(v => v.clone().applyMatrix4(card.matrixWorld));
    if (term.visible) out.push(TERM.screen.clone(), new THREE.Vector3(0, -.8, .1).applyMatrix4(term.matrixWorld));
    if (globe.visible) out.push(globe.position.clone().add(new THREE.Vector3(GR, 0, 0)), globe.position.clone().add(new THREE.Vector3(0, GR, 0)));
    return out;
  }
  return { scene, camera, bgScene, bgCam, card, state, apply, FX, probes };
}
const ORB = 2.55;
