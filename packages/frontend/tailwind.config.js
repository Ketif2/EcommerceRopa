/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#131313',
        white: '#E0E1D1',
        secondary: '#141D26',
        primary: '#233446',
        contrast: '#36BEBB',
        contrast2: '#C41E5C',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        fugaz: ['Fugaz One', 'cursive'],
      },  
    },
  },
  plugins: [],
}

