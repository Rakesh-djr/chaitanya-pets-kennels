/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a017',
          600: '#b8860b',
          700: '#92620a',
          800: '#78540a',
          900: '#5c3d08',
        },
        brown: {
          50: '#fdf8f3',
          100: '#f5e9d9',
          200: '#e8cdb0',
          300: '#d4a97a',
          400: '#c28450',
          500: '#a0522d',
          600: '#8b4513',
          700: '#723a10',
          800: '#5c2d0a',
          900: '#401e06',
        },
        cream: '#fefaf4',
        parchment: '#f5ede0',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lato', 'sans-serif'],
        accent: ['Dancing Script', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 160, 23, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(212, 160, 23, 0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4a017 0%, #f0c040 50%, #b8860b 100%)',
        'warm-gradient': 'linear-gradient(135deg, #fdf8f3 0%, #f5e9d9 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(92,61,8,0.85) 0%, rgba(160,82,45,0.7) 50%, rgba(212,160,23,0.6) 100%)',
      },
    },
  },
  plugins: [],
};
