'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

import { supabase } from '@/libs/supabaseClient';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';
import FormItem from '@/shared/FormItem';
import Input from '@/shared/Input/Input';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have a valid session for password reset
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
          setIsValidSession(false);
        } else if (session) {
          setIsValidSession(true);
          setUserEmail(session.user?.email || '');
        } else {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setIsValidSession(false);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An error occurred. Please try again.');
        setIsValidSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      
      // Send confirmation email
      try {
        await fetch('/api/password-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'confirmation',
            customerName: userEmail.split('@')[0] || 'User',
            customerEmail: userEmail
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the password reset if email fails
      }
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="container mb-24 lg:mb-32">
        <div className="mx-auto max-w-md text-center">
          <div className="mt-20 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="container mb-24 lg:mb-32">
        <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
          <h2 className="mt-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
            Invalid Reset Link
          </h2>
        </header>

        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Link Expired or Invalid
            </h3>
            <p className="text-gray-600">
              This password reset link is invalid or has expired. 
              Password reset links expire after 1 hour for security reasons.
            </p>
          </div>

          <div className="space-y-4">
            <ButtonPrimary
              onClick={() => router.push('/forgot-pass')}
              className="w-full"
            >
              Request New Reset Link
            </ButtonPrimary>
            
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mb-24 lg:mb-32">
        <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
          <h2 className="mt-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
            Password Reset Successfully
          </h2>
        </header>

        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Password Updated
            </h3>
            <p className="text-gray-600">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to login page in 3 seconds...
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mb-24 lg:mb-32">
      <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center justify-center text-3xl font-semibold leading-[115%] md:text-5xl md:leading-[115%]">
          Reset Your Password
        </h2>
        <p className="mt-4 text-gray-600">
          Enter your new password below. Make sure it's secure and easy to remember.
        </p>
      </header>

      <div className="mx-auto max-w-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormItem label="New Password">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                rounded="rounded-full"
                sizeClass="h-12 px-4 py-3 pr-12"
                className="border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Requirements */}
            {password && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">Password requirements:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`h-1 w-1 rounded-full ${passwordValidation.requirements.minLength ? 'bg-green-600' : 'bg-gray-300'}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`h-1 w-1 rounded-full ${passwordValidation.requirements.hasUpperCase ? 'bg-green-600' : 'bg-gray-300'}`} />
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`h-1 w-1 rounded-full ${passwordValidation.requirements.hasLowerCase ? 'bg-green-600' : 'bg-gray-300'}`} />
                    One lowercase letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`h-1 w-1 rounded-full ${passwordValidation.requirements.hasNumbers ? 'bg-green-600' : 'bg-gray-300'}`} />
                    One number
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`h-1 w-1 rounded-full ${passwordValidation.requirements.hasSpecialChar ? 'bg-green-600' : 'bg-gray-300'}`} />
                    One special character
                  </div>
                </div>
              </div>
            )}
          </FormItem>

          <FormItem label="Confirm New Password">
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                rounded="rounded-full"
                sizeClass="h-12 px-4 py-3 pr-12"
                className={`border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary ${
                  confirmPassword && !passwordsMatch ? 'border-red-300 focus:border-red-500' : ''
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {confirmPassword && (
              <div className="mt-2">
                <div className={`flex items-center gap-2 text-xs ${
                  passwordsMatch ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className={`h-1 w-1 rounded-full ${
                    passwordsMatch ? 'bg-green-600' : 'bg-red-600'
                  }`} />
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </div>
              </div>
            )}
          </FormItem>

          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <ButtonPrimary
            type="submit"
            disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </ButtonPrimary>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
