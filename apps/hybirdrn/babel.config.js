module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
    web: {
      plugins: ['react-native-web'],
    },
  },
  plugins: [
    ['babel-plugin-react-native-web', { commonjs: true }]
  ],
};