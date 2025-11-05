# Universal Product Bundling System - Complete Guide

## 🎯 Overview

The universal bundling system allows you to create product bundles that work across ALL products in your store, not just SubZero. When any customer adds a product to cart, they'll see a popup saying **"Here's what will go well with your purchase"** with relevant bundle suggestions.

---

## ✨ Key Features

- **Universal**: Works for ALL products (socks, shoes, accessories, etc.)
- **Context-Aware**: Shows bundles relevant to the product just added
- **Automatic Popup**: Triggers automatically on any add-to-cart action
- **Database-Driven**: Bundles configured in Supabase (no code changes needed)
- **Smart Matching**: Links bundles to products by name, category, or tag

---

## 📁 Files Created/Modified

### New Files:
- **`src/hooks/useAddToCart.ts`** - Global cart hook that triggers modal
- **`src/providers/BundleModalProvider.tsx`** - Global provider for bundle modal
- **`src/app/api/bundles/relevant/route.ts`** - API to fetch relevant bundles

### Modified Files:
- **`src/lib/database-schema-preorders-bundles.sql`** - Added `bundle_associations` table
- **`src/components/AddMoreItemsModal.tsx`** - Updated to show context-aware bundles
- **`src/components/Providers.tsx`** - Added BundleModalProvider
- **`src/app/subzero/SubZeroPreOrder.tsx`** - Simplified to only show pre-order form

---

## 🚀 Setup Instructions

### 1. Create Database Tables

Run the updated SQL schema in your Supabase dashboard:

```sql
-- Execute the contents of:
src/lib/database-schema-preorders-bundles.sql
```

This will create:
- ✅ `pre_orders` table
- ✅ `product_bundles` table
- ✅ `bundle_items` table
- ✅ `pre_order_status_history` table
- ✅ `bundle_purchases` table
- ✅ **`bundle_associations` table** (NEW - for product matching)

### 2. Verify Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 3. Test It Out!

The system is **already integrated** and ready to use! When you add any product to cart, the modal will automatically show relevant bundles.

---

## 💡 How It Works

### User Flow

1. **Customer browses** any product page
2. **Clicks "Add to Cart"** using `useAddToCart` hook
3. **Product added to cart** via Redux
4. **Modal automatically opens** with message: "Here's what will go well with your purchase"
5. **Relevant bundles displayed** based on product context
6. **Customer can select bundles** or continue shopping

### Technical Flow

```
Product Page
    ↓
useAddToCart hook (detects category from product name)
    ↓
Redux addToCart action
    ↓
BundleModalProvider.openModal()
    ↓
AddMoreItemsModal fetches /api/bundles/relevant
    ↓
API queries bundle_associations table
    ↓
Returns bundles matching product name/category/tag
    ↓
Modal displays relevant bundles
```

---

## 🎁 Creating Bundles

### Example 1: Socks Bundle (Buy 2 for Special Price)

**Step 1: Create the Bundle**

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
  is_featured,
  badge_text
) VALUES (
  'Pro Grip Socks - 2 Pack',
  'pro-grip-socks-2-pack',
  'Get 2 pairs of our premium performance grip socks at a special bundle price.',
  90.00,  -- 2 × RM45
  75.00,  -- Special bundle price
  15.00,  -- You save RM15
  16.67,
  true,
  false,
  'Save RM15'
);
```

**Step 2: Add Items to Bundle**

```sql
DO $$
DECLARE
  bundle_id UUID;
BEGIN
  SELECT id INTO bundle_id FROM product_bundles WHERE bundle_slug = 'pro-grip-socks-2-pack';
  
  INSERT INTO bundle_items (bundle_id, product_name, product_sku, item_price, quantity, available_sizes)
  VALUES 
    (bundle_id, 'Pro Grip Performance Socks', 'SOCK-PRO-001', 45.00, 2, '["S", "M", "L", "XL"]');
END $$;
```

**Step 3: Associate Bundle with Products**

```sql
DO $$
DECLARE
  bundle_id UUID;
BEGIN
  SELECT id INTO bundle_id FROM product_bundles WHERE bundle_slug = 'pro-grip-socks-2-pack';
  
  -- Show this bundle when ANY sock product is added to cart
  INSERT INTO bundle_associations (bundle_id, association_type, association_value, priority)
  VALUES 
    (bundle_id, 'category', 'socks', 100),
    (bundle_id, 'product_name', 'Pro Grip Socks', 100),
    (bundle_id, 'product_name', 'Performance Grip Socks', 100),
    (bundle_id, 'tag', 'socks', 90);
END $$;
```

### Example 2: Complete Outfit Bundle

```sql
-- Create the bundle
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
  'Complete Futsal Outfit',
  'complete-futsal-outfit',
  'Everything you need for the game: shoes, jersey, socks, and bag.',
  600.00,
  500.00,
  100.00,
  16.67,
  true,
  'Save RM100'
);

-- Add items
DO $$
DECLARE
  bundle_id UUID;
BEGIN
  SELECT id INTO bundle_id FROM product_bundles WHERE bundle_slug = 'complete-futsal-outfit';
  
  INSERT INTO bundle_items (bundle_id, product_name, item_price, quantity, available_sizes)
  VALUES 
    (bundle_id, 'Futsal Shoes', 250.00, 1, '["38", "39", "40", "41", "42"]'),
    (bundle_id, 'Team Jersey', 150.00, 1, '["S", "M", "L", "XL"]'),
    (bundle_id, 'Performance Socks', 45.00, 2, '["S", "M", "L"]'),
    (bundle_id, 'Sports Duffle Bag', 155.00, 1, '[]');
END $$;

-- Associate with shoes and apparel
DO $$
DECLARE
  bundle_id UUID;
BEGIN
  SELECT id INTO bundle_id FROM product_bundles WHERE bundle_slug = 'complete-futsal-outfit';
  
  INSERT INTO bundle_associations (bundle_id, association_type, association_value, priority)
  VALUES 
    (bundle_id, 'category', 'shoes', 95),
    (bundle_id, 'category', 'apparel', 95),
    (bundle_id, 'tag', 'futsal', 90);
END $$;
```

---

## 🔧 How to Use in Your Code

### Method 1: Using the Global Hook (Recommended)

```tsx
import { useAddToCart } from '@/hooks/useAddToCart';

function ProductPage() {
  const { addToCart } = useAddToCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      product_size: selectedSize,
      quantity: 1,
      image: product.image
    }, 'socks'); // Optional: specify category
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

**That's it!** The modal will automatically show relevant bundles.

### Method 2: Manual Control (Advanced)

```tsx
import { useBundleModal } from '@/providers/BundleModalProvider';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '@/store/cartSlice';

function ProductPage() {
  const dispatch = useDispatch();
  const { openModal } = useBundleModal();

  const handleAddToCart = () => {
    // Add to cart
    dispatch(addToCartAction(cartItem));
    
    // Manually trigger modal
    openModal({
      name: product.name,
      price: product.price,
      category: 'socks',
      productId: product.id.toString()
    });
  };
}
```

---

## 📊 Managing Bundle Associations

### Association Types

| Type | Description | Example |
|------|-------------|---------|
| `product_id` | Match specific product ID | `"12345"` |
| `product_name` | Match product by name (partial) | `"Pro Grip Socks"` |
| `category` | Match product category | `"socks"`, `"shoes"` |
| `tag` | Match product tag | `"futsal"`, `"premium"` |
| `all_products` | Show for all products | `"*"` |

### Priority System

Higher priority = shown first when multiple bundles match

```sql
-- High priority (shown first)
INSERT INTO bundle_associations (bundle_id, association_type, association_value, priority)
VALUES (bundle_id, 'product_name', 'SubZero', 100);

-- Lower priority
INSERT INTO bundle_associations (bundle_id, association_type, association_value, priority)
VALUES (bundle_id, 'category', 'shoes', 50);
```

### View All Associations

```sql
SELECT 
  pb.bundle_name,
  ba.association_type,
  ba.association_value,
  ba.priority
FROM bundle_associations ba
JOIN product_bundles pb ON pb.id = ba.bundle_id
WHERE pb.is_active = true
ORDER BY ba.priority DESC;
```

### Update Association Priority

```sql
UPDATE bundle_associations
SET priority = 150
WHERE bundle_id = 'your-bundle-id'
  AND association_value = 'socks';
```

---

## 📈 Analytics & Reporting

### Track Bundle Performance

```sql
SELECT 
  pb.bundle_name,
  pb.bundle_price,
  pb.discount_amount,
  COUNT(bp.id) as total_purchases,
  SUM(bp.bundle_price) as total_revenue,
  SUM(bp.discount_amount) as total_savings_given
FROM product_bundles pb
LEFT JOIN bundle_purchases bp ON bp.bundle_id = pb.id
GROUP BY pb.id, pb.bundle_name, pb.bundle_price, pb.discount_amount
ORDER BY total_purchases DESC;
```

### Most Popular Bundle Associations

```sql
SELECT 
  ba.association_type,
  ba.association_value,
  COUNT(DISTINCT ba.bundle_id) as num_bundles,
  AVG(ba.priority) as avg_priority
FROM bundle_associations ba
GROUP BY ba.association_type, ba.association_value
ORDER BY num_bundles DESC;
```

---

## 🎨 Customization

### Change Modal Title

Edit `src/components/AddMoreItemsModal.tsx`:

```tsx
<Dialog.Title>
  Here's what will go well with your purchase
</Dialog.Title>
```

### Disable Modal for Specific Products

```tsx
const { addToCart } = useAddToCart();

const handleAddToCart = () => {
  // Regular Redux action (no modal)
  dispatch(addToCartAction(item));
  
  // Don't call useAddToCart hook
};
```

### Add Custom Category Detection

Edit `src/hooks/useAddToCart.ts`:

```tsx
function extractCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('sock')) return 'socks';
  if (lowerName.includes('shoe') || lowerName.includes('subzero')) return 'shoes';
  if (lowerName.includes('bag')) return 'accessories';
  if (lowerName.includes('shirt') || lowerName.includes('jersey')) return 'apparel';
  
  // Add your custom categories here
  if (lowerName.includes('ball')) return 'equipment';
  if (lowerName.includes('glove')) return 'goalkeeper';
  
  return 'general';
}
```

---

## 🐛 Troubleshooting

### Modal Not Showing

**Check 1:** Make sure you're using the `useAddToCart` hook:
```tsx
import { useAddToCart } from '@/hooks/useAddToCart';
const { addToCart } = useAddToCart();
```

**Check 2:** Verify BundleModalProvider is in the component tree:
```tsx
// Should be in src/components/Providers.tsx
<BundleModalProvider>
  {children}
</BundleModalProvider>
```

**Check 3:** Check browser console for errors

### No Bundles Appearing in Modal

**Check 1:** Verify database has bundles and associations:
```sql
SELECT * FROM product_bundles WHERE is_active = true;
SELECT * FROM bundle_associations;
```

**Check 2:** Check API response:
```
Open DevTools → Network → Filter: relevant
Add product to cart
Check response from /api/bundles/relevant
```

**Check 3:** Verify association values match:
```sql
-- If adding "Pro Grip Socks", check:
SELECT * FROM bundle_associations 
WHERE association_value ILIKE '%sock%';
```

### Wrong Bundles Showing

Update bundle associations to better match:
```sql
-- More specific matching
INSERT INTO bundle_associations (bundle_id, association_type, association_value, priority)
VALUES 
  (bundle_id, 'product_name', 'Exact Product Name', 150);  -- Higher priority
```

---

## 🎯 Best Practices

1. **Use Multiple Association Types** - Link bundles to products in multiple ways (name + category + tag) for better matching

2. **Set Meaningful Priorities** - Use priority to control which bundles show first:
   - 100+ = High priority (specific product bundles)
   - 50-99 = Medium priority (category bundles)
   - 1-49 = Low priority (general bundles)

3. **Limit Bundle Items** - Keep bundles to 2-4 items for better conversion

4. **Clear Value Proposition** - Use descriptive names and badges:
   - ✅ "Pro Grip Socks - 2 Pack (Save RM15)"
   - ❌ "Bundle #1"

5. **Test Associations** - Add a product to cart and verify relevant bundles appear

6. **Monitor Performance** - Regularly check which bundles convert best

---

## 📞 Support

For issues:
1. Check this guide for troubleshooting steps
2. Verify database tables exist and have data
3. Check browser console for errors
4. Check API response in Network tab

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] A/B testing for bundle suggestions
- [ ] AI-powered bundle recommendations
- [ ] Time-limited bundle offers
- [ ] Customer-specific bundle pricing
- [ ] Bundle analytics dashboard
- [ ] Automatic bundle creation based on purchase patterns

---

**Built with ❤️ for QYVE - Universal Bundling System**
