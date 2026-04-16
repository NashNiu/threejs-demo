import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import DemoLayout from '@/components/DemoLayout';

// ── 配置参数 ──────────────────────────────────────────────────────────────────
const ARM_COUNT = 2;           // 旋臂数量
const STARS_PER_ARM = 2000;    // 每条旋臂的恒星数
const CORE_STARS = 1000;       // 核球随机恒星数
const BG_STARS = 7000;         // 背景星场数量
const MAX_RADIUS = 12;         // 星系最大半径
const SPIRAL_TURNS = 2.2;      // 旋臂圈数
const ROTATION_SPEED = 0.04;   // 旋转角速度（弧度/秒）

// ── 颜色工具 ─────────────────────────────────────────────────────────────────
function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return new THREE.Color(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
}

// ── 星系主体（旋臂 + 核球） ───────────────────────────────────────────────────
function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const total = ARM_COUNT * STARS_PER_ARM + CORE_STARS;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 4); // rgba for opacity
    const sizes = new Float32Array(total);

    // 预定义颜色节点（沿半径方向渐变）
    const coreColor = new THREE.Color('#c2d418');   // 核心：暖白
    const midColor = new THREE.Color('#c1cfe4');    // 中段：冷蓝
    const outerColor = new THREE.Color('#a484fc');  // 外沿：紫色

    let idx = 0;

    // ── 旋臂恒星 ──────────────────────────────────────────────────────────────
    for (let arm = 0; arm < ARM_COUNT; arm++) {
      const armOffset = (arm / ARM_COUNT) * Math.PI * 2;

      for (let i = 0; i < STARS_PER_ARM; i++) {
        const t = i / STARS_PER_ARM; // 0（内）→ 1（外）

        // 对数螺旋 + 随机扰动
        const radius = 0.5 + t * MAX_RADIUS;
        const spiral = armOffset + t * SPIRAL_TURNS * Math.PI * 2;

        // 越靠外，角度扰动越大（旋臂越"蓬松"）
        const scatter = (0.05 + t * 0.35) * (Math.random() - 0.5) * 2;
        const angle = spiral + scatter;

        // 径向小扰动
        const r = radius + (Math.random() - 0.5) * radius * 0.12;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        // 盘面垂直方向：越靠核心越薄
        const y = (Math.random() - 0.5) * 0.4 * (1 - t * 0.8);

        positions[idx * 3 + 0] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // 颜色渐变
        let color: THREE.Color;
        if (t < 0.3) {
          color = lerpColor(coreColor, midColor, t / 0.3);
        } else {
          color = lerpColor(midColor, outerColor, (t - 0.3) / 0.7);
        }

        colors[idx * 4 + 0] = color.r;
        colors[idx * 4 + 1] = color.g;
        colors[idx * 4 + 2] = color.b;
        colors[idx * 4 + 3] = 0.7 + Math.random() * 0.3; // alpha

        // 内部星星更大更亮
        sizes[idx] = t < 0.15 ? 2.5 + Math.random() * 2 : 1 + Math.random() * 1.5;

        idx++;
      }
    }

    // ── 核球随机恒星 ──────────────────────────────────────────────────────────
    for (let i = 0; i < CORE_STARS; i++) {
      // 高斯分布近似：取多次 random 平均使分布向中心集中
      const u = Math.random() + Math.random() + Math.random();
      const r = (u / 3) * 2.5; // 核球半径 2.5
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[idx * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx * 3 + 1] = r * Math.cos(phi) * 0.4; // 压扁
      positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const t = r / 2.5;
      const color = lerpColor(
        new THREE.Color('#fff8cc'),
        new THREE.Color('#ffaa44'),
        t,
      );
      colors[idx * 4 + 0] = color.r;
      colors[idx * 4 + 1] = color.g;
      colors[idx * 4 + 2] = color.b;
      colors[idx * 4 + 3] = 0.8 + Math.random() * 0.2;

      sizes[idx] = 1.5 + Math.random() * 2;
      idx++;
    }

    return { positions, colors, sizes };
  }, []);

  // 逐帧旋转
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (pointsRef.current) {
      pointsRef.current.rotation.y += ROTATION_SPEED * dt;
    }
  });

  // 自定义顶点着色器：支持 alpha 与圆形点
  const vertexShader = `
    attribute float aSize;
    attribute vec4 aColor;
    varying vec4 vColor;
    void main() {
      vColor = aColor;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (300.0 / -mvPos.z);
      gl_Position = projectionMatrix * mvPos;
    }
  `;

  const fragmentShader = `
    varying vec4 vColor;
    void main() {
      // 将点裁剪成圆形，边缘淡出
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      float alpha = vColor.a * smoothstep(0.5, 0.1, d);
      gl_FragColor = vec4(vColor.rgb, alpha);
    }
  `;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 4));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ── 背景星场（静止，不随星系旋转） ───────────────────────────────────────────
function BackgroundStars() {
  const geometry = useMemo(() => {
    const pos = new Float32Array(BG_STARS * 3);
    for (let i = 0; i < BG_STARS; i++) {
      const r = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}

// ── 星系核心辉光（叠加一个半透明大球） ──────────────────────────────────────
function CoreGlow() {
  return (
    <>
      {/* 外层柔光 */}
      <mesh>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#ffcc66"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* 内核亮点 */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// ── 主导出 ────────────────────────────────────────────────────────────────────
export default function GalaxyDemo() {
  return (
    <DemoLayout
      title="Galaxy"
      description="Spiral galaxy simulation with 23 000+ particles, logarithmic spiral arms, colour gradients and additive blending."
    >
      <Canvas
        camera={{ position: [0, 14, 22], fov: 60 }}
        style={{ background: '#02020e' }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.05} />
        <BackgroundStars />
        <Galaxy />
        <CoreGlow />
        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          minDistance={4}
          maxDistance={60}
          autoRotate={false}
        />
      </Canvas>
    </DemoLayout>
  );
}
