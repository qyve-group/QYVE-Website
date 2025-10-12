// Mock EasyParcel Service for Testing
// This simulates EasyParcel API responses for development and testing

interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface ParcelDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
  content: string;
  value: number;
}

export interface ShippingRate {
  courier: string;
  service: string;
  price: number;
  deliveryTime: string;
  trackingNumber?: string;
}

export interface ShipmentResult {
  success: boolean;
  trackingNumber?: string;
  courier?: string;
  service?: string;
  price?: number;
  deliveryTime?: string;
  error?: string;
}

export interface TrackingResult {
  success: boolean;
  status?: string;
  location?: string;
  lastUpdate?: string;
  estimatedDelivery?: string;
  error?: string;
}

// Mock EasyParcel service class
export class MockEasyParcelService {
  private static instance: MockEasyParcelService;

  public static getInstance(): MockEasyParcelService {
    if (!MockEasyParcelService.instance) {
      MockEasyParcelService.instance = new MockEasyParcelService();
    }
    return MockEasyParcelService.instance;
  }

  // Mock shipping rates
  async getShippingRates(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
  ): Promise<ShippingRate[]> {
    console.log('📦 Mock: Getting shipping rates...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockRates: ShippingRate[] = [
      {
        courier: 'J&T Express',
        service: 'Standard',
        price: 8.50,
        deliveryTime: '2-3 business days'
      },
      {
        courier: 'Pos Malaysia',
        service: 'Pos Laju',
        price: 12.00,
        deliveryTime: '1-2 business days'
      },
      {
        courier: 'DHL',
        service: 'Express',
        price: 25.00,
        deliveryTime: '1 business day'
      }
    ];

    console.log(`✅ Mock: Found ${mockRates.length} shipping options`);
    return mockRates;
  }

  // Mock shipment creation
  async createShipment(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
    courier: string,
    service: string,
  ): Promise<ShipmentResult> {
    console.log('📦 Mock: Creating shipment...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock tracking number
    const trackingNumber = `EP${Date.now().toString().slice(-8)}MY`;
    
    const result: ShipmentResult = {
      success: true,
      trackingNumber: trackingNumber,
      courier: courier,
      service: service,
      price: 8.50,
      deliveryTime: '2-3 business days'
    };

    console.log('✅ Mock: Shipment created successfully:', result.trackingNumber);
    return result;
  }

  // Mock tracking
  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    console.log('📦 Mock: Tracking shipment:', trackingNumber);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result: TrackingResult = {
      success: true,
      status: 'In Transit',
      location: 'Kuala Lumpur Hub',
      lastUpdate: new Date().toISOString(),
      estimatedDelivery: '2-3 business days'
    };

    console.log('✅ Mock: Tracking info retrieved:', result.status);
    return result;
  }

  // Mock best shipping rate
  async getBestShippingRate(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
    preference: 'cheapest' | 'fastest' = 'cheapest',
  ): Promise<ShippingRate | null> {
    const rates = await this.getShippingRates(from, to, parcel);
    return rates.length > 0 ? rates[0] : null;
  }

  // Mock auto-create shipment
  async autoCreateShipment(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
    preference: 'cheapest' | 'fastest' = 'cheapest',
  ): Promise<ShipmentResult> {
    console.log('📦 Mock: Auto-creating shipment with best rate...');

    const bestRate = await this.getBestShippingRate(from, to, parcel, preference);

    if (!bestRate) {
      return {
        success: false,
        error: 'No shipping rates available',
      };
    }

    return await this.createShipment(from, to, parcel, bestRate.courier, bestRate.service);
  }

  // Mock connection test
  async testConnection(): Promise<boolean> {
    console.log('🧪 Mock: Testing EasyParcel connection...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ Mock: EasyParcel connection test successful');
    return true;
  }
}

// Export singleton instance
export const mockEasyParcelService = MockEasyParcelService.getInstance();
