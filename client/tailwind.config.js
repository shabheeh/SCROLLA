/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
          },
      },
      animation: {
        'spinner-leaf-fade': 'spinner-leaf-fade 800ms linear infinite',
      },
    },
    plugins: [],
  };