import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/flappy-bird-3d/',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
  },
});
