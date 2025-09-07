// Demo: How to update order status in database
// This demonstrates the shipping status progression workflow

import { supabase } from '@/libs/supabaseClient';

import { updateOrderStatus } from './orderStatusMapper';

// Example: How to update order status through the shipping flow
export const progressOrderStatus = async (orderId: number) => {
  try {
    console.log('Starting order status progression demo for order:', orderId);

    // Step 1: Order Placed → Payment Confirmed
    await updateOrderStatus(orderId, 'pending', 'payment_confirmed', supabase);
    console.log('✅ Step 1: Payment confirmed');

    // Step 2: Payment Confirmed → Processing
    await updateOrderStatus(orderId, 'pending', 'processing', supabase);
    console.log('✅ Step 2: Order processing');

    // Step 3: Processing → Shipped
    await updateOrderStatus(orderId, 'processing', 'shipped', supabase);
    console.log('✅ Step 3: Order shipped');

    // Step 4: Shipped → Delivered
    await updateOrderStatus(orderId, 'completed', 'delivered', supabase);
    console.log('✅ Step 4: Order delivered');

    console.log('Order status progression completed successfully!');
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

// Individual status update functions for admin use
export const markOrderAsPaid = (orderId: number) =>
  updateOrderStatus(orderId, 'pending', 'payment_confirmed', supabase);

export const markOrderAsProcessing = (orderId: number) =>
  updateOrderStatus(orderId, 'pending', 'processing', supabase);

export const markOrderAsShipped = (orderId: number) =>
  updateOrderStatus(orderId, 'processing', 'shipped', supabase);

export const markOrderAsDelivered = (orderId: number) =>
  updateOrderStatus(orderId, 'completed', 'delivered', supabase);
