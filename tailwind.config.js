/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Cinzel"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Montserrat"', 'system-ui', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        chronova: {
          black: '#030705',
          charcoal: '#060e0a',
          forest: '#0a1711',
          card: '#08130e',
          cardHover: '#0d1c14',
          emerald: '#10b981',
          'emerald-light': '#34d399',
          'emerald-dark': '#059669',
          gold: '#dfb15b',
          'gold-light': '#f3d999',
          'gold-dark': '#a37a2c',
          bronze: '#a77b52',
          champagne: '#e8d5b5',
          silver: '#e2e8f0',
          muted: '#859c90',
          border: 'rgba(16, 185, 129, 0.2)',
          borderGold: 'rgba(223, 177, 91, 0.25)',
        }
      },
      boxShadow: {
        'emerald-glow': '0 0 45px -8px rgba(16, 185, 129, 0.35)',
        'gold-glow': '0 0 40px -10px rgba(223, 177, 91, 0.35)',
        'luxury-card': '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 0 25px rgba(16, 185, 129, 0.05)',
        'luxury-card-hover': '0 25px 60px rgba(16, 185, 129, 0.22), inset 0 1px 2px rgba(223, 177, 91, 0.2)',
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #a7f3d0 0%, #10b981 50%, #047857 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fdf6e2 0%, #dfb15b 50%, #a37a2c 100%)',
        'metallic-gradient': 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
        'radial-spotlight': 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.14) 0%, rgba(223, 177, 91, 0.08) 35%, rgba(4, 8, 6, 0) 70%)',
      }
    },
  },
  plugins: [],
}
