import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kerala: {
          green: '#1a7a4a',
          'green-light': '#25a865',
          gold: '#c8922a',
          'gold-light': '#e8b84b',
          red: '#b83230',
          deep: '#0a2b1a',
          cream: '#faf7f2',
          orange: '#d4631a',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        malayalam: ['"Baloo Chettan 2"', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-kerala': 'linear-gradient(135deg, #1a7a4a 0%, #0a2b1a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #c8922a 0%, #e8b84b 100%)',
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
