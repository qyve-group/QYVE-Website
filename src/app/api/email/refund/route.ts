// Refund confirmation API endpoint
// Sends refund confirmation emails

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { sendRefundConfirmation } from '@/lib/email-service';
import type { RefundData } from '@/lib/email-templates';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { orderId, customerEmail, customerName, refundAmount, reason } = body;

    // Validate required fields
    if (!orderId || !customerEmail || !refundAmount) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: orderId, customerEmail, and refundAmount',
        },
        { status: 400 },
      );
    }

    const refundData: RefundData = {
      orderId,
      customerName: customerName || 'Customer',
      customerEmail,
      refundAmount: parseFloat(refundAmount),
      currency: 'MYR',
      reason: reason || 'Refund processed',
      processedDate: new Date().toLocaleDateString(),
    };

    const result = await sendRefundConfirmation(refundData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Refund confirmation email sent successfully',
        messageId: result.messageId,
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 },
    );
  } catch (error) {
    console.error('❌ Refund confirmation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
