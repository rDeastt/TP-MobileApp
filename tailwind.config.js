/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: '#4ADF86',
        secondary:{
          DEFAULT: '#78B4FF',
          100: '#C51297',
          200: '#831266'
        },
        tertiary: '#EF2967'

      },
    },
  },
  plugins: [],
}