// Objetos 3D modelados por código (sem modelos externos): emblema, letras KAVORA, carro, chave,
// bomba de combustível. Estilo "argila laranja" com verniz, coerente com a marca.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Contour, GLYPHS, layout, Part, TILE_R, WORD} from '../lib/glyphs';
import {mat} from './Stage';

// ---------- glifo → THREE.Shape ----------
const toPath = <T extends THREE.Path>(c: Contour, p: T, ox = 0): T => {
  for (const s of c) {
    if (s[0] === 'M') p.moveTo(s[1] + ox, s[2]);
    else if (s[0] === 'L') p.lineTo(s[1] + ox, s[2]);
    else p.absarc(s[1] + ox, s[2], s[3], s[4], s[5], s[6]);
  }
  return p;
};
export const partShape = (part: Part, ox = 0) => {
  const sh = toPath(part.outer, new THREE.Shape(), ox);
  sh.holes = (part.holes || []).map((h) => toPath(h, new THREE.Path(), ox));
  return sh;
};

export const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
};

const extrude = (shapes: THREE.Shape | THREE.Shape[], depth: number, bevel = 0.04, seg = 4) => {
  const g = new THREE.ExtrudeGeometry(shapes, {depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.85, bevelSegments: seg, curveSegments: 40});
  g.translate(0, 0, -depth / 2);
  return g;
};

type G = React.JSX.IntrinsicElements['group'];

// ---------- emblema 3D: ladrilho laranja + K perolado em relevo ----------
export const Emblem3D: React.FC<G & {size?: number}> = ({size = 1, ...p}) => {
  const {tile, k, mO, mW} = useMemo(() => {
    const tile = extrude(roundedRect(1, 1, TILE_R), 0.2, 0.06, 6);
    const kh = 0.48, g = GLYPHS.K;
    const shapes = g.parts.map((pt) => partShape(pt));
    const k = extrude(shapes, 0.08, 0.018, 3);
    k.scale(kh, kh, 1);
    k.translate(-(g.w * kh) / 2 + 0.008, -kh / 2, 0.15);
    return {tile, k, mO: mat.orange(), mW: mat.pearl()};
  }, []);
  return (
    <group {...p} scale={size}>
      <mesh geometry={tile} material={mO} />
      <mesh geometry={k} material={mW} />
    </group>
  );
};

// ---------- letras KAVORA 3D (cada letra é um grupo animável) ----------
export const useLetterGeos = (depth = 0.26) =>
  useMemo(() => {
    const {xs, width} = layout();
    return WORD.split('').map((ch, i) => {
      const g = GLYPHS[ch];
      const geo = extrude(g.parts.map((pt) => partShape(pt)), depth, 0.035, 4);
      geo.translate(-g.w / 2, -0.5, 0); // centro da letra na origem (para girar em torno dele)
      return {geo, x: xs[i] + g.w / 2 - width / 2};
    });
  }, [depth]);

// ---------- carro estilizado ----------
export const Car3D: React.FC<G & {body?: 'orange' | 'pearl'}> = ({body = 'orange', ...p}) => {
  const d = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.0, 0.25);
    s.lineTo(-2.08, 0.72);
    s.quadraticCurveTo(-2.05, 0.98, -1.75, 1.0);
    s.lineTo(-1.25, 1.04);
    s.quadraticCurveTo(-0.95, 1.5, -0.55, 1.52);
    s.lineTo(0.3, 1.52);
    s.quadraticCurveTo(0.62, 1.5, 0.98, 1.08);
    s.lineTo(1.75, 0.96);
    s.quadraticCurveTo(2.08, 0.9, 2.08, 0.6);
    s.lineTo(2.02, 0.25);
    s.lineTo(1.7, 0.25);
    s.absarc(1.25, 0.25, 0.45, 0, Math.PI, false);
    s.lineTo(-0.8, 0.25);
    s.absarc(-1.25, 0.25, 0.45, 0, Math.PI, false);
    s.lineTo(-2.0, 0.25);
    const bodyG = extrude(s, 1.55, 0.16, 6);
    const win = new THREE.Shape();
    win.moveTo(-1.08, 1.06);
    win.quadraticCurveTo(-0.86, 1.4, -0.55, 1.41);
    win.lineTo(0.26, 1.41);
    win.quadraticCurveTo(0.5, 1.39, 0.8, 1.07);
    win.lineTo(-1.08, 1.06);
    const winG = extrude(win, 0.04, 0.012, 2);
    const wheel = new THREE.CylinderGeometry(0.36, 0.36, 0.34, 48);
    wheel.rotateX(Math.PI / 2);
    const hub = new THREE.CylinderGeometry(0.17, 0.17, 0.36, 32);
    hub.rotateX(Math.PI / 2);
    const lamp = new THREE.SphereGeometry(0.1, 24, 16);
    lamp.scale(0.6, 1, 1.6);
    return {bodyG, winG, wheel, hub, lamp, mB: body === 'orange' ? mat.orange() : mat.pearl(), mG: mat.glass(), mW: mat.graphite(), mH: mat.metal(),
      mL: new THREE.MeshStandardMaterial({color: '#FFFFFF', emissive: '#FFF1E0', emissiveIntensity: 1.6})};
  }, [body]);
  const z = 1.55 / 2 + 0.17;
  return (
    <group {...p}>
      <group position={[0, -0.8, 0]}>
        <mesh geometry={d.bodyG} material={d.mB} />
        <mesh geometry={d.winG} material={d.mG} position={[0, 0, z]} />
        <mesh geometry={d.winG} material={d.mG} position={[0, 0, -z]} />
        {[[1.25, 0.8], [-1.25, 0.8], [1.25, -0.8], [-1.25, -0.8]].map(([x, zz], i) => (
          <group key={i} position={[x, 0.25, zz]}>
            <mesh geometry={d.wheel} material={d.mW} />
            <mesh geometry={d.hub} material={d.mH} />
          </group>
        ))}
        <mesh geometry={d.lamp} material={d.mL} position={[2.08, 0.72, 0.5]} />
        <mesh geometry={d.lamp} material={d.mL} position={[2.08, 0.72, -0.5]} />
      </group>
    </group>
  );
};

// ---------- chave do carro (controle + argola + lâmina) ----------
export const Key3D: React.FC<G> = (p) => {
  const d = useMemo(() => {
    const fob = extrude(roundedRect(1.0, 1.7, 0.45), 0.36, 0.1, 6);
    const btn = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 32);
    btn.rotateX(Math.PI / 2);
    const ring = new THREE.TorusGeometry(0.42, 0.07, 24, 64);
    const blade = extrude(roundedRect(0.26, 1.2, 0.06), 0.08, 0.02, 2);
    return {fob, btn, ring, blade, mO: mat.orange(), mL: mat.orangeLight(), mM: mat.metal()};
  }, []);
  return (
    <group {...p}>
      <mesh geometry={d.fob} material={d.mO} />
      {[0.42, 0, -0.42].map((y, i) => (
        <mesh key={i} geometry={d.btn} material={i === 1 ? d.mM : d.mL} position={[0, y, 0.26]} />
      ))}
      <mesh geometry={d.ring} material={d.mM} position={[0, 1.22, 0]} />
      <mesh geometry={d.blade} material={d.mM} position={[0, -1.4, 0]} />
    </group>
  );
};

// ---------- bico de bomba de combustível ----------
export const Nozzle3D: React.FC<G> = (p) => {
  const d = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.9, 0.55);
    s.lineTo(0.7, 0.55);
    s.quadraticCurveTo(1.0, 0.55, 1.0, 0.25);
    s.lineTo(1.0, -0.05);
    s.quadraticCurveTo(1.0, -0.3, 0.75, -0.3);
    s.lineTo(0.15, -0.3);
    s.lineTo(-0.25, -1.55);
    s.quadraticCurveTo(-0.32, -1.75, -0.55, -1.75);
    s.lineTo(-0.8, -1.75);
    s.quadraticCurveTo(-1.05, -1.75, -1.0, -1.5);
    s.lineTo(-0.9, 0.55);
    const body = extrude(s, 0.6, 0.12, 6);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.95, 0.12, 0), new THREE.Vector3(1.7, 0.1, 0), new THREE.Vector3(2.2, -0.15, 0), new THREE.Vector3(2.5, -0.55, 0),
    ]);
    const spout = new THREE.TubeGeometry(curve, 48, 0.13, 24, false);
    const hose = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.7, -1.7, 0), new THREE.Vector3(-0.9, -2.6, 0.2), new THREE.Vector3(-1.6, -3.4, 0.4), new THREE.Vector3(-2.6, -3.8, 0.4),
    ]), 64, 0.2, 24, false);
    const trig = new THREE.TorusGeometry(0.42, 0.08, 16, 48, Math.PI);
    return {body, spout, hose, trig, mO: mat.orange(), mM: mat.metal(), mG: mat.graphite()};
  }, []);
  return (
    <group {...p}>
      <mesh geometry={d.body} material={d.mO} />
      <mesh geometry={d.spout} material={d.mM} />
      <mesh geometry={d.hose} material={d.mG} />
      <mesh geometry={d.trig} material={d.mG} position={[0.25, -0.35, 0]} rotation={[0, 0, Math.PI]} />
    </group>
  );
};

// ---------- sineta de recepção (campainha de balcão) ----------
export const Bell3D: React.FC<G> = (p) => {
  const d = useMemo(() => {
    const base = new THREE.CylinderGeometry(1.25, 1.32, 0.28, 64);
    const rim = new THREE.TorusGeometry(1.06, 0.06, 16, 64);
    rim.rotateX(Math.PI / 2);
    const dome = new THREE.SphereGeometry(1.05, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const stem = new THREE.CylinderGeometry(0.07, 0.07, 0.32, 24);
    const knob = new THREE.SphereGeometry(0.17, 32, 16);
    return {base, rim, dome, stem, knob, mO: mat.orange(), mG: mat.graphite(), mM: mat.metal()};
  }, []);
  return (
    <group {...p}>
      <mesh geometry={d.base} material={d.mG} position={[0, -0.14, 0]} />
      <mesh geometry={d.rim} material={d.mM} position={[0, 0.02, 0]} />
      <mesh geometry={d.dome} material={d.mO} position={[0, 0.02, 0]} />
      <mesh geometry={d.stem} material={d.mM} position={[0, 1.2, 0]} />
      <mesh geometry={d.knob} material={d.mM} position={[0, 1.38, 0]} />
    </group>
  );
};

// ---------- cartão-chave do quarto (com o K da marca em relevo) ----------
export const Keycard3D: React.FC<G> = (p) => {
  const d = useMemo(() => {
    const card = extrude(roundedRect(2.1, 1.32, 0.16), 0.07, 0.025, 3);
    const stripe = new THREE.BoxGeometry(2.1, 0.22, 0.02);
    const kh = 0.42, g = GLYPHS.K;
    const k = extrude(g.parts.map((pt) => partShape(pt)), 0.04, 0.008, 2);
    k.scale(kh, kh, 1);
    k.translate(-0.78, -0.12, 0.07);
    const chip = extrude(roundedRect(0.32, 0.26, 0.05), 0.02, 0.005, 2);
    return {card, stripe, k, chip, mO: mat.orange(), mW: mat.pearl(), mG: mat.graphite(), mM: mat.metal()};
  }, []);
  return (
    <group {...p}>
      <mesh geometry={d.card} material={d.mO} />
      <mesh geometry={d.stripe} material={d.mG} position={[0, 0.36, -0.06]} />
      <mesh geometry={d.k} material={d.mW} />
      <mesh geometry={d.chip} material={d.mM} position={[0.62, -0.25, 0.06]} />
    </group>
  );
};
