/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff", 100: "#dbeafe", 500: "#3b82f6",
          600: "#2563eb", 700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};