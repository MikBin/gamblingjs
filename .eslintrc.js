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
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    // Relaxations to align with existing codebase patterns
    // TypeScript-specific rules
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'off',

    // General JavaScript rules
    'prefer-const': 'off',
    'no-var': 'off',
    'no-console': 'off',
    'no-case-declarations': 'off',
    'no-unused-vars': 'off'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js', 'src/lib/**', 'test/**']
};
