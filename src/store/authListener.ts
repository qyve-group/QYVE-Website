import { store } from "@/store/store";
import { setUser, logout} from "@/store/authSlice";
import { supabase } from "@/libs/supabaseClient";

export const listenForAuthChanges = () => {
    supabase.auth.getSession().then(({data}) => {
        store.dispatch(setUser({user: data.session?.user || null, session: data.session || null}));
    });


    const {data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        
        if(session){
            store.dispatch(setUser({user: session.user, session}));

        }
        else{
            store.dispatch(logout());
        }
    })

    return () => {
        authListener.subscription.unsubscribe();
    }


}

