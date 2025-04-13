'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/shared/Footer/Footer";
import Providers from "@/components/Providers";
import Loading from "./loading";
import { Suspense } from "react";
import "@/styles/global.css";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = ["/checkout", "/login", "/my-orders"].includes(pathname);

  return (
    <Providers>
      <Header />
      <Suspense fallback={<Loading />}>{children}</Suspense>
      {!hideFooter && <Footer />}
    </Providers>
  );
}
