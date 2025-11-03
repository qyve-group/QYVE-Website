# QYVE E-commerce Platform

## Overview
This is a modern Next.js e-commerce application called QYVE, focused on lifestyle products like socks and apparel. The application features a complete shopping experience with product catalogs, shopping cart, checkout, and user authentication.

## Project Architecture
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: Custom components with Radix UI and Headless UI
- **Animations**: Framer Motion and AOS (Animate On Scroll)

## Current State
- ✅ Dependencies installed and configured
- ✅ Next.js configured for Replit environment (port 5000, host binding)
- ✅ Development workflow set up
- ✅ All feature-implementations-v2 features integrated
- ✅ Email system fully configured and production-ready (Brevo SMTP)
- ✅ Marketing banner & GDPR cookie consent working
- ✅ Size chart system fixed and operational (0 LSP errors)
- ✅ Refund system integrated
- ✅ EasyParcel shipping configured (Individual API)
- ✅ SubZero landing page integrated (complete product showcase)

## Configuration Required
To fully run this application, you'll need to configure:

1. **Supabase** (Database & Auth):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

2. **Stripe** (Environment-Aware Setup):
   
   **For Replit (Development/Testing):**
   - STRIPE_TEST_SECRET_KEY (Stripe test secret key)
   - NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY (Stripe test publishable key)
   - STRIPE_TEST_WEBHOOK_SECRET (Stripe test webhook secret)
   
   **For GitHub/Vercel (Production):**
   - STRIPE_SECRET_KEY (Stripe live secret key)
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Stripe live publishable key)
   - STRIPE_WEBHOOK_SECRET (Stripe live webhook secret)
   - NEXT_PUBLIC_BASE_URL (your production domain)

3. **Email Service** ✅ (CONFIGURED - Production Ready):
   - SMTP_HOST ✅ (Brevo SMTP)
   - SMTP_USER ✅ (Configured)
   - SMTP_PASS ✅ (Configured)
   - BREVO_API_KEY ✅ (Configured)
   - Sender: noreply@qyveofficial.com (verified)

4. **EasyParcel Shipping** ✅ (Individual API - Ready):
   - EASYPARCEL_API_KEY ✅ (Configured)
   - Uses Individual API (only requires API key)

5. **Other APIs** (Optional):
   - Telegram Bot Token (for notifications)
   - Google Analytics ID

## Production Readiness
- ✅ **Email System**: 100% production-ready (Brevo SMTP configured)
- ✅ **EasyParcel**: 100% production-ready (Individual API configured)
- ✅ **Stripe**: Environment-aware (test keys for dev, production keys for deploy)
- ✅ **All Features**: Integrated and working (marketing banner, cookie consent, size charts, refunds)
- 📄 **Documentation**: See PRODUCTION_READINESS_ANALYSIS.md for full details

## Recent Changes
- 2025-11-03: Updated EasyParcel service to use REPLIT_DEPLOYMENT for auto-environment detection
- 2025-11-03: Merged SubZero landing page from subzero branch (6 components: Hero, Features, CTA, ProudlyMalaysian, Newsletter)
- 2025-10-30: Analyzed production readiness for email and EasyParcel integrations
- 2025-10-30: Created comprehensive production readiness documentation
- 2025-10-30: Fixed SizeChartModal component (reduced from 33 LSP errors to 0)
- 2025-10-30: Integrated all feature-implementations-v2 features (164 files)
- 2025-10-30: Created cookie consent usage guide and backend tracking API
- 2025-09-06: Set up environment-aware Stripe configuration (test keys for Replit, production for Vercel)
- 2025-09-06: Fixed CollapsibleCheckout component to properly call Stripe API
- 2025-09-06: Implemented automated Stripe webhook system for payment confirmations
- 2025-09-06: Added email service integration for sending automated payment receipts
- 2025-09-06: Enhanced checkout process to pass customer metadata to Stripe
- 2025-09-06: Fixed cart image loading issues with proper selectedImage initialization
- 2025-09-06: Implemented collapsible checkout sections with smart validation
- 2025-09-06: Added Malaysia-only shipping restrictions
- 2025-01-07: Configured Next.js for Replit environment
- 2025-01-07: Set up development workflow on port 5000
- 2025-01-07: Added graceful fallbacks for missing Supabase credentials
- 2025-01-07: Created placeholder environment variables

## User Preferences
- Prefers working applications over mock data
- Needs full e-commerce functionality
- Uses modern React patterns and TypeScript

## Key Features
- Product catalog with filtering and search
- Shopping cart with Redux state management
- User authentication with Supabase + Google OAuth
- Stripe payment integration with automated webhooks
- Responsive design with mobile support
- SEO optimization with Next.js SEO
- Admin dashboard (10+ pages for management)
- Order management system
- **SubZero landing page** (dedicated product showcase with hero, features, CTA, newsletter signup)
- **Marketing banner system** (top/bottom placement, newsletter integration)
- **GDPR cookie consent** (4 consent types with localStorage tracking)
- **Automated email system** (order confirmations, shipping, refunds via Brevo)
- **Size chart system** (interactive questionnaires with size recommendations)
- **Refund system** (WhatsApp integration, 7-day window tracking)
- **EasyParcel shipping** (automated shipment creation, tracking, notifications)
- **Google Analytics 4** (e-commerce event tracking)

## Documentation Files
- **FEATURE_STATUS_SUMMARY.md**: Complete feature breakdown and status
- **PRODUCTION_READINESS_ANALYSIS.md**: Email & EasyParcel production readiness
- **COOKIE_CONSENT_USAGE_GUIDE.md**: How to leverage GDPR consent for business
- **DATABASE_SCHEMA_CONSENT.sql**: Database table for tracking user consent