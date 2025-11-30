/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif', ...defaultTheme.fontFamily.sans],
        bebasNeue: ['Bebas Neue', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

