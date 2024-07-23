/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/components/**/*.{js,jsx,ts,tsx}","./Radish/client/container/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: 'rgb(127, 179, 59)',
          hover: 'rgb(38, 75, 28)',
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
