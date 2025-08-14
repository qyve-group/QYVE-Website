import '@/styles/global.css';

import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';

import Analytics from '@/components/Analytics';

// import Header from "@/components/Header/Header";
// import Footer from "@/shared/Footer/Footer";
// import Loading from "./loading";
// import Providers from "@/components/Providers";
import LayoutClient from './layoutClient';

export const metadata: Metadata = {
  title: 'QYVE',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/qyve-white-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/qyve-white-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/qyve-white-apple.png',
    },
  ],
  // icons: {
  //   icon: '/qyve-white.png', // This will be used as the favicon
  // },
  // icons: [
  //   {
  //     rel: 'apple-touch-icon',
  //     // url: '/apple-touch-icon.png',
  //     url: '/qyve-white.png',
  //   },
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     sizes: '32x32',
  //     // url: '/favicon.png',
  //     url: '/qyve-white.png',
  //   },
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     sizes: '16x16',
  //     // url: '/favicon.png',
  //     url: '/qyve-white.png',
  //   },
  //   {
  //     rel: 'icon',
  //     // url: '/favicon.ico',
  //     url: '/qyve-white.png',
  //   },
  // ],
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages

  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        {/* Google Analytics Global Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L21TDRCCGP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L21TDRCCGP', {
              send_page_view: false
            });
          `}
        </Script>
        {/* Custom Analytics for SPA Navigation */}
        <Analytics />
        <LayoutClient>{children}</LayoutClient>

        {/* <Providers>

            <Header />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <Footer />
 
          </Providers> */}
      </body>
    </html>
  );
}

// Enable edge runtime, but you are required to disable the `migrate` function in `src/libs/DB.ts`
// Unfortunately, this also means it will also disable the automatic migration of the database
// And, you will have to manually migrate it with `drizzle-kit push`
// export const runtime = 'edge';
