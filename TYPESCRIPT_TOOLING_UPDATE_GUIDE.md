# TypeScript Development Tooling Update Guide

This comprehensive guide provides detailed instructions for updating development tools to ensure seamless TypeScript compatibility in the gamblingjs project and similar JavaScript projects transitioning to TypeScript.

## Table of Contents

1. [ESLint Configuration Updates for TypeScript](#eslint-configuration-updates-for-typescript)
2. [Prettier Configuration Guidelines](#prettier-configuration-guidelines)
3. [Editor/IDE Integration](#editoride-integration)
4. [Git Hooks and Pre-commit Tools](#git-hooks-and-pre-commit-tools)
5. [CI/CD Pipeline Updates](#cicd-pipeline-updates)
6. [Specific gamblingjs Tooling Challenges](#specific-gamblingjs-tooling-challenges)
7. [Tooling Migration Workflow](#tooling-migration-workflow)
8. [Practical Examples](#practical-examples)

---

## ESLint Configuration Updates for TypeScript

### Required ESLint Plugins and Parsers for TypeScript

To properly support TypeScript in ESLint, you need to install and configure the following packages:

```bash
# Install TypeScript ESLint dependencies
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# For Vue.js projects with TypeScript
npm install -D eslint-plugin-vue vue-eslint-parser

# For Prettier integration
npm install -D eslint-config-prettier eslint-plugin-prettier
```

### Configuring ESLint Rules for TypeScript-Specific Patterns

#### Basic ESLint Configuration for TypeScript

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier' // Must be last to override other configs
  ],
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    
    // General JavaScript rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
};
```

#### Advanced ESLint Configuration with Strict Type Checking

```javascript
// .eslintrc.js (Strict Configuration)
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  rules: {
    // Strict TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    
    // General rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
};
```

### Handling .js/.ts Mixed Codebases During Migration

For projects with both JavaScript and TypeScript files, configure ESLint to handle both:

```javascript
// .eslintrc.js (Mixed JS/TS Configuration)
module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'prettier'
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    },
    {
      files: ['*.js'],
      env: {
        node: true,
        es6: true
      },
      extends: ['eslint:recommended', 'prettier'],
      rules: {
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
      }
    }
  ],
  env: {
    node: true,
    es6: true
  },
  ignorePatterns: ['dist/', 'node_modules/']
};
```

### Integrating with Existing ESLint Configuration

To update an existing ESLint configuration for TypeScript:

1. **Backup your current configuration**
2. **Install TypeScript ESLint packages**
3. **Update parser and extends**
4. **Gradually add TypeScript-specific rules**
5. **Test with existing codebase**

```javascript
// Migration approach - start with basic TypeScript support
module.exports = {
  // Keep your existing configuration
  ...existingConfig,
  
  // Add TypeScript support
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ...existingConfig.parserOptions,
    project: './tsconfig.json'
  },
  plugins: [...(existingConfig.plugins || []), '@typescript-eslint'],
  extends: [
    ...(existingConfig.extends || []),
    '@typescript-eslint/recommended'
  ],
  
  // Override rules as needed
  rules: {
    ...existingConfig.rules,
    // Disable conflicting rules
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
```

### Specific Rules for Vue.js + TypeScript Projects

For Vue.js Single File Components with TypeScript:

```javascript
// .eslintrc.js (Vue + TypeScript)
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    // Vue-specific TypeScript rules
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits']
    }],
    'vue/no-unused-vars': 'error',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/prefer-import-from-vue': 'error'
  }
};
```

---

## Prettier Configuration Guidelines

### Configuring Prettier to Work with TypeScript

Create a `.prettierrc` configuration file:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "bracketSameLine": false,
  "proseWrap": "preserve"
}
```

### Handling TypeScript-Specific Formatting Scenarios

For TypeScript-specific formatting considerations:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "bracketSameLine": false,
  "proseWrap": "preserve",
  "overrides": [
    {
      "files": "*.ts",
      "options": {
        "parser": "typescript"
      }
    },
    {
      "files": "*.tsx",
      "options": {
        "parser": "typescript"
      }
    },
    {
      "files": "*.vue",
      "options": {
        "parser": "vue"
      }
    }
  ]
}
```

### Integrating Prettier with ESLint for TypeScript

To avoid conflicts between Prettier and ESLint:

1. **Install integration packages**:
```bash
npm install -D eslint-config-prettier eslint-plugin-prettier
```

2. **Configure ESLint to use Prettier**:
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    // ... other extends
    'prettier' // Must be last
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
};
```

### Formatting .vue Files with TypeScript Blocks

For Vue Single File Components with TypeScript:

```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue'
      }
    },
    {
      files: '*.ts',
      options: {
        parser: 'typescript'
      }
    }
  ]
};
```

---

## Editor/IDE Integration

### VS Code Configuration for TypeScript Development

Create a `.vscode/settings.json` file:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.quoteStyle": "single",
  "typescript.format.semicolons": "insert",
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": true,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": false,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": false,
  "typescript.format.insertSpaceAfterTypeAnnotation": false,
  "typescript.format.insertSpaceBeforeFunctionParenthesis": false,
  "typescript.format.placeOpenBraceOnNewLineForFunctions": false,
  "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false
}
```

### Recommended Extensions for TypeScript Development

Create a `.vscode/extensions.json` file:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-jest",
    "ZixuanChen.vitest-explorer"
  ]
}
```

### Configuring IntelliSense and Type Checking

Enhance TypeScript IntelliSense with additional configuration:

```json
// .vscode/settings.json (additional IntelliSense settings)
{
  "typescript.tsserver.experimental.enableProjectDiagnostics": true,
  "typescript.tsserver.maxTsServerMemory": 8192,
  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriorityPolling"
  },
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.includeAutomaticOptionalChainCompletions": true,
  "typescript.suggest.includeCompletionsForModuleExports": true,
  "typescript.workspaceSymbols.scope": "allOpenProjects"
}
```

### Setting Up Debugging for TypeScript

Configure VS Code debugging for TypeScript:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Current Test File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["run", "${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "test"
      }
    },
    {
      "name": "Debug All Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["run"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "test"
      }
    }
  ]
}
```

### Workspace Settings for Multi-Project Setups

For monorepos or multi-project setups:

```json
// .vscode/settings.json (multi-project)
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.workspaceSymbols.scope": "allOpenProjects",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.tsserver.experimental.enableProjectDiagnostics": true,
  "multiRoot.workspaceName": "gamblingjs",
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/coverage": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/coverage": true
  }
}
```

---

## Git Hooks and Pre-commit Tools

### Configuring Husky for TypeScript Projects

Install and configure Husky for Git hooks:

```bash
# Install Husky
npm install -D husky

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint-staged"

# Add commit-msg hook
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### Lint-staged Configuration for TypeScript Files

Configure `lint-staged` in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.vue": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### Pre-commit Type Checking

Add type checking to pre-commit hooks:

```bash
# .husky/pre-commit
#!/usr/sh
. "$(dirname "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run type check
npm run type-check
```

### Handling .vue Files in Git Hooks

For Vue.js projects with TypeScript:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.vue": [
      "vue-tsc --noEmit",
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

---

## CI/CD Pipeline Updates

### Integrating TypeScript Compilation in CI/CD

Update your CI configuration to include TypeScript compilation:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test:coverage
    
    - name: Build
      run: npm run build
```

### Type Checking as a Quality Gate

Make type checking a mandatory step in your CI pipeline:

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on:
  pull_request:
    branches: [ main ]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Format check
      run: npm run format:check
```

### Handling TypeScript in GitHub Actions

Optimize GitHub Actions for TypeScript projects:

```yaml
# .github/workflows/typescript.yml
name: TypeScript

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**/*.{ts,tsx}'
      - 'tsconfig.json'
      - 'package*.json'
  pull_request:
    branches: [ main ]
    paths:
      - 'src/**/*.{ts,tsx}'
      - 'tsconfig.json'
      - 'package*.json'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate types
      run: npm run type-check
    
    - name: Build
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
```

### Performance Considerations for CI Builds

Optimize CI performance for TypeScript projects:

```yaml
# .github/workflows/optimized-ci.yml
name: Optimized CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Cache TypeScript compilation
      uses: actions/cache@v3
      with:
        path: |
          .npm
          node_modules/.cache
          ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
    
    - name: Type check with incremental compilation
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test:coverage
```

---

## Specific gamblingjs Tooling Challenges

### Updating Existing .eslintrc.js for TypeScript

For the gamblingjs project, update the existing ESLint configuration:

```javascript
// Updated .eslintrc.js for gamblingjs
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],
  overrides: [
    {
      files: ['test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};
```

### Configuring TSLint to ESLint Migration

Since TSLint is deprecated, migrate from TSLint to ESLint:

1. **Install migration tools**:
```bash
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D tslint-to-eslint-config
```

2. **Run migration**:
```bash
npx tslint-to-eslint-config
```

3. **Manual adjustments**:
```javascript
// After migration, manually adjust the configuration
module.exports = {
  // Migrated configuration
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Map TSLint rules to ESLint equivalents
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    // Add any missing rules from TSLint
  }
};
```

### Handling TypeScript in the Vue Webapp Tooling

For the Vue.js webapp in gamblingjs:

```javascript
// webapp/.eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
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
    'no-var': 'error',
    // Vue-specific TypeScript rules
    'vue/require-explicit-emits': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase']
  }
};
```

### Integrating with Vitest for TypeScript Testing

Configure Vitest for TypeScript testing:

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
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*'
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

---

## Tooling Migration Workflow

### Step-by-Step Process for Updating Each Tool

#### Phase 1: Preparation
1. **Backup current configurations**
2. **Create a feature branch for migration**
3. **Update package.json with new dependencies**
4. **Install TypeScript and related packages**

#### Phase 2: ESLint Migration
1. **Install TypeScript ESLint packages**
2. **Update .eslintrc.js configuration**
3. **Run ESLint on existing code**
4. **Fix issues incrementally**
5. **Add TypeScript-specific rules gradually**

#### Phase 3: Prettier Integration
1. **Install Prettier and ESLint integration**
2. **Create .prettierrc configuration**
3. **Update ESLint to use Prettier**
4. **Format existing code**
5. **Set up pre-commit hooks**

#### Phase 4: Editor Configuration
1. **Update VS Code settings**
2. **Install recommended extensions**
3. **Configure debugging**
4. **Set up workspace settings**

#### Phase 5: CI/CD Updates
1. **Update CI configuration files**
2. **Add type checking to pipeline**
3. **Optimize build performance**
4. **Test pipeline changes**

### Validation Steps for Tooling Updates

#### ESLint Validation
```bash
# Check ESLint configuration
npx eslint --print-config src/index.ts

# Test on specific files
npx eslint src/**/*.ts

# Check for errors only
npx eslint src/**/*.ts --quiet
```

#### Prettier Validation
```bash
# Check formatting
npx prettier --check src/**/*.ts

# Test specific files
npx prettier --write src/index.ts

# Show differences
npx prettier --debug-check src/**/*.ts
```

#### TypeScript Validation
```bash
# Type check
npx tsc --noEmit

# Check specific files
npx tsc --noEmit src/index.ts

# Verbose output
npx tsc --noEmit --listFiles
```

### Handling Team Migration to New Tooling

#### Communication Strategy
1. **Announce migration plans in advance**
2. **Document changes and benefits**
3. **Provide migration timeline**
4. **Offer training sessions**

#### Gradual Rollout
1. **Start with a pilot group**
2. **Gather feedback and adjust**
3. **Roll out to entire team**
4. **Monitor adoption and issues**

#### Documentation Updates
1. **Update README files**
2. **Create migration guides**
3. **Document new workflows**
4. **Provide troubleshooting tips**

### Rollback Strategies if Issues Arise

#### Configuration Rollback
```bash
# Git rollback
git checkout HEAD~1 -- .eslintrc.js .prettierrc package.json

# NPM rollback
npm install package-lock.json
```

#### Gradual Reversion
1. **Identify problematic configurations**
2. **Disable specific rules**
3. **Revert to previous settings**
4. **Test thoroughly**

#### Emergency Procedures
1. **Maintain backup configurations**
2. **Have rollback scripts ready**
3. **Document emergency contacts**
4. **Plan for quick fixes**

---

## Practical Examples

### Complete .eslintrc.js Configurations for TypeScript

#### Basic TypeScript ESLint Configuration
```javascript
// .eslintrc.js (Basic TypeScript)
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  env: {
    node: true,
    es6: true
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
};
```

#### Strict TypeScript ESLint Configuration
```javascript
// .eslintrc.js (Strict TypeScript)
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  env: {
    node: true,
    es6: true
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js']
};
```

#### Vue.js + TypeScript ESLint Configuration
```javascript
// .eslintrc.js (Vue + TypeScript)
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'vue/require-explicit-emits': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits']
    }]
  }
};
```

### Prettier Configuration Files

#### Basic Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### Advanced Prettier Configuration with Overrides
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "bracketSameLine": false,
  "proseWrap": "preserve",
  "overrides": [
    {
      "files": "*.ts",
      "options": {
        "parser": "typescript"
      }
    },
    {
      "files": "*.tsx",
      "options": {
        "parser": "typescript"
      }
    },
    {
      "files": "*.vue",
      "options": {
        "parser": "vue"
      }
    },
    {
      "files": "*.json",
      "options": {
        "parser": "json",
        "trailingComma": "none"
      }
    },
    {
      "files": "*.md",
      "options": {
        "parser": "markdown",
        "proseWrap": "always",
        "printWidth": 100
      }
    }
  ]
}
```

### VS Code Settings.json Examples

#### Basic TypeScript VS Code Settings
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.quoteStyle": "single",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

#### Advanced VS Code Settings for TypeScript Projects
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.quoteStyle": "single",
  "typescript.format.semicolons": "insert",
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": true,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": false,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis": false,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces": false,
  "typescript.format.insertSpaceAfterTypeAnnotation": false,
  "typescript.format.insertSpaceBeforeFunctionParenthesis": false,
  "typescript.format.placeOpenBraceOnNewLineForFunctions": false,
  "typescript.format.placeOpenBraceOnNewLineForControlBlocks": false,
  "typescript.tsserver.experimental.enableProjectDiagnostics": true,
  "typescript.tsserver.maxTsServerMemory": 8192,
  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriorityPolling"
  },
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.includeAutomaticOptionalChainCompletions": true,
  "typescript.suggest.includeCompletionsForModuleExports": true,
  "typescript.workspaceSymbols.scope": "allOpenProjects",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false,
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/coverage": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/coverage": true
  }
}
```

### GitHub Actions Workflow Examples

#### Basic TypeScript CI Workflow
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test:coverage
    
    - name: Build
      run: npm run build
```

#### Advanced TypeScript CI Workflow with Caching
```yaml
# .github/workflows/advanced-ci.yml
name: Advanced CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Cache TypeScript compilation
      uses: actions/cache@v3
      with:
        path: |
          .npm
          node_modules/.cache
          ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Format check
      run: npm run format:check
    
    - name: Test
      run: npm run test:coverage
    
    - name: Build
      run: npm run build
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
```

#### Vue.js + TypeScript CI Workflow
```yaml
# .github/workflows/vue-typescript-ci.yml
name: Vue TypeScript CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm run test:coverage
    
    - name: Build
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
```

---

## Conclusion

This comprehensive guide provides all the necessary information to update development tools for TypeScript compatibility in the gamblingjs project and similar JavaScript projects. By following these guidelines, you can ensure a smooth transition to TypeScript while maintaining code quality and developer productivity.

The key takeaways are:

1. **Gradual Migration**: Update tools incrementally to avoid disruption
2. **Configuration Consistency**: Ensure all tools work together harmoniously
3. **Team Collaboration**: Involve the team in the migration process
4. **Continuous Improvement**: Regularly review and update configurations
5. **Documentation**: Keep documentation up-to-date with changes

Remember that tooling configuration is an ongoing process that evolves with your project's needs. Regular reviews and updates will ensure your development environment remains efficient and effective.
