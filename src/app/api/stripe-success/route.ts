import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil', // ✅ required for proper types
});
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Step 2: Access the PaymentIntent ID from the session
    const paymentIntentId = session.payment_intent as string;

    // Step 3: Retrieve the PaymentIntent using that ID
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ['latest_charge.payment_method_details'], // expand if needed
      },
    );

    const charge = paymentIntent.latest_charge as Stripe.Charge;

    if (!charge) {
      return NextResponse.json({ error: 'No charge found' }, { status: 404 });
    }

    return NextResponse.json({
      transactionDateTime: new Date(charge.created * 1000).toLocaleString(),
      amount: (charge.amount / 100).toFixed(2),
      sellerOrderNo: charge.statement_descriptor || 'N/A',
      fpxTransactionId:
        charge.payment_method_details?.fpx?.transaction_id || 'N/A',
      buyerBank: charge.payment_method_details?.fpx?.bank || 'N/A',
      status: charge.status,
    });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json(
      { error: 'Failed to retrieve payment' },
      { status: 500 },
    );
  }
}
