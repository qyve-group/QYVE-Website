'use client';

import '@/styles/global.css';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import Header from '@/components/Header/Header';
import Providers from '@/components/Providers';
import Footer from '@/shared/Footer/Footer';
import { BannerProvider } from '@/contexts/BannerContext';
import BannerManager from '@/components/BannerManager';

import Loading from './loading';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = ['/checkout', '/login', '/my-orders'].includes(pathname);
  const isAdminPage = pathname?.startsWith('/admin');

  // For admin pages, don't show client-side elements
  if (isAdminPage) {
    return (
      <Providers>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Providers>
    );
  }

  // For regular pages, show full client-side layout
  return (
    <Providers>
      <BannerProvider>
        <Header />
        <Suspense fallback={<Loading />}>{children}</Suspense>
        {!hideFooter && <Footer />}
        <BannerManager />
      </BannerProvider>
    </Providers>
  );
}
