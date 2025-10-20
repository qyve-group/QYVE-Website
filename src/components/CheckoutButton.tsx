'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import type { CartItem } from '@/store/cartSlice';
import type { RootState } from '@/store/store';

type ContactInfoData = {
  phone: string;
  email: string;
};

type ShippingAddressData = {
  fname: string;
  lname: string;
  shipping_address_1: string;
  shipping_address_2: string;
  no: string;
  city: string;
  state: string;
  postal_code: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

export default function CheckoutButton({
  cartItems,
  orderAddress,
  orderContact,
  shippingPrice,
  discountCode,
}: {
  cartItems: CartItem[];
  orderAddress: ShippingAddressData;
  orderContact: ContactInfoData;
  shippingPrice: number;
  discountCode: string;
}) {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.log(
        'No logged in user id, redirecting to login checkoutbutton.tsx',
      );
      router.push('/login?redirect=checkout');
    }
  }, [userId, router]);

  const hasEmptyAddress = Object.values(orderAddress).some(
    (val) => val === null || val === '' || val === undefined,
  );

  const hasEmptyContact = Object.values(orderContact).some(
    (val) => val === null || val === '' || val === undefined,
  );

  const handleCheckout = async () => {
    console.log('=== CHECKOUT DEBUG ===');
    console.log('User ID:', userId);
    console.log('Has Empty Address:', hasEmptyAddress);
    console.log('Has Empty Contact:', hasEmptyContact);
    console.log('Order Address:', orderAddress);
    console.log('Order Contact:', orderContact);
    setHasAttemptedSubmit(true);

    if (hasEmptyAddress || hasEmptyContact) {
      console.log('BLOCKING: Empty address or contact info');
      return;
    }

    if (!stripePromise) {
      throw new Error('Stripe is not initialized.');
    }

    try {
      setLoading(true);

      try {
        const { trackBeginCheckout } = await import('@/lib/gtag');
        const totalValue =
          cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
          shippingPrice;
        trackBeginCheckout(
          cartItems.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
            item_category: 'Apparel',
            item_brand: 'QYVE',
            item_variant: item.product_size || undefined,
          })),
          totalValue,
          'MYR',
        );
      } catch (gaError) {
        console.warn('GA tracking failed (non-critical):', gaError);
      }

      console.log('Sending checkout body', {
        userId,
        cartItems,
        orderAddress,
        orderContact,
        shippingPrice,
        discountCode,
      });

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          cartItems,
          orderAddress,
          orderContact,
          shippingPrice,
          discountCode,
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const data = await res.json();
      console.log('Stripe response:', data);

      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        navigator.clipboard?.writeText(data.url).catch(() => {});

        const newWindow = window.open(data.url, '_blank');

        if (!newWindow) {
          console.warn(
            'Popup blocked. Please copy this URL manually:',
            data.url,
          );
          alert(
            `Please copy this URL and open it in a new tab:\n\n${data.url}`,
          );
        }
      } else {
        console.error('No URL returned from Stripe:', data);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ButtonPrimary
        className="mt-8 w-full"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </ButtonPrimary>
      {hasAttemptedSubmit && (hasEmptyAddress || hasEmptyContact) && (
        <div className="text-red-500">
          Please fill in the missing information
        </div>
      )}
    </>
  );
}
