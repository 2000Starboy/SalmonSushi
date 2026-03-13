/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        salmon: {
          50: '#fff4ed',
          100: '#ffe5d3',
          200: '#ffc8a5',
          300: '#ffa26d',
          400: '#ff7232',
          500: '#fe4d09',
          600: '#ef3600',
          700: '#c62702',
          800: '#9d200a',
          900: '#7f1e0d',
          950: '#450c04',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
