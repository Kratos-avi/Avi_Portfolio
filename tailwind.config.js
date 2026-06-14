/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-glow': 'var(--primary-glow)',
        secondary: '#E1E0CC',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
      },
    },
  },
  plugins: [],
}