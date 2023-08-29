import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const generatePdf = async (generatedId: string) => {
  let browser = null;
  let result = null;

  try {
    const baseUrl = 'https://d22na4fphuot3z.cloudfront.net';

    await chromium.font(
      'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf'
    );

    chromium.setGraphicsMode = false;
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: null,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto(`${baseUrl}/preview/${generatedId}`, {
      waitUntil: 'networkidle0',
    });

    result = await page.pdf({
      printBackground: true,
      width: 1100,
    });

    console.info(
      'Before close **********************',
      JSON.stringify({
        pageInfo: {
          url: await page.url(),
          viewport: await page.viewport(),
          // ... any other properties you're interested in
        },
        browserInfo: {
          version: await browser.version(),
          isConnected: browser.isConnected(),
          // ... any other properties you're interested in
        },
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error(JSON.stringify(error));
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};
