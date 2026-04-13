import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import DemoLayout from '@/components/DemoLayout'

const RAIN_COUNT = 8000
const AREA = 40
const RAIN_SPEED = 18
const RAIN_LENGTH = 0.6

function RainDrops() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // 初始化每滴雨的位置和速度（随机分布）
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(RAIN_COUNT * 3)
    const speeds = new Float32Array(RAIN_COUNT)
    for (let i = 0; i < RAIN_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * AREA      // x
      positions[i * 3 + 1] = Math.random() * 30 - 5             // y（随机高度）
      positions[i * 3 + 2] = (Math.random() - 0.5) * AREA      // z
      speeds[i] = 0.8 + Math.random() * 0.4                     // 速度系数
    }
    return { positions, speeds }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 初始化 InstancedMesh 变换
  useMemo(() => {
    if (!meshRef.current) return
    for (let i = 0; i < RAIN_COUNT; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    for (let i = 0; i < RAIN_COUNT; i++) {
      // 向下落
      positions[i * 3 + 1] -= RAIN_SPEED * speeds[i] * delta

      // 超出底部时重置到顶部
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 25
        positions[i * 3 + 0] = (Math.random() - 0.5) * AREA
        positions[i * 3 + 2] = (Math.random() - 0.5) * AREA
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]}>
      {/* 雨滴：细长圆柱体模拟水线 */}
      <cylinderGeometry args={[0.01, 0.01, RAIN_LENGTH, 4]} />
      <meshBasicMaterial
        color="#a8d8f0"
        transparent
        opacity={0.55}
      />
    </instancedMesh>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
      <planeGeometry args={[AREA, AREA]} />
      <meshStandardMaterial color="#1a2030" roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

function Ripples() {
  const groupRef = useRef<THREE.Group>(null)

  // 创建若干水面涟漪圆环
  const ripples = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * AREA * 0.9,
      z: (Math.random() - 0.5) * AREA * 0.9,
      phase: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 1.2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      const ripple = ripples[i]
      const progress = ((t * ripple.speed + ripple.phase) % (Math.PI * 2)) / (Math.PI * 2)
      const scale = progress * 1.8 + 0.1
      mesh.scale.set(scale, 1, scale)
      const mat = mesh.material as THREE.MeshBasicMaterial
      mat.opacity = (1 - progress) * 0.5
    })
  })

  return (
    <group ref={groupRef} position={[0, -4.98, 0]}>
      {ripples.map(r => (
        <mesh key={r.id} position={[r.x, 0, r.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.22, 24]} />
          <meshBasicMaterial color="#6ec6f0" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

export default function RainDemo() {
  return (
    <DemoLayout
      title="Rain Effect"
      description="Particle-based rain simulation with instanced mesh, ripple effects and atmospheric fog."
    >
      <Canvas
        camera={{ position: [0, 8, 20], fov: 55 }}
        style={{ background: '#0a0e1a' }}
      >
        {/* 大气雾效 */}
        <fog attach="fog" args={['#0a0e1a', 10, 45]} />

        {/* 环境光 — 蓝偏暗调 */}
        <ambientLight intensity={0.25} color="#3a5070" />

        {/* 模拟远处闪电/路灯的冷白点光 */}
        <pointLight position={[0, 15, 0]} intensity={1.2} color="#c0d8ff" distance={50} />
        <pointLight position={[-15, 5, -10]} intensity={0.5} color="#8ab4e8" distance={30} />

        <RainDrops />
        <Ground />
        <Ripples />

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={40}
        />
      </Canvas>
    </DemoLayout>
  )
}
