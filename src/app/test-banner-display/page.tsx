'use client';

import React from 'react';
import { BannerProvider } from '@/contexts/BannerContext';
import BannerManager from '@/components/BannerManager';

const TestBannerDisplayPage = () => {
  return (
    <BannerProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Banner Display Test Page
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This page tests the marketing banner display functionality.
          </p>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Check if the banner appears at the top or bottom of this page</li>
              <li>Try clicking the banner button</li>
              <li>Test the banner dismiss functionality</li>
              <li>Check browser console for banner logs</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Banner Status</h2>
            <div className="space-y-2">
              <p><strong>Page Path:</strong> /test-banner-display</p>
              <p><strong>Expected Banner:</strong> WELCOME TO YOUR JOURNEY</p>
              <p><strong>Banner Position:</strong> Top</p>
              <p><strong>Banner Active:</strong> Yes</p>
            </div>
          </div>
        </div>
        
        {/* Banner Manager - This will render the banner */}
        <BannerManager />
      </div>
    </BannerProvider>
  );
};

export default TestBannerDisplayPage;
