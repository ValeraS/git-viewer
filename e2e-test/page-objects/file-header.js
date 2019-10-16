class FileHeader {
  constructor(browser) {
    this._ = browser;
  }

  isExisting() {
    return this.content.isExisting();
  }

  get content() {
    return this._.$('.FileHeader');
  }

  get title() {
    return this.content.$('.FileHeader-Title');
  }

  get branchSelector() {
    return this.content.$('.BranchSelector');
  }
}

exports.FileHeader = FileHeader;
