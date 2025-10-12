import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ProductFiltersResponse } from '@/data/product-types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set.');
  throw new Error('Supabase environment variables are not set.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(): Promise<NextResponse> {
  try {
    // Fetch all filter options in parallel
    const [
      { data: categories, error: categoriesError },
      { data: colors, error: colorsError },
      { data: sizes, error: sizesError },
      { data: priceData, error: priceError }
    ] = await Promise.all([
      // Get active categories
      supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      
      // Get active colors
      supabase
        .from('product_colors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true }),
      
      // Get active sizes with category information
      supabase
        .from('product_sizes')
        .select(`
          *,
          product_categories!inner(name, slug)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      
      // Get price range from active products
      supabase
        .from('products')
        .select('price')
        .eq('status', 'active')
        .order('price', { ascending: true })
    ]);
    
    // Check for errors
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw categoriesError;
    }
    
    if (colorsError) {
      console.error('Error fetching colors:', colorsError);
      throw colorsError;
    }
    
    if (sizesError) {
      console.error('Error fetching sizes:', sizesError);
      throw sizesError;
    }
    
    if (priceError) {
      console.error('Error fetching price range:', priceError);
      throw priceError;
    }
    
    // Calculate price range
    const prices = priceData?.map(item => item.price).filter(price => price != null) || [];
    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    };
    
    // Group sizes by category for better organization
    const sizesByCategory = sizes?.reduce((acc, size) => {
      const categorySlug = size.product_categories?.slug;
      if (categorySlug) {
        if (!acc[categorySlug]) {
          acc[categorySlug] = {
            category_name: size.product_categories.name,
            sizes: []
          };
        }
        acc[categorySlug].sizes.push({
          id: size.id,
          name: size.name,
          sort_order: size.sort_order
        });
      }
      return acc;
    }, {} as Record<string, { category_name: string; sizes: any[] }>) || {};
    
    const response: ProductFiltersResponse = {
      success: true,
      categories: categories || [],
      colors: colors || [],
      sizes: sizes || [],
      price_range: priceRange,
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('Product filters API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch filter options', error: error.message },
      { status: 500 }
    );
  }
}
