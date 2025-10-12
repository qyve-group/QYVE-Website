import { NextResponse } from 'next/server';
import { 
  sendOrderConfirmation, 
  sendPaymentConfirmation, 
  sendShippingNotification, 
  sendOrderCancellation, 
  sendRefundConfirmation 
} from '@/lib/email-service-integrated';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    console.log('🧪 Testing All Email Types with QYVE Branding...');
    
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email address is required'
      }, { status: 400 });
    }
    
    console.log('📧 Testing all email types to:', email);
    
    const results = [];
    
    // Test data for all email types
    const testOrderData = {
      orderId: 'QYVE-2025-TEST',
      customerName: 'Test Customer',
      customerEmail: email,
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
      customerEmail: email,
      refundAmount: 299.99,
      currency: 'MYR',
      reason: 'Customer requested refund',
      processedDate: new Date().toLocaleDateString()
    };
    
    // Test Order Confirmation Email
    console.log('📤 Testing Order Confirmation Email...');
    try {
      const orderResult = await sendOrderConfirmation(testOrderData);
      results.push({
        type: 'Order Confirmation',
        success: orderResult.success,
        messageId: orderResult.messageId,
        error: orderResult.error
      });
    } catch (error) {
      results.push({
        type: 'Order Confirmation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test Payment Confirmation Email
    console.log('📤 Testing Payment Confirmation Email...');
    try {
      const paymentResult = await sendPaymentConfirmation(testOrderData);
      results.push({
        type: 'Payment Confirmation',
        success: paymentResult.success,
        messageId: paymentResult.messageId,
        error: paymentResult.error
      });
    } catch (error) {
      results.push({
        type: 'Payment Confirmation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test Shipping Notification Email
    console.log('📤 Testing Shipping Notification Email...');
    try {
      const shippingResult = await sendShippingNotification(testOrderData);
      results.push({
        type: 'Shipping Notification',
        success: shippingResult.success,
        messageId: shippingResult.messageId,
        error: shippingResult.error
      });
    } catch (error) {
      results.push({
        type: 'Shipping Notification',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test Order Cancellation Email
    console.log('📤 Testing Order Cancellation Email...');
    try {
      const cancellationResult = await sendOrderCancellation({
        ...testOrderData,
        reason: 'Customer requested cancellation'
      });
      results.push({
        type: 'Order Cancellation',
        success: cancellationResult.success,
        messageId: cancellationResult.messageId,
        error: cancellationResult.error
      });
    } catch (error) {
      results.push({
        type: 'Order Cancellation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test Refund Confirmation Email
    console.log('📤 Testing Refund Confirmation Email...');
    try {
      const refundResult = await sendRefundConfirmation(testRefundData);
      results.push({
        type: 'Refund Confirmation',
        success: refundResult.success,
        messageId: refundResult.messageId,
        error: refundResult.error
      });
    } catch (error) {
      results.push({
        type: 'Refund Confirmation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`✅ Email tests completed: ${successCount}/${totalCount} successful`);
    
    return NextResponse.json({
      success: successCount === totalCount,
      message: `All email types tested: ${successCount}/${totalCount} successful`,
      email: email,
      results: results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      },
      features: {
        qyveLogo: 'Updated with official QYVE logo image',
        brandedTemplates: 'All templates use QYVE colors and styling',
        responsiveDesign: 'Mobile-friendly layouts',
        trackingIntegration: 'Shipping notifications include EasyParcel tracking',
        webhookIntegration: 'Automatic emails via Stripe webhook'
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
