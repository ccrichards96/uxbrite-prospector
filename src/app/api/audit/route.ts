import { NextApiRequest, NextApiResponse } from 'next';
import { playAudit } from 'playwright-lighthouse';
import playwright from 'playwright';
import puppeteer from 'puppeteer';
import { CheerioAPI, load } from 'cheerio';
import { URL } from 'url';

// Define the structure of the audit report
interface AuditReport {
  metadata: {
    title: string;
    description: string;
    h1Tags: string[];
    canonical: string | null;
  };
  lighthouse: any;
}

// Function to scrape metadata using Puppeteer & Cheerio
const getMetadata = async (url: string): Promise<AuditReport['metadata']> => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const content = await page.content();
  const $: CheerioAPI = load(content);

  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content') || '';
  const h1Tags = $('h1')
    .map((_, el) => $(el).text())
    .get();
  const canonical = $('link[rel="canonical"]').attr('href') || null;

  await browser.close();
  return { title, description, h1Tags, canonical };
};

// Function to run Lighthouse audit
const runLighthouseAudit = async (url: string) => {
  const browser = await playwright['chromium'].launch({
    args: ['--remote-debugging-port=9222'],
  });
  const page = await browser.newPage();
  await page.goto(url);
  const result = await playAudit({
    page,
    port: 9222,
  });

  await browser.close();
  return result.lhr;
};

// API handler for domain audit
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const url = new URL(domain).href; // Ensure valid URL format

    const [metadata, lighthouseReport] = await Promise.all([
      getMetadata(url),
      runLighthouseAudit(url),
    ]);

    const auditReport: AuditReport = { metadata, lighthouse: lighthouseReport };

    return res.status(200).json(auditReport);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Failed to audit site', details: error });
  }
}
