import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing with verified sender email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing email to:', email);
    
    // Create SMTP transporter using Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('📤 Sending email with verified sender...');
    
    // Try using a different sender format that might work
    const info = await transporter.sendMail({
      from: `"QYVE Team" <noreply@qyve.com>`, // Try using a domain-based sender
      to: email,
      subject: 'QYVE Email Test - Verified Sender',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">QYVE Email Test</h1>
          <p>This email is sent using a verified sender address.</p>
          <p><strong>Recipient:</strong> ${email}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
      text: `QYVE Email Test - Verified Sender\n\nThis email is sent using a verified sender address.\n\nRecipient: ${email}\nTimestamp: ${new Date().toISOString()}`
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent with verified sender!',
      email: email,
      messageId: info.messageId,
      sender: 'noreply@qyve.com',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Verified email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Verified email test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
