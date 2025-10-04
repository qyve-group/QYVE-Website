// Track shipment API endpoint
// Get tracking information for a shipment

import { NextRequest, NextResponse } from 'next/server';
import { trackShipment } from '@/lib/easyparcel-service';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const trackingNumber = searchParams.get('tracking_number');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required parameter: tracking_number' },
        { status: 400 }
      );
    }

    const trackingResult = await trackShipment(trackingNumber);

    if (!trackingResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: trackingResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      status: trackingResult.status,
      location: trackingResult.location,
      lastUpdate: trackingResult.lastUpdate,
      estimatedDelivery: trackingResult.estimatedDelivery,
    });
  } catch (error) {
    console.error('❌ Track shipment API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
