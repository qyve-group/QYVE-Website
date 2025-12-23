'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      {/* Background Shoe Image - Portrait until ~1010px, then landscape */}
      <div className="absolute inset-0 hidden min-[1010px]:block">
        <Image
          src="/subzero_hero_landscape.webp"
          alt="SubZero Futsal Shoes - The Game Redefined"
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Portrait image - uses aspect ratio container on mobile */}
      <div className="relative min-[1010px]:hidden">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src="/subzero-shoe-portrait.webp"
            alt="SubZero Futsal Shoes - The Game Redefined"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Gradient overlay for portrait */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3d] via-transparent to-transparent" />
      </div>

      {/* Gradient Overlay for landscape */}
      <div className="absolute inset-0 hidden bg-gradient-to-t from-[#0a1f3d]/90 via-transparent to-transparent min-[1010px]:block" />

      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,209,197,0.3),transparent_50%)]" />
      </div>

      {/* Content - Portrait: absolute bottom, Landscape: flex container */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-8 min-[1010px]:static min-[1010px]:pb-0">
        <div className="container mx-auto flex min-[1010px]:min-h-[700px] min-[1010px]:items-end min-[1010px]:justify-center min-[1010px]:pb-16 xl:min-h-[800px]">
          <div className="flex w-full flex-col items-center space-y-4 text-center sm:space-y-6 md:space-y-8">
            <h1 className="font-bold italic leading-none">
              {/* Content removed per design */}
            </h1>

            <Link
              href="/products/subzero"
              className="inline-block rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:scale-105 hover:bg-gray-100 sm:px-10 sm:py-3 sm:text-base md:px-12 md:py-4 md:text-lg"
            >
              Buy now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubZeroHero;
