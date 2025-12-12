import axios from 'axios';
import Perplexity from '@perplexity-ai/perplexity_ai';
import puppeteer from 'puppeteer-core';

interface Competitor {
  name: string;
  avgMonthlyVisitors: number;
  bounceRate: number;
  conversionRate: number;
  url: string;
  thumbnail: string;
}

interface SimilarWebData {
  EstimatedMonthlyVisits?: Record<string, number>;
  Engagments?: {
    BounceRate?: number;
    TimeOnSite?: number;
  };
}

interface IndustryMetrics {
  avgMonthlyVisitors: number;
  bounceRate: number;
  conversionRate: number;
}

// Helper function to extract text content from Perplexity response
function extractTextContent(
  content:
    | string
    | Array<{ type: string; text?: string }>
    | null
    | undefined
): string | null {
  if (!content) return null;

  if (typeof content === 'string') {
    return content;
  }

  // Handle array of content chunks - extract text from text chunks
  if (Array.isArray(content)) {
    const textChunks = content
      .filter((chunk) => chunk.type === 'text' && chunk.text)
      .map((chunk) => chunk.text)
      .join('');
    return textChunks || null;
  }

  return null;
}

// Helper function to clean Perplexity response
function cleanPerplexityResponse(content: string): string {
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?[\s\n]?/, '');
    cleaned = cleaned.replace(/[\s\n]?```\s*$/, '');
  }
  return cleaned.trim();
}

export async function analyzeCompetitors(
  domain: string
): Promise<IndustryMetrics> {
  try {
    // Initialize Perplexity
    const client = new Perplexity({
      apiKey: process.env.PERPLEXITY_API_KEY,
    });

    // Use Perplexity to get industry metrics
    const completion = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        {
          role: 'user',
          content: `
          Based on this domain: ${domain}
          Please provide industry average metrics for websites in this sector.
          Return a JSON object with the following structure:
          {
            "avgMonthlyVisitors": number, // Average monthly visitors for similar companies
            "bounceRate": number, // Average bounce rate (as a decimal between 0 and 1)
            "conversionRate": number // Average conversion rate (as a percentage)
          }
          Make sure the values are realistic industry averages.
          Return ONLY the JSON object, no additional text.
        `,
        },
      ],
    });

    try {
      const rawContent = completion.choices[0].message?.content;
      const content = extractTextContent(rawContent);
      if (content) {
        const cleanedContent = cleanPerplexityResponse(content);
        const metrics = JSON.parse(cleanedContent);

        // Validate and format the metrics
        return {
          avgMonthlyVisitors: Number(
            (metrics.avgMonthlyVisitors || 0).toFixed(2)
          ),
          bounceRate: Number((metrics.bounceRate || 0).toFixed(2)),
          conversionRate: Number((metrics.conversionRate || 0).toFixed(2)),
        };
      }
    } catch (parseError) {
      console.error('Error parsing Perplexity response:', parseError);
    }

    // Return default values if parsing fails
    return {
      avgMonthlyVisitors: 0,
      bounceRate: 0,
      conversionRate: 0,
    };
  } catch (error) {
    console.error('Error in competitor analysis:', error);
    return {
      avgMonthlyVisitors: 0,
      bounceRate: 0,
      conversionRate: 0,
    };
  }
}

export async function analyzeCompetitorsDetailed(
  domain: string
): Promise<Competitor[]> {
  try {
    // Initialize Perplexity
    const client = new Perplexity({
      apiKey: process.env.PERPLEXITY_API_KEY,
    });

    // Step 1: Use Perplexity to identify potential competitors
    const completion = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        {
          role: 'user',
          content: `
          Based on this domain: ${domain}
          Please identify 5 major competitor websites in the same industry.
          Return only a JSON array of competitor URLs.
          Make sure the URLs are valid and active websites.
          Example response format: ["https://example1.com", "https://example2.com"]
          Return ONLY the JSON array, no additional text.
        `,
        },
      ],
    });

    let competitorUrls: string[] = [];
    try {
      const rawContent = completion.choices[0].message?.content;
      const content = extractTextContent(rawContent);
      if (content) {
        const cleanedContent = cleanPerplexityResponse(content);
        const parsed = JSON.parse(cleanedContent);
        // Ensure we have an array of strings
        competitorUrls = Array.isArray(parsed)
          ? parsed.filter((url) => typeof url === 'string')
          : [];
      }
    } catch (parseError) {
      console.error('Error parsing Perplexity response:', parseError);
      return [];
    }

    if (!competitorUrls.length) {
      console.error('No valid competitor URLs found');
      return [];
    }

    // Step 2: Get SimilarWeb data for each competitor
    const competitors: Competitor[] = [];
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    });

    for (const url of competitorUrls) {
      try {
        // Validate URL format
        if (!url.startsWith('http') || !url.startsWith('https')) {
          console.error(`Invalid URL format: ${url}`);
          continue;
        }

        // Get SimilarWeb data
        const similarWebResponse = await axios.get<SimilarWebData>(
          `https://data.similarweb.com/api/v1/data?domain=${url.replace('https://', '')}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
          }
        );

        const similarWebData = similarWebResponse.data;

        // Capture screenshot
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        const screenshot = await page.screenshot({ encoding: 'base64' });
        await page.close();

        // Calculate metrics with 0 as fallback and round to 2 decimal points
        const avgMonthlyVisitors = similarWebData?.EstimatedMonthlyVisits
          ? Number(
              (
                Object.values(similarWebData.EstimatedMonthlyVisits).reduce(
                  (sum, visits) => sum + visits,
                  0
                ) / Object.keys(similarWebData.EstimatedMonthlyVisits).length
              ).toFixed(2)
            )
          : 0;

        const bounceRate = Number(
          (similarWebData?.Engagments?.BounceRate || 0).toFixed(2)
        );
        const conversionRate = Number(
          (similarWebData?.Engagments?.TimeOnSite || 0).toFixed(2)
        );

        competitors.push({
          name: new URL(url).hostname.replace('www.', ''),
          avgMonthlyVisitors,
          bounceRate,
          conversionRate,
          url,
          thumbnail: `data:image/png;base64,${screenshot}`,
        });
      } catch (error) {
        console.error(`Error analyzing competitor ${url}:`, error);
        // Skip invalid competitors
        continue;
      }
    }

    await browser.close();
    return competitors;
  } catch (error) {
    console.error('Error in competitor analysis:', error);
    // Return empty array if analysis fails
    return [];
  }
}
