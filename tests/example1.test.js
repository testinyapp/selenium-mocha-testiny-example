const { Builder, By, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '../mochawesome-report/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshot(driver, testTitle) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedTitle = testTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${sanitizedTitle}_${timestamp}.png`;
  const filepath = path.join(screenshotsDir, filename);
  
  try {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(filepath, screenshot, 'base64');
  } catch (err) {
    console.error('Failed to take screenshot:', err);
  }
}

describe("Example Test Suite 1", function() {
  let driver;

  before(async function() {
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  afterEach(async function() {
    // Take screenshot on test failure
    if (this.currentTest.state === 'failed') {
      await takeScreenshot.call(this, driver, this.currentTest.title);
    }
  });

  it("should load Testiny homepage and verify title", async function() {
    await driver.get("https://www.testiny.io");
    const title = await driver.getTitle();
    expect(title).to.contain('Testiny');
  });

  it("should fail (and take a screenshot)", async function() {
    await driver.get("https://www.testiny.io");
    const title = await driver.getTitle();
    expect(title).not.to.contain('Testiny');
  });
});