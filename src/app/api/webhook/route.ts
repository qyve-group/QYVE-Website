import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

export async function POST(req: Request) {
  console.log('🚨 WEBHOOK CALLED AT:', new Date().toISOString());
  console.log('🚨 Webhook URL:', req.url);
  console.log('🚨 Webhook method:', req.method);

  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('❌ No Stripe signature found');
    return NextResponse.json(
      { error: 'No Stripe signature found' },
      { status: 400 },
    );
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    console.log('✅ Webhook signature verified successfully');
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.log('⚠️ Attempting to parse webhook body directly...');

    try {
      event = JSON.parse(rawBody);
      console.log('✅ Webhook body parsed successfully (unverified)');
    } catch (parseErr) {
      console.error('❌ Failed to parse webhook body:', parseErr);
      return NextResponse.json(
        { error: 'Invalid webhook body' },
        { status: 400 },
      );
    }
  }

  console.log('✅ Webhook received:', event.type);

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
      console.error('❌ Failed to parse order metadata:', parseError);
      return NextResponse.json(
        { error: 'Invalid order metadata' },
        { status: 400 },
      );
    }

    const cartItems = session.metadata?.cart_items
      ? JSON.parse(session.metadata.cart_items)
      : [];

    console.log('📦 Cart items:', cartItems.length);
    console.log('🏠 Order address:', orderAddress);
    console.log('📞 Contact info:', contactInfo);

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: isGuestCheckout ? null : userId,
          guest_email: isGuestCheckout ? contactInfo.email : null,
          guest_name: isGuestCheckout ? contactInfo.name : null,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent,
          total_amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'myr',
          status: 'paid',
          shipping_address_1: orderAddress.shipping_address_1,
          shipping_address_2: orderAddress.shipping_address_2,
          city: orderAddress.city,
          state: orderAddress.state,
          postal_code: orderAddress.postal_code,
          country: orderAddress.country,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ Failed to create order:', orderError);
        throw orderError;
      }

      console.log('✅ Order created successfully:', orderData.id);

      for (const item of cartItems) {
        /* eslint-disable-next-line no-await-in-loop */
        const { error: orderItemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderId,
            product_size_id: item.id,
            quantity: item.quantity,
            price: item.price,
          });

        if (orderItemError) {
          console.error('❌ Failed to create order item:', orderItemError);
          throw orderItemError;
        }
      }

      console.log('✅ Order items created successfully');

      console.log(
        '✅ Webhook processing completed successfully for order:',
        orderId,
      );
    } catch (error) {
      console.error('❌ Failed to process order:', error);
      return NextResponse.json(
        { error: 'Failed to process order' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
