import { NextResponse } from 'next/server';
import { DEFAULT_BANNER_CONFIG } from '@/data/bannerConfig';

export async function GET(): Promise<NextResponse> {
  try {
    // Create a test banner that will definitely show
    const testBanner = {
      ...DEFAULT_BANNER_CONFIG,
      id: 'test-banner',
      title: '🎉 WELCOME TO YOUR JOURNEY',
      subtitle: '#OwnYourJourney',
      description: 'Join the QYVE family and get exclusive access to premium futsal gear, member-only discounts, and early access to new releases.',
      buttonText: 'Join Now',
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      buttonColor: '#ff6b35',
      buttonTextColor: '#ffffff',
      position: 'top' as const,
      isActive: true,
      showOnPages: ['/', '/home', 'home', 'shop', 'products'],
      hideOnPages: ['checkout', 'success', 'login', 'signup', 'admin'],
      gdprRequired: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      banner: testBanner
    });

  } catch (error) {
    console.error('Error creating test banner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create test banner' },
      { status: 500 }
    );
  }
}