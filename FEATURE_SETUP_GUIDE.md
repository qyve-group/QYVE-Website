# QYVE Feature Implementation Setup Guide

## 🎉 Welcome to Your Enhanced QYVE Platform!

Your application now includes **8 major feature enhancements** that were carefully integrated from the `feature-implementations-v2` branch with all critical fixes applied.

---

## ✅ What's Been Applied

### 1. **Fixed Checkout Button** 🛒
- ✅ Google Analytics tracking with error handling
- ✅ Checkout process won't break if GA fails
- ✅ Dynamic import ensures clean fallback
- **Status**: Ready to use

### 2. **Email System** 📧
- Professional transactional emails via Brevo SMTP
- Order confirmations, payment receipts, shipping notifications
- **Status**: ⚠️ Requires SMTP configuration

### 3. **Shipping Automation** 📦
- EasyParcel API integration
- Automatic rate calculation and shipment creation
- Real-time tracking
- **Status**: ⚠️ Requires EasyParcel API credentials

### 4. **Google Analytics 4** 📊
- E-commerce event tracking (view_item, add_to_cart, begin_checkout, purchase)
- Already configured: `G-L21TDRCCGP`
- **Status**: ✅ Active (with safe fallbacks)

### 5. **Refund System** 💰
- 7-day refund window from delivery
- WhatsApp integration for refund requests
- Customer-facing RefundButton component
- **Status**: ✅ Ready to integrate into order pages

### 6. **Size Chart System** 📏
- Interactive size chart modals
- Category-specific charts (futsal, jersey, slides, socks)
- **Status**: ✅ Ready to integrate into product pages

### 7. **Additional Components** 🎨
- MarketingBanner component
- Enhanced filters for shop page
- Campaign management system
- **Status**: ✅ Available for use

### 8. **Testing Endpoints** 🧪
- Email testing: `/api/test-email`
- EasyParcel testing: `/api/test-easyparcel-connection`
- Complete flow testing: `/api/test-complete-flow`
- **Status**: ✅ Ready for testing

---

## 🚀 Quick Start Configuration

### Step 1: Email Service Setup (Recommended: Brevo)

**Why Brevo?** Free tier includes 300 emails/day, professional templates, great deliverability.

1. **Sign up for Brevo** (formerly Sendinblue):
   - Visit: https://app.brevo.com/account/register
   - Sign up for free account

2. **Get SMTP Credentials**:
   - Go to: https://app.brevo.com/settings/keys/smtp
   - Note your:
     - Login email (SMTP_USER)
     - SMTP password (SMTP_PASS)

3. **Configure in Replit**:
   ```bash
   # In Secrets tab (🔒 icon), add:
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-smtp-password
   ```

4. **Test Email System**:
   ```bash
   curl -X POST http://localhost:5000/api/test-email
   ```

**Alternative: Use Replit Integration** (Easier!)
   - I found Replit has SendGrid and Resend integrations
   - These handle secret management automatically
   - Would you like me to set one up?

---

### Step 2: EasyParcel Setup (Optional but Recommended)

**Why EasyParcel?** Automated shipping for Malaysian orders.

1. **Sign up for EasyParcel**:
   - Visit: https://easyparcel.com/my/
   - Register for business account

2. **Get API Credentials**:
   - Go to Developer section
   - Generate API key and secret

3. **Configure in Replit**:
   ```bash
   # In Secrets tab (🔒 icon), add:
   EASYPARCEL_API_KEY=your-api-key
   EASYPARCEL_API_SECRET=your-api-secret
   EASYPARCEL_MODE=demo  # Use 'demo' for testing
   ```

4. **Test EasyParcel**:
   ```bash
   curl -X POST http://localhost:5000/api/test-easyparcel-connection
   ```

**Without API Credentials**: The system uses a mock service automatically!

---

### Step 3: Database Schema Updates (Important!)

The new features require additional database tables. You have 2 options:

#### Option A: Auto-Apply with Drizzle (Recommended)
```bash
npm run db:push
```

#### Option B: Manual SQL (if Drizzle not configured)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run these files in order:
   - `src/lib/database-schema.sql`
   - `src/lib/complete-database-schema.sql`

**New Tables Created**:
- `refunds` - Refund request tracking
- `size_charts` - Product size chart data
- `banners` - Marketing banner management
- `campaigns` - Campaign tracking
- Additional columns in `orders` for shipping

---

## 🧪 Testing Your New Features

### 1. Test Email System
Visit in browser or curl:
```bash
POST /api/test-email
```
Expected: Email test page OR success response

### 2. Test EasyParcel Connection
```bash
POST /api/test-easyparcel-connection
```
Expected: Connection status (uses mock if no credentials)

### 3. Test Complete Flow
```bash
POST /api/test-complete-flow
Body: { "email": "test@example.com" }
```
Expected: Full order-to-shipping flow with email

### 4. Test Checkout Button
1. Add items to cart
2. Go to `/checkout`
3. Fill in shipping info
4. Click "Pay Now"
5. Check browser console for GA tracking (should not break if fails)

### 5. Test Size Chart
1. Go to any product page
2. Look for "Size Chart" button (if integrated)
3. Click to see modal with size chart data

---

## 📋 Integration Checklist

### Immediate (Critical):
- [ ] Configure email SMTP credentials
- [ ] Test email system with `/api/test-email`
- [ ] Apply database schema updates
- [ ] Test checkout button functionality

### Recommended (High Priority):
- [ ] Configure EasyParcel API credentials
- [ ] Test shipping integration
- [ ] Integrate RefundButton into `/my-orders` page
- [ ] Integrate SizeChartButton into product pages

### Optional (Nice to Have):
- [ ] Review GA tracking in Google Analytics dashboard
- [ ] Customize email templates
- [ ] Configure marketing banners
- [ ] Set up admin dashboard access

---

## 🔌 Replit Integrations Available

I found these integrations that could simplify your setup:

### Email Integrations:
1. **SendGrid** - Enterprise-grade email delivery
2. **Resend** - Modern email API
3. **Gmail** - Use your Gmail account

Would you like me to set up one of these instead of manual SMTP?

### Analytics:
1. **Google Analytics** - Already implemented in code!

---

## 🎯 Component Usage Examples

### Using RefundButton in Order Page

```typescript
import RefundButton from '@/components/RefundButton';

// In your order details component:
<RefundButton
  orderNumber={order.order_number}
  orderId={order.id}
  amount={order.total}
  currency="MYR"
  eligibility={{
    is_eligible: true,
    can_request_refund: true,
    days_since_delivery: 3,
    refund_window_days: 7
  }}
/>
```

### Using SizeChartButton in Product Page

```typescript
import SizeChartButton from '@/components/SizeChartButton';

// In your product details component:
<SizeChartButton 
  category="futsal"  // or "jersey", "slides", "socks"
  productName={product.name}
  variant="button"  // or "link", "icon"
/>
```

---

## 🚨 Troubleshooting

### Checkout Button Not Working
**Check**:
1. Browser console for errors
2. STRIPE_SECRET_KEY is configured
3. User is logged in

**GA Tracking**: If GA fails, checkout still works (error handling added)

### Emails Not Sending
**Check**:
1. SMTP credentials are correct
2. Brevo account is active
3. Test with `/api/test-email`

**Fallback**: System will log error but won't crash

### EasyParcel Not Working
**Check**:
1. API credentials are correct
2. EASYPARCEL_MODE is set correctly

**Fallback**: Uses mock service automatically

---

## 📊 Monitoring & Analytics

### Google Analytics Events Tracked:
- `view_item` - Product page views
- `add_to_cart` - Items added to cart
- `begin_checkout` - Checkout started
- `purchase` - Order completed
- `view_cart` - Cart page viewed
- `view_item_list` - Shop page viewed

### Check Analytics:
1. Go to: https://analytics.google.com/
2. Select property: G-L21TDRCCGP
3. View Real-time or Reports

---

## 🎓 Next Steps

### Phase 1: Core Setup (Do Now)
1. ✅ Configure email SMTP
2. ✅ Test checkout button
3. ✅ Apply database schemas
4. ✅ Verify application runs without errors

### Phase 2: Feature Integration (This Week)
1. Add RefundButton to order history page
2. Add SizeChartButton to product pages
3. Test email notifications end-to-end
4. Configure EasyParcel (if using automated shipping)

### Phase 3: Optional Enhancements (Later)
1. Customize email templates
2. Set up marketing banners
3. Configure admin dashboard
4. Add campaign management

---

## 💡 Pro Tips

1. **Start with Email**: Get email working first - it's used by many features
2. **Use Demo Mode**: EasyParcel demo mode lets you test without live API
3. **Check Console**: Browser console shows GA tracking and debug info
4. **Test Incrementally**: Don't enable everything at once
5. **Use Testing Endpoints**: They're specifically designed to isolate issues

---

## 📞 Need Help?

### Common Issues:
- **"Email not working"**: Check SMTP credentials, test with `/api/test-email`
- **"Checkout button does nothing"**: Check browser console, verify Stripe keys
- **"Database errors"**: Apply schema updates with `npm run db:push`
- **"Components not found"**: All new components are in `src/components/`

### Files to Check:
- **Email**: `src/lib/email-service.ts`
- **Shipping**: `src/lib/easyparcel-service.ts`
- **Analytics**: `src/lib/gtag.ts`
- **Database**: `src/lib/complete-database-schema.sql`

---

**Last Updated**: October 17, 2025  
**Applied From**: feature-implementations-v2 branch  
**Critical Fixes**: ✅ All applied  
**Status**: Ready for configuration and testing
