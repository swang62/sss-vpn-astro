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
      "format/prettier": ["off"],
      "no-console": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": ["warn", { internalPattern: ["@/**"] }],
      "style/arrow-parens": ["off"],
      "style/indent-binary-ops": ["off"],
      "style/comma-dangle": ["off"],
      "style/operator-linebreak": ["off"],
    },
  }
);
