module.exports = {
  baseUrl: 'http://localhost:3000',
  gridUrl: 'http://localhost:4444/wd/hub',
  screenshotsDir: 'tests/e2e/screens',
  compositeImage: true,
  windowSize: '1200x760',
  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
  },
  sets: {
    all: {
      files: 'test/**/*.spec.js',
    },
  },
  plugins: {
    'html-reporter/hermione': {
      path: 'reports',
    },
  },
};
