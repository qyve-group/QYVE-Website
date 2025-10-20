# QYVE E-commerce Platform

## Overview
This is a modern Next.js e-commerce application called QYVE, focused on lifestyle products like socks and apparel. The application features a complete shopping experience with product catalogs, shopping cart, checkout, user authentication, automated shipping, email notifications, and comprehensive analytics.

## Project Architecture
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Payments**: Stripe integration
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: Custom components with Radix UI, Headless UI, and lucide-react icons
- **Animations**: Framer Motion and AOS (Animate On Scroll)
- **Email**: Brevo SMTP integration for transactional emails
- **Shipping**: EasyParcel API integration with automated shipment creation
- **Analytics**: Google Analytics 4 with e-commerce event tracking

## Current State
- ✅ Dependencies installed and configured
- ✅ Next.js configured for Replit environment (port 5000, host binding)
- ✅ Development workflow set up
- ✅ Supabase credentials configured and working
- ✅ Redux Persist configured for SSR compatibility
- ✅ SubZero futsal shoe landing page on /subzero route
- ✅ **NEW**: Feature-implementations-v2 branch integrated with fixes
- ✅ **NEW**: Google Analytics 4 with safe error handling
- ✅ **NEW**: Email service integration (Brevo SMTP)
- ✅ **NEW**: EasyParcel shipping automation
- ✅ **NEW**: Refund system with WhatsApp integration
- ✅ **NEW**: Size chart system
- ⚠️ Email SMTP credentials need configuration
- ⚠️ EasyParcel API credentials need configuration (uses mock fallback)
- ⚠️ Database schema updates need to be applied

## Configuration Required

### 1. **Supabase** (Database & Auth) - ✅ Configured
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

### 2. **Stripe** (Payments) - ✅ Configured
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET

### 3. **Email Service** (Brevo/SMTP) - ⚠️ Needs Configuration
   **Recommended: Brevo (Free tier: 300 emails/day)**
   - SMTP_HOST=smtp-relay.brevo.com
   - SMTP_PORT=587
   - SMTP_USER=your-brevo-email@example.com
   - SMTP_PASS=your-brevo-smtp-key
   
   **Alternative: Use Replit SendGrid/Resend integration**

### 4. **Shipping Integration** (EasyParcel) - ⚠️ Optional
   - EASYPARCEL_API_KEY
   - EASYPARCEL_API_SECRET
   - EASYPARCEL_MODE=demo (or 'live' for production)
   
   **Note**: Uses mock service if credentials not provided

### 5. **Analytics** (Google Analytics 4) - ✅ Configured
   - GA_MEASUREMENT_ID=G-L21TDRCCGP (hardcoded in src/lib/gtag.ts)

### 6. **Notifications** (Telegram) - ✅ Configured
   - BOT_TOKEN
   - GROUP_CHAT_ID

## Recent Changes

### October 17, 2025 - Major Feature Integration
- **INTEGRATED**: feature-implementations-v2 branch with all fixes applied
- **FIXED**: CheckoutButton with safe GA tracking (dynamic import + error handling)
- **ADDED**: Email service integration (src/lib/email-service.ts)
- **ADDED**: EasyParcel shipping automation (src/lib/easyparcel-service.ts)
- **ADDED**: Google Analytics 4 tracking (src/lib/gtag.ts)
- **ADDED**: RefundButton component with WhatsApp integration
- **ADDED**: SizeChartButton and SizeChartModal components
- **ADDED**: Size chart data system (src/data/size-charts.ts)
- **ADDED**: Refund types and eligibility system (src/data/refund-types.ts)
- **ADDED**: Automated shipping integration library
- **ADDED**: Database schema files for new features
- **ADDED**: Testing endpoints (/api/test-email, /api/test-easyparcel-connection, /api/test-complete-flow)
- **CREATED**: .env.example with all required environment variables
- **CREATED**: FEATURE_SETUP_GUIDE.md with comprehensive setup instructions
- **CREATED**: FEATURE_BRANCH_ANALYSIS_REPORT.md with detailed analysis

### Previous Changes
- 2025-10-17: Created SubZero futsal shoe landing page at /subzero route
- 2025-10-17: Added SubZero navigation menu item to header
- 2025-10-17: Centered hero CTA button on SubZero landing page
- 2025-10-17: Fixed Redux Persist SSR compatibility with createWebStorage
- 2025-10-17: Fixed AuthProvider loading state to prevent blank screens
- 2025-10-17: Added setLoading(false) dispatches in auth listener for all scenarios
- 2025-09-06: Set up environment-aware Stripe configuration
- 2025-09-06: Fixed CollapsibleCheckout component
- 2025-09-06: Implemented automated Stripe webhook system
- 2025-01-07: Configured Next.js for Replit environment

## User Preferences
- Prefers working applications over mock data
- Needs full e-commerce functionality
- Uses modern React patterns and TypeScript
- Wants automated email and shipping features
- Requires comprehensive analytics tracking

## Key Features

### Core E-commerce
- Product catalog with filtering and search
- Shopping cart with Redux state management
- User authentication with Supabase
- Stripe payment integration
- Responsive design with mobile support
- SEO optimization with Next.js SEO

### NEW: Email System 📧
- Transactional email templates
- Order confirmation emails
- Payment receipt emails
- Shipping notification emails
- Refund confirmation emails
- Brevo SMTP integration

### NEW: Shipping Automation 📦
- EasyParcel API integration
- Automatic rate calculation
- Shipment creation on order confirmation
- Real-time tracking integration
- Email notifications with tracking numbers
- Mock service for testing without API credentials

### NEW: Analytics & Tracking 📊
- Google Analytics 4 integration
- E-commerce event tracking:
  - Product views (view_item)
  - Add to cart (add_to_cart)
  - Begin checkout (begin_checkout)
  - Purchase (purchase)
  - Cart views
  - Product list views
- Safe error handling (checkout works even if GA fails)

### NEW: Customer Service 💬
- **Refund System**:
  - 7-day refund window from delivery
  - Eligibility checking
  - WhatsApp integration for refund requests
  - Multiple refund reasons
  - RefundButton component
  
- **Size Chart System**:
  - Category-specific size charts (futsal, jersey, slides, socks)
  - Interactive modal display
  - Multiple button variants (button, link, icon)
  - SizeChartButton and SizeChartModal components

### Admin Features
- Product management
- Order management
- User management
- Admin dashboard (files downloaded, needs integration)

### Testing Endpoints 🧪
- `/api/test-email` - Test email functionality
- `/api/test-easyparcel-connection` - Test shipping API
- `/api/test-complete-flow` - Test full order-to-shipping flow

## SubZero Landing Page
The SubZero landing page is accessible at `/subzero` and features:
- Hero section with centered CTA button
- Product features accordion
- Call-to-action section
- "Proudly Malaysian" craftsmanship gallery
- Newsletter signup section
- Responsive design with Tailwind CSS
- Navigation menu integration

## New Components Available

### Email & Shipping
- `src/lib/email-service.ts` - Email sending service
- `src/lib/easyparcel-service.ts` - Shipping API service
- `src/lib/automated-shipping-integrated.ts` - Automated shipping system

### Analytics
- `src/lib/gtag.ts` - Google Analytics 4 tracking functions

### Customer-Facing Components
- `src/components/RefundButton.tsx` - Refund request button
- `src/components/SizeChartButton.tsx` - Size chart trigger button
- `src/components/SizeChartModal.tsx` - Size chart modal display

### Data & Types
- `src/data/refund-types.ts` - Refund eligibility types
- `src/data/size-charts.ts` - Size chart data

### Database
- `src/lib/database-schema.sql` - Base schema
- `src/lib/complete-database-schema.sql` - Complete schema with new features

## Database Schema Updates Required

New tables needed:
- `refunds` - Refund request tracking
- `size_charts` - Product size chart data
- `banners` - Marketing banner management
- `campaigns` - Campaign tracking
- Additional columns in `orders` table for shipping tracking

**Apply with**: 
```bash
npm run db:push --force
```

Or manually via Supabase SQL Editor using the schema files.

## Next Steps for Full Functionality

### Immediate (Critical)
1. ✅ Configure email SMTP credentials (Brevo recommended)
2. ✅ Test email system: `curl -X POST http://localhost:5000/api/test-email`
3. ✅ Apply database schema updates
4. ✅ Verify checkout button works without GA breaking it

### Recommended (High Priority)
1. Configure EasyParcel API credentials (optional, uses mock otherwise)
2. Test shipping integration
3. Integrate RefundButton into `/my-orders` page
4. Integrate SizeChartButton into product pages

### Optional Enhancements
1. Customize email templates
2. Set up marketing banners
3. Configure admin dashboard access
4. Review Google Analytics dashboard

## Documentation Files
- `FEATURE_SETUP_GUIDE.md` - Comprehensive setup instructions
- `FEATURE_BRANCH_ANALYSIS_REPORT.md` - Detailed feature analysis
- `.env.example` - All required environment variables
- `replit.md` - This file (project overview)

## Testing & Monitoring
- Browser console shows GA tracking (non-critical errors)
- Email test endpoint validates SMTP configuration
- EasyParcel test endpoint validates shipping API
- All errors are handled gracefully with fallbacks
