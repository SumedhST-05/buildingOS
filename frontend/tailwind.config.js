/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F6FA',
        navy: {
          950: '#061838',
          900: '#0B2A5B',
          800: '#123974',
          700: '#1E4A8F',
          600: '#2A5DAB',
          100: '#E8EFF9',
          50: '#F4F7FC',
        },
        teal: {
          brand: '#00A9A0',
          hover: '#00948C',
          light: '#E6F8F7',
          glow: '#00D4C8',
        },
        status: {
          optimal: '#10B981',
          warning: '#F59E0B',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(11, 42, 91, 0.05)',
        'card-hover': '0 8px 24px rgba(11, 42, 91, 0.1)',
        'teal-glow': '0 0 15px rgba(0, 169, 160, 0.35)',
      }
    },
  },
  plugins: [],
}
