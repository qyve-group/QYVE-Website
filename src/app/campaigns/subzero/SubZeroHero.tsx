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

      {/* Content - Portrait: absolute bottom, Landscape: absolute bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-8 min-[1010px]:pb-16">
        <div className="container mx-auto flex items-end justify-center px-4">
          <div className="flex w-full flex-col items-center space-y-3 text-center sm:space-y-4">
            {/* Malaysia's First Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4FD1C5]/20 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-lg">🇲🇾</span>
              <span className="text-xs font-semibold text-[#4FD1C5] sm:text-sm">Malaysia&apos;s First Local Futsal Shoe</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl font-bold italic text-white sm:text-3xl md:text-4xl">
              Engineered for Malaysian Courts
            </h1>

            {/* Price Section */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white sm:text-3xl">RM 218</span>
              <span className="text-lg text-white/60 line-through sm:text-xl">RM 238</span>
              <span className="rounded-full bg-[#4FD1C5] px-3 py-1 text-xs font-bold text-[#0a1f3d] sm:text-sm">
                SAVE RM 20
              </span>
            </div>

            {/* Urgency Indicator */}
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#4FD1C5] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#4FD1C5]" />
              </span>
              <span>Early Bird Price • Limited Time Only</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/products/subzero"
                className="inline-block rounded-full bg-[#4FD1C5] px-8 py-3 text-sm font-bold text-[#0a1f3d] transition-all hover:scale-105 hover:bg-white sm:px-10 sm:py-3.5 sm:text-base"
              >
                Buy Now
              </Link>
              <Link
                href="#features"
                className="inline-block rounded-full border-2 border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10 sm:px-8 sm:py-3"
              >
                See Tech Breakdown
              </Link>
            </div>

            {/* Shipping Info */}
            <p className="text-xs text-white/70 sm:text-sm">
              Shipping: RM 8 (Semenanjung) • RM 15 (Sabah/Sarawak) • Delivers in 2 weeks
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for landscape view to give section height */}
      <div className="hidden min-[1010px]:block min-[1010px]:min-h-[700px] xl:min-h-[800px]" />
    </section>
  );
};

export default SubZeroHero;
