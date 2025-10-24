/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
          content: '#ffffff',
        },
        poker: {
          green: '#047857',
          red: '#dc2626',
          black: '#000000',
          white: '#ffffff',
          felt: '#0a4d3c',
          gold: '#fbbf24'
        }
      },
      animation: {
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'card-deal': 'cardDeal 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' }
        },
        cardDeal: {
          '0%': {
            transform: 'translateY(-100px) rotate(180deg)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1'
          }
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        poker: {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          "secondary": "#10b981",
          "secondary-focus": "#059669",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          "neutral": "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
        "poker-dark": {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
          "secondary": "#10b981",
          "secondary-focus": "#059669",
          "secondary-content": "#ffffff",
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#ffffff",
          "neutral": "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#1d232a",
          "base-200": "#191e24",
          "base-300": "#15191e",
          "base-content": "#a6adba",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        }
      },
      "light",
      "dark"
    ],
    darkTheme: "poker-dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root"
  }
}
