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
      'body-parser': 'commonjs body-parser',
      child_process: 'commonjs child_process',
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.jsx?$/,
              include: [path.resolve('src')],
              use: [
                {
                  loader: 'cache-loader',
                  options: {
                    cacheDirectory: path.resolve(
                      'node_modules/.cache/babel-server'
                    ),
                  },
                },
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    presets: [
                      [
                        '@babel/preset-env',
                        {
                          modules: false,
                          loose: true,
                          targets: {
                            node: true,
                          },
                        },
                      ],
                      '@babel/preset-react',
                    ],
                    plugins: [
                      '@babel/plugin-proposal-class-properties',
                      '@babel/plugin-transform-runtime',
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  });
};
