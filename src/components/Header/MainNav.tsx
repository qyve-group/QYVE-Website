"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegBell } from "react-icons/fa6";
import { RiSearch2Line } from "react-icons/ri";

import avatar from "@/images/avatar.png";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import Input from "@/shared/Input/Input";
import Logo from "@/shared/Logo/Logo";

import CartSideBar from "../CartSideBar";
import MenuBar from "./MenuBar";

import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";
import { logoutUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";


const MainNav = () => {

  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  console.log("Auth: ", auth);
  console.log("User: ", auth.user?.email);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true); // Start loading

    await dispatch(logoutUser()); // Logout process
    setIsOpen(false); // Close dropdown

    router.push("/home"); // Redirect after logout
    setIsLoggingOut(false); // Stop loading (optional, since the page will change)
  }

  return (
    <div className="container flex items-center justify-between py-4">
      <div className="flex-1 lg:hidden">
        <MenuBar />
      </div>
      <div className="flex items-center gap-5 lg:basis-[60%]">
        <Logo />
        <div className="hidden w-full max-w-2xl items-center gap-5 rounded-full border border-neutral-300 py-1 pr-3 lg:flex">
          <Input
            type="text"
            className="border-transparent bg-white placeholder:text-neutral-500 focus:border-transparent"
            placeholder="try 'Nike Air Jordan'"
          />
          <RiSearch2Line className="text-2xl text-neutral-500" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-5">
        <div className="relative hidden lg:block">
          <span className="absolute -top-1/4 left-3/4 aspect-square w-3 rounded-full bg-red-600" />
          <FaRegBell className="text-2xl" />
        </div>

        <div className="flex items-center divide-x divide-neutral-300">
          <CartSideBar />
          <div className="relative cursor-pointer" onClick={() => {setIsOpen(!isOpen)}}>
          {auth.loading != true ? (
          <div className="flex items-center gap-2 pl-5" >
            <ButtonCircle3 className="overflow-hidden bg-gray" size="w-10 h-10">
              <Image
                src={avatar}
                alt="avatar"
                className="h-full w-full object-cover object-center"
              />
            </ButtonCircle3>
              {/* <p>Welcome, {auth.user?.email}</p> */}
              </div>
              ): (
                <div className="flex items-center gap-2 pl-5">
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
            </div>
            )}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-primary shadow-lg rounded-lg overflow-hidden z-10 text-white">
                {auth.loading != true ? (
                  <>
                    <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Orders</Link>
                    <button 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogOut}
                    disabled={isLoggingOut}>
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>

                    {isLoggingOut && <Loading/>}
                    
                  </>
                ):(<Loading/>)}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
