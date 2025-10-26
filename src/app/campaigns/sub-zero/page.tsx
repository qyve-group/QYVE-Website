'use client';

import React from 'react';
import { getCampaignBySlug, getFeaturedProducts, getLookbookItems } from '@/data/campaign-types';
import CampaignHeroBanner from '@/components/CampaignHeroBanner';
import CampaignFeaturedProducts from '@/components/CampaignFeaturedProducts';
import CampaignLookbook from '@/components/CampaignLookbook';

const SubZeroCampaignPage = () => {
  // Get campaign data
  const campaign = getCampaignBySlug('sub-zero');
  const featuredProducts = getFeaturedProducts('sub-zero');
  const lookbookItems = getLookbookItems('sub-zero');

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600">The requested campaign could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <CampaignHeroBanner campaign={campaign} />

      {/* Featured Products */}
      <CampaignFeaturedProducts 
        products={featuredProducts} 
        campaignName={campaign.name}
      />

      {/* Campaign Story Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Engineered for Extreme Conditions
            </h2>
            <p className="text-xl leading-relaxed mb-12">
              The Sub-Zero collection represents the pinnacle of cold-weather performance footwear. 
              Every detail has been meticulously crafted to ensure maximum protection, comfort, 
              and performance in the harshest environments.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Thermal Insulation</h3>
                <p className="text-black">
                  Revolutionary thermal technology keeps your feet warm in temperatures as low as -30°C.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Waterproof Construction</h3>
                <p className="text-black">
                  Fully waterproof materials ensure your feet stay dry in wet and snowy conditions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Superior Traction</h3>
                <p className="text-black">
                  Advanced sole technology provides exceptional grip on ice, snow, and wet surfaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <CampaignLookbook 
        lookbookItems={lookbookItems} 
        campaignName={campaign.name}
      />

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Sub-Zero Technology
              </h2>
              <p className="text-xl text-gray-600">
                Discover the innovative technologies that make Sub-Zero the ultimate cold-weather performance footwear.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  ThermalCore™ Insulation
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our proprietary ThermalCore™ technology uses advanced aerogel insulation 
                  to create a microclimate around your feet, maintaining optimal temperature 
                  even in the most extreme conditions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">Maintains warmth down to -30°C</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">Lightweight and breathable</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">Moisture-wicking properties</span>
                  </li>
                </ul>
              </div>
              
              <div className="relative">
                <img
                  src="/images/campaigns/sub-zero/technology-thermal.jpg"
                  alt="ThermalCore Technology"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Conquer the Cold?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of athletes who trust Sub-Zero for their most challenging cold-weather adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#featured-products"
              className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Sub-Zero Collection
            </a>
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

export default SubZeroCampaignPage;
