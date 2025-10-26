'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  BarChart3, 
  Globe, 
  Filter,
  Search,
  Calendar,
  Tag,
  Star,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { CrawledArticlesGrid } from '@/components/CrawledArticleCard';
import type { ContentSource, CrawledArticle, CrawlJob, CrawlStats } from '@/data/web-crawl-types';

const WebCrawlAdminPage = () => {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [articles, setArticles] = useState<CrawledArticle[]>([]);
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [stats, setStats] = useState<CrawlStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sources' | 'articles' | 'jobs' | 'stats'>('sources');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load sources
      const sourcesResponse = await fetch('/api/web-crawl?action=sources');
      const sourcesData = await sourcesResponse.json();
      setSources(sourcesData.sources || []);

      // Load stats
      const statsResponse = await fetch('/api/web-crawl?action=stats');
      const statsData = await statsResponse.json();
      setStats(statsData.stats || null);

      // Load jobs
      const jobsResponse = await fetch('/api/web-crawl?action=jobs');
      const jobsData = await jobsResponse.json();
      setJobs(jobsData.jobs || []);

      // Load articles (mock data for now)
      setArticles([]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCrawl = async (sourceId?: string) => {
    try {
      const response = await fetch('/api/web-crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: sourceId ? 'crawl-source' : 'crawl-all',
          sourceId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        loadData(); // Reload data
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error starting crawl:', error);
      alert('Error starting crawl');
    }
  };

  const toggleSource = async (sourceId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/web-crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-source',
          sourceId,
          updates: { isActive }
        })
      });

      const data = await response.json();
      if (data.success) {
        loadData(); // Reload data
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating source:', error);
      alert('Error updating source');
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(articles.map(a => a.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading web crawl data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Web Crawl Content Management</h1>
        <p className="text-gray-600">
          Manage content sources, monitor crawling jobs, and review aggregated articles.
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sources</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSources}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSources}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedArticles}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => startCrawl()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="h-4 w-4" />
          Crawl All Sources
        </button>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
        <button
          onClick={() => setShowScores(!showScores)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showScores 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Star className="h-4 w-4" />
          {showScores ? 'Hide Scores' : 'Show Scores'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'sources', label: 'Content Sources', icon: Globe },
              { id: 'articles', label: 'Articles', icon: BarChart3 },
              { id: 'jobs', label: 'Crawl Jobs', icon: RefreshCw },
              { id: 'stats', label: 'Statistics', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Content Sources</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Source
            </button>
          </div>

          <div className="grid gap-6">
            {sources.map((source) => (
              <div key={source.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-600">{source.url}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        source.category === 'futsal' ? 'bg-blue-100 text-blue-800' :
                        source.category === 'sports' ? 'bg-green-100 text-green-800' :
                        source.category === 'ecommerce' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {source.category}
                      </span>
                      <span className="text-xs text-gray-500">{source.country}</span>
                      <span className="text-xs text-gray-500">{source.language}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startCrawl(source.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-3 w-3" />
                      Crawl
                    </button>
                    <button
                      onClick={() => toggleSource(source.id, !source.isActive)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                        source.isActive
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {source.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {source.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors">
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Rate Limit:</strong> {source.rateLimit.delay}ms delay, {source.rateLimit.maxRequestsPerHour} requests/hour</p>
                  <p><strong>Last Crawled:</strong> {source.lastCrawled ? new Date(source.lastCrawled).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
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
            </div>
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
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>

          <CrawledArticlesGrid 
            articles={filteredArticles} 
            showSource={true}
            showScores={showScores}
          />
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Crawl Jobs</h2>
          
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No crawl jobs found</p>
              <p className="text-sm text-gray-400">Start a crawl to see job history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Crawl Job: {job.sourceId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Started: {job.startedAt ? new Date(job.startedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Articles Found</p>
                      <p className="font-semibold">{job.articlesFound}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Articles Processed</p>
                      <p className="font-semibold">{job.articlesProcessed}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Articles Published</p>
                      <p className="font-semibold">{job.articlesPublished}</p>
                    </div>
                  </div>

                  {job.errors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-red-600 mb-2">Errors:</p>
                      <ul className="text-sm text-red-600 space-y-1">
                        {job.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sources</h3>
              <div className="space-y-2">
                {stats.topSources.map((source, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{source.sourceName}</span>
                    <span className="font-semibold">{source.articleCount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
              <div className="space-y-2">
                {stats.categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{category.category}</span>
                    <span className="font-semibold">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Average Quality Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageQualityScore}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Relevance Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRelevanceScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebCrawlAdminPage;
