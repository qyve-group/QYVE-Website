'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroHero = () => {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8 text-center md:text-left">
            <h1 className="font-bold italic leading-none">
              <span className="block text-6xl text-white md:text-7xl lg:text-8xl">
                SUBZERO
              </span>
              <span className="mt-2 block text-3xl text-[#4FD1C5] md:text-4xl lg:text-5xl">
                THE GAME,
              </span>
              <span className="block text-3xl text-[#4FD1C5] md:text-4xl lg:text-5xl">
                REDIFINED
              </span>
            </h1>

            <Link
              href="/products/subzero"
              className="inline-block rounded-full bg-white px-12 py-4 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:scale-105"
            >
              BUY NOW
            </Link>
          </div>

          {/* Right Product Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-[400px] w-full max-w-[600px]">
              <Image
                src="/subzero-shoe.png"
                alt="SubZero Futsal Shoe"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,209,197,0.3),transparent_50%)]" />
      </div>
    </section>
  );
};

export default SubZeroHero;
