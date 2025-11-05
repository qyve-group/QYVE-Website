# SubZero Pre-Order & Bundling System - Complete Guide

## 🎯 Overview

This system enables customers to pre-order SubZero products and purchase bundled items together at discounted prices. All data is stored in Supabase for easy management.

---

## 📁 Files Created

### Database Schema
- **`src/lib/database-schema-preorders-bundles.sql`** - Complete SQL schema for pre-orders and bundles

### API Endpoints
- **`src/app/api/pre-orders/submit/route.ts`** - Handle pre-order submissions
- **`src/app/api/bundles/get/route.ts`** - Fetch available bundles

### Components
- **`src/components/SubZeroPreOrderForm.tsx`** - Pre-order form with validation
- **`src/components/AddMoreItemsModal.tsx`** - Popup to suggest bundles after adding to cart
- **`src/components/BundleSelector.tsx`** - Interactive bundle selection UI
- **`src/app/subzero/SubZeroPreOrder.tsx`** - Main pre-order section for SubZero landing page

### Validation
- **`src/lib/validation/pre-order-schema.ts`** - Zod schemas for input validation

---

## 🚀 Setup Instructions

### 1. Create Database Tables

Run the SQL schema in your Supabase dashboard:

```sql
-- Execute the contents of:
src/lib/database-schema-preorders-bundles.sql
```

This creates:
- ✅ `pre_orders` table
- ✅ `product_bundles` table
- ✅ `bundle_items` table
- ✅ `pre_order_status_history` table
- ✅ `bundle_purchases` table
- ✅ Sample bundles with data

### 2. Configure Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Verify Installation

1. Visit `/subzero` page
2. You should see two pre-order options:
   - Individual SubZero shoes (RM 399)
   - Complete Package bundle (RM 499, save RM 100)

---

## 💡 How It Works

### Pre-Order Flow

1. **Customer visits** `/subzero` landing page
2. **Clicks** "Pre-Order Now" or "View Bundle Options"
3. **Fills out form:**
   - Personal information (name, email, phone)
   - Product selection (size, color, quantity)
   - Shipping address
   - Special notes (optional)
4. **Submits form** → Data stored in `pre_orders` table
5. **Receives confirmation** → 30% deposit required
6. **Gets email** with payment instructions (future enhancement)

### Bundle Selection Flow

1. **Customer clicks** "View Bundle Options"
2. **Views available bundles** (fetched from database)
3. **Selects items** and customizes (size, color)
4. **Adds to cart** → Items dispatched to Redux cart
5. **"Add More Items" modal appears** suggesting other bundles
6. **Can proceed to checkout** or continue shopping

### "Add More Items" Popup

When a customer adds ANY item to cart, the `AddMoreItemsModal` can show:
- Available bundles
- Savings information
- Quick bundle preview
- Direct link to bundle page

---

## 🗄️ Database Structure

### `pre_orders` Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| customer_email | VARCHAR | Customer email |
| customer_name | VARCHAR | Full name |
| customer_phone | VARCHAR | Phone number |
| product_name | VARCHAR | Product ordered |
| product_variant | VARCHAR | Size, color details |
| quantity | INTEGER | Number of items |
| unit_price | DECIMAL | Price per item |
| total_price | DECIMAL | Total amount |
| shipping_address | JSONB | Full address |
| status | VARCHAR | pending/confirmed/shipped/etc |
| payment_status | VARCHAR | unpaid/partial/paid |
| bundle_id | UUID | If part of bundle (FK) |
| created_at | TIMESTAMP | Order date |

### `product_bundles` Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| bundle_name | VARCHAR | Name of bundle |
| bundle_description | TEXT | What's included |
| regular_price | DECIMAL | Sum of individual prices |
| bundle_price | DECIMAL | Discounted price |
| discount_amount | DECIMAL | Savings |
| is_active | BOOLEAN | Available for purchase |
| badge_text | VARCHAR | "Save RM100", etc |
| created_at | TIMESTAMP | Created date |

### `bundle_items` Table

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| bundle_id | UUID | Parent bundle (FK) |
| product_name | VARCHAR | Item name |
| item_price | DECIMAL | Individual price |
| quantity | INTEGER | Quantity in bundle |
| is_required | BOOLEAN | Must be included |
| available_sizes | JSONB | Size options |
| available_colors | JSONB | Color options |

---

## 📊 Managing Pre-Orders

### View All Pre-Orders

```sql
SELECT 
  id,
  customer_name,
  customer_email,
  product_name,
  quantity,
  total_price,
  status,
  created_at
FROM pre_orders
ORDER BY created_at DESC;
```

### Filter by Status

```sql
-- Pending orders
SELECT * FROM pre_orders WHERE status = 'pending';

-- Paid orders ready to ship
SELECT * FROM pre_orders WHERE payment_status = 'paid' AND status = 'confirmed';
```

### Update Order Status

```sql
UPDATE pre_orders 
SET status = 'shipped',
    shipped_at = NOW()
WHERE id = 'order-id-here';
```

### Track Status Changes

```sql
SELECT * FROM pre_order_status_history
WHERE pre_order_id = 'order-id-here'
ORDER BY created_at DESC;
```

---

## 🎁 Managing Bundles

### Create New Bundle

```sql
INSERT INTO product_bundles (
  bundle_name,
  bundle_slug,
  bundle_description,
  regular_price,
  bundle_price,
  discount_amount,
  discount_percentage,
  is_active,
  badge_text
) VALUES (
  'SubZero Starter Pack',
  'subzero-starter-pack',
  'Get started with SubZero shoes and essential accessories',
  450.00,
  380.00,
  70.00,
  15.56,
  true,
  'Save RM70'
);
```

### Add Items to Bundle

```sql
INSERT INTO bundle_items (
  bundle_id,
  product_name,
  product_sku,
  item_price,
  quantity,
  is_required,
  available_sizes
) VALUES (
  'bundle-id-from-above',
  'SubZero Shoes',
  'SUBZERO-001',
  399.00,
  1,
  true,
  '["38", "39", "40", "41", "42"]'
);
```

### View Bundle Performance

```sql
SELECT 
  b.bundle_name,
  b.bundle_price,
  b.discount_amount,
  b.purchase_count,
  b.view_count,
  (b.purchase_count::float / NULLIF(b.view_count, 0) * 100) as conversion_rate
FROM product_bundles b
WHERE b.is_active = true
ORDER BY b.purchase_count DESC;
```

---

## 🔌 Using the Components

### Add Pre-Order Form to Any Page

```tsx
import SubZeroPreOrderForm from '@/components/SubZeroPreOrderForm';

function MyPage() {
  return (
    <SubZeroPreOrderForm
      productName="SubZero Futsal Shoes"
      defaultPrice={399.00}
      onSuccess={(preOrderId) => {
        console.log('Pre-order created:', preOrderId);
      }}
    />
  );
}
```

### Add Bundle Selector

```tsx
import BundleSelector from '@/components/BundleSelector';

function BundlePage() {
  const handleBundleSelect = (bundleId, items) => {
    // Add items to cart
    items.forEach(item => addToCart(item));
  };

  return (
    <BundleSelector onSelect={handleBundleSelect} />
  );
}
```

### Trigger "Add More Items" Modal

```tsx
import AddMoreItemsModal from '@/components/AddMoreItemsModal';
import { useState } from 'react';

function ProductPage() {
  const [showModal, setShowModal] = useState(false);
  const [lastItem, setLastItem] = useState(null);

  const handleAddToCart = (item) => {
    // Add to cart
    dispatch(addToCart(item));
    
    // Show modal
    setLastItem({ name: item.name, price: item.price });
    setShowModal(true);
  };

  return (
    <>
      <button onClick={() => handleAddToCart(product)}>
        Add to Cart
      </button>

      <AddMoreItemsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        itemJustAdded={lastItem}
      />
    </>
  );
}
```

---

## 🎨 Customization

### Change Bundle Badge Colors

Edit the bundle in database:

```sql
UPDATE product_bundles
SET badge_text = 'LIMITED TIME',
    badge_color = '#FF0000'  -- Red badge
WHERE id = 'bundle-id';
```

### Modify Pre-Order Deposit

Change the deposit percentage in `SubZeroPreOrderForm.tsx`:

```tsx
// Current: 30% deposit
depositAmount: totalPrice * 0.3

// Change to 50%:
depositAmount: totalPrice * 0.5
```

### Add Custom Pre-Order Fields

1. Update `src/lib/validation/pre-order-schema.ts`:

```tsx
export const preOrderSchema = z.object({
  // ... existing fields
  referralCode: z.string().optional(),
  giftMessage: z.string().max(200).optional(),
});
```

2. Update form in `SubZeroPreOrderForm.tsx`

3. Update API endpoint to handle new fields

---

## 📈 Analytics & Reporting

### Pre-Order Revenue Report

```sql
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total_price) as total_revenue,
  AVG(total_price) as average_order_value
FROM pre_orders
WHERE status != 'cancelled'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;
```

### Bundle Performance

```sql
SELECT 
  pb.bundle_name,
  COUNT(po.id) as orders,
  SUM(po.total_price) as revenue,
  SUM(pb.discount_amount * COUNT(po.id)) as total_savings_given
FROM product_bundles pb
LEFT JOIN pre_orders po ON po.bundle_id = pb.id
GROUP BY pb.id, pb.bundle_name
ORDER BY orders DESC;
```

### Customer Report

```sql
SELECT 
  customer_email,
  COUNT(*) as total_orders,
  SUM(total_price) as lifetime_value,
  MIN(created_at) as first_order,
  MAX(created_at) as last_order
FROM pre_orders
GROUP BY customer_email
ORDER BY lifetime_value DESC;
```

---

## 🔒 Security Features

1. **Input Validation** - Zod schemas validate all inputs
2. **SQL Injection Protection** - Parameterized queries via Supabase
3. **Foreign Key Constraints** - Data integrity enforced at DB level
4. **Service Role Key** - Server-side API uses protected credentials
5. **HTTPS Only** - All communication encrypted

---

## 🎯 Testing Checklist

- [ ] Pre-order form submits successfully
- [ ] Data appears in `pre_orders` table
- [ ] Bundles load from database
- [ ] Bundle items can be selected
- [ ] Items add to cart correctly
- [ ] "Add More Items" modal shows after cart addition
- [ ] Validation errors display properly
- [ ] Success messages appear
- [ ] Mobile responsive design works
- [ ] Database relationships intact (foreign keys)

---

## 🐛 Troubleshooting

### Pre-orders not saving

1. Check Supabase credentials in `.env.local`
2. Verify tables exist: `SELECT * FROM pre_orders LIMIT 1;`
3. Check browser console for API errors

### Bundles not loading

1. Run SQL: `SELECT * FROM product_bundles WHERE is_active = true;`
2. Ensure sample data was inserted
3. Check API response: `/api/bundles/get`

### Cart integration not working

1. Verify Redux store is configured
2. Check `addToCart` action is dispatched
3. View Redux DevTools to see cart state

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Check Supabase logs for API errors
3. Review this guide for configuration steps
4. Verify all environment variables are set

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Email confirmations for pre-orders
- [ ] Admin dashboard to manage pre-orders
- [ ] Payment integration (Stripe deposit collection)
- [ ] Inventory tracking for bundles
- [ ] Abandoned pre-order recovery emails
- [ ] Bundle recommendation engine
- [ ] Dynamic pricing based on demand
- [ ] Pre-order countdown timer

---

**Built with ❤️ for QYVE - SubZero Pre-Order System**
