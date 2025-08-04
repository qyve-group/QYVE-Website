import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { supabase } from '@/libs/supabaseClient';
import { store } from './store';

interface Profile {
  id: string;
  email: string;
  name?: string; // Optional
}

export interface AuthState {
  user: Profile | null;
  session: any;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; session: any }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.loading = true;
      console.log('Auth state set to null in authSlice');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

export const logoutUser = () => async (dispatch: any) => {
  // await supabase.auth.signOut(); // ✅ Clears session from Supabase
  // dispatch(logout()); // ✅ Clears user from Redux state

  console.log(
    'attempting to logoutuser in authslice.ts logouruser function...',
  );
  console.log('Before signOut...');

  try {
    const { error } = await supabase.auth.signOut(); // ✅ Clears session from Supabase
    if (error) {
      console.error('[logoutUser] Supabase error:', error);
      throw error;
    }
    dispatch(logout()); // ✅ Clears user from Redux state
    // const ses = store.getState().auth.session;
    // console.log('session authslice.ts logoutUser: ', ses);
    console.log('[logoutUser] Logout successful, state cleared.');
    console.log('After signOut...');
  } catch (err) {
    console.error('Logout failed authslice.ts:', err);
    throw err; // rethrow if needed in UI
  }
};
