import React, { useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { needleAngle } from './Compass';
import { prog, spr, lerp, inOut, expoOut } from '../animations/motion';

// BÚSSOLA DO PRUMO em 3D real (Three.js via @remotion/three). Todo movimento vem do tempo t (frame), nunca de useFrame.
// f = { a, spin, settle, morph } (mesma agulha da versão 2D) · cam = { orbit, tilt, dist } controlados pela cena
const BLUE = '#0071E3', INK = '#1D1D1F';
const Ticks = ({ lock }) => {
  const items = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  return items.map((i) => {
    const a = (i / 60) * Math.PI * 2, major = i % 15 === 0, down = i === 0;
    const r = 1.38, len = major ? 0.2 : 0.1;
    return (
      <mesh key={i} position={[Math.sin(a) * (r - len / 2), -Math.cos(a) * (r - len / 2), 0.16]} rotation={[0, 0, a]}>
        <boxGeometry args={[down ? 0.05 : major ? 0.035 : 0.018, len, 0.02]} />
        <meshStandardMaterial color={down ? BLUE : INK} emissive={down ? BLUE : '#000'} emissiveIntensity={down ? 0.6 * lock : 0} metalness={0.2} roughness={0.5} opacity={major || down ? 0.9 : 0.45} transparent />
      </mesh>
    );
  });
};
const DIST = 17, WPP = (2 * DIST * Math.tan((15 * Math.PI) / 180)) / 1920;   // unidades do mundo por pixel
export const Compass3D = ({ t, f, orbit = 0, tilt = 0, roll = 0, cx = 540, cy = 960, size = 600, glow = 0, opacity = 1, width, height }) => {
  const dist = DIST, scale = (size * WPP) / 3.2, y = -(cy - 960) * WPP, x = (cx - 540) * WPP;
  const vc = useVideoConfig();
  const W = width ?? vc.width, H = height ?? vc.height;
  const ring = prog(t, f.a, 0.9, expoOut);
  const ang = (needleAngle(t, f) * Math.PI) / 180;
  const lock = spr(t, f.settle + 0.55, { damping: 12, stiffness: 180 });
  const pivot = 0.07;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: opacity * Math.min(1, ring * 2.5) }}>
      <ThreeCanvas width={W} height={H} camera={{ fov: 30, position: [0, 0, dist] }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.95} />
        <directionalLight position={[-3, 5, 6]} intensity={1.4} />
        <directionalLight position={[4, -2, 3]} intensity={0.5} color="#BFD8FF" />
        <pointLight position={[0, -1.6, 1.2]} intensity={2.2 * glow} color={BLUE} distance={4} />
        <group position={[x, y, 0]} rotation={[tilt, orbit, roll]} scale={scale * lerp(0.3, 1, ring)}>
          {/* corpo: disco de alumínio + aro */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
            <cylinderGeometry args={[1.6, 1.6, 0.22, 96]} />
            <meshStandardMaterial color="#F2F4F8" metalness={0.35} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <torusGeometry args={[1.56, 0.07, 24, 120]} />
            <meshStandardMaterial color="#D5DAE3" metalness={0.85} roughness={0.22} />
          </mesh>
          {/* mostrador */}
          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[1.48, 96]} />
            <meshBasicMaterial color="#FBFCFE" />
          </mesh>
          <Ticks lock={lock} />
          {/* agulha: contrapeso fino em cima + peso do prumo embaixo */}
          <group position={[0, 0, 0.28]} rotation={[0, 0, ang]}>
            <mesh position={[0, 0.55, 0]}>
              <boxGeometry args={[0.025, 1.1, 0.02]} />
              <meshStandardMaterial color={INK} opacity={0.55} transparent />
            </mesh>
            <mesh position={[0, -0.12, 0]}>
              <boxGeometry args={[0.04, 0.24, 0.03]} />
              <meshStandardMaterial color={BLUE} metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.2, 0.75, 6]} />
              <meshStandardMaterial color={INK} metalness={0.75} roughness={0.25} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.08, 6]} />
              <meshStandardMaterial color="#2A2C33" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
          <mesh position={[0, 0, 0.32]}>
            <sphereGeometry args={[pivot, 24, 24]} />
            <meshStandardMaterial color={BLUE} metalness={0.5} roughness={0.2} emissive={BLUE} emissiveIntensity={0.3 + 0.5 * lock} />
          </mesh>
          {/* vidro */}
          <mesh position={[0, 0, 0.22]} scale={[1, 1, 0.18]}>
            <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.16} roughness={0.05} metalness={0} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          {/* ponto azul de direção, fora do aro */}
          <mesh position={[0, -1.8, 0.05]} scale={lock}>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.8} />
          </mesh>
        </group>
      </ThreeCanvas>
    </div>
  );
};
