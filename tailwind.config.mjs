/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  plugins: [],
  theme: {
    extend: {},
    fontFamily: {
      mono: [...defaultTheme.fontFamily.mono],
      sans: ["Roboto Regular", ...defaultTheme.fontFamily.sans],
      serif: ["Roboto", ...defaultTheme.fontFamily.serif],
    },
  },

};
