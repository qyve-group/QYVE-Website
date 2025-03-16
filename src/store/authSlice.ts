import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/libs/supabaseClient";

export interface AuthState {
    user: null;
    session: any;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    session: null,
    loading: true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{user: any, session: any}>) => {
            state.user = action.payload.user;
            state.session = action.payload.session;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.session = null;
            state.loading = true;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
});

export const {setUser, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;