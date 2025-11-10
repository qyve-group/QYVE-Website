'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroHero = () => {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      {/* Background Shoe Image - Full width on mobile, right side on desktop */}
      <div className="absolute right-0 top-0 size-full md:w-1/2 md:opacity-80">
        <Image
          src="/subzero-shoe.jpeg"
          alt="SubZero Futsal Shoes - The Game Redefined"
          fill
          className="object-cover object-center md:object-right"
          priority
        />
      </div>

      {/* Gradient Overlay - Minimal on mobile for clear image, stronger on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f3d] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0a1f3d] md:via-[#0a1f3d]/80 md:to-transparent" />

      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,209,197,0.3),transparent_50%)]" />
      </div>

      {/* Content - Bottom positioned on mobile, left on desktop */}
      <div className="container relative z-10 mx-auto flex h-[600px] items-end px-4 pb-12 md:items-center md:pb-0 md:py-32">
        <div className="flex w-full flex-col items-center space-y-6 text-center md:w-auto md:items-start md:space-y-8 md:text-left">
          <h1 className="font-bold italic leading-none">
            {/* <span className="md:text-7xl lg:text-8xl block text-5xl text-white">
              SUBZERO
            </span> */}
            <span className="mt-2 block text-2xl text-[#4FD1C5] md:text-4xl lg:text-5xl">
              THE GAME,
            </span>
            <span className="block text-2xl text-[#4FD1C5] md:text-4xl lg:text-5xl">
              REDEFINED
            </span>
          </h1>

          <Link
            href="#preorder"
            className="text-gray-900 hover:bg-gray-100 inline-block rounded-full bg-white px-10 py-3 text-base font-semibold transition-all hover:scale-105 md:px-12 md:py-4 md:text-lg"
          >
            PREORDER
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubZeroHero;
