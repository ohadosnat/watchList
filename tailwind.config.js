module.exports = {
  mode: 'jit',
  purge: ['index.html', './scripts/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'cabin': ['Cabin, sans-serif'],
      },
      gradientColorStops: {
        'overlayBlack': 'rgba(0, 0, 0, 0.4)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
