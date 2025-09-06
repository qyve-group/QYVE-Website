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
- ⚠️ Supabase credentials need to be configured for full functionality
- ⚠️ Stripe credentials need to be configured for payments

## Configuration Required
To fully run this application, you'll need to configure:

1. **Supabase** (Database & Auth):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

2. **Stripe** (Payments):
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

3. **Other APIs** (Optional):
   - Telegram Bot Token (for notifications)
   - Google Analytics ID

## Recent Changes
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
- User authentication with Supabase
- Stripe payment integration
- Responsive design with mobile support
- SEO optimization with Next.js SEO
- Admin features for product management
- Order management system