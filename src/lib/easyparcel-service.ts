// EasyParcel Integration Service for QYVE E-commerce Platform
// Handles automatic shipment booking, tracking, and customer notifications

interface EasyParcelConfig {
  apiKey: string;
  baseUrl: string;
  isProduction: boolean;
}

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
  weight: number; // in kg
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  content: string;
  value: number; // in MYR
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

// EasyParcel service configuration
const EASYPARCEL_CONFIG: EasyParcelConfig = {
  apiKey: process.env.EASYPARCEL_API_KEY || '',
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://connect.easyparcel.my/'
      : 'http://demo.connect.easyparcel.my/',
  isProduction: process.env.NODE_ENV === 'production',
};

// EasyParcel service class
export class EasyParcelService {
  private static instance: EasyParcelService;

  public static getInstance(): EasyParcelService {
    if (!EasyParcelService.instance) {
      EasyParcelService.instance = new EasyParcelService();
    }
    return EasyParcelService.instance;
  }

  // Check shipping rates
  // eslint-disable-next-line class-methods-use-this
  async getShippingRates(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
  ): Promise<ShippingRate[]> {
    try {
      console.log('📦 Checking shipping rates with EasyParcel...');
      console.log('🔑 API Key present:', !!EASYPARCEL_CONFIG.apiKey);
      console.log('🌐 Base URL:', EASYPARCEL_CONFIG.baseUrl);

      const requestBody = {
        api: EASYPARCEL_CONFIG.apiKey,
        from: {
          name: from.name,
          phone: from.phone,
          email: from.email,
          address1: from.address1,
          address2: from.address2 || '',
          city: from.city,
          state: from.state,
          postcode: from.postcode,
          country: from.country,
        },
        to: {
          name: to.name,
          phone: to.phone,
          email: to.email,
          address1: to.address1,
          address2: to.address2 || '',
          city: to.city,
          state: to.state,
          postcode: to.postcode,
          country: to.country,
        },
        parcel: {
          weight: parcel.weight,
          length: parcel.length,
          width: parcel.width,
          height: parcel.height,
          content: parcel.content,
          value: parcel.value,
        },
      };

      console.log('📤 Request body (API key hidden):', JSON.stringify({
        ...requestBody,
        api: '***HIDDEN***'
      }));

      const response = await fetch(
        `${EASYPARCEL_CONFIG.baseUrl}api/rate-check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${EASYPARCEL_CONFIG.apiKey}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first to see what we're actually getting
      const responseText = await response.text();
      console.log('📥 Response text:', responseText);

      if (!response.ok) {
        throw new Error(
          `EasyParcel API error: ${response.status} ${response.statusText}. Response: ${responseText}`,
        );
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Failed to parse response as JSON: ${responseText}`);
      }

      if (data.error) {
        throw new Error(`EasyParcel API error: ${data.error}`);
      }

      const rates: ShippingRate[] =
        data.result?.map((rate: any) => ({
          courier: rate.courier,
          service: rate.service,
          price: parseFloat(rate.price),
          deliveryTime: rate.delivery_time,
        })) || [];

      console.log(`✅ Found ${rates.length} shipping options`);
      return rates;
    } catch (error) {
      console.error('❌ Failed to get shipping rates:', error);
      throw error;
    }
  }

  // Create shipment
  // eslint-disable-next-line class-methods-use-this
  async createShipment(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
    courier: string,
    service: string,
  ): Promise<ShipmentResult> {
    try {
      console.log('📦 Creating shipment with EasyParcel...');

      const response = await fetch(
        `${EASYPARCEL_CONFIG.baseUrl}api/order-create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${EASYPARCEL_CONFIG.apiKey}`,
          },
          body: JSON.stringify({
            api: EASYPARCEL_CONFIG.apiKey,
            from: {
              name: from.name,
              phone: from.phone,
              email: from.email,
              address1: from.address1,
              address2: from.address2 || '',
              city: from.city,
              state: from.state,
              postcode: from.postcode,
              country: from.country,
            },
            to: {
              name: to.name,
              phone: to.phone,
              email: to.email,
              address1: to.address1,
              address2: to.address2 || '',
              city: to.city,
              state: to.state,
              postcode: to.postcode,
              country: to.country,
            },
            parcel: {
              weight: parcel.weight,
              length: parcel.length,
              width: parcel.width,
              height: parcel.height,
              content: parcel.content,
              value: parcel.value,
            },
            courier,
            service,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `EasyParcel API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`EasyParcel API error: ${data.error}`);
      }

      const result: ShipmentResult = {
        success: true,
        trackingNumber: data.result?.tracking_number,
        courier: data.result?.courier,
        service: data.result?.service,
        price: parseFloat(data.result?.price || '0'),
        deliveryTime: data.result?.delivery_time,
      };

      console.log('✅ Shipment created successfully:', result.trackingNumber);
      return result;
    } catch (error) {
      console.error('❌ Failed to create shipment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Track shipment
  // eslint-disable-next-line class-methods-use-this
  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    try {
      console.log('📦 Tracking shipment:', trackingNumber);

      const response = await fetch(`${EASYPARCEL_CONFIG.baseUrl}api/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EASYPARCEL_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          api: EASYPARCEL_CONFIG.apiKey,
          tracking_number: trackingNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `EasyParcel API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`EasyParcel API error: ${data.error}`);
      }

      const result: TrackingResult = {
        success: true,
        status: data.result?.status,
        location: data.result?.location,
        lastUpdate: data.result?.last_update,
        estimatedDelivery: data.result?.estimated_delivery,
      };

      console.log('✅ Tracking info retrieved:', result.status);
      return result;
    } catch (error) {
      console.error('❌ Failed to track shipment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get best shipping rate (cheapest or fastest)
  async getBestShippingRate(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
    preference: 'cheapest' | 'fastest' = 'cheapest',
  ): Promise<ShippingRate | null> {
    try {
      const rates = await this.getShippingRates(from, to, parcel);

      if (rates.length === 0) {
        return null;
      }

      if (preference === 'cheapest') {
        return rates.reduce((cheapest, current) =>
          current.price < cheapest.price ? current : cheapest,
        );
      }
      // For fastest, we'd need to parse delivery time, but for now return first option
      return rates[0] ?? null;
    } catch (error) {
      console.error('❌ Failed to get best shipping rate:', error);
      return null;
    }
  }

  // Auto-create shipment with best rate
  async autoCreateShipment(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
    preference: 'cheapest' | 'fastest' = 'cheapest',
  ): Promise<ShipmentResult> {
    try {
      console.log('📦 Auto-creating shipment with best rate...');

      const bestRate = await this.getBestShippingRate(
        from,
        to,
        parcel,
        preference,
      );

      if (!bestRate) {
        return {
          success: false,
          error: 'No shipping rates available',
        };
      }

      return await this.createShipment(
        from,
        to,
        parcel,
        bestRate.courier,
        bestRate.service,
      );
    } catch (error) {
      console.error('❌ Failed to auto-create shipment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Test EasyParcel connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing EasyParcel connection...');

      // Test with minimal data
      const testFrom: ShippingAddress = {
        name: 'QYVE Test',
        phone: '0123456789',
        email: 'test@qyve.com',
        address1: '123 Test Street',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postcode: '50000',
        country: 'Malaysia',
      };

      const testTo: ShippingAddress = {
        name: 'Test Customer',
        phone: '0123456789',
        email: 'customer@test.com',
        address1: '456 Customer Street',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postcode: '50000',
        country: 'Malaysia',
      };

      const testParcel: ParcelDetails = {
        weight: 0.5,
        length: 20,
        width: 15,
        height: 5,
        content: 'Test parcel',
        value: 50,
      };

      const rates = await this.getShippingRates(testFrom, testTo, testParcel);
      console.log('✅ EasyParcel connection test successful');
      return rates.length > 0;
    } catch (error) {
      console.error('❌ EasyParcel connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const easyParcelService = EasyParcelService.getInstance();

// Convenience functions
export const getShippingRates = (
  from: ShippingAddress,
  to: ShippingAddress,
  parcel: ParcelDetails,
) => easyParcelService.getShippingRates(from, to, parcel);

export const createShipment = (
  from: ShippingAddress,
  to: ShippingAddress,
  parcel: ParcelDetails,
  courier: string,
  service: string,
) => easyParcelService.createShipment(from, to, parcel, courier, service);

export const trackShipment = (trackingNumber: string) =>
  easyParcelService.trackShipment(trackingNumber);

export const autoCreateShipment = (
  from: ShippingAddress,
  to: ShippingAddress,
  parcel: ParcelDetails,
  preference: 'cheapest' | 'fastest' = 'cheapest',
) => easyParcelService.autoCreateShipment(from, to, parcel, preference);

export const testEasyParcelConnection = () =>
  easyParcelService.testConnection();
