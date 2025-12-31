import { NextResponse } from 'next/server';

import { supabase } from '@/libs/supabaseClient';

export async function POST(req: Request) {
  //   try {
  console.log('POST hit'); // ✅ add to confirm

  const body = await req.json();
  const { userId } = body;
  const { code } = body;

  console.log('body.code: ', code);

  // Step 1: Get voucher ID from the code
  const { data: voucher, error: voucherError } = await supabase
    .from('vouchers')
    .select('*')
    .eq('code', code)
    .single();

  console.log('voucher data: ', voucher);

  

  if (voucherError) {
    return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
  }

  if (voucher.free_shipping === true) {
    return NextResponse.json(
      {
        status: 'valid',
        value: voucher.value,
        discount_type: voucher.discount_type,
        free_shipping: voucher.free_shipping === true
      },
      { status: 200 },
    );
  }
  else {
    // Step 2: Check if the user has already used this voucher
    const { data: userVoucherData, error: userVoucherError } = await supabase
      .from('user_vouchers')
      .select('*')
      .eq('user_id', userId)
      .eq('voucher_id', voucher.id)
      .maybeSingle(); // So `null` is returned if not found

    if (userVoucherError) {
      console.error('Error fetching user_vouchers:', userVoucherError);
      return NextResponse.json(
        { error: 'Error checking voucher' },
        { status: 500 },
      );
    }

    // Step 3: Respond accordingly
    if (userVoucherData) {
      return NextResponse.json({ status: 'used' }, { status: 200 });
    }
    return NextResponse.json(
      {
        status: 'valid',
        value: voucher.value,
        discount_type: voucher.discount_type,
      },
      { status: 200 },
    );
  }

  

}

// export async function GET() {
//   return NextResponse.json({ message: 'API is working' });
// }
