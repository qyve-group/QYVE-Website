"use client";

import { CheckCircle, Truck, Package, Star, CreditCard } from "lucide-react";
import Button from "@/shared/Button/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabaseClient";
import { CartItem } from "@/store/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "../loading";
import { useRouter } from "next/navigation";

// export default function MyOrders() {
const ShippingProgress = () => {
    const steps = [
        { icon: <Package size={32} />, label: "Order Placed", date: "Mar 25, 2025" },
        { icon: <CreditCard size={32} />, label: "Paid", date: "Mar 26, 2025" },
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

    // const [orderId, setOrderId] = useState("");
    const [orderIds, setOrderIds] = useState<string[]>([]);  // Store multiple order IDs
    const [totalPrice, setTotalPrice] = useState<number[]>([]);
    const userId = useSelector( (state: RootState) => state.auth.user);
    const [orderItems, setOrderItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFull, setShowFull] = useState(false);

    
    useEffect( () => {
        console.log("userId: ", userId?.id);
        const fetchOrderIds = async () => {
            const {data, error} = await supabase.from("orders").select("id, total_price").eq("user_id", userId?.id);

            if (error) {
                console.error("Error fetching order ID:", error);
                return;
            }

            if (!data || data.length === 0) {
                console.log("No orders found for this user.");
                setLoading(false);
                return;
            }
    

            // setOrderId(data?.id);
            setOrderIds(data.map(order => order.id));  // Store multiple order IDs
            setTotalPrice(data.map(order => order.total_price));
            
        }
        console.log("totalPrice: ", totalPrice);

        fetchOrderIds();

    }, [])

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("status")
                .in("id", orderIds);

            if (error) {
                console.error("Error fetching order status:", error);
                return;
            }

            // // Map status to step index
            // const statusIndex = steps.findIndex((step) => step.label === data.status);
            // if (statusIndex !== -1) {
            //     setCurrentStep(statusIndex);
            // }
            let highestStep = 0;
            data.forEach(order => {
                const statusIndex = steps.findIndex(step => step.label === order.status);
                if (statusIndex > highestStep) highestStep = statusIndex;
            });

            setCurrentStep(highestStep); // Update progress based on highest status
        };

        fetchOrderStatus();
    }, [orderIds]);


    useEffect( () => {

        if (!orderIds.length) return; // Ensure orderId is available

        const fetchOrderItems = async () =>{
            setLoading(true);  // Step 2: Set loading to true before fetching

            const { data: orderItemsSupabase, error: orderItemsError } = await supabase
            .from("order_items")
            .select("*")
            .in("order_id", orderIds);  // ✅ Fix: Use .in() instead of .eq()
            // const {data: orderItemsSupabase, error: orderItemsError} = await supabase.from("order_items").select("*").eq("order_id", orderIds);
            
            if (orderItemsError){
                console.error("Unable to fetch order items: ", orderItemsError);
                setLoading(false); 
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

            setOrderItems(updatedCartItems.filter((item): item is CartItem => item !== null)); 
            setLoading(false);  
        }

        fetchOrderItems();
    }, [orderIds])

    const [copied, setCopied] = useState(false);
    const trackingCode = 'M213ASD4S';
    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(trackingCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      };

    const router = useRouter();

    return (
        
        <div className="space-y-3 bg-gray overflow-y-auto max-h-900">
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
                <div className="relative bg-white p-6 rounded-xl shadow-lg flex flex-row justify-between items-center max-w-md max-w-full mx-auto max-h-[120px]">

                    {/* Base gray connecting line */}
                    <div className="absolute top-[45px] left-0 w-full sm:h-[5px] h-[3px] border-2 bg-gray-400 -translate-y-[200%] sm:translate-y-0 sm:w-[5px] sm:h-full z-0"></div>

                    {/* Progress line that turns green */}
                    <div 
                        className="absolute top-[45px] left-0 h-[3px] sm:h-[5px] bg-green-300 transition-all duration-300 -translate-y-[200%] sm:translate-y-0" 
                        style={{ width: `${((currentStep / (steps.length - 1)) * 100)+1}%`}}>
                        {/* // className="absolute top-[45px] w-full left-0 h-[3px] sm:h-[5px] bg-green-500 transition-all duration-300 -translate-y-[200%] sm:translate-y-0 z-10" 
                        > */}
                    </div>

                    {steps.map((step, index) => (
                    <div key={index} className="relative flex flex-col w-[50px] min-h-[70px] items-center">

                        {/* Icon with dynamic color */}
                        <div className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 w-8 h-8 md:w-13 md:h-13


                            ${index <= currentStep ? 'bg-green-600 text-white' : 'bg-white text-customGray-400 border-2 border-gray-400'}`}>
                            {step.icon}
                        </div>

                        {/* Label */}
                        <div className={`mt-1 text-xs font-semibold text-center
                            ${index <= currentStep ? 'text-green-500' : 'text-customGray-400'}`}>
                            {step.label}
                        </div>
                    </div>
                    ))}
                </div>
            </section>

            {/*Shipping more details */}
            <section className="px-6 text-black">
                <div className="bg-white flex flex-row px-6 py-2 shadow-lg w-full rounded-lg max-w-md max-w-full mx-auto gap-20">
                    <div className="text-sm flex flex-col">
                        <p className="font-bold">Flash Express</p>
                        {/* <p>M213ASD4S</p> */}
                        <div className="mt-2 flex items-center gap-2">
                            <p>{trackingCode}</p>
                            <button
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-black text-xs"
                            title="Copy tracking code"
                            >
                            📋
                            </button>
                            {copied && <span className="text-green-500 text-xs">Copied!</span>}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col justify-end">
                            <p className="text-sm text-blue-600 cursor-pointer">See shipping details</p>
                    </div>
                </div>
            </section>

            <section className="px-6 text-black">
                <div className="bg-white grid grid-cols-2 gap-6 rounded-xl shadow-md w-full p-6 max-w-md mx-auto border border-gray-200">
                    
                    {/* Left column */}
                    <div className="flex flex-col justify-start">
                    <p className="text-sm font-semibold mb-2">Recipient Info</p>
                    <p className="text-sm text-gray-800">{info.name}</p>
                    <p className="text-sm text-gray-800 mt-2">{info.phone}</p>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col justify-start">
                    <p className="text-sm font-semibold mb-2">Delivery Address</p>
                    <p className="text-sm text-gray-800">{info.street}</p>
                    <p className="text-sm text-gray-800">{info.city}, {info.pcode}</p>
                    <p className="text-sm text-gray-800">{info.state}</p>
                    </div>

                </div>
            </section>

            {/* Order Items */}
            <section className="px-6">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">

                    {loading ? (
                    <Loading />
                    ) : (
                    <>
                        {orderIds.map((orderId, idx) => (
                        <div key={idx} className={`${idx !== 0 ? 'border-t pt-4' : ''}`}>
                            <p className="text-sm font-bold mb-2">Order ID: {orderId}</p>

                            <div className="space-y-4">
                            {orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center w-full">
                                
                                {/* Image */}
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />

                                {/* Product Info */}
                                <div className="flex-1 ml-4">
                                    <p className="font-medium">{item.name}</p>
                                </div>

                                {/* Qty & Price */}
                                <div className="flex flex-col items-end text-sm">
                                    <div className="text-gray-600">Qty: {item.quantity}</div>
                                    <div className="font-bold text-gray-800">RM {item.price}</div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        ))}

                        {/* Totals */}
                        {totalPrice.map((price, idx) => (
                        <div key={idx} className="border-t pt-6 space-y-2 text-gray-700">
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
                            <div className="flex justify-between mt-2 text-sm">
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
}

ShippingProgress.hideFooter = true

export default ShippingProgress;


