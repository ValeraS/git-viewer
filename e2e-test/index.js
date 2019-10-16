const { resolve, join } = require('path');
const { promisify } = require('util');
const fs = require('fs');
const selenium = require('selenium-standalone');
const Hermione = require('hermione');

const hermione = new Hermione(resolve(join(__dirname, './hermione.conf.js')));
const rename = promisify(fs.rename);

seleniumInstall() //make sure selenium is installed
  .then(prepareRepos)
  .then(seleniumStart) //start selenium web driver
  .then(() => {
    require('./start-app.js'); //start application
  })
  .then(delay(1000)) // wait a second till application is started
  .then(() => hermione.run('')) // run hermiona e2e tests
  .finally(cleanUpRepos)
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

function prepareRepos() {
  return Promise.all([
    rename(
      join(__dirname, 'fixture/test-repo-1/git'),
      join(__dirname, 'fixture/test-repo-1/.git')
    ),
    rename(
      join(__dirname, 'fixture/test-repo-2/git'),
      join(__dirname, 'fixture/test-repo-2/.git')
    ),
    rename(
      join(__dirname, 'fixture/test-repo-3/git'),
      join(__dirname, 'fixture/test-repo-3/.git')
    ),
  ]);
}

function cleanUpRepos() {
  return Promise.all([
    rename(
      join(__dirname, 'fixture/test-repo-1/.git'),
      join(__dirname, 'fixture/test-repo-1/git')
    ),
    rename(
      join(__dirname, 'fixture/test-repo-2/.git'),
      join(__dirname, 'fixture/test-repo-2/git')
    ),
    rename(
      join(__dirname, 'fixture/test-repo-3/.git'),
      join(__dirname, 'fixture/test-repo-3/git')
    ),
  ]);
}
