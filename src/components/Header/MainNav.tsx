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
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logs
  console.log('Auth state:', { user: auth.user, loading: auth.loading });
  if (auth.user) {
    console.log('User email:', auth.user.email);
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Close dropdown when mouse moves away with delay to prevent accidental closes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (event: MouseEvent) => {
      if (!dropdownRef.current || !isOpen) return;

      const rect = dropdownRef.current.getBoundingClientRect();
      const buffer = 80; // increased buffer area around dropdown

      const isOutsideDropdown =
        event.clientX < rect.left - buffer ||
        event.clientX > rect.right + buffer ||
        event.clientY < rect.top - buffer ||
        event.clientY > rect.bottom + buffer;

      if (isOutsideDropdown) {
        // Add delay before closing to prevent accidental closes
        timeoutId = setTimeout(() => {
          setIsOpen(false);
        }, 300); // 300ms delay
      } else {
        // Clear timeout if mouse comes back into area
        /* eslint-disable no-lonely-if */
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  const handleLogOut = async () => {
    setIsLoggingOut(true); // Start loading

    try {
      await dispatch(logoutUser()); // Logout process
      setIsOpen(false);
    } catch (error) {
      console.error('error logging out in mainnav.tsx: ', error);
    } finally {
      setIsLoggingOut(false);
    }
    // Close dropdown

    // setIsLoggingOut(true); // Start loading
    // try {
    //   await dispatch(logoutUser()); // Your custom logout logic
    //   setIsOpen(false); // Close dropdown
    // } catch (error) {
    //   console.log('error logging out: ', error);
    // } finally {
    //   setIsLoggingOut(false); // ✅ Always reset loading state
    // }

    router.push('/home'); // Redirect after logout
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
      
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:flex lg:items-center lg:gap-5 lg:flex-1 lg:justify-center">
        <TopNav />
      </div>

      {/* Right side - Cart and User Account */}
      <div className="flex items-center gap-3">
        {/* <div className="relative hidden lg:block">
          <span className="absolute -top-1/4 left-3/4 aspect-square w-3 rounded-full bg-red-600" />
          <FaRegBell className="text-2xl" />
        </div> */}

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
            {auth.user ? (
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
                {/* {auth.loading !== true ? (
                  <>
                    <Link
                      href="/my-orders"
                      className="text-black hover:bg-gray-100 block px-4 py-2"
                    >
                      Orders
                    </Link>
                    <button
                      type="button"
                      className="text-black hover:bg-gray-100 block px-4 py-2"
                      onClick={handleLogOut}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <Loading />
                )} */}
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
