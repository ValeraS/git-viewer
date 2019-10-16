class Header {
  constructor(browser) {
    this._ = browser;
  }

  get content() {
    return this._.$('.Header-Content');
  }

  get repoSelector() {
    return this._.$('.RepoSelector');
  }

  get repoSelectorButton() {
    return this.repoSelector.$('.Dropdown-Button');
  }

  get repoSelectorMenu() {
    return this.repoSelector.$('.Popup');
  }

  get repoSelectorOptions() {
    return this.repoSelector.$$('.Popup-Option');
  }
}

exports.Header = Header;
