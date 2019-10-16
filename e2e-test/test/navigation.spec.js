/* global describe, it */

const { expect } = require('chai');

const { HomePage } = require('../page-objects/home-page');

describe('Navigation', () => {
  it('go to file content', async function() {
    const app = new HomePage(this.browser);
    await app.open('/test-repo-1');

    const filename = '.eslintrc.json';
    await app.FileList.getFileLink(filename).click();
    await app.FileContent.waitForExist();

    const title = await app.FileHeader.title.getText();
    expect(title).to.equal(filename);

    const filePathActiveItem = await app.FilePath.activeItem.getText();
    expect(filePathActiveItem).to.equal(filename);
  });

  it('go to inside a folder', async function() {
    const app = new HomePage(this.browser);
    await app.open('/test-repo-1');

    const filename = 'src';
    await app.FileList.getFileLink(filename).click();
    await this.browser.pause(1000);

    await app.FileList.isExisting();

    const title = await app.FileHeader.title.getText();
    expect(title).to.equal(filename);

    const filePathActiveItem = await app.FilePath.activeItem.getText();
    expect(filePathActiveItem).to.equal(filename);
  });
});
