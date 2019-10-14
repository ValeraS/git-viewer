module.exports = function(hermione) {
  hermione.on(hermione.events.NEW_BROWSER, function(browser) {
    browser.addCommand('elem', function(selector, timeout = 500) {
      return browser.waitForExist(selector, timeout);
    });
  });
};
