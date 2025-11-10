'use client';

import React from 'react';
import Link from 'next/link';
import { CampaignLookbookItem } from '@/data/campaign-types';

interface CampaignLookbookProps {
  lookbookItems: CampaignLookbookItem[];
  campaignName: string;
}

const CampaignLookbook: React.FC<CampaignLookbookProps> = ({ 
  lookbookItems, 
  campaignName 
}) => {
  if (!lookbookItems || lookbookItems.length === 0) {
    return null;
  }

  // Calculate grid dimensions
  const maxRows = Math.max(...lookbookItems.map(item => item.position.row + (item.position.spanRows || 1)));
  const maxCols = Math.max(...lookbookItems.map(item => item.position.column + (item.position.spanColumns || 1)));

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {campaignName} Lookbook
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the collection through our curated lookbook. 
            See how each piece performs in real-world conditions.
          </p>
        </div>

        {/* Lookbook Grid */}
        <div 
          className="grid gap-4 mx-auto max-w-6xl"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
            gridTemplateRows: `repeat(${maxRows}, 200px)`
          }}
        >
          {lookbookItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-2xl group cursor-pointer"
              style={{
                gridRow: `${item.position.row} / span ${item.position.spanRows || 1}`,
                gridColumn: `${item.position.column} / span ${item.position.spanColumns || 1}`
              }}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <img
                  src={item.image}
                  alt={item.title || `Lookbook item ${item.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title && (
                      <h3 className="text-xl font-bold mb-2">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p className="text-sm opacity-90 mb-3">
                        {item.description}
                      </p>
                    )}
                    
                    {/* CTA based on type */}
                    {item.type === 'product' && item.productSlug && (
                      <Link href={`/products/${item.productSlug}`}>
                        <span className="inline-block bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                          View Product
                        </span>
                      </Link>
                    )}
                    
                    {item.type === 'lifestyle' && (
                      <span className="inline-block border border-white text-white px-4 py-2 rounded-lg text-sm font-semibold">
                        Lifestyle
                      </span>
                    )}
                    
                    {item.type === 'detail' && (
                      <span className="inline-block border border-white text-white px-4 py-2 rounded-lg text-sm font-semibold">
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
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience the {campaignName} Difference
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
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
