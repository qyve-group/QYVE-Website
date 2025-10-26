// Web Crawl Content Integration Types and Interfaces
// Comprehensive content aggregation system for QYVE

export interface ContentSource {
  id: string;
  name: string;
  url: string;
  category: 'futsal' | 'sports' | 'ecommerce' | 'general';
  country: string;
  language: string;
  crawlUrl: string;
  selectors: {
    articleContainer: string;
    title: string;
    content: string;
    author?: string;
    publishDate: string;
    image?: string;
    link: string;
  };
  pagination?: {
    nextPage: string;
    maxPages: number;
  };
  rateLimit: {
    delay: number; // milliseconds between requests
    maxRequestsPerHour: number;
  };
  isActive: boolean;
  lastCrawled?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrawledArticle {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  content: string;
  excerpt: string;
  author?: string;
  publishDate: string;
  crawlDate: string;
  imageUrl?: string;
  originalUrl: string;
  category: string;
  tags: string[];
  language: string;
  country: string;
  isProcessed: boolean;
  isPublished: boolean;
  qualityScore: number; // 0-100 based on content quality
  relevanceScore: number; // 0-100 based on relevance to QYVE
  createdAt: string;
  updatedAt: string;
}

export interface CrawlJob {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  articlesFound: number;
  articlesProcessed: number;
  articlesPublished: number;
  errors: string[];
  logs: string[];
  createdAt: string;
}

export interface ContentFilter {
  id: string;
  name: string;
  keywords: string[];
  excludeKeywords: string[];
  categories: string[];
  minQualityScore: number;
  minRelevanceScore: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CrawlStats {
  totalSources: number;
  activeSources: number;
  totalArticles: number;
  publishedArticles: number;
  lastCrawlDate: string;
  averageQualityScore: number;
  averageRelevanceScore: number;
  topSources: Array<{
    sourceId: string;
    sourceName: string;
    articleCount: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
}

// Trusted sources for futsal/sports/ecommerce content
export const TRUSTED_SOURCES: ContentSource[] = [
  // Futsal Sources
  {
    id: 'futsal-malaysia',
    name: 'Futsal Malaysia',
    url: 'https://futsalmalaysia.com',
    category: 'futsal',
    country: 'Malaysia',
    language: 'en',
    crawlUrl: 'https://futsalmalaysia.com/news',
    selectors: {
      articleContainer: '.article-item',
      title: 'h2 a',
      content: '.article-excerpt',
      author: '.author',
      publishDate: '.publish-date',
      image: 'img',
      link: 'h2 a'
    },
    pagination: {
      nextPage: '.next-page',
      maxPages: 10
    },
    rateLimit: {
      delay: 2000,
      maxRequestsPerHour: 30
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'futsal-indonesia',
    name: 'Futsal Indonesia',
    url: 'https://futsalindonesia.com',
    category: 'futsal',
    country: 'Indonesia',
    language: 'id',
    crawlUrl: 'https://futsalindonesia.com/berita',
    selectors: {
      articleContainer: '.news-item',
      title: '.news-title a',
      content: '.news-summary',
      author: '.news-author',
      publishDate: '.news-date',
      image: '.news-image img',
      link: '.news-title a'
    },
    pagination: {
      nextPage: '.pagination-next',
      maxPages: 15
    },
    rateLimit: {
      delay: 3000,
      maxRequestsPerHour: 20
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Sports Sources
  {
    id: 'espn-southeast-asia',
    name: 'ESPN Southeast Asia',
    url: 'https://www.espn.com/soccer/',
    category: 'sports',
    country: 'Regional',
    language: 'en',
    crawlUrl: 'https://www.espn.com/soccer/',
    selectors: {
      articleContainer: '.contentItem__contentWrapper',
      title: '.contentItem__title a',
      content: '.contentItem__subhead',
      author: '.contentItem__author',
      publishDate: '.contentItem__timestamp',
      image: '.contentItem__image img',
      link: '.contentItem__title a'
    },
    pagination: {
      nextPage: '.pagination-next',
      maxPages: 5
    },
    rateLimit: {
      delay: 5000,
      maxRequestsPerHour: 12
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'goal-southeast-asia',
    name: 'Goal Southeast Asia',
    url: 'https://www.goal.com/en-sg',
    category: 'sports',
    country: 'Singapore',
    language: 'en',
    crawlUrl: 'https://www.goal.com/en-sg/news',
    selectors: {
      articleContainer: '.widget-news-item',
      title: '.widget-news-item__title a',
      content: '.widget-news-item__summary',
      author: '.widget-news-item__author',
      publishDate: '.widget-news-item__date',
      image: '.widget-news-item__image img',
      link: '.widget-news-item__title a'
    },
    pagination: {
      nextPage: '.pagination-next',
      maxPages: 8
    },
    rateLimit: {
      delay: 4000,
      maxRequestsPerHour: 15
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // E-commerce Sources
  {
    id: 'lazada-sports-blog',
    name: 'Lazada Sports Blog',
    url: 'https://www.lazada.com.my/blog/sports',
    category: 'ecommerce',
    country: 'Malaysia',
    language: 'en',
    crawlUrl: 'https://www.lazada.com.my/blog/sports',
    selectors: {
      articleContainer: '.blog-post',
      title: '.blog-post-title a',
      content: '.blog-post-excerpt',
      author: '.blog-post-author',
      publishDate: '.blog-post-date',
      image: '.blog-post-image img',
      link: '.blog-post-title a'
    },
    pagination: {
      nextPage: '.pagination-next',
      maxPages: 5
    },
    rateLimit: {
      delay: 6000,
      maxRequestsPerHour: 10
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'shopee-sports-guide',
    name: 'Shopee Sports Guide',
    url: 'https://shopee.com.my/blog/sports',
    category: 'ecommerce',
    country: 'Malaysia',
    language: 'en',
    crawlUrl: 'https://shopee.com.my/blog/sports',
    selectors: {
      articleContainer: '.article-card',
      title: '.article-title a',
      content: '.article-summary',
      author: '.article-author',
      publishDate: '.article-date',
      image: '.article-image img',
      link: '.article-title a'
    },
    pagination: {
      nextPage: '.load-more',
      maxPages: 6
    },
    rateLimit: {
      delay: 5000,
      maxRequestsPerHour: 12
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Content filters for quality control
export const DEFAULT_FILTERS: ContentFilter[] = [
  {
    id: 'futsal-content',
    name: 'Futsal Content Filter',
    keywords: ['futsal', 'indoor football', 'five-a-side', 'futsal shoes', 'futsal ball'],
    excludeKeywords: ['football', 'soccer', 'outdoor', 'grass'],
    categories: ['futsal'],
    minQualityScore: 60,
    minRelevanceScore: 70,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sports-equipment',
    name: 'Sports Equipment Filter',
    keywords: ['sports equipment', 'athletic gear', 'training equipment', 'sports shoes', 'jerseys'],
    excludeKeywords: ['betting', 'gambling', 'casino'],
    categories: ['sports', 'ecommerce'],
    minQualityScore: 50,
    minRelevanceScore: 60,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'qyve-relevant',
    name: 'QYVE Relevant Content',
    keywords: ['QYVE', 'recovery', 'comfort', 'athletic wear', 'sports apparel', 'training gear'],
    excludeKeywords: ['competitor brands', 'negative reviews'],
    categories: ['futsal', 'sports', 'ecommerce'],
    minQualityScore: 70,
    minRelevanceScore: 80,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Utility functions
export const calculateQualityScore = (article: Partial<CrawledArticle>): number => {
  let score = 0;
  
  // Title quality (20 points)
  if (article.title && article.title.length > 10 && article.title.length < 100) {
    score += 20;
  }
  
  // Content quality (30 points)
  if (article.content && article.content.length > 100) {
    score += 30;
  }
  
  // Image presence (10 points)
  if (article.imageUrl) {
    score += 10;
  }
  
  // Author presence (10 points)
  if (article.author) {
    score += 10;
  }
  
  // Publish date recency (20 points)
  if (article.publishDate) {
    const publishDate = new Date(article.publishDate);
    const daysSincePublish = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublish <= 7) score += 20;
    else if (daysSincePublish <= 30) score += 15;
    else if (daysSincePublish <= 90) score += 10;
    else score += 5;
  }
  
  // Language and country relevance (10 points)
  if (article.language === 'en' || article.country === 'Malaysia') {
    score += 10;
  }
  
  return Math.min(score, 100);
};

export const calculateRelevanceScore = (article: Partial<CrawledArticle>, filters: ContentFilter[]): number => {
  let score = 0;
  const title = article.title?.toLowerCase() || '';
  const content = article.content?.toLowerCase() || '';
  const combinedText = `${title} ${content}`;
  
  filters.forEach(filter => {
    if (!filter.isActive) return;
    
    // Check keywords
    const keywordMatches = filter.keywords.filter(keyword => 
      combinedText.includes(keyword.toLowerCase())
    ).length;
    
    // Check exclude keywords
    const excludeMatches = filter.excludeKeywords.filter(keyword => 
      combinedText.includes(keyword.toLowerCase())
    ).length;
    
    if (excludeMatches > 0) {
      score -= 20; // Penalty for excluded keywords
    } else {
      score += (keywordMatches / filter.keywords.length) * 50;
    }
  });
  
  return Math.max(0, Math.min(score, 100));
};

export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content;
  
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export const extractTags = (title: string, content: string): string[] => {
  const text = `${title} ${content}`.toLowerCase();
  const commonTags = [
    'futsal', 'football', 'soccer', 'sports', 'training', 'equipment',
    'shoes', 'jerseys', 'apparel', 'gear', 'fitness', 'athletic',
    'recovery', 'comfort', 'performance', 'indoor', 'outdoor'
  ];
  
  return commonTags.filter(tag => text.includes(tag));
};
