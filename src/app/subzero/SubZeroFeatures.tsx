'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
          {/* Left - Product Image Placeholder */}
          <div className="flex items-center justify-center">
            <div className="aspect-square w-full max-w-md rounded-lg bg-gray-200" />
          </div>

          {/* Right - Features */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold italic md:text-5xl">
              <span className="block text-black">ENGINEERED FOR</span>
              <span className="block text-[#4FD1C5]">COLD</span>{' '}
              <span className="text-black">PRECISION</span>
            </h2>

            <p className="text-lg text-gray-700">
              This isn&apos;t just a futsal shoe – it&apos;s a system of
              control, built with advanced materials to help you freeze the
              chaos and move with precision.
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <button
                    onClick={() => toggleItem(feature.id)}
                    className="flex w-full items-center justify-between bg-white p-6 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="text-lg font-semibold">
                      {feature.id} – {feature.title}
                    </span>
                    <ChevronDownIcon
                      className={`h-6 w-6 transition-transform ${
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
                    <div className="space-y-3 bg-gray-50 p-6 pt-0">
                      {feature.content.map((paragraph, idx) => (
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
