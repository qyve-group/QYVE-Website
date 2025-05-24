import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

import { supabase } from '@/libs/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  // console.log('Webhook called');

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    // console.error*('❌ Missing Stripe Signature');
    return NextResponse.json(
      { error: 'Missing Stripe Signature' },
      { status: 400 },
    );
  }

  let event;
  try {
    // const rawBody = await req.text(); // Get raw body for verification
    // const rawBody = await req.arrayBuffer();
    // const rawBodyString = Buffer.from(rawBody).toString("utf8"); // Convert to string for Stripe verification
    // ✅ Manually get raw body
    const bodyBuffer = await req.arrayBuffer();
    const rawBody = Buffer.from(bodyBuffer);
    // console.log('📩 Raw body received:', rawBody);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    // event = stripe.webhooks.constructEvent(rawBodyString, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    // // console.log*('✅ Event parsed:', event);
  } catch (err) {
    // console.error*('❌ Webhook Error:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 },
    );
  }
  // // console.log*('✅ Webhook received:', event);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // const userId = "1c2e85d0-410f-4019-88f3-c380ec3abc24";
    const userId = session.metadata?.user_id || '';
    // // console.log*('✅ Checkout Session Object:', session);
    // // console.log*('userid: ', userId);
    const orderAddressString = session.metadata?.order_address || '{}';
    const orderAddress = JSON.parse(orderAddressString);

    const contactInfoString = session.metadata?.order_contact || '{}';
    const contactInfo = JSON.parse(contactInfoString);

    // console.log('orderAddress: ', orderAddress);
    // console.log('contactInfo ', contactInfo);
    if (!userId) {
      // console.error*('User ID missing in metadata');
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
    }

    // console.log('userid: ', userId);

    // Fetch cart_id from cart table using user_id
    const { data: cartInfo, error: cartInfoError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cartInfoError || !cartInfo) {
      return NextResponse.json(
        { error: 'Active cart not found' },
        { status: 404 },
      );
    }

    const cartId = cartInfo.id;
    // console.log('cartId: ', cartId);

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    );
    // Fetch cart items using cart_id
    const { data: cartItems, error: cartItemsError } = await supabaseAdmin
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId);

    if (cartItemsError || !cartItems.length) {
      return NextResponse.json(
        { error: 'Cart items not found' },
        { status: 404 },
      );
    }
    // console.log('cartItems: ', cartItems);

    // Create an order linked to cart_id
    const orderId = uuidv4(); // Generate a new UUID
    // console.log('OrderID is: ', orderId);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const formattedTotalPrice = parseFloat(totalPrice.toFixed(2)); // Ensure precision

    // console.log('About to insert order with values:', {
    //   orderId,
    //   userId,
    //   formattedTotalPrice,
    //   stripeSessionId: session.id,
    // });

    try {
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            id: orderId,
            user_id: userId,
            status: 'Paid',
            total_price: formattedTotalPrice,
            stripe_session_id: session.id,
          },
        ])
        .select()
        .single();

      if (orderError) {
        // console.error('❌ Insert error:', orderError);
      } else {
        // console.log('✅ Order inserted:', orderData);
      }
    } catch (err) {
      // console.error('❌ Unexpected error:', err);
    }

    // const { data: orderData, error: orderError } = await supabase
    //   .from('orders')
    //   .insert([
    //     {
    //       id: orderId,
    //       user_id: userId,
    //       status: 'paid',
    //       total_price: formattedTotalPrice,
    //       stripe_session_id: session.id,
    //     },
    //   ])
    //   .select()
    //   .single();

    // console.log('orderError:', orderError);
    // console.log('orderData:', orderData);

    // if (orderError) {
    //   // console.error*('Failed to create order:', orderError);
    //   return NextResponse.json(
    //     { error: 'Order creation failed' },
    //     { status: 500 },
    //   );
    // }

    // console.log('Order data inserted in order table: ', orderData);

    // //console.log**('Order created: ', order);

    // Reduce stock in `product_sizes`

    /* eslint-disable no-await-in-loop */
    for (const item of cartItems) {
      const { data: productSize, error: fetchError } = await supabase
        .from('products_sizes')
        .select('stock')
        .eq('product_id', item.product_id)
        .eq('id', item.size_id)
        .single();

      if (fetchError) {
        // console.error*('Error fetching stock:', fetchError);
        continue; // Skip to the next item if there's an error
      }

      // Ensure stock exists before updating
      if (!productSize || productSize.stock === undefined) {
        // console.error*('Stock not found for item:', item);
        continue;
      }

      // Calculate new stock
      const newStock = productSize.stock - item.quantity;
      // console.log*('newStock: ', newStock);

      // console.log*('Updating stock for item:', item);

      const { error: stockError } = await supabaseAdmin
        .from('products_sizes')
        .update({ stock: newStock })
        .eq('product_id', item.product_id)
        .eq('id', item.size_id);

      if (stockError) {
        throw stockError;
      }

      // Adding ordered items into order_items
      const orderItemsId = uuidv4();

      const { error: orderItemsError } = await supabaseAdmin
        .from('order_items')
        .insert({
          id: orderItemsId,
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        });

      if (orderItemsError) {
        throw orderItemsError;
      }
    }

    const { error: orderAddressesError } = await supabaseAdmin
      .from('order_addresses')
      .insert({
        house_no: orderAddress.no,
        city: orderAddress.city,
        state: orderAddress.state,
        postal_code: orderAddress.postal_code,
        address_line_1: orderAddress.shipping_address_1,
        address_line_2: orderAddress.shipping_address_2,
        first_name: orderAddress.fname,
        last_name: orderAddress.lname,
        order_id: orderId,
      })
      .select()
      .single();

    if (orderAddressesError) {
      // console.error('orderAddressesError: ', orderAddressesError);
    }
    // console.log('returned ordercontact from supabase: ', orderAdd);

    const { error: orderContactInfoData } = await supabaseAdmin
      .from('order_contact_info')
      .insert({
        phone: contactInfo.phone,
        email: contactInfo.email,
        order_id: orderId,
      })
      .select()
      .single();

    if (orderContactInfoData) {
      // console.error('orderContactInfo: ', orderContactInfoData);
    }

    // console.log('returned ordercontact from supabase: ', orderContactInfo);

    // Clear the cart after payment
    // console.log*('Clearing cart items for cart ID:', cartId);
    const { error: clearCartError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    if (clearCartError) {
      // console.error*('❌ Error clearing cart items:', clearCartError);
    } else {
      // console.log*(`✅ Cart items cleared for cart ID: ${cartId}`);
    }

    // console.log*('✅ Payment Successful:', session);
    // console.log('order address: ', orderAddress);
  }

  return NextResponse.json({ received: true });
}
