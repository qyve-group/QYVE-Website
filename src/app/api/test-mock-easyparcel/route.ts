import { NextResponse } from 'next/server';
import { mockEasyParcelService } from '@/lib/easyparcel-service-mock';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    console.log('🧪 Testing Mock EasyParcel Service...');
    
    const body = await req.json();
    const { email } = body;
    
    console.log('📧 Testing mock EasyParcel service for:', email);
    
    // Test data
    const fromAddress = {
      name: 'QYVE Official',
      phone: '+601160974239',
      email: 'shipping@qyveofficial.com',
      address1: 'QYVE Warehouse',
      address2: 'Unit 123',
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      postcode: '50000',
      country: 'Malaysia',
    };

    const toAddress = {
      name: 'Test Customer',
      phone: '+60123456789',
      email: email || 'test@example.com',
      address1: '123 Customer Street',
      address2: 'Apt 5B',
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      postcode: '50000',
      country: 'Malaysia',
    };

    const parcelDetails = {
      weight: 0.5,
      length: 30,
      width: 25,
      height: 5,
      content: 'Clothing and Apparel',
      value: 299.99,
    };

    // Test connection
    console.log('📦 Testing mock connection...');
    const connectionTest = await mockEasyParcelService.testConnection();

    // Test shipping rates
    console.log('📦 Testing mock shipping rates...');
    const rates = await mockEasyParcelService.getShippingRates(fromAddress, toAddress, parcelDetails);

    // Test auto-create shipment
    console.log('📦 Testing mock auto-create shipment...');
    const shipmentResult = await mockEasyParcelService.autoCreateShipment(
      fromAddress,
      toAddress,
      parcelDetails,
      'cheapest'
    );

    // Test tracking
    let trackingResult = null;
    if (shipmentResult.success && shipmentResult.trackingNumber) {
      console.log('📦 Testing mock tracking...');
      trackingResult = await mockEasyParcelService.trackShipment(shipmentResult.trackingNumber);
    }

    return NextResponse.json({
      success: true,
      message: 'Mock EasyParcel service test completed successfully!',
      email: email,
      tests: {
        connection: connectionTest ? '✅ Passed' : '❌ Failed',
        shippingRates: rates.length > 0 ? `✅ Passed (${rates.length} rates)` : '❌ Failed',
        autoCreateShipment: shipmentResult.success ? '✅ Passed' : '❌ Failed',
        tracking: trackingResult?.success ? '✅ Passed' : '❌ Failed'
      },
      results: {
        shippingRates: rates,
        shipment: shipmentResult,
        tracking: trackingResult
      },
      features: {
        autoBooking: '✅ Mock shipment auto-booked',
        trackingGeneration: '✅ Mock tracking number generated',
        emailNotification: '✅ Ready for email integration',
        completeAutomation: '✅ Full mock automation working'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Mock EasyParcel test failed:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Mock EasyParcel test failed: ${error.message}` 
    }, { status: 500 });
  }
}
