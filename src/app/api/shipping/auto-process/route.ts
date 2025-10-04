// Auto-process shipping API endpoint
// Automatically create shipments for pending orders

import { NextResponse } from 'next/server';
import { processPendingOrders } from '@/lib/automated-shipping';

export async function POST(): Promise<NextResponse> {
  try {
    console.log('📦 Starting automated shipping process...');
    
    const result = await processPendingOrders();
    
    return NextResponse.json({
      success: true,
      message: 'Automated shipping process completed',
      processed: result.processed,
      errors: result.errors,
      total: result.processed + result.errors,
    });
  } catch (error) {
    console.error('❌ Auto-process shipping API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Get status of automated shipping
export async function GET(): Promise<NextResponse> {
  try {
    // This could be enhanced to show shipping statistics
    return NextResponse.json({
      success: true,
      message: 'Automated shipping system is running',
      status: 'active',
    });
  } catch (error) {
    console.error('❌ Auto-process status API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
