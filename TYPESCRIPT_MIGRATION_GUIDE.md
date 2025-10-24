# TypeScript Migration Guide for gamblingjs

This guide provides a step-by-step approach for migrating the gamblingjs project from JavaScript to TypeScript, focusing on practical implementation strategies and best practices.

## Table of Contents

1. [Pre-Migration Preparation](#pre-migration-preparation)
2. [Migration Strategy](#migration-strategy)
3. [File-by-File Migration Process](#file-by-file-migration-process)
4. [Type Definition Creation](#type-definition-creation)
5. [Handling Third-Party Libraries](#handling-third-party-libraries)
6. [Testing During Migration](#testing-during-migration)
7. [Common Migration Issues](#common-migration-issues)
8. [Post-Migration Optimization](#post-migration-optimization)

## Pre-Migration Preparation

### 1. Code Analysis

Before starting the migration, analyze the existing codebase:

```bash
# Count JavaScript files
find src -name "*.js" | wc -l

# Identify complex files that need special attention
find src -name "*.js" -exec wc -l {} + | sort -nr | head -10

# Check for existing TypeScript files
find src -name "*.ts" | wc -l
```

### 2. Dependency Check

Verify that all dependencies have TypeScript support:

```bash
# Check for @types packages
npm list @types/* 2>/dev/null || echo "No @types packages found"

# Identify dependencies without types
npm ls --depth=0 | grep -E "^[└├]" | cut -d' ' -f2 | while read pkg; do
  if ! npm info "$pkg" types 2>/dev/null | grep -q "types"; then
    echo "$pkg may need type definitions"
  fi
done
```

### 3. Backup Strategy

Create a backup branch before migration:

```bash
git checkout -b feature/typescript-migration
git add .
git commit -m "Backup before TypeScript migration"
```

## Migration Strategy

### Phased Approach

1. **Phase 1: Setup Configuration**
   - Install TypeScript and configure tsconfig.json
   - Set up build tools and scripts
   - Configure ESLint and Prettier for TypeScript

2. **Phase 2: Core Infrastructure**
   - Migrate core interfaces and types
   - Create type definitions for external modules
   - Set up path mapping

3. **Phase 3: Library Migration**
   - Migrate core evaluator classes
   - Migrate utility functions
   - Migrate variant-specific code

4. **Phase 4: Test Migration**
   - Update test files to TypeScript
   - Ensure all tests pass

5. **Phase 5: Web Application**
   - Migrate Vue components
   - Update composables and stores
   - Migrate utility functions

### Incremental Migration Settings

Start with permissive settings and gradually enable stricter options:

#### Initial tsconfig.json (Permissive)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,
    "checkJs": false,
    "strict": false,
    "noImplicitAny": false,
    "outDir": "./dist",
    "sourceMap": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Progressive tsconfig.json (Medium Strictness)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "outDir": "./dist",
    "sourceMap": true,
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## File-by-File Migration Process

### 1. Identify Migration Order

Migrate files in dependency order:

1. **Constants and Enums** (`src/constants.ts`)
2. **Interfaces and Types** (`src/interfaces.ts`)
3. **Core Utilities** (`src/utils/`)
4. **Hash Creation** (`src/hashesCreator.ts`)
5. **Core Evaluators** (`src/core/`)
6. **Main Evaluators** (`src/pokerEvaluator*.ts`)
7. **Variants** (`src/variants/`)
8. **Main Library** (`src/gamblingjs.ts`)
9. **Index File** (`src/index.ts`)

### 2. Migration Template

For each JavaScript file, follow this pattern:

#### Before (JavaScript)

```javascript
// src/pokerEvaluator5.js
function evaluateHand(cards) {
  if (!cards || cards.length !== 5) {
    throw new Error('Invalid hand: must contain exactly 5 cards');
  }
  
  const ranks = cards.map(card => card.rank);
  const suits = cards.map(card => card.suit);
  
  // Evaluation logic...
  return {
    rank: 1,
    name: 'High Card',
    cards: cards
  };
}

module.exports = { evaluateHand };
```

#### After (TypeScript)

```typescript
// src/pokerEvaluator5.ts
import { Card, HandEvaluation } from './interfaces';

export function evaluateHand(cards: Card[]): HandEvaluation {
  if (!cards || cards.length !== 5) {
    throw new Error('Invalid hand: must contain exactly 5 cards');
  }
  
  const ranks: number[] = cards.map(card => card.rank);
  const suits: string[] = cards.map(card => card.suit);
  
  // Evaluation logic...
  return {
    rank: 1,
    name: 'High Card',
    cards: [...cards]
  };
}

export default { evaluateHand };
```

### 3. Type Annotation Strategy

#### Minimal Typing (Initial Phase)

```typescript
// Start with basic types
function evaluateHand(cards: any[]): any {
  // Implementation
}
```

#### Gradual Enhancement

```typescript
// Add more specific types
interface Card {
  rank: number;
  suit: string;
}

interface HandEvaluation {
  rank: number;
  name: string;
  cards: Card[];
}

function evaluateHand(cards: Card[]): HandEvaluation {
  // Implementation
}
```

## Type Definition Creation

### 1. Core Type Definitions

Create `src/types/index.ts`:

```typescript
// Card representation
export interface Card {
  rank: number; // 2-14 (2-Ace)
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  code?: string; // Optional string representation
}

// Hand evaluation result
export interface HandEvaluation {
  rank: number;
  name: string;
  description?: string;
  cards: Card[];
  highCard?: Card;
  kickers?: Card[];
}

// Game variants
export type GameVariant = 'texas-holdem' | 'omaha' | 'seven-card-stud' | 'five-card-draw';

// Evaluation options
export interface EvaluationOptions {
  variant?: GameVariant;
  numberOfCards?: number;
  communityCards?: Card[];
}
```

### 2. External Module Types

Create `src/types/external.d.ts` for modules without types:

```typescript
// For kombinatoricsjs library
declare module 'kombinatoricsjs' {
  export function combination(arr: any[], k: number): any[][];
  export function permutation(arr: any[], k?: number): any[][];
  export function cartesianProduct(...arrays: any[][]): any[][];
}

// For other untyped modules
declare module 'some-untyped-module' {
  export function someFunction(input: any): any;
  export const someValue: any;
}
```

### 3. Utility Types

Create `src/types/utils.ts`:

```typescript
// Branded types for type safety
export type CardCode = string & { readonly brand: unique symbol };
export type HandRank = number & { readonly brand: unique symbol };

// Helper types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Array manipulation types
export type NonEmptyArray<T> = [T, ...T[]];
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends readonly unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, readonly [T, ...R]>;
```

## Handling Third-Party Libraries

### 1. Libraries with Types

For libraries that already have TypeScript support:

```bash
# Install types if not already included
npm install --save-dev @types/node @types/jest @types/lodash
```

### 2. Libraries Without Types

For libraries without official type definitions:

#### Option A: Create Local Type Definitions

```typescript
// src/types/kombinatoricsjs.d.ts
declare module 'kombinatoricsjs' {
  export interface CombinationResult<T> {
    readonly items: readonly T[];
    readonly indices: readonly number[];
  }
  
  export function combination<T>(array: readonly T[], size: number): readonly CombinationResult<T>[];
  export function permutation<T>(array: readonly T[], size?: number): readonly T[][];
  export function cartesianProduct<T>(...arrays: readonly T[][]): readonly T[][];
}
```

#### Option B: Use DefinitelyTyped

```bash
# Search for existing types
npm search @types/kombinatoricsjs

# If found, install
npm install --save-dev @types/kombinatoricsjs
```

#### Option C: Use Dynamic Imports

```typescript
// For complex libraries where typing is difficult
async function loadKombinatorics() {
  const kombinatorics = await import('kombinatoricsjs');
  return kombinatorics as any;
}
```

## Testing During Migration

### 1. Test Configuration

Update `vitest.config.ts` for TypeScript:

```typescript
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
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@utils': resolve(__dirname, './src/utils'),
      '@variants': resolve(__dirname, './src/variants'),
    },
  },
});
```

### 2. Test Migration Strategy

#### Keep Tests Running

```bash
# Run tests after each file migration
npm run test:watch

# Run specific test files
npm run test -- pokerEvaluator5.test.ts
```

#### Test File Template

```typescript
// test/pokerEvaluator5.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateHand } from '../src/pokerEvaluator5';
import { Card } from '../src/interfaces';

describe('evaluateHand', () => {
  it('should evaluate a high card hand', () => {
    const cards: Card[] = [
      { rank: 2, suit: 'hearts' },
      { rank: 5, suit: 'diamonds' },
      { rank: 7, suit: 'clubs' },
      { rank: 9, suit: 'spades' },
      { rank: 12, suit: 'hearts' }
    ];
    
    const result = evaluateHand(cards);
    
    expect(result.rank).toBe(1);
    expect(result.name).toBe('High Card');
    expect(result.cards).toEqual(cards);
  });
  
  // More test cases...
});
```

## Common Migration Issues

### 1. Implicit Any Issues

#### Problem
```typescript
// Error: Parameter 'x' implicitly has an 'any' type
function processArray(arr) {
  return arr.map(x => x * 2);
}
```

#### Solution
```typescript
// Add explicit types
function processArray(arr: number[]): number[] {
  return arr.map((x: number) => x * 2);
}

// Or use generics
function processArray<T>(arr: T[], fn: (item: T) => T): T[] {
  return arr.map(fn);
}
```

### 2. Module Resolution Issues

#### Problem
```typescript
// Error: Cannot find module './utils' or its corresponding type declarations
import { helper } from './utils';
```

#### Solution
```typescript
// Ensure file extensions are correct
import { helper } from './utils/index';

// Or update tsconfig.json moduleResolution
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 3. Type Assertion Issues

#### Problem
```typescript
// Error: Type 'unknown' is not assignable to type 'Card'
const card = JSON.parse(jsonString) as Card;
```

#### Solution
```typescript
// Use type guards
function isCard(obj: any): obj is Card {
  return obj && 
         typeof obj.rank === 'number' && 
         typeof obj.suit === 'string' &&
         ['hearts', 'diamonds', 'clubs', 'spades'].includes(obj.suit);
}

const parsed = JSON.parse(jsonString);
const card = isCard(parsed) ? parsed : null;

// Or use validation library like zod
import { z } from 'zod';

const CardSchema = z.object({
  rank: z.number(),
  suit: z.enum(['hearts', 'diamonds', 'clubs', 'spades'])
});

const result = CardSchema.safeParse(JSON.parse(jsonString));
const card = result.success ? result.data : null;
```

## Post-Migration Optimization

### 1. Enable Strict Mode

Once migration is complete, enable all strict options:

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
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 2. Performance Optimization

#### Incremental Compilation

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

#### Project References

For large projects, split into multiple tsconfig files:

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

// src/core/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "../../dist/core"
  },
  "include": ["**/*.ts"]
}
```

### 3. Documentation Generation

Set up TypeDoc for API documentation:

```bash
npm install --save-dev typedoc
```

```json
{
  "scripts": {
    "docs": "typedoc --out docs src/index.ts"
  }
}
```

### 4. Continuous Integration

Update CI pipeline to include TypeScript checks:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Conclusion

This migration guide provides a comprehensive approach to transitioning the gamblingjs project from JavaScript to TypeScript. By following the phased approach and implementing the strategies outlined above, you can ensure a smooth migration while maintaining code quality and functionality.

Remember to:
1. Take incremental steps
2. Keep tests running throughout the process
3. Gradually increase type strictness
4. Document types and interfaces
5. Optimize for performance after migration

The end result will be a more maintainable, type-safe codebase that's easier to understand and less prone to runtime errors.
