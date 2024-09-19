// netlify/functions/screenshot.js
const puppeteer = require('puppeteer-core');
const chromium = require("@sparticuz/chromium");

import { Context } from "@netlify/functions";

chromium.setHeadlessMode = true;

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

export const handler = async function(event, context: Context) {

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:  process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
    headless: false,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-extensions'],
  })

  //let browser;
  const body = JSON.parse(event.body)
  if(!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' }),
    };
  }

  console.log(body)

  try {
    //browser = await puppeteer.launch({headless: true, ignoreDefaultArgs: ['--disable-extensions']});
    const page = await browser.newPage();
    await page.goto(body.url, { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot({ encoding: 'base64' });
    return {
      statusCode: 200,
      body: JSON.stringify({ screenshot: `data:image/png;base64,${screenshot}` }),
    };
  } catch (error) {
    console.log('Error capturing screenshot:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to capture screenshot' }),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};