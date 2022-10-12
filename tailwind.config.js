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

          "base-100": "#1b1b1b",

          info: "#20A4F3",

          success: "#0F803A",

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
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
