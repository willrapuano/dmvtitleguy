import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /**
         * The legacy "brand-blue" scale, remapped onto Capital Standard so every
         * hard-coded use lands in the new palette. Contrast roles are preserved:
         *
         *   50–200   fog / line tints for backgrounds and borders
         *   300–500  brass: decorative, and text on navy (#C5A25D on #0B2742 is 6.1:1)
         *   600–800  navy ink: body text and solid fills on white
         */
        "brand-blue": {
          50:  "#F4F7F8",
          100: "#E7EDF1",
          200: "#D7E0E5",
          300: "#D9C08A",
          400: "#C5A25D",
          500: "#A98844",
          600: "#17354D",
          700: "#0B2742",
          800: "#071C30",
        },
        brand: {
          navy:      "#0B2742",
          "navy-dark": "#071C30",
          brass:     "#C5A25D",
          "brass-dark": "#A98844",
          line:      "#D7E0E5",
          /* Former bright blue: now brass, used as an accent and as text on navy. */
          blue:      "#C5A25D",
          "blue-dark": "#A98844",
          /* AA-compliant (5.5:1) accent for small text on white — the lighter
             brand blues only clear 3:1 and fail for body-size copy. */
          "blue-deep": "#0B2742",
          /* Solid buttons are navy now; white on #0B2742 measures 14.9:1. */
          action:      "#0B2742",
          "action-dark": "#17354D",
          /* Body copy in ink, not grey: #17354D on white is 12.4:1. */
          ink:         "#17354D",
          "ink-light": "#536C7C",
          green:     "#F4F7F8",
          blush:     "#F4F7F8",
          "gray-bg": "#F4F7F8",
          "dark-text": "#0B2742",
          muted:     "#536C7C",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      /* Square edges everywhere; rounded-full is kept for avatars and dots. */
      borderRadius: {
        none: "0", sm: "0", DEFAULT: "0", md: "0", lg: "0", xl: "0", "2xl": "0", "3xl": "0", full: "9999px",
      },
      /* No drop shadows: separation comes from rules and fills. */
      boxShadow: {
        sm: "none", DEFAULT: "none", md: "none", lg: "none", xl: "none", "2xl": "none", inner: "none", none: "none",
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
