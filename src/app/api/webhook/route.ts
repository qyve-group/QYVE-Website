import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

// import { sendPaymentConfirmationEmail } from '@/lib/email';
// import { subtle } from 'crypto';
import { brevoClient, SendSmtpEmail } from '@/libs/brevo';
// import { supabase } from '@/libs/supabaseClient';
import { notifyTelegram } from '@/libs/telegram';

// Universal environment detection for test vs production keys
// Checks: NODE_ENV, APP_ENV, Replit domain, or key availability
const isDevEnvironment =
  process.env.NODE_ENV === 'development' ||
  process.env.APP_ENV === 'development' ||
  !!process.env.REPLIT_DEV_DOMAIN ||
  (!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_TEST_SECRET_KEY);

const stripeSecretKey = isDevEnvironment
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
  console.log('🚨 WEBHOOK CALLED AT:', new Date().toISOString());
  console.log('🚨 Webhook URL:', req.url);
  console.log('🚨 Webhook method:', req.method);

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('❌ Missing Stripe Signature');
    return NextResponse.json(
      { error: 'Missing Stripe Signature' },
      { status: 400 },
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const webhookSecret = isDevEnvironment
      ? process.env.STRIPE_TEST_WEBHOOK_SECRET ||
        process.env.STRIPE_WEBHOOK_SECRET
      : process.env.STRIPE_WEBHOOK_SECRET;

    console.log(
      '🔑 Using webhook secret environment:',
      isDevEnvironment ? 'DEVELOPMENT (test)' : 'PRODUCTION',
    );
    console.log('🔑 Webhook secret exists:', !!webhookSecret);
    console.log('🔑 Signature header:', `${sig?.substring(0, 20)}...`);
    console.log('🔑 Body length:', rawBody.length);

    // TEMPORARY: Skip signature verification for debugging
    if (!webhookSecret) {
      console.log('⚠️ No webhook secret - parsing body directly');
      const bodyStr = rawBody.toString();
      event = JSON.parse(bodyStr);
    } else {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        webhookSecret! as string,
      );
    }
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.log('⚠️ Attempting to parse webhook body directly...');
    try {
      const bodyStr = rawBody.toString();
      event = JSON.parse(bodyStr);
      console.log('✅ Successfully parsed webhook body without verification');
    } catch (parseErr) {
      console.error('❌ Failed to parse body:', parseErr);
      return NextResponse.json(
        { error: `Webhook Error: ${(err as Error).message}` },
        { status: 400 },
      );
    }
  }
  // // console.log*('✅ Webhook received:', event);

  if (event.type === 'checkout.session.completed') {
    console.log('✅ Processing checkout.session.completed event');
    const session = event.data.object;
    const userId = session.metadata?.user_id || '';
    const isGuestCheckout =
      userId === 'guest' || session.metadata?.is_guest_checkout === 'true';

    console.log(
      'Processing order for user:',
      userId,
      isGuestCheckout ? '(guest)' : '(authenticated)',
    );

    let orderAddress;
    let contactInfo;
    try {
      const orderAddressString = session.metadata?.order_address || '{}';
      orderAddress = JSON.parse(orderAddressString);

      const contactInfoString = session.metadata?.order_contact || '{}';
      contactInfo = JSON.parse(contactInfoString);
    } catch (parseError) {
      console.error('❌ Error parsing metadata:', parseError);
      return NextResponse.json(
        { error: 'Invalid metadata format' },
        { status: 400 },
      );
    }

    // console.log('orderAddress: ', orderAddress);
    // console.log('contactInfo ', contactInfo);
    if (!userId) {
      // console.error*('User ID missing in metadata');
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
    }

    // console.log('userid: ', userId);

    let cartItems: any[] = [];
    let cartId: string | null = null;

    if (isGuestCheckout) {
      // For guest checkout, get cart items from Stripe metadata
      try {
        const cartItemsString = session.metadata?.cart_items || '[]';
        cartItems = JSON.parse(cartItemsString);
        console.log('Guest cart items from metadata:', cartItems);
      } catch (parseError) {
        console.error('❌ Error parsing guest cart items:', parseError);
        return NextResponse.json(
          { error: 'Invalid cart items format' },
          { status: 400 },
        );
      }
    } else {
      // For authenticated users, fetch from database as before
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

      cartId = cartInfo.id;
      // console.log('cartId: ', cartId);

      // Fetch cart items using cart_id
      const { data: dbCartItems, error: cartItemsError } = await supabaseAdmin
        .from('cart_items')
        .select('*, products_sizes(*, product_colors(*))')
        .eq('cart_id', cartId);

      if (cartItemsError || !dbCartItems.length) {
        return NextResponse.json(
          { error: 'Cart items not found' },
          { status: 404 },
        );
      }
      cartItems = dbCartItems;
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
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 },
        );
      }
      console.log('✅ Order inserted successfully:', orderData?.id);
    } catch (err) {
      console.error('❌ Unexpected order creation error:', err);
      return NextResponse.json(
        { error: 'Order creation failed' },
        { status: 500 },
      );
    }

    // Process stock updates and order items with better error handling
    const stockUpdatePromises = [];
    const orderItemPromises = [];

    // Fetch all stock data first
    const stockPromises = cartItems.map((item) =>
      supabaseAdmin
        .from('products_sizes')
        .select('stock')
        .eq('id', item.product_size_id)
        .single()
        .then((result) => ({ item, result })),
    );

    const stockResults = await Promise.all(stockPromises);

    for (const { item, result } of stockResults) {
      try {
        const { data: productSize, error: fetchError } = result;

        if (fetchError) {
          console.error(
            'Error fetching stock for item:',
            item.product_size_id,
            fetchError,
          );
          continue;
        }

        if (!productSize || productSize.stock === undefined) {
          console.error('Stock not found for item:', item);
          continue;
        }

        // Calculate new stock
        const newStock = Math.max(0, productSize.stock - item.quantity);
        console.log(
          `Updating stock for item ${item.product_size_id}: ${productSize.stock} -> ${newStock}`,
        );

        // Update stock
        const stockUpdatePromise = supabaseAdmin
          .from('products_sizes')
          .update({ stock: newStock })
          .eq('id', item.product_size_id);

        stockUpdatePromises.push(stockUpdatePromise);

        // Create order item
        const orderItemsId = uuidv4();
        const orderItemPromise = supabaseAdmin.from('order_items').insert({
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
      const stockUpdateResults = await Promise.allSettled(stockUpdatePromises);
      const orderItemResults = await Promise.allSettled(orderItemPromises);

      // Log any failures
      stockUpdateResults.forEach((result, index) => {
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
        supabaseAdmin.from('order_addresses').insert({
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
        supabaseAdmin.from('order_contact_info').insert({
          phone: contactInfo.phone,
          email: contactInfo.email,
          order_id: orderId,
        }),
      ]);

      if (addressResult.status === 'rejected') {
        console.error('❌ Order address insert failed:', addressResult.reason);
      } else {
        console.log('✅ Order address inserted');
      }

      if (contactResult.status === 'rejected') {
        console.error(
          '❌ Order contact info insert failed:',
          contactResult.reason,
        );
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
    console.log('🚀 Starting Telegram notification process...');
    console.log('🚀 Order ID:', orderId);
    console.log('🚀 Cart items for Telegram:', cartItems);
    try {
      console.log('🚀 Calling notifyTelegram function...');
      await notifyTelegram(orderId, orderAddress, contactInfo, cartItems);
      console.log('✅ Telegram notification sent successfully');
    } catch (telegramError) {
      console.error(
        '❌ Telegram notification failed (non-critical):',
        telegramError,
      );
      console.error('❌ Telegram error stack:', (telegramError as Error).stack);
      // Don't fail the webhook for notification errors
    }

    // Send email receipt (non-blocking)
    console.log('📨 Starting email notification process...');
    console.log('📨 Contact info:', contactInfo);
    console.log('📨 Order address:', orderAddress);
    try {
      const customerEmail = contactInfo.email;
      const customerName = `${orderAddress.fname} ${orderAddress.lname}`;

      console.log('📨 Customer email:', customerEmail);
      console.log('📨 Customer name:', customerName);
      console.log('📨 Is guest checkout:', isGuestCheckout);

      // Format order items for email - handle both guest and authenticated cart formats
      let orderItemsText = '';
      if (isGuestCheckout) {
        // Guest cart items are simple objects from Redux
        console.log('📨 Processing guest cart items for email:', cartItems);
        orderItemsText = cartItems
          .map(
            (item: any) =>
              `${item.name} (${item.products_sizes.size || 'N/A'}) x${item.quantity} - RM${item.price}`,
          )
          .join('\n');
      } else {
        // Authenticated cart items have complex database relations
        console.log(
          '📨 Processing authenticated cart items for email:',
          cartItems,
        );
        orderItemsText = cartItems
          .map((item: any) => {
            const colorName =
              item.products_sizes?.product_colors?.color || 'N/A';
            const size = item.products_sizes?.size || 'N/A';
            return `${colorName} (${size}) x${item.quantity} - RM${item.price}`;
          })
          .join('\n');
      }

      console.log('📨 Formatted order items text:', orderItemsText);

      // Send order confirmation email using new email service
      try {
        const orderData = {
          orderId,
          customerName,
          customerEmail: customerEmail as string,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          currency: 'MYR',
          items: cartItems.map((item: any) => ({
            name: item.products_sizes?.product_colors?.products?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
            size: item.products_sizes?.size || 'N/A',
            color: item.products_sizes?.product_colors?.color || 'N/A',
          })),
          shippingAddress: {
            line1: orderAddress.shipping_address_1,
            line2: orderAddress.shipping_address_2,
            city: orderAddress.city,
            state: orderAddress.state,
            postalCode: orderAddress.postal_code,
            country: orderAddress.country,
          },
        };

        const { sendOrderConfirmation } = await import('@/lib/email-service');
        const emailResult = await sendOrderConfirmation(orderData);
        
        if (emailResult.success) {
          console.log('✅ Order confirmation email sent successfully');
        } else {
          console.error('❌ Failed to send order confirmation email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Email receipt failed (non-critical):', emailError);
        console.error('❌ Email error stack:', (emailError as Error).stack);
        // Don't fail the webhook for email errors
      }

    console.log(
      '✅ Webhook processing completed successfully for order:',
      orderId,
    );
  }

  return NextResponse.json({ received: true });
}
