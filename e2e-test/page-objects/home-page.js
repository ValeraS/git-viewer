const { Page } = require('./page');
const { Header } = require('./header');

class HomePage extends Page {
  constructor(browser) {
    super(browser);
    this._header = new Header(browser);
  }

  open() {
    return super.open('/');
  }
  get Header() {
    return this._header;
  }
}

exports.HomePage = HomePage;
