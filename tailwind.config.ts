import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['"Nunito Sans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}