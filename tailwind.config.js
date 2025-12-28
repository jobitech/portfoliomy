/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00ffff',
        neonPink: '#ff00ff',
        neonPurple: '#9d00ff',
      },
      boxShadow: {
        neon: '0 0 8px #00ffff, 0 0 16px #00ffff, 0 0 24px #ff00ff',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
