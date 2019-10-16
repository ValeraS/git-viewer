class FilePath {
  constructor(browser) {
    this._ = browser;
  }

  isExisting() {
    return this.content.isExisting();
  }

  get content() {
    return this._.$('.FilePath');
  }

  getItemLink(item) {
    return this.content.$(`.FilePath-Link=${item}`);
  }

  get activeItem() {
    return this.content.$('.FilePath-CurrentItem');
  }

  get items() {
    return this.content.$$('.FilePath-Item');
  }
}

exports.FilePath = FilePath;