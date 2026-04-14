import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import BasicScene from '@/pages/demos/BasicScene';
import GeometryDemo from '@/pages/demos/GeometryDemo';
import RainDemo from '@/pages/demos/RainDemo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo/basic-scene" element={<BasicScene />} />
      <Route path="/demo/geometry" element={<GeometryDemo />} />
      <Route path="/demo/rain" element={<RainDemo />} />
    </Routes>
  );
}
