import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationEmail } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Simple Order Confirmation...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing order confirmation to:', email);
    
    // Test data
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
        }
      ],
      shippingAddress: {
        line1: '123 QYVE Street',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postalCode: '50000',
        country: 'Malaysia'
      }
    };
    
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
    
    console.log('📤 Sending order confirmation...');
    
    // Send email
    const info = await transporter.sendMail({
      from: `"QYVE Team" <noreply@qyveofficial.com>`,
      to: email,
      subject: '🎉 QYVE Order Confirmation - Test',
      html: generateOrderConfirmationEmail(testOrderData),
    });
    
    console.log('✅ Order confirmation sent:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Order confirmation email sent successfully!',
      messageId: info.messageId,
      email: email,
      template: 'Order Confirmation',
      orderId: testOrderData.orderId,
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
