'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/products', label: 'Products', icon: '🛍️' },
    { href: '/admin/stock', label: 'Stock', icon: '📦' },
    { href: '/admin/adjustments', label: 'Adjust Stock', icon: '✏️' },
    { href: '/admin/history', label: 'History', icon: '📋' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <span className="text-gray-900 text-xl font-bold">
                  QYVE Admin
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
