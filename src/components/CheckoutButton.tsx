'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
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

  const [loading, setLoading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const hasEmptyAddress = Object.values(orderAddress).some(
    (val) => val === null || val === '' || val === undefined,
  );

  const hasEmptyContact = Object.values(orderContact).some(
    (val) => val === null || val === '' || val === undefined,
  );

  const handleCheckout = async () => {
    // console.log * 'Checkout button clicked';
    setHasAttemptedSubmit(true);

    if (hasEmptyAddress || hasEmptyContact) {
      return;
    }

    if (!stripePromise) {
      throw new Error('Stripe is not initialized.');
      // return;
    }

    try {
      setLoading(true);
      // console.log*('Checkout button clicked');

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
      // console.log*('Redirecting to:', data.url);
      // console.log*('API Response:', data); // Debugging output
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      // console.error*('Checkout error: ', error);
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
