import { NextResponse } from 'next/server';
import { easyParcelService } from '@/lib/easyparcel-service';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('🧪 Testing EasyParcel Connection...');
    
    // Check if API key is configured
    const apiKey = process.env.EASYPARCEL_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'EasyParcel API key not configured',
        details: {
          apiKey: '❌ Missing'
        }
      }, { status: 400 });
    }
    
    console.log('📦 Testing EasyParcel connection...');
    const connectionTest = await easyParcelService.testConnection();
    
    if (connectionTest) {
      return NextResponse.json({
        success: true,
        message: 'EasyParcel connection test successful!',
        apiKey: '✅ Configured',
        connection: '✅ Working',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'EasyParcel connection test failed',
        apiKey: '✅ Configured',
        connection: '❌ Failed'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ EasyParcel connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'EasyParcel connection test failed: ' + error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
