import { NextRequest, NextResponse } from 'next/server';
import webCrawlerService from '@/services/webCrawlerService';
import { supabase } from '@/libs/supabaseClient';

// GET /api/web-crawl/sources - Get all content sources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'sources':
        const sources = webCrawlerService.getSources();
        return NextResponse.json({ sources });

      case 'filters':
        const filters = webCrawlerService.getFilters();
        return NextResponse.json({ filters });

      case 'jobs':
        const jobs = webCrawlerService.getActiveJobs();
        return NextResponse.json({ jobs });

      case 'stats':
        const stats = await getCrawlStats();
        return NextResponse.json({ stats });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Web crawl API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/web-crawl/crawl - Start crawling
export async function POST(request: NextRequest) {
  try {
    const { sourceId, action } = await request.json();

    switch (action) {
      case 'crawl-source':
        if (!sourceId) {
          return NextResponse.json(
            { error: 'Source ID is required' },
            { status: 400 }
          );
        }

        const result = await webCrawlerService.crawlSource(sourceId);
        
        // Store articles in database
        if (result.success && result.articles.length > 0) {
          await storeArticlesInDatabase(result.articles);
        }

        return NextResponse.json({
          success: true,
          result,
          message: `Crawled ${result.articles.length} articles from source ${sourceId}`
        });

      case 'crawl-all':
        const results = await webCrawlerService.crawlAllActiveSources();
        
        // Store all articles in database
        const allArticles = results.flatMap(r => r.articles);
        if (allArticles.length > 0) {
          await storeArticlesInDatabase(allArticles);
        }

        return NextResponse.json({
          success: true,
          results,
          message: `Crawled ${allArticles.length} articles from ${results.length} sources`
        });

      case 'add-source':
        const { source } = await request.json();
        if (!source) {
          return NextResponse.json(
            { error: 'Source data is required' },
            { status: 400 }
          );
        }

        webCrawlerService.addSource(source);
        return NextResponse.json({
          success: true,
          message: 'Source added successfully'
        });

      case 'update-source':
        const { sourceId: updateSourceId, updates } = await request.json();
        if (!updateSourceId || !updates) {
          return NextResponse.json(
            { error: 'Source ID and updates are required' },
            { status: 400 }
          );
        }

        const updated = webCrawlerService.updateSource(updateSourceId, updates);
        if (!updated) {
          return NextResponse.json(
            { error: 'Source not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Source updated successfully'
        });

      case 'delete-source':
        const { sourceId: deleteSourceId } = await request.json();
        if (!deleteSourceId) {
          return NextResponse.json(
            { error: 'Source ID is required' },
            { status: 400 }
          );
        }

        const deleted = webCrawlerService.deleteSource(deleteSourceId);
        if (!deleted) {
          return NextResponse.json(
            { error: 'Source not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Source deleted successfully'
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Web crawl API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Store articles in Supabase database
async function storeArticlesInDatabase(articles: any[]) {
  try {
    const { error } = await supabase
      .from('crawled_articles')
      .upsert(articles, { 
        onConflict: 'original_url',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error storing articles:', error);
      throw error;
    }

    console.log(`Stored ${articles.length} articles in database`);
  } catch (error) {
    console.error('Database storage error:', error);
    throw error;
  }
}

// Get crawl statistics
async function getCrawlStats() {
  try {
    // Get articles count
    const { count: totalArticles, error: articlesError } = await supabase
      .from('crawled_articles')
      .select('*', { count: 'exact', head: true });

    if (articlesError) throw articlesError;

    // Get published articles count
    const { count: publishedArticles, error: publishedError } = await supabase
      .from('crawled_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    if (publishedError) throw publishedError;

    // Get sources count
    const sources = webCrawlerService.getSources();
    const activeSources = sources.filter(s => s.isActive);

    // Get category breakdown
    const { data: categoryData, error: categoryError } = await supabase
      .from('crawled_articles')
      .select('category')
      .eq('is_published', true);

    if (categoryError) throw categoryError;

    const categoryBreakdown = categoryData?.reduce((acc: any, article: any) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get top sources
    const { data: sourceData, error: sourceError } = await supabase
      .from('crawled_articles')
      .select('source_name')
      .eq('is_published', true);

    if (sourceError) throw sourceError;

    const sourceBreakdown = sourceData?.reduce((acc: any, article: any) => {
      acc[article.source_name] = (acc[article.source_name] || 0) + 1;
      return acc;
    }, {}) || {};

    const topSources = Object.entries(sourceBreakdown)
      .map(([sourceName, count]) => ({ sourceName, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    // Get last crawl date
    const { data: lastCrawlData, error: lastCrawlError } = await supabase
      .from('crawled_articles')
      .select('crawl_date')
      .order('crawl_date', { ascending: false })
      .limit(1);

    if (lastCrawlError) throw lastCrawlError;

    // Get average scores
    const { data: scoreData, error: scoreError } = await supabase
      .from('crawled_articles')
      .select('quality_score, relevance_score')
      .eq('is_published', true);

    if (scoreError) throw scoreError;

    const avgQualityScore = scoreData?.length > 0 
      ? scoreData.reduce((sum, article) => sum + article.quality_score, 0) / scoreData.length 
      : 0;

    const avgRelevanceScore = scoreData?.length > 0 
      ? scoreData.reduce((sum, article) => sum + article.relevance_score, 0) / scoreData.length 
      : 0;

    return {
      totalSources: sources.length,
      activeSources: activeSources.length,
      totalArticles: totalArticles || 0,
      publishedArticles: publishedArticles || 0,
      lastCrawlDate: lastCrawlData?.[0]?.crawl_date || null,
      averageQualityScore: Math.round(avgQualityScore * 100) / 100,
      averageRelevanceScore: Math.round(avgRelevanceScore * 100) / 100,
      topSources: topSources.map((s: any) => ({
        sourceId: s.sourceName.toLowerCase().replace(/\s+/g, '-'),
        sourceName: s.sourceName,
        articleCount: s.count
      })),
      categoryBreakdown: Object.entries(categoryBreakdown).map(([category, count]) => ({
        category,
        count
      }))
    };

  } catch (error) {
    console.error('Error getting crawl stats:', error);
    return {
      totalSources: 0,
      activeSources: 0,
      totalArticles: 0,
      publishedArticles: 0,
      lastCrawlDate: null,
      averageQualityScore: 0,
      averageRelevanceScore: 0,
      topSources: [],
      categoryBreakdown: []
    };
  }
}
