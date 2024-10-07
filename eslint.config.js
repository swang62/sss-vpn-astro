import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    formatters: true,
    ignores: ["**/migrations/*", "node_modules/**/*"],
    stylistic: {
      quotes: "double",
      semi: true,
    },
  },
  {
    rules: {
      "no-console": ["off"],
      "style/arrow-parens": ["off"],
      "format/prettier": ["off"],
      "style/operator-linebreak": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": [
        "warn",
        {
          internalPattern: ["@/**"],
        },
      ],
    },
  },
);
