import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
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
