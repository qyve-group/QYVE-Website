import { supabase } from '@/libs/supabaseClient';
import { fetchCartFromSupabase } from '@/services/cartService';
import { logout, setUser } from '@/store/authSlice';
import { clearCart } from '@/store/cartSlice';
import { store } from '@/store/store';

export const listenForAuthChanges = () => {
  supabase.auth.getSession().then(({ data }) => {
    //console.log*('Session retrieved from auth getSession: ', data);
    store.dispatch(
      setUser({
        user: data.session?.user || null,
        session: data.session || null,
      }),
    );

    if (data.session) {
      fetchCartFromSupabase(data.session.user.id, store.dispatch);
    }
  });

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_, session) => {
      if (session) {
        store.dispatch(setUser({ user: session.user, session }));
        fetchCartFromSupabase(session?.user.id || null, store.dispatch);
      } else {
        store.dispatch(logout());
        store.dispatch(clearCart()); // Reset cart on logout
      }
    },
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
};
