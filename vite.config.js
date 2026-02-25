import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // for custom domain https://ryuportfolio.com (root)
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
