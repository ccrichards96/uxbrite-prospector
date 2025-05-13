import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-core';

interface SEOData {
  robotsTxt: string;
  indexable: boolean;
  redirects: string[];
  meta: {
    title: string;
    description: string;
  };
  searchEngineRanking: number;
}

export async function analyzeSEO(url: string): Promise<SEOData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH?.replace(/\\/g, '/') ||
      '/usr/bin/google-chrome',
  });

  try {
    const page = await browser.newPage();

    // Enable request interception to track redirects
    const redirects: string[] = [];
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = request.url();
      if (url !== page.url()) {
        redirects.push(url);
      }
      request.continue();
    });

    // Navigate to the URL
    const response = await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Get the HTML content
    const content = await page.content();
    const $ = cheerio.load(content);

    // Check robots.txt
    const robotsTxtUrl = new URL('/robots.txt', url).toString();
    let robotsTxtContent = 'No, we did not find a robots.txt file.';
    try {
      const robotsResponse = await axios.get(robotsTxtUrl);
      if (robotsResponse.status === 200) {
        robotsTxtContent = 'Yes, we found a robots.txt file.';
      }
    } catch (error) {
      console.error('Error fetching robots.txt:', error);
    }

    // Check if page is indexable
    const isIndexable = !$('meta[name="robots"]')
      .attr('content')
      ?.includes('noindex');

    // Get meta data
    const meta = {
      title: $('title').text() || '',
      description: $('meta[name="description"]').attr('content') || '',
    };

    // Get search engine ranking (this is a simplified version)
    // In a real implementation, you might want to use a search engine API
    const searchEngineRanking = await getSearchEngineRanking(url);

    return {
      robotsTxt: robotsTxtContent,
      indexable: isIndexable,
      redirects,
      meta,
      searchEngineRanking,
    };
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function getSearchEngineRanking(url: string): Promise<number> {
  // This is a placeholder implementation
  // In a real implementation, you would:
  // 1. Use a search engine API (like Google Search Console API)
  // 2. Or use a third-party service that provides ranking data
  // 3. Or implement your own ranking algorithm based on various factors

  // For now, return a random number between 1-100
  return Math.floor(Math.random() * 100) + 1;
}
