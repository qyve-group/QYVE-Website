'use client';

import React from 'react';
import { Campaign } from '@/data/campaign-types';

interface CampaignHeroBannerProps {
  campaign: Campaign;
}

const CampaignHeroBanner: React.FC<CampaignHeroBannerProps> = ({ campaign }) => {
  return (
    <section 
      className="relative h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${campaign.heroBanner.backgroundImage})`,
        backgroundColor: campaign.heroBanner.backgroundColor || '#000000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Campaign Logo */}
        {campaign.campaignAssets.logo && (
          <div className="mb-8">
            <img 
              src={campaign.campaignAssets.logo} 
              alt={`${campaign.name} Logo`}
              className="h-16 md:h-24 mx-auto"
            />
          </div>
        )}
        
        <h1 
          className="text-7xl md:text-9xl font-black mb-6 tracking-tight"
          style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
        >
          {campaign.heroBanner.title}
        </h1>
        
        {campaign.heroBanner.subtitle && (
          <h2 
            className="text-3xl md:text-4xl font-light mb-8 tracking-wide"
            style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
          >
            {campaign.heroBanner.subtitle}
          </h2>
        )}
        
        {campaign.heroBanner.description && (
          <p 
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
          >
            {campaign.heroBanner.description}
          </p>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {campaign.heroBanner.ctaText && campaign.heroBanner.ctaLink && (
            <a
              href={campaign.heroBanner.ctaLink}
              className="inline-block bg-white text-black px-10 py-4 text-xl font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {campaign.heroBanner.ctaText}
            </a>
          )}
          
          <a
            href="#featured-products"
            className="inline-block border-2 border-white text-white px-10 py-4 text-xl font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300"
          >
            View Collection
          </a>
        </div>
        
        {/* Campaign Status Badge */}
        <div className="mt-12">
          <span className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${
            campaign.status === 'active' ? 'bg-green-600 text-white' :
            campaign.status === 'upcoming' ? 'bg-yellow-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {campaign.status === 'active' ? 'Now Available' : 
             campaign.status === 'upcoming' ? 'Coming Soon' : 'Campaign Ended'}
          </span>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
      
      {/* Background Graphics */}
      {campaign.campaignAssets.graphics && campaign.campaignAssets.graphics.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {campaign.campaignAssets.graphics.map((graphic, index) => (
            <div
              key={index}
              className="absolute opacity-10"
              style={{
                top: `${20 + index * 20}%`,
                left: `${10 + index * 15}%`,
                transform: `rotate(${index * 15}deg)`
              }}
            >
              <img 
                src={graphic} 
                alt={`Campaign graphic ${index + 1}`}
                className="w-32 h-32 object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CampaignHeroBanner;
