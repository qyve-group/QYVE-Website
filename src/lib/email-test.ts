// Email Testing Utility for QYVE E-commerce Platform
// Comprehensive testing functions for all email types

import { emailService, EmailType } from './email-service';
import { OrderData, RefundData } from './email-templates';

// Test data generators
const generateTestOrderData = (): OrderData => ({
  orderId: `TEST-ORDER-${Date.now()}`,
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  totalAmount: 149.99,
  currency: 'MYR',
  items: [
    {
      name: 'QYVE Premium Socks',
      quantity: 2,
      price: 49.99,
      size: 'M',
      color: 'Black',
    },
    {
      name: 'QYVE Jersey',
      quantity: 1,
      price: 49.99,
      size: 'L',
      color: 'White',
    },
  ],
  shippingAddress: {
    line1: '123 Test Street',
    line2: 'Apt 4B',
    city: 'Kuala Lumpur',
    state: 'Kuala Lumpur',
    postalCode: '50000',
    country: 'Malaysia',
  },
  trackingNumber: 'EP123456789MY',
  estimatedDelivery: '3-5 business days',
});

const generateTestRefundData = (): RefundData => ({
  orderId: `TEST-ORDER-${Date.now()}`,
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  refundAmount: 99.99,
  currency: 'MYR',
  reason: 'Customer requested refund',
  processedDate: new Date().toLocaleDateString(),
});

// Test functions for each email type
export const testOrderConfirmation = async (testEmail: string) => {
  console.log('🧪 Testing Order Confirmation Email...');
  
  const orderData = generateTestOrderData();
  orderData.customerEmail = testEmail;
  
  const result = await emailService.sendOrderConfirmation(orderData);
  
  if (result.success) {
    console.log('✅ Order confirmation email sent successfully');
    console.log('📧 Message ID:', result.messageId);
  } else {
    console.error('❌ Order confirmation email failed:', result.error);
  }
  
  return result;
};

export const testPaymentConfirmation = async (testEmail: string) => {
  console.log('🧪 Testing Payment Confirmation Email...');
  
  const orderData = generateTestOrderData();
  orderData.customerEmail = testEmail;
  
  const result = await emailService.sendPaymentConfirmation(orderData);
  
  if (result.success) {
    console.log('✅ Payment confirmation email sent successfully');
    console.log('📧 Message ID:', result.messageId);
  } else {
    console.error('❌ Payment confirmation email failed:', result.error);
  }
  
  return result;
};

export const testShippingNotification = async (testEmail: string) => {
  console.log('🧪 Testing Shipping Notification Email...');
  
  const orderData = generateTestOrderData();
  orderData.customerEmail = testEmail;
  orderData.trackingNumber = 'EP123456789MY';
  orderData.estimatedDelivery = '3-5 business days';
  
  const result = await emailService.sendShippingNotification(orderData);
  
  if (result.success) {
    console.log('✅ Shipping notification email sent successfully');
    console.log('📧 Message ID:', result.messageId);
  } else {
    console.error('❌ Shipping notification email failed:', result.error);
  }
  
  return result;
};

export const testOrderCancellation = async (testEmail: string) => {
  console.log('🧪 Testing Order Cancellation Email...');
  
  const orderData = generateTestOrderData();
  orderData.customerEmail = testEmail;
  
  const result = await emailService.sendOrderCancellation({
    ...orderData,
    reason: 'Customer requested cancellation',
  });
  
  if (result.success) {
    console.log('✅ Order cancellation email sent successfully');
    console.log('📧 Message ID:', result.messageId);
  } else {
    console.error('❌ Order cancellation email failed:', result.error);
  }
  
  return result;
};

export const testRefundConfirmation = async (testEmail: string) => {
  console.log('🧪 Testing Refund Confirmation Email...');
  
  const refundData = generateTestRefundData();
  refundData.customerEmail = testEmail;
  
  const result = await emailService.sendRefundConfirmation(refundData);
  
  if (result.success) {
    console.log('✅ Refund confirmation email sent successfully');
    console.log('📧 Message ID:', result.messageId);
  } else {
    console.error('❌ Refund confirmation email failed:', result.error);
  }
  
  return result;
};

// Test all email types
export const testAllEmails = async (testEmail: string) => {
  console.log('🚀 Running All Email Tests...');
  console.log('=====================================');
  console.log(`📧 Test email: ${testEmail}`);
  console.log('=====================================');
  
  const results = {
    orderConfirmation: await testOrderConfirmation(testEmail),
    paymentConfirmation: await testPaymentConfirmation(testEmail),
    shippingNotification: await testShippingNotification(testEmail),
    orderCancellation: await testOrderCancellation(testEmail),
    refundConfirmation: await testRefundConfirmation(testEmail),
  };
  
  console.log('=====================================');
  console.log('📊 Test Results Summary:');
  console.log('=====================================');
  
  Object.entries(results).forEach(([testName, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;
  
  console.log('=====================================');
  console.log(`📈 Success Rate: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  console.log('=====================================');
  
  return results;
};

// API testing functions
export const testEmailAPI = async (testEmail: string) => {
  console.log('🧪 Testing Email API Endpoints...');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // Test order confirmation API
    console.log('📧 Testing order confirmation API...');
    const orderResponse = await fetch(`${baseUrl}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: EmailType.ORDER_CONFIRMATION,
        data: {
          ...generateTestOrderData(),
          customerEmail: testEmail,
        },
      }),
    });
    
    const orderResult = await orderResponse.json();
    console.log('Order confirmation API result:', orderResult);
    
    // Test shipping notification API
    console.log('📧 Testing shipping notification API...');
    const shippingResponse = await fetch(`${baseUrl}/api/email/shipping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: `TEST-ORDER-${Date.now()}`,
        customerEmail: testEmail,
        customerName: 'Test Customer',
        trackingNumber: 'EP123456789MY',
        estimatedDelivery: '3-5 business days',
        totalAmount: 149.99,
        items: generateTestOrderData().items,
        shippingAddress: generateTestOrderData().shippingAddress,
      }),
    });
    
    const shippingResult = await shippingResponse.json();
    console.log('Shipping notification API result:', shippingResult);
    
    return {
      orderConfirmation: orderResult,
      shippingNotification: shippingResult,
    };
  } catch (error) {
    console.error('❌ API testing failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).emailTest = {
    testOrderConfirmation,
    testPaymentConfirmation,
    testShippingNotification,
    testOrderCancellation,
    testRefundConfirmation,
    testAllEmails,
    testEmailAPI,
    generateTestOrderData,
    generateTestRefundData,
  };
}


