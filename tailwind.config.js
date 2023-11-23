/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          200: 'rgba(252, 252, 252, 0.20)',
          500: 'rgba(252, 252, 252, 0.50)',
          600: 'rgba(252, 252, 252, 0.60)',
          700: 'rgba(252, 252, 252, 0.70)',
          800: '#514F4F',
        },
      },
    },
  },
  plugins: [],
}

