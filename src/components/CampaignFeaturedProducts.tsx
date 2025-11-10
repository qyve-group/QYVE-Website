'use client';

import Link from 'next/link';
import React from 'react';

import type { CampaignProduct } from '@/data/campaign-types';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

interface CampaignFeaturedProductsProps {
  products: CampaignProduct[];
  campaignName: string;
}

const CampaignFeaturedProducts: React.FC<CampaignFeaturedProductsProps> = ({
  products,
  campaignName,
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id="featured-products" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
            Featured {campaignName} Products
          </h2>
          <p className="text-gray-600 mx-auto max-w-3xl text-xl">
            Discover the latest innovations in cold-weather performance
            footwear. Each piece is engineered for extreme conditions and built
            to last.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Campaign Badge */}
                {product.campaignTag && (
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                      {product.campaignTag}
                    </span>
                  </div>
                )}

                {/* Sale Badge */}
                {product.isOnSale && product.previousPrice && (
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                      Sale
                    </span>
                  </div>
                )}

                {/* New Arrival Badge */}
                {product.isNewArrival && (
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                      New
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-gray-900 mb-2 text-xl font-bold">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-gray-900 text-2xl font-bold">
                    RM {product.price}
                  </span>
                  {product.previousPrice && (
                    <span className="text-gray-500 text-lg line-through">
                      RM {product.previousPrice}
                    </span>
                  )}
                </div>

                {/* Colors */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color) => (
                      <div
                        key={color}
                        className="border-gray-300 size-4 rounded-full border"
                        style={{
                          backgroundColor:
                            // eslint-disable-next-line no-nested-ternary
                            color === 'black'
                              ? '#000000'
                              : color === 'white'
                                ? '#ffffff'
                                : color === 'navy'
                                  ? '#1e3a8a'
                                  : color === 'gray'
                                    ? '#6b7280'
                                    : '#000000',
                        }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{product.colors.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={`/products/${product.slug}`}>
                  <ButtonPrimary className="w-full">View Product</ButtonPrimary>
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
