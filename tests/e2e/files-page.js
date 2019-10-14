const { describe, it } = require('mocha');
const { expect } = require('chai');

describe('Files page', () => {
  it('test', async function() {
    const loginPage = new LoginPage(this.browser);
    await loginPage.open();
    console.log('1.FIRST');
    await this.browser.keys(['курс доллара к рублю'], '\uE007');
    console.log('2.FIRST');
    await loginPage.convertForm.waitForExist();
    console.log('3.FIRST');
    expect(await loginPage.convertForm.isExisting()).to.be.true();
    expect(await loginPage.convertFormInputs).has.length(2);
  });
});

class Page {
  constructor(browser) {
    this._browser = browser;
    this.title = 'My Page';
  }

  open(path) {
    return this._browser.url(path);
  }
}

class LoginPage extends Page {
  get videoLink() {
    return this._browser.$('a[data-id=video]');
  }

  get convertForm() {
    return this._browser.element('.converter-form');
  }

  get convertFormInputs() {
    return this._browser.$$('.converter-form .input__control');
  }

  open() {
    return super.open('/');
  }
}
