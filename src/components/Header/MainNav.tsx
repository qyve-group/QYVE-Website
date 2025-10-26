'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
// import avatar from '@/images/avatar.png';
import { RiAccountCircleFill } from 'react-icons/ri';
// import { FaRegBell } from 'react-icons/fa6';
// import { RiSearch2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

// import Loading from '@/app/loading';
import ButtonCircle3 from '@/shared/Button/ButtonCircle3';
// import Input from '@/shared/Input/Input';
import Logo from '@/shared/Logo/Logo';
import { logoutUser } from '@/store/authSlice';
import type { AppDispatch, RootState } from '@/store/store';

import CartSideBar from '../CartSideBar';
import MenuBar from './MenuBar';
import TopNav from './TopNav';

const MainNav = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    setIsLoggingOut(false);
    // Redirect to home
    window.location.href = '/home';
  };

  return (
    <div className="container flex items-center justify-between py-2">
      <div className="flex-1 lg:hidden">
        <MenuBar />
      </div>
      <div className="flex items-center gap-5 lg:basis-3/5">
        <Logo />
        <TopNav />
      </div>

      <div className="flex flex-1 items-center justify-end gap-5">
        <div className="flex items-center divide-x divide-neutral-300">
          <div>Cart</div>
          <div
            ref={dropdownRef}
            className="relative cursor-pointer"
            onMouseEnter={() => {
              // Keep dropdown open when hovering over the area
            }}
            onMouseLeave={(e) => {
              // Only close if really moving far away
              const rect = dropdownRef.current?.getBoundingClientRect();
              if (rect) {
                const buffer = 80;
                const isReallyOutside =
                  e.clientX < rect.left - buffer ||
                  e.clientX > rect.right + buffer ||
                  e.clientY < rect.top - buffer ||
                  e.clientY > rect.bottom + buffer;

                if (isReallyOutside) {
                  setTimeout(() => setIsOpen(false), 500);
                }
              }
            }}
          >
            <div className="flex items-center gap-2 pl-5">
              <Link
                href="/login"
                className="text-gray-700 hover:bg-gray-100 block rounded-md px-4 py-2 transition-colors"
                onClick={() => {
                  setIsNavigatingToLogin(true);
                  // Reset after navigation starts
                  setTimeout(() => setIsNavigatingToLogin(false), 1500);
                }}
              >
                Login
              </Link>
            </div>
            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg bg-primary text-white shadow-lg">
                <Link
                  href="/my-orders"
                  className="hover:bg-gray-100 block px-4 py-2 text-black"
                >
                  Orders
                </Link>
                <button
                  type="button"
                  className="hover:bg-gray-100 block px-4 py-2 text-black"
                  onClick={handleLogOut}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
