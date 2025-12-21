// EasyParcel Integration Service for QYVE E-commerce Platform
// Handles automatic shipment booking, tracking, and customer notifications

interface EasyParcelConfig {
  apiKey: string;
  // apiSecret: string;
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
  // apiKey: process.env.EASYPARCEL_API_KEY || '',
  apiKey: 'EP-UKJZxuiu2',
  // apiSecret: process.env.EASYPARCEL_API_SECRET || '',
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://connect.easyparcel.my/'
      : 'http://demo.connect.easyparcel.my/',
  isProduction: process.env.NODE_ENV === 'production',
};

export class EasyParcelService {
  private static instance: EasyParcelService;

  private config: EasyParcelConfig;

  private constructor() {
    this.config = EASYPARCEL_CONFIG;
    // console.log('EasyParcel API Key:', process.env.EASYPARCEL_API_KEY);

    // if (!this.config.apiKey || !this.config.apiSecret) {
    if (!this.config.apiKey) {
      throw new Error('EasyParcel API credentials are missing');
    }
  }

  public static getInstance(): EasyParcelService {
    if (!EasyParcelService.instance) {
      EasyParcelService.instance = new EasyParcelService();
    }

    return EasyParcelService.instance;
  }

  private rateCache = new Map<string, number>(); // ✅ persistent cache

  private static validateMalaysianPostcode(postcode: string): boolean {
    // Malaysian postcodes are 5 digits
    const cleanPostcode = postcode.replace(/\s/g, '');
    return /^\d{5}$/.test(cleanPostcode);
  }

  async getShippingRates(
    from: ShippingAddress,
    to: ShippingAddress,
    parcel: ParcelDetails,
  ): Promise<number> {
    // Validate postcodes before making API call
    if (!EasyParcelService.validateMalaysianPostcode(to.postcode)) {
      throw new Error(
        'Invalid postcode: Please enter a valid postcode',
      );
    }

    const cacheKey = `${from.postcode}-${to.postcode}-${parcel.weight}`;

    if (this.rateCache.has(cacheKey)) {
      return this.rateCache.get(cacheKey)!;
    }

    console.log('rate cache: ', this.rateCache);

    try {
      //       console.log('📦 Checking shipping rates with EasyParcel...');
      //       console.log(
      //         'EasyParcel URL:',
      //         `${EASYPARCEL_CONFIG.baseUrl}?ac=EPRateCheckingBulk
      // `,
      //       );

      // console.log(
      //   'Request body:',
      //   JSON.stringify({
      //     api: EASYPARCEL_CONFIG.apiKey,
      //     bulk: [
      //       {
      //         pick_code: from.postcode,
      //         pick_state: from.state,
      //         pick_country: from.country,
      //         send_code: to.postcode,
      //         send_state: to.state,
      //         send_country: to.country,
      //         weight: Number(parcel.weight),
      //       },
      //     ],
      //   }),
      // );

      const response = await fetch(
        // 'https://connect.easyparcel.my/?ac=EPRateCheckingBulk',
        `${EASYPARCEL_CONFIG.baseUrl}?ac=EPRateCheckingBulk
        `,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${EASYPARCEL_CONFIG.apiKey}`,
          },
          body: JSON.stringify({
            api: EASYPARCEL_CONFIG.apiKey,
            // api_secret: EASYPARCEL_CONFIG.apiSecret,
            bulk: [
              {
                pick_code: `${from.postcode}`,
                pick_state: `${from.state}`,
                pick_country: `${from.country}`,
                send_code: `${to.postcode}`,
                send_state: `${to.state}`,
                send_country: `${to.country}`,
                weight: `${parcel.weight}`,
                courier: ['EP-CR0C', 'EP-CR0A', 'EP-CR0DP', 'EP-CR0DU'],
              },
            ],

            // from: {
            //   name: from.name,
            //   phone: from.phone,
            //   email: from.email,
            //   address1: from.address1,
            //   address2: from.address2 || '',
            //   city: from.city,
            //   state: from.state,
            //   postcode: from.postcode,
            //   country: from.country,
            //   // name: 'QYVE',
            //   // phone: '60125549155',
            //   // email: 'support@qyveofficial.com',
            //   // address1: '5B Jalan Chempenai',
            //   // address2: '',
            //   // city: 'Bukit Damansara',
            //   // state: 'WP Kuala Lumpur',
            //   // postcode: '50490',
            //   // country: 'Malaysia',
            // },
            // to: {
            //   name: to.name,
            //   phone: to.phone,
            //   email: to.email,
            //   address1: to.address1,
            //   address2: to.address2 || '',
            //   city: to.city,
            //   state: to.state,
            //   postcode: to.postcode,
            //   country: to.country,
            // },
            // parcel: {
            //   weight: parcel.weight,
            //   length: parcel.length,
            //   width: parcel.width,
            //   height: parcel.height,
            //   content: parcel.content,
            //   value: parcel.value,
            //   // weight: '0.3',
            //   // length: '',
            //   // width: '',
            //   // height: '',
            //   // content: 'sportswear',
            //   // value: '',
            // }
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `EasyParcel API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      console.log('data: ', data);

      // const rate: any[] = data.result.map((rate: any) => ({
      //   courier: rate.courier,
      //   courierId: rate.courier_id,
      //   service: rate.service_detail,
      //   price: parseFloat(rate.price),
      //   deliveryTime: rate.delivery_time,
      // }))

      // const allowedCouriers = ['DHL', 'Pos Laju', 'J&T Express', 'Ninjavan'];
      // const allowedCourierId = ['EP-CR0C', 'EP-CR0A', 'EP-CR0DP', 'EP-CR0DU'];

      // const courierRates = data.result.filter((r: any) =>
      //   allowedCourierId.includes(r.courier_id),

      // );

      // console.log('first courier: ', data.result[0]);

      // const courierRates = data.result[0].rates.filter((r: any) =>
      //   allowedCourierId.includes(r.courier_id),
      // );

      const cheapestRate = data.result[0].rates
        // .filter((r: any) => allowedCourierId.includes(r.courier_id))
        .reduce((min: any, r: any) => {
          const price = Number(r.price);
          return !min || price < Number(min.price) ? r : min;
        }, null);

      // console.log('Courier rates: ', courierRates);
      console.log('Cheapest rate ', cheapestRate.price);

      // console.log('rates 2nd array: ', data.result[1].rates);

      if (data.error) {
        throw new Error(`EasyParcel API error: ${data.error}`);
      }

      this.rateCache.set(cacheKey, Number(cheapestRate.price));

      return cheapestRate.price;
    } catch (error) {
      console.error('❌ Failed to get shipping rates:', error);
      throw error;
    }
  }
}
