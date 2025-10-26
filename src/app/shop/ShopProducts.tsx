'use client';

import React, { useEffect, useState, useCallback } from 'react';

import EnhancedFilter from '@/components/EnhancedFilter';
import ProductCard from '@/components/ProductCard';
import { productsSection } from '@/data/content';
import { supabase } from '@/libs/supabaseClient';
import Heading from '@/shared/Heading/Heading';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  created_at: Date;
  slug: string;
  previous_price: number;
  image_cover: string;
  colors: string[];
  available_colors?: string[];
  available_sizes?: string[];
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_on_sale?: boolean;
  inventory_quantity?: number;
}

interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
  price_range: { min: number; max: number } | null;
  in_stock_only: boolean;
  on_sale_only: boolean;
  featured_only: boolean;
  new_arrivals_only: boolean;
  best_sellers_only: boolean;
  sort_by: string;
  direction: 'asc' | 'desc';
}

interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

const ShopProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 0
  });
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    categories: [],
    colors: [],
    sizes: [],
    price_range: null,
    in_stock_only: false,
    on_sale_only: false,
    featured_only: false,
    new_arrivals_only: false,
    best_sellers_only: false,
    sort_by: 'newest_first',
    direction: 'desc'
  });

  // Fetch products with filters
  const fetchProducts = useCallback(async (filters: FilterState, page: number = 1) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '12');
      
      if (filters.categories.length > 0) {
        params.append('categories', filters.categories.join(','));
      }
      if (filters.colors.length > 0) {
        params.append('colors', filters.colors.join(','));
      }
      if (filters.sizes.length > 0) {
        params.append('sizes', filters.sizes.join(','));
      }
      if (filters.price_range) {
        params.append('min_price', filters.price_range.min.toString());
        params.append('max_price', filters.price_range.max.toString());
      }
      if (filters.in_stock_only) {
        params.append('in_stock_only', 'true');
      }
      if (filters.on_sale_only) {
        params.append('on_sale_only', 'true');
      }
      if (filters.featured_only) {
        params.append('featured_only', 'true');
      }
      if (filters.new_arrivals_only) {
        params.append('new_arrivals_only', 'true');
      }
      if (filters.best_sellers_only) {
        params.append('best_sellers_only', 'true');
      }
      
      // Handle sorting
      let sortBy = filters.sort_by;
      let direction = filters.direction;
      
      if (sortBy === 'price_low_high') {
        sortBy = 'price';
        direction = 'asc';
      } else if (sortBy === 'price_high_low') {
        sortBy = 'price';
        direction = 'desc';
      } else if (sortBy === 'newest_first') {
        sortBy = 'created_at';
        direction = 'desc';
      } else if (sortBy === 'best_sellers') {
        sortBy = 'popularity';
        direction = 'desc';
      } else if (sortBy === 'name_asc') {
        sortBy = 'name';
        direction = 'asc';
      } else if (sortBy === 'name_desc') {
        sortBy = 'name';
        direction = 'desc';
      }
      
      params.append('sort_by', sortBy);
      params.append('direction', direction);

      const response = await fetch(`/api/products/enhanced?${params.toString()}`);
      const data: ProductsResponse = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching products:', data);
        // Fallback to demo products
        setProducts(getDemoProducts());
      }
    } catch (error) {
      console.error('Network error fetching products:', error);
      // Fallback to demo products
      setProducts(getDemoProducts());
    } finally {
      setLoading(false);
    }
  }, []);

  // Demo products fallback
  const getDemoProducts = (): Product[] => [
    {
      id: 7,
      name: 'QYVE Leyenda \'94 Series',
      description: 'Premium jersey with classic design',
      price: 50,
      stock: 10,
      category_id: 1,
      created_at: new Date(),
      slug: 'qyve-leyenda-94-series',
      previous_price: 60,
      image_cover: '/jersey_pic.jpg',
      colors: ['black', 'pink'],
      available_colors: ['black', 'pink'],
      available_sizes: ['S', 'M', 'L', 'XL'],
      is_featured: true,
      is_new_arrival: true,
      is_best_seller: false,
      is_on_sale: true,
      inventory_quantity: 10
    },
    {
      id: 9,
      name: 'QYVE Recovery Slides',
      description: 'Comfortable recovery slides for post-game',
      price: 30,
      stock: 5,
      category_id: 1,
      created_at: new Date(),
      slug: 'qyve-recovery-slides',
      previous_price: 35,
      image_cover: '/slides_life.jpg',
      colors: ['black', 'cream'],
      available_colors: ['black', 'cream'],
      available_sizes: ['6', '7', '8', '9', '10', '11', '12'],
      is_featured: false,
      is_new_arrival: false,
      is_best_seller: true,
      is_on_sale: true,
      inventory_quantity: 5
    },
    {
      id: 6,
      name: 'QYVE ProGrip Socks',
      description: 'High-performance socks with grip technology',
      price: 18,
      stock: 8,
      category_id: 1,
      created_at: new Date(),
      slug: 'qyve-progrip-socks',
      previous_price: 22,
      image_cover: '/socks_white.png',
      colors: ['white', 'black'],
      available_colors: ['white', 'black'],
      available_sizes: ['S', 'M', 'L', 'XL'],
      is_featured: false,
      is_new_arrival: true,
      is_best_seller: false,
      is_on_sale: true,
      inventory_quantity: 8
    }
  ];

  // Initial load
  useEffect(() => {
    fetchProducts(currentFilters);
  }, [fetchProducts]);

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: FilterState) => {
    setCurrentFilters(filters);
    fetchProducts(filters, 1);
  }, [fetchProducts]);

  // Handle sort changes
  const handleSortChange = useCallback((sort: { sort_by: string; direction: 'asc' | 'desc' }) => {
    const newFilters = { ...currentFilters, ...sort };
    setCurrentFilters(newFilters);
    fetchProducts(newFilters, 1);
  }, [currentFilters, fetchProducts]);

  return (
    <div className="container">
      <Heading isCenter isMain desc={productsSection.description}>
        <div className="mt-8 font-myFont text-4xl italic">
          Products
        </div>
      </Heading>
      
      <EnhancedFilter 
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading products...</div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {products.length} of {pagination.total} products
            </div>
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.total_pages}
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="rounded-2xl border-neutral-300"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">No products found matching your filters.</div>
                <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria.</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <ButtonPrimary
                onClick={() => fetchProducts(currentFilters, pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2"
              >
                Previous
              </ButtonPrimary>
              
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.page} of {pagination.total_pages}
              </span>
              
              <ButtonPrimary
                onClick={() => fetchProducts(currentFilters, pagination.page + 1)}
                disabled={pagination.page >= pagination.total_pages}
                className="px-4 py-2"
              >
                Next
              </ButtonPrimary>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopProducts;
