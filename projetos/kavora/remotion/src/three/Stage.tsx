// Palco 3D: ThreeCanvas do Remotion com iluminação de estúdio (ambiente PMREM + recorte + preenchimento)
// e mapeamento de tom neutro para o laranja da marca não puxar para o vermelho.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

const Env: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const {gl, scene} = useThree();
  useMemo(() => {
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = 1.0;
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    pm.dispose();
  }, [gl, scene, intensity]);
  return null;
};

export const Stage: React.FC<React.PropsWithChildren<{
  fov?: number; cam?: [number, number, number]; style?: React.CSSProperties; env?: number; key3?: number; warm?: boolean;
}>> = ({children, fov = 30, cam = [0, 0, 16], style, env = 0.9, key3 = 2.2, warm}) => (
  <div style={{position: 'absolute', inset: 0, ...style}}>
    <ThreeCanvas width={1080} height={1920} camera={{fov, position: cam, near: 0.1, far: 200}} gl={{antialias: true, alpha: true, preserveDrawingBuffer: true}}>
      <Env intensity={env} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 7, 8]} intensity={key3} color={warm ? '#FFF1E8' : '#FFFFFF'} />
      <directionalLight position={[-6, -2, 4]} intensity={0.6} color={'#FFE4D6'} />
      <directionalLight position={[0, 4, -8]} intensity={1.4} color={'#FFFFFF'} />
      {children}
    </ThreeCanvas>
  </div>
);

// ---------- materiais da marca ----------
export const mat = {
  orange: () => new THREE.MeshPhysicalMaterial({color: '#FF7138', roughness: 0.38, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.22, sheen: 0.4, sheenColor: new THREE.Color('#FFA36B')}),
  orangeLight: () => new THREE.MeshPhysicalMaterial({color: '#FFA36B', roughness: 0.4, clearcoat: 0.4, clearcoatRoughness: 0.3}),
  pearl: () => new THREE.MeshPhysicalMaterial({color: '#FFFFFF', roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.12, sheen: 0.3, sheenColor: new THREE.Color('#FFA36B')}),
  graphite: () => new THREE.MeshPhysicalMaterial({color: '#202124', roughness: 0.45, metalness: 0.1, clearcoat: 0.3}),
  metal: () => new THREE.MeshPhysicalMaterial({color: '#E8E8E6', roughness: 0.22, metalness: 1}),
  titanium: () => new THREE.MeshPhysicalMaterial({color: '#3a3b40', roughness: 0.3, metalness: 1}),
  glass: () => new THREE.MeshPhysicalMaterial({color: '#111111', roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03}),
};
