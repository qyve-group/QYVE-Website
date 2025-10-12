import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BANNER_CONFIG, type BannerConfig } from '@/data/bannerConfig';

// In a real application, this would interact with a database or CMS
let currentBannerConfig: BannerConfig = DEFAULT_BANNER_CONFIG;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const variant = searchParams.get('variant');

    if (variant) {
      // Return variant-specific banner
      const variantBanner = { ...currentBannerConfig, id: variant };
      return NextResponse.json({
        success: true,
        banner: variantBanner
      });
    }

    if (id) {
      // Return specific banner by ID
      if (id === currentBannerConfig.id) {
        return NextResponse.json({
          success: true,
          banner: currentBannerConfig
        });
      }
    }

    // Return default banner
    return NextResponse.json({
      success: true,
      banner: currentBannerConfig
    });

  } catch (error) {
    console.error('Error fetching banner config:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch banner config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const updatedConfig: Partial<BannerConfig> = await request.json();
    
    // Basic validation
    if (!updatedConfig.id) {
      return NextResponse.json(
        { message: 'Banner ID is required' },
        { status: 400 }
      );
    }

    // Update the in-memory config (for demonstration)
    // In production, this would update a database entry
    currentBannerConfig = { 
      ...currentBannerConfig, 
      ...updatedConfig,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Banner config updated successfully',
      banner: currentBannerConfig
    });

  } catch (error) {
    console.error('Error updating banner config:', error);
    return NextResponse.json(
      { message: 'Failed to update banner config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const updatedConfig: Partial<BannerConfig> = await request.json();
    
    // Update the in-memory config
    currentBannerConfig = { 
      ...currentBannerConfig, 
      ...updatedConfig,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Banner config updated successfully',
      banner: currentBannerConfig
    });

  } catch (error) {
    console.error('Error updating banner config:', error);
    return NextResponse.json(
      { message: 'Failed to update banner config' },
      { status: 500 }
    );
  }
}