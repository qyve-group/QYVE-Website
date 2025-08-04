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
    const unsubscribe = listenForAuthChanges(store.dispatch, store.getState); // Start listening for auth changes

    return () => {
      unsubscribe(); // Unsubscribe on component unmount
    };
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
