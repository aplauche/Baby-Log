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
        handwriting: ["var(--font-caveat)", "var(--font-nunito)", "cursive"],
      },
      colors: {
        paper: "#F5F0E8",
        "paper-dark": "#EDE7D9",
        "paper-darker": "#E0D8C8",
        "ink": "#3d2a2a",
        "ink-faint": "#8a7070",
        "dusty-rose": "#F2B8C6",
        "sage": "#A8C5A0",
        "warm-yellow": "#F5DFA0",
        "lavender": "#C9BEF0",
      },
      boxShadow: {
        "paper": "2px 3px 8px rgba(100, 70, 50, 0.12), 0 1px 2px rgba(100, 70, 50, 0.08)",
        "paper-lg": "3px 5px 16px rgba(100, 70, 50, 0.15), 0 2px 4px rgba(100, 70, 50, 0.1)",
        "stamp": "1px 1px 0 rgba(100, 70, 50, 0.2), inset 0 1px 0 rgba(255,255,255,0.4)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        babylog: {
          // Primary: dusty rose — warm, nurturing, the brand anchor
          "primary": "#E8A0B4",
          "primary-content": "#4a1528",

          // Secondary: soft lavender — dreamy and calm
          "secondary": "#B8AEDD",
          "secondary-content": "#251645",

          // Accent: sage green — natural, grounding
          "accent": "#8BBF85",
          "accent-content": "#0d2b09",

          // Neutral: warm parchment-gray
          "neutral": "#9e9080",
          "neutral-content": "#f5f0e8",

          // Base palette: aged notebook paper tones
          "base-100": "#F5F0E8",   // warm off-white paper — main page background
          "base-200": "#EDE7D9",   // slightly deeper paper — sections, alternating rows
          "base-300": "#D9D0C0",   // aged paper border — dividers, borders
          "base-content": "#3d2a2a", // warm ink — easier on tired eyes

          // Semantic colors — muted, not neon
          "info": "#8BB8D4",
          "info-content": "#0e2b3d",
          "success": "#7DC4A0",
          "success-content": "#0d2e1c",
          "warning": "#E8C97A",
          "warning-content": "#3d2a00",
          "error": "#E8A0A0",
          "error-content": "#3d0a0a",

          // Rounded corners — soft and friendly
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--tab-radius": "0.5rem",
          "--border-btn": "1.5px",
        },
      },
    ],
  },
};

export default config;
