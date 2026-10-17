import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        carbon: { 950: "#07090b", 900: "#0d1114", 800: "#151b20", 700: "#1f272e", 600: "#2c363f" },
        papaya: { DEFAULT: "#ff7a1a", soft: "#ffb27a" },
        teal: { DEFAULT: "#14b8a6", deep: "#0b5f63" },
        kerb: "#e10600",
        chalk: "#f4f1ea",
        mute: "#a3adb6",
      },
      fontFamily: {
        display: ['"Titillium Web"', "system-ui", "sans-serif"],
        cond: ['"Barlow Condensed"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
