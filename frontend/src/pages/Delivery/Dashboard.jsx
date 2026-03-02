import React, { useEffect } from "react";
import { ShoppingBag, CheckCircle, Clock, Truck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import DeliveryLayout from "@/components/delivery/DeliveryLayout";
import { useDelivery } from "@/context/DeliveryContext";
import { Switch } from "@/components/ui/Switch";
import { toast } from "react-hot-toast";
import Skeleton from "@/components/ui/Skeleton";
import { DollarSign, Zap, ArrowRight, Package as PackageIcon } from "lucide-react";

const DeliveryDashboard = () => {
    const {
        stats,
        loading,
        fetchDeliveryStats,
        isAvailable,
        toggleDutyStatus,
        availableOrders,
        fetchAvailableOrders,
        acceptOrder,
        setAvailableOrders
    } = useDelivery();

    useEffect(() => {
        fetchDeliveryStats();
        fetchAvailableOrders();

        const handleNewOrder = (e) => {
            setAvailableOrders(prev => [e.detail, ...prev]);
        };
        const handleOrderClaimed = (e) => {
            setAvailableOrders(prev => prev.filter(o => o._id !== e.detail.orderId));
        };

        window.addEventListener('newOrderAvailable', handleNewOrder);
        window.addEventListener('orderClaimed', handleOrderClaimed);

        return () => {
            window.removeEventListener('newOrderAvailable', handleNewOrder);
            window.removeEventListener('orderClaimed', handleOrderClaimed);
        };
    }, []);

    const handleAcceptOrder = async (id) => {
        try {
            await acceptOrder(id);
            toast.success("Order Accepted! Check your 'Orders' tab.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to accept order");
        }
    };

    const handleToggleDuty = async () => {
        try {
            const status = await toggleDutyStatus();
            toast.success(status ? "You are now ONLINE 🟢" : "You are now OFFLINE 🔴");
        } catch (err) {
            toast.error("Failed to change status");
        }
    };

    if (loading && !stats) {
        return (
            <DeliveryLayout title="Delivery Dashboard">
                <Header title="Delivery Dashboard" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardContent className="flex items-center gap-4 p-6">
                                <Skeleton className="h-14 w-14 rounded-2xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </DeliveryLayout>
        );
    }

    const overall = stats?.overall || {};
    const today = stats?.today || {};

    return (
        <DeliveryLayout title="Delivery Dashboard">
            <Header title="Delivery Dashboard" />

            {/* DUTY STATUS & QUICK STATS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isAvailable ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                        <Zap size={24} fill={isAvailable ? "currentColor" : "none"} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Duty Status</h3>
                        <p className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                            {isAvailable ? 'Currently Online & Accepting Orders' : 'Currently Offline'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border">
                    <span className="text-sm font-bold text-gray-600">OFFLINE</span>
                    <Switch checked={isAvailable} onCheckedChange={handleToggleDuty} />
                    <span className="text-sm font-bold text-green-600">ONLINE</span>
                </div>
            </div>

            {/* MARKETPLACE / AVAILABLE ORDERS */}
            {isAvailable && availableOrders.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Marketplace (Ready for Pickup)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableOrders.map(order => (
                            <Card key={order._id} className="border-orange-200 bg-orange-50/30 overflow-hidden group">
                                <CardContent className="p-5 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">{order.restaurant?.name || "Restaurant"}</p>
                                        <p className="text-lg font-black text-gray-900">₹{order.total}</p>
                                        <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">
                                            {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleAcceptOrder(order._id)}
                                        className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 transition shadow-lg shadow-orange-200 active:scale-95 flex items-center gap-2"
                                    >
                                        Accept <ArrowRight size={16} />
                                    </button>
                                </CardContent>
                                <div className="h-1 bg-orange-100 w-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-1/3 group-hover:w-full transition-all duration-1000"></div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={ShoppingBag}
                    label="Total Deliveries"
                    value={overall.totalDeliveries || 0}
                    subValue={`Today: ${today.total || 0}`}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Earnings"
                    value={`₹${overall.totalEarnings || 0}`}
                    subValue={`Today: ₹${today.earnings || 0}`}
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    icon={Clock}
                    label="Pending Tasks"
                    value={overall.pendingDeliveries || 0}
                    subValue="Awaiting Action"
                    color="bg-yellow-50 text-yellow-600"
                />
            </div>

            {/* QUICK INFO / ACTION BOX */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Ready to Deliver?</h2>
                    <p className="text-gray-500 mt-1">
                        Check your assigned orders and start your journey.
                    </p>
                </div>
                <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200">
                    Go to Orders
                </button>
            </div>
        </DeliveryLayout>
    );
};

const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
    <Card className="hover:shadow-md transition-shadow cursor-default">
        <CardContent className="flex items-center gap-4 p-6">
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black text-gray-900 mt-0.5">{value}</p>
                {subValue && <p className="text-xs text-gray-500 mt-1 font-medium">{subValue}</p>}
            </div>
        </CardContent>
    </Card>
);

export default DeliveryDashboard;
