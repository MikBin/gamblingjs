# TypeScript Configuration Examples for gamblingjs

This document contains the actual TypeScript configuration files that can be used with the gamblingjs project. These configurations are designed to work together and provide optimal settings for different scenarios.

## Base Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    // Target and Module Settings
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // Output Configuration
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "importHelpers": true,
    
    // Type Checking
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
    "noImplicitOverride": true,
    
    // Module Resolution
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // Advanced Options
    "skipLibCheck": true,
    "allowJs": true,
    "checkJs": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    
    // Path Mapping
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@utils/*": ["src/utils/*"],
      "@variants/*": ["src/variants/*"],
      "@lib/*": ["src/lib/*"]
    }
  },
  "include": [
    "src/**/*",
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "test/**/*"
  ]
}
```

## Production Build Configuration (tsconfig.build.json)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    // Optimized Output Settings
    "removeComments": true,
    "sourceMap": false,
    "declaration": true,
    "declarationMap": false,
    
    // Stripping Type Information
    "stripInternal": true,
    "noEmitOnError": true,
    
    // Performance Optimizations
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo",
    
    // Module Resolution for Bundling
    "module": "ESNext",
    "target": "ES2020"
  },
  "include": [
    "src/**/*",
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "test/**/*",
    "src/**/*.stories.ts",
    "src/**/*.dev.ts"
  ]
}
```

## Test Configuration (tsconfig.test.json)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    // Test Environment Settings
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "types": ["vitest/globals", "node"],
    
    // Relaxed Type Checking for Tests
    "strict": true,
    "noImplicitAny": false,
    "strictNullChecks": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    
    // Source Maps for Test Debugging
    "sourceMap": true,
    "inlineSourceMap": false,
    
    // Output Configuration
    "outDir": "./dist-test",
    "rootDir": "./",
    
    // Test-Specific Settings
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*",
    "src/**/*.ts",
    "test/**/*",
    "test/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "dist-test"
  ]
}
```

## Web Application Configuration (tsconfig.webapp.json)

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    // Vue.js Specific Settings
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true,
    
    // Path Mapping for Clean Imports
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
    
    // Type Checking
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
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // Module Resolution
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    
    // Vue-Specific Options
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    
    // Additional Types
    "types": ["vite/client", "node"]
  },
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "exclude": [
    "src/**/__tests__/*",
    "dist",
    "node_modules"
  ],
  "vueCompilerOptions": {
    "target": 3.3
  }
}
```

## Implementation Instructions

### For the Main Library

1. Replace the existing `tsconfig.json` with the base configuration above.
2. Create `tsconfig.build.json` for production builds.
3. Create `tsconfig.test.json` for testing.

### For the Web Application

1. Replace the existing `webapp/tsconfig.json` with the webapp configuration above.
2. Ensure the Vite configuration matches the path mappings in the TypeScript config.

### Build Script Updates

Update your package.json scripts to use the appropriate configurations:

```json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json && rollup -c rollup.config.js",
    "build:lib": "tsc --project tsconfig.json",
    "test": "vitest run --config tsconfig.test.json",
    "test:watch": "vitest watch --config tsconfig.test.json"
  }
}
```

### Web Application Build Script

Update the webapp package.json scripts:

```json
{
  "scripts": {
    "build": "vue-tsc --project tsconfig.webapp.json && vite build",
    "type-check": "vue-tsc --project tsconfig.webapp.json --noEmit"
  }
}
```

## Migration Steps

1. **Backup existing configurations** before making changes.
2. **Update the base configuration** first and ensure it compiles.
3. **Add specialized configurations** one at a time.
4. **Update build scripts** to use the new configurations.
5. **Test thoroughly** to ensure everything works as expected.

## Notes

- These configurations assume TypeScript 5.0+ for the latest features.
- The webapp configuration requires @vue/tsconfig package.
- Path mappings should be mirrored in your bundler configuration.
- Incremental compilation is enabled for faster builds in production.
