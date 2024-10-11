import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    formatters: true,
    ignores: [
      "**/migrations/*",
      "**/node_modules/*",
      "**/Scripts*",
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
      "no-console": ["off"],
      "perfectionist/sort-imports": ["warn", { internalPattern: ["@/**"] }],
      "perfectionist/sort-objects": ["warn"],
      "style/arrow-parens": ["off"],
      "style/operator-linebreak": ["off"],
      "ts/consistent-type-definitions": ["off"],
      "yaml/sort-keys": ["warn"],
    },
  },
);
