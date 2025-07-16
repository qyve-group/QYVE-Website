'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!sessionId) return;

      const res = await fetch(`/api/stripe-success?session_id=${sessionId}`);
      const data = await res.json();
      setTransaction(data);
    }

    fetchData();
  }, [sessionId]);

  if (!transaction) return <p>Loading...</p>;

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-6 shadow">
      <h1 className="mb-4 text-xl font-bold">💳 FPX Payment Confirmation</h1>
      <ul className="space-y-2 text-sm">
        <li>
          <strong>Transaction Date & Time:</strong>{' '}
          {transaction.transactionDateTime}
        </li>
        <li>
          <strong>Amount (MYR):</strong> RM {transaction.amount}
        </li>
        <li>
          <strong>Seller Order No.:</strong> {transaction.sellerOrderNo}
        </li>
        <li>
          <strong>FPX Transaction ID:</strong> {transaction.fpxTransactionId}
        </li>
        <li>
          <strong>Buyer Bank Name:</strong> {transaction.buyerBank}
        </li>
        <li>
          <strong>Transaction Status:</strong> {transaction.status}
        </li>
      </ul>
    </div>
  );
}
