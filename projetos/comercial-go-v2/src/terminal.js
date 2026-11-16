// Maquininha genérica (sem marca): corpo arredondado, tela de vidro, teclado em relevo e LED.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export function makeTerminal(brand) {
  const g = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color: '#3a3f47', roughness: .42, metalness: .15, clearcoat: .6, clearcoatRoughness: .3 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.05, 1.9, .26, 6, .12), shell);
  body.castShadow = body.receiveShadow = true; g.add(body);
  // tela: canvas desenhado em tempo real (ícone genérico de aproximação → confirmação)
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 400;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(.82, .64), new THREE.MeshPhysicalMaterial({
    color: '#000', emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 1, roughness: .05, metalness: 0, clearcoat: 1, clearcoatRoughness: .02,
  }));
  screen.position.set(0, .48, .1305); g.add(screen);
  // moldura da tela
  const bez = new THREE.Mesh(new RoundedBoxGeometry(.9, .72, .02, 3, .03), new THREE.MeshPhysicalMaterial({ color: '#0b0c0e', roughness: .2, clearcoat: 1 }));
  bez.position.set(0, .48, .125); g.add(bez);
  // teclado 3 × 4
  const keyG = new RoundedBoxGeometry(.22, .14, .04, 3, .02);
  const keyM = new THREE.MeshPhysicalMaterial({ color: '#3a3e45', roughness: .55, clearcoat: .3 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const k = new THREE.Mesh(keyG, keyM); k.position.set((c - 1) * .28, -.12 - r * .19, .13); k.castShadow = true; g.add(k);
  }
  const led = new THREE.Mesh(new THREE.SphereGeometry(.022, 16, 12), new THREE.MeshBasicMaterial({ color: '#222' }));
  led.position.set(.38, .86, .13); g.add(led);
  const ctx = cv.getContext('2d');
  // desenha a tela conforme o estado (0 = aguardando, 1 = confirmado)
  function draw(wait, ok) {
    ctx.fillStyle = '#05070a'; ctx.fillRect(0, 0, 512, 400);
    const cx = 256, cy = 200;
    if (ok < 1) { // ondas de aproximação pulsando
      ctx.save(); ctx.globalAlpha = (1 - ok) * (.35 + .65 * wait); ctx.strokeStyle = '#d7dde5'; ctx.lineWidth = 14; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(cx - 70, cy, 40 + i * 38, -Math.PI / 4.2, Math.PI / 4.2); ctx.stroke(); }
      ctx.restore();
    }
    if (ok > 0) { // círculo na cor da marca + visto desenhado
      ctx.save(); ctx.globalAlpha = Math.min(1, ok * 2);
      ctx.fillStyle = brand.getStyle(); ctx.beginPath(); ctx.arc(cx, cy, 120 * (0.85 + .15 * Math.min(1, ok * 2)), 0, Math.PI * 2); ctx.fill();
      const k = Math.min(1, Math.max(0, ok * 1.6 - .3));
      ctx.strokeStyle = '#07080A'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const p = [[cx - 52, cy + 4], [cx - 14, cy + 42], [cx + 58, cy - 40]];
      ctx.beginPath(); ctx.moveTo(...p[0]);
      const a = Math.min(1, k * 2), b = Math.max(0, k * 2 - 1);
      ctx.lineTo(p[0][0] + (p[1][0] - p[0][0]) * a, p[0][1] + (p[1][1] - p[0][1]) * a);
      if (b > 0) ctx.lineTo(p[1][0] + (p[2][0] - p[1][0]) * b, p[1][1] + (p[2][1] - p[1][1]) * b);
      ctx.stroke(); ctx.restore();
    }
    tex.needsUpdate = true;
    led.material.color.copy(ok > 0 ? brand : new THREE.Color('#222')).multiplyScalar(ok > 0 ? 3 : 1);
  }
  const mats = []; g.traverse(o => { if (o.material && !mats.includes(o.material)) mats.push(o.material); });
  function setOpacity(a) { mats.forEach(m => { m.transparent = a < 1; m.opacity = a; m.depthWrite = a > .5; }); }
  g.userData = { draw, screen, setOpacity };
  return g;
}
