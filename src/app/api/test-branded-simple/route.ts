import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationEmail } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing branded email template...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing branded email to:', email);
    
    // Test data for branded email
    const testOrderData = {
      orderId: 'QYVE-2025-001',
      customerName: 'Test Customer',
      customerEmail: email || 'test@example.com',
      totalAmount: 299.99,
      currency: 'MYR',
      items: [
        {
          name: 'QYVE Premium Hoodie',
          quantity: 1,
          price: 199.99,
          size: 'L',
          color: 'Black'
        },
        {
          name: 'QYVE Sports T-Shirt',
          quantity: 2,
          price: 49.99,
          size: 'M',
          color: 'White'
        }
      ],
      shippingAddress: {
        line1: '123 QYVE Street',
        line2: 'Apt 5B',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postalCode: '50000',
        country: 'Malaysia'
      }
    };
    
    // Create SMTP transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    console.log('📤 Sending branded order confirmation email...');
    
    // Send branded email
    const info = await transporter.sendMail({
      from: `"QYVE Team" <noreply@qyveofficial.com>`,
      to: email,
      subject: '🎉 QYVE Order Confirmation - Branded Template',
      html: generateOrderConfirmationEmail(testOrderData),
    });
    
    console.log('✅ Branded email sent successfully:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Branded email template sent successfully!',
      messageId: info.messageId,
      email: email,
      template: 'Order Confirmation',
      branding: 'QYVE Branded Template',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Branded email test failed:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Branded email test failed: ${error.message}` 
    }, { status: 500 });
  }
}
