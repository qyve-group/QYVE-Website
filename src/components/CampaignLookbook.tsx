'use client';

import Link from 'next/link';
import React from 'react';

import type { CampaignLookbookItem } from '@/data/campaign-types';

interface CampaignLookbookProps {
  lookbookItems: CampaignLookbookItem[];
  campaignName: string;
}

const CampaignLookbook: React.FC<CampaignLookbookProps> = ({
  lookbookItems,
  campaignName,
}) => {
  if (!lookbookItems || lookbookItems.length === 0) {
    return null;
  }

  // Calculate grid dimensions
  const maxRows = Math.max(
    ...lookbookItems.map(
      (item) => item.position.row + (item.position.spanRows || 1),
    ),
  );
  const maxCols = Math.max(
    ...lookbookItems.map(
      (item) => item.position.column + (item.position.spanColumns || 1),
    ),
  );

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
            {campaignName} Lookbook
          </h2>
          <p className="text-gray-600 mx-auto max-w-3xl text-xl">
            Explore the collection through our curated lookbook. See how each
            piece performs in real-world conditions.
          </p>
        </div>

        {/* Lookbook Grid */}
        <div
          className="mx-auto grid max-w-6xl gap-4"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
            gridTemplateRows: `repeat(${maxRows}, 200px)`,
          }}
        >
          {lookbookItems.map((item) => (
            <div
              key={item.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl"
              style={{
                gridRow: `${item.position.row} / span ${item.position.spanRows || 1}`,
                gridColumn: `${item.position.column} / span ${item.position.spanColumns || 1}`,
              }}
            >
              {/* Image */}
              <div className="relative size-full">
                <img
                  src={item.image}
                  alt={item.title || `Lookbook item ${item.id}`}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="translate-y-4 text-white transition-transform duration-300 group-hover:translate-y-0">
                    {item.title && (
                      <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="mb-3 text-sm opacity-90">
                        {item.description}
                      </p>
                    )}

                    {/* CTA based on type */}
                    {item.type === 'product' && item.productSlug && (
                      <Link href={`/products/${item.productSlug}`}>
                        <span className="hover:bg-gray-100 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors">
                          View Product
                        </span>
                      </Link>
                    )}

                    {item.type === 'lifestyle' && (
                      <span className="inline-block rounded-lg border border-white px-4 py-2 text-sm font-semibold text-white">
                        Lifestyle
                      </span>
                    )}

                    {item.type === 'detail' && (
                      <span className="inline-block rounded-lg border border-white px-4 py-2 text-sm font-semibold text-white">
                        Detail
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lookbook Description */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-gray-900 mb-4 text-2xl font-bold">
              Experience the {campaignName} Difference
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our lookbook showcases the {campaignName} collection in action.
              From technical details to lifestyle moments, discover how our
              cold-weather performance footwear adapts to your needs and
              enhances your performance in extreme conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignLookbook;
