module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-side-effects-in-computed-properties': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.cjs',
    '*.mjs',
    'tests/**',
    'tailwind.config.js'
  ]
};
