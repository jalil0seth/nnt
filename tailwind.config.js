/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: "#0A1520",
        foreground: "#C5D1DC",
        primary: {
          DEFAULT: "#4ADE80",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1A2433",
          foreground: "#C5D1DC",
        },
        border: "#2A3A4D",
        threat: {
          low: "#4ADE80",
          medium: "#F59E0B",
          high: "#EF4444",
          critical: "#991B1B"
        },
        military: {
          green: "#25855A",
          blue: "#2B6CB0",
          red: "#C53030",
          yellow: "#B7791F",
          gray: "#4A5568"
        }
      },
      gridTemplateColumns: {
        'dashboard': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(74, 222, 128, 0.2)',
        'threat': '0 0 15px rgba(239, 68, 68, 0.2)',
      }
    },
  },
  plugins: [],
};