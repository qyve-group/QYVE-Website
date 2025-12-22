'use client';

import Link from 'next/link';

const SubZeroSpotlight = () => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-[#0f172a] md:h-[700px]">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      
      {/* Radial glow - center spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(200,245,122,0.15),transparent_60%)]" />
      
      {/* Secondary glow - bottom accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(200,245,122,0.1),transparent_50%)]" />
      
      {/* Geometric accent lines */}
      <div className="absolute left-0 top-1/4 h-px w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute right-0 top-1/3 h-px w-1/4 bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-1/4 left-1/4 h-px w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />
      
      {/* Corner accent shapes */}
      <div className="absolute -left-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary/5 blur-3xl" />
      
      {/* Floating geometric elements */}
      <div className="absolute left-[10%] top-[20%] size-2 rotate-45 bg-primary/40" />
      <div className="absolute right-[15%] top-[30%] size-3 rotate-12 border border-primary/30" />
      <div className="absolute bottom-[35%] left-[20%] size-1.5 rounded-full bg-white/20" />
      <div className="absolute bottom-[45%] right-[25%] size-2 rotate-45 border border-white/20" />
      
      {/* === SHOE IMAGE PLACEHOLDER === */}
      {/* Add your transparent shoe image here */}
      {/* Example:
      <div className="absolute inset-0 flex items-center justify-center">
        <Image 
          src="/your-shoe-transparent.png" 
          alt="SubZero Shoe" 
          width={600} 
          height={400} 
          className="object-contain drop-shadow-2xl" 
        />
      </div>
      */}

      {/* Content overlay */}
      <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-end px-4 pb-12 md:pb-16">
        <div className="mb-4 inline-block rounded-full bg-primary px-4 py-1 text-sm font-bold text-black">
          NEW DROP
        </div>

        <h1 className="mb-4 text-center font-myFont text-4xl font-bold italic text-white md:text-6xl lg:text-7xl">
          SUBZERO
        </h1>

        <p className="mb-6 max-w-md text-center text-lg text-white/90 md:text-xl">
          Engineered for cold precision. Time to freeze the competition.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products/subzero"
            className="rounded-full bg-primary px-8 py-3 text-center font-semibold text-black transition-all hover:scale-105 hover:bg-primary/80 md:px-10 md:py-4"
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
    </section>
  );
};

export default SubZeroSpotlight;
