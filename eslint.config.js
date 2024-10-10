import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    formatters: true,
    ignores: ["**/migrations/*", "node_modules/**/*"],
    settings: {
      "vitest-globals/env": true
    },
    stylistic: {
      quotes: "double",
      semi: true,
    }
  },
  {
    rules: {
      "antfu/no-top-level-await": ["off"],
      "no-console": ["off"],
      "perfectionist/sort-imports": ["warn", { internalPattern: ["@/**"] }],
      "perfectionist/sort-objects": ["warn"],
      "style/comma-dangle": ["off"],
      "yaml/sort-keys": ["warn"]
    }
  }
);
