'use client';

import React from 'react';
import { BannerProvider, useBanner } from '@/contexts/BannerContext';
import BannerManager from '@/components/BannerManager';

const BannerStateDisplay = () => {
  const { 
    currentBanner, 
    isBannerVisible, 
    hasSubscribed, 
    hasDismissed, 
    dismissalCount,
    dismissBanner,
    setSubscribed 
  } = useBanner();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Banner State Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Banner State</h2>
          <div className="space-y-2">
            <p><strong>Banner ID:</strong> {currentBanner?.id || 'None'}</p>
            <p><strong>Banner Title:</strong> {currentBanner?.title || 'None'}</p>
            <p><strong>Is Banner Visible:</strong> {isBannerVisible ? 'Yes' : 'No'}</p>
            <p><strong>Has Subscribed:</strong> {hasSubscribed ? 'Yes' : 'No'}</p>
            <p><strong>Has Dismissed:</strong> {hasDismissed ? 'Yes' : 'No'}</p>
            <p><strong>Dismissal Count:</strong> {dismissalCount}</p>
            <p><strong>Banner Active:</strong> {currentBanner?.isActive ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={dismissBanner}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Dismiss Banner (Count: {dismissalCount})
            </button>
            <button
              onClick={() => setSubscribed(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Mark as Subscribed
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('banner-dismissed');
                localStorage.removeItem('banner-dismissal-count');
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset Banner State
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Banner Reappearance Logic</h2>
          <div className="space-y-2 text-sm">
            <p>• Banner reappears until user signs up OR closes more than 2 times</p>
            <p>• Current dismissal count: <strong>{dismissalCount}</strong></p>
            <p>• Banner will stop reappearing after: <strong>{3 - dismissalCount}</strong> more dismissals</p>
            <p>• Or when user subscribes</p>
          </div>
        </div>
      </div>
      
      {/* Banner Manager - This will render the banner */}
      <BannerManager />
    </div>
  );
};

const TestBannerStatePage = () => {
  return (
    <BannerProvider>
      <BannerStateDisplay />
    </BannerProvider>
  );
};

export default TestBannerStatePage;
