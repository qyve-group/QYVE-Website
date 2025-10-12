'use client';

import React, { useState } from 'react';
import { useBanner } from '@/contexts/BannerContext';
import { BANNER_VARIANTS } from '@/data/bannerConfig';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import Heading from '@/shared/Heading/Heading';

const TestBannerPage = () => {
  const { showBanner, hideBanner, currentBanner, isBannerVisible } = useBanner();
  const [selectedVariant, setSelectedVariant] = useState<string>('default');

  const handleShowBanner = (variant: string) => {
    setSelectedVariant(variant);
    showBanner();
  };

  const handleHideBanner = () => {
    hideBanner();
  };

  return (
    <div className="container mx-auto p-8">
      <Heading isMain>Marketing Banner System Test</Heading>
      <p className="mb-8 text-lg text-neutral-600">
        Test the marketing subscription banner system with different variants and configurations.
      </p>

      {/* Current Banner Status */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Banner Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Visible:</strong> {isBannerVisible ? 'Yes' : 'No'}</p>
            <p><strong>Current Banner:</strong> {currentBanner?.title || 'None'}</p>
            <p><strong>Position:</strong> {currentBanner?.position || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Variant:</strong> {currentBanner?.variant || 'default'}</p>
            <p><strong>Active:</strong> {currentBanner?.isActive ? 'Yes' : 'No'}</p>
            <p><strong>GDPR Required:</strong> {currentBanner?.gdprRequired ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Banner Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Banner Controls</h2>
        <div className="flex flex-wrap gap-4">
          <ButtonPrimary onClick={handleHideBanner}>
            Hide Current Banner
          </ButtonPrimary>
          <ButtonSecondary onClick={() => handleShowBanner('default')}>
            Show Default Banner
          </ButtonSecondary>
        </div>
      </div>

      {/* Banner Variants */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Banner Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(BANNER_VARIANTS).map(([variant, config]) => (
            <div key={variant} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 capitalize">{variant}</h3>
              <p className="text-sm text-gray-600 mb-3">{config.title}</p>
              <div 
                className="w-full h-16 rounded mb-3 flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: config.backgroundColor }}
              >
                Preview
              </div>
              <ButtonSecondary 
                onClick={() => handleShowBanner(variant)}
                className="w-full text-xs"
              >
                Test {variant}
              </ButtonSecondary>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Configuration */}
      {currentBanner && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Banner Configuration</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(currentBanner, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Test Instructions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click on any banner variant to test it</li>
            <li>The banner will appear at the bottom of the page</li>
            <li>Try subscribing with a valid email address</li>
            <li>Test the GDPR consent functionality</li>
            <li>Check the dismiss functionality</li>
            <li>Verify that the banner respects user preferences</li>
            <li>Test on different pages to see display rules</li>
          </ol>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-2 text-sm">
            <p><strong>GET</strong> /api/admin/banner - Get all banners</p>
            <p><strong>GET</strong> /api/admin/banner?id=default-marketing-banner - Get specific banner</p>
            <p><strong>GET</strong> /api/admin/banner?variant=welcome - Get banner by variant</p>
            <p><strong>POST</strong> /api/newsletter/subscribe - Subscribe to newsletter</p>
            <p><strong>GET</strong> /api/newsletter/subscribe?email=test@example.com - Check subscription</p>
            <p><strong>DELETE</strong> /api/newsletter/subscribe - Unsubscribe</p>
          </div>
        </div>
      </div>

      {/* GDPR Testing */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">GDPR Testing</h2>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-sm mb-4">
            To test GDPR consent functionality:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Clear your browser's localStorage</li>
            <li>Refresh the page</li>
            <li>The GDPR consent modal should appear</li>
            <li>Test accepting all, rejecting all, and custom preferences</li>
            <li>Verify that consent preferences are saved</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestBannerPage;
