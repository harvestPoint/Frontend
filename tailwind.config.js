/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#006837',
            hover: '#00522c',
            light: '#e8f5e9',
          },
          beige: '#fcfbf7',
          purple: '#6b46c1',
          yellow: '#ecc94b',
          red: '#e53e3e',
          orange: '#dd6b20',
        },
      },
    },
  },
  plugins: [],
}