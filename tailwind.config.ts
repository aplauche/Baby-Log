import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        babylog: {
          // Primary: soft rose-pink — warm, nurturing, the brand anchor
          "primary": "#F9A8C9",
          "primary-content": "#5c1f36",

          // Secondary: warm lavender — dreamy and calm
          "secondary": "#C4B5FD",
          "secondary-content": "#2e1a5c",

          // Accent: soft mint — fresh contrast for highlights
          "accent": "#6EE7B7",
          "accent-content": "#0d3d2a",

          // Neutral: warm mid-gray (not cool/blue-gray)
          "neutral": "#a89fa8",
          "neutral-content": "#fdf6f0",

          // Base palette: warm creamy whites, not cold clinical whites
          "base-100": "#fdf6f0",   // warm cream — main page background
          "base-200": "#faeee6",   // slightly warmer — card / section backgrounds
          "base-300": "#f0ddd1",   // warm light peach — borders, dividers
          "base-content": "#3d2a2a", // warm near-black for text — easier on tired eyes

          // Semantic colors
          "info": "#93C5FD",
          "info-content": "#1e3a5f",
          "success": "#86EFAC",
          "success-content": "#14532d",
          "warning": "#FCD34D",
          "warning-content": "#451a03",
          "error": "#FCA5A5",
          "error-content": "#450a0a",

          // Rounded corners — friendly, not sharp
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
          "--rounded-badge": "1.9rem",
          "--tab-radius": "0.6rem",
        },
      },
    ],
  },
};

export default config;
