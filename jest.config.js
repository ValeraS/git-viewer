module.exports = {
  verbose: true,
  transform: {
    '^.+\\.js$': [
      'babel-jest',
      {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime'],
      },
    ],
  },
};
