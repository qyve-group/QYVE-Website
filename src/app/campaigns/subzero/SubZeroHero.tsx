'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      {/* Background Shoe Image - Portrait until ~1033px, then landscape */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/subzero_hero_landscape.webp"
          alt="SubZero Futsal Shoes - The Game Redefined"
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/subzero-shoe-portrait.webp"
          alt="SubZero Futsal Shoes - The Game Redefined"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3d] via-transparent to-transparent md:from-[#0a1f3d]/90" />

      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,209,197,0.3),transparent_50%)]" />
      </div>

      {/* Content - Responsive height using aspect ratio and min-height */}
      <div className="container relative z-10 mx-auto flex min-h-[80vh] items-end justify-center px-4 pb-8 sm:min-h-[85vh] sm:pb-12 md:min-h-[90vh] md:pb-16 lg:min-h-[700px] xl:min-h-[800px]">
        <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:space-y-8">
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
    </section>
  );
};

export default SubZeroHero;
