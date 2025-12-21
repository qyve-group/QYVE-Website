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

// interface ShippingAddress {
//   name: string;
//   phone: string;
//   email: string;
//   address1: string;
//   address2?: string;
//   city: string;
//   state: string;
//   postcode: string;
//   country: string;
// }

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

  // if (!userId) {
  //   console.log('No logged in user id redirecting to login checkoutbutton.tsx');
  //   router.push('/login?redirect=checkout');
  //   return;
  // }

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
      // return;
    }

    try {
      setLoading(true);
      // console.log*('Checkout button clicked');
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
        // Try copying URL to clipboard as backup
        navigator.clipboard?.writeText(data.url).catch(() => {});

        // Try opening in new tab
        const newWindow = window.open(data.url, '_blank');

        if (!newWindow) {
          // Fallback if popup blocked
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
