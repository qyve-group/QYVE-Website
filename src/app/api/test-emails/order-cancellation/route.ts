import { NextResponse } from 'next/server';
import { sendOrderCancellation } from '@/lib/email-service-integrated';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Order Cancellation Email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing order cancellation email to:', email);
    
    // Test data for order cancellation
    const testOrderData = {
      orderId: 'QYVE-2025-004',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      totalAmount: 179.99,
      currency: 'MYR',
      items: [
        {
          name: 'QYVE Running Shoes',
          quantity: 1,
          price: 179.99,
          size: '42',
          color: 'White'
        }
      ],
      shippingAddress: {
        line1: '321 Marathon Street',
        line2: 'Floor 3',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postalCode: '50200',
        country: 'Malaysia'
      },
      reason: 'Customer requested cancellation due to size change'
    };
    
    console.log('📤 Sending order cancellation email...');
    const result = await sendOrderCancellation(testOrderData);
    
    if (result.success) {
      console.log('✅ Order cancellation email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Order cancellation email sent successfully!',
        messageId: result.messageId,
        email: email,
        template: 'Order Cancellation',
        orderId: testOrderData.orderId,
        reason: testOrderData.reason,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Order cancellation email test failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        message: `Order cancellation email test failed: ${result.error}` 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `API error: ${error.message}` 
    }, { status: 500 });
  }
}
