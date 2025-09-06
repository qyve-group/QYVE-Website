import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendPaymentConfirmationEmail } from '@/lib/email';

// Use test keys in Replit (development), production keys in GitHub/Vercel
const isReplit = !!process.env.REPLIT_DEV_DOMAIN;
const stripeSecretKey = isReplit 
  ? process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = isReplit 
  ? process.env.STRIPE_TEST_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET
  : process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('Webhook received:', event.type);

    // Handle the payment succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log('Payment succeeded:', paymentIntent.id);
      console.log('Payment metadata:', paymentIntent.metadata);
      
      // Get customer email from metadata or receipt_email
      const customerEmail = paymentIntent.metadata?.customer_email || 
                          paymentIntent.receipt_email;
      
      const customerName = paymentIntent.metadata?.customer_name || 'Valued Customer';
      const orderItems = paymentIntent.metadata?.order_items || 'Your order';

      if (customerEmail) {
        await sendPaymentConfirmationEmail({
          email: customerEmail,
          customerName: customerName,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
          orderItems: orderItems,
          orderId: paymentIntent.metadata?.order_id || paymentIntent.id,
        });
        
        console.log('Confirmation email sent to:', customerEmail);
      } else {
        console.warn('No customer email found for payment:', paymentIntent.id);
      }
    }

    // Handle checkout session completed (if using Checkout)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Checkout completed:', session.id);
      
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name || 'Valued Customer';
      
      if (customerEmail) {
        await sendPaymentConfirmationEmail({
          email: customerEmail,
          customerName: customerName,
          amount: session.amount_total!,
          currency: session.currency!,
          sessionId: session.id,
          orderItems: session.metadata?.order_items || 'Your order',
          orderId: session.metadata?.order_id || session.id,
        });
        
        console.log('Checkout confirmation email sent to:', customerEmail);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}