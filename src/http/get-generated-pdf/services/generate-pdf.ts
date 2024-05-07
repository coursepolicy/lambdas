import { Browser, default as puppeteerCore } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const getBrowser = async () => {
  chromium.setGraphicsMode = false;
  return puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL ? '/Applications/Chromium.app/Contents/MacOS/Chromium' : await chromium.executablePath(),
    headless: chromium.headless,
  })
}

export const generatePdf = async (browser: Browser, generatedId: string) => {
  try {
    const baseUrl = process.env.CORE_BASE_URL;

    await chromium.font(
      'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf'
    );

    console.info('Browser **********************', browser.connected);
    const page = await browser.newPage();

    console.info('Page **********************', page.url());
    await page.goto(`${baseUrl}/preview/${generatedId}`, {
      waitUntil: 'networkidle2',
    });

    console.info('After page **********************', page.url());

    const result = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      format: 'letter',
      displayHeaderFooter: true,
      footerTemplate: `
            <footer style="font-size:10px; margin: 0 auto; padding: 0; text-align: center; width: 100%;">
                <span>created using 
                    <a href="https://coursepolicy.ai" target="_blank" rel="noopener noreferrer nofollow">
                        CoursePolicy.AI
                    </a>
                </span>
            </footer>
        `,
      scale: 0.85,
      width: 'letter',
      height: 'letter',
      margin: {
        bottom: '15mm',
      },
    });

    console.info('After pdf **********************', result);

    console.info(
      'Before close **********************',
      JSON.stringify({
        pageInfo: {
          url: page.url(),
          viewport: page.viewport(),
        },
        browserInfo: {
          version: await browser.version(),
          isConnected: browser.connected,
        },
      })
    );

    await page.close()

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(JSON.stringify(error));
  }
};

export const main = async (generatedId: string) => {
  const browser = await getBrowser();
  console.info('Generating PDFs')

  const result = await generatePdf(browser, generatedId);
  await browser.close();

  return result;
}