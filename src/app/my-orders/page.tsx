'use client';

import { CheckCircle, CreditCard, Package, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { CheckCircle, Truck, Package, Star, CreditCard } from "lucide-react";
// import Button from "@/shared/Button/Button";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { supabase } from '@/libs/supabaseClient';
import type { CartItem } from '@/store/cartSlice';
import type { RootState } from '@/store/store';

import Loading from '../loading';

// export default function MyOrders() {
const ShippingProgress = () => {
  const steps = [
    {
      icon: <Package size={32} />,
      label: 'Order Placed',
      date: 'Mar 25, 2025',
    },
    { icon: <CreditCard size={32} />, label: 'Paid', date: 'Mar 26, 2025' },
    { icon: <Truck size={32} />, label: 'Shipped Out', date: 'Mar 27, 2025' },
    {
      icon: <CheckCircle size={32} />,
      label: 'Order Received',
      date: 'Mar 30, 2025',
    },
    // { icon: <Star size={32} />, label: "To Rate", date: null },
  ];

  //   export interface CartItem {
  //     id: number; //product_id
  //     name: string;
  //     price: number;
  //     // image: string;
  //     product_size: string | null;
  //     quantity: number;
  //     image: string;
  //   }

  //   export interface CartState {
  //     items: CartItem[];
  //     totalQuantity: number;
  //     totalPrice: number;
  //   }

  const info = {
    name: 'Adam Yaqin',
    phone: '0123456789',
    street: '1, Lorong Dahlia, Kg. Sg. Kayu Ara',
    city: 'Petaling Jaya',
    pcode: '46201',
    state: 'Selangor',
  };

  // const [orderItems, setOrderItems] = useState([
  //     { image: "image_name", name: "Beige Slides", quantity: 2, price: 70 },
  //     { image: "image_name_2", name: "Black Jersey", quantity: 3, price: 150 },
  //     { image: "image_name_3", name: "Black Slides", quantity: 1, price: 35 },
  //     { image: "image_name_4", name: "Sub-Zero", quantity: 1, price: 200 },
  // ]);

  // supabase order_items col
  // orderItemID: uuid,
  // order_id: uuid,
  // product_id: Number,
  // quantity: Number,
  // price: number

  // const [orderId, setOrderId] = useState("");
  const [orderIds, setOrderIds] = useState<string[]>([]); // Store multiple order IDs
  const [totalPrice, setTotalPrice] = useState<number[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    //console.log*('userId: ', userId?.id);
    const fetchOrderIds = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_price')
        .eq('user_id', userId?.id);

      if (error) {
        //console.error*('Error fetching order ID:', error);
        return;
      }

      if (!data || data.length === 0) {
        //console.log*('No orders found for this user.');
        setLoading(false);
        return;
      }

      // setOrderId(data?.id);
      setOrderIds(data.map((order) => order.id)); // Store multiple order IDs
      setTotalPrice(data.map((order) => order.total_price));
    };
    //console.log*('totalPrice: ', totalPrice);

    fetchOrderIds();
  }, []);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .in('id', orderIds);

      if (error) {
        //console.error*('Error fetching order status:', error);
        return;
      }

      // // Map status to step index
      // const statusIndex = steps.findIndex((step) => step.label === data.status);
      // if (statusIndex !== -1) {
      //     setCurrentStep(statusIndex);
      // }
      let highestStep = 0;
      data.forEach((order) => {
        const statusIndex = steps.findIndex(
          (step) => step.label === order.status,
        );
        if (statusIndex > highestStep) highestStep = statusIndex;
      });

      setCurrentStep(highestStep); // Update progress based on highest status
    };

    fetchOrderStatus();
  }, [orderIds]);

  useEffect(() => {
    if (!orderIds.length) return; // Ensure orderId is available

    const fetchOrderItems = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching

      const { data: orderItemsSupabase, error: orderItemsError } =
        await supabase.from('order_items').select('*').in('order_id', orderIds); // ✅ Fix: Use .in() instead of .eq()
      // const {data: orderItemsSupabase, error: orderItemsError} = await supabase.from("order_items").select("*").eq("order_id", orderIds);

      if (orderItemsError) {
        //console.error*('Unable to fetch order items: ', orderItemsError);
        setLoading(false);
        return;
      }

      const updatedCartItems = await Promise.all(
        orderItemsSupabase.map(async (item) => {
          const { data: productInfo, error: productInfoError } = await supabase
            .from('products')
            .select('image_cover, name')
            .eq('id', item.product_id)
            .single();

          if (productInfoError) {
            //console.error*('Unable to fetch product info:', productInfoError);
            return null;
          }

          return {
            image: productInfo.image_cover,
            name: productInfo.name,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      );

      setOrderItems(
        updatedCartItems.filter((item): item is CartItem => item !== null),
      );
      setLoading(false);
    };

    fetchOrderItems();
  }, [orderIds]);

  const [copied, setCopied] = useState(false);
  const trackingCode = 'M213ASD4S';
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      //console.error*('Failed to copy:', err);
    }
  };

  const router = useRouter();

  return (
    <div className="max-h-900 space-y-3 overflow-y-auto bg-gray">
      <div className="px-6 pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>
      {/* Shipping Progress */}
      <section className="px-6 pt-3">
        <div className="relative mx-auto flex max-h-[120px] max-w-full max-w-md flex-row items-center justify-between rounded-xl bg-white p-6 shadow-lg">
          {/* Base gray connecting line */}
          <div className="bg-gray-400 absolute left-0 top-[45px] z-0 h-[3px] w-full -translate-y-[200%] border-2 sm:size-[5px] sm:h-full sm:translate-y-0" />

          {/* Progress line that turns green */}
          <div
            className="absolute left-0 top-[45px] h-[3px] -translate-y-[200%] bg-green-300 transition-all duration-300 sm:h-[5px] sm:translate-y-0"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100 + 1}%`,
            }}
          >
            {/* // className="absolute top-[45px] w-full left-0 h-[3px] sm:h-[5px] bg-green-500 transition-all duration-300 -translate-y-[200%] sm:translate-y-0 z-10" 
                        > */}
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex min-h-[70px] w-[50px] flex-col items-center"
            >
              {/* Icon with dynamic color */}
              <div
                className={`md:w-13 md:h-13 flex size-8 items-center justify-center rounded-full p-2 transition-all duration-300


                            ${index <= currentStep ? 'bg-green-600 text-white' : 'border-gray-400 border-2 bg-white text-customGray-400'}`}
              >
                {step.icon}
              </div>

              {/* Label */}
              <div
                className={`mt-1 text-center text-xs font-semibold
                            ${index <= currentStep ? 'text-green-500' : 'text-customGray-400'}`}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shipping more details */}
      <section className="px-6 text-black">
        <div className="mx-auto flex w-full max-w-full max-w-md flex-row gap-20 rounded-lg bg-white px-6 py-2 shadow-lg">
          <div className="flex flex-col text-sm">
            <p className="font-bold">Flash Express</p>
            {/* <p>M213ASD4S</p> */}
            <div className="mt-2 flex items-center gap-2">
              <p>{trackingCode}</p>
              <button
                onClick={handleCopy}
                className="text-gray-500 text-xs hover:text-black"
                title="Copy tracking code"
              >
                📋
              </button>
              {copied && (
                <span className="text-xs text-green-500">Copied!</span>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-end">
            <p className="cursor-pointer text-sm text-blue-600">
              See shipping details
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 text-black">
        <div className="border-gray-200 mx-auto grid w-full max-w-md grid-cols-2 gap-6 rounded-xl border bg-white p-6 shadow-md">
          {/* Left column */}
          <div className="flex flex-col justify-start">
            <p className="mb-2 text-sm font-semibold">Recipient Info</p>
            <p className="text-gray-800 text-sm">{info.name}</p>
            <p className="text-gray-800 mt-2 text-sm">{info.phone}</p>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-start">
            <p className="mb-2 text-sm font-semibold">Delivery Address</p>
            <p className="text-gray-800 text-sm">{info.street}</p>
            <p className="text-gray-800 text-sm">
              {info.city}, {info.pcode}
            </p>
            <p className="text-gray-800 text-sm">{info.state}</p>
          </div>
        </div>
      </section>

      {/* Order Items */}
      <section className="px-6">
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-lg">
          {loading ? (
            <Loading />
          ) : (
            <>
              {orderIds.map((orderId, idx) => (
                <div
                  key={idx}
                  className={`${idx !== 0 ? 'border-t pt-4' : ''}`}
                >
                  <p className="mb-2 text-sm font-bold">Order ID: {orderId}</p>

                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex w-full items-center justify-between"
                      >
                        {/* Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-16 rounded-md object-cover"
                        />

                        {/* Product Info */}
                        <div className="ml-4 flex-1">
                          <p className="font-medium">{item.name}</p>
                        </div>

                        {/* Qty & Price */}
                        <div className="flex flex-col items-end text-sm">
                          <div className="text-gray-600">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-gray-800 font-bold">
                            RM {item.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Totals */}
              {totalPrice.map((price, idx) => (
                <div
                  key={idx}
                  className="text-gray-700 space-y-2 border-t pt-6"
                >
                  <div className="flex justify-between font-semibold">
                    <div>Merchandise Subtotal</div>
                    <div>RM {price}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Shipping Fee + SST</div>
                    <div>RM 5</div>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <div>Order Total</div>
                    <div>RM {price + 5}</div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <div>Payment Method</div>
                    <div>Credit / Debit Card</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

ShippingProgress.hideFooter = true;

export default ShippingProgress;
