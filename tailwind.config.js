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
      },
      backgroundImage: {
        'watched': "url(icons/ic_eye-watched.svg)",
        'didntWatch': "url(icons/ic_eye-empty.svg)",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
