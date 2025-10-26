'use client';

import { useEffect } from 'react';

import { listenForAuthChanges } from '@/store/authListener'; // Import function
import { store } from '@/store/store';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    try {
      const unsubscribe = listenForAuthChanges(store.dispatch, store.getState); // Start listening for auth changes

      return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe(); // Unsubscribe on component unmount
        }
      };
    } catch (error) {
      console.error('Error in AuthProvider:', error);
      // Return empty cleanup function if there's an error
      return () => {};
    }
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
