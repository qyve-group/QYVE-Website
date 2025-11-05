'use client';

// ✅ This makes it a Client Component

import { Provider } from 'react-redux';

import AuthProvider from '@/services/authProvider';
import CartSync from '@/services/cartProvider';
import { BundleModalProvider } from '@/providers/BundleModalProvider';
import { store } from '@/store/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BundleModalProvider>
          <CartSync />
          {children}
        </BundleModalProvider>
      </AuthProvider>
    </Provider>
  );
}
