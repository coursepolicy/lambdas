import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const generatePdf = async (generatedId: string) => {
  let browser = null;
  let result = null;

  try {
    const baseUrl = process.env.CORE_BASE_URL;

    await chromium.font(
      'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf'
    );

    chromium.setGraphicsMode = false;
    browser = await puppeteer.launch({
      args: [...chromium.args, '--disable-features=site-per-process'],
      defaultViewport: null,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(`${baseUrl}/preview/${generatedId}`, {
      waitUntil: 'networkidle2',
    });

    result = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      format: 'letter',
      displayHeaderFooter: true,
      footerTemplate: `
            <div style="font-size:10px; margin: 0 auto; padding: 0; text-align: center; width: 100%;">
                <p>created using 
                    <a href="https://coursepolicy.ai" target="_blank" rel="noopener noreferrer nofollow">
                        CoursePolicy.AI
                    </a>
                </p>
            </div>
        `,
      scale: 0.85,
      width: 'letter',
      height: 'letter',
      margin: {
        bottom: '15mm',
      },
    });

    console.info(
      'Before close **********************',
      JSON.stringify({
        pageInfo: {
          url: await page.url(),
          viewport: await page.viewport(),
        },
        browserInfo: {
          version: await browser.version(),
          isConnected: browser.isConnected(),
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
