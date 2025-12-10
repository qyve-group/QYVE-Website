import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      size,
      color,
      quantity,
      unitPrice,
      totalPrice,
      shippingAddress,
    } = body;

    if (!customerEmail || !customerName || !size) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and size are required' },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.REPLIT_DEV_DOMAIN}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'fpx'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'myr',
            product_data: {
              name: 'SubZero Futsal Shoes (Early Bird)',
              description: `Size: ${size} | Color: ${color}`,
              images: ['https://qyveofficial.com/assets/images/subzero/subzero-white-side.png'],
            },
            unit_amount: Math.round(unitPrice * 100),
          },
          quantity: quantity,
        },
      ],
      metadata: {
        product_type: 'subzero_preorder',
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || 'Not provided',
        size: size,
        color: color,
        quantity: String(quantity),
        unit_price: `RM ${unitPrice}`,
        total_price: `RM ${totalPrice}`,
        shipping_name: `${shippingAddress.fname} ${shippingAddress.lname}`,
        shipping_address_1: shippingAddress.address_1,
        shipping_address_2: shippingAddress.address_2 || '',
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_postal_code: shippingAddress.postal_code,
        shipping_country: shippingAddress.country || 'Malaysia',
        order_id: `SUBZERO_${Date.now()}`,
      },
      success_url: `${baseUrl}/campaigns/subzero/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/campaigns/subzero?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('SubZero checkout error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
