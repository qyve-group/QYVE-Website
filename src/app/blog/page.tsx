import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { supabase } from '@/libs/supabaseClient';
import Heading from '@/shared/Heading/Heading';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  featured_image: string;
  created_at: string;
}

const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, author, featured_image, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={post.featured_image || '/qyve-white.png'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-6">
          <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
            <span>{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
          
          <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          
          <p className="text-gray-600 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="mt-4 inline-flex items-center text-primary font-medium transition-colors group-hover:text-primary-600">
            Read More
            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
};

const BlogPage = async () => {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container pb-20 pt-10">
      <Heading
        desc="Insights on recovery, wellness, and the latest from the QYVE team."
        isMain
      >
        QYVE Blog
      </Heading>

      {blogPosts.length > 0 ? (
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-gray-500">No blog posts available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
