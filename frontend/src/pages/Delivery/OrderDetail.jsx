import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    User,
    ShoppingBag,
    Clock,
    CheckCircle,
    Truck,
    Loader2,
    ChevronLeft,
    Key,
    ArrowRight,
    Zap
} from "lucide-react";
import Header from "@/components/Header";
import DeliveryLayout from "@/components/delivery/DeliveryLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useDelivery } from "@/context/DeliveryContext";
import { toast } from "react-hot-toast";
import Skeleton from "@/components/ui/Skeleton";
import DeliveryMap from "@/components/delivery/DeliveryMap";

const DeliveryOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        getOrderDetails,
        updateDeliveryStatus,
        verifyDeliveryOtp,
        acceptOrder
    } = useDelivery();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [otp, setOtp] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const data = await getOrderDetails(id);
            setOrder(data);
        } catch (err) {
            toast.error("Failed to load order details");
            navigate("/delivery/orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        const tid = toast.loading(`Updating to ${newStatus}...`);
        setIsUpdating(true);
        try {
            await updateDeliveryStatus(id, newStatus);
            toast.success("Status updated!", { id: tid });
            fetchDetails();
        } catch (err) {
            toast.error("Failed to update status", { id: tid });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAcceptOrder = async () => {
        const tid = toast.loading("Accepting order...");
        setIsUpdating(true);
        try {
            await acceptOrder(id);
            toast.success("Order Accepted!", { id: tid });
            fetchDetails();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to accept order", { id: tid });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) return toast.error("Please enter a valid OTP");

        const tid = toast.loading("Verifying OTP...");
        setIsUpdating(true);
        try {
            await verifyDeliveryOtp(id, otp);
            toast.success("Delivery Confirmed!", { id: tid });
            fetchDetails();
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP", { id: tid });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading && !order) {
        return (
            <DeliveryLayout title="Order Details">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-4">
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                    <Skeleton className="h-16 w-full rounded-lg" />
                                </div>
                                <div className="pt-4 border-t flex justify-between">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                        <Skeleton className="h-64 w-full rounded-2xl" />
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-40 mb-4" />
                                <Skeleton className="h-32 w-full rounded-xl" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-16 w-full rounded-xl" />
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DeliveryLayout>
        );
    }

    const statusFlow = {
        packed: { next: "out for delivery", label: "Pick Up Package" },
        "out for delivery": { next: "delivered", label: "Arrived at Location" },
    };

    const currentStep = statusFlow[order.status];

    return (
        <DeliveryLayout title={`Order #${order._id.slice(-6)}`}>
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/delivery/orders")}
                    className="p-2 hover:bg-white rounded-full transition"
                >
                    <ChevronLeft size={24} />
                </button>
                <Header title={`Order Details`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShoppingBag className="text-orange-600" size={20} />
                                Order Items
                            </h3>
                            <div className="space-y-4">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center font-bold text-orange-600">
                                                {item.qty}x
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-400">₹{item.price}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold">₹{item.price * item.qty}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t flex justify-between items-center text-xl font-bold">
                                <span>Total Amount</span>
                                <span className="text-orange-600">₹{order.total}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Map */}
                    <DeliveryMap order={order} />

                    {/* Customer Address Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-orange-600" size={20} />
                                Delivery Address
                            </h3>
                            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                <p className="font-semibold text-gray-900 mb-1">{order.deliveryAddress?.street}</p>
                                <p className="text-gray-600">
                                    {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        `${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm mt-4 hover:underline"
                                >
                                    <MapPin size={16} /> Open in Google Maps
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Actions & Status */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase tracking-widest text-xs">
                                Current Status
                            </h3>
                            <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Order is</p>
                                    <p className="font-bold text-orange-600 capitalize">{order.status}</p>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            {order.status === "delivered" ? (
                                <div className="text-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex flex-col items-center gap-2">
                                    <CheckCircle size={32} />
                                    <p className="font-bold text-lg">Delivery Completed</p>
                                </div>
                            ) : !order.deliveryAssignedTo ? (
                                <button
                                    onClick={handleAcceptOrder}
                                    disabled={isUpdating}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-100 hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : <><Zap size={20} fill="currentColor" /> Accept This Order</>}
                                </button>
                            ) : currentStep && currentStep.next !== "delivered" ? (
                                <button
                                    onClick={() => handleStatusUpdate(currentStep.next)}
                                    disabled={isUpdating}
                                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin mx-auto" /> : currentStep.label}
                                </button>
                            ) : order.status === "out for delivery" ? (
                                <div className="space-y-4">
                                    {!order.deliveryOtpVerified ? (
                                        <>
                                            <p className="text-sm text-gray-500 font-medium text-center">
                                                Verify the Delivery OTP from the customer.
                                            </p>
                                            <form onSubmit={handleOtpVerify} className="space-y-3">
                                                <div className="relative">
                                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input
                                                        type="text"
                                                        placeholder="Enter 6-digit OTP"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        maxLength={6}
                                                        className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:border-orange-600 outline-none text-xl tracking-[0.5em] font-bold text-center"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={isUpdating}
                                                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-700 transition disabled:opacity-50"
                                                >
                                                    {isUpdating ? <Loader2 className="animate-spin mx-auto" /> : "Verify OTP"}
                                                </button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                                <p className="text-green-700 font-bold flex items-center justify-center gap-2">
                                                    <CheckCircle size={18} /> OTP Verified Successfully!
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleStatusUpdate("delivered")}
                                                disabled={isUpdating}
                                                className="w-full bg-green-600 text-white py-5 rounded-xl font-extrabold text-xl shadow-xl shadow-green-100 hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin" /> : "COMPLETE DELIVERY ✅"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center text-sm font-medium">
                                    Waiting for more updates...
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Contact Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 uppercase tracking-widest text-xs">
                                Customer Contact
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{order.user?.name || "Customer"}</p>
                                    <a
                                        href={`tel:${order.deliveryAddress?.phone || order.user?.phone}`}
                                        className="flex items-center gap-2 text-orange-600 font-bold text-sm mt-1 hover:underline"
                                    >
                                        <Phone size={14} /> {order.deliveryAddress?.phone || order.user?.phone || "No phone"}
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DeliveryLayout>
    );
};

export default DeliveryOrderDetail;
