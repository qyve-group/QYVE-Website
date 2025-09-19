import { supabase } from '@/libs/supabaseClient';
import { fetchCartFromSupabase } from '@/services/cartService';
// import { debounce } from '@/utils/debounce';
import { logout, setUser } from '@/store/authSlice';
import { clearCart, setCart } from '@/store/cartSlice';
// import { store } from '@/store/store';
import { mergeCarts } from '@/utils/cart';
// import { useDispatch } from 'react-redux';

export const listenForAuthChanges = (dispatch: any, getState: () => any) => {
  // const debouncedSaveCart = debounce(saveCartToSupabase, 1000); // 1-second delay
  // const dispatch = useDispatch();
  console.log(
    'listening for authchanges listenforauthchanges in authlistenr.ts',
  );

  // Check if we have valid Supabase credentials
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  ) {
    console.log('Supabase not configured - skipping auth listener');
    return () => {}; // Return empty cleanup function
  }

  try {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        // console.log*('Session retrieved from auth getSession: ', data);
        dispatch(
          setUser({
            user: data.session?.user || null,
            session: data.session || null,
          }),
        );

        console.log(
          'current user authlistner.ts: ',
          data.session?.user || null,
        );

        if (data.session) {
          console.log('fetching cart from supabase from authlistener...');
          fetchCartFromSupabase(data.session?.user.id || null, dispatch);
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
      })
      .catch((error) => {
        console.error('Error getting Supabase session:', error);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('onAuthStateChange is being called.');
        console.log('[AUTH] Event:', event); // ⬅️ this will show SIGNED_IN or SIGNED_OUT

        if (event === 'SIGNED_IN' && session) {
          setTimeout(async () => {
            try {
              const guestCart = getState().cart.items;
              dispatch(setUser({ user: session.user, session }));

              await fetchCartFromSupabase(session.user.id || null, dispatch);
              const userCart = getState().cart.items;

              const mergedCart = mergeCarts(userCart, guestCart);
              dispatch(setCart(mergedCart));
              // await saveCartToSupabase(session.user.id, mergedCart);

              console.log('Merged cart:', mergedCart);
            } catch (err) {
              console.error('Error during SIGNED_IN merge process:', err);
            }
          }, 0);
        }
        if (event === 'SIGNED_OUT') {
          console.log('dispatch(logout) called from authListener');
          dispatch(logout());
          dispatch(clearCart());
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Error setting up auth listener:', error);
    return () => {}; // Return empty cleanup function
  }
};
