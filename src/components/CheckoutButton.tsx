'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import type { CartItem } from '@/store/cartSlice';
import type { RootState } from '@/store/store';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

export default function CheckoutButton({
  cartItems,
}: {
  cartItems: CartItem[];
}) {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    console.log('Checkout button clicked');

    if (!stripePromise) {
      alert('Stripe is not initialized.');
      return;
    }

    try {
      setLoading(true);
      console.log('Checkout button clicked');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cartItems }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const data = await res.json();
      console.log('Redirecting to:', data.url);
      console.log('API Response:', data); // Debugging output
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ButtonPrimary
      className="mt-8 w-full"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Checkout Now'}
    </ButtonPrimary>
  );
}
