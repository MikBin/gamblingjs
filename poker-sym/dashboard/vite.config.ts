import { defineConfig } from 'vite';
import path from 'path';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@poker-sym': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        omaha: resolve(__dirname, 'omaha.html'),
        'omaha-hi-lo': resolve(__dirname, 'omaha-hi-lo.html'),
        stud: resolve(__dirname, 'stud.html'),
        'stud-hi-lo': resolve(__dirname, 'stud-hi-lo.html'),
        razz: resolve(__dirname, 'razz.html'),
        street: resolve(__dirname, 'street.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
