/* global describe, it */

const { expect } = require('chai');

const { HomePage } = require('../page-objects/home-page');

describe('Breadcrumbs', () => {
  it('go on the next path', async function() {
    const app = new HomePage(this.browser);
    await app.open('/test-repo-1');

    let activeItemText = await app.FilePath.activeItem.getText();
    expect(activeItemText).to.equal('test-repo-1');

    let pathItems = await app.FilePath.items;
    expect(pathItems).has.length(0);

    await app.FileList.getFileLink('src').click();
    await this.browser.pause(1000);
    activeItemText = await app.FilePath.activeItem.getText();
    expect(activeItemText).to.equal('src');
    pathItems = await app.FilePath.items;
    expect(pathItems).has.length(1);
  });

  it('go backward on the current path', async function() {
    const app = new HomePage(this.browser);
    await app.open('/test-repo-1/tree/tests/src');

    let activeItemText = await app.FilePath.activeItem.getText();
    expect(activeItemText).to.equal('src');

    let pathItems = await app.FilePath.items;
    expect(pathItems).has.length(1);

    await app.FilePath.getItemLink('test-repo-1').click();
    await this.browser.pause(1000);
    activeItemText = await app.FilePath.activeItem.getText();
    expect(activeItemText).to.equal('test-repo-1');
    pathItems = await app.FilePath.items;
    expect(pathItems).has.length(0);
  });
});
