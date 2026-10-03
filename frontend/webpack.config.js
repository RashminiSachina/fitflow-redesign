const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './web/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-screens': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-gesture-handler': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-reanimated': path.resolve(__dirname, './web/polyfills.js'),
      'react-native-image-picker': path.resolve(__dirname, './web/polyfills.js'),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, './src/services/storage.web.js'),
      './src/services/storage': './src/services/storage.web.js',
    },
    extensions: ['.web.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
    fallback: {
      'react-native/Libraries/Utilities/HMR': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!@react-navigation|react-native-safe-area-context|react-native-screens)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '.'),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
};
