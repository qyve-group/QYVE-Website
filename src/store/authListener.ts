import { store } from "@/store/store";
import { setUser, logout, setLoading } from "@/store/authSlice";
import { supabase } from "@/libs/supabaseClient";

export const listenForAuthChanges = () => {
    supabase.auth.getSession().then(({data}) => {
        store.dispatch(setUser({user: data.session?.user || null, session: data.session}));
    });


    supabase.auth.onAuthStateChange((event, session) => {
        
        if(session){
            store.dispatch(setUser({user: session.user, session}));

        }
        else{
            store.dispatch(logout());
        }
    })


}

