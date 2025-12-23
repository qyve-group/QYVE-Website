/* eslint-disable react/no-array-index-key */

'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';

const features = [
  {
    id: '01',
    title: 'UPPER SYSTEM: SUBZERO-WEAVE TECH',
    content: [
      'A fusion of microfibre leather and mesh – strong where it needs to be, weightless where it matters.',
      'The microfibre layer delivers unmatched touch sensitivity and durability, while the vented mesh panels act as a cooling grid, regulating airflow so your feet stay light and dry.',
      'Think of it as a performance cooling shell – engineered to keep your game composed under pressure.',
    ],
  },
  {
    id: '02',
    title: 'MIDSOLE SYSTEM: ENERGY RETURN FOAM',
    content: [
      'Built with EVA rebound technology that absorbs shock and releases energy with every step.',
      "You don't just move – you reload.",
    ],
  },
  {
    id: '03',
    title: 'OUTSOLE SYSTEM: TRACTION GRIP',
    content: [
      'Multi-directional traction pattern designed for explosive lateral movements and instant stops.',
      'Maximum grip, zero slip – engineered for futsal court performance.',
    ],
  },
];

const SubZeroFeatures = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="bg-white py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse gap-8 sm:gap-10 lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left - Product Image */}
          <div className="bg-gray-200 relative aspect-[3/4] w-full overflow-hidden rounded-lg sm:aspect-square lg:aspect-auto lg:min-h-[500px] xl:min-h-[600px]">
            <Image
              src="/subzero_breakdown.webp"
              alt="SubZero Futsal Shoes Features Breakdown"
              fill
              className="object-contain object-center sm:object-cover"
              priority
            />
          </div>

          {/* Right - Features */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-3xl font-bold italic sm:text-4xl md:text-5xl">
              <span className="block text-black">ENGINEERED FOR</span>
              <span className="block text-[#4FD1C5]">COLD</span>{' '}
              <span className="text-black">PRECISION</span>
            </h2>

            <p className="text-gray-700 text-base sm:text-lg">
              This isn&apos;t just a futsal shoe – it&apos;s a system of
              control, built with advanced materials to help you freeze the
              chaos and move with precision.
            </p>

            <div className="space-y-3 sm:space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="border-gray-200 overflow-hidden rounded-lg border"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(feature.id)}
                    className="hover:bg-gray-50 flex w-full items-center justify-between bg-white p-4 text-left transition-colors sm:p-5 md:p-6"
                  >
                    <span className="pr-4 text-sm font-semibold sm:text-base md:text-lg">
                      {feature.id} – {feature.title}
                    </span>
                    <ChevronDownIcon
                      className={`size-5 shrink-0 transition-transform sm:size-6 ${
                        openItem === feature.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ${
                      openItem === feature.id
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-gray-50 space-y-2 p-4 pt-0 sm:space-y-3 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
                      {feature.content.map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-gray-700 text-sm sm:text-base"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubZeroFeatures;
