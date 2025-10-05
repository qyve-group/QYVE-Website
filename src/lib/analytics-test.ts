// Analytics Testing Script
// This file can be used to test Google Analytics tracking in development

import {
  trackAddToCart,
  trackBeginCheckout,
  trackCustomEvent,
  trackFilterUsage,
  trackNewsletterSubscription,
  trackProductView,
  trackPurchase,
  trackSearch,
  trackSortUsage,
} from './gtag';

// Test Product View
export const testProductView = () => {
  console.log('🧪 Testing Product View Tracking...');
  trackProductView({
    item_id: 'test-product-123',
    item_name: 'Test Product',
    price: 25.0,
    currency: 'MYR',
    item_category: 'Apparel',
    item_brand: 'QYVE',
    item_variant: 'Black',
    image_url: '/test-product.jpg',
  });
  console.log('✅ Product view event sent');
};

// Test Add to Cart
export const testAddToCart = () => {
  console.log('🧪 Testing Add to Cart Tracking...');
  trackAddToCart({
    item_id: 'test-product-123',
    item_name: 'Test Product',
    price: 25.0,
    quantity: 2,
    currency: 'MYR',
    item_category: 'Apparel',
    item_brand: 'QYVE',
    item_variant: 'Black',
    image_url: '/test-product.jpg',
  });
  console.log('✅ Add to cart event sent');
};

// Test Begin Checkout
export const testBeginCheckout = () => {
  console.log('🧪 Testing Begin Checkout Tracking...');
  const testCartItems = [
    {
      item_id: 'test-product-123',
      item_name: 'Test Product',
      price: 25.0,
      quantity: 2,
      item_category: 'Apparel',
      item_brand: 'QYVE',
      item_variant: 'Black',
    },
  ];
  trackBeginCheckout(testCartItems, 50.0, 'MYR');
  console.log('✅ Begin checkout event sent');
};

// Test Purchase
export const testPurchase = () => {
  console.log('🧪 Testing Purchase Tracking...');
  trackPurchase({
    transaction_id: 'test-transaction-123',
    value: 50.0,
    currency: 'MYR',
    items: [
      {
        item_id: 'test-product-123',
        item_name: 'Test Product',
        price: 25.0,
        quantity: 2,
        item_category: 'Apparel',
        item_brand: 'QYVE',
        item_variant: 'Black',
      },
    ],
    shipping: 5.0,
    tax: 0.0,
  });
  console.log('✅ Purchase event sent');
};

// Test Filter Usage
export const testFilterUsage = () => {
  console.log('🧪 Testing Filter Usage Tracking...');
  trackFilterUsage('color', 'black', 'shop');
  trackFilterUsage('size', 'M', 'shop');
  trackFilterUsage('price', '25-50', 'shop');
  console.log('✅ Filter usage events sent');
};

// Test Sort Usage
export const testSortUsage = () => {
  console.log('🧪 Testing Sort Usage Tracking...');
  trackSortUsage('price_low_to_high', 'shop');
  trackSortUsage('newest', 'shop');
  trackSortUsage('popular', 'shop');
  console.log('✅ Sort usage events sent');
};

// Test Newsletter Subscription
export const testNewsletterSubscription = () => {
  console.log('🧪 Testing Newsletter Subscription Tracking...');
  trackNewsletterSubscription('test@example.com', 'footer');
  trackNewsletterSubscription('user@gmail.com', 'popup');
  console.log('✅ Newsletter subscription events sent');
};

// Test Search
export const testSearch = () => {
  console.log('🧪 Testing Search Tracking...');
  trackSearch('socks', 5);
  trackSearch('jersey', 3);
  console.log('✅ Search events sent');
};

// Test Custom Events
export const testCustomEvents = () => {
  console.log('🧪 Testing Custom Events Tracking...');
  trackCustomEvent('button_click', {
    button_name: 'hero_cta',
    page_section: 'homepage',
  });
  trackCustomEvent('video_play', {
    video_title: 'product_demo',
    video_duration: 120,
  });
  console.log('✅ Custom events sent');
};

// Run All Tests
export const runAllAnalyticsTests = () => {
  console.log('🚀 Running All Google Analytics Tests...');
  console.log('=====================================');

  testProductView();
  setTimeout(() => testAddToCart(), 100);
  setTimeout(() => testBeginCheckout(), 200);
  setTimeout(() => testPurchase(), 300);
  setTimeout(() => testFilterUsage(), 400);
  setTimeout(() => testSortUsage(), 500);
  setTimeout(() => testNewsletterSubscription(), 600);
  setTimeout(() => testSearch(), 700);
  setTimeout(() => testCustomEvents(), 800);

  setTimeout(() => {
    console.log('=====================================');
    console.log('✅ All analytics tests completed!');
    console.log('Check Google Analytics Real-Time reports to verify events');
  }, 1000);
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).analyticsTest = {
    testProductView,
    testAddToCart,
    testBeginCheckout,
    testPurchase,
    testFilterUsage,
    testSortUsage,
    testNewsletterSubscription,
    testSearch,
    testCustomEvents,
    runAllAnalyticsTests,
  };
}
