import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@poker-sym': path.resolve(__dirname, '../src'),
    },
  },
  server: {
    open: true,
  },
});