// Order Status Mapping Utility
// Maps database status values to shipping progress steps

export interface OrderStatusMapping {
  orderStatus: string;
  shippingStatus: string;
  stepIndex: number;
  stepName: string;
  description: string;
}

export const orderStatusMappings: OrderStatusMapping[] = [
  {
    orderStatus: 'pending',
    shippingStatus: 'order_placed',
    stepIndex: 0,
    stepName: 'Order Placed',
    description: 'Your order has been received and is being processed',
  },
  {
    orderStatus: 'pending',
    shippingStatus: 'payment_confirmed',
    stepIndex: 1,
    stepName: 'Payment Confirmed',
    description: 'Payment has been successfully processed',
  },
  {
    orderStatus: 'pending',
    shippingStatus: 'processing',
    stepIndex: 2,
    stepName: 'Processing',
    description: 'Your order is being prepared for shipment',
  },
  {
    orderStatus: 'processing',
    shippingStatus: 'shipped',
    stepIndex: 3,
    stepName: 'Shipped',
    description: 'Your order has been shipped and is on its way',
  },
  {
    orderStatus: 'completed',
    shippingStatus: 'delivered',
    stepIndex: 4,
    stepName: 'Delivered',
    description: 'Your order has been successfully delivered',
  },
];

export const getShippingStepIndex = (
  orderStatus: string,
  shippingStatus: string,
): number => {
  // Handle null/undefined values
  if (!orderStatus || !shippingStatus) {
    return 0;
  }

  const cleanOrderStatus = orderStatus.toLowerCase().trim();
  const cleanShippingStatus = shippingStatus.toLowerCase().trim();

  // First, try to match both order status and shipping status
  const exactMatch = orderStatusMappings.find(
    (mapping) =>
      mapping.orderStatus.toLowerCase() === cleanOrderStatus &&
      mapping.shippingStatus.toLowerCase() === cleanShippingStatus,
  );

  if (exactMatch) {
    return exactMatch.stepIndex;
  }

  // If no exact match, try to match shipping status only
  const shippingMatch = orderStatusMappings.find(
    (mapping) => mapping.shippingStatus.toLowerCase() === cleanShippingStatus,
  );

  if (shippingMatch) {
    return shippingMatch.stepIndex;
  }

  // Legacy database status mapping for existing orders
  if (cleanOrderStatus === 'pending' && cleanShippingStatus === 'processing') {
    return 2; // Processing step
  }
  if (cleanOrderStatus === 'processing' && cleanShippingStatus === 'shipped') {
    return 3; // Shipped step
  }
  if (cleanOrderStatus === 'completed' && cleanShippingStatus === 'delivered') {
    return 4; // Delivered step
  }

  // Default to order placed if no match found
  return 0;
};

export const getStatusDescription = (
  orderStatus: string,
  shippingStatus: string,
): string => {
  // Handle null/undefined values
  if (!orderStatus || !shippingStatus) {
    return 'Order is being processed';
  }

  const cleanOrderStatus = orderStatus.toLowerCase().trim();
  const cleanShippingStatus = shippingStatus.toLowerCase().trim();

  const mapping = orderStatusMappings.find(
    (m) =>
      m.orderStatus.toLowerCase() === cleanOrderStatus &&
      m.shippingStatus.toLowerCase() === cleanShippingStatus,
  );

  if (mapping) {
    return mapping.description;
  }

  // Provide descriptions for legacy database combinations
  if (cleanOrderStatus === 'pending' && cleanShippingStatus === 'processing') {
    return 'Your order is being prepared for shipment';
  }
  if (cleanOrderStatus === 'processing' && cleanShippingStatus === 'shipped') {
    return 'Your order has been shipped and is on its way';
  }
  if (cleanOrderStatus === 'completed' && cleanShippingStatus === 'delivered') {
    return 'Your order has been successfully delivered';
  }

  return 'Order is being processed';
};

// Function to update order status in database
export const updateOrderStatus = async (
  orderId: number,
  newOrderStatus: string,
  newShippingStatus: string,
  supabaseClient: any,
) => {
  const { data, error } = await supabaseClient
    .from('orders')
    .update({
      status: newOrderStatus,
      shipping_status: newShippingStatus,
      ...(newShippingStatus === 'delivered' && {
        delivered_at: new Date().toISOString(),
      }),
    })
    .eq('id', orderId)
    .select();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return data;
};
