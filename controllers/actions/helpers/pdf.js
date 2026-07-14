'use strict';

const puppeteer = require('puppeteer');

let browserPromise;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  const browser = await browserPromise;
  if (!browser.isConnected()) {
    browserPromise = null;
    return getBrowser();
  }

  return browser;
}

async function renderPdfFromHtml(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = request.url();
      const type = request.resourceType();
      const isExternalAsset = /^https?:\/\//i.test(url) && ['font', 'stylesheet'].includes(type);

      if (isExternalAsset) {
        request.abort();
        return;
      }

      request.continue();
    });

    await page.setViewport({ width: 1200, height: 1600 });
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map(img =>
          img.complete
            ? null
            : new Promise(resolve => {
                img.onload = img.onerror = resolve;
              })
        )
      );
    });

    return page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });
  } finally {
    await page.close();
  }
}

module.exports = {
  renderPdfFromHtml
};
