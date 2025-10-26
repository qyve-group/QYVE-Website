import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libs/supabaseServer';
import { generateRefundWhatsAppLink, checkRefundEligibility } from '@/data/refund-types';

// GET /api/refunds - Get all refund requests
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const orderId = searchParams.get('order_id');

    let query = supabase
      .from('refund_requests')
      .select(`
        *,
        orders!inner(
          id,
          order_number,
          total_price,
          status,
          delivered_at,
          customer_name,
          customer_email
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Filter by order ID if provided
    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    const { data: refunds, error } = await query;

    if (error) {
      console.error('Error fetching refunds:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch refunds', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      refunds: refunds || [],
    });
  } catch (error: any) {
    console.error('Refunds API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch refunds', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/refunds - Create a new refund request
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { order_id, customer_id, reason } = body;

    // Validate required fields
    if (!order_id || !customer_id) {
      return NextResponse.json(
        { success: false, message: 'Order ID and Customer ID are required' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { success: false, message: 'Refunds are only available for delivered orders' },
        { status: 400 }
      );
    }

    // Check refund eligibility
    const deliveryDate = order.delivered_at || order.created_at;
    const eligibility = checkRefundEligibility(deliveryDate);

    if (!eligibility.can_request_refund) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Refund window has expired',
          eligibility 
        },
        { status: 400 }
      );
    }

    // Check if refund request already exists
    const { data: existingRefund, error: existingError } = await supabase
      .from('refund_requests')
      .select('id')
      .eq('order_id', order_id)
      .eq('customer_id', customer_id)
      .single();

    if (existingRefund) {
      return NextResponse.json(
        { success: false, message: 'Refund request already exists for this order' },
        { status: 400 }
      );
    }

    // Generate order number (if not exists)
    const orderNumber = order.order_number || `QYVE-2024-${order.id.toString().padStart(3, '0')}`;

    // Create refund request
    const refundData = {
      order_id,
      customer_id,
      customer_name: order.customer_name || 'Unknown',
      customer_email: order.customer_email || '',
      order_number: orderNumber,
      amount: order.total_price,
      currency: 'MYR',
      reason: reason || null,
      status: 'pending',
      whatsapp_message: `Hi QYVE, I'd like to request a refund for Order #${orderNumber}.`,
      whatsapp_link: generateRefundWhatsAppLink(orderNumber),
      eligibility: eligibility,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: refund, error: refundError } = await supabase
      .from('refund_requests')
      .insert([refundData])
      .select()
      .single();

    if (refundError) {
      console.error('Error creating refund request:', refundError);
      return NextResponse.json(
        { success: false, message: 'Failed to create refund request', error: refundError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      refund,
      message: 'Refund request created successfully'
    });
  } catch (error: any) {
    console.error('Create refund API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create refund request', error: error.message },
      { status: 500 }
    );
  }
}
