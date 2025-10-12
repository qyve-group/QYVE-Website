// Automated Shipping Service for QYVE E-commerce Platform
// Integrates EasyParcel with email notifications for complete shipping automation

import { createClient } from '@supabase/supabase-js';
import { easyParcelService, type ShippingAddress, type ParcelDetails } from './easyparcel-service';
import { mockEasyParcelService } from './easyparcel-service-mock';
import { sendShippingNotification } from './email-service-integrated';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
);

interface OrderData {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  total_amount: number;
  currency: string;
  shipping_address_1: string;
  shipping_address_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_size_id: string;
  quantity: number;
  price: number;
  product_name?: string;
  product_size?: string;
  product_color?: string;
}

export class AutomatedShippingService {
  private static instance: AutomatedShippingService;

  public static getInstance(): AutomatedShippingService {
    if (!AutomatedShippingService.instance) {
      AutomatedShippingService.instance = new AutomatedShippingService();
    }
    return AutomatedShippingService.instance;
  }

  // Process pending orders for shipping
  async processPendingOrders(): Promise<void> {
    try {
      console.log('📦 Processing pending orders for shipping...');

      // Get all paid orders that haven't been shipped
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid')
        .is('tracking_number', null)
        .order('created_at', { ascending: true });

      if (ordersError) {
        console.error('❌ Failed to fetch pending orders:', ordersError);
        return;
      }

      if (!orders || orders.length === 0) {
        console.log('✅ No pending orders to process');
        return;
      }

      console.log(`📦 Found ${orders.length} pending orders to process`);

      for (const order of orders) {
        try {
          await this.processOrderForShipping(order as OrderData);
        } catch (error) {
          console.error(`❌ Failed to process order ${order.id}:`, error);
          // Continue with next order
        }
      }

      console.log('✅ Finished processing pending orders');
    } catch (error) {
      console.error('❌ Failed to process pending orders:', error);
    }
  }

  // Process a single order for shipping
  async processOrderForShipping(order: OrderData): Promise<void> {
    try {
      console.log(`📦 Processing order ${order.id} for shipping...`);

      // Get order items
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product_sizes (
            size,
            products (
              name,
              color
            )
          )
        `)
        .eq('order_id', order.id);

      if (itemsError || !orderItems) {
        console.error('❌ Failed to fetch order items:', itemsError);
        return;
      }

      // Prepare shipping addresses
      const fromAddress: ShippingAddress = {
        name: 'QYVE Official',
        phone: '+601160974239',
        email: 'shipping@qyveofficial.com',
        address1: 'QYVE Warehouse',
        address2: 'Unit 123',
        city: 'Kuala Lumpur',
        state: 'Kuala Lumpur',
        postcode: '50000',
        country: 'Malaysia',
      };

      const toAddress: ShippingAddress = {
        name: order.guest_name || 'Customer',
        phone: '+60123456789', // Default phone, should be collected during checkout
        email: order.guest_email || 'customer@example.com',
        address1: order.shipping_address_1,
        address2: order.shipping_address_2 || '',
        city: order.city,
        state: order.state,
        postcode: order.postal_code,
        country: order.country,
      };

      // Calculate parcel details
      const parcelDetails: ParcelDetails = this.calculateParcelDetails(orderItems);

      // Create shipment with EasyParcel (using mock for testing)
      console.log('📦 Creating shipment with EasyParcel...');
      const shipmentService = process.env.EASYPARCEL_API_KEY ? easyParcelService : mockEasyParcelService;
      const shipmentResult = await shipmentService.autoCreateShipment(
        fromAddress,
        toAddress,
        parcelDetails,
        'cheapest', // Use cheapest shipping option
      );

      if (!shipmentResult.success || !shipmentResult.trackingNumber) {
        console.error('❌ Failed to create shipment:', shipmentResult.error);
        return;
      }

      // Update order with tracking information
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          tracking_number: shipmentResult.trackingNumber,
          courier: shipmentResult.courier,
          shipping_service: shipmentResult.service,
          shipping_cost: shipmentResult.price,
          status: 'shipped',
          shipped_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('❌ Failed to update order with tracking info:', updateError);
        return;
      }

      console.log(`✅ Order ${order.id} shipped with tracking: ${shipmentResult.trackingNumber}`);

      // Send shipping notification email
      await this.sendShippingNotificationEmail(order, orderItems, shipmentResult);

    } catch (error) {
      console.error(`❌ Failed to process order ${order.id} for shipping:`, error);
      throw error;
    }
  }

  // Calculate parcel details from order items
  private calculateParcelDetails(orderItems: any[]): ParcelDetails {
    // Default parcel dimensions for clothing items
    const baseWeight = 0.2; // 200g per item
    const baseLength = 30; // 30cm
    const baseWidth = 25; // 25cm
    const baseHeight = 5; // 5cm

    let totalWeight = 0;
    let totalValue = 0;

    for (const item of orderItems) {
      totalWeight += baseWeight * item.quantity;
      totalValue += item.price * item.quantity;
    }

    return {
      weight: Math.max(totalWeight, 0.1), // Minimum 100g
      length: baseLength,
      width: baseWidth,
      height: Math.max(baseHeight, Math.ceil(totalWeight / 0.1) * 2), // Adjust height based on weight
      content: 'Clothing and Apparel',
      value: totalValue,
    };
  }

  // Send shipping notification email
  private async sendShippingNotificationEmail(
    order: OrderData,
    orderItems: any[],
    shipmentResult: any,
  ): Promise<void> {
    try {
      console.log(`📧 Sending shipping notification for order ${order.id}...`);

      const customerEmail = order.guest_email;
      const customerName = order.guest_name || 'Customer';

      if (!customerEmail) {
        console.log('⚠️ No customer email found, skipping shipping notification');
        return;
      }

      const emailData = {
        orderId: order.id,
        customerName: customerName,
        customerEmail: customerEmail,
        totalAmount: order.total_amount,
        currency: order.currency.toUpperCase(),
        items: orderItems.map((item: any) => ({
          name: item.product_sizes?.products?.name || 'Product',
          quantity: item.quantity,
          price: item.price,
          size: item.product_sizes?.size || 'N/A',
          color: item.product_sizes?.products?.color || 'N/A',
        })),
        shippingAddress: {
          line1: order.shipping_address_1,
          line2: order.shipping_address_2 || '',
          city: order.city,
          state: order.state,
          postalCode: order.postal_code,
          country: order.country,
        },
        trackingNumber: shipmentResult.trackingNumber,
        estimatedDelivery: shipmentResult.deliveryTime || '3-5 business days',
      };

      const emailResult = await sendShippingNotification(emailData);

      if (emailResult.success) {
        console.log(`✅ Shipping notification sent for order ${order.id}:`, emailResult.messageId);
      } else {
        console.error(`❌ Failed to send shipping notification for order ${order.id}:`, emailResult.error);
      }
    } catch (error) {
      console.error(`❌ Failed to send shipping notification email for order ${order.id}:`, error);
    }
  }

  // Process a specific order by ID
  async processOrderById(orderId: string): Promise<void> {
    try {
      console.log(`📦 Processing specific order ${orderId} for shipping...`);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        console.error('❌ Order not found:', orderError);
        return;
      }

      if (order.status !== 'paid') {
        console.log(`⚠️ Order ${orderId} is not in paid status (current: ${order.status})`);
        return;
      }

      if (order.tracking_number) {
        console.log(`⚠️ Order ${orderId} already has tracking number: ${order.tracking_number}`);
        return;
      }

      await this.processOrderForShipping(order as OrderData);
    } catch (error) {
      console.error(`❌ Failed to process order ${orderId}:`, error);
      throw error;
    }
  }

  // Get shipping status for an order
  async getOrderShippingStatus(orderId: string): Promise<any> {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        return { success: false, error: 'Order not found' };
      }

      if (!order.tracking_number) {
        return { success: false, error: 'No tracking number available' };
      }

      // Get tracking info from EasyParcel
      const trackingResult = await easyParcelService.trackShipment(order.tracking_number);

      return {
        success: true,
        order: order,
        tracking: trackingResult,
      };
    } catch (error) {
      console.error(`❌ Failed to get shipping status for order ${orderId}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const automatedShippingService = AutomatedShippingService.getInstance();

// Convenience functions
export const processPendingOrders = () => automatedShippingService.processPendingOrders();
export const processOrderById = (orderId: string) => automatedShippingService.processOrderById(orderId);
export const getOrderShippingStatus = (orderId: string) => automatedShippingService.getOrderShippingStatus(orderId);
