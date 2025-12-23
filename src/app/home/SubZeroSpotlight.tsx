'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Blue Hero Banner with Shoe */}
        <div className="relative h-[400px] w-full bg-gradient-to-br from-[#0a2540] via-[#0d4a6b] to-[#1a7a9a] lg:h-[600px] lg:w-1/2">
          <Image
            src="/subzero_hero_landscape.webp"
            alt="SubZero Futsal Shoes"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Right Side - White/Green Product Info */}
        <div className="flex h-auto w-full flex-col justify-center bg-white px-8 py-12 lg:h-[600px] lg:w-1/2 lg:px-16">
          <div className="mb-4 inline-block w-fit rounded-full bg-primary px-4 py-1 text-sm font-bold text-black">
            NEW DROP
          </div>

          <h1 className="mb-2 font-myFont text-4xl font-bold italic text-black md:text-5xl lg:text-6xl">
            SUBZERO
          </h1>

          <p className="mb-2 text-lg font-semibold text-primary">
            COLD PRECISION
          </p>

          <p className="mb-6 max-w-md text-gray-600">
            Engineered for cold precision. The SubZero futsal shoe features SubZero-Weave Tech upper, Energy Return Foam midsole, and multi-directional Traction Grip outsole.
          </p>

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-black">RM 218</span>
            <span className="text-lg text-gray-400 line-through">RM 238</span>
            <span className="rounded bg-primary/20 px-2 py-1 text-sm font-semibold text-primary">
              SAVE RM 20
            </span>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold text-gray-700">SELECT SIZE</p>
            <div className="flex flex-wrap gap-2">
              {['39', '40', '41', '42', '43', '44', '45'].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="flex size-12 items-center justify-center rounded-lg border-2 border-gray-200 font-semibold text-gray-700 transition-all hover:border-primary hover:bg-primary/10"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products/subzero"
              className="rounded-full bg-primary px-8 py-3 text-center font-semibold text-black transition-all hover:scale-105 hover:bg-primary/80"
            >
              ADD TO CART
            </Link>
            <Link
              href="/products/subzero"
              className="rounded-full border-2 border-black px-8 py-3 text-center font-semibold text-black transition-all hover:bg-black hover:text-white"
            >
              VIEW DETAILS
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free Shipping
            </span>
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Early Bird Price
            </span>
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Made in Malaysia
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
