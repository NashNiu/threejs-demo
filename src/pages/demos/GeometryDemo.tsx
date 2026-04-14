import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import type { Mesh } from 'three';
import DemoLayout from '@/components/DemoLayout';
import styles from './GeometryDemo.module.css';

interface ShapeProps {
  position: [number, number, number];
  label: string;
  wireframe: boolean;
  color: string;
  children: React.ReactNode;
}

function Shape({ position, label, wireframe, color, children }: ShapeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        {children}
        <meshStandardMaterial color={color} wireframe={wireframe} roughness={0.4} metalness={0.2} />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#888899"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

const SHAPES = [
  { label: 'Box', color: '#7c6aff', children: <boxGeometry args={[1, 1, 1]} /> },
  { label: 'Sphere', color: '#ff6a9b', children: <sphereGeometry args={[0.6, 32, 32]} /> },
  {
    label: 'Cylinder',
    color: '#6affb8',
    children: <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />,
  },
  { label: 'Cone', color: '#ffb86a', children: <coneGeometry args={[0.6, 1.2, 32]} /> },
  { label: 'Torus', color: '#6ab8ff', children: <torusGeometry args={[0.5, 0.2, 16, 100]} /> },
  { label: 'Octahedron', color: '#ff6a6a', children: <octahedronGeometry args={[0.7]} /> },
];

export default function GeometryDemo() {
  const [wireframe, setWireframe] = useState(false);

  const cols = 3;
  const spacing = 3;

  return (
    <DemoLayout
      title="Geometry Showcase"
      description="Built-in Three.js geometries with standard materials."
    >
      <div className={styles.controls}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
          />
          <span>Wireframe</span>
        </label>
      </div>

      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
        style={{ background: '#0f0f13', height: 'calc(100% - 48px)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />

        {SHAPES.map((shape, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = (col - (cols - 1) / 2) * spacing;
          const y = -(row * spacing) + spacing / 2;
          return (
            <Shape
              key={shape.label}
              position={[x, y, 0]}
              label={shape.label}
              wireframe={wireframe}
              color={shape.color}
            >
              {shape.children}
            </Shape>
          );
        })}

        <Environment preset="studio" />
        <OrbitControls makeDefault />
      </Canvas>
    </DemoLayout>
  );
}
