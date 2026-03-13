import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:      "#1a2a3a",
          "navy-dark": "#0f1c27",
          blue:      "#3eb5e5",
          "blue-dark": "#2a9fd4",
          "gray-bg": "#f5f5f5",
          "dark-text": "#333333",
          muted:     "#666666",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
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
