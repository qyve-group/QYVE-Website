'use client';

import React from 'react';

import type { Campaign } from '@/data/campaign-types';

interface CampaignHeroBannerProps {
  campaign: Campaign;
}

const CampaignHeroBanner: React.FC<CampaignHeroBannerProps> = ({
  campaign,
}) => {
  return (
    <section
      className="relative flex h-[90vh] items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${campaign.heroBanner.backgroundImage})`,
        backgroundColor: campaign.heroBanner.backgroundColor || '#000000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        {/* Campaign Logo */}
        {campaign.campaignAssets.logo && (
          <div className="mb-8">
            <img
              src={campaign.campaignAssets.logo}
              alt={`${campaign.name} Logo`}
              className="mx-auto h-16 md:h-24"
            />
          </div>
        )}

        <h1
          className="text-7xl md:text-9xl mb-6 font-black tracking-tight"
          style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
        >
          {campaign.heroBanner.title}
        </h1>

        {campaign.heroBanner.subtitle && (
          <h2
            className="mb-8 text-3xl font-light tracking-wide md:text-4xl"
            style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
          >
            {campaign.heroBanner.subtitle}
          </h2>
        )}

        {campaign.heroBanner.description && (
          <p
            className="mx-auto mb-12 max-w-3xl text-xl font-light leading-relaxed md:text-2xl"
            style={{ color: campaign.heroBanner.textColor || '#ffffff' }}
          >
            {campaign.heroBanner.description}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {campaign.heroBanner.ctaText && campaign.heroBanner.ctaLink && (
            <a
              href={campaign.heroBanner.ctaLink}
              className="hover:bg-gray-100 inline-block rounded-lg bg-white px-10 py-4 text-xl font-bold text-black shadow-lg transition-all duration-300 hover:scale-105"
            >
              {campaign.heroBanner.ctaText}
            </a>
          )}

          <a
            href="#featured-products"
            className="inline-block rounded-lg border-2 border-white px-10 py-4 text-xl font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            View Collection
          </a>
        </div>

        {/* Campaign Status Badge */}
        <div className="mt-12">
          <span
            className={`inline-block rounded-full px-6 py-3 text-lg font-semibold ${
              // eslint-disable-next-line no-nested-ternary
              campaign.status === 'active'
                ? 'bg-green-600 text-white'
                : campaign.status === 'upcoming'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-600 text-white'
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
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
          <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white" />
        </div>
      </div>

      {/* Background Graphics */}
      {campaign.campaignAssets.graphics &&
        campaign.campaignAssets.graphics.length > 0 && (
          <div className="pointer-events-none absolute inset-0">
            {campaign.campaignAssets.graphics.map((graphic, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="absolute opacity-10"
                style={{
                  top: `${20 + index * 20}%`,
                  left: `${10 + index * 15}%`,
                  transform: `rotate(${index * 15}deg)`,
                }}
              >
                <img
                  src={graphic}
                  alt={`Campaign graphic ${index + 1}`}
                  className="size-32 object-contain"
                />
              </div>
            ))}
          </div>
        )}
    </section>
  );
};

export default CampaignHeroBanner;
