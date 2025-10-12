import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🧪 Testing Brevo API email...');
    
    const body = await req.json();
    const { email } = body;
    
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'BREVO_API_KEY not found'
      });
    }
    
    // Test using Brevo API instead of SMTP
    const emailData = {
      sender: {
        name: "QYVE Team",
        email: "noreply@qyveofficial.com"
      },
      to: [
        {
          email: email,
          name: "Test User"
        }
      ],
      subject: "QYVE API Test Email",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">QYVE API Test</h1>
          <p>This email is sent using the Brevo API instead of SMTP.</p>
          <p><strong>Recipient:</strong> ${email}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Method:</strong> Brevo API</p>
        </div>
      `,
      textContent: `QYVE API Test\n\nThis email is sent using the Brevo API instead of SMTP.\n\nRecipient: ${email}\nTimestamp: ${new Date().toISOString()}\nMethod: Brevo API`
    };
    
    console.log('📤 Sending email via Brevo API...');
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API email sent successfully:', result);
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully via Brevo API!',
        email: email,
        messageId: result.messageId,
        method: 'Brevo API',
        sender: 'noreply@qyveofficial.com',
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ API email failed:', result);
      
      return NextResponse.json({
        success: false,
        error: 'API email failed: ' + JSON.stringify(result),
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Brevo API test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Brevo API test failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
