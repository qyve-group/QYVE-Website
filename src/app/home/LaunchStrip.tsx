'use client';

import Link from 'next/link';

const LaunchStrip = () => {
  return (
    <div className="bg-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-3 py-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="text-sm font-medium text-white">
              <span className="font-bold text-primary">NOW LAUNCHING:</span>{' '}
              Subzero - Malaysia&apos;s First Local Futsal Shoe
            </span>
          </div>
          <Link
            href="/campaigns/subzero"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-black transition-all hover:bg-white"
          >
            <span>Learn More</span>
            <svg
              className="size-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LaunchStrip;
