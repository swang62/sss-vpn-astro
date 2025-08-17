import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// parsers
const tsParser = tseslint.parser;
const astroParser = astro.parser;

export default defineConfig([
  // Global configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Base JS/TS configs
  js.configs.recommended,
  tseslint.configs.recommended,

  // Prettier config
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      // disable warnings, since prettier should format on save
      "prettier/prettier": "off",
    },
  },

  // Astro config
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        ecmaVersion: "latest",
        extraFileExtensions: [".astro"],
        parser: tsParser,
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },

  // perfectionist
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": "warn",
      "perfectionist/sort-objects": "warn",
    },
  },

  // Global ignore patterns
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: ["src/db/migrations/**/*", "node_modules/*", "public/*", ".github/*", "dist/*", "**/*.d.ts", "**/*.json", "**/*.sql"],
  },
]);
