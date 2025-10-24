# Comprehensive Guide: Modifying Build Systems for TypeScript Compilation

This guide provides detailed instructions for configuring build systems to support TypeScript compilation, specifically tailored for the gamblingjs project which uses Rollup for the main library and Vite for the Vue webapp.

## Table of Contents

1. [Introduction](#introduction)
2. [Rollup Configuration for TypeScript](#rollup-configuration-for-typescript)
   - [Basic Setup](#basic-setup)
   - [Required Plugins](#required-plugins)
   - [Declaration File Generation](#declaration-file-generation)
   - [Source Maps Configuration](#source-maps-configuration)
   - [Multiple Output Formats](#multiple-output-formats)
   - [Bundle Optimization](#bundle-optimization)
3. [Vite Configuration for TypeScript](#vite-configuration-for-typescript)
   - [Vue + TypeScript Setup](#vue--typescript-setup)
   - [TypeScript Plugin Configuration](#typescript-plugin-configuration)
   - [Handling .vue Files](#handling-vue-files)
   - [Path Aliases Configuration](#path-aliases-configuration)
   - [Build Optimizations](#build-optimizations)
4. [Package.json Script Updates](#packagejson-script-updates)
   - [Main Library Scripts](#main-library-scripts)
   - [Web Application Scripts](#web-application-scripts)
   - [Type Checking Scripts](#type-checking-scripts)
   - [Testing Scripts](#testing-scripts)
5. [Migration Strategies](#migration-strategies)
   - [From JavaScript-only Builds](#from-javascript-only-builds)
   - [Maintaining Backward Compatibility](#maintaining-backward-compatibility)
   - [Incremental TypeScript Adoption](#incremental-typescript-adoption)
6. [Common Build Issues](#common-build-issues)
   - [Third-party Modules Without Types](#third-party-modules-without-types)
   - [Module Resolution Conflicts](#module-resolution-conflicts)
   - [Build Performance Optimization](#build-performance-optimization)
   - [Debugging Compilation Issues](#debugging-compilation-issues)
7. [Advanced Configuration Examples](#advanced-configuration-examples)
8. [Best Practices](#best-practices)

## Introduction

The gamblingjs project consists of two main parts:
1. **Main Library**: A TypeScript poker evaluation library built with Rollup
2. **Web Application**: A Vue.js application built with Vite

Both build systems require specific TypeScript configurations to ensure proper compilation, type checking, and optimization. This guide provides comprehensive, copy-pasteable configuration examples with detailed explanations of each option.

### Prerequisites

Before proceeding with the configurations, ensure you have the following dependencies installed:

#### For Rollup (Main Library):
```bash
npm install --save-dev typescript rollup rollup-plugin-typescript2 rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-sourcemaps rollup-plugin-json
```

#### For Vite (Web Application):
```bash
npm install --save-dev typescript vite @vitejs/plugin-vue vue-tsc
```

---

## Rollup Configuration for TypeScript

### Basic Setup

The foundation of TypeScript support in Rollup requires configuring the rollup.config.js (or rollup.config.ts) file to handle TypeScript compilation. Here's a comprehensive configuration:

```javascript
// rollup.config.js
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
  external: ['lodash'], // External dependencies that shouldn't be bundled
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
      typescript: require('typescript'),
    }),
    commonjs(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    sourceMaps(),
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};
```

### Required Plugins

#### 1. @rollup/plugin-typescript2

This is the recommended TypeScript plugin for Rollup:

```javascript
typescript({
  useTsconfigDeclarationDir: true,      // Generate .d.ts files in declarationDir
  typescript: require('typescript'),    // Use local TypeScript installation
  cacheRoot: './node_modules/.cache/rts2_cache', // Cache location
  clean: true,                          // Clean cache automatically
  rollupCommonJSResolveHack: false,     // Disable legacy CommonJS hack
  exclude: ['**/__tests__/**', '**/*.test.ts'], // Exclude test files
  check: true,                          // Run type checking
  verbosity: 2,                         // Verbose output for debugging
})
```

#### 2. @rollup/plugin-node-resolve

Resolves node_modules dependencies:

```javascript
resolve({
  browser: true,           // Browser-specific resolution
  preferBuiltins: false,   // Don't prefer built-in modules
  dedupe: ['vue'],         // Deduplicate dependencies
  extensions: ['.js', '.ts', '.json'] // File extensions to resolve
})
```

#### 3. @rollup/plugin-commonjs

Converts CommonJS modules to ES6:

```javascript
commonjs({
  include: /node_modules/, // Only include node_modules
  exclude: ['esm'],        // Exclude ES modules
  ignoreGlobal: true,      // Ignore global requires
  sourceMap: false,         // Don't generate source maps for CommonJS
})
```

### Declaration File Generation

To generate TypeScript declaration files (.d.ts):

```javascript
typescript({
  useTsconfigDeclarationDir: true,  // Use tsconfig declarationDir
  declaration: true,                // Generate declaration files
  declarationMap: true,              // Generate declaration source maps
})
```

And in your tsconfig.json:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "dist/types",
    "declarationMap": true
  }
}
```

### Source Maps Configuration

Configure source maps for debugging:

```javascript
// In rollup.config.js
export default {
  output: [
    { 
      file: pkg.main, 
      format: 'umd', 
      sourcemap: true,  // Enable source maps
      sourcemapFile: `${pkg.main}.map` // Separate source map file
    },
  ],
  plugins: [
    sourceMaps(), // Plugin to resolve source maps
  ]
}
```

### Multiple Output Formats

Configure multiple output formats for different environments:

```javascript
export default {
  input: `src/index.ts`,
  output: [
    // UMD format for browsers (with global name)
    { 
      file: 'dist/gamblingjs.umd.js',
      format: 'umd',
      name: 'GamblingJS',
      sourcemap: true,
      exports: 'named'
    },
    // ES modules for modern bundlers
    { 
      file: 'dist/gamblingjs.esm.js',
      format: 'es',
      sourcemap: true
    },
    // CommonJS for Node.js
    { 
      file: 'dist/gamblingjs.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
}
```

### Bundle Optimization

Optimize bundle size with TypeScript-specific settings:

```javascript
typescript({
  // Tree shaking optimization
  treeshake: true,
  // Remove comments
  removeComments: true,
  // Minify output
  minify: process.env.NODE_ENV === 'production',
  // Optimize for production
  transformers: {
    before: [
      // Custom transformers for optimization
    ]
  }
})
```

---

## Vite Configuration for TypeScript

### Vue + TypeScript Setup

For the Vue webapp, configure Vite to handle TypeScript:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      // Enable TypeScript support in Vue SFCs
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
      '@assets': resolve(__dirname, 'src/assets')
    },
    extensions: ['.ts', '.js', '.vue', '.json']
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['daisyui']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    exclude: ['@types/node']
  }
});
```

### TypeScript Plugin Configuration

Vite has built-in TypeScript support, but you can enhance it:

```typescript
// vite.config.ts
export default defineConfig({
  esbuild: {
    target: 'es2020',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  css: {
    devSourcemap: true
  },
  // TypeScript-specific optimizations
  define: {
    __VUE_OPTIONS_API__: JSON.stringify(true),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
  }
});
```

### Handling .vue Files

Configure Vue SFCs with TypeScript:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat all tags with hyphens as custom elements
          isCustomElement: tag => tag.includes('-')
        }
      },
      script: {
        // Enable defineModel and props destructuring
        defineModel: true,
        propsDestructure: true
      }
    })
  ]
});
```

Create a shims-vue.d.ts file for Vue component type support:

```typescript
// src/shims-vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### Path Aliases Configuration

Configure path aliases for cleaner imports:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
});
```

And in tsconfig.json:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@composables/*": ["./src/composables/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@views/*": ["./src/views/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

### Build Optimizations

Optimize the build for production:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['daisyui', 'tailwindcss']
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  }
});
```

---

## Package.json Script Updates

### Main Library Scripts

Update package.json scripts for the main library:

```json
{
  "scripts": {
    "build": "npm run clean && npm run build:types && npm run build:js",
    "build:types": "tsc --project tsconfig.build.json --emitDeclarationOnly",
    "build:js": "rollup -c rollup.config.js",
    "build:watch": "rollup -c rollup.config.js -w",
    "build:prod": "npm run lint && npm run test && npm run build",
    "clean": "rimraf dist",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint": "eslint 'src/**/*.ts' 'test/**/*.ts'",
    "lint:fix": "eslint 'src/**/*.ts' 'test/**/*.ts' --fix",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "dev": "npm run build:watch",
    "prepublishOnly": "npm run build:prod"
  }
}
```

### Web Application Scripts

Update webapp/package.json scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run type-check && vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "type-check:watch": "vue-tsc --noEmit --watch",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "lint:check": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

### Type Checking Scripts

Separate type checking from compilation:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "type-check:strict": "tsc --noEmit --strict",
    "type-check:project": "tsc --project tsconfig.build.json --noEmit"
  }
}
```

### Testing Scripts

Configure testing with TypeScript:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:debug": "node --inspect-brk node_modules/.bin/vitest run"
  }
}
```

---

## Migration Strategies

### From JavaScript-only Builds

When migrating from JavaScript to TypeScript:

1. **Install TypeScript Dependencies**
```bash
npm install --save-dev typescript @types/node
```

2. **Create Initial tsconfig.json**
```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

3. **Gradually Enable Strict Mode**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Maintaining Backward Compatibility

To maintain backward compatibility during migration:

1. **Dual Output Configuration**
```javascript
// rollup.config.js
export default {
  input: `src/index.ts`,
  output: [
    { file: 'dist/library.js', format: 'cjs' },
    { file: 'dist/library.esm.js', format: 'es' },
    { file: 'dist/library.umd.js', format: 'umd', name: 'Library' }
  ],
  external: ['lodash', 'axios']
}
```

2. **JavaScript Compatibility Layer**
```typescript
// src/index.ts
export * from './lib/main';
// Export a default for CommonJS compatibility
import { main } from './lib/main';
export default main;
```

### Incremental TypeScript Adoption

Adopt TypeScript incrementally:

1. **Start with Type Definitions**
```typescript
// types/index.d.ts
export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  value: number;
}

export interface Hand {
  cards: Card[];
  rank: number;
  description: string;
}
```

2. **Convert Utility Functions First**
```typescript
// src/utils/cardUtils.ts
import { Card } from '../types';

export function getCardValue(card: Card): number {
  return card.value;
}

export function compareCards(a: Card, b: Card): number {
  return a.value - b.value;
}
```

3. **Gradually Convert Core Logic**
```typescript
// src/core/evaluator.ts
import { Hand, Card } from '../types';

export class PokerEvaluator {
  evaluateHand(cards: Card[]): Hand {
    // Implementation
  }
}
```

---

## Common Build Issues

### Third-party Modules Without Types

Handle modules without TypeScript definitions:

1. **Create Declaration Files**
```typescript
// types/modules.d.ts
declare module 'some-untyped-module' {
  export function someFunction(arg: string): number;
  export const someValue: number;
}
```

2. **Use Wildcard Modules**
```typescript
// types/modules.d.ts
declare module 'untyped-library/*' {
  const content: any;
  export default content;
}
```

3. **Ignore Type Checking**
```typescript
// @ts-ignore
import untypedModule from 'untyped-module';
```

### Module Resolution Conflicts

Resolve module conflicts between JS and TS:

1. **Configure Module Resolution**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "legacy-module": ["./node_modules/legacy-module/dist/index.js"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

2. **Use Conditional Imports**
```typescript
// src/utils/adapter.ts
let legacyModule: any;

try {
  legacyModule = require('legacy-module');
} catch (e) {
  // Fallback implementation
  legacyModule = {
    method: () => {/* fallback */}
  };
}

export const adapter = {
  method: (arg: string) => legacyModule.method(arg)
};
```

### Build Performance Optimization

Optimize build performance with TypeScript:

1. **Incremental Compilation**
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

2. **Project References**
```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./src/core" },
    { "path": "./src/utils" },
    { "path": "./src/variants" }
  ]
}
```

3. **Exclude Unnecessary Files**
```json
{
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.stories.ts",
    "src/**/*.dev.ts"
  ]
}
```

### Debugging Compilation Issues

Debug TypeScript compilation problems:

1. **Verbose Output**
```bash
tsc --listFiles --verbose
```

2. **Diagnostics**
```bash
tsc --diagnostics --extendedDiagnostics
```

3. **Trace Resolution**
```bash
tsc --traceResolution
```

4. **Rollup Plugin Debugging**
```javascript
// rollup.config.js
typescript({
  verbosity: 2, // Verbose output
  check: true,  // Enable type checking
  tsconfig: './tsconfig.json', // Explicit tsconfig
  cacheRoot: './node_modules/.cache/rts2_cache'
})
```

---

## Advanced Configuration Examples

### Multi-Project Setup

For complex projects with multiple packages:

```javascript
// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

const createConfig = (input, output, external = []) => ({
  input,
  output,
  external,
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
      clean: true
    })
  ]
});

export default [
  createConfig(
    'src/index.ts',
    { file: 'dist/index.js', format: 'cjs' }
  ),
  createConfig(
    'src/browser.ts',
    { file: 'dist/browser.js', format: 'umd', name: 'GamblingJS' }
  )
];
```

### Conditional Compilation

Implement conditional compilation:

```typescript
// src/config.ts
export const config = {
  development: process.env.NODE_ENV === 'development',
  production: process.env.NODE_ENV === 'production',
  version: process.env.npm_package_version || '1.0.0'
};

// Conditional exports
export const debug = config.development ? {
  log: console.log,
  warn: console.warn
} : {
  log: () => {},
  warn: () => {}
};
```

### Custom Transformers

Add custom TypeScript transformers:

```javascript
// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

const customTransformer = ({ types: t }) => ({
  visitor: {
    Identifier(path) {
      // Custom transformation logic
    }
  }
});

typescript({
  transformers: [
    () => ({
      before: [customTransformer],
      after: []
    })
  ]
})
```

---

## Best Practices

### 1. Configuration Organization

- Use separate TypeScript configs for different environments
- Keep Rollup/Vite configs focused on build concerns
- Use environment variables for conditional builds

### 2. Type Safety

- Enable strict mode gradually
- Use type assertions sparingly
- Prefer interfaces over types for object shapes

### 3. Performance

- Enable incremental compilation
- Use project references for large codebases
- Optimize bundle splitting

### 4. Development Experience

- Configure hot module replacement
- Set up proper source maps
- Use IDE integration features

### 5. CI/CD Integration

- Run type checking in CI
- Separate type checking from compilation
- Use caching for faster builds

---

## Conclusion

This comprehensive guide provides the necessary configurations and strategies for modifying build systems to support TypeScript compilation in the gamblingjs project. By following these examples and best practices, you can achieve:

- Robust TypeScript compilation with proper type checking
- Optimized builds for both development and production
- Seamless integration between Rollup and Vite build systems
- Incremental migration paths from JavaScript to TypeScript
- Solutions to common build issues and performance optimizations

Remember to adapt these configurations to your specific project requirements and gradually adopt stricter TypeScript settings as your codebase becomes more type-safe.

---

## Gamblingjs Project-Specific Examples

### Main Library Rollup Configuration

Based on current gamblingjs project structure, here's an optimized Rollup configuration:

```javascript
// rollup.config.js (Optimized for gamblingjs)
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
      clean: true,
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
```

### Webapp Vite Configuration

Optimized Vite configuration for gamblingjs Vue webapp:

```typescript
// webapp/vite.config.ts (Enhanced for gamblingjs)
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
      '@assets': resolve(__dirname, 'src/assets'),
      // Link to main library
      '@gamblingjs': resolve(__dirname, '../src/index.ts')
    },
    extensions: ['.ts', '.js', '.vue', '.json']
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['daisyui'],
          // Separate gamblingjs core logic
          poker: ['@gamblingjs']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
    exclude: ['@types/node']
  },
  // TypeScript-specific optimizations
  esbuild: {
    target: 'es2020',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
});
```

### Optimized Build Scripts

Enhanced package.json scripts for gamblingjs project:

#### Main Library (package.json)

```json
{
  "scripts": {
    "build": "npm run clean && npm run build:types && npm run build:js",
    "build:types": "tsc --project tsconfig.build.json --emitDeclarationOnly",
    "build:js": "rollup -c rollup.config.js",
    "build:watch": "rollup -c rollup.config.js -w",
    "build:prod": "npm run lint && npm run test && npm run build",
    "build:analyze": "rollup -c rollup.config.js --plugin rollup-plugin-analyzer",
    "clean": "rimraf dist",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "type-check:strict": "tsc --noEmit --strict",
    "lint": "eslint 'src/**/*.ts' 'test/**/*.ts'",
    "lint:fix": "eslint 'src/**/*.ts' 'test/**/*.ts' --fix",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "dev": "npm run build:watch",
    "prepublishOnly": "npm run build:prod",
    "docs": "typedoc --out docs --target es6 --theme minimal --mode file src"
  }
}
```

#### Web Application (webapp/package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run type-check && vite build",
    "build:analyze": "vite build --mode analyze",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview",
    "type-check": "vue-tsc --noEmit",
    "type-check:watch": "vue-tsc --noEmit --watch",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "lint:check": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:component": "vitest --config vitest.component.config.ts"
  }
}
```

### TypeScript Configuration for Gamblingjs

#### Main Library tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "dist/types",
    "sourceMap": true,
    "removeComments": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true,
    "typeRoots": ["node_modules/@types"],
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/core/*"],
      "@utils/*": ["src/utils/*"],
      "@variants/*": ["src/variants/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

#### Web Application tsconfig.json

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue"
  ],
  "exclude": [
    "src/**/__tests__/*"
  ],
  "compilerOptions": {
    "composite": false,
    "baseUrl": ".",
    "verbatimModuleSyntax": false,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@composables/*": ["./src/composables/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@views/*": ["./src/views/*"],
      "@assets/*": ["./src/assets/*"],
      "@gamblingjs": ["../src/index.ts"]
    },
    "types": [
      "vite/client"
    ],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Testing Configuration

#### Vitest Configuration for Main Library

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 95,
      functions: 95,
      branches: 90,
      statements: 95,
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@utils': resolve(__dirname, './src/utils'),
      '@variants': resolve(__dirname, './src/variants')
    }
  }
});
```

#### Vitest Configuration for Web Application

```typescript
// webapp/vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.git', '.cache'],
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 95,
      functions: 95,
      branches: 90,
      statements: 95,
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@views': resolve(__dirname, 'src/views'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@gamblingjs': resolve(__dirname, '../src/index.ts')
    }
  }
});
```

### Environment-Specific Configurations

#### Development Configuration

```typescript
// rollup.config.dev.js
import baseConfig from './rollup.config.js';

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    // Development-specific plugins
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
};
```

#### Production Configuration

```typescript
// rollup.config.prod.js
import baseConfig from './rollup.config.js';
import { terser } from 'rollup-plugin-terser';

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })
  ]
};
```

### Performance Monitoring

Monitor build performance with these configurations:

```javascript
// rollup.config.js
import { time } from './plugins/time-plugin';

export default {
  plugins: [
    time(), // Custom timing plugin
    // ... other plugins
  ]
};
```

```typescript
// plugins/time-plugin.ts
import { Plugin } from 'rollup';

export function time(): Plugin {
  let start: number;
  
  return {
    name: 'time-plugin',
    buildStart() {
      start = Date.now();
    },
    buildEnd() {
      console.log(`Build completed in ${Date.now() - start}ms`);
    }
  };
}
```

This comprehensive guide with gamblingjs-specific examples provides everything needed to configure TypeScript compilation for both main library and Vue webapp build systems.
