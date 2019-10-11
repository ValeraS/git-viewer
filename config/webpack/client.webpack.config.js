const { resolve } = require('path');
const merge = require('webpack-merge');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const defaultConfig = require('./common.webpack.config');
const {
  LAZY_COMPONENT_PLUGIN,
} = require('../babel/lazy-component-babel-plugin');

module.exports = env => {
  const IS_PRODUCTION = env && env.production;
  const PUBLIC_PATH = '/assets/';

  return merge(defaultConfig(env), {
    name: 'client',
    entry: resolve('src/client/index.js'),

    output: {
      path: resolve('dist/client/assets'),
      filename: IS_PRODUCTION ? '[contenthash:8].js' : '[name].js',
      chunkFilename: IS_PRODUCTION ? '_[contenthash:8].js' : '_[name].js',
      publicPath: PUBLIC_PATH,
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(j|t)sx?$/,
              include: [resolve('src')],
              use: [
                {
                  loader: 'cache-loader',
                  options: {
                    cacheDirectory: resolve('node_modules/.cache/babel-client'),
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
                      '@babel/preset-typescript',
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
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'cache-loader',
                  options: {
                    cacheDirectory: resolve('node_modules/.cache/babel-client'),
                  },
                },
                {
                  loader: 'css-loader',
                  options: { sourceMap: true, importLoaders: 1 },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    sourceMap: true,
                    plugins: () => [require('postcss-preset-env')()],
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
      new MiniCssExtractPlugin({
        filename: IS_PRODUCTION ? '[contenthash:8].css' : '[name].css',
        chunkFilename: IS_PRODUCTION ? '_[contenthash:8].css' : '_[name].css',
      }),

      ...(IS_PRODUCTION ? [new OptimizeCssAssetsPlugin()] : []),

      new CopyPlugin([
        { from: 'static/favicon.ico', to: '../' },
        { from: 'static/', ignore: 'favicon.ico' },
      ]),
    ],
  });
};
