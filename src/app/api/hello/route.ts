import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import * as fs from 'fs';
import { TemplateHandler } from 'easy-template-x';
import { UploadDoc } from "../../../app/fileUploader";
import { Signer } from '@aws-amplify/core';

const Pusher = require("pusher");
const hubspot = require('@hubspot/api-client')
const pusher = new Pusher({
  appId: process.env['PUSHER_APP_ID'],
  key: process.env['PUSHER_APP_KEY'],
  secret: process.env['PUSHER_APP_SECRET'],
  cluster: "us2",
  useTLS: true
});

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const chatPrompt = (url: string): string => {
  return `
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
Each criteria section we will provide a numerical score from 1 to 5:. 

1 - Bad - Major Rework / Revamp Needed
2 - Needs Attention - Significant Improvements Needed
3 - Average - Improvements Needed
4 - Good - Little to no improvement needed
5 - Great - No improvements / keep it going!!

Grade each section based on reviewed online data. At the end, we take an average of the sum of the categories, and your final website grade will be assigned.
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
  generatedDate: string;
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
      directSearch: string[]; // Provide at least 10 direct keywords
      contextual: string[];  // Provide at least 10 contextual keywords
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
    socialMedia: true
  },
  interestAndDesire: {
    freeGuidesHelp: false,
    signupForNewsletter: false,  // You can assign the correct value if needed.
    faq: false,
    inPersonEventsWebinars: false,
    promotionsGiveaways: false,
    reviewsTestimonials: false,
    productDemos: false,
    liveChatAgent: false,
    freeTrialsServiceTryOut: false,
    personalizedAds: false
  },
  action: {
    emailOnboardingSalesAutomation: false,
    consultationCall: true,
    signupForService: false,
    purchase: false
  },
  loyalty: {
    events: false,
    loyaltyPrograms: false,
    betaAccess: false,
    specialDealsPromotions: false,
    customerReferralPrograms: false
  }
};

export const GET = async (req: Request) => {
  
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {

    pusher.trigger("progress-channel", "update", {
      progress: 0, message: 'Starting analysis'
    });

    pusher.trigger("progress-channel", "update", {
      progress: 10, message: 'Fetched initial URL'    
    });

    const siteAnalyticsURL = `https://data.similarweb.com/api/v1/data?domain=${url.replace('https://','')}`

    const siteAnalytics = await fetch(siteAnalyticsURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
    })

    pusher.trigger("progress-channel", "update", {
      progress: 20, message: 'Fetched site analytics'  
    });

    const siteAnalyticsData:any = await siteAnalytics.json();

    const chatStream = await client.chat.completions.create({
      messages: [{ role: 'user', content: chatPrompt(url)}],
      model: 'gpt-3.5-turbo',
      stream: true,
    });

    console.log(chatStream)

    pusher.trigger("progress-channel", "update", {
      progress: 30, message: 'Performing Full Deep Dive' 
    });

    let responseString = '';

    for await (const chunk of chatStream) {
      if (chunk.choices[0]?.delta?.content){
        if (chunk.choices[0]?.delta?.content === '\n') {
          continue;
        }
        responseString += chunk.choices[0]?.delta?.content
      }
    }

    let parsedResponse;
    console.log('Raw response:', responseString);
    try {


      parsedResponse = JSON.parse(responseString);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw response:', responseString);
      return NextResponse.json({ error: 'Failed to parse the response' }, { status: 500 });
    }

    // @ts-ignore
    pusher.trigger("progress-channel", "update", {
      progress: 60, message: 'Generating Competitor Analysis'
    });

    // console.log(parsedResponse.competitors)
    let competitorsArray = [...parsedResponse.competitors]

    const access_info = {
        secret_key: process.env.MAIN_AWS_SECRET_ACCESS_KEY_MAIN,
        access_key: process.env.MAIN_AWS_ACCESS_KEY_ID_MAIN,
    };
    
    const service_info = {
        region: process.env.MAIN_AWS_REGION_US,
        service: 'lambda',
    };

    const request = {
        url: `https://lambda.${service_info.region}.amazonaws.com/2015-03-31/functions/screenshot/invocations`
    };

    //const signedRequest = Signer.sign(request, access_info, service_info);


    let screenshot:any = await fetch(request.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url:url }),
    });

    const capturedShot = await screenshot.json();

    // let screenshot = await captureScreenshot(url);
    parsedResponse.domain = url;
    parsedResponse.screenshot = capturedShot.screenshot
    parsedResponse.competitors = competitorsArray

    const transformedData = transformStages(marketingStages);


    parsedResponse = {...parsedResponse, ...transformedData}

    //console.log(siteAnalyticsData)
    // console.log(siteAnalyticsData["Engagments"])
    if (typeof siteAnalyticsData === 'object' && siteAnalyticsData !== null) {
      parsedResponse["siteData"].bounceRate = siteAnalyticsData["Engagments"]?.BounceRate
      parsedResponse["siteData"].avgMonthlyVisitors = Object.values(siteAnalyticsData["EstimatedMonthlyVisits"] as Record<string, number>).reduce((sum: number, visits: number) => sum + visits, 0) / Object.keys(siteAnalyticsData["EstimatedMonthlyVisits"] as Record<string, number>).length
      parsedResponse["siteData"].conversionRate = siteAnalyticsData["Engagments"]?.TimeOnSite
    }

    pusher.trigger("progress-channel", "update", {
      progress: 70, message: "Sifting thru meta data"
    });

    pusher.trigger("progress-channel", "update", {
      progress: 90, message: "Finalizing site findings"
    });

    var logo_binary = Buffer.from(capturedShot.screenshot, 'base64');

    const documentData = {
        ...parsedResponse,
        brand_logo: {
          _type: "image",
          source: logo_binary,
          format: 'image/png',
          height: 400,
          altText: "Brand Logo", // Optional
        },
        brand_slogan: "",
        targetPersona:"",
        industry: "",
        brand_oppurtunities: ""
    };

    //console.log(documentData)

    // 1. read template file
    const templateFile = fs.readFileSync('./src/lib/templates/web-report-template.docx');
  
    const handler = new TemplateHandler();
    let flatData = unnest(documentData)
    const doc = await handler.process(templateFile, {...flatData});

    var scannedDomain = url.replace(/^https?\:\/\//i, "").replace(/\.com$/, "");

    const fileName = `web-report-${scannedDomain}.docx`;
    const data = await UploadDoc(doc, fileName);

    //console.log(data)

    pusher.trigger("progress-channel", "update", {
      progress: 100, message: "Analysis complete"
    });

    parsedResponse = {...parsedResponse, report_url: `https://ux-prospector.s3.us-east-2.amazonaws.com/${fileName}`}
    return NextResponse.json({"response": parsedResponse}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to analyze the site', details:error}, { status: 500 });
  }

};
export async function POST(request: Request) {
    try {
      const body = await request.json();

      const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_API_KEY })

      const contactObj = {
        properties: {
            firstname: body.firstName,
            lastname: body.lastName,
            email: body.email,
            phone: body.phoneNumber,
        },
      }
      const companyObj = {
          properties: {
              domain: body.domain,
              name: body.companyName,
          },
      }

      let createContactResponse;
      try {
        createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);
      } catch (error:any) {
        if (error.statusCode === 409) {
          // Contact already exists, fetch the existing contact
          const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: body.email
              }]
            }]
          });
          createContactResponse = searchResponse.results[0];
        }
      }

      const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(companyObj)


      return NextResponse.json({ success: true, data: { contact: createContactResponse, company: createCompanyResponse } }, { status: 200 });
    } catch (error) {
      console.error('Error submitting to Hubspot API:', error);
      return NextResponse.json({ error: 'Failed to submit data to Hubspot API' }, { status: 500 });
    }
}


function unnest(docData:any) {
  var res:any = {};
  (function recurse(obj, current) {
    for (var key in obj) {
      var value:any = obj[key];
      var newKey:any = (current ? current + "." + key : key);  // joined key with dot
      if (value && typeof value === "object" && key !== "brand_logo") {
        if (Array.isArray(value)) {
          res[newKey] = value.map(function(e) { 
            if(typeof e == 'object') {
              return unnest(e)
            } else {
              return e
            }
          })
        } else {
          recurse(value, newKey);  // it's a nested object, so do it again
        }
      } else {
        res[newKey] = value;  // it's not an object, so set the property
      }
    }
  })(docData);
  return res
}


function transformStages(stages:any) {
  const result:any = {};

  for (const stage in stages) {
    result[stage] = [];

    for (const key in stages[stage]) {
      const isActive = stages[stage][key];
      result[stage].push({
        visible: isActive,
        invisible: !isActive,
        name: key
          .replace(/([A-Z])/g, ' $1')  // Add a space before capital letters
          .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
      });
    }
  }

  return result;
}