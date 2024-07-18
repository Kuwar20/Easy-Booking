/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: { },
    container:{
      padding: {
        md:"10rem",
      },
    },
  },
  plugins: [],
}

