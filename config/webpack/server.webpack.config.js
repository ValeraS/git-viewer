const path = require('path');
const merge = require('webpack-merge');
const defaultConfig = require('./common.webpack.config');

module.exports = env => {
  return merge(defaultConfig(env), {
    name: 'server',
    entry: path.resolve('src/server/index.js'),

    output: {
      path: path.resolve('dist'),
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      libraryTarget: 'commonjs2',
    },

    externals: {
      fs: 'commonjs fs',
      path: 'commonjs path',
      react: 'commonjs react',
      express: 'commonjs express',
    },
  });
};
