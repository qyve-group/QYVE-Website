import { CheckCircle, Truck, Package, Star, CreditCard } from "lucide-react";


// export default function MyOrders() {
const ShippingProgress = ({ currentStep = 0 }) => {
    const steps = [
        { icon: <Package size={32} />, label: "Order Placed", date: "Mar 25, 2025" },
        { icon: <CreditCard size={32} />, label: "Order Paid", date: "Mar 26, 2025" },
        { icon: <Truck size={32} />, label: "Shipped Out", date: "Mar 27, 2025" },
        { icon: <CheckCircle size={32} />, label: "Order Received", date: "Mar 30, 2025" },
        { icon: <Star size={32} />, label: "To Rate", date: null },
      ];


    
    return (
        <div>
            <section className="p-6">
                <div className="bg-yellow-100 p-6 rounded-xl shadow-lg flex justify-between items-center relative overflow-hidden">
                    {/* Connecting lines */}
                    {steps.map((_, index) => (
                    index < steps.length - 1 && (
                        <div
                        key={index}
                        className={`absolute top-1/2 left-[${(index + 1) * 20}%] w-[20%] h-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-yellow-400'}`}
                        ></div>
                    )
                    ))}
                    
                    {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center relative bg-white p-4 rounded-lg shadow-md z-10">
                        <div className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-yellow-300'}`}>{step.icon}</div>
                        <div className="mt-2 text-sm font-semibold">{step.label}</div>
                        {step.date && <div className="text-xs text-gray-600">{step.date}</div>}
                    </div>
                    ))}
                </div>
                

                {/* <div className="bg-yellow-200 h-64 rounded-xl m-8 mx-8 flex justify-between">

                    <div className="m-5 flex flex-col items-center">
                        <div>Icon</div>
                        <div>Order placed</div>
                        <div>Order date</div>
                    </div>

                    <div className="m-5 flex flex-col items-center">
                        <div>Icon</div>
                        <div>Order paid</div>
                        <div>Order paid date</div>
                    </div>

                    <div className="m-5 flex flex-col items-center">
                        <div>Icon</div>
                        <div>Order shipped out</div>
                        <div>Order shipped out date</div>
                    </div>

                    <div className="m-5 flex flex-col items-center">
                        <div>Icon</div>
                        <div>Order received</div>
                        <div>Order received date</div>
                    </div>

                    <div className="m-5 flex flex-col items-center">
                        <div>Icon</div>
                        <div>To rate</div>
                    </div>
                </div> */}

            </section>

            <section>
                <div className="bg-blue-500">Delivery Address</div>
                </section>

            <section>
                <div>Ordered Item</div>
            </section>
            
            
            
        
        </div>
    )
}

export default ShippingProgress;


