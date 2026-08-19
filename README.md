# Qyve — E-Commerce Web Application

Qyve is a full-stack e-commerce site built for a footwear brand, covering product browsing, checkout, and post-purchase order handling end to end.

## What it does

- **Storefront** — product listing and detail pages, cart, and checkout flow.
- **Payments** — checkout and payment processing via the [Stripe](https://stripe.com) API.
- **Order notifications** — a Stripe webhook handler processes payment events server-side (successful payments, failures) and triggers a Telegram bot notification in real time, so orders can be tracked without checking a dashboard.
- **Voucher codes** — discount code validation at checkout.
- **Shipment rates** — dynamic shipping rate calculation based on order details.
- **Pre-orders** — a separate flow for products sold ahead of stock arrival.
- **Auth & data access** — user authentication and session handling via [Supabase](https://supabase.com), with Row-Level Security (RLS) policies enforced at the database level to control access to orders and product data.
- **Blog / campaign pages** — supporting content and marketing landing pages.
- **Admin panel (in progress)** — early scaffolding for product, stock, and order management. Not yet feature-complete.

## Tech stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes (Node.js)
- **Database / Auth:** Supabase (PostgreSQL, RLS, Auth)
- **Payments:** Stripe API + webhooks
- **Notifications:** Telegram Bot API

## Notes

This project started from a public Next.js/Tailwind boilerplate template and was built out from there into a working e-commerce application, with AI-assisted coding tools used heavily for scaffolding and initial implementation. My focus was on debugging, wiring together third-party integrations (Stripe webhooks, Supabase RLS policies, Telegram bot notifications), and testing the payment and order flows to make sure they worked correctly end to end.

The admin panel is unfinished and not part of the live production flow — order and stock management are still handled manually.
