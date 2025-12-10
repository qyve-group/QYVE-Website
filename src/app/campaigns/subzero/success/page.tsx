'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0d3d5c] to-[#1a5a7a] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">
        <CheckCircleIcon className="mx-auto mb-6 size-20 text-green-500" />
        
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6 text-lg">
          Thank you for your SubZero Futsal Shoes pre-order!
        </p>

        <div className="border-gray-200 mb-6 rounded-lg border bg-blue-50 p-4 text-left">
          <h3 className="mb-2 font-semibold text-blue-800">What happens next?</h3>
          <ul className="text-gray-700 list-inside list-disc space-y-2 text-sm">
            <li>You will receive a confirmation email shortly</li>
            <li>You will be added to our WhatsApp group for updates</li>
            <li>Expected delivery: 5-7 days from week of 22/12</li>
          </ul>
        </div>

        {sessionId && (
          <p className="text-gray-500 mb-6 text-xs">
            Order Reference: {sessionId.slice(-12).toUpperCase()}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/campaigns/subzero"
            className="rounded-lg bg-gradient-to-r from-[#0d3d5c] to-[#1a5a7a] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to SubZero
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubZeroSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0d3d5c] to-[#1a5a7a]">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
