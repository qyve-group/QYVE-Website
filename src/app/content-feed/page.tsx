'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Tag, Globe, Star, RefreshCw } from 'lucide-react';
import { CrawledArticlesGrid, CrawledArticlesList } from '@/components/CrawledArticleCard';
import type { CrawledArticle } from '@/data/web-crawl-types';

const ContentFeedPage = () => {
  const [articles, setArticles] = useState<CrawledArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'relevance' | 'quality'>('date');
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - in production, this would fetch from API
      const mockArticles: CrawledArticle[] = [
        {
          id: 'article-1',
          sourceId: 'futsal-malaysia',
          sourceName: 'Futsal Malaysia',
          title: 'QYVE Infinitus: The Perfect Futsal Shoe for Malaysian Players',
          content: 'The QYVE Infinitus has been gaining popularity among Malaysian futsal players for its superior grip and comfort. This comprehensive review covers everything you need to know about this innovative futsal shoe.',
          excerpt: 'The QYVE Infinitus has been gaining popularity among Malaysian futsal players for its superior grip and comfort...',
          author: 'Ahmad Rahman',
          publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          crawlDate: new Date().toISOString(),
          imageUrl: '/images/qyve-infinitus-blog.jpg',
          originalUrl: 'https://futsalmalaysia.com/qyve-infinitus-review',
          category: 'futsal',
          tags: ['futsal', 'shoes', 'review', 'QYVE', 'Malaysia'],
          language: 'en',
          country: 'Malaysia',
          isProcessed: true,
          isPublished: true,
          qualityScore: 85,
          relevanceScore: 90,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'article-2',
          sourceId: 'espn-southeast-asia',
          sourceName: 'ESPN Southeast Asia',
          title: 'Southeast Asian Futsal Championship: Equipment Guide',
          content: 'As the Southeast Asian Futsal Championship approaches, players are looking for the best equipment. Here\'s a comprehensive guide to futsal gear that can give you the competitive edge.',
          excerpt: 'As the Southeast Asian Futsal Championship approaches, players are looking for the best equipment...',
          author: 'Sarah Lim',
          publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          crawlDate: new Date().toISOString(),
          imageUrl: '/images/futsal-championship.jpg',
          originalUrl: 'https://espn.com/southeast-asia/futsal-equipment-guide',
          category: 'sports',
          tags: ['futsal', 'championship', 'equipment', 'guide'],
          language: 'en',
          country: 'Regional',
          isProcessed: true,
          isPublished: true,
          qualityScore: 78,
          relevanceScore: 75,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'article-3',
          sourceId: 'lazada-sports-blog',
          sourceName: 'Lazada Sports Blog',
          title: 'Best Sports Recovery Gear for Athletes in 2025',
          content: 'Recovery is crucial for athletic performance. Discover the best recovery gear including compression wear, recovery slides, and other essential equipment for serious athletes.',
          excerpt: 'Recovery is crucial for athletic performance. Discover the best recovery gear including compression wear...',
          author: 'Dr. Michael Chen',
          publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          crawlDate: new Date().toISOString(),
          imageUrl: '/images/recovery-gear.jpg',
          originalUrl: 'https://lazada.com.my/blog/recovery-gear-2025',
          category: 'ecommerce',
          tags: ['recovery', 'athletic', 'gear', 'compression', 'slides'],
          language: 'en',
          country: 'Malaysia',
          isProcessed: true,
          isPublished: true,
          qualityScore: 82,
          relevanceScore: 85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      setArticles(mockArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSource = selectedSource === 'all' || article.sourceId === selectedSource;
      return matchesSearch && matchesCategory && matchesSource;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'quality':
          return b.qualityScore - a.qualityScore;
        default:
          return 0;
      }
    });

  const categories = ['all', ...new Set(articles.map(a => a.category))];
  const sources = ['all', ...new Set(articles.map(a => a.sourceName))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports & Futsal Content Feed</h1>
        <p className="text-gray-600">
          Stay updated with the latest news, reviews, and insights from trusted sports and futsal sources.
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sources.map(source => (
              <option key={source} value={source}>
                {source === 'all' ? 'All Sources' : source}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="relevance">Sort by Relevance</option>
            <option value="quality">Sort by Quality</option>
          </select>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
            </div>
            
            <button
              onClick={() => setShowScores(!showScores)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                showScores 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Star className="h-3 w-3" />
              {showScores ? 'Hide Scores' : 'Show Scores'}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedArticles.length} of {articles.length} articles
          </div>
        </div>
      </div>

      {/* Articles */}
      {filteredAndSortedArticles.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more content.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedSource('all');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <CrawledArticlesGrid 
              articles={filteredAndSortedArticles} 
              showSource={true}
              showScores={showScores}
            />
          ) : (
            <CrawledArticlesList 
              articles={filteredAndSortedArticles} 
              showSource={true}
              showScores={showScores}
            />
          )}
        </>
      )}

      {/* Load More Button */}
      {filteredAndSortedArticles.length > 0 && (
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Load More Articles
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          Content aggregated from trusted sports and futsal sources. 
          All articles are automatically crawled and filtered for quality and relevance.
        </p>
        <p className="mt-2">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ContentFeedPage;
