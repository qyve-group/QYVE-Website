// lib/telegram.ts (or utils/telegram.ts)
// import { supabase } from './supabaseClient';
// import { createClient } from '@supabase/supabase-js';

export async function notifyTelegram(
  orderId: string,
  orderAddress: any,
  contactInfo: any,
  cartItems?: any[],
) {
  console.log('calling notifyTelegram with items:', cartItems);
  console.log('Items count:', cartItems?.length);
  console.log('First item structure:', cartItems?.[0]);

  let itemsText = '';

  if (cartItems && cartItems.length > 0) {
    // Use cart items directly (for guest checkout)
    console.log('🔍 Processing cart items for Telegram:');
    cartItems.forEach((item, index) => {
      console.log(`🔍 Item ${index}:`, {
        name: item.remarks,
        product_size: item.product_size_id,
        quantity: item.quantity,
        id: item.id,
        price: item.price,
      });
    });

    itemsText = cartItems
      .map((item, index) => {
        const size = item.products_sizes.size;
        const name = item.remarks;
        const quantity = item.quantity || 1;
        console.log(
          `🔍 Formatted item ${index}: "${name} (${size}) x ${quantity}"`,
        );
        return `${name} (${size}) x ${quantity}`;
      })
      .join('\n');
  }

  // else {
  //   // Fallback to database lookup (for authenticated users)
  //   const supabaseAdmin = createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  //     process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  //   );

  //   const { data } = await supabaseAdmin
  //     .from('order_items')
  //     .select('quantity, products_sizes(description)')
  //     .eq('order_id', orderId);

  //   itemsText = data
  //     ?.map((item) => {
  //       const itemDescription = Array.isArray(item.products_sizes)
  //         ? item.products_sizes[0]
  //         : (item.products_sizes as { description: string });

  //       const finalDescription =
  //         itemDescription?.description ?? 'Check Supabase';

  //       return `${finalDescription} x ${item.quantity}`;
  //     })
  //     .join('\n') || '';
  // }

  // console.log('itemtext: ', itemsText);

  // const itemDescription= Array.isArray(item.product_sizes)
  //       ? item.product_sizes[0]
  //       : (item.product_sizes as { description: string });
  //     const finalDescription = itemDescription?.description ?? 'Check Supabase';

  const res = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.GROUP_CHAT_ID,
        text:
          `📦 New Paid Order\n\nOrder ID: ${orderId}\nCustomer: ${orderAddress.fname} ${orderAddress.lname}\n` +
          `Email: ${contactInfo.email}\nPhone: ${contactInfo.phone}\n\n` +
          `Shipping Address:\n${orderAddress.shippingAddress1 || orderAddress.shipping_address_1}, ${orderAddress.city}, ${orderAddress.state}, ${orderAddress.postalCode || orderAddress.postal_code}\n\n` +
          `Items:\n${itemsText}`,
      }),
    },
  );

  const json = await res.json();
  if (!res.ok) {
    console.error('❌ Telegram Error:', json);
  } else {
    console.log('✅ Message sent to Telegram:', json);
  }
}
