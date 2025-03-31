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
                <div className="bg-yellow-100 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden w-full max-w-md md:max-w-full mx-auto">
                    {/* Connecting lines for horizontal layout */}
                    <div className="absolute hidden md:flex top-1/2 left-0 w-full h-1">
                    {steps.map((_, index) => (
                        index < steps.length - 1 && (
                        <div
                            key={index}
                            className={`absolute left-[calc(${index + 0.5}*20%)] w-[18%] h-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-yellow-400'}`}
                        ></div>
                        )
                    ))}
                    </div>

                    {/* Connecting lines for vertical layout */}
                    <div className="absolute flex md:hidden left-1/2 top-0 h-full w-1">
                    {steps.map((_, index) => (
                        index < steps.length - 1 && (
                        <div
                            key={index}
                            className={`absolute top-[calc(${index + 0.5}*20%)] h-[18%] w-1 transition-all duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-yellow-400'}`}
                        ></div>
                        )
                    ))}
                    </div>
                    
                    {steps.map((step, index) => (
                    <div key={index} className="relative flex flex-col items-center bg-white p-1 md:p-2 rounded-lg shadow-md z-10 w-16 md:w-20">
                        <div className={`p-1.5 md:p-2 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-yellow-300'}`}>{step.icon}</div>
                        <div className="mt-1 text-[10px] md:text-xs font-semibold text-center">{step.label}</div>
                        {step.date && <div className="text-[8px] md:text-[10px] text-gray-600 text-center">{step.date}</div>}
                    </div>
                    ))}
                </div>
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


