// import { json } from 'stream/consumers';
import { NextResponse } from 'next/server';

import { EasyParcelService } from '@/lib/easyparcel-service';

// const baseUrl = 'http://demo.connect.easyparcel.my/?ac=';

// export async function GET() {
//   const response = await fetch(baseUrl, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   const data = response.json();
// }

// const res = await fetch('api/shipment', {
//     method: 'POST',
//     headers: {'Content-Type' : 'application/json'},
//     body: JSON.stringify({
//         pick_code: '47400',
//         pick_state: '',
//         pick_country: '',
//         send_code: '50450',
//         send_state: '',
//         send_country: '',
//         weight: '',

//     })
// })

export interface ShippingRate {
  courier: string;
  service: string;
  price: number;
  deliveryTime: string;
  trackingNumber?: string;
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
  weight: number;
  length: number;
  width: number;
  height: number;
  content: string;
  value: number;
}

const sourceAddress: ShippingAddress = {
  name: 'QYVE',
  phone: '0125549155',
  email: 'support@qyveofficial.com',
  address1: '5B, Jalan Chempenai',
  city: 'Bukit Damansara',
  state: 'Kuala Lumpur',
  postcode: '50490',
  country: 'Malaysia',
};
const parcelDetails: ParcelDetails = {
  weight: 0.3,
  length: 10,
  width: 10,
  height: 10,
  content: 'sportswear',
  value: 100,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const easyParcel = EasyParcelService.getInstance();

    console.log('body before sent to getshippingrates: ', body);

    const cheapestRate = await easyParcel.getShippingRates(
      sourceAddress,
      body,
      parcelDetails,
    );
    return NextResponse.json(cheapestRate);
  } catch (err: any) {
    console.error('Error fetching shipping rates:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 },
    );
  }

  // const rates: ShippingRate[] = easyParcel.getShippingRates(sourceAddress, body, parcelDetails);

  // try {
  //   const body = await req.json();

  //   // console.log('payload: ', body);

  //   switch (body.action) {
  //     case 'checkRates': {
  //       const newBody = JSON.stringify({
  //         api: process.env.EASYPARCEL_KEY,
  //         bulk: body.bulk,
  //       });

  //       const response = await fetch(`${baseUrl}EPRateCheckingBulk`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: newBody,
  //       });

  //       if (!response.ok) {
  //         throw new Error(`External API error: ${response.status}`);
  //       }

  //       const data = await response.json();

  //       return NextResponse.json(data);
  //     }

  //     default:
  //       return NextResponse.json({ message: 'Default action' });
  //   }
  // } catch (error) {
  //   console.error('API route error:', error);
  //   return NextResponse.json(
  //     { error: 'Internal server error' },
  //     { status: 500 },
  //   );
}

// switch (body.action) {
//   case 'checkRates': {
//     const newBody = JSON.stringify({
//       api: process.env.EASYPARCEL_KEY,
//       bulk: body.bulk,
//     });

//     const response = await fetch(baseUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: newBody,
//     });

//     const data = await response.json();

//     return NextResponse.json(data);
//   }

//   default: {
//     return NextResponse.json({ message: 'Default action' });
//   }

// }

// const additionalBody = { api: process.env.EASYPARCEL_KEY, ...body };

// const response = await fetch(baseUrl + '?ac=EPRateCheckingBulk', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(additionalBody),
// });

// const data = await response.json();
// return Response.json(data);
// }
