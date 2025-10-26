'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { generatePasswordResetEmail, generatePasswordResetConfirmationEmail } from '@/lib/password-reset-templates';

const TestForgotPasswordPage = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'email-sent' | 'reset' | 'success'>('form');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendReset = () => {
    setCurrentStep('email-sent');
  };

  const handleResetPassword = () => {
    setCurrentStep('success');
  };

  const resetFlow = () => {
    setCurrentStep('form');
    setEmail('test@example.com');
    setPassword('');
    setConfirmPassword('');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 1: Request Password Reset</h3>
              <p className="text-gray-600 mb-4">
                User enters their email address and clicks "Send Reset Link"
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                <button
                  onClick={handleSendReset}
                  className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        );

      case 'email-sent':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 2: Email Sent Confirmation</h3>
              <p className="text-gray-600 mb-4">
                User sees confirmation that reset email has been sent
              </p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Password Reset Email Sent</h4>
                </div>
                <p className="text-green-700">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Please check your email and click the link to reset your password. 
                  The link will expire in 1 hour for security reasons.
                </p>
                <button
                  onClick={() => setCurrentStep('reset')}
                  className="mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Simulate Clicking Reset Link
                </button>
              </div>
            </div>
          </div>
        );

      case 'reset':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 3: Reset Password</h3>
              <p className="text-gray-600 mb-4">
                User clicks the reset link and is taken to the password reset page
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={!password || !confirmPassword || password !== confirmPassword}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Step 4: Password Reset Success</h3>
              <p className="text-gray-600 mb-4">
                User successfully resets their password and receives confirmation
              </p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Password Successfully Reset</h4>
                </div>
                <p className="text-green-700">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  A confirmation email has been sent to <strong>{email}</strong>
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/login"
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Login
                  </Link>
                  <button
                    onClick={resetFlow}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Test Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password Flow Test</h1>
          <p className="text-gray-600">
            Interactive demonstration of the complete forgot password flow with QYVE branding and security features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flow Steps */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">User Flow Steps</h2>
            {renderStep()}
          </div>

          {/* Email Templates Preview */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Email Templates Preview</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Password Reset Email</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> Reset Your QYVE Password
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Recipient:</strong> {email}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Features:</strong> QYVE branding, security notice, 1-hour expiry, branded reset button
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Confirmation Email</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> Password Successfully Reset - QYVE
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Recipient:</strong> {email}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Features:</strong> Success confirmation, security tips, login link, QYVE branding
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">🔒 Security Features</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Reset links expire after 1 hour</li>
                <li>✅ Session validation on reset page</li>
                <li>✅ Strong password requirements</li>
                <li>✅ Password confirmation matching</li>
                <li>✅ Confirmation email after reset</li>
                <li>✅ Branded email templates</li>
                <li>✅ Supabase secure password reset</li>
              </ul>
            </div>

            {/* Technical Implementation */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">⚙️ Technical Implementation</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Supabase Auth password reset</li>
                <li>• Custom API endpoint (/api/password-reset)</li>
                <li>• Branded HTML email templates</li>
                <li>• Session validation and security</li>
                <li>• Password strength validation</li>
                <li>• Automatic redirect to login</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Flow Summary */}
        <div className="mt-8 bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-3">✅ Complete Forgot Password Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-green-800">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
              <div className="font-medium">Request Reset</div>
              <div className="text-xs">User enters email</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
              <div className="font-medium">Email Sent</div>
              <div className="text-xs">Branded reset email</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
              <div className="font-medium">Reset Password</div>
              <div className="text-xs">Secure password update</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">4</div>
              <div className="font-medium">Confirmation</div>
              <div className="text-xs">Success email sent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestForgotPasswordPage;
