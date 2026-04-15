export interface DemoMeta {
  id: string;
  title: string;
  description: string;
  path: string;
  preview?: string;
  tags: string[];
}
const basicPreview = new URL('./imgs/1.png', import.meta.url).href;
const geometryPreview = new URL('./imgs/2.png', import.meta.url).href;
const rainPreview = new URL('./imgs/3.png', import.meta.url).href;

export const DEMOS: DemoMeta[] = [
  {
    id: 'basic-scene',
    title: 'Basic Scene',
    description: 'A minimal Three.js scene with a rotating cube, ambient and directional lighting.',
    path: '/demo/basic-scene',
    preview: basicPreview,
    tags: ['beginner', 'geometry', 'lighting'],
  },
  {
    id: 'geometry',
    title: 'Geometry Showcase',
    description:
      'Multiple built-in Three.js geometries displayed with wireframe and solid materials.',
    path: '/demo/geometry',
    preview: geometryPreview,
    tags: ['geometry', 'materials'],
  },
  {
    id: 'rain',
    title: 'Rain Effect',
    description:
      'Particle-based rain simulation with instanced mesh, ripple effects and atmospheric fog.',
    path: '/demo/rain',
    preview: rainPreview,
    tags: ['particles', 'effects', 'instancing'],
  },
  {
    id: 'galaxy',
    title: 'Galaxy',
    description:
      'Spiral galaxy with 23 000+ particles, logarithmic spiral arms, colour gradients and additive blending.',
    path: '/demo/galaxy',
    tags: ['particles', 'shader', 'space', 'effects'],
  },
];
