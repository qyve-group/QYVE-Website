'use client';

import '@/styles/global.css';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import Header from '@/components/Header/Header';
import Providers from '@/components/Providers';
import Footer from '@/shared/Footer/Footer';

import Loading from './loading';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = ['/checkout', '/login', '/my-orders'].includes(pathname);

  return (
    <Providers>
      <Header />
      <Suspense fallback={<Loading />}>{children}</Suspense>
      {!hideFooter && <Footer />}
    </Providers>
  );
}
