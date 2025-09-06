import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// type ContactInfoData = {
//   phone: string;
//   email: string;
// };

// type ShippingAddressData = {
//   fname: string;
//   lname: string;
//   shipping_address_1: string;
//   shipping_address_2: string;
//   city: string;
//   state: string;
//   postal_code: string;
// };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Handle preflight CORS requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://www.qyveofficial.com', // Or set to your domain
      'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received body', body);
    const {
      userId,
      cartItems,
      orderAddress,
      orderContact,
      shippingPrice,
      // discountValue,
      discountCode,
    } = body; // Get items from the request

    // Allow guest checkout - userId can be null for guest users
    const isGuestCheckout = !userId || userId === 'guest';
    
    if (isGuestCheckout) {
      console.log('Processing guest checkout');
    } else {
      console.log('Processing authenticated user checkout for userId:', userId);
    }

    // const productSubtotal = cartItems.reduce(
    //   (acc: number, item: any) => acc + item.price * item.quantity,
    //   0,
    // );

    // console.log('userId in checkout route.ts: ', userId);
    // const discountRate = discountValue / 100;
    // const discountAmount = productSubtotal * discountRate;
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'myr',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // const lineItems = [
    //   ...cartItems.map((item: any) => ({
    //     price_data: {
    //       currency: 'myr',
    //       product_data: {
    //         name: item.name,
    //         images: [item.image],
    //       },
    //       unit_amount: Math.round(item.price * 100), // Convert to cents
    //     },
    //     quantity: item.quantity,
    //   })),
    //   {
    //     price_data: {
    //       currency: 'myr',
    //       product_data: {
    //         name: 'Shipping Fee',
    //       },
    //       unit_amount: Math.round(shippingPrice * 100),
    //     },
    //     quantity: 1,
    //   },
    // ];

    // 2. Add shipping as a separate line item
    // {
    //   price_data: {
    //     currency: 'myr',
    //     product_data: {
    //       name: 'Shipping Fee',
    //     },
    //     unit_amount: Math.round(shippingPrice * 100),
    //   },
    //   quantity: 1,
    // },

    // 3. Add discount as a negative amount (optional)
    // ...(discountValue > 0
    //   ? [
    //       {
    //         price_data: {
    //           currency: 'myr',
    //           product_data: {
    //             name: 'Discount',
    //           },
    //           unit_amount: Math.round(-discountAmount * 100), // Negative to reduce total
    //         },
    //         quantity: 1,
    //       },
    //     ]
    //   : []),

    // Step 2: Look up the promotion code (if provided)
    // Step 2: Look up the promotion code (only if provided)
    const discounts = [];

    if (discountCode && discountCode.trim() !== '') {
      try {
        const promoCodes = await stripe.promotionCodes.list({
          active: true,
          code: discountCode.trim(),
        });

        console.log('discountCode entered:', discountCode);
        console.log('promo codes from Stripe:', promoCodes);

        const matchedCode = promoCodes.data[0];

        if (matchedCode) {
          discounts.push({ promotion_code: matchedCode.id });
          console.log('Applied discounts:', discounts);
        } else {
          return NextResponse.json(
            { error: 'Invalid promo code' },
            { status: 400 },
          );
        }
      } catch (err) {
        console.error('Error checking promo code:', err);
        return NextResponse.json(
          { error: 'Could not validate promo code' },
          { status: 500 },
        );
      }
    }

    // const discounts = [];
    // if (discountCode) {
    //   const promoCodes = await stripe.promotionCodes.list({
    //     active: true,
    //     code: discountCode,
    //   });

    //   console.log('discountCode entered: ', discountCode);
    //   console.log('promo codes: ', promoCodes);

    //   const matchedCode = promoCodes.data[0];
    //   if (matchedCode) {
    //     discounts.push({ promotion_code: matchedCode.id });
    //     console.log('discounts array: ', discounts);
    //   } else {
    //     return NextResponse.json(
    //       { error: 'Invalid promo code' },
    //       {
    //         status: 400,
    //         headers: {
    //           'Access-Control-Allow-Origin': 'https://www.qyveofficial.com',
    //           // 'Access-Control-Allow-Headers': 'Content-Type',
    //           // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
    //         },
    //       },
    //     );
    //   }
    // }

    const shippingOptions = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: shippingPrice * 100, // already from frontend
            currency: 'myr',
          },
          display_name: 'Shipping',
        },
      },
    ];

    // console.log('Line items: ', lineItems);
    console.log('Creating Stripe session with:', {
      lineItems,
      // discounts,
      email: orderContact.email,
      shippingPrice,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'fpx'],
      mode: 'payment',
      line_items: lineItems,
      discounts,
      // success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
      success_url: `https://${process.env.REPLIT_DEV_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: orderContact.email,
      cancel_url: `https://${process.env.REPLIT_DEV_DOMAIN}/failed`,
      shipping_options: shippingOptions,
      metadata: {
        user_id: userId ?? 'guest',
        order_address: JSON.stringify(orderAddress),
        order_contact: JSON.stringify(orderContact),
        is_guest_checkout: isGuestCheckout ? 'true' : 'false',
        customer_email: orderContact.email,
        customer_name: `${orderAddress.fname} ${orderAddress.lname}`,
        order_items: cartItems.map((item: any) => `${item.name} (${item.product_size}) x${item.quantity}`).join(', '),
        order_id: `ORDER_${Date.now()}`,
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://www.qyveofficial.com',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://www.qyveofficial.com',
        },
      },
    );
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
