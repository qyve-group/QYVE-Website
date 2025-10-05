export const GA_MEASUREMENT_ID = 'G-L21TDRCCGP';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
};

export const event = (action: string, params: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

// Enhanced E-commerce Tracking Functions

// Product View Event
export const trackProductView = (product: {
  item_id: string | number;
  item_name: string;
  price?: number;
  currency?: string;
  item_category?: string;
  item_brand?: string;
  item_variant?: string;
  image_url?: string;
}) => {
  event('view_item', {
    currency: product.currency || 'MYR',
    value: product.price || 0,
    items: [
      {
        item_id: product.item_id,
        item_name: product.item_name,
        price: product.price,
        item_category: product.item_category || 'Apparel',
        item_brand: product.item_brand || 'QYVE',
        item_variant: product.item_variant,
        image_url: product.image_url,
      },
    ],
  });
};

// Add to Cart Event
export const trackAddToCart = (product: {
  item_id: string | number;
  item_name: string;
  price: number;
  quantity: number;
  currency?: string;
  item_category?: string;
  item_brand?: string;
  item_variant?: string;
  image_url?: string;
}) => {
  event('add_to_cart', {
    currency: product.currency || 'MYR',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.item_id,
        item_name: product.item_name,
        price: product.price,
        quantity: product.quantity,
        item_category: product.item_category || 'Apparel',
        item_brand: product.item_brand || 'QYVE',
        item_variant: product.item_variant,
        image_url: product.image_url,
      },
    ],
  });
};

// Begin Checkout Event
export const trackBeginCheckout = (
  cartItems: Array<{
    item_id: string | number;
    item_name: string;
    price: number;
    quantity: number;
    item_category?: string;
    item_brand?: string;
    item_variant?: string;
  }>,
  totalValue: number,
  currency: string = 'MYR',
) => {
  event('begin_checkout', {
    currency,
    value: totalValue,
    items: cartItems.map((item) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.item_category || 'Apparel',
      item_brand: item.item_brand || 'QYVE',
      item_variant: item.item_variant,
    })),
  });
};

// Purchase Event
export const trackPurchase = (transaction: {
  transaction_id: string;
  value: number;
  currency?: string;
  items: Array<{
    item_id: string | number;
    item_name: string;
    price: number;
    quantity: number;
    item_category?: string;
    item_brand?: string;
    item_variant?: string;
  }>;
  coupon?: string;
  shipping?: number;
  tax?: number;
}) => {
  event('purchase', {
    transaction_id: transaction.transaction_id,
    currency: transaction.currency || 'MYR',
    value: transaction.value,
    coupon: transaction.coupon,
    shipping: transaction.shipping,
    tax: transaction.tax,
    items: transaction.items.map((item) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.item_category || 'Apparel',
      item_brand: item.item_brand || 'QYVE',
      item_variant: item.item_variant,
    })),
  });
};

// Filter/Sort Usage Events
export const trackFilterUsage = (
  filterType: string,
  filterValue: string,
  // eslint-disable-next-line unused-imports/no-unused-vars
  page: string = 'shop',
) => {
  event('filter_usage', {
    filter_type: filterType,
    filter_value: filterValue,
    page_location: window.location.href,
    page_title: document.title,
  });
};

// eslint-disable-next-line unused-imports/no-unused-vars
export const trackSortUsage = (sortType: string, page: string = 'shop') => {
  event('sort_usage', {
    sort_type: sortType,
    page_location: window.location.href,
    page_title: document.title,
  });
};

// Newsletter Subscription Event
export const trackNewsletterSubscription = (
  email: string,
  source: string = 'website',
) => {
  event('newsletter_subscription', {
    email_domain: email.split('@')[1],
    subscription_source: source,
    page_location: window.location.href,
    page_title: document.title,
  });
};

// Search Event
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  event('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    page_location: window.location.href,
  });
};

// Custom Events
export const trackCustomEvent = (
  eventName: string,
  parameters: Record<string, any>,
) => {
  event(eventName, {
    ...parameters,
    page_location: window.location.href,
    page_title: document.title,
  });
};
