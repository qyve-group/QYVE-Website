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
  console.log('MainNav component rendering...');
  
  // Safe Redux hooks with error handling
  let auth, dispatch, router;
  try {
    auth = useSelector((state: RootState) => state.auth);
    dispatch = useDispatch<AppDispatch>();
    router = useRouter();
  } catch (error) {
    console.error('Redux hooks error in MainNav:', error);
    // Fallback values
    auth = { user: null, loading: false };
    dispatch = () => {};
    router = { push: () => {} };
  }

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      if (dispatch && typeof dispatch === 'function') {
        await dispatch(logoutUser());
      }
      setIsOpen(false);
    } catch (error) {
      console.error('error logging out in mainnav.tsx: ', error);
    } finally {
      setIsLoggingOut(false);
    }
    if (router && router.push) {
      router.push('/home');
    }
  };

  return (
    <div className="container mx-auto px-4 flex items-center justify-between py-3">
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden">
        <MenuBar />
      </div>
      
      {/* Logo - Always visible */}
      <div className="flex items-center">
        <Logo />
      </div>
      
      {/* Desktop Navigation - Always visible for testing */}
      <div className="flex items-center gap-5 flex-1 justify-center">
        <TopNav />
      </div>

      {/* Right side - Cart and User Account */}
      <div className="flex items-center gap-3">
        <div className="flex items-center divide-x divide-neutral-300">
          <CartSideBar />
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
            {auth?.user ? (
              <div className="flex items-center gap-2 pl-5">
                <span className="text-gray-700 mr-2 hidden text-sm font-medium md:block">
                  Hi, {auth.user.email?.split('@')[0] || 'User'}
                </span>
                <ButtonCircle3
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                  className="overflow-hidden bg-gray"
                  size="w-10 h-10"
                >
                  <RiAccountCircleFill className="size-full object-cover object-center" />
                </ButtonCircle3>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-5">
                {isNavigatingToLogin ? (
                  <div className="text-gray-500 flex items-center gap-2 px-4 py-2">
                    <div className="border-gray-500 size-4 animate-spin rounded-full border-b-2" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
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
                )}
              </div>
            )}
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
