import { NextResponse } from 'next/server';
import { processOrderById } from '@/lib/automated-shipping-integrated';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    console.log('📦 Processing specific order for shipping...');
    
    const body = await req.json();
    const { orderId } = body;
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }
    
    await processOrderById(orderId);
    
    return NextResponse.json({
      success: true,
      message: `Order ${orderId} processed for shipping successfully`,
      orderId: orderId,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Failed to process order for shipping:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process order for shipping'
    }, { status: 500 });
  }
}
