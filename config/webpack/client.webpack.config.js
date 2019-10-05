const path = require('path');
const merge = require('webpack-merge');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const { DefinePlugin } = require('webpack');
const defaultConfig = require('./common.webpack.config');
const {
  LAZY_COMPONENT_PLUGIN,
} = require('../babel/lazy-component-babel-plugin');

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
                          useBuiltIns: 'usage',
                          corejs: 3,
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
          ],
        },
      ],
    },

    plugins: [
      new WebpackManifestPlugin({
        fileName: '../../asset-manifest.json',
        publicPath: PUBLIC_PATH,
        generate(seed, files) {
          let manifestFiles = files.reduce(function(manifest, file) {
            if (file.name) {
              manifest[file.name] = file.path;
            }

            return manifest;
          }, seed);

          return {
            files: manifestFiles,
          };
        },
      }),
      new DefinePlugin({
        'typeof window': '"object"',
      }),
    ],
  });
};
