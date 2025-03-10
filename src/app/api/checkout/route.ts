import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId)
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );

    // Fetch order details
    const { data: order, error } = await supabase
      .from("orders")
      .select()
      .eq("id", orderId)
      .single();
    if (error || !order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Order #${order.id}` },
            unit_amount: order.total_price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-failed`,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
