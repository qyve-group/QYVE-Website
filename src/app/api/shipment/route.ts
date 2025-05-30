// import { json } from 'stream/consumers';
import { NextResponse } from 'next/server';

const baseUrl = 'http://demo.connect.easyparcel.my/?ac=';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // console.log('payload: ', body);

    switch (body.action) {
      case 'checkRates': {
        const newBody = JSON.stringify({
          api: process.env.EASYPARCEL_KEY,
          bulk: body.bulk,
        });

        const response = await fetch(`${baseUrl}EPRateCheckingBulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: newBody,
        });

        if (!response.ok) {
          throw new Error(`External API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
      }

      default:
        return NextResponse.json({ message: 'Default action' });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
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
}
