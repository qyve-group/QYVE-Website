import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email-service-smtp';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing branded email template...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing branded email to:', email);
    
    // Test data for branded email
    const testOrderData = {
      orderId: 'QYVE-2025-001',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      totalAmount: 299.99,
      currency: 'MYR',
      items: [
        {
          name: 'QYVE Premium Hoodie',
          quantity: 1,
          price: 199.99,
          size: 'L',
          color: 'Black'
        },
        {
          name: 'QYVE Sports T-Shirt',
          quantity: 2,
          price: 49.99,
          size: 'M',
          color: 'White'
        }
      ],
      shippingAddress: {
        line1: '123 QYVE Street',
        line2: 'Apt 5B',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postalCode: '50000',
        country: 'Malaysia'
      }
    };
    
    console.log('📤 Sending branded order confirmation email...');
    const result = await sendOrderConfirmation(testOrderData);
    
    if (result.success) {
      console.log('✅ Branded email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Branded email template sent successfully!',
        messageId: result.messageId,
        email: email,
        template: 'Order Confirmation',
        branding: 'QYVE Branded Template',
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Branded email test failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        message: `Branded email test failed: ${result.error}` 
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
