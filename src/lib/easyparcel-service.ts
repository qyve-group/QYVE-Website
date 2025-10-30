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

      // EasyParcel Individual API uses form data format
      const formData = new URLSearchParams({
        api: EASYPARCEL_CONFIG.apiKey,
        weight: parcel.weight.toString(),
        length: parcel.length.toString(),
        width: parcel.width.toString(),
        height: parcel.height.toString(),
        content: parcel.content,
        value: parcel.value.toString(),
        pick_code: from.postcode,
        pick_state: from.state,
        pick_country: from.country,
        send_code: to.postcode,
        send_state: to.state,
        send_country: to.country,
      });

      console.log('📤 Sending request to EasyParcel...');

      const response = await fetch(
        `${EASYPARCEL_CONFIG.baseUrl}?ac=EPRateCheckingBulk`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        },
      );

      console.log('📥 Response status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('📥 Response received, length:', responseText.length);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📥 Parsed JSON successfully');
      } catch (parseError) {
        console.error('❌ Failed to parse response:', responseText.substring(0, 200));
        throw new Error(`Failed to parse response as JSON: ${responseText.substring(0, 200)}`);
      }

      // Check API response status
      if (data.api_status !== 'Success' && data.api_status !== 'success') {
        throw new Error(`EasyParcel API error: ${data.error_remark || data.error_code || 'Unknown error'}`);
      }

      // Parse shipping rates from response
      const rates: ShippingRate[] =
        data.rates?.map((rate: any) => ({
          courier: rate.courier_name || rate.courier,
          service: rate.service_name || rate.service,
          price: parseFloat(rate.price || rate.shipment_price || 0),
          deliveryTime: rate.delivery_time || rate.estimated_delivery || 'N/A',
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

      // EasyParcel Individual API uses form data format
      const formData = new URLSearchParams({
        api: EASYPARCEL_CONFIG.apiKey,
        weight: parcel.weight.toString(),
        length: parcel.length.toString(),
        width: parcel.width.toString(),
        height: parcel.height.toString(),
        content: parcel.content,
        value: parcel.value.toString(),
        service_id: service,
        pick_name: from.name,
        pick_contact: from.phone,
        pick_addr1: from.address1,
        pick_addr2: from.address2 || '',
        pick_city: from.city,
        pick_state: from.state,
        pick_code: from.postcode,
        pick_country: from.country,
        send_name: to.name,
        send_contact: to.phone,
        send_addr1: to.address1,
        send_addr2: to.address2 || '',
        send_city: to.city,
        send_state: to.state,
        send_code: to.postcode,
        send_country: to.country,
      });

      const response = await fetch(
        `${EASYPARCEL_CONFIG.baseUrl}?ac=EPSubmitOrderBulk`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        },
      );

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.api_status !== 'Success' && data.api_status !== 'success') {
        throw new Error(`EasyParcel API error: ${data.error_remark || data.error_code || 'Unknown error'}`);
      }

      const result: ShipmentResult = {
        success: true,
        trackingNumber: data.result?.tracking_number || data.result?.awb,
        courier,
        service,
        price: parseFloat(data.result?.price || data.result?.shipment_price || '0'),
        deliveryTime: data.result?.delivery_time || data.result?.estimated_delivery,
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

      // EasyParcel Individual API uses form data format
      const formData = new URLSearchParams({
        api: EASYPARCEL_CONFIG.apiKey,
        tracking_no: trackingNumber,
      });

      const response = await fetch(`${EASYPARCEL_CONFIG.baseUrl}?ac=EPGetOrderStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.api_status !== 'Success' && data.api_status !== 'success') {
        throw new Error(`EasyParcel API error: ${data.error_remark || data.error_code || 'Unknown error'}`);
      }

      const result: TrackingResult = {
        success: true,
        status: data.result?.status || data.result?.order_status,
        location: data.result?.location || data.result?.last_location,
        lastUpdate: data.result?.last_update || data.result?.updated_at,
        estimatedDelivery: data.result?.estimated_delivery || data.result?.eta,
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
