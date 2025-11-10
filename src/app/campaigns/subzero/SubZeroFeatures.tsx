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
  const [openItem, setOpenItem] = useState<string | null>('01');

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Product Image */}
          <div className="bg-gray-200 relative h-full min-h-[400px] overflow-hidden rounded-lg lg:min-h-[600px]">
            <Image
              src="/subzero-breakdown.jpeg"
              alt="SubZero Futsal Shoes Features Breakdown"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right - Features */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold italic md:text-5xl">
              <span className="block text-black">ENGINEERED FOR</span>
              <span className="block text-[#4FD1C5]">COLD</span>{' '}
              <span className="text-black">PRECISION</span>
            </h2>

            <p className="text-gray-700 text-lg">
              This isn&apos;t just a futsal shoe – it&apos;s a system of
              control, built with advanced materials to help you freeze the
              chaos and move with precision.
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="border-gray-200 overflow-hidden rounded-lg border"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(feature.id)}
                    className="hover:bg-gray-50 flex w-full items-center justify-between bg-white p-6 text-left transition-colors"
                  >
                    <span className="text-lg font-semibold">
                      {feature.id} – {feature.title}
                    </span>
                    <ChevronDownIcon
                      className={`size-6 transition-transform ${
                        openItem === feature.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all ${
                      openItem === feature.id
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-gray-50 space-y-3 p-6 pt-0">
                      {feature.content.map((paragraph, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <p key={idx} className="text-gray-700">
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
