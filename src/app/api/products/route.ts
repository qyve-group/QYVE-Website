import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured, returning demo products');
      return NextResponse.json({
        success: true,
        products: [
          {
            id: 1,
            name: 'QYVE Infinitus',
            slug: 'qyve-infinitus',
            price: 150,
            previous_price: 180,
            image_cover: '/images/products/infinitus.jpg',
            overview: 'Premium futsal shoes designed for performance and comfort.',
            colors: ['black', 'white'],
            sizes: [
              { id: 1, size: '8', stock: 10, product_color_id: 1 },
              { id: 2, size: '9', stock: 15, product_color_id: 1 },
              { id: 3, size: '10', stock: 8, product_color_id: 1 }
            ],
            category: 'futsal',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ]
      });
    }

    // Fetch products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        previous_price,
        image_cover,
        overview,
        colors,
        created_at,
        updated_at,
        product_colors(id, color, image),
        products_sizes(id, size, stock, product_color_id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      // Return demo products on error
      return NextResponse.json({
        success: true,
        products: [
          {
            id: 1,
            name: 'QYVE Infinitus',
            slug: 'qyve-infinitus',
            price: 150,
            previous_price: 180,
            image_cover: '/images/products/infinitus.jpg',
            overview: 'Premium futsal shoes designed for performance and comfort.',
            colors: ['black', 'white'],
            sizes: [
              { id: 1, size: '8', stock: 10, product_color_id: 1 },
              { id: 2, size: '9', stock: 15, product_color_id: 1 },
              { id: 3, size: '10', stock: 8, product_color_id: 1 }
            ],
            category: 'futsal',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ]
      });
    }

    // Transform the data to match the admin interface
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      previous_price: product.previous_price,
      image_cover: product.image_cover,
      overview: product.overview,
      colors: product.colors || [],
      sizes: product.products_sizes || [],
      category: getCategoryFromName(product.name),
      isActive: true, // Default to active
      createdAt: product.created_at,
      updatedAt: product.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      products: transformedProducts
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, slug, price, previous_price, overview, colors, category } = body;

    // Validate required fields
    if (!name || !slug || !price || !overview) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create product in Supabase
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        price,
        previous_price: previous_price || null,
        overview,
        colors: colors || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Update product in Supabase
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Delete product from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine category from product name
function getCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('jersey') || nameLower.includes('bola') || nameLower.includes('leyenda')) {
    return 'jersey';
  }
  if (nameLower.includes('slide') || nameLower.includes('recovery')) {
    return 'slides';
  }
  if (nameLower.includes('sock') || nameLower.includes('progrip')) {
    return 'socks';
  }
  if (nameLower.includes('futsal') || nameLower.includes('infinitus')) {
    return 'futsal';
  }
  return 'futsal'; // Default category
}
