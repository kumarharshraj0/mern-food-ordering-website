import React, { useState, useEffect } from "react";
import { Truck, MapPin, Navigation, Phone, User, ExternalLink } from "lucide-react";

/**
 * OrderTrackerMap - A high-fidelity real-time visualization for order tracking.
 * Listen for 'deliveryLocationUpdate' custom events from SocketContext.
 */
const OrderTrackerMap = ({ order }) => {
    const [deliveryLoc, setDeliveryLoc] = useState(order.deliveryAssignedTo?.location?.coordinates || [0, 0]);
    const [isOnline, setIsOnline] = useState(order.deliveryAssignedTo?.isAvailable);

    useEffect(() => {
        const handleLocationUpdate = (event) => {
            const { userId, latitude, longitude } = event.detail;
            if (userId === order.deliveryAssignedTo?._id) {
                setDeliveryLoc([longitude, latitude]);
                setIsOnline(true);
            }
        };

        window.addEventListener('deliveryLocationUpdate', handleLocationUpdate);
        return () => window.removeEventListener('deliveryLocationUpdate', handleLocationUpdate);
    }, [order.deliveryAssignedTo?._id]);

    const steps = [
        { label: "Placed", status: "placed", active: true },
        { label: "Preparing", status: "preparing", active: ["preparing", "out_for_delivery", "delivered"].includes(order.status) },
        { label: "On the Way", status: "out_for_delivery", active: ["out_for_delivery", "delivered"].includes(order.status) },
        { label: "Delivered", status: "delivered", active: order.status === "delivered" }
    ];

    return (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Header / Status */}
            <div className="bg-orange-600 p-6 text-white text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                    {order.status.replaceAll("_", " ")}
                </div>
                <h2 className="text-2xl font-black">Tracking Your Yum! 🍔</h2>
            </div>

            {/* Progress Tracker */}
            <div className="p-8 border-b">
                <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: order.status === 'delivered' ? '100%' : order.status === 'out_for_delivery' ? '75%' : order.status === 'preparing' ? '50%' : '0%' }}
                    ></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${step.active ? 'bg-orange-500 border-orange-100 text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                                {idx === 0 && <Navigation size={18} />}
                                {idx === 1 && <Truck size={18} />}
                                {idx === 2 && <Navigation className="rotate-90" size={18} />}
                                {idx === 3 && <MapPin size={18} />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${step.active ? 'text-orange-600' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map / Tracking Info */}
            <div className="p-6 space-y-6">
                {order.status === "out_for_delivery" && (
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="p-4 bg-white rounded-full shadow-lg text-orange-600 animate-bounce">
                                <Truck size={32} />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Your Rider is Nearby!</h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Current Coords: <span className="font-mono text-xs">{deliveryLoc[1].toFixed(5)}, {deliveryLoc[0].toFixed(5)}</span>
                            </p>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${deliveryLoc[1]},${deliveryLoc[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-2 rounded-xl text-sm font-bold border border-orange-200 hover:bg-orange-50 transition"
                        >
                            <ExternalLink size={16} /> Track on Real Map
                        </a>
                    </div>
                )}

                {/* Delivery Boy Card */}
                {order.deliveryAssignedTo && (
                    <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Delivery Partner</p>
                                <p className="font-bold text-gray-800 text-lg">{order.deliveryAssignedTo.name}</p>
                            </div>
                        </div>
                        <a
                            href={`tel:${order.deliveryAssignedTo.phone}`}
                            className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
                        >
                            <Phone size={20} fill="currentColor" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrackerMap;
