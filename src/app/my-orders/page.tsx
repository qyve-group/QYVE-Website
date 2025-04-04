"use client";

import { CheckCircle, Truck, Package, Star, CreditCard } from "lucide-react";
import Button from "@/shared/Button/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabaseClient";
import { CartItem } from "@/store/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "../loading";

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

    return (
        <div className="space-y-6">
            {/* Shipping Progress */}
            <section className="p-6">
                {/* <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center w-full max-w-md md:max-w-full mx-auto relative"> */}
                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center w-full max-w-md md:max-w-full mx-auto relative">


                    {/* Base gray connecting line */}
                    {/* <div className="absolute top-1/2 left-0 w-full h-[5px] bg-gray-300 -translate-y-[200%]"></div> */}
                    {/* <div className="absolute top-1/2 left-0 w-full sm:h-[5px] h-[5px] bg-gray-300 -translate-y-[200%] sm:translate-y-0 sm:w-[5px] sm:h-full"></div> */}
                    <div className="absolute top-1/2 left-0 w-full sm:h-[5px] h-[3px] bg-gray-300 -translate-y-[200%] sm:translate-y-0 sm:w-[5px] sm:h-full"></div>



                    {/* Progress line that turns green */}
                    <div 
                        // className="absolute top-1/2 left-0 h-[5px] bg-green-500 transition-all duration-300 -translate-y-[200%]" 
                        // className="absolute top-1/2 left-0 h-[5px] sm:w-[5px] sm:h-full bg-green-500 transition-all duration-300 -translate-y-[200%] sm:translate-y-0"
                        className="absolute top-1/2 left-0 h-[3px] sm:h-[5px] bg-green-500 transition-all duration-300 -translate-y-[200%] sm:translate-y-0" 

                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}>
                    </div>

                        {steps.map((step, index) => (
                            // <div key={index} className="relative flex flex-col items-center w-20">
                            // <div key={index} className="relative flex flex-col sm:w-20 w-16 min-w-[80px] sm:items-center items-start">
                            <div key={index} className="relative flex flex-col sm:w-20 w-16 min-w-[80px] sm:items-center items-start">


                                {/* Icon with dynamic color */}
                                {/* <div className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 */}
                                {/* <div className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 */}
                                <div className={`p-2 rounded-full flex items-center justify-center transition-all duration-300


                                    ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {step.icon}
                                </div>

                                {/* Label */}
                                {/* <div className={`mt-1 text-xs font-semibold text-center */}
                                {/* <div className={`mt-1 text-xs font-semibold text-center */}
                                <div className={`mt-1 text-xs font-semibold text-center


                                    ${index <= currentStep ? 'text-green-500' : 'text-gray-500'}`}>
                                    {step.label}
                                </div>
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
                {loading ? (
                        <Loading/>
                    ): (
                        <>
                            {/* <h2 className="text-lg font-bold">Order ID:</h2> */}
                            {/* <div className="p-2 space-y-4"> */}
                                {orderIds.map((orderId, idx) => (
                                    <div key={idx}>
                                    <h2 className="text-lg font-bold">Order ID: {orderId}</h2>
                                    <div key={idx} className="p-2 space-y-4">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex justify-between bg-white p-3 rounded-lg shadow">
                                            {/* Image */}
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
    
                                            {/* Product Name */}
                                            <div className="flex-1 ml-4">
                                                <p className="font-medium">{item.name}</p>
                                            </div>
    
                                            <div className="flex">
    
                                                {/* Quantity */}
                                                <div className="text-gray-600 p-3">Qty: {item.quantity}</div>
    
                                                {/* Price */}
                                                <div className="font-bold text-gray-800 p-3">RM {item.price}</div>                                           
    
                                            </div>
                                            
                                        </div>
                                    ))}
                                    </div>
                                    </div>
                                ))}
                                
                            {/* </div> */}
                            {totalPrice.map( (price, idx) => (
                                 
                                <div key={idx} className="mt-4 border-t pt-4 space-y-2 text-gray-700">
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
                                        <div>RM {price+5}</div>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <div>Payment Method</div>
                                        <div>Credit / Debit Card</div>
                                    </div>
                                </div>
                                            
                                 
                            )
                        )}
                            
                        </>
                    )

                }

            </section>
        </div>
    );
}

export default ShippingProgress;


