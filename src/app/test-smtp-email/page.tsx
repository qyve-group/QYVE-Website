'use client';

import { useState } from 'react';

export default function TestSMTPEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('navientharan10@gmail.com');

  const testSMTPEmail = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/smtp-email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to test SMTP email: ' + (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          SMTP Email System Test
        </h1>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <input
            type="email"
            id="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email address"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will send a test email using SMTP (Nodemailer) instead of the Brevo client
          </p>
        </div>
        
        <button
          onClick={testSMTPEmail}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing SMTP Email...' : 'Test SMTP Email System'}
        </button>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? '✅ Success!' : '❌ Error'}
            </h3>
            <p className={`mt-2 text-sm ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.success ? result.message : result.error}
            </p>
            {result.messageId && (
              <p className="mt-2 text-xs text-green-600">
                Message ID: {result.messageId}
              </p>
            )}
            {result.method && (
              <p className="mt-2 text-xs text-green-600">
                Method: {result.method}
              </p>
            )}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <h4 className="font-medium mb-2">What this test does:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Uses Nodemailer with SMTP (not Brevo client)</li>
            <li>Connects directly to Brevo SMTP servers</li>
            <li>Tests SMTP authentication</li>
            <li>Sends a test email with HTML content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
