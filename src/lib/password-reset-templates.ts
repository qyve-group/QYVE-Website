// Password Reset Email Templates for QYVE E-commerce Platform
// Professional HTML email templates with QYVE branding for password reset functionality

export interface PasswordResetData {
  customerName: string;
  customerEmail: string;
  resetLink: string;
  expiryTime: string; // e.g., "1 hour"
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

// Password Reset Request Email Template
export const generatePasswordResetEmail = (data: PasswordResetData): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your QYVE Password</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: ${QYVE_BRAND.text}; margin: 0; padding: 0; background-color: ${QYVE_BRAND.light}; }
      .container { max-width: 600px; margin: 0 auto; background-color: ${QYVE_BRAND.white}; }
      .header { background-color: ${QYVE_BRAND.primary}; color: ${QYVE_BRAND.white}; padding: 30px; text-align: center; }
      .content { padding: 30px; }
      .btn { display: inline-block; background-color: ${QYVE_BRAND.secondary}; color: ${QYVE_BRAND.white}; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
      .btn:hover { background-color: ${QYVE_BRAND.accent}; }
      .footer { background-color: ${QYVE_BRAND.light}; padding: 20px; text-align: center; font-size: 14px; color: ${QYVE_BRAND.textLight}; }
      .security-notice { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .logo { width: 60px; height: 60px; background-color: ${QYVE_BRAND.white}; border-radius: 50%; padding: 10px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 40px; height: 40px; object-fit: contain;" />
        </div>
        <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">QYVE Account Security</p>
      </div>
      
      <div class="content">
        <h2>Hello ${data.customerName},</h2>
        
        <p>We received a request to reset your password for your QYVE account. If you made this request, click the button below to reset your password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" class="btn">Reset My Password</a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: ${QYVE_BRAND.light}; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
          ${data.resetLink}
        </p>
        
        <div class="security-notice">
          <h3 style="margin-top: 0; color: #856404;">🔒 Security Information</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>This link will expire in <strong>${data.expiryTime}</strong> for your security</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Your password will not be changed until you click the link above</li>
            <li>For your security, never share this link with anyone</li>
          </ul>
        </div>
        
        <p>If you're having trouble with the link above, you can also:</p>
        <ul>
          <li>Visit our <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/forgot-pass">password reset page</a> directly</li>
          <li>Contact our support team at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></li>
        </ul>
        
        <p>Thank you for being part of the QYVE community!</p>
        
        <p>Best regards,<br><strong>The QYVE Team</strong></p>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

// Password Reset Confirmation Email Template
export const generatePasswordResetConfirmationEmail = (data: { customerName: string; customerEmail: string; resetTime: string }): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Successfully Reset - QYVE</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: ${QYVE_BRAND.text}; margin: 0; padding: 0; background-color: ${QYVE_BRAND.light}; }
      .container { max-width: 600px; margin: 0 auto; background-color: ${QYVE_BRAND.white}; }
      .header { background-color: ${QYVE_BRAND.primary}; color: ${QYVE_BRAND.white}; padding: 30px; text-align: center; }
      .content { padding: 30px; }
      .btn { display: inline-block; background-color: ${QYVE_BRAND.secondary}; color: ${QYVE_BRAND.white}; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
      .btn:hover { background-color: ${QYVE_BRAND.accent}; }
      .footer { background-color: ${QYVE_BRAND.light}; padding: 20px; text-align: center; font-size: 14px; color: ${QYVE_BRAND.textLight}; }
      .success-notice { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .logo { width: 60px; height: 60px; background-color: ${QYVE_BRAND.white}; border-radius: 50%; padding: 10px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 40px; height: 40px; object-fit: contain;" />
        </div>
        <h1 style="margin: 0; font-size: 28px;">Password Successfully Reset</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">QYVE Account Security</p>
      </div>
      
      <div class="content">
        <h2>Hello ${data.customerName},</h2>
        
        <div class="success-notice">
          <h3 style="margin-top: 0; color: #155724;">✅ Password Successfully Updated</h3>
          <p style="margin: 10px 0;">Your QYVE account password has been successfully reset on ${data.resetTime}.</p>
        </div>
        
        <p>Your account security is important to us. Here's what happened:</p>
        <ul>
          <li>Your password was successfully changed</li>
          <li>All active sessions have been logged out for security</li>
          <li>You can now log in with your new password</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/login" class="btn">Log In to Your Account</a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: ${QYVE_BRAND.primary};">🔒 Security Tips</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Use a strong, unique password</li>
            <li>Never share your password with anyone</li>
            <li>Log out from shared devices</li>
            <li>Enable two-factor authentication if available</li>
          </ul>
        </div>
        
        <p><strong>Didn't make this change?</strong> If you didn't reset your password, please contact our support team immediately at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a>.</p>
        
        <p>Thank you for keeping your QYVE account secure!</p>
        
        <p>Best regards,<br><strong>The QYVE Team</strong></p>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 20px;">
          <div style="display: inline-block; width: 40px; height: 40px; background-color: white; border-radius: 50%; text-align: center; line-height: 40px; margin-bottom: 10px; padding: 5px;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://qyveofficial.com'}/qyve-logo.png" alt="QYVE Logo" style="width: 30px; height: 30px; object-fit: contain;" />
          </div>
        </div>
        <p><strong>QYVE</strong> - Premium Sports Apparel</p>
        <p>Questions? Contact us at <a href="mailto:support@qyveofficial.com">support@qyveofficial.com</a></p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 12px; color: ${QYVE_BRAND.textLight};">© 2025 QYVE. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;
