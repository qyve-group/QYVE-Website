'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Desktop: Side by side with equal height */}
      <div className="hidden lg:flex lg:h-[500px]">
        {/* Left Side - Blue Hero Banner with Shoe */}
        <div className="relative w-[60%]">
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
              background: 'linear-gradient(105deg, transparent 30%, white 80%)'
            }}
          />
        </div>

        {/* Right Side - Clean White with Green Accent */}
        <div className="flex w-[40%] flex-col items-start justify-center bg-white px-12">
          <div className="mb-6 h-1 w-16 rounded-full bg-primary" />

          <h2 className="mb-4 font-myFont text-5xl font-bold italic text-black">
            FREEZE THE<br />
            <span className="text-primary">COURT</span>
          </h2>

          <p className="mb-8 max-w-sm text-gray-500">
            Precision engineered for those who dominate.
          </p>

          <Link
            href="/products/subzero"
            className="inline-block rounded-full bg-primary px-10 py-4 text-center font-bold text-black transition-all hover:scale-105 hover:bg-primary/80"
          >
            SHOP SUBZERO
          </Link>

          <p className="mt-4 text-xs text-gray-400">
            *Limited stock available
          </p>
        </div>
      </div>

      {/* Mobile: Stacked with transition */}
      <div className="lg:hidden">
        {/* Top - Blue Hero Banner with Shoe */}
        <div className="relative h-[350px] w-full">
          <Image
            src="/subzero_hero_landscape.webp"
            alt="SubZero Futsal Shoes"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          
          {/* Mobile: Bottom fade transition */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Bottom - Clean White with Green Accent */}
        <div className="flex flex-col items-center justify-center bg-white px-8 py-10 text-center">
          <div className="mb-4 h-1 w-16 rounded-full bg-primary" />

          <h2 className="mb-3 font-myFont text-3xl font-bold italic text-black sm:text-4xl">
            FREEZE THE <span className="text-primary">COURT</span>
          </h2>

          <p className="mb-6 max-w-sm text-gray-500">
            Precision engineered for those who dominate.
          </p>

          <Link
            href="/products/subzero"
            className="inline-block rounded-full bg-primary px-8 py-3 text-center font-bold text-black transition-all hover:scale-105 hover:bg-primary/80"
          >
            SHOP SUBZERO
          </Link>

          <p className="mt-3 text-xs text-gray-400">
            *Limited stock available
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
