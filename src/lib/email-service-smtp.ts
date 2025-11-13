// SMTP-based Email Service for QYVE E-commerce Platform
// Uses Nodemailer with Brevo SMTP for reliable email delivery

import nodemailer from 'nodemailer';
import type { OrderData, RefundData, PreOrderData } from './email-templates';
import {
  generateOrderCancellationEmail,
  generateOrderConfirmationEmail,
  generatePaymentConfirmationEmail,
  generatePreOrderConfirmationEmail,
  generateRefundConfirmationEmail,
  generateShippingNotificationEmail,
} from './email-templates';

// Email service configuration
const EMAIL_CONFIG = {
  fromEmail: 'noreply@qyveofficial.com', // Use the verified sender
  fromName: 'QYVE Team',
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Email types for tracking
export enum EmailType {
  ORDER_CONFIRMATION = 'order_confirmation',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  SHIPPING_NOTIFICATION = 'shipping_notification',
  ORDER_CANCELLATION = 'order_cancellation',
  REFUND_CONFIRMATION = 'refund_confirmation',
  PRE_ORDER_CONFIRMATION = 'pre_order_confirmation',
}

// Email sending result
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount?: number;
}

// Create SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Enhanced email service class
export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send order confirmation email
  async sendOrderConfirmation(data: OrderData): Promise<EmailResult> {
    try {
      console.log(
        '📧 Sending order confirmation email to:',
        data.customerEmail,
      );

      const transporter = createTransporter();
      const mailOptions = {
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
        to: data.customerEmail,
        subject: `Order Confirmation - ${data.orderId}`,
        html: generateOrderConfirmationEmail(data),
      };

      const result = await this.sendWithRetry(transporter, mailOptions);

      if (result.success) {
        console.log('✅ Order confirmation email sent successfully');
        await this.logEmailSent(
          EmailType.ORDER_CONFIRMATION,
          data.customerEmail,
          data.orderId,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(data: OrderData): Promise<EmailResult> {
    try {
      console.log(
        '📧 Sending payment confirmation email to:',
        data.customerEmail,
      );

      const transporter = createTransporter();
      const mailOptions = {
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
        to: data.customerEmail,
        subject: `Payment Confirmation - ${data.orderId}`,
        html: generatePaymentConfirmationEmail(data),
      };

      const result = await this.sendWithRetry(transporter, mailOptions);

      if (result.success) {
        console.log('✅ Payment confirmation email sent successfully');
        await this.logEmailSent(
          EmailType.PAYMENT_CONFIRMATION,
          data.customerEmail,
          data.orderId,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send payment confirmation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send shipping notification email
  async sendShippingNotification(data: OrderData): Promise<EmailResult> {
    try {
      console.log(
        '📧 Sending shipping notification email to:',
        data.customerEmail,
      );

      const transporter = createTransporter();
      const mailOptions = {
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
        to: data.customerEmail,
        subject: `Your Order Has Shipped - ${data.orderId}`,
        html: generateShippingNotificationEmail(data),
      };

      const result = await this.sendWithRetry(transporter, mailOptions);

      if (result.success) {
        console.log('✅ Shipping notification email sent successfully');
        await this.logEmailSent(
          EmailType.SHIPPING_NOTIFICATION,
          data.customerEmail,
          data.orderId,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send shipping notification email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send order cancellation email
  async sendOrderCancellation(
    data: OrderData & { reason: string },
  ): Promise<EmailResult> {
    try {
      console.log(
        '📧 Sending order cancellation email to:',
        data.customerEmail,
      );

      const transporter = createTransporter();
      const mailOptions = {
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
        to: data.customerEmail,
        subject: `Order Cancelled - ${data.orderId}`,
        html: generateOrderCancellationEmail(data),
      };

      const result = await this.sendWithRetry(transporter, mailOptions);

      if (result.success) {
        console.log('✅ Order cancellation email sent successfully');
        await this.logEmailSent(
          EmailType.ORDER_CANCELLATION,
          data.customerEmail,
          data.orderId,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send order cancellation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send refund confirmation email
  async sendRefundConfirmation(data: RefundData): Promise<EmailResult> {
    try {
      console.log(
        '📧 Sending refund confirmation email to:',
        data.customerEmail,
      );

      const transporter = createTransporter();
      const mailOptions = {
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
        to: data.customerEmail,
        subject: `Refund Processed - ${data.orderId}`,
        html: generateRefundConfirmationEmail(data),
      };

      const result = await this.sendWithRetry(transporter, mailOptions);

      if (result.success) {
        console.log('✅ Refund confirmation email sent successfully');
        await this.logEmailSent(
          EmailType.REFUND_CONFIRMATION,
          data.customerEmail,
          data.orderId,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send refund confirmation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send pre-order confirmation email
  async sendPreOrderConfirmation(data: PreOrderData): Promise<EmailResult> {
    try {
      console.log(
        '📧 Sending pre-order confirmation email to:',
        data.customerEmail,
      );

      const transporter = createTransporter();
      const mailOptions = {
        from: `"${EMAIL_CONFIG.fromName}" <${EMAIL_CONFIG.fromEmail}>`,
        to: data.customerEmail,
        subject: `Pre-Order Confirmed - ${data.productName}`,
        html: generatePreOrderConfirmationEmail(data),
      };

      const result = await this.sendWithRetry(transporter, mailOptions);

      if (result.success) {
        console.log('✅ Pre-order confirmation email sent successfully');
        await this.logEmailSent(
          EmailType.PRE_ORDER_CONFIRMATION,
          data.customerEmail,
          data.preOrderId,
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send pre-order confirmation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send email with retry logic
  private async sendWithRetry(
    transporter: nodemailer.Transporter,
    mailOptions: any,
    attempt: number = 1,
  ): Promise<EmailResult> {
    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        retryCount: attempt - 1,
      };
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error);

      if (attempt < EMAIL_CONFIG.retryAttempts) {
        console.log(
          `🔄 Retrying email send (attempt ${attempt + 1}/${EMAIL_CONFIG.retryAttempts})...`,
        );
        await this.delay(EMAIL_CONFIG.retryDelay * attempt);
        return this.sendWithRetry(transporter, mailOptions, attempt + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount: attempt,
      };
    }
  }

  // Delay utility for retry logic
  // eslint-disable-next-line class-methods-use-this
  private delay(ms: number): Promise<void> {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Log email sent to database (optional)
  // eslint-disable-next-line class-methods-use-this
  private async logEmailSent(
    type: EmailType,
    email: string,
    orderId: string,
  ): Promise<void> {
    try {
      // This could be enhanced to log to a database table for email tracking
      console.log(
        `📊 Email logged: ${type} sent to ${email} for order ${orderId}`,
      );
    } catch (error) {
      console.error('❌ Failed to log email:', error);
    }
  }

  // Test email functionality
  async sendTestEmail(testEmail: string): Promise<EmailResult> {
    try {
      console.log('📧 Sending test email to:', testEmail);

      const testData: OrderData = {
        orderId: 'TEST-ORDER-123',
        customerName: 'Test Customer',
        customerEmail: testEmail,
        totalAmount: 99.99,
        currency: 'MYR',
        items: [
          {
            name: 'Test Product',
            quantity: 1,
            price: 99.99,
            size: 'M',
            color: 'Black',
          },
        ],
        shippingAddress: {
          line1: '123 Test Street',
          city: 'Kuala Lumpur',
          state: 'Kuala Lumpur',
          postalCode: '50000',
          country: 'Malaysia',
        },
      };

      return await this.sendOrderConfirmation(testData);
    } catch (error) {
      console.error('❌ Failed to send test email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();

// Convenience functions for direct use
export const sendOrderConfirmation = (data: OrderData) =>
  emailService.sendOrderConfirmation(data);
export const sendPaymentConfirmation = (data: OrderData) =>
  emailService.sendPaymentConfirmation(data);
export const sendShippingNotification = (data: OrderData) =>
  emailService.sendShippingNotification(data);
export const sendOrderCancellation = (data: OrderData & { reason: string }) =>
  emailService.sendOrderCancellation(data);
export const sendRefundConfirmation = (data: RefundData) =>
  emailService.sendRefundConfirmation(data);
export const sendTestEmail = (testEmail: string) =>
  emailService.sendTestEmail(testEmail);
