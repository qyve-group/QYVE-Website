'use client';

import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center lg:items-start lg:py-16 lg:pl-12 lg:pr-8 lg:text-left xl:pl-20">
          <div className="mb-4 inline-block rounded-full bg-[#4FD1C5] px-4 py-1 text-sm font-bold text-black">
            NEW DROP
          </div>

          <h1 className="mb-4 font-myFont text-4xl font-bold italic text-white md:text-5xl lg:text-6xl xl:text-7xl">
            SUBZERO
          </h1>

          <p className="mb-6 max-w-md text-lg text-white/90 md:text-xl">
            Engineered for cold precision. Time to freeze the competition.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products/subzero"
              className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black transition-all hover:scale-105 hover:bg-gray-100 md:px-10 md:py-4"
            >
              SHOP NOW
            </Link>
            <Link
              href="/products/subzero#preorder"
              className="rounded-full border-2 border-white px-8 py-3 text-center font-semibold text-white transition-all hover:bg-white hover:text-black md:px-10 md:py-4"
            >
              PRE-ORDER
            </Link>
          </div>
        </div>

        <div className="relative flex-1">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="block size-full object-cover"
          >
            <source src="/videos/subzero/subzero_motion.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
