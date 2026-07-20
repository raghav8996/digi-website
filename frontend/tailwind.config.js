/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dc: {
          bg: "#050505",
          bg1: "#0a0a0a",
          bg2: "#121212",
          text: "#f8f9fa",
          text2: "#a1a1aa",
          accent: "#ff007f",
          accentHover: "#e60073",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
