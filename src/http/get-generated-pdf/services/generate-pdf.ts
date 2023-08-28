import puppeteer from 'puppeteer';

export const generatePdf = async (generatedId: string) => {
  // const baseUrl = 'https://d22na4fphuot3z.cloudfront.net';
  const baseUrl = 'http://localhost:3001';

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(`${baseUrl}/preview/${generatedId}`, {
    waitUntil: 'networkidle0',
  });

  const pdf = await page.pdf({
    path: 'my-course-policy.pdf',
    printBackground: true,
    width: 985,
    displayHeaderFooter: false,
    preferCSSPageSize: true,
  });

  await browser.close();

  return pdf;
};
