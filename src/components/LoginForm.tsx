'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa6';

import { supabase } from '@/libs/supabaseClient';
import { submitLogin } from '@/services/authService';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import ButtonSecondary from '@/shared/Button/ButtonSecondary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errMessage, setErrMessage] = useState<string>('');

  const redirectTo = searchParams.get('redirect') || '/';

  const submitForm = async () => {
    try {
      // const { user, session } = await submitLogin(email, password);
      const { session } = await submitLogin(email, password);

      if (session) {
        router.push(`${redirectTo}`);
      }
      // console.log*('Logged in user: ', user);
      // console.log*('Logged in session: ', session);

      router.push('/home');
    } catch (error) {
      // console.error*('Error logging in: ', error);
      // alert(error.message);
      if (error instanceof Error) {
        // alert(error.message);
        // <div>{error.message}</div>;
        setErrMessage(error.message);
      } else {
        // alert('An unexpected error occurred.');
        // <div>An unexpected error occurred</div>;
        setErrMessage('An unexpected error occured.');
      }
    }
  };

  // const randomStr = (len: number) => {
  //   const arr = new Uint8Array(len);
  //   window.crypto.getRandomValues(arr);
  //   return String.fromCharCode(...toCharCodes(arr));
  // };

  // const toCharCodes = (arr: Uint8Array) => {
  //   const validChars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   return arr.map((x) => validChars.charCodeAt(x % validChars.length));
  // };

  // const sha256 = (message: string) => {
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(message);
  //   return window.crypto.subtle.digest('SHA-256', data);
  // };

  // const bufferToBase64UrlEncoded = (input: ArrayBuffer) => {
  //   const bytes = new Uint8Array(input);
  //   return urlEncodeBase64(window.btoa(String.fromCharCode(...bytes)));
  // };

  // const urlEncodeBase64 = (input: string) => {
  //   const chars = { '+': '-', '/': '_', '=': '' };
  //   return input.replace(/[\+\/=]/g, (m) => chars[m as '+' | '/' | '=']);
  // };

  // const generateStateToken = () => {
  //   return randomStr(32);
  // };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    // if (error) // console.error*('Gogole Sign-In error: ', error);
  };

  return (
    <div className="nc-PageLogin" data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center font-myFont text-4xl italic leading-[115%] md:text-5xl md:leading-[115%]">
          Login
        </h2>
        <div className="mx-auto max-w-md">
          <div className="space-y-6">
            <div className="">
              <ButtonSecondary
                className="flex w-full items-center gap-3 border-2 border-black text-black hover:bg-black hover:text-primary"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle className="text-2xl" /> Continue with Google
              </ButtonSecondary>
            </div>
            <div className="relative text-center">
              <span className="relative z-10 inline-block rounded-full bg-gray px-4 text-sm font-medium ">
                OR
              </span>
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border border-neutral-300" />
            </div>
            <div className="grid gap-6">
              <FormItem label="Email address">
                <Input
                  type="email"
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  placeholder="example@example.com"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormItem>
              <FormItem label="Password">
                <Input
                  type="password"
                  rounded="rounded-full"
                  sizeClass="h-12 px-4 py-3"
                  className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </FormItem>
              {errMessage && (
                <div className=" mx-auto max-w-md text-red-500">
                  {errMessage}
                </div>
              )}
              <ButtonPrimary
                onClick={submitForm}
                className="font-myFont italic hover:bg-black hover:text-primary"
              >
                Login
              </ButtonPrimary>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <Link
                href="/forgot-pass"
                className="text-sm font-semibold text-black"
              >
                Forgot password
              </Link>
              <span className="block text-center text-sm text-neutral-500">
                Don&apos;t have an account? {` `}
                <Link href="/signup" className="font-semibold text-black">
                  Signup
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
