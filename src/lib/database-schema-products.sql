-- Enhanced Product Schema for QYVE Website
-- This schema includes all necessary fields for product filtering and sorting

-- Create categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO product_categories (name, slug, description, sort_order) VALUES
('Futsal Shoes', 'futsal-shoes', 'Professional futsal footwear for optimal performance', 1),
('Jersey', 'jersey', 'Team jerseys and training wear', 2),
('Socks', 'socks', 'Performance socks for comfort and grip', 3),
('Slides', 'slides', 'Recovery slides for post-game comfort', 4),
('Insoles', 'insoles', 'Custom insoles for enhanced comfort', 5)
ON CONFLICT (slug) DO NOTHING;

-- Create colors table
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default colors
INSERT INTO product_colors (name, hex_code) VALUES
('Black', '#000000'),
('White', '#FFFFFF'),
('Red', '#FF0000'),
('Blue', '#0000FF'),
('Green', '#008000'),
('Yellow', '#FFFF00'),
('Orange', '#FFA500'),
('Purple', '#800080'),
('Pink', '#FFC0CB'),
('Gray', '#808080'),
('Brown', '#A52A2A'),
('Navy', '#000080')
ON CONFLICT (name) DO NOTHING;

-- Create sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default sizes for each category
-- Futsal Shoes sizes
INSERT INTO product_sizes (name, category_id, sort_order) 
SELECT '6', id, 1 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '6.5', id, 2 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '7', id, 3 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '7.5', id, 4 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '8', id, 5 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '8.5', id, 6 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '9', id, 7 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '9.5', id, 8 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '10', id, 9 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '10.5', id, 10 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '11', id, 11 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '11.5', id, 12 FROM product_categories WHERE slug = 'futsal-shoes'
UNION ALL
SELECT '12', id, 13 FROM product_categories WHERE slug = 'futsal-shoes';

-- Jersey sizes
INSERT INTO product_sizes (name, category_id, sort_order) 
SELECT 'XS', id, 1 FROM product_categories WHERE slug = 'jersey'
UNION ALL
SELECT 'S', id, 2 FROM product_categories WHERE slug = 'jersey'
UNION ALL
SELECT 'M', id, 3 FROM product_categories WHERE slug = 'jersey'
UNION ALL
SELECT 'L', id, 4 FROM product_categories WHERE slug = 'jersey'
UNION ALL
SELECT 'XL', id, 5 FROM product_categories WHERE slug = 'jersey'
UNION ALL
SELECT 'XXL', id, 6 FROM product_categories WHERE slug = 'jersey';

-- Socks sizes
INSERT INTO product_sizes (name, category_id, sort_order) 
SELECT 'S (6-8)', id, 1 FROM product_categories WHERE slug = 'socks'
UNION ALL
SELECT 'M (8-10)', id, 2 FROM product_categories WHERE slug = 'socks'
UNION ALL
SELECT 'L (10-12)', id, 3 FROM product_categories WHERE slug = 'socks'
UNION ALL
SELECT 'XL (12-14)', id, 4 FROM product_categories WHERE slug = 'socks';

-- Slides sizes
INSERT INTO product_sizes (name, category_id, sort_order) 
SELECT 'S (6-8)', id, 1 FROM product_categories WHERE slug = 'slides'
UNION ALL
SELECT 'M (8-10)', id, 2 FROM product_categories WHERE slug = 'slides'
UNION ALL
SELECT 'L (10-12)', id, 3 FROM product_categories WHERE slug = 'slides'
UNION ALL
SELECT 'XL (12-14)', id, 4 FROM product_categories WHERE slug = 'slides';

-- Insoles sizes
INSERT INTO product_sizes (name, category_id, sort_order) 
SELECT 'S (6-8)', id, 1 FROM product_categories WHERE slug = 'insoles'
UNION ALL
SELECT 'M (8-10)', id, 2 FROM product_categories WHERE slug = 'insoles'
UNION ALL
SELECT 'L (10-12)', id, 3 FROM product_categories WHERE slug = 'insoles'
UNION ALL
SELECT 'XL (12-14)', id, 4 FROM product_categories WHERE slug = 'insoles';

-- Enhanced products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2), -- For showing "was $X, now $Y"
  cost_price DECIMAL(10,2), -- For profit calculation
  sku TEXT UNIQUE,
  barcode TEXT,
  weight DECIMAL(8,2), -- in grams
  dimensions JSONB, -- {length, width, height}
  
  -- Inventory
  track_inventory BOOLEAN DEFAULT TRUE,
  inventory_quantity INTEGER DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT FALSE,
  low_stock_threshold INTEGER DEFAULT 5,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Status and visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  
  -- Images
  primary_image_url TEXT,
  image_urls JSONB DEFAULT '[]', -- Array of image URLs
  
  -- Colors and sizes (JSON arrays for flexibility)
  available_colors JSONB DEFAULT '[]', -- Array of color IDs
  available_sizes JSONB DEFAULT '[]', -- Array of size IDs
  
  -- Product variants (for different colors/sizes combinations)
  variants JSONB DEFAULT '[]', -- Array of variant objects
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  wishlist_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create product variants table for detailed inventory tracking
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  color_id UUID REFERENCES product_colors(id) ON DELETE SET NULL,
  size_id UUID REFERENCES product_sizes(id) ON DELETE SET NULL,
  price DECIMAL(10,2),
  compare_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_color_id ON product_variants(color_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_size_id ON product_variants(size_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

CREATE INDEX IF NOT EXISTS idx_product_sizes_category_id ON product_sizes(category_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for products with category and variant information
CREATE OR REPLACE VIEW products_with_details AS
SELECT 
    p.*,
    pc.name as category_name,
    pc.slug as category_slug,
    COALESCE(
        (SELECT json_agg(
            json_build_object(
                'id', pv.id,
                'sku', pv.sku,
                'color_id', pv.color_id,
                'color_name', col.name,
                'color_hex', col.hex_code,
                'size_id', pv.size_id,
                'size_name', ps.name,
                'price', pv.price,
                'compare_price', pv.compare_price,
                'inventory_quantity', pv.inventory_quantity,
                'image_url', pv.image_url,
                'is_active', pv.is_active
            )
        )
        FROM product_variants pv
        LEFT JOIN product_colors col ON pv.color_id = col.id
        LEFT JOIN product_sizes ps ON pv.size_id = ps.id
        WHERE pv.product_id = p.id AND pv.is_active = true),
        '[]'::json
    ) as variants
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id;

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (uncomment if RLS is enabled)
-- CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (status = 'active');
-- CREATE POLICY "Allow public read access to categories" ON product_categories FOR SELECT USING (is_active = true);
-- CREATE POLICY "Allow public read access to colors" ON product_colors FOR SELECT USING (is_active = true);
-- CREATE POLICY "Allow public read access to sizes" ON product_sizes FOR SELECT USING (is_active = true);
-- CREATE POLICY "Allow public read access to variants" ON product_variants FOR SELECT USING (is_active = true);
