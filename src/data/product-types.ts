// Enhanced Product Types for QYVE Website
// These types support comprehensive filtering and sorting

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex_code: string;
  is_active: boolean;
  created_at: string;
}

export interface ProductSize {
  id: string;
  name: string;
  category_id: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string;
  color_id?: string;
  color_name?: string;
  color_hex?: string;
  size_id?: string;
  size_name?: string;
  price?: number;
  compare_price?: number;
  inventory_quantity: number;
  weight?: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  
  // Inventory
  track_inventory: boolean;
  inventory_quantity: number;
  allow_backorder: boolean;
  low_stock_threshold: number;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  
  // Status and visibility
  status: 'draft' | 'active' | 'archived';
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  
  // Images
  primary_image_url?: string;
  image_urls: string[];
  
  // Colors and sizes
  available_colors: string[]; // Array of color IDs
  available_sizes: string[]; // Array of size IDs
  
  // Product variants
  variants: ProductVariant[];
  
  // Analytics
  view_count: number;
  purchase_count: number;
  wishlist_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Filter and Sort Types
export interface ProductFilters {
  categories?: string[]; // Array of category IDs
  colors?: string[]; // Array of color IDs
  sizes?: string[]; // Array of size IDs
  price_range?: {
    min: number;
    max: number;
  };
  in_stock_only?: boolean;
  on_sale_only?: boolean;
  featured_only?: boolean;
  new_arrivals_only?: boolean;
  best_sellers_only?: boolean;
}

export type ProductSortOption = 
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'newest_first'
  | 'oldest_first'
  | 'best_sellers'
  | 'most_viewed'
  | 'name_a_to_z'
  | 'name_z_to_a'
  | 'featured_first';

export interface ProductSortConfig {
  sort_by: ProductSortOption;
  direction?: 'asc' | 'desc';
}

// API Response Types
export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  filters_applied: ProductFilters;
  sort_applied: ProductSortConfig;
}

export interface ProductFiltersResponse {
  success: boolean;
  categories: ProductCategory[];
  colors: ProductColor[];
  sizes: ProductSize[];
  price_range: {
    min: number;
    max: number;
  };
}

// Form Types for Admin
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  
  // Inventory
  track_inventory: boolean;
  inventory_quantity: number;
  allow_backorder: boolean;
  low_stock_threshold: number;
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  
  // Status and visibility
  status: 'draft' | 'active' | 'archived';
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  
  // Images
  primary_image_url?: string;
  image_urls: string[];
  
  // Colors and sizes
  available_colors: string[];
  available_sizes: string[];
}

// Default values
export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  categories: [],
  colors: [],
  sizes: [],
  price_range: undefined,
  in_stock_only: false,
  on_sale_only: false,
  featured_only: false,
  new_arrivals_only: false,
  best_sellers_only: false,
};

export const DEFAULT_PRODUCT_SORT: ProductSortConfig = {
  sort_by: 'newest_first',
  direction: 'desc',
};

// Sort options for UI
export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest_first', label: 'New Arrivals', description: 'Newest products first' },
  { value: 'price_low_to_high', label: 'Price: Low to High', description: 'Sort by price ascending' },
  { value: 'price_high_to_low', label: 'Price: High to Low', description: 'Sort by price descending' },
  { value: 'best_sellers', label: 'Best Sellers', description: 'Most popular products' },
  { value: 'most_viewed', label: 'Most Viewed', description: 'Most viewed products' },
  { value: 'name_a_to_z', label: 'Name: A to Z', description: 'Sort by name ascending' },
  { value: 'name_z_to_a', label: 'Name: Z to A', description: 'Sort by name descending' },
  { value: 'featured_first', label: 'Featured First', description: 'Featured products first' },
] as const;

// Category mappings for size charts
export const CATEGORY_SIZE_MAPPING = {
  'futsal-shoes': 'futsal',
  'jersey': 'jersey',
  'socks': 'socks',
  'slides': 'slides',
  'insoles': 'socks', // Use socks size chart for insoles
} as const;
