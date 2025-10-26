import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/libs/supabaseClient';
import nodemailer from 'nodemailer';
import { generatePasswordResetEmail, generatePasswordResetConfirmationEmail } from '@/lib/password-reset-templates';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (type === 'request') {
      // Handle password reset request
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
          { error: 'Failed to send password reset email' },
          { status: 500 }
        );
      }

      // Send branded email notification
      try {
        const emailTemplate = generatePasswordResetEmail({
          customerName: email.split('@')[0],
          customerEmail: email,
          resetLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
          expiryTime: '1 hour'
        });

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          secure: process.env.EMAIL_SERVER_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Reset Your QYVE Password',
          html: emailTemplate,
        });
      } catch (emailError) {
        console.error('Failed to send branded email:', emailError);
        // Don't fail the request if branded email fails
      }

      return NextResponse.json({
        message: 'Password reset email sent successfully',
        success: true
      });

    } else if (type === 'confirmation') {
      // Handle password reset confirmation
      const { customerName, customerEmail } = await request.json();

      if (!customerName || !customerEmail) {
        return NextResponse.json(
          { error: 'Customer name and email are required' },
          { status: 400 }
        );
      }

      const emailTemplate = generatePasswordResetConfirmationEmail({
        customerName,
        customerEmail,
        resetTime: new Date().toLocaleString('en-MY', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kuala_Lumpur'
        })
      });

      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: process.env.EMAIL_SERVER_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: customerEmail,
        subject: 'Password Successfully Reset - QYVE',
        html: emailTemplate,
      });

      return NextResponse.json({
        message: 'Password reset confirmation email sent successfully',
        success: true
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
