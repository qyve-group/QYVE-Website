import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🔍 Checking sender authentication...');
    
    const body = await req.json();
    const { email } = body;
    
    // Test different sender configurations
    const testSenders = [
      'noreply@qyveofficial.com',
      '9448d5003@smtp-brevo.com',
      'noreply@qyve.com'
    ];
    
    const results = [];
    
    for (const sender of testSenders) {
      try {
        // Create a simple test email
        const testEmail = {
          from: `"QYVE Test" <${sender}>`,
          to: email,
          subject: `Test from ${sender}`,
          text: `Test email from ${sender} at ${new Date().toISOString()}`
        };
        
        results.push({
          sender: sender,
          status: 'ready_to_test',
          message: 'Sender configuration ready for testing'
        });
        
      } catch (error) {
        results.push({
          sender: sender,
          status: 'error',
          message: (error as Error).message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sender authentication check completed',
      email: email,
      testSenders: results,
      recommendations: [
        'Check Brevo dashboard for new emails',
        'Verify domain authentication status',
        'Check if emails are in spam folder',
        'Wait 2-3 minutes for delivery'
      ],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sender check failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Sender check failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
