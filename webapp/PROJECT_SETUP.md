# Vue.js Poker Hand Evaluator - Project Setup Guide

## Initial Setup Commands

### 1. Create Project Directory Structure

```bash
# Create the main WebApp directory
mkdir WebApp
cd WebApp

# Create subdirectories
mkdir -p src/{components,composables,stores,types,utils,views,assets}
mkdir -p public/assets/cards
mkdir -p tests/{unit,integration,e2e}
mkdir -p .github/workflows
mkdir -p src/workers
```

### 2. Initialize Vue.js Project with Vite

```bash
# Initialize npm project
npm init -y

# Install Vue.js 3 and TypeScript
npm install vue@^3.3.0
npm install -D @vitejs/plugin-vue typescript vite @vue/tsconfig

# Install Vue Router and Pinia
npm install vue-router@^4.2.0 pinia@^2.1.0

# Install DaisyUI and Tailwind CSS
npm install daisyui@^4.0.0 tailwindcss@^3.3.0
npm install -D @tailwindcss/typography autoprefixer postcss

# Install development dependencies
npm install -D @vue/test-utils vitest jsdom @types/node
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier
```

### 3. Update package.json Scripts

```json
{
  "name": "poker-hand-evaluator",
  "version": "1.0.0",
  "description": "Interactive poker hand evaluator using Vue.js and DaisyUI",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "daisyui": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.4.0",
    "typescript": "^5.2.0",
    "vite": "^4.4.0",
    "@vue/tsconfig": "^0.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@vue/test-utils": "^2.4.0",
    "vitest": "^0.34.0",
    "jsdom": "^22.1.0",
    "@types/node": "^20.5.0",
    "eslint": "^8.47.0",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "@typescript-eslint/parser": "^6.4.0",
    "eslint-plugin-vue": "^9.17.0",
    "prettier": "^3.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0"
  }
}
```

## Configuration Files

### 1. Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
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
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['daisyui']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
```

### 2. TypeScript Configuration (`tsconfig.json`)

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
    "composite": true,
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
    },
    "types": [
      "vite/client"
    ]
  }
}
```

### 3. Vue TypeScript Configuration (`tsconfig.node.json`)

```json
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*"
  ],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

### 4. Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        poker: {
          green: '#047857',
          red: '#dc2626',
          black: '#000000',
          white: '#ffffff',
          felt: '#0a4d3c',
          gold: '#fbbf24'
        }
      },
      animation: {
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'card-deal': 'cardDeal 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' }
        },
        cardDeal: {
          '0%': { 
            transform: 'translateY(-100px) rotate(180deg)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1'
          }
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      {
        poker: {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          "secondary": "#10b981",
          "secondary-focus": "#059669",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          "neutral": "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
        "poker-dark": {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          "secondary": "#10b981",
          "secondary-focus": "#059669",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          "neutral": "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#1d232a",
          "base-200": "#191e24",
          "base-300": "#15191e",
          "base-content": "#a6adba",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        }
      },
      "light",
      "dark"
    ],
    darkTheme: "poker-dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root"
  }
}
```

### 5. PostCSS Configuration (`postcss.config.js`)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 6. ESLint Configuration (`.eslintrc.cjs`)

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

### 7. Prettier Configuration (`.prettierrc.json`)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### 8. Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
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
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
});
```

### 9. Environment Types (`env.d.ts`)

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Basic File Structure

### 1. Main HTML File (`index.html`)

```html
<!DOCTYPE html>
<html lang="en" data-theme="poker">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Poker Hand Evaluator</title>
    <meta name="description" content="Interactive poker hand evaluator using Vue.js and DaisyUI" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 2. Main TypeScript Entry Point (`src/main.ts`)

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
```

### 3. Global Styles (`src/style.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply bg-base-100 text-base-content;
  }
}

@layer components {
  .card-container {
    @apply relative inline-block transition-all duration-300 ease-in-out;
  }
  
  .card-selected {
    @apply ring-4 ring-primary ring-offset-2 rounded-lg;
  }
  
  .card-hover:hover {
    @apply transform -translate-y-2 shadow-2xl;
  }
  
  .poker-table {
    @apply bg-poker-felt rounded-3xl shadow-2xl border-4 border-amber-900;
  }
  
  .hand-strength-meter {
    @apply w-full bg-gray-200 rounded-full h-4 overflow-hidden;
  }
  
  .hand-strength-fill {
    @apply h-full transition-all duration-500 ease-out;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .glass-effect {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }
}
```

### 4. Router Configuration (`src/router/index.ts`)

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/evaluator',
      name: 'evaluator',
      component: () => import('@views/EvaluatorView.vue')
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: () => import('@views/DocumentationView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
```

### 5. Type Definitions (`src/types/poker.ts`)

```typescript
import type { GameVariant } from '../../../gamblingjs/src/PokerEvaluator';
import type { verboseHandInfo, handCategoryDistribution } from '../../../gamblingjs/src/interfaces';

export interface Card {
  index: number;
  rank: string;
  suit: string;
  color: 'red' | 'black';
}

export interface HandEvaluation {
  handRank: number;
  handName: string;
  handStrength: number;
  winningCards: number[];
  description: string;
}

export interface SimulationSettings {
  numRuns: number;
  numOpponents: number;
  opponentRange: 'random' | 'tight' | 'loose' | 'custom';
  calculateEquity: boolean;
  calculateOuts: boolean;
}

export interface SimulationResult {
  winProbability: number;
  tieProbability: number;
  loseProbability: number;
  equity: number;
  handStrength: number;
  outs: OutsResult[];
  handDistribution: handCategoryDistribution;
}

export interface OutsResult {
  handType: string;
  count: number;
  probability: number;
}

export interface EvaluationRecord {
  id: string;
  timestamp: Date;
  gameVariant: GameVariant;
  pocketCards: number[];
  communityCards: number[];
  result: verboseHandInfo;
  notes?: string;
}

export interface GameStage {
  stage: 'preflop' | 'flop' | 'turn' | 'river';
  communityCardsRequired: number;
}
```

## Card Assets Setup

### 1. Card Image Organization

Create the following directory structure in `public/assets/cards/`:

```
public/assets/cards/
├── backs/
│   ├── blue.png
│   ├── red.png
│   └── green.png
├── svg/
│   ├── AS.svg (Ace of Spades)
│   ├── AH.svg (Ace of Hearts)
│   ├── AD.svg (Ace of Diamonds)
│   ├── AC.svg (Ace of Clubs)
│   ├── ... (all 52 cards)
└── png/
    ├── AS.png
    ├── AH.png
    ├── AD.png
    ├── AC.png
    ├── ... (all 52 cards)
```

### 2. Card Utility Functions (`src/utils/cardUtils.ts`)

```typescript
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS = ['♠', '♥', '♦', '♣'];
export const SUIT_NAMES = ['spades', 'hearts', 'diamonds', 'clubs'];

export function getCardFromIndex(index: number): Card {
  const rank = RANKS[index % 13];
  const suitIndex = Math.floor(index / 13);
  const suit = SUITS[suitIndex];
  const color = suitIndex === 1 || suitIndex === 2 ? 'red' : 'black';
  
  return {
    index,
    rank,
    suit,
    color
  };
}

export function getCardImagePath(cardIndex: number, format: 'png' | 'svg' = 'png'): string {
  const card = getCardFromIndex(cardIndex);
  const rankFile = card.rank === '10' ? 'T' : card.rank;
  const suitFile = SUIT_NAMES[Math.floor(cardIndex / 13)].charAt(0).toUpperCase();
  
  return `/assets/cards/${format}/${rankFile}${suitFile}.${format}`;
}

export function getCardBackPath(color: 'blue' | 'red' | 'green' = 'blue'): string {
  return `/assets/cards/backs/${color}.png`;
}

export function formatCardString(cardIndex: number): string {
  const card = getCardFromIndex(cardIndex);
  return `${card.rank}${card.suit}`;
}

export function validateCardSelection(cards: number[]): { isValid: boolean; error?: string } {
  if (cards.length > 7) {
    return { isValid: false, error: 'Cannot select more than 7 cards' };
  }
  
  const uniqueCards = new Set(cards);
  if (uniqueCards.size !== cards.length) {
    return { isValid: false, error: 'Duplicate cards selected' };
  }
  
  if (cards.some(card => card < 0 || card > 51)) {
    return { isValid: false, error: 'Invalid card index' };
  }
  
  return { isValid: true };
}
```

This setup guide provides all the necessary configuration files and basic structure to get started with the Vue.js poker hand evaluator application. The next step would be to implement the actual components and views as outlined in the technical specification.
