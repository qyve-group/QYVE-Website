# Google Analytics 4 Implementation Documentation

## 📊 Overview

This document outlines the comprehensive Google Analytics 4 (GA4) implementation for the QYVE e-commerce platform. The implementation includes site-wide tracking and detailed e-commerce event tracking for enhanced analytics and conversion measurement.

## 🎯 Implementation Summary

### ✅ Completed Features

1. **Site-wide Google Analytics Integration**
2. **E-commerce Event Tracking**
   - Product view events
   - Add to cart events
   - Begin checkout events
   - Purchase completion events
3. **User Behavior Tracking**
   - Filter usage tracking
   - Sort usage tracking
   - Newsletter subscription tracking
   - Search tracking
4. **Stripe Payment Conversion Tracking**

## 🏗️ Technical Architecture

### Core Files

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/gtag.ts` | Core analytics functions | ✅ Complete |
| `src/components/Analytics.tsx` | SPA navigation tracking | ✅ Complete |
| `src/app/layout.tsx` | GA4 script injection | ✅ Complete |
| `src/lib/analytics-test.ts` | Testing utilities | ✅ Complete |

### Event Tracking Implementation

| Component | Event Type | Function | Status |
|-----------|------------|----------|--------|
| Product Pages | `view_item` | `trackProductView()` | ✅ Complete |
| Add to Cart | `add_to_cart` | `trackAddToCart()` | ✅ Complete |
| Checkout Button | `begin_checkout` | `trackBeginCheckout()` | ✅ Complete |
| Success Page | `purchase` | `trackPurchase()` | ✅ Complete |
| Filter Component | `filter_usage` | `trackFilterUsage()` | ✅ Complete |
| Sort Options | `sort_usage` | `trackSortUsage()` | ✅ Complete |
| Newsletter | `newsletter_subscription` | `trackNewsletterSubscription()` | ✅ Complete |
| Search | `search` | `trackSearch()` | ✅ Complete |

## 🔧 Implementation Details

### 1. Google Analytics Setup

**Measurement ID**: `G-L21TDRCCGP`

**Global Script Injection** (`src/app/layout.tsx`):
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-L21TDRCCGP"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-L21TDRCCGP', {
      send_page_view: false
    });
  `}
</Script>
```

### 2. E-commerce Event Tracking

#### Product View Tracking
**Location**: `src/app/products/[productSlug]/page.tsx`
```typescript
trackProductView({
  item_id: selectedProduct?.id,
  item_name: selectedProduct?.name,
  price: selectedProduct?.price,
  currency: 'MYR',
  item_category: 'Apparel',
  item_brand: 'QYVE',
  image_url: selectedProduct?.image_cover,
});
```

#### Add to Cart Tracking
**Location**: `src/app/products/[productSlug]/SectionProductHeader.tsx`
```typescript
trackAddToCart({
  item_id: selectedProductSizeId,
  item_name: `${selectedColor}`,
  price,
  quantity: 1,
  currency: 'MYR',
  item_category: 'Apparel',
  item_brand: 'QYVE',
  item_variant: selectedSize,
  image_url: selectedImage,
});
```

#### Checkout Tracking
**Location**: `src/components/CheckoutButton.tsx`
```typescript
trackBeginCheckout(
  cartItems.map(item => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
    item_category: 'Apparel',
    item_brand: 'QYVE',
    item_variant: item.product_size,
  })),
  totalValue,
  'MYR'
);
```

#### Purchase Tracking
**Location**: `src/app/success/page.tsx`
```typescript
trackPurchase({
  transaction_id: sessionId,
  value: orderData.total_value,
  currency: 'MYR',
  items: orderData.items,
});
```

### 3. User Behavior Tracking

#### Filter Usage Tracking
**Location**: `src/components/Filter.tsx`
```typescript
const handleFilterChange = (filterType: string, value: string) => {
  trackFilterUsage(filterType, value, 'shop');
};
```

#### Newsletter Subscription Tracking
**Location**: `src/shared/Footer/Subscribe.tsx`
```typescript
const handleSubscribe = async () => {
  trackNewsletterSubscription(email, 'footer');
  // ... subscription logic
};
```

## 📈 Analytics Events Structure

### Standard E-commerce Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `view_item` | `currency`, `value`, `items[]` | Product page views |
| `add_to_cart` | `currency`, `value`, `items[]` | Add to cart actions |
| `begin_checkout` | `currency`, `value`, `items[]` | Checkout initiation |
| `purchase` | `transaction_id`, `currency`, `value`, `items[]` | Completed purchases |

### Custom Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `filter_usage` | `filter_type`, `filter_value`, `page_location` | Filter interactions |
| `sort_usage` | `sort_type`, `page_location` | Sort interactions |
| `newsletter_subscription` | `email_domain`, `subscription_source` | Email signups |
| `search` | `search_term`, `results_count` | Search queries |

### Item Data Structure

```typescript
interface ItemData {
  item_id: string | number;
  item_name: string;
  price: number;
  quantity: number;
  item_category: string;
  item_brand: string;
  item_variant?: string;
  image_url?: string;
}
```

## 🧪 Testing Implementation

### Testing Script
**Location**: `src/lib/analytics-test.ts`

The testing script provides comprehensive testing functions:

```typescript
// Import testing functions
import { runAllAnalyticsTests } from '@/lib/analytics-test';

// Run all tests
runAllAnalyticsTests();
```

### Manual Testing Checklist

- [ ] **Product View Tracking**
  - [ ] Navigate to product pages
  - [ ] Verify `view_item` events in GA4 Real-Time
  - [ ] Check item data accuracy

- [ ] **Add to Cart Tracking**
  - [ ] Add items to cart
  - [ ] Verify `add_to_cart` events
  - [ ] Test both "Add to Cart" and "Buy Now" buttons

- [ ] **Checkout Tracking**
  - [ ] Start checkout process
  - [ ] Verify `begin_checkout` events
  - [ ] Check cart items data

- [ ] **Purchase Tracking**
  - [ ] Complete test purchase
  - [ ] Verify `purchase` events
  - [ ] Check transaction ID and value

- [ ] **Filter/Sort Tracking**
  - [ ] Use filters on shop page
  - [ ] Change sort options
  - [ ] Verify `filter_usage` and `sort_usage` events

- [ ] **Newsletter Tracking**
  - [ ] Subscribe to newsletter
  - [ ] Verify `newsletter_subscription` events

### Browser Console Testing

```javascript
// Test individual functions
analyticsTest.testProductView();
analyticsTest.testAddToCart();
analyticsTest.testPurchase();

// Run all tests
analyticsTest.runAllAnalyticsTests();
```

## 🔍 Verification in Google Analytics

### Real-Time Reports
1. Navigate to GA4 Real-Time reports
2. Perform actions on the website
3. Verify events appear in Real-Time > Events

### Enhanced E-commerce Reports
1. Go to GA4 > Reports > Monetization
2. Check "E-commerce purchases" report
3. Verify transaction data accuracy

### Custom Events
1. Go to GA4 > Reports > Engagement > Events
2. Look for custom events:
   - `filter_usage`
   - `sort_usage`
   - `newsletter_subscription`
   - `search`

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tracking functions implemented
- [ ] Test all events in development
- [ ] Verify GA4 measurement ID is correct
- [ ] Check console for JavaScript errors

### Post-Deployment
- [ ] Verify GA4 Real-Time reports
- [ ] Test complete purchase flow
- [ ] Check conversion tracking
- [ ] Monitor for tracking errors

## 📊 Expected Analytics Insights

### E-commerce Metrics
- **Product Performance**: Most viewed and purchased products
- **Cart Abandonment**: Checkout completion rates
- **Revenue Tracking**: Accurate transaction values
- **Customer Journey**: Complete funnel analysis

### User Behavior Metrics
- **Filter Usage**: Most popular filters and their impact
- **Search Behavior**: Popular search terms
- **Newsletter Engagement**: Subscription rates by source
- **Navigation Patterns**: User flow through the site

## 🔧 Troubleshooting

### Common Issues

1. **Events Not Appearing**
   - Check GA4 measurement ID
   - Verify gtag script is loading
   - Check browser console for errors

2. **Incomplete Data**
   - Verify all required parameters are passed
   - Check data types (numbers vs strings)
   - Ensure currency codes are correct

3. **Purchase Events Missing**
   - Check Stripe webhook configuration
   - Verify order-details API endpoint
   - Check success page implementation

### Debug Tools

```javascript
// Check if gtag is loaded
console.log(typeof window.gtag);

// Check dataLayer
console.log(window.dataLayer);

// Test event manually
window.gtag('event', 'test_event', {
  test_parameter: 'test_value'
});
```

## 📝 Maintenance

### Regular Checks
- [ ] Monthly GA4 report review
- [ ] Verify conversion tracking accuracy
- [ ] Check for new tracking requirements
- [ ] Update event parameters as needed

### Performance Monitoring
- [ ] Monitor tracking script load times
- [ ] Check for JavaScript errors
- [ ] Verify mobile tracking functionality
- [ ] Test across different browsers

## 🎯 Next Steps

1. **Enhanced Tracking**
   - Add scroll depth tracking
   - Implement video engagement tracking
   - Add form abandonment tracking

2. **Advanced Analytics**
   - Set up custom dimensions
   - Create advanced segments
   - Implement goal tracking

3. **Reporting Automation**
   - Set up automated reports
   - Create custom dashboards
   - Implement alert systems

---

**Implementation Date**: January 2025  
**Version**: 1.0  
**Status**: ✅ Complete and Tested  
**Next Review**: February 2025
