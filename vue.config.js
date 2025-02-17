const path = require('path');
const webpack = require('webpack');

module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: false,//require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  },
};
