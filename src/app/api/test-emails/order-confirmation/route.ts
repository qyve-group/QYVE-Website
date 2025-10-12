import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email-service-integrated';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Order Confirmation Email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing order confirmation email to:', email);
    
    // Test data for order confirmation
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
    
    console.log('📤 Sending order confirmation email...');
    const result = await sendOrderConfirmation(testOrderData);
    
    if (result.success) {
      console.log('✅ Order confirmation email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Order confirmation email sent successfully!',
        messageId: result.messageId,
        email: email,
        template: 'Order Confirmation',
        orderId: testOrderData.orderId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Order confirmation email test failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        message: `Order confirmation email test failed: ${result.error}` 
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
