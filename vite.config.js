import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + HashRouter = works on any GitHub Pages path (user or project site).
export default defineConfig({
  base: './',
  plugins: [react()],
  // The 3D scene is lazy-loaded from Home, so three.js lands in its own chunk automatically.
  build: { chunkSizeWarningLimit: 1200 },
});
