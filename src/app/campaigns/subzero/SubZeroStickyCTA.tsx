'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SubZeroStickyCTAProps {
  price: number;
  previousPrice: number;
  savings: number;
}

const SubZeroStickyCTA = ({
  price,
  previousPrice,
  savings,
}: SubZeroStickyCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="bg-gradient-to-r from-[#0a1f3d] to-[#1a5a7a] px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-[#4FD1C5]">Price</span>
            <div className="flex items-center gap-2">
              {savings === 0 ? (
                <span className="text-lg font-bold text-white">RM {price}</span>
              ) : (
                <>
                  <span className="text-lg font-bold text-white">
                    RM {price}
                  </span>
                  <span className="text-sm text-white/60 line-through">
                    RM {previousPrice}
                  </span>
                </>
              )}
            </div>
          </div>
          <Link
            href="/products/subzero"
            className="rounded-full bg-[#4FD1C5] px-6 py-2.5 text-sm font-bold text-[#0a1f3d] transition-all hover:scale-105 hover:bg-white"
            onClick={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'sticky_buy_now_click', {
                  page: 'campaigns_subzero',
                  cta_type: 'sticky',
                  destination: '/products/subzero',
                });
              }
            }}
          >
            Buy Now
          </Link>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-white/80">
          <span className="flex items-center gap-1">
            <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure Checkout
          </span>
          <span>•</span>
          <span>Delivery within 2 weeks</span>
          <span>•</span>
          <span>Easy Returns</span>
        </div>
      </div>
    </div>
  );
};

export default SubZeroStickyCTA;
