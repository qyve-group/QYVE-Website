'use client';

import {
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import RefundButton from '@/components/RefundButton';
import RefundEligibilityStatus from '@/components/RefundEligibilityStatus';
import { 
  checkRefundEligibility, 
  MOCK_ORDER_REFUND_DATA,
  type OrderRefundData 
} from '@/data/refund-types';
import { supabase } from '@/libs/supabaseClient';
import type { RootState } from '@/store/store';
import {
  getShippingStepIndex,
  getStatusDescription,
} from '@/utils/orderStatusMapper';

import Loading from '../loading';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_size_id: number;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  size?: string;
  color?: string;
}

interface Order {
  id: number;
  total_price: number;
  subtotal: number;
  tracking_no: string;
  status: string;
  shipping_status: string;
  created_at: string;
  delivered_at?: string;
}

const ShippingProgress = ({
  shippingStatus,
  orderStatus,
  createdAt,
  deliveredAt,
}: {
  shippingStatus: string;
  orderStatus: string;
  createdAt: string;
  deliveredAt?: string;
}) => {
  const steps = [
    {
      icon: <Package size={20} />,
      label: 'Order Placed',
      status: 'order_placed',
      color: 'bg-green-500',
    },
    {
      icon: <CreditCard size={20} />,
      label: 'Payment Confirmed',
      status: 'payment_confirmed',
      color: 'bg-blue-500',
    },
    {
      icon: <Package size={20} />,
      label: 'Processing',
      status: 'processing',
      color: 'bg-yellow-500',
    },
    {
      icon: <Truck size={20} />,
      label: 'Shipped',
      status: 'shipped',
      color: 'bg-purple-500',
    },
    {
      icon: <CheckCircle size={20} />,
      label: 'Delivered',
      status: 'delivered',
      color: 'bg-green-600',
    },
  ];

  // Get current step index using the status mapper utility
  const currentStepIndex = getShippingStepIndex(orderStatus, shippingStatus);
  const statusDescription = getStatusDescription(orderStatus, shippingStatus);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-gray-800 mb-4 font-semibold">Shipping Progress</h4>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center">
            <div
              className={`flex size-10 items-center justify-center rounded-full text-white transition-colors ${
                index <= currentStepIndex ? step.color : 'bg-gray-300'
              }`}
            >
              {step.icon}
            </div>
            <span
              className={`mt-2 max-w-16 text-center text-xs ${
                index <= currentStepIndex
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`mt-2 h-0.5 w-12 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-gray-600 mt-4 text-sm">
        <p className="text-gray-700 mb-2 font-medium">{statusDescription}</p>
        <p>Order placed: {new Date(createdAt).toLocaleDateString()}</p>
        {deliveredAt && (
          <p>Delivered: {new Date(deliveredAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

// Enhanced refund functionality integrated below

export default function MyOrders() {
  const userId = useSelector((state: RootState) => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: number]: OrderItem[] }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [hasOrderItems, setHasOrderItems] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userId?.id) return;

    const fetchOrders = async () => {
      setLoading(true);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setLoading(false);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setLoading(false);
        return;
      }

      setHasOrderItems(true);
      setOrders(ordersData);

      // Fetch order items for each order
      const orderIds = ordersData.map((order) => order.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        setLoading(false);
        return;
      }

      // Group items by order_id and fetch product details
      const groupedItems: { [key: number]: OrderItem[] } = {};

      for (const item of itemsData || []) {
        if (!groupedItems[item.order_id]) {
          groupedItems[item.order_id] = [];
        }

        // Fetch product details
        /* eslint-disable no-await-in-loop */
        const { data: productData } = await supabase
          .from('products_sizes')
          .select(
            `
            size,
            product_colors!inner(color, image),
            products!inner(name, image_cover)
          `,
          )
          .eq('id', item.product_size_id)
          .single();

        const enrichedItem = {
          ...item,
          name: (productData as any)?.products?.name || 'Unknown Product',
          image:
            (productData as any)?.product_colors?.image ||
            (productData as any)?.products?.image_cover ||
            '/placeholder.jpg',
          size: (productData as any)?.size || 'N/A',
          color: (productData as any)?.product_colors?.color || 'N/A',
        };

        if (enrichedItem) {
          groupedItems[item.order_id]?.push(enrichedItem);
        }
      }

      setOrderItems(groupedItems);
      setLoading(false);
    };

    fetchOrders();
  }, [userId?.id]);

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {!hasOrderItems ? (
        <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-md">
          <svg
            className="text-gray-400 mx-auto size-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h18M9 3v18m6-18v18M4 21h16"
            />
          </svg>
          <h2 className="text-gray-800 mt-4 text-lg font-semibold">
            You have no orders
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Looks like you haven&apos;t placed any orders yet.
          </p>
          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-black transition hover:bg-black hover:text-primary"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-700 hover:bg-gray-300 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-lg">←</span>
              Back
            </button>
          </div>

          <h1 className="text-gray-900 text-2xl font-bold">My Orders</h1>

          {orders.map((order) => {
            const items = orderItems[order.id] || [];

            return (
              <div
                key={order.id}
                className="border-gray-200 space-y-6 rounded-lg border bg-white p-6 shadow-md"
              >
                {/* Order Header */}
                <div className="border-b pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">
                        Order ID:{' '}
                        <span className="text-gray-800 italic">{order.id}</span>
                      </p>
                      {order.tracking_no && (
                        <p className="text-gray-700 mt-1 text-sm font-semibold">
                          Tracking Number:{' '}
                          <span className="text-gray-800 italic">
                            {order.tracking_no}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 text-lg font-bold">
                        RM {order.total_price}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Progress */}
                <ShippingProgress
                  shippingStatus={order.shipping_status}
                  orderStatus={order.status}
                  createdAt={order.created_at}
                  deliveredAt={order.delivered_at}
                />

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-gray-800 font-semibold">Items Ordered</h4>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 flex items-center gap-4 rounded-lg p-4"
                    >
                      <div className="relative size-16 overflow-hidden rounded-lg">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-gray-900 font-medium">
                          {item.name}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-semibold">
                          RM {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>RM {order.subtotal}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>RM {order.total_price}</span>
                  </div>
                </div>

                {/* Enhanced Refund Section */}
                {order.shipping_status === 'delivered' && (
                  <div className="border-t pt-4">
                    <h4 className="text-gray-800 font-semibold mb-3">Refund Options</h4>
                    
                    {/* Refund Eligibility Status */}
                    <RefundEligibilityStatus
                      eligibility={checkRefundEligibility(order.delivered_at || order.created_at)}
                      className="mb-4"
                    />
                    
                    {/* Refund Button */}
                    <RefundButton
                      orderNumber={`QYVE-2024-${order.id.toString().padStart(3, '0')}`}
                      orderId={order.id.toString()}
                      amount={order.total_price}
                      currency="MYR"
                      eligibility={checkRefundEligibility(order.delivered_at || order.created_at)}
                      onRefundRequest={(orderId, reason) => {
                        console.log('Refund requested for order:', orderId, 'Reason:', reason);
                        // Here you would typically send the refund request to your backend
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
