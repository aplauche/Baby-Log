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
        "hot-pink": "#FF6EB4",
        "sky-blue": "#5BC4FF",
        "sunny": "#FFE566",
        "navy": "#1a1a2e",
        "lavender-light": "#F8F5FF",
        "lavender-mid": "#EDE8FF",
        "lavender-border": "#C9B8FF",
        "purple-muted": "#7c6bb0",
      },
      boxShadow: {
        "geo": "4px 4px 0 #1a1a2e",
        "geo-sm": "2px 2px 0 #1a1a2e",
        "geo-lg": "6px 6px 0 #1a1a2e",
        "geo-pink": "4px 4px 0 #FF6EB4",
        "geo-blue": "4px 4px 0 #5BC4FF",
        "geo-yellow": "4px 4px 0 #FFE566",
        "geo-purple": "4px 4px 0 #C9B8FF",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        babylog: {
          // Primary: hot pink — bold, fun, retro
          "primary": "#FF6EB4",
          "primary-content": "#ffffff",

          // Secondary: sky blue — bright and playful
          "secondary": "#5BC4FF",
          "secondary-content": "#0a2a3d",

          // Accent: sunny yellow — cheerful pop
          "accent": "#FFE566",
          "accent-content": "#2a2000",

          // Neutral: dark navy — grounds the palette
          "neutral": "#1a1a2e",
          "neutral-content": "#f8f5ff",

          // Base palette: light lavender tones
          "base-100": "#F8F5FF",   // lavender-white — main page background
          "base-200": "#EDE8FF",   // light lavender — sections
          "base-300": "#C9B8FF",   // medium lavender — borders, dividers
          "base-content": "#1a1a2e", // dark navy — text

          // Semantic colors — vivid
          "info": "#5BC4FF",
          "info-content": "#0a2a3d",
          "success": "#5DDFB0",
          "success-content": "#062a1c",
          "warning": "#FFE566",
          "warning-content": "#2a2000",
          "error": "#FF6E6E",
          "error-content": "#ffffff",

          // Rounded corners — friendly
          "--rounded-box": "1rem",
          "--rounded-btn": "0.75rem",
          "--rounded-badge": "1.9rem",
          "--tab-radius": "0.5rem",
          "--border-btn": "2.5px",
        },
      },
    ],
  },
};

export default config;
