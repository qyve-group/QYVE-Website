import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

// import { supabase } from '@/libs/supabaseClient';
import { notifyTelegram } from '@/libs/telegram';
import { sendPaymentConfirmationEmail } from '@/lib/email';
// import { subtle } from 'crypto';

// Use test keys in Replit (development), production keys in GitHub/Vercel
const isReplit = !!process.env.REPLIT_DEV_DOMAIN;
const stripeSecretKey = isReplit 
  ? process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey!, {
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
  console.log('Webhook called at:', new Date().toISOString());

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('❌ Missing Stripe Signature');
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

    const webhookSecret = isReplit 
      ? process.env.STRIPE_TEST_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_SECRET;
      
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret! as string,
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
    console.log('✅ Processing checkout.session.completed event');
    const session = event.data.object;
    const userId = session.metadata?.user_id || '';
    const isGuestCheckout = userId === 'guest' || session.metadata?.is_guest_checkout === 'true';
    
    console.log('Processing order for user:', userId, isGuestCheckout ? '(guest)' : '(authenticated)');
    
    let orderAddress, contactInfo;
    try {
      const orderAddressString = session.metadata?.order_address || '{}';
      orderAddress = JSON.parse(orderAddressString);
      
      const contactInfoString = session.metadata?.order_contact || '{}';
      contactInfo = JSON.parse(contactInfoString);
    } catch (parseError) {
      console.error('❌ Error parsing metadata:', parseError);
      return NextResponse.json({ error: 'Invalid metadata format' }, { status: 400 });
    }

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
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([
          {
            id: orderId,
            user_id: isGuestCheckout ? null : userId,
            status: 'Paid',
            total_price: session.amount_total! / 100,
            stripe_session_id: session.id,
            tracking_no: 'Processing',
            subtotal: session.amount_subtotal! / 100,
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('❌ Order insert error:', orderError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      } else {
        console.log('✅ Order inserted successfully:', orderData?.id);
      }
    } catch (err) {
      console.error('❌ Unexpected order creation error:', err);
      return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
    }

    // Process stock updates and order items with better error handling
    const stockUpdatePromises = [];
    const orderItemPromises = [];
    
    for (const item of cartItems) {
      try {
        // Fetch current stock
        const { data: productSize, error: fetchError } = await supabaseAdmin
          .from('products_sizes')
          .select('stock')
          .eq('id', item.product_size_id)
          .single();

        if (fetchError) {
          console.error('Error fetching stock for item:', item.product_size_id, fetchError);
          continue;
        }

        if (!productSize || productSize.stock === undefined) {
          console.error('Stock not found for item:', item);
          continue;
        }

        // Calculate new stock
        const newStock = Math.max(0, productSize.stock - item.quantity);
        console.log(`Updating stock for item ${item.product_size_id}: ${productSize.stock} -> ${newStock}`);

        // Update stock
        const stockUpdatePromise = supabaseAdmin
          .from('products_sizes')
          .update({ stock: newStock })
          .eq('id', item.product_size_id);
        
        stockUpdatePromises.push(stockUpdatePromise);

        // Create order item
        const orderItemsId = uuidv4();
        const orderItemPromise = supabaseAdmin
          .from('order_items')
          .insert({
            id: orderItemsId,
            order_id: orderId,
            product_size_id: item.product_size_id,
            quantity: item.quantity,
            price: item.price,
          });
        
        orderItemPromises.push(orderItemPromise);
        
      } catch (error) {
        console.error('Error processing item:', item.product_size_id, error);
      }
    }
    
    // Execute all stock updates and order item insertions in parallel
    try {
      const stockResults = await Promise.allSettled(stockUpdatePromises);
      const orderItemResults = await Promise.allSettled(orderItemPromises);
      
      // Log any failures
      stockResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Stock update ${index} failed:`, result.reason);
        }
      });
      
      orderItemResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Order item ${index} failed:`, result.reason);
        }
      });
      
      console.log('✅ Stock updates and order items processed');
    } catch (error) {
      console.error('❌ Error in bulk operations:', error);
    }

    // Insert order address and contact info in parallel
    try {
      const [addressResult, contactResult] = await Promise.allSettled([
        supabaseAdmin
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
          }),
        supabaseAdmin
          .from('order_contact_info')
          .insert({
            phone: contactInfo.phone,
            email: contactInfo.email,
            order_id: orderId,
          })
      ]);
      
      if (addressResult.status === 'rejected') {
        console.error('❌ Order address insert failed:', addressResult.reason);
      } else {
        console.log('✅ Order address inserted');
      }
      
      if (contactResult.status === 'rejected') {
        console.error('❌ Order contact info insert failed:', contactResult.reason);
      } else {
        console.log('✅ Order contact info inserted');
      }
    } catch (error) {
      console.error('❌ Error inserting order details:', error);
    }

    // console.log('returned ordercontact from supabase: ', orderContactInfo);

    // Clear the cart after payment (only for authenticated users)
    if (!isGuestCheckout && cartId) {
      try {
        console.log('🧹 Clearing cart items for cart ID:', cartId);
        const { error: clearCartError } = await supabaseAdmin
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId);

        if (clearCartError) {
          console.error('❌ Error clearing cart items:', clearCartError);
        } else {
          console.log(`✅ Cart items cleared for cart ID: ${cartId}`);
        }
      } catch (error) {
        console.error('❌ Unexpected error clearing cart:', error);
      }
    } else if (isGuestCheckout) {
      console.log('ℹ️ Guest checkout - no cart clearing needed');
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

    // Send Telegram notification (non-blocking)
    try {
      await notifyTelegram(orderId, orderAddress, contactInfo);
      console.log('✅ Telegram notification sent');
    } catch (telegramError) {
      console.error('❌ Telegram notification failed (non-critical):', telegramError);
      // Don't fail the webhook for notification errors
    }

    // Send email receipt (non-blocking)
    try {
      const customerEmail = contactInfo.email;
      const customerName = `${orderAddress.fname} ${orderAddress.lname}`;
      
      // Format order items for email
      const orderItemsText = cartItems.map((item: any) => 
        `${item.name} (${item.product_size}) x${item.quantity} - RM${item.price}`
      ).join('\n');
      
      if (customerEmail) {
        await sendPaymentConfirmationEmail(
          customerEmail,
          customerName,
          orderId,
          orderItemsText,
          session.amount_total ? (session.amount_total / 100).toString() : '0'
        );
        console.log('✅ Email receipt sent to:', customerEmail);
      }
    } catch (emailError) {
      console.error('❌ Email receipt failed (non-critical):', emailError);
      // Don't fail the webhook for email errors
    }
    
    console.log('✅ Webhook processing completed successfully for order:', orderId);
  }

  return NextResponse.json({ received: true });
}
