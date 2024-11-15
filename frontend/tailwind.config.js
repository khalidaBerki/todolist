/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', // Adaptez en fonction de vos fichiers
  ],
  theme: {
    extend: {
      colors: {
        cvs: {
          purple: '#8e65ab',
          pink: '#fbd0e0',
          lavender: '#8ca8be',
          beige: '#d3ba83',
          cream: '#ebedd4',
          blue:  '#9ac5e5',
          olive: '#afbdb0',
          rose:  '#e4c0be',
          green: '#4fb19d',
          marron: '#955223',
          gris: '#f1f1f2',


        },
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
          nunito: ["Nunito", "sans-serif"],
          lobster: ["Lobster", "cursive"],
          quicksand: ["Quicksand", "sans-serif"],
          pacifico: ["Pacifico", "cursive"],
        },
      },
    },
  },
  plugins: [],
};
