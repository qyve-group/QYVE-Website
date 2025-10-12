'use client';

import React from 'react';
import Link from 'next/link';
import { CampaignProduct } from '@/data/campaign-types';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

interface CampaignFeaturedProductsProps {
  products: CampaignProduct[];
  campaignName: string;
}

const CampaignFeaturedProducts: React.FC<CampaignFeaturedProductsProps> = ({ 
  products, 
  campaignName 
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id="featured-products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured {campaignName} Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest innovations in cold-weather performance footwear. 
            Each piece is engineered for extreme conditions and built to last.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Campaign Badge */}
                {product.campaignTag && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.campaignTag}
                    </span>
                  </div>
                )}
                
                {/* Sale Badge */}
                {product.isOnSale && product.previousPrice && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Sale
                    </span>
                  </div>
                )}
                
                {/* New Arrival Badge */}
                {product.isNewArrival && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      New
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    RM {product.price}
                  </span>
                  {product.previousPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      RM {product.previousPrice}
                    </span>
                  )}
                </div>
                
                {/* Colors */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color) => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: color === 'black' ? '#000000' :
                                         color === 'white' ? '#ffffff' :
                                         color === 'navy' ? '#1e3a8a' :
                                         color === 'gray' ? '#6b7280' : '#000000'
                        }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{product.colors.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* CTA Button */}
                <Link href={`/products/${product.slug}`}>
                  <ButtonPrimary className="w-full">
                    View Product
                  </ButtonPrimary>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Link href="/shop">
            <ButtonPrimary className="px-8 py-4 text-lg">
              View All {campaignName} Products
            </ButtonPrimary>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CampaignFeaturedProducts;
