import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Warnings - address over time, not blockers
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-expressions": "warn",
      "svelte/prefer-svelte-reactivity": "warn",
      "svelte/require-each-key": "warn",
      "svelte/no-dom-manipulating": "warn",
      "svelte/no-unused-svelte-ignore": "warn",
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    // Svelte 5 runes files (.svelte.ts) need TypeScript parser
    files: ["**/*.svelte.ts"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: null, // Disable type-aware linting for these files
      },
    },
  },
  {
    // DAUI rule: Pages must be pure data - no Svelte component imports
    // Blocks: ui/atoms/*.svelte, ui/molecules/*.svelte, ui/organisms/*.svelte
    // Allows: stores/*.svelte.ts (Svelte 5 runes - imported as .svelte)
    files: ["src/pages/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/ui/atoms/**", "**/ui/molecules/**", "**/ui/organisms/**"],
              message: "Page files must be pure data. Do not import Svelte components.",
            },
          ],
        },
      ],
    },
  },
  {
    // Allow @ts-nocheck for Motion Canvas experimental files
    files: ["src/animations/**", "src/MotionCanvasTest.svelte"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    ignores: ["dist/", "node_modules/", ".svelte-kit/"],
  }
);
