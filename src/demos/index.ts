export interface DemoMeta {
  id: string
  title: string
  description: string
  path: string
  tags: string[]
}

export const DEMOS: DemoMeta[] = [
  {
    id: 'basic-scene',
    title: 'Basic Scene',
    description: 'A minimal Three.js scene with a rotating cube, ambient and directional lighting.',
    path: '/demo/basic-scene',
    tags: ['beginner', 'geometry', 'lighting'],
  },
  {
    id: 'geometry',
    title: 'Geometry Showcase',
    description: 'Multiple built-in Three.js geometries displayed with wireframe and solid materials.',
    path: '/demo/geometry',
    tags: ['geometry', 'materials'],
  },
  {
    id: 'rain',
    title: 'Rain Effect',
    description: 'Particle-based rain simulation with instanced mesh, ripple effects and atmospheric fog.',
    path: '/demo/rain',
    tags: ['particles', 'effects', 'instancing'],
  },
]
