'use client';

import React from 'react';
import { Campaign } from '@/data/campaign-types';

interface CampaignLayoutProps {
  campaign: Campaign;
  children: React.ReactNode;
}

const CampaignLayout: React.FC<CampaignLayoutProps> = ({ campaign, children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Campaign Hero Banner */}
      <section 
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${campaign.heroBanner.backgroundImage})`,
          backgroundColor: campaign.heroBanner.backgroundColor || '#000000',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-4 tracking-tight"
            style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
          >
            {campaign.heroBanner.title}
          </h1>
          
          {campaign.heroBanner.subtitle && (
            <h2 
              className="text-2xl md:text-3xl font-light mb-6"
              style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
            >
              {campaign.heroBanner.subtitle}
            </h2>
          )}
          
          {campaign.heroBanner.description && (
            <p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
            >
              {campaign.heroBanner.description}
            </p>
          )}
          
          {campaign.heroBanner.ctaText && campaign.heroBanner.ctaLink && (
            <a
              href={campaign.heroBanner.ctaLink}
              className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              {campaign.heroBanner.ctaText}
            </a>
          )}
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Campaign Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Campaign Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{campaign.name} Collection</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {campaign.description}
            </p>
            
            {/* Campaign Status */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-green-600 rounded-full">
                {campaign.status === 'active' ? 'Now Available' : 
                 campaign.status === 'upcoming' ? 'Coming Soon' : 'Ended'}
              </span>
              
              {campaign.startDate && (
                <span className="text-gray-400">
                  Launched: {new Date(campaign.startDate).toLocaleDateString()}
                </span>
              )}
              
              {campaign.endDate && (
                <span className="text-gray-400">
                  Until: {new Date(campaign.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CampaignLayout;
