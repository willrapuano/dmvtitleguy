import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * One blue ramp with documented contrast roles. #3BAEF7 is the historic
         * brand blue, but it measures 2.45:1 against both white text and a white
         * background — it cannot carry text in either direction. Steps 600+ are
         * the ones safe for body copy and for solid buttons.
         *
         *   400 #3BAEF7  decorative only, or text on navy
         *   500 #2A8FD7  3.5:1 — large text / borders / icons on light
         *   600 #1B6FA8  5.5:1 — body text on white, and white text on it
         *   700 #155A87  7.5:1 — hover state for 600
         */
        "brand-blue": {
          50:  "#F0F8FE",
          100: "#DBEEFC",
          200: "#B9DDF9",
          300: "#8AC7F5",
          400: "#3BAEF7",
          500: "#2A8FD7",
          600: "#1B6FA8",
          700: "#155A87",
          800: "#0F4568",
        },
        brand: {
          navy:      "#0B1D3A",
          "navy-dark": "#071428",
          blue:      "#3BAEF7",
          "blue-dark": "#2A8FD7",
          /* AA-compliant (5.5:1) accent for small text on white — the lighter
             brand blues only clear 3:1 and fail for body-size copy. */
          "blue-deep": "#1B6FA8",
          /* Action color for solid buttons: white on it measures 5.5:1. */
          action:      "#1B6FA8",
          "action-dark": "#155A87",
          /* Body copy. The old #555 sat at 7.4:1 but read flat next to navy. */
          ink:         "#334155",
          "ink-light": "#64748B",
          green:     "#D5EDE5",
          blush:     "#F5E6E8",
          "gray-bg": "#f7f8fa",
          "dark-text": "#1a1a2e",
          muted:     "#555555",
        },
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: { xl: "1200px" },
      },
    },
  },
  plugins: [],
};

export default config;
