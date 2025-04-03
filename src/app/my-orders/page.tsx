"use client";

import { CheckCircle, Truck, Package, Star, CreditCard } from "lucide-react";
import Button from "@/shared/Button/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabaseClient";
import { CartItem } from "@/store/cartSlice";

// export default function MyOrders() {
const ShippingProgress = ({ currentStep = 0 }) => {
    const steps = [
        { icon: <Package size={32} />, label: "Order Placed", date: "Mar 25, 2025" },
        { icon: <CreditCard size={32} />, label: "Order Paid", date: "Mar 26, 2025" },
        { icon: <Truck size={32} />, label: "Shipped Out", date: "Mar 27, 2025" },
        { icon: <CheckCircle size={32} />, label: "Order Received", date: "Mar 30, 2025" },
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
        "name" : "Adam Yaqin",
        "phone" : "0123456789",
        "street" : "1, Lorong Dahlia, Kg. Sg. Kayu Ara",
        "city" : "Petaling Jaya",
        "pcode" : "46201",
        "state" : "Selangor",

    }

    // const [orderItems, setOrderItems] = useState([
    //     { image: "image_name", name: "Beige Slides", quantity: 2, price: 70 },
    //     { image: "image_name_2", name: "Black Jersey", quantity: 3, price: 150 },
    //     { image: "image_name_3", name: "Black Slides", quantity: 1, price: 35 },
    //     { image: "image_name_4", name: "Sub-Zero", quantity: 1, price: 200 },
    // ]);

    //supabase order_items col
    // orderItemID: uuid,
    // order_id: uuid,
    // product_id: Number,
    // quantity: Number,
    // price: number


    const [orderItems, setOrderItems] = useState<CartItem[]>([]);
    useEffect( () => {

        if (!orderId) return; // Ensure orderId is available

        const fetchOrderItems = async () =>{
            const {data: orderItemsSupabase, error: orderItemsError} = await supabase.from("order_items").select("*").eq("order_id", orderId);
            
            if (orderItemsError){
                console.error("Unable to fetch order items: ", orderItemsError);
                return;
            }

            const updatedCartItems = await Promise.all(
                orderItemsSupabase.map(async (item) => {
                    const { data: productInfo, error: productInfoError } = await supabase
                        .from("products")
                        .select("image_cover, name")
                        .eq("id", item.product_id)
                        .single();
    
                    if (productInfoError) {
                        console.error("Unable to fetch product info:", productInfoError);
                        return null;
                    }
    
                    return {
                        image: productInfo.image_cover,
                        name: productInfo.name,
                        quantity: item.quantity,
                        price: item.price,
                    };
                })
            );

            // orderItemsSupabase.map(item) => {
            //     const {data: productInfo, error: productInfoError} = await supabase.from("products").select("image_cover, name").eq("id", item.product_id);
            // }

            // let cart = CartItem{
            //     image: productInfo.image_cover;
            //     name: productInfo.name;
            //     quantity: orderItemsSupabase.quantity;
            //     price: orderItemsSupabase.price;
            // }
            
            // setOrderItems([...orderItems, cart]);
            // Filter out any null results from failed fetches
            setOrderItems((prevOrderItems) => [
                ...prevOrderItems,
                ...updatedCartItems.filter((item): item is CartItem => item !== null)
            ]);
            
        }

        fetchOrderItems();
    }, [orderId])

    return (
        <div className="space-y-6">
            {/* Shipping Progress */}
            <section className="p-6">
                <div className="bg-yellow-100 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden w-full max-w-md md:max-w-full mx-auto">
                    {/* Connecting lines */}
                    <div className="absolute hidden md:flex top-1/2 left-0 w-full h-1">
                        {steps.map((_, index) => (
                            index < steps.length - 1 && (
                                <div key={index} className={`absolute left-[calc(${index + 0.5}*25%)] w-[22%] h-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                            )
                        ))}
                    </div>
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center bg-white p-2 rounded-lg shadow-md z-10 w-20">
                            <div className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-yellow-300'}`}>{step.icon}</div>
                            <div className="mt-1 text-xs font-semibold text-center">{step.label}</div>
                            {step.date && <div className="text-xs text-gray-600 text-center">{step.date}</div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* Delivery Info */}
            <section className="bg-blue-500 p-6 rounded-lg text-white">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-lg font-bold">Delivery Address</h1>
                        <h2>{info.name}</h2>
                        <h2>{info.phone}</h2>
                        <h2>{info.street}</h2>
                        <h2>{info.city}, {info.pcode}</h2>
                        <h2>{info.state}</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-blue-700 p-4 rounded-lg">
                        <h2 className="text-black bg-blue-200 p-2 rounded-lg">*Shipping Code</h2>
                        <Button>
                            <p>Click to see shipping details</p>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Order Items */}
            <section className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-lg font-bold">Order ID: #1235</h2>
                <div className="p-2 space-y-4">
                    {orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between bg-white p-3 rounded-lg shadow">
                            <div>{item.image}</div>
                            <div>{item.name}</div>
                            <div>Qty: {item.quantity}</div>
                            <div className="font-bold">RM {item.price}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 border-t pt-4 space-y-2 text-gray-700">
                    <div className="flex justify-between font-semibold">
                        <div>Merchandise Subtotal</div>
                        <div>RM 455</div>
                    </div>
                    <div className="flex justify-between">
                        <div>Shipping Fee + SST</div>
                        <div>RM 5</div>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <div>Order Total</div>
                        <div>RM 460</div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div>Payment Method</div>
                        <div>Credit / Debit Card</div>
                    </div>
                </div>
            </section>
        </div>
    );
    
    // return (
    //     <div>
    //         <section className="p-6">
    //             <div className="bg-yellow-100 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden w-full max-w-md md:max-w-full mx-auto">
    //                 {/* Connecting lines for horizontal layout */}
    //                 <div className="absolute hidden md:flex top-1/2 left-0 w-full h-1">
    //                 {steps.map((_, index) => (
    //                     index < steps.length - 1 && (
    //                     <div
    //                         key={index}
    //                         className={`absolute left-[calc(${index + 0.5}*20%)] w-[18%] h-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-yellow-400'}`}
    //                     ></div>
    //                     )
    //                 ))}
    //                 </div>

    //                 {/* Connecting lines for vertical layout */}
    //                 <div className="absolute flex md:hidden left-1/2 top-0 h-full w-1">
    //                 {steps.map((_, index) => (
    //                     index < steps.length - 1 && (
    //                     <div
    //                         key={index}
    //                         className={`absolute top-[calc(${index + 0.5}*20%)] h-[18%] w-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-yellow-400'}`}
    //                     ></div>
    //                     )
    //                 ))}
    //                 </div>
                    
    //                 {steps.map((step, index) => (
    //                 <div key={index} className="relative flex flex-col items-center bg-white p-1 md:p-2 rounded-lg shadow-md z-10 w-16 md:w-20">
    //                     <div className={`p-1.5 md:p-2 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-yellow-300'}`}>{step.icon}</div>
    //                     <div className="mt-1 text-[10px] md:text-xs font-semibold text-center">{step.label}</div>
    //                     {step.date && <div className="text-[8px] md:text-[10px] text-gray-600 text-center">{step.date}</div>}
    //                 </div>
    //                 ))}
    //             </div>
    //         </section>



    //         <section className="bg-blue-500 p-6">
    //             {/* <div className="grid grid-flow-col grid-rows-3">
    //                 <div className="row-span-1"><h1>Delivery Address</h1></div>
    //                 <div className="row-span-3"><h2>Shipping Code</h2></div>
    //                 <div className="row-span-2"><h2>Actual Address</h2></div>
    //             </div>
    //              */}
    //             <div className="grid grid-cols-2 gap-4">
    //                     {/* Left Side: Delivery Address and Actual Address */}
    //                 <div className="flex flex-col">
    //                     <h1 className="text-white text-lg font-bold">Delivery Address</h1>
    //                     <h2 className="text-white">{info.name}</h2>
    //                     <h2 className="text-white">{info.phone}</h2>
    //                     <h2 className="text-white">{info.street}</h2>
    //                     <h2 className="text-white">{info.city}</h2>
    //                     <h2 className="text-white">{info.pcode}</h2>
    //                     <h2 className="text-white">{info.state}</h2>

    //                 </div>

    //                 {/* Right Side: Shipping Code spans full height */}
    //                 <div className="flex flex-col items-center justify-center bg-blue-700 p-4 rounded-lg col-span-1">
    //                     <div className="text-white rounded-lg bg-blue-200 p-3">
    //                     <h2 className="text-black rounded-lg bg-blue-200">*Shipping Code</h2>

    //                     </div>
    //                     <Button>
    //                         <p>Click to see shipping details</p>
    //                     </Button>
    //                 </div>
    //             </div>
    //         </section>

    //         <section className="p-6">
    //             <div>Ordered Item</div>
    //             <div className="p-2 rounded-lg flex flex-col">

    //                 {orderItems.map((item) => {
    //                     <div>
    //                         <div>{item.image}</div>
    //                         <div>{item.name}</div>
    //                         <div>{item.quantity}</div>
    //                         <div>RM {item.price}</div>
    //                     </div>
    //                 })}

    //             </div>
    //             <div className="grid-col-2">
    //                 <div>Merchandise Subtotal</div>
    //                 <div>RM 455</div>

    //                 <div>Shipping Fee SST</div>
    //                 <div>RM 5</div>

    //                 <div>Order Total</div>
    //                 <div>RM 460</div>

    //                 <div>Payment Method</div>
    //                 <div>Credit / Debit Card</div>
                    

    //             </div>

    //         </section>
            
            
            
        
    //     </div>
    // )
}

export default ShippingProgress;


