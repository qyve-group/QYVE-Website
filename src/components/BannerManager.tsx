'use client';

import React, { useEffect } from 'react';
import { useBanner, usePageViewTracking } from '@/contexts/BannerContext';
import MarketingBanner from './MarketingBanner';
import GDPRConsent from './GDPRConsent';

interface BannerManagerProps {
  className?: string;
}

const BannerManager: React.FC<BannerManagerProps> = ({ className = '' }) => {
  const {
    currentBanner,
    isBannerVisible,
    hasSubscribed,
    setSubscribed,
    dismissBanner
  } = useBanner();

  // Track page views
  usePageViewTracking();

  // Handle newsletter subscription
  const handleSubscribe = async (email: string, consent: boolean): Promise<boolean> => {
    try {
      const response = await fetch('/api/test-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          consent,
          source: 'marketing-banner',
          bannerId: currentBanner?.id,
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user email for future reference
        localStorage.setItem('user-email', email);
        setSubscribed(true);
        return true;
      } else {
        console.error('Subscription failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      return false;
    }
  };

  // Get client IP (simplified version)
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  // Handle GDPR consent changes
  const handleConsentChange = (consents: any) => {
    // Store consent preferences
    localStorage.setItem('gdpr-consents', JSON.stringify(consents));
    
    // Update analytics tracking based on consent
    if (typeof window !== 'undefined' && window.gtag) {
      if (consents.analytics) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      } else {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }
  };

  // Handle accepting all consents
  const handleAcceptAll = () => {
    const allConsents = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    handleConsentChange(allConsents);
  };

  // Handle rejecting all consents
  const handleRejectAll = () => {
    const minimalConsents = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    handleConsentChange(minimalConsents);
  };

  // Handle saving consent preferences
  const handleSavePreferences = (consents: any) => {
    handleConsentChange(consents);
  };

  // Don't render if no banner or banner is not visible
  if (!currentBanner || !isBannerVisible) {
    return null;
  }

  return (
    <div className={className}>
      {/* Marketing Banner */}
      <MarketingBanner
        config={currentBanner}
        onSubscribe={handleSubscribe}
        onDismiss={dismissBanner}
      />

      {/* GDPR Consent (only show if not already consented) */}
      <GDPRConsent
        onConsentChange={handleConsentChange}
        onAcceptAll={handleAcceptAll}
        onRejectAll={handleRejectAll}
        onSavePreferences={handleSavePreferences}
      />
    </div>
  );
};

export default BannerManager;
