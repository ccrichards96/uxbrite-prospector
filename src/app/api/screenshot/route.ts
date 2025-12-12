import chromium from '@sparticuz/chromium-min';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

// Chromium executable path for Vercel deployment
// Uses a remote executable hosted on GitHub for serverless environments
const CHROMIUM_EXECUTABLE =
  'https://github.com/nicubarbaros/chromium-local-server/raw/main/chromium-v131.0.0-pack.tar';

async function getBrowser() {
  // For local development, use local Chrome installation
  if (process.env.NODE_ENV === 'development') {
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
  }

  // For Vercel/production, use @sparticuz/chromium-min
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1280, height: 800 },
    executablePath: await chromium.executablePath(CHROMIUM_EXECUTABLE),
    headless: true,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  let browser = null;

  try {
    // Launch a headless browser
    browser = await getBrowser();

    // Create a new page
    const page = await browser.newPage();

    // Set viewport to a reasonable size
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait a bit for any lazy-loaded content
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      encoding: 'base64',
    });

    // Close the browser
    await browser.close();
    browser = null;

    // Return the base64 encoded image
    return NextResponse.json({
      screenshot: `data:image/jpeg;base64,${screenshot}`,
    });
  } catch (error) {
    console.error('Error taking screenshot:', error);

    // Ensure browser is closed on error
    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      {
        error: 'Failed to take screenshot',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
