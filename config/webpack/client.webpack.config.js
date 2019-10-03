const path = require('path');
const merge = require('webpack-merge');
const defaultConfig = require('./common.webpack.config');

module.exports = env => {
  const IS_PRODUCTION = env && env.production;
  const PUBLIC_PATH = '/assets/';

  return merge(defaultConfig(env), {
    name: 'client',
    entry: path.resolve('src/client/index.js'),

    output: {
      path: path.resolve('dist/client/assets'),
      filename: IS_PRODUCTION ? '[contenthash:8].js' : '[name].js',
      chunkFilename: IS_PRODUCTION ? '_[contenthash:8].js' : '_[name].js',
      publicPath: PUBLIC_PATH,
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
                      'node_modules/.cache/babel-client'
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
                          useBuiltIs: 'usage',
                          corejs: 3,
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
