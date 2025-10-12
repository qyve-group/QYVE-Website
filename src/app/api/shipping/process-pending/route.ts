import { NextResponse } from 'next/server';
import { processPendingOrders } from '@/lib/automated-shipping-integrated';

export async function POST(): Promise<NextResponse> {
  try {
    console.log('📦 Processing pending orders for shipping...');
    
    await processPendingOrders();
    
    return NextResponse.json({
      success: true,
      message: 'Pending orders processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Failed to process pending orders:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process pending orders'
    }, { status: 500 });
  }
}
