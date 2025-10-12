import { NextResponse } from 'next/server';
import { sendPaymentConfirmation } from '@/lib/email-service-integrated';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Payment Confirmation Email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing payment confirmation email to:', email);
    
    // Test data for payment confirmation
    const testOrderData = {
      orderId: 'QYVE-2025-002',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      totalAmount: 199.99,
      currency: 'MYR',
      items: [
        {
          name: 'QYVE Athletic Shorts',
          quantity: 1,
          price: 149.99,
          size: 'M',
          color: 'Navy'
        },
        {
          name: 'QYVE Sports Cap',
          quantity: 1,
          price: 49.99,
          size: 'One Size',
          color: 'Black'
        }
      ],
      shippingAddress: {
        line1: '456 Sports Avenue',
        line2: 'Unit 12',
        city: 'Petaling Jaya',
        state: 'Selangor',
        postalCode: '47800',
        country: 'Malaysia'
      }
    };
    
    console.log('📤 Sending payment confirmation email...');
    const result = await sendPaymentConfirmation(testOrderData);
    
    if (result.success) {
      console.log('✅ Payment confirmation email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Payment confirmation email sent successfully!',
        messageId: result.messageId,
        email: email,
        template: 'Payment Confirmation',
        orderId: testOrderData.orderId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Payment confirmation email test failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        message: `Payment confirmation email test failed: ${result.error}` 
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
