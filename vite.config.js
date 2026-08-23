import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/atlas/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  }
});
