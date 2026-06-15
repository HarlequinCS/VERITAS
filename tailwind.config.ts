import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        display: ["var(--font-orbitron)", "monospace"],
        label: ["var(--font-share-tech)", "monospace"],
      },
      colors: {
        veritas: {
          bg: "#050B14",
          surface: "#0A1428",
          "surface-alt": "#0C1830",
          elevated: "#0F1D3A",
          "border-subtle": "#152545",
          "border-strong": "#1E3460",
          electric: "#0088FF",
          "electric-dim": "#0073D9",
          arc: "#00CCFF",
          "arc-dim": "#00A3D9",
          spark: "#66D9FF",
          success: "#00CC88",
        },
        severity: {
          critical: "#F43F5E",
          high: "#FB7185",
          medium: "#F59E0B",
          low: "#FACC15",
        },
      },
      backgroundImage: {
        "electric-mix":
          "linear-gradient(135deg, #0088FF 0%, #00CCFF 100%)",
        "arc-mix":
          "linear-gradient(135deg, #00CCFF 0%, #0066FF 100%)",
        "grid-faint":
          "linear-gradient(to right, rgba(0,136,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,136,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        card:
          "0 1px 0 rgba(255,255,255,0.03) inset, 0 18px 50px rgba(0,0,0,0.50)",
        "glow-electric":
          "0 0 0 1px rgba(0,136,255,0.25), 0 0 24px rgba(0,136,255,0.18)",
        "glow-arc":
          "0 0 0 1px rgba(0,204,255,0.25), 0 0 24px rgba(0,204,255,0.18)",
        "glow-danger":
          "0 0 0 1px rgba(244,63,94,0.30), 0 0 24px rgba(244,63,94,0.20)",
      },
      animation: {
        "pulse-electric": "pulse-electric 2.4s ease-in-out infinite",
        scanline: "scanline 4s linear infinite",
        "drift-grid": "drift-grid 18s linear infinite",
        "fade-up": "fade-up 320ms cubic-bezier(.16,1,.3,1) both",
        "stream-in": "stream-in 220ms cubic-bezier(.2,.8,.2,1) both",
        "glitch": "glitch 0.3s ease both",
        "blink-cursor": "blink 0.8s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "ticker": "ticker 40s linear infinite",
        "counter-roll": "counter-roll 2s ease-out both",
      },
      keyframes: {
        "pulse-electric": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.04)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "drift-grid": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 48px" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "stream-in": {
          "0%": { opacity: "0", transform: "translateX(-6px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glitch: {
          "0%": { clipPath: "inset(0 0 98% 0)", transform: "translateX(-4px)" },
          "10%": { clipPath: "inset(40% 0 50% 0)", transform: "translateX(4px)" },
          "20%": { clipPath: "inset(20% 0 70% 0)", transform: "translateX(-2px)" },
          "100%": { clipPath: "inset(0 0 0 0)", transform: "translateX(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "counter-roll": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
