import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-08-01', // or your current version
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    // 1. Get the Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Get the PaymentIntent (charges will be expanded)
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      {
        expand: ['charges.data.payment_method_details'],
      },
    );

    // 3. Get the Charge
    const charge = paymentIntent.charges?.data?.[0];

    if (!charge) {
      return NextResponse.json({ error: 'No charge found' }, { status: 404 });
    }

    // 4. Build FPX Confirmation Data
    const result = {
      transactionDateTime: new Date(charge.created * 1000).toLocaleString(),
      amount: (charge.amount / 100).toFixed(2),
      sellerOrderNo: charge.statement_descriptor,
      fpxTransactionId: charge.payment_method_details?.fpx?.transaction_id,
      buyerBank: charge.payment_method_details?.fpx?.bank,
      status: charge.status,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Stripe Success API Error:', err.message);
    return NextResponse.json(
      { error: 'Failed to retrieve payment info' },
      { status: 500 },
    );
  }
}
