// Web Crawler Service for Content Integration
// Handles crawling, parsing, and processing of articles from trusted sources

import { 
  ContentSource, 
  CrawledArticle, 
  CrawlJob, 
  ContentFilter,
  TRUSTED_SOURCES,
  DEFAULT_FILTERS,
  calculateQualityScore,
  calculateRelevanceScore,
  generateExcerpt,
  extractTags
} from '@/data/web-crawl-types';

interface CrawlResult {
  success: boolean;
  articles: CrawledArticle[];
  errors: string[];
  stats: {
    totalFound: number;
    processed: number;
    published: number;
    skipped: number;
  };
}

class WebCrawlerService {
  private sources: ContentSource[] = TRUSTED_SOURCES;
  private filters: ContentFilter[] = DEFAULT_FILTERS;
  private activeJobs: Map<string, CrawlJob> = new Map();

  // Main crawling method
  async crawlSource(sourceId: string): Promise<CrawlResult> {
    const source = this.sources.find(s => s.id === sourceId);
    if (!source || !source.isActive) {
      throw new Error(`Source ${sourceId} not found or inactive`);
    }

    const job: CrawlJob = {
      id: `crawl-${sourceId}-${Date.now()}`,
      sourceId,
      status: 'running',
      startedAt: new Date().toISOString(),
      articlesFound: 0,
      articlesProcessed: 0,
      articlesPublished: 0,
      errors: [],
      logs: [],
      createdAt: new Date().toISOString()
    };

    this.activeJobs.set(job.id, job);

    try {
      this.log(job.id, `Starting crawl for source: ${source.name}`);
      
      // Fetch articles from source
      const articles = await this.fetchArticlesFromSource(source, job);
      
      // Process and filter articles
      const processedArticles = await this.processArticles(articles, source, job);
      
      // Update job status
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.articlesFound = articles.length;
      job.articlesProcessed = processedArticles.length;
      job.articlesPublished = processedArticles.filter(a => a.isPublished).length;

      this.log(job.id, `Crawl completed. Found: ${job.articlesFound}, Processed: ${job.articlesProcessed}, Published: ${job.articlesPublished}`);

      return {
        success: true,
        articles: processedArticles,
        errors: job.errors,
        stats: {
          totalFound: job.articlesFound,
          processed: job.articlesProcessed,
          published: job.articlesPublished,
          skipped: job.articlesFound - job.articlesProcessed
        }
      };

    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      this.log(job.id, `Crawl failed: ${error}`);
      
      return {
        success: false,
        articles: [],
        errors: job.errors,
        stats: {
          totalFound: 0,
          processed: 0,
          published: 0,
          skipped: 0
        }
      };
    }
  }

  // Fetch articles from a specific source
  private async fetchArticlesFromSource(source: ContentSource, job: CrawlJob): Promise<Partial<CrawledArticle>[]> {
    const articles: Partial<CrawledArticle>[] = [];
    let currentPage = 1;
    const maxPages = source.pagination?.maxPages || 5;

    try {
      while (currentPage <= maxPages) {
        this.log(job.id, `Fetching page ${currentPage} from ${source.name}`);
        
        const pageUrl = currentPage === 1 ? source.crawlUrl : `${source.crawlUrl}?page=${currentPage}`;
        const response = await this.fetchPage(pageUrl, source);
        
        if (!response.success) {
          this.log(job.id, `Failed to fetch page ${currentPage}: ${response.error}`);
          break;
        }

        const pageArticles = this.parseArticlesFromHTML(response.html, source, job);
        articles.push(...pageArticles);

        this.log(job.id, `Found ${pageArticles.length} articles on page ${currentPage}`);
        
        // Rate limiting
        await this.delay(source.rateLimit.delay);
        
        currentPage++;
        
        // Break if no articles found on current page
        if (pageArticles.length === 0) {
          break;
        }
      }

    } catch (error) {
      this.log(job.id, `Error fetching articles: ${error}`);
      job.errors.push(`Error fetching articles: ${error}`);
    }

    return articles;
  }

  // Fetch a single page
  private async fetchPage(url: string, source: ContentSource): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'QYVE-ContentBot/1.0 (Content Aggregation Bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
        timeout: 30000
      });

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }

      const html = await response.text();
      return { success: true, html };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown fetch error' 
      };
    }
  }

  // Parse articles from HTML content
  private parseArticlesFromHTML(html: string, source: ContentSource, job: CrawlJob): Partial<CrawledArticle>[] {
    const articles: Partial<CrawledArticle>[] = [];
    
    try {
      // Simple HTML parsing (in a real implementation, you'd use a proper HTML parser)
      const articleMatches = html.match(new RegExp(source.selectors.articleContainer, 'g'));
      
      if (!articleMatches) {
        this.log(job.id, 'No articles found matching container selector');
        return articles;
      }

      articleMatches.forEach((match, index) => {
        try {
          const article = this.extractArticleData(match, source, index);
          if (article) {
            articles.push(article);
          }
        } catch (error) {
          this.log(job.id, `Error parsing article ${index}: ${error}`);
        }
      });

    } catch (error) {
      this.log(job.id, `Error parsing HTML: ${error}`);
      job.errors.push(`Error parsing HTML: ${error}`);
    }

    return articles;
  }

  // Extract article data from HTML snippet
  private extractArticleData(htmlSnippet: string, source: ContentSource, index: number): Partial<CrawledArticle> | null {
    try {
      // Extract title
      const titleMatch = htmlSnippet.match(new RegExp(source.selectors.title + '[^>]*>([^<]+)', 'i'));
      const title = titleMatch ? titleMatch[1].trim() : null;

      // Extract content/excerpt
      const contentMatch = htmlSnippet.match(new RegExp(source.selectors.content + '[^>]*>([^<]+)', 'i'));
      const content = contentMatch ? contentMatch[1].trim() : '';

      // Extract author
      const authorMatch = htmlSnippet.match(new RegExp(source.selectors.author + '[^>]*>([^<]+)', 'i'));
      const author = authorMatch ? authorMatch[1].trim() : undefined;

      // Extract publish date
      const dateMatch = htmlSnippet.match(new RegExp(source.selectors.publishDate + '[^>]*>([^<]+)', 'i'));
      const publishDate = dateMatch ? this.parseDate(dateMatch[1].trim()) : new Date().toISOString();

      // Extract image URL
      const imageMatch = htmlSnippet.match(new RegExp(source.selectors.image + '[^>]*src="([^"]+)"', 'i'));
      const imageUrl = imageMatch ? this.resolveUrl(imageMatch[1], source.url) : undefined;

      // Extract article link
      const linkMatch = htmlSnippet.match(new RegExp(source.selectors.link + '[^>]*href="([^"]+)"', 'i'));
      const originalUrl = linkMatch ? this.resolveUrl(linkMatch[1], source.url) : '';

      if (!title || !content) {
        return null; // Skip articles without title or content
      }

      return {
        sourceId: source.id,
        sourceName: source.name,
        title,
        content,
        excerpt: generateExcerpt(content),
        author,
        publishDate,
        crawlDate: new Date().toISOString(),
        imageUrl,
        originalUrl,
        category: source.category,
        tags: extractTags(title, content),
        language: source.language,
        country: source.country,
        isProcessed: false,
        isPublished: false,
        qualityScore: 0, // Will be calculated later
        relevanceScore: 0, // Will be calculated later
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error extracting article data:', error);
      return null;
    }
  }

  // Process and filter articles
  private async processArticles(
    articles: Partial<CrawledArticle>[], 
    source: ContentSource, 
    job: CrawlJob
  ): Promise<CrawledArticle[]> {
    const processedArticles: CrawledArticle[] = [];

    for (const article of articles) {
      try {
        // Calculate quality and relevance scores
        const qualityScore = calculateQualityScore(article);
        const relevanceScore = calculateRelevanceScore(article, this.filters);

        // Apply filters
        const passesFilters = this.passesFilters(article, qualityScore, relevanceScore);

        const processedArticle: CrawledArticle = {
          id: `article-${source.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sourceId: article.sourceId!,
          sourceName: article.sourceName!,
          title: article.title!,
          content: article.content!,
          excerpt: article.excerpt!,
          author: article.author,
          publishDate: article.publishDate!,
          crawlDate: article.crawlDate!,
          imageUrl: article.imageUrl,
          originalUrl: article.originalUrl!,
          category: article.category!,
          tags: article.tags!,
          language: article.language!,
          country: article.country!,
          isProcessed: true,
          isPublished: passesFilters,
          qualityScore,
          relevanceScore,
          createdAt: article.createdAt!,
          updatedAt: new Date().toISOString()
        };

        processedArticles.push(processedArticle);

        if (passesFilters) {
          this.log(job.id, `Article published: ${article.title}`);
        } else {
          this.log(job.id, `Article filtered out: ${article.title} (Quality: ${qualityScore}, Relevance: ${relevanceScore})`);
        }

      } catch (error) {
        this.log(job.id, `Error processing article: ${error}`);
        job.errors.push(`Error processing article: ${error}`);
      }
    }

    return processedArticles;
  }

  // Check if article passes all filters
  private passesFilters(article: Partial<CrawledArticle>, qualityScore: number, relevanceScore: number): boolean {
    return this.filters.some(filter => {
      if (!filter.isActive) return false;
      
      return qualityScore >= filter.minQualityScore && 
             relevanceScore >= filter.minRelevanceScore;
    });
  }

  // Utility methods
  private parseDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  private resolveUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) {
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${url}`;
    }
    return `${baseUrl}/${url}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(jobId: string, message: string): void {
    const job = this.activeJobs.get(jobId);
    if (job) {
      job.logs.push(`${new Date().toISOString()}: ${message}`);
    }
    console.log(`[Crawler ${jobId}] ${message}`);
  }

  // Public methods for managing crawler
  async crawlAllActiveSources(): Promise<CrawlResult[]> {
    const activeSources = this.sources.filter(s => s.isActive);
    const results: CrawlResult[] = [];

    for (const source of activeSources) {
      try {
        const result = await this.crawlSource(source.id);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          articles: [],
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          stats: { totalFound: 0, processed: 0, published: 0, skipped: 0 }
        });
      }
    }

    return results;
  }

  getActiveJobs(): CrawlJob[] {
    return Array.from(this.activeJobs.values());
  }

  getJob(jobId: string): CrawlJob | undefined {
    return this.activeJobs.get(jobId);
  }

  getSources(): ContentSource[] {
    return this.sources;
  }

  getFilters(): ContentFilter[] {
    return this.filters;
  }

  addSource(source: ContentSource): void {
    this.sources.push(source);
  }

  updateSource(sourceId: string, updates: Partial<ContentSource>): boolean {
    const index = this.sources.findIndex(s => s.id === sourceId);
    if (index === -1) return false;
    
    this.sources[index] = { ...this.sources[index], ...updates, updatedAt: new Date().toISOString() };
    return true;
  }

  deleteSource(sourceId: string): boolean {
    const index = this.sources.findIndex(s => s.id === sourceId);
    if (index === -1) return false;
    
    this.sources.splice(index, 1);
    return true;
  }
}

// Export singleton instance
export const webCrawlerService = new WebCrawlerService();
export default webCrawlerService;
