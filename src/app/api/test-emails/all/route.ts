import { NextResponse } from 'next/server';
import { 
  sendOrderConfirmation, 
  sendPaymentConfirmation, 
  sendShippingNotification, 
  sendOrderCancellation, 
  sendRefundConfirmation 
} from '@/lib/email-service-integrated';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing All Email Types...');
    
    const body = await req.json();
    const { email, emailType } = body;
    
    console.log('📧 Testing email type:', emailType, 'to:', email);
    
    const results = [];
    
    // Test data for all email types
    const testOrderData = {
      orderId: 'QYVE-2025-TEST',
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
      },
      trackingNumber: 'EP987654321MY',
      estimatedDelivery: '3-5 business days'
    };
    
    const testRefundData = {
      orderId: 'QYVE-2025-TEST',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      refundAmount: 299.99,
      currency: 'MYR',
      reason: 'Customer requested refund',
      processedDate: new Date().toLocaleDateString()
    };
    
    // Test specific email type or all
    if (emailType === 'order-confirmation' || !emailType) {
      console.log('📤 Testing Order Confirmation...');
      const result = await sendOrderConfirmation(testOrderData);
      results.push({
        type: 'Order Confirmation',
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }
    
    if (emailType === 'payment-confirmation' || !emailType) {
      console.log('📤 Testing Payment Confirmation...');
      const result = await sendPaymentConfirmation(testOrderData);
      results.push({
        type: 'Payment Confirmation',
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }
    
    if (emailType === 'shipping-notification' || !emailType) {
      console.log('📤 Testing Shipping Notification...');
      const result = await sendShippingNotification(testOrderData);
      results.push({
        type: 'Shipping Notification',
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }
    
    if (emailType === 'order-cancellation' || !emailType) {
      console.log('📤 Testing Order Cancellation...');
      const result = await sendOrderCancellation({
        ...testOrderData,
        reason: 'Test cancellation'
      });
      results.push({
        type: 'Order Cancellation',
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }
    
    if (emailType === 'refund-confirmation' || !emailType) {
      console.log('📤 Testing Refund Confirmation...');
      const result = await sendRefundConfirmation(testRefundData);
      results.push({
        type: 'Refund Confirmation',
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`✅ Email tests completed: ${successCount}/${totalCount} successful`);
    
    return NextResponse.json({
      success: successCount === totalCount,
      message: `Email tests completed: ${successCount}/${totalCount} successful`,
      email: email,
      emailType: emailType || 'all',
      results: results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `API error: ${error.message}` 
    }, { status: 500 });
  }
}
