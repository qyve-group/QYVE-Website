'use client';

import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-br from-[#0a1f3d] via-[#0d3d5c] to-[#1a5a7a]">
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center lg:items-start lg:py-12 lg:pl-8 lg:pr-6 lg:text-left">
          <div className="mb-3 inline-block rounded-full bg-[#4FD1C5] px-4 py-1 text-sm font-bold text-black">
            NEW DROP
          </div>

          <h1 className="mb-3 font-myFont text-3xl font-bold italic text-white md:text-4xl lg:text-5xl">
            SUBZERO
          </h1>

          <p className="mb-5 max-w-sm text-base text-white/90 md:text-lg">
            Engineered for cold precision. Time to freeze the competition.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products/subzero"
              className="rounded-full bg-white px-6 py-2.5 text-center font-semibold text-black transition-all hover:scale-105 hover:bg-gray-100 md:px-8 md:py-3"
            >
              SHOP NOW
            </Link>
            <Link
              href="/products/subzero#preorder"
              className="rounded-full border-2 border-white px-6 py-2.5 text-center font-semibold text-white transition-all hover:bg-white hover:text-black md:px-8 md:py-3"
            >
              PRE-ORDER
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-md lg:max-w-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="block w-full"
          >
            <source src="/videos/subzero/subzero_motion.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
