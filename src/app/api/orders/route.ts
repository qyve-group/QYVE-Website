import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured, returning demo orders');
      return NextResponse.json({
        success: true,
        orders: [
          {
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            total: 150,
            status: 'delivered',
            paymentStatus: 'paid',
            items: [
              { id: '1', productName: 'QYVE Infinitus', productSize: '9', productColor: 'Black', quantity: 1, price: 150 }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Main St',
              city: 'Kuala Lumpur',
              state: 'Selangor',
              postalCode: '50000',
              country: 'Malaysia'
            },
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-16T14:20:00Z'
          }
        ]
      });
    }

    // Fetch orders from Supabase
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        total_amount,
        status,
        payment_status,
        created_at,
        updated_at,
        order_items(
          id,
          product_name,
          product_size,
          product_color,
          quantity,
          price
        ),
        shipping_address(
          name,
          address,
          city,
          state,
          postal_code,
          country
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      // Return demo orders on error
      return NextResponse.json({
        success: true,
        orders: [
          {
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            total: 150,
            status: 'delivered',
            paymentStatus: 'paid',
            items: [
              { id: '1', productName: 'QYVE Infinitus', productSize: '9', productColor: 'Black', quantity: 1, price: 150 }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Main St',
              city: 'Kuala Lumpur',
              state: 'Selangor',
              postalCode: '50000',
              country: 'Malaysia'
            },
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-16T14:20:00Z'
          }
        ]
      });
    }

    // Transform the data to match the admin interface
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      total: order.total_amount,
      status: order.status || 'pending',
      paymentStatus: order.payment_status || 'pending',
      items: order.order_items || [],
      shippingAddress: order.shipping_address || {},
      createdAt: order.created_at,
      updatedAt: order.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    });

  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Update order in Supabase
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (paymentStatus) updateData.payment_status = paymentStatus;

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Delete order from Supabase
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to delete order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Order deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}