'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BannerConfig, validateEmail, getBannerConfig } from '@/data/bannerConfig';

interface MarketingBannerProps {
  config?: BannerConfig;
  variant?: string;
  onSubscribe?: (email: string, consent: boolean) => Promise<boolean>;
  onDismiss?: () => void;
  className?: string;
}

interface SubscriptionState {
  email: string;
  consent: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

const MarketingBanner: React.FC<MarketingBannerProps> = ({
  config,
  variant,
  onSubscribe,
  onDismiss,
  className = ''
}) => {
  const bannerConfig = config || getBannerConfig(variant);
  const [isVisible, setIsVisible] = useState(false);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    email: '',
    consent: false,
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: ''
  });

  // Show banner with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionState(prev => ({
      ...prev,
      email: e.target.value,
      isError: false,
      errorMessage: ''
    }));
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionState(prev => ({
      ...prev,
      consent: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(subscriptionState.email)) {
      setSubscriptionState(prev => ({
        ...prev,
        isError: true,
        errorMessage: 'Please enter a valid email address'
      }));
      return;
    }

    // Check GDPR consent if required
    if (bannerConfig.gdprRequired && !subscriptionState.consent) {
      setSubscriptionState(prev => ({
        ...prev,
        isError: true,
        errorMessage: 'Please accept the terms to continue'
      }));
      return;
    }

    setSubscriptionState(prev => ({ ...prev, isSubmitting: true, isError: false }));

    try {
      let success = false;
      
      if (onSubscribe) {
        success = await onSubscribe(subscriptionState.email, subscriptionState.consent);
      } else {
        // Default subscription logic
        success = await defaultSubscribe(subscriptionState.email, subscriptionState.consent);
      }

      if (success) {
        setSubscriptionState(prev => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true,
          isError: false
        }));

        // Hide banner after success
        setTimeout(() => {
          setIsVisible(false);
          if (onDismiss) onDismiss();
        }, 3000);
      } else {
        setSubscriptionState(prev => ({
          ...prev,
          isSubmitting: false,
          isError: true,
          errorMessage: bannerConfig.errorMessage
        }));
      }
    } catch (error) {
      setSubscriptionState(prev => ({
        ...prev,
        isSubmitting: false,
        isError: true,
        errorMessage: bannerConfig.errorMessage
      }));
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const defaultSubscribe = async (email: string, consent: boolean): Promise<boolean> => {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          consent,
          source: 'marketing-banner',
          bannerId: bannerConfig.id
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Subscription error:', error);
      return false;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed ${bannerConfig.position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 transform transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : bannerConfig.position === 'top' ? '-translate-y-full' : 'translate-y-full opacity-0'
      } ${className}`}
      style={{
        backgroundColor: bannerConfig.backgroundColor,
        color: bannerConfig.textColor
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold truncate">{bannerConfig.title}</h3>
              {bannerConfig.subtitle && (
                <span className="text-sm opacity-90 hidden sm:inline">
                  {bannerConfig.subtitle}
                </span>
              )}
            </div>
            <p className="text-sm opacity-90 hidden md:block">
              {bannerConfig.description}
            </p>
          </div>

          {/* Subscription Form */}
          <div className="flex-shrink-0">
            {subscriptionState.isSuccess ? (
              <div className="flex items-center gap-2 text-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="email"
                    value={subscriptionState.email}
                    onChange={handleEmailChange}
                    placeholder={bannerConfig.placeholder}
                    className="px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={subscriptionState.isSubmitting}
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {bannerConfig.gdprRequired && (
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscriptionState.consent}
                      onChange={handleConsentChange}
                      className="rounded border-gray-300"
                      disabled={subscriptionState.isSubmitting}
                    />
                    <span className="hidden lg:inline">I agree to receive emails</span>
                    <span className="lg:hidden">I agree</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={subscriptionState.isSubmitting}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: bannerConfig.buttonColor,
                    color: bannerConfig.buttonTextColor
                  }}
                >
                  {subscriptionState.isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    bannerConfig.buttonText
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {subscriptionState.isError && (
          <div className="mt-2 flex items-center gap-2 text-red-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{subscriptionState.errorMessage}</span>
          </div>
        )}

        {/* GDPR Text (Mobile) */}
        {bannerConfig.gdprRequired && (
          <div className="mt-2 text-xs opacity-75 md:hidden">
            {bannerConfig.gdprText}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingBanner;
