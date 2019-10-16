class FileList {
  constructor(browser) {
    this._ = browser;
  }

  waitForExist(timeout = 2000) {
    return this._.waitForExist('.FileList', timeout);
  }

  get content() {
    return this._.$('.FileList');
  }

  getFileLink(filename) {
    return this.content.$(`.Link=${filename}`);
  }
}

exports.FileList = FileList;
