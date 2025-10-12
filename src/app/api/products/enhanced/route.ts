import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ProductFilters, ProductSortConfig, ProductsResponse } from '@/data/product-types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set.');
  throw new Error('Supabase environment variables are not set.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    // Parse filters
    const filters: ProductFilters = {
      categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
      colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      in_stock_only: searchParams.get('in_stock_only') === 'true',
      on_sale_only: searchParams.get('on_sale_only') === 'true',
      featured_only: searchParams.get('featured_only') === 'true',
      new_arrivals_only: searchParams.get('new_arrivals_only') === 'true',
      best_sellers_only: searchParams.get('best_sellers_only') === 'true',
    };
    
    // Parse price range
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    if (minPrice || maxPrice) {
      filters.price_range = {
        min: minPrice ? parseFloat(minPrice) : 0,
        max: maxPrice ? parseFloat(maxPrice) : 999999,
      };
    }
    
    // Parse sorting
    const sortBy = searchParams.get('sort_by') || 'newest_first';
    const sortConfig: ProductSortConfig = {
      sort_by: sortBy as any,
      direction: searchParams.get('direction') as 'asc' | 'desc' || 'desc',
    };
    
    // Build the query
    let query = supabase
      .from('products_with_details')
      .select('*')
      .eq('status', 'active');
    
    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category_id', filters.categories);
    }
    
    if (filters.colors && filters.colors.length > 0) {
      query = query.overlaps('available_colors', filters.colors);
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      query = query.overlaps('available_sizes', filters.sizes);
    }
    
    if (filters.price_range) {
      query = query
        .gte('price', filters.price_range.min)
        .lte('price', filters.price_range.max);
    }
    
    if (filters.in_stock_only) {
      query = query.gt('inventory_quantity', 0);
    }
    
    if (filters.on_sale_only) {
      query = query.eq('is_on_sale', true);
    }
    
    if (filters.featured_only) {
      query = query.eq('is_featured', true);
    }
    
    if (filters.new_arrivals_only) {
      query = query.eq('is_new_arrival', true);
    }
    
    if (filters.best_sellers_only) {
      query = query.eq('is_best_seller', true);
    }
    
    // Apply sorting
    switch (sortConfig.sort_by) {
      case 'price_low_to_high':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high_to_low':
        query = query.order('price', { ascending: false });
        break;
      case 'newest_first':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest_first':
        query = query.order('created_at', { ascending: true });
        break;
      case 'best_sellers':
        query = query.order('purchase_count', { ascending: false });
        break;
      case 'most_viewed':
        query = query.order('view_count', { ascending: false });
        break;
      case 'name_a_to_z':
        query = query.order('name', { ascending: true });
        break;
      case 'name_z_to_a':
        query = query.order('name', { ascending: false });
        break;
      case 'featured_first':
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    // Get total count for pagination
    const { count: totalCount } = await query.select('*', { count: 'exact', head: true });
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data: products, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch products', error: error.message },
        { status: 500 }
      );
    }
    
    const totalPages = Math.ceil((totalCount || 0) / limit);
    
    const response: ProductsResponse = {
      success: true,
      products: products || [],
      total_count: totalCount || 0,
      page,
      limit,
      total_pages: totalPages,
      filters_applied: filters,
      sort_applied: sortConfig,
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
