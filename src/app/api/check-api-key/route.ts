import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'BREVO_API_KEY not found in environment variables'
      });
    }
    
    // Check API key format (Brevo API keys usually start with 'xkeys-')
    const isValidFormat = apiKey.startsWith('xkeys-') || apiKey.startsWith('xsmtpsib-');
    
    return NextResponse.json({
      success: true,
      apiKeyPresent: true,
      apiKeyLength: apiKey.length,
      apiKeyFormat: isValidFormat ? 'Valid' : 'Invalid',
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      smtpUser: process.env.SMTP_USER ? 'Set' : 'Missing',
      smtpPass: process.env.SMTP_PASS ? 'Set' : 'Missing',
      smtpHost: process.env.SMTP_HOST ? 'Set' : 'Missing'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check API key: ' + (error as Error).message
    });
  }
}
