import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    formatters: true,
    ignores: ["**/migrations/*", "node_modules/**/*", "**/Scripts*"],
    settings: {
      "vitest-globals/env": true
    },
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    typescript: true
  },
  {
    rules: {
      "antfu/no-top-level-await": ["off"],
      "format/prettier": ["off"],
      "no-console": ["off"],
      "perfectionist/sort-imports": ["warn", { internalPattern: ["@/**"] }],
      "perfectionist/sort-objects": ["warn"],
      "style/comma-dangle": ["off"],
      "yaml/sort-keys": ["warn"]
    }
  }
);
