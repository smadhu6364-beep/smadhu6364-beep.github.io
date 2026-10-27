import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        peach: "rgb(var(--peach) / <alpha-value>)",
        lime: "rgb(var(--lime) / <alpha-value>)",
        dot: "rgb(var(--dot) / <alpha-value>)",
        navy: "rgb(var(--vt-navy) / <alpha-value>)",
        red: "#e8213b",
        sky: "rgb(var(--vt-sky) / <alpha-value>)",
        cream: "rgb(var(--vt-cream) / <alpha-value>)",
        slate: "rgb(var(--vt-slate) / <alpha-value>)",
        deep: "rgb(var(--vt-deep) / <alpha-value>)",
        card: "rgb(var(--vt-card) / <alpha-value>)",
        mist: "#e4eaf3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
