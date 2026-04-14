import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import type { Mesh } from 'three';
import DemoLayout from '@/components/DemoLayout';

function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.8;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#7c6aff" roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

export default function BasicScene() {
  return (
    <DemoLayout
      title="Basic Scene"
      description="Rotating cube with orbit controls, lighting and grid helper."
    >
      <Canvas shadows camera={{ position: [3, 3, 5], fov: 50 }} style={{ background: '#0f0f13' }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <RotatingCube />

        <Grid
          receiveShadow
          position={[0, -1, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#2a2a3a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#3a3a5a"
          fadeDistance={20}
          fadeStrength={1}
        />

        <Environment preset="city" />
        <OrbitControls makeDefault />
      </Canvas>
    </DemoLayout>
  );
}
