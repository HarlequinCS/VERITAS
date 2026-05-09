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
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        veritas: {
          bg: "#0B1020",
          surface: "#111827",
          "surface-alt": "#0F172A",
          elevated: "#1A2236",
          "border-subtle": "#1E2A44",
          "border-strong": "#2A3656",
          cyan: "#22D3EE",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          success: "#10B981",
        },
        severity: {
          critical: "#F43F5E",
          high: "#FB7185",
          medium: "#F59E0B",
          low: "#FACC15",
        },
      },
      backgroundImage: {
        "neon-mix":
          "linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)",
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        card:
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 50px rgba(0,0,0,0.45)",
        "glow-cyan":
          "0 0 0 1px rgba(34,211,238,0.25), 0 0 24px rgba(34,211,238,0.18)",
        "glow-purple":
          "0 0 0 1px rgba(139,92,246,0.25), 0 0 24px rgba(139,92,246,0.18)",
        "glow-danger":
          "0 0 0 1px rgba(244,63,94,0.30), 0 0 24px rgba(244,63,94,0.20)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2.4s ease-in-out infinite",
        scanline: "scanline 4s linear infinite",
        "drift-grid": "drift-grid 18s linear infinite",
        "fade-up": "fade-up 320ms cubic-bezier(.16,1,.3,1) both",
        "stream-in": "stream-in 220ms cubic-bezier(.2,.8,.2,1) both",
      },
      keyframes: {
        "pulse-neon": {
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
      },
    },
  },
  plugins: [],
};

export default config;
