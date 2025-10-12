import { NextResponse } from 'next/server';
import { brevoClient, SendSmtpEmail } from '@/libs/brevo';

export async function POST(req: Request) {
  try {
    console.log('🧪 Direct email test starting...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Sending test email to:', email);
    
    // Create a simple test email
    const emailData: SendSmtpEmail = {
      to: [{ email: email, name: 'Test User' }],
      subject: 'QYVE Email System Test',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">🎉 QYVE Email System Test</h1>
          <p>Hello!</p>
          <p>This is a test email from the QYVE email system to verify that:</p>
          <ul>
            <li>✅ Brevo/Sendinblue integration is working</li>
            <li>✅ SMTP credentials are correct</li>
            <li>✅ Email templates can be sent</li>
            <li>✅ Environment variables are loaded</li>
          </ul>
          <p><strong>Test Details:</strong></p>
          <ul>
            <li>Email: ${email}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
            <li>From: QYVE Email System</li>
          </ul>
          <p>If you received this email, the email system is working correctly! 🚀</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is a test email from the QYVE development environment.
          </p>
        </div>
      `,
      textContent: `
        QYVE Email System Test
        
        Hello!
        
        This is a test email from the QYVE email system to verify that:
        - Brevo/Sendinblue integration is working
        - SMTP credentials are correct
        - Email templates can be sent
        - Environment variables are loaded
        
        Test Details:
        - Email: ${email}
        - Timestamp: ${new Date().toISOString()}
        - From: QYVE Email System
        
        If you received this email, the email system is working correctly!
        
        This is a test email from the QYVE development environment.
      `,
      sender: {
        email: process.env.SMTP_USER || 'noreply@qyve.com',
        name: 'QYVE'
      }
    };
    
    console.log('📤 Sending email via Brevo...');
    const result = await brevoClient.sendTransacEmail(emailData);
    
    console.log('✅ Email sent successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      email: email,
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Direct email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Direct email test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
