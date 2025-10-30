'use client';

import { useState } from 'react';

export default function TestIntegrationsPage() {
  const [emailResults, setEmailResults] = useState<any>(null);
  const [easyParcelResults, setEasyParcelResults] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');

  const testEmailIntegration = async () => {
    if (!testEmail) {
      alert('Please enter your email address');
      return;
    }

    setLoading('email');
    setEmailResults(null);

    try {
      const response = await fetch('/api/test-all-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });

      const data = await response.json();
      setEmailResults(data);
    } catch (error) {
      setEmailResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  const testEasyParcelConnection = async () => {
    setLoading('easyparcel');
    setEasyParcelResults(null);

    try {
      const response = await fetch('/api/test-easyparcel-connection');
      const data = await response.json();
      setEasyParcelResults(data);
    } catch (error) {
      setEasyParcelResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Integration Testing Dashboard
          </h1>
          <p className="text-gray-600">
            Test your email marketing and EasyParcel shipping integrations
          </p>
        </div>

        {/* Email Integration Testing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            📧 Email Integration Test
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email Address
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send 5 test emails to this address (order confirmation, payment, shipping, cancellation, refund)
            </p>
          </div>

          <button
            onClick={testEmailIntegration}
            disabled={loading === 'email' || !testEmail}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'email' ? '⏳ Sending Test Emails...' : '📤 Send Test Emails'}
          </button>

          {emailResults && (
            <div className={`mt-4 p-4 rounded-lg ${emailResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <span className="text-2xl mr-2">
                  {emailResults.success ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {emailResults.message}
                  </h3>
                  
                  {emailResults.results && (
                    <div className="space-y-2 mt-3">
                      {emailResults.results.map((result: any, idx: number) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="mr-2">
                            {result.success ? '✅' : '❌'}
                          </span>
                          <span className="font-medium">{result.type}</span>
                          {result.messageId && (
                            <span className="ml-2 text-gray-500 text-xs">
                              ID: {result.messageId}
                            </span>
                          )}
                          {result.error && (
                            <span className="ml-2 text-red-600 text-xs">
                              {result.error}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {emailResults.summary && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <div className="text-sm">
                        <strong>Summary:</strong> {emailResults.summary.successful} / {emailResults.summary.total} emails sent successfully
                      </div>
                    </div>
                  )}

                  {emailResults.success && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        📬 <strong>Check your inbox!</strong> You should receive 5 emails from noreply@qyveofficial.com
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        If you don't see them, check your spam folder.
                      </p>
                    </div>
                  )}

                  {emailResults.error && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {emailResults.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EasyParcel Integration Testing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            📦 EasyParcel Integration Test
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            This will check if your EasyParcel API credentials are configured and test the connection.
          </p>

          <button
            onClick={testEasyParcelConnection}
            disabled={loading === 'easyparcel'}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading === 'easyparcel' ? '⏳ Testing Connection...' : '🔌 Test EasyParcel Connection'}
          </button>

          {easyParcelResults && (
            <div className={`mt-4 p-4 rounded-lg ${easyParcelResults.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-start">
                <span className="text-2xl mr-2">
                  {easyParcelResults.success ? '✅' : '⚠️'}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {easyParcelResults.message || easyParcelResults.error}
                  </h3>
                  
                  {easyParcelResults.details && (
                    <div className="space-y-1 mt-3">
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">API Key:</span>
                        <span>{easyParcelResults.details.apiKey}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">API Secret:</span>
                        <span>{easyParcelResults.details.apiSecret}</span>
                      </div>
                    </div>
                  )}

                  {easyParcelResults.success ? (
                    <div className="mt-3 p-3 bg-green-100 rounded border border-green-300">
                      <p className="text-sm text-green-800">
                        ✅ <strong>EasyParcel is ready for production!</strong>
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        When you deploy, the system will automatically use the production EasyParcel API.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                      <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Action Required:</strong> Add missing credentials to Replit Secrets
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        You need to add EASYPARCEL_API_SECRET to your environment variables.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Production Readiness Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🚀 Production Readiness Summary
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <div>
                <strong className="text-gray-900">Email System:</strong>
                <span className="text-gray-600 ml-2">Production Ready - Deploy Now!</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-yellow-500 text-xl mr-3">⚠️</span>
              <div>
                <strong className="text-gray-900">EasyParcel:</strong>
                <span className="text-gray-600 ml-2">Needs EASYPARCEL_API_SECRET</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">📄 Documentation:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>TESTING_GUIDE.md</strong> - Complete testing instructions</li>
              <li>• <strong>PRODUCTION_READINESS_ANALYSIS.md</strong> - Production deployment guide</li>
              <li>• <strong>FEATURE_STATUS_SUMMARY.md</strong> - All features status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
