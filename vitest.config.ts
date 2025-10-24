/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
    exclude: [
      'node_modules',
      'dist',
      '**/*.d.ts',
      'test/fixtures/**'
    ],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        'tools/',
        'coverage/'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 95,
          lines: 95,
          statements: 95
        },
        'src/core/**/*.ts': {
          branches: 95,
          functions: 98,
          lines: 98,
          statements: 98
        },
        'src/PokerEvaluator.ts': {
          branches: 95,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    }
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
