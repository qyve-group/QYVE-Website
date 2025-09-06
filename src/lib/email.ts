import nodemailer from 'nodemailer';
// import { generateEmailHTML } from './generateEmailHTML'; // your function

// ✅ Create transporter (Brevo SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface PaymentConfirmationProps {
  email: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  sessionId: string;
  orderItems: string;
  orderId: string;
}

export async function sendPaymentConfirmationEmail({
  email,
  customerName,
  amount,
  currency,
  paymentIntentId,
  sessionId,
  orderItems,
  orderId,
}: PaymentConfirmationProps) {
  try {
    const fromEmail = process.env.SMTP_USER;
    const companyName = process.env.COMPANY_NAME || 'QYVE';

    const emailContent = generateEmailHTML({
      customerName,
      amount,
      currency,
      paymentIntentId,
      sessionId,
      orderItems,
      orderId,
      companyName,
    });

    const mailOptions = {
      from: `"${companyName}" <${fromEmail}>`,
      to: email,
      subject: `Payment Confirmation - Thank You ${customerName}!`,
      html: emailContent,
    };

    console.log('📧 Sending email with SMTP:', mailOptions);

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 ✅ Email sent successfully:', result.messageId);

    return true;
  } catch (error) {
    console.error('📧 ❌ Failed to send email:', error);
    return false;
  }
}

// import nodemailer from 'nodemailer';
// // import SibApiV3Sdk from 'sib-api-v3-sdk';

// interface PaymentConfirmationProps {
//   email: string;
//   customerName: string;
//   amount: number;
//   currency: string;
//   paymentIntentId?: string;
//   sessionId?: string;
//   orderItems?: string;
//   orderId: string;
// }

// // Create transporter - supports multiple email services
// // const createTransporter = () => {
// //   // Check if using Gmail
// //   if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
// //     return nodemailer.createTransport({
// //       service: 'gmail',
// //       auth: {
// //         user: process.env.GMAIL_USER,
// //         pass: process.env.GMAIL_APP_PASSWORD,
// //       },
// //     });
// //   }

// //   // Check if using custom SMTP (Brevo)
// //   if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
// //     return nodemailer.createTransport({
// //       host: process.env.SMTP_HOST,
// //       port: 587,
// //       secure: false, // Use TLS
// //       auth: {
// //         user: process.env.SMTP_USER,
// //         pass: process.env.SMTP_PASS,
// //       },
// //     });
// //   }

// //   throw new Error('Email configuration not found. Please set up Gmail or SMTP credentials.');
// // };

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // must be false for 587
//   auth: {
//     user: process.env.SMTP_USER, // your Brevo login email
//     pass: process.env.SMTP_PASS  // your Brevo SMTP key
//   }
// });

// (async () => {
//   try {
//     const result = await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: "your-test-email@gmail.com",
//       subject: "✅ Test from Brevo SMTP",
//       text: "This is a test email from Brevo SMTP setup!"
//     });
//     console.log("📧 Success:", result);
//   } catch (err) {
//     console.error("❌ SMTP Failed:", err);
//   }
// })();

// export async function sendPaymentConfirmationEmail({
//   email,
//   customerName,
//   amount,
//   currency,
//   paymentIntentId,
//   sessionId,
//   orderItems,
//   orderId,
// }: PaymentConfirmationProps) {
//   try {
//     console.log('📧 Starting email send process...');
//     console.log('📧 Target email:', email);
//     console.log('📧 Customer name:', customerName);

//     const transporter = createTransporter();
//     console.log('📧 Transporter created successfully');

//     const fromEmail = process.env.SMTP_USER;
//     const companyName = process.env.COMPANY_NAME || 'QYVE';

//     console.log('📧 From email:', fromEmail);
//     console.log('📧 Company name:', companyName);

//     const emailContent = generateEmailHTML({
//       customerName,
//       amount,
//       currency,
//       paymentIntentId,
//       sessionId,
//       orderItems,
//       orderId,
//       companyName,
//     });

//     console.log('📧 Email HTML generated, length:', emailContent.length);

//     const mailOptions = {
//       from: `"${companyName}" <${fromEmail}>`,
//       to: email,
//       subject: `Payment Confirmation - Thank You ${customerName}!`,
//       html: emailContent,
//     };

//     console.log('📧 Sending email with options:', {
//       from: mailOptions.from,
//       to: mailOptions.to,
//       subject: mailOptions.subject,
//     });

//     const result = await transporter.sendMail(mailOptions);
//     console.log('📧 ✅ Email sent successfully! Result:', result);
//     console.log('📧 Message ID:', result.messageId);

//     return true;
//   } catch (error) {
//     console.error('📧 ❌ Failed to send confirmation email:', error);
//     console.error('📧 ❌ Error stack:', (error as Error).stack);
//     return false;
//   }
// }

// // export async function sendPaymentConfirmationEmail({
// //   email,
// //   customerName,
// //   amount,
// //   currency,
// //   paymentIntentId,
// //   sessionId,
// //   orderItems,
// //   orderId,
// // }: {
// //   email: string;
// //   customerName: string;
// //   amount: number;
// //   currency: string;
// //   paymentIntentId: string;
// //   sessionId: string;
// //   orderItems: string;
// //   orderId: string;
// // }): Promise<boolean> {
// //   try {
// //     // Configure Brevo
// //     const defaultClient = SibApiV3Sdk.ApiClient.instance;
// //     const apiKey = defaultClient.authentications['api-key'];
// //     apiKey.apiKey = process.env.BREVO_API_KEY as string;

// //     const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// //     const sendSmtpEmail = {
// //       sender: { email: 'your_verified_sender@example.com', name: 'Your Store' },
// //       to: [{ email, name: customerName }],
// //       subject: `Payment Confirmation - Thank You ${customerName}!`,
// //       htmlContent: `
// //         <h2>Hi ${customerName},</h2>
// //         <p>Thank you for your payment.</p>
// //         <p><b>Amount:</b> ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</p>
// //         <p><b>Order ID:</b> ${orderId}</p>
// //         <p><b>Items:</b></p>
// //         <pre>${orderItems}</pre>
// //         <p>Payment Intent: ${paymentIntentId}</p>
// //         <p>Session ID: ${sessionId}</p>
// //         <br/>
// //         <p>We appreciate your business!</p>
// //       `,
// //     };

// //     console.log('📧 Sending email with Brevo API:', {
// //       to: email,
// //       subject: sendSmtpEmail.subject,
// //     });

// //     const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
// //     console.log('📧 ✅ Email sent successfully! Result:', result.messageId);

// //     return true;
// //   } catch (error) {
// //     console.error('📧 ❌ Failed to send confirmation email:', error);
// //     return false;
// //   }
// // }

function generateEmailHTML({
  customerName,
  amount,
  currency,
  paymentIntentId,
  sessionId,
  orderItems,
  orderId,
  companyName,
}: {
  customerName: string;
  amount: number;
  currency: string;
  paymentIntentId?: string;
  sessionId?: string;
  orderItems?: string;
  orderId: string;
  companyName: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .payment-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #dee2e6; }
        .amount { font-size: 24px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Payment Successful!</h1>
          <p>Thank you for your purchase, ${customerName}</p>
        </div>

        <div class="content">
          <p>Great news! Your payment has been processed successfully. We're excited to get your order ready!</p>

          <div class="payment-details">
            <h3>📋 Order Details:</h3>
            <div class="amount">RM ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px 0;"><strong>Order ID:</strong></td>
                <td style="padding: 10px 0;">${orderId}</td>
              </tr>
              ${
                paymentIntentId
                  ? `
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px 0;"><strong>Payment ID:</strong></td>
                <td style="padding: 10px 0;">${paymentIntentId}</td>
              </tr>
              `
                  : ''
              }
              ${
                sessionId
                  ? `
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px 0;"><strong>Session ID:</strong></td>
                <td style="padding: 10px 0;">${sessionId}</td>
              </tr>
              `
                  : ''
              }
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 10px 0;"><strong>Date:</strong></td>
                <td style="padding: 10px 0;">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>Items:</strong></td>
                <td style="padding: 10px 0;">${orderItems}</td>
              </tr>
            </table>
          </div>

          <h3>📦 What's Next?</h3>
          <ul>
            <li><strong>Processing:</strong> We'll prepare your order within 1-2 business days</li>
            <li><strong>Shipping:</strong> You'll receive tracking information via email</li>
            <li><strong>Delivery:</strong> Estimated delivery within Malaysia: 3-5 business days</li>
          </ul>

          <p>You'll receive another email with tracking information once your order ships.</p>

          <div style="text-align: center; margin: 30px 0;">
            <p><strong>Need help?</strong> We're here for you!</p>
            <p>Contact us at <a href="mailto:support@qyve.com" style="color: #007bff;">support@qyve.com</a></p>
            <p>or visit our website</p>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated confirmation email from ${companyName}.</p>
          <p>Please keep this email for your records.</p>
          <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
