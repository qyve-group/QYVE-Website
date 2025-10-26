import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ComingSoon from '@/components/ComingSoon';
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

// Demo blog posts based on the QYVE website
const demoBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Journey of Building QYVE Infinitus - Our Very First Futsal Shoe',
    slug: 'journey-building-qyve-infinitus-first-futsal-shoe',
    excerpt: 'The first futsal shoe we ever made',
    author: 'QYVE Team',
    featured_image: '/images/qyve-infinitus-blog.jpg',
    created_at: '2025-09-19',
  },
  {
    id: 2,
    title: 'QYVE Brand Story: From Court to Comfort',
    slug: 'qyve-brand-story-court-to-comfort',
    excerpt: 'Learn about the journey that led to creating premium recovery gear for athletes and everyday warriors.',
    author: 'QYVE Team',
    featured_image: '/images/qyve-jersey-blog.jpg',
    created_at: '2025-09-06',
  },
];

const getBlogPosts = async (): Promise<BlogPost[]> => {
  // Return demo data for now since Supabase is not configured
  return demoBlogPosts;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
          <div className="text-gray-500 mb-3 flex items-center gap-4 text-sm">
            <span>{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>

          <h2 className="text-gray-900 mb-3 text-xl font-bold transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>

          <div className="group-hover:text-primary-600 mt-4 inline-flex items-center font-medium text-primary transition-colors">
            Read More
            <svg
              className="ml-2 size-4 transition-transform group-hover:translate-x-1"
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
          <ComingSoon />
        </div>
      )}
    </div>
  );
};

export default BlogPage;
