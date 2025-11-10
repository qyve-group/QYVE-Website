'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroHero = () => {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      {/* Background Shoe Image - Right Side */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-80">
        <Image
          src="/subzero-shoe.jpeg"
          alt="SubZero Futsal Shoes - The Game Redefined"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay to blend image with background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f3d] via-[#0a1f3d]/80 to-transparent" />

      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,209,197,0.3),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center space-y-8 text-center md:items-start md:text-left">
          <h1 className="font-bold italic leading-none">
            <span className="md:text-7xl lg:text-8xl block text-6xl text-white">
              SUBZERO
            </span>
            <span className="mt-2 block text-3xl text-[#4FD1C5] md:text-4xl lg:text-5xl">
              THE GAME,
            </span>
            <span className="block text-3xl text-[#4FD1C5] md:text-4xl lg:text-5xl">
              REDEFINED
            </span>
          </h1>

          <Link
            href="#preorder"
            className="text-gray-900 hover:bg-gray-100 inline-block rounded-full bg-white px-12 py-4 text-lg font-semibold transition-all hover:scale-105"
          >
            PREORDER
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubZeroHero;
