'use client';

// ✅ This makes it a Client Component

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AuthProvider from '@/services/authProvider';
import CartSync from '@/services/cartProvider';
import { persistor, store } from '@/store/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <CartSync />
          {children}
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
