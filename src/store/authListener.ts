import { supabase } from '@/libs/supabaseClient';
import { fetchCartFromSupabase } from '@/services/cartService';
import { logout, setUser } from '@/store/authSlice';
import { clearCart, setCart } from '@/store/cartSlice';
import { store } from '@/store/store';
// import { debounce } from '@/utils/debounce';
import { saveCartToSupabase } from '@/services/cartService';
import { mergeCarts } from '@/utils/cart';
import { AppDispatch } from '@/store/store';

export const listenForAuthChanges = () => {
  // const debouncedSaveCart = debounce(saveCartToSupabase, 1000); // 1-second delay
  console.log(
    'listening for authchanges listenforauthchanges in authlistenr.ts',
  );

  supabase.auth.getSession().then(({ data }) => {
    // console.log*('Session retrieved from auth getSession: ', data);
    store.dispatch(
      setUser({
        user: data.session?.user || null,
        session: data.session || null,
      }),
    );

    console.log('current user authlistner.ts: ', data.session?.user || null);

    if (data.session) {
      console.log('fetching cart from supabase from authlistener...');
      fetchCartFromSupabase(data.session?.user.id || null, store.dispatch);
      // const cart =
      //   await fetchCartFromSupabase(
      //     data.session.user.id || null) ?? [];
      // store.dispatch(setCart(cart));
      // const userCart =
      //   (await fetchCartFromSupabase(data.session.user.id)) ?? [];
      // store.dispatch(setCart(userCart));
    } else {
      console.log('No current user session authlistener.tsx');
    }
  });

  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('onAuthStateChange is being called.');
      console.log('[AUTH] Event:', event); // ⬅️ this will show SIGNED_IN or SIGNED_OUT

      if (event === 'SIGNED_IN' && session) {
        setTimeout(async () => {
          try {
            const guestCart = store.getState().cart.items;
            store.dispatch(setUser({ user: session.user, session }));

            await fetchCartFromSupabase(
              session.user.id || null,
              store.dispatch,
            );
            const userCart = store.getState().cart.items;

            const mergedCart = mergeCarts(userCart, guestCart);
            store.dispatch(setCart(mergedCart));
            // await saveCartToSupabase(session.user.id, mergedCart);

            console.log('Merged cart:', mergedCart);
          } catch (err) {
            console.error('Error during SIGNED_IN merge process:', err);
          }
        }, 0);
      }
      if (event === 'SIGNED_OUT') {
        store.dispatch(logout());
        store.dispatch(clearCart());
      }
    },
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};
