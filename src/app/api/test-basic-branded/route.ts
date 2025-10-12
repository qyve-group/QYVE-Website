import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Basic Branded Email...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing basic branded email to:', email);
    
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('📤 Sending basic branded email...');
    
    // Simple branded email
    const info = await transporter.sendMail({
      from: `"QYVE Team" <noreply@qyveofficial.com>`,
      to: email,
      subject: '🎉 QYVE Branded Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; text-align: center; padding: 40px 20px; border-radius: 12px 12px 0 0; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);"></div>
            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: #1a1a1a; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);">Q</div>
            <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">🎉 QYVE Branded Email</h1>
            <p style="font-size: 16px; opacity: 0.9; font-weight: 500;">Testing our new branded template</p>
          </div>
          
          <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hi <strong>Test Customer</strong>,</p>
            
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">This is a test of our new QYVE branded email template with:</p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ff6b35; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
              <h3 style="color: #333; margin-top: 0;">✅ Branding Features</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li>QYVE Logo (Q)</li>
                <li>Brand Colors (Black, Orange, Gold)</li>
                <li>Professional Design</li>
                <li>Responsive Layout</li>
                <li>Gradient Backgrounds</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; text-decoration: none; border-radius: 8px; margin: 15px 0; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);">Test Button</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding: 40px 30px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 20px;">
              <div style="display: inline-block; width: 40px; height: 40px; background: #1a1a1a; border-radius: 50%; color: white; font-size: 20px; font-weight: 900; line-height: 40px; text-align: center; margin-bottom: 10px;">Q</div>
            </div>
            <p><strong>QYVE</strong> - Premium Sports Apparel</p>
            <p>Questions? Contact us at <a href="mailto:support@qyveofficial.com" style="color: #ff6b35; text-decoration: none; font-weight: 600;">support@qyveofficial.com</a></p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
              <p style="font-size: 12px; color: #6c757d;">© 2025 QYVE. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });
    
    console.log('✅ Basic branded email sent:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Basic branded email sent successfully!',
      messageId: info.messageId,
      email: email,
      template: 'Basic Branded Template',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Error: ${error.message}` 
    }, { status: 500 });
  }
}
