// Globo tecnológico: pontos de terra (Natural Earth) em instâncias, núcleo escuro,
// halo de atmosfera e arcos de luz que nascem do cartão e pousam no globo.
import * as THREE from 'three';
import PTS from './globo-pontos.json';
import { rng } from './util.js';

export const GR = 1.7;

export function makeGlobe(brand, GR = 1.7, dotK = .0072) {
  const g = new THREE.Group(), spin = new THREE.Group(); g.add(spin);
  const n = PTS.length / 3, R = rng(11);
  const dot = new THREE.IcosahedronGeometry(dotK * GR, 1);
  const dm = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const dots = new THREE.InstancedMesh(dot, dm, n);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    m.makeTranslation(PTS[i * 3] * GR, PTS[i * 3 + 1] * GR, PTS[i * 3 + 2] * GR);
    dots.setMatrixAt(i, m);
    const k = .45 + R() * .55; c.setRGB(.62 * k, .68 * k, .76 * k); if (R() < .035) c.copy(brand).multiplyScalar(1.6);
    dots.setColorAt(i, c);
  }
  spin.add(dots);
  // núcleo escuro: esconde os pontos do lado de trás e recebe a luz de recorte
  const core = new THREE.Mesh(new THREE.SphereGeometry(GR * .985, 96, 64), new THREE.MeshPhysicalMaterial({ color: '#06080b', roughness: .55, metalness: .2, clearcoat: .4, clearcoatRoughness: .5 }));
  spin.add(core);
  // grade discreta de latitude/longitude
  const gridM = new THREE.LineBasicMaterial({ color: '#2b3540', transparent: true, opacity: .55 });
  for (let la = -60; la <= 60; la += 30) {
    const r = Math.cos(la * Math.PI / 180) * GR * .992, y = Math.sin(la * Math.PI / 180) * GR * .992, p = [];
    for (let i = 0; i <= 128; i++) { const a = i / 128 * Math.PI * 2; p.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); }
    spin.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), gridM));
  }
  // atmosfera: fresnel aditivo
  const atm = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.09, 96, 64), new THREE.ShaderMaterial({
    uniforms: { col: { value: brand.clone() }, k: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide,
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 col; uniform float k; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(clamp(1.0 - abs(dot(vN, vV)), 0., 1.), 2.2); float rim = pow(clamp((1.0 - f) / 0.45, 0., 1.), 3.0); gl_FragColor = vec4(col * rim * 0.28 * k, 1.); }`,
  }));
  g.add(atm);
  g.userData = { spin, dots, dm, core, atm, gridM };
  return g;
}

// Arco de luz: curva cúbica de A (cartão) até B (ponto do globo), desenhada por progresso
export function makeArc(brand, A, B, center) {
  const mid = A.clone().add(B).multiplyScalar(.5), lift = mid.clone().sub(center).normalize().multiplyScalar(A.distanceTo(B) * .45);
  const c1 = A.clone().lerp(B, .25).add(lift), c2 = A.clone().lerp(B, .75).add(lift);
  const curve = new THREE.CubicBezierCurve3(A, c1, c2, B);
  const seg = 160, geo = new THREE.TubeGeometry(curve, seg, .0085, 8, false);
  const mat = new THREE.MeshBasicMaterial({ color: brand.clone().multiplyScalar(2.2), transparent: true, depthWrite: false, toneMapped: true });
  const mesh = new THREE.Mesh(geo, mat);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.03, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 3), transparent: true, depthWrite: false }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 64), new THREE.MeshBasicMaterial({ color: brand.clone().multiplyScalar(2), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  ring.position.copy(B); ring.lookAt(B.clone().sub(center).multiplyScalar(2).add(center));
  const grp = new THREE.Group(); grp.add(mesh, head, ring);
  const per = seg * 8 * 6;                       // índices por segmento radial
  // a: progresso do traço (0‑1) · tail: início do apagamento (0‑1) · land: 0‑1 do pulso no destino
  function set(a, tail, land, vis) {
    const i0 = Math.floor(tail * seg) * 8 * 6, i1 = Math.floor(a * seg) * 8 * 6;
    geo.setDrawRange(i0, Math.max(0, i1 - i0));
    mat.opacity = vis; head.visible = a > 0 && a < 1 && vis > 0; head.position.copy(curve.getPoint(a)); head.material.opacity = vis;
    ring.visible = land > 0 && land < 1 && vis > 0; ring.scale.setScalar(.02 + land * .2); ring.material.opacity = (1 - land) * vis;
  }
  return { grp, set, curve };
}
