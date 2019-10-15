const { resolve, join } = require('path');
const selenium = require('selenium-standalone');
const Hermione = require('hermione');

const hermione = new Hermione(resolve(join(__dirname, './hermione.conf.js')));

seleniumInstall() //make sure selenium is installed
  .then(seleniumStart) //start selenium web driver
  .then(() => {
    require('./start-app.js'); //start application
  })
  .then(delay(1000)) // wait a second till application is started
  .then(() => hermione.run('')) // run hermiona e2e tests
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

function seleniumInstall() {
  return new Promise(resolve => selenium.install({}, resolve));
}

function seleniumStart() {
  return new Promise(resolve => selenium.start(resolve));
}

function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
