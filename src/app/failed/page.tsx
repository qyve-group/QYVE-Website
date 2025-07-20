// app/payment-failed/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');

  useEffect(() => {
    console.log('Payment failed', { error, errorCode });
  }, [error, errorCode]);

  const getErrorMessage = () => {
    if (error === 'cancelled') {
      return 'Payment was cancelled. You can try again anytime.';
    }

    switch (errorCode) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please check your account balance or try a different card.';
      case 'expired_card':
        return 'Your card has expired. Please use a different payment method.';
      case 'incorrect_cvc':
        return 'The security code (CVC) is incorrect. Please check and try again.';
      case 'processing_error':
        return 'There was an error processing your payment. Please try again.';
      default:
        return 'Payment could not be completed. Please try again or contact support.';
    }
  };

  const isCardError = [
    'card_declined',
    'insufficient_funds',
    'expired_card',
    'incorrect_cvc',
  ].includes(errorCode || '');
  const isCancelled = error === 'cancelled';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorCode && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Error Code</p>
              <p className="text-sm font-mono">{errorCode}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            {isCardError && (
              <>
                <p>💳 Try using a different card</p>
                <p>🏦 Check with your bank if needed</p>
                <p>📱 Consider using FPX for local payments</p>
              </>
            )}
            {isCancelled && (
              <>
                <p>⏰ Your session is still active</p>
                <p>💳 All payment methods are available</p>
                <p>🔒 Your information remains secure</p>
              </>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <Button className="w-full" onClick={() => window.history.back()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Payment Again
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* <div className="pt-4 border-t space-y-2">
            <Button variant="ghost" size="sm" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <p className="text-xs text-muted-foreground">
              Having trouble? We're here to help 24/7
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;
