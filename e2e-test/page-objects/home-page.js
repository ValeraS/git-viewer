const { Page } = require('./page');
const { Header } = require('./header');
const { FileList } = require('./file-list');
const { FilePath } = require('./file-path');
const { FileHeader } = require('./file-header');
const { FileContent } = require('./file-content');

class HomePage extends Page {
  constructor(browser) {
    super(browser);
    this._header = new Header(browser);
    this._fileList = new FileList(browser);
    this._filePath = new FilePath(browser);
    this._fileHeader = new FileHeader(browser);
    this._fileContent = new FileContent(browser);
  }

  open(url = '/') {
    return super.open(url);
  }
  get Header() {
    return this._header;
  }

  get FileList() {
    return this._fileList;
  }

  get FilePath() {
    return this._filePath;
  }

  get FileHeader() {
    return this._fileHeader;
  }

  get FileContent() {
    return this._fileContent;
  }
}

exports.HomePage = HomePage;
