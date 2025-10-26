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
            <span>September 19, 2025</span>
          </div>
          
          <Heading isMain>
            The Journey of Building QYVE Infinitus - Our Very First Futsal Shoe
          </Heading>
        </div>

        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/qyve-infinitus-blog.jpg"
            alt="QYVE Infinitus Futsal Shoe"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6 text-xl leading-relaxed">
            The first futsal shoe we ever made represents more than just footwear—it's the embodiment of our vision to create performance gear that bridges the gap between professional athletes and everyday players.
          </p>

          <h2 className="text-gray-900 mb-4 text-2xl font-bold">The Beginning</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            When we started QYVE, we knew we wanted to create something different. Not just another sports brand, but a movement that celebrates the passion and dedication of futsal players across Southeast Asia. The QYVE Infinitus was our first step towards that vision.
          </p>

          <h2 className="text-gray-900 mb-4 text-2xl font-bold">Design Philosophy</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Every element of the Infinitus was designed with purpose. From the lightweight construction that enhances agility to the grip pattern that provides maximum traction on indoor courts, we focused on creating a shoe that performs as well as it looks.
          </p>

          <h2 className="text-gray-900 mb-4 text-2xl font-bold">The Result</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The QYVE Infinitus became more than just our first product—it became a symbol of our commitment to quality, innovation, and the futsal community. Today, it continues to be a favorite among players who value both performance and style.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <p className="text-gray-700 italic">
              "The QYVE Infinitus represents everything we stand for: quality, innovation, and a deep respect for the game of futsal. It's not just a shoe—it's a statement."
            </p>
            <p className="text-gray-600 mt-2 text-sm">— QYVE Design Team</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
