import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing simple SMTP email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing simple email to:', email);
    
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
    
    console.log('📤 Sending simple email via SMTP...');
    
    // Send simple test email
    const info = await transporter.sendMail({
      from: `"QYVE Team" <noreply@qyveofficial.com>`,
      to: email,
      subject: 'QYVE Email Test - Simple',
      text: `
        QYVE Email System Test
        
        Hello!
        
        This is a simple test email from the QYVE email system.
        
        Test Details:
        - Email: ${email}
        - Timestamp: ${new Date().toISOString()}
        - Method: SMTP (Nodemailer)
        - Provider: Brevo/Sendinblue
        
        If you received this email, the email system is working correctly!
        
        This is a test email from the QYVE development environment.
      `
    });
    
    console.log('✅ Simple email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Simple test email sent successfully!',
      email: email,
      messageId: info.messageId,
      method: 'SMTP (Simple Text)',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Simple SMTP email test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Simple SMTP email test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
