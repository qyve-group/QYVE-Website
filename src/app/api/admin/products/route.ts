import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyAdminAuth(): Promise<{ authorized: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('Admin auth - cookies found:', allCookies.map(c => c.name));
    console.log('Admin auth - ADMIN_EMAILS:', ADMIN_EMAILS);
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return allCookies;
          },
          setAll() {},
        },
      },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Admin auth - user:', user?.email, 'error:', authError?.message);
    
    if (!user) {
      return { authorized: false, error: 'Unauthorized - No user session' };
    }
    
    const userEmail = user.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
      return { authorized: false, error: `Forbidden - ${userEmail} not in admin list` };
    }
    
    return { authorized: true };
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        previous_price,
        image_cover,
        overview,
        category_id,
        is_featured,
        is_new_arrival,
        is_best_seller,
        is_on_sale,
        status,
        created_at,
        updated_at,
        product_colors (
          id,
          color,
          images,
          products_sizes (
            id,
            size,
            stock
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const enrichedProducts = products?.map((product: any) => {
      let totalStock = 0;
      product.product_colors?.forEach((color: any) => {
        color.products_sizes?.forEach((size: any) => {
          totalStock += size.stock || 0;
        });
      });
      return {
        ...product,
        totalStock,
        variantCount: product.product_colors?.length || 0,
      };
    }) || [];

    return NextResponse.json({ products: enrichedProducts });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, price, previous_price, image_cover, overview, category_id, is_featured, is_new_arrival, is_best_seller, is_on_sale, status } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ error: 'Name, slug, and price are required' }, { status: 400 });
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        slug,
        price,
        previous_price: previous_price || null,
        image_cover: image_cover || null,
        overview: overview || null,
        category_id: category_id || null,
        is_featured: is_featured || false,
        is_new_arrival: is_new_arrival || false,
        is_best_seller: is_best_seller || false,
        is_on_sale: is_on_sale || false,
        status: status || 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, slug, price, previous_price, image_cover, overview, category_id, is_featured, is_new_arrival, is_best_seller, is_on_sale, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (price !== undefined) updateData.price = price;
    if (previous_price !== undefined) updateData.previous_price = previous_price;
    if (image_cover !== undefined) updateData.image_cover = image_cover;
    if (overview !== undefined) updateData.overview = overview;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (is_new_arrival !== undefined) updateData.is_new_arrival = is_new_arrival;
    if (is_best_seller !== undefined) updateData.is_best_seller = is_best_seller;
    if (is_on_sale !== undefined) updateData.is_on_sale = is_on_sale;
    if (status !== undefined) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { data: productColors } = await supabaseAdmin
      .from('product_colors')
      .select('id')
      .eq('product_id', parseInt(id));

    if (productColors && productColors.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete product with existing variants. Please remove all color variants first.' 
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting product:', error);
      if (error.code === '23503') {
        return NextResponse.json({ 
          error: 'Cannot delete product. It has related data (orders, variants, etc.).' 
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
