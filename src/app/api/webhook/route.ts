import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/libs/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing Stripe Signature" }, { status: 400 });

  let event;
  try {
    const rawBody = await req.text(); // Get raw body for verification
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id || "";
    console.log("userid: ", userId);

    if (!userId) {
      console.error("User ID missing in metadata");
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // Fetch cart_id from cart table using user_id
    const {data: cartInfo, error: cartInfoError} = await supabase.from("carts").select("id").eq("user_id", userId).single();

    if (cartInfoError || !cartInfo){
      console.error("Active cart not found for user:", cartInfoError);
      return NextResponse.json({ error: "Active cart not found" }, { status: 404 });
    }

    const cartId = cartInfo.id;
    console.log("cartid: ", cartId);


    // Fetch cart items using cart_id
    const { data: cartItems, error: cartItemsError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId);

    if (cartItemsError || !cartItems.length) {
      console.error("Cart items not found:", cartItemsError);
      return NextResponse.json({ error: "Cart items not found" }, { status: 404 });
    }

    // Create an order linked to cart_id
    const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ id: session.id, user_id: userId, status: "paid", total: session.amount_total! / 100 }])
    .select()
    .single();

    if (orderError) {
      console.error("Failed to create order:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    console.log("order created: ", order);

    // Reduce stock in `product_sizes`
    for (const item of cartItems) {
      await supabase
        .from("product_sizes")
        .update({ stock: item.stock - item.quantity })
        .eq("product_id", item.product_id)
        .eq("size", item.size);
    }

    // // Mark cart as completed
    // await supabase.from("carts").update({ status: "completed" }).eq("id", cartId);

    // Clear the cart after payment
    await supabase.from("cart_items").delete().eq("cart_id", cartId);

    console.log("✅ Payment Successful:", session);
    // TODO: Store order details in Supabase

    // const orderId = session.metadata?.orderId;

    // if (orderId){
    //   const {data, error} = await supabase.from("orders").update({status: "paid"}).eq("id", orderId);

    //   if (error) {
    //     console.error("Error updating order:", error);
    //     return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    //   }
    // }
    
  }

  return NextResponse.json({ received: true });
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
//   const sig = req.headers.get("stripe-signature");

//   let event;
//   try {
//     const rawBody = await req.text(); // Read the raw body for signature verification
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       sig!,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: `Webhook Error: ${err.message}` },
//       { status: 400 }
//     );
//   }

//   // Handle checkout completion
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const orderId = session.metadata?.orderId;

//     if (orderId) {
//       await supabase
//         .from("orders")
//         .update({ status: "paid" })
//         .eq("id", orderId);
//     }
//   }

//   return NextResponse.json({ received: true });
// }
