// Shipping rates API endpoint
// Get shipping rates from EasyParcel for given addresses and parcel details

import { NextRequest, NextResponse } from 'next/server';
import { getShippingRates } from '@/lib/easyparcel-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, to, parcel } = body;

    // Validate required fields
    if (!from || !to || !parcel) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, and parcel' },
        { status: 400 }
      );
    }

    // Validate address fields
    const requiredFields = ['name', 'phone', 'email', 'address1', 'city', 'state', 'postcode', 'country'];
    for (const field of requiredFields) {
      if (!from[field] || !to[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate parcel fields
    const parcelFields = ['weight', 'length', 'width', 'height', 'content', 'value'];
    for (const field of parcelFields) {
      if (parcel[field] === undefined || parcel[field] === null) {
        return NextResponse.json(
          { error: `Missing required parcel field: ${field}` },
          { status: 400 }
        );
      }
    }

    const rates = await getShippingRates(from, to, parcel);

    return NextResponse.json({
      success: true,
      rates,
      count: rates.length,
    });
  } catch (error) {
    console.error('❌ Shipping rates API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
