import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Heading from '@/shared/Heading/Heading';

const BlogPostPage = () => {
  return (
    <div className="container pb-20 pt-10">
      <div className="mb-8">
        <Link href="/blog" className="text-primary hover:text-primary-600 inline-flex items-center font-medium transition-colors">
          <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>

      <article className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="text-gray-500 mb-4 flex items-center gap-4 text-sm">
            <span>QYVE Team</span>
            <span>•</span>
            <span>September 6, 2025</span>
          </div>
          
          <Heading isMain>
            QYVE Brand Story: From Court to Comfort
          </Heading>
        </div>

        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/qyve-jersey-blog.jpg"
            alt="QYVE Jersey"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6 text-xl leading-relaxed">
            Learn about the journey that led to creating premium recovery gear for athletes and everyday warriors. Our story is one of passion, innovation, and a deep understanding of what athletes need both on and off the court.
          </p>

          <h2 className="text-gray-900 mb-4 text-2xl font-bold">Our Mission</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            At QYVE, we believe that true performance begins with trust—trust in your gear, trust in your team, and trust in the community that supports you. Our mission is to bridge the gap between athletes and innovation by delivering futsal products designed with precision, honesty, and a deep understanding of the game.
          </p>

          <h2 className="text-gray-900 mb-4 text-2xl font-bold">From Court to Comfort</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Every pair of shoes, every stitch, and every decision we make is driven by a commitment to quality and transparency. We are not just here to sell—we are here to stand beside every player who laces up with purpose. Together, we are building more than just a brand—we are building a community grounded in reliability, respect, and a passion for futsal.
          </p>

          <h2 className="text-gray-900 mb-4 text-2xl font-bold">The QYVE Difference</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
            We're proud to be born in Southeast Asia—and we're here to change the game. QYVE is different because we design with purpose: to uplift local athletes, inspire a movement, and redefine what it means to be a sports brand in this region.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <p className="text-gray-700 italic">
              "Found in 2024, QYVE's mission is to elevate the standards of sports in the region by prioritizing performance, innovation and the community - bringing players together through a shared passion of the game."
            </p>
            <p className="text-gray-600 mt-2 text-sm">— QYVE Mission Statement</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
