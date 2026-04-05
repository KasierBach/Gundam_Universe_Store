/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gundam: {
          bg: {
            primary: '#0a0e1a',
            secondary: '#111827',
            tertiary: '#1a2035',
          },
          surface: '#1e293b',
          cyan: {
            DEFAULT: '#06b6d4',
            glow: '#22d3ee',
          },
          red: {
            DEFAULT: '#ef4444',
            glow: '#f87171',
          },
          amber: {
            DEFAULT: '#f59e0b',
            glow: '#fbbf24',
          },
          emerald: {
            DEFAULT: '#10b981',
          },
          metallic: '#8892a4',
          border: {
            DEFAULT: 'rgba(6, 182, 212, 0.15)',
            glow: 'rgba(6, 182, 212, 0.4)',
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
            muted: '#64748b',
          },
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        bevietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(6, 182, 212, 0.4)',
        'red-glow': '0 0 15px rgba(239, 68, 68, 0.4)',
        'amber-glow': '0 0 15px rgba(245, 158, 11, 0.4)',
      },
      backgroundImage: {
        'mecha-gradient': 'linear-gradient(to bottom, #111827, #0a0e1a)',
        'mecha-cyan': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hud-scan': 'hud-scan 4s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        'hud-scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
