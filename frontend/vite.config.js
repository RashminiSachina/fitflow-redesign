import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-screens': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-gesture-handler': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-reanimated': path.resolve(__dirname, './web/polyfills.js'),
      './src/services/storage': './src/services/storage.web.js',
    },
  },
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
  },
});
