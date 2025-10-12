import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing SMTP email system...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing email to:', email);
    
    // Create SMTP transporter using Brevo SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('📤 Sending email via SMTP...');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"QYVE" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 QYVE Email System Test - SMTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 28px;">QYVE</h1>
            <h2 style="color: #666; font-size: 20px;">Email System Test</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">✅ Test Successful!</h3>
            <p>This email confirms that the QYVE email system is working correctly using:</p>
            <ul style="color: #666;">
              <li>✅ Brevo/Sendinblue SMTP</li>
              <li>✅ Nodemailer integration</li>
              <li>✅ Environment variables</li>
              <li>✅ HTML email templates</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #1976d2; margin-top: 0;">Test Details:</h4>
            <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Method:</strong> SMTP (Nodemailer)</p>
            <p style="margin: 5px 0; color: #666;"><strong>Provider:</strong> Brevo/Sendinblue</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              This is a test email from the QYVE development environment.
            </p>
            <p style="color: #999; font-size: 12px;">
              If you received this email, the email system is ready for production! 🚀
            </p>
          </div>
        </div>
      `,
      text: `
        QYVE Email System Test - SMTP
        
        ✅ Test Successful!
        
        This email confirms that the QYVE email system is working correctly using:
        - Brevo/Sendinblue SMTP
        - Nodemailer integration
        - Environment variables
        - HTML email templates
        
        Test Details:
        - Email: ${email}
        - Timestamp: ${new Date().toISOString()}
        - Method: SMTP (Nodemailer)
        - Provider: Brevo/Sendinblue
        
        This is a test email from the QYVE development environment.
        If you received this email, the email system is ready for production! 🚀
      `
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully via SMTP!',
      email: email,
      messageId: info.messageId,
      method: 'SMTP (Nodemailer)',
      provider: 'Brevo/Sendinblue',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ SMTP email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'SMTP email test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
