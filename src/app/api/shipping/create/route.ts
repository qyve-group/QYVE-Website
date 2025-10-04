// Create shipment API endpoint
// Create shipment with EasyParcel and update order status

import { NextRequest, NextResponse } from 'next/server';
import { createShipment, autoCreateShipment } from '@/lib/easyparcel-service';
import { createClient } from '@supabase/supabase-js';
import { sendShippingNotification } from '@/lib/email-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      orderId, 
      from, 
      to, 
      parcel, 
      courier, 
      service, 
      autoSelect = false,
      preference = 'cheapest'
    } = body;

    // Validate required fields
    if (!orderId || !from || !to || !parcel) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, from, to, and parcel' },
        { status: 400 }
      );
    }

    let shipmentResult;

    if (autoSelect) {
      // Auto-select best shipping option
      shipmentResult = await autoCreateShipment(from, to, parcel, preference);
    } else {
      // Use specified courier and service
      if (!courier || !service) {
        return NextResponse.json(
          { error: 'Missing required fields: courier and service' },
          { status: 400 }
        );
      }
      shipmentResult = await createShipment(from, to, parcel, courier, service);
    }

    if (!shipmentResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: shipmentResult.error,
        },
        { status: 500 }
      );
    }

    // Update order in database with tracking information
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          tracking_number: shipmentResult.trackingNumber,
          courier: shipmentResult.courier,
          shipping_service: shipmentResult.service,
          shipping_cost: shipmentResult.price,
          estimated_delivery: shipmentResult.deliveryTime,
          status: 'shipped',
          shipped_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('❌ Failed to update order with tracking info:', updateError);
        // Don't fail the shipment creation, just log the error
      } else {
        console.log('✅ Order updated with tracking information');
      }
    } catch (dbError) {
      console.error('❌ Database update error:', dbError);
      // Don't fail the shipment creation
    }

    // Send shipping notification email
    try {
      // Get order details for email
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products_sizes(
              *,
              product_colors(
                *,
                products(*)
              )
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (!orderError && orderData) {
        const emailData = {
          orderId: orderData.id,
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
          totalAmount: orderData.total_price,
          currency: 'MYR',
          items: orderData.order_items?.map((item: any) => ({
            name: item.products_sizes?.product_colors?.products?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
            size: item.products_sizes?.size || 'N/A',
            color: item.products_sizes?.product_colors?.color || 'N/A',
          })) || [],
          shippingAddress: {
            line1: orderData.shipping_address_1,
            line2: orderData.shipping_address_2,
            city: orderData.city,
            state: orderData.state,
            postalCode: orderData.postal_code,
            country: orderData.country,
          },
          trackingNumber: shipmentResult.trackingNumber,
          estimatedDelivery: shipmentResult.deliveryTime,
        };

        await sendShippingNotification(emailData);
        console.log('✅ Shipping notification email sent');
      }
    } catch (emailError) {
      console.error('❌ Failed to send shipping notification email:', emailError);
      // Don't fail the shipment creation
    }

    return NextResponse.json({
      success: true,
      trackingNumber: shipmentResult.trackingNumber,
      courier: shipmentResult.courier,
      service: shipmentResult.service,
      price: shipmentResult.price,
      deliveryTime: shipmentResult.deliveryTime,
      message: 'Shipment created successfully',
    });
  } catch (error) {
    console.error('❌ Create shipment API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
