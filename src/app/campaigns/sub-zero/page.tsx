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
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">
              The Next Generation of Performance Shoes
            </h2>
            <p className="text-xl leading-relaxed mb-12 text-black">
              Introducing Sub-Zero, QYVE's revolutionary new shoe line designed for athletes who demand 
              uncompromising performance. Built with cutting-edge technology and premium materials, 
              Sub-Zero delivers the perfect balance of comfort, durability, and style for every step of your journey.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">Advanced Cushioning</h3>
                <p className="text-black">
                  Revolutionary midsole technology provides superior comfort and energy return for all-day performance.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">Premium Materials</h3>
                <p className="text-black">
                  Crafted with high-quality leather and breathable mesh for durability and comfort in any condition.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">Enhanced Grip</h3>
                <p className="text-black">
                  Multi-directional outsole pattern delivers exceptional traction on various surfaces for confident movement.
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
                Sub-Zero Innovation
              </h2>
              <p className="text-xl text-gray-600">
                Discover the cutting-edge technologies that make Sub-Zero the ultimate performance shoe for modern athletes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  QYVE ComfortCore™ Technology
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our proprietary ComfortCore™ technology features adaptive cushioning that responds to your movement, 
                  providing personalized comfort and support throughout your day. Engineered for athletes who refuse to compromise on performance.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">Adaptive cushioning for personalized comfort</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">Lightweight design for all-day wear</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">Enhanced breathability and moisture control</span>
                  </li>
                </ul>
              </div>
              
              <div className="relative">
                <img
                  src="/images/campaigns/sub-zero/technology-thermal.jpg"
                  alt="QYVE ComfortCore Technology" 
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
            Ready to Experience Sub-Zero?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the QYVE community and discover why Sub-Zero is the perfect choice for athletes who demand excellence in every step.
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
