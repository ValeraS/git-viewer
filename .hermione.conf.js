module.exports = {
  baseUrl: 'https://yandex.ru', //'http://localhost:3000',
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
      files: 'tests/e2e/*.js',
    },
  },
  plugins: {
    'html-reporter/hermione': {
      path: 'tests/e2e/reports',
    },
    'extend-commands': true,
  },
};
