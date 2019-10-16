class Page {
  constructor(browser) {
    this._ = browser;
  }

  open(path) {
    return this._.url(path);
  }
}

exports.Page = Page;
