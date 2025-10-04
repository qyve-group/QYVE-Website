// Email API Endpoint for sending transactional emails
// Handles all email types with proper validation and error handling

import { NextRequest, NextResponse } from 'next/server';
import { emailService, EmailType } from '@/lib/email-service';
import { OrderData, RefundData } from '@/lib/email-templates';

// Request validation schemas
interface SendEmailRequest {
  type: EmailType;
  data: OrderData | RefundData;
  testMode?: boolean;
}

// Send email endpoint
export async function POST(req: NextRequest) {
  try {
    const body: SendEmailRequest = await req.json();
    const { type, data, testMode = false } = body;

    // Validate request
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    // Validate email type
    if (!Object.values(EmailType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      );
    }

    let result;

    // Route to appropriate email service method
    switch (type) {
      case EmailType.ORDER_CONFIRMATION:
        result = await emailService.sendOrderConfirmation(data as OrderData);
        break;
      
      case EmailType.PAYMENT_CONFIRMATION:
        result = await emailService.sendPaymentConfirmation(data as OrderData);
        break;
      
      case EmailType.SHIPPING_NOTIFICATION:
        result = await emailService.sendShippingNotification(data as OrderData);
        break;
      
      case EmailType.ORDER_CANCELLATION:
        result = await emailService.sendOrderCancellation(data as OrderData & { reason: string });
        break;
      
      case EmailType.REFUND_CONFIRMATION:
        result = await emailService.sendRefundConfirmation(data as RefundData);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Unsupported email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully',
        retryCount: result.retryCount,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          retryCount: result.retryCount,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Test email endpoint
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const testEmail = searchParams.get('email');

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await emailService.sendTestEmail(testEmail);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Test email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}


