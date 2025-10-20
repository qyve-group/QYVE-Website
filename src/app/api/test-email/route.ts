import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing email system...');
    
    const body = await req.json();
    const { email } = body;
    
    // Test data
    const testOrderData = {
      orderId: 'TEST-ORDER-123',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      totalAmount: 108,
      currency: 'MYR',
      items: [
        {
          name: 'Test QYVE Product',
          quantity: 2,
          price: 50,
          size: 'L',
          color: 'Black'
        }
      ],
      shippingAddress: {
        line1: '123 Test Street',
        line2: 'Apt 1',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postalCode: '50000',
        country: 'Malaysia'
      }
    };

    console.log('📧 Sending test order confirmation email...');
    
    const result = await sendOrderConfirmation(testOrderData);
    
    if (result.success) {
      console.log('✅ Email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId
      });
    } else {
      console.error('❌ Email failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Email test failed: ' + (error as Error).message
    }, { status: 500 });
  }
}
