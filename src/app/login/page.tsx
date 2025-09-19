'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import LoginForm from '@/components/LoginForm';
import type { RootState } from '@/store/store';

const LoginPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (auth.user && !auth.loading) {
      router.push('/home'); // Redirect to home if logged in
    }
  }, [auth.user, auth.loading, router]);

  // Prevent rendering LoginForm if user is logged in
  if (auth.user && !auth.loading) return null;

  return <LoginForm />;
};

export default LoginPage;
