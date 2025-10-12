'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BannerConfig, getBannerConfig, shouldShowBanner } from '@/data/bannerConfig';

interface BannerContextType {
  currentBanner: BannerConfig | null;
  isBannerVisible: boolean;
  hasSubscribed: boolean;
  hasDismissed: boolean;
  dismissalCount: number;
  pageViews: number;
  showBanner: (config?: BannerConfig) => void;
  hideBanner: () => void;
  dismissBanner: () => void;
  setSubscribed: (subscribed: boolean) => void;
  incrementPageViews: () => void;
  loadBannerConfig: (variant?: string) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

interface BannerProviderProps {
  children: ReactNode;
  initialBanner?: BannerConfig;
  initialVariant?: string;
}

export const BannerProvider: React.FC<BannerProviderProps> = ({
  children,
  initialBanner,
  initialVariant
}) => {
  const [currentBanner, setCurrentBanner] = useState<BannerConfig | null>(
    initialBanner || getBannerConfig(initialVariant)
  );
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [dismissalCount, setDismissalCount] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  // Load banner configuration from API
  const loadBannerConfig = async (variant?: string) => {
    try {
      // Use test banner for now to ensure it shows
      const url = '/api/test-banner';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.banner) {
        console.log('Loaded banner config:', data.banner);
        setCurrentBanner(data.banner);
      } else {
        // Fallback to default config
        setCurrentBanner(getBannerConfig(variant));
      }
    } catch (error) {
      console.error('Error loading banner config:', error);
      // Fallback to default config
      setCurrentBanner(getBannerConfig(variant));
    }
  };

  // Check if user has subscribed
  const checkSubscriptionStatus = async () => {
    try {
      const email = localStorage.getItem('user-email');
      if (email) {
        const response = await fetch(`/api/newsletter/subscribe?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        if (data.success) {
          setHasSubscribed(data.isSubscribed);
        }
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Check if user has dismissed banner
  const checkDismissalStatus = () => {
    const dismissed = localStorage.getItem('banner-dismissed');
    const count = localStorage.getItem('banner-dismissal-count');
    const dismissalCount = count ? parseInt(count, 10) : 0;
    
    setDismissalCount(dismissalCount);
    
    if (dismissed) {
      const dismissalDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissal = (now.getTime() - dismissalDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Only consider dismissed if user has closed more than 2 times
      if (dismissalCount > 2) {
        setHasDismissed(true);
      } else {
        // Reset dismissal after 1 day if less than 2 dismissals
        if (daysSinceDismissal > 1) {
          localStorage.removeItem('banner-dismissed');
          setHasDismissed(false);
        } else {
          setHasDismissed(false); // Allow banner to reappear
        }
      }
    }
  };

  // Get page views from localStorage
  const getPageViews = () => {
    const views = localStorage.getItem('page-views');
    return views ? parseInt(views, 10) : 0;
  };

  // Initialize banner state
  useEffect(() => {
    const views = getPageViews();
    setPageViews(views);
    
    checkSubscriptionStatus();
    checkDismissalStatus();
    
    // Load banner config if not provided
    if (!initialBanner) {
      loadBannerConfig(initialVariant);
    }
  }, [initialBanner, initialVariant]);

  // Show banner based on conditions
  useEffect(() => {
    if (currentBanner && currentBanner.isActive) {
      const shouldShow = shouldShowBanner(
        window.location.pathname,
        hasSubscribed,
        hasDismissed,
        pageViews
      );
      console.log('Banner visibility check:', {
        currentBanner: currentBanner.id,
        isActive: currentBanner.isActive,
        pathname: window.location.pathname,
        hasSubscribed,
        hasDismissed,
        pageViews,
        shouldShow
      });
      setIsBannerVisible(shouldShow);
    }
  }, [currentBanner, hasSubscribed, hasDismissed, pageViews]);

  const showBanner = (config?: BannerConfig) => {
    if (config) {
      setCurrentBanner(config);
    }
    setIsBannerVisible(true);
  };

  const hideBanner = () => {
    setIsBannerVisible(false);
  };

  const dismissBanner = () => {
    setIsBannerVisible(false);
    const currentCount = dismissalCount + 1;
    setDismissalCount(currentCount);
    localStorage.setItem('banner-dismissal-count', currentCount.toString());
    localStorage.setItem('banner-dismissed', new Date().toISOString());
    
    // Only set as dismissed if user has closed more than 2 times
    if (currentCount > 2) {
      setHasDismissed(true);
    } else {
      setHasDismissed(false); // Allow banner to reappear
    }
  };

  const setSubscribed = (subscribed: boolean) => {
    setHasSubscribed(subscribed);
    if (subscribed) {
      // Hide banner when user subscribes
      setIsBannerVisible(false);
    }
  };

  const incrementPageViews = () => {
    const newViews = pageViews + 1;
    setPageViews(newViews);
    localStorage.setItem('page-views', newViews.toString());
  };

  const value: BannerContextType = {
    currentBanner,
    isBannerVisible,
    hasSubscribed,
    hasDismissed,
    dismissalCount,
    pageViews,
    showBanner,
    hideBanner,
    dismissBanner,
    setSubscribed,
    incrementPageViews,
    loadBannerConfig
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = (): BannerContextType => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
};

// Hook to track page views
export const usePageViewTracking = () => {
  const { incrementPageViews } = useBanner();

  useEffect(() => {
    incrementPageViews();
  }, [incrementPageViews]);
};
