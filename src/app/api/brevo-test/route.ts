import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🧪 Testing Brevo API connection...');
    
    const apiKey = process.env.BREVO_API_KEY;
    console.log('🔑 API Key present:', apiKey ? 'Yes' : 'No');
    console.log('🔑 API Key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'BREVO_API_KEY not found in environment variables'
      }, { status: 500 });
    }
    
    // Test Brevo API connection
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Brevo API response status:', response.status);
    
    if (response.ok) {
      const accountData = await response.json();
      console.log('✅ Brevo API connection successful');
      
      return NextResponse.json({
        success: true,
        message: 'Brevo API connection successful',
        account: {
          email: accountData.email,
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          companyName: accountData.companyName
        }
      });
    } else {
      const errorData = await response.text();
      console.error('❌ Brevo API error:', response.status, errorData);
      
      return NextResponse.json({
        success: false,
        error: `Brevo API error: ${response.status} - ${errorData}`
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Brevo test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Brevo test failed: ' + (error as Error).message
    }, { status: 500 });
  }
}
