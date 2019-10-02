const path = require('resolve');

module.exports = env => {
  const IS_PRODUCTION = !!env.production;
  return {
    mode: IS_PRODUCTION ? 'production' : 'development',
    node: false,
    watch: !IS_PRODUCTION,

    resolve: {
      extensions: ['.js', '.jsx'],

      modules: [path.resolve('src'), path.resolve('node_modules')],
    },
  };
};
