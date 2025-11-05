-- =====================================================
-- SUBZERO PRE-ORDERS & PRODUCT BUNDLES SCHEMA
-- =====================================================
-- This schema handles pre-order functionality and product bundling

-- =====================================================
-- 1. PRE-ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS pre_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  
  -- Product Information
  product_id UUID, -- Reference to products table if it exists
  product_name VARCHAR(255) NOT NULL,
  product_variant VARCHAR(255), -- e.g., "Size: 42, Color: Black"
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Shipping Information
  shipping_address JSONB, -- {fname, lname, address_1, address_2, city, state, postal_code, country}
  shipping_method VARCHAR(100),
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  
  -- Pre-order specific
  expected_delivery_date DATE,
  pre_order_notes TEXT,
  deposit_required BOOLEAN DEFAULT FALSE,
  deposit_amount DECIMAL(10,2),
  deposit_paid BOOLEAN DEFAULT FALSE,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'pending',           -- Initial state
    'confirmed',         -- Pre-order confirmed
    'deposit_paid',      -- Deposit received
    'production',        -- In production
    'ready_to_ship',     -- Ready for shipment
    'shipped',           -- Shipped to customer
    'completed',         -- Delivered
    'cancelled'          -- Cancelled
  )),
  
  -- Payment tracking
  payment_method VARCHAR(50), -- 'stripe', 'bank_transfer', 'deposit_only'
  payment_intent_id VARCHAR(255), -- Stripe payment intent ID
  payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN (
    'unpaid', 'partial', 'paid', 'refunded'
  )),
  
  -- Bundle information (if part of a bundle)
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE SET NULL,
  is_part_of_bundle BOOLEAN DEFAULT FALSE,
  
  -- Admin notes
  admin_notes TEXT,
  internal_order_number VARCHAR(100),
  
  -- Metadata
  source VARCHAR(100) DEFAULT 'website', -- 'website', 'admin', 'api'
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 2. PRODUCT BUNDLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS product_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Bundle Information
  bundle_name VARCHAR(255) NOT NULL,
  bundle_slug VARCHAR(255) UNIQUE NOT NULL,
  bundle_description TEXT,
  bundle_image_url TEXT,
  
  -- Pricing
  regular_price DECIMAL(10,2) NOT NULL, -- Sum of individual items
  bundle_price DECIMAL(10,2) NOT NULL,  -- Discounted bundle price
  discount_amount DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2), -- Calculated discount %
  
  -- Bundle configuration
  min_items INTEGER DEFAULT 2,
  max_items INTEGER,
  allow_customization BOOLEAN DEFAULT TRUE, -- Can customers change items?
  
  -- Availability
  is_active BOOLEAN DEFAULT TRUE,
  available_from TIMESTAMP WITH TIME ZONE,
  available_until TIMESTAMP WITH TIME ZONE,
  stock_quantity INTEGER, -- If limited bundles available
  track_inventory BOOLEAN DEFAULT FALSE,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  badge_text VARCHAR(50), -- e.g., "Best Value", "Limited Time"
  badge_color VARCHAR(7) DEFAULT '#ff6b35',
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. BUNDLE ITEMS (PRODUCTS IN BUNDLES)
-- =====================================================

CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES product_bundles(id) ON DELETE CASCADE,
  
  -- Product reference
  product_id UUID, -- Reference to products table
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  product_image_url TEXT,
  
  -- Item configuration
  quantity INTEGER DEFAULT 1,
  item_price DECIMAL(10,2) NOT NULL, -- Individual item price
  
  -- Customization options
  is_required BOOLEAN DEFAULT TRUE, -- Must be included in bundle
  is_default_selected BOOLEAN DEFAULT TRUE,
  can_change_quantity BOOLEAN DEFAULT FALSE,
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER,
  
  -- Variants (if applicable)
  available_sizes JSONB DEFAULT '[]', -- ["S", "M", "L", "XL"]
  available_colors JSONB DEFAULT '[]', -- ["Black", "White", "Blue"]
  default_size VARCHAR(50),
  default_color VARCHAR(50),
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. PRE-ORDER STATUS HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS pre_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pre_order_id UUID NOT NULL REFERENCES pre_orders(id) ON DELETE CASCADE,
  
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  
  changed_by VARCHAR(255), -- email or user_id of admin who changed status
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. BUNDLE PURCHASES (COMPLETED)
-- =====================================================

CREATE TABLE IF NOT EXISTS bundle_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES product_bundles(id) ON DELETE SET NULL,
  
  -- Customer info
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  
  -- Purchase details
  bundle_name VARCHAR(255) NOT NULL,
  bundle_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2),
  
  -- Selected items (snapshot of what customer chose)
  selected_items JSONB NOT NULL, -- [{product_name, quantity, size, color, price}, ...]
  
  -- Payment
  payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'completed',
  
  -- Order reference
  order_id UUID, -- Reference to main orders table if exists
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Pre-orders indexes
CREATE INDEX IF NOT EXISTS idx_pre_orders_email ON pre_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_pre_orders_status ON pre_orders(status);
CREATE INDEX IF NOT EXISTS idx_pre_orders_created_at ON pre_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_pre_orders_bundle ON pre_orders(bundle_id);
CREATE INDEX IF NOT EXISTS idx_pre_orders_payment_status ON pre_orders(payment_status);

-- Bundles indexes
CREATE INDEX IF NOT EXISTS idx_bundles_active ON product_bundles(is_active);
CREATE INDEX IF NOT EXISTS idx_bundles_featured ON product_bundles(is_featured);
CREATE INDEX IF NOT EXISTS idx_bundles_slug ON product_bundles(bundle_slug);
CREATE INDEX IF NOT EXISTS idx_bundles_id ON product_bundles(id);

-- Bundle items indexes
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product ON bundle_items(product_id);

-- Purchase history indexes
CREATE INDEX IF NOT EXISTS idx_bundle_purchases_bundle ON bundle_purchases(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_purchases_email ON bundle_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_bundle_purchases_created_at ON bundle_purchases(created_at);

-- =====================================================
-- SAMPLE DATA: SubZero Pre-Order Bundle
-- =====================================================

-- Create a SubZero Complete Package bundle
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
  badge_text,
  badge_color,
  allow_customization,
  meta_title,
  meta_description
) VALUES (
  'SubZero Complete Package',
  'subzero-complete-package',
  'Get the complete SubZero futsal experience! Includes the SubZero shoes, performance socks, and a premium carrying bag.',
  599.00,
  499.00,
  100.00,
  16.69,
  true,
  true,
  'Save RM100',
  '#4FD1C5',
  true,
  'SubZero Complete Package - Save RM100',
  'Everything you need for peak performance on the futsal court. Limited pre-order bundle.'
) ON CONFLICT (bundle_slug) DO NOTHING;

-- Get the bundle ID for adding items
DO $$
DECLARE
  subzero_bundle_id UUID;
BEGIN
  SELECT id INTO subzero_bundle_id FROM product_bundles WHERE bundle_slug = 'subzero-complete-package';
  
  -- Add bundle items
  INSERT INTO bundle_items (bundle_id, product_name, product_sku, item_price, quantity, is_required, available_sizes)
  VALUES 
    (subzero_bundle_id, 'SubZero Futsal Shoes', 'SUBZERO-001', 399.00, 1, true, '["38", "39", "40", "41", "42", "43", "44", "45"]'),
    (subzero_bundle_id, 'Performance Grip Socks', 'SOCK-PERF-001', 89.00, 2, true, '["S", "M", "L", "XL"]'),
    (subzero_bundle_id, 'Premium Sports Bag', 'BAG-SPORT-001', 111.00, 1, false, '[]')
  ON CONFLICT DO NOTHING;
END $$;

-- Add a basic SubZero + Socks bundle
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
  badge_text,
  allow_customization
) VALUES (
  'SubZero + Socks Bundle',
  'subzero-socks-bundle',
  'SubZero shoes with 2 pairs of our performance grip socks.',
  488.00,
  429.00,
  59.00,
  12.09,
  true,
  false,
  'Save RM59',
  false
) ON CONFLICT (bundle_slug) DO NOTHING;
