'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Blue Hero Banner with Shoe */}
        <div className="relative h-[400px] w-full lg:h-[550px] lg:w-[60%]">
          <Image
            src="/subzero_hero_landscape.webp"
            alt="SubZero Futsal Shoes"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center"
          />
          
          {/* Angled transition overlay - creates diagonal fade */}
          <div className="absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-r from-transparent to-white lg:block" />
          <div 
            className="absolute inset-y-0 right-0 hidden w-48 lg:block"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, white 70%)'
            }}
          />
        </div>

        {/* Right Side - Clean White with Green Accent */}
        <div className="flex h-auto w-full flex-col items-center justify-center bg-white px-8 py-16 text-center lg:h-[550px] lg:w-[40%] lg:items-start lg:px-12 lg:py-0 lg:text-left">
          
          {/* Subtle green accent line */}
          <div className="mb-6 h-1 w-16 rounded-full bg-primary" />
          
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Early Bird — RM 218
          </p>

          <h2 className="mb-4 font-myFont text-4xl font-bold italic text-black md:text-5xl">
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
            Limited stock available
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
