'use client';

import React from 'react';
import { getCampaignBySlug, getFeaturedProducts, getLookbookItems } from '@/data/campaign-types';
import CampaignHeroBanner from '@/components/CampaignHeroBanner';
import CampaignFeaturedProducts from '@/components/CampaignFeaturedProducts';
import CampaignLookbook from '@/components/CampaignLookbook';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-8">The requested campaign could not be found.</p>
          <a
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              {campaign.name} Collection
            </h2>
            <p className="text-xl leading-relaxed mb-12">
              {campaign.description}
            </p>
            
            {/* Campaign Status */}
            <div className="flex items-center justify-center gap-4 text-sm mb-8">
              <span className={`px-4 py-2 rounded-full font-semibold ${
                campaign.status === 'active' ? 'bg-green-600' :
                campaign.status === 'upcoming' ? 'bg-yellow-600' :
                'bg-gray-600'
              }`}>
                {campaign.status === 'active' ? 'Now Available' : 
                 campaign.status === 'upcoming' ? 'Coming Soon' : 'Campaign Ended'}
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose {campaign.name}?
              </h2>
              <p className="text-xl text-gray-600">
                Discover what makes the {campaign.name} collection special.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  Built with the finest materials and attention to detail for lasting performance.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Driven</h3>
                <p className="text-gray-600">
                  Engineered for athletes who demand the best in every condition.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Designed for You</h3>
                <p className="text-gray-600">
                  Every detail crafted with the athlete in mind for ultimate comfort and style.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Experience {campaign.name}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the community of athletes who trust {campaign.name} for their performance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {featuredProducts.length > 0 && (
              <a
                href="#featured-products"
                className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop {campaign.name} Collection
              </a>
            )}
            <a
              href="/shop"
              className="inline-block border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
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
