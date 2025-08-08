// lib/telegram.ts (or utils/telegram.ts)
// import { supabase } from './supabaseClient';
import { createClient } from '@supabase/supabase-js';

export async function notifyTelegram(
  orderId: string,
  orderAddress: any,
  contactInfo: any,
) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
  console.log('calling notifyTelegram');

  const { data } = await supabaseAdmin
    .from('order_items')
    .select('quantity, products_sizes(description)')
    .eq('order_id', orderId);
  const itemsText =
    data
      ?.map((item) => {
        const itemDescription = Array.isArray(item.products_sizes)
          ? item.products_sizes[0]
          : (item.products_sizes as { description: string });

        const finalDescription =
          itemDescription?.description ?? 'Check Supabase';

        return `${finalDescription} x ${item.quantity}`;
      })
      .join('\n') || '';

  console.log('itemtext: ', itemsText);

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
          `Shipping Address:\n${orderAddress.shipping_address_1}, ${orderAddress.city}, ${orderAddress.state}, ${orderAddress.postal_code}\n\n` +
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
