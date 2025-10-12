import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing email delivery status...');
    
    const body = await req.json();
    const { email } = body;
    
    // Test if we can reach Brevo API to check account status
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'BREVO_API_KEY not found'
      });
    }
    
    // Check Brevo account status
    const accountResponse = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    let accountStatus = 'Unknown';
    let accountData = null;
    
    if (accountResponse.ok) {
      accountData = await accountResponse.json();
      accountStatus = 'Active';
    } else {
      accountStatus = `Error: ${accountResponse.status}`;
    }
    
    // Check SMTP settings
    const smtpResponse = await fetch('https://api.brevo.com/v3/smtp/configuration', {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    let smtpStatus = 'Unknown';
    let smtpData = null;
    
    if (smtpResponse.ok) {
      smtpData = await smtpResponse.json();
      smtpStatus = 'Active';
    } else {
      smtpStatus = `Error: ${smtpResponse.status}`;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email delivery status checked',
      email: email,
      brevoAccount: {
        status: accountStatus,
        data: accountData
      },
      smtpConfiguration: {
        status: smtpStatus,
        data: smtpData
      },
      recommendations: [
        'Check if your Brevo account is verified',
        'Verify your sending email address',
        'Check if SMTP sending is enabled',
        'Consider upgrading to a paid plan if on free tier',
        'Check Brevo dashboard for delivery logs'
      ],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Email delivery test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Email delivery test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
