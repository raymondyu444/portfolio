import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/portfolio-2026/', // for GitHub Pages: https://YOUR_USERNAME.github.io/portfolio-2026/
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
