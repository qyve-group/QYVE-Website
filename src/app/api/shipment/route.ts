// import { json } from 'stream/consumers';

const baseUrl = 'http://demo.connect.easyparcel.my/';

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
  const body = await req.json();

  const additionalBody = { api: process.env.EASYPARCEL_KEY, ...body };

  const response = await fetch(baseUrl + '?ac=EPRateCheckingBulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(additionalBody),
  });

  const data = await response.json();
  return Response.json(data);
}
