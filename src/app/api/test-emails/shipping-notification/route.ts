import { NextResponse } from 'next/server';
import { sendShippingNotification } from '@/lib/email-service-integrated';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Shipping Notification Email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing shipping notification email to:', email);
    
    // Test data for shipping notification
    const testOrderData = {
      orderId: 'QYVE-2025-003',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      totalAmount: 249.99,
      currency: 'MYR',
      items: [
        {
          name: 'QYVE Performance Jacket',
          quantity: 1,
          price: 199.99,
          size: 'L',
          color: 'Gray'
        },
        {
          name: 'QYVE Training Pants',
          quantity: 1,
          price: 49.99,
          size: 'M',
          color: 'Black'
        }
      ],
      shippingAddress: {
        line1: '789 Fitness Road',
        line2: 'Block A',
        city: 'Shah Alam',
        state: 'Selangor',
        postalCode: '40000',
        country: 'Malaysia'
      },
      trackingNumber: 'EP123456789MY',
      estimatedDelivery: '3-5 business days'
    };
    
    console.log('📤 Sending shipping notification email...');
    const result = await sendShippingNotification(testOrderData);
    
    if (result.success) {
      console.log('✅ Shipping notification email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Shipping notification email sent successfully!',
        messageId: result.messageId,
        email: email,
        template: 'Shipping Notification',
        orderId: testOrderData.orderId,
        trackingNumber: testOrderData.trackingNumber,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Shipping notification email test failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        message: `Shipping notification email test failed: ${result.error}` 
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
