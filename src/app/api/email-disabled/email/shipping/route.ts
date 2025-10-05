// Shipping notification API endpoint
// Sends shipping notification emails when orders are shipped

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { sendShippingNotification } from '@/lib/email-service';
import type { OrderData } from '@/lib/email-templates';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { orderId, trackingNumber, estimatedDelivery } = body;

    // Validate required fields
    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and trackingNumber' },
        { status: 400 },
      );
    }

    // In a real implementation, you would fetch order data from database
    // For now, we'll use the provided data structure
    const orderData: OrderData = {
      orderId,
      customerName: body.customerName || 'Customer',
      customerEmail: body.customerEmail,
      totalAmount: body.totalAmount || 0,
      currency: 'MYR',
      items: body.items || [],
      shippingAddress: body.shippingAddress || {
        line1: 'Address not provided',
        city: 'City',
        state: 'State',
        postalCode: '00000',
        country: 'Malaysia',
      },
      trackingNumber,
      estimatedDelivery: estimatedDelivery || '3-5 business days',
    };

    const result = await sendShippingNotification(orderData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Shipping notification sent successfully',
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
    console.error('❌ Shipping notification API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
