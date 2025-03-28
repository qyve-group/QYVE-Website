import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {

  try {
    const { userId, cartItems } = await req.json(); // Get items from the request
    
  if (!userId) {
    throw new Error("User ID is missing before creating Stripe session");
  }

  console.log("userId in checkout route.ts: ", userId);

    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "myr",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    console.log("Line items: ", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: { user_id: userId?.id ?? "unknown user"},
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }



}


























// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import Stripe from "stripe";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16",
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { orderId } = await req.json();

//     if (!orderId)
//       return NextResponse.json(
//         { error: "Order ID is required" },
//         { status: 400 }
//       );

//     // Fetch order details
//     const { data: order, error } = await supabase
//       .from("orders")
//       .select()
//       .eq("id", orderId)
//       .single();
//     if (error || !order)
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });

//     // Create Stripe Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: `Order #${order.id}` },
//             unit_amount: order.total_price * 100, // Convert to cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${order.id}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-failed`,
//       metadata: { orderId: order.id },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
