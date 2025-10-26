'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ExternalLink, Tag, Star, Globe } from 'lucide-react';
import type { CrawledArticle } from '@/data/web-crawl-types';

interface CrawledArticleCardProps {
  article: CrawledArticle;
  showSource?: boolean;
  showScores?: boolean;
  className?: string;
}

const CrawledArticleCard: React.FC<CrawledArticleCardProps> = ({
  article,
  showSource = true,
  showScores = false,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'futsal': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'ecommerce': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <article className={`group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}>
      {/* Article Image */}
      {article.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Source and Category */}
        <div className="mb-3 flex items-center gap-2">
          {showSource && (
            <span className="text-xs font-medium text-gray-500">
              {article.sourceName}
            </span>
          )}
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          {showScores && (
            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className={`flex items-center gap-1 ${getScoreColor(article.qualityScore)}`}>
                <Star className="h-3 w-3" />
                {article.qualityScore}
              </span>
              <span className={`flex items-center gap-1 ${getScoreColor(article.relevanceScore)}`}>
                <Globe className="h-3 w-3" />
                {article.relevanceScore}
              </span>
            </div>
          )}
        </div>

        {/* Article Title */}
        <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {/* Article Excerpt */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Article Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishDate)}
          </div>
          {article.author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {article.author}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {article.country}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                <Tag className="h-2 w-2" />
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read More
            <ExternalLink className="h-3 w-3" />
          </Link>
          
          <div className="text-xs text-gray-400">
            Crawled {formatDate(article.crawlDate)}
          </div>
        </div>
      </div>
    </article>
  );
};

interface CrawledArticlesGridProps {
  articles: CrawledArticle[];
  showSource?: boolean;
  showScores?: boolean;
  className?: string;
}

const CrawledArticlesGrid: React.FC<CrawledArticlesGridProps> = ({
  articles,
  showSource = true,
  showScores = false,
  className = ''
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Globe className="h-12 w-12 mx-auto mb-2" />
          <p>No articles found</p>
        </div>
        <p className="text-sm text-gray-400">
          Try adjusting your filters or check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {articles.map((article) => (
        <CrawledArticleCard
          key={article.id}
          article={article}
          showSource={showSource}
          showScores={showScores}
        />
      ))}
    </div>
  );
};

interface CrawledArticlesListProps {
  articles: CrawledArticle[];
  showSource?: boolean;
  showScores?: boolean;
  className?: string;
}

const CrawledArticlesList: React.FC<CrawledArticlesListProps> = ({
  articles,
  showSource = true,
  showScores = false,
  className = ''
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Globe className="h-12 w-12 mx-auto mb-2" />
          <p>No articles found</p>
        </div>
        <p className="text-sm text-gray-400">
          Try adjusting your filters or check back later for new content.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {articles.map((article) => (
        <div key={article.id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          {/* Article Image */}
          {article.imageUrl && (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="96px"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              {showSource && (
                <span className="text-xs font-medium text-gray-500">
                  {article.sourceName}
                </span>
              )}
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              {showScores && (
                <div className="ml-auto flex items-center gap-2 text-xs">
                  <span className={`flex items-center gap-1 ${getScoreColor(article.qualityScore)}`}>
                    <Star className="h-3 w-3" />
                    {article.qualityScore}
                  </span>
                  <span className={`flex items-center gap-1 ${getScoreColor(article.relevanceScore)}`}>
                    <Globe className="h-3 w-3" />
                    {article.relevanceScore}
                  </span>
                </div>
              )}
            </div>

            <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>

            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article.publishDate)}
                </div>
                {article.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {article.author}
                  </div>
                )}
              </div>

              <Link
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Read More
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function for category colors (needed for list view)
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'futsal': return 'bg-blue-100 text-blue-800';
    case 'sports': return 'bg-green-100 text-green-800';
    case 'ecommerce': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export { CrawledArticleCard, CrawledArticlesGrid, CrawledArticlesList };
export default CrawledArticleCard;
