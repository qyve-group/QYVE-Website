import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import cartReducer from "./cartSlice";
import authReducer from "@/store/authSlice";

const persistCartConfig = {
  key: "cart",
  storage,
  whitelist: ["cart"],
};

const persistAuthConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // Persist user data only
};

const persistedCartReducer = persistReducer(persistCartConfig, cartReducer);
const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);


export const store = configureStore({
  reducer: {cart: persistedCartReducer, 
    auth: persistedAuthReducer},
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
