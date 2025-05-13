import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    });

    // Create a new page
    const page = await browser.newPage();

    // Set viewport to a reasonable size
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      encoding: 'base64',
    });

    // Close the browser
    await browser.close();

    // Return the base64 encoded image
    return NextResponse.json({
      screenshot: `data:image/jpeg;base64,${screenshot}`,
    });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return NextResponse.json(
      {
        error: 'Failed to take screenshot',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
