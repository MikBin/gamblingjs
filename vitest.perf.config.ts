/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'forks',
    maxWorkers: 1,
    include: ['test/performance/**/*.perf.ts'],
    exclude: [
      'node_modules',
      'dist',
      '**/*.d.ts',
      'test/fixtures/**'
    ],
    testTimeout: 60000,
    hookTimeout: 60000,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@utils': resolve(__dirname, './src/utils'),
      '@variants': resolve(__dirname, './src/variants'),
      '@test': resolve(__dirname, './test'),
      '@test-data': resolve(__dirname, './test/test_data')
    }
  }
});
