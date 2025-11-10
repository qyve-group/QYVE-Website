'use client';

import React from 'react';

import CampaignFeaturedProducts from '@/components/CampaignFeaturedProducts';
import CampaignHeroBanner from '@/components/CampaignHeroBanner';
import CampaignLookbook from '@/components/CampaignLookbook';
import {
  getCampaignBySlug,
  getFeaturedProducts,
  getLookbookItems,
} from '@/data/campaign-types';

interface CampaignPageProps {
  params: {
    slug: string;
  };
}

const CampaignPage: React.FC<CampaignPageProps> = ({ params }) => {
  const { slug } = params;

  // Get campaign data
  const campaign = getCampaignBySlug(slug);
  const featuredProducts = getFeaturedProducts(slug);
  const lookbookItems = getLookbookItems(slug);

  if (!campaign) {
    return (
      <div className="bg-gray-50 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 mb-4 text-4xl font-bold">
            Campaign Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The requested campaign could not be found.
          </p>
          <a
            href="/shop"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Browse All Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <CampaignHeroBanner campaign={campaign} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <CampaignFeaturedProducts
          products={featuredProducts}
          campaignName={campaign.name}
        />
      )}

      {/* Campaign Story Section */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-4xl font-bold md:text-5xl">
              {campaign.name} Collection
            </h2>
            <p className="mb-12 text-xl leading-relaxed">
              {campaign.description}
            </p>

            {/* Campaign Status */}
            <div className="mb-8 flex items-center justify-center gap-4 text-sm">
              <span
                className={`rounded-full px-4 py-2 font-semibold ${
                  // eslint-disable-next-line no-nested-ternary
                  campaign.status === 'active'
                    ? 'bg-green-600'
                    : campaign.status === 'upcoming'
                      ? 'bg-yellow-600'
                      : 'bg-gray-600'
                }`}
              >
                {
                  // eslint-disable-next-line no-nested-ternary
                  campaign.status === 'active'
                    ? 'Now Available'
                    : campaign.status === 'upcoming'
                      ? 'Coming Soon'
                      : 'Campaign Ended'
                }
              </span>

              {campaign.startDate && (
                <span className="text-gray-200">
                  Launched: {new Date(campaign.startDate).toLocaleDateString()}
                </span>
              )}

              {campaign.endDate && (
                <span className="text-gray-200">
                  Until: {new Date(campaign.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      {lookbookItems.length > 0 && (
        <CampaignLookbook
          lookbookItems={lookbookItems}
          campaignName={campaign.name}
        />
      )}

      {/* Campaign Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-gray-900 mb-4 text-4xl font-bold md:text-5xl">
                Why Choose {campaign.name}?
              </h2>
              <p className="text-gray-600 text-xl">
                Discover what makes the {campaign.name} collection special.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-600">
                  <svg
                    className="size-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold">Premium Quality</h3>
                <p className="text-gray-600">
                  Built with the finest materials and attention to detail for
                  lasting performance.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-600">
                  <svg
                    className="size-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold">Performance Driven</h3>
                <p className="text-gray-600">
                  Engineered for athletes who demand the best in every
                  condition.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-600">
                  <svg
                    className="size-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold">Designed for You</h3>
                <p className="text-gray-600">
                  Every detail crafted with the athlete in mind for ultimate
                  comfort and style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Experience {campaign.name}
          </h2>
          <p className="text-gray-300 mx-auto mb-8 max-w-3xl text-xl">
            Join the community of athletes who trust {campaign.name} for their
            performance needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {featuredProducts.length > 0 && (
              <a
                href="#featured-products"
                className="hover:bg-gray-100 inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-colors"
              >
                Shop {campaign.name} Collection
              </a>
            )}
            <a
              href="/shop"
              className="inline-block rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignPage;
