'use client';

import Image from 'next/image';
import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    //bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]
    <section className="h-[700px] w-full overflow-hidden md:h-[700px]">
      {/* <div className="flex flex-row">
        <div>Test</div>
        <div>Hello</div>
      </div> */}
      <div className="flex flex-row h-full">
        <div className=" w-1/2"></div>
        {/* <div className='w-1/2'> */}
        <div className="relative w-1/2">
          <Image
            src="/subzero_no_bground_white.png"
            alt="SubZero Futsal Shoes"
            fill
            priority
            className="object-contain "
          />
        </div>

        {/* <div className=" md:hidden">
            <Image
              src="/subzero_no_bground_white.webp"
              alt="SubZero Futsal Shoes"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div> */}
        {/* </div> */}
        {/* <div className="bg-red-300">Test</div> */}
      </div>

      {/* <div className="absoluteinset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
       */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,245,122,0.2),transparent_50%)]" />
      </div> */}

      <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-end px-4 pb-12 md:pb-16">
        {/* <div className="mb-4 inline-block rounded-full bg-primary px-4 py-1 text-sm font-bold text-black">
          NEW DROP
        </div>

        <h1 className="mb-4 text-center font-myFont text-4xl font-bold italic text-white md:text-6xl lg:text-7xl">
          SUBZERO
        </h1>

        <p className="mb-6 max-w-md text-center text-lg text-white/90 md:text-xl">
          Engineered for cold precision. Time to freeze the competition.
        </p> */}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products/subzero"
            className="rounded-full bg-primary/80 px-8 py-3 text-center font-semibold text-black transition-all hover:scale-105 md:px-10 md:py-4 hover:bg-primary/20 hover:text-primary"
          >
            SHOP NOW
          </Link>
          {/* <Link
            href="/products/subzero#preorder"
            className="rounded-full border-2 border-white px-8 py-3 text-center font-semibold text-white transition-all hover:bg-white hover:text-black md:px-10 md:py-4"
          >
            PRE-ORDER
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default SubZeroSpotlight;
