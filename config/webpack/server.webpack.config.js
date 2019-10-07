const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const { DefinePlugin } = require('webpack');
const defaultConfig = require('./common.webpack.config');
const {
  LAZY_COMPONENT_PLUGIN,
} = require('../babel/lazy-component-babel-plugin');

module.exports = env => {
  const IS_PRODUCTION = env && env.production;

  return merge(defaultConfig(env), {
    name: 'server',
    entry: path.resolve('src/server/index.js'),

    output: {
      path: path.resolve('dist'),
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      libraryTarget: 'commonjs2',
    },

    externals: [
      nodeExternals(),
      {
        fs: 'commonjs fs',
        path: 'commonjs path',
        child_process: 'commonjs child_process',
      },
    ],

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
                      LAZY_COMPONENT_PLUGIN,
                      '@babel/plugin-proposal-class-properties',
                      '@babel/plugin-transform-runtime',
                    ],
                  },
                },
              ],
            },
            {
              test: /\.css$/,
              loader: 'null-loader',
            },
          ],
        },
      ],
    },

    plugins: [
      new DefinePlugin({
        'typeof window': '"undefined"',
        'process.env.NODE_ENV': IS_PRODUCTION ? '"production"' : '""',
      }),
    ],
  });
};
