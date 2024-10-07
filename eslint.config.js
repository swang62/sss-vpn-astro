import antfu from "@antfu/eslint-config";

export default antfu(
  {
    astro: true,
    formatters: true,
    ignores: ["**/migrations/*", "node_modules/**/*", "*.config.js"],
    stylistic: {
      quotes: "double",
      semi: true,
    },
  },
  {
    rules: {
      "style/comma-dangle": ["off"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": [
        "error",
        {
          internalPattern: ["@/**"],
        },
      ],
    },
  }
);
