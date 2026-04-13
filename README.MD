# Three.js Demo Collection

[中文文档](README.zh.md)

A collection of interactive 3D scenes built with **Three.js**, **React** and **TypeScript**, scaffolded with Vite.

## Live Demos

| Demo | Description |
|------|-------------|
| Basic Scene | Rotating cube with orbit controls, directional lighting and grid |
| Geometry Showcase | Six built-in geometries with wireframe toggle |

## Tech Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) — Helpers and abstractions for R3F
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 4](https://vitejs.dev/) — build tool
- [React Router v6](https://reactrouter.com/) — client-side routing

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── demos/
│   └── index.ts          # Demo registry — add new demos here
├── components/
│   └── DemoLayout.tsx    # Shared layout for all demo pages (header + back button)
├── pages/
│   ├── Home.tsx          # Landing page with demo card grid
│   └── demos/            # One file per demo
│       ├── BasicScene.tsx
│       └── GeometryDemo.tsx
├── App.tsx               # Route definitions
└── main.tsx              # Entry point
```

## Adding a New Demo

1. Create `src/pages/demos/YourDemo.tsx`
2. Register it in `src/demos/index.ts`
3. Add a `<Route>` in `src/App.tsx`

## License

MIT
