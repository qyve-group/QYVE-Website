import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { supabase } from '@/libs/supabaseClient';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  featured_image: string;
  created_at: string;
  updated_at: string;
}

type Props = {
  params: { slug: string };
};

const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPostPage = async ({ params }: Props) => {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container max-w-4xl pb-20 pt-10">
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="hover:text-primary-600 mb-8 inline-flex items-center text-primary transition-colors"
      >
        <svg
          className="mr-2 size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Blog
      </Link>

      {/* Featured Image */}
      <div className="relative mb-8 h-96 w-full overflow-hidden rounded-3xl">
        <Image
          src={post.featured_image || '/qyve-white.png'}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-gray-900 mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="text-gray-500 flex items-center gap-4">
          <span className="font-medium">{post.author}</span>
          <span>•</span>
          <span>{formatDate(post.created_at)}</span>
          {post.updated_at !== post.created_at && (
            <>
              <span>•</span>
              <span>Updated {formatDate(post.updated_at)}</span>
            </>
          )}
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{
            __html: post.content
              .replace(/\n/g, '<br>')
              .replace(/## /g, '<h2>')
              .replace(/# /g, '<h1>'),
          }}
        />
      </article>

      {/* Call to Action */}
      <div className="bg-gray-50 mt-16 rounded-3xl p-8 text-center">
        <h3 className="text-gray-900 mb-4 text-2xl font-bold">
          Ready to Experience QYVE?
        </h3>
        <p className="text-gray-600 mb-6">
          Discover our premium recovery gear designed for comfort and
          performance.
        </p>
        <Link
          href="/shop"
          className="hover:bg-primary-600 inline-flex items-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors"
        >
          Shop Now
          <svg
            className="ml-2 size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogPostPage;
