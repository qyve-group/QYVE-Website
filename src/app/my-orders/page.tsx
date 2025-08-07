'use client';

// import { CheckCircle, CreditCard, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { CheckCircle, Truck, Package, Star, CreditCard } from "lucide-react";
// import Button from "@/shared/Button/Button";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { supabase } from '@/libs/supabaseClient';
import type { CartItem } from '@/store/cartSlice';
import type { RootState } from '@/store/store';

import Loading from '../loading';
// import { forEach } from 'ramda';

// export default function MyOrders() {
const ShippingProgress = () => {
  // const steps = [
  //   {
  //     icon: <Package size={32} />,
  //     label: 'Order Placed',
  //     date: 'Mar 25, 2025',
  //     id: 1,
  //   },
  //   {
  //     icon: <CreditCard size={32} />,
  //     label: 'Paid',
  //     date: 'Mar 26, 2025',
  //     id: 2,
  //   },
  //   {
  //     icon: <Truck size={32} />,
  //     label: 'Shipped Out',
  //     date: 'Mar 27, 2025',
  //     id: 3,
  //   },
  //   {
  //     icon: <CheckCircle size={32} />,
  //     label: 'Order Received',
  //     date: 'Mar 30, 2025',
  //     id: 4,
  //   },
  //   // { icon: <Star size={32} />, label: "To Rate", date: null },
  // ];

  //   export interface CartItem {
  //     id: number; // product_id
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

  // const info = {
  //   name: 'Adam Yaqin',
  //   phone: '0123456789',
  //   street: '1, Lorong Dahlia, Kg. Sg. Kayu Ara',
  //   city: 'Petaling Jaya',
  //   pcode: '46201',
  //   state: 'Selangor',
  // };

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
  // type ProductColor = { image: string };
  // type TempCartItem = {
  //   image: string;
  //   name: string;
  //   quantity: number;
  //   price: number;
  // };

  const [orderIds, setOrderIds] = useState<string[]>([]); // Store multiple order IDs
  const [tracking, setTracking] = useState<string[]>([]); // Store multiple order IDs
  const [totalPrice, setTotalPrice] = useState<number[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    // console.log*('userId: ', userId?.id);
    const fetchOrderIds = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_price, tracking_no')
        .order('created_at', { ascending: false })
        .eq('user_id', userId?.id);

      if (error) {
        console.error('Error fetching order ID my-orders:', error);
        return;
      }
      console.log(data);

      if (!data || data.length === 0) {
        // console.log*('No orders found for this user.');
        setLoading(false);
        return;
      }

      // setOrderId(data?.id);
      setOrderIds(data.map((order) => order.id)); // Store multiple order IDs
      setTracking(data.map((order) => order.tracking_no)); // Store multiple order IDs
      setTotalPrice(data.map((order) => order.total_price));
    };
    // console.log*('totalPrice: ', totalPrice);

    fetchOrderIds();
  }, []);

  // const [currentStep, setCurrentStep] = useState(0);

  // useEffect(() => {
  //   const fetchOrderStatus = async () => {
  //     const { data, error } = await supabase
  //       .from('orders')
  //       .select('status')
  //       .in('id', orderIds);

  //     if (error) {
  //       // console.error*('Error fetching order status:', error);
  //       return;
  //     }

  //     // // Map status to step index
  //     // const statusIndex = steps.findIndex((step) => step.label === data.status);
  //     // if (statusIndex !== -1) {
  //     //     setCurrentStep(statusIndex);
  //     // }
  //     // let highestStep = 0;
  //     // data.forEach((order) => {
  //     //   const statusIndex = steps.findIndex(
  //     //     (step) => step.label === order.status,
  //     //   );
  //     //   if (statusIndex > highestStep) highestStep = statusIndex;
  //     // });

  //     // setCurrentStep(highestStep); // Update progress based on highest status
  //   };

  //   fetchOrderStatus();
  // }, [orderIds]);

  useEffect(() => {
    if (!orderIds.length) return; // Ensure orderId is available

    const fetchOrderItems = async () => {
      setLoading(true); // Step 2: Set loading to true before fetching

      const { data: orderItemsSupabase, error: orderItemsError } =
        await supabase.from('order_items').select('*').in('order_id', orderIds); // ✅ Fix: Use .in() instead of .eq()

      if (orderItemsError) {
        // console.error*('Unable to fetch order items: ', orderItemsError);
        setLoading(false);
        return;
      }

      console.log('orderitemssupabase: ', orderItemsSupabase);

      const updatedCartItems = await Promise.all(
        orderItemsSupabase.map(async (item) => {
          const { data: productInfo, error: productInfoError } = await supabase
            // <<<<<<< Updated upstream
            //             .from('products')
            //             .select('image_cover, name')
            //             .eq('id', item.product_id)
            // =======
            .from('products_sizes')
            .select('product_colors(*), description, size')
            .eq('id', item.product_size_id)
            // >>>>>>> Stashed changes
            .single();

          if (productInfoError) {
            // console.error*('Unable to fetch product info:', productInfoError);
            return null;
          }
          console.log('productinfo: ', productInfo);
          console.log('productinfo description: ', productInfo.description);
          console.log(
            'productcolorImage: ',
            productInfo.product_colors[0]?.image ?? 'undefined',
          );
          console.log('productcolors: ', productInfo.product_colors);
          // console.log('productcolorsid: ', productInfo.product_colors?.id);
          console.log('productinfo size ', productInfo.size);

          const productColor = Array.isArray(productInfo.product_colors)
            ? productInfo.product_colors[0]
            : (productInfo.product_colors as { image: string });
          const imageUrl = productColor?.image ?? '/qyve-white.png';

          // if (Array.isArray(productInfo.product_colors)) {
          //   imageUrl =
          //     productInfo.product_colors[0]?.image ?? '/qyve-white.png';
          // } else {
          //   imageUrl = productInfo.product_colors?.image ?? '/qyve-white.png';
          // }

          return {
            image: imageUrl,
            // image: imageUrl,

            name: productInfo.description,
            quantity: item.quantity,
            price: item.price,
          } as CartItem;
        }),
      );

      console.log('updatedCartItems: ', updatedCartItems);

      setOrderItems(
        updatedCartItems.filter((item): item is CartItem => item !== null),
      );
      console.log('orderItems: ', orderItems);
      setLoading(false);
    };

    fetchOrderItems();
  }, [orderIds]);

  const router = useRouter();

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="mx-auto max-w-4xl space-y-6 px-4">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Orders Section */}
        {loading ? (
          <Loading />
        ) : (
          orderIds.map((orderId, idx) => (
            <div
              key={orderId}
              className="border-gray-200 space-y-6 rounded-lg border bg-white p-6 shadow-md"
            >
              {/* Order Header */}
              <div className="border-b pb-4">
                <p className="text-gray-700 text-sm font-semibold">
                  Order ID:{' '}
                  <span className="italic text-customGray-800">{orderId}</span>
                </p>
                <p className="text-gray-700 mt-2 text-sm font-semibold">
                  Tracking Number:{}
                  <span className="italic text-customGray-800">
                    {tracking[idx] !== '' ? ` ${tracking[idx]}` : ' Processing'}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={400}
                      className="size-16 rounded-md border object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{item.name}</p>
                    </div>

                    <div className="text-right text-sm">
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-gray-900 font-bold">RM {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="text-gray-700 space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between font-semibold">
                  <span>Merchandise Subtotal</span>
                  <span>RM {totalPrice[idx]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee + SST</span>
                  <span>RM 5</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>Order Total</span>
                  <span>RM {(totalPrice[idx] ?? 0) + 5}</span>
                </div>
                <div className="text-gray-600 mt-2 flex justify-between text-xs">
                  <span>Payment Method</span>
                  <span>Credit / Debit Card</span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg bg-red-500 p-2 text-white"
                    onClick={() => {
                      console.log('Refund clicked');
                    }}
                  >
                    Refund
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="max-h-900 space-y-3 overflow-y-auto bg-gray">
  //     <div className="px-6 pt-4">
  //       <button
  //         type="button"
  //         onClick={() => router.back()}
  //         className="flex items-center text-sm text-blue-600 hover:underline"
  //       >
  //         ← Back
  //       </button>
  //     </div>
  //     <section className="px-6 pt-3">
  //       <div className="relative mx-auto flex max-h-[120px] max-w-md flex-row items-center justify-between rounded-xl bg-white p-6 shadow-lg">
  //         <div className="bg-gray-400 absolute left-0 top-[45px] z-0 h-[3px] w-full -translate-y-[200%] border-2 sm:size-[5px] sm:h-full sm:translate-y-0" />

  //         <div
  //           className="absolute left-0 top-[45px] h-[3px] -translate-y-[200%] bg-green-300 transition-all duration-300 sm:h-[5px] sm:translate-y-0"
  //           style={{
  //             width: `${(currentStep / (steps.length - 1)) * 100 + 1}%`,
  //           }}
  //         >

  //         </div>

  //         {steps.map((step, index) => (
  //           <div
  //             key={step.id}
  //             className="relative flex min-h-[70px] w-[50px] flex-col items-center"
  //           >
  //             <div
  //               className={`md:w-13 md:h-13 flex size-8 items-center justify-center rounded-full p-2 transition-all duration-300

  //                           ${index <= currentStep ? 'bg-green-600 text-white' : 'border-gray-400 border-2 bg-white text-customGray-400'}`}
  //             >
  //               {step.icon}
  //             </div>

  //             <div
  //               className={`mt-1 text-center text-xs font-semibold
  //                           ${index <= currentStep ? 'text-green-500' : 'text-customGray-400'}`}
  //             >
  //               {step.label}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </section>

  //     <section className="px-6 text-black">
  //       <div className="mx-auto flex w-full max-w-md flex-row gap-20 rounded-lg bg-white px-6 py-2 shadow-lg">
  //         <div className="flex flex-col text-sm">
  //           <p className="font-bold">Flash Express</p>
  //           <div className="mt-2 flex items-center gap-2">
  //             <p>{trackingCode}</p>
  //             <button
  //               type="button"
  //               onClick={handleCopy}
  //               className="text-gray-500 text-xs hover:text-black"
  //               title="Copy tracking code"
  //             >
  //               📋
  //             </button>
  //             {copied && (
  //               <span className="text-xs text-green-500">Copied!</span>
  //             )}
  //           </div>
  //         </div>

  //         <div className="flex flex-col justify-end">
  //           <p className="cursor-pointer text-sm text-blue-600">
  //             See shipping details
  //           </p>
  //         </div>
  //       </div>
  //     </section>

  //     <section className="px-6 text-black">
  //       <div className="border-gray-200 mx-auto grid w-full max-w-md grid-cols-2 gap-6 rounded-xl border bg-white p-6 shadow-md">
  //         <div className="flex flex-col justify-start">
  //           <p className="mb-2 text-sm font-semibold">Recipient Info</p>
  //           <p className="text-gray-800 text-sm">{info.name}</p>
  //           <p className="text-gray-800 mt-2 text-sm">{info.phone}</p>
  //         </div>

  //         <div className="flex flex-col justify-start">
  //           <p className="mb-2 text-sm font-semibold">Delivery Address</p>
  //           <p className="text-gray-800 text-sm">{info.street}</p>
  //           <p className="text-gray-800 text-sm">
  //             {info.city}, {info.pcode}
  //           </p>
  //           <p className="text-gray-800 text-sm">{info.state}</p>
  //         </div>
  //       </div>
  //     </section>

  //     <section className="px-6 py-8">
  //       <div className="rounded-lg bg-white p-6 shadow-lg space-y-10">
  //         {loading ? (
  //           <Loading />
  //         ) : (
  //           orderIds.map((orderId, idx) => (
  //             <div
  //               key={orderId}
  //               className="space-y-6 border-t first:border-t-0 pt-6"
  //             >
  //               <div className="space-y-1">
  //                 <p className="text-sm font-bold">Order ID: {orderId}</p>
  //                 <p className="text-sm font-bold">
  //                   Tracking Number: {orderId}
  //                 </p>
  //               </div>

  //               <div className="space-y-4">
  //                 {orderItems.map((item) => (
  //                   <div
  //                     key={item.id}
  //                     className="flex items-center justify-between"
  //                   >
  //                     <Image
  //                       src={item.image}
  //                       alt={item.name}
  //                       width={400}
  //                       height={400}
  //                       className="size-16 rounded-md object-cover"
  //                     />

  //                     <div className="ml-4 flex-1">
  //                       <p className="font-medium">{item.name}</p>
  //                     </div>

  //                     <div className="text-right text-sm space-y-1">
  //                       <div className="text-gray-600">
  //                         Qty: {item.quantity}
  //                       </div>
  //                       <div className="font-bold text-gray-800">
  //                         RM {item.price}
  //                       </div>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>

  //               <div className="space-y-2 border-t pt-4 text-sm text-gray-700">
  //                 <div className="flex justify-between font-semibold">
  //                   <span>Merchandise Subtotal</span>
  //                   <span>RM {totalPrice[idx]}</span>
  //                 </div>
  //                 <div className="flex justify-between">
  //                   <span>Shipping Fee + SST</span>
  //                   <span>RM 5</span>
  //                 </div>
  //                 <div className="flex justify-between text-base font-bold">
  //                   <span>Order Total</span>
  //                   <span>RM {(totalPrice[idx] ?? 0) + 5}</span>
  //                 </div>
  //                 <div className="mt-2 flex justify-between text-xs">
  //                   <span>Payment Method</span>
  //                   <span>Credit / Debit Card</span>
  //                 </div>
  //               </div>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     </section>

  //   </div>
  // );
};

ShippingProgress.hideFooter = true;

export default ShippingProgress;
