import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    formatters: true,
    ignores: [
      "**/migrations/*",
      "**/node_modules/*",
      "**/Analytics*",
      "**/404*",
      "**/.github/*",
    ],
    settings: {
      "vitest-globals/env": true,
    },
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
  },
  {
    rules: {
      "antfu/if-newline": ["off"],
      "format/prettier": ["off"],
      "jsonc/sort-keys": ["off"],
      "no-console": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": ["warn", { internalPattern: ["@/**"] }],
      "perfectionist/sort-objects": ["warn"],
      "style/arrow-parens": ["off"],
      "style/operator-linebreak": ["off"],
      "ts/consistent-type-definitions": ["off"],
      "yaml/sort-keys": ["warn"],
    },
  },
);
