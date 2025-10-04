import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products_sizes(
            *,
            product_colors(
              *,
              products(*)
            )
          )
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Format items for Google Analytics
    const items = order.order_items.map((item: any) => ({
      item_id: item.products_sizes?.id || item.product_size_id,
      item_name: item.products_sizes?.product_colors?.products?.name || 'Product',
      price: item.price,
      quantity: item.quantity,
      item_category: 'Apparel',
      item_brand: 'QYVE',
      item_variant: item.products_sizes?.size || 'Standard',
    }));

    return NextResponse.json({
      order_id: order.id,
      total_value: order.total_price,
      currency: 'MYR',
      items,
      transaction_id: sessionId,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
