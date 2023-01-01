/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "edot-main": "#2BBECB",
        "edot-primary": "#EB008B",
        "edot-secondary": "#D5FAFD",
        "edot-light": "#FDE6F3",
        "edot-neutral": "#F4F4F4",
      },
    },
  },
  plugins: [],
};
