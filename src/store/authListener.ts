import { store } from "@/store/store";
import { setUser, logout} from "@/store/authSlice";
import { supabase } from "@/libs/supabaseClient";
import { fetchCartFromSupabase, saveCartToSupabase } from "@/services/cartService";
import { clearCart } from "@/store/cartSlice";

export const listenForAuthChanges = () => {
    supabase.auth.getSession().then(({data}) => {
        console.log("Session retrieved from auth getSession: ", data);
        store.dispatch(setUser({user: data.session?.user || null, session: data.session || null}));

        if (data.session) {
            fetchCartFromSupabase(data.session.user.id, store.dispatch);
        }

    });

    const {data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        
        if(session){
            store.dispatch(setUser({user: session.user, session}));
            fetchCartFromSupabase(session?.user.id || null, store.dispatch);

        }
        else{
            store.dispatch(logout());
            store.dispatch(clearCart()); // Reset cart on logout

        }
    })

    return () => {
        authListener.subscription.unsubscribe();
    }


}

