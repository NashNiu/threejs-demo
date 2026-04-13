# Three.js 演示合集

[English](README.MD)

使用 **Three.js**、**React** 和 **TypeScript** 构建的交互式 3D 场景合集，由 Vite 驱动。

## 演示列表

| 演示 | 说明 |
|------|------|
| Basic Scene | 可旋转立方体，包含轨道控制器、方向光和网格辅助线 |
| Geometry Showcase | 六种内置几何体，支持线框模式切换 |

## 技术栈

- [Three.js](https://threejs.org/) — 3D 渲染引擎
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — Three.js 的 React 渲染器
- [@react-three/drei](https://github.com/pmndrs/drei) — R3F 常用辅助组件库
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 4](https://vitejs.dev/) — 构建工具
- [React Router v6](https://reactrouter.com/) — 客户端路由

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

## 项目结构

```
src/
├── demos/
│   └── index.ts          # Demo 注册表 — 新增 demo 在这里登记
├── components/
│   └── DemoLayout.tsx    # 所有演示页面共用的布局（含标题栏和返回按钮）
├── pages/
│   ├── Home.tsx          # 首页，展示 demo 卡片列表
│   └── demos/            # 每个 demo 一个文件
│       ├── BasicScene.tsx
│       └── GeometryDemo.tsx
├── App.tsx               # 路由配置
└── main.tsx              # 入口文件
```

## 新增演示页面

1. 在 `src/pages/demos/` 下新建 `YourDemo.tsx`
2. 在 `src/demos/index.ts` 的 `DEMOS` 数组中添加元数据
3. 在 `src/App.tsx` 中添加对应的 `<Route>`

## 许可证

MIT
