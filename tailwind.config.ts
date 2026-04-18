import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0e1a",
        surface: "#0d1117",
        card: "#111827",
        "card-hover": "#1a2235",
        "green-glow": "#00ff88",
        "cyan-glow": "#00d4ff",
        "border-dim": "#1e293b",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "Courier New", "monospace"],
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
        "scan-line": "scanLine 4s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "counter-up": "counterUp 1s ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(0,255,136,0.7)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0.6" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "glow-green": "0 0 12px rgba(0,255,136,0.4)",
        "glow-cyan": "0 0 12px rgba(0,212,255,0.4)",
        "glow-card": "0 0 0 1px rgba(0,255,136,0.15), 0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
