// Cartão GO em 3D: corpo extrudado com bisel, faces com texturas desenhadas em canvas,
// chip com contatos em relevo, símbolo de aproximação, GO em hot-stamping metálico,
// espaço reservado para a logo gobank (sem logo oficial no briefing).
import * as THREE from 'three';
import { rng } from './util.js';

export const W = 3.2, H = 3.2 * 53.98 / 85.6, T = 0.03, BEV = 0.017, R = 0.119;
export const CHIP = { x: -1.0, y: 0.17, w: 0.44, h: 0.37 };
const PX = 1280;                            // pixels de textura por unidade (face 4096 × 2583)

function roundRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
// arredondamento circular verdadeiro (absarc) para os cantos
function roundRectArc(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

// Extrusão com bisel; separa a tampa da frente (grupo 0), o verso (grupo 2) e as laterais (grupo 1)
function slab(w, h, r, depth, bev, segs = 10) {
  const g = new THREE.ExtrudeGeometry(roundRectArc(w - 2 * bev, h - 2 * bev, r - bev), {
    depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: segs, curveSegments: 28,
  });
  g.translate(0, 0, -depth / 2);
  const pos = g.attributes.position, uv = g.attributes.uv;
  const lid = g.groups[0], side = g.groups[1];
  // tampas: metade inicial = verso, metade final = frente (ordem do ExtrudeGeometry); confere pelo z
  const half = lid.count / 2;
  const zA = pos.getZ(lid.start), front0 = zA > 0;
  for (let i = lid.start; i < lid.start + lid.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), isFront = (i < lid.start + half) === front0;
    uv.setXY(i, isFront ? x / w + .5 : .5 - x / w, y / h + .5);
  }
  g.clearGroups();
  if (front0) { g.addGroup(lid.start, half, 0); g.addGroup(lid.start + half, half, 2); }
  else { g.addGroup(lid.start, half, 2); g.addGroup(lid.start + half, half, 0); }
  g.addGroup(side.start, side.count, 1);
  g.computeVertexNormals();
  return g;
}

function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
const U = v => v * PX;                      // unidades → pixels da face
const cx = x => (x + W / 2) * PX, cy = y => (H / 2 - y) * PX;

function contactless(g, x, y, s, col, lw) {
  g.save(); g.translate(x, y); g.strokeStyle = col; g.lineCap = 'round'; g.lineWidth = lw;
  for (let i = 0; i < 4; i++) { const r = s * (.22 + i * .26); g.beginPath(); g.arc(-s * .45, 0, r, -Math.PI / 4.2, Math.PI / 4.2); g.stroke(); }
  g.restore();
}

function faceTextures(fonts) {
  const w = Math.round(W * PX), h = Math.round(H * PX);
  const [cc, c] = canvas(w, h);          // cor
  const [rc, r] = canvas(w, h);          // G = rugosidade, B = metalicidade
  // base grafite com gradiente muito sutil (acabamento fosco)
  const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#22252b'); gr.addColorStop(.55, '#1a1c21'); gr.addColorStop(1, '#15171b');
  c.fillStyle = gr; c.fillRect(0, 0, w, h);
  r.fillStyle = 'rgb(0,150,25)'; r.fillRect(0, 0, w, h);     // rugosidade ~0.66, quase dielétrico
  // GO em hot-stamping prata: claro, liso e metálico
  const goH = U(.62), gx = cx(W / 2 - .2), gy = cy(-H / 2 + .2);
  c.font = `900 ${goH * 1.38}px "Inter Display"`; c.textAlign = 'right'; c.textBaseline = 'alphabetic';
  r.font = c.font; r.textAlign = 'right'; r.textBaseline = 'alphabetic';
  c.letterSpacing = r.letterSpacing = `${-goH * .04}px`;
  const sg = c.createLinearGradient(gx - goH * 1.6, gy - goH, gx, gy); sg.addColorStop(0, '#eef0f3'); sg.addColorStop(.5, '#c4c9d1'); sg.addColorStop(1, '#e6e9ee');
  c.fillStyle = sg; c.fillText('GO', gx, gy);
  r.fillStyle = 'rgb(0,88,225)'; r.fillText('GO', gx, gy);
  // símbolo de aproximação impresso (cinza, fosco)
  contactless(c, cx(CHIP.x + .62), cy(CHIP.y), U(.34), '#b4bac3', U(.03));
  // berço do chip: leve sombra impressa ao redor
  c.save(); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = U(.02); c.fillStyle = '#121418';
  c.beginPath(); c.roundRect(cx(CHIP.x - CHIP.w / 2), cy(CHIP.y + CHIP.h / 2), U(CHIP.w), U(CHIP.h), U(.055)); c.fill(); c.restore();

  // verso: grafite liso e GO pequeno tom sobre tom
  const [bc, b] = canvas(Math.round(w / 2), Math.round(h / 2));
  const gb = b.createLinearGradient(0, 0, bc.width, bc.height); gb.addColorStop(0, '#2a2e35'); gb.addColorStop(1, '#1d2026');
  b.fillStyle = gb; b.fillRect(0, 0, bc.width, bc.height);
  b.font = `900 ${bc.height * .16}px "Inter Display"`; b.fillStyle = '#353a42'; b.textAlign = 'center'; b.textBaseline = 'middle';
  b.fillText('GO', bc.width / 2, bc.height / 2);
  return { color: cc, rough: rc, back: bc };
}

// microtextura: ruído fino → mapa de normais em mosaico (grão do acabamento fosco)
function grainNormal(size = 512, seed = 7, amp = 1.2) {
  const R = rng(seed), hgt = new Float32Array(size * size);
  for (let i = 0; i < hgt.length; i++) hgt[i] = R();
  // desfoque leve para não serrilhar
  const sm = new Float32Array(hgt.length);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let s = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += hgt[((y + j + size) % size) * size + (x + i + size) % size];
    sm[y * size + x] = s / 9;
  }
  const [c, g] = canvas(size, size), im = g.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const hx = sm[y * size + (x + 1) % size] - sm[y * size + (x - 1 + size) % size];
    const hy = sm[((y + 1) % size) * size + x] - sm[((y - 1 + size) % size) * size + x];
    let nx = -hx * amp, ny = -hy * amp, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const k = (y * size + x) * 4; im.data[k] = (nx * .5 + .5) * 255; im.data[k + 1] = (ny * .5 + .5) * 255; im.data[k + 2] = (nz * .5 + .5) * 255; im.data[k + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace;
  return t;
}

// textura do chip: contatos ISO 7816 (8 áreas) separados por sulcos finos
function chipTextures() {
  const S = 1024, sw = S, sh = Math.round(S * CHIP.h / CHIP.w);
  const [c, g] = canvas(sw, sh), [bc, b] = canvas(sw, sh), [rc, r] = canvas(sw, sh);
  const gr = g.createLinearGradient(0, 0, sw, sh); gr.addColorStop(0, '#e9cf8f'); gr.addColorStop(.5, '#d5b46c'); gr.addColorStop(1, '#e3c582');
  g.fillStyle = gr; g.fillRect(0, 0, sw, sh);
  b.fillStyle = '#fff'; b.fillRect(0, 0, sw, sh);
  r.fillStyle = 'rgb(0,92,255)'; r.fillRect(0, 0, sw, sh);
  const lw = sw * .012;
  const lines = (ctx, col) => {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
    const m = sw * .06, x1 = sw * .34, x2 = sw * .66, yc = sh / 2;
    // colunas laterais: 4 contatos de cada lado (linhas horizontais)
    for (const [xa, xb] of [[m * .2, x1], [x2, sw - m * .2]]) for (const f of [.25, .5, .75]) {
      ctx.beginPath(); ctx.moveTo(xa, sh * f); ctx.lineTo(xb, sh * f); ctx.stroke();
    }
    // área central arredondada
    ctx.beginPath(); ctx.roundRect(x1, sh * .16, x2 - x1, sh * .68, sw * .05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, yc); ctx.bezierCurveTo(x1 + sw * .06, yc, x1 + sw * .06, sh * .16, x1 + sw * .1, sh * .16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, yc); ctx.bezierCurveTo(x2 - sw * .06, yc, x2 - sw * .06, sh * .84, x2 - sw * .1, sh * .84); ctx.stroke();
  };
  lines(g, '#2a2214'); lines(b, '#000'); lines(r, 'rgb(0,235,0)');
  // micro‑riscos de usinagem
  const R = rng(3); g.globalAlpha = .06; g.strokeStyle = '#fff'; g.lineWidth = 1;
  for (let i = 0; i < 400; i++) { const y = R() * sh; g.beginPath(); g.moveTo(0, y); g.lineTo(sw, y + (R() - .5) * 4); g.stroke(); }
  const mk = (cv, cs) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = cs; t.anisotropy = 8; return t; };
  return { map: mk(c, THREE.SRGBColorSpace), bump: mk(bc, THREE.NoColorSpace), rough: mk(rc, THREE.NoColorSpace) };
}

export function makeCard(renderer, fonts) {
  const group = new THREE.Group();
  const tex = faceTextures(fonts), an = renderer.capabilities.getMaxAnisotropy();
  const mapT = new THREE.CanvasTexture(tex.color); mapT.colorSpace = THREE.SRGBColorSpace; mapT.anisotropy = an;
  const rT = new THREE.CanvasTexture(tex.rough); rT.colorSpace = THREE.NoColorSpace; rT.anisotropy = an;
  const backT = new THREE.CanvasTexture(tex.back); backT.colorSpace = THREE.SRGBColorSpace; backT.anisotropy = an;
  const grain = grainNormal(); grain.repeat.set(14, 9);
  const front = new THREE.MeshPhysicalMaterial({
    map: mapT, roughnessMap: rT, metalnessMap: rT, roughness: 1, metalness: 1,
    normalMap: grain, normalScale: new THREE.Vector2(.18, .18),
    clearcoat: .55, clearcoatRoughness: .3,
  });
  const back = new THREE.MeshPhysicalMaterial({ map: backT, roughness: .62, metalness: .05, normalMap: grain, normalScale: new THREE.Vector2(.18, .18), clearcoat: .3, clearcoatRoughness: .45 });
  // laterais e bisel: metal escovado escuro (reflexos metálicos sutis)
  const edge = new THREE.MeshPhysicalMaterial({ color: '#5a5f68', metalness: .95, roughness: .24, clearcoat: .8, clearcoatRoughness: .12 });
  const body = new THREE.Mesh(slab(W, H, R, T, BEV), [front, edge, back]);
  body.castShadow = body.receiveShadow = true; group.add(body);

  // chip: placa dourada levemente saliente, com bisel
  const ct = chipTextures();
  const chipG = slab(CHIP.w, CHIP.h, .055, .0016, .0012, 3);
  const chipTop = new THREE.MeshPhysicalMaterial({ map: ct.map, bumpMap: ct.bump, bumpScale: 1.2, roughnessMap: ct.rough, metalnessMap: ct.rough, roughness: 1, metalness: 1, clearcoat: .2, clearcoatRoughness: .3 });
  const chipSide = new THREE.MeshPhysicalMaterial({ color: '#c9a65e', metalness: 1, roughness: .28 });
  const chip = new THREE.Mesh(chipG, [chipTop, chipSide, chipSide]);
  chip.position.set(CHIP.x, CHIP.y, T / 2 + BEV - .0002); chip.castShadow = true; chip.receiveShadow = true;
  group.add(chip);
  group.userData = { body, chip, front, edge };
  return group;
}
