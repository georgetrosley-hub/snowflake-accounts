import type { Config } from "tailwindcss";

const cssColor = (variableName: string) => `rgb(var(${variableName}) / <alpha-value>)`;

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
          DEFAULT: cssColor("--surface"),
          elevated: cssColor("--surface-elevated"),
          muted: cssColor("--surface-muted"),
          border: cssColor("--surface-border"),
          divider: cssColor("--surface-divider"),
        },
        text: {
          primary: cssColor("--text-primary"),
          secondary: cssColor("--text-secondary"),
          muted: cssColor("--text-muted"),
          faint: cssColor("--text-faint"),
        },
        accent: {
          DEFAULT: cssColor("--accent"),
          muted: cssColor("--accent-muted"),
          subtle: cssColor("--accent-subtle"),
          glow: "rgb(var(--accent) / 0.12)",
        },
        databricks: {
          orange: cssColor("--accent"),
          "orange-light": "#FF6B4D",
          "orange-dark": "#CC2B1A",
          teal: "#1B3139",
          "teal-muted": "#2D4A54",
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
        lg: "12px",
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(255, 54, 33, 0.08)",
        "glow-md": "0 0 24px rgba(255, 54, 33, 0.12)",
        "elevated": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
