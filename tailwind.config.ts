import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:      "#0B1D3A",
          "navy-dark": "#071428",
          blue:      "#3BAEF7",
          "blue-dark": "#2A8FD7",
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
