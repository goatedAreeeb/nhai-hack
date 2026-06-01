// babel.config.js — v4.1
// DatalakeOfflineAuth — EXACT plugin order per Architecture §9
// react-native-worklets-core MUST be first
// react-native-reanimated MUST be second

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['react-native-worklets-core/plugin'],  // MUST be first — worklets for VisionCamera
    'react-native-reanimated/plugin',       // MUST be second — Reanimated worklets
  ],
};
