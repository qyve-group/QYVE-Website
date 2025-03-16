import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import cartReducer from "./cartSlice";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";


// // Function to handle SSR (avoids undefined storage errors)
// const createNoopStorage = () => ({
//   getItem: async () => null,
//   setItem: async () => {},
//   removeItem: async () => {},
// });

// // Ensure we always assign a valid storage object
// const storage =
//   typeof window !== "undefined"
//     ? createWebStorage("session") // Use sessionStorage
//     : createNoopStorage(); // Fallback for SSR

const persistConfig = {
  key: "cart",
  // storage,
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

// export const store = configureStore({
//   reducer: {
//     cart: persistedCartReducer,
//   },

// });

export const store = configureStore({
  reducer: {cart: persistedCartReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

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
