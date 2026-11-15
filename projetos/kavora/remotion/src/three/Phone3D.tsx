// Smartphone 3D: aro de titânio, vidro frontal, tela com o app (textura de canvas redesenhada a cada quadro),
// reflexo especular do ambiente e botões laterais.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {roundedRect} from './objects';
import {mat} from './Stage';
import {drawApp, SCREEN_RATIO} from './appScreen';

const PW = 3.0, PH = 3.0 * 2.06, PD = 0.3;
const SW = 2.72, SH = SW * SCREEN_RATIO;

const shapeGeo = (w: number, h: number, r: number) => {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 32);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
};

export const Phone3D: React.FC<React.JSX.IntrinsicElements['group'] & {p: number; t: number; alert?: number}> = ({p, t, alert = 0, ...g}) => {
  const d = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = Math.round(900 * SCREEN_RATIO);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    // corpo: perfil com o mesmo raio da tela, extrudado com chanfro arredondado
    // (RoundedBoxGeometry limitava o raio à metade da espessura e deixava cantos quase retos)
    const bev = 0.07;
    const body = new THREE.ExtrudeGeometry(roundedRect(PW - bev * 2, PH - bev * 2, 0.44 - bev), {depth: PD - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 6, curveSegments: 48});
    body.translate(0, 0, -(PD - bev * 2) / 2);
    const front = shapeGeo(PW - 0.1, PH - 0.1, 0.39);
    const screen = shapeGeo(SW, SH, 0.33);
    const btn = new RoundedBoxGeometry(0.06, 0.5, 0.1, 3, 0.03);
    return {
      canvas, tex, body, front, screen, btn,
      mBody: mat.titanium(),
      mFront: new THREE.MeshPhysicalMaterial({color: '#0b0b0c', roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02}),
      mScreen: new THREE.MeshBasicMaterial({map: tex, toneMapped: false}),
      mGloss: new THREE.MeshPhysicalMaterial({color: '#ffffff', transparent: true, opacity: 0.07, roughness: 0.02, metalness: 0, clearcoat: 1, depthWrite: false}),
    };
  }, []);
  // redesenha a tela neste quadro
  const ctx = d.canvas.getContext('2d')!;
  drawApp(ctx, d.canvas.width, d.canvas.height, p, t, alert);
  d.tex.needsUpdate = true;
  const z = PD / 2;
  return (
    <group {...g}>
      <mesh geometry={d.body} material={d.mBody} />
      <mesh geometry={d.front} material={d.mFront} position={[0, 0, z + 0.002]} />
      <mesh geometry={d.screen} material={d.mScreen} position={[0, -0.005, z + 0.004]} />
      <mesh geometry={d.front} material={d.mGloss} position={[0, 0, z + 0.008]} />
      <mesh geometry={d.btn} material={d.mBody} position={[PW / 2 + 0.01, 1.1, 0]} />
      <mesh geometry={d.btn} material={d.mBody} position={[-PW / 2 - 0.01, 1.3, 0]} />
      <mesh geometry={d.btn} material={d.mBody} position={[-PW / 2 - 0.01, 0.6, 0]} />
    </group>
  );
};

export const PHONE = {PW, PH, SW, SH};
