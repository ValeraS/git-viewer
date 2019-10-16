class FileContent {
  constructor(browser) {
    this._ = browser;
  }

  waitForExist(timeout = 2000) {
    return this._.waitForExist('.FileContent', timeout);
  }

  get content() {
    return this._.$('.FileContent');
  }
}

exports.FileContent = FileContent;
