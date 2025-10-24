# TypeScript Configuration Guide for gamblingjs

This guide provides comprehensive TypeScript configurations for migrating the gamblingjs project from JavaScript to TypeScript. It includes optimized configurations for different scenarios: library development, production builds, testing, and the Vue web application.

## Table of Contents

1. [Base Configuration (tsconfig.json)](#base-configuration)
2. [Production Build Configuration (tsconfig.build.json)](#production-build-configuration)
3. [Test Configuration (tsconfig.test.json)](#test-configuration)
4. [Web Application Configuration (tsconfig.webapp.json)](#web-application-configuration)
5. [Configuration Relationships](#configuration-relationships)
6. [Migration Recommendations](#migration-recommendations)
7. [Performance Optimizations](#performance-optimizations)

## Base Configuration (tsconfig.json)

The base configuration provides a solid foundation for the main gamblingjs library development.

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

### Key Configuration Options Explained

#### Target and Module Settings
- **target: "ES2020"**: Targets modern browsers with ES2020 features, providing a good balance between compatibility and modern JavaScript features.
- **module: "ESNext"**: Generates modern ES modules for better tree-shaking and bundling.
- **moduleResolution: "node"**: Uses Node.js module resolution algorithm, the standard for most JavaScript projects.
- **lib: ["ES2020", "DOM", "DOM.Iterable"]**: Includes type definitions for ES2020 features and DOM APIs needed for browser compatibility.

#### Output Configuration
- **outDir: "./dist"**: Specifies output directory for compiled JavaScript.
- **rootDir: "./src"**: Specifies root directory of input files.
- **declaration: true**: Generates .d.ts declaration files for TypeScript consumers.
- **declarationMap: true**: Generates source maps for declaration files.
- **sourceMap: true**: Generates source maps for debugging.
- **removeComments: false**: Preserves comments in output for better documentation.
- **importHelpers: true**: Uses tslib helper functions to reduce code duplication.

#### Type Checking
- **strict: true**: Enables all strict type checking options for maximum type safety.
- **noImplicitAny: true**: Raises error on expressions and declarations with an implied 'any' type.
- **strictNullChecks: true**: Strict null checking helps catch null and undefined errors.
- **exactOptionalPropertyTypes: true**: Ensures optional properties have exact types.
- **noUncheckedIndexedAccess: true**: Prevents undefined access when using indexed access.

#### Module Resolution
- **esModuleInterop: true**: Enables better interoperability between CommonJS and ES modules.
- **allowSyntheticDefaultImports: true**: Allows default imports from modules with no default export.
- **forceConsistentCasingInFileNames: true**: Ensures consistent casing in file imports.
- **resolveJsonModule: true**: Allows importing JSON files.
- **isolatedModules: true**: Ensures each file can be safely transpiled independently.

## Production Build Configuration (tsconfig.build.json)

This configuration extends the base configuration with optimizations for production builds.

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

### Production-Specific Optimizations

- **removeComments: true**: Removes comments from output to reduce bundle size.
- **sourceMap: false**: Disables source maps for production to reduce build size.
- **declarationMap: false**: Disables declaration source maps.
- **stripInternal: true**: Strips declarations marked as @internal.
- **noEmitOnError: true**: Prevents emitting files if any errors occur.
- **incremental: true**: Enables incremental compilation for faster builds.
- **tsBuildInfoFile**: Stores incremental compilation information.

## Test Configuration (tsconfig.test.json)

This configuration is optimized for testing environments with Vitest.

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

### Test-Specific Considerations

- **types: ["vitest/globals", "node"]**: Includes type definitions for Vitest globals and Node.js.
- **noImplicitAny: false**: Relaxed type checking for test files to allow more flexible testing.
- **noUnusedLocals: false**: Allows unused variables in test files for better readability.
- **noUnusedParameters: false**: Allows unused parameters in test files.
- **outDir: "./dist-test"**: Separate output directory for test compilation.

## Web Application Configuration (tsconfig.webapp.json)

This configuration is specifically tailored for the Vue.js web application.

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

### Vue.js-Specific Configuration

- **extends: "@vue/tsconfig/tsconfig.dom.json"**: Extends Vue's recommended DOM configuration.
- **moduleResolution: "bundler"**: Uses bundler-aware module resolution for Vite.
- **useDefineForClassFields: true**: Ensures compatibility with modern class field semantics.
- **allowImportingTsExtensions: true**: Allows importing TypeScript files with extensions.
- **jsx: "preserve"**: Preserves JSX syntax for Vue's template compiler.
- **vueCompilerOptions**: Vue-specific compiler options.

## Configuration Relationships

The TypeScript configurations follow a hierarchical structure:

```
tsconfig.json (Base)
├── tsconfig.build.json (Production Builds)
├── tsconfig.test.json (Test Environment)
└── tsconfig.webapp.json (Vue Web App)
```

### Inheritance Strategy

1. **Base Configuration (tsconfig.json)**: Contains common settings shared across all environments.
2. **Specialized Configurations**: Extend the base configuration and override specific options as needed.

### Usage Examples

```bash
# Build the library for production
npx tsc --project tsconfig.build.json

# Run tests with test configuration
npx vitest run --config tsconfig.test.json

# Build the web application
cd webapp && npx vue-tsc --project tsconfig.webapp.json
```

## Migration Recommendations

### Incremental Migration Strategy

1. **Start with Permissive Settings**
   ```json
   {
     "compilerOptions": {
       "allowJs": true,
       "checkJs": false,
       "strict": false
     }
   }
   ```

2. **Gradually Enable Strict Mode**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

3. **Enable Additional Checks**
   ```json
   {
     "compilerOptions": {
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "exactOptionalPropertyTypes": true
     }
   }
   ```

### File-by-File Migration

1. **Rename .js files to .ts** for files with minimal complexity
2. **Create .d.ts files** for existing JavaScript modules
3. **Use @ts-check comments** for gradual type checking in JavaScript files
4. **Implement type definitions** for external libraries without types

### Path Mapping Implementation

1. **Configure baseUrl and paths** in tsconfig.json
2. **Update import statements** to use path aliases
3. **Configure bundler aliases** to match TypeScript paths
4. **Update IDE settings** to recognize path mappings

## Performance Optimizations

### Compilation Speed

1. **Incremental Compilation**
   ```json
   {
     "compilerOptions": {
       "incremental": true,
       "tsBuildInfoFile": "./dist/.tsbuildinfo"
     }
   }
   ```

2. **Skip Type Checking for Dependencies**
   ```json
   {
     "compilerOptions": {
       "skipLibCheck": true,
       "skipDefaultLibCheck": true
     }
   }
   ```

3. **Project References**
   ```json
   {
     "compilerOptions": {
       "composite": true,
       "incremental": true
     },
     "references": [
       { "path": "./src/core" },
       { "path": "./src/utils" }
     ]
   }
   ```

### Memory Usage

1. **Limit Included Files**
   ```json
   {
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist", "**/*.test.ts"]
   }
   ```

2. **Use File-Based Exclusions**
   ```json
   {
     "exclude": [
       "node_modules",
       "dist",
       "**/*.spec.ts",
       "**/*.stories.ts",
       "**/*.dev.ts"
     ]
   }
   ```

### IDE Integration

1. **VS Code Settings**
   ```json
   {
     "typescript.preferences.includePackageJsonAutoImports": "on",
     "typescript.suggest.autoImports": true,
     "typescript.updateImportsOnFileMove.enabled": "always"
   }
   ```

2. **ESLint Integration**
   ```json
   {
     "extends": [
       "@typescript-eslint/recommended",
       "@typescript-eslint/recommended-requiring-type-checking"
     ]
   }
   ```

## Conclusion

This TypeScript configuration guide provides a comprehensive setup for the gamblingjs project that balances type safety with developer productivity. The modular approach allows for environment-specific optimizations while maintaining consistency across the codebase.

The configurations support:
- Modern JavaScript features with broad browser compatibility
- Strict type checking for improved code quality
- Efficient build processes for production
- Flexible testing environments
- Vue.js web application development

By following this guide, you can successfully migrate the gamblingjs project to TypeScript while maintaining performance and developer experience.
