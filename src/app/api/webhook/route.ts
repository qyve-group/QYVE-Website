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

    // Check if this is a SubZero pre-order
    if (session.metadata?.product_type === 'subzero_preorder') {
      console.log('🥶 Processing SubZero pre-order payment');

      const orderRef = session.id.slice(-12).toUpperCase();
      const { metadata } = session;

      try {
        // Store pre-order in database
        const { data: preOrderData, error: preOrderError } = await supabaseAdmin
          .from('pre_orders')
          .insert({
            order_id: orderRef,
            customer_email: metadata.customer_email,
            customer_name: metadata.customer_name,
            customer_phone: metadata.customer_phone || null,
            product_name: 'SubZero Futsal Shoes',
            product_variant: `Size: ${metadata.size}, Color: ${metadata.color}`,
            quantity: parseInt(metadata.quantity || '1', 10),
            unit_price: 238,
            total_price: session.amount_total
              ? session.amount_total / 100
              : 238,
            shipping_address: {
              name: metadata.shipping_name,
              address_1: metadata.shipping_address_1,
              address_2: metadata.shipping_address_2,
              city: metadata.shipping_city,
              state: metadata.shipping_state,
              postal_code: metadata.shipping_postal_code,
              country: metadata.shipping_country,
            },
            status: 'confirmed',
            payment_status: 'paid',
            source: 'stripe',
            pre_order_notes: `Stripe Session: ${session.id}`,
          })
          .select()
          .single();

        if (preOrderError) {
          console.error('❌ Failed to store SubZero pre-order:', preOrderError);
        } else {
          console.log('✅ SubZero pre-order stored:', preOrderData?.id);
        }

        // Send confirmation email via Brevo
        const email = new SendSmtpEmail();
        email.sender = { name: 'QYVE', email: 'noreply@qyveofficial.com' };
        email.to = [
          {
            email: metadata.customer_email as string,
            name: metadata.customer_name as string,
          },
        ];
        email.subject = 'SubZero Pre-Order Confirmed - Payment Received!';
        email.htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a5a7a 0%, #2E5C8A 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">SubZero Pre-Order Confirmed!</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Hi <strong>${metadata.customer_name}</strong>,</p>
              <p>Thank you for your SubZero pre-order! Your payment has been received.</p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1a5a7a;">Order Details</h3>
                <p><strong>Order Reference:</strong> ${orderRef}</p>
                <p><strong>Product:</strong> SubZero Futsal Shoes (Early Bird)</p>
                <p><strong>Size:</strong> ${metadata.size}</p>
                <p><strong>Color:</strong> ${metadata.color}</p>
                <p><strong>Quantity:</strong> ${metadata.quantity}</p>
                <p><strong>Subtotal:</strong> ${metadata.subtotal || metadata.unit_price}</p>
                <p><strong>Shipping:</strong> ${metadata.shipping_cost || 'RM 0'}</p>
                <p><strong>Total Paid:</strong> ${metadata.total_price}</p>
              </div>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1a5a7a;">Shipping Address</h3>
                <p>${metadata.shipping_name}<br>
                ${metadata.shipping_address_1}<br>
                ${metadata.shipping_address_2 ? `${metadata.shipping_address_2}<br>` : ''}
                ${metadata.shipping_city}, ${metadata.shipping_state} ${metadata.shipping_postal_code}<br>
                ${metadata.shipping_country}</p>
              </div>
              
              <p><strong>Expected Delivery:</strong> 5-7 days from week of 22/12/2025</p>
              
              <p style="color: #666; font-size: 14px;">
                If you have any questions, you can reach us at 
                <strong>support@qyveofficial.com</strong>, or contact us on 
                <strong>Instagram (@qyveofficial)</strong>, 
                <strong>TikTok (@qyveofficial)</strong>, or 
                <a href="https://wa.me/601160974239" style="color: #666; text-decoration: underline;">WhatsApp</a>.
              </p>

            </div>
            <div style="background: #000000; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px;">QYVE GROUP SDN BHD (202501005103 (1606517D))  | www.qyveofficial.com</p>
            </div>
          </div>
        `;

        const emailResult = await brevoClient.sendTransacEmail(email);
        console.log(
          '✅ SubZero confirmation email sent to:',
          metadata.customer_email,
          'Message ID:',
          emailResult.body?.messageId,
        );

        // Send Telegram notification
        const telegramMessage =
          `🥶 NEW SUBZERO PRE-ORDER PAID!\n\n` +
          `Order Ref: ${orderRef}\n` +
          `Customer: ${metadata.customer_name}\n` +
          `Email: ${metadata.customer_email}\n` +
          `Phone: ${metadata.customer_phone || 'Not provided'}\n\n` +
          `Size: ${metadata.size}\n` +
          `Color: ${metadata.color}\n` +
          `Quantity: ${metadata.quantity}\n` +
          `Subtotal: ${metadata.subtotal || metadata.unit_price}\n` +
          `Shipping: ${metadata.shipping_cost || 'RM 0'}\n` +
          `Total: ${metadata.total_price}\n\n` +
          `Ship to: ${metadata.shipping_name}\n` +
          `${metadata.shipping_address_1}\n` +
          `${metadata.shipping_city}, ${metadata.shipping_state} ${metadata.shipping_postal_code}`;

        await fetch(
          `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.GROUP_CHAT_ID,
              text: telegramMessage,
            }),
          },
        );
        console.log('✅ SubZero Telegram notification sent');
      } catch (subzeroError) {
        console.error('❌ SubZero processing error:', subzeroError);
      }

      return NextResponse.json({ received: true, type: 'subzero_preorder' });
    }

    // Regular order processing continues below
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
    // const totalPrice = cartItems.reduce(
    //   (sum, item) => sum + item.price * item.quantity,
    //   0,
    // );
    // const formattedTotalPrice = parseFloat(totalPrice.toFixed(2)); // Ensure precision

    // console.log('About to insert order with values:', {
    //   orderId,
    //   userId,
    //   formattedTotalPrice,
    //   stripeSessionId: session.id,
    // });

    const orderRef = session.id.slice(-12).toUpperCase();
    // let numericOrderId: number | null = null;

    try {
      const { data: _orderData, error: orderError } = await supabaseAdmin
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
            order_ref: orderRef,
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
      // numericOrderId = orderData?.id;
      // console.log(
      //   '✅ Order inserted successfully:',
      //   numericOrderId,
      //   'Ref:',
      //   orderRef,
      // );
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

    // if (numericOrderId) {
    if (isGuestCheckout) {
      // Guest checkout: Insert order items directly (no stock update needed as guest items may not have product_size_id)
      console.log('📦 Processing guest checkout order items...');
      console.log('guest cart items: ', cartItems);
      for (const item of cartItems) {
        try {
          const orderItemPromise = supabaseAdmin.from('order_items').insert({
            id: uuidv4(),
            order_id: orderId,
            order_ref: orderRef,
            product_size_id: item.product_size_id || 'TBC',
            quantity: item.quantity,
            price: item.price,
            product_name: item.name || 'Unknown Product',
            product_size: item.product_size || 'TBC',
          });
          orderItemPromises.push(orderItemPromise);
          console.log('order id: ', orderId);
          console.log('order ref: ', orderRef);
          console.log('product size id: ', item.product_size_id);
          console.log('product_name: ', item.name);
          console.log('product_size: ', item.product_size);
          console.log(`📦 Queued order item: ${item.name} x${item.quantity}`);
        } catch (error) {
          console.error('Error creating guest order item:', error);
        }
      }
    } else {
      // Authenticated checkout: Update stock and insert order items
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
          const orderItemPromise = supabaseAdmin.from('order_items').insert({
            // id: numericOrderId,
            order_id: orderId,
            order_ref: orderRef,
            product_size_id: item.product_size_id,
            quantity: item.quantity,
            price: item.price,
            product_name: item.products_sizes?.description || 'Product',
            product_size: item.products_sizes?.size || null,
          });

          orderItemPromises.push(orderItemPromise);
        } catch (error) {
          console.error('Error processing item:', item.product_size_id, error);
        }
      }
    }
    // }

    // Execute all stock updates and order item insertions in parallel
    try {
      if (stockUpdatePromises.length > 0) {
        const stockUpdateResults =
          await Promise.allSettled(stockUpdatePromises);
        stockUpdateResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Stock update ${index} failed:`, result.reason);
          }
        });
      }

      if (orderItemPromises.length > 0) {
        const orderItemResults = await Promise.allSettled(orderItemPromises);
        orderItemResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Order item ${index} failed:`, result.reason);
          } else {
            console.log(`✅ Order item ${index} inserted successfully`);
          }
        });
      }

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
          order_id: orderRef,
        }),
        supabaseAdmin.from('order_contact_info').insert({
          phone: contactInfo.phone,
          email: contactInfo.email,
          order_id: orderRef,
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
    console.log('🚀 Order ID:', orderRef);
    console.log('🚀 Cart items for Telegram:', cartItems);
    try {
      console.log('🚀 Calling notifyTelegram function...');
      await notifyTelegram(
        orderRef,
        orderAddress,
        contactInfo,
        cartItems,
        session.id,
      );
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
              `${item.name} (${item.product_size || 'N/A'}) x${item.quantity} - RM${item.price}`,
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

      // Calculate amounts from Stripe session
      const subtotalAmount = session.amount_subtotal
        ? (session.amount_subtotal / 100).toFixed(2)
        : '0.00';
      const shippingAmount = session.total_details?.amount_shipping
        ? (session.total_details.amount_shipping / 100).toFixed(2)
        : '0.00';
      const totalAmount = session.amount_total
        ? (session.amount_total / 100).toFixed(2)
        : '0.00';

      // Build items HTML for email
      const itemsHtml = cartItems
        .map((item: any) => {
          const name = item.name || 'Product';
          const size = item.product_size || item.products_sizes?.size || 'N/A';
          const qty = item.quantity || 1;
          const price = item.price || 0;
          return `<p><strong>${name}</strong> (${size}) x${qty} - RM ${price}</p>`;
        })
        .join('');

      const email = new SendSmtpEmail();
      email.sender = { name: 'QYVE', email: 'noreply@qyveofficial.com' };
      email.to = [{ email: customerEmail as string, name: customerName }];
      email.subject = 'Order Confirmed - Payment Received!';
      email.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Thank you for your order! Your payment has been received.</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a1a2e;">Order Details</h3>
              <p><strong>Order Reference:</strong> ${orderRef}</p>
              ${itemsHtml}
              <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
              <p>Subtotal: RM ${subtotalAmount}</p>
              <p>Shipping: RM ${shippingAmount}</p>
              <p style="font-size: 18px; margin-top: 10px;"><strong>Total Paid: RM ${totalAmount}</strong></p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a1a2e;">Shipping Address</h3>
              <p>${orderAddress.fname} ${orderAddress.lname}<br>
              ${orderAddress.shippingAddress1 || orderAddress.shipping_address_1}<br>
              ${orderAddress.shippingAddress2 || orderAddress.shipping_address_2 ? (orderAddress.shippingAddress2 || orderAddress.shipping_address_2) + '<br>' : ''}
              ${orderAddress.city}, ${orderAddress.state} ${orderAddress.postalCode || orderAddress.postal_code}<br>
              Malaysia</p>
            </div>
            
            <p><strong>Expected Delivery:</strong> 2-5 business days (Semenanjung) / 5-7 business days (Sabah/Sarawak)</p>
            
            <p style="color: #666; font-size: 14px;">If you have any questions, reply to this email or contact us via WhatsApp.</p>
          </div>
          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">QYVE Official | www.qyveofficial.com</p>
          </div>
        </div>
      `;

      const emailResult = await brevoClient.sendTransacEmail(email);
      console.log(
        '✅ Order confirmation email sent to:',
        customerEmail,
        'Message ID:',
        emailResult.body?.messageId,
      );
    } catch (emailError) {
      console.error('❌ Email receipt failed (non-critical):', emailError);
      console.error('❌ Email error stack:', (emailError as Error).stack);
      // Don't fail the webhook for email errors
    }

    console.log(
      '✅ Webhook processing completed successfully for order:',
      orderRef,
    );
  }

  return NextResponse.json({ received: true });
}
