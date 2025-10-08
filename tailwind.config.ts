import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#22d3ee",
          foreground: "#04131f",
        },
        surface: {
          DEFAULT: "#0f172a",
          muted: "#1e293b",
        },
      },
      boxShadow: {
        glow: "0 12px 40px -12px rgba(34, 211, 238, 0.45)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
