import { NextResponse } from 'next/server';
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
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { authorized: false, error: 'Unauthorized' };
    }
    
    const userEmail = user.email?.toLowerCase() || '';
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
      return { authorized: false, error: 'Forbidden - Admin access required' };
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
    const { data: productSizes, error } = await supabaseAdmin
      .from('products_sizes')
      .select(`
        id,
        product_id,
        product_color_id,
        size,
        stock,
        product_colors (
          color,
          products (
            name
          )
        )
      `)
      .order('product_id');

    if (error) {
      console.error('Error fetching stock:', error);
      return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
    }

    const stocks = productSizes?.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_color_id: item.product_color_id,
      size: item.size,
      stock: item.stock,
      color: item.product_colors?.color || 'Unknown',
      product_name: item.product_colors?.products?.name || 'Unknown Product',
    })) || [];

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
