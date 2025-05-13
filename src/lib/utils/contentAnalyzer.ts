import axios from 'axios';
import * as cheerio from 'cheerio';
import { franc } from 'franc';
import { URL } from 'url';

interface ContentMetrics {
  grammaticalErrors: number;
  wordCount: number;
  uniqueWords: number;
  images: number;
  videos: number;
  backlinks: number;
  language: string;
  pagesAnalyzed: number;
  averageWordCount: number;
  totalPages: number;
}

interface PageMetrics {
  wordCount: number;
  uniqueWords: number;
  images: number;
  videos: number;
  backlinks: number;
  text: string;
}

const visitedUrls = new Set<string>();
const allText: string[] = [];
const allMetrics: PageMetrics[] = [];

async function getBaseUrl(url: string): Promise<string> {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}`;
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

async function isValidUrl(url: string, baseUrl: string): Promise<boolean> {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === new URL(baseUrl).hostname;
  } catch {
    return false;
  }
}

async function analyzePage(url: string): Promise<PageMetrics> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style').remove();

    // Extract text from main content areas
    const mainContent =
      $('main, article, .content, .post, .article').text() || $('body').text();
    const text = mainContent.replace(/\s+/g, ' ').trim();

    // Count images (excluding tracking pixels and icons)
    const images = $('img:not([width="1"]):not([height="1"])').length;

    // Count videos from various platforms
    const videos = $(
      'video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="dailymotion"]'
    ).length;

    // Count backlinks
    const backlinks = $('a[href]').length;

    // Count words and unique words
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const uniqueWords = new Set(words.map((word) => word.toLowerCase())).size;

    return {
      wordCount: words.length,
      uniqueWords,
      images,
      videos,
      backlinks,
      text,
    };
  } catch (error) {
    console.error(`Error analyzing page ${url}:`, error);
    return {
      wordCount: 0,
      uniqueWords: 0,
      images: 0,
      videos: 0,
      backlinks: 0,
      text: '',
    };
  }
}

async function crawlWebsite(
  url: string,
  baseUrl: string,
  maxPages: number = 50
): Promise<void> {
  if (visitedUrls.size >= maxPages) return;
  if (visitedUrls.has(url)) return;

  visitedUrls.add(url);

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Analyze current page
    const metrics = await analyzePage(url);
    allMetrics.push(metrics);
    allText.push(metrics.text);

    // Find and follow internal links
    const links = $('a[href]')
      .map((_, el) => $(el).attr('href'))
      .get()
      .filter(
        (href) =>
          href &&
          !href.startsWith('#') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:')
      );

    for (const link of links) {
      if (visitedUrls.size >= maxPages) break;

      let absoluteUrl = link;
      if (!link.startsWith('http')) {
        absoluteUrl = new URL(link, baseUrl).href;
      }

      if (await isValidUrl(absoluteUrl, baseUrl)) {
        await crawlWebsite(absoluteUrl, baseUrl, maxPages);
      }
    }
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
  }
}

export async function analyzeContent(url: string): Promise<ContentMetrics> {
  try {
    // Reset global state
    visitedUrls.clear();
    allText.length = 0;
    allMetrics.length = 0;

    const baseUrl = await getBaseUrl(url);
    await crawlWebsite(url, baseUrl);

    // Aggregate metrics across all pages
    const totalWordCount = allMetrics.reduce((sum, m) => sum + m.wordCount, 0);
    const totalUniqueWords = new Set(
      allText
        .join(' ')
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 0)
    ).size;
    const totalImages = allMetrics.reduce((sum, m) => sum + m.images, 0);
    const totalVideos = allMetrics.reduce((sum, m) => sum + m.videos, 0);
    const totalBacklinks = allMetrics.reduce((sum, m) => sum + m.backlinks, 0);

    // Detect language from all text
    const languageCode = franc(allText.join(' '), { minLength: 3 });
    const languageMap: { [key: string]: string } = {
      eng: 'English',
      spa: 'Spanish',
      fra: 'French',
      deu: 'German',
      ita: 'Italian',
      por: 'Portuguese',
      rus: 'Russian',
      jpn: 'Japanese',
      kor: 'Korean',
      zho: 'Chinese',
    };

    return {
      grammaticalErrors: Math.floor(totalWordCount * 0.01), // Placeholder for grammatical errors
      wordCount: totalWordCount,
      uniqueWords: totalUniqueWords,
      images: totalImages,
      videos: totalVideos,
      backlinks: totalBacklinks,
      language: languageMap[languageCode] || 'Unknown',
      pagesAnalyzed: visitedUrls.size,
      averageWordCount: Math.round(totalWordCount / visitedUrls.size),
      totalPages: visitedUrls.size,
    };
  } catch (error) {
    console.error('Error in content analysis:', error);
    return {
      grammaticalErrors: 0,
      wordCount: 0,
      uniqueWords: 0,
      images: 0,
      videos: 0,
      backlinks: 0,
      language: 'Unknown',
      pagesAnalyzed: 0,
      averageWordCount: 0,
      totalPages: 0,
    };
  }
}
