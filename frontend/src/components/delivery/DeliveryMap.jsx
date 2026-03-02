import React from "react";
import { MapPin, Navigation, ShoppingBag, ExternalLink } from "lucide-react";

/**
 * DeliveryMap - Shows Restaurant (Pickup) and Customer (Drop-off)
 */
const DeliveryMap = ({ order }) => {
    const restaurantLoc = order.restaurant?.location?.coordinates || [0, 0];
    const customerLoc = [80.9462, 26.8467]; // Mock or extract from order if available. 
    // Usually, we'd have coordinates for customer too.

    // For now, let's use the street address for a Google Maps link
    const pickupAddress = order.restaurant?.address?.street + ", " + order.restaurant?.address?.city;
    const dropoffAddress = order.deliveryAddress?.street + ", " + order.deliveryAddress?.city;

    return (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Navigation className="text-orange-500" size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">Route Overview</span>
                </div>
                <div className="text-[10px] font-mono opacity-60">
                    Live GPS Enabled
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Visual Route Line */}
                <div className="relative pl-8 space-y-8">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-dashed border-l-2 border-dashed border-gray-200"></div>

                    {/* Restaurant */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-500 z-10">
                            <ShoppingBag size={12} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-orange-600 uppercase">Pickup Location</p>
                            <p className="font-bold text-gray-800">{order.restaurant?.name || "The Restaurant"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{pickupAddress}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickupAddress)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2 hover:underline"
                            >
                                <ExternalLink size={10} /> Navigate to Restaurant
                            </a>
                        </div>
                    </div>

                    {/* Customer */}
                    <div className="relative">
                        <div className="absolute -left-8 top-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500 z-10">
                            <MapPin size={12} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-green-600 uppercase">Drop-off Point</p>
                            <p className="font-bold text-gray-800">Customer Location</p>
                            <p className="text-xs text-gray-500 mt-0.5">{dropoffAddress}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dropoffAddress)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2 hover:underline"
                            >
                                <ExternalLink size={10} /> Navigate to Customer
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tracking Visual */}
                <div className="mt-4 pt-4 border-t">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Navigation size={20} className="text-blue-600 rotate-45" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">Estimated Distance</p>
                            <p className="font-bold text-gray-800">Calculating route...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryMap;
