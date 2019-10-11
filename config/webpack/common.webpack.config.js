const path = require('path');

module.exports = env => {
  const IS_PRODUCTION = env && env.production;
  return {
    mode: IS_PRODUCTION ? 'production' : 'development',
    node: false,
    watch: !IS_PRODUCTION,

    devtool: IS_PRODUCTION ? 'source-map' : 'eval-source-map',

    resolve: {
      extensions: ['.js', '.jsx', '.ts', 'tsx'],

      modules: [path.resolve('src'), 'node_modules'],
    },
  };
};
