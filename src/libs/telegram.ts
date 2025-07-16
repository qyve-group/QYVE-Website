// lib/telegram.ts (or utils/telegram.ts)

export async function notifyTelegram(
  orderId: string,
  orderAddress: any,
  contactInfo: any,
) {
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
          `Shipping Address:\n${orderAddress.shipping_address_1}, ${orderAddress.city}, ${orderAddress.state}, ${orderAddress.postal_code}`,
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
