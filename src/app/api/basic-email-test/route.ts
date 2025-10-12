import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🧪 Basic email test starting...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing email to:', email);
    
    // Test if we can import the Brevo client
    let brevoClient;
    try {
      const brevoModule = await import('@/libs/brevo');
      brevoClient = brevoModule.brevoClient;
      console.log('✅ Brevo client imported successfully');
    } catch (error) {
      console.error('❌ Failed to import Brevo client:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to import Brevo client: ' + (error as Error).message
      }, { status: 500 });
    }
    
    // Test if we can import the email service
    let emailService;
    try {
      const emailModule = await import('@/lib/email-service');
      emailService = emailModule;
      console.log('✅ Email service imported successfully');
    } catch (error) {
      console.error('❌ Failed to import email service:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to import email service: ' + (error as Error).message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Basic email test completed - all imports successful',
      email: email,
      imports: {
        brevoClient: '✅ Success',
        emailService: '✅ Success'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Basic email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Basic email test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
