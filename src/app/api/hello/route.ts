import { TemplateHandler } from 'easy-template-x';
import * as fs from 'fs';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import Perplexity from '@perplexity-ai/perplexity_ai';

import { analyzeCompetitors } from '../../../lib/utils/competitorAnalyzer';
import { analyzeContent } from '../../../lib/utils/contentAnalyzer';
import { analyzeSEO } from '../../../lib/utils/seoAnalyzer';
import { crawlAndAnalyzeSEO } from '../../../lib/utils/seoSpider';
import { UploadDoc } from '../../fileUploader';

const hubspot = require('@hubspot/api-client');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'us2',
  useTLS: true,
});

const client = new Perplexity({
  apiKey: process.env.PERPLEXITY_API_KEY,
});

const chatPrompt = (url: string): string => {
  return ` Here is my domain: ${url}
Please assist in a UX Website Audit and is designed to analyze domains and provide a comprehensive report on SEO, content, performance, design, and accessibility. When reviewing a website, it considers the site as a primary digital experience for brands, evaluating it across several key criteria: Beauty, Content, Design, Performance, Security, SEO, Web Standards, and Accessibility. The analysis includes a numerical score for each criterion, ranging from 1 (Bad) to 5 (Great), and a final website grade based on the average score. The GPT emphasizes clarity, detail, and actionable insights, avoiding vague or overly technical language unless necessary. The overall goal is to provide a well-rounded, understandable, and useful audit to help improve the website's user experience and performance. The tone is professional yet light, with a touch of fun to keep the communication engaging and approachable.
Here is the criteria for grading websites.

When reviewing a website as the first digital experience for most brands, we start by considering the following criteria that is being evaluated.
Beauty – Beauty is in the eye of the beholder. Is the site visually pleasing?
Content – captions, copywriting, data, descriptions, grammar, images, photos, stories, text, videos
Design – layout, mobile friendliness, navigation, responsive design, structure, typography, etc.
Performance – speed of webpage access on various devices from diverse geographic locations
Security – HTTPS, SSL, TLS 1.3, vulnerability analysis
SEO – search engine optimization, can we find the site on google based on relevant results?
Web Standards – proper use of HTML, CSS, and JavaScript according to W3C guidelines
Accessibility – How easy and streamlined is it to access your website? Consider all the hundreds of thousands of devices across the globe.

Each area must be scored from 1 (Bad) to 5 (Great) and include a detailed justification (2+ paragraphs and at least actionable step the user can take to improve).

Set the design bar high:
  -Modern, responsive design is the minimum expectation, not a bonus.
  -Prioritize visual polish, intuitive UX, clean layout, and strong branding.
  -Sites should delight, not just function—boring or dated designs should be penalized.
  -Aesthetic cohesion, mobile excellence, microinteractions, and layout hierarchy matter.


1 - Bad - Major Rework / Revamp Needed
2 - Needs Attention - Significant Improvements Needed
3 - Average - Improvements Needed
4 - Good - Little to no improvement needed
5 - Great - No improvements / keep it going!!

Grade each section based on reviewed online data. 
At the end, we take an average of the sum of the categories, and your final website grade will be assigned.
4.75 - 5.00: A+
4.50 - 4.74: A
4.25 - 4.49: A-
4.00 - 4.24: B+
3.75 - 3.99: B
3.50 - 3.74: B-
3.25 - 3.49: C+
3.00 - 3.24: C
2.75 - 2.99: C-
2.50 - 2.74: D
2.73 & Below: F


Then provide a JSON response for frontend software to parse the response. Look at the data interface below, the response should be structured as follows:

interface ReportData {
  overallGrade: string;
  gradeScore: number;
  generatedDate: string; //This is today's date in the format MM-DD-YYYY
  screenshot: string;
  siteData:{
    avgMonthlyVisitors: string;
    bounceRate: string;
    conversionRate: string;
  };
  sectionGrades: {
    beauty: { grade: string; score: number; description: string };
    content: { grade: string; score: number; description: string };
    design: { grade: string; score: number; description: string };
    performance: { grade: string; score: number; description: string };
    security: { grade: string; score: number; description: string };
    seo: { grade: string; score: number; description: string };
    webStandards: { grade: string; score: number; description: string };
    accessibility: { grade: string; score: number; description: string };
    overallGrade: { grade: string; score: number; description: string };
  };  //The grade object should be A, B, C, D, or F based on the grading scale provided above. Please provide verbose descriptions for each section - at least a two paragraph.
  detailedReports: {
    keywords: {
      directSearch: string[]; // Provide at least 10 direct keywords related to the website and the business.
      contextual: string[];  // Provide at least 10 contextual keywords related to the website and the business.
    };
    seo: {
      robotsTxt: string;
      indexable: boolean;
      redirects: string[];
      meta: {
        title: string;
        description: string;
      };
      searchEngineRanking: number;
    };
    performance: {
      cookies: number;
      javascriptFiles: number;
      cssFiles: number;
      pageSize: string;
    };
    content: {
      grammaticalErrors: number;
      wordCount: number;
      uniqueWords: number;
      images: number;
      videos: number;
      backlinks: number;
      language: string;
    };
  };
  competitors: Array<{
    name: string;
    avgMonthlyVisitors: number;
    bounceRate: number;
    conversionRate: number;
    url: string; //Please validate that this url is valid and not a dead website.
    thumbnail: string; // Provide thumbnail image url of the URL provided in each competitor object.
  }>;
  recommendations: Array<{
    title: string;
    description: string;
  }>; // Provide at least 10 recommendations for the prospect.
}

Replace types with actual accurate data once website report complete and return only a VALID JSON as the response for this prompt.
`;
};

const marketingStages = {
  attract: {
    blogs: true,
    onlineAds: false,
    video: false,
    infographicsPrintMedia: false,
    socialMedia: true,
  },
  interestAndDesire: {
    freeGuidesHelp: false,
    signupForNewsletter: false, // You can assign the correct value if needed.
    faq: false,
    inPersonEventsWebinars: false,
    promotionsGiveaways: false,
    reviewsTestimonials: false,
    productDemos: false,
    liveChatAgent: false,
    freeTrialsServiceTryOut: false,
    personalizedAds: false,
  },
  action: {
    emailOnboardingSalesAutomation: false,
    consultationCall: true,
    signupForService: false,
    purchase: false,
  },
  loyalty: {
    events: false,
    loyaltyPrograms: false,
    betaAccess: false,
    specialDealsPromotions: false,
    customerReferralPrograms: false,
  },
};

function unnest(docData: any) {
  const res: any = {};
  (function recurse(obj, current) {
    for (const key in obj) {
      const value: any = obj[key];
      const newKey: any = current ? `${current}.${key}` : key; // joined key with dot
      if (value && typeof value === 'object' && key !== 'brand_logo') {
        if (Array.isArray(value)) {
          res[newKey] = value.map(function (e) {
            if (typeof e === 'object') {
              return unnest(e);
            }
            return e;
          });
        } else {
          recurse(value, newKey); // it's a nested object, so do it again
        }
      } else {
        res[newKey] = value; // it's not an object, so set the property
      }
    }
  })(docData);
  return res;
}

function transformStages(stages: any) {
  const result: any = {};

  for (const stage in stages) {
    result[stage] = [];

    for (const key in stages[stage]) {
      const isActive = stages[stage][key];
      result[stage].push({
        visible: isActive,
        invisible: !isActive,
        name: key
          .replace(/([A-Z])/g, ' $1') // Add a space before capital letters
          .replace(/^./, (str) => str.toUpperCase()), // Capitalize the first letter
      });
    }
  }

  return result;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  // Get the base URL from the request for internal API calls
  const requestUrl = new URL(req.url);
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    pusher.trigger('progress-channel', 'update', {
      progress: 0,
      message: 'Starting analysis',
    });

    pusher.trigger('progress-channel', 'update', {
      progress: 10,
      message: 'Fetched initial URL',
    });

    // const siteAnalyticsURL = `https://data.similarweb.com/api/v1/data?domain=${url.replace('https://', '')}`;

    // const siteAnalytics = await fetch(siteAnalyticsURL, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'User-Agent':
    //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   },
    // });

    pusher.trigger('progress-channel', 'update', {
      progress: 20,
      message: 'Capturing website screenshot',
    });

    // Get screenshot
    let screenshot = 'https://via.placeholder.com/1280x800?text=Screenshot+Unavailable';
    try {
      const screenshotUrl = `${baseUrl}/api/screenshot?url=${encodeURIComponent(url)}`;
      console.log('Fetching screenshot from:', screenshotUrl);
      
      const screenshotResponse = await fetch(screenshotUrl, {
        signal: AbortSignal.timeout(50000), // 50 second timeout
      });
      if (screenshotResponse.ok) {
        const screenshotData = (await screenshotResponse.json()) as {
          screenshot?: string;
        };
        screenshot = screenshotData.screenshot || screenshot;
        console.log('Screenshot captured successfully');
      } else {
        console.error('Screenshot API returned error:', screenshotResponse.status);
      }
    } catch (screenshotError) {
      console.error('Error capturing screenshot:', screenshotError);
      // Continue with placeholder if screenshot fails
    }

    pusher.trigger('progress-channel', 'update', {
      progress: 25,
      message: 'Screenshot captured',
    });

    // Run SEO Spider to crawl and analyze the website
    pusher.trigger('progress-channel', 'update', {
      progress: 28,
      message: 'Crawling website for SEO data',
    });

    let seoSpiderData = null;
    try {
      console.log('Starting SEO spider crawl for:', url);
      seoSpiderData = await crawlAndAnalyzeSEO(url);
      console.log('SEO spider crawl completed, score:', seoSpiderData.score);
    } catch (seoSpiderError) {
      console.error('SEO spider error:', seoSpiderError);
      // Continue without spider data
    }

    // Get SEO data
    //const seoData = await analyzeSEO(url);

    // Run content analysis
    //const contentData = await analyzeContent(url);

    const chatStream = await client.chat.completions.create({
      messages: [{ role: 'user', content: chatPrompt(url) }],
      model: 'sonar',
      stream: true,
    });

    pusher.trigger('progress-channel', 'update', {
      progress: 30,
      message: 'Performing Full Deep Dive',
    });

    let responseString = '';

    for await (const chunk of chatStream) {
      const deltaContent = chunk.choices[0]?.delta?.content;
      if (deltaContent) {
        // Handle both string and array content types
        let textContent: string;
        if (typeof deltaContent === 'string') {
          textContent = deltaContent;
        } else if (Array.isArray(deltaContent)) {
          textContent = deltaContent
            .filter((c) => c.type === 'text' && 'text' in c)
            .map((c) => (c as { type: 'text'; text: string }).text)
            .join('');
        } else {
          continue;
        }

        if (textContent === '\n') {
          continue;
        }
        responseString += textContent;
      }
    }

    let parsedResponse;
    try {
      // Clean up the response - Perplexity may wrap JSON in markdown code blocks
      let cleanedResponse = responseString.trim();

      // Remove markdown code blocks if present (```json ... ``` or ``` ... ```)
      if (cleanedResponse.startsWith('```')) {
        // Remove opening code block (with optional language identifier like 'json')
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?[\s\n]?/, '');
        // Remove closing code block
        cleanedResponse = cleanedResponse.replace(/[\s\n]?```\s*$/, '');
      }

      // Trim again after removing code blocks
      cleanedResponse = cleanedResponse.trim();

      // Try to find valid JSON object boundaries
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }

      // Fix common JSON issues
      // Remove trailing commas before closing brackets/braces
      cleanedResponse = cleanedResponse.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix unescaped newlines in strings (common AI output issue)
      cleanedResponse = cleanedResponse.replace(/(?<!\\)\n(?=[^"]*"[^"]*$)/gm, '\\n');

      parsedResponse = JSON.parse(cleanedResponse);
      // console.log('parsed response:', parsedResponse);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Raw response length:', responseString.length);
      console.error('Raw response (first 500 chars):', responseString.substring(0, 500));
      console.error('Raw response (last 500 chars):', responseString.substring(responseString.length - 500));
      return NextResponse.json(
        {
          error: `Failed to parse the response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          rawResponsePreview: responseString.substring(0, 1000),
        },
        { status: 500 }
      );
    }

    // Update the parsed response with actual SEO data from spider
    if (seoSpiderData) {
      // Merge SEO spider data into the response
      if (!parsedResponse.detailedReports) {
        parsedResponse.detailedReports = {};
      }
      
      // Update SEO section with real crawled data
      parsedResponse.detailedReports.seo = {
        robotsTxt: seoSpiderData.technical.hasRobotsTxt ? 'Present' : 'Missing',
        indexable: seoSpiderData.technical.isIndexable,
        redirects: [], // Would need additional crawl logic for redirects
        meta: {
          title: seoSpiderData.meta.title || '',
          description: seoSpiderData.meta.description || '',
        },
        searchEngineRanking: Math.round(seoSpiderData.score / 10), // Convert 0-100 to 0-10
      };

      // Update content section with real crawled data
      parsedResponse.detailedReports.content = {
        grammaticalErrors: 0, // Would need NLP analysis
        wordCount: seoSpiderData.content.wordCount,
        uniqueWords: seoSpiderData.content.uniqueWords,
        images: seoSpiderData.images.total,
        videos: 0, // Could add video detection
        backlinks: seoSpiderData.links.externalCount,
        language: seoSpiderData.meta.language || 'en',
      };

      // Add comprehensive SEO spider data as a new section
      // Sanitize nested object arrays to prevent React rendering errors
      parsedResponse.seoSpiderData = {
        score: seoSpiderData.score,
        meta: seoSpiderData.meta,
        headings: {
          h1: seoSpiderData.headings.h1,
          h2: seoSpiderData.headings.h2,
          h3: seoSpiderData.headings.h3,
          h4: seoSpiderData.headings.h4,
          h5: seoSpiderData.headings.h5,
          h6: seoSpiderData.headings.h6,
          h1Count: seoSpiderData.headings.h1Count,
          hasMultipleH1: seoSpiderData.headings.hasMultipleH1,
          missingH1: seoSpiderData.headings.missingH1,
        },
        links: {
          internalCount: seoSpiderData.links.internalCount,
          externalCount: seoSpiderData.links.externalCount,
          brokenCount: seoSpiderData.links.brokenCount,
          nofollowCount: seoSpiderData.links.nofollowCount,
          // Convert object arrays to simple string arrays for frontend
          broken: seoSpiderData.links.broken,
        },
        images: {
          total: seoSpiderData.images.total,
          withAlt: seoSpiderData.images.withAlt,
          withoutAlt: seoSpiderData.images.withoutAlt,
          missingAltPercentage: seoSpiderData.images.missingAltPercentage,
        },
        technical: seoSpiderData.technical,
        performance: seoSpiderData.performance,
        content: seoSpiderData.content,
        issues: seoSpiderData.issues,
      };

      console.log('SEO spider data merged into response');
    }

    // Update the response structure to include content data
    //parsedResponse.detailedReports.content = contentData;

    // @ts-ignore
    pusher.trigger('progress-channel', 'update', {
      progress: 60,
      message: 'Generating Competitor Analysis',
    });

    // Get industry metrics instead of individual competitors
    //const industryMetrics = await analyzeCompetitors(url);
    // parsedResponse.competitors = [
    //   {
    //     name: 'Industry Average',
    //     avgMonthlyVisitors: industryMetrics.avgMonthlyVisitors,
    //     bounceRate: industryMetrics.bounceRate,
    //     conversionRate: industryMetrics.conversionRate,
    //     url: '',
    //     thumbnail: '',
    //   },
    // ];

    parsedResponse.domain = url;
    parsedResponse.screenshot = screenshot;

    const transformedData = transformStages(marketingStages);

    parsedResponse = { ...parsedResponse, ...transformedData };

    // console.log(siteAnalyticsData)
    // console.log(siteAnalyticsData["Engagments"])
    // if (typeof siteAnalyticsData === 'object' && siteAnalyticsData !== null) {
    //   parsedResponse.siteData.bounceRate =
    //     Math.round(siteAnalyticsData.Engagments?.TimeOnSite * 100) / 100;
    //   parsedResponse.siteData.avgMonthlyVisitors =
    //     Object.values(
    //       siteAnalyticsData.EstimatedMonthlyVisits as Record<string, number>
    //     ).reduce((sum: number, visits: number) => sum + visits, 0) /
    //     Object.keys(
    //       siteAnalyticsData.EstimatedMonthlyVisits as Record<string, number>
    //     ).length;
    //   parsedResponse.siteData.conversionRate =
    //     siteAnalyticsData.Engagments?.ConversionRate;
    // }

    pusher.trigger('progress-channel', 'update', {
      progress: 70,
      message: 'Sifting thru meta data',
    });

    pusher.trigger('progress-channel', 'update', {
      progress: 90,
      message: 'Finalizing site findings',
    });

    const logo_binary = null; // Buffer.from(capturedShot.screenshot, 'base64');

    const documentData = {
      ...parsedResponse,
      brand_logo: {
        _type: 'image',
        source: logo_binary,
        format: 'image/png',
        height: 400,
        altText: 'Brand Logo', // Optional
      },
      brand_slogan: '',
      targetPersona: '',
      industry: '',
      brand_oppurtunities: '',
    };

    // 1. read template file
    const templateFile = fs.readFileSync(
      './src/lib/templates/web-report-template.docx'
    );

    const handler = new TemplateHandler();
    const flatData = unnest(documentData);
    const doc = await handler.process(templateFile, { ...flatData });
    const scannedDomain = url
      .replace(/^https?\:\/\//i, '')
      .replace(/\.com$/, '');
    const fileName = `web-report-${scannedDomain}.docx`;

    console.log(doc);

    await UploadDoc(doc, fileName);

    pusher.trigger('progress-channel', 'update', {
      progress: 100,
      message: 'Analysis complete',
    });

    const bucketName = process.env.MAIN_AWS_BUCKET_NAME;
    const region = process.env.MAIN_AWS_REGION_US;
    parsedResponse = {
      ...parsedResponse,
      report_url: `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
    };

    // console.log(parsedResponse);

    return NextResponse.json({ response: parsedResponse }, { status: 200 });
  } catch (error) {
    console.error('Error analyzing website:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
};
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const hubspotClient = new hubspot.Client({
      accessToken: process.env.HUBSPOT_API_KEY,
    });

    const contactObj = {
      properties: {
        firstname: body.firstName,
        lastname: body.lastName,
        email: body.email,
        phone: body.phoneNumber,
      },
    };
    const companyObj = {
      properties: {
        domain: body.domain,
        name: body.companyName,
      },
    };

    let createContactResponse;
    try {
      createContactResponse =
        await hubspotClient.crm.contacts.basicApi.create(contactObj);
    } catch (error: any) {
      if (error.statusCode === 409) {
        // Contact already exists, fetch the existing contact
        const searchResponse =
          await hubspotClient.crm.contacts.searchApi.doSearch({
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: 'email',
                    operator: 'EQ',
                    value: body.email,
                  },
                ],
              },
            ],
          });
        createContactResponse = searchResponse.results[0];
      }
    }

    const createCompanyResponse =
      await hubspotClient.crm.companies.basicApi.create(companyObj);

    return NextResponse.json(
      {
        success: true,
        data: {
          contact: createContactResponse,
          company: createCompanyResponse,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting to Hubspot API:', error);
    return NextResponse.json(
      { error: 'Failed to submit data to Hubspot API' },
      { status: 500 }
    );
  }
}
