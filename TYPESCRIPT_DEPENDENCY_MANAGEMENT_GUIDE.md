# TypeScript Dependency Management Guide for gamblingjs

This comprehensive guide provides strategies and best practices for managing dependencies during TypeScript migration in the gamblingjs project.

## Table of Contents

1. [Managing Third-Party Dependencies](#managing-third-party-dependencies)
2. [Handling Untyped Libraries](#handling-untyped-libraries)
3. [Dependency Organization Strategies](#dependency-organization-strategies)
4. [Specific gamblingjs Dependency Challenges](#specific-gamblingjs-dependency-challenges)
5. [Dependency Migration Workflow](#dependency-migration-workflow)
6. [Best Practices for Dependency Management](#best-practices-for-dependency-management)
7. [Practical Examples](#practical-examples)

## Managing Third-Party Dependencies

### Identifying Dependencies with Existing @types Packages

Before adding type definitions, check if they already exist:

```bash
# Check if a package has types available
npm info <package-name> types

# Search for types packages
npm search @types/<package-name>

# Check multiple packages at once
npm ls --depth=0 | grep -E "^[└├]" | cut -d' ' -f2 | while read pkg; do
  if npm info "$pkg" types 2>/dev/null | grep -q "types"; then
    echo "✓ $pkg has types available"
  else
    echo "✗ $pkg may need custom type definitions"
  fi
done
```

### Installing and Configuring Type Definitions

For popular libraries with existing type definitions:

```bash
# Install types as dev dependencies
npm install --save-dev @types/node @types/lodash @types/jest

# For Vue.js ecosystem
npm install --save-dev @types/vue @vue/runtime-core

# For build tools
npm install --save-dev @types/rollup @types/webpack
```

### Version Compatibility Between Packages and Type Definitions

Ensure version compatibility between packages and their type definitions:

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.195"  // Should match lodash major version
  }
}
```

**Version Matching Strategy:**
- Type definitions should match the major version of the package
- For minor version differences, check the type definition's changelog
- Use `npm ls @types/package-name` to check installed versions

### Managing Type-Only Dependencies

Use type-only imports to avoid runtime dependencies:

```typescript
// Type-only import
import type { Card, Hand } from './types/poker';

// Mixed import (types and values)
import { evaluateHand, type HandResult } from './evaluator';
```

In package.json, mark type-only packages:

```json
{
  "devDependencies": {
    "@types/node": "^20.5.0",
    "typescript": "^5.2.0"
  },
  "peerDependencies": {
    "typescript": ">=5.0.0"
  }
}
```

## Handling Untyped Libraries

### Creating Custom Declaration Files (.d.ts)

For libraries without type definitions, create custom declaration files:

```typescript
// src/types/kombinatoricsjs.d.ts
declare module 'kombinatoricsjs' {
  export function factorial(n: number): number;
  export function cNK(n: number, k: number): number;
  export function pNK(n: number, k: number): number;
  export function combinations<T>(array: T[], k: number): T[][];
  export function permutations<T>(array: T[]): T[][];
  export function shuffle<T>(array: T[]): void;
  export function crossProduct<T>(array: T[], k: number): T[][];
  
  // Iterator types
  export interface CombinationsIterator<T> {
    next(): number;
    getComb(cnt?: number): T[] | number;
    getIndex(): number[];
    getCount(): number;
    reset(): void;
  }
  
  export function combinationsIterator<T>(list: T[], k: number): CombinationsIterator<T>;
}
```

### Strategies for Typing Complex Third-Party Modules

For complex libraries, use progressive typing:

```typescript
// Start with basic types
declare module 'complex-library' {
  export const someFunction: any;
  export const someValue: any;
}

// Gradually improve types
declare module 'complex-library' {
  export interface ComplexOptions {
    option1: string;
    option2?: number;
    callback?: (result: any) => void;
  }
  
  export function someFunction(options: ComplexOptions): Promise<any>;
  export const someValue: string;
}
```

### Using Ambient Declarations vs Module Declarations

**Ambient Declarations (Global):**
```typescript
// types/global.d.ts
declare global {
  interface Window {
    myGlobalLibrary: {
      version: string;
      init(config: any): void;
    };
  }
}

export {};
```

**Module Declarations:**
```typescript
// types/modules.d.ts
declare module 'untyped-module' {
  export function doSomething(input: string): number;
  export const VERSION: string;
}
```

### Handling Global Variables and Libraries

For libraries that attach to the global scope:

```typescript
// types/globals.d.ts
declare var jQuery: (selector: string) => any;
declare var _: any;

// For libraries with complex global objects
declare namespace MyLibrary {
  interface Config {
    apiKey: string;
    endpoint: string;
  }
  
  function init(config: Config): void;
  const version: string;
}

declare var MyLibrary: typeof MyLibrary;
```

## Dependency Organization Strategies

### Structuring Type Definitions in the Project

Create a clear structure for type definitions:

```
src/
├── types/
│   ├── global.d.ts          # Global type declarations
│   ├── modules.d.ts         # Third-party module declarations
│   ├── api.d.ts            # API response types
│   ├── poker.d.ts          # Domain-specific types
│   └── utils.d.ts          # Utility types
├── lib/
│   └── kombinatoricsjs/     # Local library with types
└── ...
```

### Managing Type Definitions for Main Library and WebApp

**Main Library (gamblingjs):**
```typescript
// src/types/index.ts - Export all public types
export type { Card, Hand, HandResult } from './poker';
export type { EvaluationOptions } from './evaluator';

// Main entry point includes types
export * from './types';
export * from './evaluators';
```

**WebApp Types:**
```typescript
// webapp/src/types/index.ts
import type { Card, Hand } from '../../../src/types';

// Extend with UI-specific types
export interface UIHand extends Hand {
  id: string;
  selected: boolean;
}
```

### Handling Shared Dependencies Between Projects

For shared types between main library and webapp:

```typescript
// shared-types/index.ts
export type { Card, Hand, HandResult } from './poker';
export type { GameVariant } from './game';

// In main library tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@shared-types": ["../shared-types"]
    }
  }
}

// In webapp tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@shared-types": ["../shared-types"]
    }
  }
}
```

### Organizing Custom Type Definitions

Create a systematic approach to custom types:

```typescript
// src/types/external.d.ts - Third-party library types
declare module 'untyped-library' {
  // Type definitions
}

// src/types/internal.d.ts - Internal library types
export interface InternalType {
  // Type definition
}

// src/types/index.ts - Central export
export * from './internal';
export * from './external';
```

## Specific gamblingjs Dependency Challenges

### Typing the kombinatoricsjs Library

The kombinatoricsjs library is a local dependency that needs proper typing:

```typescript
// src/lib/kombinatoricsjs/index.d.ts
export * from './src/kombinatoricsjs';

// Or create a more focused type definition
declare module 'kombinatoricsjs' {
  export function factorial(n: number): number;
  export function cNK(n: number, k: number): number;
  export function pNK(n: number, k: number): number;
  export function combinations<T>(array: T[], k: number): T[][];
  export function permutations<T>(array: T[]): T[][];
  export function shuffle<T>(array: T[]): void;
  export function crossProduct<T>(array: T[], k: number): T[][];
  
  // Advanced types for iterators
  export interface KombinatoricsIterator<T> {
    next(): number;
    getComb(cnt?: number): T[] | number;
    getIndex(): number[];
    getCount(): number;
    reset(): void;
  }
  
  export function combinationsIterator<T>(list: T[], k: number): KombinatoricsIterator<T>;
  export function permutationsIterator<T>(list: T[]): KombinatoricsIterator<T>;
}
```

### Handling Vue.js Ecosystem Type Definitions

For the Vue.js webapp:

```bash
# Install Vue.js type definitions
npm install --save-dev @types/vue @vue/runtime-core
```

```typescript
// webapp/src/types/vue.d.ts
import type { DefineComponent } from 'vue';

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Extend Vue with custom properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $poker: PokerStore;
  }
}
```

### Managing Types for Build Tools (Rollup, Vite)

For build tool configurations:

```typescript
// rollup.config.ts
import typescript from 'rollup-plugin-typescript2';
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  // Configuration
};

export default config;
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  // Configuration
};

export default defineConfig(config);
```

### Typing Testing Utilities (Vitest)

For Vitest testing utilities:

```typescript
// test/setup.ts
import { expect, vi } from 'vitest';

// Custom matchers
expect.extend({
  toBeValidHand(received: any) {
    // Custom assertion logic
    return {
      pass: true,
      message: () => 'Hand is valid'
    };
  }
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeValidHand(): T;
    }
  }
}
```

## Dependency Migration Workflow

### Audit Process for Existing Dependencies

1. **Inventory Dependencies**
```bash
# List all dependencies
npm ls --depth=0

# Check for type definitions
npm ls --depth=0 | grep -E "^[└├]" | cut -d' ' -f2 | while read pkg; do
  if npm info "$pkg" types 2>/dev/null | grep -q "types"; then
    echo "✓ $pkg: @types/$pkg available"
  else
    echo "✗ $pkg: No types available"
  fi
done
```

2. **Categorize Dependencies**
   - **Typed**: Libraries with existing @types packages
   - **Untyped**: Libraries without type definitions
   - **Local**: Internal libraries requiring typing
   - **Build**: Development dependencies needing typing

3. **Prioritize Migration**
   - High: Core dependencies (Vue, kombinatoricsjs)
   - Medium: Utility libraries (lodash, testing frameworks)
   - Low: Development tools (linters, formatters)

### Step-by-Step Process for Adding Type Definitions

1. **Install Available Type Definitions**
```bash
npm install --save-dev @types/node @types/lodash @types/jest
```

2. **Create Custom Declaration Files**
```typescript
// src/types/external.d.ts
declare module 'untyped-library' {
  // Type definitions
}
```

3. **Update tsconfig.json**
```json
{
  "compilerOptions": {
    "typeRoots": ["node_modules/@types", "src/types"],
    "paths": {
      "kombinatoricsjs": ["src/lib/kombinatoricsjs/src/kombinatoricsjs"]
    }
  }
}
```

4. **Update Import Statements**
```typescript
// Before
import kombinatorics from './lib/kombinatoricsjs/src/kombinatoricsjs';

// After
import * as kombinatorics from 'kombinatoricsjs';
```

### Validation Steps for Dependency Typing

1. **Type Checking**
```bash
# Run TypeScript compiler
npx tsc --noEmit

# Check for type errors
npm run type-check
```

2. **Testing**
```bash
# Run tests with type checking
npm run test

# Run tests with coverage
npm run test:coverage
```

3. **Build Verification**
```bash
# Build the project
npm run build

# Check for build errors
npm run build:prod
```

### Handling Dependency Updates Post-Migration

1. **Monitor Type Definition Updates**
```bash
# Check for outdated type definitions
npm outdated @types/*

# Update type definitions
npm update @types/*
```

2. **Version Compatibility Checks**
```bash
# Check compatibility after updates
npm ls --depth=0
```

3. **Automated Testing**
```bash
# Run full test suite after updates
npm run test:prod
```

## Best Practices for Dependency Management

### Semantic Versioning Considerations with TypeScript

1. **Type Definition Versioning**
   - Match major versions with packages
   - Use caret (^) for compatible updates
   - Pin exact versions for critical dependencies

2. **Breaking Changes**
   - Monitor type definition changelogs
   - Test major version updates in isolation
   - Maintain compatibility layers when needed

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.195"
  }
}
```

### Managing Peer Dependencies with Types

For libraries with peer dependencies:

```json
{
  "peerDependencies": {
    "vue": "^3.3.0",
    "typescript": ">=5.0.0"
  },
  "peerDependenciesMeta": {
    "typescript": {
      "optional": true
    }
  },
  "devDependencies": {
    "@types/vue": "^3.3.0",
    "typescript": "^5.2.0"
  }
}
```

### Handling Optional Dependencies

For optional dependencies:

```typescript
// Dynamic imports for optional dependencies
async function loadOptionalDependency() {
  try {
    const optionalModule = await import('optional-dependency');
    return optionalModule;
  } catch (error) {
    console.warn('Optional dependency not available');
    return null;
  }
}

// Type guards for optional dependencies
function isOptionalModuleAvailable(module: any): module is OptionalModuleType {
  return module && typeof module.someFunction === 'function';
}
```

### Strategies for Minimizing Bundle Size with Types

1. **Tree Shaking**
```typescript
// Import specific functions
import { combinations, permutations } from 'kombinatoricsjs';

// Avoid importing entire library
import * as kombinatorics from 'kombinatoricsjs'; // Less optimal
```

2. **Type-Only Imports**
```typescript
// Use type-only imports when possible
import type { Card, Hand } from './types';

// This prevents runtime imports
import { evaluateHand } from './evaluator';
import type { HandResult } from './types';
```

3. **External Dependencies**
```typescript
// rollup.config.js
export default {
  external: ['vue', 'lodash'],
  output: {
    globals: {
      vue: 'Vue',
      lodash: '_'
    }
  }
};
```

## Practical Examples

### Custom Declaration File Examples

**For untyped libraries:**
```typescript
// src/types/external.d.ts
declare module 'untyped-poker-library' {
  export interface Card {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    rank: string;
    value: number;
  }
  
  export interface Hand {
    cards: Card[];
    score: number;
    description: string;
  }
  
  export function evaluateHand(cards: Card[]): Hand;
  export function compareHands(hand1: Hand, hand2: Hand): number;
}
```

**For complex APIs:**
```typescript
// src/types/api.d.ts
interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface PokerEvaluationRequest {
  cards: string[];
  gameType: 'texas-holdem' | 'omaha' | 'seven-card';
}

interface PokerEvaluationResponse {
  hand: {
    rank: number;
    description: string;
    cards: string[];
  };
  odds: {
    win: number;
    tie: number;
    lose: number;
  };
}

declare module 'poker-api' {
  export function evaluate(request: PokerEvaluationRequest): Promise<APIResponse<PokerEvaluationResponse>>;
}
```

### Package.json Modifications for Type Dependencies

**Main library package.json:**
```json
{
  "name": "gamblingjs",
  "version": "0.0.1",
  "main": "dist/gamblingjs.umd.js",
  "module": "dist/gamblingjs.es5.js",
  "typings": "dist/types/gamblingjs.d.ts",
  "files": ["dist"],
  "dependencies": {
    "kombinatoricsjs": "^1.0.4"
  },
  "devDependencies": {
    "@types/node": "^24.7.2",
    "typescript": "^5.9.3",
    "vitest": "^3.2.4"
  },
  "peerDependencies": {
    "typescript": ">=5.0.0"
  }
}
```

**WebApp package.json:**
```json
{
  "name": "poker-hand-evaluator",
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "daisyui": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.5.0",
    "@vitejs/plugin-vue": "^4.4.0",
    "@vue/test-utils": "^2.4.0",
    "typescript": "^5.2.0",
    "vite": "^4.4.0",
    "vitest": "^4.0.2",
    "vue-tsc": "^3.1.1"
  }
}
```

### tsconfig.json Configurations for Type Resolution

**Main library tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "es2015",
    "moduleResolution": "node",
    "lib": ["es2016", "es2017", "esnext", "DOM"],
    "strict": true,
    "sourceMap": true,
    "declaration": true,
    "declarationDir": "dist/types",
    "outDir": "dist/lib",
    "typeRoots": ["node_modules/@types", "src/types"],
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@utils/*": ["src/utils/*"],
      "@variants/*": ["src/variants/*"],
      "kombinatoricsjs": ["src/lib/kombinatoricsjs/src/kombinatoricsjs"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

**WebApp tsconfig.json:**
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": false,
    "baseUrl": ".",
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
    "types": ["vite/client", "node"],
    "skipLibCheck": true
  }
}
```

### Common Issues and Solutions

**Issue 1: Module not found errors**
```typescript
// Problem: Cannot find module 'kombinatoricsjs'
import * as kombinatorics from 'kombinatoricsjs';

// Solution: Update tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "kombinatoricsjs": ["src/lib/kombinatoricsjs/src/kombinatoricsjs"]
    }
  }
}
```

**Issue 2: Type conflicts between @types packages**
```typescript
// Problem: Conflicting type definitions
// Solution: Use type assertions or module augmentation

// Option 1: Type assertion
import untypedModule from 'untyped-module';
const typedModule = untypedModule as TypedModule;

// Option 2: Module augmentation
declare module 'untyped-module' {
  interface ExtendedInterface {
    newProperty: string;
  }
}
```

**Issue 3: Missing global types**
```typescript
// Problem: Global variables not recognized
// Solution: Create global.d.ts

// src/types/global.d.ts
declare global {
  interface Window {
    __GAMBLING_JS_CONFIG__: {
      apiEndpoint: string;
      debug: boolean;
    };
  }
}

export {};
```

**Issue 4: Circular dependencies**
```typescript
// Problem: Circular dependency between modules
// Solution: Use type-only imports

// file1.ts
import type { TypeFromFile2 } from './file2';
export function function1(param: TypeFromFile2) {
  // Implementation
}

// file2.ts
import type { TypeFromFile1 } from './file1';
export function function2(param: TypeFromFile1) {
  // Implementation
}
```

This comprehensive dependency management approach ensures type safety while maintaining compatibility with existing dependencies in the gamblingjs project. The strategies outlined here can be applied to any JavaScript project undergoing TypeScript migration.
