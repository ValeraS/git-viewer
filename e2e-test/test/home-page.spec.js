/* global describe, it */

const { expect } = require('chai');

const { HomePage } = require('../page-objects/home-page');

describe('Repo selector', () => {
  it('Repo selector exists on home page', async function() {
    const homePage = new HomePage(this.browser);
    await homePage.open();

    await homePage.Header.repoSelector.isExisting();
    const repoSelectorButtonText = await homePage.Header.repoSelectorButton.getText();
    expect(repoSelectorButtonText).to.equal('Repository');

    await homePage.Header.repoSelectorButton.click();

    await homePage.Header.repoSelectorMenu.isExisting();
    const menuOptions = await homePage.Header.repoSelectorOptions;
    expect(menuOptions).to.have.length(3);
  });

  it('Repo selector menu closes on click outside', async function() {
    const homePage = new HomePage(this.browser);
    await homePage.open();

    await homePage.Header.repoSelectorButton.click();
    let menuOptions = await homePage.Header.repoSelectorOptions;
    expect(menuOptions).to.have.length(3);

    await homePage.Header.content.click();
    menuOptions = await homePage.Header.repoSelectorOptions;
    expect(menuOptions).to.have.length(0);
  });

  it('Repo selector button text should change after selection', async function() {
    const homePage = new HomePage(this.browser);
    await homePage.open();

    let repoSelectorButtonText = await homePage.Header.repoSelectorButton.getText();
    expect(repoSelectorButtonText).to.equal('Repository');

    await homePage.Header.repoSelectorButton.click();
    await homePage.Header.repoSelector.$('=test-repo-1').click();

    repoSelectorButtonText = await homePage.Header.repoSelectorButton.getText();
    expect(repoSelectorButtonText).to.equal('Repository test-repo-1');
  });
});
