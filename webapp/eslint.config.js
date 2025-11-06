
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: [
        "dist/*",
        "node_modules/*",
        "*.cjs",
        "*.mjs",
        "tests/**",
        "tailwind.config.js"
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "vue/multi-word-component-names": "warn",
      "vue/no-side-effects-in-computed-properties": "warn",
    },
  },
];
