const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  darkMode: ["class"],
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
  theme: {
    container: {
      screens: {
        xl: "1280px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "accent": {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        "background": "var(--background)",
        "border": "var(--border)",
        "card": {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        "chart": {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        "destructive": {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        "foreground": "var(--foreground)",
        "input": "var(--input)",
        "muted": {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        "popover": {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        "primary": {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        "primary-link": {
          DEFAULT: "var(--primary-link)",
          foreground: "var(--primary-foreground)",
        },
        "ring": "var(--ring)",
        "secondary": {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        "secondary-link": {
          DEFAULT: "var(--secondary-link)",
          foreground: "var(--secondary-foreground)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
    fontFamily: {
      heading: ["calsans", ...fontFamily.sans],
      mono: ["Menlo", "Monaco", "Consolas", ...fontFamily.mono],
      sans: ["inter", ...fontFamily.sans],
      serif: [...fontFamily.serif],
    },
  },

};
