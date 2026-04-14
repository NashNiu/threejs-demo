/// <reference types="vite/client" />
import '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Fallback: allow unknown three-fiber element names when types aren't installed
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [tag: string]: unknown;
    }
  }
}

declare module '*.module.css';
declare module '*.module.scss';
declare module '*.css';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
