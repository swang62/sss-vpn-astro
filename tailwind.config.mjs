/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [],
  theme: {
    extend: {},
    fontFamily: {
      "roboto": ["Roboto"],
      "roboto-regular": ["Roboto Regular"],
      "roboto-serif": ["Roboto Serif"],
      "roboto-thin": ["Roboto Condensed"],
    },
  },
};
