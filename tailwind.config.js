/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: "#4ADF86",
          dark: "#35C971",
        },
        secondary: {
          DEFAULT: "#78B4FF",
          100: "#C51297",
          200: "#831266",
          dark: "#4E86D9",
        },
        tertiary: "#EF2967",
        cards: {
          DEFAULT: "#D8CFF5",
          dark: "#3A3454",
        },
        surface: {
          DEFAULT: "#F3F3F3",
          dark: "#0F1218",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1B212B",
        },
        content: {
          DEFAULT: "#11181C",
          dark: "#ECEDEE",
        },
        muted: {
          DEFAULT: "#687076",
          dark: "#9BA1A6",
        },
      },
    },
  },
  plugins: [],
}
