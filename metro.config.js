// metro.config.js — v4.2
// DatalakeOfflineAuth — add .tflite and .onnx as asset extensions
// Required for react-native-fast-tflite and onnxruntime-react-native to bundle model files
// Cache redirected to D:\metro-tmp to avoid C: drive ENOSPC errors

const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const METRO_CACHE_DIR = 'D:\\metro-tmp';

const config = getDefaultConfig(__dirname);

// Redirect Metro cache to D: drive (C: drive has no free space)
config.cacheStores = [
  new FileStore({ root: path.join(METRO_CACHE_DIR, 'file-store') }),
];

// Add AI model file extensions so Metro bundles them from assets/models/
config.resolver.assetExts.push('tflite'); // EdgeFace TFLite model
config.resolver.assetExts.push('onnx');   // MiniFASNet ONNX model

module.exports = config;
