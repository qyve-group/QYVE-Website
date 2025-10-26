import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: { 
    cart: cartReducer, 
    auth: authReducer 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from "@reduxjs/toolkit";
// import cartReducer from "./cartSlice";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// import {
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ['cart', 'user'], // Only persist cart and user
// };

// const persistedReducer = persistReducer(persistConfig, cartReducer);

// export const store = configureStore({
//   reducer: {
//     cart: persistedReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore persist actions
//       },
//     }),
// });

// export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
