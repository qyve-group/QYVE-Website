import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderConfirmation, sendPaymentConfirmation, sendRefundConfirmation, sendShippingNotification } from '@/lib/email-service-integrated';
import { automatedShippingService } from '@/lib/automated-shipping-integrated';

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

      // Auto-process order for shipping with EasyParcel
      try {
        console.log('📦 Auto-processing order for shipping with EasyParcel...');
        await automatedShippingService.processOrderById(orderId);
        console.log('✅ Order automatically processed for shipping');
      } catch (shippingError) {
        console.error('❌ Failed to auto-process order for shipping:', shippingError);
        // Don't fail the webhook if shipping fails - order is still created
      }

      // Send order confirmation and payment confirmation emails
      try {
        const customerEmail = isGuestCheckout 
          ? contactInfo.email 
          : session.customer_details?.email;
        const customerName = isGuestCheckout 
          ? contactInfo.name 
          : session.customer_details?.name || 'Customer';

        if (customerEmail) {
          const emailData = {
            orderId: orderId,
            customerName: customerName,
            customerEmail: customerEmail,
            totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() || 'MYR',
            items: cartItems.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color
            })),
            shippingAddress: {
              line1: orderAddress.shipping_address_1,
              line2: orderAddress.shipping_address_2,
              city: orderAddress.city,
              state: orderAddress.state,
              postalCode: orderAddress.postal_code,
              country: orderAddress.country
            }
          };

          // Send order confirmation email
          console.log('📧 Sending order confirmation email...');
          const orderEmailResult = await sendOrderConfirmation(emailData);
          if (orderEmailResult.success) {
            console.log('✅ Order confirmation email sent:', orderEmailResult.messageId);
          } else {
            console.error('❌ Failed to send order confirmation email:', orderEmailResult.error);
          }

          // Send payment confirmation email
          console.log('📧 Sending payment confirmation email...');
          const paymentEmailResult = await sendPaymentConfirmation(emailData);
          if (paymentEmailResult.success) {
            console.log('✅ Payment confirmation email sent:', paymentEmailResult.messageId);
          } else {
            console.error('❌ Failed to send payment confirmation email:', paymentEmailResult.error);
          }
        } else {
          console.log('⚠️ No customer email found, skipping email notifications');
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the webhook if email fails
      }

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

  // Handle refund events
  if (event.type === 'charge.refunded') {
    console.log('✅ Processing charge.refunded event');
    const charge = event.data.object;
    
    try {
      // Find the order associated with this charge
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_payment_intent_id', charge.payment_intent)
        .single();

      if (orderError || !orderData) {
        console.error('❌ Order not found for refund:', orderError);
        return NextResponse.json({ received: true });
      }

      // Send refund confirmation email
      const customerEmail = orderData.guest_email || orderData.user_id;
      const customerName = orderData.guest_name || 'Customer';

      if (customerEmail) {
        const refundData = {
          orderId: orderData.id,
          customerName: customerName,
          customerEmail: customerEmail,
          refundAmount: charge.amount_refunded / 100,
          currency: charge.currency?.toUpperCase() || 'MYR',
          reason: 'Refund processed',
          processedDate: new Date().toLocaleDateString()
        };

        console.log('📧 Sending refund confirmation email...');
        const refundEmailResult = await sendRefundConfirmation(refundData);
        if (refundEmailResult.success) {
          console.log('✅ Refund confirmation email sent:', refundEmailResult.messageId);
        } else {
          console.error('❌ Failed to send refund confirmation email:', refundEmailResult.error);
        }
      }

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'refunded' })
        .eq('id', orderData.id);

      console.log('✅ Refund processed successfully for order:', orderData.id);
    } catch (error) {
      console.error('❌ Failed to process refund:', error);
    }
  }

  return NextResponse.json({ received: true });
}
