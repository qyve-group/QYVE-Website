'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, X, Settings, Info } from 'lucide-react';
import { GDPR_CONSENT_TYPES, GDPR_CONSENT_DESCRIPTIONS, type GDPRConsentType } from '@/data/bannerConfig';

interface GDPRConsentProps {
  onConsentChange?: (consents: ConsentState) => void;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
  onSavePreferences?: (consents: ConsentState) => void;
  className?: string;
}

interface ConsentState {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({
  onConsentChange,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState<ConsentState>({
    necessary: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsents = localStorage.getItem('gdpr-consents');
    if (savedConsents) {
      const parsed = JSON.parse(savedConsents);
      setConsents(parsed);
    } else {
      // Show consent banner if no previous consent
      setIsVisible(true);
    }
  }, []);

  const handleConsentChange = (type: GDPRConsentType, value: boolean) => {
    const newConsents = { ...consents, [type]: value };
    setConsents(newConsents);
    if (onConsentChange) onConsentChange(newConsents);
  };

  const handleAcceptAll = () => {
    const allConsents = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setConsents(allConsents);
    saveConsents(allConsents);
    setIsVisible(false);
    if (onAcceptAll) onAcceptAll();
  };

  const handleRejectAll = () => {
    const minimalConsents = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setConsents(minimalConsents);
    saveConsents(minimalConsents);
    setIsVisible(false);
    if (onRejectAll) onRejectAll();
  };

  const handleSavePreferences = () => {
    saveConsents(consents);
    setIsVisible(false);
    if (onSavePreferences) onSavePreferences(consents);
  };

  const saveConsents = (consentsToSave: ConsentState) => {
    localStorage.setItem('gdpr-consents', JSON.stringify(consentsToSave));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const handleHideDetails = () => {
    setShowDetails(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleHideDetails}></div>

      {/* Consent Modal */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cookie & Privacy Preferences
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>

          {/* Quick Actions */}
          {!showDetails && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Reject All
                </button>
              </div>
              <button
                onClick={handleShowDetails}
                className="w-full text-blue-600 text-sm hover:text-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Customize Preferences
              </button>
            </div>
          )}

          {/* Detailed Preferences */}
          {showDetails && (
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">Necessary</h4>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Always Active</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {GDPR_CONSENT_DESCRIPTIONS[GDPR_CONSENT_TYPES.NECESSARY]}
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Functional</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.functional}
                      onChange={(e) => handleConsentChange(GDPR_CONSENT_TYPES.FUNCTIONAL, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  {GDPR_CONSENT_DESCRIPTIONS[GDPR_CONSENT_TYPES.FUNCTIONAL]}
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.analytics}
                      onChange={(e) => handleConsentChange(GDPR_CONSENT_TYPES.ANALYTICS, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  {GDPR_CONSENT_DESCRIPTIONS[GDPR_CONSENT_TYPES.ANALYTICS]}
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Marketing</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consents.marketing}
                      onChange={(e) => handleConsentChange(GDPR_CONSENT_TYPES.MARKETING, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  {GDPR_CONSENT_DESCRIPTIONS[GDPR_CONSENT_TYPES.MARKETING]}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleHideDetails}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By using our website, you agree to our{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRConsent;
