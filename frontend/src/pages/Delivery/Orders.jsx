import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, MapPin, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import DeliveryLayout from "@/components/delivery/DeliveryLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useDelivery } from "@/context/DeliveryContext";
import Skeleton from "@/components/ui/Skeleton";

const DeliveryOrders = () => {
    const { orders, loading, fetchAssignedOrders } = useDelivery();

    useEffect(() => {
        fetchAssignedOrders();
    }, []);

    if (loading && orders.length === 0) {
        return (
            <DeliveryLayout title="My Deliveries">
                <Header title="My Deliveries" />
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="bg-orange-50 p-4 flex gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 border-t flex gap-4 items-center">
                            <Skeleton className="h-6 w-24" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                    ))}
                </div>
            </DeliveryLayout>
        );
    }

    return (
        <DeliveryLayout title="My Deliveries">
            <Header title="My Deliveries" />

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-orange-50 text-orange-600 border-b">
                            <tr>
                                <th className="p-4 font-bold text-sm">Order ID</th>
                                <th className="p-4 font-bold text-sm">Customer</th>
                                <th className="p-4 font-bold text-sm">Address</th>
                                <th className="p-4 font-bold text-sm">Status</th>
                                <th className="p-4 font-bold text-sm text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Clock size={40} className="text-gray-300" />
                                            <p>No deliveries assigned yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-orange-50/30 transition">
                                        <td className="p-4 font-semibold text-gray-700">
                                            #{order._id?.slice(-6) || "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{order.user?.name || "Customer"}</div>
                                            <div className="text-xs text-gray-400">{order.user?.phone || "No phone"}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MapPin size={14} className="text-orange-500 mt-1 shrink-0" />
                                                <span className="text-sm text-gray-600 line-clamp-2">
                                                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <DeliveryStatusBadge status={order.status} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <Link
                                                    to={`/delivery/orders/${order._id}`}
                                                    className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition"
                                                >
                                                    <Eye size={20} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </DeliveryLayout>
    );
};

export const DeliveryStatusBadge = ({ status }) => {
    const styles = {
        placed: "bg-blue-100 text-blue-700",
        packed: "bg-cyan-100 text-cyan-700",
        "out for delivery": "bg-purple-100 text-purple-700",
        delivered: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const normalizedStatus = status?.toLowerCase() || "unknown";

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[normalizedStatus] || "bg-gray-100 text-gray-600"}`}>
            {normalizedStatus}
        </span>
    );
};

export default DeliveryOrders;
