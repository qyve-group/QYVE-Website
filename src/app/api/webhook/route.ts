import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/libs/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid"; // Import UUID library


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  console.log("Webhook called");
  
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing Stripe Signature");
    return NextResponse.json({ error: "Missing Stripe Signature" }, { status: 400 });
  }


  let event;
  try {
    // const rawBody = await req.text(); // Get raw body for verification
    // const rawBody = await req.arrayBuffer();
    // const rawBodyString = Buffer.from(rawBody).toString("utf8"); // Convert to string for Stripe verification
    // ✅ Manually get raw body
    const bodyBuffer = await req.arrayBuffer();
    const rawBody = Buffer.from(bodyBuffer);
    console.log("📩 Raw body received:", rawBody);

    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    // event = stripe.webhooks.constructEvent(rawBodyString, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log("✅ Event parsed:", event);
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
  }
  console.log("✅ Webhook received:", event);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = "1c2e85d0-410f-4019-88f3-c380ec3abc24";
    // const userId = session.metadata?.user_id || "";
    console.log("✅ Checkout Session Object:", session);
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

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
    // Fetch cart items using cart_id
    const { data: cartItems, error: cartItemsError } = await supabaseAdmin
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId);

    if (cartItemsError || !cartItems.length) {
      console.error("Cart items not found:", cartItemsError);
      return NextResponse.json({ error: "Cart items not found" }, { status: 404 });
    }

    // Create an order linked to cart_id
    const orderId = uuidv4(); // Generate a new UUID
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formattedTotalPrice = parseFloat(totalPrice.toFixed(2)); // Ensure precision
    console.log("Total Price Calculated:", formattedTotalPrice);


    const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{ id: orderId, user_id: userId, status: "paid", total_price: formattedTotalPrice, stripe_session_id: session.id}])
    .select()
    .single();

    if (orderError) {
      console.error("Failed to create order:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    console.log("order created: ", order);

    // Reduce stock in `product_sizes`
    for (const item of cartItems) {
      console.log("Fetching current stock for item:", item);

      // Fetch the current stock from the database
      const { data: productSize, error: fetchError } = await supabase
        .from("products_sizes")
        .select("stock")
        .eq("product_id", item.product_id)
        .eq("id", item.size_id)
        .single();

      if (fetchError) {
        console.error("Error fetching stock:", fetchError);
        continue; // Skip to the next item if there's an error
      }

      // Ensure stock exists before updating
      if (!productSize || productSize.stock === undefined) {
        console.error("Stock not found for item:", item);
        continue;
      }

      // Calculate new stock
      const newStock = productSize.stock - item.quantity;
      console.log("newStock: ", newStock);

      console.log("Updating stock for item:", item);
    
      const { error: stockError } = await supabaseAdmin
        .from("products_sizes")
        .update({ stock: newStock })
        .eq("product_id", item.product_id)
        .eq("id", item.size_id);
    
      if (stockError) {
        console.error("Error updating stock for product:", item.product_id, stockError);
      } else {
        console.log(`✅ Stock updated for product ${item.product_id}, size_id ${item.size_id}`);
      }
    }
    
    // Mark cart as completed
    // console.log("Marking cart as completed...");
    // const { error: cartError } = await supabase
    //   .from("carts")
    //   .update({ status: "completed" })
    //   .eq("id", cartId);
    
    // if (cartError) {
    //   console.error("❌ Error marking cart as completed:", cartError);
    // } else {
    //   console.log(`✅ Cart ${cartId} marked as completed`);
    // }
    
    // Clear the cart after payment
    console.log("Clearing cart items for cart ID:", cartId);
    const { error: clearCartError } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);
    
    if (clearCartError) {
      console.error("❌ Error clearing cart items:", clearCartError);
    } else {
      console.log(`✅ Cart items cleared for cart ID: ${cartId}`);
    }

    // for (const item of cartItems) {
    //   console.log("item: ", item);
    //   await supabase
    //     .from("product_sizes")
    //     .update({ stock: item.stock - item.quantity })
    //     .eq("product_id", item.product_id)
    //     .eq("size", item.size);
    // }

    // // // Mark cart as completed
    // // await supabase.from("carts").update({ status: "completed" }).eq("id", cartId);

    // // Clear the cart after payment
    // await supabase.from("cart_items").delete().eq("cart_id", cartId);

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
