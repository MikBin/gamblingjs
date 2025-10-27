import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const libraryName = 'gamblingjs';

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
  ],
  external: ['kombinatoricsjs'], // External dependency
  watch: {
    include: 'src/**',
  },
  plugins: [
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      typescript: require('typescript'),
      cacheRoot: './node_modules/.cache/rts2_cache',
      clean: true, // Clean cache automatically
      rollupCommonJSResolveHack: false,
      exclude: ['**/__tests__/**', '**/*.test.ts'],
      check: true,
      verbosity: 2,
      // Specific to gamblingjs project
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    }),
    commonjs({
      include: /node_modules/,
      exclude: ['esm']
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.js', '.ts', '.json']
    }),
    sourceMaps(),
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};
