/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#def5e3",

          secondary: "#66ff99",

          accent: "#6633ff",

          neutral: "#6272a4",

          "base-100": "#181818",

          info: "#20A4F3",

          success: "#16C071",

          warning: "#F4CF71",

          error: "#F15565",
        },
      },
    ],
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
      },
      colors: {
        danube: {
          DEFAULT: "#6987D3",
          50: "#F7F9FD",
          100: "#E7ECF8",
          200: "#C8D3EF",
          300: "#A8B9E6",
          400: "#89A0DC",
          500: "#6987D3",
          600: "#3E64C6",
          700: "#2E4E9E",
          800: "#213872",
          900: "#152347",
        },
        led: {
          DEFAULT: "#F4CF71",
          50: "#FFFFFF",
          100: "#FFFFFF",
          200: "#FDF5E3",
          300: "#FAE9BD",
          400: "#F7DC97",
          500: "#F4CF71",
          600: "#F0BD3D",
          700: "#E3A812",
          800: "#AF820E",
          900: "#7B5B0A",
        },
        dark: {
          DEFAULT: "#1B1B1B",
          50: "#777777",
          100: "#6D6D6D",
          200: "#585858",
          300: "#444444",
          400: "#2F2F2F",
          500: "#1B1B1B",
          600: "#181818",
          700: "#000000",
          800: "#000000",
          900: "#000000",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
