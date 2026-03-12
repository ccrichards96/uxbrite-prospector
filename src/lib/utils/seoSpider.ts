import chromium from '@sparticuz/chromium-min';
import * as cheerio from 'cheerio';
import puppeteer, { Browser, Page } from 'puppeteer-core';

type CheerioAPI = ReturnType<typeof cheerio.load>;

// Chromium executable path for Vercel deployment
const CHROMIUM_EXECUTABLE =
  'https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar';

async function getBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV === 'development') {
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
  }

  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: { width: 1280, height: 800 },
    executablePath: await chromium.executablePath(CHROMIUM_EXECUTABLE),
    headless: true,
  });
}

// Interfaces for SEO data
export interface MetaTagsData {
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  viewport: string;
  robots: string;
  author: string;
  language: string;
}

export interface HeadingsData {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  h1Count: number;
  hasMultipleH1: boolean;
  missingH1: boolean;
}

export interface LinksData {
  internal: { url: string; text: string; nofollow: boolean }[];
  external: { url: string; text: string; nofollow: boolean }[];
  broken: string[];
  internalCount: number;
  externalCount: number;
  brokenCount: number;
  nofollowCount: number;
}

export interface ImagesData {
  total: number;
  withAlt: number;
  withoutAlt: number;
  images: { src: string; alt: string; hasAlt: boolean }[];
  missingAltPercentage: number;
}

export interface PerformanceData {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  resourceCount: number;
  totalSize: number;
  jsFiles: number;
  cssFiles: number;
  imageFiles: number;
  fontFiles: number;
}

export interface TechnicalSEOData {
  hasRobotsTxt: boolean;
  robotsTxtContent: string;
  hasSitemap: boolean;
  sitemapUrl: string;
  isHttps: boolean;
  hasCanonical: boolean;
  isIndexable: boolean;
  hasMobileViewport: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  httpStatusCode: number;
  redirectChain: string[];
  contentType: string;
}

export interface ContentData {
  wordCount: number;
  uniqueWords: number;
  readingTime: number;
  paragraphCount: number;
  textToHtmlRatio: number;
}

export interface SEOAuditResult {
  url: string;
  crawledAt: string;
  meta: MetaTagsData;
  headings: HeadingsData;
  links: LinksData;
  images: ImagesData;
  performance: PerformanceData;
  technical: TechnicalSEOData;
  content: ContentData;
  issues: SEOIssue[];
  score: number;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  recommendation: string;
}

/**
 * Main SEO Spider function that crawls and analyzes a website
 */
export async function crawlAndAnalyzeSEO(
  targetUrl: string
): Promise<SEOAuditResult> {
  console.log('Starting SEO audit for:', targetUrl);

  let browser: Browser | null = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    // Track redirects
    const redirectChain: string[] = [];
    let httpStatusCode = 200;

    page.on('response', (response) => {
      if (response.url() === targetUrl || redirectChain.length > 0) {
        const status = response.status();
        if (status >= 300 && status < 400) {
          redirectChain.push(response.url());
        }
        if (response.url() === page.url()) {
          httpStatusCode = status;
        }
      }
    });

    // Enable performance metrics
    await page.setCacheEnabled(false);

    // Navigate to the page
    const startTime = Date.now();
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 50000,
    });
    const loadTime = Date.now() - startTime;

    // Get page content
    const html = await page.content();
    const $ = cheerio.load(html);

    // Get performance metrics
    const performanceMetrics = await getPerformanceMetrics(page);
    performanceMetrics.loadTime = loadTime;

    // Analyze all aspects
    const [meta, headings, links, images, technical, content] =
      await Promise.all([
        analyzeMetaTags($, page),
        analyzeHeadings($),
        analyzeLinks($, targetUrl, browser),
        analyzeImages($, targetUrl),
        analyzeTechnicalSEO($, targetUrl, httpStatusCode, redirectChain),
        analyzeContent($, html),
      ]);

    // Generate issues based on analysis
    const issues = generateSEOIssues(
      meta,
      headings,
      links,
      images,
      technical,
      content
    );

    // Calculate overall score
    const score = calculateSEOScore(
      meta,
      headings,
      links,
      images,
      technical,
      issues
    );

    await browser.close();
    browser = null;

    return {
      url: targetUrl,
      crawledAt: new Date().toISOString(),
      meta,
      headings,
      links,
      images,
      performance: performanceMetrics,
      technical,
      content,
      issues,
      score,
    };
  } catch (error) {
    console.error('Error during SEO audit:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

/**
 * Analyze meta tags
 */
async function analyzeMetaTags(
  $: CheerioAPI,
  page: Page
): Promise<MetaTagsData> {
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const robots = $('meta[name="robots"]').attr('content') || '';
  const author = $('meta[name="author"]').attr('content') || '';
  const viewport = $('meta[name="viewport"]').attr('content') || '';

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDescription =
    $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const ogUrl = $('meta[property="og:url"]').attr('content') || '';

  // Twitter Card
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
  const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';
  const twitterDescription =
    $('meta[name="twitter:description"]').attr('content') || '';
  const twitterImage = $('meta[name="twitter:image"]').attr('content') || '';

  // Language
  const language = $('html').attr('lang') || '';

  return {
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    viewport,
    robots,
    author,
    language,
  };
}

/**
 * Analyze heading structure
 */
async function analyzeHeadings($: CheerioAPI): Promise<HeadingsData> {
  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];
  const h4: string[] = [];
  const h5: string[] = [];
  const h6: string[] = [];

  $('h1').each((_, el) => h1.push($(el).text().trim()));
  $('h2').each((_, el) => h2.push($(el).text().trim()));
  $('h3').each((_, el) => h3.push($(el).text().trim()));
  $('h4').each((_, el) => h4.push($(el).text().trim()));
  $('h5').each((_, el) => h5.push($(el).text().trim()));
  $('h6').each((_, el) => h6.push($(el).text().trim()));

  return {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h1Count: h1.length,
    hasMultipleH1: h1.length > 1,
    missingH1: h1.length === 0,
  };
}

/**
 * Analyze internal and external links
 */
async function analyzeLinks(
  $: CheerioAPI,
  baseUrl: string,
  browser: Browser
): Promise<LinksData> {
  const baseUrlObj = new URL(baseUrl);
  const internal: LinksData['internal'] = [];
  const external: LinksData['external'] = [];
  const broken: string[] = [];
  let nofollowCount = 0;

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    const rel = $(el).attr('rel') || '';
    const nofollow = rel.includes('nofollow');

    if (nofollow) nofollowCount++;

    try {
      // Skip empty, javascript, mailto, tel links
      if (
        !href ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return;
      }

      const absoluteUrl = new URL(href, baseUrl);

      if (absoluteUrl.hostname === baseUrlObj.hostname) {
        internal.push({ url: absoluteUrl.href, text, nofollow });
      } else {
        external.push({ url: absoluteUrl.href, text, nofollow });
      }
    } catch {
      // Invalid URL
    }
  });

  // Check for broken links (sample - checking first 10 links to avoid timeout)
  const linksToCheck = [...internal, ...external].slice(0, 10);
  const page = await browser.newPage();

  for (const link of linksToCheck) {
    try {
      const response = await page.goto(link.url, {
        waitUntil: 'domcontentloaded',
        timeout: 5000,
      });
      if (response && response.status() >= 400) {
        broken.push(link.url);
      }
    } catch {
      broken.push(link.url);
    }
  }

  await page.close();

  return {
    internal,
    external,
    broken,
    internalCount: internal.length,
    externalCount: external.length,
    brokenCount: broken.length,
    nofollowCount,
  };
}

/**
 * Analyze images
 */
async function analyzeImages(
  $: CheerioAPI,
  baseUrl: string
): Promise<ImagesData> {
  const images: ImagesData['images'] = [];

  $('img').each((_, el) => {
    const src = $(el).attr('src') || '';
    const alt = $(el).attr('alt') || '';
    const hasAlt = alt.trim().length > 0;

    if (src) {
      try {
        const absoluteSrc = new URL(src, baseUrl).href;
        images.push({ src: absoluteSrc, alt, hasAlt });
      } catch {
        images.push({ src, alt, hasAlt });
      }
    }
  });

  const withAlt = images.filter((img) => img.hasAlt).length;
  const withoutAlt = images.length - withAlt;
  const missingAltPercentage =
    images.length > 0 ? (withoutAlt / images.length) * 100 : 0;

  return {
    total: images.length,
    withAlt,
    withoutAlt,
    images: images.slice(0, 50), // Limit to first 50 for payload size
    missingAltPercentage: Math.round(missingAltPercentage * 100) / 100,
  };
}

/**
 * Get performance metrics from the page
 */
async function getPerformanceMetrics(page: Page): Promise<PerformanceData> {
  const metrics = await page.evaluate(() => {
    const performance = window.performance;
    const timing = performance.timing;
    const resources = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[];

    let jsFiles = 0;
    let cssFiles = 0;
    let imageFiles = 0;
    let fontFiles = 0;
    let totalSize = 0;

    resources.forEach((resource) => {
      const size = resource.transferSize || 0;
      totalSize += size;

      if (resource.initiatorType === 'script') jsFiles++;
      else if (resource.initiatorType === 'link' || resource.initiatorType === 'css') cssFiles++;
      else if (resource.initiatorType === 'img') imageFiles++;
      else if (resource.initiatorType === 'font' || resource.name.match(/\.(woff2?|ttf|eot|otf)$/i)) fontFiles++;
    });

    // Get paint timings
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint =
      paintEntries.find((e) => e.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint =
      paintEntries.find((e) => e.name === 'first-contentful-paint')
        ?.startTime || 0;

    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: Math.round(firstPaint),
      firstContentfulPaint: Math.round(firstContentfulPaint),
      resourceCount: resources.length,
      totalSize,
      jsFiles,
      cssFiles,
      imageFiles,
      fontFiles,
    };
  });

  return {
    loadTime: 0, // Will be set by caller
    ...metrics,
  };
}

/**
 * Analyze technical SEO aspects
 */
async function analyzeTechnicalSEO(
  $: CheerioAPI,
  targetUrl: string,
  httpStatusCode: number,
  redirectChain: string[]
): Promise<TechnicalSEOData> {
  const urlObj = new URL(targetUrl);
  const isHttps = urlObj.protocol === 'https:';

  // Check robots.txt
  let hasRobotsTxt = false;
  let robotsTxtContent = '';
  try {
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
    const response = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) });
    if (response.ok) {
      hasRobotsTxt = true;
      robotsTxtContent = await response.text();
    }
  } catch {
    // robots.txt not found or error
  }

  // Check sitemap
  let hasSitemap = false;
  let sitemapUrl = '';
  
  // Try to find sitemap in robots.txt
  const sitemapMatch = robotsTxtContent.match(/Sitemap:\s*(.+)/i);
  if (sitemapMatch) {
    sitemapUrl = sitemapMatch[1].trim();
    hasSitemap = true;
  } else {
    // Try common sitemap locations
    const commonSitemaps = ['/sitemap.xml', '/sitemap_index.xml', '/sitemap/'];
    for (const path of commonSitemaps) {
      try {
        const response = await fetch(`${urlObj.protocol}//${urlObj.host}${path}`, {
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          hasSitemap = true;
          sitemapUrl = `${urlObj.protocol}//${urlObj.host}${path}`;
          break;
        }
      } catch {
        // Continue to next
      }
    }
  }

  // Check canonical
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const hasCanonical = canonical.length > 0;

  // Check if indexable
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  const isIndexable = !robotsMeta.toLowerCase().includes('noindex');

  // Check mobile viewport
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const hasMobileViewport = viewport.length > 0;

  // Check for structured data
  const structuredDataScripts = $('script[type="application/ld+json"]');
  const hasStructuredData = structuredDataScripts.length > 0;
  const structuredDataTypes: string[] = [];

  structuredDataScripts.each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || '{}');
      if (json['@type']) {
        structuredDataTypes.push(json['@type']);
      }
    } catch {
      // Invalid JSON
    }
  });

  return {
    hasRobotsTxt,
    robotsTxtContent: robotsTxtContent.slice(0, 500), // Limit size
    hasSitemap,
    sitemapUrl,
    isHttps,
    hasCanonical,
    isIndexable,
    hasMobileViewport,
    hasStructuredData,
    structuredDataTypes,
    httpStatusCode,
    redirectChain,
    contentType: 'text/html',
  };
}

/**
 * Analyze content
 */
async function analyzeContent(
  $: CheerioAPI,
  html: string
): Promise<ContentData> {
  // Remove script, style, and non-visible content
  $('script, style, noscript, iframe').remove();

  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));

  const paragraphCount = $('p').length;

  // Calculate text to HTML ratio
  const textLength = text.length;
  const htmlLength = html.length;
  const textToHtmlRatio =
    htmlLength > 0 ? (textLength / htmlLength) * 100 : 0;

  // Estimate reading time (200 words per minute)
  const readingTime = Math.ceil(words.length / 200);

  return {
    wordCount: words.length,
    uniqueWords: uniqueWords.size,
    readingTime,
    paragraphCount,
    textToHtmlRatio: Math.round(textToHtmlRatio * 100) / 100,
  };
}

/**
 * Generate SEO issues based on analysis
 */
function generateSEOIssues(
  meta: MetaTagsData,
  headings: HeadingsData,
  links: LinksData,
  images: ImagesData,
  technical: TechnicalSEOData,
  content: ContentData
): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Title issues
  if (!meta.title) {
    issues.push({
      type: 'error',
      category: 'Meta Tags',
      message: 'Missing page title',
      recommendation: 'Add a descriptive title tag between 50-60 characters.',
    });
  } else if (meta.titleLength < 30) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      message: `Title is too short (${meta.titleLength} characters)`,
      recommendation: 'Expand your title to 50-60 characters for better SEO.',
    });
  } else if (meta.titleLength > 60) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      message: `Title is too long (${meta.titleLength} characters)`,
      recommendation:
        'Shorten your title to under 60 characters to prevent truncation in search results.',
    });
  }

  // Description issues
  if (!meta.description) {
    issues.push({
      type: 'error',
      category: 'Meta Tags',
      message: 'Missing meta description',
      recommendation:
        'Add a meta description between 150-160 characters summarizing the page content.',
    });
  } else if (meta.descriptionLength < 120) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      message: `Meta description is too short (${meta.descriptionLength} characters)`,
      recommendation:
        'Expand your meta description to 150-160 characters for better CTR.',
    });
  } else if (meta.descriptionLength > 160) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      message: `Meta description is too long (${meta.descriptionLength} characters)`,
      recommendation:
        'Shorten your meta description to under 160 characters to prevent truncation.',
    });
  }

  // Open Graph issues
  if (!meta.ogTitle || !meta.ogDescription || !meta.ogImage) {
    issues.push({
      type: 'warning',
      category: 'Social Media',
      message: 'Incomplete Open Graph tags',
      recommendation:
        'Add og:title, og:description, and og:image for better social media sharing.',
    });
  }

  // Heading issues
  if (headings.missingH1) {
    issues.push({
      type: 'error',
      category: 'Headings',
      message: 'Missing H1 tag',
      recommendation:
        'Add exactly one H1 tag that describes the main topic of the page.',
    });
  } else if (headings.hasMultipleH1) {
    issues.push({
      type: 'warning',
      category: 'Headings',
      message: `Multiple H1 tags found (${headings.h1Count})`,
      recommendation:
        'Use only one H1 tag per page. Use H2-H6 for subsections.',
    });
  }

  // Image issues
  if (images.withoutAlt > 0) {
    issues.push({
      type: 'warning',
      category: 'Images',
      message: `${images.withoutAlt} images missing alt text`,
      recommendation:
        'Add descriptive alt text to all images for accessibility and SEO.',
    });
  }

  // Link issues
  if (links.brokenCount > 0) {
    issues.push({
      type: 'error',
      category: 'Links',
      message: `${links.brokenCount} broken links detected`,
      recommendation:
        'Fix or remove broken links to improve user experience and SEO.',
    });
  }

  // Technical SEO issues
  if (!technical.isHttps) {
    issues.push({
      type: 'error',
      category: 'Security',
      message: 'Site is not using HTTPS',
      recommendation:
        'Migrate to HTTPS for security and SEO benefits. Google prioritizes secure sites.',
    });
  }

  if (!technical.hasRobotsTxt) {
    issues.push({
      type: 'warning',
      category: 'Technical SEO',
      message: 'No robots.txt file found',
      recommendation:
        'Add a robots.txt file to guide search engine crawlers.',
    });
  }

  if (!technical.hasSitemap) {
    issues.push({
      type: 'warning',
      category: 'Technical SEO',
      message: 'No sitemap found',
      recommendation:
        'Create and submit an XML sitemap to help search engines discover your pages.',
    });
  }

  if (!technical.hasCanonical) {
    issues.push({
      type: 'warning',
      category: 'Technical SEO',
      message: 'No canonical URL specified',
      recommendation:
        'Add a canonical tag to prevent duplicate content issues.',
    });
  }

  if (!technical.hasMobileViewport) {
    issues.push({
      type: 'error',
      category: 'Mobile',
      message: 'Missing mobile viewport meta tag',
      recommendation:
        'Add a viewport meta tag for proper mobile rendering.',
    });
  }

  if (!technical.hasStructuredData) {
    issues.push({
      type: 'info',
      category: 'Structured Data',
      message: 'No structured data (JSON-LD) found',
      recommendation:
        'Add structured data markup to enhance search result appearance with rich snippets.',
    });
  }

  if (!meta.language) {
    issues.push({
      type: 'warning',
      category: 'Accessibility',
      message: 'Missing lang attribute on HTML tag',
      recommendation:
        'Add a lang attribute to the HTML tag to specify the page language.',
    });
  }

  // Content issues
  if (content.wordCount < 300) {
    issues.push({
      type: 'warning',
      category: 'Content',
      message: `Low word count (${content.wordCount} words)`,
      recommendation:
        'Consider adding more content. Pages with 1000+ words tend to rank better.',
    });
  }

  if (content.textToHtmlRatio < 10) {
    issues.push({
      type: 'info',
      category: 'Content',
      message: `Low text-to-HTML ratio (${content.textToHtmlRatio}%)`,
      recommendation:
        'Increase the amount of visible text content relative to HTML code.',
    });
  }

  return issues;
}

/**
 * Calculate overall SEO score (0-100)
 */
function calculateSEOScore(
  meta: MetaTagsData,
  headings: HeadingsData,
  links: LinksData,
  images: ImagesData,
  technical: TechnicalSEOData,
  issues: SEOIssue[]
): number {
  let score = 100;

  // Deduct points for errors
  const errors = issues.filter((i) => i.type === 'error').length;
  const warnings = issues.filter((i) => i.type === 'warning').length;

  score -= errors * 10;
  score -= warnings * 3;

  // Bonus points for good practices
  if (meta.ogTitle && meta.ogDescription && meta.ogImage) score += 2;
  if (meta.twitterCard) score += 1;
  if (technical.hasStructuredData) score += 3;
  if (technical.hasSitemap) score += 2;
  if (technical.isHttps) score += 5;
  if (images.missingAltPercentage === 0 && images.total > 0) score += 2;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}
