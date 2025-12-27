'use client';

const SubZeroTrustBadges = () => {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
          <div className="text-gray-600 flex items-center gap-2">
            <svg
              className="size-6 text-[#0a1f3d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs font-medium sm:text-sm">
              Secure Checkout
            </span>
          </div>

          <div className="text-gray-600 flex items-center gap-2">
            <svg
              className="size-6 text-[#0a1f3d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-xs font-medium sm:text-sm">Easy Returns</span>
          </div>

          <div className="text-gray-600 flex items-center gap-2">
            <svg
              className="size-6 text-[#0a1f3d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <span className="text-xs font-medium sm:text-sm">
              Ships within 2 Weeks
            </span>
          </div>

          <div className="text-gray-600 flex items-center gap-2">
            <svg
              className="size-6 text-[#0a1f3d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="text-xs font-medium sm:text-sm">
              Visa / Mastercard / FPX
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            🇲🇾 Proudly Made in Malaysia • First Local Futsal Shoe Brand
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubZeroTrustBadges;
