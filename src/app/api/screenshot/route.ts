import chromium from '@sparticuz/chromium-min';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

// Chromium executable path for Vercel deployment
// Using the official Sparticuz chromium releases
const CHROMIUM_EXECUTABLE =
  'https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar';

async function getBrowser() {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // For local development, use local Chrome installation
  if (process.env.NODE_ENV === 'development') {
    console.log('Using local Chrome for development');
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
  }

  // For Vercel/production, use @sparticuz/chromium-min
  console.log('Using Sparticuz chromium for production');
  const executablePath = await chromium.executablePath(CHROMIUM_EXECUTABLE);
  console.log('Chromium executable path:', executablePath);
  
  return puppeteer.launch({
    args: [
      ...chromium.args,
      '--hide-scrollbars',
      '--disable-web-security',
    ],
    defaultViewport: { width: 1280, height: 800 },
    executablePath,
    headless: true,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  console.log('Screenshot request for URL:', url);

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  let browser = null;

  try {
    // Launch a headless browser
    console.log('Launching browser...');
    browser = await getBrowser();
    console.log('Browser launched successfully');

    // Create a new page
    const page = await browser.newPage();
    console.log('New page created');

    // Set a user agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    // Set viewport to a reasonable size
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the URL with timeout
    console.log('Navigating to URL...');
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 50000,
    });
    console.log('Navigation complete');

    // Wait a bit for any lazy-loaded content
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Take screenshot
    console.log('Taking screenshot...');
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      encoding: 'base64',
    });
    console.log('Screenshot taken successfully');

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
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to take screenshot',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
