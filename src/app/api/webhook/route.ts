import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

// import { supabase } from '@/libs/supabaseClient';
import { notifyTelegram } from '@/libs/telegram';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

export async function POST(req: Request) {
  console.log('Webhook called');

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    // console.error*('❌ Missing Stripe Signature');
    return NextResponse.json(
      { error: 'Missing Stripe Signature' },
      { status: 400 },
    );
  }

  const body = await req.arrayBuffer();
  const rawBody = Buffer.from(body);

  // let rawBody = await req.arrayBuffer(); // This is the only way to get raw body in App Router

  let event: Stripe.Event;
  try {
    // const rawBody = await req.text(); // Get raw body for verification
    // const rawBody = await req.arrayBuffer();
    // const rawBodyString = Buffer.from(rawBody).toString("utf8"); // Convert to string for Stripe verification
    // ✅ Manually get raw body
    // const bodyBuffer = await req.arrayBuffer();
    // const rawBody = Buffer.from(bodyBuffer);

    // console.log('📩 Raw body received:', rawBody);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET! as string,
    );
    // event = stripe.webhooks.constructEvent(rawBodyString, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    // // console.log*('✅ Event parsed:', event);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
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
    const { data: cartInfo, error: cartInfoError } = await supabaseAdmin
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

    // Fetch cart items using cart_id
    // const { data: cartItems, error: cartItemsError } = await supabaseAdmin
    //   .from('cart_items')
    //   .select('*')
    //   .eq('cart_id', cartId);

    const { data: cartItems, error: cartItemsError } = await supabaseAdmin
      .from('cart_items')
      .select('*, products_sizes(*, product_colors(*))')
      .eq('cart_id', cartId);

    if (cartItemsError || !cartItems.length) {
      return NextResponse.json(
        { error: 'Cart items not found' },
        { status: 404 },
      );
    }
    console.log('cartItems: -webhook', cartItems);

    // Create an order linked to cart_id
    const orderId = uuidv4(); // Generate a new UUID
    // console.log('OrderID is: ', orderId);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const formattedTotalPrice = parseFloat(totalPrice.toFixed(2)); // Ensure precision

    console.log('About to insert order with values:', {
      orderId,
      userId,
      formattedTotalPrice,
      stripeSessionId: session.id,
    });

    try {
      const { error: orderError } = await supabaseAdmin
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
        console.error('❌ Insert error:', orderError);
      } else {
        // console.log('✅ Order inserted:', orderData);
      }
    } catch (err) {
      // console.error('❌ Unexpected error:', err);
    }

    // Reduce stock in `product_sizes`
    /* eslint-disable no-await-in-loop */
    for (const item of cartItems) {
      const { data: productSize, error: fetchError } = await supabaseAdmin
        .from('products_sizes')
        .select('stock')
        .eq('id', item.product_size_id)
        .single();

      if (fetchError) {
        console.error('Error fetching stock:', fetchError);
        continue; // Skip to the next item if there's an error
      }

      // Ensure stock exists before updating
      if (!productSize || productSize.stock === undefined) {
        console.error('Stock not found for item:', item);
        continue;
      }

      // Calculate new stock
      const newStock = productSize.stock - item.quantity;
      console.log(`newStock for item ${item.id}: ${newStock}`);

      console.log('Updating stock for item:', item);

      const { error: stockError } = await supabaseAdmin
        .from('products_sizes')
        .update({ stock: newStock })
        .eq('id', item.product_size_id);

      if (stockError) {
        throw stockError;
      }

      console.log('stock updated at ');

      // Adding ordered items into order_items
      const orderItemsId = uuidv4();

      console.log('created orderItemsId: ', orderItemsId);

      try {
        const { error: orderItemsError } = await supabaseAdmin
          .from('order_items')
          .insert({
            id: orderItemsId,
            order_id: orderId,
            product_size_id: item.product_size_id,
            quantity: item.quantity,
            price: item.price,
          });

        if (orderItemsError) {
          console.error('Insert error: ', orderItemsError);
        }
      } catch (error) {
        console.error('Unexpected insert failure: ', error);
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

    // await fetch('/api/shipment/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     action: 'makeOrder',
    //     bulk: [
    //       {
    //         weight: 1,
    //         content: 'shoe',
    //         amount: totalPrice,
    //         serviceId: 'EP-CS08H', //servId,
    //         pick_point: 'EP-CB0ZU3', //dropOffPoint,
    //         pick_name: 'QYVE',
    //         pick_contact: '01234567891',
    //         pick_addr1: '16, Lorong Dahlia, PJU 6A',
    //         pick_city: 'Petaling Jaya',
    //         pick_state: 'Selangor',
    //         pick_code: '47400',
    //         pick_country: 'Malaysia',
    //         // send_point:
    //         send_name: orderAddress.fname,
    //         send_contact: contactInfo.phone,
    //         send_addr1: orderAddress.shipping_address_1,
    //         send_city: orderAddress.city,
    //         send_state: orderAddress.state,
    //         send_code: orderAddress.postal_code,
    //         send_country: 'Malaysia',
    //         collect_date: '', //YYYY-MM-DD
    //         sms: '0', //true/false
    //         send_email: contactInfo.email,
    //       },
    //     ],
    //   }),
    // });

    // try {
    //   const body = await req.json();
    //   console.log('✅ Telegram Webhook Payload:', body);

    //   // Always return quickly
    //   return NextResponse.json({ ok: true });
    // } catch (error) {
    //   console.error('❌ Error in Telegram Webhook:', error);
    //   return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    // }

    // const res = await fetch(
    //   `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       chat_id: process.env.GROUP_CHAT_ID,
    //       text: `New paid order!\nOrder ID ${orderId}\nCustomer: ${orderAddress.fname} ${orderAddress.lname}\n
    //       Email: ${contactInfo.email}\nPhone number: ${contactInfo.phone}\n\n
    //       Address: ${orderAddress.shipping_address_1}, ${orderAddress.city}, ${orderAddress.state}, ${orderAddress.postal_code}`,
    //     }),
    //   },
    // );
    // const json = await res.json();
    // if (!res.ok) {
    //   console.error('Telegram Error:', json);
    // } else {
    //   console.log('Message sent:', json);
    // }

    // console.log*('✅ Payment Successful:', session);
    // console.log('order address: ', orderAddress);

    // const response = await fetch('/api/shipment/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     action: 'makeOrder',
    //     bulk: [
    //       {
    //         weight: 1,
    //         content: 'shoe',
    //         amount: totalPrice,
    //         serviceId: 'EP-CS0W', //servId,
    //         pick_point: '', //dropOffPoint,
    //         pick_name: 'QYVE',
    //         pick_contact: '01234567891',
    //         pick_addr1: '16, Lorong Dahlia, PJU 6A',
    //         pick_city: 'Petaling Jaya',
    //         pick_state: 'Selangor',
    //         pick_code: '47400',
    //         pick_country: 'Malaysia',
    //         // send_point:
    //         send_name: orderAddress.fname,
    //         send_contact: contactInfo.phone,
    //         send_addr1: orderAddress.shipping_address_1,
    //         send_city: orderAddress.city,
    //         send_state: orderAddress.state,
    //         send_code: orderAddress.postal_code,
    //         send_country: 'Malaysia',
    //         collect_date: '2025-06-07', //YYYY-MM-DD
    //         sms: '0', //true/false
    //         send_email: contactInfo.email,
    //       },
    //     ],
    //   }),
    // });

    // const data = await response.json();

    // return NextResponse.json(data);

    await notifyTelegram(orderId, orderAddress, contactInfo);
  }

  return NextResponse.json({ received: true });
}
