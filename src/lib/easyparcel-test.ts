// EasyParcel Testing Utility for QYVE E-commerce Platform
// Comprehensive testing functions for EasyParcel integration

import { 
  easyParcelService, 
  getShippingRates, 
  createShipment, 
  trackShipment, 
  autoCreateShipment,
  testEasyParcelConnection 
} from './easyparcel-service';
import { processPendingOrders, testAutomatedShipping } from './automated-shipping';

// Test data generators
const generateTestFromAddress = () => ({
  name: 'QYVE Warehouse',
  phone: '+60123456789',
  email: 'warehouse@qyve.com',
  address1: '123 Warehouse Street',
  address2: 'Unit 5-1',
  city: 'Kuala Lumpur',
  state: 'Kuala Lumpur',
  postcode: '50000',
  country: 'Malaysia',
});

const generateTestToAddress = () => ({
  name: 'Test Customer',
  phone: '+60123456789',
  email: 'customer@test.com',
  address1: '456 Customer Street',
  address2: 'Apt 2B',
  city: 'Kuala Lumpur',
  state: 'Kuala Lumpur',
  postcode: '50000',
  country: 'Malaysia',
});

const generateTestParcel = () => ({
  weight: 0.5, // kg
  length: 20, // cm
  width: 15, // cm
  height: 5, // cm
  content: 'QYVE Sports Apparel',
  value: 99.99, // MYR
});

// Test EasyParcel connection
export const testConnection = async () => {
  console.log('🧪 Testing EasyParcel Connection...');
  
  try {
    const isConnected = await testEasyParcelConnection();
    
    if (isConnected) {
      console.log('✅ EasyParcel connection successful');
    } else {
      console.log('❌ EasyParcel connection failed');
    }
    
    return isConnected;
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return false;
  }
};

// Test shipping rates
export const testShippingRates = async () => {
  console.log('🧪 Testing Shipping Rates...');
  
  try {
    const from = generateTestFromAddress();
    const to = generateTestToAddress();
    const parcel = generateTestParcel();
    
    const rates = await getShippingRates(from, to, parcel);
    
    if (rates.length > 0) {
      console.log('✅ Shipping rates retrieved successfully');
      console.log(`📦 Found ${rates.length} shipping options:`);
      rates.forEach((rate, index) => {
        console.log(`  ${index + 1}. ${rate.courier} - ${rate.service}: RM${rate.price} (${rate.deliveryTime})`);
      });
      return rates;
    } else {
      console.log('❌ No shipping rates found');
      return [];
    }
  } catch (error) {
    console.error('❌ Shipping rates test error:', error);
    return [];
  }
};

// Test shipment creation
export const testCreateShipment = async () => {
  console.log('🧪 Testing Shipment Creation...');
  
  try {
    const from = generateTestFromAddress();
    const to = generateTestToAddress();
    const parcel = generateTestParcel();
    
    // Get rates first to get valid courier and service
    const rates = await getShippingRates(from, to, parcel);
    
    if (rates.length === 0) {
      console.log('❌ No shipping rates available for testing');
      return null;
    }
    
    const bestRate = rates[0]; // Use first available rate
    
    const result = await createShipment(
      from,
      to,
      parcel,
      bestRate.courier,
      bestRate.service
    );
    
    if (result.success) {
      console.log('✅ Shipment created successfully');
      console.log(`📦 Tracking Number: ${result.trackingNumber}`);
      console.log(`🚚 Courier: ${result.courier} - ${result.service}`);
      console.log(`💰 Price: RM${result.price}`);
      console.log(`⏰ Delivery Time: ${result.deliveryTime}`);
      return result;
    } else {
      console.log('❌ Shipment creation failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Shipment creation test error:', error);
    return null;
  }
};

// Test auto-create shipment
export const testAutoCreateShipment = async () => {
  console.log('🧪 Testing Auto-Create Shipment...');
  
  try {
    const from = generateTestFromAddress();
    const to = generateTestToAddress();
    const parcel = generateTestParcel();
    
    const result = await autoCreateShipment(from, to, parcel, 'cheapest');
    
    if (result.success) {
      console.log('✅ Auto-create shipment successful');
      console.log(`📦 Tracking Number: ${result.trackingNumber}`);
      console.log(`🚚 Courier: ${result.courier} - ${result.service}`);
      console.log(`💰 Price: RM${result.price}`);
      return result;
    } else {
      console.log('❌ Auto-create shipment failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Auto-create shipment test error:', error);
    return null;
  }
};

// Test shipment tracking
export const testTrackShipment = async (trackingNumber?: string) => {
  console.log('🧪 Testing Shipment Tracking...');
  
  try {
    // Use provided tracking number or create a test shipment first
    let testTrackingNumber = trackingNumber;
    
    if (!testTrackingNumber) {
      const shipmentResult = await testAutoCreateShipment();
      if (!shipmentResult?.trackingNumber) {
        console.log('❌ No tracking number available for testing');
        return null;
      }
      testTrackingNumber = shipmentResult.trackingNumber;
    }
    
    const result = await trackShipment(testTrackingNumber);
    
    if (result.success) {
      console.log('✅ Shipment tracking successful');
      console.log(`📦 Status: ${result.status}`);
      console.log(`📍 Location: ${result.location}`);
      console.log(`🕐 Last Update: ${result.lastUpdate}`);
      console.log(`⏰ Estimated Delivery: ${result.estimatedDelivery}`);
      return result;
    } else {
      console.log('❌ Shipment tracking failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Shipment tracking test error:', error);
    return null;
  }
};

// Test automated shipping system
export const testAutomatedShippingSystem = async () => {
  console.log('🧪 Testing Automated Shipping System...');
  
  try {
    const result = await testAutomatedShipping();
    
    if (result) {
      console.log('✅ Automated shipping system test successful');
    } else {
      console.log('❌ Automated shipping system test failed');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Automated shipping system test error:', error);
    return false;
  }
};

// Test process pending orders
export const testProcessPendingOrders = async () => {
  console.log('🧪 Testing Process Pending Orders...');
  
  try {
    const result = await processPendingOrders();
    
    console.log(`📊 Processing Results:`);
    console.log(`  ✅ Processed: ${result.processed}`);
    console.log(`  ❌ Errors: ${result.errors}`);
    console.log(`  📦 Total: ${result.processed + result.errors}`);
    
    return result;
  } catch (error) {
    console.error('❌ Process pending orders test error:', error);
    return { processed: 0, errors: 1 };
  }
};

// Run all EasyParcel tests
export const runAllEasyParcelTests = async () => {
  console.log('🚀 Running All EasyParcel Tests...');
  console.log('=====================================');
  
  const results = {
    connection: await testConnection(),
    shippingRates: await testShippingRates(),
    createShipment: await testCreateShipment(),
    autoCreateShipment: await testAutoCreateShipment(),
    trackShipment: await testTrackShipment(),
    automatedShipping: await testAutomatedShippingSystem(),
    processPending: await testProcessPendingOrders(),
  };
  
  console.log('=====================================');
  console.log('📊 Test Results Summary:');
  console.log('=====================================');
  
  Object.entries(results).forEach(([testName, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
  });
  
  const successCount = Object.values(results).filter(r => r).length;
  const totalCount = Object.keys(results).length;
  
  console.log('=====================================');
  console.log(`📈 Success Rate: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  console.log('=====================================');
  
  return results;
};

// API testing functions
export const testEasyParcelAPI = async () => {
  console.log('🧪 Testing EasyParcel API Endpoints...');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // Test shipping rates API
    console.log('📦 Testing shipping rates API...');
    const ratesResponse = await fetch(`${baseUrl}/api/shipping/rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: generateTestFromAddress(),
        to: generateTestToAddress(),
        parcel: generateTestParcel(),
      }),
    });
    
    const ratesResult = await ratesResponse.json();
    console.log('Shipping rates API result:', ratesResult);
    
    // Test auto-process API
    console.log('📦 Testing auto-process API...');
    const processResponse = await fetch(`${baseUrl}/api/shipping/auto-process`, {
      method: 'POST',
    });
    
    const processResult = await processResponse.json();
    console.log('Auto-process API result:', processResult);
    
    return {
      shippingRates: ratesResult,
      autoProcess: processResult,
    };
  } catch (error) {
    console.error('❌ API testing failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).easyParcelTest = {
    testConnection,
    testShippingRates,
    testCreateShipment,
    testAutoCreateShipment,
    testTrackShipment,
    testAutomatedShippingSystem,
    testProcessPendingOrders,
    runAllEasyParcelTests,
    testEasyParcelAPI,
    generateTestFromAddress,
    generateTestToAddress,
    generateTestParcel,
  };
}
