// lib/telegram.ts (or utils/telegram.ts)
// import { supabase } from './supabaseClient';
// import { createClient } from '@supabase/supabase-js';

export async function notifyTelegram(
  orderId: string,
  orderAddress: any,
  contactInfo: any,
  cartItems?: any[],
  sessionId?: string,
) {
  console.log('calling notifyTelegram with items:', cartItems);
  console.log('Items count:', cartItems?.length);
  console.log('First item structure:', cartItems?.[0]);

  let itemsText = '';

  if (cartItems && cartItems.length > 0) {
    console.log('🔍 Processing cart items for Telegram:');
    cartItems.forEach((item, index) => {
      console.log(`🔍 Item ${index} raw:`, item);
    });

    itemsText = cartItems
      .map((item, index) => {
        // Handle both guest checkout (simple structure) and authenticated (database structure)
        let name;
        let size;
        let quantity;

        if (item.products_sizes && item.products_sizes.description) {
          // Authenticated user cart items (from database)
          name = item.products_sizes.description;
          size = item.products_sizes.size || 'Free Size';
          quantity = item.quantity || 1;
        } else {
          // Guest checkout cart items (from Redux/metadata)
          name =
            item.description || item.name || `Product ${item.id || index + 1}`;
          size = item.product_size || item.size || 'Free Size';
          quantity = item.quantity || 1;
        }

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

  // Generate order reference from session ID (last 12 chars) or fallback to orderId
  const orderRef = sessionId ? sessionId.slice(-12).toUpperCase() : orderId.slice(0, 12).toUpperCase();
  
  // Calculate total from cart items
  const total = cartItems?.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) || 0;

  const res = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.GROUP_CHAT_ID,
        text:
          `📦 NEW ORDER PAID!\n\n` +
          `Order Ref: ${orderRef}\n` +
          `Customer: ${orderAddress.fname} ${orderAddress.lname}\n` +
          `Email: ${contactInfo.email}\n` +
          `Phone: ${contactInfo.phone}\n\n` +
          `Items:\n${itemsText}\n\n` +
          `Total: RM ${total}\n\n` +
          `Ship to:\n${orderAddress.shippingAddress1 || orderAddress.shipping_address_1}\n` +
          `${orderAddress.city}, ${orderAddress.state} ${orderAddress.postalCode || orderAddress.postal_code}`,
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
