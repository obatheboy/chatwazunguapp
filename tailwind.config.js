/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: '#C9A84C',
          light: '#E8D5A3',
          dark: '#A8893A',
        },
        sugar: {
          dark: '#1A0F0A',
          card: '#1A1715',
          surface: '#2A2522',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #A8893A)',
      }
    },
  },
  plugins: [],
}