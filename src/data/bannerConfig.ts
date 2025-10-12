export interface BannerConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  placeholder: string;
  successMessage: string;
  errorMessage: string;
  imageUrl?: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  position: 'top' | 'bottom';
  isActive: boolean;
  showOnPages: string[];
  hideOnPages: string[];
  gdprRequired: boolean;
  gdprText: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSignup {
  id: string;
  email: string;
  name?: string;
  consent: boolean;
  source: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GDPRConsent {
  id: string;
  email: string;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  functionalConsent: boolean;
  consentDate: string;
  ipAddress?: string;
  userAgent?: string;
}

// Default banner configuration
export const DEFAULT_BANNER_CONFIG: BannerConfig = {
  id: 'default-marketing-banner',
  title: '🎉 Get 10% Off Your First Order!',
  subtitle: 'Join the QYVE Family',
  description: 'Subscribe to our newsletter and be the first to know about new releases, exclusive offers, and special promotions.',
  buttonText: 'Subscribe Now',
  placeholder: 'Enter your email address',
  successMessage: '🎉 Welcome to the QYVE family! Check your email for your discount code.',
  errorMessage: 'Something went wrong. Please try again.',
  imageUrl: '/images/newsletter-banner.jpg',
  backgroundColor: '#ff6b35',
  textColor: '#ffffff',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  position: 'bottom',
  isActive: true,
  showOnPages: ['/', '/home', 'home', 'shop', 'products'],
  hideOnPages: ['checkout', 'success', 'login', 'signup'],
  gdprRequired: true,
  gdprText: 'I agree to receive marketing emails and understand I can unsubscribe at any time.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Banner variants for different campaigns
export const BANNER_VARIANTS: { [key: string]: Partial<BannerConfig> } = {
  welcome: {
    title: '🏆 Welcome to QYVE!',
    subtitle: 'Your Premium Sports Gear Destination',
    description: 'Get exclusive access to new releases, member-only discounts, and early access to limited editions.',
    buttonText: 'Join Now',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    buttonColor: '#ff6b35',
    buttonTextColor: '#ffffff'
  },
  sale: {
    title: '🔥 Limited Time Sale!',
    subtitle: 'Up to 50% Off Selected Items',
    description: 'Don\'t miss out on our biggest sale of the year. Subscribe to get notified about flash sales and exclusive deals.',
    buttonText: 'Get Sale Alerts',
    backgroundColor: '#dc2626',
    textColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonTextColor: '#dc2626'
  },
  newCollection: {
    title: '✨ New Collection Alert!',
    subtitle: 'Be the First to See What\'s New',
    description: 'Get early access to our latest designs and collections before they go public.',
    buttonText: 'Get Early Access',
    backgroundColor: '#7c3aed',
    textColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonTextColor: '#7c3aed'
  },
  loyalty: {
    title: '💎 QYVE VIP Program',
    subtitle: 'Exclusive Benefits for Members',
    description: 'Join our VIP program for free shipping, exclusive products, and special member-only events.',
    buttonText: 'Join VIP',
    backgroundColor: '#059669',
    textColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonTextColor: '#059669'
  }
};

// GDPR consent types
export const GDPR_CONSENT_TYPES = {
  MARKETING: 'marketing',
  ANALYTICS: 'analytics',
  FUNCTIONAL: 'functional',
  NECESSARY: 'necessary'
} as const;

export type GDPRConsentType = typeof GDPR_CONSENT_TYPES[keyof typeof GDPR_CONSENT_TYPES];

// GDPR consent descriptions
export const GDPR_CONSENT_DESCRIPTIONS = {
  [GDPR_CONSENT_TYPES.MARKETING]: 'We use your data to send you marketing emails, promotional offers, and product updates.',
  [GDPR_CONSENT_TYPES.ANALYTICS]: 'We use analytics to understand how you use our website and improve your experience.',
  [GDPR_CONSENT_TYPES.FUNCTIONAL]: 'We use functional cookies to remember your preferences and provide personalized features.',
  [GDPR_CONSENT_TYPES.NECESSARY]: 'These cookies are essential for the website to function properly and cannot be disabled.'
};

// Banner display rules
export const BANNER_DISPLAY_RULES = {
  // Show banner on these pages
  SHOW_PAGES: ['/', '/home', 'home', 'shop', 'products', 'blog', 'faqs'],
  // Hide banner on these pages
  HIDE_PAGES: ['checkout', 'success', 'failed', 'login', 'signup', 'admin'],
  // Show banner after user has been on site for X seconds
  DELAY_SECONDS: 3,
  // Show banner after user has viewed X pages
  MIN_PAGE_VIEWS: 1,
  // Don't show banner if user has already subscribed
  RESPECT_SUBSCRIPTION: true,
  // Don't show banner if user has dismissed it
  RESPECT_DISMISSAL: true
};

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Banner animation settings
export const BANNER_ANIMATIONS = {
  slideIn: 'slide-in',
  fadeIn: 'fade-in',
  bounce: 'bounce',
  none: 'none'
} as const;

export type BannerAnimation = typeof BANNER_ANIMATIONS[keyof typeof BANNER_ANIMATIONS];

// Banner size variants
export const BANNER_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  full: 'full'
} as const;

export type BannerSize = typeof BANNER_SIZES[keyof typeof BANNER_SIZES];

// Utility functions
export const getBannerConfig = (variant?: string): BannerConfig => {
  if (variant && BANNER_VARIANTS[variant]) {
    return { ...DEFAULT_BANNER_CONFIG, ...BANNER_VARIANTS[variant] };
  }
  return DEFAULT_BANNER_CONFIG;
};

export const shouldShowBanner = (
  currentPage: string,
  hasSubscribed: boolean = false,
  hasDismissed: boolean = false,
  pageViews: number = 0
): boolean => {
  // Don't show if user has subscribed and we respect subscription
  if (hasSubscribed && BANNER_DISPLAY_RULES.RESPECT_SUBSCRIPTION) {
    return false;
  }

  // Don't show if user has dismissed and we respect dismissal
  if (hasDismissed && BANNER_DISPLAY_RULES.RESPECT_DISMISSAL) {
    return false;
  }

  // Don't show on hidden pages
  if (BANNER_DISPLAY_RULES.HIDE_PAGES.includes(currentPage)) {
    return false;
  }

  // Only show on allowed pages
  if (!BANNER_DISPLAY_RULES.SHOW_PAGES.includes(currentPage)) {
    return false;
  }

  // Check minimum page views
  if (pageViews < BANNER_DISPLAY_RULES.MIN_PAGE_VIEWS) {
    return false;
  }

  return true;
};

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const getBannerPosition = (position: 'top' | 'bottom'): string => {
  return position === 'top' ? 'top-0' : 'bottom-0';
};

export const getBannerSize = (size: BannerSize): string => {
  switch (size) {
    case 'small':
      return 'h-16';
    case 'medium':
      return 'h-24';
    case 'large':
      return 'h-32';
    case 'full':
      return 'h-40';
    default:
      return 'h-24';
  }
};
