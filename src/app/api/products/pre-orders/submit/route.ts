import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { EmailService } from '@/lib/email-service-smtp';
import type { PreOrderData } from '@/lib/email-templates';
import { preOrderSchema } from '@/lib/validation/pre-order-schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // preorderschema is to validate if attributes in body is in the correct data type
    const validationResult = preOrderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    const {
      customerEmail,
      customerName,
      customerPhone,
      productName,
      productVariant,
      quantity,
      unitPrice,
      totalPrice,
      shippingAddress,
      bundleId,
      isPartOfBundle,
      preOrderNotes,
      depositRequired,
      depositAmount,
    } = validationResult.data;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          message: 'Please configure Supabase credentials',
        },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor
      ? forwardedFor.split(',')[0]?.trim()
      : realIp || null;

    const preOrderData = {
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone || null,
      product_name: productName,
      product_variant: productVariant || null,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      shipping_address: shippingAddress || null,
      bundle_id: bundleId || null,
      is_part_of_bundle: isPartOfBundle || false,
      pre_order_notes: preOrderNotes || null,
      deposit_required: depositRequired || false,
      deposit_amount: depositAmount || null,
      status: 'pending',
      payment_status: 'unpaid',
      source: 'website',
      ip_address: clientIp || null,
      user_agent: req.headers.get('user-agent'),
    };

    const { data, error } = await supabase
      .from('pre_orders')
      .insert([preOrderData])
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          error: 'Failed to create pre-order',
          details: error?.message || 'No data returned',
        },
        { status: 500 },
      );
    }

    await supabase.from('pre_order_status_history').insert([
      {
        pre_order_id: data.id,
        new_status: 'pending',
        notes: 'Pre-order created from website',
      },
    ]);

    const emailService = EmailService.getInstance();
    const emailData: PreOrderData = {
      preOrderId: data.id,
      customerName,
      customerEmail,
      productName,
      productVariant: productVariant || 'Standard',
      quantity,
      unitPrice,
      totalPrice,
      depositAmount: depositAmount || totalPrice * 0.3,
      estimatedDelivery: '8-12 weeks from deposit payment',
    };

    await emailService
      .sendPreOrderConfirmation(emailData)
      .catch((preorder_error) => {
        console.error(
          'Failed to send pre-order confirmation email:',
          preorder_error,
        );
      });

    return NextResponse.json({
      success: true,
      preOrderId: data.id,
      message: 'Pre-order submitted successfully!',
      data,
    });
  } catch (error) {
    console.error('Pre-order submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process pre-order' },
      { status: 500 },
    );
  }
}
