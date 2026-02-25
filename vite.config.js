import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ViteImageOptimizer({
      logStats: true,
      png: { quality: 100, compressionLevel: 9 },
      jpeg: { quality: 95 },
      jpg: { quality: 95 },
      gif: {},
      cache: false
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
});
