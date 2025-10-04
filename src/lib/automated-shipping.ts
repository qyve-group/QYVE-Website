// Automated Shipping System for QYVE E-commerce Platform
// Automatically creates shipments when orders are confirmed

import { createClient } from '@supabase/supabase-js';
import { autoCreateShipment } from './easyparcel-service';
import { sendShippingNotification } from './email-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface ShippingResult {
  success: boolean;
  trackingNumber?: string;
  courier?: string;
  service?: string;
  price?: number;
  deliveryTime?: string;
  error?: string;
}

// QYVE warehouse address (configure this in environment variables)
const QYVE_WAREHOUSE = {
  name: process.env.WAREHOUSE_NAME || 'QYVE Warehouse',
  phone: process.env.WAREHOUSE_PHONE || '+60123456789',
  email: process.env.WAREHOUSE_EMAIL || 'warehouse@qyve.com',
  address1: process.env.WAREHOUSE_ADDRESS_1 || '123 Warehouse Street',
  address2: process.env.WAREHOUSE_ADDRESS_2 || 'Unit 5-1',
  city: process.env.WAREHOUSE_CITY || 'Kuala Lumpur',
  state: process.env.WAREHOUSE_STATE || 'Kuala Lumpur',
  postcode: process.env.WAREHOUSE_POSTCODE || '50000',
  country: process.env.WAREHOUSE_COUNTRY || 'Malaysia',
};

// Calculate parcel dimensions and weight based on items
function calculateParcelDetails(items: OrderData['items'], totalValue: number) {
  // Estimate weight based on item count (average 0.3kg per item)
  const estimatedWeight = Math.max(0.1, items.length * 0.3);
  
  // Estimate dimensions based on item count
  const baseLength = 20; // cm
  const baseWidth = 15; // cm
  const baseHeight = 5; // cm
  const itemHeight = 3; // cm per item
  
  const length = baseLength;
  const width = baseWidth;
  const height = Math.max(baseHeight, baseHeight + (items.length - 1) * itemHeight);
  
  return {
    weight: Math.min(estimatedWeight, 30), // Max 30kg
    length: Math.min(length, 100), // Max 100cm
    width: Math.min(width, 100), // Max 100cm
    height: Math.min(height, 100), // Max 100cm
    content: items.map(item => `${item.name} (${item.size || 'N/A'})`).join(', '),
    value: totalValue,
  };
}

// Automatically create shipment for an order
export async function autoCreateOrderShipment(orderData: OrderData): Promise<ShippingResult> {
  try {
    console.log('📦 Auto-creating shipment for order:', orderData.orderId);
    
    // Calculate parcel details
    const parcelDetails = calculateParcelDetails(orderData.items, orderData.totalAmount);
    
    // Prepare shipping addresses
    const fromAddress = QYVE_WAREHOUSE;
    const toAddress = {
      name: orderData.customerName,
      phone: '0123456789', // You might want to store customer phone in orders
      email: orderData.customerEmail,
      address1: orderData.shippingAddress.line1,
      address2: orderData.shippingAddress.line2 || '',
      city: orderData.shippingAddress.city,
      state: orderData.shippingAddress.state,
      postcode: orderData.shippingAddress.postalCode,
      country: orderData.shippingAddress.country,
    };

    // Create shipment with best rate (cheapest)
    const shipmentResult = await autoCreateShipment(
      fromAddress,
      toAddress,
      parcelDetails,
      'cheapest' // Use cheapest option for cost efficiency
    );

    if (!shipmentResult.success) {
      console.error('❌ Failed to create shipment:', shipmentResult.error);
      return {
        success: false,
        error: shipmentResult.error,
      };
    }

    // Update order in database
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
        .eq('id', orderData.orderId);

      if (updateError) {
        console.error('❌ Failed to update order:', updateError);
        return {
          success: false,
          error: 'Failed to update order with tracking information',
        };
      }

      console.log('✅ Order updated with tracking information');
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return {
        success: false,
        error: 'Failed to update order in database',
      };
    }

    // Send shipping notification email
    try {
      const emailData = {
        ...orderData,
        trackingNumber: shipmentResult.trackingNumber,
        estimatedDelivery: shipmentResult.deliveryTime,
      };

      await sendShippingNotification(emailData);
      console.log('✅ Shipping notification email sent');
    } catch (emailError) {
      console.error('❌ Failed to send shipping notification:', emailError);
      // Don't fail the shipment creation for email errors
    }

    return {
      success: true,
      trackingNumber: shipmentResult.trackingNumber,
      courier: shipmentResult.courier,
      service: shipmentResult.service,
      price: shipmentResult.price,
      deliveryTime: shipmentResult.deliveryTime,
    };
  } catch (error) {
    console.error('❌ Auto-create shipment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Process pending orders for shipping
export async function processPendingOrders(): Promise<{ processed: number; errors: number }> {
  try {
    console.log('📦 Processing pending orders for shipping...');
    
    // Get orders that are confirmed but not yet shipped
    const { data: orders, error: ordersError } = await supabase
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
      .eq('status', 'confirmed')
      .is('tracking_number', null);

    if (ordersError) {
      console.error('❌ Failed to fetch pending orders:', ordersError);
      return { processed: 0, errors: 1 };
    }

    if (!orders || orders.length === 0) {
      console.log('✅ No pending orders to process');
      return { processed: 0, errors: 0 };
    }

    console.log(`📦 Found ${orders.length} pending orders`);

    let processed = 0;
    let errors = 0;

    // Process each order
    for (const order of orders) {
      try {
        const orderData: OrderData = {
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          totalAmount: order.total_price,
          items: order.order_items?.map((item: any) => ({
            name: item.products_sizes?.product_colors?.products?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
            size: item.products_sizes?.size || 'N/A',
            color: item.products_sizes?.product_colors?.color || 'N/A',
          })) || [],
          shippingAddress: {
            line1: order.shipping_address_1,
            line2: order.shipping_address_2,
            city: order.city,
            state: order.state,
            postalCode: order.postal_code,
            country: order.country,
          },
        };

        const result = await autoCreateOrderShipment(orderData);
        
        if (result.success) {
          processed++;
          console.log(`✅ Processed order ${order.id} with tracking ${result.trackingNumber}`);
        } else {
          errors++;
          console.error(`❌ Failed to process order ${order.id}:`, result.error);
        }
      } catch (orderError) {
        errors++;
        console.error(`❌ Error processing order ${order.id}:`, orderError);
      }
    }

    console.log(`📊 Processing complete: ${processed} processed, ${errors} errors`);
    return { processed, errors };
  } catch (error) {
    console.error('❌ Process pending orders error:', error);
    return { processed: 0, errors: 1 };
  }
}

// Test automated shipping system
export async function testAutomatedShipping(): Promise<boolean> {
  try {
    console.log('🧪 Testing automated shipping system...');
    
    // Test with sample order data
    const testOrderData: OrderData = {
      orderId: 'TEST-ORDER-' + Date.now(),
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      totalAmount: 99.99,
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 99.99,
          size: 'M',
          color: 'Black',
        },
      ],
      shippingAddress: {
        line1: '123 Test Street',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postalCode: '50000',
        country: 'Malaysia',
      },
    };

    const result = await autoCreateOrderShipment(testOrderData);
    
    if (result.success) {
      console.log('✅ Automated shipping test successful');
      return true;
    } else {
      console.error('❌ Automated shipping test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Automated shipping test error:', error);
    return false;
  }
}
