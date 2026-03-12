import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#161412",
          elevated: "#1e1c19",
          muted: "#282522",
          border: "#352f2a",
          divider: "#2c2824",
        },
        text: {
          primary: "#f3f0eb",
          secondary: "#b8b2a9",
          muted: "#6e6860",
          faint: "#524d47",
        },
        accent: {
          DEFAULT: "#c4b59a",
          muted: "#9a8f7a",
          subtle: "#5c5548",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        tight: "-0.02em",
        relaxed: "0.01em",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
