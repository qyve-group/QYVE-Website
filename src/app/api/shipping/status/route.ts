import { NextResponse } from 'next/server';
import { getOrderShippingStatus } from '@/lib/automated-shipping-integrated';

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }
    
    console.log(`📦 Getting shipping status for order: ${orderId}`);
    
    const status = await getOrderShippingStatus(orderId);
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      status: status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Failed to get shipping status:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get shipping status'
    }, { status: 500 });
  }
}
