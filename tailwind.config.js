module.exports = {
  content: ["./index.html", "./src/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        cabin: ["Cabin, sans-serif"],
      },
      gradientColorStops: {
        overlayBlack: "rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        watched: "url(src/assets/icons/ic_eye-watched.svg)",
        didntWatch: "url(src/assets/icons/ic_eye-empty.svg)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
