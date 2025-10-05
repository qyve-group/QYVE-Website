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

// Base template styles
const getBaseStyles = () => `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #333; 
      background-color: #f8f9fa;
    }
    .email-container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
      color: white; 
      text-align: center; 
      padding: 30px 20px;
    }
    .header h1 { 
      font-size: 28px; 
      font-weight: 700; 
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p { 
      font-size: 16px; 
      opacity: 0.9;
    }
    .content { 
      padding: 40px 30px; 
    }
    .order-details { 
      background-color: #f8f9fa; 
      padding: 25px; 
      border-radius: 8px; 
      margin: 25px 0;
      border-left: 4px solid #1a1a1a;
    }
    .amount { 
      font-size: 32px; 
      font-weight: 700; 
      color: #28a745; 
      text-align: center; 
      margin: 20px 0;
      letter-spacing: -1px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .items-table th {
      background-color: #1a1a1a;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
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
      padding: 14px 28px; 
      background-color: #1a1a1a; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 15px 0;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }
    .btn:hover { 
      background-color: #333333; 
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding-top: 30px; 
      border-top: 1px solid #e9ecef; 
      font-size: 14px; 
      color: #6c757d;
      background-color: #f8f9fa;
      padding: 30px;
    }
    .footer a { 
      color: #1a1a1a; 
      text-decoration: none; 
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-confirmed { background-color: #d4edda; color: #155724; }
    .status-shipped { background-color: #cce5ff; color: #004085; }
    .status-delivered { background-color: #d1ecf1; color: #0c5460; }
    .status-cancelled { background-color: #f8d7da; color: #721c24; }
    .tracking-info {
      background-color: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .tracking-number {
      font-family: 'Courier New', monospace;
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      background-color: white;
      padding: 10px;
      border-radius: 4px;
      border: 2px solid #1a1a1a;
      display: inline-block;
      margin: 10px 0;
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
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions? Contact us at <a href="mailto:support@qyve.com">support@qyve.com</a></p>
        <p>Follow us on social media for updates and new arrivals!</p>
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
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your payment? Contact us at <a href="mailto:support@qyve.com">support@qyve.com</a></p>
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
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your shipment? Contact us at <a href="mailto:support@qyve.com">support@qyve.com</a></p>
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
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your cancellation? Contact us at <a href="mailto:support@qyve.com">support@qyve.com</a></p>
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
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions about your refund? Contact us at <a href="mailto:support@qyve.com">support@qyve.com</a></p>
      </div>
    </div>
  </body>
  </html>
`;
