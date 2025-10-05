// Enhanced Email Service for QYVE E-commerce Platform
// Handles all transactional emails with proper error handling and retry logic

import { brevoClient, SendSmtpEmail } from '@/libs/brevo';

import type { OrderData, RefundData } from './email-templates';
import {
  generateOrderCancellationEmail,
  generateOrderConfirmationEmail,
  generatePaymentConfirmationEmail,
  generateRefundConfirmationEmail,
  generateShippingNotificationEmail,
} from './email-templates';

// Email service configuration
const EMAIL_CONFIG = {
  fromEmail: process.env.SMTP_USER || 'noreply@qyve.com',
  fromName: 'QYVE',
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
}

// Email sending result
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount?: number;
}

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

      const email = new SendSmtpEmail();
      email.to = [{ email: data.customerEmail, name: data.customerName }];
      email.subject = `Order Confirmation - ${data.orderId}`;
      email.htmlContent = generateOrderConfirmationEmail(data);
      email.sender = {
        email: EMAIL_CONFIG.fromEmail,
        name: EMAIL_CONFIG.fromName,
      };

      const result = await this.sendWithRetry(email);

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

      const email = new SendSmtpEmail();
      email.to = [{ email: data.customerEmail, name: data.customerName }];
      email.subject = `Payment Confirmation - ${data.orderId}`;
      email.htmlContent = generatePaymentConfirmationEmail(data);
      email.sender = {
        email: EMAIL_CONFIG.fromEmail,
        name: EMAIL_CONFIG.fromName,
      };

      const result = await this.sendWithRetry(email);

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

      const email = new SendSmtpEmail();
      email.to = [{ email: data.customerEmail, name: data.customerName }];
      email.subject = `Your Order Has Shipped - ${data.orderId}`;
      email.htmlContent = generateShippingNotificationEmail(data);
      email.sender = {
        email: EMAIL_CONFIG.fromEmail,
        name: EMAIL_CONFIG.fromName,
      };

      const result = await this.sendWithRetry(email);

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

      const email = new SendSmtpEmail();
      email.to = [{ email: data.customerEmail, name: data.customerName }];
      email.subject = `Order Cancelled - ${data.orderId}`;
      email.htmlContent = generateOrderCancellationEmail(data);
      email.sender = {
        email: EMAIL_CONFIG.fromEmail,
        name: EMAIL_CONFIG.fromName,
      };

      const result = await this.sendWithRetry(email);

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

      const email = new SendSmtpEmail();
      email.to = [{ email: data.customerEmail, name: data.customerName }];
      email.subject = `Refund Processed - ${data.orderId}`;
      email.htmlContent = generateRefundConfirmationEmail(data);
      email.sender = {
        email: EMAIL_CONFIG.fromEmail,
        name: EMAIL_CONFIG.fromName,
      };

      const result = await this.sendWithRetry(email);

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

  // Send email with retry logic
  private async sendWithRetry(
    email: SendSmtpEmail,
    attempt: number = 1,
  ): Promise<EmailResult> {
    try {
      const result = await brevoClient.sendTransacEmail(email);

      return {
        success: true,
        messageId: result.messageId,
        retryCount: attempt - 1,
      };
    } catch (error) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error);

      if (attempt < EMAIL_CONFIG.retryAttempts) {
        console.log(
          `🔄 Retrying email send (attempt ${attempt + 1}/${EMAIL_CONFIG.retryAttempts})...`,
        );
        await this.delay(EMAIL_CONFIG.retryDelay * attempt);
        return this.sendWithRetry(email, attempt + 1);
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
