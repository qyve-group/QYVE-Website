import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { saveCartToSupabase } from '@/services/cartService';
import type { RootState } from '@/store/store';
import { debounce } from '@/utils/debounce';

const debouncedSaveCart = debounce(saveCartToSupabase, 1000); // 1-second delay

const CartSync = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);
  const latestCartRef = useRef(cart); // Store the latest cart reference
  console.log('latestCarRef - cartProvider.tsx: ', latestCartRef);

  useEffect(() => {
    latestCartRef.current = cart; // Update ref on every render
  }, [cart]);

  useEffect(() => {
    try {
      if (!auth.user || cart.items.length === 0) return;

      console.log('cartProvider.tsx ----- Syncing redux cart to supabase...');
      console.log('cart items: ', cart.items);

      debouncedSaveCart(auth.user.id, cart.items);
    } catch (error) {
      console.error('debouncedSaveCart error - cartProvider.tsx: ', error);
    }
  }, [cart]);

  return null;
};

export default CartSync;
