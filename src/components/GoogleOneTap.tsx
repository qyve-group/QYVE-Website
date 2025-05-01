/* eslint-disable unused-imports/no-unused-imports, no-unused-vars */

'use client';

import type { CredentialResponse } from 'google-one-tap';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

import { supabase } from '@/libs/supabaseClient';

const OneTapComponent = () => {
  const router = useRouter();

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      // console.log*('Initializing Google One Tap');
      window.addEventListener('load', async () => {
        const [nonce, hashedNonce] = await generateNonce();
        // console.log*('Nonce: ', nonce, hashedNonce);

        // check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          // console.error*('Error getting session', error);
        }
        if (data.session) {
          router.push('/');
          return;
        }

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: CredentialResponse) => {
            // send id token returned in response.credential to supabase
            const { error: errorSignIn } =
              await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              });

            if (errorSignIn) {
              // Handle error appropriately (e.g., log it or show user a message)
              // console.error('Error logging in with Google One Tap', errorSignIn);
              throw errorSignIn;
            }

            // redirect to protected page
            router.push('/');
          },
          nonce: hashedNonce,
          // with chrome's removal of third-party cookiesm, we need to use FedCM instead (https:// developers.google.com/identity/gsi/web/guides/fedcm-migration)
          use_fedcm_for_prompt: true,
        });
        window.google.accounts.id.prompt(); // Display the One Tap UI
      });
    };
    initializeGoogleOneTap();
    return () => window.removeEventListener('load', initializeGoogleOneTap);
  }, []);

  return (
    <>
      <Script src="https:// accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed right-0 top-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;
