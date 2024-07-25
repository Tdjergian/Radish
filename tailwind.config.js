/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/components/**/*.{js,jsx,ts,tsx}","./Radish/client/container/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: 'rgb(9, 89, 170)',
          hover: 'rgb(2, 41, 79)',
        },
        secondary: {
          DEFAULT: 'rgb(221, 60, 94)',
          hover: 'rgb(192, 46, 42)',
        },
        track: '#ddd',
        mark: '#aaaaaa',
        shadow: 'rgb(192, 46, 42)',
      },
    },
  },
  plugins: [],
};
