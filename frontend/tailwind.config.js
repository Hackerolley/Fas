/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#171412",
        clay: "#9F6B4E",
        moss: "#4F6F52",
        pearl: "#F7F3ED",
        linen: "#EEE4D8"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 20, 18, 0.08)"
      }
    }
  },
  plugins: []
};
