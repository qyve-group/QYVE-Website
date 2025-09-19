# QYVE E-commerce Platform - Knowledge Transfer Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Journey Flowcharts](#user-journey-flowcharts)
4. [Technical Components & Data Flow](#technical-components--data-flow)
5. [Database Schema](#database-schema)
6. [Key Features](#key-features)
7. [Third-Party Integrations](#third-party-integrations)
8. [Environment Configuration](#environment-configuration)
9. [File Structure](#file-structure)
10. [Authentication & Authorization](#authentication--authorization)
11. [Payment Processing](#payment-processing)
12. [Deployment Guide](#deployment-guide)
13. [Development Workflow](#development-workflow)
14. [Troubleshooting Guide](#troubleshooting-guide)
15. [API Endpoints](#api-endpoints)

---

## 🏗️ Project Overview

**QYVE** is a modern Next.js e-commerce application focused on lifestyle products (socks, apparel, jerseys). Built with TypeScript, it features a complete shopping experience with product catalogs, shopping cart, secure checkout, and comprehensive user management.

### Technology Stack
- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, AOS animations
- **State Management**: Redux Toolkit with Redux Persist
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **Payments**: Stripe (Card & FPX)
- **Email**: Brevo SMTP
- **Notifications**: Telegram Bot
- **Hosting**: Replit (Dev), GitHub/Vercel (Production)

---

## 🏛️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (Next.js)     │    │   (Next.js)     │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Pages/Routes  │◄──►│ • /api/checkout │◄──►│ • Stripe API    │
│ • Components    │    │ • /api/webhook  │    │ • Supabase DB   │
│ • Redux Store   │    │ • /api/orders   │    │ • Brevo SMTP    │
│ • State Persist │    │ • /api/shipment │    │ • Telegram Bot  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Middleware    │
                    │ • Auth Guard    │
                    │ • CORS Config   │
                    │ • Session Mgmt  │
                    └─────────────────┘
```

### Core Architecture Principles
- **Server + Client Components**: Leverages Next.js App Router for optimal performance
- **State Persistence**: Cart and auth state persist across sessions
- **Real-time Sync**: Cart syncs to Supabase for authenticated users
- **Event-Driven**: Stripe webhooks drive order processing
- **Environment-Aware**: Different configurations for dev/production

---

## 🛒 User Journey Flowcharts

### Shopping Flow
```
Home (/home) → Shop (/shop) → Product (/products/[slug]) → Add to Cart (Redux) → Cart (/cart) → Checkout (/checkout) → Success (/success)
```

### Authentication Flow
```
Login (/login) → Google OAuth → Supabase → Callback (/auth/callback) → Session Exchange → Redux Update → Redirect to Intended Page
```

### Checkout & Payment Flow
```
Cart Review → Contact Info → Shipping Address → Payment Method → Stripe Checkout → Webhook Processing → Order Confirmation → Email + Telegram Notifications
```

### Order Management Flow
```
Order Placed → Payment Confirmed → Inventory Updated → Admin Notification → Order Processing → Shipment Tracking → Customer Updates
```

---

## ⚙️ Technical Components & Data Flow

### State Management
- **Location**: `src/store/`
- **Files**: 
  - `store.ts` - Redux store configuration
  - `cartSlice.ts` - Shopping cart state
  - `authSlice.ts` - Authentication state
- **Persistence**: Redux Persist saves cart/auth to localStorage
- **Sync Service**: `src/services/cartProvider.tsx` debounces cart saves to Supabase

### Authentication System
- **Provider**: `src/services/authProvider.tsx` 
- **Listeners**: `src/store/authListener.ts`
- **Flow**: Supabase auth changes → Redux state updates → Component re-renders

### API Architecture
```
Client Request → Middleware (CORS, Auth) → API Route → External Service → Database → Response
```

### Key Data Flow Patterns
1. **Cart Operations**: Component → Redux Action → State Update → Persist → Sync to Supabase
2. **Authentication**: OAuth → Supabase → Server → Redux → Local Storage
3. **Payments**: Client → Stripe Session → Webhook → Order Creation → Notifications
4. **Product Data**: Supabase → Server Components → Client Hydration → Redux (if needed)

---

## 🗄️ Database Schema

### Core Tables Structure

```sql
-- Products Catalog
products (id, name, description, price, category, created_at)
├── product_colors (id, product_id, color_name, color_code)
│   └── products_sizes (id, product_color_id, size, stock, price_modifier)
└── product_shots (id, product_id, image_url, alt_text, order_index)

-- Commerce
orders (id, user_id, total_amount, status, created_at, updated_at)
├── order_items (id, order_id, product_size_id, quantity, price)
├── order_addresses (id, order_id, first_name, last_name, address_line_1, address_line_2, city, state, postal_code)
└── order_contact_info (id, order_id, email, phone)

-- User Management
users (id, email, created_at) -- Managed by Supabase Auth
└── carts (id, user_id, created_at, updated_at)
    └── cart_items (id, cart_id, product_size_id, quantity, created_at)

-- Content Management
blog_posts (id, title, slug, content, excerpt, featured_image, published, created_at, updated_at)

-- System
vouchers (id, code, discount_type, discount_value, valid_from, valid_to, usage_limit, used_count)
```

### Key Relationships
- `products` ← `product_colors` ← `products_sizes`
- `orders` ← `order_items` → `products_sizes`
- `users` ← `orders` ← `order_items`
- `users` ← `carts` ← `cart_items`

---

## 🚀 Key Features

### Customer-Facing Features
1. **Product Catalog**
   - Dynamic product pages with variants
   - Color and size selection
   - Image galleries with zoom
   - Stock management

2. **Shopping Cart**
   - Persistent cart state
   - Real-time total calculations
   - Quantity adjustments
   - Voucher system

3. **Checkout Process**
   - Guest and authenticated checkout
   - Address validation
   - Payment method selection (Card/FPX)
   - Order confirmation

4. **User Account**
   - Google OAuth login
   - Order history
   - Shipment tracking
   - Refund requests

### Admin Features
1. **Content Management**
   - Blog post creation (`/admin/blog`)
   - SEO optimization
   - Content publishing workflow

2. **Order Management**
   - Order processing
   - Shipment updates
   - Customer communications

### System Features
1. **Email Automation**
   - Order confirmations
   - Shipping notifications
   - Payment receipts

2. **Notification System**
   - Telegram admin alerts
   - Real-time order updates

3. **Analytics Integration**
   - Google Analytics
   - Conversion tracking

---

## 🔗 Third-Party Integrations

### Stripe Payment Processing
- **Purpose**: Handle card and FPX payments
- **Configuration**: Environment-aware (test/live keys)
- **Implementation**: 
  - Client: Stripe Checkout Sessions
  - Server: Webhook validation and order processing
- **Files**: `src/app/api/checkout/route.ts`, `src/app/api/webhook/route.ts`

### Supabase Backend
- **Services**: Authentication, Database, Storage
- **Auth**: Google OAuth integration
- **Database**: PostgreSQL with Row Level Security
- **Files**: `src/libs/supabaseClient.ts`, `src/libs/supabaseServer.ts`

### Brevo Email Service
- **Purpose**: Transactional emails (receipts, notifications)
- **Implementation**: `src/lib/email.ts`
- **Templates**: Dynamic HTML email generation

### Telegram Notifications
- **Purpose**: Admin alerts for new orders
- **Implementation**: `src/libs/telegram.ts`
- **Bot Token**: Required for production notifications

### Google Services
- **OAuth**: Authentication via Supabase
- **Analytics**: Conversion and behavior tracking
- **Configuration**: Google Cloud Console setup required

---

## 🔧 Environment Configuration

### Required Environment Variables

#### Core Application
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

#### Payment Processing (Environment-Aware)
```bash
# Development (Replit) - Test Keys
STRIPE_TEST_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...
STRIPE_TEST_WEBHOOK_SECRET=whsec_test_...

# Production (Vercel/Netlify) - Live Keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

#### Email Service
```bash
# Brevo SMTP
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-brevo-smtp-key

# Fallback Gmail (Optional)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

#### Notifications
```bash
# Telegram Bot
BOT_TOKEN=your-telegram-bot-token
GROUP_CHAT_ID=your-telegram-chat-id
```

#### Analytics (Optional)
```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

#### System Configuration
```bash
COMPANY_NAME=QYVE
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Environment Detection
The system automatically detects environment using `REPLIT_DEV_DOMAIN`:
- **Present**: Uses test Stripe keys
- **Absent**: Uses production Stripe keys

---

## 📁 File Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── admin/                   # Admin routes
│   │   └── blog/                # Blog management
│   ├── api/                     # API routes
│   │   ├── checkout/            # Stripe session creation
│   │   ├── webhook/             # Stripe webhook handler
│   │   ├── orders/              # Order management
│   │   └── shipment/            # Shipping updates
│   ├── auth/                    # Authentication
│   │   └── callback/            # OAuth callback
│   ├── checkout/                # Checkout pages
│   ├── products/                # Product pages
│   ├── my-orders/               # User orders
│   └── [other-routes]/
├── components/                   # Reusable components
│   ├── Header/                  # Navigation
│   ├── LoginForm.tsx            # Authentication form
│   └── [feature-components]/
├── shared/                      # UI components
│   ├── Button/                  # Button variants
│   ├── Input/                   # Form inputs
│   └── [ui-components]/
├── store/                       # Redux state
│   ├── store.ts                 # Store configuration
│   ├── cartSlice.ts             # Cart state
│   ├── authSlice.ts             # Auth state
│   └── authListener.ts          # Auth event listener
├── services/                    # Business logic
│   ├── cartProvider.tsx         # Cart sync service
│   ├── authProvider.tsx         # Auth provider
│   └── [api-services]/
├── libs/                        # External service clients
│   ├── supabaseClient.ts        # Client-side Supabase
│   ├── supabaseServer.ts        # Server-side Supabase
│   ├── telegram.ts              # Telegram notifications
│   └── middleware.ts            # Request middleware
├── lib/                         # Utilities
│   ├── email.ts                 # Email service
│   └── gtag.ts                  # Analytics
├── utils/                       # Helper functions
│   ├── debounce.ts              # Performance utilities
│   ├── orderStatusMapper.ts     # Status mapping
│   └── [utilities]/
├── hooks/                       # Custom React hooks
├── data/                        # Static data
├── images/                      # Static assets
└── styles/                      # CSS files
```

### Key Configuration Files
- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Styling configuration  
- `package.json` - Dependencies and scripts
- `middleware.ts` - Request interceptor
- `replit.md` - Project documentation

---

## 🔐 Authentication & Authorization

### Google OAuth Flow
1. **Initiation**: User clicks "Continue with Google"
2. **Redirect**: Supabase redirects to Google OAuth
3. **Callback**: Google returns to `/auth/callback`
4. **Exchange**: Server exchanges code for session
5. **Update**: Redux state updated via auth provider
6. **Persist**: Session persisted across page loads

### Session Management
- **Client**: `src/libs/supabaseClient.ts`
- **Server**: `src/libs/supabaseServer.ts` (with cookies)
- **Persistence**: Redux Persist + Supabase sessions
- **Protection**: Middleware guards protected routes

### Common Auth Issues & Solutions
1. **Implicit Flow Detection**: Code now catches `#access_token` and shows proper error
2. **Domain Mismatch**: Ensure OAuth redirect URIs match exactly (www vs non-www)
3. **Session Expiry**: Auto-refresh handled by Supabase client

---

## 💳 Payment Processing

### Stripe Integration Architecture
```
Cart Data → /api/checkout → Stripe Session → Stripe Hosted Page → Payment → Webhook → Order Processing
```

### Checkout Process
1. **Session Creation**: `POST /api/checkout`
   - Validates cart items
   - Creates Stripe checkout session
   - Includes customer metadata

2. **Payment**: User redirected to Stripe
   - Handles card payments
   - Supports FPX (Malaysian banking)
   - Mobile-optimized interface

3. **Webhook Processing**: `POST /api/webhook`
   - Validates Stripe signature
   - Creates order record
   - Updates inventory
   - Sends confirmations
   - Notifies admin via Telegram

### Environment-Specific Configuration
- **Development**: Automatic test key selection
- **Production**: Live keys for actual transactions
- **Webhook URLs**: Different endpoints per environment

### Security Measures
- Stripe signature validation
- CORS protection (locked to production domain)
- Server-side session verification
- Metadata encryption for sensitive data

---

## 🚀 Deployment Guide

### Development Environment (Replit)
1. **Automatic Setup**: Environment pre-configured
2. **Port Configuration**: Bound to port 5000
3. **Host Binding**: `0.0.0.0` for external access
4. **Test Keys**: Stripe test mode enabled
5. **Domain**: Dynamic Replit subdomain

### Production Deployment

#### Vercel Deployment
1. **GitHub Integration**: Connect repository
2. **Environment Variables**: Set all production variables
3. **Domain Configuration**: Configure custom domain
4. **Build Settings**: Default Next.js configuration

#### Configuration Checklist
- [ ] Google Cloud Console: Add production domain to OAuth redirect URIs
- [ ] Supabase Dashboard: Add production domain to allowed origins
- [ ] Stripe Dashboard: Set production webhook endpoint
- [ ] Environment Variables: All production keys configured
- [ ] DNS Settings: Domain pointing to deployment platform

### Domain-Specific Configurations
```javascript
// OAuth Redirect URIs
https://your-domain.com/auth/callback
https://www.your-domain.com/auth/callback

// Stripe Webhook URLs
https://your-domain.com/api/webhook

// CORS Origins
https://your-domain.com
https://www.your-domain.com
```

---

## 🛠️ Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Available Scripts
- `dev` - Start development server on port 5000
- `build` - Create production build
- `start` - Start production server
- `lint` - Run ESLint
- `type-check` - Run TypeScript compiler
- `check-types` - Comprehensive type checking

### Development Best Practices
1. **Component Structure**: Use shared components for UI consistency
2. **State Management**: Keep business logic in Redux slices
3. **API Design**: Follow RESTful patterns for consistency
4. **Error Handling**: Implement comprehensive error boundaries
5. **Performance**: Leverage Next.js optimization features

### Testing Strategy
1. **Unit Tests**: Component and utility testing
2. **Integration Tests**: API endpoint testing
3. **E2E Tests**: Critical user journeys
4. **Manual Testing**: Payment flows and admin functions

---

## 🔧 Troubleshooting Guide

### Authentication Issues

#### "Authentication was cancelled or incomplete"
**Cause**: OAuth redirect URI mismatch
**Solution**: 
1. Check Google Cloud Console redirect URIs
2. Verify Supabase allowed origins
3. Ensure domain consistency (www vs non-www)

#### Implicit Flow Detected
**Cause**: Google OAuth configured for implicit flow instead of authorization code flow
**Solution**: 
1. Google Cloud Console → OAuth Client → Application Type: "Web application"
2. Ensure authorization code flow is selected

### Payment Issues

#### Stripe Webhook Failures
**Cause**: Invalid webhook signature or endpoint
**Solutions**:
1. Verify webhook secret matches environment
2. Check webhook endpoint URL
3. Ensure proper HTTPS configuration
4. Validate request signature handling

#### Checkout Session Creation Fails
**Common Causes**:
1. Invalid cart items data structure
2. Missing required customer information
3. Stripe key mismatch (test vs live)
4. CORS policy blocking request

### Development Issues

#### Redux Persist Warnings
```
redux-persist failed to create sync storage. falling back to noop storage.
```
**Cause**: Server-side rendering limitation
**Impact**: Minimal - falls back gracefully
**Solution**: This is expected behavior, no action needed

#### Build Errors
**TypeScript Errors**: Run `npm run type-check` to identify issues
**ESLint Errors**: Run `npm run lint` to fix formatting issues
**Missing Dependencies**: Ensure all required packages are installed

### Performance Issues

#### Slow Page Loads
1. Check image optimization settings
2. Verify lazy loading implementation
3. Review bundle size with analyzer
4. Optimize database queries

#### Cart Sync Delays
1. Verify debounce settings in cart provider
2. Check Supabase connection stability
3. Review authentication state management

---

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/health` - System health check
- `POST /api/webhook` - Stripe webhook handler
- `GET /api/orders/[id]` - Public order status

### Authenticated Endpoints
- `POST /api/checkout` - Create checkout session
- `GET /api/orders` - User orders
- `POST /api/shipment` - Update shipment status
- `GET /api/check-voucher` - Validate voucher codes

### Admin Endpoints
- `POST /api/admin/blog` - Create blog posts
- `GET /api/admin/orders` - All orders
- `POST /api/admin/inventory` - Update inventory

### Webhook Endpoints
- `POST /api/webhook` - Stripe payment events
- `POST /api/telegram-webhook` - Telegram bot updates

### API Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-XX:XX:XX.XXXZ"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  },
  "timestamp": "2025-01-XX:XX:XX.XXXZ"
}
```

---

## 🎯 Next Steps for New Developer

### Immediate Tasks
1. **Environment Setup**: Configure all required environment variables
2. **OAuth Configuration**: Verify Google Cloud Console and Supabase settings
3. **Payment Testing**: Test Stripe integration in test mode
4. **Database Review**: Understand table relationships and constraints

### Medium-term Improvements
1. **Testing Suite**: Implement comprehensive test coverage
2. **Error Monitoring**: Add error tracking service (Sentry)
3. **Performance Monitoring**: Implement performance analytics
4. **Security Audit**: Review and enhance security measures

### Long-term Enhancements
1. **Multi-language Support**: Internationalization implementation
2. **Mobile App**: React Native or Progressive Web App
3. **Advanced Analytics**: Custom analytics dashboard
4. **Marketing Automation**: Email campaigns and customer segmentation

---

## 📞 Support Contacts

- **Repository**: GitHub - qyve-group/QYVE-Website
- **Production**: https://www.qyveofficial.com
- **Development**: Replit environment
- **Documentation**: This knowledge transfer document

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Created For**: Knowledge Transfer and Developer Onboarding