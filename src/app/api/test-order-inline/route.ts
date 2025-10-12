import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Order Confirmation with Inline Template...');
    
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
    
    // Inline branded template
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; text-align: center; padding: 40px 20px; border-radius: 12px 12px 0 0; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);"></div>
          <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: #1a1a1a; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);">Q</div>
          <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 8px; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">🎉 Order Confirmed!</h1>
          <p style="font-size: 16px; opacity: 0.9; font-weight: 500;">Thank you for choosing QYVE</p>
        </div>
        
        <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hi <strong>${testOrderData.customerName}</strong>,</p>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">We're excited to confirm your order! Your items are being prepared and will be shipped soon.</p>
          
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ff6b35; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${testOrderData.orderId}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="display: inline-block; padding: 8px 16px; border-radius: 25px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); color: #155724; border: 1px solid #c3e6cb; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">Confirmed</span></p>
          </div>
          
          <div style="font-size: 36px; font-weight: 800; color: #ff6b35; text-align: center; margin: 20px 0; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">RM ${testOrderData.totalAmount.toFixed(2)}</div>
          
          <h3 style="color: #333; margin: 30px 0 15px 0;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); border: 1px solid #e9ecef;">
            <thead>
              <tr>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; padding: 18px 15px; text-align: left; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; padding: 18px 15px; text-align: left; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Size</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; padding: 18px 15px; text-align: left; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Color</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; padding: 18px 15px; text-align: left; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                <th style="background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%); color: white; padding: 18px 15px; text-align: left; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${testOrderData.items.map(item => `
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e9ecef;"><strong>${item.name}</strong></td>
                  <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">${item.size || 'N/A'}</td>
                  <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">${item.color || 'N/A'}</td>
                  <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">${item.quantity}</td>
                  <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">RM ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #ff6b35; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
            <p style="margin: 5px 0;">
              ${testOrderData.shippingAddress.line1}<br>
              ${testOrderData.shippingAddress.city}, ${testOrderData.shippingAddress.state} ${testOrderData.shippingAddress.postalCode}<br>
              ${testOrderData.shippingAddress.country}
            </p>
          </div>
          
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">We'll send you a shipping confirmation with tracking information once your order is on its way.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; text-decoration: none; border-radius: 8px; margin: 15px 0; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);">Track Your Order</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 40px 30px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 0 0 12px 12px;">
          <div style="margin-bottom: 20px;">
            <div style="display: inline-block; width: 40px; height: 40px; background: #1a1a1a; border-radius: 50%; color: white; font-size: 20px; font-weight: 900; line-height: 40px; text-align: center; margin-bottom: 10px;">Q</div>
          </div>
          <p><strong>QYVE</strong> - Premium Sports Apparel</p>
          <p>Questions? Contact us at <a href="mailto:support@qyveofficial.com" style="color: #ff6b35; text-decoration: none; font-weight: 600;">support@qyveofficial.com</a></p>
          <p>Follow us on social media for updates and new arrivals!</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="font-size: 12px; color: #6c757d;">© 2025 QYVE. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: `"QYVE Team" <noreply@qyveofficial.com>`,
      to: email,
      subject: '🎉 QYVE Order Confirmation - Branded Template',
      html: htmlTemplate,
    });
    
    console.log('✅ Order confirmation sent:', info.messageId);
    
    return NextResponse.json({
      success: true,
      message: 'Order confirmation email sent successfully!',
      messageId: info.messageId,
      email: email,
      template: 'Order Confirmation (Inline)',
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
