'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Desktop: Side by side with equal height */}
      <div className="hidden lg:flex lg:h-[500px]">
        {/* Left Side - Blue Hero Banner with Shoe */}
        <div className="relative w-3/5">
          <Image
            src="/subzero_hero_landscape.webp"
            alt="SubZero Futsal Shoes"
            fill
            priority
            sizes="60vw"
            className="object-cover object-center"
          />

          {/* Desktop: Angled transition overlay */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-white" />
          <div
            className="absolute inset-y-0 right-0 w-48"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, white 80%)',
            }}
          />
        </div>

        {/* Right Side - Clean White with Green Accent */}
        <div className="flex w-2/5 flex-col items-start justify-center bg-white px-12">
          {/* Malaysia's First Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0a1f3d] px-4 py-2">
            <span className="text-lg">🇲🇾</span>
            <span className="text-xs font-bold text-white">MALAYSIA&apos;S FIRST LOCAL FUTSAL SHOE</span>
          </div>

          <h2 className="mb-4 font-myFont text-5xl font-bold italic text-black">
            FREEZE THE
            <br />
            <span className="text-primary">COURT</span>
          </h2>

          <p className="mb-4 max-w-sm text-gray-500">
            Precision engineered for Malaysian courts. Built by players, for players.
          </p>

          {/* Early Bird Pricing */}
          <div className="mb-6 flex items-center gap-3">
            {/* <span className="text-2xl font-bold text-black">RM 218</span> */}
            {/* <span className="text-lg text-gray-400">RM 238</span> */}
            {/* <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
              EARLY BIRD
            </span> */}
          </div>

          <Link
            href="/products/subzero"
            className="inline-block rounded-full bg-primary px-10 py-4 text-center font-bold text-black transition-all hover:scale-105 hover:bg-primary/80"
          >
            SHOP SUBZERO
          </Link>
        </div>
      </div>

      {/* Mobile: Stacked with transition */}
      <div className="lg:hidden">
        {/* Top - Blue Hero Banner with Shoe */}
        <div className="relative aspect-[16/9] w-full">
          <Image
            src="/subzero_hero_landscape.webp"
            alt="SubZero Futsal Shoes"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />

          {/* Mobile: Bottom fade transition */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Bottom - Clean White with Green Accent */}
        <div className="flex flex-col items-center justify-center bg-white px-8 py-10 text-center">
          {/* Malaysia's First Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0a1f3d] px-4 py-2">
            <span className="text-lg">🇲🇾</span>
            <span className="text-xs font-bold text-white">MALAYSIA&apos;S FIRST LOCAL FUTSAL SHOE</span>
          </div>

          <h2 className="mb-3 font-myFont text-3xl font-bold italic text-black sm:text-4xl">
            FREEZE THE <span className="text-primary">COURT</span>
          </h2>

          <p className="mb-4 max-w-sm text-gray-500">
            Precision engineered for Malaysian courts.
          </p>

          {/* Early Bird Pricing */}
          <div className="mb-6 flex items-center gap-3">
            {/* <span className="text-xl font-bold text-black">RM 218</span> */}
            {/* <span className="text-base text-gray-400">RM 238</span> */}
            {/* <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
              EARLY BIRD
            </span> */}
          </div>

          <Link
            href="/products/subzero"
            className="inline-block rounded-full bg-primary px-8 py-3 text-center font-bold text-black transition-all hover:scale-105 hover:bg-primary/80"
          >
            SHOP SUBZERO
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
