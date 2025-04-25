import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { CartItem } from '@/store/cartSlice';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId, cartItems }: { userId: string; cartItems: CartItem[] } =
      await req.json();

    if (!userId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // const totalPrice = cartItems.reduce<number>(
    //   (sum, item) => sum + item.price * item.quantity,
    //   0
    // );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: userId, total_price: totalPrice }])
      .select()
      .single();

    if (orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 });

    // Insert order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 });

    return NextResponse.json({ message: 'Order created', orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
