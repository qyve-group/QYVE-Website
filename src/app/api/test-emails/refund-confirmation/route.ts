import { NextResponse } from 'next/server';
import { sendRefundConfirmation } from '@/lib/email-service-integrated';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Refund Confirmation Email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing refund confirmation email to:', email);
    
    // Test data for refund confirmation
    const testRefundData = {
      orderId: 'QYVE-2025-005',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      refundAmount: 129.99,
      currency: 'MYR',
      reason: 'Product defect - item arrived damaged',
      processedDate: new Date().toLocaleDateString()
    };
    
    console.log('📤 Sending refund confirmation email...');
    const result = await sendRefundConfirmation(testRefundData);
    
    if (result.success) {
      console.log('✅ Refund confirmation email sent successfully:', result.messageId);
      return NextResponse.json({
        success: true,
        message: 'Refund confirmation email sent successfully!',
        messageId: result.messageId,
        email: email,
        template: 'Refund Confirmation',
        orderId: testRefundData.orderId,
        refundAmount: testRefundData.refundAmount,
        reason: testRefundData.reason,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Refund confirmation email test failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        message: `Refund confirmation email test failed: ${result.error}` 
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
