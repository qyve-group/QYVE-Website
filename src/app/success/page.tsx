'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function SuccessPage() {
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get('session_id');

//   const [transaction, setTransaction] = useState<any>(null);

//   useEffect(() => {
//     async function fetchData() {
//       if (!sessionId) return;

//       const res = await fetch(`/api/stripe-success?session_id=${sessionId}`);
//       const data = await res.json();
//       setTransaction(data);
//     }

//     fetchData();
//   }, [sessionId]);

//   if (!transaction) return <p>Loading...</p>;

//   return (
//     <div className="mx-auto mt-10 max-w-md rounded border p-6 shadow">
//       <h1 className="mb-4 text-xl font-bold">💳 FPX Payment Confirmation</h1>
//       <ul className="space-y-2 text-sm">
//         <li>
//           <strong>Transaction Date & Time:</strong>{' '}
//           {transaction.transactionDateTime}
//         </li>
//         <li>
//           <strong>Amount (MYR):</strong> RM {transaction.amount}
//         </li>
//         <li>
//           <strong>Seller Order No.:</strong> {transaction.sellerOrderNo}
//         </li>
//         <li>
//           <strong>FPX Transaction ID:</strong> {transaction.fpxTransactionId}
//         </li>
//         <li>
//           <strong>Buyer Bank Name:</strong> {transaction.buyerBank}
//         </li>
//         <li>
//           <strong>Transaction Status:</strong> {transaction.status}
//         </li>
//       </ul>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  ArrowRight,
  Download,
  // Eye,
  // EyeOff,
  CreditCard,
  Building2,
  // Copy,
  // Check,
} from 'lucide-react';

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  // const [showMetadata, setShowMetadata] = useState(false);
  // const [copiedField, setCopiedField] = useState<string | null>(null);

  // const searchParams = useSearchParams();
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

  // const sessionId =
  //   searchParams?.get('session_id') || 'cs_test_example123456789';
  // const paymentIntentId = transaction.payment_intent;
  // const amount = parseInt(searchParams?.get('amount') || '2999');
  const amount = transaction.amount;
  const paymentMethod = transaction.paymentMethod;
  // const currency = searchParams?.get('currency') || 'myr';
  const dateTime = transaction.transactionDateTime;
  // const paymentMethod = searchParams?.get('payment_method') || 'card';
  // const last4 = searchParams?.get('last4') || '4242';
  // const brand = searchParams?.get('brand') || 'visa';
  const fpxBank = transaction.fpxBank;
  const brand = transaction.brand;
  const last4 = transaction.last4;

  // const mockSessionMetadata = {
  //   order_id: 'ORD-2024-001',
  //   customer_tier: 'premium',
  //   promotion_code: 'SAVE20',
  //   source: 'mobile_app',
  // };

  // const mockPaymentIntentMetadata = {
  //   user_id: 'user_123456',
  //   product_name: 'Premium Subscription',
  //   billing_cycle: 'monthly',
  //   tax_included: 'true',
  // };

  // const mockChargeMetadata = {
  //   merchant_reference: 'REF-2024-001',
  //   gateway_transaction_id: 'TXN_987654321',
  //   risk_score: 'low',
  //   processor: 'stripe',
  // };

  // useEffect(() => {
  //   console.log('Payment successful', {
  //     sessionId,
  //     paymentIntentId,
  //     amount,
  //     currency,
  //     paymentMethod,
  //   });
  // }, [sessionId, paymentIntentId, amount, currency, paymentMethod]);

  // const formatAmount = (amount: number, currency: string) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: currency.toUpperCase(),
  //   }).format(amount / 100);
  // };

  // const formatDate = (timestamp?: number) => {
  //   return new Date(timestamp || Date.now()).toLocaleString();
  // };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'fpx':
        return <Building2 className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodDisplay = () => {
    if (paymentMethod === 'card') {
      return `${brand.toUpperCase()} •••• ${last4}`;
    } else if (paymentMethod === 'fpx') {
      return `FPX - ${
        fpxBank
          .split('_') // Split by underscore -> ['bank', 'rakyat']
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each
          .join(' ') // Join back with spaces
      }`;
    }
    // return paymentMethod.toUpperCase();
    return paymentMethod;
  };

  // const copyToClipboard = async (text: string, field: string) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     setCopiedField(field);
  //     setTimeout(() => setCopiedField(null), 2000);
  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //   }
  // };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="text-center animate-fade-in">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Thank you for your purchase. Your payment has been processed
              successfully.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount Paid</span>
                <span className="text-lg font-bold text-green-600">
                  {`RM ${amount}`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Method</span>
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(paymentMethod)}
                  <span className="capitalize">
                    {getPaymentMethodDisplay()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Transaction Date</span>
                <span>{dateTime}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Completed
                </span>
              </div>
            </div>

            {/* <div className="p-3 bg-muted rounded-lg text-left space-y-3">
              {[
                { label: 'Session ID', value: sessionId, key: 'session' },
                {
                  label: 'Payment Intent ID',
                  value: paymentIntentId,
                  key: 'intent',
                },
              ].map(({ label, value, key }) => (
                <div className="flex items-center justify-between" key={key}>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-sm font-mono break-all">{value}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(value, key)}
                    className="ml-2"
                  >
                    {copiedField === key ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div> */}

            <div className="text-sm text-muted-foreground space-y-2">
              <p>✅ Payment processed securely</p>
              <p>📧 Confirmation email sent</p>
              <p>🔒 Your information is protected</p>
            </div>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link href="/">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transaction Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMetadata(!showMetadata)}
                className="hover-scale"
              >
                {showMetadata ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showMetadata ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </CardHeader> */}

        {/* {showMetadata && (
            <CardContent className="space-y-4 animate-accordion-down">
              {[
                {
                  title: 'Session Metadata',
                  data: mockSessionMetadata,
                  field: 'sessionMeta',
                },
                {
                  title: 'Payment Intent Metadata',
                  data: mockPaymentIntentMetadata,
                  field: 'intentMeta',
                },
                {
                  title: 'Charge Metadata',
                  data: mockChargeMetadata,
                  field: 'chargeMeta',
                },
                {
                  title: 'Payment Method Details',
                  data: {
                    type: paymentMethod,
                    ...(paymentMethod === 'card'
                      ? {
                          card: {
                            brand,
                            last4,
                            exp_month: 12,
                            exp_year: 2027,
                            funding: 'debit',
                            country: 'MY',
                          },
                        }
                      : {}),
                    ...(paymentMethod === 'fpx'
                      ? {
                          fpx: { bank: fpxBank || 'Maybank' },
                        }
                      : {}),
                  },
                  field: 'paymentMethodMeta',
                },
              ].map(({ title, data, field }) => (
                <div key={field}>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    {title}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(data, null, 2), field)
                      }
                    >
                      {copiedField === field ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </CardContent>
          )} */}
        {/* </Card> */}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
