import React, { useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig, interpolate, Easing } from 'remotion';
import * as THREE from 'three';

// BÚSSOLA DO PRUMO em 3D real → vira o ÍCONE sem corte.
// A agulha gira e desacelera até PARAR EXATAMENTE apontando para baixo (a direção do logo) no instante f.settle
// (a palavra/silêncio da narração). Depois o mesmo objeto se transforma no ícone: o aro e as marcações somem,
// a placa arredondada aparece e a agulha vira o peso do prumo do logo. Tudo dirigido pelo tempo t (sem useFrame).
const BLUE = '#0071E3', INK = '#1D1D1F';
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
const lin = (t, a, b) => interpolate(t, [a, b], [0, 1], cl);
const ease = (t, a, b, e = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(t, [a, b], [0, 1], { ...cl, easing: e });
const L = (a, b, p) => a + (b - a) * p;
// ângulo da agulha (graus; 0 = para baixo): parada torta → giro de 2 voltas que desacelera até zero exatamente em settle
export const needleAngle3D = (t, f) => {
  const start = -150;
  if (t <= f.spin) return start + Math.sin(t * 2.2) * 5 * lin(t, f.a, f.a + 0.3);
  if (t >= f.settle) return 0;
  const p = (t - f.spin) / (f.settle - f.spin);
  const e = 1 - Math.pow(1 - p, 3.2);                 // desacelera até velocidade zero no alvo
  return L(start, 720, e);
};
const roundedRect = (w, h, r) => {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
};
const Ticks = ({ lock, fade }) => {
  const items = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  return items.map((i) => {
    const a = (i / 60) * Math.PI * 2, major = i % 15 === 0, down = i === 0;
    const r = 1.38, len = major ? 0.2 : 0.1;
    return (
      <mesh key={i} position={[Math.sin(a) * (r - len / 2), -Math.cos(a) * (r - len / 2), 0.16]} rotation={[0, 0, a]}>
        <boxGeometry args={[down ? 0.05 : major ? 0.035 : 0.018, len, 0.02]} />
        <meshStandardMaterial color={down ? BLUE : INK} emissive={down ? BLUE : '#000'} emissiveIntensity={down ? 0.6 * lock : 0} transparent opacity={(major || down ? 0.9 : 0.45) * fade} />
      </mesh>
    );
  });
};
const DIST = 17, WPP = (2 * DIST * Math.tan((15 * Math.PI) / 180)) / 1920;
// logo: 'light' = placa branca + peso azul (como o selo do ato 3) · 'dark' = placa azul + peso branco
export const Compass3D = ({ t, f, orbit = 0, tilt = 0, roll = 0, cx = 540, cy = 960, size = 600, glow = 0, opacity = 1, logo = 'dark', width, height }) => {
  const vc = useVideoConfig();
  const W = width ?? vc.width, H = height ?? vc.height;
  const scale = (size * WPP) / 3.2, y = -(cy - 960) * WPP, x = (cx - 540) * WPP;
  const ring = ease(t, f.a, f.a + 0.6, Easing.bezier(0.16, 1, 0.3, 1));
  const ang = (needleAngle3D(t, f) * Math.PI) / 180;
  const lock = ease(t, f.settle, f.settle + 0.25);
  const lg = ease(t, f.settle + 0.05, f.settle + 0.6);          // compass → logo
  const dialFade = 1 - ease(t, f.settle + 0.05, f.settle + 0.35);
  const plateShape = useMemo(() => roundedRect(3.2, 3.2, 3.2 * 0.27), []);
  const dark = logo === 'dark';
  const plateCol = dark ? BLUE : '#FFFFFF', markCol = dark ? '#FFFFFF' : BLUE;
  const needleCol = new THREE.Color(INK).lerp(new THREE.Color(markCol), lg);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: opacity * Math.min(1, ring * 2.5), pointerEvents: 'none' }}>
      <ThreeCanvas width={W} height={H} camera={{ fov: 30, position: [0, 0, DIST] }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.95} />
        <directionalLight position={[-3, 5, 6]} intensity={1.4} />
        <directionalLight position={[4, -2, 3]} intensity={0.5} color="#BFD8FF" />
        <pointLight position={[0, -1.6, 1.2]} intensity={2.2 * glow * (1 - lg)} color={BLUE} distance={4} />
        <group position={[x, y, 0]} rotation={[tilt, orbit, roll]} scale={scale * L(0.3, 1, ring)}>
          {/* corpo da bússola (some) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
            <cylinderGeometry args={[1.6, 1.6, 0.22, 96]} />
            <meshStandardMaterial color="#F2F4F8" metalness={0.35} roughness={0.35} transparent={dialFade < 1} opacity={dialFade} />
          </mesh>
          <mesh position={[0, 0, 0.02]} scale={L(1, 0.85, lg)}>
            <torusGeometry args={[1.56, 0.07, 24, 120]} />
            <meshStandardMaterial color="#D5DAE3" metalness={0.85} roughness={0.22} transparent={dialFade < 1} opacity={dialFade} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[1.48, 96]} />
            <meshBasicMaterial color="#FBFCFE" transparent={dialFade < 1} opacity={dialFade} />
          </mesh>
          <Ticks lock={lock} fade={dialFade} />
          {/* placa do ícone (aparece por trás da agulha, crescendo do aro) */}
          <mesh position={[0, 0, -0.12]} scale={[L(0.86, 1, lg), L(0.86, 1, lg), 1]} visible={lg > 0.001}>
            <extrudeGeometry args={[plateShape, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 24 }]} />
            <meshStandardMaterial color={plateCol} emissive={plateCol} emissiveIntensity={dark ? 0.35 : 0.6} metalness={0.1} roughness={0.35} transparent={lg < 1} opacity={lg} depthWrite={lg > 0.99} />
          </mesh>
          {/* agulha → peso do prumo do logo (mesmo objeto, sem corte) */}
          <group position={[0, 0, 0.28]} rotation={[0, 0, ang]}>
            <mesh position={[0, L(0.55, 0.8, lg), 0]} scale={[L(1, 2.3, lg), L(1, 0.47, lg), 1]}>
              <boxGeometry args={[0.025, 1.1, 0.02]} />
              <meshStandardMaterial color={lg > 0.5 ? markCol : INK} transparent opacity={L(0.55, 1, lg)} />
            </mesh>
            <mesh position={[0, L(-0.12, 0.5, lg), 0]} scale={L(1, 1.4, lg)}>
              <boxGeometry args={[0.04, 0.24, 0.03]} />
              <meshStandardMaterial color={lg > 0.5 ? markCol : BLUE} metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0, L(-0.6, -0.27, lg), 0]} rotation={[Math.PI, 0, 0]} scale={[L(1, 2.9, lg), L(1, 2.2, lg), L(1, 1.2, lg)]}>
              <coneGeometry args={[0.2, 0.75, 6]} />
              <meshStandardMaterial color={needleCol} metalness={L(0.75, 0.2, lg)} roughness={L(0.25, 0.4, lg)} emissive={needleCol} emissiveIntensity={0.25 * lg} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.08, 6]} />
              <meshStandardMaterial color="#2A2C33" metalness={0.8} roughness={0.25} transparent={lg > 0} opacity={1 - lg} />
            </mesh>
          </group>
          <mesh position={[0, 0, 0.32]} scale={1 - lg}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.3 + 0.5 * lock} />
          </mesh>
          <mesh position={[0, 0, 0.22]} scale={[1, 1, 0.18]}>
            <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.16 * dialFade} depthWrite={false} roughness={0.05} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          <mesh position={[0, -1.8, 0.05]} scale={lock * (1 - lg)}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.8} />
          </mesh>
        </group>
      </ThreeCanvas>
    </div>
  );
};
