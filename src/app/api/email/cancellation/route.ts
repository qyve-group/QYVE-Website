// Order cancellation API endpoint
// Sends cancellation notification emails

import { NextRequest, NextResponse } from 'next/server';
import { sendOrderCancellation } from '@/lib/email-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, reason, customerEmail, customerName, totalAmount, items, shippingAddress } = body;

    // Validate required fields
    if (!orderId || !reason || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, reason, and customerEmail' },
        { status: 400 }
      );
    }

    const orderData = {
      orderId,
      customerName: customerName || 'Customer',
      customerEmail,
      totalAmount: totalAmount || 0,
      currency: 'MYR',
      items: items || [],
      shippingAddress: shippingAddress || {
        line1: 'Address not provided',
        city: 'City',
        state: 'State',
        postalCode: '00000',
        country: 'Malaysia',
      },
      reason,
    };

    const result = await sendOrderCancellation(orderData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order cancellation email sent successfully',
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
    console.error('❌ Order cancellation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}


