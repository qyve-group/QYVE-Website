'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
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

  // console.log*('Auth: ', auth);
  // console.log*('User: ', auth.user?.email);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true); // Start loading

    await dispatch(logoutUser()); // Logout process
    setIsOpen(false); // Close dropdown

    router.push('/home'); // Redirect after logout
    // setIsLoggingOut(false);
  };

  return (
    <div className="container flex items-center justify-between py-2">
      <div className="flex-1 lg:hidden">
        <MenuBar />
      </div>
      <div className="flex items-center gap-5 lg:basis-3/5">
        <Logo />
        {/* <div className="hidden w-full max-w-2xl items-center gap-5 rounded-full border border-neutral-300 py-1 pr-3 lg:flex">
          <Input
            type="text"
            className="border-transparent bg-white placeholder:text-neutral-500 focus:border-transparent"
            placeholder="try 'Nike Air Jordan'"
          />
          <RiSearch2Line className="text-2xl text-neutral-500" />
        </div> */}
        <TopNav />
      </div>
      {/* <div>
        <TopNav />
      </div> */}

      <div className="flex flex-1 items-center justify-end gap-5">
        {/* <div className="relative hidden lg:block">
          <span className="absolute -top-1/4 left-3/4 aspect-square w-3 rounded-full bg-red-600" />
          <FaRegBell className="text-2xl" />
        </div> */}

        <div className="flex items-center divide-x divide-neutral-300">
          <CartSideBar />
          <div
            // role="button"
            tabIndex={0}
            className="relative cursor-pointer"
            // onClick={() => {
            //   setIsOpen(!isOpen);
            // }}
            // onKeyDown={(e) => {
            //   if (e.key === 'Enter' || e.key === ' ') {
            //     setIsOpen(!isOpen);
            //   }
            // }}
          >
            {auth.loading !== true ? (
              // {auth.user?.id !== null ? (
              <div className="flex items-center gap-2 pl-5">
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
                <Link
                  href="/login"
                  className="text-gray-700 hover:bg-gray-100 block px-4 py-2"
                >
                  Login
                </Link>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
