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
      "perfectionist/sort-imports": ["warn", { internalPattern: ["@/**"] }],
      "style/comma-dangle": ["off"],
    },
  }
);
