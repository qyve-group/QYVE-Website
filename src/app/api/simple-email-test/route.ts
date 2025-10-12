import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🧪 Simple email test starting...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing email to:', email);
    
    // Test environment variables
    const envCheck = {
      BREVO_API_KEY: process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing',
      SMTP_USER: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
      SMTP_PASS: process.env.SMTP_PASS ? '✅ Set' : '❌ Missing',
      SMTP_HOST: process.env.SMTP_HOST ? '✅ Set' : '❌ Missing',
    };
    
    console.log('🔧 Environment variables:', envCheck);
    
    // Test Brevo import
    let brevoStatus = '❌ Failed to import';
    try {
      const { brevoClient } = await import('@/libs/brevo');
      brevoStatus = '✅ Brevo client imported successfully';
      console.log('✅ Brevo client imported successfully');
    } catch (error) {
      console.error('❌ Brevo import error:', error);
      brevoStatus = `❌ Import error: ${(error as Error).message}`;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Simple email test completed',
      email: email,
      environment: envCheck,
      brevoStatus: brevoStatus,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Simple email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Simple email test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
