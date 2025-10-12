// Email Templates for QYVE E-commerce Platform
// Professional HTML email templates with QYVE branding

export interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface RefundData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  refundAmount: number;
  currency: string;
  reason: string;
  processedDate: string;
}

// QYVE Brand Colors and Styles
const QYVE_BRAND = {
  primary: '#1a1a1a',      // QYVE Black
  secondary: '#ff6b35',    // QYVE Orange
  accent: '#f7931e',       // QYVE Gold
  light: '#f8f9fa',        // Light Gray
  white: '#ffffff',        // White
  text: '#333333',         // Dark Gray
  textLight: '#6c757d',    // Medium Gray
};

// Base template styles with QYVE branding
const getBaseStyles = () => `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: ${QYVE_BRAND.text}; 
      background-color: ${QYVE_BRAND.light};
    }
    .email-container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: ${QYVE_BRAND.white};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid #e9ecef;
    }
    .header { 
      background: linear-gradient(135deg, ${QYVE_BRAND.primary} 0%, #2c2c2c 100%);
      color: ${QYVE_BRAND.white}; 
      text-align: center; 
      padding: 40px 20px;
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, ${QYVE_BRAND.secondary} 0%, ${QYVE_BRAND.accent} 100%);
    }
           .logo {
             width: 80px;
             height: 80px;
             margin: 0 auto 20px;
             background: ${QYVE_BRAND.white};
             border-radius: 50%;
             display: inline-block;
             text-align: center;
             line-height: 80px;
             box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
           }
    .header h1 { 
      font-size: 32px; 
      font-weight: 800; 
      margin-bottom: 8px;
      letter-spacing: -1px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .header p { 
      font-size: 16px; 
      opacity: 0.9;
      font-weight: 500;
    }
    .content { 
      padding: 40px 30px; 
    }
    .order-details { 
      background: linear-gradient(135deg, ${QYVE_BRAND.light} 0%, #ffffff 100%);
      padding: 25px; 
      border-radius: 12px; 
      margin: 25px 0;
      border-left: 4px solid ${QYVE_BRAND.secondary};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    .amount { 
      font-size: 36px; 
      font-weight: 800; 
      color: ${QYVE_BRAND.secondary}; 
      text-align: center; 
      margin: 20px 0;
      letter-spacing: -1px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background-color: ${QYVE_BRAND.white};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      border: 1px solid #e9ecef;
    }
    .items-table th {
      background: linear-gradient(135deg, ${QYVE_BRAND.primary} 0%, #2c2c2c 100%);
      color: ${QYVE_BRAND.white};
      padding: 18px 15px;
      text-align: left;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }
    .btn { 
      display: inline-block; 
      padding: 16px 32px; 
      background: linear-gradient(135deg, ${QYVE_BRAND.secondary} 0%, ${QYVE_BRAND.accent} 100%);
      color: ${QYVE_BRAND.white}; 
      text-decoration: none; 
      border-radius: 8px; 
      margin: 15px 0;
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
      transition: all 0.3s ease;
    }
    .btn:hover { 
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding: 40px 30px;
      border-top: 1px solid #e9ecef; 
      font-size: 14px; 
      color: ${QYVE_BRAND.textLight};
      background: linear-gradient(135deg, ${QYVE_BRAND.light} 0%, #ffffff 100%);
    }
    .footer a { 
      color: ${QYVE_BRAND.secondary}; 
      text-decoration: none; 
      font-weight: 600;
    }
    .footer a:hover {
      color: ${QYVE_BRAND.accent};
    }
    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .status-confirmed { 
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
      color: #155724; 
      border: 1px solid #c3e6cb;
    }
    .status-shipped { 
      background: linear-gradient(135deg, #cce5ff 0%, #b3d9ff 100%); 
      color: #004085; 
      border: 1px solid #b3d9ff;
    }
    .status-delivered { 
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); 
      color: #0c5460; 
      border: 1px solid #bee5eb;
    }
    .status-cancelled { 
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); 
      color: #721c24; 
      border: 1px solid #f5c6cb;
    }
    .tracking-info {
      background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
      border: 2px solid ${QYVE_BRAND.secondary};
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
    }
    .tracking-number {
      font-family: 'Courier New', monospace;
      font-size: 20px;
      font-weight: 800;
      color: ${QYVE_BRAND.primary};
      background: linear-gradient(135deg, ${QYVE_BRAND.white} 0%, ${QYVE_BRAND.light} 100%);
      padding: 15px 20px;
      border-radius: 8px;
      border: 2px solid ${QYVE_BRAND.secondary};
      display: inline-block;
      margin: 10px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      letter-spacing: 1px;
    }
    @media (max-width: 600px) {
      .email-container { margin: 0; border-radius: 0; }
      .content { padding: 20px 15px; }
      .header { padding: 20px 15px; }
      .header h1 { font-size: 24px; }
      .amount { font-size: 28px; }
      .items-table { font-size: 14px; }
      .items-table th, .items-table td { padding: 10px; }
    }
  </style>
`;

// Order Confirmation Email Template
export const generateOrderConfirmationEmail = (data: OrderData) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - QYVE</title>
    ${getBaseStyles()}
  </head>
  <body>
    <div class="email-container">
             <div class="header">
               <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                 <tr>
                   <td align="center">
                     <table cellpadding="0" cellspacing="0">
                       <tr>
                         <td style="width: 80px; height: 80px; background-color: white; border-radius: 50%; text-align: center; vertical-align: middle; padding: 10px;">
                           <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 60px; height: 60px; object-fit: contain;" />
                         </td>
                       </tr>
                     </table>
                   </td>
                 </tr>
               </table>
               <h1>🎉 Order Confirmed!</h1>
               <p>Thank you for choosing QYVE</p>
             </div>
      
      <div class="content">
        <p>Hi <strong>${data.customerName}</strong>,</p>
        
        <p>We're excited to confirm your order! Your items are being prepared and will be shipped soon.</p>
        
        <div class="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span class="status-badge status-confirmed">Confirmed</span></p>
        </div>
        
        <div class="amount">RM ${data.totalAmount.toFixed(2)}</div>
        
        <h3>Items Ordered</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Size</th>
              <th>Color</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.size || 'N/A'}</td>
                <td>${item.color || 'N/A'}</td>
                <td>${item.quantity}</td>
                <td>RM ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
        
        <div class="order-details">
          <h3>Shipping Address</h3>
          <p>
            ${data.shippingAddress.line1}<br>
            ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br>` : ''}
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
            ${data.shippingAddress.country}
          </p>
        </div>
        
        <p>We'll send you a shipping confirmation with tracking information once your order is on its way.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/my-orders" class="btn">Track Your Order</a>
        </div>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <p>Follow us on social media for updates and new arrivals!</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

// Payment Confirmation Email Template
export const generatePaymentConfirmationEmail = (data: OrderData) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation - QYVE</title>
    ${getBaseStyles()}
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 80px; height: 80px; background-color: white; border-radius: 50%; text-align: center; vertical-align: middle; padding: 10px;">
                    <img src="https://qyveofficial.com/images/QyveLogo_logo_black_rgb.png" alt="QYVE Logo" style="width: 60px; height: 60px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <h1>💳 Payment Successful!</h1>
        <p>Your payment has been processed</p>
      </div>
      
      <div class="content">
        <p>Hi <strong>${data.customerName}</strong>,</p>
        
        <p>Great news! Your payment has been successfully processed and your order is confirmed.</p>
        
        <div class="order-details">
          <h3>Payment Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Amount Paid:</strong> RM ${data.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> Credit/Debit Card</p>
        </div>
        
        <div class="amount">RM ${data.totalAmount.toFixed(2)}</div>
        
        <p>Your order is now being prepared for shipment. You'll receive a shipping confirmation email with tracking details once your items are on their way.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/my-orders" class="btn">View Order Details</a>
        </div>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your payment? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

// Shipping Notification Email Template
export const generateShippingNotificationEmail = (data: OrderData) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Shipped - QYVE</title>
    ${getBaseStyles()}
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 80px; height: 80px; background-color: white; border-radius: 50%; text-align: center; vertical-align: middle; padding: 10px;">
                    <img src="https://qyveofficial.com/images/QyveLogo_logo_black_rgb.png" alt="QYVE Logo" style="width: 60px; height: 60px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <h1>📦 Your Order Has Shipped!</h1>
        <p>Track your package</p>
      </div>
      
      <div class="content">
        <p>Hi <strong>${data.customerName}</strong>,</p>
        
        <p>Exciting news! Your order has been shipped and is on its way to you.</p>
        
        <div class="tracking-info">
          <h3>📦 Tracking Information</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Tracking Number:</strong></p>
          <div class="tracking-number">${data.trackingNumber}</div>
          <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
        </div>
        
        <div class="order-details">
          <h3>Shipping Address</h3>
          <p>
            ${data.shippingAddress.line1}<br>
            ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br>` : ''}
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
            ${data.shippingAddress.country}
          </p>
        </div>
        
        <h3>Items Shipped</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Size</th>
              <th>Color</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.size || 'N/A'}</td>
                <td>${item.color || 'N/A'}</td>
                <td>${item.quantity}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
        
        <p>You can track your package using the tracking number above. Most packages arrive within 3-5 business days.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.easyparcel.com/track" class="btn" target="_blank">Track Package</a>
        </div>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your shipment? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

// Order Cancellation Email Template
export const generateOrderCancellationEmail = (
  data: OrderData & { reason: string },
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled - QYVE</title>
    ${getBaseStyles()}
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 80px; height: 80px; background-color: white; border-radius: 50%; text-align: center; vertical-align: middle; padding: 10px;">
                    <img src="https://qyveofficial.com/images/QyveLogo_logo_black_rgb.png" alt="QYVE Logo" style="width: 60px; height: 60px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <h1>❌ Order Cancelled</h1>
        <p>Your order has been cancelled</p>
      </div>
      
      <div class="content">
        <p>Hi <strong>${data.customerName}</strong>,</p>
        
        <p>We're sorry to inform you that your order has been cancelled.</p>
        
        <div class="order-details">
          <h3>Cancellation Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p><strong>Status:</strong> <span class="status-badge status-cancelled">Cancelled</span></p>
        </div>
        
        <div class="amount">RM ${data.totalAmount.toFixed(2)}</div>
        
        <p>If you were charged for this order, a full refund will be processed within 3-5 business days to your original payment method.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/shop" class="btn">Continue Shopping</a>
        </div>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your cancellation? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

// Refund Confirmation Email Template
export const generateRefundConfirmationEmail = (data: RefundData) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Processed - QYVE</title>
    ${getBaseStyles()}
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 80px; height: 80px; background-color: white; border-radius: 50%; text-align: center; vertical-align: middle; padding: 10px;">
                    <img src="https://qyveofficial.com/images/QyveLogo_logo_black_rgb.png" alt="QYVE Logo" style="width: 60px; height: 60px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <h1>💰 Refund Processed</h1>
        <p>Your refund has been processed</p>
      </div>
      
      <div class="content">
        <p>Hi <strong>${data.customerName}</strong>,</p>
        
        <p>Your refund has been successfully processed and will appear in your account within 3-5 business days.</p>
        
        <div class="order-details">
          <h3>Refund Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Refund Amount:</strong> RM ${data.refundAmount.toFixed(2)}</p>
          <p><strong>Processed Date:</strong> ${data.processedDate}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
        
        <div class="amount">RM ${data.refundAmount.toFixed(2)}</div>
        
        <p>The refund will be credited to your original payment method. Please allow 3-5 business days for the funds to appear in your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/shop" class="btn">Continue Shopping</a>
        </div>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your refund? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;
