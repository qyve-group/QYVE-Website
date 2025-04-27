import { supabase } from '@/libs/supabaseClient';
import { setUser } from '@/store/authSlice';
import { store } from '@/store/store';

export const submitSignUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error;
  }
  // console.log*('Registered user: ', data.user);
  // console.log*('Registered user session: ', data.session);

  store.dispatch(setUser({ user: data.user, session: data.session }));
  return { user: data.user, session: data.session };
};

export const submitLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  store.dispatch(setUser({ user: data.user, session: data.session }));
  return { user: data.user, session: data.session };
};
