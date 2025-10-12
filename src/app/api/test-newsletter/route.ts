import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/data/bannerConfig';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, consent, source, bannerId } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Simulate successful subscription (without database)
    console.log('Test newsletter subscription:', {
      email,
      consent,
      source,
      bannerId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Test subscription successful',
      data: {
        email,
        consent,
        source,
        bannerId,
        subscribed: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Test newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Simulate checking subscription status
    const isSubscribed = Math.random() > 0.5; // Random for testing

    return NextResponse.json({
      success: true,
      isSubscribed,
      email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test newsletter check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
