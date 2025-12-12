/* eslint-disable no-unused-vars */
// contexts/app.ts

'use client';

import type React from 'react';
import { createContext, useState, useContext } from 'react';

type Props = {
  children: React.ReactNode;
};

interface ReportData {
  overallGrade: string;
  gradeScore: number;
  generatedDate: string;
  screenshot: string;
  siteData: {
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
  };
  detailedReports: {
    keywords: {
      directSearch: string[];
      contextual: string[];
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
      pageSize: number;
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
    thumbnail: string;
    url: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
  }>;
  seoSpiderData?: {
    score: number;
    meta: {
      title: string;
      description: string;
      keywords: string;
      viewport: string;
      robots: string;
      canonical: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      twitterCard: string;
      language: string;
    };
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
      h4: string[];
      h5: string[];
      h6: string[];
      h1Count: number;
      hasMultipleH1: boolean;
      missingH1: boolean;
    };
    links: {
      internalCount: number;
      externalCount: number;
      brokenCount: number;
      nofollowCount: number;
      broken: string[];
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
      missingAltPercentage: number;
    };
    technical: {
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
    };
    performance: {
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
    };
    content: {
      wordCount: number;
      uniqueWords: number;
      readingTime: number;
      paragraphCount: number;
      textToHtmlRatio: number;
    };
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      category: string;
      message: string;
      recommendation: string;
    }>;
  };
}

const initialReportData: ReportData = {
  overallGrade: 'C+',
  gradeScore: 3.3,
  generatedDate: new Date()
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-'),
  screenshot: 'https://via.placeholder.com/300x200',
  siteData: {
    avgMonthlyVisitors: '0.00',
    bounceRate: '0.00',
    conversionRate: '0.00',
  },
  sectionGrades: {
    beauty: {
      grade: 'B-',
      score: 2.7,
      description:
        "Your website's visual appeal is good, but there's room for improvement.",
    },
    content: {
      grade: 'B+',
      score: 3.3,
      description: 'Your content is well-written and informative.',
    },
    design: {
      grade: 'B',
      score: 3.0,
      description:
        "Your website's design is good, but there's potential for improvement.",
    },
    performance: {
      grade: 'C-',
      score: 1.7,
      description: "Your website's performance could be improved.",
    },
    security: {
      grade: 'B+',
      score: 3.3,
      description: 'Your website has good security measures in place.',
    },
    seo: {
      grade: 'B-',
      score: 2.7,
      description: 'Your SEO could use some work.',
    },
    webStandards: {
      grade: 'A-',
      score: 3.7,
      description: 'Your website adheres well to web standards.',
    },
    accessibility: {
      grade: 'B',
      score: 3.0,
      description:
        "Your website has good accessibility, but there's room for improvement.",
    },
  },
  detailedReports: {
    keywords: { directSearch: [], contextual: [] },
    seo: {
      robotsTxt: '',
      indexable: true,
      redirects: [],
      meta: { title: '', description: '' },
      searchEngineRanking: 0,
    },
    performance: {
      cookies: 0,
      javascriptFiles: 0,
      cssFiles: 0,
      pageSize: 0,
    },
    content: {
      grammaticalErrors: 0,
      wordCount: 0,
      uniqueWords: 0,
      images: 0,
      videos: 0,
      backlinks: 0,
      language: '',
    },
  },
  competitors: [],
  recommendations: [],
};

const appContextDefaultValues: AppContextType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNum: '',
  reportDownloadLink: '',
  domainLink: '',
  reportData: initialReportData,
  setDomainLink: () => {},
  setReportDownloadLink: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setEmail: () => {},
  setPhoneNum: () => {},
  setReportData: () => {},
};

export const AppContext = createContext<AppContextType>(
  appContextDefaultValues
);

interface AppContextType {
  firstName: string;
  lastName: string;
  email: string;
  reportDownloadLink: string;
  domainLink: string;
  phoneNum: string;
  reportData: ReportData;
  setDomainLink: (link: string) => void;
  setReportDownloadLink: (link: string) => void;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhoneNum: (phone: string) => void;
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>;
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [reportDownloadLink, setReportDownloadLink] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [domainLink, setDomainLink] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [reportData, setReportData] = useState<ReportData>(initialReportData);

  const contextValue = {
    firstName,
    lastName,
    email,
    reportDownloadLink,
    domainLink,
    phoneNum,
    reportData,
    setPhoneNum,
    setDomainLink,
    setReportDownloadLink,
    setFirstName,
    setLastName,
    setEmail,
    setReportData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
// export default useContext(AppContext);

export function useApp() {
  return useContext(AppContext);
}
